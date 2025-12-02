'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/providers/client-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const redirect = searchParams.get('redirect') || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn(formData.email, formData.password, isAdmin)
      
      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success('Inicio de sesión exitoso')
      
      // Redirigir según el rol
      if (isAdmin) {
        router.push('/admin')
      } else {
        router.push(redirect)
      }
    } catch (error) {
      toast.error('Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6 sm:py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center p-4 sm:p-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-navy">Iniciar Sesión</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Accede a tu cuenta para gestionar tus reservas
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isAdmin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
              />
              <label htmlFor="isAdmin" className="text-sm text-gray-700">
                Soy administrador
              </label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>

          <div className="mt-4 sm:mt-6 space-y-2 text-center text-xs sm:text-sm">
            <p className="text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link href="/registro" className="text-navy hover:underline font-medium">
                Regístrate aquí
              </Link>
            </p>
            <p>
              <Link href="/recuperar" className="text-navy hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </p>
          </div>

          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-cream rounded-lg">
            <p className="text-xs text-gray-600 mb-2 font-semibold">Credenciales de prueba:</p>
            <p className="text-xs text-gray-600">
              <strong>Cliente:</strong> Cualquier email/password
            </p>
            <p className="text-xs text-gray-600">
              <strong>Admin:</strong> admin@hotelsaunabelen.com / cualquier password
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}

