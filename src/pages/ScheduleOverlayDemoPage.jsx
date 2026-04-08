import { useMemo, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  Divider,
  Drawer,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined'

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const weekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const scheduleTypeOptions = [
  { value: 'OPD Consultation', color: '#6c4db5', iconBg: '#efe8ff' },
  { value: 'Theater/Surgery', color: '#ef6c62', iconBg: '#ffe8e5' },
  { value: 'Video consultation', color: '#4caf62', iconBg: '#e3f5e8' },
]
const locations = ['Medios hospital, London', 'Pharma hospital, London', 'Riverbank clinic, London']
const departments = ['Orthopedics', 'Cardiology', 'Dermatology', 'Neurology']
const roomOptions = ['Room 101', 'Room 102', 'Room 202']
const nurseOptions = ['Anika Peters', 'Sophia Green', 'Megan Cole']
const demoDate = new Date(2026, 2, 30)

function ScheduleOverlayDemoPage() {
  const [displayDate, setDisplayDate] = useState(new Date(2026, 2, 1))
  const [selectedDateKey, setSelectedDateKey] = useState('2026-03-30')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [applyMode, setApplyMode] = useState('specific')
  const [pendingSelectedDates, setPendingSelectedDates] = useState([
    '2026-03-04', '2026-03-05', '2026-03-07', '2026-03-14', '2026-03-17', '2026-03-27',
  ])
  const [appliedSelectedDates, setAppliedSelectedDates] = useState([
    '2026-03-04', '2026-03-05', '2026-03-07', '2026-03-14', '2026-03-17', '2026-03-27',
  ])
  const [formState, setFormState] = useState({
    scheduleType: 'OPD Consultation',
    startTime: '09:00 am',
    endTime: '05:00 pm',
    location: 'Medios hospital, London',
    department: 'Orthopedics',
    room: 'Room 101',
    nurse: 'Anika Peters',
  })

  const gridDates = useMemo(() => getMonthGridDates(displayDate), [displayDate])
  const visibleModalDates = useMemo(() => getMonthGridDates(new Date(2026, 2, 1)), [])

  const selectedCountLabel =
    applyMode === 'all'
      ? 'All dates'
      : appliedSelectedDates.length > 0
        ? `${appliedSelectedDates.length} dates selected`
        : 'Select dates'

  const handleMonthChange = (step) => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + step, 1))
  }

  const handleOpenSidebar = (dateKey = selectedDateKey) => {
    setSelectedDateKey(dateKey)
    const schedule = getScheduleByDate(dateKey)

    if (schedule) {
      setFormState((current) => ({
        ...current,
        scheduleType: schedule.type,
        startTime: schedule.start,
        endTime: schedule.end,
        location: schedule.location,
        department: schedule.department,
      }))
    }

    setSidebarOpen(true)
  }

  const handleOpenModal = () => {
    setPendingSelectedDates(appliedSelectedDates)
    setModalOpen(true)
  }

  const handleApplySelectedDates = () => {
    setAppliedSelectedDates([...pendingSelectedDates].sort())
    setModalOpen(false)
  }

  const togglePendingDate = (dateKey) => {
    setPendingSelectedDates((current) =>
      current.includes(dateKey) ? current.filter((item) => item !== dateKey) : [...current, dateKey],
    )
  }

  return (
    <Stack spacing={3}>
      <Card elevation={0} sx={{ p: 2.25, borderRadius: 4, border: '1px solid #e4ebe7', boxShadow: '0 18px 36px rgba(44, 57, 53, 0.08)' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }}>
          <Box>
            <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#1d2f2a' }}>Overlay Demo</Typography>
            <Typography sx={{ mt: 0.5, color: '#6b7b76' }}>
              Two buttons open the matching modal and right sidebar from the reference.
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
            <Button variant="outlined" onClick={handleOpenModal} sx={launchButtonSx('#ffffff', '#d9e4de', '#415751')}>
              Open Date Modal
            </Button>
            <Button variant="contained" onClick={() => handleOpenSidebar()} sx={launchButtonSx('#4ea86f', '#4ea86f', 'white')}>
              Open Edit Sidebar
            </Button>
          </Stack>
        </Stack>
      </Card>

      <Card elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid #dfe7e2', boxShadow: '0 18px 36px rgba(44, 57, 53, 0.08)', bgcolor: '#edf2ef', position: 'relative', minHeight: 760 }}>
        <OverlayTopChrome />
        <Box sx={{ display: 'flex', minHeight: 712 }}>
          <OverlayLeftRail />
          <Box sx={{ flex: 1, p: 2 }}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: 'white', border: '1px solid #e4ebe7' }}>
              <Stack direction="row" spacing={1.25} alignItems="center">
                <IconButton size="small" sx={{ border: '1px solid #dfe7e2', borderRadius: 2 }}>
                  <ArrowBackRoundedIcon sx={{ fontSize: 16 }} />
                </IconButton>
                <Typography sx={{ fontSize: 28, fontWeight: 700 }}>Add Staff Resources</Typography>
              </Stack>

              <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', lg: 'center' }} sx={{ mt: 3, mb: 3 }}>
                {['Basic info', 'Location', 'Capabilities', 'Availability Setup', 'Status rules', 'Review & publish'].map(
                  (step, index) => {
                    const current = step === 'Availability Setup'
                    return (
                      <Stack key={step} direction="row" spacing={1.25} alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 1.6, py: 1.15, borderRadius: 999, bgcolor: '#f8faf8', minWidth: 132 }}>
                          <Box sx={{ width: 24, height: 24, borderRadius: '999px', display: 'grid', placeItems: 'center', bgcolor: current ? '#ff7b21' : '#0b7a57', color: 'white', fontWeight: 700, fontSize: 12 }}>
                            {current ? '4' : <CheckRoundedIcon sx={{ fontSize: 16 }} />}
                          </Box>
                          <Typography sx={{ fontSize: 12.5, fontWeight: 500 }}>{step}</Typography>
                        </Stack>
                        {index < 5 && <ArrowForwardRoundedIcon sx={{ fontSize: 16, color: '#73837d' }} />}
                      </Stack>
                    )
                  },
                )}
              </Stack>

              <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e3ebe6', overflow: 'hidden' }}>
                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={1.5} sx={{ px: 2.25, pt: 2.25, pb: 1.75 }}>
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
                      <InfoRoundedIcon sx={{ fontSize: 15, color: '#0f7a59' }} />
                    </Stack>
                  </Stack>
                </Stack>

                <Box sx={{ px: 2.25, pb: 2.25 }}>
                  <Paper elevation={0} sx={{ borderRadius: 2.5, border: '1px solid #dfe7e2', overflow: 'hidden' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 1.6, py: 1.25, borderBottom: '1px solid #e1e8e3', bgcolor: 'white' }}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <IconButton size="small" onClick={() => handleMonthChange(-1)}>
                          <ChevronLeftRoundedIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ minWidth: 96, fontSize: 13, fontWeight: 600 }}>
                          {monthNames[displayDate.getMonth()]} {displayDate.getFullYear()}
                        </Typography>
                        <IconButton size="small" onClick={() => handleMonthChange(1)}>
                          <ChevronRightRoundedIcon fontSize="small" />
                        </IconButton>
                      </Stack>

                      <Typography sx={{ fontSize: 11, color: '#657570' }}>
                        UK Standard time ({demoDate.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit' }).toLowerCase()})
                      </Typography>
                    </Stack>

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', bgcolor: 'white' }}>
                      {weekNames.map((day) => (
                        <Box key={day} sx={{ py: 1.2, textAlign: 'center', fontSize: 10.5, color: '#73837d', borderRight: '1px solid #e1e8e3', borderBottom: '1px solid #e1e8e3', '&:last-of-type': { borderRight: 0 } }}>
                          {day}
                        </Box>
                      ))}
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', bgcolor: 'white' }}>
                      {gridDates.map((date, index) => {
                        const dateKey = toKey(date)
                        const inMonth = date.getMonth() === displayDate.getMonth()
                        const schedule = getScheduleByDate(dateKey)
                        const isSelected = dateKey === selectedDateKey
                        const isSelectedForApply = appliedSelectedDates.includes(dateKey)

                        return (
                          <Box
                            key={`${dateKey}-${index}`}
                            onClick={() => {
                              setSelectedDateKey(dateKey)
                              if (schedule) handleOpenSidebar(dateKey)
                            }}
                            sx={{
                              minHeight: 126,
                              px: 1,
                              py: 0.9,
                              borderRight: index % 7 === 6 ? 0 : '1px solid #e1e8e3',
                              borderBottom: '1px solid #e1e8e3',
                              bgcolor: isSelected ? '#eef8f2' : 'white',
                              boxShadow: isSelected ? 'inset 0 0 0 1px #4da87a' : 'none',
                              cursor: 'pointer',
                              opacity: inMonth ? 1 : 0.55,
                              position: 'relative',
                            }}
                          >
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography sx={{ fontSize: 12, color: '#33433f' }}>{date.getDate()}</Typography>
                              <Box sx={{ width: 6, height: 6, borderRadius: '999px', bgcolor: isSelectedForApply ? '#0f7a59' : '#c7ceca' }} />
                            </Stack>

                            {!schedule ? (
                              <Typography sx={{ mt: 2, fontSize: 11, color: '#77837f' }}>Day Off</Typography>
                            ) : (
                              <Paper elevation={0} sx={{ mt: 1, p: 0.75, borderRadius: 1.5, border: `1px solid ${schedule.border}`, bgcolor: schedule.bg }}>
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                  <Box sx={{ width: 12, height: 12, borderRadius: 0.75, bgcolor: schedule.iconBg, color: schedule.border, display: 'grid', placeItems: 'center' }}>
                                    {schedule.icon}
                                  </Box>
                                  <Typography sx={{ fontSize: 9.5, fontWeight: 700, color: '#2f3d39', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {schedule.type}
                                  </Typography>
                                </Stack>
                                <Typography sx={{ mt: 0.5, fontSize: 8.5, color: '#4f5e5a', lineHeight: 1.4 }}>
                                  {schedule.start} - {schedule.end}
                                </Typography>
                                <Typography sx={{ fontSize: 8.5, color: '#4f5e5a', lineHeight: 1.4 }}>{schedule.location}</Typography>
                                <Typography sx={{ fontSize: 8.5, color: '#4f5e5a', lineHeight: 1.4 }}>{schedule.department}</Typography>
                              </Paper>
                            )}
                          </Box>
                        )
                      })}
                    </Box>
                  </Paper>
                </Box>
              </Paper>
            </Paper>
          </Box>
        </Box>

        <Drawer
          anchor="right"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          ModalProps={{ keepMounted: true }}
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
                <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{formatPanelDate(selectedDateKey)}</Typography>
                <Box sx={{ px: 1, py: 0.35, borderRadius: 999, border: '1px solid #d8e4de', fontSize: 10, color: '#5a6c67' }}>
                  1 Schedule
                </Box>
              </Stack>
              <IconButton size="small" onClick={() => setSidebarOpen(false)}>
                <CloseRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Stack>

            <Divider />

            <Box sx={{ px: 2, py: 2, flex: 1, overflowY: 'auto' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#333f3b' }}>Edit Schedule</Typography>
                <IconButton size="small" sx={{ color: '#e26b67' }}>
                  <DeleteOutlineRoundedIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Stack>

              <FieldLabel>Schedule type</FieldLabel>
              <Select
                value={formState.scheduleType}
                onChange={(event) => setFormState((current) => ({ ...current, scheduleType: event.target.value }))}
                fullWidth
                IconComponent={ExpandMoreRoundedIcon}
                sx={overlaySelectSx}
                renderValue={(value) => (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 22, height: 22, borderRadius: 1, display: 'grid', placeItems: 'center', bgcolor: getTypeMeta(value).iconBg, color: getTypeMeta(value).color }}>
                      <PersonRoundedIcon sx={{ fontSize: 13 }} />
                    </Box>
                    <Typography sx={{ fontSize: 12.5 }}>{value}</Typography>
                  </Stack>
                )}
              >
                {scheduleTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.value}</MenuItem>
                ))}
              </Select>

              <FieldLabel>Time</FieldLabel>
              <Stack direction="row" spacing={1}>
                <TextField fullWidth value={formState.startTime} onChange={(event) => setFormState((current) => ({ ...current, startTime: event.target.value }))} size="small" sx={overlayInputSx} />
                <TextField fullWidth value={formState.endTime} onChange={(event) => setFormState((current) => ({ ...current, endTime: event.target.value }))} size="small" sx={overlayInputSx} />
              </Stack>

              <FieldLabel>Location</FieldLabel>
              <OverlaySelect value={formState.location} options={locations} icon={<PlaceRoundedIcon sx={{ fontSize: 15, color: '#0f7a59' }} />} onChange={(value) => setFormState((current) => ({ ...current, location: value }))} />

              <FieldLabel>Sub Location/ Department</FieldLabel>
              <OverlaySelect value={formState.department} options={departments} icon={<LocalHospitalRoundedIcon sx={{ fontSize: 15, color: '#0f7a59' }} />} onChange={(value) => setFormState((current) => ({ ...current, department: value }))} />

              <FieldLabel>Resources</FieldLabel>
              <Paper elevation={0} sx={{ p: 1.25, borderRadius: 2, bgcolor: '#f7f8f7', border: '1px solid #eef2ef' }}>
                <Typography sx={{ fontSize: 10.5, color: '#6d7d78', mb: 1 }}>OPD Consultation Schedule template</Typography>
                <OverlaySelect value={formState.room} options={roomOptions} onChange={(value) => setFormState((current) => ({ ...current, room: value }))} sx={{ mb: 1 }} />
                <Select
                  value={formState.nurse}
                  onChange={(event) => setFormState((current) => ({ ...current, nurse: event.target.value }))}
                  fullWidth
                  size="small"
                  IconComponent={ExpandMoreRoundedIcon}
                  sx={overlaySelectSx}
                  renderValue={(value) => (
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                      <Typography sx={{ fontSize: 12.5 }}>Nurse</Typography>
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <Avatar sx={{ width: 18, height: 18, bgcolor: '#d8dfe5', fontSize: 9 }}>A</Avatar>
                        <Typography sx={{ fontSize: 12.5 }}>{value}</Typography>
                      </Stack>
                    </Stack>
                  )}
                >
                  {nurseOptions.map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </Paper>

              <RadioGroup value={applyMode} onChange={(event) => setApplyMode(event.target.value)} sx={{ mt: 1.25 }}>
                <FormControlLabel value="all" control={<Radio size="small" />} label={<Typography sx={{ fontSize: 12.5 }}>Apply this changes in all dates</Typography>} />
                <FormControlLabel value="specific" control={<Radio size="small" />} label={<Typography sx={{ fontSize: 12.5 }}>Apply this changes on specific dates</Typography>} />
              </RadioGroup>

              <TextField
                fullWidth
                size="small"
                value={selectedCountLabel}
                onClick={() => {
                  setApplyMode('specific')
                  handleOpenModal()
                }}
                InputProps={{ readOnly: true, endAdornment: <CalendarMonthOutlinedIcon sx={{ fontSize: 16, color: '#546763' }} /> }}
                sx={{ mt: 0.5, ...overlayInputSx, '& .MuiInputBase-root': { cursor: 'pointer' } }}
              />
            </Box>

            <Divider />

            <Stack direction="row" spacing={1} sx={{ p: 1.5 }}>
              <Button fullWidth variant="outlined" onClick={() => setSidebarOpen(false)} sx={launchButtonSx('#fff', '#d9e4de', '#52645f')}>
                Cancel
              </Button>
              <Button fullWidth variant="contained" sx={launchButtonSx('#4ea86f', '#4ea86f', 'white')}>
                Save and apply
              </Button>
            </Stack>
          </Stack>
        </Drawer>

        <Dialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          maxWidth="xs"
          PaperProps={{ sx: { width: '100%', maxWidth: 520, borderRadius: 3, boxShadow: '0 24px 60px rgba(29, 39, 35, 0.22)' } }}
        >
          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ p: 2 }}>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#222d2a', pr: 5 }}>
                Select the date(s) you want to apply this changes
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700 }}>March <ExpandMoreRoundedIcon sx={{ fontSize: 16, verticalAlign: 'middle' }} /></Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 700 }}>2026 <ExpandMoreRoundedIcon sx={{ fontSize: 16, verticalAlign: 'middle' }} /></Typography>
              </Stack>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 1, mb: 1 }}>
                {weekNames.map((day) => (
                  <Typography key={day} align="center" sx={{ fontSize: 10, color: '#87938f' }}>{day}</Typography>
                ))}
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 1 }}>
                {visibleModalDates.map((date) => {
                  const key = toKey(date)
                  const inMonth = date.getMonth() === 2
                  const active = pendingSelectedDates.includes(key)

                  return (
                    <Box key={key} sx={{ display: 'grid', placeItems: 'center' }}>
                      <IconButton
                        onClick={() => inMonth && togglePendingDate(key)}
                        sx={{
                          width: 22,
                          height: 22,
                          border: '1px solid',
                          borderColor: active ? '#0f7a59' : '#dce6e1',
                          bgcolor: active ? '#0f7a59' : '#eaf7f3',
                          color: active ? 'white' : inMonth ? '#49605b' : '#bcc4c0',
                          fontSize: 11,
                          '&:hover': { bgcolor: active ? '#0e694d' : '#dff1ea' },
                        }}
                        disabled={!inMonth}
                      >
                        {date.getDate()}
                      </IconButton>
                    </Box>
                  )
                })}
              </Box>
            </Box>

            <Stack direction="row" spacing={1} sx={{ p: 2, pt: 0 }}>
              <Button fullWidth variant="outlined" onClick={() => setModalOpen(false)} sx={launchButtonSx('#fff', '#d9e4de', '#52645f')}>
                Cancel
              </Button>
              <Button fullWidth variant="contained" onClick={handleApplySelectedDates} sx={launchButtonSx('#4ea86f', '#4ea86f', 'white')}>
                Apply
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>
      </Card>
    </Stack>
  )
}

