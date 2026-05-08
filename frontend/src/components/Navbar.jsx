import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const navClass = ({ isActive }) =>
    `text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
      isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <span className="font-semibold text-gray-900 text-sm">OCS Room Booking</span>
              <span className="block text-xs text-gray-500 leading-tight">IIT Hyderabad</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/dashboard" className={navClass}>Dashboard</NavLink>
            <NavLink to="/rooms" className={navClass}>Rooms</NavLink>
            {user?.role !== 'viewer' && <NavLink to="/book" className={navClass}>Book Room</NavLink>}
            <NavLink to="/my-bookings" className={navClass}>My Bookings</NavLink>
            {isAdmin && <NavLink to="/admin" className={navClass}>Admin</NavLink>}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <button onClick={handleLogout} className="btn-secondary text-xs px-3 py-1.5">Logout</button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
