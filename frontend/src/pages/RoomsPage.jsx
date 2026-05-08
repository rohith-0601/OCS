import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRoomsApi, getBlocksApi } from '../api/roomApi'
import RoomCard from '../components/RoomCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { PURPOSES } from '../utils/constants'
import { useAuth } from '../context/AuthContext'

const RoomsPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [rooms, setRooms] = useState([])
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ block: '', minCapacity: '', purpose: '' })

  useEffect(() => {
    getBlocksApi().then((r) => setBlocks(r.data.blocks)).catch(console.error)
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (filters.block) params.block = filters.block
    if (filters.minCapacity) params.minCapacity = filters.minCapacity
    if (filters.purpose) params.purpose = filters.purpose
    getRoomsApi(params).then((r) => setRooms(r.data.rooms)).catch(console.error).finally(() => setLoading(false))
  }, [filters])

  const grouped = rooms.reduce((acc, room) => {
    const blockName = room.block?.name || 'Other'
    if (!acc[blockName]) acc[blockName] = []
    acc[blockName].push(room)
    return acc
  }, {})

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Rooms</h1>
        <p className="text-sm text-gray-500 mt-1">Browse all rooms across IIT Hyderabad blocks</p>
      </div>

      <div className="card p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Block</label>
            <select className="input" value={filters.block} onChange={(e) => setFilters({ ...filters, block: e.target.value })}>
              <option value="">All Blocks</option>
              {blocks.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Minimum Capacity</label>
            <input type="number" className="input" placeholder="e.g. 50" min="1"
              value={filters.minCapacity} onChange={(e) => setFilters({ ...filters, minCapacity: e.target.value })} />
          </div>
          <div>
            <label className="label">Purpose</label>
            <select className="input" value={filters.purpose} onChange={(e) => setFilters({ ...filters, purpose: e.target.value })}>
              <option value="">All Purposes</option>
              {PURPOSES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-gray-500">{rooms.length} rooms found</span>
          {(filters.block || filters.minCapacity || filters.purpose) && (
            <button onClick={() => setFilters({ block: '', minCapacity: '', purpose: '' })} className="text-xs text-brand-600 hover:underline">Clear filters</button>
          )}
        </div>
      </div>

      {loading ? <LoadingSpinner /> : rooms.length === 0 ? (
        <div className="card p-12 text-center"><p className="text-gray-500">No rooms found matching your filters.</p></div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([blockName, blockRooms]) => (
            <div key={blockName}>
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">{blockName}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {blockRooms.map((room) => (
                  <RoomCard key={room._id} room={room} onBook={user?.role !== 'viewer' ? (r) => navigate('/book', { state: { selectedRoom: r } }) : null} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RoomsPage
