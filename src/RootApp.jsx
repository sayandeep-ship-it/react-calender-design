import { AppBar, Box, Button, Container, CssBaseline, Stack, Toolbar, Typography } from '@mui/material'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import MedicalServicesRoundedIcon from '@mui/icons-material/MedicalServicesRounded'
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded'
import ViewWeekRoundedIcon from '@mui/icons-material/ViewWeekRounded'
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded'
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded'
import StorageRoundedIcon from '@mui/icons-material/StorageRounded'
import AddIcCallRoundedIcon from '@mui/icons-material/AddIcCallRounded'
import ViewTimelineRoundedIcon from '@mui/icons-material/ViewTimelineRounded'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import CarePlanCalendarPage from './pages/CarePlanCalendarPage.jsx'
import HomePage from './pages/HomePage.jsx'
import AvailabilityCalendarPage from './pages/AvailabilityCalendarPage.jsx'
import AppointmentsPreviewPage from './pages/AppointmentsPreviewPage.jsx'
import DetailedMonthlySchedulePage from './pages/DetailedMonthlySchedulePage.jsx'
import MonthlySchedulePage from './pages/MonthlySchedulePage.jsx'
import PreviewListViewPage from './pages/PreviewListViewPage.jsx'
import ResourceAvailabilityBoardPage from './pages/ResourceAvailabilityBoardPage.jsx'
import ResourceConsolidatedCalendarPage from './pages/ResourceConsolidatedCalendarPage.jsx'
import ResourceFilterTablePage from './pages/ResourceFilterTablePage.jsx'
import ReviewPublishPage from './pages/ReviewPublishPage.jsx'
import ReviewPublishPayloadPage from './pages/ReviewPublishPayloadPage.jsx'
import ScheduleBoardPage from './pages/ScheduleBoardPage.jsx'
import ScheduleOverlayDemoPage from './pages/ScheduleOverlayDemoPage.jsx'
import StaffAvailabilitySetupPage from './pages/StaffAvailabilitySetupPage.jsx'
import StaticSeedDataManagerPage from './pages/StaticSeedDataManagerPage.jsx'
import StatusRulesDesignPage from './pages/StatusRulesDesignPage.jsx'
import PatientVideoCallPage from './pages/PatientVideoCallPage.jsx'
import TwilioApiTesterPage from './pages/TwilioApiTesterPage.jsx'
import PatientPortalDashboardPage from './pages/PatientPortalDashboardPage.jsx'
import PatientPortalProfilePage from './pages/PatientPortalProfilePage.jsx'

