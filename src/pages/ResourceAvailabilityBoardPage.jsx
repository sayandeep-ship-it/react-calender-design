import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Popover,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded'

const categoryMeta = {
  equipment: { label: 'Equipment', accent: '#1f9a8b', bg: '#edf9f7' },
  facility: { label: 'Facility', accent: '#4e7dd7', bg: '#eef3fe' },
  staff: { label: 'Staff', accent: '#cf6b52', bg: '#fff2ed' },
}

const statusMeta = {
  available: { label: 'Available', color: '#1ba854' },
  occupied: { label: 'Occupied', color: '#d97822' },
  other: { label: 'Other', color: '#7c8794' },
}

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

const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const HOUR_HEIGHT = 55
const DAY_START_HOUR = 1
const DAY_END_HOUR = 23
const hours = Array.from({ length: DAY_END_HOUR - DAY_START_HOUR + 1 }, (_, index) => DAY_START_HOUR + index)
const initialDate = new Date()

function ResourceAvailabilityBoardPage() {
  const [selectedDate, setSelectedDate] = useState(initialDate)
  const [viewMode, setViewMode] = useState('day')
  const [filterAnchor, setFilterAnchor] = useState(null)
  const [categoryFilters, setCategoryFilters] = useState({
    equipment: true,
    facility: true,
    staff: true,
  })
  const [statusFilters, setStatusFilters] = useState({
    available: true,
    occupied: true,
    other: true,
  })
  const scrollRef = useRef(null)

  const dateKey = toKey(selectedDate)
  const monthGridDates = useMemo(() => getMonthGridDates(selectedDate), [selectedDate])
  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate])

  const visibleDayEvents = useMemo(
    () =>
      getEventsForDate(selectedDate).filter(
        (event) => categoryFilters[event.category] && statusFilters[event.status],
      ),
    [selectedDate, categoryFilters, statusFilters],
  )

  const visibleWeekEvents = useMemo(
    () =>
      weekDates.map((date) => ({
        date,
        events: getEventsForDate(date).filter(
          (event) => categoryFilters[event.category] && statusFilters[event.status],
        ),
      })),
    [weekDates, categoryFilters, statusFilters],
  )

  const visibleMonthEvents = useMemo(() => {
    const map = new Map()
    monthGridDates.forEach((date) => {
      map.set(
        toKey(date),
        getEventsForDate(date).filter(
          (event) => categoryFilters[event.category] && statusFilters[event.status],
        ),
      )
    })
    return map
  }, [monthGridDates, categoryFilters, statusFilters])

  const currentMarker = useMemo(() => {
    const now = new Date()
    const minutes = now.getHours() * 60 + now.getMinutes()
    return {
      dateKey: toKey(now),
      top: getPositionForMinutes(minutes),
    }
  }, [])

  useEffect(() => {
    if (!scrollRef.current) return

    const now = new Date()
    const inView =
      viewMode === 'day'
        ? isSameDate(selectedDate, now)
        : viewMode === 'week'
          ? weekDates.some((date) => isSameDate(date, now))
          : false

    if (!inView) {
      scrollRef.current.scrollTop = 0
      return
    }

    const targetTop = Math.max(currentMarker.top - 72, 0)
    scrollRef.current.scrollTop = targetTop
  }, [selectedDate, viewMode, weekDates, currentMarker.top])

  const handleShift = (step) => {
    const next = new Date(selectedDate)

    if (viewMode === 'month') {
      next.setMonth(next.getMonth() + step)
    } else if (viewMode === 'week') {
      next.setDate(next.getDate() + step * 7)
    } else {
      next.setDate(next.getDate() + step)
    }

    setSelectedDate(next)
  }

  const handleToday = () => {
    setSelectedDate(new Date())
  }

  const handleDateInput = (event) => {
    if (!event.target.value) return
    const [year, month, day] = event.target.value.split('-').map(Number)
    setSelectedDate(new Date(year, month - 1, day))
  }

  return (
    <Card
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 4,
        border: '1px solid #e4ebe7',
        boxShadow: '0 18px 36px rgba(44, 57, 53, 0.08)',
        bgcolor: '#fbfcfb',
      }}
    >
      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8e4', overflow: 'hidden' }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', md: 'center' }}
          spacing={1.25}
          sx={{ px: 1.5, py: 1, borderBottom: '1px solid #edf2ef', bgcolor: '#fbfef9' }}
        >
          <Stack direction="row" spacing={0.6} alignItems="center" flexWrap="wrap" useFlexGap>
            <Button onClick={handleToday} variant="outlined" sx={headerButtonSx}>
              Today
            </Button>
            <IconButton size="small" onClick={() => handleShift(-1)} sx={navButtonSx}>
              <ChevronLeftRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton size="small" onClick={() => handleShift(1)} sx={navButtonSx}>
              <ChevronRightRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>

            <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#33423e', px: 0.5 }}>
              {getHeaderLabel(selectedDate, viewMode)}
            </Typography>

            <Box sx={{ width: 1, height: 18, bgcolor: '#dfe7e2', mx: 0.25 }} />

            <label htmlFor="resource-availability-date">
              <Box sx={{ display: 'grid', placeItems: 'center', color: '#4f625d', cursor: 'pointer' }}>
                <CalendarMonthOutlinedIcon sx={{ fontSize: 18 }} />
              </Box>
            </label>
            <input
              id="resource-availability-date"
              type="date"
              value={dateKey}
              onChange={handleDateInput}
              style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
            />
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<FilterListRoundedIcon sx={{ fontSize: 15 }} />}
              onClick={(event) => setFilterAnchor(event.currentTarget)}
              sx={headerButtonSx}
            >
              Filter
            </Button>
            <Select
              size="small"
              value={viewMode}
              onChange={(event) => setViewMode(event.target.value)}
              sx={viewSelectSx}
            >
              <MenuItem value="day">Day</MenuItem>
              <MenuItem value="week">Week</MenuItem>
              <MenuItem value="month">Month</MenuItem>
            </Select>
          </Stack>
        </Stack>

        {viewMode === 'day' && (
          <DayView
            date={selectedDate}
            events={visibleDayEvents}
            currentMarker={isSameDate(selectedDate, new Date()) ? currentMarker : null}
            scrollRef={scrollRef}
          />
        )}

        {viewMode === 'week' && (
          <WeekView
            dates={weekDates}
            dayEvents={visibleWeekEvents}
            currentMarker={currentMarker}
            scrollRef={scrollRef}
          />
        )}

        {viewMode === 'month' && (
          <MonthView
            dates={monthGridDates}
            eventMap={visibleMonthEvents}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        )}
      </Paper>

      <Stack direction="row" spacing={2.25} flexWrap="wrap" useFlexGap sx={{ mt: 1.5, px: 0.5 }}>
        <LegendDot color={categoryMeta.equipment.accent} label="Equipment" />
        <LegendDot color={categoryMeta.facility.accent} label="Facility" />
        <LegendDot color={categoryMeta.staff.accent} label="Staff" />
        <LegendDot color={statusMeta.available.color} label="Available" />
        <LegendDot color={statusMeta.occupied.color} label="Occupied" />
        <LegendDot color={statusMeta.other.color} label="Other" />
      </Stack>

      <Popover
        open={Boolean(filterAnchor)}
        anchorEl={filterAnchor}
        onClose={() => setFilterAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1,
            p: 1.5,
            width: 236,
            borderRadius: 2.5,
            border: '1px solid #e1e8e3',
            boxShadow: '0 18px 30px rgba(44, 57, 53, 0.12)',
          },
        }}
      >
        <Typography sx={{ fontSize: 12, fontWeight: 700, mb: 0.8 }}>Categories</Typography>
        <Stack>
          {Object.entries(categoryMeta).map(([key, meta]) => (
            <FormControlLabel
              key={key}
              control={
                <Checkbox
                  size="small"
                  checked={categoryFilters[key]}
                  onChange={(event) =>
                    setCategoryFilters((current) => ({ ...current, [key]: event.target.checked }))
                  }
                />
              }
              label={<Typography sx={{ fontSize: 12 }}>{meta.label}</Typography>}
              sx={{ m: 0 }}
            />
          ))}
        </Stack>

        <Typography sx={{ fontSize: 12, fontWeight: 700, mt: 1.1, mb: 0.8 }}>Status</Typography>
        <Stack>
          {Object.entries(statusMeta).map(([key, meta]) => (
            <FormControlLabel
              key={key}
              control={
                <Checkbox
                  size="small"
                  checked={statusFilters[key]}
                  onChange={(event) =>
                    setStatusFilters((current) => ({ ...current, [key]: event.target.checked }))
                  }
                />
              }
              label={<Typography sx={{ fontSize: 12 }}>{meta.label}</Typography>}
              sx={{ m: 0 }}
            />
          ))}
        </Stack>
      </Popover>
    </Card>
  )
}

