'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/client-provider'
import { Button } from '@/components/ui/button'
import { Menu, User, LogOut } from 'lucide-react'

export function Header() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-navy">Hotel Sauna Belén</span>
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

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === 'admin' ? (
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin">Admin</Link>
                </Button>
              ) : (
                <Button asChild variant="outline" size="sm">
                  <Link href="/mis-reservas">
                    <User className="h-4 w-4 mr-2" />
                    Mi Cuenta
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden md:flex">
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
              <Button asChild variant="default" className="hidden md:flex">
                <Link href="/reservar">Reservar</Link>
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}

