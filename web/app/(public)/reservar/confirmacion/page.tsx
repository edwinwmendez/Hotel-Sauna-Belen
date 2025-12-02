import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle, Home, Mail } from 'lucide-react'
import { HOTEL_INFO } from '@/lib/constants'
import { CopyButton } from '@/components/booking/copy-button'

interface PageProps {
  searchParams: Promise<{ code?: string }>
}

async function ConfirmationContent({ code }: { code: string }) {
  return (
    <div className="py-8 sm:py-12 bg-gray-50 min-h-screen">
      <div className="container max-w-2xl px-4">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 mb-3 sm:mb-4">
            <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-green-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy mb-3 sm:mb-4">¡Reserva confirmada!</h1>
          <p className="text-base sm:text-lg text-gray-700">
            Gracias por elegir Hotel Sauna Belén. Tu reserva ha sido registrada exitosamente.
          </p>
        </div>

        <Card className="mb-4 sm:mb-6">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Tu código de reserva es:</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-cream p-3 sm:p-4 rounded-lg">
              <code className="text-xl sm:text-2xl font-bold text-navy break-all">{code}</code>
              <CopyButton text={code} />
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4">
              Guarda este código, lo necesitarás al momento del check-in.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-4 sm:mb-6">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Información importante</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 space-y-2 sm:space-y-3 text-gray-700">
            <div className="flex items-start gap-2 sm:gap-3">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm sm:text-base">Confirmación por email</p>
                <p className="text-xs sm:text-sm text-gray-600">
                  Hemos enviado los detalles de tu reserva a tu correo electrónico.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm sm:text-base">Check-in</p>
                <p className="text-xs sm:text-sm text-gray-600">
                  Desde las 14:00 horas. Presenta tu documento de identidad al llegar.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm sm:text-base">Check-out</p>
                <p className="text-xs sm:text-sm text-gray-600">
                  Hasta las 12:00 horas del mediodía.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-navy text-white mb-4 sm:mb-6">
          <CardContent className="p-4 sm:p-6 pt-6">
            <div className="text-center space-y-3 sm:space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold">¿Preguntas?</h3>
              <p className="text-sm sm:text-base text-gray-200">
                Contáctanos y estaremos encantados de ayudarte.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <a
                  href={`tel:${HOTEL_INFO.phone}`}
                  className="inline-flex items-center justify-center rounded-md bg-gold px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium text-navy hover:bg-gold-light transition-colors w-full sm:w-auto"
                >
                  {HOTEL_INFO.phone}
                </a>
                <a
                  href={`https://wa.me/51${HOTEL_INFO.phone.replace(/-/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md border border-gold px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium text-white hover:bg-gold hover:text-navy transition-colors w-full sm:w-auto"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Volver al inicio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default async function ConfirmationPage({ searchParams }: PageProps) {
  const params = await searchParams
  const code = params.code

  if (!code) {
    return (
      <div className="py-12 bg-gray-50 min-h-screen">
        <div className="container max-w-2xl text-center">
          <h1 className="text-2xl font-bold text-navy mb-4">Código de reserva no encontrado</h1>
          <p className="text-gray-600 mb-6">
            No se encontró un código de reserva válido.
          </p>
          <Button asChild>
            <Link href="/reservar">Hacer una nueva reserva</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Suspense fallback={
      <div className="py-12 bg-gray-50 min-h-screen">
        <div className="container max-w-2xl text-center">
          <p className="text-gray-600">Cargando confirmación...</p>
        </div>
      </div>
    }>
      <ConfirmationContent code={code} />
    </Suspense>
  )
}

