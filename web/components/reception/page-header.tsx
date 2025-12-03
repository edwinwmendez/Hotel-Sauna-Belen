'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  icon: LucideIcon
  backHref?: string
  backLabel?: string
  children?: React.ReactNode
  className?: string
  showBackButton?: boolean
}

/**
 * Header reutilizable para páginas del módulo de recepción
 * Incluye botón "Volver" consistente en todas las páginas
 * El botón es más útil en móvil pero también visible en desktop para consistencia
 */
export function PageHeader({
  title,
  description,
  icon: Icon,
  backHref = '/admin/recepcion',
  backLabel = 'Volver',
  children,
  className,
  showBackButton = true,
}: PageHeaderProps) {
  return (
    <div className={cn('space-y-4 sm:space-y-6', className)}>
      {/* Header con botón Volver */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Botón Volver - Consistente en todas las páginas */}
          {showBackButton && (
            <Button variant="ghost" size="sm" asChild className="shrink-0">
              <Link href={backHref}>
                <ArrowLeft className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">{backLabel}</span>
              </Link>
            </Button>
          )}
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-navy flex items-center gap-2">
              <Icon className="h-6 w-6 sm:h-7 sm:w-7 shrink-0" />
              {title}
            </h1>
            {description && (
              <p className="text-sm sm:text-base text-gray-600 mt-1">{description}</p>
            )}
          </div>
        </div>
        {children && (
          <div className="flex items-center gap-2 shrink-0">{children}</div>
        )}
      </div>
    </div>
  )
}

