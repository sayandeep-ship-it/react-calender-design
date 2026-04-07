import { useMemo, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Popover,
  Select,
  Stack,
  TextField,
  InputAdornment,
  Typography,
} from '@mui/material'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded'
import PersonPinCircleRoundedIcon from '@mui/icons-material/PersonPinCircleRounded'

const scheduleTypes = [
  { value: 'OPD Consultation', color: '#6d4bb6' },
  { value: 'Theater / Surgery', color: '#ef6a61' },
  { value: 'Video Consultation', color: '#66bb6a' },
]

const locations = ['Medios hospital, London', 'Pharma hospital, London', 'City clinic, London']
const procedures = ['Orthopedics', 'Cardiology', 'Dermatology', 'Neurology', 'General Surgery']

const sourcePayload = [
  { date: '7', month: '4', year: '2026', type: 'Monthly', time: [] },
  { date: '8', month: '4', year: '2026', type: 'Monthly', time: [] },
  { date: '9', month: '4', year: '2026', type: 'Monthly', time: [] },
  { date: '10', month: '4', year: '2026', type: 'Monthly', time: [] },
  { date: '11', month: '4', year: '2026', type: 'Monthly', time: [] },
  { date: '12', month: '4', year: '2026', type: 'Monthly', time: [] },
  { date: '13', month: '4', year: '2026', type: 'Monthly', time: [] },
  { date: '14', month: '4', year: '2026', type: 'Monthly', time: [] },
  { date: '15', month: '4', year: '2026', type: 'Monthly', time: [] },
  { date: '16', month: '4', year: '2026', type: 'Monthly', time: [] },
  { date: '17', month: '4', year: '2026', type: 'Monthly', time: [] },
  { date: '18', month: '4', year: '2026', type: 'Monthly', time: [] },
  { date: '19', month: '4', year: '2026', type: 'Monthly', time: [] },
  { date: '20', month: '4', year: '2026', type: 'Monthly', time: [] },
  { date: '21', month: '4', year: '2026', type: 'Monthly', time: [] },
  { date: '22', month: '4', year: '2026', type: 'Monthly', time: [] },
  { date: '23', month: '4', year: '2026', type: 'Monthly', time: [] },
  { date: '24', month: '4', year: '2026', type: 'Monthly', time: [] },
  { date: '25', month: '4', year: '2026', type: 'Monthly', time: [] },
  { date: '26', month: '4', year: '2026', type: 'Monthly', time: [] },
  { date: '27', month: '4', year: '2026', type: 'Monthly', time: [] },
  { date: '28', month: '4', year: '2026', type: 'Monthly', time: [] },
  { date: '29', month: '4', year: '2026', type: 'Monthly', time: [] },
  { date: '30', month: '4', year: '2026', type: 'Monthly', time: [] },
]

