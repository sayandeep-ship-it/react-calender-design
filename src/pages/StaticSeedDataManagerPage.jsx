import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import StorageRoundedIcon from '@mui/icons-material/StorageRounded'

const API_PREFIX = import.meta.env.VITE_API_BASE_URL || '/api'
const STATIC_DATA_API_BASE = `${API_PREFIX.replace(/\/$/, '')}/static-data`

const LOCAL_TABLE_META = [
  simpleMeta('priority', 'Priority', 'Priority levels for workflows.', 'priority', ['accesslevel']),
  simpleMeta('ticketPipeline', 'Ticket Pipeline', 'Pipeline stages for tickets.', 'pipeline', ['accesslevel']),
  simpleMeta('ticketSource', 'Ticket Source', 'Ticket source master.', 'source', ['accesslevel']),
  simpleMeta('ticketStatus', 'Ticket Status', 'Ticket status options.', 'ticketStatus', ['accesslevel']),
  simpleMeta('dealStage', 'Deal Stage', 'CRM deal stage list.', 'stage', ['accesslevel']),
  simpleMeta('dealType', 'Deal Type', 'CRM deal type list.', 'type', ['accesslevel']),
  simpleMeta('leadLable', 'Lead Label', 'Lead warmth labels.', 'lable', ['accesslevel']),
  simpleMeta('leadPipeline', 'Lead Pipeline', 'Lead pipeline states.', 'pipeline', ['accesslevel']),
  simpleMeta('leadStage', 'Lead Stage', 'Lead stage list.', 'stage', ['accesslevel']),
  simpleMeta('leadType', 'Lead Type', 'Lead type list.', 'type', ['accesslevel']),
  simpleMeta('companyType', 'Company Type', 'Company type list.', 'type', ['accesslevel']),
  simpleMeta('companyIndustry', 'Company Industry', 'Company industries.', 'industry', ['accesslevel']),
  {
    key: 'procedure_types',
    label: 'Procedure Types',
    description: 'Master procedure type list.',
    columns: [textColumn('name', 'Name'), textColumn('description', 'Description')],
  },
  {
    key: 'procedures',
    label: 'Procedures',
    description: 'Procedure pricing and configuration.',
    columns: [
      textColumn('name', 'Name'),
      numberColumn('procedure_type_id', 'Type ID'),
      numberColumn('price', 'Price'),
      booleanColumn('implant', 'Implant'),
      booleanColumn('garment', 'Garment'),
      numberColumn('la_ga_status', 'LA/GA Status'),
      booleanColumn('active', 'Active'),
    ],
  },
  statusMeta('resourceFacilitySubType', 'Facility Sub Types', 'Facility subtype master.', 'name'),
  statusMeta('resourceFacilityUserFor', 'Facility Used For', 'Facility use cases.', 'name'),
  {
    key: 'specialty',
    label: 'Specialty',
    description: 'Clinical specialty master.',
    columns: [textColumn('name', 'Name')],
  },
  simpleMeta('equipmentType', 'Equipment Type', 'Equipment type master.', 'type'),
  simpleMeta('equipmentSubType', 'Equipment Sub Type', 'Equipment sub type master.', 'sub_type'),
  {
    key: 'resourceEquipmentCategoryMaster',
    label: 'Equipment Reference Master',
    description: 'Excel-driven equipment master with specifications and compliance fields.',
    columns: [
      textColumn('equipment_category', 'Equipment Category'),
      textColumn('sub_category', 'Sub Category'),
      textColumn('equipment_name', 'Equipment Name'),
      textColumn('typical_specification', 'Typical Specification'),
      textColumn('manufacturer_examples', 'Manufacturer Examples'),
      textColumn('model_variant', 'Model Variant'),
      textColumn('department', 'Department'),
      textColumn('mobility', 'Mobility'),
      textColumn('power_requirement', 'Power Requirement'),
      textColumn('maintenance_cycle', 'Maintenance Cycle'),
      textColumn('calibration_required', 'Calibration Required'),
      textColumn('regulatory_compliance', 'Regulatory Compliance'),
      textColumn('asset_criticality', 'Asset Criticality'),
      numberColumn('typical_quantity_per_site', 'Quantity / Site'),
      numberColumn('useful_life_years', 'Useful Life'),
      numberColumn('estimated_unit_cost_gbp', 'Unit Cost GBP'),
      textColumn('consumables_required', 'Consumables Required'),
      textColumn('sterilisation_method', 'Sterilisation Method'),
      textColumn('risk_classification_mhra', 'Risk Classification'),
      textColumn('gmdn_code_reference', 'GMDN Code'),
      textColumn('notes_open_arogya_mapping', 'Notes'),
    ],
  },
  {
    key: 'shift_patterns',
    label: 'Shift Patterns',
    description: 'Shift and rota default patterns.',
    columns: [
      textColumn('pattern_code', 'Pattern Code'),
      textColumn('display_name', 'Display Name'),
      textColumn('start_time', 'Start Time'),
      textColumn('end_time', 'End Time'),
      numberColumn('duration_minutes', 'Duration'),
      numberColumn('break_minutes', 'Break'),
      booleanColumn('crosses_midnight', 'Crosses Midnight'),
      booleanColumn('is_system_default', 'System Default'),
      statusColumn('status', 'Status'),
    ],
  },
  {
    key: 'speciality_type',
    label: 'Speciality Type',
    description: 'Speciality type master list.',
    columns: [textColumn('speciality_name', 'Speciality Name')],
  },
  {
    key: 'treatment_type',
    label: 'Treatment Type',
    description: 'Treatment type catalog.',
    columns: [textColumn('treatment_type', 'Treatment Type')],
  },
]