function DayView({ date, events, currentMarker, scrollRef }) {
  return (
    <Box sx={{ display: 'flex', minHeight: 470, bgcolor: 'white' }}>
      <Box sx={{ width: 42, borderRight: '1px solid #edf2ef', position: 'relative' }}>
        <Typography sx={{ position: 'absolute', top: 52, left: 6, fontSize: 8, color: '#8b9692' }}>
          IST+05:30
        </Typography>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ px: 1.5, pt: 1.2, pb: 0.7, borderBottom: '1px solid #edf2ef' }}>
          <Typography sx={{ fontSize: 11, color: '#788681', textTransform: 'uppercase', letterSpacing: 0.03 }}>
            {date.toLocaleDateString('en-US', { weekday: 'short' })}
          </Typography>
          <Avatar sx={{ width: 24, height: 24, mt: 0.55, bgcolor: '#0d8d65', fontSize: 11, fontWeight: 700 }}>
            {date.getDate()}
          </Avatar>
        </Box>

        <Box ref={scrollRef} sx={{ position: 'relative', height: 470, overflowY: 'auto' }}>
          <Box sx={{ position: 'relative', height: getTimelineHeight() }}>
            {hours.map((hour) => (
              <Box key={hour} sx={{ display: 'flex', height: HOUR_HEIGHT, borderBottom: '1px solid #edf2ef' }}>
                <Box sx={{ width: 44, px: 1, pt: 0.6 }}>
                  <Typography sx={{ fontSize: 10, color: '#70807a' }}>{formatHour(hour)}</Typography>
                </Box>
                <Box sx={{ flex: 1 }} />
              </Box>
            ))}

            {currentMarker && <CurrentTimeLine top={currentMarker.top} />}

            {events.map((event) => (
              <AvailabilityEvent key={event.id} event={event} />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function WeekView({ dates, dayEvents, currentMarker, scrollRef }) {
  return (
    <Box sx={{ display: 'flex', minHeight: 470, bgcolor: 'white' }}>
      <Box sx={{ width: 58, borderRight: '1px solid #edf2ef', position: 'relative' }}>
        <Typography sx={{ position: 'absolute', top: 56, left: 6, fontSize: 8, color: '#8b9692' }}>
          IST+05:30
        </Typography>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(112px, 1fr))', borderBottom: '1px solid #edf2ef' }}>
          {dates.map((date) => (
            <Box key={toKey(date)} sx={{ px: 1, pt: 1.1, pb: 0.7, borderLeft: '1px solid #edf2ef' }}>
              <Typography sx={{ fontSize: 11, color: '#788681', textTransform: 'uppercase', letterSpacing: 0.03 }}>
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </Typography>
              <Avatar sx={{ width: 24, height: 24, mt: 0.55, bgcolor: isSameDate(date, new Date()) ? '#0d8d65' : '#ebf3ef', color: isSameDate(date, new Date()) ? 'white' : '#48635a', fontSize: 11, fontWeight: 700 }}>
                {date.getDate()}
              </Avatar>
            </Box>
          ))}
        </Box>

        <Box ref={scrollRef} sx={{ position: 'relative', height: 470, overflow: 'auto' }}>
          <Box sx={{ position: 'relative', height: getTimelineHeight(), minWidth: 784 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '58px repeat(7, minmax(112px, 1fr))', position: 'absolute', inset: 0 }}>
              <Box />
              {dates.map((date) => (
                <Box key={`grid-${toKey(date)}`} sx={{ borderLeft: '1px solid #edf2ef' }} />
              ))}
            </Box>

            {hours.map((hour) => (
              <Box key={hour} sx={{ display: 'grid', gridTemplateColumns: '58px 1fr', height: HOUR_HEIGHT, borderBottom: '1px solid #edf2ef' }}>
                <Box sx={{ px: 1, pt: 0.6 }}>
                  <Typography sx={{ fontSize: 10, color: '#70807a' }}>{formatHour(hour)}</Typography>
                </Box>
                <Box />
              </Box>
            ))}

            {dates.map((date, index) => {
              const markerVisible = currentMarker.dateKey === toKey(date)

              return (
                <Box key={`column-${toKey(date)}`} sx={{ position: 'absolute', top: 0, bottom: 0, left: 58 + index * 112, width: 'calc((100% - 58px) / 7)' }}>
                  {markerVisible && <CurrentTimeLine top={currentMarker.top} left={0} right={0} />}
                  {dayEvents[index].events.map((event) => (
                    <AvailabilityEvent key={event.id} event={event} left={10} right={10} />
                  ))}
                </Box>
              )
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function MonthView({ dates, eventMap, selectedDate, onSelectDate }) {
  return (
    <Box sx={{ bgcolor: 'white' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', borderBottom: '1px solid #edf2ef' }}>
        {weekdayNames.map((day) => (
          <Box key={day} sx={{ py: 1, textAlign: 'center', fontSize: 11, color: '#76837e', borderRight: '1px solid #edf2ef', '&:last-of-type': { borderRight: 0 } }}>
            {day}
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
        {dates.map((date, index) => {
          const key = toKey(date)
          const events = eventMap.get(key) ?? []
          const inMonth = date.getMonth() === selectedDate.getMonth()
          const isSelected = isSameDate(date, selectedDate)

          return (
            <Box
              key={`${key}-${index}`}
              onClick={() => onSelectDate(date)}
              sx={{
                minHeight: 122,
                p: 1,
                borderRight: index % 7 === 6 ? 0 : '1px solid #edf2ef',
                borderBottom: '1px solid #edf2ef',
                bgcolor: isSelected ? '#f2fbf8' : 'white',
                opacity: inMonth ? 1 : 0.48,
                cursor: 'pointer',
              }}
            >
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#445651', mb: 0.8 }}>
                {date.getDate()}
              </Typography>

              <Stack spacing={0.6}>
                {events.length === 0 ? (
                  <Typography sx={{ fontSize: 10, color: '#9aa7a2' }}>No items</Typography>
                ) : (
                  events.slice(0, 3).map((event) => (
                    <Paper
                      key={event.id}
                      elevation={0}
                      sx={{
                        px: 0.7,
                        py: 0.5,
                        borderRadius: 1.25,
                        borderLeft: `2px solid ${categoryMeta[event.category].accent}`,
                        bgcolor: categoryMeta[event.category].bg,
                      }}
                    >
                      <Typography sx={{ fontSize: 9.5, color: '#31413d', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {event.title}
                      </Typography>
                      <Typography sx={{ fontSize: 8.5, color: statusMeta[event.status].color }}>
                        {statusMeta[event.status].label}
                      </Typography>
                    </Paper>
                  ))
                )}

                {events.length > 3 && (
                  <Typography sx={{ fontSize: 9.5, color: '#60706b' }}>
                    +{events.length - 3} more
                  </Typography>
                )}
              </Stack>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

function AvailabilityEvent({ event, left = 12, right = 12 }) {
  const category = categoryMeta[event.category]
  const status = statusMeta[event.status]
  const startMinutes = parseTime(event.start)
  const endMinutes = parseTime(event.end)

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'absolute',
        left,
        right,
        top: getPositionForMinutes(startMinutes),
        height: Math.max(getPositionForMinutes(endMinutes) - getPositionForMinutes(startMinutes), 30),
        px: 1,
        py: 0.6,
        borderRadius: 1.25,
        border: `1px solid ${category.accent}33`,
        bgcolor: category.bg,
        borderLeft: `2px solid ${category.accent}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 2,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 9.5, color: '#31413d', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {event.title} | {formatRange(event.start, event.end)}
        </Typography>
        <Typography sx={{ fontSize: 8.5, color: category.accent, mt: 0.15 }}>
          {category.label}
        </Typography>
      </Box>

      <Stack direction="row" spacing={0.55} alignItems="center" sx={{ ml: 1 }}>
        <Typography sx={{ fontSize: 8.5, color: '#667773' }}>{status.label}</Typography>
        <Box sx={{ width: 6, height: 6, borderRadius: '999px', bgcolor: status.color }} />
      </Stack>
    </Paper>
  )
}

function CurrentTimeLine({ top, left = 0, right = 0 }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        left,
        right,
        top,
        borderTop: '1px dashed #ef3e3a',
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: -4,
          top: -3,
          width: 6,
          height: 6,
          borderRadius: '999px',
          bgcolor: '#ef3e3a',
        }}
      />
    </Box>
  )
}

function LegendDot({ color, label }) {
  return (
    <Stack direction="row" spacing={0.6} alignItems="center">
      <Box sx={{ width: 8, height: 8, borderRadius: '999px', bgcolor: color }} />
      <Typography sx={{ fontSize: 11, color: '#60706b' }}>{label}</Typography>
    </Stack>
  )
}

function getEventsForDate(date) {
  const day = date.getDate()
  const dateKey = toKey(date)
  const seed = day + date.getMonth() * 3

  const baseEvents = [
    {
      id: `${dateKey}-equipment-a`,
      title: 'Consultation Room 1',
      start: '03:30',
      end: '04:00',
      category: 'equipment',
      status: seed % 3 === 0 ? 'other' : 'available',
    },
    {
      id: `${dateKey}-staff-a`,
      title: 'Dr Raj Patel | Book for surgery',
      start: '05:30',
      end: '06:00',
      category: 'staff',
      status: 'occupied',
    },
  ]

  if (seed % 2 === 0) {
    baseEvents.push({
      id: `${dateKey}-facility-a`,
      title: 'OT Room 2',
      start: '08:00',
      end: '09:30',
      category: 'facility',
      status: 'available',
    })
  }

  if (seed % 5 === 0) {
    baseEvents.push({
      id: `${dateKey}-equipment-b`,
      title: 'Portable Monitor',
      start: '11:00',
      end: '12:30',
      category: 'equipment',
      status: 'other',
    })
  }

  if (seed % 4 === 0) {
    baseEvents.push({
      id: `${dateKey}-staff-b`,
      title: 'Nurse Anika Peters',
      start: '14:00',
      end: '15:30',
      category: 'staff',
      status: 'available',
    })
  }

  if (seed % 6 === 0) {
    baseEvents.push({
      id: `${dateKey}-facility-b`,
      title: 'Recovery Bay 4',
      start: '17:00',
      end: '18:30',
      category: 'facility',
      status: 'occupied',
    })
  }

  return baseEvents
}

function getWeekDates(date) {
  const start = new Date(date)
  start.setDate(date.getDate() - date.getDay())
  return Array.from({ length: 7 }, (_, index) => {
    const next = new Date(start)
    next.setDate(start.getDate() + index)
    return next
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

function getHeaderLabel(date, viewMode) {
  if (viewMode === 'month') {
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`
  }

  if (viewMode === 'week') {
    const dates = getWeekDates(date)
    const first = dates[0]
    const last = dates[6]
    return `${monthNames[first.getMonth()]} ${first.getDate()} - ${monthNames[last.getMonth()]} ${last.getDate()}, ${last.getFullYear()}`
  }

  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function toKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function parseTime(time) {
  const [hoursPart, minutesPart] = time.split(':').map(Number)
  return hoursPart * 60 + minutesPart
}

function getPositionForMinutes(minutes) {
  return ((minutes - DAY_START_HOUR * 60) / 60) * HOUR_HEIGHT
}

function getTimelineHeight() {
  return hours.length * HOUR_HEIGHT
}

function formatHour(hour) {
  const value = hour > 12 ? hour - 12 : hour
  const suffix = hour >= 12 ? 'PM' : 'AM'
  return `${value} ${suffix}`
}

function formatRange(start, end) {
  return `${formatClock(start)} - ${formatClock(end)}`
}

function formatClock(time) {
  const [hoursPart, minutesPart] = time.split(':').map(Number)
  const suffix = hoursPart >= 12 ? 'PM' : 'AM'
  const hourValue = hoursPart % 12 || 12
  return `${hourValue}:${String(minutesPart).padStart(2, '0')} ${suffix}`
}

function isSameDate(left, right) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate()
}

const headerButtonSx = {
  textTransform: 'none',
  height: 30,
  px: 1.25,
  borderColor: '#dde5df',
  color: '#4e605b',
  borderRadius: 2,
  fontSize: 12,
}

const navButtonSx = {
  width: 28,
  height: 28,
  border: '1px solid #dde5df',
  borderRadius: 2,
  color: '#4e605b',
}

const viewSelectSx = {
  minWidth: 82,
  height: 32,
  bgcolor: 'white',
  borderRadius: 2,
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#dde5df',
  },
  '& .MuiSelect-select': {
    py: 0.8,
    fontSize: 12,
  },
}

export default ResourceAvailabilityBoardPage
