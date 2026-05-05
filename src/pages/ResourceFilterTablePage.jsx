import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Collapse,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded'
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'

const API_URL = {
  GET_LOCATION_API_URL: '/api/locations',
}

const mockLocationPages = [
  {
    id: 'city-london',
    name: 'London',
    children: [
      {
        id: 'loc-medius-london',
        name: 'Medius Hospital',
        children: [
          { id: 'sub-consult-room-1', name: 'Consultation Room 1' },
          { id: 'sub-operating-theater-1', name: 'Operating Theater 1' },
          { id: 'sub-operating-theater-2', name: 'Operating Theater 2' },
          { id: 'sub-icu-bed-a', name: 'ICU Bed A' },
        ],
      },
      {
        id: 'loc-royal-london',
        name: 'Royal Women Clinic',
        children: [
          { id: 'sub-lab-2', name: 'Lab 2' },
          { id: 'sub-observation-3', name: 'Observation Bay 3' },
        ],
      },
    ],
  },
  {
    id: 'city-manchester',
    name: 'Manchester',
    children: [
      {
        id: 'loc-medius-manchester',
        name: 'Medius Hospital',
        children: [
          { id: 'sub-ward-1', name: 'Ward 1' },
          { id: 'sub-consult-room-3', name: 'Consultation Room 3' },
        ],
      },
      {
        id: 'loc-northern-care',
        name: 'Northern Care Hub',
        children: [
          { id: 'sub-ot-4', name: 'Operating Theater 4' },
          { id: 'sub-icu-6', name: 'ICU Bed 6' },
        ],
      },
    ],
  },
  {
    id: 'city-birmingham',
    name: 'Birmingham',
    children: [
      {
        id: 'loc-spring-field',
        name: 'Spring Field Medical',
        children: [
          { id: 'sub-diagnostic-1', name: 'Diagnostics 1' },
          { id: 'sub-surgery-5', name: 'Surgery Suite 5' },
        ],
      },
    ],
  },
]

const allRows = [
  {
    id: 'r1',
    name: 'Operating Theater 1',
    type: 'Facility',
    locationNodeId: 'sub-operating-theater-1',
    city: 'London',
    location: 'Medius Hospital',
    subLocation: 'Operating Theater 1',
    usedFor: 'Surgery',
    status: 'Available',
    requiredCleaning: true,
    requiredStaffPairing: true,
    emergencyOnly: false,
    requiresMaintenance: false,
  },
  {
    id: 'r2',
    name: 'Consultation Room 1',
    type: 'Facility',
    locationNodeId: 'sub-consult-room-1',
    city: 'London',
    location: 'Medius Hospital',
    subLocation: 'Consultation Room 1',
    usedFor: 'Consultation',
    status: 'Occupied',
    requiredCleaning: false,
    requiredStaffPairing: false,
    emergencyOnly: false,
    requiresMaintenance: false,
  },
  {
    id: 'r3',
    name: 'Portable Ultrasound',
    type: 'Equipment',
    locationNodeId: 'sub-consult-room-3',
    city: 'Manchester',
    location: 'Medius Hospital',
    subLocation: 'Consultation Room 3',
    equipmentType: 'Imaging',
    equipmentSubtype: 'Ultrasound',
    equipmentCategory: 'Portable',
    status: 'Available',
  },
  {
    id: 'r4',
    name: 'Ventilator X200',
    type: 'Equipment',
    locationNodeId: 'sub-icu-bed-a',
    city: 'London',
    location: 'Medius Hospital',
    subLocation: 'ICU Bed A',
    equipmentType: 'Respiratory',
    equipmentSubtype: 'Ventilator',
    equipmentCategory: 'Critical Care',
    status: 'Maintenance',
  },
  {
    id: 'r5',
    name: 'Dr. Kavita Sen',
    type: 'Staff',
    locationNodeId: 'sub-observation-3',
    city: 'London',
    location: 'Royal Women Clinic',
    subLocation: 'Observation Bay 3',
    role: 'Doctor',
    department: 'Gynecology',
    speciality: 'Fetal Medicine',
    yearsExperience: 11,
    status: 'Available',
  },
  {
    id: 'r6',
    name: 'Anika Peters',
    type: 'Staff',
    locationNodeId: 'sub-operating-theater-1',
    city: 'London',
    location: 'Medius Hospital',
    subLocation: 'Operating Theater 1',
    role: 'Nurse',
    department: 'Surgery',
    speciality: 'OT Support',
    yearsExperience: 7,
    status: 'Available',
  },
  {
    id: 'r7',
    name: 'Operating Theater 4',
    type: 'Facility',
    locationNodeId: 'sub-ot-4',
    city: 'Manchester',
    location: 'Northern Care Hub',
    subLocation: 'Operating Theater 4',
    usedFor: 'Emergency',
    status: 'Reserved',
    requiredCleaning: true,
    requiredStaffPairing: true,
    emergencyOnly: true,
    requiresMaintenance: false,
  },
  {
    id: 'r8',
    name: 'ECG Trolley',
    type: 'Equipment',
    locationNodeId: 'sub-lab-2',
    city: 'London',
    location: 'Royal Women Clinic',
    subLocation: 'Lab 2',
    equipmentType: 'Cardiology',
    equipmentSubtype: 'ECG',
    equipmentCategory: 'Diagnostic',
    status: 'Occupied',
  },
  {
    id: 'r9',
    name: 'Cameron Willis',
    type: 'Staff',
    locationNodeId: 'sub-surgery-5',
    city: 'Birmingham',
    location: 'Spring Field Medical',
    subLocation: 'Surgery Suite 5',
    role: 'Technician',
    department: 'Diagnostics',
    speciality: 'Monitoring',
    yearsExperience: 4,
    status: 'Unavailable',
  },
]

