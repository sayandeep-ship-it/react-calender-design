import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded'
import FolderSharedRoundedIcon from '@mui/icons-material/FolderSharedRounded'
import HealthAndSafetyRoundedIcon from '@mui/icons-material/HealthAndSafetyRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import PlaylistAddCheckCircleRoundedIcon from '@mui/icons-material/PlaylistAddCheckCircleRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'
import { Link } from 'react-router-dom'

const API_BASE_URL = 'https://dev-api.openarogya.icrmonline.co.uk/api'
const PATIENT_BEARER_TOKEN =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZ2xvYmFsX3BhdGllbnRfdWlkIjoiUEFULTE3NzgyMjQzMTI4MzItQTkxMTY2NzMiLCJlbWFpbCI6InNheWFuZGVlcEB0ZWNobm9leHBvbmVudC5jby5pbiIsIm1vYmlsZSI6IjgyNDA3MTg2NTIiLCJ0ZW5hbnRfc2NoZW1hIjpbInRlbmFudF9Bcm9neWEgSGVhbHRoIE9yZ2FuaXNhdGlvbl8xNjIiXSwidHlwZSI6InBhdGllbnQiLCJpYXQiOjE3NzgzOTA0MjcsImV4cCI6MTc3ODk5NTIyN30.q2YnWXfeFenXeifYMD3OG81FDdwTDjxaaRwlx-VSafc'
const PROFILE_API_URL = `${API_BASE_URL}/patient/profile`
const PASSWORD_API_URL = `${API_BASE_URL}/patient/profile/change-password`
const MEDICAL_FILES_API_URL = `${API_BASE_URL}/patient/profile/medical-files`

const sidebarItems = [
  { key: 'dashboard', label: 'Dashboard', icon: <HomeRoundedIcon fontSize="small" />, to: '/patient-portal-dashboard' },
  { key: 'appointments', label: 'Appointments', icon: <EventNoteRoundedIcon fontSize="small" />, to: '/patient-portal-dashboard' },
  { key: 'careplans', label: 'Care Plans', icon: <PlaylistAddCheckCircleRoundedIcon fontSize="small" />, to: '/patient-portal-dashboard' },
  { key: 'locations', label: 'Locations', icon: <LocationOnRoundedIcon fontSize="small" />, to: '/patient-portal-dashboard' },
  { key: 'profile', label: 'My Profile', icon: <PersonRoundedIcon fontSize="small" />, to: '/patient-portal-profile' },
]

const emptyProfile = {
  id: null,
  global_patient_uid: '',
  full_name: '',
  email: '',
  mobile: '',
  dob: '',
  gender: '',
  avatar: '',
  status: 'invited',
  email_verified: false,
  mobile_verified: false,
  login_method: '',
  source: '',
  last_login_at: '',
  metadata: {},
}

const emptyProfileForm = {
  full_name: '',
  mobile: '',
  dob: '',
  gender: '',
  avatar: '',
  blood_group: '',
  allergies: '',
  chronic_conditions: '',
  emergency_contact_name: '',
  emergency_contact_relationship: '',
  emergency_contact_mobile: '',
  insurance_provider: '',
  insurance_policy_number: '',
  insurance_valid_till: '',
}

const emptyPasswordForm = {
  current_password: '',
  new_password: '',
  confirm_password: '',
}

const emptyUploadForm = {
  title: '',
  category: 'other',
  notes: '',
}

const categoryPalette = {
  prescription: '#0b7a57',
  lab_report: '#1570ef',
  scan: '#8e5cf7',
  discharge_summary: '#f79009',
  insurance: '#b54708',
  other: '#516778',
}

