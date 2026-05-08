import { createContext, useContext, useState, useEffect } from 'react'
import { loginApi, getMeApi } from '../api/authApi'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('ocs_token')
    const savedUser = localStorage.getItem('ocs_user')
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
      getMeApi()
        .then((res) => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem('ocs_token')
          localStorage.removeItem('ocs_user')
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await loginApi({ email, password })
    const { token, user } = res.data
    localStorage.setItem('ocs_token', token)
    localStorage.setItem('ocs_user', JSON.stringify(user))
    setUser(user)
    return user
  }

  const logout = () => {
    localStorage.removeItem('ocs_token')
    localStorage.removeItem('ocs_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user, loading, login, logout,
      isAdmin: user?.role === 'admin',
      isCore: user?.role === 'core',
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
