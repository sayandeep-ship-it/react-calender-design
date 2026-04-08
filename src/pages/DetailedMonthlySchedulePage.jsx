import { useMemo, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Card,
  IconButton,
  MenuItem,
  Popover,
  Select,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import ListRoundedIcon from '@mui/icons-material/ListRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded'
import MedicalServicesRoundedIcon from '@mui/icons-material/MedicalServicesRounded'
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const weekNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

const baseScheduleTemplates = {
  opd: {
    label: 'OPD Consultation',
    detail: '09:00 AM - 05:00 PM',
    location: 'Medios hospital, London',
    procedure: 'Orthopedics',
    accent: '#7b57be',
    bg: '#faf6ff',
    border: '#dccff3',
    text: '#5d3b99',
    icon: <MedicalServicesRoundedIcon sx={{ fontSize: 12 }} />,
    dot: '#7b57be',
  },
  surgery: {
    label: 'Theater / Surgery',
    detail: '09:00 AM - 05:00 PM',
    location: 'Medios hospital, London',
    procedure: 'Orthopedics',
    accent: '#ef6a61',
    bg: '#fff5f4',
    border: '#f2d2cf',
    text: '#d24d44',
    icon: <LocalHospitalRoundedIcon sx={{ fontSize: 12 }} />,
    dot: '#ef6a61',
  },
  video: {
    label: 'Video consultation',
    detail: '09:00 AM - 05:00 PM',
    location: 'Medios hospital, London',
    procedure: 'Orthopedics',
    accent: '#6db86d',
    bg: '#f4fcf4',
    border: '#cfe9cf',
    text: '#34853d',
    icon: <VideocamRoundedIcon sx={{ fontSize: 12 }} />,
    dot: '#6db86d',
  },
}

function DetailedMonthlySchedulePage() {
  const [displayDate, setDisplayDate] = useState(new Date(2026, 2, 1))
  const [selectedDateKey, setSelectedDateKey] = useState('2026-03-30')
  const [anchorEl, setAnchorEl] = useState(null)

  const gridDates = useMemo(() => getMonthGridDates(displayDate), [displayDate])
  const scheduleMap = useMemo(() => buildScheduleMap(displayDate), [displayDate])
  const nowLabel = useMemo(
    () =>
      `UK Standard time (${new Date().toLocaleTimeString('en-GB', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).toLowerCase()})`,
    [],
  )

  const handleMonthChange = (event) => {
    setDisplayDate(new Date(displayDate.getFullYear(), Number(event.target.value), 1))
    setAnchorEl(null)
  }

  const shiftMonth = (step) => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + step, 1))
    setAnchorEl(null)
  }

  const handleCellClick = (event, date) => {
    setSelectedDateKey(toKey(date))
    setAnchorEl(event.currentTarget)
  }

  return (
    <Card
      elevation={0}
      sx={{
        p: { xs: 2, md: 2.25 },
        borderRadius: 4,
        border: '1px solid #e6ebe8',
        boxShadow: '0 18px 36px rgba(44, 57, 53, 0.08)',
        bgcolor: '#f8f8f7',
      }}
    >
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', lg: 'flex-start' }}
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Stack direction="row" spacing={1.25} alignItems="center" flexWrap="wrap" useFlexGap>
          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Schedule of</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ width: 24, height: 24, bgcolor: '#203b55', fontSize: 11 }}>JS</Avatar>
            <Typography sx={{ color: '#0f7a59', fontWeight: 500 }}>Dr. Jhon Smith</Typography>
          </Stack>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Typography sx={{ fontSize: 10, fontWeight: 700 }}>
              OVERRIDE HOURS FOR SPECIFIC DAYS
            </Typography>
            <Tooltip
              placement="top"
              title="This is monthly scheduling. Select specific dates to set, change or override the hours."
            >
              <InfoRoundedIcon sx={{ fontSize: 16, color: '#0f7a59' }} />
            </Tooltip>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<ListRoundedIcon />}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              borderColor: '#dfe7e2',
              color: '#4b5d58',
              bgcolor: 'white',
            }}
          >
            List
          </Button>
          <Button
            variant="contained"
            startIcon={<CalendarMonthRoundedIcon />}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              bgcolor: '#0f7a59',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#0d664b', boxShadow: 'none' },
            }}
          >
            Calendar
          </Button>
        </Stack>
      </Stack>

      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid #e2e7e4',
          overflow: 'hidden',
          bgcolor: 'white',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={1.5}
          sx={{ px: 1.5, py: 1.1, borderBottom: '1px solid #e2e7e4', bgcolor: 'white' }}
        >
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <IconButton size="small" onClick={() => shiftMonth(-1)}>
              <ChevronLeftRoundedIcon fontSize="small" />
            </IconButton>
            <Select
              variant="standard"
              disableUnderline
              value={displayDate.getMonth()}
              onChange={handleMonthChange}
              sx={{ fontSize: 13, fontWeight: 600, minWidth: 92 }}
            >
              {monthNames.map((month, index) => (
                <MenuItem key={month} value={index}>
                  {month}
                </MenuItem>
              ))}
            </Select>
            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{displayDate.getFullYear()}</Typography>
            <IconButton size="small" onClick={() => shiftMonth(1)}>
              <ChevronRightRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Typography sx={{ fontSize: 11, color: '#62716d' }}>{nowLabel}</Typography>
        </Stack>

        <Box sx={{ overflowX: 'auto', bgcolor: 'white' }}>
          <Box sx={{ minWidth: 760 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
              {weekNames.map((day) => (
                <Box
                  key={day}
                  sx={{
                    py: 1.1,
                    textAlign: 'center',
                    fontSize: 11,
                    color: '#606c69',
                    borderRight: '1px solid #e2e7e4',
                    borderBottom: '1px solid #e2e7e4',
                    '&:last-of-type': { borderRight: 0 },
                  }}
                >
                  {day}
                </Box>
              ))}
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
              {gridDates.map((date, index) => {
                const key = toKey(date)
                const inMonth = date.getMonth() === displayDate.getMonth()
                const schedules = scheduleMap[key] ?? []
                const isSelected = selectedDateKey === key
                const isToday = isSameDate(date, new Date())
                const dotColor = schedules[0]?.dot ?? '#c0c3c1'

                return (
                  <Box
                    key={`${key}-${index}`}
                    onClick={(event) => handleCellClick(event, date)}
                    sx={{
                      minHeight: 86,
                      px: 1,
                      py: 1,
                      borderRight: index % 7 === 6 ? 0 : '1px solid #e2e7e4',
                      borderBottom: '1px solid #e2e7e4',
                      bgcolor: isSelected ? '#edf8f2' : isToday ? '#fff8e7' : 'white',
                      boxShadow: isSelected ? 'inset 0 0 0 1px #4ba881' : 'none',
                      color: inMonth ? '#273330' : '#b0b7b4',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography sx={{ fontSize: 12 }}>{getCellLabel(date, inMonth)}</Typography>
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '999px',
                          bgcolor: dotColor,
                          opacity: inMonth ? 1 : 0.55,
                        }}
                      />
                    </Stack>

                    {schedules.length === 0 ? (
                      <Typography sx={{ mt: 1.75, fontSize: 11, color: '#7a8380' }}>Day Off</Typography>
                    ) : (
                      <Stack spacing={0.65} sx={{ mt: 0.8 }}>
                        {schedules.map((schedule, scheduleIndex) => (
                          <Box
                            key={`${key}-${scheduleIndex}-${schedule.label}`}
                            sx={{
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: schedule.border,
                              bgcolor: schedule.bg,
                              px: 0.6,
                              py: 0.45,
                              opacity: schedule.kind === 'removed' ? 0.65 : 1,
                            }}
                          >
                            {schedule.kind === 'removed' ? (
                              <>
                                <Stack direction="row" spacing={0.4} alignItems="center">
                                  <WarningAmberRoundedIcon sx={{ fontSize: 12, color: '#d24d44' }} />
                                  <Typography
                                    sx={{
                                      fontSize: 9.2,
                                      color: '#5b5f5e',
                                      fontWeight: 500,
                                      lineHeight: 1.2,
                                    }}
                                  >
                                    Schedule removed
                                  </Typography>
                                </Stack>
                                <Button
                                  size="small"
                                  sx={{
                                    mt: 0.5,
                                    minWidth: 0,
                                    px: 0.75,
                                    py: 0.1,
                                    borderRadius: 1,
                                    border: '1px solid #d7dfdb',
                                    fontSize: 9,
                                    lineHeight: 1.2,
                                    textTransform: 'none',
                                    color: '#5a6663',
                                  }}
                                >
                                  Restore
                                </Button>
                              </>
                            ) : (
                              <>
                                <Stack direction="row" spacing={0.45} alignItems="center">
                                  <Box sx={{ color: schedule.text, display: 'flex', alignItems: 'center' }}>
                                    {schedule.icon}
                                  </Box>
                                  <Typography
                                    sx={{
                                      fontSize: 9.2,
                                      fontWeight: 600,
                                      color: schedule.text,
                                      lineHeight: 1.15,
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}
                                  >
                                    {schedule.label}
                                  </Typography>
                                </Stack>
                                <Typography sx={detailTextSx}>{schedule.detail}</Typography>
                                <Typography sx={detailTextSx}>{schedule.location}</Typography>
                                <Typography sx={detailTextSx}>{schedule.procedure}</Typography>
                              </>
                            )}
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Box>
      </Card>

      <Stack direction="row" justifyContent="center" spacing={2.5} flexWrap="wrap" useFlexGap sx={{ mt: 1.5 }}>
        <LegendItem color="#7b57be" label="OPD Consultation" />
        <LegendItem color="#ef6a61" label="Theater/Surgery" />
        <LegendItem color="#6db86d" label="Video consultation" />
        <LegendItem color="#bdbfbe" label="Dayoff" />
      </Stack>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        PaperProps={{
          sx: {
            mt: 1,
            width: 156,
            borderRadius: 1.5,
            border: '1px solid #d8e2dd',
            boxShadow: '0 14px 28px rgba(40, 55, 50, 0.14)',
          },
        }}
      >
        <Button
          fullWidth
          startIcon={<ScheduleRoundedIcon />}
          sx={{ justifyContent: 'flex-start', color: '#3a4b47', textTransform: 'none', px: 1.5, py: 1 }}
        >
          Schedule details
        </Button>
        <Button
          fullWidth
          startIcon={<EditRoundedIcon />}
          sx={{
            justifyContent: 'flex-start',
            color: '#3a4b47',
            textTransform: 'none',
            px: 1.5,
            py: 1,
            borderTop: '1px solid #edf2ef',
          }}
        >
          Edit Schedule
        </Button>
      </Popover>
    </Card>
  )
}

function LegendItem({ color, label }) {
  return (
    <Stack direction="row" spacing={0.75} alignItems="center">
      <Box sx={{ width: 6, height: 6, borderRadius: '999px', bgcolor: color }} />
      <Typography sx={{ fontSize: 11, color: '#5f6a67' }}>{label}</Typography>
    </Stack>
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

function buildScheduleMap(displayDate) {
  const month = displayDate.getMonth()
  const year = displayDate.getFullYear()
  const map = {}

  for (let day = 1; day <= 31; day += 1) {
    const date = new Date(year, month, day)
    if (date.getMonth() !== month) continue
    const key = toKey(date)
    const weekday = date.getDay()
    let schedules = []

    if ([1, 3, 6].includes(weekday)) {
      schedules = [baseScheduleTemplates.opd]
    }
    if ([2, 5].includes(weekday)) {
      schedules = [baseScheduleTemplates.surgery]
    }
    if (weekday === 4) {
      schedules = [baseScheduleTemplates.opd]
    }
    if (day === 8) {
      schedules = [baseScheduleTemplates.surgery]
    }
    if (day === 15 || day === 23) {
      schedules = [baseScheduleTemplates.video]
    }
    if (day === 17 || day === 20) {
      schedules = [baseScheduleTemplates.opd, baseScheduleTemplates.video]
    }
    if (day === 27) {
      schedules = [
        {
          ...baseScheduleTemplates.opd,
          bg: '#faf7fd',
          border: '#ece4f9',
          text: '#c9b6e6',
        },
        {
          kind: 'removed',
          label: 'Schedule removed',
          bg: '#fdfcfc',
          border: '#e7e4e4',
          text: '#5b5f5e',
          dot: '#bdbfbe',
        },
      ]
    }
    if ([1, 7, 14, 22, 28, 29].includes(day) && weekday === 0) {
      schedules = []
    }

    map[key] = schedules
  }

  return map
}

function getCellLabel(date, inMonth) {
  if (inMonth) return date.getDate()
  if (date.getDate() === 1) return `${monthNames[date.getMonth()].slice(0, 3)}1`
  return date.getDate()
}

function isSameDate(first, second) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  )
}

function toKey(date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

const detailTextSx = {
  mt: 0.25,
  fontSize: 8.4,
  color: '#66706d',
  lineHeight: 1.18,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

export default DetailedMonthlySchedulePage