function TopChrome() {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2, height: 42, bgcolor: 'white', borderBottom: '1px solid #e4ebe7' }}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar sx={{ width: 22, height: 22, bgcolor: '#0b7a57', fontSize: 11 }}>OG</Avatar>
        <Typography sx={{ color: '#5f706a' }}>≡</Typography>
      </Stack>

      <Stack direction="row" spacing={1.25} alignItems="center">
        <Paper elevation={0} sx={{ px: 1.25, py: 0.5, borderRadius: 1.5, border: '1px solid #dfe7e2', minWidth: 180 }}>
          <Typography sx={{ fontSize: 10, fontWeight: 700 }}>ABC Hospital</Typography>
          <Typography sx={{ fontSize: 9, color: '#85928e' }}>2972 Westheimer Rd. Santa Ana, Illinois 85486</Typography>
        </Paper>
        <Typography sx={{ fontSize: 11, color: '#7a8682' }}>⚙</Typography>
        <Typography sx={{ fontSize: 11, color: '#7a8682' }}>◔</Typography>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Avatar sx={{ width: 22, height: 22, bgcolor: '#2d4058', fontSize: 10 }}>J</Avatar>
          <Typography sx={{ fontSize: 11, color: '#283633' }}>John Doe</Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}

function LeftRail() {
  return (
    <Box sx={{ width: 42, bgcolor: '#0b7a57', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 1.25, gap: 2.1 }}>
      {['○', '◔', '◫', '▣', '◧', '◎', '⌂'].map((item) => (
        <Typography key={item} sx={{ fontSize: 12, opacity: 0.95 }}>{item}</Typography>
      ))}
    </Box>
  )
}