const sectionDefinitions = [
  { key: 'location', label: 'Location' },
  { key: 'facilities', label: 'Facilities' },
  { key: 'equipment', label: 'Equipment' },
  { key: 'staff', label: 'Staff' },
  { key: 'status', label: 'Status' },
]

const defaultExpanded = {
  location: true,
  facilities: true,
  equipment: false,
  staff: false,
  status: false,
}

const defaultFilters = {
  selectedNodes: [],
  facilityUsedFor: '',
  facilityToggles: {
    requiredCleaning: false,
    requiredStaffPairing: false,
    emergencyOnly: false,
    requiresMaintenance: false,
  },
  equipmentType: '',
  equipmentSubtype: '',
  equipmentCategory: '',
  staffRole: '',
  staffDepartment: '',
  staffSpeciality: '',
  yearsExperience: [0, 20],
  statuses: [],
}

function ResourceFilterTablePage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [filters, setFilters] = useState(defaultFilters)
  const [draftFilters, setDraftFilters] = useState(defaultFilters)
  const [expandedSections, setExpandedSections] = useState(defaultExpanded)
  const [expandedNodes, setExpandedNodes] = useState(['city-london', 'loc-medius-london'])
  const [locationSearch, setLocationSearch] = useState('')
  const [locations, setLocations] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const fetchLocations = useCallback(async (p, q = '') => {
    setLoading(true)
    try {
      const res = await mockAxiosInstance.get(API_URL.GET_LOCATION_API_URL, {
        params: { page: p, limit: 10, search: q },
      })
      const d = res.data
      setLocations((prev) => (p === 1 ? d.data : [...prev, ...d.data]))
      setTotalPages(d.pagination.totalPages)
      setPage(p)
    } catch (err) {
      console.error('Location fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLocations(1, '')
  }, [fetchLocations])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchLocations(1, locationSearch)
    }, 250)

    return () => clearTimeout(timeoutId)
  }, [fetchLocations, locationSearch])

  const filteredRows = useMemo(() => {
    return allRows.filter((row) => {
      if (filters.selectedNodes.length > 0 && !filters.selectedNodes.includes(row.locationNodeId)) {
        return false
      }

      if (filters.statuses.length > 0 && !filters.statuses.includes(row.status)) {
        return false
      }

      if (row.type === 'Facility') {
        if (filters.facilityUsedFor && row.usedFor !== filters.facilityUsedFor) return false
        if (filters.facilityToggles.requiredCleaning && !row.requiredCleaning) return false
        if (filters.facilityToggles.requiredStaffPairing && !row.requiredStaffPairing) return false
        if (filters.facilityToggles.emergencyOnly && !row.emergencyOnly) return false
        if (filters.facilityToggles.requiresMaintenance && !row.requiresMaintenance) return false
      }

      if (row.type === 'Equipment') {
        if (filters.equipmentType && row.equipmentType !== filters.equipmentType) return false
        if (filters.equipmentSubtype && row.equipmentSubtype !== filters.equipmentSubtype) return false
        if (filters.equipmentCategory && row.equipmentCategory !== filters.equipmentCategory) return false
      }

      if (row.type === 'Staff') {
        if (filters.staffRole && row.role !== filters.staffRole) return false
        if (filters.staffDepartment && row.department !== filters.staffDepartment) return false
        if (filters.staffSpeciality && row.speciality !== filters.staffSpeciality) return false
        if (row.yearsExperience < filters.yearsExperience[0]) return false
        if (row.yearsExperience > filters.yearsExperience[1]) return false
      }

      return true
    })
  }, [filters])

  const openDrawer = () => {
    setDraftFilters(filters)
    setDrawerOpen(true)
  }

  const applyFilters = () => {
    setFilters(draftFilters)
    setDrawerOpen(false)
  }

  const clearFilters = () => {
    setDraftFilters(defaultFilters)
    setFilters(defaultFilters)
  }

  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1.5}>
        <Box>
          <Typography sx={{ fontSize: { xs: 28, md: 34 }, fontWeight: 700, color: '#182722' }}>
            Resource Filter Table
          </Typography>
          <Typography sx={{ mt: 0.8, color: '#657671', maxWidth: 720 }}>
            A simple table view with a right-side filter drawer for location trees, facilities,
            equipment, staff, and status filters.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<FilterListRoundedIcon />}
          onClick={openDrawer}
          sx={{
            alignSelf: 'flex-start',
            textTransform: 'none',
            borderRadius: 2.5,
            px: 2.25,
            py: 1,
            bgcolor: '#4ca067',
            '&:hover': { bgcolor: '#3e8b58' },
          }}
        >
          Filter
        </Button>
      </Stack>

      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          border: '1px solid #dfe8e3',
          boxShadow: '0 18px 40px rgba(44, 57, 53, 0.08)',
          overflow: 'hidden',
        }}
      >
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ p: 2, borderBottom: '1px solid #edf2ef', bgcolor: '#fbfdfc' }}>
          <Chip size="small" label={`${filteredRows.length} rows`} sx={summaryChipSx} />
          {filters.selectedNodes.length > 0 && (
            <Chip size="small" label={`${filters.selectedNodes.length} location filters`} sx={summaryChipSx} />
          )}
          {filters.statuses.length > 0 && (
            <Chip size="small" label={`${filters.statuses.length} statuses`} sx={summaryChipSx} />
          )}
        </Stack>

        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f7faf8' }}>
              {['Name', 'Type', 'Location', 'Details', 'Status'].map((column) => (
                <TableCell key={column} sx={headCellSx}>
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell sx={bodyCellSx}>
                  <Typography sx={{ fontWeight: 700, color: '#24342f' }}>{row.name}</Typography>
                </TableCell>
                <TableCell sx={bodyCellSx}>{row.type}</TableCell>
                <TableCell sx={bodyCellSx}>
                  <Typography sx={{ fontWeight: 600 }}>{row.location}</Typography>
                  <Typography sx={{ fontSize: 12, color: '#768680' }}>{row.subLocation}</Typography>
                </TableCell>
                <TableCell sx={bodyCellSx}>
                  {row.type === 'Facility' && row.usedFor}
                  {row.type === 'Equipment' &&
                    [row.equipmentType, row.equipmentSubtype, row.equipmentCategory]
                      .filter(Boolean)
                      .join(' / ')}
                  {row.type === 'Staff' &&
                    [row.role, row.department, `${row.yearsExperience} yrs`].join(' / ')}
                </TableCell>
                <TableCell sx={bodyCellSx}>
                  <Chip
                    label={row.status}
                    size="small"
                    sx={{
                      bgcolor: getStatusColor(row.status).bg,
                      color: getStatusColor(row.status).color,
                      fontWeight: 700,
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 338,
            p: 2.2,
          },
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 600 }}>Filter</Typography>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseRoundedIcon />
          </IconButton>
        </Stack>

        <Stack spacing={0.5}>
          {sectionDefinitions.map((section, index) => (
            <Box key={section.key}>
              <FilterSectionHeader
                label={section.label}
                expanded={expandedSections[section.key]}
                onToggle={() =>
                  setExpandedSections((current) => ({
                    ...current,
                    [section.key]: !current[section.key],
                  }))
                }
              />

              <Collapse in={expandedSections[section.key]}>
                {section.key === 'location' && (
                  <Stack spacing={1.2} sx={{ pl: 3, pr: 0.5, pb: 1.3 }}>
                    <TextField
                      size="small"
                      placeholder="Search location"
                      value={locationSearch}
                      onChange={(event) => setLocationSearch(event.target.value)}
                      InputProps={{
                        startAdornment: <SearchRoundedIcon sx={{ fontSize: 16, mr: 0.8, color: '#7b8b85' }} />,
                      }}
                    />

                    <Stack spacing={0.4}>
                      {locations.map((node) => (
                        <LocationTreeNode
                          key={node.id}
                          node={node}
                          expandedNodes={expandedNodes}
                          selectedNodes={draftFilters.selectedNodes}
                          onToggleNode={(nodeId) =>
                            setExpandedNodes((current) =>
                              current.includes(nodeId)
                                ? current.filter((item) => item !== nodeId)
                                : [...current, nodeId],
                            )
                          }
                          onToggleSelection={(nodeId) =>
                            setDraftFilters((current) => ({
                              ...current,
                              selectedNodes: current.selectedNodes.includes(nodeId)
                                ? current.selectedNodes.filter((item) => item !== nodeId)
                                : [...current.selectedNodes, nodeId],
                            }))
                          }
                        />
                      ))}
                    </Stack>

                    <Button
                      variant="outlined"
                      disabled={loading || page >= totalPages}
                      onClick={() => fetchLocations(page + 1, locationSearch)}
                      sx={{ textTransform: 'none', alignSelf: 'flex-start' }}
                    >
                      {loading ? 'Loading...' : page >= totalPages ? 'All loaded' : 'Load more'}
                    </Button>
                  </Stack>
                )}

                {section.key === 'facilities' && (
                  <Stack spacing={1.4} sx={{ pl: 3, pr: 0.5, pb: 1.3 }}>
                    <SelectField
                      label="Used for"
                      value={draftFilters.facilityUsedFor}
                      onChange={(value) =>
                        setDraftFilters((current) => ({ ...current, facilityUsedFor: value }))
                      }
                      options={['Consultation', 'Surgery', 'Emergency', 'ICU']}
                    />
                    <ToggleRow
                      label="Required cleaning"
                      checked={draftFilters.facilityToggles.requiredCleaning}
                      onChange={(checked) =>
                        setDraftFilters((current) => ({
                          ...current,
                          facilityToggles: { ...current.facilityToggles, requiredCleaning: checked },
                        }))
                      }
                    />
                    <ToggleRow
                      label="Required staff pairing"
                      checked={draftFilters.facilityToggles.requiredStaffPairing}
                      onChange={(checked) =>
                        setDraftFilters((current) => ({
                          ...current,
                          facilityToggles: {
                            ...current.facilityToggles,
                            requiredStaffPairing: checked,
                          },
                        }))
                      }
                    />
                    <ToggleRow
                      label="Emergency only"
                      checked={draftFilters.facilityToggles.emergencyOnly}
                      onChange={(checked) =>
                        setDraftFilters((current) => ({
                          ...current,
                          facilityToggles: { ...current.facilityToggles, emergencyOnly: checked },
                        }))
                      }
                    />
                    <ToggleRow
                      label="Requires maintenance"
                      checked={draftFilters.facilityToggles.requiresMaintenance}
                      onChange={(checked) =>
                        setDraftFilters((current) => ({
                          ...current,
                          facilityToggles: {
                            ...current.facilityToggles,
                            requiresMaintenance: checked,
                          },
                        }))
                      }
                    />
                  </Stack>
                )}

                {section.key === 'equipment' && (
                  <Stack spacing={1.4} sx={{ pl: 3, pr: 0.5, pb: 1.3 }}>
                    <SelectField
                      label="Equipment type"
                      value={draftFilters.equipmentType}
                      onChange={(value) =>
                        setDraftFilters((current) => ({ ...current, equipmentType: value }))
                      }
                      options={['Imaging', 'Respiratory', 'Cardiology']}
                    />
                    <SelectField
                      label="Equipment subtype"
                      value={draftFilters.equipmentSubtype}
                      onChange={(value) =>
                        setDraftFilters((current) => ({ ...current, equipmentSubtype: value }))
                      }
                      options={['Ultrasound', 'Ventilator', 'ECG']}
                    />
                    <SelectField
                      label="Equipment category"
                      value={draftFilters.equipmentCategory}
                      onChange={(value) =>
                        setDraftFilters((current) => ({ ...current, equipmentCategory: value }))
                      }
                      options={['Portable', 'Critical Care', 'Diagnostic']}
                    />
                  </Stack>
                )}

                {section.key === 'staff' && (
                  <Stack spacing={1.4} sx={{ pl: 3, pr: 0.5, pb: 1.3 }}>
                    <SelectField
                      label="Role"
                      value={draftFilters.staffRole}
                      onChange={(value) =>
                        setDraftFilters((current) => ({ ...current, staffRole: value }))
                      }
                      options={['Doctor', 'Nurse', 'Technician']}
                    />
                    <SelectField
                      label="Department"
                      value={draftFilters.staffDepartment}
                      onChange={(value) =>
                        setDraftFilters((current) => ({ ...current, staffDepartment: value }))
                      }
                      options={['Gynecology', 'Surgery', 'Diagnostics']}
                    />
                    <SelectField
                      label="Speciality"
                      value={draftFilters.staffSpeciality}
                      onChange={(value) =>
                        setDraftFilters((current) => ({ ...current, staffSpeciality: value }))
                      }
                      options={['Fetal Medicine', 'OT Support', 'Monitoring']}
                    />
                    <Box>
                      <Typography sx={{ mb: 1, fontSize: 13, fontWeight: 600 }}>
                        Years of experience
                      </Typography>
                      <Slider
                        value={draftFilters.yearsExperience}
                        min={0}
                        max={20}
                        onChange={(_, value) =>
                          setDraftFilters((current) => ({
                            ...current,
                            yearsExperience: value,
                          }))
                        }
                        valueLabelDisplay="auto"
                      />
                      <Typography sx={{ fontSize: 12, color: '#6f807a' }}>
                        {draftFilters.yearsExperience[0]} - {draftFilters.yearsExperience[1]} years
                      </Typography>
                    </Box>
                  </Stack>
                )}

                {section.key === 'status' && (
                  <Stack spacing={0.5} sx={{ pl: 3, pr: 0.5, pb: 1.3 }}>
                    {['Available', 'Occupied', 'Reserved', 'Maintenance', 'Unavailable'].map(
                      (status) => (
                        <Stack key={status} direction="row" spacing={1} alignItems="center">
                          <Checkbox
                            size="small"
                            checked={draftFilters.statuses.includes(status)}
                            onChange={() =>
                              setDraftFilters((current) => ({
                                ...current,
                                statuses: current.statuses.includes(status)
                                  ? current.statuses.filter((item) => item !== status)
                                  : [...current.statuses, status],
                              }))
                            }
                          />
                          <Typography sx={{ fontSize: 14 }}>{status}</Typography>
                        </Stack>
                      ),
                    )}
                  </Stack>
                )}
              </Collapse>

              {index < sectionDefinitions.length - 1 && <Divider sx={{ my: 1.1 }} />}
            </Box>
          ))}
        </Stack>

        <Divider sx={{ mt: 1.2, mb: 2 }} />

        <Stack direction="row" spacing={1.4}>
          <Button
            variant="contained"
            onClick={applyFilters}
            sx={{
              flex: 1,
              textTransform: 'none',
              bgcolor: '#4ca067',
              borderRadius: 1.2,
              py: 1.1,
              '&:hover': { bgcolor: '#3e8b58' },
            }}
          >
            Apply
          </Button>
          <Button
            variant="outlined"
            onClick={clearFilters}
            sx={{
              flex: 1,
              textTransform: 'none',
              borderRadius: 1.2,
              py: 1.1,
              borderColor: '#d9e0db',
              color: '#232f2b',
            }}
          >
            Clear
          </Button>
        </Stack>
      </Drawer>
    </Stack>
  )
}

