import { useState, useEffect } from 'react'
import { getRoomsApi, getBlocksApi, createRoomApi, updateRoomApi, deleteRoomApi, createBlockApi } from '../api/roomApi'
import Modal from '../components/Modal'
import LoadingSpinner from '../components/LoadingSpinner'
import { PURPOSES } from '../utils/constants'
import toast from 'react-hot-toast'

const emptyRoomForm = { name: '', block: '', capacity: '', allowedPurposes: ['OA', 'Interview', 'PPT'], isAvailable: true, notes: '' }
const emptyBlockForm = { name: '', description: '' }

const ManageRooms = () => {
  const [rooms, setRooms] = useState([])
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [roomModal, setRoomModal] = useState({ open: false, mode: 'create', room: null })
  const [blockModal, setBlockModal] = useState({ open: false })
  const [roomForm, setRoomForm] = useState(emptyRoomForm)
  const [blockForm, setBlockForm] = useState(emptyBlockForm)
  const [saving, setSaving] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [roomsRes, blocksRes] = await Promise.all([getRoomsApi(), getBlocksApi()])
      setRooms(roomsRes.data.rooms)
      setBlocks(blocksRes.data.blocks)
    } catch { toast.error('Failed to load data') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const openCreateRoom = () => {
    setRoomForm({ ...emptyRoomForm, block: blocks[0]?._id || '' })
    setRoomModal({ open: true, mode: 'create', room: null })
  }

  const openEditRoom = (room) => {
    setRoomForm({
      name: room.name,
      block: room.block?._id || '',
      capacity: room.capacity,
      allowedPurposes: room.allowedPurposes || ['OA', 'Interview', 'PPT'],
      isAvailable: room.isAvailable,
      notes: room.notes || '',
    })
    setRoomModal({ open: true, mode: 'edit', room })
  }

  const handleSaveRoom = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...roomForm, capacity: parseInt(roomForm.capacity) }
      if (roomModal.mode === 'create') {
        await createRoomApi(payload)
        toast.success('Room created')
      } else {
        await updateRoomApi(roomModal.room._id, payload)
        toast.success('Room updated')
      }
      setRoomModal({ open: false })
      fetchData()
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed') }
    finally { setSaving(false) }
  }

  const handleDeleteRoom = async (room) => {
    if (!window.confirm(`Delete room "${room.name}"?`)) return
    try {
      await deleteRoomApi(room._id)
      toast.success('Room deleted')
      fetchData()
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed') }
  }

  const handleTogglePurpose = (purpose) => {
    const current = roomForm.allowedPurposes
    if (current.includes(purpose)) {
      setRoomForm({ ...roomForm, allowedPurposes: current.filter((p) => p !== purpose) })
    } else {
      setRoomForm({ ...roomForm, allowedPurposes: [...current, purpose] })
    }
  }

  const handleSaveBlock = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await createBlockApi(blockForm)
      toast.success('Block created')
      setBlockModal({ open: false })
      setBlockForm(emptyBlockForm)
      fetchData()
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed') }
    finally { setSaving(false) }
  }

  const grouped = rooms.reduce((acc, room) => {
    const blockName = room.block?.name || 'Other'
    if (!acc[blockName]) acc[blockName] = []
    acc[blockName].push(room)
    return acc
  }, {})

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Rooms</h1>
          <p className="text-sm text-gray-500 mt-1">{rooms.length} rooms across {blocks.length} blocks</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setBlockModal({ open: true })} className="btn-secondary">+ Add Block</button>
          <button onClick={openCreateRoom} className="btn-primary">+ Add Room</button>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : rooms.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-500">No rooms found. Start by adding a block and then a room.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([blockName, blockRooms]) => (
            <div key={blockName}>
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">{blockName}</h2>
              <div className="card overflow-hidden overflow-x-auto">
                <table className="w-full text-sm min-w-[600px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['Room Name', 'Capacity', 'Purposes', 'Status', 'Notes', 'Actions'].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {blockRooms.map((room) => (
                      <tr key={room._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{room.name}</td>
                        <td className="px-4 py-3 text-gray-600">{room.capacity}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {room.allowedPurposes?.map((p) => (
                              <span key={p} className="badge bg-gray-100 text-gray-700">{p}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge ${room.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {room.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs max-w-[150px] truncate">{room.notes || '—'}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEditRoom(room)} className="text-xs text-brand-600 hover:underline">Edit</button>
                            <button onClick={() => handleDeleteRoom(room)} className="text-xs text-red-500 hover:underline">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Room Modal */}
      <Modal isOpen={roomModal.open} onClose={() => setRoomModal({ open: false })} title={roomModal.mode === 'create' ? 'Add New Room' : 'Edit Room'}>
        <form onSubmit={handleSaveRoom} className="space-y-4">
          <div>
            <label className="label">Room Name</label>
            <input className="input" placeholder="e.g. LH-101" value={roomForm.name} onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })} required />
          </div>
          <div>
            <label className="label">Block</label>
            <select className="input" value={roomForm.block} onChange={(e) => setRoomForm({ ...roomForm, block: e.target.value })} required>
              <option value="">Select a block</option>
              {blocks.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Capacity</label>
            <input type="number" className="input" min="1" placeholder="e.g. 120" value={roomForm.capacity} onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })} required />
          </div>
          <div>
            <label className="label">Allowed Purposes</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {PURPOSES.map((p) => (
                <label key={p.value} className="inline-flex items-center gap-1.5 text-sm cursor-pointer">
                  <input type="checkbox" checked={roomForm.allowedPurposes.includes(p.value)} onChange={() => handleTogglePurpose(p.value)} className="rounded border-gray-300" />
                  {p.label}
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="label mb-0">Available</label>
            <input type="checkbox" checked={roomForm.isAvailable} onChange={(e) => setRoomForm({ ...roomForm, isAvailable: e.target.checked })} />
          </div>
          <div>
            <label className="label">Notes (optional)</label>
            <textarea className="input" rows={2} placeholder="e.g. Has projector, AC room" value={roomForm.notes} onChange={(e) => setRoomForm({ ...roomForm, notes: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setRoomModal({ open: false })} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Save Room'}</button>
          </div>
        </form>
      </Modal>

      {/* Block Modal */}
      <Modal isOpen={blockModal.open} onClose={() => setBlockModal({ open: false })} title="Add New Block" size="sm">
        <form onSubmit={handleSaveBlock} className="space-y-4">
          <div>
            <label className="label">Block Name</label>
            <input className="input" placeholder="e.g. Academic Block A" value={blockForm.name} onChange={(e) => setBlockForm({ ...blockForm, name: e.target.value })} required />
          </div>
          <div>
            <label className="label">Description (optional)</label>
            <textarea className="input" rows={2} placeholder="e.g. Near main gate, 3 floors" value={blockForm.description} onChange={(e) => setBlockForm({ ...blockForm, description: e.target.value })} />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setBlockModal({ open: false })} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Add Block'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ManageRooms
