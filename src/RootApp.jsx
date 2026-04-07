import { AppBar, Box, Button, Container, CssBaseline, Stack, Toolbar, Typography } from '@mui/material'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import MedicalServicesRoundedIcon from '@mui/icons-material/MedicalServicesRounded'
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded'
import ViewWeekRoundedIcon from '@mui/icons-material/ViewWeekRounded'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import AvailabilityCalendarPage from './pages/AvailabilityCalendarPage.jsx'
import MonthlySchedulePage from './pages/MonthlySchedulePage.jsx'
import ReviewPublishPage from './pages/ReviewPublishPage.jsx'
import StaffAvailabilitySetupPage from './pages/StaffAvailabilitySetupPage.jsx'

function RootApp() {
  const location = useLocation()

  return (
    <>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: '#f4f7f5' }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: 'rgba(255,255,255,0.92)',
            color: '#21312d',
            borderBottom: '1px solid #e2ebe5',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 2,
                  bgcolor: '#0b7a57',
                  color: 'white',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 700,
                }}
              >
                C
              </Box>
              <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 700 }}>
                Calendar Showcase
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <NavButton
                active={location.pathname === '/'}
                to="/"
                icon={<HomeRoundedIcon sx={{ fontSize: 18 }} />}
                label="Home"
              />
              <NavButton
                active={location.pathname === '/availability-calendar'}
                to="/availability-calendar"
                icon={<CalendarMonthRoundedIcon sx={{ fontSize: 18 }} />}
                label="Availability"
              />
              <NavButton
                active={location.pathname === '/monthly-schedule'}
                to="/monthly-schedule"
                icon={<ViewWeekRoundedIcon sx={{ fontSize: 18 }} />}
                label="Monthly Schedule"
              />
              <NavButton
                active={location.pathname === '/review-publish'}
                to="/review-publish"
                icon={<TaskAltRoundedIcon sx={{ fontSize: 18 }} />}
                label="Review Publish"
              />
              <NavButton
                active={location.pathname === '/staff-availability-setup'}
                to="/staff-availability-setup"
                icon={<MedicalServicesRoundedIcon sx={{ fontSize: 18 }} />}
                label="Staff Setup"
              />
            </Stack>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/availability-calendar" element={<AvailabilityCalendarPage />} />
            <Route path="/monthly-schedule" element={<MonthlySchedulePage />} />
            <Route path="/review-publish" element={<ReviewPublishPage />} />
            <Route path="/staff-availability-setup" element={<StaffAvailabilitySetupPage />} />
          </Routes>
        </Container>
      </Box>
    </>
  )
}

function NavButton({ active, to, icon, label }) {
  return (
    <Button
      component={Link}
      to={to}
      startIcon={icon}
      variant={active ? 'contained' : 'outlined'}
      sx={{
        textTransform: 'none',
        borderRadius: 999,
        px: 1.75,
        bgcolor: active ? '#0b7a57' : 'white',
        borderColor: active ? '#0b7a57' : '#d7e3dc',
        color: active ? 'white' : '#3e514c',
        '&:hover': {
          bgcolor: active ? '#096649' : '#f7faf8',
          borderColor: active ? '#096649' : '#cad9d1',
        },
      }}
    >
      {label}
    </Button>
  )
}

export default RootApp
