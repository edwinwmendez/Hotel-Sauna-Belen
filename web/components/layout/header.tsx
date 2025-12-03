'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/components/providers/client-provider'
import { Button } from '@/components/ui/button'
import { Menu, User, LogOut, X } from 'lucide-react'

export function Header() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Determinar si estamos en el portal del cliente
  const isInClientPortal = pathname?.startsWith('/mi-cuenta') || 
                           pathname?.startsWith('/mis-reservas') || 
                           pathname?.startsWith('/perfil')

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 md:h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 md:space-x-3" onClick={() => setMobileMenuOpen(false)}>
          {/* Logo con corona dorada y estrellas */}
          <div className="relative h-10 w-auto md:h-12 flex-shrink-0">
            <Image
              src="/Logo.png"
              alt="Hotel Sauna Belén"
              width={180}
              height={48}
              className="h-10 md:h-12 w-auto object-contain"
              priority
            />
          </div>
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
                  <Link href="/mi-cuenta">
                    <User className="h-4 w-4 mr-2" />
                    Mi Cuenta
                  </Link>
                </Button>
              )}
              {/* Solo mostrar logout si NO está en el portal del cliente (el layout del cliente ya tiene su propio logout) */}
              {!isInClientPortal && (
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="hidden md:flex">
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
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
                      <Link href="/mi-cuenta">
                        <User className="h-4 w-4 mr-2" />
                        Mi Cuenta
                      </Link>
                    </Button>
                  )}
                  {/* Solo mostrar logout en mobile si NO está en el portal del cliente */}
                  {!isInClientPortal && (
                    <Button variant="ghost" className="w-full" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar Sesión
                    </Button>
                  )}
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

