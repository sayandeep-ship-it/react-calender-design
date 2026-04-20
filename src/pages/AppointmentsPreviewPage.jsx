import {
  Avatar,
  Box,
  Card,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material'

const appointments = [
  {
    id: 'a1',
    dateLabel: 'Sunday, 15 February 2026',
    patient: 'Rahul Sharma',
    initials: 'RS',
    time: '9:00 AM',
    duration: '30 min',
    visitType: 'ECG · Consultation',
    treatment: 'Chest Pain Assessment',
    doctor: 'Dr. Ramesh Kumar',
    department: 'Cardiology',
    status: 'Completed',
    accent: '#cf92f0',
    avatar: '#c98be8',
  },
  {
    id: 'a2',
    dateLabel: 'Friday, 20 February 2026',
    patient: 'Nash Sexton',
    initials: 'NS',
    time: '10:30 AM',
    duration: '30 min',
    visitType: 'Glucose Test · Routine',
    treatment: 'Pregnancy Follow-up',
    doctor: 'Dr. Kavita Sen',
    department: 'Gynecology',
    status: 'Completed',
    accent: '#f0785a',
    avatar: '#ed8366',
  },
  {
    id: 'a3',
    dateLabel: 'Thursday, 26 February 2026',
    patient: 'Zaid Randall',
    initials: 'ZR',
    time: '9:30 AM',
    duration: '30 min',
    visitType: 'Growth Scan · Routine',
    treatment: 'Pregnancy Follow-up',
    doctor: 'Dr. Josie Charles',
    department: 'Gynecology',
    status: 'Confirmed',
    accent: '#67b8da',
    avatar: '#6eafd6',
    today: true,
  },
  {
    id: 'a4',
    dateLabel: 'Thursday, 26 February 2026',
    patient: 'Sienna Hinton',
    initials: 'SH',
    time: '2:30 PM',
    duration: '30 min',
    visitType: 'Skin Assessment · Consultation',
    treatment: 'Skin Allergy Treatment',
    doctor: 'Dr. Kaiden Rowland',
    department: 'Gynecology',
    status: 'Confirmed',
    accent: '#f0a03f',
    avatar: '#ec9834',
  },
  {
    id: 'a5',
    dateLabel: 'Friday, 20 February 2026',
    patient: 'Bowen Willis',
    initials: 'BW',
    time: '10:30 AM',
    duration: '30 min',
    visitType: 'BP Monitoring · Check-up',
    treatment: 'Annual Health Checkup',
    doctor: 'Dr. Cristian Waters',
    department: 'Gynecology',
    status: 'Scheduled',
    accent: '#9a75f5',
    avatar: '#8a69ef',
  },
  {
    id: 'a6',
    dateLabel: 'Friday, 20 February 2026',
    patient: 'Cohen Burt',
    initials: 'CB',
    time: '9:30 AM',
    duration: '30 min',
    visitType: 'Mobility Assessment · Therapy',
    treatment: 'Knee Replacement Recovery',
    doctor: 'Dr. Chelsea Crosby',
    department: 'Gynecology',
    status: 'Scheduled',
    accent: '#9fd85d',
    avatar: '#72c23f',
  },
  {
    id: 'a7',
    dateLabel: 'Friday, 20 February 2026',
    patient: 'Kayla Yang',
    initials: 'KY',
    time: '5:30 AM',
    duration: '30 min',
    visitType: 'Glucose Test · Routine',
    treatment: 'Pregnancy Follow-up',
    doctor: 'Dr. Yaritza George',
    department: 'Gynecology',
    status: 'Confirmed',
    accent: '#51bfd0',
    avatar: '#39aabb',
  },
]

const statusStyles = {
  Completed: { bg: '#efefef', color: '#636363' },
  Confirmed: { bg: '#d9f8bf', color: '#3b9c39' },
  Scheduled: { bg: '#ffe9b5', color: '#af8420' },
}

function AppointmentsPreviewPage() {
  const groupedAppointments = appointments.reduce((accumulator, item) => {
    const existing = accumulator.find((entry) => entry.dateLabel === item.dateLabel)
    if (existing) {
      existing.items.push(item)
      return accumulator
    }

    accumulator.push({
      dateLabel: item.dateLabel,
      today: item.today ?? false,
      items: [item],
    })
    return accumulator
  }, [])

  return (
    <Card
      elevation={0}
      sx={{
        p: 1.5,
        borderRadius: 4,
        border: '1px solid #e6ebe8',
        boxShadow: '0 18px 36px rgba(44, 57, 53, 0.08)',
        bgcolor: '#fbfcfb',
      }}
    >
      <Stack spacing={1.6}>
        {groupedAppointments.map((group, groupIndex) => (
          <Box key={`${group.dateLabel}-${groupIndex}`}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ px: 0.25, mb: 0.85 }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontSize: 17, fontWeight: 500, color: '#25312d' }}>
                  {group.dateLabel}
                </Typography>
                {group.today && (
                  <Chip
                    label="Today"
                    size="small"
                    sx={{
                      height: 22,
                      bgcolor: '#0c7a57',
                      color: 'white',
                      fontWeight: 600,
                      '& .MuiChip-label': { px: 1.1, fontSize: 11 },
                    }}
                  />
                )}
              </Stack>
              <Typography sx={{ fontSize: 12, color: '#6e7b77' }}>
                {group.items.length} appointment{group.items.length > 1 ? 's' : ''}
              </Typography>
            </Stack>

            <Stack spacing={1.05}>
              {group.items.map((appointment) => {
                const status = statusStyles[appointment.status]

                return (
                  <Paper
                    key={appointment.id}
                    elevation={0}
                    sx={{
                      px: 0,
                      py: 0,
                      borderRadius: 1.8,
                      border: '1px solid #e3e9e5',
                      overflow: 'hidden',
                      bgcolor: 'white',
                    }}
                  >
                    <Stack
                      direction={{ xs: 'column', lg: 'row' }}
                      alignItems={{ xs: 'stretch', lg: 'center' }}
                      spacing={1.4}
                      sx={{ minHeight: 62, px: 0.2, py: 1 }}
                    >
                      <Box
                        sx={{
                          minWidth: 92,
                          px: 1.5,
                          borderLeft: `3px solid ${appointment.accent}`,
                          borderRight: { lg: '1px solid #edf1ef' },
                        }}
                      >
                        <Typography sx={{ fontSize: 22, fontWeight: 500, color: '#26322f', lineHeight: 1.1 }}>
                          {appointment.time}
                        </Typography>
                        <Typography sx={{ mt: 0.25, fontSize: 12, color: '#7a8782' }}>
                          {appointment.duration}
                        </Typography>
                      </Box>

                      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 260, px: { xs: 1.4, lg: 0 } }}>
                        <Avatar sx={{ width: 30, height: 30, bgcolor: appointment.avatar, fontSize: 12, fontWeight: 700 }}>
                          {appointment.initials}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#26312d' }}>
                            {appointment.patient}
                          </Typography>
                          <Typography sx={{ fontSize: 12, color: '#6d7b76' }}>
                            {appointment.visitType}
                          </Typography>
                        </Box>
                      </Stack>

                      <Box sx={{ flex: 1, px: { xs: 1.4, lg: 0 }, minWidth: 0 }}>
                        <Chip
                          label={appointment.treatment}
                          sx={{
                            height: 26,
                            bgcolor: '#d8f8df',
                            color: '#1f8a49',
                            borderRadius: 999,
                            '& .MuiChip-label': {
                              px: 1.4,
                              fontSize: 11,
                              fontWeight: 500,
                            },
                          }}
                        />
                      </Box>

                      <Box sx={{ minWidth: 170, px: { xs: 1.4, lg: 0 } }}>
                        <Typography sx={{ fontSize: 15, fontWeight: 500, color: '#26312d', textAlign: { lg: 'right' } }}>
                          {appointment.doctor}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: '#6d7b76', textAlign: { lg: 'right' } }}>
                          {appointment.department}
                        </Typography>
                      </Box>

                      <Box sx={{ px: { xs: 1.4, lg: 0 }, pr: { lg: 1.2 } }}>
                        <Chip
                          label={appointment.status}
                          sx={{
                            height: 28,
                            minWidth: 94,
                            bgcolor: status.bg,
                            color: status.color,
                            borderRadius: 999,
                            '& .MuiChip-label': {
                              px: 1.5,
                              fontSize: 12,
                              fontWeight: 500,
                            },
                          }}
                        />
                      </Box>
                    </Stack>
                  </Paper>
                )
              })}
            </Stack>

            {groupIndex < groupedAppointments.length - 1 && <Divider sx={{ mt: 1.4, borderColor: '#edf1ef' }} />}
          </Box>
        ))}
      </Stack>
    </Card>
  )
}

export default AppointmentsPreviewPage
