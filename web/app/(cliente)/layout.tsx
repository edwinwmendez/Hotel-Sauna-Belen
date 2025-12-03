'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/components/providers/client-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LogOut, User, Calendar, Home } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

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

  const navItems = [
    { href: '/mi-cuenta', label: 'Mi Cuenta', icon: Home },
    { href: '/mis-reservas', label: 'Mis Reservas', icon: Calendar },
    { href: '/perfil', label: 'Mi Perfil', icon: User },
  ]

  const isActive = (href: string) => {
    if (href === '/mi-cuenta') {
      return pathname === '/mi-cuenta'
    }
    return pathname?.startsWith(href)
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Barra de navegación del cliente */}
        <div className="border-b bg-white shadow-sm">
          <div className="container py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              {/* Navegación */}
              <nav className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap',
                        active
                          ? 'bg-navy text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-navy'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{item.label}</span>
                      <span className="sm:hidden">{item.label.split(' ')[0]}</span>
                    </Link>
                  )
                })}
              </nav>

              {/* Usuario y Logout */}
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-xs sm:text-sm text-gray-600 truncate max-w-[150px] sm:max-w-none">
                  {user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    await signOut()
                    router.push('/')
                  }}
                  className="flex-shrink-0"
                >
                  <LogOut className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Cerrar Sesión</span>
                  <span className="sm:hidden">Salir</span>
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

