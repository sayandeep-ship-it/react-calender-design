import { useEffect, useState } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Drawer,
  IconButton,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded'
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import PlaylistAddCheckCircleRoundedIcon from '@mui/icons-material/PlaylistAddCheckCircleRounded'
import TodayRoundedIcon from '@mui/icons-material/TodayRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'

const DASHBOARD_API_URL = 'https://dev-api.openarogya.icrmonline.co.uk/api/patient-portal/dashboard'
const DASHBOARD_BEARER_TOKEN =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZ2xvYmFsX3BhdGllbnRfdWlkIjoiUEFULTE3NzgyMjQzMTI4MzItQTkxMTY2NzMiLCJlbWFpbCI6InNheWFuZGVlcEB0ZWNobm9leHBvbmVudC5jby5pbiIsIm1vYmlsZSI6IjgyNDA3MTg2NTIiLCJ0ZW5hbnRfc2NoZW1hIjpbInRlbmFudF9Bcm9neWEgSGVhbHRoIE9yZ2FuaXNhdGlvbl8xNjIiXSwidHlwZSI6InBhdGllbnQiLCJpYXQiOjE3NzgzOTA0MjcsImV4cCI6MTc3ODk5NTIyN30.q2YnWXfeFenXeifYMD3OG81FDdwTDjxaaRwlx-VSafc'

const sidebarItems = [
  { key: 'dashboard', label: 'Dashboard', icon: <HomeRoundedIcon fontSize="small" /> },
  { key: 'appointments', label: 'Appointments', icon: <EventNoteRoundedIcon fontSize="small" /> },
  { key: 'careplans', label: 'Care Plans', icon: <PlaylistAddCheckCircleRoundedIcon fontSize="small" /> },
  { key: 'locations', label: 'Locations', icon: <LocationOnRoundedIcon fontSize="small" /> },
]

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const emptyDashboardData = {
  patient: {
    id: null,
    global_patient_uid: '',
    full_name: 'Patient',
    email: '',
    mobile: '',
    status: 'active',
    login_method: '',
    source: '',
    email_verified: false,
    mobile_verified: false,
    dob: null,
    gender: null,
    avatar: null,
    tenant_schema: [],
    tenant_patient_ids: [],
    metadata: null,
  },
  summary: {
    total_appointments: 0,
    booked_appointments: 0,
    completed_appointments: 0,
    active_careplans: 0,
    organisations_count: 0,
  },
  organisations: [],
  careplans: [],
  appointments: [],
  skipped_tenants: [],
}

