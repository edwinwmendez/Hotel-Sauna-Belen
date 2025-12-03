'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface HowItWorksProps {
  steps: string[]
  title?: string
  className?: string
}

/**
 * Componente reutilizable para mostrar instrucciones "¿Cómo funciona?"
 * Usado en páginas de recepción para mantener consistencia
 */
export function HowItWorks({ steps, title = '¿Cómo funciona?', className }: HowItWorksProps) {
  return (
    <Card className={className}>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <ul className="space-y-2 text-sm sm:text-base text-gray-600">
          {steps.map((step, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-navy font-semibold shrink-0">{index + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