void TopChrome
void LeftRail

function OverlayTopChrome() {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2, height: 42, bgcolor: 'white', borderBottom: '1px solid #e4ebe7' }}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar sx={{ width: 22, height: 22, bgcolor: '#0b7a57', fontSize: 11 }}>OG</Avatar>
        <MenuRoundedIcon sx={{ fontSize: 18, color: '#5f706a' }} />
      </Stack>

      <Stack direction="row" spacing={1.25} alignItems="center">
        <Paper elevation={0} sx={{ px: 1.25, py: 0.5, borderRadius: 1.5, border: '1px solid #dfe7e2', minWidth: 180 }}>
          <Typography sx={{ fontSize: 10, fontWeight: 700 }}>ABC Hospital</Typography>
          <Typography sx={{ fontSize: 9, color: '#85928e' }}>2972 Westheimer Rd. Santa Ana, Illinois 85486</Typography>
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

function OverlayLeftRail() {
  return (
    <Box sx={{ width: 42, bgcolor: '#0b7a57', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 1.25, gap: 2.1 }}>
      {['O', 'C', 'B', 'D', 'S', 'R', 'H'].map((item) => (
        <Typography key={item} sx={{ fontSize: 11, opacity: 0.95, fontWeight: 600 }}>{item}</Typography>
      ))}
    </Box>
  )
}

