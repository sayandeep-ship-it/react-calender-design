import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import MedicalServicesRoundedIcon from '@mui/icons-material/MedicalServicesRounded'
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded'
import ViewWeekRoundedIcon from '@mui/icons-material/ViewWeekRounded'
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import ViewTimelineRoundedIcon from '@mui/icons-material/ViewTimelineRounded'
import { Link } from 'react-router-dom'

const pages = [
  {
    title: 'Availability Calendar',
    description:
      'React + MUI version of the compact calendar-part design with monthly, weekly, and day selection views.',
    to: '/availability-calendar',
    icon: <CalendarMonthRoundedIcon sx={{ fontSize: 26 }} />,
  },
  {
    title: 'Monthly Schedule',
    description:
      'A separate route for the monthly scheduling layout with colored schedule bars and day actions.',
    to: '/monthly-schedule',
    icon: <ViewWeekRoundedIcon sx={{ fontSize: 26 }} />,
  },
  {
    title: 'Detailed Monthly Schedule',
    description:
      'A denser monthly doctor schedule board with detailed daily cards, day-off states, month switching, and actions popover.',
    to: '/monthly-schedule-detailed',
    icon: <EventNoteRoundedIcon sx={{ fontSize: 26 }} />,
  },
  {
    title: 'Review & Publish',
    description:
      'A final review page with summary details and a monthly availability-dot calendar that supports month and year changes.',
    to: '/review-publish',
    icon: <TaskAltRoundedIcon sx={{ fontSize: 26 }} />,
  },
  {
    title: 'Staff Availability Setup',
    description:
      'JSON-driven schedule editor with time pickers, schedule type, location, procedure, add/delete, duplicate, and copy-to-dates actions.',
    to: '/staff-availability-setup',
    icon: <MedicalServicesRoundedIcon sx={{ fontSize: 26 }} />,
  },
  {
    title: 'Schedule Board',
    description:
      'SCSS + MUI schedule board inspired by the management screenshot, with day, week, and month views plus doctor-row highlighting.',
    to: '/schedule-board',
    icon: <ViewTimelineRoundedIcon sx={{ fontSize: 26 }} />,
  },
  {
    title: 'Schedule Overlays',
    description:
      'A dedicated route with two launch buttons that open the monthly calendar edit sidebar and the specific-dates selection modal.',
    to: '/schedule-overlays',
    icon: <EventNoteRoundedIcon sx={{ fontSize: 26 }} />,
  },
  {
    title: 'Preview List View',
    description:
      'A list-first schedule preview page with grouped day rows, active list/calendar toggle, and per-row edit drawer actions.',
    to: '/preview-list-view',
    icon: <ViewWeekRoundedIcon sx={{ fontSize: 26 }} />,
  },
  {
    title: 'Payload Review Publish',
    description:
      'A review-and-publish page that maps real calendar API response data into the monthly dot calendar and summary cards.',
    to: '/review-publish-payload',
    icon: <TaskAltRoundedIcon sx={{ fontSize: 26 }} />,
  },
]

function HomePage() {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 700 }}>
          Calendar Pages
        </Typography>
        <Typography sx={{ mt: 1, color: '#61726d', maxWidth: 720 }}>
          Each design lives on its own route now, so you can keep multiple calendar concepts in one
          React app and evolve them independently.
        </Typography>
      </Box>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} flexWrap="wrap" useFlexGap>
        {pages.map((page) => (
          <Paper
            key={page.to}
            elevation={0}
            sx={{
              flex: '1 1 280px',
              p: 3,
              borderRadius: 4,
              border: '1px solid #dde8e1',
              boxShadow: '0 18px 36px rgba(61, 93, 82, 0.08)',
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 3,
                bgcolor: '#eef7f3',
                color: '#0b7a57',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              {page.icon}
            </Box>
            <Typography variant="h5" sx={{ mt: 2, fontSize: 22, fontWeight: 700 }}>
              {page.title}
            </Typography>
            <Typography sx={{ mt: 1.25, color: '#667873', minHeight: 72 }}>
              {page.description}
            </Typography>
            <Button
              component={Link}
              to={page.to}
              endIcon={<ArrowForwardRoundedIcon />}
              variant="contained"
              sx={{
                mt: 2.5,
                textTransform: 'none',
                bgcolor: '#0b7a57',
                borderRadius: 999,
                px: 2,
                '&:hover': { bgcolor: '#096649' },
              }}
            >
              Open page
            </Button>
          </Paper>
        ))}
      </Stack>
    </Stack>
  )
}

export default HomePage
