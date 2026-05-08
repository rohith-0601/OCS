import { PURPOSE_BADGE } from '../utils/constants'

const RoomCard = ({ room, onBook }) => {
  return (
    <div className="card p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">{room.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{room.block?.name}</p>
        </div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${room.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {room.isAvailable ? 'Available' : 'Unavailable'}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
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
          Book This Room
        </button>
      )}
    </div>
  )
}

export default RoomCard
