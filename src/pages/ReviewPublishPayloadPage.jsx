import { useMemo, useState } from 'react'
import {
  Avatar,
  Box,
  Card,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const weekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const steps = ['Basic info', 'Location', 'Capabilities', 'Availability Setup', 'Status rules', 'Review & publish']

const scheduleColorMap = {
  'OPD Consultation': '#5d3b99',
  'Theater / Surgery': '#de3a31',
  'Video Consultation': '#2f8a43',
}

const seededScheduleDays = [
  { date: '2026-04-05', schedules: [
    { id: 40, location_id: 6, location: { id: 6, name: 'check it', city: 'Kolkata' }, sub_location_id: 3, sub_location: { id: 3, sub_location_name: 'add on table ', sub_location_type: 'Ward' }, start_time: '09:00:00', end_time: '11:00:00', schedule_type: 'OPD Consultation', start_date: '2026-04-05', end_date: '2026-04-05' },
    { id: 43, location_id: 1, location: { id: 1, name: '520 West Cowley Drive', city: 'Commodi est minim en' }, sub_location_id: 4, sub_location: { id: 4, sub_location_name: 'Sdf', sub_location_type: 'Other' }, start_time: '10:00:00', end_time: '13:00:00', schedule_type: 'OPD Consultation', start_date: '2026-04-05', end_date: '2026-04-05' },
    { id: 44, location_id: 6, location: { id: 6, name: 'check it', city: 'Kolkata' }, sub_location_id: 1, sub_location: { id: 1, sub_location_name: null, sub_location_type: null }, start_time: '14:00:00', end_time: '17:00:00', schedule_type: 'Theater / Surgery', start_date: '2026-04-05', end_date: '2026-04-05' },
  ]},
  { date: '2026-04-07', schedules: [
    { id: 41, location_id: 6, location: { id: 6, name: 'check it', city: 'Kolkata' }, sub_location_id: 3, sub_location: { id: 3, sub_location_name: 'add on table ', sub_location_type: 'Ward' }, start_time: '09:00:00', end_time: '11:00:00', schedule_type: 'Theater / Surgery', start_date: '2026-04-07', end_date: '2026-04-07' },
    { id: 45, location_id: 6, location: { id: 6, name: 'check it', city: 'Kolkata' }, sub_location_id: 1, sub_location: { id: 1, sub_location_name: null, sub_location_type: null }, start_time: '14:00:00', end_time: '17:00:00', schedule_type: 'Video Consultation', start_date: '2026-04-07', end_date: '2026-04-07' },
  ]},
  { date: '2026-04-08', schedules: [
    { id: 42, location_id: 6, location: { id: 6, name: 'check it', city: 'Kolkata' }, sub_location_id: 3, sub_location: { id: 3, sub_location_name: 'add on table ', sub_location_type: 'Ward' }, start_time: '09:00:00', end_time: '11:00:00', schedule_type: 'Video Consultation', start_date: '2026-04-08', end_date: '2026-04-08' },
    { id: 46, location_id: 6, location: { id: 6, name: 'check it', city: 'Kolkata' }, sub_location_id: 1, sub_location: { id: 1, sub_location_name: null, sub_location_type: null }, start_time: '14:00:00', end_time: '17:00:00', schedule_type: 'Theater / Surgery', start_date: '2026-04-08', end_date: '2026-04-08' },
  ]},
  { date: '2026-04-09', schedules: [
    { id: 47, location_id: 4, location: { id: 4, name: 'Test Location', city: 'Kolkata' }, sub_location_id: 0, sub_location: null, start_time: '09:00:00', end_time: '17:00:00', schedule_type: 'OPD Consultation', start_date: '2026-04-09', end_date: '2026-04-09' },
    { id: 49, location_id: 6, location: { id: 6, name: 'check it', city: 'Kolkata' }, sub_location_id: 3, sub_location: { id: 3, sub_location_name: 'add on table ', sub_location_type: 'Ward' }, start_time: '09:01:00', end_time: '11:00:00', schedule_type: 'Theater / Surgery', start_date: '2026-04-09', end_date: '2026-04-09' },
  ]},
  { date: '2026-04-10', schedules: [
    { id: 50, location_id: 6, location: { id: 6, name: 'check it', city: 'Kolkata' }, sub_location_id: 3, sub_location: { id: 3, sub_location_name: 'add on table ', sub_location_type: 'Ward' }, start_time: '09:01:00', end_time: '11:00:00', schedule_type: 'Theater / Surgery', start_date: '2026-04-10', end_date: '2026-04-10' },
  ]},
  { date: '2026-04-14', schedules: [
    { id: 48, location_id: 6, location: { id: 6, name: 'check it', city: 'Kolkata' }, sub_location_id: 3, sub_location: { id: 3, sub_location_name: 'add on table ', sub_location_type: 'Ward' }, start_time: '09:00:00', end_time: '11:00:00', schedule_type: 'Video Consultation', start_date: '2026-04-14', end_date: '2026-04-14' },
  ]},
  { date: '2026-04-19', schedules: [
    { id: 51, location_id: 6, location: { id: 6, name: 'check it', city: 'Kolkata' }, sub_location_id: 3, sub_location: { id: 3, sub_location_name: 'add on table ', sub_location_type: 'Ward' }, start_time: '09:00:00', end_time: '11:00:00', schedule_type: 'Theater / Surgery', start_date: '2026-04-19', end_date: '2026-04-19' },
  ]},
]

const calendarApiResponse = {
  status: true,
  message: 'Calendar fetched successfully',
  data: {
    staff_id: 2,
    month: 4,
    year: 2026,
    timezone: 'Asia/Kolkata',
    calendar: buildCalendarMonth(2026, 4, seededScheduleDays),
  },
}

function ReviewPublishPayloadPage() {
  const [displayDate, setDisplayDate] = useState(new Date(calendarApiResponse.data.year, calendarApiResponse.data.month - 1, 1))
  const [selectedDateKey, setSelectedDateKey] = useState('2026-04-09')

  const dates = useMemo(() => getMonthGridDates(displayDate), [displayDate])
  const calendarLookup = useMemo(() => new Map(calendarApiResponse.data.calendar.map((entry) => [entry.date, entry])), [])
  const selectedDate = fromKey(selectedDateKey)
  const selectedEntry = calendarLookup.get(selectedDateKey)
  const selectedSummary = getScheduleSummary(selectedEntry?.schedules ?? [])

  const uniqueLocationCount = useMemo(() => {
    const ids = new Set()
    calendarApiResponse.data.calendar.forEach((entry) => entry.schedules.forEach((schedule) => ids.add(schedule.location_id)))
    return ids.size
  }, [])

  const totalScheduleTypes = useMemo(() => {
    const types = new Set()
    calendarApiResponse.data.calendar.forEach((entry) => entry.schedules.forEach((schedule) => types.add(schedule.schedule_type)))
    return types.size
  }, [])

  const handleMonthChange = (event) => {
    setDisplayDate(new Date(displayDate.getFullYear(), Number(event.target.value), 1))
  }

  const handleYearChange = (event) => {
    setDisplayDate(new Date(Number(event.target.value), displayDate.getMonth(), 1))
  }

  const shiftMonth = (step) => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + step, 1))
  }

  return (
    <Stack spacing={3}>
      <Card elevation={0} sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 4, border: '1px solid #e6ebe8', boxShadow: '0 18px 36px rgba(44, 57, 53, 0.08)' }}>
        <Stack direction={{ xs: 'column', xl: 'row' }} spacing={2} alignItems={{ xs: 'stretch', xl: 'center' }} justifyContent="space-between">
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} flexWrap="wrap" useFlexGap>
            {steps.map((step, index) => {
              const current = index === steps.length - 1
              return (
                <Stack key={step} direction="row" spacing={1.5} alignItems="center">
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 1.75, py: 1.25, borderRadius: 999, bgcolor: '#f7f8f7' }}>
                    <Box sx={{ width: 28, height: 28, borderRadius: '999px', display: 'grid', placeItems: 'center', bgcolor: current ? '#ff7a21' : '#0b7a57', color: 'white', fontSize: 13, fontWeight: 700 }}>
                      {current ? '6' : <CheckRoundedIcon sx={{ fontSize: 18 }} />}
                    </Box>
                    <Typography sx={{ fontSize: 12.5, fontWeight: 500 }}>{step}</Typography>
                  </Stack>
                  {index < steps.length - 1 && <ArrowForwardRoundedIcon sx={{ color: '#778783', fontSize: 18 }} />}
                </Stack>
              )
            })}
          </Stack>
        </Stack>
      </Card>

      <Card elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 4, border: '1px solid #e6ebe8', boxShadow: '0 18px 36px rgba(44, 57, 53, 0.08)' }}>
        <Typography variant="h4" sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 700, mb: 2.5 }}>
          Review and Publish
        </Typography>

        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2.5}>
          <Card elevation={0} sx={{ flex: 1.05, borderRadius: 3, border: '1px solid #e2e8e4', bgcolor: '#fbfcfb', p: 2 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700 }}>Summary</Typography>

            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 2 }}>
              <Avatar sx={{ width: 72, height: 72, bgcolor: '#264462', fontSize: 24 }}>JS</Avatar>
              <Box>
                <Typography sx={{ fontSize: 16, fontWeight: 700 }}>John Smith</Typography>
                <Typography sx={{ mt: 0.25, color: '#697a75' }}>Doctor • DOC-1256</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1.25 }} flexWrap="wrap" useFlexGap>
                  <Chip label="Body lift Surgery" size="small" sx={chipSx} />
                  <Chip label="Arm Surgery" size="small" sx={chipSx} />
                </Stack>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <SummaryRow icon={<PlaceRoundedIcon sx={{ fontSize: 18 }} />} label="Locations" value={String(uniqueLocationCount)} />
            <SummaryRow icon={<CalendarMonthRoundedIcon sx={{ fontSize: 18 }} />} label="Availability set" value={`Monthly (${monthNames[calendarApiResponse.data.month - 1].slice(0, 3)} ${calendarApiResponse.data.year})`} />
            <SummaryRow icon={<ScheduleRoundedIcon sx={{ fontSize: 18 }} />} label="Total Schedule Type" value={String(totalScheduleTypes)} />

            <Box sx={{ mt: 2, p: 1.5, borderRadius: 2.5, bgcolor: '#f4f7f5', border: '1px solid #e2e8e4' }}>
              <Typography sx={{ fontSize: 12, color: '#5f716c', fontWeight: 700 }}>Selected date</Typography>
              <Typography sx={{ mt: 0.5, fontSize: 14, fontWeight: 700 }}>
                {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
                {selectedSummary.map((item) => (
                  <LegendPill key={item.label} color={item.color} label={item.label} />
                ))}
              </Stack>
            </Box>
          </Card>

          <Card elevation={0} sx={{ flex: 0.9, borderRadius: 3, border: '1px solid #e2e8e4', overflow: 'hidden' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 1.5, py: 1.25, borderBottom: '1px solid #e2e8e4' }}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <IconButton size="small" onClick={() => shiftMonth(-1)}>
                  <ChevronLeftRoundedIcon fontSize="small" />
                </IconButton>
                <Select variant="standard" disableUnderline value={displayDate.getMonth()} onChange={handleMonthChange} sx={{ fontSize: 13, fontWeight: 700, minWidth: 78 }}>
                  {monthNames.map((month, index) => (
                    <MenuItem key={month} value={index}>{month}</MenuItem>
                  ))}
                </Select>
              </Stack>

              <Stack direction="row" spacing={0.5} alignItems="center">
                <Select variant="standard" disableUnderline value={displayDate.getFullYear()} onChange={handleYearChange} sx={{ fontSize: 13, fontWeight: 700, minWidth: 70 }}>
                  {Array.from({ length: 16 }, (_, index) => 2023 + index).map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
                <IconButton size="small" onClick={() => shiftMonth(1)}>
                  <ChevronRightRoundedIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>

            <Box sx={{ px: 1.5, pt: 1.25 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', mb: 1.25 }}>
                {weekNames.map((day) => (
                  <Typography key={day} align="center" sx={{ fontSize: 10, color: '#8b9692' }}>{day}</Typography>
                ))}
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 1, pb: 1.5 }}>
                {dates.map((date) => {
                  const key = toKey(date)
                  const inMonth = date.getMonth() === displayDate.getMonth()
                  const selected = key === selectedDateKey
                  const entry = calendarLookup.get(key)
                  const dots = getScheduleDots(entry?.schedules ?? [], inMonth)

                  return (
                    <Box key={key} sx={{ display: 'grid', placeItems: 'center', minHeight: 42 }}>
                      <IconButton
                        onClick={() => setSelectedDateKey(key)}
                        sx={{
                          width: 30,
                          height: 30,
                          border: '1px solid',
                          borderColor: selected ? '#4ba881' : '#dfe7e2',
                          bgcolor: selected ? '#eef8f2' : 'white',
                          color: inMonth ? '#384845' : '#b0b7b4',
                          fontSize: 12,
                          position: 'relative',
                          '&:hover': { bgcolor: selected ? '#e7f4ee' : '#f6faf8' },
                        }}
                      >
                        {date.getDate()}
                        <Stack direction="row" spacing={0.3} sx={{ position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)' }}>
                          {dots.map((dot, index) => (
                            <Box key={`${key}-${index}`} sx={{ width: 5, height: 5, borderRadius: '999px', bgcolor: dot }} />
                          ))}
                        </Stack>
                      </IconButton>
                    </Box>
                  )
                })}
              </Box>
            </Box>

            <Stack direction="row" justifyContent="center" spacing={2} flexWrap="wrap" useFlexGap sx={{ px: 1.5, py: 1.25, borderTop: '1px solid #edf2ef' }}>
              <LegendItem color="#5d3b99" label="OPD Consultation" />
              <LegendItem color="#de3a31" label="Theater/Surgery" />
              <LegendItem color="#2f8a43" label="Video consultation" />
              <LegendItem color="#c2c7c4" label="Dayoff" />
            </Stack>
          </Card>
        </Stack>
      </Card>
    </Stack>
  )
}

function SummaryRow({ icon, label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1.4, borderRadius: 2.5, bgcolor: 'white', border: '1px solid #edf2ef', '& + &': { mt: 1 } }}>
      <Stack direction="row" spacing={1.25} alignItems="center">
        <Box sx={{ width: 24, height: 24, borderRadius: '999px', display: 'grid', placeItems: 'center', bgcolor: '#eef8f2', color: '#0b7a57' }}>
          {icon}
        </Box>
        <Typography sx={{ fontSize: 14 }}>{label}</Typography>
      </Stack>
      <Typography sx={{ fontSize: 14, color: '#5f716c' }}>{value}</Typography>
    </Stack>
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

function LegendPill({ color, label }) {
  return <Chip label={label} size="small" sx={{ bgcolor: '#f6faf8', border: `1px solid ${color}`, color: '#466059', '& .MuiChip-label': { px: 1.25 } }} />
}

function buildCalendarMonth(year, month, scheduleDays) {
  const scheduleLookup = new Map(scheduleDays.map((item) => [item.date, item.schedules]))
  const lastDay = new Date(year, month, 0).getDate()
  return Array.from({ length: lastDay }, (_, index) => {
    const date = new Date(year, month - 1, index + 1)
    const dateKey = toKey(date)
    return {
      date: dateKey,
      dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
      schedules: scheduleLookup.get(dateKey) ?? [],
    }
  })
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

function getScheduleDots(schedules, inMonth) {
  if (!inMonth) return []
  if (schedules.length === 0) return ['#c2c7c4']
  return [...new Set(schedules.map((schedule) => scheduleColorMap[schedule.schedule_type]).filter(Boolean))]
}

function getScheduleSummary(schedules) {
  if (!schedules.length) return [{ color: '#c2c7c4', label: 'Dayoff' }]
  return [...new Set(schedules.map((schedule) => schedule.schedule_type))].map((type) => ({
    color: scheduleColorMap[type] ?? '#c2c7c4',
    label: type === 'Theater / Surgery' ? 'Theater/Surgery' : type,
  }))
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

const chipSx = {
  bgcolor: '#eef8f2',
  border: '1px solid #7bc5a5',
  color: '#486059',
}

export default ReviewPublishPayloadPage
