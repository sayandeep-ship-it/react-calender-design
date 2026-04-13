import { useState } from 'react'
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  Typography,
} from '@mui/material'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'

const availabilityOptions = [
  'OPD Consultation',
  'Surgery/Theater',
  'ICU',
  'Diagnostics',
  'Ward/Patient room',
]

function StatusRulesDesignPage() {
  const [selectedOptions, setSelectedOptions] = useState(['Surgery/Theater'])
  const [mandatorySchedule, setMandatorySchedule] = useState(true)
  const [quantity, setQuantity] = useState(2)

  const toggleOption = (option) => {
    setSelectedOptions((current) =>
      current.includes(option) ? current.filter((item) => item !== option) : [...current, option],
    )
  }

  return (
    <Card
      elevation={0}
      sx={{
        p: { xs: 2, md: 2.25 },
        borderRadius: 4,
        border: '1px solid #e6ebe8',
        boxShadow: '0 18px 36px rgba(44, 57, 53, 0.08)',
        bgcolor: '#fbfcfb',
      }}
    >
      <Stack
        direction={{ xs: 'column', xl: 'row' }}
        spacing={2}
        alignItems={{ xs: 'stretch', xl: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 2.25 }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} flexWrap="wrap" useFlexGap>
          {['Basic info', 'Location', 'Classification', 'Availability Setup', 'Status rules'].map((step, index) => {
            const current = step === 'Status rules'
            return (
              <Stack key={step} direction="row" spacing={1.5} alignItems="center">
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{
                    px: 1.75,
                    py: 1.2,
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
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {current ? '5' : <CheckRoundedIcon sx={{ fontSize: 18 }} />}
                  </Box>
                  <Typography sx={{ fontSize: 12.5, fontWeight: 500 }}>{step}</Typography>
                </Stack>
                {index < 4 && <ArrowForwardRoundedIcon sx={{ color: '#778783', fontSize: 18 }} />}
              </Stack>
            )
          })}
        </Stack>
      </Stack>

      <Box sx={{ maxWidth: 540, mx: 'auto' }}>
        <Typography sx={{ fontSize: 30, fontWeight: 700, color: '#202c29' }}>Status Rules</Typography>
        <Typography sx={{ mt: 0.5, fontSize: 12, color: '#73817d' }}>
          Set automated status rules to manage the behavior of this resource
        </Typography>

        <Card
          elevation={0}
          sx={{
            mt: 1.8,
            px: 1.5,
            py: 1.1,
            borderRadius: 2.5,
            bgcolor: '#f3f5f4',
            border: '1px solid #edf1ef',
          }}
        >
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Avatar
              variant="rounded"
              sx={{
                width: 30,
                height: 30,
                bgcolor: '#0ea56d',
                borderRadius: 1.5,
              }}
            >
              <CalendarMonthRoundedIcon sx={{ fontSize: 17 }} />
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#1f2a27' }}>
                Ventilator X200
              </Typography>
              <Typography sx={{ fontSize: 11, color: '#7b8884' }}>Reusable Equipment</Typography>
            </Box>
          </Stack>
        </Card>

        <Card
          elevation={0}
          sx={{
            mt: 1.75,
            p: 1.6,
            borderRadius: 3,
            border: '1px solid #e6ebe8',
            boxShadow: '0 8px 18px rgba(44, 57, 53, 0.04)',
          }}
        >
          <Card
            elevation={0}
            sx={{
              p: 1.5,
              borderRadius: 2.5,
              bgcolor: '#fbfcfb',
              border: '1px solid #edf2ef',
            }}
          >
            <Typography sx={{ fontSize: 17, fontWeight: 700, color: '#23302c', mb: 0.6 }}>
              Available for
            </Typography>

            <Stack spacing={0.2}>
              {availabilityOptions.map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      size="small"
                      checked={selectedOptions.includes(option)}
                      onChange={() => toggleOption(option)}
                      sx={{
                        color: '#d8dfdb',
                        '&.Mui-checked': {
                          color: '#0b7a57',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: 12, color: '#4b5c57' }}>
                      {option}
                    </Typography>
                  }
                  sx={{ m: 0 }}
                />
              ))}
            </Stack>
          </Card>

          <Card
            elevation={0}
            sx={{
              mt: 1.35,
              px: 1.5,
              py: 1.1,
              borderRadius: 2.5,
              bgcolor: '#fbfcfb',
              border: '1px solid #edf2ef',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1.1} alignItems="center">
                <Avatar sx={{ width: 30, height: 30, bgcolor: '#4ea86f', fontSize: 14 }}>
                  <ScheduleRoundedIcon sx={{ fontSize: 17 }} />
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#22302c' }}>
                    Mandatory for Schedule Type
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: '#7c8985' }}>
                    Is this resources mandatory for schedule type
                  </Typography>
                </Box>
              </Stack>

              <Switch
                checked={mandatorySchedule}
                onChange={(event) => setMandatorySchedule(event.target.checked)}
                sx={{
                  m: 0,
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: 'white',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    bgcolor: '#0b7a57',
                    opacity: 1,
                  },
                  '& .MuiSwitch-track': {
                    bgcolor: '#c9d5cf',
                    opacity: 1,
                  },
                }}
              />
            </Stack>
          </Card>

          <Card
            elevation={0}
            sx={{
              mt: 1.15,
              px: 1.5,
              py: 1.1,
              borderRadius: 2.5,
              bgcolor: '#fbfcfb',
              border: '1px solid #edf2ef',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.25}>
              <Stack direction="row" spacing={1.1} alignItems="center">
                <Avatar sx={{ width: 30, height: 30, bgcolor: '#4ea86f', fontSize: 14 }}>
                  <LocalHospitalRoundedIcon sx={{ fontSize: 17 }} />
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#22302c' }}>
                    Quantity Required per Schedule
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: '#7c8985' }}>
                    Set quantity for each schedulw
                  </Typography>
                </Box>
              </Stack>

              <Select
                size="small"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                sx={{
                  minWidth: 92,
                  height: 36,
                  bgcolor: 'white',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#dce4df',
                  },
                  '& .MuiSelect-select': {
                    fontSize: 12,
                    color: '#445650',
                  },
                }}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          </Card>
        </Card>
      </Box>
    </Card>
  )
}

export default StatusRulesDesignPage
