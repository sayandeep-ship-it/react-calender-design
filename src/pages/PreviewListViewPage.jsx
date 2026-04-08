import { useMemo, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Drawer,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import ListRoundedIcon from '@mui/icons-material/ListRounded'
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import RoomPreferencesRoundedIcon from '@mui/icons-material/RoomPreferencesRounded'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import { Link } from 'react-router-dom'

const scheduleTypes = {
  'OPD Consultation': {
    accent: '#6d49b4',
    bg: '#f5efff',
    iconBg: '#e8defb',
    icon: <PersonRoundedIcon sx={{ fontSize: 12 }} />,
  },
  'Theater/Surgery': {
    accent: '#ee564e',
    bg: '#fff0ef',
    iconBg: '#ffdeda',
    icon: <LocalHospitalRoundedIcon sx={{ fontSize: 12 }} />,
  },
  'Video Consultation': {
    accent: '#4aa95f',
    bg: '#edf8ef',
    iconBg: '#d9f1de',
    icon: <CalendarMonthRoundedIcon sx={{ fontSize: 12 }} />,
  },
}

const steps = ['Basic info', 'Location', 'Capabilities', 'Availability Setup', 'Status rules', 'Review & publish']
const locations = ['Medias hospital, London', 'Pharma hospital, London', 'City clinic, London']
const departments = ['Orthopedics', 'Cardiology', 'Dermatology']
const rooms = ['Room 101', 'OT Room 101', 'Room 202']
const teamMembers = ['Anika Peters', 'Kylie Andrews', 'Rina Cole']

const entries = [
  {
    id: '1',
    dateLabel: 'Sunday, 1 March 2026',
    time: '9:00 AM - 5:00 PM',
    type: 'OPD Consultation',
    location: 'Medias hospital, London',
    department: 'Orthopedics',
    room: 'Room 101',
    member: 'Anika Peters',
    memberRole: 'Nurse',
  },
  {
    id: '2',
    dateLabel: 'Monday, 2 March 2026',
    time: '9:00 AM - 5:00 PM',
    type: 'Theater/Surgery',
    location: 'Medias hospital, London',
    department: 'Orthopedics',
    room: 'OT Room 101',
    member: 'Kylie Andrews',
    memberRole: 'Assistant Doctor',
  },
  {
    id: '3',
    dateLabel: 'Tuesday, 3 March 2026',
    time: '9:00 AM - 5:00 PM',
    type: 'Theater/Surgery',
    location: 'Medias hospital, London',
    department: 'Orthopedics',
    room: 'Room 101',
    member: 'Anika Peters',
    memberRole: 'Nurse',
  },
  {
    id: '4',
    dateLabel: 'Tuesday, 3 March 2026',
    time: '9:00 AM - 5:00 PM',
    type: 'Video Consultation',
    location: 'Pharma hospital, London',
    department: 'Orthopedics',
    room: 'Room 101',
    member: '',
    memberRole: '',
  },
  {
    id: '5',
    dateLabel: 'Wednesday, 4 March 2026',
    time: '9:00 AM - 5:00 PM',
    type: 'OPD Consultation',
    location: 'Medias hospital, London',
    department: 'Orthopedics',
    room: 'Room 101',
    member: 'Anika Peters',
    memberRole: 'Nurse',
  },
  {
    id: '6',
    dateLabel: 'Thursday, 5 March 2026',
    time: '9:00 AM - 5:00 PM',
    type: 'Theater/Surgery',
    location: 'Medias hospital, London',
    department: 'Orthopedics',
    room: 'OT Room 101',
    member: 'Kylie Andrews',
    memberRole: 'Assistant Doctor',
  },
]

function PreviewListViewPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeEntryId, setActiveEntryId] = useState(entries[0].id)
  const [formState, setFormState] = useState(() => toFormState(entries[0]))

  const groupedEntries = useMemo(() => {
    const map = new Map()
    entries.forEach((entry) => {
      const list = map.get(entry.dateLabel) ?? []
      list.push(entry)
      map.set(entry.dateLabel, list)
    })
    return Array.from(map.entries())
  }, [])

  const openDrawer = (entry) => {
    setActiveEntryId(entry.id)
    setFormState(toFormState(entry))
    setDrawerOpen(true)
  }

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid #dfe7e2',
        boxShadow: '0 18px 36px rgba(44, 57, 53, 0.08)',
        bgcolor: '#edf2ef',
      }}
    >
      <OverlayTopBar />

      <Box sx={{ display: 'flex', minHeight: 760 }}>
        <OverlaySideRail />

        <Box sx={{ flex: 1, p: 2 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: 'white', border: '1px solid #e5ece7' }}>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <IconButton size="small" sx={{ border: '1px solid #dfe7e2', borderRadius: 2 }}>
                <ArrowBackRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
              <Typography sx={{ fontSize: 17, fontWeight: 700, color: '#23312d' }}>
                Add Staff Resources
              </Typography>
            </Stack>

            <Stack
              direction={{ xs: 'column', lg: 'row' }}
              spacing={1.5}
              alignItems={{ xs: 'stretch', lg: 'center' }}
              sx={{ mt: 2.25 }}
            >
              {steps.map((step, index) => {
                const current = step === 'Availability Setup'
                return (
                  <Stack key={step} direction="row" spacing={1.2} alignItems="center">
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ px: 1.6, py: 1.05, borderRadius: 999, bgcolor: '#f8faf8' }}
                    >
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '999px',
                          display: 'grid',
                          placeItems: 'center',
                          bgcolor: current ? '#ff7b21' : '#0b7a57',
                          color: 'white',
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {current ? '4' : <CheckRoundedIcon sx={{ fontSize: 16 }} />}
                      </Box>
                      <Typography sx={{ fontSize: 12.5, fontWeight: 500 }}>{step}</Typography>
                    </Stack>
                    {index < steps.length - 1 && <ArrowForwardRoundedIcon sx={{ fontSize: 16, color: '#72837d' }} />}
                  </Stack>
                )
              })}
            </Stack>

            <Paper
              elevation={0}
              sx={{
                mt: 2.25,
                borderRadius: 3,
                border: '1px solid #e3ebe6',
                overflow: 'hidden',
              }}
            >
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', md: 'center' }}
                spacing={1.5}
                sx={{ px: 2, py: 2.25 }}
              >
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                  <Typography sx={{ fontSize: 17, fontWeight: 600 }}>Schedule of</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar sx={{ width: 22, height: 22, bgcolor: '#213d59', fontSize: 11 }}>JS</Avatar>
                    <Typography sx={{ fontSize: 17, fontWeight: 500, color: '#0f7a59' }}>Dr. Jhon Smith</Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: '#1f2926' }}>
                      OVERRIDE HOURS FOR SPECIFIC DAYS
                    </Typography>
                    <Tooltip title="This is monthly scheduling. Select specific dates to set, change or override the hours.">
                      <InfoRoundedIcon sx={{ fontSize: 15, color: '#0f7a59' }} />
                    </Tooltip>
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    startIcon={<ListRoundedIcon />}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 2,
                      bgcolor: '#0f7a59',
                      minWidth: 92,
                      '&:hover': { bgcolor: '#0d6a4d' },
                    }}
                  >
                    List
                  </Button>
                  <Button
                    component={Link}
                    to="/schedule-overlays"
                    variant="outlined"
                    startIcon={<CalendarMonthRoundedIcon />}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 2,
                      borderColor: '#dde5e0',
                      color: '#41544e',
                      minWidth: 104,
                    }}
                  >
                    Calendar
                  </Button>
                </Stack>
              </Stack>

              <Box sx={{ px: 2, pb: 2 }}>
                {groupedEntries.map(([dateLabel, list]) => (
                  <Box key={dateLabel} sx={{ '& + &': { mt: 1.5 } }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 0.75 }}
                    >
                      <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: '#2e3a37' }}>
                        {dateLabel}
                      </Typography>
                      <Typography sx={{ fontSize: 11, color: '#74837e' }}>
                        {list.length} Schedule{list.length > 1 ? 's' : ''}
                      </Typography>
                    </Stack>

                    <Stack spacing={1}>
                      {list.map((entry) => (
                        <Paper
                          key={entry.id}
                          elevation={0}
                          sx={{
                            px: 0,
                            py: 0,
                            borderRadius: 2,
                            border: '1px solid #e3ebe6',
                            overflow: 'hidden',
                            bgcolor: activeEntryId === entry.id ? '#f9fcfa' : 'white',
                          }}
                        >
                          <Stack
                            direction={{ xs: 'column', xl: 'row' }}
                            alignItems={{ xs: 'stretch', xl: 'center' }}
                            spacing={1}
                            sx={{ p: 1.2 }}
                          >
                            <Box
                              sx={{
                                minWidth: 112,
                                pl: 1.1,
                                pr: 1.5,
                                py: 1,
                                borderLeft: `3px solid ${scheduleTypes[entry.type].accent}`,
                                borderRight: { xl: '1px solid #ebf1ee' },
                              }}
                            >
                              <Typography sx={{ fontSize: 12.5, fontWeight: 500, color: '#263430' }}>
                                {entry.time}
                              </Typography>
                            </Box>

                            <ScheduleChip type={entry.type} />
                            <InfoChip icon={<PlaceRoundedIcon sx={{ fontSize: 15 }} />} label={entry.location} minWidth={182} />
                            <InfoChip icon={<LocalHospitalRoundedIcon sx={{ fontSize: 15 }} />} label={entry.department} minWidth={116} />
                            <InfoChip icon={<RoomPreferencesRoundedIcon sx={{ fontSize: 15 }} />} label={entry.room} minWidth={112} />

                            {entry.member ? (
                              <Paper
                                elevation={0}
                                sx={{
                                  px: 1,
                                  py: 0.6,
                                  borderRadius: 2,
                                  border: '1px solid #dbe4de',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.85,
                                  minWidth: 140,
                                  bgcolor: 'white',
                                }}
                              >
                                <Avatar sx={{ width: 22, height: 22, bgcolor: '#d8dde5', fontSize: 10 }}>
                                  {entry.member[0]}
                                </Avatar>
                                <Box sx={{ minWidth: 0 }}>
                                  <Typography sx={{ fontSize: 11.5, color: '#2e3a37', lineHeight: 1.2 }}>
                                    {entry.member}
                                  </Typography>
                                  <Typography sx={{ fontSize: 10, color: '#7d8b86', lineHeight: 1.2 }}>
                                    {entry.memberRole}
                                  </Typography>
                                </Box>
                              </Paper>
                            ) : (
                              <Box sx={{ minWidth: 140 }} />
                            )}

                            <IconButton
                              size="small"
                              onClick={() => openDrawer(entry)}
                              sx={{
                                ml: { xl: 'auto' },
                                width: 28,
                                height: 28,
                                border: '1px solid #dbe4de',
                                borderRadius: 2,
                                color: '#394b46',
                              }}
                            >
                              <EditRoundedIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Stack>
                        </Paper>
                      ))}
                    </Stack>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Paper>
        </Box>
      </Box>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 328,
            bgcolor: '#fff',
            boxShadow: '0 8px 30px rgba(28, 38, 35, 0.18)',
          },
        }}
      >
        <Stack sx={{ height: '100%' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 1.5, py: 1.25 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{entries.find((entry) => entry.id === activeEntryId)?.dateLabel ?? ''}</Typography>
            </Stack>
            <IconButton size="small" onClick={() => setDrawerOpen(false)}>
              <CloseRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>

          <Divider />

          <Box sx={{ px: 2, py: 2, flex: 1, overflowY: 'auto' }}>
            <FieldLabel>Schedule type</FieldLabel>
            <Select
              value={formState.type}
              onChange={(event) => setFormState((current) => ({ ...current, type: event.target.value }))}
              fullWidth
              size="small"
              IconComponent={ExpandMoreRoundedIcon}
              sx={fieldSx}
            >
              {Object.keys(scheduleTypes).map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>

            <FieldLabel>Time</FieldLabel>
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="small"
                value={formState.timeStart}
                onChange={(event) => setFormState((current) => ({ ...current, timeStart: event.target.value }))}
                sx={fieldSx}
              />
              <TextField
                fullWidth
                size="small"
                value={formState.timeEnd}
                onChange={(event) => setFormState((current) => ({ ...current, timeEnd: event.target.value }))}
                sx={fieldSx}
              />
            </Stack>

            <FieldLabel>Location</FieldLabel>
            <Select
              value={formState.location}
              onChange={(event) => setFormState((current) => ({ ...current, location: event.target.value }))}
              fullWidth
              size="small"
              IconComponent={ExpandMoreRoundedIcon}
              sx={fieldSx}
            >
              {locations.map((item) => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))}
            </Select>

            <FieldLabel>Department</FieldLabel>
            <Select
              value={formState.department}
              onChange={(event) => setFormState((current) => ({ ...current, department: event.target.value }))}
              fullWidth
              size="small"
              IconComponent={ExpandMoreRoundedIcon}
              sx={fieldSx}
            >
              {departments.map((item) => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))}
            </Select>

            <FieldLabel>Room</FieldLabel>
            <Select
              value={formState.room}
              onChange={(event) => setFormState((current) => ({ ...current, room: event.target.value }))}
              fullWidth
              size="small"
              IconComponent={ExpandMoreRoundedIcon}
              sx={fieldSx}
            >
              {rooms.map((item) => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))}
            </Select>

            <FieldLabel>Assigned Member</FieldLabel>
            <Select
              value={formState.member}
              onChange={(event) => setFormState((current) => ({ ...current, member: event.target.value }))}
              fullWidth
              size="small"
              IconComponent={ExpandMoreRoundedIcon}
              sx={fieldSx}
            >
              {teamMembers.map((item) => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))}
            </Select>
          </Box>

          <Divider />

          <Stack direction="row" spacing={1} sx={{ p: 1.5 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setDrawerOpen(false)}
              sx={{ textTransform: 'none', borderColor: '#d9e4de', color: '#52645f' }}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              variant="contained"
              sx={{ textTransform: 'none', bgcolor: '#4ea86f', '&:hover': { bgcolor: '#428f5e' } }}
            >
              Save
            </Button>
          </Stack>
        </Stack>
      </Drawer>
    </Card>
  )
}