function RootApp() {
  const location = useLocation()
  const isPublicMeetingRoute = location.pathname.startsWith('/video-call/')
  const isPortalDashboardRoute =
    location.pathname.startsWith('/patient-portal-dashboard') ||
    location.pathname.startsWith('/patient-portal-profile')
  const hideShellChrome = isPublicMeetingRoute || isPortalDashboardRoute

  return (
    <>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: '#f4f7f5' }}>
        {!hideShellChrome && (
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
                  active={location.pathname === '/monthly-schedule-detailed'}
                  to="/monthly-schedule-detailed"
                  icon={<EventNoteRoundedIcon sx={{ fontSize: 18 }} />}
                  label="Detailed Schedule"
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
                <NavButton
                  active={location.pathname === '/schedule-board'}
                  to="/schedule-board"
                  icon={<ViewTimelineRoundedIcon sx={{ fontSize: 18 }} />}
                  label="Schedule Board"
                />
                <NavButton
                  active={location.pathname === '/schedule-overlays'}
                  to="/schedule-overlays"
                  icon={<EventNoteRoundedIcon sx={{ fontSize: 18 }} />}
                  label="Overlays"
                />
                <NavButton
                  active={location.pathname === '/preview-list-view'}
                  to="/preview-list-view"
                  icon={<ViewWeekRoundedIcon sx={{ fontSize: 18 }} />}
                  label="Preview List"
                />
                <NavButton
                  active={location.pathname === '/review-publish-payload'}
                  to="/review-publish-payload"
                  icon={<TaskAltRoundedIcon sx={{ fontSize: 18 }} />}
                  label="Payload Review"
                />
                <NavButton
                  active={location.pathname === '/status-rules-design'}
                  to="/status-rules-design"
                  icon={<MedicalServicesRoundedIcon sx={{ fontSize: 18 }} />}
                  label="Status Rules"
                />
                <NavButton
                  active={location.pathname === '/resource-availability-board'}
                  to="/resource-availability-board"
                  icon={<CalendarMonthRoundedIcon sx={{ fontSize: 18 }} />}
                  label="Resource Board"
                />
                <NavButton
                  active={location.pathname === '/resource-consolidated-calendar'}
                  to="/resource-consolidated-calendar"
                  icon={<CalendarMonthRoundedIcon sx={{ fontSize: 18 }} />}
                  label="Resource Calendar"
                />
                <NavButton
                  active={location.pathname === '/appointments-preview'}
                  to="/appointments-preview"
                  icon={<EventNoteRoundedIcon sx={{ fontSize: 18 }} />}
                  label="Appointments"
                />
                <NavButton
                  active={location.pathname === '/resource-filter-table'}
                  to="/resource-filter-table"
                  icon={<FilterListRoundedIcon sx={{ fontSize: 18 }} />}
                  label="Resource Filter"
                />
                <NavButton
                  active={location.pathname === '/care-plan-calendar'}
                  to="/care-plan-calendar"
                  icon={<ViewTimelineRoundedIcon sx={{ fontSize: 18 }} />}
                  label="Care Plan"
                />
                <NavButton
                  active={location.pathname === '/static-seed-data-manager'}
                  to="/static-seed-data-manager"
                  icon={<StorageRoundedIcon sx={{ fontSize: 18 }} />}
                  label="Static Data"
                />
                <NavButton
                  active={location.pathname === '/twilio-api-tester'}
                  to="/twilio-api-tester"
                  icon={<AddIcCallRoundedIcon sx={{ fontSize: 18 }} />}
                  label="Twilio"
                />
              </Stack>
            </Toolbar>
          </AppBar>
        )}

        <Container
          maxWidth={hideShellChrome ? false : 'lg'}
          sx={{
            py: hideShellChrome ? 0 : { xs: 3, md: 5 },
            px: hideShellChrome ? 0 : undefined,
          }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/availability-calendar" element={<AvailabilityCalendarPage />} />
            <Route path="/appointments-preview" element={<AppointmentsPreviewPage />} />
            <Route path="/care-plan-calendar" element={<CarePlanCalendarPage />} />
            <Route path="/monthly-schedule" element={<MonthlySchedulePage />} />
            <Route path="/monthly-schedule-detailed" element={<DetailedMonthlySchedulePage />} />
            <Route path="/preview-list-view" element={<PreviewListViewPage />} />
            <Route path="/resource-availability-board" element={<ResourceAvailabilityBoardPage />} />
            <Route path="/resource-consolidated-calendar" element={<ResourceConsolidatedCalendarPage />} />
            <Route path="/resource-filter-table" element={<ResourceFilterTablePage />} />
            <Route path="/review-publish" element={<ReviewPublishPage />} />
            <Route path="/review-publish-payload" element={<ReviewPublishPayloadPage />} />
            <Route path="/schedule-board" element={<ScheduleBoardPage />} />
            <Route path="/schedule-overlays" element={<ScheduleOverlayDemoPage />} />
            <Route path="/staff-availability-setup" element={<StaffAvailabilitySetupPage />} />
            <Route path="/static-seed-data-manager" element={<StaticSeedDataManagerPage />} />
            <Route path="/status-rules-design" element={<StatusRulesDesignPage />} />
            <Route path="/twilio-api-tester" element={<TwilioApiTesterPage />} />
            <Route path="/patient-portal-dashboard" element={<PatientPortalDashboardPage />} />
            <Route path="/patient-portal-profile" element={<PatientPortalProfilePage />} />
            <Route path="/video-call/:meetingId" element={<PatientVideoCallPage />} />
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
