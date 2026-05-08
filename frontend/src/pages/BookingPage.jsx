import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getBlocksApi, getAvailableRoomsApi } from '../api/roomApi'
import { createBookingApi } from '../api/bookingApi'
import RoomCard from '../components/RoomCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { PURPOSES, TIME_SLOTS } from '../utils/constants'
import { todayISO } from '../utils/helpers'
import toast from 'react-hot-toast'

const BookingPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const preselected = location.state?.selectedRoom

  const [blocks, setBlocks] = useState([])
  const [availableRooms, setAvailableRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(preselected || null)
  const [searched, setSearched] = useState(false)
  const [searching, setSearching] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState({ date: todayISO(), startTime: '09:00', endTime: '11:00', purpose: 'OA', participantCount: '30', block: '' })
  const [bookingForm, setBookingForm] = useState({ companyName: '', notes: '' })

  useEffect(() => { getBlocksApi().then((r) => setBlocks(r.data.blocks)).catch(console.error) }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (search.startTime >= search.endTime) return toast.error('End time must be after start time')
    setSearching(true); setSelectedRoom(null)
    try {
      const params = { date: search.date, startTime: search.startTime, endTime: search.endTime, purpose: search.purpose, participantCount: search.participantCount }
      if (search.block) params.block = search.block
      const res = await getAvailableRoomsApi(params)
      setAvailableRooms(res.data.rooms); setSearched(true)
    } catch (err) { toast.error(err.response?.data?.message || 'Search failed') }
    finally { setSearching(false) }
  }

  const handleBookSubmit = async (e) => {
    e.preventDefault()
    if (!selectedRoom) return toast.error('Please select a room')
    setSubmitting(true)
    try {
      await createBookingApi({ room: selectedRoom._id, date: search.date, startTime: search.startTime, endTime: search.endTime, purpose: search.purpose, participantCount: parseInt(search.participantCount), companyName: bookingForm.companyName, notes: bookingForm.notes })
      toast.success('Room booked successfully!')
      navigate('/my-bookings')
    } catch (err) { toast.error(err.response?.data?.message || 'Booking failed') }
    finally { setSubmitting(false) }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Book a Room</h1>
        <p className="text-sm text-gray-500 mt-1">Search for available rooms and confirm your booking</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-24">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-brand-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
              Search Available Rooms
            </h2>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="label">Date</label>
                <input type="date" className="input" min={todayISO()} value={search.date} onChange={(e) => setSearch({ ...search, date: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Start Time</label>
                  <select className="input" value={search.startTime} onChange={(e) => setSearch({ ...search, startTime: e.target.value })}>
                    {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">End Time</label>
                  <select className="input" value={search.endTime} onChange={(e) => setSearch({ ...search, endTime: e.target.value })}>
                    {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Purpose</label>
                <select className="input" value={search.purpose} onChange={(e) => setSearch({ ...search, purpose: e.target.value })}>
                  {PURPOSES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Expected Participants</label>
                <input type="number" className="input" min="1" placeholder="e.g. 50" value={search.participantCount} onChange={(e) => setSearch({ ...search, participantCount: e.target.value })} required />
              </div>
              <div>
                <label className="label">Preferred Block (optional)</label>
                <select className="input" value={search.block} onChange={(e) => setSearch({ ...search, block: e.target.value })}>
                  <option value="">Any Block</option>
                  {blocks.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
              </div>
              <button type="submit" disabled={searching} className="btn-primary w-full">{searching ? 'Searching...' : 'Search Rooms'}</button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {(searched || preselected) && (
            <div>
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-brand-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                {searched ? `${availableRooms.length} Available Rooms` : 'Select a Room'}
              </h2>
              {searching ? <LoadingSpinner /> : (
                searched && availableRooms.length === 0 ? (
                  <div className="card p-8 text-center">
                    <p className="text-gray-500">No rooms available for the selected criteria.</p>
                    <p className="text-xs text-gray-400 mt-1">Try adjusting the time slot, capacity, or purpose.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(searched ? availableRooms : [preselected]).map((room) => (
                      <div key={room._id} onClick={() => setSelectedRoom(room)}
                        className={`cursor-pointer rounded-xl transition-all ${selectedRoom?._id === room._id ? 'ring-2 ring-brand-500 shadow-md' : 'hover:shadow-md'}`}>
                        <RoomCard room={room} />
                        {selectedRoom?._id === room._id && (
                          <div className="bg-brand-600 text-white text-center text-xs font-medium py-1.5 rounded-b-xl">✓ Selected</div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          )}

          {selectedRoom && (
            <div className="card p-5">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-brand-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                Confirm Booking — {selectedRoom.name}
              </h2>
              <form onSubmit={handleBookSubmit} className="space-y-4">
                <div>
                  <label className="label">Company / Recruiter Name (optional)</label>
                  <input type="text" className="input" placeholder="e.g. Google, Microsoft" value={bookingForm.companyName} onChange={(e) => setBookingForm({ ...bookingForm, companyName: e.target.value })} />
                </div>
                <div>
                  <label className="label">Additional Notes (optional)</label>
                  <textarea className="input" rows={2} placeholder="Any special requirements..." value={bookingForm.notes} onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })} />
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1 text-gray-600">
                  {[['Room', selectedRoom.name], ['Block', selectedRoom.block?.name], ['Date', search.date], ['Time', `${search.startTime} – ${search.endTime}`], ['Purpose', search.purpose], ['Participants', search.participantCount]].map(([k, v]) => (
                    <div key={k} className="flex justify-between"><span>{k}</span><span className="font-medium text-gray-900">{v}</span></div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setSelectedRoom(null)} className="btn-secondary flex-1">Change Room</button>
                  <button type="submit" disabled={submitting} className="btn-primary flex-1">{submitting ? 'Booking...' : 'Confirm Booking'}</button>
                </div>
              </form>
            </div>
          )}

          {!searched && !preselected && (
            <div className="card p-12 text-center border-dashed">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-gray-500 text-sm">Search for available rooms using the form on the left.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingPage
