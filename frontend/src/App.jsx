import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import RoomsPage from './pages/RoomsPage'
import BookingPage from './pages/BookingPage'
import MyBookingsPage from './pages/MyBookingsPage'
import AdminDashboard from './pages/AdminDashboard'
import ManageUsers from './pages/ManageUsers'
import ManageRooms from './pages/ManageRooms'
import AllBookings from './pages/AllBookings'

const AppLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <main>{children}</main>
  </div>
)

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
          <Route path="/rooms" element={<AppLayout><RoomsPage /></AppLayout>} />
          <Route path="/my-bookings" element={<AppLayout><MyBookingsPage /></AppLayout>} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin', 'core']} />}>
          <Route path="/book" element={<AppLayout><BookingPage /></AppLayout>} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AppLayout><AdminDashboard /></AppLayout>} />
          <Route path="/admin/users" element={<AppLayout><ManageUsers /></AppLayout>} />
          <Route path="/admin/rooms" element={<AppLayout><ManageRooms /></AppLayout>} />
          <Route path="/admin/bookings" element={<AppLayout><AllBookings /></AppLayout>} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