function StaffAvailabilitySetupPage() {
  const [availability, setAvailability] = useState(() => seedAvailabilityPayload())
  const [copyState, setCopyState] = useState({
    anchorEl: null,
    sourceDateKey: '',
    sourceTimeId: '',
    targets: [],
  })

  const selectedRow = useMemo(() => {
    if (!copyState.sourceDateKey || !copyState.sourceTimeId) return null
    const day = availability.find((item) => toDateKey(item) === copyState.sourceDateKey)
    return day?.time.find((item) => item.id === copyState.sourceTimeId) ?? null
  }, [availability, copyState.sourceDateKey, copyState.sourceTimeId])

  const payloadPreview = useMemo(
    () =>
      availability.map((day) => ({
        date: day.date,
        month: day.month,
        year: day.year,
        type: day.type,
        time: day.time.map((entry) => ({
          startTime: entry.startTime,
          endTime: entry.endTime,
          scheduleType: entry.scheduleType,
          procedure: entry.procedure,
          location: entry.location,
        })),
      })),
    [availability],
  )

  const handleAddSchedule = (dateKey) => {
    setAvailability((current) =>
      current.map((day) =>
        toDateKey(day) === dateKey
          ? {
              ...day,
              time: [
                ...day.time,
                createScheduleEntry({
                  startTime: '09:00',
                  endTime: '17:00',
                  scheduleType: '',
                  location: '',
                  procedure: '',
                }),
              ],
            }
          : day,
      ),
    )
  }

  const handleDeleteSchedule = (dateKey, scheduleId) => {
    setAvailability((current) =>
      current.map((day) =>
        toDateKey(day) === dateKey
          ? {
              ...day,
              time: day.time.filter((entry) => entry.id !== scheduleId),
            }
          : day,
      ),
    )
  }

  const handleDuplicateSchedule = (dateKey, scheduleId) => {
    setAvailability((current) =>
      current.map((day) => {
        if (toDateKey(day) !== dateKey) return day
        const source = day.time.find((entry) => entry.id === scheduleId)
        if (!source) return day
        return {
          ...day,
          time: [
            ...day.time,
            createScheduleEntry({
              startTime: source.startTime,
              endTime: source.endTime,
              scheduleType: source.scheduleType,
              procedure: source.procedure,
              location: source.location,
            }),
          ],
        }
      }),
    )
  }

  const handleScheduleChange = (dateKey, scheduleId, field, value) => {
    setAvailability((current) =>
      current.map((day) =>
        toDateKey(day) === dateKey
          ? {
              ...day,
              time: day.time.map((entry) =>
                entry.id === scheduleId
                  ? {
                      ...entry,
                      [field]: value,
                    }
                  : entry,
              ),
            }
          : day,
      ),
    )
  }

  const handleOpenCopy = (event, dateKey, scheduleId) => {
    setCopyState({
      anchorEl: event.currentTarget,
      sourceDateKey: dateKey,
      sourceTimeId: scheduleId,
      targets: [],
    })
  }

  const handleToggleCopyTarget = (targetDateKey) => {
    setCopyState((current) => ({
      ...current,
      targets: current.targets.includes(targetDateKey)
        ? current.targets.filter((item) => item !== targetDateKey)
        : [...current.targets, targetDateKey],
    }))
  }

  const handleApplyCopy = () => {
    if (!selectedRow || copyState.targets.length === 0) {
      setCopyState({ anchorEl: null, sourceDateKey: '', sourceTimeId: '', targets: [] })
      return
    }

    setAvailability((current) =>
      current.map((day) =>
        copyState.targets.includes(toDateKey(day))
          ? {
              ...day,
              time: [
                ...day.time,
                createScheduleEntry({
                  startTime: selectedRow.startTime,
                  endTime: selectedRow.endTime,
                  scheduleType: selectedRow.scheduleType,
                  procedure: selectedRow.procedure,
                  location: selectedRow.location,
                }),
              ],
            }
          : day,
      ),
    )

    setCopyState({ anchorEl: null, sourceDateKey: '', sourceTimeId: '', targets: [] })
  }

  return (
    <Stack spacing={3}>
      <Card
        elevation={0}
        sx={{
          p: { xs: 2, md: 2.5 },
          borderRadius: 4,
          border: '1px solid #e6ebe8',
          boxShadow: '0 18px 36px rgba(44, 57, 53, 0.08)',
        }}
      >
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
          {['Basic info', 'Location', 'Capabilities', 'Availability Setup', 'Status rules', 'Review & publish'].map(
            (step, index) => {
              const current = step === 'Availability Setup'
              return (
                <Stack key={step} direction="row" spacing={1.5} alignItems="center">
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{
                      px: 1.5,
                      py: 1.1,
                      borderRadius: 999,
                      bgcolor: '#f7f8f7',
                    }}
                  >
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '999px',
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: current ? '#ff7a21' : '#0b7a57',
                        color: 'white',
                        fontWeight: 700,
                      }}
                    >
                      {current ? '4' : <CheckRoundedIcon sx={{ fontSize: 18 }} />}
                    </Box>
                    <Typography sx={{ fontSize: 12.5, fontWeight: 500 }}>{step}</Typography>
                  </Stack>
                  {index < 5 && <ArrowForwardRoundedIcon sx={{ color: '#7a8a85', fontSize: 18 }} />}
                </Stack>
              )
            },
          )}
        </Stack>
      </Card>

      <Card
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 4,
          border: '1px solid #e6ebe8',
          boxShadow: '0 18px 36px rgba(44, 57, 53, 0.08)',
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Avatar sx={{ width: 22, height: 22, bgcolor: '#264462', fontSize: 11 }}>JS</Avatar>
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>Dr. Jhon Smith</Typography>
            <Typography sx={{ fontSize: 11, color: '#6e7f7a' }}>
              Manage availability for appointments, surgery &amp; events
            </Typography>
          </Box>
        </Stack>

        <Typography variant="h4" sx={{ fontSize: { xs: 24, md: 30 }, fontWeight: 700 }}>
          When Jhon Smith available to meet with Patient?
        </Typography>
        <Typography sx={{ mt: 0.75, mb: 2.5, color: '#697a75' }}>
          Choose when and where <Box component="span" sx={{ fontWeight: 700 }}>Dr. Jhon Smith</Box> is available and assign
          schedule types.
        </Typography>

        <Paper
          variant="outlined"
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            borderColor: '#dfe7e2',
            bgcolor: 'white',
          }}
        >
          <Box sx={{ maxHeight: 760, overflowY: 'auto' }}>
            {availability.map((day, index) => {
              const dateKey = toDateKey(day)
              const dayLabel = formatDayLabel(day)

              return (
                <Box key={dateKey}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ px: 2, py: 1.4, bgcolor: index % 2 === 0 ? '#fcfdfc' : 'white' }}
                  >
                    <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: '#0f7a59' }}>
                      {dayLabel}
                    </Typography>

                    {day.time.length === 0 ? (
                      <Button
                        onClick={() => handleAddSchedule(dateKey)}
                        startIcon={<AddRoundedIcon />}
                        size="small"
                        sx={{
                          textTransform: 'none',
                          color: '#0f7a59',
                          borderRadius: 999,
                        }}
                      >
                        Add schedule
                      </Button>
                    ) : null}
                  </Stack>

                  {day.time.length === 0 ? (
                    <Box sx={{ px: 2, pb: 1.5 }}>
                      <Typography sx={{ fontSize: 12, color: '#7c8784' }}>Day Off</Typography>
                    </Box>
                  ) : (
                    <Stack spacing={1.25} sx={{ px: 2, pb: 2 }}>
                      {day.time.map((entry) => (
                        <Stack
                          key={entry.id}
                          direction={{ xs: 'column', xl: 'row' }}
                          spacing={1}
                          alignItems={{ xs: 'stretch', xl: 'center' }}
                          sx={{ minHeight: 44 }}
                        >
                          <TimeField
                            value={entry.startTime}
                            onChange={(value) => handleScheduleChange(dateKey, entry.id, 'startTime', value)}
                          />
                          <TimeField
                            value={entry.endTime}
                            onChange={(value) => handleScheduleChange(dateKey, entry.id, 'endTime', value)}
                          />

                          <Select
                            displayEmpty
                            value={entry.scheduleType}
                            onChange={(event) =>
                              handleScheduleChange(dateKey, entry.id, 'scheduleType', event.target.value)
                            }
                            sx={selectSx(160)}
                            renderValue={(selected) =>
                              selected ? (
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <ScheduleDot color={getScheduleColor(selected)} />
                                  <Typography sx={{ fontSize: 12 }}>{selected}</Typography>
                                </Stack>
                              ) : (
                                <Typography sx={{ fontSize: 12, color: '#97a39f' }}>Schedule Type</Typography>
                              )
                            }
                          >
                            {scheduleTypes.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <ScheduleDot color={option.color} />
                                  <Typography sx={{ fontSize: 12 }}>{option.value}</Typography>
                                </Stack>
                              </MenuItem>
                            ))}
                          </Select>

                          <Select
                            displayEmpty
                            value={entry.location}
                            onChange={(event) =>
                              handleScheduleChange(dateKey, entry.id, 'location', event.target.value)
                            }
                            sx={selectSx(190)}
                            renderValue={(selected) =>
                              selected ? (
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <PlaceRoundedIcon sx={{ fontSize: 16, color: '#0f7a59' }} />
                                  <Typography sx={{ fontSize: 12 }}>{selected}</Typography>
                                </Stack>
                              ) : (
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <PlaceRoundedIcon sx={{ fontSize: 16, color: '#9aa6a2' }} />
                                  <Typography sx={{ fontSize: 12, color: '#97a39f' }}>Select Location</Typography>
                                </Stack>
                              )
                            }
                          >
                            {locations.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>

                          <Select
                            displayEmpty
                            value={entry.procedure}
                            onChange={(event) =>
                              handleScheduleChange(dateKey, entry.id, 'procedure', event.target.value)
                            }
                            sx={selectSx(160)}
                            renderValue={(selected) =>
                              selected ? (
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <LocalHospitalRoundedIcon sx={{ fontSize: 16, color: '#0f7a59' }} />
                                  <Typography sx={{ fontSize: 12 }}>{selected}</Typography>
                                </Stack>
                              ) : (
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <PersonPinCircleRoundedIcon sx={{ fontSize: 16, color: '#9aa6a2' }} />
                                  <Typography sx={{ fontSize: 12, color: '#97a39f' }}>Select Procedure</Typography>
                                </Stack>
                              )
                            }
                          >
                            {procedures.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>

                          <Stack direction="row" spacing={0.25} alignItems="center">
                            <IconButton size="small" sx={actionIconSx} onClick={() => handleDeleteSchedule(dateKey, entry.id)}>
                              <DeleteOutlineRoundedIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" sx={actionIconSx} onClick={() => handleDuplicateSchedule(dateKey, entry.id)}>
                              <AddRoundedIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              sx={actionIconSx}
                              onClick={(event) => handleOpenCopy(event, dateKey, entry.id)}
                            >
                              <ContentCopyRoundedIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </Stack>
                      ))}
                    </Stack>
                  )}

                  {index < availability.length - 1 && <Divider />}
                </Box>
              )
            })}
          </Box>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 2, py: 1.25, borderTop: '1px solid #edf2ef', bgcolor: '#fcfdfc' }}
          >
            <Typography sx={{ fontSize: 11, color: '#647570' }}>
              Time Zone &nbsp; <Box component="span" sx={{ fontWeight: 700 }}>UK Standard time (2:26 pm)</Box>
            </Typography>
            <Chip
              size="small"
              label={`${availability.reduce((sum, day) => sum + day.time.length, 0)} schedule rows`}
              sx={{ bgcolor: '#eef8f2', color: '#0f7a59', fontWeight: 700 }}
            />
          </Stack>
        </Paper>

        <Stack direction="row" justifyContent="center" spacing={1.5} sx={{ mt: 2.5 }}>
          <Button
            variant="outlined"
            sx={{
              textTransform: 'none',
              minWidth: 120,
              borderColor: '#d9e3dd',
              color: '#50625e',
            }}
          >
            {'<-'} Back
          </Button>
          <Button
            variant="contained"
            sx={{
              textTransform: 'none',
              minWidth: 120,
              bgcolor: '#4aa26c',
              '&:hover': { bgcolor: '#3f8d5d' },
            }}
          >
            Next {'->'}
          </Button>
        </Stack>
      </Card>

      <Card
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 3,
          border: '1px solid #e6ebe8',
          boxShadow: '0 12px 24px rgba(44, 57, 53, 0.06)',
        }}
      >
        <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1.25 }}>Payload Preview</Typography>
        <Box
          component="pre"
          sx={{
            m: 0,
            p: 1.5,
            overflow: 'auto',
            maxHeight: 320,
            bgcolor: '#f8fbf9',
            borderRadius: 2,
            border: '1px solid #e4ece7',
            fontSize: 12,
            lineHeight: 1.5,
          }}
        >
          {JSON.stringify(payloadPreview, null, 2)}
        </Box>
      </Card>

      <Popover
        open={Boolean(copyState.anchorEl)}
        anchorEl={copyState.anchorEl}
        onClose={() => setCopyState({ anchorEl: null, sourceDateKey: '', sourceTimeId: '', targets: [] })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1,
            width: 220,
            borderRadius: 2,
            border: '1px solid #dce6e0',
            boxShadow: '0 16px 28px rgba(39, 58, 53, 0.18)',
            p: 1.25,
          },
        }}
      >
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#7b8a86', mb: 1 }}>
          COPY TIME TO:
        </Typography>
        <Stack spacing={0.25} sx={{ maxHeight: 220, overflowY: 'auto' }}>
          {availability
            .filter((day) => toDateKey(day) !== copyState.sourceDateKey)
            .map((day) => {
              const key = toDateKey(day)
              return (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      size="small"
                      checked={copyState.targets.includes(key)}
                      onChange={() => handleToggleCopyTarget(key)}
                    />
                  }
                  label={<Typography sx={{ fontSize: 12 }}>{formatShortDate(day)}</Typography>}
                />
              )
            })}
        </Stack>
        <Button
          fullWidth
          variant="contained"
          onClick={handleApplyCopy}
          sx={{
            mt: 1.25,
            textTransform: 'none',
            bgcolor: '#4aa26c',
            '&:hover': { bgcolor: '#3f8d5d' },
          }}
        >
          Apply
        </Button>
      </Popover>
    </Stack>
  )
}