function OverlayTopBar() {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ px: 2, height: 42, bgcolor: 'white', borderBottom: '1px solid #e4ebe7' }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar sx={{ width: 22, height: 22, bgcolor: '#0b7a57', fontSize: 11 }}>OG</Avatar>
        <MenuRoundedIcon sx={{ fontSize: 18, color: '#5f706a' }} />
      </Stack>

      <Stack direction="row" spacing={1.25} alignItems="center">
        <Paper
          elevation={0}
          sx={{ px: 1.25, py: 0.5, borderRadius: 1.5, border: '1px solid #dfe7e2', minWidth: 180 }}
        >
          <Typography sx={{ fontSize: 10, fontWeight: 700 }}>ABC Hospital</Typography>
          <Typography sx={{ fontSize: 9, color: '#85928e' }}>
            2972 Westheimer Rd. Santa Ana, Illinois 85486
          </Typography>
        </Paper>
        <SettingsOutlinedIcon sx={{ fontSize: 16, color: '#7a8682' }} />
        <NotificationsNoneRoundedIcon sx={{ fontSize: 16, color: '#7a8682' }} />
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Avatar sx={{ width: 22, height: 22, bgcolor: '#2d4058', fontSize: 10 }}>J</Avatar>
          <Typography sx={{ fontSize: 11, color: '#283633' }}>John Doe</Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}

