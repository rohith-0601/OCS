import { PURPOSE_BADGE, STATUS_BADGE } from '../utils/constants'
import { formatDate, formatTime } from '../utils/helpers'

const BookingCard = ({ booking, onCancel, showUser = false }) => {
  const isCancelled = booking.status === 'cancelled'
  return (
    <div className={`card p-4 ${isCancelled ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">{booking.room?.name}</h3>
          <p className="text-xs text-gray-500">{booking.room?.block?.name}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={STATUS_BADGE[booking.status] || 'badge bg-gray-100 text-gray-700'}>{booking.status}</span>
          <span className={PURPOSE_BADGE[booking.purpose] || 'badge bg-gray-100 text-gray-700'}>{booking.purpose}</span>
        </div>
      </div>

      <div className="space-y-1 text-sm text-gray-600 mb-3">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formatDate(booking.date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{formatTime(booking.startTime)} – {formatTime(booking.endTime)}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{booking.participantCount} participants</span>
        </div>
        {booking.companyName && (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
            </svg>
            <span>{booking.companyName}</span>
          </div>
        )}
        {showUser && booking.bookedBy && (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{booking.bookedBy.name} ({booking.bookedBy.department || booking.bookedBy.email})</span>
          </div>
        )}
      </div>

      {!isCancelled && onCancel && (
        <button onClick={() => onCancel(booking)} className="btn-danger w-full text-xs py-1.5">Cancel Booking</button>
      )}
      {isCancelled && booking.cancelReason && (
        <p className="text-xs text-red-500 italic">Reason: {booking.cancelReason}</p>
      )}
    </div>
  )
}

export default BookingCard
