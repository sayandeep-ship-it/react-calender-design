import { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import CallEndRoundedIcon from '@mui/icons-material/CallEndRounded'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import MicOffRoundedIcon from '@mui/icons-material/MicOffRounded'
import MicRoundedIcon from '@mui/icons-material/MicRounded'
import VideocamOffRoundedIcon from '@mui/icons-material/VideocamOffRounded'
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import EventRoundedIcon from '@mui/icons-material/EventRounded'
import MedicalServicesRoundedIcon from '@mui/icons-material/MedicalServicesRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import { useParams, useSearchParams } from 'react-router-dom'

const API_PREFIX = 'http://localhost:3000/api'
const AGORA_SDK_URL = 'https://download.agora.io/sdk/release/AgoraRTC_N.js'

function PatientVideoCallPage() {
  const { meetingId } = useParams()
  const [searchParams] = useSearchParams()

  const [callState, setCallState] = useState('idle')
  const [sdkReady, setSdkReady] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [joinDetails, setJoinDetails] = useState(null)
  const [micMuted, setMicMuted] = useState(false)
  const [cameraMuted, setCameraMuted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [remoteParticipants, setRemoteParticipants] = useState([])

  const clientRef = useRef(null)
  const localTracksRef = useRef({ audioTrack: null, videoTrack: null })
  const joinedRef = useRef(false)

  const appointmentId = searchParams.get('appointment_id') || ''
  const patientName = searchParams.get('patient_name') || 'Patient'
  const clinicianName = searchParams.get('doctor_name') || searchParams.get('clinician_name') || 'Care Team'
  const scheduledDate = searchParams.get('date') || 'Scheduled appointment'
  const scheduledTime = searchParams.get('time') || 'Join during your booked slot'
  const role = searchParams.get('role') || 'patient'

  useEffect(() => {
    let active = true

    loadAgoraSdk()
      .then(() => {
        if (active) {
          setSdkReady(true)
        }
      })
      .catch((error) => {
        if (active) {
          setErrorMessage(error.message || 'Unable to load video calling library.')
          setCallState('error')
        }
      })

    return () => {
      active = false
      leaveSession()
    }
  }, [])

  const handleJoin = async () => {
    if (!appointmentId) {
      setCallState('error')
      setErrorMessage('This meeting link is incomplete. appointment_id is missing.')
      return
    }

    try {
      setCallState('preparing')
      setErrorMessage('')

      const uid = Date.now()
      const response = await apiRequest(`${API_PREFIX}/appointments/video/generate-token`, {
        method: 'POST',
        body: {
          appointment_id: Number(appointmentId),
          uid,
          role,
        },
      })

      const details = response?.data
      if (!details?.appId || !details?.channel || !details?.token) {
        throw new Error('Meeting credentials are incomplete.')
      }

      setJoinDetails(details)
      await joinAgoraRoom(details)
      setCallState('joined')
    } catch (error) {
      setCallState('error')
      setErrorMessage(error.message || 'Unable to join the meeting right now.')
    }
  }

  const joinAgoraRoom = async (details) => {
    if (!window.AgoraRTC) {
      throw new Error('Agora SDK is not available.')
    }

    await leaveSession()

    const client = window.AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
    clientRef.current = client

    client.on('user-published', async (user, mediaType) => {
      await client.subscribe(user, mediaType)

      setRemoteParticipants((current) => {
        const next = current.filter((item) => item.uid !== user.uid)
        return [...next, { uid: user.uid, mediaType }]
      })

      if (mediaType === 'video') {
        await waitForElement(`remote-player-${user.uid}`)
        user.videoTrack?.play(`remote-player-${user.uid}`)
      }

      if (mediaType === 'audio') {
        user.audioTrack?.play()
      }
    })

    client.on('user-unpublished', (user, mediaType) => {
      if (mediaType === 'video') {
        setRemoteParticipants((current) => current.filter((item) => item.uid !== user.uid))
      }
    })

    client.on('user-left', (user) => {
      setRemoteParticipants((current) => current.filter((item) => item.uid !== user.uid))
    })

    setCallState('joining')

    await client.join(details.appId, details.channel, details.token, details.uid)

    const [audioTrack, videoTrack] = await window.AgoraRTC.createMicrophoneAndCameraTracks()
    localTracksRef.current = { audioTrack, videoTrack }

    await waitForElement('local-player')
    videoTrack.play('local-player')
    await client.publish([audioTrack, videoTrack])

    joinedRef.current = true
    setMicMuted(false)
    setCameraMuted(false)
  }

  const leaveSession = async () => {
    const { audioTrack, videoTrack } = localTracksRef.current

    if (audioTrack) {
      audioTrack.stop()
      audioTrack.close()
    }

    if (videoTrack) {
      videoTrack.stop()
      videoTrack.close()
    }

    localTracksRef.current = { audioTrack: null, videoTrack: null }

    if (clientRef.current) {
      try {
        await clientRef.current.leave()
      } catch {
        // Keep cleanup resilient for repeated leave attempts.
      }
      clientRef.current.removeAllListeners()
      clientRef.current = null
    }

    joinedRef.current = false
    setRemoteParticipants([])
    setJoinDetails(null)
    setMicMuted(false)
    setCameraMuted(false)
    setCallState((current) => (current === 'error' ? current : 'idle'))
  }

  const handleLeave = async () => {
    await leaveSession()
  }

  const handleToggleMic = async () => {
    const nextMuted = !micMuted
    await localTracksRef.current.audioTrack?.setEnabled(!nextMuted)
    setMicMuted(nextMuted)
  }

  const handleToggleCamera = async () => {
    const nextMuted = !cameraMuted
    await localTracksRef.current.videoTrack?.setEnabled(!nextMuted)
    setCameraMuted(nextMuted)
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f3f7f5',
        backgroundImage:
          'radial-gradient(circle at top left, rgba(11,122,87,0.09), transparent 26%), linear-gradient(180deg, #f8fbfa 0%, #eef4f1 100%)',
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 5 },
      }}
    >
      <Stack spacing={3} sx={{ maxWidth: 1380, mx: 'auto' }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3.5 },
            borderRadius: 5,
            border: '1px solid #d8e6de',
            boxShadow: '0 24px 48px rgba(47, 67, 60, 0.08)',
            bgcolor: 'rgba(255,255,255,0.92)',
          }}
        >
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            justifyContent="space-between"
            spacing={2.5}
            alignItems={{ xs: 'flex-start', lg: 'center' }}
          >
            <Box>
              <Chip
                label="Video Consultation"
                sx={{
                  mb: 1.4,
                  bgcolor: '#e7f5ef',
                  color: '#0b7a57',
                  fontWeight: 700,
                  borderRadius: 999,
                }}
              />
              <Typography sx={{ fontSize: { xs: 28, md: 40 }, fontWeight: 700, color: '#20304b' }}>
                Join your appointment
              </Typography>
              <Typography sx={{ mt: 0.9, color: '#667873', maxWidth: 760 }}>
                Use this secure room to join your scheduled consultation. We’ll fetch a fresh meeting
                token when you enter, so the link can stay stable like a hosted appointment room.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.2} flexWrap="wrap" useFlexGap>
              <Button
                startIcon={<ContentCopyRoundedIcon />}
                onClick={handleCopyLink}
                variant="outlined"
                sx={secondaryButtonSx}
              >
                {copied ? 'Copied' : 'Copy link'}
              </Button>
              {!joinedRef.current ? (
                <Button
                  onClick={handleJoin}
                  variant="contained"
                  disabled={!sdkReady || callState === 'preparing' || callState === 'joining'}
                  sx={joinButtonSx}
                >
                  {callState === 'preparing' || callState === 'joining' ? 'Joining...' : 'Join now'}
                </Button>
              ) : (
                <Button
                  onClick={handleLeave}
                  startIcon={<CallEndRoundedIcon />}
                  variant="contained"
                  sx={leaveButtonSx}
                >
                  Leave call
                </Button>
              )}
            </Stack>
          </Stack>
        </Paper>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', xl: '360px minmax(0, 1fr)' },
            gap: 3,
          }}
        >
          <Stack spacing={3}>
            <Paper elevation={0} sx={infoCardSx}>
              <Typography sx={infoCardTitleSx}>Appointment details</Typography>
              <Stack spacing={1.4}>
                <InfoRow icon={<PersonRoundedIcon sx={{ fontSize: 18 }} />} label="Patient" value={patientName} />
                <InfoRow
                  icon={<MedicalServicesRoundedIcon sx={{ fontSize: 18 }} />}
                  label="Clinician"
                  value={clinicianName}
                />
                <InfoRow icon={<EventRoundedIcon sx={{ fontSize: 18 }} />} label="Date" value={scheduledDate} />
                <InfoRow icon={<CheckCircleRoundedIcon sx={{ fontSize: 18 }} />} label="Time" value={scheduledTime} />
              </Stack>
            </Paper>

            <Paper elevation={0} sx={infoCardSx}>
              <Typography sx={infoCardTitleSx}>Room status</Typography>
              <Stack spacing={1.2}>
                <StatusRow label="Meeting ID" value={meetingId || '--'} />
                <StatusRow label="Appointment ID" value={appointmentId || '--'} />
                <StatusRow label="SDK status" value={sdkReady ? 'Ready' : 'Loading'} />
                <StatusRow label="Call state" value={formatState(callState)} />
                <StatusRow
                  label="Channel"
                  value={joinDetails?.channel || 'Will be assigned after secure token fetch'}
                />
              </Stack>
            </Paper>

            <Paper elevation={0} sx={infoCardSx}>
              <Typography sx={infoCardTitleSx}>Before you join</Typography>
              <Stack spacing={1}>
                <Typography sx={bulletTextSx}>Allow camera and microphone access when your browser asks.</Typography>
                <Typography sx={bulletTextSx}>Join within your scheduled window so the backend can issue a fresh token.</Typography>
                <Typography sx={bulletTextSx}>If the room does not open, recheck the meeting link or appointment access.</Typography>
              </Stack>
            </Paper>
          </Stack>

          <Paper
            elevation={0}
            sx={{
              ...infoCardSx,
              p: { xs: 2, md: 2.5 },
              minHeight: 680,
            }}
          >
            <Stack spacing={2.2} sx={{ height: '100%' }}>
              {(errorMessage || (!appointmentId && callState !== 'joined')) && (
                <Alert severity="warning" sx={{ borderRadius: 3 }}>
                  {errorMessage || 'This meeting link is missing appointment information.'}
                </Alert>
              )}

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 260px' },
                  gap: 2,
                  flex: 1,
                  minHeight: 0,
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    border: '1px solid #dfe8e3',
                    bgcolor: '#f9fcfa',
                    p: 1.5,
                    minHeight: 500,
                  }}
                >
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                      gap: 1.5,
                      height: '100%',
                    }}
                  >
                    <VideoTile
                      id="local-player"
                      title="You"
                      subtitle={patientName}
                      active={joinedRef.current && !cameraMuted}
                    />

                    {remoteParticipants.length > 0 ? (
                      remoteParticipants.map((participant) => (
                        <VideoTile
                          key={participant.uid}
                          id={`remote-player-${participant.uid}`}
                          title="Clinician"
                          subtitle={`Remote user ${participant.uid}`}
                          active
                        />
                      ))
                    ) : (
                      <EmptyRemoteTile />
                    )}
                  </Box>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    border: '1px solid #dfe8e3',
                    bgcolor: '#ffffff',
                    p: 1.6,
                  }}
                >
                  <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#1f2a4a' }}>
                    Call controls
                  </Typography>
                  <Typography sx={{ mt: 0.5, fontSize: 12.5, color: '#73837d' }}>
                    Basic patient controls for a hosted consultation room.
                  </Typography>

                  <Stack direction="row" spacing={1.2} sx={{ mt: 2 }}>
                    <RoundControlButton
                      active={!micMuted}
                      disabled={!joinedRef.current}
                      icon={micMuted ? <MicOffRoundedIcon /> : <MicRoundedIcon />}
                      onClick={handleToggleMic}
                      label={micMuted ? 'Unmute' : 'Mute'}
                    />
                    <RoundControlButton
                      active={!cameraMuted}
                      disabled={!joinedRef.current}
                      icon={cameraMuted ? <VideocamOffRoundedIcon /> : <VideocamRoundedIcon />}
                      onClick={handleToggleCamera}
                      label={cameraMuted ? 'Camera off' : 'Camera on'}
                    />
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Stack spacing={1.2}>
                    <StatusPill
                      label="Audio"
                      value={!joinedRef.current ? 'Waiting' : micMuted ? 'Muted' : 'Live'}
                      tone={!joinedRef.current ? 'neutral' : micMuted ? 'warning' : 'success'}
                    />
                    <StatusPill
                      label="Video"
                      value={!joinedRef.current ? 'Waiting' : cameraMuted ? 'Off' : 'Live'}
                      tone={!joinedRef.current ? 'neutral' : cameraMuted ? 'warning' : 'success'}
                    />
                    <StatusPill
                      label="Participants"
                      value={joinedRef.current ? `${1 + remoteParticipants.length}` : '0'}
                      tone="neutral"
                    />
                  </Stack>
                </Paper>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Stack>
    </Box>
  )
}