function OverlaySideRail() {
  return (
    <Box
      sx={{
        width: 42,
        bgcolor: '#0b7a57',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 1.25,
        gap: 2.1,
      }}
    >
      {['O', 'C', 'B', 'D', 'S', 'R', 'H'].map((item) => (
        <Typography key={item} sx={{ fontSize: 11, opacity: 0.95, fontWeight: 600 }}>
          {item}
        </Typography>
      ))}
    </Box>
  )
}

function ScheduleChip({ type }) {
  const meta = scheduleTypes[type]

  return (
    <Paper
      elevation={0}
      sx={{
        px: 1,
        py: 0.6,
        borderRadius: 2,
        border: '1px solid #dbe4de',
        display: 'flex',
        alignItems: 'center',
        gap: 0.8,
        minWidth: 138,
      }}
    >
      <Box
        sx={{
          width: 22,
          height: 22,
          borderRadius: 1,
          bgcolor: meta.iconBg,
          color: meta.accent,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        {meta.icon}
      </Box>
      <Typography sx={{ fontSize: 12, color: '#2f3b37' }}>{type}</Typography>
    </Paper>
  )
}

function InfoChip({ icon, label, minWidth }) {
  return (
    <Paper
      elevation={0}
      sx={{
        px: 1,
        py: 0.6,
        borderRadius: 2,
        border: '1px solid #dbe4de',
        display: 'flex',
        alignItems: 'center',
        gap: 0.7,
        minWidth,
        bgcolor: 'white',
      }}
    >
      <Box sx={{ color: '#0f7a59', display: 'grid', placeItems: 'center' }}>{icon}</Box>
      <Typography sx={{ fontSize: 11.5, color: '#33423e' }}>{label}</Typography>
    </Paper>
  )
}

function FieldLabel({ children }) {
  return (
    <Typography sx={{ mt: 1.75, mb: 0.75, fontSize: 12, color: '#5f706a', fontWeight: 500 }}>
      {children}
    </Typography>
  )
}

function toFormState(entry) {
  const [timeStart = '', timeEnd = ''] = entry.time.split(' - ')
  return {
    type: entry.type,
    timeStart,
    timeEnd,
    location: entry.location,
    department: entry.department,
    room: entry.room,
    member: entry.member || teamMembers[0],
  }
}

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    bgcolor: 'white',
    '& fieldset': {
      borderColor: '#d9e3dd',
    },
  },
}

export default PreviewListViewPage