function PatientPortalProfilePage() {
  const [profile, setProfile] = useState(emptyProfile)
  const [profileForm, setProfileForm] = useState(emptyProfileForm)
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm)
  const [uploadForm, setUploadForm] = useState(emptyUploadForm)
  const [medicalFiles, setMedicalFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [deletingFileId, setDeletingFileId] = useState(null)
  const [error, setError] = useState('')
  const [banner, setBanner] = useState({ type: 'success', message: '' })
  const fileInputRef = useRef(null)

  useEffect(() => {
    let ignore = false

    async function boot() {
      try {
        setLoading(true)
        setError('')

        const [profileData, fileData] = await Promise.all([
          fetchProfile(),
          fetchMedicalFiles(),
        ])

        if (!ignore) {
          hydrateProfile(profileData)
          setMedicalFiles(fileData)
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message || 'Failed to load patient profile')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    boot()

    return () => {
      ignore = true
    }
  }, [])

  const groupedFiles = useMemo(() => {
    const groups = medicalFiles.reduce((acc, file) => {
      const category = file.category || 'other'

      if (!acc[category]) {
        acc[category] = []
      }

      acc[category].push(file)
      return acc
    }, {})

    return Object.entries(groups).map(([category, items]) => ({
      category,
      title: categoryLabel(category),
      accent: categoryPalette[category] || categoryPalette.other,
      items,
    }))
  }, [medicalFiles])

  const accountHealthValue = useMemo(() => {
    let score = 35

    if (profile.email_verified) score += 15
    if (profile.mobile_verified) score += 15
    if (profileForm.emergency_contact_name) score += 10
    if (profileForm.insurance_provider) score += 10
    if (medicalFiles.length) score += 15

    return Math.min(score, 100)
  }, [medicalFiles.length, profile.email_verified, profile.mobile_verified, profileForm.emergency_contact_name, profileForm.insurance_provider])

  const profileInitials = useMemo(() => {
    return (profile.full_name || 'Patient')
      .split(' ')
      .map((part) => part[0] || '')
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }, [profile.full_name])

  async function fetchProfile() {
    const response = await fetch(PROFILE_API_URL, {
      headers: authHeaders(),
    })

    const payload = await response.json()

    if (!response.ok || payload?.status === false || payload?.success === false) {
      throw new Error(payload?.message || payload?.error || 'Failed to load profile')
    }

    return payload?.data || {}
  }

  async function fetchMedicalFiles() {
    const response = await fetch(MEDICAL_FILES_API_URL, {
      headers: authHeaders(),
    })

    const payload = await response.json()

    if (!response.ok || payload?.status === false || payload?.success === false) {
      throw new Error(payload?.message || payload?.error || 'Failed to load medical files')
    }

    return Array.isArray(payload?.data) ? payload.data : []
  }

  function hydrateProfile(rawProfile) {
    const normalized = normalizeProfile(rawProfile)
    const metadata = normalized.metadata || {}
    const emergencyContact = metadata.emergency_contact || {}
    const insurance = metadata.insurance || {}

    setProfile(normalized)
    setProfileForm({
      full_name: normalized.full_name || '',
      mobile: normalized.mobile || '',
      dob: normalized.dob || '',
      gender: normalized.gender || '',
      avatar: normalized.avatar || '',
      blood_group: metadata.blood_group || '',
      allergies: arrayToTextarea(metadata.allergies),
      chronic_conditions: arrayToTextarea(metadata.chronic_conditions),
      emergency_contact_name: emergencyContact.name || '',
      emergency_contact_relationship: emergencyContact.relationship || '',
      emergency_contact_mobile: emergencyContact.mobile || '',
      insurance_provider: insurance.provider || '',
      insurance_policy_number: insurance.policy_number || '',
      insurance_valid_till: insurance.valid_till || '',
    })
  }

  async function refreshAll() {
    try {
      setRefreshing(true)
      setError('')
      const [profileData, fileData] = await Promise.all([fetchProfile(), fetchMedicalFiles()])
      hydrateProfile(profileData)
      setMedicalFiles(fileData)
      setBanner({ type: 'success', message: 'Profile refreshed from the latest API response.' })
    } catch (refreshError) {
      setError(refreshError.message || 'Failed to refresh profile')
    } finally {
      setRefreshing(false)
    }
  }

  async function handleSaveProfile(event) {
    event.preventDefault()

    try {
      setSavingProfile(true)
      setError('')

      const metadata = {
        ...(profile.metadata || {}),
        blood_group: profileForm.blood_group || null,
        allergies: textareaToArray(profileForm.allergies),
        chronic_conditions: textareaToArray(profileForm.chronic_conditions),
        emergency_contact: {
          name: profileForm.emergency_contact_name || null,
          relationship: profileForm.emergency_contact_relationship || null,
          mobile: profileForm.emergency_contact_mobile || null,
        },
        insurance: {
          provider: profileForm.insurance_provider || null,
          policy_number: profileForm.insurance_policy_number || null,
          valid_till: profileForm.insurance_valid_till || null,
        },
      }

      const response = await fetch(PROFILE_API_URL, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
          full_name: profileForm.full_name,
          mobile: profileForm.mobile,
          dob: profileForm.dob || null,
          gender: profileForm.gender || null,
          avatar: profileForm.avatar || null,
          metadata,
        }),
      })

      const payload = await response.json()

      if (!response.ok || payload?.status === false || payload?.success === false) {
        throw new Error(payload?.message || payload?.error || 'Failed to update profile')
      }

      const nextProfile = payload?.data || {
        ...profile,
        full_name: profileForm.full_name,
        mobile: profileForm.mobile,
        dob: profileForm.dob,
        gender: profileForm.gender,
        avatar: profileForm.avatar,
        metadata,
      }

      hydrateProfile(nextProfile)
      setBanner({ type: 'success', message: 'Profile details updated successfully.' })
    } catch (saveError) {
      setError(saveError.message || 'Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  async function handleChangePassword(event) {
    event.preventDefault()

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setError('New password and confirm password do not match.')
      return
    }

    try {
      setChangingPassword(true)
      setError('')

      const response = await fetch(PASSWORD_API_URL, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(passwordForm),
      })

      const payload = await response.json()

      if (!response.ok || payload?.status === false || payload?.success === false) {
        throw new Error(payload?.message || payload?.error || 'Failed to change password')
      }

      setPasswordForm(emptyPasswordForm)
      setBanner({ type: 'success', message: payload?.message || 'Password changed successfully.' })
    } catch (passwordError) {
      setError(passwordError.message || 'Failed to change password')
    } finally {
      setChangingPassword(false)
    }
  }

  async function handleUploadFile(event) {
    event.preventDefault()

    if (!selectedFile) {
      setError('Please choose a medical file to upload.')
      return
    }

    if (!uploadForm.title.trim()) {
      setError('Please enter a title for the medical file.')
      return
    }

    try {
      setUploadingFile(true)
      setError('')

      const formData = new FormData()
      formData.append('title', uploadForm.title.trim())
      formData.append('category', uploadForm.category)
      formData.append('notes', uploadForm.notes.trim())
      formData.append('file', selectedFile)

      const response = await fetch(MEDICAL_FILES_API_URL, {
        method: 'POST',
        headers: {
          Authorization: PATIENT_BEARER_TOKEN,
        },
        body: formData,
      })

      const payload = await response.json()

      if (!response.ok || payload?.status === false || payload?.success === false) {
        throw new Error(payload?.message || payload?.error || 'Failed to upload file')
      }

      const createdFile = normalizeMedicalFile(payload?.data || {})
      setMedicalFiles((current) => [createdFile, ...current])
      setUploadForm(emptyUploadForm)
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      setBanner({ type: 'success', message: 'Medical file uploaded successfully.' })
    } catch (uploadError) {
      setError(uploadError.message || 'Failed to upload medical file')
    } finally {
      setUploadingFile(false)
    }
  }

  async function handleDeleteFile(fileId) {
    try {
      setDeletingFileId(fileId)
      setError('')

      const response = await fetch(`${MEDICAL_FILES_API_URL}/${fileId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      })

      const payload = await response.json()

      if (!response.ok || payload?.status === false || payload?.success === false) {
        throw new Error(payload?.message || payload?.error || 'Failed to delete file')
      }

      setMedicalFiles((current) => current.filter((item) => String(item.id) !== String(fileId)))
      setBanner({ type: 'success', message: 'Medical file removed successfully.' })
    } catch (deleteError) {
      setError(deleteError.message || 'Failed to delete medical file')
    } finally {
      setDeletingFileId(null)
    }
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#494949', p: { xs: 1.5, md: 3 } }}>
        <Typography sx={{ color: '#dfdfdf', fontSize: 14, mb: 1 }}>Patient Details</Typography>
        <Paper
          elevation={0}
          sx={{
            minHeight: 'calc(100vh - 90px)',
            borderRadius: 0,
            display: 'grid',
            placeItems: 'center',
            bgcolor: '#eef3f1',
          }}
        >
          <Stack spacing={2} alignItems="center">
            <CircularProgress sx={{ color: '#0b7a57' }} />
            <Typography sx={{ color: '#496760' }}>Loading patient profile...</Typography>
          </Stack>
        </Paper>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#494949', p: { xs: 1.5, md: 3 } }}>
      <Typography sx={{ color: '#dfdfdf', fontSize: 14, mb: 1 }}>Patient Details</Typography>

      <Paper
        elevation={0}
        sx={{
          minHeight: 'calc(100vh - 90px)',
          overflow: 'hidden',
          borderRadius: 0,
          display: 'flex',
          bgcolor: '#eef3f1',
        }}
      >
        <Box
          sx={{
            width: { xs: 92, md: 250 },
            bgcolor: '#0b7a57',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            px: { xs: 1.2, md: 2.1 },
            py: 2,
          }}
        >
          <Box
            sx={{
              px: { xs: 0.8, md: 1.2 },
              py: 1.5,
              borderBottom: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.9)',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 800,
                  fontSize: 15,
                }}
              >
                C
              </Box>
              <Typography sx={{ display: { xs: 'none', md: 'block' }, fontSize: 21, fontFamily: 'Georgia, serif' }}>
                Open arogya
              </Typography>
            </Stack>
          </Box>

          <Button
            startIcon={<AddRoundedIcon />}
            variant="contained"
            component={Link}
            to="/patient-portal-dashboard"
            sx={{
              mt: 2.2,
              mb: 2.5,
              bgcolor: 'white',
              color: '#0b7a57',
              textTransform: 'none',
              borderRadius: 999,
              fontWeight: 700,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#eaf6f1', boxShadow: 'none' },
            }}
          >
            <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
              Back to dashboard
            </Box>
          </Button>

          <List sx={{ px: 0 }}>
            {sidebarItems.map((item) => {
              const selected = item.key === 'profile'

              return (
                <ListItemButton
                  key={item.key}
                  component={Link}
                  to={item.to}
                  selected={selected}
                  sx={{
                    mb: 0.8,
                    borderRadius: 3,
                    px: { xs: 1, md: 1.5 },
                    py: 1.1,
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    bgcolor: selected ? 'rgba(255,255,255,0.16)' : 'transparent',
                    '&.Mui-selected': {
                      bgcolor: 'rgba(255,255,255,0.18)',
                    },
                    '&.Mui-selected:hover': {
                      bgcolor: 'rgba(255,255,255,0.24)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: { xs: 0, md: 1.5 }, color: 'inherit' }}>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: selected ? 700 : 500,
                      display: { xs: 'none', md: 'block' },
                    }}
                  />
                </ListItemButton>
              )
            })}
          </List>

          <Box sx={{ mt: 'auto', pt: 2 }}>
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                borderRadius: 4,
                bgcolor: 'rgba(255,255,255,0.12)',
                color: 'white',
                display: { xs: 'none', md: 'block' },
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 700 }}>Account health</Typography>
              <Typography sx={{ mt: 0.75, fontSize: 12.5, color: 'rgba(255,255,255,0.78)' }}>
                The profile completion meter is now driven by live profile data plus uploaded medical records.
              </Typography>
              <LinearProgress
                variant="determinate"
                value={accountHealthValue}
                sx={{
                  mt: 1.5,
                  height: 8,
                  borderRadius: 999,
                  bgcolor: 'rgba(255,255,255,0.16)',
                  '& .MuiLinearProgress-bar': { borderRadius: 999, bgcolor: '#d5f4e6' },
                }}
              />
            </Paper>
          </Box>
        </Box>

        <Box sx={{ flex: 1, p: { xs: 2, md: 3.5 } }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            spacing={2}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            sx={{ mb: 3 }}
          >
            <Box>
              <Typography sx={{ color: '#58716a', fontSize: 13, fontWeight: 700, letterSpacing: 0.3 }}>
                PATIENT PROFILE
              </Typography>
              <Typography sx={{ mt: 0.7, fontSize: { xs: 28, md: 38 }, fontWeight: 800, color: '#17322b' }}>
                Keep your health profile ready
              </Typography>
              <Typography sx={{ mt: 0.8, color: '#69827b', maxWidth: 700 }}>
                This screen is fully connected to the patient profile APIs: basic profile fetch and update, password change, medical file listing, upload, and delete.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.2} flexWrap="wrap" useFlexGap>
              <Button
                startIcon={refreshing ? <CircularProgress size={16} color="inherit" /> : <RefreshRoundedIcon />}
                variant="outlined"
                onClick={refreshAll}
                disabled={refreshing}
                sx={{
                  textTransform: 'none',
                  borderRadius: 999,
                  borderColor: '#d2dfd8',
                  color: '#37534c',
                  bgcolor: 'white',
                }}
              >
                Refresh
              </Button>
              <Button
                startIcon={<CloudUploadRoundedIcon />}
                variant="contained"
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  textTransform: 'none',
                  borderRadius: 999,
                  bgcolor: '#0b7a57',
                  '&:hover': { bgcolor: '#096649' },
                }}
              >
                Upload records
              </Button>
            </Stack>
          </Stack>

          {error ? (
            <Alert
              severity="error"
              sx={{ mb: 2.5, borderRadius: 3 }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          ) : null}

          {banner.message ? (
            <Alert
              severity={banner.type}
              sx={{ mb: 2.5, borderRadius: 3 }}
              onClose={() => setBanner({ type: 'success', message: '' })}
            >
              {banner.message}
            </Alert>
          ) : null}

          <Stack spacing={2.5}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 5,
                border: '1px solid #d7e4dd',
                boxShadow: '0 24px 48px rgba(29, 66, 55, 0.08)',
                background:
                  'linear-gradient(135deg, rgba(240,248,245,1) 0%, rgba(255,255,255,1) 58%, rgba(230,244,238,1) 100%)',
              }}
            >
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5} alignItems={{ xs: 'flex-start', md: 'center' }}>
                <Avatar
                  src={profile.avatar || undefined}
                  sx={{
                    width: 92,
                    height: 92,
                    bgcolor: '#0b7a57',
                    fontSize: 32,
                    fontWeight: 700,
                  }}
                >
                  {profileInitials}
                </Avatar>

                <Box sx={{ flex: 1 }}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2} alignItems={{ xs: 'flex-start', md: 'center' }}>
                    <Typography sx={{ fontSize: 30, fontWeight: 800, color: '#18342d' }}>
                      {profile.full_name || 'Patient'}
                    </Typography>
                    <Chip
                      label={formatStatus(profile.status)}
                      sx={{
                        bgcolor: '#daf3e8',
                        color: '#0b7a57',
                        fontWeight: 700,
                      }}
                    />
                  </Stack>
                  <Typography sx={{ mt: 0.9, color: '#607872' }}>
                    {profile.email || 'No email'} | {profile.mobile || 'No mobile'}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1.6 }}>
                    <InfoChip label={`DOB | ${profile.dob || 'Not added'}`} />
                    <InfoChip label={`Gender | ${profile.gender || 'Not added'}`} />
                    <InfoChip label={`Blood group | ${profileForm.blood_group || 'Not added'}`} />
                  </Stack>
                </Box>

                <Stack spacing={1.2} sx={{ width: { xs: '100%', md: 240 } }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 3,
                      bgcolor: '#17322b',
                      '&:hover': { bgcolor: '#112720' },
                    }}
                  >
                    {savingProfile ? 'Saving profile...' : 'Save profile'}
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<LockResetRoundedIcon />}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 3,
                      borderColor: '#c8d8d1',
                      color: '#24423a',
                      bgcolor: 'rgba(255,255,255,0.9)',
                    }}
                  >
                    Change password below
                  </Button>
                </Stack>
              </Stack>
            </Paper>

            <Stack direction={{ xs: 'column', xl: 'row' }} spacing={2.5}>
              <Stack spacing={2.5} sx={{ flex: 1.2 }}>
                <Paper component="form" elevation={0} sx={panelSx} onSubmit={handleSaveProfile}>
                  <SectionHeading
                    icon={<PersonRoundedIcon fontSize="small" />}
                    title="Basic profile"
                    caption="This form maps directly to the patient profile update API and keeps metadata grouped cleanly."
                  />

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Full name"
                      value={profileForm.full_name}
                      onChange={(event) => setProfileForm((current) => ({ ...current, full_name: event.target.value }))}
                    />
                    <TextField fullWidth label="Email" value={profile.email || ''} disabled />
                  </Stack>

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Mobile"
                      value={profileForm.mobile}
                      onChange={(event) => setProfileForm((current) => ({ ...current, mobile: event.target.value }))}
                    />
                    <TextField
                      fullWidth
                      label="Date of birth"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={profileForm.dob}
                      onChange={(event) => setProfileForm((current) => ({ ...current, dob: event.target.value }))}
                    />
                  </Stack>

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      select
                      label="Gender"
                      value={profileForm.gender}
                      onChange={(event) => setProfileForm((current) => ({ ...current, gender: event.target.value }))}
                    >
                      <MenuItem value="">Select gender</MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                    <TextField
                      fullWidth
                      label="Avatar URL"
                      value={profileForm.avatar}
                      onChange={(event) => setProfileForm((current) => ({ ...current, avatar: event.target.value }))}
                    />
                  </Stack>

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={savingProfile}
                    sx={{
                      mt: 2.2,
                      textTransform: 'none',
                      borderRadius: 3,
                      bgcolor: '#0b7a57',
                      '&:hover': { bgcolor: '#096649' },
                    }}
                  >
                    {savingProfile ? 'Updating...' : 'Update basic details'}
                  </Button>
                </Paper>

                <Paper component="form" elevation={0} sx={panelSx} onSubmit={handleSaveProfile}>
                  <SectionHeading
                    icon={<HealthAndSafetyRoundedIcon fontSize="small" />}
                    title="Medical context"
                    caption="These fields are stored in profile metadata so the portal can stay flexible without forcing a schema rewrite every time."
                  />

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Blood group"
                      value={profileForm.blood_group}
                      onChange={(event) => setProfileForm((current) => ({ ...current, blood_group: event.target.value }))}
                    />
                    <TextField
                      fullWidth
                      label="Insurance provider"
                      value={profileForm.insurance_provider}
                      onChange={(event) =>
                        setProfileForm((current) => ({ ...current, insurance_provider: event.target.value }))
                      }
                    />
                  </Stack>

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Policy number"
                      value={profileForm.insurance_policy_number}
                      onChange={(event) =>
                        setProfileForm((current) => ({ ...current, insurance_policy_number: event.target.value }))
                      }
                    />
                    <TextField
                      fullWidth
                      type="date"
                      label="Insurance valid till"
                      InputLabelProps={{ shrink: true }}
                      value={profileForm.insurance_valid_till}
                      onChange={(event) =>
                        setProfileForm((current) => ({ ...current, insurance_valid_till: event.target.value }))
                      }
                    />
                  </Stack>

                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label="Allergies"
                    helperText="One allergy per line works nicely."
                    value={profileForm.allergies}
                    onChange={(event) => setProfileForm((current) => ({ ...current, allergies: event.target.value }))}
                    sx={{ mt: 2 }}
                  />

                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label="Chronic conditions"
                    helperText="One condition per line works nicely."
                    value={profileForm.chronic_conditions}
                    onChange={(event) =>
                      setProfileForm((current) => ({ ...current, chronic_conditions: event.target.value }))
                    }
                    sx={{ mt: 2 }}
                  />
                </Paper>

                <Paper component="form" elevation={0} sx={panelSx} onSubmit={handleUploadFile}>
                  <SectionHeading
                    icon={<FolderSharedRoundedIcon fontSize="small" />}
                    title="Medical files"
                    caption="This area is now fully dynamic with file list, upload form, and delete action support."
                  />

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Document title"
                      value={uploadForm.title}
                      onChange={(event) => setUploadForm((current) => ({ ...current, title: event.target.value }))}
                    />
                    <TextField
                      fullWidth
                      select
                      label="Category"
                      value={uploadForm.category}
                      onChange={(event) => setUploadForm((current) => ({ ...current, category: event.target.value }))}
                    >
                      <MenuItem value="prescription">Prescription</MenuItem>
                      <MenuItem value="lab_report">Lab report</MenuItem>
                      <MenuItem value="scan">Scan</MenuItem>
                      <MenuItem value="discharge_summary">Discharge summary</MenuItem>
                      <MenuItem value="insurance">Insurance</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </TextField>
                  </Stack>

                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    label="Notes"
                    value={uploadForm.notes}
                    onChange={(event) => setUploadForm((current) => ({ ...current, notes: event.target.value }))}
                    sx={{ mt: 2 }}
                  />

                  <input
                    ref={fileInputRef}
                    hidden
                    type="file"
                    onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                  />

                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={1.5}
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                    justifyContent="space-between"
                    sx={{
                      mt: 2,
                      p: 2,
                      borderRadius: 4,
                      bgcolor: '#f5faf7',
                      border: '1px dashed #c9ddd3',
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#1f3b34' }}>
                        {selectedFile ? selectedFile.name : 'No file selected yet'}
                      </Typography>
                      <Typography sx={{ mt: 0.4, fontSize: 13, color: '#69827b' }}>
                        {selectedFile
                          ? `${formatFileSize(selectedFile.size)} | ${selectedFile.type || 'Unknown type'}`
                          : 'Choose a PDF, image, or report file from the patient device.'}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        startIcon={<CloudUploadRoundedIcon />}
                        onClick={() => fileInputRef.current?.click()}
                        sx={{
                          textTransform: 'none',
                          borderRadius: 999,
                          borderColor: '#c8d8d1',
                          color: '#24423a',
                        }}
                      >
                        Choose file
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={uploadingFile}
                        sx={{
                          textTransform: 'none',
                          borderRadius: 999,
                          bgcolor: '#0b7a57',
                          '&:hover': { bgcolor: '#096649' },
                        }}
                      >
                        {uploadingFile ? 'Uploading...' : 'Upload now'}
                      </Button>
                    </Stack>
                  </Stack>

                  <Stack spacing={2} sx={{ mt: 2.5 }}>
                    {groupedFiles.length ? (
                      groupedFiles.map((group) => (
                        <Box
                          key={group.category}
                          sx={{
                            border: '1px solid #dbe7e1',
                            borderRadius: 4,
                            overflow: 'hidden',
                            bgcolor: 'white',
                          }}
                        >
                          <Box
                            sx={{
                              px: 2,
                              py: 1.5,
                              bgcolor: '#f7faf8',
                              borderBottom: '1px solid #e6efea',
                            }}
                          >
                            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                              <Typography sx={{ fontWeight: 700, color: '#1f3b34' }}>{group.title}</Typography>
                              <Chip
                                size="small"
                                label={`${group.items.length} file${group.items.length > 1 ? 's' : ''}`}
                                sx={{
                                  bgcolor: `${group.accent}14`,
                                  color: group.accent,
                                  fontWeight: 700,
                                }}
                              />
                            </Stack>
                          </Box>

                          <Stack divider={<Divider flexItem />}>
                            {group.items.map((item) => (
                              <Stack
                                key={item.id}
                                direction={{ xs: 'column', md: 'row' }}
                                justifyContent="space-between"
                                spacing={1.2}
                                sx={{ px: 2, py: 1.75 }}
                              >
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                  <Box
                                    sx={{
                                      width: 42,
                                      height: 42,
                                      borderRadius: 3,
                                      bgcolor: '#edf4f1',
                                      color: '#0b7a57',
                                      display: 'grid',
                                      placeItems: 'center',
                                    }}
                                  >
                                    <DescriptionRoundedIcon fontSize="small" />
                                  </Box>
                                  <Box>
                                    <Typography sx={{ fontWeight: 700, color: '#203a34' }}>{item.file_name}</Typography>
                                    <Typography sx={{ fontSize: 13, color: '#6a827b' }}>
                                      {categoryLabel(item.category)} | Uploaded {formatDate(item.uploaded_at)}
                                    </Typography>
                                  </Box>
                                </Stack>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Chip
                                    size="small"
                                    label={formatFileSize(item.file_size)}
                                    sx={{ bgcolor: '#f2f5f4', color: '#43615a' }}
                                  />
                                  <Button
                                    size="small"
                                    component="a"
                                    href={item.file_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    sx={{ textTransform: 'none', color: '#0b7a57' }}
                                  >
                                    View
                                  </Button>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDeleteFile(item.id)}
                                    disabled={deletingFileId === item.id}
                                    sx={{ color: '#9f3b35' }}
                                  >
                                    {deletingFileId === item.id ? (
                                      <CircularProgress size={16} color="inherit" />
                                    ) : (
                                      <DeleteOutlineRoundedIcon fontSize="small" />
                                    )}
                                  </IconButton>
                                </Stack>
                              </Stack>
                            ))}
                          </Stack>
                        </Box>
                      ))
                    ) : (
                      <Alert severity="info" sx={{ borderRadius: 3 }}>
                        No medical files have been uploaded yet.
                      </Alert>
                    )}
                  </Stack>
                </Paper>
              </Stack>

              <Stack spacing={2.5} sx={{ width: { xs: '100%', xl: 380 } }}>
                <Paper component="form" elevation={0} sx={panelSx} onSubmit={handleChangePassword}>
                  <SectionHeading
                    icon={<SecurityRoundedIcon fontSize="small" />}
                    title="Account & security"
                    caption="Change-password is fully connected here, while verification and login method are read directly from the profile response."
                  />

                  <Stack spacing={1.2}>
                    <DetailRow label="Login method" value={formatLoginMethod(profile.login_method)} />
                    <DetailRow label="Email verified" value={profile.email_verified ? 'Yes' : 'No'} valueTone={profile.email_verified ? 'success' : 'default'} />
                    <DetailRow label="Mobile verified" value={profile.mobile_verified ? 'Yes' : 'No'} valueTone={profile.mobile_verified ? 'success' : 'default'} />
                    <DetailRow label="Last login" value={profile.last_login_at ? formatDateTime(profile.last_login_at) : 'Not available'} />
                  </Stack>

                  <Stack spacing={2} sx={{ mt: 2.2 }}>
                    <TextField
                      type="password"
                      label="Current password"
                      value={passwordForm.current_password}
                      onChange={(event) =>
                        setPasswordForm((current) => ({ ...current, current_password: event.target.value }))
                      }
                    />
                    <TextField
                      type="password"
                      label="New password"
                      value={passwordForm.new_password}
                      onChange={(event) =>
                        setPasswordForm((current) => ({ ...current, new_password: event.target.value }))
                      }
                    />
                    <TextField
                      type="password"
                      label="Confirm new password"
                      value={passwordForm.confirm_password}
                      onChange={(event) =>
                        setPasswordForm((current) => ({ ...current, confirm_password: event.target.value }))
                      }
                    />
                  </Stack>

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={changingPassword}
                    startIcon={changingPassword ? <CircularProgress size={16} color="inherit" /> : <LockResetRoundedIcon />}
                    sx={{
                      mt: 2.2,
                      textTransform: 'none',
                      borderRadius: 3,
                      bgcolor: '#17322b',
                      '&:hover': { bgcolor: '#112720' },
                    }}
                  >
                    {changingPassword ? 'Changing password...' : 'Change password'}
                  </Button>
                </Paper>

                <Paper component="form" elevation={0} sx={panelSx} onSubmit={handleSaveProfile}>
                  <SectionHeading
                    icon={<PersonRoundedIcon fontSize="small" />}
                    title="Emergency contact"
                    caption="This rides on the profile metadata object so you don’t need a separate patient-contact table right away."
                  />

                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Contact name"
                      value={profileForm.emergency_contact_name}
                      onChange={(event) =>
                        setProfileForm((current) => ({ ...current, emergency_contact_name: event.target.value }))
                      }
                    />
                    <TextField
                      fullWidth
                      label="Relationship"
                      value={profileForm.emergency_contact_relationship}
                      onChange={(event) =>
                        setProfileForm((current) => ({ ...current, emergency_contact_relationship: event.target.value }))
                      }
                    />
                    <TextField
                      fullWidth
                      label="Mobile"
                      value={profileForm.emergency_contact_mobile}
                      onChange={(event) =>
                        setProfileForm((current) => ({ ...current, emergency_contact_mobile: event.target.value }))
                      }
                    />
                  </Stack>

                  <Button
                    type="submit"
                    variant="outlined"
                    disabled={savingProfile}
                    sx={{
                      mt: 2.2,
                      textTransform: 'none',
                      borderRadius: 3,
                      borderColor: '#c8d8d1',
                      color: '#24423a',
                    }}
                  >
                    Save emergency contact
                  </Button>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    ...panelSx,
                    bgcolor: '#17322b',
                    color: 'white',
                  }}
                >
                  <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.5, color: '#8bcfb2' }}>
                    DESIGN INTENT
                  </Typography>
                  <Typography sx={{ mt: 1, fontSize: 23, fontWeight: 800 }}>
                    Profile flows should feel calm, not clinical.
                  </Typography>
                  <Typography sx={{ mt: 1.2, color: 'rgba(255,255,255,0.78)', lineHeight: 1.65 }}>
                    This route now acts like a true patient self-service profile area. It is shaped to fit beside the dashboard shell while staying honest to the APIs you’re building on the backend.
                  </Typography>
                </Paper>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  )
}

function SectionHeading({ icon, title, caption }) {
  return (
    <Stack direction="row" spacing={1.2} alignItems="flex-start" sx={{ mb: 2 }}>
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 3,
          bgcolor: '#edf4f1',
          color: '#0b7a57',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontSize: 20, fontWeight: 800, color: 'inherit' }}>{title}</Typography>
        <Typography sx={{ mt: 0.4, fontSize: 13.5, color: 'inherit', opacity: 0.72 }}>
          {caption}
        </Typography>
      </Box>
    </Stack>
  )
}

function DetailRow({ label, value, valueTone = 'default' }) {
  const color = valueTone === 'success' ? '#0b7a57' : '#1f3b34'

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      spacing={1.5}
      sx={{
        py: 1.15,
        borderBottom: '1px solid #edf2f0',
      }}
    >
      <Typography sx={{ color: '#718780', fontSize: 14 }}>{label}</Typography>
      <Typography sx={{ color, fontSize: 14, fontWeight: 700, textAlign: 'right' }}>{value}</Typography>
    </Stack>
  )
}

function InfoChip({ label }) {
  return (
    <Chip
      label={label}
      sx={{
        bgcolor: 'rgba(255,255,255,0.88)',
        color: '#36534c',
        fontWeight: 600,
      }}
    />
  )
}

function authHeaders() {
  return {
    Authorization: PATIENT_BEARER_TOKEN,
    'Content-Type': 'application/json',
  }
}

function normalizeProfile(data) {
  return {
    ...emptyProfile,
    ...data,
    metadata: data?.metadata && typeof data.metadata === 'object' ? data.metadata : {},
  }
}

function normalizeMedicalFile(file) {
  return {
    id: file?.id,
    title: file?.title || '',
    category: file?.category || 'other',
    file_name: file?.file_name || file?.name || 'Untitled file',
    file_url: file?.file_url || file?.url || '#',
    file_key: file?.file_key || '',
    mime_type: file?.mime_type || '',
    file_size: Number(file?.file_size || 0),
    notes: file?.notes || '',
    uploaded_at: file?.uploaded_at || file?.created_at || new Date().toISOString(),
  }
}

function categoryLabel(category) {
  return String(category || 'other')
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function formatStatus(status) {
  if (!status) return 'Unknown'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function formatLoginMethod(value) {
  if (!value) return 'Not set'
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function arrayToTextarea(value) {
  if (!Array.isArray(value)) return ''
  return value.filter(Boolean).join('\n')
}

function textareaToArray(value) {
  return String(value || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

function formatDate(value) {
  if (!value) return 'Unknown date'
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function formatDateTime(value) {
  if (!value) return 'Unknown'
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function formatFileSize(value) {
  const size = Number(value || 0)
  if (!size) return '0 KB'
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`
  if (size >= 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${size} B`
}

const panelSx = {
  p: { xs: 2, md: 2.5 },
  borderRadius: 5,
  border: '1px solid #d7e4dd',
  boxShadow: '0 20px 40px rgba(36, 74, 63, 0.06)',
  bgcolor: 'white',
}

export default PatientPortalProfilePage