function TimeField({ value, onChange }) {
  return (
    <TextField
      type="time"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      size="small"
      sx={{
        minWidth: 92,
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          fontSize: 12,
          height: 38,
          bgcolor: 'white',
        },
      }}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <AccessTimeRoundedIcon sx={{ fontSize: 15, color: '#4f615d' }} />
            </InputAdornment>
          ),
        },
      }}
      inputProps={{ step: 300 }}
    />
  )
}

function ScheduleDot({ color }) {
  return <Box sx={{ width: 8, height: 8, borderRadius: '999px', bgcolor: color }} />
}

function selectSx(width) {
  return {
    minWidth: width,
    height: 38,
    bgcolor: 'white',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#dce5e0',
    },
    '& .MuiSelect-select': {
      py: 1,
      fontSize: 12,
      display: 'flex',
      alignItems: 'center',
    },
  }
}

function seedAvailabilityPayload() {
  const seeded = sourcePayload.map((item) => ({
    ...item,
    id: toDateKey(item),
    time: [],
  }))

  const seedMap = {
    '2026-04-08': [
      createScheduleEntry({
        startTime: '09:00',
        endTime: '17:00',
        scheduleType: 'OPD Consultation',
        location: 'Medios hospital, London',
        procedure: 'Orthopedics',
      }),
    ],
    '2026-04-09': [
      createScheduleEntry({
        startTime: '09:00',
        endTime: '17:00',
        scheduleType: '',
        location: '',
        procedure: '',
      }),
    ],
    '2026-04-10': [
      createScheduleEntry({
        startTime: '07:00',
        endTime: '10:00',
        scheduleType: '',
        location: 'Medios hospital, London',
        procedure: 'Orthopedics',
      }),
      createScheduleEntry({
        startTime: '15:00',
        endTime: '20:00',
        scheduleType: '',
        location: 'Pharma hospital, London',
        procedure: 'Orthopedics',
      }),
    ],
    '2026-04-11': [
      createScheduleEntry({
        startTime: '09:00',
        endTime: '17:00',
        scheduleType: 'OPD Consultation',
        location: 'Medios hospital, London',
        procedure: 'Orthopedics',
      }),
    ],
    '2026-04-13': [
      createScheduleEntry({
        startTime: '09:00',
        endTime: '17:00',
        scheduleType: '',
        location: '',
        procedure: 'Orthopedics',
      }),
    ],
  }

  return seeded.map((item) => ({
    ...item,
    time: seedMap[toDateKey(item)] ?? item.time,
  }))
}

function createScheduleEntry(overrides) {
  return {
    startTime: '',
    endTime: '',
    scheduleType: '',
    procedure: '',
    location: '',
    ...overrides,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${crypto.randomUUID().slice(0, 6)}`,
  }
}

function toDateKey(item) {
  return `${item.year}-${String(item.month).padStart(2, '0')}-${String(item.date).padStart(2, '0')}`
}

function formatDayLabel(item) {
  const date = new Date(Number(item.year), Number(item.month) - 1, Number(item.date))
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatShortDate(item) {
  const date = new Date(Number(item.year), Number(item.month) - 1, Number(item.date))
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  })
}

function getScheduleColor(label) {
  return scheduleTypes.find((item) => item.value === label)?.color ?? '#97a39f'
}

const actionIconSx = {
  color: '#6d7c78',
  '&:hover': {
    bgcolor: '#f4f7f5',
  },
}

export default StaffAvailabilitySetupPage
