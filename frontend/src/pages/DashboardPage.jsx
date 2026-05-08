import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getBookingsApi } from '../api/bookingApi'
import { getStatsApi } from '../api/adminApi'
import BookingCard from '../components/BookingCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { todayISO } from '../utils/helpers'

const StatCard = ({ label, value, icon, color }) => (
  <div className="card p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
    </div>
  </div>
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {isAdmin && stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Active Users" value={stats.totalUsers} color="bg-brand-100"
            icon={<svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" /></svg>} />
          <StatCard label="Available Rooms" value={stats.totalRooms} color="bg-green-100"
            icon={<svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" /></svg>} />
          <StatCard label="Today's Bookings" value={stats.todayBookings} color="bg-amber-100"
            icon={<svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
          <StatCard label="Upcoming" value={stats.upcomingBookings} color="bg-purple-100"
            icon={<svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {user?.role !== 'viewer' && (
          <Link to="/book" className="card p-5 hover:shadow-md transition-all hover:-translate-y-0.5 flex items-center gap-4 group">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center group-hover:bg-brand-700 transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Book a Room</p>
              <p className="text-xs text-gray-500">Reserve for OA, Interview, or PPT</p>
            </div>
          </Link>
        )}
        <Link to="/rooms" className="card p-5 hover:shadow-md transition-all hover:-translate-y-0.5 flex items-center gap-4 group">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center group-hover:bg-green-600 transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Browse Rooms</p>
            <p className="text-xs text-gray-500">View all rooms and availability</p>
          </div>
        </Link>
        <Link to="/my-bookings" className="card p-5 hover:shadow-md transition-all hover:-translate-y-0.5 flex items-center gap-4 group">
          <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center group-hover:bg-purple-600 transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" /></svg>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">My Bookings</p>
            <p className="text-xs text-gray-500">View and manage your bookings</p>
          </div>
        </Link>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Your Upcoming Bookings</h2>
          <Link to="/my-bookings" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View all →</Link>
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
