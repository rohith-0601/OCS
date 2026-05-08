import { motion } from 'framer-motion'
import { Users, DoorOpen } from 'lucide-react'
import { PURPOSE_BADGE } from '../utils/constants'

const RoomCard = ({ room, onBook }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-4 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">{room.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{room.block?.name}</p>
        </div>
        <span className={`badge ${room.isAvailable ? 'badge-confirmed' : 'badge-cancelled'}`}>
          {room.isAvailable ? 'Available' : 'Unavailable'}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
        <Users size={14} className="text-gray-400" />
        <span className="font-medium">{room.capacity}</span>
        <span className="text-gray-400">seats</span>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {room.allowedPurposes?.map((p) => (
          <span key={p} className={PURPOSE_BADGE[p] || 'badge bg-gray-100 text-gray-700'}>{p}</span>
        ))}
      </div>

      {room.notes && <p className="text-xs text-gray-500 mb-3 italic">{room.notes}</p>}

      {onBook && room.isAvailable && (
        <button onClick={() => onBook(room)} className="btn-primary w-full text-xs py-1.5">
          <DoorOpen size={14} />
          Book This Room
        </button>
      )}
    </motion.div>
  )
}

export default RoomCard
