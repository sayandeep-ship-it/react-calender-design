import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Popover,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import EventBusyRoundedIcon from '@mui/icons-material/EventBusyRounded'
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const timelineStartHour = 7
const timelineEndHour = 18
const hourHeight = 72

const resourceFilters = [
  { key: 'staff', label: 'Staff', icon: <PersonRoundedIcon sx={{ fontSize: 15 }} /> },
  { key: 'facility', label: 'Facility', icon: <LocalHospitalRoundedIcon sx={{ fontSize: 15 }} /> },
  { key: 'equipment', label: 'Equipment', icon: <Inventory2RoundedIcon sx={{ fontSize: 15 }} /> },
]

function ResourceConsolidatedCalendarPage() {
  const initialDate = '2026-05-01'
  const [selectedDate, setSelectedDate] = useState(initialDate)
  const [month, setMonth] = useState(5)
  const [year, setYear] = useState(2026)
  const [view, setView] = useState('day')
  const [locationId, setLocationId] = useState('')
  const [timezone, setTimezone] = useState('Asia/Kolkata')
  const [filters, setFilters] = useState({ staff: true, facility: true, equipment: true })
  const [filterOpen, setFilterOpen] = useState(false)
  const [calendarData, setCalendarData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [source, setSource] = useState('sample')
  const [eventAnchor, setEventAnchor] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)

  const endpoint = useMemo(() => {
    const params = new URLSearchParams({
      month: String(month),
      year: String(year),
      timezone,
    })

    if (locationId) params.set('location_id', locationId)

    return `${API_BASE_URL}/api/resource-calendar/consolidated?${params.toString()}`
  }, [locationId, month, timezone, year])

  const fetchCalendar = async () => {
    setLoading(true)
    setError('')

    try {
      if (!API_BASE_URL) {
        setCalendarData(sampleCalendarResponse.data)
        setSource('sample')
        return
      }

      const response = await fetch(endpoint)
      const json = await response.json()

      if (!response.ok || !json.status) {
        throw new Error(json.message || json.error || 'Unable to fetch calendar')
      }

      setCalendarData(json.data)
      setSource('api')
    } catch (err) {
      setError(err.message)
      setCalendarData(sampleCalendarResponse.data)
      setSource('sample')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCalendar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint])

  const calendar = calendarData?.calendar || []
  const calendarMap = useMemo(() => {
    return calendar.reduce((acc, day) => {
      acc[day.date] = day
      return acc
    }, {})
  }, [calendar])

  const selectedDay = calendarMap[selectedDate] || calendar.find(hasDayEvents) || calendar[0]
  const displayDate = selectedDay?.date || selectedDate
  const displayEvents = useMemo(
    () => filterEvents(flattenDayEvents(selectedDay), filters),
    [filters, selectedDay],
  )
  const weekDates = useMemo(() => getWeekDates(displayDate), [displayDate])
  const monthDates = useMemo(() => getMonthGridDates(year, month), [month, year])
  const currentLineTop = getCurrentLineTop(displayDate)

  const changeDate = (nextDate) => {
    setSelectedDate(nextDate)
    const parsed = fromKey(nextDate)
    setMonth(parsed.getMonth() + 1)
    setYear(parsed.getFullYear())
  }

  const move = (step) => {
    const date = fromKey(displayDate)

    if (view === 'month') {
      date.setMonth(date.getMonth() + step)
      const next = toKey(new Date(date.getFullYear(), date.getMonth(), 1))
      changeDate(next)
      return
    }

    date.setDate(date.getDate() + (view === 'week' ? step * 7 : step))
    changeDate(toKey(date))
  }

  const openEvent = (event, anchor) => {
    setSelectedEvent(event)
    setEventAnchor(anchor)
  }

  const closeEvent = () => {
    setSelectedEvent(null)
    setEventAnchor(null)
  }

  return (
    <Stack spacing={2.5}>
      <Paper elevation={0} sx={pageShellSx}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} spacing={1.5} sx={toolbarSx}>
          <Stack direction="row" spacing={1.25} alignItems="center" flexWrap="wrap" useFlexGap>
            <Button variant="outlined" sx={toolbarButtonSx} onClick={() => changeDate(toKey(new Date()))}>
              Today
            </Button>
            <IconButton size="small" onClick={() => move(-1)}>
              <ChevronLeftRoundedIcon />
            </IconButton>
            <IconButton size="small" onClick={() => move(1)}>
              <ChevronRightRoundedIcon />
            </IconButton>
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#263a34', minWidth: 210 }}>
              {getHeaderTitle(displayDate, view, weekDates)}
            </Typography>
            <Box sx={{ height: 28, width: 1, bgcolor: '#cad8d1' }} />
            <TextField
              type="date"
              size="small"
              value={displayDate}
              onChange={(event) => changeDate(event.target.value)}
              sx={{ ...textFieldSx, width: 154 }}
            />
            <CalendarMonthRoundedIcon sx={{ color: '#263a34', fontSize: 20 }} />
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <TextField size="small" placeholder="Location" value={locationId} onChange={(event) => setLocationId(event.target.value)} sx={textFieldSx} />
            <Button variant="outlined" startIcon={<FilterListRoundedIcon />} sx={toolbarButtonSx} onClick={() => setFilterOpen((value) => !value)}>
              Filter
            </Button>
            <Select size="small" value={view} onChange={(event) => setView(event.target.value)} sx={selectSx}>
              <MenuItem value="day">Day</MenuItem>
              <MenuItem value="week">Week</MenuItem>
              <MenuItem value="month">Month</MenuItem>
            </Select>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress color="inherit" size={16} /> : <RefreshRoundedIcon />}
              onClick={fetchCalendar}
              sx={{ textTransform: 'none', bgcolor: '#0b7a57', borderRadius: 2, '&:hover': { bgcolor: '#096649' } }}
            >
              Refresh
            </Button>
          </Stack>
        </Stack>

        {filterOpen && (
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', md: 'center' }} sx={filterSx}>
            {resourceFilters.map((filter) => (
              <FormControlLabel
                key={filter.key}
                control={
                  <Checkbox
                    checked={filters[filter.key]}
                    onChange={(event) => setFilters((current) => ({ ...current, [filter.key]: event.target.checked }))}
                    size="small"
                  />
                }
                label={
                  <Stack direction="row" spacing={0.7} alignItems="center">
                    {filter.icon}
                    <Typography sx={{ fontSize: 13 }}>{filter.label}</Typography>
                  </Stack>
                }
              />
            ))}
            <TextField size="small" value={timezone} onChange={(event) => setTimezone(event.target.value)} label="Timezone" sx={{ width: 220 }} />
          </Stack>
        )}

        {error && (
          <Alert severity="warning" sx={{ m: 2, borderRadius: 2 }}>
            API failed, showing sample data. {error}
          </Alert>
        )}

        <Stack direction="row" spacing={1} sx={{ px: 2, py: 1.2, borderBottom: '1px solid #e7eee9' }} flexWrap="wrap" useFlexGap>
          <Chip size="small" label={`Source: ${source === 'api' ? 'API' : 'Sample'}`} sx={{ bgcolor: source === 'api' ? '#dcfce7' : '#fef3c7' }} />
          <Chip size="small" label={`Timezone: ${timezone}`} sx={{ bgcolor: '#eef7f3' }} />
          <Chip size="small" label={`${displayEvents.length} visible events`} sx={{ bgcolor: '#eef2ff' }} />
          <Legend label="Doctor schedule" color="#0f9f77" />
          <Legend label="Available" color="#0f9f77" />
          <Legend label="Occupied" color="#ef4444" />
        </Stack>

        {view === 'day' && (
          <DayTimeline
            date={displayDate}
            events={displayEvents}
            currentLineTop={currentLineTop}
            onEventClick={openEvent}
          />
        )}

        {view === 'week' && (
          <WeekView
            dates={weekDates}
            calendarMap={calendarMap}
            filters={filters}
            selectedDate={displayDate}
            onSelectDate={changeDate}
            onEventClick={openEvent}
          />
        )}

        {view === 'month' && (
          <MonthView
            dates={monthDates}
            month={month}
            calendarMap={calendarMap}
            filters={filters}
            selectedDate={displayDate}
            onSelectDate={changeDate}
            onEventClick={openEvent}
          />
        )}
      </Paper>

      <EventDetailsPopover anchorEl={eventAnchor} event={selectedEvent} onClose={closeEvent} />
    </Stack>
  )
}