function PatientPortalDashboardPage() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [appointmentView, setAppointmentView] = useState('list')
  const [displayMonth, setDisplayMonth] = useState(new Date())
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [locationLabel, setLocationLabel] = useState('Locating...')
  const [dashboardData, setDashboardData] = useState(emptyDashboardData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadLocation() {
      try {
        const response = await fetch('https://ipwho.is/')
        const data = await response.json()

        if (!ignore && data?.success !== false) {
          const label = [data.city, data.region, data.country].filter(Boolean).join(', ')
          setLocationLabel(label || 'Kolkata, India')
        }
      } catch {
        if (!ignore) {
          setLocationLabel('Kolkata, India')
        }
      }
    }

    loadLocation()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadDashboard() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(DASHBOARD_API_URL, {
          headers: {
            Authorization: DASHBOARD_BEARER_TOKEN,
            'Content-Type': 'application/json',
          },
        })

        const payload = await response.json()

        if (!response.ok || payload?.status === false) {
          throw new Error(payload?.message || payload?.error || 'Failed to load dashboard')
        }

        const normalized = normalizeDashboardResponse(payload?.data)

        if (!ignore) {
          setDashboardData(normalized)
          setDisplayMonth(getInitialMonth(normalized.appointments))
          setSelectedAppointment(normalized.appointments[0] || null)
        }
      } catch (loadError) {
        if (!ignore) {
          setDashboardData(emptyDashboardData)
          setError(loadError.message || 'Failed to load dashboard')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      ignore = true
    }
  }, [])

  const patient = dashboardData.patient
  const summary = dashboardData.summary
  const appointments = [...dashboardData.appointments].sort(
    (left, right) => new Date(`${left.date}T${left.startTime}`) - new Date(`${right.date}T${right.startTime}`),
  )
  const carePlans = dashboardData.careplans
  const organisations = dashboardData.organisations
  const nextAppointment =
    appointments.find((item) => new Date(`${item.date}T${item.startTime || '00:00:00'}`) >= new Date()) ||
    appointments[0] ||
    null

  const groupedAppointments = appointments.reduce((accumulator, appointment) => {
    const key = appointment.date || 'undated'

    if (!accumulator[key]) {
      accumulator[key] = []
    }

    accumulator[key].push(appointment)
    return accumulator
  }, {})

  const monthDates = getMonthGridDates(displayMonth)

  useEffect(() => {
    if (!appointments.length) {
      setSelectedAppointment(null)
      return
    }

    if (!selectedAppointment) {
      setSelectedAppointment(appointments[0])
      return
    }

    const stillExists = appointments.find((item) => item.id === selectedAppointment.id)
    if (!stillExists) {
      setSelectedAppointment(appointments[0])
    }
  }, [appointments, selectedAppointment])

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
            sx={{
              mt: 2.2,
              mb: 2.4,
              textTransform: 'none',
              justifyContent: 'flex-start',
              bgcolor: 'rgba(255,255,255,0.18)',
              color: 'white',
              borderRadius: 2.5,
              py: 1.1,
              px: 1.5,
              boxShadow: 'none',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.24)', boxShadow: 'none' },
            }}
          >
            <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
              Book Appointment
            </Box>
          </Button>

          <List sx={{ p: 0 }}>
            {sidebarItems.map((item) => {
              const active = item.key === activeSection

              return (
                <ListItemButton
                  key={item.key}
                  onClick={() => setActiveSection(item.key)}
                  sx={{
                    mb: 0.4,
                    minHeight: 42,
                    borderRadius: 2,
                    bgcolor: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.12)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 28, color: 'white' }}>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: 13,
                      fontWeight: active ? 700 : 500,
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
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.12)',
                color: 'white',
                display: { xs: 'none', md: 'block' },
              }}
            >
              <Typography sx={{ fontSize: 12, opacity: 0.75 }}>Patient UID</Typography>
              {loading ? (
                <Skeleton variant="text" width={160} sx={{ mt: 0.5, bgcolor: 'rgba(255,255,255,0.18)' }} />
              ) : (
                <Typography sx={{ mt: 0.5, fontSize: 16, fontWeight: 700 }}>{patient.global_patient_uid || '--'}</Typography>
              )}
              <Typography sx={{ mt: 1, fontSize: 12, opacity: 0.75 }}>Multi-tenant linked</Typography>
              {loading ? (
                <Skeleton variant="text" width={120} sx={{ mt: 0.35, bgcolor: 'rgba(255,255,255,0.18)' }} />
              ) : (
                <Typography sx={{ mt: 0.35, fontSize: 13 }}>{summary.organisations_count} organisations</Typography>
              )}
            </Paper>
          </Box>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              height: 64,
              bgcolor: '#ffffff',
              borderBottom: '1px solid #dee8e2',
              px: { xs: 2, md: 3 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography sx={{ fontSize: 20, color: '#52655e' }}>=</Typography>
              <Chip
                icon={<LocationOnRoundedIcon sx={{ fontSize: '16px !important' }} />}
                label={locationLabel}
                sx={{
                  bgcolor: '#eff7f2',
                  color: '#32564b',
                  maxWidth: { xs: 180, md: 300 },
                  '& .MuiChip-label': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'block',
                  },
                }}
              />
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <IconButton size="small" sx={{ color: '#30433d' }}>
                <NotificationsNoneRoundedIcon fontSize="small" />
              </IconButton>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#f1d3d8', color: '#4a3437', fontSize: 13, fontWeight: 700 }}>
                  {getInitials(patient.full_name || 'Patient')}
                </Avatar>
                <Typography sx={{ display: { xs: 'none', md: 'block' }, fontSize: 13, color: '#4c5e58' }}>
                  {loading ? 'Loading...' : patient.full_name}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Typography sx={{ fontSize: 32, fontWeight: 700, color: '#182521' }}>Patient Dashboard</Typography>
            <Typography sx={{ mt: 0.65, color: '#6a7f77', maxWidth: 760 }}>
              A care-plan-first portal view shaped from the <code>patient_details_all</code> record,
              now connected to the live patient dashboard API response.
            </Typography>

            {error ? (
              <Alert severity="error" sx={{ mt: 2.2 }}>
                {error}
              </Alert>
            ) : null}

            <Stack direction={{ xs: 'column', xl: 'row' }} spacing={2.2} sx={{ mt: 2.4 }}>
              <Paper elevation={0} sx={heroCardSx}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.4} justifyContent="space-between">
                  <Stack direction="row" spacing={1.6} alignItems="center">
                    <Avatar sx={{ width: 60, height: 60, bgcolor: '#d9efe6', color: '#0b7a57', fontSize: 22, fontWeight: 800 }}>
                      {getInitials(patient.full_name || 'Patient')}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontSize: 28, fontWeight: 700, color: '#15211d' }}>
                        {loading ? <Skeleton variant="text" width={220} /> : patient.full_name || 'Patient'}
                      </Typography>
                      <Typography sx={{ mt: 0.35, color: '#6f857d' }}>
                        {loading ? 'Loading patient details...' : `${patient.email || '--'} · ${patient.mobile || '--'}`}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1.2 }} flexWrap="wrap" useFlexGap>
                        <Chip size="small" label={String(patient.status || 'active').toUpperCase()} sx={smallChipSx('#dff5e8', '#1a7a4e')} />
                        <Chip size="small" label={`Source: ${patient.source || '--'}`} sx={smallChipSx('#eef3ff', '#3b5ec9')} />
                        <Chip size="small" label={`${summary.active_careplans} care plans`} sx={smallChipSx('#fff1d6', '#a06a00')} />
                      </Stack>
                    </Box>
                  </Stack>

                  <Stack direction={{ xs: 'row', md: 'column' }} spacing={1.2} sx={{ minWidth: { md: 210 } }}>
                    <StatCard label="Appointments booked" value={String(summary.booked_appointments || 0)} icon={<EventAvailableRoundedIcon />} accent="#0b7a57" />
                    <StatCard label="Completed visits" value={String(summary.completed_appointments || 0)} icon={<TodayRoundedIcon />} accent="#f28a2e" />
                  </Stack>
                </Stack>
              </Paper>

              <Paper elevation={0} sx={nextAppointmentCardSx}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.8, color: '#6a7b75' }}>
                  NEXT APPOINTMENT
                </Typography>
                {loading ? (
                  <Stack spacing={1.1} sx={{ mt: 1.25 }}>
                    <Skeleton variant="text" width="75%" height={42} />
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="70%" />
                  </Stack>
                ) : nextAppointment ? (
                  <>
                    <Typography sx={{ mt: 1, fontSize: 24, fontWeight: 700, color: '#17231f' }}>
                      {nextAppointment.title}
                    </Typography>
                    <Typography sx={{ mt: 0.4, color: '#688078' }}>
                      {formatReadableDate(nextAppointment.date)} · {formatTimeRange(nextAppointment.startTime, nextAppointment.endTime)}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.25 }}>
                      <LocationOnRoundedIcon sx={{ fontSize: 18, color: '#0b7a57' }} />
                      <Typography sx={{ color: '#445a53' }}>{nextAppointment.locationName || 'Location pending'}</Typography>
                    </Stack>
                    <Button
                      variant="contained"
                      onClick={() => setSelectedAppointment(nextAppointment)}
                      sx={{
                        mt: 2.1,
                        textTransform: 'none',
                        bgcolor: '#0b7a57',
                        borderRadius: 2,
                        px: 2.3,
                        '&:hover': { bgcolor: '#096649' },
                      }}
                    >
                      View details
                    </Button>
                  </>
                ) : (
                  <EmptyState
                    title="No appointments booked yet"
                    description="Once appointments are linked to this patient, the next visit will appear here automatically."
                  />
                )}
              </Paper>
            </Stack>

            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2.2} sx={{ mt: 2.2 }}>
              <Paper elevation={0} sx={sectionCardSx}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#182420' }}>
                    Care plans the patient is in
                  </Typography>
                  <Chip label={`${summary.active_careplans} active`} sx={smallChipSx('#eef7f2', '#33594e')} />
                </Stack>

                <Stack spacing={1.2} sx={{ mt: 1.8 }}>
                  {loading ? (
                    Array.from({ length: 2 }).map((_, index) => (
                      <Paper key={index} elevation={0} sx={carePlanCardSx}>
                        <Skeleton variant="text" width="55%" />
                        <Skeleton variant="text" width="75%" />
                        <Skeleton variant="rounded" height={8} sx={{ mt: 1.4 }} />
                      </Paper>
                    ))
                  ) : carePlans.length ? (
                    carePlans.map((plan) => (
                      <Paper key={`${plan.tenant_schema}-${plan.id}`} elevation={0} sx={carePlanCardSx}>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} justifyContent="space-between">
                          <Box>
                            <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#18241f' }}>{plan.name}</Typography>
                            <Typography sx={{ mt: 0.35, color: '#687d75' }}>
                              {plan.organisation} · {plan.owner || 'Care coordinator pending'}
                            </Typography>
                          </Box>
                          <Box sx={{ minWidth: { md: 180 } }}>
                            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#60756d' }}>
                              {plan.stage || 'In progress'}
                            </Typography>
                            <Typography sx={{ mt: 0.25, fontSize: 13, color: '#7a8d86' }}>
                              {plan.nextVisit ? `Next visit ${formatReadableDate(plan.nextVisit)}` : 'No follow-up date yet'}
                            </Typography>
                          </Box>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={Number(plan.progress || 0)}
                          sx={{
                            mt: 1.4,
                            height: 8,
                            borderRadius: 99,
                            bgcolor: '#e3ece7',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 99,
                              bgcolor: '#0b7a57',
                            },
                          }}
                        />
                      </Paper>
                    ))
                  ) : (
                    <EmptyState
                      title="No care plans linked"
                      description="Care plans will appear here as soon as the patient is assigned to an appointment template."
                    />
                  )}
                </Stack>
              </Paper>

              <Paper elevation={0} sx={sectionCardSx}>
                <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#182420' }}>
                  Organisation-wise care plan details
                </Typography>

                <Stack spacing={1.25} sx={{ mt: 1.8 }}>
                  {loading ? (
                    Array.from({ length: 2 }).map((_, index) => (
                      <Paper key={index} elevation={0} sx={organisationCardSx}>
                        <Skeleton variant="text" width="52%" />
                        <Skeleton variant="text" width="68%" />
                        <Stack direction="row" spacing={1} sx={{ mt: 1.4 }}>
                          <Skeleton variant="rounded" width={110} height={26} />
                          <Skeleton variant="rounded" width={120} height={26} />
                        </Stack>
                        <Skeleton variant="rounded" height={7} sx={{ mt: 1.5 }} />
                      </Paper>
                    ))
                  ) : organisations.length ? (
                    organisations.map((organisation) => (
                      <Paper key={organisation.tenant_schema} elevation={0} sx={organisationCardSx}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
                          <Box>
                            <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#17231f' }}>
                              {organisation.organisation}
                            </Typography>
                            <Typography sx={{ mt: 0.35, color: '#6d817a' }}>
                              Tenant patient #{organisation.tenant_patient_id} · Coordinator {organisation.coordinator || 'Not assigned'}
                            </Typography>
                          </Box>
                          <LocalHospitalRoundedIcon sx={{ color: '#0b7a57' }} />
                        </Stack>

                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1.4 }}>
                          <Chip label={`${organisation.activeCarePlans} care plans`} sx={smallChipSx('#e7f7ee', '#0b7a57')} />
                          <Chip label={`${organisation.linkedAppointments} appointments`} sx={smallChipSx('#f4edff', '#6d58db')} />
                          <Chip label={organisation.nextMilestone || 'No milestone yet'} sx={smallChipSx('#fff1dd', '#a06a00')} />
                        </Stack>

                        <LinearProgress
                          variant="determinate"
                          value={Number(organisation.completion || 0)}
                          sx={{
                            mt: 1.5,
                            height: 7,
                            borderRadius: 99,
                            bgcolor: '#e6ede8',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 99,
                              bgcolor: '#0b7a57',
                            },
                          }}
                        />
                      </Paper>
                    ))
                  ) : (
                    <EmptyState
                      title="No organisations returned"
                      description="This patient is not mapped to any tenant organisation in the dashboard response yet."
                    />
                  )}
                </Stack>
              </Paper>
            </Stack>

            <Paper elevation={0} sx={{ ...sectionCardSx, mt: 2.2 }}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={1.5}
                justifyContent="space-between"
                alignItems={{ xs: 'stretch', md: 'center' }}
              >
                <Box>
                  <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#182420' }}>
                    Appointment timeline
                  </Typography>
                  <Typography sx={{ mt: 0.45, color: '#70837d' }}>
                    Switch between list and calendar. Clicking any appointment opens its location and full visit details.
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                  <Button
                    startIcon={<ViewListRoundedIcon />}
                    variant={appointmentView === 'list' ? 'contained' : 'outlined'}
                    onClick={() => setAppointmentView('list')}
                    sx={toggleButtonSx(appointmentView === 'list')}
                  >
                    List view
                  </Button>
                  <Button
                    startIcon={<CalendarMonthRoundedIcon />}
                    variant={appointmentView === 'calendar' ? 'contained' : 'outlined'}
                    onClick={() => setAppointmentView('calendar')}
                    sx={toggleButtonSx(appointmentView === 'calendar')}
                  >
                    Calendar view
                  </Button>
                </Stack>
              </Stack>

              {loading ? (
                <Stack spacing={1.2} sx={{ mt: 2 }}>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Paper key={index} elevation={0} sx={{ p: 1.6, borderRadius: 3, border: '1px solid #e1eae5' }}>
                      <Skeleton variant="text" width="38%" />
                      <Skeleton variant="text" width="76%" />
                    </Paper>
                  ))}
                </Stack>
              ) : appointmentView === 'list' ? (
                appointments.length ? (
                  <Stack spacing={1.3} sx={{ mt: 2 }}>
                    {Object.entries(groupedAppointments).map(([date, items]) => (
                      <Box key={date}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.9 }}>
                          <Typography sx={{ fontSize: 17, fontWeight: 700, color: '#20312c' }}>
                            {date === 'undated' ? 'Undated' : formatReadableDate(date)}
                          </Typography>
                          <Typography sx={{ fontSize: 12, color: '#7b8e87' }}>
                            {items.length} appointment{items.length > 1 ? 's' : ''}
                          </Typography>
                        </Stack>

                        <Stack spacing={1}>
                          {items.map((appointment) => (
                            <Paper
                              key={appointment.id}
                              elevation={0}
                              onClick={() => setSelectedAppointment(appointment)}
                              sx={{
                                p: 1.6,
                                borderRadius: 3,
                                border: '1px solid #e1eae5',
                                bgcolor: 'white',
                                cursor: 'pointer',
                                transition: 'transform 150ms ease, box-shadow 150ms ease',
                                '&:hover': {
                                  transform: 'translateY(-1px)',
                                  boxShadow: '0 14px 28px rgba(54, 78, 69, 0.08)',
                                },
                              }}
                            >
                              <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1.4} alignItems={{ lg: 'center' }}>
                                <Box sx={{ minWidth: { lg: 130 } }}>
                                  <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#1c2a25' }}>
                                    {formatClock(appointment.startTime)}
                                  </Typography>
                                  <Typography sx={{ mt: 0.2, fontSize: 12, color: '#7b8b85' }}>
                                    {appointment.type}
                                  </Typography>
                                </Box>

                                <Box sx={{ flex: 1 }}>
                                  <Typography sx={{ fontSize: 17, fontWeight: 700, color: '#17231f' }}>
                                    {appointment.title}
                                  </Typography>
                                  <Typography sx={{ mt: 0.35, color: '#6a7e77' }}>
                                    {appointment.doctor || 'Doctor pending'} · {appointment.carePlan || 'Care plan not linked'}
                                  </Typography>
                                  <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mt: 0.8 }}>
                                    <LocationOnRoundedIcon sx={{ fontSize: 17, color: '#0b7a57' }} />
                                    <Typography sx={{ fontSize: 13, color: '#4f645d' }}>
                                      {appointment.locationName || 'Location pending'}
                                    </Typography>
                                  </Stack>
                                </Box>

                                <Chip label={appointment.status} sx={statusChipSx(appointment.status)} />
                              </Stack>
                            </Paper>
                          ))}
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Box sx={{ mt: 2 }}>
                    <EmptyState
                      title="No appointments on record"
                      description="The dashboard API returned no appointments for this patient yet."
                    />
                  </Box>
                )
              ) : appointments.length ? (
                <Box sx={{ mt: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.4 }}>
                    <IconButton size="small" onClick={() => setDisplayMonth(shiftMonth(displayMonth, -1))} sx={calendarNavSx}>
                      <ChevronLeftRoundedIcon />
                    </IconButton>
                    <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#22332d' }}>
                      {displayMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </Typography>
                    <IconButton size="small" onClick={() => setDisplayMonth(shiftMonth(displayMonth, 1))} sx={calendarNavSx}>
                      <ChevronRightRoundedIcon />
                    </IconButton>
                  </Stack>

                  <Paper elevation={0} sx={calendarShellSx}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', borderBottom: '1px solid #e1e8e4' }}>
                      {weekdayLabels.map((day) => (
                        <Box key={day} sx={{ py: 1.1, textAlign: 'center' }}>
                          <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#7f908a' }}>{day}</Typography>
                        </Box>
                      ))}
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
                      {monthDates.map((date) => {
                        const dateKey = toDateKey(date)
                        const dayAppointments = groupedAppointments[dateKey] || []
                        const inMonth = date.getMonth() === displayMonth.getMonth()

                        return (
                          <Box
                            key={dateKey}
                            sx={{
                              minHeight: 154,
                              p: 1,
                              borderRight: date.getDay() === 6 ? 0 : '1px solid #e4ebe7',
                              borderBottom: '1px solid #e4ebe7',
                              bgcolor: '#fff',
                              opacity: inMonth ? 1 : 0.38,
                            }}
                          >
                            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#20312c', mb: 0.8 }}>
                              {date.getDate()}
                            </Typography>

                            <Stack spacing={0.7}>
                              {dayAppointments.length === 0 ? (
                                <Typography sx={{ fontSize: 10.5, color: '#a0ada7' }}>No appointment</Typography>
                              ) : (
                                dayAppointments.map((appointment) => (
                                  <Box
                                    key={appointment.id}
                                    onClick={() => setSelectedAppointment(appointment)}
                                    sx={{
                                      borderRadius: 2,
                                      borderLeft: '4px solid #0b7a57',
                                      bgcolor: '#eef8f3',
                                      px: 0.9,
                                      py: 0.7,
                                      cursor: 'pointer',
                                    }}
                                  >
                                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#17231f' }}>
                                      {appointment.title}
                                    </Typography>
                                    <Typography sx={{ mt: 0.15, fontSize: 10.2, color: '#577068' }}>
                                      {formatClock(appointment.startTime)}
                                    </Typography>
                                    <Typography sx={{ mt: 0.15, fontSize: 10.1, color: '#70817b' }}>
                                      {appointment.locationName || 'Location pending'}
                                    </Typography>
                                  </Box>
                                ))
                              )}
                            </Stack>
                          </Box>
                        )
                      })}
                    </Box>
                  </Paper>
                </Box>
              ) : (
                <Box sx={{ mt: 2 }}>
                  <EmptyState
                    title="Calendar is waiting for appointments"
                    description="When appointments arrive from the API, they will appear here on their scheduled dates."
                  />
                </Box>
              )}
            </Paper>

            {!loading && dashboardData.skipped_tenants.length ? (
              <Alert severity="warning" sx={{ mt: 2.2 }}>
                Some tenant records were skipped: {dashboardData.skipped_tenants.map((item) => `${item.schema} (${item.reason})`).join(', ')}
              </Alert>
            ) : null}
          </Box>
        </Box>
      </Paper>

      <Drawer
        anchor="right"
        open={Boolean(selectedAppointment)}
        onClose={() => setSelectedAppointment(null)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 420 },
            p: 2.4,
            bgcolor: '#fbfcfb',
          },
        }}
      >
        {selectedAppointment && (
          <Stack spacing={2}>
            <Box>
              <Typography sx={{ fontSize: 13, letterSpacing: 0.8, fontWeight: 700, color: '#7a8d86' }}>
                APPOINTMENT DETAILS
              </Typography>
              <Typography sx={{ mt: 0.75, fontSize: 28, fontWeight: 700, color: '#192521' }}>
                {selectedAppointment.title}
              </Typography>
            </Box>

            <Chip label={selectedAppointment.status} sx={statusChipSx(selectedAppointment.status)} />

            <Paper elevation={0} sx={drawerCardSx}>
              <Stack spacing={1.2}>
                <DetailRow label="Date" value={formatReadableDate(selectedAppointment.date)} />
                <DetailRow label="Time" value={formatTimeRange(selectedAppointment.startTime, selectedAppointment.endTime)} />
                <DetailRow label="Doctor" value={selectedAppointment.doctor || 'Pending assignment'} />
                <DetailRow label="Care plan" value={selectedAppointment.carePlan || 'Not linked'} />
                <DetailRow label="Organisation" value={selectedAppointment.organisation || '--'} />
              </Stack>
            </Paper>

            <Paper elevation={0} sx={drawerCardSx}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <LocationOnRoundedIcon sx={{ color: '#0b7a57' }} />
                <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#1b2723' }}>
                  Location
                </Typography>
              </Stack>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#1f2c28' }}>
                {selectedAppointment.locationName || 'Location pending'}
              </Typography>
              <Typography sx={{ mt: 0.55, color: '#6f817b' }}>
                {selectedAppointment.locationAddress || 'No address available'}
              </Typography>
            </Paper>

            <Paper elevation={0} sx={drawerCardSx}>
              <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#1b2723' }}>
                Visit notes
              </Typography>
              <Typography sx={{ mt: 0.85, color: '#647872', lineHeight: 1.7 }}>
                {selectedAppointment.notes || 'No clinical notes available yet.'}
              </Typography>
            </Paper>
          </Stack>
        )}
      </Drawer>
    </Box>
  )
}