function FieldLabel({ children }) {
  return (
    <Typography sx={{ mt: 1.75, mb: 0.75, fontSize: 12, color: '#5f706a', fontWeight: 500 }}>
      {children}
    </Typography>
  )
}

function OverlaySelect({ value, options, icon, onChange, sx }) {
  return (
    <Select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      fullWidth
      size="small"
      IconComponent={ExpandMoreRoundedIcon}
      sx={{ ...overlaySelectSx, ...sx }}
      renderValue={(selected) => (
        <Stack direction="row" spacing={1} alignItems="center">
          {icon}
          <Typography sx={{ fontSize: 12.5 }}>{selected}</Typography>
        </Stack>
      )}
    >
      {options.map((option) => (
        <MenuItem key={option} value={option}>{option}</MenuItem>
      ))}
    </Select>
  )
}

function getMonthGridDates(displayDate) {
  const firstDay = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1)
  const start = new Date(firstDay)
  start.setDate(firstDay.getDate() - firstDay.getDay())

  return Array.from({ length: 35 }, (_, index) => {
    const next = new Date(start)
    next.setDate(start.getDate() + index)
    return next
  })
}

function getScheduleByDate(dateKey) {
  return scheduleSeed[dateKey]
}

function getTypeMeta(type) {
  return scheduleTypeOptions.find((item) => item.value === type) ?? scheduleTypeOptions[0]
}

