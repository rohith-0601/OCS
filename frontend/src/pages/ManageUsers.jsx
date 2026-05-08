import { useState, useEffect } from 'react'
import { getUsersApi, createUserApi, updateUserApi, deleteUserApi, resetPasswordApi } from '../api/adminApi'
import Modal from '../components/Modal'
import LoadingSpinner from '../components/LoadingSpinner'
import { ROLES } from '../utils/constants'
import { getRoleColor, formatDateTime } from '../utils/helpers'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const emptyForm = { name: '', email: '', password: '', role: 'core', department: '' }

const ManageUsers = () => {
  const { user: me } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState({ open: false, mode: 'create', user: null })
  const [form, setForm] = useState(emptyForm)
  const [resetModal, setResetModal] = useState({ open: false, userId: null })
  const [newPassword, setNewPassword] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    try { const res = await getUsersApi(); setUsers(res.data.users) }
    catch { toast.error('Failed to load users') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchUsers() }, [])

  const openCreate = () => { setForm(emptyForm); setModal({ open: true, mode: 'create', user: null }) }
  const openEdit = (u) => {
    setForm({ name: u.name, email: u.email, password: '', role: u.role, department: u.department || '' })
    setModal({ open: true, mode: 'edit', user: u })
  }

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (modal.mode === 'create') { await createUserApi(form); toast.success('User created') }
      else { await updateUserApi(modal.user._id, { name: form.name, email: form.email, role: form.role, department: form.department }); toast.success('User updated') }
      setModal({ open: false }); fetchUsers()
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed') }
    finally { setSaving(false) }
  }

  const handleToggleActive = async (u) => {
    try { await updateUserApi(u._id, { isActive: !u.isActive }); toast.success(`User ${u.isActive ? 'deactivated' : 'activated'}`); fetchUsers() }
    catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const handleDelete = async (u) => {
    if (!window.confirm(`Delete user ${u.name}?`)) return
    try { await deleteUserApi(u._id); toast.success('User deleted'); fetchUsers() }
    catch (err) { toast.error(err.response?.data?.message || 'Delete failed') }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault(); setSaving(true)
    try { await resetPasswordApi(resetModal.userId, { newPassword }); toast.success('Password reset'); setResetModal({ open: false }); setNewPassword('') }
    catch (err) { toast.error(err.response?.data?.message || 'Reset failed') }
    finally { setSaving(false) }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-sm text-gray-500 mt-1">{users.length} users total</p>
        </div>
        <button onClick={openCreate} className="btn-primary">+ Add User</button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="card overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Name', 'Email', 'Role', 'Department', 'Status', 'Created', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3"><span className={`badge ${getRoleColor(u.role)}`}>{u.role}</span></td>
                  <td className="px-4 py-3 text-gray-600">{u.department || '—'}</td>
                  <td className="px-4 py-3"><span className={`badge ${u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{formatDateTime(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button onClick={() => openEdit(u)} className="text-xs text-brand-600 hover:underline">Edit</button>
                      {u._id !== me._id && (
                        <>
                          <button onClick={() => handleToggleActive(u)} className="text-xs text-amber-600 hover:underline">{u.isActive ? 'Deactivate' : 'Activate'}</button>
                          <button onClick={() => setResetModal({ open: true, userId: u._id })} className="text-xs text-gray-500 hover:underline">Reset Pwd</button>
                          <button onClick={() => handleDelete(u)} className="text-xs text-red-500 hover:underline">Delete</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modal.open} onClose={() => setModal({ open: false })} title={modal.mode === 'create' ? 'Create New User' : 'Edit User'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div><label className="label">Full Name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div><label className="label">Email</label><input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
          {modal.mode === 'create' && <div><label className="label">Password</label><input type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} /></div>}
          <div><label className="label">Role</label><select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} disabled={modal.mode === 'edit' && modal.user?._id === me._id}>{ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}</select>{modal.mode === 'edit' && modal.user?._id === me._id && <p className="text-xs text-gray-400 mt-1">You cannot change your own role</p>}</div>
          <div><label className="label">Department</label><input className="input" placeholder="e.g. OCS, CSE Core..." value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModal({ open: false })} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={resetModal.open} onClose={() => setResetModal({ open: false })} title="Reset Password" size="sm">
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div><label className="label">New Password</label><input type="password" className="input" minLength={6} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min. 6 characters" /></div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setResetModal({ open: false })} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Resetting...' : 'Reset Password'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ManageUsers
