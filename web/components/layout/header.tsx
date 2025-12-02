'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/client-provider'
import { Button } from '@/components/ui/button'
import { Menu, User, LogOut, X } from 'lucide-react'

export function Header() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 md:h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
          <span className="text-lg md:text-xl font-bold text-navy">Hotel Sauna Belén</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Inicio
          </Link>
          <Link
            href="/habitaciones"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Habitaciones
          </Link>
          <Link
            href="/sauna"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Sauna
          </Link>
          <Link
            href="/contacto"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Contacto
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <>
              {user.role === 'admin' ? (
                <Button asChild variant="outline" size="sm" className="hidden md:flex">
                  <Link href="/admin">Admin</Link>
                </Button>
              ) : (
                <Button asChild variant="outline" size="sm" className="hidden md:flex">
                  <Link href="/mis-reservas">
                    <User className="h-4 w-4 mr-2" />
                    Mi Cuenta
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="hidden md:flex">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden md:flex">
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
              <Button asChild variant="default" size="sm" className="hidden md:flex">
                <Link href="/reservar">Reservar</Link>
              </Button>
            </>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container py-4 space-y-3">
            <Link
              href="/"
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="/habitaciones"
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Habitaciones
            </Link>
            <Link
              href="/sauna"
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sauna
            </Link>
            <Link
              href="/contacto"
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contacto
            </Link>
            <div className="pt-4 border-t space-y-3">
              {user ? (
                <>
                  {user.role === 'admin' ? (
                    <Button asChild variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                      <Link href="/admin">Admin</Link>
                    </Button>
                  ) : (
                    <Button asChild variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                      <Link href="/mis-reservas">
                        <User className="h-4 w-4 mr-2" />
                        Mi Cuenta
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" className="w-full" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    <Link href="/login">Iniciar Sesión</Link>
                  </Button>
                  <Button asChild variant="default" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    <Link href="/reservar">Reservar</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