function formatPanelDate(dateKey) {
  const date = fromKey(dateKey)
  return `${date.getDate()}${getOrdinalSuffix(date.getDate())} ${monthNames[date.getMonth()]} ${date.getFullYear()}`
}

function getOrdinalSuffix(day) {
  if (day >= 11 && day <= 13) return 'th'
  if (day % 10 === 1) return 'st'
  if (day % 10 === 2) return 'nd'
  if (day % 10 === 3) return 'rd'
  return 'th'
}

function toKey(date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function fromKey(value) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const overlaySelectSx = {
  height: 42,
  bgcolor: 'white',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#d9e3dd',
  },
  '& .MuiSelect-select': {
    py: 1,
    fontSize: 12.5,
    display: 'flex',
    alignItems: 'center',
  },
}

const overlayInputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    height: 42,
    bgcolor: 'white',
    fontSize: 12.5,
    '& fieldset': {
      borderColor: '#d9e3dd',
    },
  },
}

function launchButtonSx(bgcolor, borderColor, color) {
  return {
    minWidth: 118,
    height: 40,
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 600,
    bgcolor,
    borderColor,
    color,
    boxShadow: 'none',
    '&:hover': {
      bgcolor,
      borderColor,
      color,
      boxShadow: 'none',
      opacity: 0.94,
    },
  }
}

