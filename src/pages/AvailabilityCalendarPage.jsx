import { useMemo, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  MenuItem,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'

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

function AvailabilityCalendarPage() {
  const [view, setView] = useState('month')
  const [displayDate, setDisplayDate] = useState(new Date(2026, 2, 1))
  const [activeDate, setActiveDate] = useState(new Date(2026, 2, 18))
  const [selectedDates, setSelectedDates] = useState(() => {
    const seed = new Set()
    for (let day = 1; day <= 31; day += 1) {
      seed.add(toKey(new Date(2026, 2, day)))
    }
    return seed
  })

  const monthGridDates = useMemo(() => getMonthGridDates(displayDate), [displayDate])
  const weekDates = useMemo(() => getWeekDates(activeDate), [activeDate])

  const handleViewChange = (_event, nextView) => {
    if (!nextView) return
    setView(nextView)
  }

  const shiftRange = (step) => {
    if (view === 'month') {
      const next = new Date(displayDate.getFullYear(), displayDate.getMonth() + step, 1)
      setDisplayDate(next)
      setActiveDate((current) =>
        new Date(next.getFullYear(), next.getMonth(), Math.min(current.getDate(), daysInMonth(next))),
      )
      return
    }

    if (view === 'week') {
      const next = new Date(activeDate)
      next.setDate(activeDate.getDate() + step * 7)
      setActiveDate(next)
      setDisplayDate(new Date(next.getFullYear(), next.getMonth(), 1))
      return
    }

    const next = new Date(activeDate)
    next.setDate(activeDate.getDate() + step)
    setActiveDate(next)
    setDisplayDate(new Date(next.getFullYear(), next.getMonth(), 1))
  }

  const handleMonthChange = (event) => {
    const next = new Date(Number(yearValue), Number(event.target.value), 1)
    setDisplayDate(next)
    setActiveDate(new Date(next.getFullYear(), next.getMonth(), Math.min(activeDate.getDate(), daysInMonth(next))))
  }

  const handleYearChange = (event) => {
    const next = new Date(Number(event.target.value), displayDate.getMonth(), 1)
    setDisplayDate(next)
    setActiveDate(new Date(next.getFullYear(), next.getMonth(), Math.min(activeDate.getDate(), daysInMonth(next))))
  }

  const toggleDate = (date) => {
    const key = toKey(date)
    setSelectedDates((current) => {
      const next = new Set(current)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const rangeLabel =
    view === 'month'
      ? `${monthNames[displayDate.getMonth()]} ${displayDate.getFullYear()}`
      : view === 'week'
        ? getWeekRangeLabel(activeDate)
        : `${monthNames[activeDate.getMonth()]} ${activeDate.getDate()}, ${activeDate.getFullYear()}`

  const yearValue = displayDate.getFullYear()

  return (
    <Box sx={{ display: 'grid', placeItems: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: 430 }}>
        <Card
          elevation={0}
          sx={{
            mb: 2,
            p: 1.5,
            borderRadius: 3,
            bgcolor: '#f2f3f2',
            border: '1px solid #e4ebe6',
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#234260', fontSize: 12 }}>JS</Avatar>
            <Box>
              <Typography sx={{ fontSize: 13, fontWeight: 700 }}>Dr. John Smith</Typography>
              <Typography sx={{ fontSize: 11, color: '#788682' }}>
                Manage availability for appointments, surgery &amp; events
              </Typography>
            </Box>
          </Stack>
        </Card>

        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            border: '1px solid #dfe7e2',
            boxShadow: '0 18px 36px rgba(46, 74, 65, 0.08)',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography align="center" sx={{ fontSize: 28 / 1.55, fontWeight: 700 }}>
              Set Availability
            </Typography>
            <Typography
              align="center"
              sx={{ mt: 1.25, fontSize: 12, color: '#778581', maxWidth: 310, mx: 'auto' }}
            >
              Select dates when <Box component="span" sx={{ color: '#0b7a57', fontWeight: 700 }}>Dr. John Smith</Box> typically
              available in clinics and hospital
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2.5, mb: 2.5 }}>
              <ToggleButtonGroup
                exclusive
                value={view}
                onChange={handleViewChange}
                sx={{
                  bgcolor: '#f1f2f1',
                  p: 0.5,
                  borderRadius: 2.5,
                  '& .MuiToggleButton-root': {
                    border: 0,
                    px: 3.5,
                    py: 1,
                    textTransform: 'none',
                    color: '#46524f',
                    borderRadius: 2,
                    fontSize: 12,
                  },
                  '& .Mui-selected': {
                    bgcolor: '#0b7a57 !important',
                    color: 'white !important',
                    boxShadow: '0 8px 16px rgba(11, 122, 87, 0.16)',
                  },
                }}
              >
                <ToggleButton value="month">Monthly</ToggleButton>
                <ToggleButton value="week">Weekly</ToggleButton>
                <ToggleButton value="day">Day</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Typography sx={{ mb: 1.25, fontSize: 14, fontWeight: 500 }}>Select Dates</Typography>

            <Card
              elevation={0}
              sx={{
                borderRadius: 2.5,
                border: '1px solid #dfe7e2',
                overflow: 'hidden',
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ px: 1.5, py: 1.25, borderBottom: '1px solid #edf2ef' }}
              >
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <IconButton size="small" onClick={() => shiftRange(-1)}>
                    <ChevronLeftRoundedIcon fontSize="small" />
                  </IconButton>
                  <Select
                    variant="standard"
                    disableUnderline
                    value={displayDate.getMonth()}
                    onChange={handleMonthChange}
                    sx={{ fontSize: 13, fontWeight: 700, minWidth: 92 }}
                  >
                    {monthNames.map((month, index) => (
                      <MenuItem key={month} value={index}>
                        {month}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Select
                    variant="standard"
                    disableUnderline
                    value={yearValue}
                    onChange={handleYearChange}
                    sx={{ fontSize: 13, fontWeight: 700, minWidth: 72 }}
                  >
                    {Array.from({ length: 16 }, (_, index) => 2020 + index).map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                  <IconButton size="small" onClick={() => shiftRange(1)}>
                    <ChevronRightRoundedIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>

              {view === 'month' && (
                <Box sx={{ px: 1.5, pt: 1.25, pb: 1.5 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 1 }}>
                    {weekdayNames.map((day) => (
                      <Typography
                        key={day}
                        align="center"
                        sx={{ fontSize: 10, color: '#8e9894' }}
                      >
                        {day}
                      </Typography>
                    ))}
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
                    {monthGridDates.map((date) => {
                      const currentMonth = date.getMonth() === displayDate.getMonth()
                      const selected = selectedDates.has(toKey(date))
                      const today = isSameDate(date, new Date())

                      return (
                        <Box key={toKey(date)} sx={{ display: 'grid', placeItems: 'center', minHeight: 30 }}>
                          <Button
                            onClick={() => {
                              setActiveDate(new Date(date))
                              toggleDate(date)
                            }}
                            variant="text"
                            sx={{
                              minWidth: 26,
                              width: 26,
                              height: 26,
                              borderRadius: '999px',
                              p: 0,
                              fontSize: 11,
                              color: currentMonth ? '#33413e' : '#b8c0bc',
                              bgcolor: selected && currentMonth ? '#0b7a57' : !currentMonth ? '#f3f4f3' : 'transparent',
                              outline: today && currentMonth ? '2px solid rgba(11,122,87,0.22)' : 'none',
                              outlineOffset: 2,
                              '&:hover': {
                                bgcolor: selected && currentMonth ? '#096649' : '#edf3ef',
                              },
                            }}
                          >
                            {date.getDate()}
                          </Button>
                        </Box>
                      )
                    })}
                  </Box>
                </Box>
              )}

              {view === 'week' && (
                <Box sx={{ p: 1.5, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
                  {weekDates.map((date) => {
                    const selected = selectedDates.has(toKey(date))
                    const active = isSameDate(date, activeDate)

                    return (
                      <Card
                        key={toKey(date)}
                        elevation={0}
                        onClick={() => {
                          setActiveDate(new Date(date))
                          setDisplayDate(new Date(date.getFullYear(), date.getMonth(), 1))
                          toggleDate(date)
                        }}
                        sx={{
                          p: 1.25,
                          textAlign: 'center',
                          borderRadius: 2.5,
                          cursor: 'pointer',
                          border: '1px solid',
                          borderColor: active ? '#8fcdb4' : '#dfe7e2',
                          bgcolor: active ? '#f1f8f4' : '#fbfcfb',
                        }}
                      >
                        <Typography sx={{ fontSize: 11, fontWeight: 700 }}>
                          {weekdayNames[date.getDay()]}
                        </Typography>
                        <Typography sx={{ mt: 0.5, fontSize: 10, color: '#7a8682' }}>
                          {monthNames[date.getMonth()].slice(0, 3)} {date.getFullYear()}
                        </Typography>
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: '999px',
                            mt: 1.25,
                            mx: 'auto',
                            display: 'grid',
                            placeItems: 'center',
                            bgcolor: selected ? '#0b7a57' : '#e8eeeb',
                            color: selected ? 'white' : '#50625e',
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {date.getDate()}
                        </Box>
                      </Card>
                    )
                  })}
                </Box>
              )}

              {view === 'day' && (
                <Box sx={{ p: 2 }}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      border: '1px solid #dfe7e2',
                      bgcolor: '#fbfcfb',
                      textAlign: 'center',
                      p: 2.5,
                    }}
                  >
                    <Typography sx={{ fontSize: 11, fontWeight: 700 }}>
                      {weekdayNames[activeDate.getDay()]}
                    </Typography>
                    <Typography sx={{ mt: 0.5, fontSize: 10, color: '#7a8682' }}>
                      {monthNames[activeDate.getMonth()]} {activeDate.getDate()}, {activeDate.getFullYear()}
                    </Typography>
                    <Box
                      sx={{
                        width: 54,
                        height: 54,
                        mx: 'auto',
                        my: 1.75,
                        borderRadius: '999px',
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: selectedDates.has(toKey(activeDate)) ? '#0b7a57' : '#e8eeeb',
                        color: selectedDates.has(toKey(activeDate)) ? 'white' : '#455854',
                        fontSize: 18,
                        fontWeight: 700,
                      }}
                    >
                      {activeDate.getDate()}
                    </Box>
                    <Button
                      onClick={() => toggleDate(activeDate)}
                      variant="contained"
                      sx={{
                        textTransform: 'none',
                        borderRadius: 999,
                        bgcolor: '#0b7a57',
                        '&:hover': { bgcolor: '#096649' },
                      }}
                    >
                      {selectedDates.has(toKey(activeDate)) ? 'Selected' : 'Select This Day'}
                    </Button>
                  </Card>
                </Box>
              )}

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ px: 1.75, py: 1.5, borderTop: '1px solid #edf2ef' }}
              >
                <Typography sx={{ fontSize: 11, color: '#7a8682' }}>{rangeLabel}</Typography>
                <Typography sx={{ fontSize: 11, color: '#0b7a57', fontWeight: 700 }}>
                  {selectedDates.size} dates selected
                </Typography>
              </Stack>
            </Card>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

function getMonthGridDates(displayDate) {
  const firstDay = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1)
  const start = new Date(firstDay)
  start.setDate(firstDay.getDate() - firstDay.getDay())

  return Array.from({ length: 35 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return date
  })
}

function getWeekDates(date) {
  const start = startOfWeek(date)
  return Array.from({ length: 7 }, (_, index) => {
    const next = new Date(start)
    next.setDate(start.getDate() + index)
    return next
  })
}

function getWeekRangeLabel(date) {
  const start = startOfWeek(date)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  return `${monthNames[start.getMonth()].slice(0, 3)} ${start.getDate()} - ${monthNames[end.getMonth()].slice(0, 3)} ${end.getDate()}, ${end.getFullYear()}`
}

function startOfWeek(date) {
  const start = new Date(date)
  start.setDate(date.getDate() - date.getDay())
  return start
}

function daysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
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

export default AvailabilityCalendarPage
