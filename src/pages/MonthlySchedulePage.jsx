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

function MonthlySchedulePage() {
  const [displayDate, setDisplayDate] = useState(new Date(2026, 2, 1))
  const [selectedDateKey, setSelectedDateKey] = useState('2026-03-30')
  const [anchorEl, setAnchorEl] = useState(null)

  const gridDates = useMemo(() => getMonthGridDates(displayDate), [displayDate])
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
  }

  const handleYearChange = (event) => {
    setDisplayDate(new Date(Number(event.target.value), displayDate.getMonth(), 1))
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
        bgcolor: '#f7f8f7',
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
              '&:hover': { bgcolor: '#0d664b' },
            }}
          >
            Calendar
          </Button>
        </Stack>
      </Stack>

      <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e7e4', overflow: 'hidden' }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={1.5}
          sx={{ px: 1.5, py: 1.25, borderBottom: '1px solid #e2e7e4', bgcolor: 'white' }}
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
              sx={{ fontSize: 13, fontWeight: 600, minWidth: 86 }}
            >
              {monthNames.map((month, index) => (
                <MenuItem key={month} value={index}>
                  {month}
                </MenuItem>
              ))}
            </Select>
            <Select
              variant="standard"
              disableUnderline
              value={displayDate.getFullYear()}
              onChange={handleYearChange}
              sx={{ fontSize: 13, fontWeight: 600, minWidth: 72 }}
            >
              {Array.from({ length: 16 }, (_, index) => 2023 + index).map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
            <IconButton size="small" onClick={() => shiftMonth(1)}>
              <ChevronRightRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Typography sx={{ fontSize: 11, color: '#62716d' }}>{nowLabel}</Typography>
        </Stack>

        <Box sx={{ overflowX: 'auto', bgcolor: 'white' }}>
          <Box sx={{ minWidth: 780 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
              {weekNames.map((day) => (
                <Box
                  key={day}
                  sx={{
                    py: 1.25,
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
                const inMonth = date.getMonth() === displayDate.getMonth()
                const schedules = getSchedulesForDate(date, displayDate)
                const isSelected = selectedDateKey === toKey(date)
                const isToday = isSameDate(date, new Date())

                return (
                  <Box
                    key={`${toKey(date)}-${index}`}
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
                          bgcolor: schedules[0]?.dotColor ?? '#c0c3c1',
                        }}
                      />
                    </Stack>

                    {schedules.length === 0 ? (
                      <Typography sx={{ mt: 2.2, fontSize: 11, color: '#7a8380' }}>Day Off</Typography>
                    ) : (
                      <Stack spacing={0.5} sx={{ mt: 1 }}>
                        {schedules.map((schedule) => (
                          <Box
                            key={`${toKey(date)}-${schedule.text}`}
                            sx={{
                              px: 0.75,
                              py: 0.4,
                              borderRadius: 0.75,
                              bgcolor: schedule.bg,
                              color: 'white',
                              fontSize: 10,
                              lineHeight: 1.25,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {schedule.text}
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
        <LegendItem color="#5d3b99" label="OPD Consultation" />
        <LegendItem color="#de3a31" label="Theater/Surgery" />
        <LegendItem color="#2f8a43" label="Video consultation" />
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
            width: 158,
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

function getSchedulesForDate(date, displayDate) {
  if (date.getMonth() !== displayDate.getMonth()) {
    return []
  }

  const day = date.getDate()
  const weekday = date.getDay()
  const items = []

  if ([1, 3].includes(weekday)) {
    items.push({
      bg: '#5d3b99',
      dotColor: '#5d3b99',
      text: '7:35AM-9:00PM Medi..',
    })
  }

  if ([2, 4].includes(weekday) && day % 2 === 1) {
    items.push({
      bg: '#de3a31',
      dotColor: '#de3a31',
      text: '9:00am - 5:00pm Me..',
    })
  }

  if (weekday === 4 && day > 15) {
    items.push({
      bg: '#2f8a43',
      dotColor: '#2f8a43',
      text: '2:00PM-7:00PM Phar..',
    })
  }

  if (weekday === 5 && day % 2 === 0) {
    items.push({
      bg: '#de3a31',
      dotColor: '#de3a31',
      text: '9:00am - 5:00pm Me..',
    })
  }

  if (weekday === 6 && day <= 20) {
    items.push({
      bg: '#5d3b99',
      dotColor: '#5d3b99',
      text: '9:00am - 5:00pm Me..',
    })
  }

  return items.slice(0, 2)
}

function getCellLabel(date, inMonth) {
  if (inMonth) {
    return date.getDate()
  }

  if (date.getDate() === 1) {
    return `${monthNames[date.getMonth()].slice(0, 3)}1`
  }

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

export default MonthlySchedulePage
