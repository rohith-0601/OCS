import api from './axios'

export const getProfileApi = () => api.get('/users/profile')
export const updateProfileApi = (data) => api.put('/users/profile', data)