function StaticSeedDataManagerPage() {
  const [availableTables, setAvailableTables] = useState([])
  const [selectedTableKey, setSelectedTableKey] = useState('priority')
  const [tableSearch, setTableSearch] = useState('')
  const [rowSearchInput, setRowSearchInput] = useState('')
  const [rowSearch, setRowSearch] = useState('')
  const [rows, setRows] = useState([])
  const [loadingTables, setLoadingTables] = useState(false)
  const [loadingRows, setLoadingRows] = useState(false)
  const [savingIds, setSavingIds] = useState([])
  const [deletingIds, setDeletingIds] = useState([])
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 })
  const [error, setError] = useState('')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const metaMap = useMemo(
    () =>
      LOCAL_TABLE_META.reduce((accumulator, table) => {
        accumulator[table.key] = table
        return accumulator
      }, {}),
    [],
  )

  const visibleTables = useMemo(() => {
    const mergedTables =
      availableTables.length > 0
        ? availableTables.map((table) => ({
            key: table.key,
            label: metaMap[table.key]?.label || toTitleCase(table.key),
            description:
              metaMap[table.key]?.description || `Manage ${toTitleCase(table.key)} static records.`,
            columns:
              metaMap[table.key]?.columns || (table.fields || []).map((field) => inferColumn(field)),
          }))
        : LOCAL_TABLE_META

    const query = tableSearch.trim().toLowerCase()
    if (!query) return mergedTables

    return mergedTables.filter(
      (table) =>
        table.label.toLowerCase().includes(query) || table.key.toLowerCase().includes(query),
    )
  }, [availableTables, metaMap, tableSearch])

  const selectedTable =
    visibleTables.find((table) => table.key === selectedTableKey) ||
    LOCAL_TABLE_META.find((table) => table.key === selectedTableKey) ||
    LOCAL_TABLE_META[0]

  const hasUnsavedRows = useMemo(
    () => rows.some((row) => row.__isNew || row.__dirty),
    [rows],
  )

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(1)
      setRowSearch(rowSearchInput.trim())
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [rowSearchInput])

  useEffect(() => {
    fetchTables()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!selectedTableKey) return
    fetchRows(selectedTableKey, page, rowSearch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTableKey, page, rowSearch])

  const fetchTables = async () => {
    setLoadingTables(true)
    setError('')

    try {
      const response = await apiRequest(`${STATIC_DATA_API_BASE}/tables`)
      const tables = (response.data || []).map((item) => ({
        key: item.key,
        fields: item.fields || [],
      }))

      setAvailableTables(tables)

      if (!tables.some((table) => table.key === selectedTableKey) && tables[0]) {
        setSelectedTableKey(tables[0].key)
      }
    } catch (err) {
      setError(err.message)
      setAvailableTables(
        LOCAL_TABLE_META.map((table) => ({
          key: table.key,
          fields: table.columns.map((column) => column.key),
        })),
      )
    } finally {
      setLoadingTables(false)
    }
  }

  const fetchRows = async (tableKey, nextPage, search) => {
    setLoadingRows(true)
    setError('')

    try {
      const params = new URLSearchParams({
        page: String(nextPage),
        limit: String(limit),
      })

      if (search) {
        params.set('search', search)
      }

      const response = await apiRequest(`${STATIC_DATA_API_BASE}/${tableKey}?${params.toString()}`)
      setRows((response.data || []).map((row) => ({ ...row })))
      setPagination({
        total: response.pagination?.total || response.data?.length || 0,
        totalPages: response.pagination?.totalPages || 1,
      })
    } catch (err) {
      setError(err.message)
      setRows([])
      setPagination({ total: 0, totalPages: 1 })
    } finally {
      setLoadingRows(false)
    }
  }

  const updateCell = (rowIdValue, columnKey, value) => {
    setRows((current) =>
      current.map((row) =>
        getRowKey(row) === rowIdValue ? { ...row, [columnKey]: value, __dirty: true } : row,
      ),
    )
  }

  const addRow = () => {
    const blankRow = selectedTable.columns.reduce(
      (accumulator, column) => ({
        ...accumulator,
        [column.key]: defaultValueForType(column.type),
      }),
      {
        id: undefined,
        __tempId: tempId(),
        __isNew: true,
        __dirty: true,
      },
    )

    setRows((current) => [blankRow, ...current])
  }

  const duplicateRow = (row) => {
    const duplicate = selectedTable.columns.reduce(
      (accumulator, column) => ({
        ...accumulator,
        [column.key]: row[column.key],
      }),
      {
        id: undefined,
        __tempId: tempId(),
        __isNew: true,
        __dirty: true,
      },
    )

    setRows((current) => [duplicate, ...current])
  }

  const saveRow = async (row) => {
    const rowKey = getRowKey(row)
    setSavingIds((current) => [...current, rowKey])

    try {
      const payload = selectedTable.columns.reduce((accumulator, column) => {
        accumulator[column.key] = normalizeForApi(row[column.key], column.type)
        return accumulator
      }, {})

      const response = await apiRequest(`${STATIC_DATA_API_BASE}/${selectedTable.key}/upsert`, {
        method: 'POST',
        body: JSON.stringify({
          id: row.__isNew ? undefined : row.id,
          data: payload,
        }),
      })

      setRows((current) =>
        current.map((currentRow) =>
          getRowKey(currentRow) === rowKey
            ? { ...response.data, __dirty: false, __isNew: false }
            : currentRow,
        ),
      )

      openSnackbar(
        row.__isNew ? 'Record created successfully' : 'Record updated successfully',
        'success',
      )
    } catch (err) {
      openSnackbar(err.message, 'error')
    } finally {
      setSavingIds((current) => current.filter((item) => item !== rowKey))
    }
  }

  const deleteRow = async (row) => {
    const rowKey = getRowKey(row)

    if (row.__isNew || !row.id) {
      setRows((current) => current.filter((item) => getRowKey(item) !== rowKey))
      return
    }

    setDeletingIds((current) => [...current, rowKey])

    try {
      await apiRequest(`${STATIC_DATA_API_BASE}/${selectedTable.key}/${row.id}`, {
        method: 'DELETE',
      })
      setRows((current) => current.filter((item) => getRowKey(item) !== rowKey))
      setPagination((current) => ({
        ...current,
        total: Math.max(current.total - 1, 0),
      }))
      openSnackbar('Record deleted successfully', 'success')
    } catch (err) {
      openSnackbar(err.message, 'error')
    } finally {
      setDeletingIds((current) => current.filter((item) => item !== rowKey))
    }
  }

  const resetSelectedTable = () => {
    setPage(1)
    fetchRows(selectedTable.key, 1, rowSearch)
  }

  const saveAllDirtyRows = async () => {
    const dirtyRows = rows.filter((row) => row.__isNew || row.__dirty)

    for (const row of dirtyRows) {
      await saveRow(row)
    }
  }

  const openSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity })
  }

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 700, color: '#162520' }}>
          Static Data Manager
        </Typography>
        <Typography sx={{ mt: 0.9, maxWidth: 920, color: '#667873' }}>
          This screen is now wired to the static-data APIs. Select a master table, fetch rows from
          the backend, edit fields inline, create new records, duplicate rows, save changes, and
          delete records from the same route.
        </Typography>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2.5} alignItems="stretch">
        <Paper elevation={0} sx={sidebarSx}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <StorageRoundedIcon sx={{ color: '#0b7a57' }} />
            <Typography sx={{ fontSize: 18, fontWeight: 700 }}>Tables</Typography>
            {loadingTables && <CircularProgress size={16} />}
          </Stack>

          <TextField
            size="small"
            placeholder="Search tables"
            value={tableSearch}
            onChange={(event) => setTableSearch(event.target.value)}
            InputProps={{
              startAdornment: <SearchRoundedIcon sx={{ fontSize: 18, mr: 0.8, color: '#81928c' }} />,
            }}
            sx={{ mb: 1.25 }}
          />

          <Stack spacing={0.8} sx={{ maxHeight: 640, overflowY: 'auto', pr: 0.4 }}>
            {visibleTables.map((table) => {
              const active = table.key === selectedTableKey
              return (
                <Box
                  key={table.key}
                  onClick={() => {
                    setSelectedTableKey(table.key)
                    setPage(1)
                  }}
                  sx={{
                    p: 1.25,
                    borderRadius: 2.5,
                    border: '1px solid',
                    borderColor: active ? '#0b7a57' : '#dce7e1',
                    bgcolor: active ? '#eef8f3' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 160ms ease',
                    '&:hover': {
                      borderColor: '#0b7a57',
                      bgcolor: '#f4fbf7',
                    },
                  }}
                >
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#20302c' }}>
                    {table.label}
                  </Typography>
                  <Typography sx={{ mt: 0.3, fontSize: 11.5, color: '#72837d' }} noWrap>
                    {table.key}
                  </Typography>
                </Box>
              )
            })}
          </Stack>
        </Paper>

        <Card elevation={0} sx={editorCardSx}>
          <Stack
            direction={{ xs: 'column', xl: 'row' }}
            justifyContent="space-between"
            spacing={1.5}
            sx={{ p: 2.1, borderBottom: '1px solid #e7eeea', bgcolor: '#fbfdfc' }}
          >
            <Box>
              <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#1b2b27' }}>
                {selectedTable.label}
              </Typography>
              <Typography sx={{ mt: 0.5, color: '#6c7c77' }}>{selectedTable.description}</Typography>
            </Box>

            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <TextField
                size="small"
                placeholder="Search rows"
                value={rowSearchInput}
                onChange={(event) => setRowSearchInput(event.target.value)}
                InputProps={{
                  startAdornment: <SearchRoundedIcon sx={{ fontSize: 18, mr: 0.8, color: '#81928c' }} />,
                }}
                sx={{ minWidth: 220 }}
              />
              <Button
                variant="outlined"
                startIcon={loadingRows ? <CircularProgress size={16} /> : <RefreshRoundedIcon />}
                onClick={resetSelectedTable}
                sx={toolbarButtonSx}
              >
                Refresh
              </Button>
              <Button
                variant="outlined"
                startIcon={<CheckRoundedIcon />}
                onClick={saveAllDirtyRows}
                disabled={!hasUnsavedRows || savingIds.length > 0}
                sx={toolbarButtonSx}
              >
                Save All
              </Button>
              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={addRow}
                sx={{
                  ...toolbarButtonSx,
                  bgcolor: '#0b7a57',
                  color: 'white',
                  borderColor: '#0b7a57',
                  '&:hover': { bgcolor: '#096649', borderColor: '#096649' },
                }}
              >
                Add Row
              </Button>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ px: 2.1, py: 1.4 }}>
            <Chip size="small" label={`${pagination.total} total rows`} sx={summaryChipSx} />
            <Chip size="small" label={`${selectedTable.columns.length} editable fields`} sx={summaryChipSx} />
            <Chip size="small" label={selectedTable.key} sx={summaryChipSx} />
            {hasUnsavedRows && <Chip size="small" label="Unsaved changes" sx={dirtyChipSx} />}
          </Stack>

          <Divider />

          <TableContainer sx={{ maxHeight: 680 }}>
            <Table stickyHeader size="small" sx={{ minWidth: 1120 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={headCellSx}>Actions</TableCell>
                  {selectedTable.columns.map((column) => (
                    <TableCell key={column.key} sx={headCellSx}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingRows && (
                  <TableRow>
                    <TableCell colSpan={selectedTable.columns.length + 1} sx={{ py: 5, textAlign: 'center' }}>
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                )}

                {!loadingRows &&
                  rows.map((row) => {
                    const rowKey = getRowKey(row)
                    const saving = savingIds.includes(rowKey)
                    const deleting = deletingIds.includes(rowKey)

                    return (
                      <TableRow
                        key={rowKey}
                        hover
                        sx={{
                          bgcolor: row.__isNew ? '#f6fff9' : row.__dirty ? '#fffdf4' : 'inherit',
                        }}
                      >
                        <TableCell sx={actionCellSx}>
                          <Stack direction="row" spacing={0.25} alignItems="center" flexWrap="wrap" useFlexGap>
                            <IconButton size="small" onClick={() => saveRow(row)} disabled={saving || deleting}>
                              {saving ? <CircularProgress size={16} /> : <CheckRoundedIcon sx={{ fontSize: 18 }} />}
                            </IconButton>
                            <IconButton size="small" onClick={() => duplicateRow(row)} disabled={saving || deleting}>
                              <ContentCopyRoundedIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => deleteRow(row)} disabled={saving || deleting}>
                              {deleting ? <CircularProgress size={16} /> : <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />}
                            </IconButton>
                            {row.__isNew && <Chip size="small" label="New" sx={miniChipSx} />}
                            {row.__dirty && !row.__isNew && <Chip size="small" label="Edited" sx={miniChipSx} />}
                          </Stack>
                        </TableCell>
                        {selectedTable.columns.map((column) => (
                          <TableCell key={column.key} sx={bodyCellSx}>
                            <EditableCell
                              column={column}
                              value={row[column.key]}
                              onChange={(value) => updateCell(rowKey, column.key, value)}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    )
                  })}

                {!loadingRows && rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={selectedTable.columns.length + 1} sx={{ py: 5, textAlign: 'center' }}>
                      <Typography sx={{ fontWeight: 700, color: '#41554f' }}>No rows found</Typography>
                      <Typography sx={{ mt: 0.6, fontSize: 13, color: '#7a8a84' }}>
                        Try changing the row search or add a new record to this table.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={1.5}
            sx={{ px: 2.1, py: 1.5, borderTop: '1px solid #e7eeea', bgcolor: '#fbfdfc' }}
          >
            <Typography sx={{ fontSize: 13, color: '#6b7d76' }}>
              Page {page} of {pagination.totalPages}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                disabled={page <= 1 || loadingRows}
                onClick={() => setPage((current) => Math.max(current - 1, 1))}
                sx={toolbarButtonSx}
              >
                Previous
              </Button>
              <Button
                variant="outlined"
                disabled={page >= pagination.totalPages || loadingRows}
                onClick={() =>
                  setPage((current) => Math.min(current + 1, pagination.totalPages || 1))
                }
                sx={toolbarButtonSx}
              >
                Next
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Stack>
  )
}

function EditableCell({ column, value, onChange }) {
  if (column.type === 'boolean') {
    return (
      <Select
        size="small"
        value={value ? 'true' : 'false'}
        onChange={(event) => onChange(event.target.value === 'true')}
        sx={selectCellSx}
      >
        <MenuItem value="true">Yes</MenuItem>
        <MenuItem value="false">No</MenuItem>
      </Select>
    )
  }

  if (column.type === 'status') {
    return (
      <Select
        size="small"
        value={value ?? 'A'}
        onChange={(event) => onChange(event.target.value)}
        sx={selectCellSx}
      >
        <MenuItem value="A">A</MenuItem>
        <MenuItem value="I">I</MenuItem>
      </Select>
    )
  }

  return (
    <TextField
      size="small"
      type={column.type === 'number' ? 'number' : 'text'}
      value={value ?? ''}
      onChange={(event) =>
        onChange(column.type === 'number' ? toNumberOrNull(event.target.value) : event.target.value)
      }
      sx={textCellSx}
    />
  )
}

async function apiRequest(url, options = {}) {
  const token =
    localStorage.getItem('token') ||
    localStorage.getItem('access_token') ||
    localStorage.getItem('authToken')

  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.status === false) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}

function simpleMeta(key, label, description, primaryField, otherFields = []) {
  return {
    key,
    label,
    description,
    columns: [
      textColumn(primaryField, toTitleCase(primaryField)),
      ...otherFields.map((field) => numberColumn(field, toTitleCase(field))),
    ],
  }
}

function statusMeta(key, label, description, nameField) {
  return {
    key,
    label,
    description,
    columns: [textColumn(nameField, toTitleCase(nameField)), statusColumn('status', 'Status')],
  }
}

function inferColumn(field) {
  if (field === 'status') return statusColumn(field, toTitleCase(field))
  if (field.toLowerCase().includes('active')) return booleanColumn(field, toTitleCase(field))
  if (
    field.toLowerCase().includes('price') ||
    field.toLowerCase().includes('cost') ||
    field.toLowerCase().includes('quantity') ||
    field.toLowerCase().includes('years') ||
    field.toLowerCase().includes('minutes') ||
    field.toLowerCase().includes('accesslevel') ||
    field.toLowerCase().includes('_id')
  ) {
    return numberColumn(field, toTitleCase(field))
  }
  return textColumn(field, toTitleCase(field))
}

function textColumn(key, label) {
  return { key, label, type: 'text' }
}

function numberColumn(key, label) {
  return { key, label, type: 'number' }
}

function booleanColumn(key, label) {
  return { key, label, type: 'boolean' }
}

function statusColumn(key, label) {
  return { key, label, type: 'status' }
}

function defaultValueForType(type) {
  if (type === 'number') return null
  if (type === 'boolean') return false
  if (type === 'status') return 'A'
  return ''
}

function normalizeForApi(value, type) {
  if (type === 'number') return value === '' ? null : value
  if (type === 'boolean') return value ? 1 : 0
  return value
}

function toNumberOrNull(value) {
  if (value === '' || value === null) return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

function toTitleCase(value) {
  return String(value)
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function tempId() {
  return `temp-${Math.random().toString(36).slice(2, 10)}`
}

function getRowKey(row) {
  return row.id ?? row.__tempId
}

const sidebarSx = {
  width: { xs: '100%', lg: 320 },
  p: 2,
  borderRadius: 4,
  border: '1px solid #dde8e1',
  boxShadow: '0 18px 36px rgba(61, 93, 82, 0.08)',
}

const editorCardSx = {
  flex: 1,
  borderRadius: 4,
  border: '1px solid #dde8e1',
  boxShadow: '0 18px 36px rgba(61, 93, 82, 0.08)',
  overflow: 'hidden',
}

const toolbarButtonSx = {
  textTransform: 'none',
  borderRadius: 2.5,
  borderColor: '#d6e2db',
}

const summaryChipSx = {
  bgcolor: '#eef6f1',
  color: '#3f5d55',
  fontWeight: 700,
}

const dirtyChipSx = {
  bgcolor: '#fff4cf',
  color: '#8a6200',
  fontWeight: 700,
}

const miniChipSx = {
  height: 20,
  bgcolor: '#eef6f1',
  color: '#3f5d55',
  '& .MuiChip-label': { px: 0.85, fontSize: 10.5, fontWeight: 700 },
}

const headCellSx = {
  bgcolor: '#f7faf8',
  color: '#20302c',
  fontWeight: 700,
  fontSize: 12.5,
  whiteSpace: 'nowrap',
}

const bodyCellSx = {
  minWidth: 170,
  verticalAlign: 'top',
}

const actionCellSx = {
  minWidth: 150,
  whiteSpace: 'nowrap',
}

const textCellSx = {
  minWidth: 150,
  '& .MuiInputBase-root': {
    fontSize: 13,
    bgcolor: 'white',
  },
}

const selectCellSx = {
  minWidth: 120,
  fontSize: 13,
  bgcolor: 'white',
}

export default StaticSeedDataManagerPage
