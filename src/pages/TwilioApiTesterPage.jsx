import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AddIcCallRoundedIcon from '@mui/icons-material/AddIcCallRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import PhoneForwardedRoundedIcon from '@mui/icons-material/PhoneForwardedRounded'
import PublishedWithChangesRoundedIcon from '@mui/icons-material/PublishedWithChangesRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import { useNavigate } from 'react-router-dom'

const API_PREFIX = 'http://localhost:3000/api'

const optionCards = [
  {
    key: 'buy',
    title: 'Buy a Number',
    subtitle: 'Search available numbers and purchase one instantly.',
    emoji: '🤝',
    color: '#e9f7f0',
  },
  {
    key: 'connect',
    title: 'Connect Existing Twilio Account',
    subtitle: 'Link an account and import all connected phone numbers.',
    icon: <PublishedWithChangesRoundedIcon sx={{ fontSize: 40, color: '#2f72da' }} />,
    color: '#eef4ff',
  },
  {
    key: 'port',
    title: 'Port a Number',
    subtitle: 'Create a request for an existing number you want to use.',
    icon: <PhoneForwardedRoundedIcon sx={{ fontSize: 42, color: '#4caf50' }} />,
    color: '#eef9ef',
  },
]

function TwilioApiTesterPage() {
  const navigate = useNavigate()
  const [activeModal, setActiveModal] = useState('')
  const [loadingKey, setLoadingKey] = useState('')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [buyStep, setBuyStep] = useState(1)
  const [portStep, setPortStep] = useState(1)

  const [connectForm, setConnectForm] = useState({
    account_sid: '',
    auth_token: '',
    name: 'Twilio Account',
  })
  const [searchForm, setSearchForm] = useState({
    country: 'US',
    type: 'local',
    area_code: '',
    contains: '',
    sms: '1',
    voice: '1',
    limit: '10',
  })
  const [buyForm, setBuyForm] = useState({
    phone_number: '',
    friendly_name: 'Twilio Number',
    connection_id: '',
  })
  const [portForm, setPortForm] = useState({
    phone_number: '',
    name: 'Existing Number',
    account_holder_name: '',
    carrier_name: '',
    billing_account_number: '',
    billing_zip: '',
    authorized_person_name: '',
    authorized_person_email: '',
  })

  const [connectResponse, setConnectResponse] = useState(null)
  const [searchResponse, setSearchResponse] = useState(null)
  const [buyResponse, setBuyResponse] = useState(null)
  const [portResponse, setPortResponse] = useState(null)
  const [detectResponse, setDetectResponse] = useState(null)

  const runRequest = async ({ key, url, method = 'GET', body, onSuccess }) => {
    setLoadingKey(key)
    try {
      const data = await apiRequest(url, { method, body })
      onSuccess(data)
      setSnackbar({
        open: true,
        message: data.message || 'Request completed successfully',
        severity: 'success',
      })
    } catch (error) {
      onSuccess({
        status: false,
        error: error.message,
      })
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error',
      })
    } finally {
      setLoadingKey('')
    }
  }

  return (
    <Stack spacing={4}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" useFlexGap>
        <Button
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate(-1)}
          variant="outlined"
          sx={backButtonSx}
        >
          Back
        </Button>
      </Stack>

      <Typography
        sx={{
          textAlign: 'center',
          fontSize: { xs: 30, md: 52 },
          lineHeight: 1.12,
          fontWeight: 700,
          color: '#1f2a4a',
          maxWidth: 1120,
          mx: 'auto',
        }}
      >
        What kind of twilio account do you want to connect?
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
          gap: 2.25,
          maxWidth: 1010,
          mx: 'auto',
          width: '100%',
        }}
      >
        {optionCards.map((card) => (
          <Card
            key={card.key}
            elevation={0}
            onClick={() => {
              setActiveModal(card.key)
              if (card.key === 'buy') setBuyStep(1)
              if (card.key === 'port') setPortStep(1)
            }}
            sx={optionCardSx}
          >
            <Stack alignItems="center" justifyContent="center" spacing={2.2} sx={{ minHeight: 200 }}>
              <Box sx={{ ...iconBubbleSx, bgcolor: card.color }}>
                {card.emoji ? (
                  <Typography sx={{ fontSize: 44, lineHeight: 1 }}>{card.emoji}</Typography>
                ) : (
                  card.icon
                )}
              </Box>
              <Typography
                sx={{
                  textAlign: 'center',
                  fontSize: 19,
                  fontWeight: 500,
                  color: '#21304b',
                  maxWidth: 240,
                }}
              >
                {card.title}
              </Typography>
            </Stack>
          </Card>
        ))}
      </Box>

      <TaskDialog
        open={activeModal === 'connect'}
        title="Connect Existing Twilio Account"
        onClose={() => setActiveModal('')}
      >
        <FormGrid>
          <TextField
            label="Account SID"
            value={connectForm.account_sid}
            onChange={(event) =>
              setConnectForm((current) => ({ ...current, account_sid: event.target.value }))
            }
            fullWidth
          />
          <TextField
            label="Auth Token"
            value={connectForm.auth_token}
            onChange={(event) =>
              setConnectForm((current) => ({ ...current, auth_token: event.target.value }))
            }
            fullWidth
          />
          <TextField
            label="Connection Name"
            value={connectForm.name}
            onChange={(event) =>
              setConnectForm((current) => ({ ...current, name: event.target.value }))
            }
            fullWidth
          />
        </FormGrid>

        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={() =>
              runRequest({
                key: 'connect',
                url: `${API_PREFIX}/channel/twilio/connect-account`,
                method: 'POST',
                body: connectForm,
                onSuccess: setConnectResponse,
              })
            }
            disabled={loadingKey === 'connect'}
            sx={primaryButtonSx}
          >
            {loadingKey === 'connect' ? 'Connecting...' : 'Connect Account'}
          </Button>
        </Stack>

        <ResponsePanel data={connectResponse} />
      </TaskDialog>

      <TaskDialog
        open={activeModal === 'buy'}
        title="Buy a Number"
        onClose={() => setActiveModal('')}
      >
        <StepHeader
          steps={[
            'Search Criteria',
            'Choose Number',
            'Purchase Details',
          ]}
          activeStep={buyStep}
        />

        {buyStep === 1 && (
          <>
            <Typography sx={sectionTitleSx}>Search Available Numbers</Typography>
            <FormGrid>
              <SelectField
                label="Country"
                value={searchForm.country}
                onChange={(value) => setSearchForm((current) => ({ ...current, country: value }))}
                options={['US', 'GB', 'IN', 'CA']}
              />
              <SelectField
                label="Type"
                value={searchForm.type}
                onChange={(value) => setSearchForm((current) => ({ ...current, type: value }))}
                options={['local', 'tollfree', 'mobile']}
              />
              <TextField
                label="Area Code"
                value={searchForm.area_code}
                onChange={(event) =>
                  setSearchForm((current) => ({ ...current, area_code: event.target.value }))
                }
                fullWidth
              />
              <TextField
                label="Contains"
                value={searchForm.contains}
                onChange={(event) =>
                  setSearchForm((current) => ({ ...current, contains: event.target.value }))
                }
                fullWidth
              />
              <SelectField
                label="SMS Enabled"
                value={searchForm.sms}
                onChange={(value) => setSearchForm((current) => ({ ...current, sms: value }))}
                options={['1', '0']}
              />
              <SelectField
                label="Voice Enabled"
                value={searchForm.voice}
                onChange={(value) => setSearchForm((current) => ({ ...current, voice: value }))}
                options={['1', '0']}
              />
              <TextField
                label="Limit"
                value={searchForm.limit}
                onChange={(event) =>
                  setSearchForm((current) => ({ ...current, limit: event.target.value }))
                }
                fullWidth
              />
            </FormGrid>
            <StepActions
              onNext={() =>
                runRequest({
                  key: 'search',
                  url: `${API_PREFIX}/channel/twilio/numbers/search?${toQueryString(searchForm)}`,
                  method: 'GET',
                  onSuccess: (data) => {
                    setSearchResponse(data)
                    if (data?.status && Array.isArray(data.data) && data.data.length > 0) {
                      setBuyStep(2)
                    }
                  },
                })
              }
              nextLabel={loadingKey === 'search' ? 'Searching...' : 'Search Numbers'}
              loading={loadingKey === 'search'}
            />
          </>
        )}

        {buyStep === 2 && (
          <>
            <Typography sx={sectionTitleSx}>Choose a Number</Typography>
            <Typography sx={helperTextSx}>
              Pick one of the available numbers to carry into the purchase step.
            </Typography>
            {searchResponse?.data?.length > 0 ? (
              <Paper elevation={0} sx={resultsPanelSx}>
                <Stack spacing={1}>
                  {searchResponse.data.map((item) => (
                    <Stack
                      key={item.phone_number}
                      direction={{ xs: 'column', md: 'row' }}
                      justifyContent="space-between"
                      spacing={1.5}
                      sx={{
                        ...resultRowSx,
                        borderColor:
                          buyForm.phone_number === item.phone_number ? '#0b7a57' : '#e4ebe7',
                        bgcolor:
                          buyForm.phone_number === item.phone_number ? '#eef8f3' : '#ffffff',
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#1e2c48' }}>
                          {item.phone_number}
                        </Typography>
                        <Typography sx={{ mt: 0.35, fontSize: 12.5, color: '#6d7d77' }}>
                          {item.locality || item.region || 'No locality'} · {item.country}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        startIcon={<CheckCircleRoundedIcon />}
                        onClick={() =>
                          setBuyForm((current) => ({
                            ...current,
                            phone_number: item.phone_number,
                            friendly_name: item.friendly_name || current.friendly_name,
                          }))
                        }
                        sx={miniActionButtonSx}
                      >
                        {buyForm.phone_number === item.phone_number ? 'Selected' : 'Use Number'}
                      </Button>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            ) : (
              <Alert severity="info" sx={{ mt: 1.5, borderRadius: 2.5 }}>
                No search results yet. Go back and search for numbers first.
              </Alert>
            )}

            <StepActions
              onBack={() => setBuyStep(1)}
              onNext={() => setBuyStep(3)}
              disableNext={!buyForm.phone_number}
              nextLabel="Continue"
            />
          </>
        )}

        {buyStep === 3 && (
          <>
            <Typography sx={sectionTitleSx}>Purchase Details</Typography>
            <FormGrid>
              <TextField
                label="Phone Number"
                value={buyForm.phone_number}
                onChange={(event) =>
                  setBuyForm((current) => ({ ...current, phone_number: event.target.value }))
                }
                fullWidth
              />
              <TextField
                label="Friendly Name"
                value={buyForm.friendly_name}
                onChange={(event) =>
                  setBuyForm((current) => ({ ...current, friendly_name: event.target.value }))
                }
                fullWidth
              />
              <TextField
                label="Connection ID (optional)"
                value={buyForm.connection_id}
                onChange={(event) =>
                  setBuyForm((current) => ({ ...current, connection_id: event.target.value }))
                }
                fullWidth
              />
            </FormGrid>

            <StepActions
              onBack={() => setBuyStep(2)}
              onNext={() =>
                runRequest({
                  key: 'buy',
                  url: `${API_PREFIX}/channel/twilio/numbers/buy`,
                  method: 'POST',
                  body: {
                    phone_number: buyForm.phone_number,
                    friendly_name: buyForm.friendly_name,
                    connection_id: buyForm.connection_id ? Number(buyForm.connection_id) : null,
                  },
                  onSuccess: setBuyResponse,
                })
              }
              nextLabel={loadingKey === 'buy' ? 'Buying...' : 'Buy Number'}
              loading={loadingKey === 'buy'}
            />
          </>
        )}

        <ResponsePanel data={buyResponse || searchResponse} />
      </TaskDialog>

      <TaskDialog
        open={activeModal === 'port'}
        title="Port a Number"
        onClose={() => setActiveModal('')}
      >
        <StepHeader
          steps={[
            'Detect Number',
            'Porting Details',
            'Submit Request',
          ]}
          activeStep={portStep}
        />

        {portStep === 1 && (
          <>
            <Typography sx={sectionTitleSx}>Detect Existing Number</Typography>
            <FormGrid>
              <TextField
                label="Phone Number"
                value={portForm.phone_number}
                onChange={(event) =>
                  setPortForm((current) => ({ ...current, phone_number: event.target.value }))
                }
                fullWidth
              />
            </FormGrid>

            <StepActions
              onNext={() =>
                runRequest({
                  key: 'detect',
                  url: `${API_PREFIX}/channel/twilio/existing-number/detect`,
                  method: 'POST',
                  body: { phone_number: portForm.phone_number },
                  onSuccess: (data) => {
                    setDetectResponse(data)
                    if (data?.status && data?.data) {
                      setPortForm((current) => ({
                        ...current,
                        phone_number: data.data.phone_number || current.phone_number,
                        carrier_name: data.data.carrier_name || current.carrier_name,
                      }))
                      setPortStep(2)
                    }
                  },
                })
              }
              nextLabel={loadingKey === 'detect' ? 'Detecting...' : 'Detect Number'}
              loading={loadingKey === 'detect'}
              disableNext={!portForm.phone_number}
            />
          </>
        )}

        {portStep === 2 && (
          <>
            <Typography sx={sectionTitleSx}>Review Detected Details</Typography>
            {detectResponse?.data ? (
              <Paper elevation={0} sx={detectionPanelSx}>
                <Stack spacing={1.2}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2} flexWrap="wrap" useFlexGap>
                    <InfoPill label="Number" value={detectResponse.data.phone_number || '--'} />
                    <InfoPill label="Carrier" value={detectResponse.data.carrier_name || '--'} />
                    <InfoPill label="Line Type" value={detectResponse.data.line_type || '--'} />
                    <InfoPill label="Country" value={detectResponse.data.country_code || '--'} />
                    <InfoPill
                      label="Valid"
                      value={detectResponse.data.valid === true ? 'Yes' : detectResponse.data.valid === false ? 'No' : '--'}
                    />
                  </Stack>

                  {Array.isArray(detectResponse.data.still_required_for_porting) &&
                    detectResponse.data.still_required_for_porting.length > 0 && (
                      <Box>
                        <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: '#31413d', mb: 0.8 }}>
                          Still required for porting
                        </Typography>
                        <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
                          {detectResponse.data.still_required_for_porting.map((field) => (
                            <Paper key={field} elevation={0} sx={requiredChipSx}>
                              {field}
                            </Paper>
                          ))}
                        </Stack>
                      </Box>
                    )}
                </Stack>
              </Paper>
            ) : (
              <Alert severity="info" sx={{ mt: 1.5, borderRadius: 2.5 }}>
                Detect the number first to continue.
              </Alert>
            )}

            <StepActions
              onBack={() => setPortStep(1)}
              onNext={() => setPortStep(3)}
              disableNext={!detectResponse?.data}
              nextLabel="Continue"
            />
          </>
        )}

        {portStep === 3 && (
          <>
            <Typography sx={sectionTitleSx}>Create Port Request</Typography>
            <FormGrid>
              <TextField
                label="Name"
                value={portForm.name}
                onChange={(event) =>
                  setPortForm((current) => ({ ...current, name: event.target.value }))
                }
                fullWidth
              />
              <TextField
                label="Carrier Name"
                value={portForm.carrier_name}
                onChange={(event) =>
                  setPortForm((current) => ({ ...current, carrier_name: event.target.value }))
                }
                fullWidth
                disabled
              />
              <TextField
                label="Account Holder Name"
                value={portForm.account_holder_name}
                onChange={(event) =>
                  setPortForm((current) => ({
                    ...current,
                    account_holder_name: event.target.value,
                  }))
                }
                fullWidth
              />
              <TextField
                label="Billing Account Number"
                value={portForm.billing_account_number}
                onChange={(event) =>
                  setPortForm((current) => ({
                    ...current,
                    billing_account_number: event.target.value,
                  }))
                }
                fullWidth
              />
              <TextField
                label="Billing ZIP"
                value={portForm.billing_zip}
                onChange={(event) =>
                  setPortForm((current) => ({ ...current, billing_zip: event.target.value }))
                }
                fullWidth
              />
              <TextField
                label="Authorized Person Name"
                value={portForm.authorized_person_name}
                onChange={(event) =>
                  setPortForm((current) => ({
                    ...current,
                    authorized_person_name: event.target.value,
                  }))
                }
                fullWidth
              />
              <TextField
                label="Authorized Person Email"
                value={portForm.authorized_person_email}
                onChange={(event) =>
                  setPortForm((current) => ({
                    ...current,
                    authorized_person_email: event.target.value,
                  }))
                }
                fullWidth
              />
            </FormGrid>

            <StepActions
              onBack={() => setPortStep(2)}
              onNext={() =>
                runRequest({
                  key: 'port',
                  url: `${API_PREFIX}/channel/twilio/bring-existing-number`,
                  method: 'POST',
                  body: {
                    phone_number: portForm.phone_number,
                    name: portForm.name,
                    account_holder_name: portForm.account_holder_name,
                    billing_account_number: portForm.billing_account_number,
                    billing_zip: portForm.billing_zip,
                    authorized_person_name: portForm.authorized_person_name,
                    authorized_person_email: portForm.authorized_person_email,
                  },
                  onSuccess: setPortResponse,
                })
              }
              nextLabel={loadingKey === 'port' ? 'Submitting...' : 'Create Port Request'}
              loading={loadingKey === 'port'}
            />
          </>
        )}

        <ResponsePanel data={portResponse || detectResponse} />
      </TaskDialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3200}
        onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Stack>
  )
}

