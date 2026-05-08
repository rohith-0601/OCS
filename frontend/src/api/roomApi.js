import api from './axios'

export const getBlocksApi = () => api.get('/rooms/blocks')
export const getRoomsApi = (params) => api.get('/rooms', { params })
export const getAvailableRoomsApi = (params) => api.get('/rooms/available', { params })
export const getRoomApi = (id) => api.get(`/rooms/${id}`)
export const createRoomApi = (data) => api.post('/rooms', data)
export const updateRoomApi = (id, data) => api.put(`/rooms/${id}`, data)
export const deleteRoomApi = (id) => api.delete(`/rooms/${id}`)
export const createBlockApi = (data) => api.post('/rooms/blocks', data)
