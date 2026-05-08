import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getBookingsApi } from '../api/bookingApi'
import { getStatsApi } from '../api/adminApi'
import BookingCard from '../components/BookingCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { todayISO } from '../utils/helpers'
import { motion } from 'framer-motion'
import { Users, DoorOpen, CalendarDays, ClipboardList, Plus, Search, ArrowRight } from 'lucide-react'

const StatCard = ({ label, value, icon: Icon, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="card p-5"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
    </div>
  </motion.div>
)

const DashboardPage = () => {
  const { user, isAdmin } = useAuth()
  const [upcomingBookings, setUpcomingBookings] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingsRes = await getBookingsApi({ status: 'confirmed' })
        const today = todayISO()
        const upcoming = bookingsRes.data.bookings
          .filter((b) => b.date.substring(0, 10) >= today)
          .slice(0, 4)
        setUpcomingBookings(upcoming)
        if (isAdmin) {
          const statsRes = await getStatsApi()
          setStats(statsRes.data.stats)
        }
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetchData()
  }, [isAdmin])

  if (loading) return <LoadingSpinner />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </motion.div>

      {isAdmin && stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Active Users" value={stats.totalUsers} color="bg-brand-600" icon={Users} delay={0.05} />
          <StatCard label="Available Rooms" value={stats.totalRooms} color="bg-green-500" icon={DoorOpen} delay={0.1} />
          <StatCard label="Today's Bookings" value={stats.todayBookings} color="bg-amber-100" icon={CalendarDays} delay={0.15} />
          <StatCard label="Upcoming" value={stats.upcomingBookings} color="bg-purple-500" icon={ClipboardList} delay={0.2} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {user?.role !== 'viewer' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Link to="/book" className="card p-5 hover:shadow-md transition-all hover:-translate-y-0.5 flex items-center gap-4 group">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center group-hover:bg-brand-700 transition-colors">
                <Plus size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">Book a Room</p>
                <p className="text-xs text-gray-500">Reserve for OA, Interview, or PPT</p>
              </div>
              <ArrowRight size={16} className="text-gray-400" />
            </Link>
          </motion.div>
        )}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Link to="/rooms" className="card p-5 hover:shadow-md transition-all hover:-translate-y-0.5 flex items-center gap-4 group">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center group-hover:bg-green-600 transition-colors">
              <Search size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">Browse Rooms</p>
              <p className="text-xs text-gray-500">View all rooms and availability</p>
            </div>
            <ArrowRight size={16} className="text-gray-400" />
          </Link>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Link to="/my-bookings" className="card p-5 hover:shadow-md transition-all hover:-translate-y-0.5 flex items-center gap-4 group">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center group-hover:bg-purple-600 transition-colors">
              <ClipboardList size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">My Bookings</p>
              <p className="text-xs text-gray-500">View and manage your bookings</p>
            </div>
            <ArrowRight size={16} className="text-gray-400" />
          </Link>
        </motion.div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Your Upcoming Bookings</h2>
          <Link to="/my-bookings" className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {upcomingBookings.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-gray-500 text-sm">No upcoming bookings.</p>
            {user?.role !== 'viewer' && <Link to="/book" className="btn-primary mt-3 inline-flex">Book a room</Link>}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomingBookings.map((b) => <BookingCard key={b._id} booking={b} />)}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
