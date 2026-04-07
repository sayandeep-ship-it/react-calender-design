import { useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'
import './App.css'

const NOW = new Date()
const NOW_ISO = NOW.toISOString()
const NOW_LOCAL_INPUT = toLocalInputValue(NOW)
const NOW_MONTH_VALUE = formatMonthValue(NOW)
const NOW_MONTH_LABEL = NOW.toLocaleDateString('en-US', {
  month: 'long',
  year: 'numeric',
})
const INITIAL_SCROLL_TIME = getInitialScrollTime(NOW)
const steps = ['Basic info', 'Location', 'Capabilities', 'Hours', 'Status rules']
const statusTabs = ['Availability', 'Maintenance', 'Cleaning', 'Limits', 'Timeline']
const viewOptions = [
  { id: 'timeGridWeek', label: 'Week' },
  { id: 'timeGridDay', label: 'Day' },
  { id: 'dayGridMonth', label: 'Month' },
  { id: 'listWeek', label: 'Agenda' },
]

const eventStyles = {
  available: {
    label: 'Available',
    borderColor: '#8bcfb6',
    backgroundColor: '#eef8f3',
    textColor: '#2a5a4c',
  },
  occupied: {
    label: 'Occupied',
    borderColor: '#dfa29c',
    backgroundColor: '#fdf2f1',
    textColor: '#824b46',
  },
  cleaning: {
    label: 'Cleaning',
    borderColor: '#b9cdf7',
    backgroundColor: '#eef4ff',
    textColor: '#3a5d9f',
  },
  blocked: {
    label: 'Blocked',
    borderColor: '#efcf9a',
    backgroundColor: '#fff7ea',
    textColor: '#7a5c1f',
  },
}

const defaultFormState = {
  id: '',
  title: '',
  start: NOW_LOCAL_INPUT,
  end: addMinutesToLocalInput(NOW, 30),
  type: 'blocked',
  resource: '',
  note: '',
}

function App() {
  const calendarRef = useRef(null)
  const monthPickerRef = useRef(null)
  const [events, setEvents] = useState(() => generateScheduleEvents())
  const [activeTab, setActiveTab] = useState('Availability')
  const [currentView, setCurrentView] = useState('timeGridWeek')
  const [currentTitle, setCurrentTitle] = useState(NOW_MONTH_LABEL)
  const [pickerValue, setPickerValue] = useState(NOW_MONTH_VALUE)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState({
    available: true,
    occupied: true,
    cleaning: true,
    blocked: true,
  })
  const [searchText, setSearchText] = useState('')
  const [showWeekends, setShowWeekends] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formState, setFormState] = useState(defaultFormState)

  const filteredEvents = events.filter((event) => {
    const typeMatch = selectedTypes[event.extendedProps.type]
    const searchMatch = [event.title, event.extendedProps.resource, event.extendedProps.note]
      .join(' ')
      .toLowerCase()
      .includes(searchText.toLowerCase())

    return typeMatch && searchMatch
  })

  const visibleCount = filteredEvents.length

  const syncCalendarState = () => {
    const api = calendarRef.current?.getApi()
    if (!api) return

    const activeDate = api.getDate()
    setCurrentView(api.view.type)
    setCurrentTitle(getCalendarHeaderTitle(api.view, activeDate))
    setPickerValue(formatMonthValue(activeDate))
  }

  const handleNavigate = (action) => {
    const api = calendarRef.current?.getApi()
    if (!api) return
    api[action]()
    syncCalendarState()
  }

  const handleViewChange = (viewId) => {
    const api = calendarRef.current?.getApi()
    if (!api) return
    api.changeView(viewId)
    syncCalendarState()
  }

  const handleMonthJump = (event) => {
    const value = event.target.value
    setPickerValue(value)

    const api = calendarRef.current?.getApi()
    if (!api || !value) return

    api.gotoDate(`${value}-01`)
    syncCalendarState()
  }

  const openMonthPicker = () => {
    const input = monthPickerRef.current
    if (!input) return
    if (typeof input.showPicker === 'function') {
      input.showPicker()
      return
    }
    input.focus()
    input.click()
  }

  const openCreateModal = (selectionInfo) => {
    const start = selectionInfo?.startStr?.slice(0, 16) ?? defaultFormState.start
    const end = selectionInfo?.endStr?.slice(0, 16) ?? defaultFormState.end

    setFormState({
      ...defaultFormState,
      start,
      end,
    })
    setIsModalOpen(true)
  }

  const openEditModal = (calendarEvent) => {
    setFormState({
      id: calendarEvent.id,
      title: calendarEvent.title,
      start: toInputDate(calendarEvent.start),
      end: toInputDate(calendarEvent.end),
      type: calendarEvent.extendedProps.type,
      resource: calendarEvent.extendedProps.resource || '',
      note: calendarEvent.extendedProps.note || '',
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setFormState(defaultFormState)
  }

  const handleSave = (event) => {
    event.preventDefault()

    const payload = {
      id: formState.id || `${Date.now()}`,
      title: formState.title,
      start: formState.start,
      end: formState.end,
      extendedProps: {
        type: formState.type,
        resource: formState.resource,
        note: formState.note,
      },
    }

    setEvents((current) => {
      const exists = current.some((item) => item.id === payload.id)
      return exists
        ? current.map((item) => (item.id === payload.id ? payload : item))
        : [...current, payload]
    })

    closeModal()
  }

  const handleDelete = () => {
    if (!formState.id) return
    setEvents((current) => current.filter((event) => event.id !== formState.id))
    closeModal()
  }

  const handleEventChange = (changeInfo) => {
    const updated = changeInfo.event

    setEvents((current) =>
      current.map((item) =>
        item.id === updated.id
          ? {
              ...item,
              title: updated.title,
              start: updated.start?.toISOString(),
              end: updated.end?.toISOString(),
              extendedProps: {
                ...item.extendedProps,
                ...updated.extendedProps,
              },
            }
          : item,
      ),
    )
  }

  const renderEventContent = (eventInfo) => {
    const { type, note } = eventInfo.event.extendedProps
    const compact = eventInfo.view.type === 'dayGridMonth'

    return (
      <div className={`calendar-event-card ${type} ${compact ? 'compact' : ''}`}>
        {!compact && <div className="event-time-label">{eventInfo.timeText}</div>}
        <div className="event-title">{eventInfo.event.title}</div>
        {!compact && (
          <>
            <div className="event-resource">{eventInfo.event.extendedProps.resource}</div>
            <div className="event-status-line">{note || eventStyles[type].label}</div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-mark"></div>
        </div>
        <div className="sidebar-icons">
          {['+', '=', '[]', '::', 'o', '#', 'u', '*', '~'].map((item, index) => (
            <button
              key={`${item}-${index}`}
              className={`sidebar-icon ${index === 7 ? 'active' : ''}`}
              type="button"
              aria-label={`Sidebar item ${index + 1}`}
            >
              <span>{item}</span>
            </button>
          ))}
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <button className="menu-button" type="button" aria-label="Open menu">
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className="topbar-spacer"></div>

          <div className="hospital-chip">
            <strong>ABC Hospital</strong>
            <span>2972 Westheimer Rd, Santa Ana, Illinois 85486</span>
          </div>

          <div className="topbar-actions">
            <button className="circle-button" type="button" aria-label="Settings">
              <CogIcon />
            </button>
            <button className="circle-button" type="button" aria-label="Notifications">
              <BellIcon />
            </button>
            <div className="user-box">
              <div className="user-avatar"></div>
              <span>John Doe</span>
            </div>
          </div>
        </header>

        <section className="page-body">
          <div className="page-title-bar">
            <button className="back-button" type="button" aria-label="Go back">
              <ArrowLeftIcon />
            </button>
            <h1>Add Resources</h1>
          </div>

          <section className="content-card">
            <div className="stepper">
              {steps.map((step, index) => (
                <div className="step-item" key={step}>
                  <div className={`step-badge ${index < 4 ? 'done' : 'current'}`}>
                    {index < 4 ? <CheckIcon /> : '5'}
                  </div>
                  <span>{step}</span>
                  {index < steps.length - 1 && <span className="step-arrow">-&gt;</span>}
                </div>
              ))}
            </div>

            <div className="section-copy">
              <h2>Status Rules</h2>
              <p>Set automated status rules to manage the behavior of this resource.</p>
            </div>

            <div className="status-tabs">
              {statusTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={tab === activeTab ? 'active' : ''}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="calendar-heading">
              <div>
                <h3>Availability Calendar</h3>
                <span>{visibleCount} visible events</span>
              </div>
              <button className="primary-action" type="button" onClick={() => openCreateModal()}>
                + Add Block Time
              </button>
            </div>

            <div className="calendar-card">
              <div className="calendar-toolbar">
                <div className="toolbar-left">
                  <button className="toolbar-button neutral" type="button" onClick={() => handleNavigate('today')}>
                    Today
                  </button>
                  <div className="nav-buttons">
                    <button className="icon-button" type="button" onClick={() => handleNavigate('prev')}>
                      <ChevronLeftIcon />
                    </button>
                    <button className="icon-button" type="button" onClick={() => handleNavigate('next')}>
                      <ChevronRightIcon />
                    </button>
                  </div>
                  <div className="month-label">{currentTitle}</div>
                  <button className="icon-button" type="button" aria-label="Choose month" onClick={openMonthPicker}>
                    <CalendarIcon />
                  </button>
                  <input
                    ref={monthPickerRef}
                    className="month-picker-input"
                    type="month"
                    value={pickerValue}
                    onChange={handleMonthJump}
                    aria-label="Choose month and year"
                  />
                </div>

                <div className="toolbar-right">
                  <div className="filter-wrap">
                    <button className="toolbar-button" type="button" onClick={() => setShowFilters((value) => !value)}>
                      <FilterIcon />
                      Filter
                    </button>

                    {showFilters && (
                      <div className="filter-panel">
                        <label className="filter-search">
                          <span>Search</span>
                          <input
                            type="text"
                            value={searchText}
                            onChange={(event) => setSearchText(event.target.value)}
                            placeholder="Search events"
                          />
                        </label>

                        <div className="filter-group">
                          {Object.entries(eventStyles).map(([type, value]) => (
                            <label className="filter-option" key={type}>
                              <input
                                type="checkbox"
                                checked={selectedTypes[type]}
                                onChange={() =>
                                  setSelectedTypes((current) => ({
                                    ...current,
                                    [type]: !current[type],
                                  }))
                                }
                              />
                              <span className={`filter-dot ${type}`}></span>
                              <span>{value.label}</span>
                            </label>
                          ))}
                        </div>

                        <label className="filter-option toggle">
                          <span>Show weekends</span>
                          <input
                            type="checkbox"
                            checked={showWeekends}
                            onChange={() => setShowWeekends((value) => !value)}
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  <select
                    className="view-select"
                    value={currentView}
                    onChange={(event) => handleViewChange(event.target.value)}
                  >
                    {viewOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="timezone-label">IST +05:30</div>

              <FullCalendar
                ref={calendarRef}
                plugins={[timeGridPlugin, dayGridPlugin, listPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                initialDate="2026-02-08"
                headerToolbar={false}
                weekends={showWeekends}
                editable
                selectable
                selectMirror
                nowIndicator
                now={NOW_ISO}
                allDaySlot={false}
                dayMaxEvents
                slotMinTime="00:00:00"
                slotMaxTime="24:00:00"
                slotDuration="00:15:00"
                slotLabelInterval="01:00:00"
                snapDuration="00:01:00"
                eventMinHeight={18}
                eventShortHeight={18}
                scrollTime={INITIAL_SCROLL_TIME}
                scrollTimeReset={false}
                events={filteredEvents.map((event) => ({
                  ...event,
                  ...eventStyles[event.extendedProps.type],
                }))}
                initialDate={NOW_ISO}
                select={openCreateModal}
                eventClick={(info) => openEditModal(info.event)}
                eventDrop={handleEventChange}
                eventResize={handleEventChange}
                eventContent={renderEventContent}
                height="auto"
                dayHeaderFormat={{
                  weekday: 'short',
                  day: '2-digit',
                }}
                datesSet={({ view }) => {
                  const activeDate = calendarRef.current?.getApi()?.getDate() ?? view.currentStart
                  setCurrentView(view.type)
                  setCurrentTitle(getCalendarHeaderTitle(view, activeDate))
                  setPickerValue(formatMonthValue(activeDate))
                }}
              />
            </div>
          </section>

          <div className="footer-card">
            <button className="footer-button secondary" type="button">
              {'<-'} Back
            </button>
            <button className="footer-button primary" type="button">
              Finish {'->'}
            </button>
          </div>
        </section>

        {isModalOpen && (
          <div className="modal-overlay" role="presentation" onClick={closeModal}>
            <div className="modal-card" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
              <div className="modal-header">
                <h4>{formState.id ? 'Edit Schedule Block' : 'Create Schedule Block'}</h4>
                <button className="icon-button" type="button" onClick={closeModal}>
                  <CloseIcon />
                </button>
              </div>

              <form className="modal-form" onSubmit={handleSave}>
                <label>
                  Title
                  <input
                    type="text"
                    value={formState.title}
                    onChange={(event) => updateField(setFormState, 'title', event.target.value)}
                    required
                  />
                </label>

                <div className="modal-grid">
                  <label>
                    Start
                    <input
                      type="datetime-local"
                      value={formState.start}
                      onChange={(event) => updateField(setFormState, 'start', event.target.value)}
                      required
                    />
                  </label>

                  <label>
                    End
                    <input
                      type="datetime-local"
                      value={formState.end}
                      onChange={(event) => updateField(setFormState, 'end', event.target.value)}
                      required
                    />
                  </label>
                </div>

                <div className="modal-grid">
                  <label>
                    Type
                    <select
                      value={formState.type}
                      onChange={(event) => updateField(setFormState, 'type', event.target.value)}
                    >
                      {Object.entries(eventStyles).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Resource
                    <input
                      type="text"
                      value={formState.resource}
                      onChange={(event) => updateField(setFormState, 'resource', event.target.value)}
                    />
                  </label>
                </div>

                <label>
                  Note
                  <textarea
                    rows="3"
                    value={formState.note}
                    onChange={(event) => updateField(setFormState, 'note', event.target.value)}
                  />
                </label>

                <div className="modal-actions">
                  {formState.id && (
                    <button className="danger-button" type="button" onClick={handleDelete}>
                      Delete
                    </button>
                  )}
                  <div className="modal-spacer"></div>
                  <button className="toolbar-button" type="button" onClick={closeModal}>
                    Cancel
                  </button>
                  <button className="primary-action" type="submit">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function generateScheduleEvents() {
  const base = new Date(NOW)
  const templates = [
    { title: 'Consultation Room 1', type: 'available', resource: 'Room A', note: 'Open consultation slot' },
    { title: 'Dr Raj Patel | Booked', type: 'occupied', resource: 'OT-2', note: 'For surgery' },
    { title: 'Sterile Cleanup', type: 'cleaning', resource: 'Wing B', note: 'Daily cleaning' },
    { title: 'Blocked Time', type: 'blocked', resource: 'MRI Room', note: 'Reserved for maintenance' },
    { title: 'Follow-up Visit', type: 'available', resource: 'Room C', note: 'Priority patient follow-up' },
    { title: 'Procedure Hold', type: 'occupied', resource: 'Lab 3', note: 'Procedure in progress' },
  ]

  const hourSlots = [
    { startHour: 7, durationMinutes: 30 },
    { startHour: 9, durationMinutes: 60 },
    { startHour: 11, durationMinutes: 30 },
    { startHour: 14, durationMinutes: 60 },
    { startHour: 16, durationMinutes: 30 },
  ]

  const items = []

  for (let dayOffset = -35; dayOffset <= 55; dayOffset += 1) {
    const day = new Date(base)
    day.setDate(base.getDate() + dayOffset)

    hourSlots.forEach((slot, slotIndex) => {
      const template = templates[(dayOffset + slotIndex + templates.length * 10) % templates.length]
      const start = new Date(day)
      start.setHours(slot.startHour + (slotIndex % 2), slotIndex % 2 === 0 ? 0 : 30, 0, 0)

      const end = new Date(start)
      end.setMinutes(end.getMinutes() + slot.durationMinutes)

      items.push({
        id: `event-${dayOffset + 40}-${slotIndex}`,
        title: template.title,
        start: start.toISOString(),
        end: end.toISOString(),
        extendedProps: {
          type: template.type,
          resource: template.resource,
          note: template.note,
        },
      })
    })
  }

  items.push({
    id: 'current-highlight',
    title: 'Current Day Availability',
    start: NOW_ISO,
    end: new Date(base.getTime() + 60 * 60 * 1000).toISOString(),
    extendedProps: {
      type: 'available',
      resource: 'Room A',
      note: 'Live slot for today',
    },
  })

  return items
}

function getCalendarHeaderTitle(view, activeDate) {
  if (view.type === 'timeGridWeek' || view.type === 'listWeek') {
    return new Date(activeDate).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })
  }

  if (view.type === 'timeGridDay') {
    return new Date(activeDate).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return view.title
}

function formatMonthValue(dateLike) {
  const date = new Date(dateLike)
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  return `${year}-${month}`
}

function toLocalInputValue(date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  const hours = `${date.getHours()}`.padStart(2, '0')
  const minutes = `${date.getMinutes()}`.padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

function addMinutesToLocalInput(date, minutesToAdd) {
  const next = new Date(date)
  next.setMinutes(next.getMinutes() + minutesToAdd)
  return toLocalInputValue(next)
}

function getInitialScrollTime(date) {
  const adjusted = new Date(date)
  adjusted.setMinutes(0, 0, 0)
  adjusted.setHours(Math.max(0, adjusted.getHours() - 1))
  const hours = `${adjusted.getHours()}`.padStart(2, '0')
  const minutes = `${adjusted.getMinutes()}`.padStart(2, '0')
  return `${hours}:${minutes}:00`
}

function updateField(setter, key, value) {
  setter((current) => ({
    ...current,
    [key]: value,
  }))
}

function toInputDate(date) {
  if (!date) return ''
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  const hours = `${date.getHours()}`.padStart(2, '0')
  const minutes = `${date.getMinutes()}`.padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M11.7 5 6.7 10l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M11.5 5 7 10l4.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="m8.5 5 4.5 5-4.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3" y="4.5" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.5 3v3M13.5 3v3M3 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 5h12M6.5 10h7M8.5 15h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function CogIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 6.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m16 10-.93.55.09 1.07-1.02.59-.78-.73-1.03.39-.28 1.03H8.95l-.28-1.03-1.03-.39-.78.73-1.02-.59.09-1.07L4 10l.93-.55-.09-1.07 1.02-.59.78.73 1.03-.39.28-1.03h2.1l.28 1.03 1.03.39.78-.73 1.02.59-.09 1.07L16 10Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 16.2a1.8 1.8 0 0 0 1.75-1.4h-3.5A1.8 1.8 0 0 0 10 16.2Z" fill="currentColor" />
      <path
        d="M5.8 8.3a4.2 4.2 0 1 1 8.4 0c0 3 .95 3.93 1.5 4.88H4.3c.55-.95 1.5-1.88 1.5-4.88Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="m5.5 10.5 3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export default App