function FilterSectionHeader({ label, expanded, onToggle }) {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      onClick={onToggle}
      sx={{ py: 1, cursor: 'pointer' }}
    >
      {expanded ? (
        <IndeterminateCheckBoxRoundedIcon sx={{ color: '#0b7a57', fontSize: 22 }} />
      ) : (
        <AddBoxRoundedIcon sx={{ color: '#0b7a57', fontSize: 22 }} />
      )}
      <Typography sx={{ fontSize: 16, fontWeight: 500 }}>{label}</Typography>
    </Stack>
  )
}

function LocationTreeNode({
  node,
  expandedNodes,
  selectedNodes,
  onToggleNode,
  onToggleSelection,
  depth = 0,
}) {
  const hasChildren = Boolean(node.children?.length)
  const expanded = expandedNodes.includes(node.id)
  const selected = selectedNodes.includes(node.id)

  return (
    <Box>
      <Stack direction="row" spacing={0.4} alignItems="center" sx={{ ml: depth * 1.8 }}>
        {hasChildren ? (
          <IconButton size="small" onClick={() => onToggleNode(node.id)} sx={{ p: 0.2 }}>
            {expanded ? (
              <IndeterminateCheckBoxRoundedIcon sx={{ color: '#0b7a57', fontSize: 20 }} />
            ) : (
              <AddBoxRoundedIcon sx={{ color: '#0b7a57', fontSize: 20 }} />
            )}
          </IconButton>
        ) : (
          <Box sx={{ width: 28 }} />
        )}
        <Checkbox size="small" checked={selected} onChange={() => onToggleSelection(node.id)} />
        <Typography sx={{ fontSize: 15 }}>{node.name}</Typography>
      </Stack>

      {hasChildren && (
        <Collapse in={expanded}>
          <Stack spacing={0.15} sx={{ mt: 0.15 }}>
            {node.children.map((child) => (
              <LocationTreeNode
                key={child.id}
                node={child}
                expandedNodes={expandedNodes}
                selectedNodes={selectedNodes}
                onToggleNode={onToggleNode}
                onToggleSelection={onToggleSelection}
                depth={depth + 1}
              />
            ))}
          </Stack>
        </Collapse>
      )}
    </Box>
  )
}

function SelectField({ label, value, onChange, options }) {
  return (
    <FormControl fullWidth size="small">
      <InputLabel>{label}</InputLabel>
      <Select value={value} label={label} onChange={(event) => onChange(event.target.value)}>
        <MenuItem value="">
          <em>All</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography sx={{ fontSize: 14 }}>{label}</Typography>
      <Switch checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </Stack>
  )
}

function getStatusColor(status) {
  if (status === 'Available') {
    return { bg: '#daf6e4', color: '#217a4d' }
  }
  if (status === 'Occupied' || status === 'Reserved') {
    return { bg: '#fff0d8', color: '#b27314' }
  }
  if (status === 'Maintenance') {
    return { bg: '#ffe5e5', color: '#be4a4a' }
  }
  return { bg: '#edf1ef', color: '#687973' }
}

async function mockLocationApi({ page, limit, search }) {
  const filtered = filterLocationNodes(mockLocationPages, search)
  const start = (page - 1) * limit
  const end = start + limit
  const data = filtered.slice(start, end)
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit))

  await new Promise((resolve) => setTimeout(resolve, 180))

  return {
    data: {
      data,
      pagination: {
        totalPages,
      },
    },
  }
}

const mockAxiosInstance = {
  get: async (_url, { params }) =>
    mockLocationApi({
      page: params.page,
      limit: params.limit,
      search: params.search,
    }),
}

function filterLocationNodes(nodes, query) {
  if (!query.trim()) return nodes

  const normalized = query.trim().toLowerCase()

  return nodes
    .map((node) => filterNode(node, normalized))
    .filter(Boolean)
}

function filterNode(node, query) {
  const selfMatch = node.name.toLowerCase().includes(query)
  const filteredChildren = (node.children || [])
    .map((child) => filterNode(child, query))
    .filter(Boolean)

  if (selfMatch || filteredChildren.length > 0) {
    return {
      ...node,
      children: filteredChildren,
    }
  }

  return null
}

const headCellSx = {
  fontWeight: 700,
  color: '#25332f',
  fontSize: 13,
}

const bodyCellSx = {
  fontSize: 13,
  color: '#4a5c56',
}

const summaryChipSx = {
  bgcolor: '#eef6f1',
  color: '#3d5d54',
  fontWeight: 700,
}

export default ResourceFilterTablePage
