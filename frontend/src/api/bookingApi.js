import api from './axios'

export const createBookingApi = (data) => api.post('/bookings', data)
export const getBookingsApi = (params) => api.get('/bookings', { params })
export const getBookingApi = (id) => api.get(`/bookings/${id}`)
export const cancelBookingApi = (id, data) => api.put(`/bookings/${id}/cancel`, data)
export const getRoomScheduleApi = (roomId, date) => api.get(`/bookings/room/${roomId}/schedule`, { params: { date } })