const scheduleSeed = {
  '2026-03-02': { type: 'OPD Consultation', start: '09:00 am', end: '05:00 pm', location: 'Medios hospital, London', department: 'Orthopedics', border: '#d4c4ef', bg: '#fcf9ff', iconBg: '#efe8ff', icon: <PersonRoundedIcon sx={{ fontSize: 9 }} /> },
  '2026-03-03': { type: 'Theater/Surgery', start: '09:00 am', end: '05:00 pm', location: 'Medios hospital, London', department: 'Orthopedics', border: '#f3c8c5', bg: '#fff7f6', iconBg: '#ffe8e5', icon: <CancelOutlinedIcon sx={{ fontSize: 9 }} /> },
  '2026-03-04': { type: 'OPD Consultation', start: '09:00 am', end: '05:00 pm', location: 'Medios hospital, London', department: 'Orthopedics', border: '#d4c4ef', bg: '#fcf9ff', iconBg: '#efe8ff', icon: <PersonRoundedIcon sx={{ fontSize: 9 }} /> },
  '2026-03-05': { type: 'Theater/Surgery', start: '09:00 am', end: '05:00 pm', location: 'Medios hospital, London', department: 'Orthopedics', border: '#f3c8c5', bg: '#fff7f6', iconBg: '#ffe8e5', icon: <CancelOutlinedIcon sx={{ fontSize: 9 }} /> },
  '2026-03-08': { type: 'Theater/Surgery', start: '09:00 am', end: '05:00 pm', location: 'Medios hospital, London', department: 'Orthopedics', border: '#f3c8c5', bg: '#fff7f6', iconBg: '#ffe8e5', icon: <CancelOutlinedIcon sx={{ fontSize: 9 }} /> },
  '2026-03-09': { type: 'OPD Consultation', start: '09:00 am', end: '05:00 pm', location: 'Medios hospital, London', department: 'Orthopedics', border: '#d4c4ef', bg: '#fcf9ff', iconBg: '#efe8ff', icon: <PersonRoundedIcon sx={{ fontSize: 9 }} /> },
  '2026-03-10': { type: 'OPD Consultation', start: '09:00 am', end: '05:00 pm', location: 'Medios hospital, London', department: 'Orthopedics', border: '#d4c4ef', bg: '#fcf9ff', iconBg: '#efe8ff', icon: <PersonRoundedIcon sx={{ fontSize: 9 }} /> },
  '2026-03-11': { type: 'OPD Consultation', start: '09:00 am', end: '05:00 pm', location: 'Medios hospital, London', department: 'Orthopedics', border: '#d4c4ef', bg: '#fcf9ff', iconBg: '#efe8ff', icon: <PersonRoundedIcon sx={{ fontSize: 9 }} /> },
  '2026-03-15': { type: 'Video consultation', start: '09:00 am', end: '05:00 pm', location: 'Medios hospital, London', department: 'Orthopedics', border: '#bfe6cb', bg: '#f4fbf6', iconBg: '#e3f5e8', icon: <TipsAndUpdatesOutlinedIcon sx={{ fontSize: 9 }} /> },
  '2026-03-16': { type: 'OPD Consultation', start: '09:00 am', end: '05:00 pm', location: 'Medios hospital, London', department: 'Orthopedics', border: '#d4c4ef', bg: '#fcf9ff', iconBg: '#efe8ff', icon: <PersonRoundedIcon sx={{ fontSize: 9 }} /> },
  '2026-03-17': { type: 'OPD Consultation', start: '09:00 am', end: '05:00 pm', location: 'Medios hospital, London', department: 'Orthopedics', border: '#d4c4ef', bg: '#fcf9ff', iconBg: '#efe8ff', icon: <PersonRoundedIcon sx={{ fontSize: 9 }} /> },
  '2026-03-19': { type: 'Theater/Surgery', start: '09:00 am', end: '05:00 pm', location: 'Medios hospital, London', department: 'Orthopedics', border: '#f3c8c5', bg: '#fff7f6', iconBg: '#ffe8e5', icon: <CancelOutlinedIcon sx={{ fontSize: 9 }} /> },
  '2026-03-23': { type: 'Video consultation', start: '09:00 am', end: '05:00 pm', location: 'Medios hospital, London', department: 'Orthopedics', border: '#bfe6cb', bg: '#f4fbf6', iconBg: '#e3f5e8', icon: <TipsAndUpdatesOutlinedIcon sx={{ fontSize: 9 }} /> },
  '2026-03-24': { type: 'OPD Consultation', start: '09:00 am', end: '05:00 pm', location: 'Medios hospital, London', department: 'Orthopedics', border: '#d4c4ef', bg: '#fcf9ff', iconBg: '#efe8ff', icon: <PersonRoundedIcon sx={{ fontSize: 9 }} /> },
  '2026-03-26': { type: 'OPD Consultation', start: '09:00 am', end: '05:00 pm', location: 'Medios hospital, London', department: 'Orthopedics', border: '#d4c4ef', bg: '#fcf9ff', iconBg: '#efe8ff', icon: <PersonRoundedIcon sx={{ fontSize: 9 }} /> },
  '2026-03-30': { type: 'OPD Consultation', start: '09:00 am', end: '05:00 pm', location: 'Medios hospital, London', department: 'Orthopedics', border: '#d4c4ef', bg: '#fcf9ff', iconBg: '#efe8ff', icon: <PersonRoundedIcon sx={{ fontSize: 9 }} /> },
  '2026-03-31': { type: 'Theater/Surgery', start: '09:00 am', end: '05:00 pm', location: 'Medios hospital, London', department: 'Orthopedics', border: '#f3c8c5', bg: '#fff7f6', iconBg: '#ffe8e5', icon: <CancelOutlinedIcon sx={{ fontSize: 9 }} /> },
}

export default ScheduleOverlayDemoPage