function VideoTile({ id, title, subtitle, active }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.1,
        borderRadius: 3.5,
        border: '1px solid #dfe8e3',
        bgcolor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        minHeight: 220,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
        <Box>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#1f2a4a' }}>{title}</Typography>
          <Typography sx={{ fontSize: 12, color: '#75857f' }}>{subtitle}</Typography>
        </Box>
        <Chip
          label={active ? 'Live' : 'Waiting'}
          size="small"
          sx={{
            bgcolor: active ? '#e7f5ef' : '#f0f3f1',
            color: active ? '#0b7a57' : '#6d7d77',
            fontWeight: 700,
          }}
        />
      </Stack>

      <Box
        id={id}
        sx={{
          flex: 1,
          minHeight: 190,
          borderRadius: 3,
          bgcolor: active ? '#dce8e2' : '#eff4f1',
          overflow: 'hidden',
          position: 'relative',
          '& video': {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          },
        }}
      />
    </Paper>
  )
}

function EmptyRemoteTile() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.1,
        borderRadius: 3.5,
        border: '1px solid #dfe8e3',
        bgcolor: '#ffffff',
        minHeight: 220,
      }}
    >
      <Stack justifyContent="center" alignItems="center" spacing={1.6} sx={{ height: '100%' }}>
        <Avatar sx={{ width: 58, height: 58, bgcolor: '#ecf3ef', color: '#6d7d77' }}>
          <MedicalServicesRoundedIcon />
        </Avatar>
        <Typography sx={{ fontSize: 17, fontWeight: 700, color: '#1f2a4a' }}>
          Waiting for clinician
        </Typography>
        <Typography sx={{ maxWidth: 280, textAlign: 'center', fontSize: 13, color: '#71817a' }}>
          The remote participant video will appear here after they join and publish their stream.
        </Typography>
      </Stack>
    </Paper>
  )
}

