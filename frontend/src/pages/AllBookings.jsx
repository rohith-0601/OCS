import { useState, useEffect } from 'react'
import { getBookingsApi, cancelBookingApi } from '../api/bookingApi'
import { getBlocksApi, getRoomsApi } from '../api/roomApi'
import BookingCard from '../components/BookingCard'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import { PURPOSES } from '../utils/constants'
import { todayISO } from '../utils/helpers'
import toast from 'react-hot-toast'

const AllBookings = () => {
  const [bookings, setBookings] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ status: '', purpose: '', date: '', room: '' })
  const [cancelModal, setCancelModal] = useState({ open: false, booking: null })
  const [cancelReason, setCancelReason] = useState('')
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    getRoomsApi().then((r) => setRooms(r.data.rooms)).catch(console.error)
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.status) params.status = filters.status
      if (filters.purpose) params.purpose = filters.purpose
      if (filters.date) params.date = filters.date
      if (filters.room) params.room = filters.room
      const res = await getBookingsApi(params)
      setBookings(res.data.bookings)
    } catch { toast.error('Failed to load bookings') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchBookings() }, [filters])

  const handleCancelConfirm = async () => {
    setCancelling(true)
    try {
      await cancelBookingApi(cancelModal.booking._id, { cancelReason })
      toast.success('Booking cancelled')
      setCancelModal({ open: false, booking: null })
      fetchBookings()
    } catch (err) { toast.error(err.response?.data?.message || 'Cancel failed') }
    finally { setCancelling(false) }
  }

  const clearFilters = () => setFilters({ status: '', purpose: '', date: '', room: '' })
  const hasFilters = filters.status || filters.purpose || filters.date || filters.room

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Bookings</h1>
        <p className="text-sm text-gray-500 mt-1">View and manage all bookings across all users</p>
      </div>

      <div className="card p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="label">Status</label>
            <select className="input" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="label">Purpose</label>
            <select className="input" value={filters.purpose} onChange={(e) => setFilters({ ...filters, purpose: e.target.value })}>
              <option value="">All Purposes</option>
              {PURPOSES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Date</label>
            <input type="date" className="input" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
          </div>
          <div>
            <label className="label">Room</label>
            <select className="input" value={filters.room} onChange={(e) => setFilters({ ...filters, room: e.target.value })}>
              <option value="">All Rooms</option>
              {rooms.map((r) => <option key={r._id} value={r._id}>{r.name} ({r.block?.name})</option>)}
            </select>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-gray-500">{bookings.length} bookings found</span>
          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-brand-600 hover:underline">Clear filters</button>
          )}
        </div>
      </div>

      {loading ? <LoadingSpinner /> : bookings.length === 0 ? (
        <div className="card p-12 text-center">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
          </svg>
          <p className="text-gray-500 text-sm">No bookings found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {bookings.map((b) => (
            <BookingCard
              key={b._id}
              booking={b}
              showUser
              onCancel={b.status !== 'cancelled' ? (bk) => { setCancelModal({ open: true, booking: bk }); setCancelReason('') } : null}
            />
          ))}
        </div>
      )}

      <Modal isOpen={cancelModal.open} onClose={() => setCancelModal({ open: false, booking: null })} title="Cancel Booking">
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to cancel the booking for <span className="font-semibold">{cancelModal.booking?.room?.name}</span> on {cancelModal.booking?.date?.substring(0, 10)}?
        </p>
        <div className="mb-4">
          <label className="label">Reason (optional)</label>
          <textarea className="input" rows={2} placeholder="Reason for cancellation..." value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} />
        </div>
        <div className="flex gap-3">
          <button onClick={() => setCancelModal({ open: false, booking: null })} className="btn-secondary flex-1">Keep Booking</button>
          <button onClick={handleCancelConfirm} disabled={cancelling} className="btn-danger flex-1">{cancelling ? 'Cancelling...' : 'Cancel Booking'}</button>
        </div>
      </Modal>
    </div>
  )
}

export default AllBookings