function DayTimeline({ date, events, currentLineTop, onEventClick }) {
  return (
    <Box sx={{ px: 1.5, pb: 1.5, bgcolor: '#ffffff' }}>
      <Stack direction="row" sx={{ minHeight: 70 }}>
        <Box sx={{ width: 60, pt: 3.5 }}>
          <Typography sx={{ fontSize: 10, color: '#687972' }}>TZ+05:30</Typography>
        </Box>
        <Box sx={{ flex: 1, pt: 1 }}>
          <Stack alignItems="flex-start" sx={{ ml: 1 }}>
            <Typography sx={{ fontSize: 12, color: '#687972', fontWeight: 700 }}>{shortWeekday(date)}</Typography>
            <Box sx={dateCircleSx}>{fromKey(date).getDate()}</Box>
          </Stack>
        </Box>
      </Stack>

      <Box sx={{ display: 'flex', position: 'relative' }}>
        <TimeRail />
        <Box sx={timelineCanvasSx}>
          <TimelineGrid />
          {currentLineTop !== null && <CurrentLine top={currentLineTop} />}
          {events.map((event, index) => (
            <TimelineEvent
              key={`${event.source}-${event.id || event.assignment_id || event.schedule_id}-${index}`}
              event={event}
              lane={index % 3}
              onClick={onEventClick}
            />
          ))}
          {!events.length && <EmptyState />}
        </Box>
      </Box>
    </Box>
  )
}

