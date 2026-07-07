'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { api } from '@/lib/api'

interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  avatar: string | null
}

interface Subscription {
  plan: string
  status: string
  currentPeriodEnd: string | null
}

interface AuthContextType {
  user: User | null
  subscription: Subscription | null
  isAuthenticated: boolean
  loading: boolean
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>
  refetch: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    try {
      const data = await api.get<{ user: User; subscription: Subscription | null }>('/auth/profile')
      setUser(data.user)
      setSubscription(data.subscription)
      setIsAuthenticated(true)
    } catch {
      setUser(null)
      setSubscription(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // clear state regardless of error
    } finally {
      setUser(null)
      setSubscription(null)
      setIsAuthenticated(false)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        subscription,
        isAuthenticated,
        loading,
        setIsAuthenticated,
        refetch: fetchProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
