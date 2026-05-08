import { format, parseISO } from 'date-fns'

export const formatDate = (dateStr) => {
  try { return format(parseISO(dateStr.substring(0, 10)), 'dd MMM yyyy') }
  catch { return dateStr }
}

export const formatDateTime = (dateStr) => {
  try { return format(parseISO(dateStr), 'dd MMM yyyy, hh:mm a') }
  catch { return dateStr }
}

export const formatTime = (time) => {
  if (!time) return ''
  const [h, m] = time.split(':')
  const hour = parseInt(h)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${m} ${ampm}`
}

export const todayISO = () => new Date().toISOString().split('T')[0]

export const getRoleColor = (role) => {
  const map = {
    admin: 'bg-red-100 text-red-800',
    core: 'bg-indigo-100 text-indigo-800',
    viewer: 'bg-gray-100 text-gray-800',
  }
  return map[role] || 'bg-gray-100 text-gray-800'
}