function EmptyState({ title, description }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: '1px dashed #cfe0d8',
        bgcolor: '#fbfdfc',
      }}
    >
      <Typography sx={{ fontSize: 17, fontWeight: 700, color: '#20312c' }}>{title}</Typography>
      <Typography sx={{ mt: 0.55, color: '#71837d' }}>{description}</Typography>
    </Paper>
  )
}

function StatCard({ label, value, icon, accent }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.4,
        borderRadius: 3,
        border: '1px solid #e1e9e5',
        bgcolor: '#fff',
      }}
    >
      <Stack direction="row" spacing={1.1} alignItems="center">
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2.5,
            bgcolor: `${accent}14`,
            color: accent,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#16231f' }}>{value}</Typography>
          <Typography sx={{ fontSize: 12, color: '#6c8079' }}>{label}</Typography>
        </Box>
      </Stack>
    </Paper>
  )
}

function DetailRow({ label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={1.5}>
      <Typography sx={{ color: '#778982', fontSize: 14 }}>{label}</Typography>
      <Typography sx={{ color: '#21302b', fontSize: 14, fontWeight: 700, textAlign: 'right' }}>
        {value}
      </Typography>
    </Stack>
  )
}

function normalizeDashboardResponse(data) {
  if (!data) {
    return emptyDashboardData
  }

  return {
    patient: {
      ...emptyDashboardData.patient,
      ...(data.patient || {}),
    },
    summary: {
      ...emptyDashboardData.summary,
      ...(data.summary || {}),
    },
    organisations: Array.isArray(data.organisations)
      ? data.organisations.map((item) => ({
          tenant_schema: item.tenant_schema,
          organisation: item.organisation || humanizeTenantSchema(item.tenant_schema),
          tenant_patient_id: item.tenant_patient_id || null,
          activeCarePlans: Number(item.active_careplans || 0),
          linkedAppointments: Number(item.linked_appointments || 0),
          bookedAppointments: Number(item.booked_appointments || 0),
          completedAppointments: Number(item.completed_appointments || 0),
          coordinator: item.coordinator || null,
          nextMilestone: item.next_milestone || null,
          completion: Number(item.completion || 0),
        }))
      : [],
    careplans: Array.isArray(data.careplans)
      ? data.careplans.map((item) => ({
          id: item.id,
          tenant_schema: item.tenant_schema,
          organisation: item.organisation || humanizeTenantSchema(item.tenant_schema),
          name: item.name || 'Care Plan',
          stage: item.stage || 'In progress',
          nextVisit: item.next_visit || null,
          nextVisitTime: item.next_visit_time || null,
          owner: item.owner || null,
          progress: Number(item.progress || 0),
          totalAppointments: Number(item.total_appointments || 0),
          completedAppointments: Number(item.completed_appointments || 0),
        }))
      : [],
    appointments: Array.isArray(data.appointments)
      ? data.appointments.map((item) => ({
          id: item.id,
          tenant_schema: item.tenant_schema,
          organisation: item.organisation || humanizeTenantSchema(item.tenant_schema),
          title: item.title || 'Appointment',
          carePlanId: item.care_plan_id || null,
          carePlan: item.care_plan_name || null,
          locationId: item.location_id || null,
          locationName: item.location_name || '',
          locationType: item.location_type || '',
          subLocationId: item.sub_location_id || null,
          subLocationName: item.sub_location_name || '',
          locationAddress: item.location_address || item.location_name || '',
          date: item.date || null,
          startTime: item.start_time || null,
          endTime: item.end_time || null,
          timeLabel: item.time_label || '',
          doctor: item.doctor || '',
          doctorId: item.doctor_id || null,
          doctorEmail: item.doctor_email || '',
          status: item.status || 'Scheduled',
          type: item.appointment_mode_label || item.appointment_mode || 'In-person',
          notes: item.notes || item.reason || '',
          reason: item.reason || '',
          videoMeetingLink: item.video_meeting_link || null,
        }))
      : [],
    skipped_tenants: Array.isArray(data.skipped_tenants) ? data.skipped_tenants : [],
  }
}

