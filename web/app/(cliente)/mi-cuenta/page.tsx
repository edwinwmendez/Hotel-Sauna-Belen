'use client'

import { useAuth } from '@/components/providers/client-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Calendar, User, CreditCard, ArrowRight } from 'lucide-react'

export default function MiCuentaPage() {
  const { user } = useAuth()

  return (
    <div className="py-6 sm:py-8 md:py-12">
      <div className="container px-4 max-w-6xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy mb-2">
            Bienvenido, {user?.name || 'Usuario'}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Gestiona tus reservas y tu información personal desde aquí
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Mis Reservas */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link href="/mis-reservas">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 sm:p-3 bg-gold/10 rounded-lg">
                      <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-gold" />
                    </div>
                    <div>
                      <CardTitle className="text-lg sm:text-xl">Mis Reservas</CardTitle>
                      <CardDescription className="text-sm sm:text-base">
                        Ver y gestionar todas tus reservas
                      </CardDescription>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gold transition-colors" />
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-sm text-gray-600">
                  Revisa el estado de tus reservas, fechas, detalles y más
                </p>
              </CardContent>
            </Link>
          </Card>

          {/* Mi Perfil */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link href="/perfil">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 sm:p-3 bg-navy/10 rounded-lg">
                      <User className="h-5 w-5 sm:h-6 sm:w-6 text-navy" />
                    </div>
                    <div>
                      <CardTitle className="text-lg sm:text-xl">Mi Perfil</CardTitle>
                      <CardDescription className="text-sm sm:text-base">
                        Actualiza tu información personal
                      </CardDescription>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gold transition-colors" />
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-sm text-gray-600">
                  Gestiona tus datos de contacto y preferencias
                </p>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Acciones Rápidas */}
        <div className="mt-6 sm:mt-8">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button asChild variant="default" className="w-full sm:w-auto">
                  <Link href="/reservar">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Hacer una Nueva Reserva
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href="/habitaciones">
                    Ver Habitaciones Disponibles
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

