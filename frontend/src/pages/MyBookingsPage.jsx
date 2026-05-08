import { useState, useEffect } from 'react'
import { getBookingsApi, cancelBookingApi } from '../api/bookingApi'
import BookingCard from '../components/BookingCard'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import toast from 'react-hot-toast'

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [cancelModal, setCancelModal] = useState({ open: false, booking: null })
  const [cancelReason, setCancelReason] = useState('')
  const [cancelling, setCancelling] = useState(false)

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filter !== 'all') params.status = filter
      const res = await getBookingsApi(params)
      setBookings(res.data.bookings)
    } catch { toast.error('Failed to load bookings') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchBookings() }, [filter])

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

  const tabs = [{ label: 'All', value: 'all' }, { label: 'Confirmed', value: 'confirmed' }, { label: 'Cancelled', value: 'cancelled' }]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-sm text-gray-500 mt-1">View and manage your room bookings</p>
      </div>

      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {tabs.map((t) => (
          <button key={t.value} onClick={() => setFilter(t.value)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${filter === t.value ? 'border-brand-600 text-brand-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : bookings.length === 0 ? (
        <div className="card p-12 text-center">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
          </svg>
          <p className="text-gray-500 text-sm">No bookings found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {bookings.map((b) => (
            <BookingCard key={b._id} booking={b} onCancel={(bk) => { setCancelModal({ open: true, booking: bk }); setCancelReason('') }} />
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

export default MyBookingsPage
