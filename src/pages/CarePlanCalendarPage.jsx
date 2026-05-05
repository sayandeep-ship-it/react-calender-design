import { useMemo, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import TodayRoundedIcon from '@mui/icons-material/TodayRounded'

const carePlanResponse = {
  timezone: 'Asia/Kolkata',
  server_time: '2026-05-05 05:50:29',
  timezone_time: '2026-05-05 11:20:29',
  patient: {
    id: 29,
    name: 'Masud Biswas',
    email: 'masud.biswas@technoexponent.co.in',
    secondaryEmail: null,
    phone: '9587456515',
    status: 'ACTIVE',
  },
  appointment_template: {
    id: 4,
    template_name: 'Gynaecology Che',
    treatment_type: '1',
    speciality: '5',
    status: 'A',
    staff_id: 6,
    timeline: [
      {
        name: 'Checkup',
        timeline: 'T-2',
      },
      {
        name: 'Surgery',
        timeline: 'T-0',
      },
      {
        name: 'Follow Up',
        timeline: 'T+3',
      },
    ],
  },
  timeline: [
    {
      timeline_index: 0,
      title: 'Checkup',
      timeline: 'T-2',
      schedule_type: 'Gynaecology Che',
      duration_minutes: null,
      speciality_id: '5',
      staff_id: 6,
      appointments: [
        {
          id: 25,
          patient_id: 29,
          appointment_template_id: 4,
          staff_id: 6,
          staff: {
            id: 6,
            staff_name: 'Che',
            email: 'test@gmail.com',
            mobile_number: '9874561230',
            profile_picture: 'public/profile-picture-1775727703646.png',
            role: '1',
            department: '6',
            speciality: ['Urology', 'ENT (Otolaryngology)'],
          },
          location_id: 1,
          location: {
            id: 1,
            name: '520 West Cowley Drive',
            type: null,
          },
          schedule_type: 'OPD Consultation',
          appointment_date: '2026-04-30',
          start_time: '08:00:00',
          end_time: '09:00:00',
          duration: 60,
          status: 'done',
          appointment_time_status: 'done',
          appointment_mode: null,
          care_plan_id: 4,
          reason: 'Checkup',
          notes: '{"title":"Checkup","timeline":"T-2","timeline_index":0,"slot_key":"6-2026-04-30-08:00:00","speciality_id":5,"selected":false,"extra_notes":null}',
          parsed_notes: {
            title: 'Checkup',
            timeline: 'T-2',
            timeline_index: 0,
            slot_key: '6-2026-04-30-08:00:00',
            speciality_id: 5,
            selected: false,
            extra_notes: null,
          },
          is_active: true,
          created_at: '2026-04-27T11:38:34.000Z',
          updated_at: '2026-04-27T11:38:34.000Z',
        },
      ],
    },
    {
      timeline_index: 1,
      title: 'Surgery',
      timeline: 'T-0',
      schedule_type: 'Gynaecology Che',
      duration_minutes: null,
      speciality_id: '5',
      staff_id: 6,
      appointments: [
        {
          id: 27,
          patient_id: 29,
          appointment_template_id: 4,
          staff_id: 6,
          staff: {
            id: 6,
            staff_name: 'Che',
            email: 'test@gmail.com',
            mobile_number: '9874561230',
            profile_picture: 'public/profile-picture-1775727703646.png',
            role: '1',
            department: '6',
            speciality: ['Urology', 'ENT (Otolaryngology)'],
          },
          location_id: 1,
          location: {
            id: 1,
            name: '520 West Cowley Drive',
            type: null,
          },
          schedule_type: 'Gynaecology Che',
          appointment_date: '2026-05-02',
          start_time: '09:30:00',
          end_time: '10:30:00',
          duration: 60,
          status: 'done',
          appointment_time_status: 'done',
          appointment_mode: null,
          care_plan_id: 4,
          reason: 'Surgery',
          notes: '{"title":"Surgery","timeline":"T-0","timeline_index":1,"slot_key":"6-2026-05-02-09:30:00","speciality_id":"5","selected":false,"extra_notes":null}',
          parsed_notes: {
            title: 'Surgery',
            timeline: 'T-0',
            timeline_index: 1,
            slot_key: '6-2026-05-02-09:30:00',
            speciality_id: '5',
            selected: false,
            extra_notes: null,
          },
          is_active: true,
          created_at: '2026-04-29T11:36:05.000Z',
          updated_at: '2026-04-29T11:36:05.000Z',
        },
      ],
    },
    {
      timeline_index: 2,
      title: 'Follow Up',
      timeline: 'T+3',
      schedule_type: 'Gynaecology Che',
      duration_minutes: null,
      speciality_id: '5',
      staff_id: 6,
      appointments: [
        {
          id: 28,
          patient_id: 29,
          appointment_template_id: 4,
          staff_id: 6,
          staff: {
            id: 6,
            staff_name: 'Che',
            email: 'test@gmail.com',
            mobile_number: '9874561230',
            profile_picture: 'public/profile-picture-1775727703646.png',
            role: '1',
            department: '6',
            speciality: ['Urology', 'ENT (Otolaryngology)'],
          },
          location_id: 1,
          location: {
            id: 1,
            name: '520 West Cowley Drive',
            type: null,
          },
          schedule_type: 'Gynaecology Che',
          appointment_date: '2026-05-05',
          start_time: '12:00:00',
          end_time: '13:00:00',
          duration: 60,
          status: 'A',
          appointment_time_status: 'booked',
          appointment_mode: null,
          care_plan_id: 4,
          reason: 'Follow Up',
          notes: '{"title":"Follow Up","timeline":"T+3","timeline_index":2,"slot_key":"6-2026-05-05-12:00:00","speciality_id":"5","selected":false,"extra_notes":null}',
          parsed_notes: {
            title: 'Follow Up',
            timeline: 'T+3',
            timeline_index: 2,
            slot_key: '6-2026-05-05-12:00:00',
            speciality_id: '5',
            selected: false,
            extra_notes: null,
          },
          is_active: true,
          created_at: '2026-04-29T11:40:57.000Z',
          updated_at: '2026-04-29T11:40:57.000Z',
        },
      ],
    },
  ],
  appointments: [],
}

const timelineColors = ['#0b7a57', '#f28a2e', '#6d58db']
const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function CarePlanCalendarPage() {
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState(0)
  const [displayMonth, setDisplayMonth] = useState(new Date(2026, 4, 1))

  const template = carePlanResponse.appointment_template
  const patient = carePlanResponse.patient

  const timelineEntries = useMemo(
    () =>
      carePlanResponse.timeline.map((entry, index) => ({
        ...entry,
        color: timelineColors[index % timelineColors.length],
      })),
    [],
  )

  const timelineLookup = useMemo(
    () =>
      timelineEntries.reduce((accumulator, entry) => {
        accumulator[entry.timeline_index] = entry
        return accumulator
      }, {}),
    [timelineEntries],
  )

  const selectedTimeline = timelineLookup[selectedTimelineIndex] || timelineEntries[0]
  const appointmentsByDate = useMemo(() => {
    const map = new Map()

    timelineEntries.forEach((entry) => {
      entry.appointments.forEach((appointment) => {
        const next = {
          ...appointment,
          timeline_index: entry.timeline_index,
          timeline_label: entry.timeline,
          timeline_title: entry.title,
          color: entry.color,
        }

        const existing = map.get(appointment.appointment_date) || []
        existing.push(next)
        map.set(appointment.appointment_date, existing)
      })
    })

    return map
  }, [timelineEntries])

  const monthDates = useMemo(() => getMonthGridDates(displayMonth), [displayMonth])
  const selectedAppointments = selectedTimeline?.appointments || []
  const totalAppointments = timelineEntries.reduce(
    (total, entry) => total + entry.appointments.length,
    0,
  )

  return (
    <Stack spacing={2.25}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <IconButton
          size="small"
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2.5,
            bgcolor: 'white',
            border: '1px solid #dbe6e0',
          }}
        >
          <ArrowBackRoundedIcon />
        </IconButton>
        <Typography sx={{ fontSize: { xs: 28, md: 38 }, fontWeight: 700, color: '#0f1f1b' }}>
          Care Plan Dashboard
        </Typography>
      </Stack>

      <Paper elevation={0} sx={heroCardSx}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={heroIconSx}>
            <ContentCopyRoundedIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
              <Typography sx={{ fontSize: { xs: 28, md: 38 }, fontWeight: 700, color: '#0b5e57' }}>
                {template.template_name}
              </Typography>
              <Chip
                label="Active"
                sx={{
                  height: 30,
                  bgcolor: '#dff5bf',
                  color: '#326618',
                  fontWeight: 700,
                  '& .MuiChip-label': { px: 2, fontSize: 15 },
                }}
              />
            </Stack>
            <Typography sx={{ mt: 0.5, fontSize: 18, color: '#71847d' }}>{patient.name}</Typography>
          </Box>
        </Stack>
      </Paper>

      <Paper elevation={0} sx={pageCardSx}>
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2.5} alignItems="stretch">
          <Box sx={{ width: { xs: '100%', lg: 360 }, flexShrink: 0 }}>
            <Paper elevation={0} sx={timelinePanelSx}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.75 }}>
                <Typography sx={{ fontSize: 28, fontWeight: 700, color: '#11211d' }}>
                  Journey Timeline
                </Typography>
                <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#0b7a57' }}>
                  {timelineEntries.length}/{timelineEntries.length}
                </Typography>
              </Stack>

              <Stack spacing={1.6}>
                {timelineEntries.map((entry) => {
                  const active = entry.timeline_index === selectedTimelineIndex

                  return (
                    <Box
                      key={entry.timeline_index}
                      onClick={() => setSelectedTimelineIndex(entry.timeline_index)}
                      sx={{
                        ...timelineItemSx,
                        borderColor: active ? '#0b7a57' : 'transparent',
                        bgcolor: active ? '#edf8f3' : '#ffffff',
                        boxShadow: active ? '0 0 0 1px rgba(11,122,87,0.08)' : 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <Stack direction="row" spacing={1.75} alignItems="center">
                        <Box
                          sx={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            bgcolor: '#0b7a57',
                            color: 'white',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: 14,
                            fontWeight: 900,
                          }}
                        >
                          ✓
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#15231f' }}>
                            {entry.title}
                          </Typography>
                          <Typography sx={{ fontSize: 16, color: '#8a96aa' }}>
                            {entry.timeline} · Scheduled
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  )
                })}
              </Stack>
            </Paper>
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} spacing={1.5}>
              <Typography sx={{ fontSize: 30, fontWeight: 700, color: '#11211d' }}>
                {selectedTimeline.title}
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  alignSelf: { xs: 'flex-start', md: 'center' },
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 2.3,
                  py: 1.05,
                  borderColor: '#d1ddd7',
                  color: '#1d2b27',
                  fontSize: 16,
                }}
              >
                View In Calendar
              </Button>
            </Stack>

            <Paper elevation={0} sx={detailsStripSx}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.25}>
                <InfoBlock
                  icon={
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#0b7a57', fontSize: 16, fontWeight: 700 }}>
                      {getInitials(patient.name)}
                    </Avatar>
                  }
                  label="Patient Name"
                  value={patient.name}
                  subvalue={patient.email}
                />
                <InfoBlock
                  icon={
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#b8b6bb', fontSize: 18 }}>
                      C
                    </Avatar>
                  }
                  label="Lead Clinician"
                  value={selectedAppointments[0]?.staff?.staff_name || 'Che'}
                  subvalue={(selectedAppointments[0]?.staff?.speciality || []).join(', ')}
                />
                <InfoBlock
                  icon={<TodayRoundedIcon sx={{ color: '#0b7a57', fontSize: 32 }} />}
                  label="Appointment Date"
                  value={formatReadableDate(selectedAppointments[0]?.appointment_date)}
                  subvalue={selectedTimeline.timeline}
                />
              </Stack>
            </Paper>

            <Divider sx={{ my: 2.2, borderColor: '#dbe4df' }} />

            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1.5} alignItems={{ xs: 'stretch', md: 'center' }} sx={{ mb: 1.5 }}>
              <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#22332e' }}>
                Calendar View
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <IconButton size="small" onClick={() => setDisplayMonth(shiftMonth(displayMonth, -1))} sx={calendarNavSx}>
                  <ChevronLeftRoundedIcon />
                </IconButton>
                <Typography sx={{ minWidth: 170, textAlign: 'center', fontSize: 16, fontWeight: 700, color: '#20312c' }}>
                  {displayMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Typography>
                <IconButton size="small" onClick={() => setDisplayMonth(shiftMonth(displayMonth, 1))} sx={calendarNavSx}>
                  <ChevronRightRoundedIcon />
                </IconButton>
                <Chip
                  icon={<CalendarMonthRoundedIcon sx={{ fontSize: '16px !important' }} />}
                  label={carePlanResponse.timezone}
                  sx={{
                    height: 28,
                    bgcolor: '#eef6f1',
                    color: '#4b5f58',
                    '& .MuiChip-label': { px: 1.1, fontSize: 12, fontWeight: 600 },
                  }}
                />
              </Stack>
            </Stack>

            <Paper elevation={0} sx={calendarShellSx}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', borderBottom: '1px solid #dfe8e2' }}>
                {weekdayLabels.map((day) => (
                  <Box key={day} sx={{ py: 1.15, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#7c8e87' }}>{day}</Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
                {monthDates.map((date) => {
                  const key = toDateKey(date)
                  const dayAppointments = appointmentsByDate.get(key) || []
                  const inMonth = date.getMonth() === displayMonth.getMonth()
                  const hasSelected = dayAppointments.some(
                    (appointment) => appointment.timeline_index === selectedTimelineIndex,
                  )

                  return (
                    <Box
                      key={key}
                      sx={{
                        minHeight: 162,
                        p: 1.2,
                        borderRight: date.getDay() === 6 ? 0 : '1px solid #e4ebe7',
                        borderBottom: '1px solid #e4ebe7',
                        bgcolor: hasSelected ? '#f2fbf8' : '#ffffff',
                        opacity: inMonth ? 1 : 0.42,
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.95 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#21312c' }}>{date.getDate()}</Typography>
                        {hasSelected && (
                          <Chip
                            size="small"
                            label="Selected"
                            sx={{
                              height: 20,
                              bgcolor: '#dff5ea',
                              color: '#0b7a57',
                              '& .MuiChip-label': { px: 0.8, fontSize: 10, fontWeight: 700 },
                            }}
                          />
                        )}
                      </Stack>

                      <Stack spacing={0.8}>
                        {dayAppointments.length === 0 ? (
                          <Typography sx={{ fontSize: 10.5, color: '#a0ada7' }}>No appointment</Typography>
                        ) : (
                          dayAppointments.map((appointment) => {
                            const active = appointment.timeline_index === selectedTimelineIndex

                            return (
                              <Box
                                key={appointment.id}
                                sx={{
                                  borderRadius: 2,
                                  border: `1px solid ${active ? `${appointment.color}55` : '#e6ece8'}`,
                                  borderLeft: `4px solid ${appointment.color}`,
                                  bgcolor: active ? `${appointment.color}12` : '#fbfdfc',
                                  px: 0.9,
                                  py: 0.75,
                                  transform: active ? 'scale(1.01)' : 'none',
                                  transition: 'all 180ms ease',
                                }}
                              >
                                <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#1d2a26' }}>
                                  {appointment.timeline_title}
                                </Typography>
                                <Typography sx={{ mt: 0.2, fontSize: 10.5, color: '#536862' }}>
                                  {formatTimeRange(appointment.start_time, appointment.end_time)}
                                </Typography>
                                <Typography sx={{ mt: 0.2, fontSize: 10.2, color: '#758781' }}>
                                  {appointment.location?.name || 'No location'}
                                </Typography>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.55 }}>
                                  <Typography sx={{ fontSize: 10, fontWeight: 700, color: appointment.color }}>
                                    {appointment.timeline_label}
                                  </Typography>
                                  <Chip
                                    size="small"
                                    label={getAppointmentStatusLabel(appointment)}
                                    sx={{
                                      height: 18,
                                      bgcolor: active ? '#0b7a57' : '#edf3ef',
                                      color: active ? 'white' : '#60726b',
                                      '& .MuiChip-label': { px: 0.75, fontSize: 9.5, fontWeight: 700 },
                                    }}
                                  />
                                </Stack>
                              </Box>
                            )
                          })
                        )}
                      </Stack>
                    </Box>
                  )
                })}
              </Box>
            </Paper>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.4} sx={{ mt: 1.6 }} flexWrap="wrap" useFlexGap>
              {timelineEntries.map((entry) => (
                <Stack key={entry.timeline_index} direction="row" spacing={0.7} alignItems="center">
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: entry.color }} />
                  <Typography sx={{ fontSize: 12, color: '#60736c' }}>
                    {entry.title} ({entry.timeline})
                  </Typography>
                </Stack>
              ))}
              <Stack direction="row" spacing={0.7} alignItems="center">
                <EventAvailableRoundedIcon sx={{ fontSize: 15, color: '#0b7a57' }} />
                <Typography sx={{ fontSize: 12, color: '#60736c' }}>
                  {totalAppointments} linked appointments
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  )
}

function InfoBlock({ icon, label, value, subvalue }) {
  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#687a74' }}>{label}</Typography>
      <Stack direction="row" spacing={1.1} alignItems="center" sx={{ mt: 1 }}>
        {icon}
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#162520' }}>{value || '--'}</Typography>
          <Typography sx={{ fontSize: 12.5, color: '#809089' }} noWrap>
            {subvalue || '--'}
          </Typography>
        </Box>
      </Stack>
    </Box>
  )
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

function formatTimeRange(startTime, endTime) {
  return `${formatClock(startTime)} - ${formatClock(endTime)}`
}

function formatClock(value) {
  if (!value) return '--'

  const [hour = 0, minute = 0] = String(value).split(':').map(Number)
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${String(minute).padStart(2, '0')} ${suffix}`
}

function getAppointmentStatusLabel(appointment) {
  if (appointment.appointment_time_status === 'done' || appointment.status === 'done') {
    return 'Completed'
  }

  if (appointment.appointment_time_status === 'booked') {
    return 'Booked'
  }

  return 'Active'
}

function getInitials(name) {
  return String(name)
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

const heroCardSx = {
  p: { xs: 2.2, md: 3 },
  borderRadius: 4,
  bgcolor: '#ffffff',
  border: '1px solid #e1ebe5',
  boxShadow: '0 16px 36px rgba(34, 57, 49, 0.06)',
}

const heroIconSx = {
  width: 48,
  height: 48,
  borderRadius: 2,
  bgcolor: '#0b7a57',
  color: 'white',
  display: 'grid',
  placeItems: 'center',
}

const pageCardSx = {
  p: { xs: 2, md: 2.8 },
  borderRadius: 4,
  bgcolor: '#ffffff',
  border: '1px solid #e1ebe5',
  boxShadow: '0 18px 40px rgba(34, 57, 49, 0.06)',
}

const timelinePanelSx = {
  p: 2,
  borderRadius: 3,
  bgcolor: '#f3fbf7',
}

const timelineItemSx = {
  px: 1.9,
  py: 1.7,
  borderRadius: 2.5,
  border: '1px solid',
}

const detailsStripSx = {
  mt: 1.2,
  p: 2,
  borderRadius: 3,
  bgcolor: '#f3fcf6',
}

const calendarNavSx = {
  width: 34,
  height: 34,
  border: '1px solid #d4dfd9',
  borderRadius: 2,
  bgcolor: 'white',
}

const calendarShellSx = {
  borderRadius: 3,
  border: '1px solid #dde6e1',
  overflow: 'hidden',
  bgcolor: '#ffffff',
}

export default CarePlanCalendarPage
