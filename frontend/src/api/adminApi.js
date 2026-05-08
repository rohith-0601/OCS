import api from './axios'

export const getStatsApi = () => api.get('/admin/stats')
export const getUsersApi = () => api.get('/admin/users')
export const createUserApi = (data) => api.post('/admin/users', data)
export const updateUserApi = (id, data) => api.put(`/admin/users/${id}`, data)
export const resetPasswordApi = (id, data) => api.put(`/admin/users/${id}/reset-password`, data)
export const deleteUserApi = (id) => api.delete(`/admin/users/${id}`)