function TaskDialog({ open, title, onClose, children }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden',
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: { xs: 2, md: 2.5 }, borderBottom: '1px solid #e7eeea', bgcolor: '#fbfdfc' }}>
          <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="center">
            <Box>
              <Typography sx={{ fontSize: 25, fontWeight: 700, color: '#1f2a4a' }}>{title}</Typography>
              <Typography sx={{ mt: 0.4, color: '#6e7c77' }}>
                Fill the form and run the Twilio task directly from this modal.
              </Typography>
            </Box>
            <Button onClick={onClose} variant="outlined" sx={secondaryButtonSx}>
              Close
            </Button>
          </Stack>
        </Box>
        <Box sx={{ p: { xs: 2, md: 2.5 }, maxHeight: '78vh', overflowY: 'auto' }}>{children}</Box>
      </DialogContent>
    </Dialog>
  )
}

function StepHeader({ steps, activeStep }) {
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2.1 }}>
      {steps.map((step, index) => {
        const currentStep = index + 1
        const active = currentStep === activeStep
        const complete = currentStep < activeStep

        return (
          <Paper
            key={step}
            elevation={0}
            sx={{
              px: 1.25,
              py: 0.85,
              borderRadius: 999,
              border: '1px solid',
              borderColor: active || complete ? '#0b7a57' : '#d8e1dc',
              bgcolor: active ? '#eef8f3' : complete ? '#f6fcf8' : '#ffffff',
              color: active || complete ? '#0b7a57' : '#71847d',
              fontSize: 12.5,
              fontWeight: 700,
            }}
          >
            {currentStep}. {step}
          </Paper>
        )
      })}
    </Stack>
  )
}

