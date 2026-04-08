import { useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  InputBase,
  MenuItem,
  Paper,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import AppsRoundedIcon from '@mui/icons-material/AppsRounded'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import CircleRoundedIcon from '@mui/icons-material/CircleRounded'
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded'
import ListRoundedIcon from '@mui/icons-material/ListRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import TodayRoundedIcon from '@mui/icons-material/TodayRounded'
import './ScheduleBoardPage.scss'

const doctors = [
  { id: 'doc-1', name: 'Arlene McCoy', availableLabel: 'Available, Today 6h, Week 34h', initials: 'A' },
  { id: 'doc-2', name: 'Ralph Edwards', availableLabel: 'Available, Today 6h, Week 24h', initials: 'R' },
  { id: 'doc-3', name: 'Kristin Watson', availableLabel: 'Available, Today 6h, Week 26h', initials: 'K' },
  { id: 'doc-4', name: 'Wade Warren', availableLabel: 'Available, Today 6h, Week 33h', initials: 'W' },
  { id: 'doc-5', name: 'Ronald Richards', availableLabel: 'Available, Today 6h, Week 12h', initials: 'R' },
  { id: 'doc-6', name: 'Theresa Webb', availableLabel: 'Available, Today 6h, Week 36h', initials: 'T' },
  { id: 'doc-7', name: 'Cameron Williamson', availableLabel: 'Available, Today 6h, Week 70h', initials: 'C' },
  { id: 'doc-8', name: 'Brooklyn Simmons', availableLabel: 'Available, Today 6h, Week 11h', initials: 'B' },
]

const appointmentStyles = {
  aqua: { accent: '#2fc6b2', background: '#d6fbf4', text: '#1e7f74' },
  blue: { accent: '#4586ff', background: '#dbe7ff', text: '#2d63ca' },
  amber: { accent: '#f4a62a', background: '#fff1cf', text: '#b36e05' },
  red: { accent: '#ff5c52', background: '#ffe2df', text: '#cf4038' },
  green: { accent: '#41b96f', background: '#dff7e6', text: '#2d8b50' },
  rose: { accent: '#ff4444', background: '#ffe6e8', text: '#ca3038' },
}

const seedAppointments = [
  { id: 'a1', doctorId: 'doc-1', date: '2025-10-07', start: '08:00', end: '13:30', title: 'ABA Therapy', patient: 'Ronald Richards', type: 'aqua', tag: 'ST15' },
  { id: 'a2', doctorId: 'doc-2', date: '2025-10-07', start: '08:00', end: '10:30', title: 'Behavior Therapy', patient: 'Albert Flores', type: 'blue', tag: 'ST10' },
  { id: 'a3', doctorId: 'doc-2', date: '2025-10-07', start: '08:00', end: '10:30', title: 'ABA Therapy', patient: 'Ronald Richards', type: 'blue', tag: 'ST15' },
  { id: 'a4', doctorId: 'doc-2', date: '2025-10-07', start: '10:30', end: '13:30', title: 'Progress Therapy', patient: 'Devon Lane', type: 'blue', tag: 'ST20' },
  { id: 'a5', doctorId: 'doc-2', date: '2025-10-07', start: '10:30', end: '13:30', title: 'Development Therapy', patient: 'Arlene McCoy', type: 'amber', tag: 'ST15' },
  { id: 'a6', doctorId: 'doc-3', date: '2025-10-07', start: '08:00', end: '12:30', title: 'ABA Therapy', patient: 'Savannah Nguyen', type: 'amber', tag: 'ST15' },
  { id: 'a7', doctorId: 'doc-6', date: '2025-10-07', start: '08:00', end: '10:00', title: 'ABA Therapy', patient: 'Kristin Watson', type: 'blue', tag: 'ST15' },
  { id: 'a8', doctorId: 'doc-6', date: '2025-10-07', start: '11:30', end: '14:30', title: 'Development Therapy', patient: 'Dianne Russell', type: 'aqua', tag: 'ST15' },
  { id: 'a9', doctorId: 'doc-8', date: '2025-10-07', start: '08:00', end: '10:30', title: 'Advance Therapy', patient: 'Ronald Richards', type: 'rose', tag: 'ST15', status: 'Canceled' },
  { id: 'a10', doctorId: 'doc-1', date: '2025-10-08', start: '09:30', end: '11:00', title: 'Follow-up Session', patient: 'Jenny Wilson', type: 'green', tag: 'ST10' },
  { id: 'a11', doctorId: 'doc-3', date: '2025-10-09', start: '12:00', end: '14:00', title: 'Case Review', patient: 'Jacob Jones', type: 'blue', tag: 'ST30' },
  { id: 'a12', doctorId: 'doc-5', date: '2025-10-10', start: '10:00', end: '12:00', title: 'Speech Evaluation', patient: 'Dianne Russell', type: 'amber', tag: 'ST20' },
  { id: 'a13', doctorId: 'doc-7', date: '2025-10-11', start: '13:00', end: '15:00', title: 'Consultation', patient: 'Kathryn Murphy', type: 'green', tag: 'ST05' },
  { id: 'a14', doctorId: 'doc-2', date: '2025-10-15', start: '08:30', end: '11:30', title: 'Behavior Therapy', patient: 'Albert Flores', type: 'blue', tag: 'ST12' },
  { id: 'a15', doctorId: 'doc-6', date: '2025-10-21', start: '09:00', end: '11:00', title: 'Weekly Review', patient: 'Jerome Bell', type: 'red', tag: 'ST08' },
  { id: 'a16', doctorId: 'doc-8', date: '2025-10-28', start: '14:00', end: '15:00', title: 'Assessment', patient: 'Cameron Diaz', type: 'aqua', tag: 'ST06' },
]

const sidebarIcons = [
  CalendarMonthRoundedIcon,
  AppsRoundedIcon,
  PersonOutlineRoundedIcon,
  TodayRoundedIcon,
  PeopleOutlineRoundedIcon,
  SettingsOutlinedIcon,
]

const hours = [8, 9, 10, 11, 12, 13, 14, 15]
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const fullWeekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function ScheduleBoardPage() {
  const [mode, setMode] = useState('day')
  const [layout, setLayout] = useState('calendar')
  const [scheduleType, setScheduleType] = useState('client')
  const [activeDate, setActiveDate] = useState(new Date(2025, 9, 7))
  const [selectedDoctorId, setSelectedDoctorId] = useState('doc-1')
  const [doctorFilter, setDoctorFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [appointments, setAppointments] = useState(seedAppointments)

  const selectedDoctor = doctors.find((doctor) => doctor.id === selectedDoctorId) ?? doctors[0]
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesFilter = doctorFilter === 'all' || doctor.id === doctorFilter
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
    return matchesFilter && matchesSearch
  })

  const visibleDoctors = filteredDoctors.length > 0 ? filteredDoctors : doctors
  const calendarStart = startOfWeek(activeDate)
  const calendarDays = Array.from({ length: 7 }, (_, index) => addDays(calendarStart, index))
  const monthGridDays = buildMonthGrid(activeDate)
  const visibleDoctorIds = new Set(visibleDoctors.map((doctor) => doctor.id))
  const visibleAppointments = appointments.filter(
    (appointment) =>
      visibleDoctorIds.has(appointment.doctorId) && isAppointmentInRange(appointment, activeDate, mode)
  )

  function handleShiftDate(direction) {
    if (mode === 'month') {
      setActiveDate(addMonths(activeDate, direction))
      return
    }

    if (mode === 'week') {
      setActiveDate(addDays(activeDate, direction * 7))
      return
    }

    setActiveDate(addDays(activeDate, direction))
  }

  function handleAddAppointment() {
    const targetDoctorId = selectedDoctorId
    const targetDate = mode === 'month' ? formatDateKey(new Date(activeDate.getFullYear(), activeDate.getMonth(), 1)) : formatDateKey(activeDate)
    const siblingCount = appointments.filter((appointment) => appointment.doctorId === targetDoctorId && appointment.date === targetDate).length
    const safeStart = Math.min(9 + siblingCount, 14)
    const safeEnd = Math.min(safeStart + 1, 16)

    setAppointments([
      ...appointments,
      {
        id: `new-${Date.now()}`,
        doctorId: targetDoctorId,
        date: targetDate,
        start: `${String(safeStart).padStart(2, '0')}:00`,
        end: `${String(safeEnd).padStart(2, '0')}:00`,
        title: scheduleType === 'staff' ? 'Team Huddle' : 'Consultation',
        patient: scheduleType === 'staff' ? 'Support Team' : 'New Patient',
        type: ['aqua', 'blue', 'amber', 'green'][siblingCount % 4],
        tag: `ST${String(7 + siblingCount).padStart(2, '0')}`,
      },
    ])
  }

  return (
    <Box className="schedule-board-page">
      <Paper elevation={0} className="schedule-board-shell">
        <aside className="schedule-board-sidebar">
          <Box className="schedule-board-sidebar__brand">OG</Box>
          <Stack spacing={1.5} className="schedule-board-sidebar__icons">
            {sidebarIcons.map((SidebarIcon, index) => (
              <button
                key={SidebarIcon.displayName ?? SidebarIcon.name}
                type="button"
                className={`schedule-board-sidebar__icon-button${index === 3 ? ' is-active' : ''}`}
              >
                <SidebarIcon sx={{ fontSize: 16 }} />
              </button>
            ))}
          </Stack>
          <Box className="schedule-board-sidebar__bottom">
            <button type="button" className="schedule-board-sidebar__icon-button">
              <CircleRoundedIcon sx={{ fontSize: 14 }} />
            </button>
            <button type="button" className="schedule-board-sidebar__icon-button">
              <CalendarMonthRoundedIcon sx={{ fontSize: 15 }} />
            </button>
          </Box>
        </aside>

        <Box className="schedule-board-content">
          <Box className="schedule-board-topbar">
            <IconButton size="small" className="schedule-board-topbar__menu">
              <MenuRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <Box className="schedule-board-topbar__search">
              <SearchRoundedIcon sx={{ fontSize: 14 }} />
              <InputBase placeholder="Search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} inputProps={{ 'aria-label': 'Search doctors' }} />
            </Box>
            <IconButton size="small" className="schedule-board-topbar__bell">
              <NotificationsNoneRoundedIcon sx={{ fontSize: 17 }} />
            </IconButton>
            <Box className="schedule-board-topbar__profile">
              <Avatar sx={{ width: 28, height: 28, bgcolor: '#f3a71b', fontSize: 12 }}>L</Avatar>
              <Typography className="schedule-board-topbar__profile-name">Leslie Alexander</Typography>
            </Box>
          </Box>

          <Box className="schedule-board-inner">
            <Box className="schedule-board-header">
              <Typography className="schedule-board-header__title">Manage Schedules</Typography>
              <Button variant="contained" className="schedule-board-header__plan-button">
                Plan Your Week
              </Button>
            </Box>

            <Paper elevation={0} className="schedule-board-card">
              <Box className="schedule-board-card__top">
                <Box className="schedule-board-tabs">
                  <button type="button" className={`schedule-board-tabs__item${scheduleType === 'client' ? ' is-active' : ''}`} onClick={() => setScheduleType('client')}>
                    Client Schedule
                  </button>
                  <button type="button" className={`schedule-board-tabs__item${scheduleType === 'staff' ? ' is-active' : ''}`} onClick={() => setScheduleType('staff')}>
                    Staff Schedule
                  </button>
                </Box>

                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" startIcon={<AddRoundedIcon sx={{ fontSize: 15 }} />} className="schedule-board-card__action" onClick={handleAddAppointment}>
                    Add Appointment
                  </Button>
                  <Button variant="outlined" className="schedule-board-card__action">
                    Manage Client and Staff
                  </Button>
                </Stack>
              </Box>

              <Box className="schedule-board-controls">
                <Box className="schedule-board-controls__left">
                  <IconButton size="small" className="schedule-board-controls__nav" onClick={() => handleShiftDate(-1)}>
                    <ArrowBackIosNewRoundedIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                  <Box className="schedule-board-controls__date">
                    <TodayRoundedIcon sx={{ fontSize: 15 }} />
                    <span>{getDateRangeLabel(activeDate, mode)}</span>
                  </Box>
                  <IconButton size="small" className="schedule-board-controls__nav" onClick={() => handleShiftDate(1)}>
                    <ArrowForwardIosRoundedIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                  <button type="button" className="schedule-board-controls__doctor-chip" onClick={() => setSelectedDoctorId(selectedDoctor.id)}>
                    <span className="schedule-board-controls__doctor-badge">{selectedDoctor.initials}</span>
                    <span className="schedule-board-controls__doctor-name">{selectedDoctor.name}</span>
                  </button>

                  <ToggleButtonGroup exclusive value={mode} onChange={(_, value) => value && setMode(value)} className="schedule-board-controls__view-toggle">
                    <ToggleButton value="day">Day</ToggleButton>
                    <ToggleButton value="week">Week</ToggleButton>
                    <ToggleButton value="month">Month</ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                <Box className="schedule-board-controls__right">
                  <Select
                    size="small"
                    value={doctorFilter}
                    onChange={(event) => {
                      setDoctorFilter(event.target.value)
                      if (event.target.value !== 'all') {
                        setSelectedDoctorId(event.target.value)
                      }
                    }}
                    className="schedule-board-controls__select"
                  >
                    <MenuItem value="all">All doctors</MenuItem>
                    {doctors.map((doctor) => (
                      <MenuItem key={doctor.id} value={doctor.id}>
                        {doctor.name}
                      </MenuItem>
                    ))}
                  </Select>

                  <ToggleButtonGroup exclusive value={layout} onChange={(_, value) => value && setLayout(value)} className="schedule-board-controls__layout-toggle">
                    <ToggleButton value="calendar">
                      <CalendarMonthRoundedIcon sx={{ fontSize: 15 }} />
                      Cal
                    </ToggleButton>
                    <ToggleButton value="grid">
                      <AppsRoundedIcon sx={{ fontSize: 15 }} />
                      Grid
                    </ToggleButton>
                    <ToggleButton value="list">
                      <ListRoundedIcon sx={{ fontSize: 15 }} />
                      List
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Box>

              {layout === 'calendar' && mode === 'day' && (
                <DayBoard
                  activeDate={activeDate}
                  doctors={visibleDoctors}
                  appointments={visibleAppointments}
                  selectedDoctorId={selectedDoctorId}
                  onSelectDoctor={setSelectedDoctorId}
                />
              )}

              {layout === 'calendar' && mode === 'week' && (
                <WeekBoard
                  days={calendarDays}
                  doctors={visibleDoctors}
                  appointments={visibleAppointments}
                  selectedDoctorId={selectedDoctorId}
                  onSelectDoctor={setSelectedDoctorId}
                />
              )}

              {layout === 'calendar' && mode === 'month' && (
                <MonthBoard
                  activeDate={activeDate}
                  days={monthGridDays}
                  doctors={visibleDoctors}
                  appointments={visibleAppointments}
                  selectedDoctorId={selectedDoctorId}
                  onSelectDoctor={setSelectedDoctorId}
                />
              )}

              {layout === 'grid' && (
                <GridView
                  mode={mode}
                  activeDate={activeDate}
                  appointments={visibleAppointments}
                  doctors={visibleDoctors}
                  selectedDoctorId={selectedDoctorId}
                  onSelectDoctor={setSelectedDoctorId}
                />
              )}

              {layout === 'list' && (
                <ListView
                  appointments={visibleAppointments}
                  doctors={visibleDoctors}
                  selectedDoctorId={selectedDoctorId}
                  onSelectDoctor={setSelectedDoctorId}
                />
              )}
            </Paper>

            <Typography className="schedule-board-footer">
              © Copyright 2026 | Outcome Genius | All Rights Reserved
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

function DayBoard({ activeDate, doctors, appointments, selectedDoctorId, onSelectDoctor }) {
  const dayKey = formatDateKey(activeDate)

  return (
    <Box className="schedule-table">
      <Box className="schedule-table__header">
        <div className="schedule-table__name-header">Client Name</div>
        <div className="schedule-table__hour-strip">
          {hours.map((hour) => (
            <div key={hour} className="schedule-table__hour-cell">
              {formatHourLabel(hour)}
            </div>
          ))}
        </div>
      </Box>

      {doctors.map((doctor) => {
        const doctorAppointments = assignLanes(
          appointments.filter((appointment) => appointment.doctorId === doctor.id && appointment.date === dayKey)
        )
        const laneCount = Math.max(doctorAppointments.reduce((max, item) => Math.max(max, item.lane + 1), 0), 1)

        return (
          <Box
            key={doctor.id}
            className={`schedule-table__row${doctor.id === selectedDoctorId ? ' is-selected' : ''}`}
            onClick={() => onSelectDoctor(doctor.id)}
          >
            <div className="schedule-table__name-cell">
              <div className="schedule-table__name">{doctor.name}</div>
              <div className="schedule-table__meta">{doctor.availableLabel}</div>
            </div>
            <div className="schedule-table__timeline" style={{ minHeight: `${laneCount * 68 + 16}px` }}>
              {hours.map((hour) => (
                <div key={hour} className="schedule-table__timeline-hour" />
              ))}
              {doctorAppointments.map((appointment) => (
                <AppointmentBlock key={appointment.id} appointment={appointment} />
              ))}
            </div>
          </Box>
        )
      })}
    </Box>
  )
}

function WeekBoard({ days, doctors, appointments, selectedDoctorId, onSelectDoctor }) {
  return (
    <Box className="week-board">
      <div className="week-board__header">
        <div className="week-board__name-header">Client Name</div>
        <div className="week-board__days">
          {days.map((day) => (
            <div key={formatDateKey(day)} className="week-board__day-header">
              <span>{weekdays[day.getDay()]}</span>
              <strong>{day.getDate()}</strong>
            </div>
          ))}
        </div>
      </div>

      {doctors.map((doctor) => (
        <div
          key={doctor.id}
          className={`week-board__row${doctor.id === selectedDoctorId ? ' is-selected' : ''}`}
          onClick={() => onSelectDoctor(doctor.id)}
        >
          <div className="week-board__name-cell">
            <div className="week-board__name">{doctor.name}</div>
            <div className="week-board__meta">{doctor.availableLabel}</div>
          </div>
          <div className="week-board__cells">
            {days.map((day) => {
              const dayAppointments = appointments.filter(
                (appointment) =>
                  appointment.doctorId === doctor.id && appointment.date === formatDateKey(day)
              )

              return (
                <div key={`${doctor.id}-${formatDateKey(day)}`} className="week-board__cell">
                  {dayAppointments.length === 0 && <span className="week-board__empty">No appointments</span>}
                  {dayAppointments.map((appointment) => (
                    <MiniAppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </Box>
  )
}

function MonthBoard({ activeDate, days, doctors, appointments, selectedDoctorId, onSelectDoctor }) {
  const visibleDoctor = doctors.find((doctor) => doctor.id === selectedDoctorId) ?? doctors[0]

  return (
    <Box className="month-board">
      <div className="month-board__sidebar">
        <div className="month-board__sidebar-title">Doctors</div>
        {doctors.map((doctor) => (
          <button
            key={doctor.id}
            type="button"
            className={`month-board__doctor${doctor.id === selectedDoctorId ? ' is-selected' : ''}`}
            onClick={() => onSelectDoctor(doctor.id)}
          >
            <Avatar sx={{ width: 28, height: 28, bgcolor: doctor.id === selectedDoctorId ? '#ff5d1f' : '#173354', fontSize: 12 }}>
              {doctor.initials}
            </Avatar>
            <div>
              <div className="month-board__doctor-name">{doctor.name}</div>
              <div className="month-board__doctor-meta">{doctor.availableLabel}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="month-board__main">
        <div className="month-board__month-header">
          <div>{monthNames[activeDate.getMonth()]} {activeDate.getFullYear()}</div>
          <Chip
            icon={<EventAvailableRoundedIcon sx={{ fontSize: '16px !important' }} />}
            label={`${visibleDoctor.name} selected`}
            className="month-board__chip"
          />
        </div>

        <div className="month-board__weekdays">
          {weekdays.map((weekday) => (
            <div key={weekday}>{weekday}</div>
          ))}
        </div>

        <div className="month-board__grid">
          {days.map((day) => {
            const dayAppointments = appointments.filter(
              (appointment) =>
                appointment.doctorId === selectedDoctorId && appointment.date === formatDateKey(day)
            )

            return (
              <div
                key={formatDateKey(day)}
                className={`month-board__cell${day.getMonth() !== activeDate.getMonth() ? ' is-muted' : ''}${
                  isSameDate(day, new Date()) ? ' is-today' : ''
                }`}
              >
                <div className="month-board__cell-number">{day.getDate()}</div>
                <div className="month-board__cell-body">
                  {dayAppointments.slice(0, 3).map((appointment) => (
                    <MiniAppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
                  {dayAppointments.length > 3 && (
                    <div className="month-board__more">+{dayAppointments.length - 3} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Box>
  )
}

function GridView({ mode, activeDate, appointments, doctors, selectedDoctorId, onSelectDoctor }) {
  const periodTitle = `${getDateRangeLabel(activeDate, mode)} overview`

  return (
    <Box className="board-card-list">
      <Box className="board-card-list__header">
        <Typography>{periodTitle}</Typography>
        <Typography>{appointments.length} appointments</Typography>
      </Box>
      <Box className="board-card-list__grid">
        {doctors.map((doctor) => {
          const doctorAppointments = appointments.filter((appointment) => appointment.doctorId === doctor.id)

          return (
            <Paper
              key={doctor.id}
              elevation={0}
              className={`board-card-list__doctor-card${doctor.id === selectedDoctorId ? ' is-selected' : ''}`}
              onClick={() => onSelectDoctor(doctor.id)}
            >
              <div className="board-card-list__doctor-header">
                <div>
                  <strong>{doctor.name}</strong>
                  <span>{doctor.availableLabel}</span>
                </div>
                <Avatar sx={{ width: 30, height: 30, bgcolor: doctor.id === selectedDoctorId ? '#ff5d1f' : '#173354', fontSize: 12 }}>
                  {doctor.initials}
                </Avatar>
              </div>
              <div className="board-card-list__doctor-appointments">
                {doctorAppointments.length === 0 && <div className="board-card-list__empty">No appointments in this period</div>}
                {doctorAppointments.map((appointment) => (
                  <MiniAppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            </Paper>
          )
        })}
      </Box>
    </Box>
  )
}

function ListView({ appointments, doctors, selectedDoctorId, onSelectDoctor }) {
  const sortedAppointments = [...appointments].sort((left, right) => {
    const leftKey = `${left.date}-${left.start}`
    const rightKey = `${right.date}-${right.start}`
    return leftKey.localeCompare(rightKey)
  })

  return (
    <Box className="schedule-list-view">
      <div className="schedule-list-view__header">
        <span>Doctor</span>
        <span>Date</span>
        <span>Time</span>
        <span>Appointment</span>
      </div>
      {sortedAppointments.map((appointment) => {
        const doctor = doctors.find((item) => item.id === appointment.doctorId) ?? doctors[0]

        return (
          <div
            key={appointment.id}
            className={`schedule-list-view__row${appointment.doctorId === selectedDoctorId ? ' is-selected' : ''}`}
            onClick={() => onSelectDoctor(appointment.doctorId)}
          >
            <div className="schedule-list-view__doctor">
              <Avatar sx={{ width: 28, height: 28, bgcolor: appointment.doctorId === selectedDoctorId ? '#ff5d1f' : '#173354', fontSize: 12 }}>
                {doctor.initials}
              </Avatar>
              <span>{doctor.name}</span>
            </div>
            <span>{formatListDate(appointment.date)}</span>
            <span>{formatTimeRange(appointment.start, appointment.end)}</span>
            <MiniAppointmentCard appointment={appointment} />
          </div>
        )
      })}
    </Box>
  )
}

function AppointmentBlock({ appointment }) {
  const style = appointmentStyles[appointment.type]
  const startMinutes = getMinutesFromTime(appointment.start)
  const endMinutes = getMinutesFromTime(appointment.end)
  const totalMinutes = (16 - 8) * 60
  const left = ((startMinutes - 8 * 60) / totalMinutes) * 100
  const width = ((endMinutes - startMinutes) / totalMinutes) * 100

  return (
    <Tooltip title={`${appointment.title} • ${appointment.patient}`}>
      <div
        className="appointment-block"
        style={{
          left: `${left}%`,
          width: `${width}%`,
          top: `${8 + appointment.lane * 58}px`,
          borderLeftColor: style.accent,
          backgroundColor: style.background,
        }}
      >
        <span className="appointment-block__pin">↗</span>
        <div className="appointment-block__title" style={{ color: style.text }}>
          {appointment.title}
        </div>
        <div className="appointment-block__patient">{appointment.patient}</div>
        <div className="appointment-block__time">
          {formatTimeRange(appointment.start, appointment.end)}
          <span className="appointment-block__tag">{appointment.tag}</span>
        </div>
        {appointment.status && <div className="appointment-block__status">{appointment.status}</div>}
      </div>
    </Tooltip>
  )
}

function MiniAppointmentCard({ appointment }) {
  const style = appointmentStyles[appointment.type]

  return (
    <div
      className="mini-appointment-card"
      style={{
        borderLeftColor: style.accent,
        backgroundColor: style.background,
      }}
    >
      <div className="mini-appointment-card__title" style={{ color: style.text }}>
        {appointment.title}
      </div>
      <div className="mini-appointment-card__text">{appointment.patient}</div>
      <div className="mini-appointment-card__text">{formatTimeRange(appointment.start, appointment.end)}</div>
    </div>
  )
}

function assignLanes(items) {
  const sorted = [...items].sort((left, right) => left.start.localeCompare(right.start))
  const laneEnds = []

  return sorted.map((item) => {
    const startMinutes = getMinutesFromTime(item.start)
    const endMinutes = getMinutesFromTime(item.end)
    let lane = laneEnds.findIndex((laneEnd) => laneEnd <= startMinutes)

    if (lane === -1) {
      lane = laneEnds.length
      laneEnds.push(endMinutes)
    } else {
      laneEnds[lane] = endMinutes
    }

    return { ...item, lane }
  })
}

function isAppointmentInRange(appointment, activeDate, mode) {
  const appointmentDate = parseDateKey(appointment.date)

  if (mode === 'day') {
    return isSameDate(appointmentDate, activeDate)
  }

  if (mode === 'week') {
    const weekStart = startOfWeek(activeDate)
    const weekEnd = addDays(weekStart, 6)
    return appointmentDate >= weekStart && appointmentDate <= weekEnd
  }

  return appointmentDate.getFullYear() === activeDate.getFullYear() && appointmentDate.getMonth() === activeDate.getMonth()
}

function getDateRangeLabel(date, mode) {
  if (mode === 'day') {
    return formatDetailedDate(date)
  }

  if (mode === 'week') {
    const weekStart = startOfWeek(date)
    const weekEnd = addDays(weekStart, 6)
    return `${formatShortMonthDay(weekStart)} - ${formatShortMonthDay(weekEnd)}`
  }

  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`
}

function formatDetailedDate(date) {
  return `${weekdays[date.getDay()]}, ${monthNames[date.getMonth()].slice(0, 3)} ${date.getDate()}, ${date.getFullYear()}`
}

function formatShortMonthDay(date) {
  return `${monthNames[date.getMonth()].slice(0, 3)} ${date.getDate()}`
}

function formatListDate(dateKey) {
  const date = parseDateKey(dateKey)
  return `${fullWeekdays[date.getDay()]}, ${monthNames[date.getMonth()].slice(0, 3)} ${date.getDate()}`
}

function formatTimeRange(start, end) {
  return `${formatClock(start)} - ${formatClock(end)}`
}

function formatClock(time) {
  const [hoursPart, minutesPart] = time.split(':').map(Number)
  const meridiem = hoursPart >= 12 ? 'PM' : 'AM'
  const hourValue = hoursPart % 12 || 12
  return `${String(hourValue).padStart(2, '0')}:${minutesPart.toString().padStart(2, '0')} ${meridiem}`
}

function formatHourLabel(hour) {
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const value = hour % 12 || 12
  return `${String(value).padStart(2, '0')} ${suffix}`
}

function getMinutesFromTime(time) {
  const [hoursPart, minutesPart] = time.split(':').map(Number)
  return hoursPart * 60 + minutesPart
}

function parseDateKey(dateKey) {
  const [year, month, date] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, date)
}

function formatDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function addDays(date, amount) {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + amount)
  return nextDate
}

function addMonths(date, amount) {
  const nextDate = new Date(date)
  nextDate.setMonth(nextDate.getMonth() + amount)
  return nextDate
}

function startOfWeek(date) {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() - nextDate.getDay())
  nextDate.setHours(0, 0, 0, 0)
  return nextDate
}

function isSameDate(left, right) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  )
}

function buildMonthGrid(date) {
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
  const gridStart = startOfWeek(monthStart)
  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index))
}

export default ScheduleBoardPage