function InfoRow({ icon, label, value }) {
  return (
    <Stack direction="row" spacing={1.2} alignItems="center">
      <Avatar sx={{ width: 34, height: 34, bgcolor: '#eef6f2', color: '#0b7a57' }}>{icon}</Avatar>
      <Box>
        <Typography sx={{ fontSize: 12, color: '#72827c' }}>{label}</Typography>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#20304b' }}>{value}</Typography>
      </Box>
    </Stack>
  )
}

function StatusRow({ label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={2}>
      <Typography sx={{ fontSize: 13, color: '#70807a' }}>{label}</Typography>
      <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#22332e', textAlign: 'right' }}>
        {value}
      </Typography>
    </Stack>
  )
}

function RoundControlButton({ icon, onClick, active, disabled, label }) {
  return (
    <Stack spacing={0.8} alignItems="center">
      <IconButton
        onClick={onClick}
        disabled={disabled}
        sx={{
          width: 58,
          height: 58,
          border: '1px solid',
          borderColor: active ? '#cfe2d8' : '#f0d6d6',
          bgcolor: active ? '#eef8f3' : '#fff1f1',
          color: active ? '#0b7a57' : '#d04949',
          '&:hover': {
            bgcolor: active ? '#e4f4ec' : '#ffe7e7',
          },
        }}
      >
        {icon}
      </IconButton>
      <Typography sx={{ fontSize: 11.5, color: '#667873' }}>{label}</Typography>
    </Stack>
  )
}

