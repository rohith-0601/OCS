import { motion } from 'framer-motion'
import { Calendar, Clock, Users, Building2, User } from 'lucide-react'
import { PURPOSE_BADGE, STATUS_BADGE } from '../utils/constants'
import { formatDate, formatTime } from '../utils/helpers'

const BookingCard = ({ booking, onCancel, showUser = false }) => {
  const isCancelled = booking.status === 'cancelled'
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card p-4 ${isCancelled ? 'opacity-60' : ''}`}
    >
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
          <Calendar size={14} className="text-gray-400 flex-shrink-0" />
          <span>{formatDate(booking.date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-gray-400 flex-shrink-0" />
          <span>{formatTime(booking.startTime)} – {formatTime(booking.endTime)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users size={14} className="text-gray-400 flex-shrink-0" />
          <span>{booking.participantCount} participants</span>
        </div>
        {booking.companyName && (
          <div className="flex items-center gap-2">
            <Building2 size={14} className="text-gray-400 flex-shrink-0" />
            <span>{booking.companyName}</span>
          </div>
        )}
        {showUser && booking.bookedBy && (
          <div className="flex items-center gap-2">
            <User size={14} className="text-gray-400 flex-shrink-0" />
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
    </motion.div>
  )
}

export default BookingCard
