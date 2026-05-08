import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, DoorOpen, ClipboardList, ArrowRight } from 'lucide-react'

const cards = [
  { to: '/admin/users', title: 'Manage Users', desc: 'Create, edit, activate/deactivate user accounts and roles', color: 'bg-blue-500', icon: Users },
  { to: '/admin/rooms', title: 'Manage Rooms', desc: 'Add, edit, or disable rooms and blocks across IITH', color: 'bg-green-500', icon: DoorOpen },
  { to: '/admin/bookings', title: 'All Bookings', desc: 'View, filter, and cancel all bookings across all users', color: 'bg-purple-500', icon: ClipboardList },
]

const AdminDashboard = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
      <p className="text-sm text-gray-500 mt-1">Manage users, rooms, and bookings for OCS IITH</p>
    </motion.div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {cards.map((c, i) => (
        <motion.div key={c.to} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
          <Link to={c.to} className="card p-6 hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col gap-4 group">
            <div className={`w-12 h-12 ${c.color} rounded-xl flex items-center justify-center`}>
              <c.icon size={22} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900">{c.title}</h2>
              <p className="text-sm text-gray-500 mt-1">{c.desc}</p>
            </div>
            <div className="flex items-center gap-1 text-sm text-brand-600 font-medium">
              Open <ArrowRight size={14} />
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  </div>
)

export default AdminDashboard
