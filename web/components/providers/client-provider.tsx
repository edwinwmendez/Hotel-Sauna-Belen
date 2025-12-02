'use client'

import { useState, useEffect, createContext, useContext, type ReactNode } from 'react'
import { Toaster } from 'sonner'
import { MOCK_USER, MOCK_ADMIN } from '@/lib/supabase/mock'

type User = {
  id: string
  email: string
  role: 'customer' | 'admin'
  name?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string, isAdmin?: boolean) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function ClientProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('mock_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string, isAdmin = false): Promise<{ error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (isAdmin && email === 'admin@hotelsaunabelen.com') {
      const admin = { ...MOCK_ADMIN, name: 'Administrador' }
      setUser(admin)
      localStorage.setItem('mock_user', JSON.stringify(admin))
      return {}
    }
    
    if (email && password) {
      const customer = { ...MOCK_USER, email, name: email.split('@')[0] }
      setUser(customer)
      localStorage.setItem('mock_user', JSON.stringify(customer))
      return {}
    }
    
    return { error: 'Credenciales inválidas' }
  }

  const signUp = async (email: string, password: string, name: string): Promise<{ error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const customer = {
      id: `mock-user-${Date.now()}`,
      email,
      role: 'customer' as const,
      name,
    }
    
    setUser(customer)
    localStorage.setItem('mock_user', JSON.stringify(customer))
    return {}
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem('mock_user')
  }

  const value: AuthContextType = { user, loading, signIn, signOut, signUp }

  return (
    <AuthContext.Provider value={value}>
      {children}
      <Toaster position="top-right" richColors />
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a ClientProvider')
  }
  return context
}
