'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LogOut, User, Calendar } from 'lucide-react'
import { Loader2 } from 'lucide-react'

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname))
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="border-b bg-white">
          <div className="container py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <h1 className="text-xl font-bold text-navy">Mi Cuenta</h1>
                <nav className="hidden md:flex gap-4">
                  <Link
                    href="/mis-reservas"
                    className="text-sm font-medium text-gray-700 hover:text-navy transition-colors flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Mis Reservas
                  </Link>
                  <Link
                    href="/perfil"
                    className="text-sm font-medium text-gray-700 hover:text-navy transition-colors flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Mi Perfil
                  </Link>
                </nav>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 hidden md:block">{user.email}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    await signOut()
                    router.push('/')
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Salir
                </Button>
              </div>
            </div>
          </div>
        </div>
        <main>{children}</main>
      </div>
      <Footer />
    </>
  )
}