function StatusPill({ label, value, tone }) {
  const toneMap = {
    success: { bg: '#e7f5ef', color: '#0b7a57' },
    warning: { bg: '#fff4e4', color: '#bf7b0c' },
    neutral: { bg: '#eff3f1', color: '#5e716b' },
  }

  const palette = toneMap[tone] || toneMap.neutral

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.1,
        borderRadius: 2.5,
        border: '1px solid #e2ebe6',
        bgcolor: '#fcfefd',
      }}
    >
      <Stack direction="row" justifyContent="space-between" spacing={1.5}>
        <Typography sx={{ fontSize: 12.5, color: '#73837d' }}>{label}</Typography>
        <Chip
          label={value}
          size="small"
          sx={{
            bgcolor: palette.bg,
            color: palette.color,
            fontWeight: 700,
          }}
        />
      </Stack>
    </Paper>
  )
}

async function apiRequest(url, options = {}) {
  const serializedBody =
    options.body && typeof options.body !== 'string'
      ? JSON.stringify(options.body)
      : options.body

  const headers = {
    ...(serializedBody ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
  }

  const response = await fetch(url, {
    ...options,
    body: serializedBody,
    headers,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.success === false || data.status === false) {
    throw new Error(data.message || data.error || 'Request failed')
  }

  return data
}

function loadAgoraSdk() {
  if (window.AgoraRTC) {
    return Promise.resolve(window.AgoraRTC)
  }

  const existingScript = document.querySelector(`script[src="${AGORA_SDK_URL}"]`)

  if (existingScript) {
    return new Promise((resolve, reject) => {
      existingScript.addEventListener('load', () => resolve(window.AgoraRTC), { once: true })
      existingScript.addEventListener('error', () => reject(new Error('Unable to load Agora SDK.')), {
        once: true,
      })
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = AGORA_SDK_URL
    script.async = true
    script.onload = () => resolve(window.AgoraRTC)
    script.onerror = () => reject(new Error('Unable to load Agora SDK.'))
    document.body.appendChild(script)
  })
}

function waitForElement(id, attempts = 20) {
  return new Promise((resolve, reject) => {
    let remaining = attempts

    const check = () => {
      const element = document.getElementById(id)
      if (element) {
        resolve(element)
        return
      }

      remaining -= 1
      if (remaining <= 0) {
        reject(new Error(`Missing video container: ${id}`))
        return
      }

      window.requestAnimationFrame(check)
    }

    check()
  })
}

function formatState(state) {
  if (!state) return '--'
  return state.charAt(0).toUpperCase() + state.slice(1)
}

const infoCardSx = {
  p: { xs: 2, md: 2.4 },
  borderRadius: 4,
  border: '1px solid #dbe6e0',
  boxShadow: '0 18px 36px rgba(61, 93, 82, 0.05)',
  bgcolor: 'rgba(255,255,255,0.92)',
}

const infoCardTitleSx = {
  mb: 1.6,
  fontSize: 18,
  fontWeight: 700,
  color: '#1f2a4a',
}

const bulletTextSx = {
  fontSize: 13.5,
  color: '#677872',
}

const secondaryButtonSx = {
  textTransform: 'none',
  borderRadius: 999,
  borderColor: '#d3dfd8',
  color: '#21304b',
  px: 2.2,
}

const joinButtonSx = {
  textTransform: 'none',
  borderRadius: 999,
  bgcolor: '#0b7a57',
  px: 3,
  '&:hover': { bgcolor: '#096649' },
}

const leaveButtonSx = {
  textTransform: 'none',
  borderRadius: 999,
  bgcolor: '#cf4747',
  px: 3,
  '&:hover': { bgcolor: '#b83e3e' },
}

export default PatientVideoCallPage