function getInitialMonth(appointments) {
  if (!appointments.length || !appointments[0].date) {
    return new Date()
  }

  const [year, month] = appointments[0].date.split('-').map(Number)
  return new Date(year, (month || 1) - 1, 1)
}

function getMonthGridDates(displayMonth) {
  const firstDay = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), 1)
  const start = new Date(firstDay)
  start.setDate(firstDay.getDate() - firstDay.getDay())

  return Array.from({ length: 35 }, (_, index) => {
    const next = new Date(start)
    next.setDate(start.getDate() + index)
    return next
  })
}

function shiftMonth(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

function toDateKey(date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatReadableDate(value) {
  if (!value) return '--'

  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatClock(value) {
  if (!value) return '--'

  const [hour = 0, minute = 0] = String(value).split(':').map(Number)
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${String(minute).padStart(2, '0')} ${suffix}`
}

function formatTimeRange(startTime, endTime) {
  return `${formatClock(startTime)} - ${formatClock(endTime)}`
}

function getInitials(name) {
  return String(name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'P'
}

function humanizeTenantSchema(schema) {
  return String(schema || '')
    .replace(/^tenant_/i, '')
    .replace(/_\d+$/, '')
    .replace(/_/g, ' ')
    .trim()
}

function smallChipSx(bgcolor, color) {
  return {
    height: 26,
    bgcolor,
    color,
    '& .MuiChip-label': {
      px: 1.15,
      fontSize: 11,
      fontWeight: 700,
    },
  }
}

function toggleButtonSx(active) {
  return {
    textTransform: 'none',
    borderRadius: 999,
    px: 1.8,
    bgcolor: active ? '#0b7a57' : '#fff',
    borderColor: active ? '#0b7a57' : '#d3dfd8',
    color: active ? '#fff' : '#466058',
    '&:hover': {
      bgcolor: active ? '#096649' : '#f7faf8',
      borderColor: active ? '#096649' : '#c6d5cd',
    },
  }
}

function statusChipSx(status) {
  const palette =
    {
      Booked: ['#e5f7ee', '#0b7a57'],
      Today: ['#e8f0ff', '#355cce'],
      Upcoming: ['#e8f0ff', '#355cce'],
      Confirmed: ['#fff2db', '#b06d00'],
      Scheduled: ['#f1ebff', '#6d58db'],
      Completed: ['#ebefee', '#5d7069'],
    }[status] || ['#eef4f1', '#50645d']

  return {
    height: 28,
    bgcolor: palette[0],
    color: palette[1],
    alignSelf: 'flex-start',
    '& .MuiChip-label': {
      px: 1.2,
      fontSize: 11,
      fontWeight: 700,
    },
  }
}

const heroCardSx = {
  flex: 1.35,
  p: 2.3,
  borderRadius: 4,
  border: '1px solid #dde8e2',
  bgcolor: '#fff',
  boxShadow: '0 18px 36px rgba(44, 57, 53, 0.06)',
}

const nextAppointmentCardSx = {
  flex: 0.8,
  p: 2.3,
  borderRadius: 4,
  border: '1px solid #dde8e2',
  bgcolor: '#fff',
  boxShadow: '0 18px 36px rgba(44, 57, 53, 0.06)',
}

const sectionCardSx = {
  flex: 1,
  p: 2.2,
  borderRadius: 4,
  border: '1px solid #dde8e2',
  bgcolor: '#fff',
  boxShadow: '0 16px 32px rgba(44, 57, 53, 0.05)',
}

const carePlanCardSx = {
  p: 1.5,
  borderRadius: 3,
  border: '1px solid #e1ebe5',
  bgcolor: '#fcfdfc',
}

const organisationCardSx = {
  p: 1.5,
  borderRadius: 3,
  border: '1px solid #e1ebe5',
  bgcolor: '#fcfdfc',
}

const calendarNavSx = {
  width: 36,
  height: 36,
  border: '1px solid #d2ddd7',
  borderRadius: 2,
  bgcolor: 'white',
}

const calendarShellSx = {
  borderRadius: 3,
  border: '1px solid #dde5e1',
  overflow: 'hidden',
  bgcolor: 'white',
}

const drawerCardSx = {
  p: 1.7,
  borderRadius: 3,
  border: '1px solid #e1eae5',
  bgcolor: 'white',
}

export default PatientPortalDashboardPage
