import { Link } from 'react-router-dom'

const cards = [
  { to: '/admin/users', title: 'Manage Users', desc: 'Create, edit, activate/deactivate user accounts and roles', color: 'bg-blue-500',
    icon: <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" /></svg> },
  { to: '/admin/rooms', title: 'Manage Rooms', desc: 'Add, edit, or disable rooms and blocks across IITH', color: 'bg-green-500',
    icon: <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" /></svg> },
  { to: '/admin/bookings', title: 'All Bookings', desc: 'View, filter, and cancel all bookings across all users', color: 'bg-purple-500',
    icon: <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" /></svg> },
]

const AdminDashboard = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
      <p className="text-sm text-gray-500 mt-1">Manage users, rooms, and bookings for OCS IITH</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {cards.map((c) => (
        <Link key={c.to} to={c.to} className="card p-6 hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col gap-4">
          <div className={`w-12 h-12 ${c.color} rounded-xl flex items-center justify-center`}>{c.icon}</div>
          <div>
            <h2 className="font-semibold text-gray-900">{c.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{c.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  </div>
)

export default AdminDashboard