function StepActions({
  onBack,
  onNext,
  nextLabel,
  loading = false,
  disableNext = false,
}) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2.2 }}>
      <Button
        variant="outlined"
        onClick={onBack}
        disabled={!onBack || loading}
        sx={secondaryButtonSx}
      >
        Back
      </Button>
      <Button
        variant="contained"
        onClick={onNext}
        disabled={disableNext || loading}
        sx={primaryButtonSx}
      >
        {nextLabel}
      </Button>
    </Stack>
  )
}

function FormGrid({ children }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
        gap: 1.4,
      }}
    >
      {children}
    </Box>
  )
}

function SelectField({ label, value, onChange, options }) {
  return (
    <TextField
      select
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      fullWidth
    >
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  )
}

function ResponsePanel({ data }) {
  return (
    <Paper elevation={0} sx={responsePanelSx}>
      <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#22332e', px: 1.6, py: 1.1 }}>
        Response
      </Typography>
      <Divider />
      <Box
        component="pre"
        sx={{
          m: 0,
          p: 1.6,
          fontSize: 12,
          lineHeight: 1.55,
          color: '#33433f',
          overflowX: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {data ? JSON.stringify(data, null, 2) : 'No response yet.'}
      </Box>
    </Paper>
  )
}

function InfoPill({ label, value }) {
  return (
    <Paper elevation={0} sx={infoPillSx}>
      <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: '#6d7c77', textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Typography sx={{ mt: 0.3, fontSize: 13.5, fontWeight: 600, color: '#22332e' }}>
        {value}
      </Typography>
    </Paper>
  )
}

async function apiRequest(url, options = {}) {
  const token =
    localStorage.getItem('token') ||
    localStorage.getItem('access_token') ||
    localStorage.getItem('authToken')

  const serializedBody =
    options.body && typeof options.body !== 'string'
      ? JSON.stringify(options.body)
      : options.body

  const headers = {
    ...(serializedBody ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  const response = await fetch(url, {
    ...options,
    body: serializedBody,
    headers,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.status === false) {
    throw new Error(data.message || data.error || 'Request failed')
  }

  return data
}

function toQueryString(values) {
  const params = new URLSearchParams()
  Object.entries(values).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      params.set(key, value)
    }
  })
  return params.toString()
}

const backButtonSx = {
  textTransform: 'none',
  borderRadius: 1.5,
  borderColor: '#4aa269',
  color: '#41915d',
  fontSize: 18,
  px: 2.5,
  py: 1,
  '&:hover': {
    borderColor: '#3c8b56',
    bgcolor: '#f6fbf7',
  },
}

const optionCardSx = {
  borderRadius: 3,
  border: '1px solid #d9e1de',
  boxShadow: 'none',
  cursor: 'pointer',
  transition: 'all 160ms ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 18px 36px rgba(44,57,53,0.08)',
    borderColor: '#c6d5ce',
  },
}

const iconBubbleSx = {
  width: 76,
  height: 76,
  borderRadius: '50%',
  display: 'grid',
  placeItems: 'center',
}

const sectionTitleSx = {
  fontSize: 18,
  fontWeight: 700,
  color: '#21304b',
  mb: 1.4,
}

const helperTextSx = {
  fontSize: 12.5,
  color: '#6f7d78',
}

const resultsPanelSx = {
  mt: 1.6,
  p: 1.2,
  borderRadius: 3,
  border: '1px solid #e1e8e3',
  bgcolor: '#fbfdfc',
}

const detectionPanelSx = {
  mt: 1.6,
  p: 1.4,
  borderRadius: 3,
  border: '1px solid #e1e8e3',
  bgcolor: '#fbfdfc',
}

const resultRowSx = {
  p: 1.2,
  borderRadius: 2,
  border: '1px solid #e4ebe7',
  bgcolor: '#ffffff',
}

const infoPillSx = {
  px: 1.1,
  py: 0.95,
  borderRadius: 2,
  border: '1px solid #dfe8e3',
  bgcolor: '#ffffff',
  minWidth: 140,
}

const requiredChipSx = {
  px: 1,
  py: 0.55,
  borderRadius: 999,
  bgcolor: '#f4f7f5',
  color: '#50625d',
  fontSize: 11.5,
}

const primaryButtonSx = {
  textTransform: 'none',
  borderRadius: 2.5,
  bgcolor: '#0b7a57',
  px: 2.4,
  '&:hover': { bgcolor: '#096649' },
}

const secondaryButtonSx = {
  textTransform: 'none',
  borderRadius: 2.5,
  borderColor: '#d4dfd8',
  color: '#21304b',
}

const miniActionButtonSx = {
  textTransform: 'none',
  borderRadius: 2,
  bgcolor: '#0b7a57',
  '&:hover': { bgcolor: '#096649' },
}

const responsePanelSx = {
  mt: 2,
  borderRadius: 3,
  border: '1px solid #e5ece8',
  bgcolor: '#f9fbfa',
  overflow: 'hidden',
}

export default TwilioApiTesterPage