function WeekView({ dates, calendarMap, filters, selectedDate, onSelectDate, onEventClick }) {
  return (
    <Box sx={{ bgcolor: '#ffffff', overflowX: 'auto' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '60px repeat(7, minmax(160px, 1fr))', minWidth: 1120 }}>
        <Box sx={{ borderRight: '1px solid #e2ebe5', borderBottom: '1px solid #e2ebe5' }} />
        {dates.map((date) => {
          const key = toKey(date)
          return (
            <Box
              key={key}
              onClick={() => onSelectDate(key)}
              sx={{
                p: 1,
                borderRight: '1px solid #e2ebe5',
                borderBottom: '1px solid #e2ebe5',
                bgcolor: key === selectedDate ? '#edfdf8' : '#fbfdfb',
                cursor: 'pointer',
              }}
            >
              <Typography sx={{ fontSize: 12, color: '#687972', fontWeight: 700 }}>{shortWeekday(key)}</Typography>
              <Box sx={{ ...dateCircleSx, width: 30, height: 30, mt: 0.5 }}>{date.getDate()}</Box>
            </Box>
          )
        })}

        <Box sx={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '60px repeat(7, minmax(160px, 1fr))', minHeight: timelineHours().length * hourHeight }}>
          <TimeRail />
          {dates.map((date) => {
            const key = toKey(date)
            const events = filterEvents(flattenDayEvents(calendarMap[key]), filters)
            return (
              <Box key={key} sx={{ position: 'relative', borderRight: '1px solid #e2ebe5' }}>
                <TimelineGrid />
                {events.map((event, index) => (
                  <TimelineEvent
                    key={`${key}-${event.source}-${event.id || event.assignment_id || index}`}
                    event={event}
                    lane={index % 2}
                    compact
                    onClick={onEventClick}
                  />
                ))}
              </Box>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}

function MonthView({ dates, month, calendarMap, filters, selectedDate, onSelectDate, onEventClick }) {
  return (
    <Box sx={{ bgcolor: '#ffffff' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', borderBottom: '1px solid #e2ebe5' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <Typography key={day} sx={{ p: 1, textAlign: 'center', color: '#687972', fontSize: 12, fontWeight: 700 }}>
            {day}
          </Typography>
        ))}
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
        {dates.map((date) => {
          const key = toKey(date)
          const events = filterEvents(flattenDayEvents(calendarMap[key]), filters)
          const inMonth = date.getMonth() + 1 === month
          return (
            <Box
              key={key}
              onClick={() => onSelectDate(key)}
              sx={{
                minHeight: 150,
                p: 1,
                borderRight: '1px solid #e2ebe5',
                borderBottom: '1px solid #e2ebe5',
                bgcolor: key === selectedDate ? '#edfdf8' : inMonth ? '#ffffff' : '#f7faf8',
                opacity: inMonth ? 1 : 0.58,
                cursor: 'pointer',
              }}
            >
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: 13, fontWeight: 800, color: '#263a34' }}>{date.getDate()}</Typography>
                <Chip size="small" label={events.length} sx={{ height: 20, bgcolor: '#eef7f3' }} />
              </Stack>
              <Stack spacing={0.55} sx={{ mt: 1 }}>
                {events.slice(0, 3).map((event, index) => {
                  const meta = getEventMeta(event.event_type)
                  return (
                    <Box
                      key={`${key}-${event.source}-${index}`}
                      onClick={(clickEvent) => {
                        clickEvent.stopPropagation()
                        onEventClick(event, clickEvent.currentTarget)
                      }}
                      sx={{
                        border: `1px solid ${meta.border}`,
                        bgcolor: meta.bg,
                        color: '#263a34',
                        borderRadius: 1,
                        px: 0.75,
                        py: 0.45,
                      }}
                    >
                      <Typography noWrap sx={{ fontSize: 10.5, fontWeight: 800 }}>
                        {formatTime(event.start_time)} {event.resource_name}
                      </Typography>
                    </Box>
                  )
                })}
                {events.length > 3 && <Typography sx={{ fontSize: 11, color: '#60746d' }}>+{events.length - 3} more</Typography>}
              </Stack>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

function TimelineEvent({ event, lane, compact = false, onClick }) {
  const meta = getEventMeta(event.event_type)
  const top = timeToTop(event.start_time)
  const height = Math.max(timeToTop(event.end_time) - top, compact ? 24 : 30)
  const isDoctorBase = event.event_type === 'doctor_rota'
  const width = isDoctorBase ? 'calc(100% - 16px)' : `calc(100% - ${lane * 34 + 58}px)`

  return (
    <Box
      onClick={(clickEvent) => onClick(event, clickEvent.currentTarget)}
      sx={{
        position: 'absolute',
        top,
        left: isDoctorBase ? 8 : 50 + lane * 34,
        width,
        minHeight: height,
        border: `1px solid ${meta.border}`,
        bgcolor: meta.bg,
        borderRadius: 1.2,
        px: 1,
        py: compact ? 0.35 : 0.6,
        zIndex: event.event_type === 'blocked' ? 4 : isDoctorBase ? 1 : 2,
        boxShadow: event.event_type === 'blocked' ? '0 4px 10px rgba(220,38,38,0.08)' : 'none',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: compact ? 10 : 11, fontWeight: 800, color: '#273832' }} noWrap>
            {event.resource_name || 'Unnamed resource'} - {event.label}
          </Typography>
          <Typography sx={{ fontSize: compact ? 9.5 : 10.5, color: '#3f514b' }} noWrap>
            {event.schedule_type || event.source}
          </Typography>
          {!compact && (
            <Typography sx={{ fontSize: 10.5, color: '#3f514b' }}>
              {formatTime(event.start_time)}-{formatTime(event.end_time)}
            </Typography>
          )}
        </Box>
        <Stack direction="row" spacing={0.7} alignItems="center" sx={{ mt: 0.2 }}>
          <Typography sx={{ fontSize: 9.5, color: '#263a34' }}>{meta.label}</Typography>
          <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: meta.dot }} />
        </Stack>
      </Stack>
    </Box>
  )
}

function EventDetailsPopover({ anchorEl, event, onClose }) {
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      PaperProps={{ sx: { width: 320, borderRadius: 3, border: '1px solid #dfe9e4', boxShadow: '0 18px 44px rgba(38,58,52,0.18)' } }}
    >
      {event && (
        <Box sx={{ p: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            {getResourceIcon(event.resource_type)}
            <Box>
              <Typography sx={{ fontSize: 15, fontWeight: 900, color: '#263a34' }}>{event.resource_name || 'Unnamed resource'}</Typography>
              <Typography sx={{ fontSize: 12, color: '#667970' }}>{getEventMeta(event.event_type).label}</Typography>
            </Box>
          </Stack>
          <Divider sx={{ my: 1.5 }} />
          <DetailRow label="Time" value={`${formatTime(event.start_time)} - ${formatTime(event.end_time)}`} />
          <DetailRow label="Schedule" value={event.schedule_type || '--'} />
          <DetailRow label="Resource type" value={event.resource_type || '--'} />
          <DetailRow label="Source" value={event.source || '--'} />
          <DetailRow label="Schedule ID" value={event.schedule_id || event.resource_schedule_id || '--'} />
          <DetailRow label="Assignment ID" value={event.assignment_id || '--'} />
          <DetailRow label="Location" value={event.location_id || '--'} />
        </Box>
      )}
    </Popover>
  )
}

function DetailRow({ label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ py: 0.55 }}>
      <Typography sx={{ fontSize: 12, color: '#74847e' }}>{label}</Typography>
      <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#263a34', textAlign: 'right' }}>{value}</Typography>
    </Stack>
  )
}

function TimeRail() {
  return (
    <Box sx={{ width: 60, flexShrink: 0 }}>
      {timelineHours().map((hour) => (
        <Box key={hour} sx={{ height: hourHeight, pt: 0.8, textAlign: 'right', pr: 1.2 }}>
          <Typography sx={{ fontSize: 12, color: '#3f4f49' }}>{formatHour(hour)}</Typography>
        </Box>
      ))}
    </Box>
  )
}

function TimelineGrid() {
  return timelineHours().map((hour, index) => (
    <Box key={hour} sx={{ position: 'absolute', top: index * hourHeight, left: 0, right: 0, borderTop: '1px solid #dfe5e2' }} />
  ))
}

function CurrentLine({ top }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top,
        left: 0,
        right: 0,
        borderTop: '1px dotted #ef4444',
        zIndex: 5,
        '&:before': {
          content: '""',
          position: 'absolute',
          left: -8,
          top: -4,
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: '#ef4444',
        },
      }}
    />
  )
}

function EmptyState() {
  return (
    <Box sx={{ pt: 8, textAlign: 'center', color: '#7a8a84' }}>
      <Typography sx={{ fontWeight: 700 }}>No resources plotted for this period</Typography>
      <Typography sx={{ fontSize: 13 }}>Change the date, view, or resource filters.</Typography>
    </Box>
  )
}

function flattenDayEvents(day) {
  if (!day) return []

  const doctorSchedules = day.doctor_schedules || day.staff || []
  const blockedResources = day.blocked_resources || [
    ...(day.facilities || []).filter((item) => item.event_type === 'blocked'),
    ...(day.equipments || []).filter((item) => item.event_type === 'blocked'),
  ]
  const facilityAvailability = day.facility_availability || (day.facilities || []).filter((item) => item.event_type === 'availability')
  const equipmentAvailability = day.equipment_availability || (day.equipments || []).filter((item) => item.event_type === 'availability')

  return [
    ...doctorSchedules.map((item) => ({ ...item, event_type: 'doctor_rota', resource_type: 'staff', label: 'Doctor schedule' })),
    ...facilityAvailability.map((item) => ({ ...item, event_type: 'availability', resource_type: 'facility', label: 'Facility available' })),
    ...equipmentAvailability.map((item) => ({ ...item, event_type: 'availability', resource_type: 'equipment', label: 'Equipment available' })),
    ...blockedResources.map((item) => ({
      ...item,
      event_type: 'blocked',
      label: item.resource_type === 'equipment' ? 'Equipment occupied' : 'Facility occupied',
    })),
  ].sort((a, b) => {
    const timeDiff = minutesFromTime(a.start_time) - minutesFromTime(b.start_time)
    if (timeDiff !== 0) return timeDiff
    if (a.event_type === 'doctor_rota') return -1
    if (b.event_type === 'doctor_rota') return 1
    return 0
  })
}

function filterEvents(events, filters) {
  return events.filter((event) => {
    const type = event.resource_type || (event.event_type === 'doctor_rota' ? 'staff' : '')
    return filters[type] !== false
  })
}

function hasDayEvents(day) {
  return Boolean(day?.doctor_schedules?.length || day?.blocked_resources?.length || day?.facility_availability?.length || day?.equipment_availability?.length || day?.facilities?.length || day?.equipments?.length || day?.staff?.length)
}

function timelineHours() {
  return Array.from({ length: timelineEndHour - timelineStartHour + 1 }, (_, index) => timelineStartHour + index)
}

function timeToTop(value) {
  const minutes = minutesFromTime(value)
  const startMinutes = timelineStartHour * 60
  const endMinutes = timelineEndHour * 60
  const clamped = Math.min(Math.max(minutes, startMinutes), endMinutes)
  return ((clamped - startMinutes) / 60) * hourHeight
}

function minutesFromTime(value) {
  if (!value) return timelineStartHour * 60
  const [hour = 0, minute = 0] = String(value).split(':').map(Number)
  return hour * 60 + minute
}

function getCurrentLineTop(displayDate) {
  const now = new Date()
  if (displayDate !== toKey(now)) return null
  const current = now.getHours() * 60 + now.getMinutes()
  if (current < timelineStartHour * 60 || current > timelineEndHour * 60) return null
  return ((current - timelineStartHour * 60) / 60) * hourHeight
}

function getWeekDates(dateKey) {
  const date = fromKey(dateKey)
  const start = new Date(date)
  start.setDate(date.getDate() - date.getDay())
  return Array.from({ length: 7 }, (_, index) => {
    const next = new Date(start)
    next.setDate(start.getDate() + index)
    return next
  })
}

function getMonthGridDates(year, month) {
  const first = new Date(year, month - 1, 1)
  const start = new Date(first)
  start.setDate(first.getDate() - first.getDay())
  return Array.from({ length: 42 }, (_, index) => {
    const next = new Date(start)
    next.setDate(start.getDate() + index)
    return next
  })
}

function getHeaderTitle(dateKey, view, weekDates) {
  if (view === 'month') {
    return fromKey(dateKey).toLocaleDateString('en', { month: 'long', year: 'numeric' })
  }

  if (view === 'week') {
    return `${formatShortDate(toKey(weekDates[0]))} - ${formatShortDate(toKey(weekDates[6]))}`
  }

  return formatLongDate(dateKey)
}

function formatHour(hour) {
  if (hour === 0) return '12 AM'
  if (hour < 12) return `${hour} AM`
  if (hour === 12) return '12 PM'
  return `${hour - 12} PM`
}

function formatTime(value) {
  if (!value) return '--'
  const [hour = 0, minute = 0] = String(value).split(':').map(Number)
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${String(minute).padStart(2, '0')} ${suffix}`
}

function formatLongDate(value) {
  return fromKey(value).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })
}

function formatShortDate(value) {
  return fromKey(value).toLocaleDateString('en', { month: 'short', day: 'numeric' })
}

function shortWeekday(value) {
  return fromKey(value).toLocaleDateString('en', { weekday: 'short' })
}

function toKey(date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function fromKey(value) {
  const [year, month, day] = String(value).split('-').map(Number)
  return new Date(year, month - 1, day)
}

function getResourceIcon(type) {
  if (type === 'facility') return <LocalHospitalRoundedIcon sx={{ color: '#0f766e' }} />
  if (type === 'equipment') return <Inventory2RoundedIcon sx={{ color: '#b45309' }} />
  return <PersonRoundedIcon sx={{ color: '#2563eb' }} />
}

function getEventMeta(eventType) {
  if (eventType === 'blocked') {
    return { label: 'Occupied', border: '#f19999', bg: '#fff1f1', dot: '#22c55e' }
  }

  if (eventType === 'doctor_rota') {
    return { label: 'Doctor schedule', border: '#86dcc8', bg: '#edfffb', dot: '#22c55e' }
  }

  return { label: 'Available', border: '#86dcc8', bg: '#edfffb', dot: '#22c55e' }
}

function Legend({ label, color }) {
  return (
    <Stack direction="row" spacing={0.65} alignItems="center">
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }} />
      <Typography sx={{ fontSize: 12, color: '#536862' }}>{label}</Typography>
    </Stack>
  )
}

const pageShellSx = {
  borderRadius: 4,
  border: '1px solid #dfe9e4',
  overflow: 'hidden',
  bgcolor: '#fbfdfb',
  boxShadow: '0 18px 46px rgba(40, 63, 55, 0.08)',
}

const toolbarSx = {
  px: 2,
  py: 1.25,
  bgcolor: '#f8fcf7',
  borderBottom: '1px solid #e3ebe6',
}

const filterSx = {
  px: 2,
  py: 1.25,
  bgcolor: '#ffffff',
  borderBottom: '1px solid #e7eee9',
}

const timelineCanvasSx = {
  flex: 1,
  position: 'relative',
  minHeight: timelineHours().length * hourHeight,
  borderLeft: '1px solid #edf2ef',
}

const dateCircleSx = {
  mt: 0.5,
  width: 34,
  height: 34,
  borderRadius: '50%',
  display: 'grid',
  placeItems: 'center',
  bgcolor: '#0f9f77',
  color: 'white',
  fontWeight: 800,
}

const toolbarButtonSx = {
  height: 34,
  borderRadius: 2,
  textTransform: 'none',
  borderColor: '#d7e1dc',
  color: '#263a34',
  bgcolor: 'white',
}

const selectSx = {
  height: 34,
  minWidth: 82,
  bgcolor: 'white',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d7e1dc' },
  '& .MuiSelect-select': { py: 0.7, fontSize: 13 },
}

const textFieldSx = {
  width: 104,
  '& .MuiInputBase-root': {
    height: 34,
    bgcolor: 'white',
    fontSize: 13,
  },
}

const sampleCalendarResponse = {
  data: {
    month: 5,
    year: 2026,
    timezone: 'Asia/Kolkata',
    calendar: [
      {
        date: '2026-05-01',
        day_name: 'Friday',
        doctor_schedules: [
          {
            event_type: 'doctor_rota',
            source: 'rota_staff_assignment',
            rota_staff_assignment_id: 12,
            resource_id: 19,
            resource_name: 'Dr Kavita Roy',
            schedule_type: 'OPD Consultation',
            start_time: '09:00:00',
            end_time: '17:00:00',
          },
        ],
        facility_availability: [
          {
            event_type: 'availability',
            source: 'resource_schedule',
            schedule_id: 301,
            resource_id: 4,
            resource_name: 'Consultation Room 1',
            resource_type: 'facility',
            schedule_type: 'OPD Consultation',
            start_time: '09:00:00',
            end_time: '17:00:00',
          },
        ],
        equipment_availability: [
          {
            event_type: 'availability',
            source: 'resource_schedule',
            schedule_id: 302,
            resource_id: 8,
            resource_name: 'ECG Machine',
            resource_type: 'equipment',
            schedule_type: 'OPD Consultation',
            start_time: '09:00:00',
            end_time: '17:00:00',
          },
        ],
        blocked_resources: [
          {
            event_type: 'blocked',
            source: 'resource_template_assignment',
            assignment_id: 91,
            resource_id: 4,
            resource_name: 'Consultation Room 1',
            resource_type: 'facility',
            schedule_type: 'Booked by Dr Kavita Roy',
            start_time: '10:30:00',
            end_time: '11:30:00',
          },
          {
            event_type: 'blocked',
            source: 'resource_template_assignment',
            assignment_id: 92,
            resource_id: 8,
            resource_name: 'ECG Machine',
            resource_type: 'equipment',
            schedule_type: 'Booked by Dr Kavita Roy',
            start_time: '12:00:00',
            end_time: '13:00:00',
          },
        ],
      },
      {
        date: '2026-05-02',
        day_name: 'Saturday',
        doctor_schedules: [
          {
            event_type: 'doctor_rota',
            source: 'rota_staff_assignment',
            rota_staff_assignment_id: 14,
            resource_id: 22,
            resource_name: 'Dr Sanjay Dey',
            schedule_type: 'Theater / Surgery',
            start_time: '08:00:00',
            end_time: '15:00:00',
          },
        ],
        facility_availability: [],
        equipment_availability: [],
        blocked_resources: [
          {
            event_type: 'blocked',
            source: 'resource_template_assignment',
            assignment_id: 96,
            resource_id: 2,
            resource_name: 'OT Room 2',
            resource_type: 'facility',
            schedule_type: 'Surgery booking',
            start_time: '09:30:00',
            end_time: '12:30:00',
          },
        ],
      },
    ],
  },
}

export default ResourceConsolidatedCalendarPage
