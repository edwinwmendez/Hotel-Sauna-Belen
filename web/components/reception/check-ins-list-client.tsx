'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/reception/page-header'
import { Clock, LogIn } from 'lucide-react'
import Link from 'next/link'
import { ReservationWithDetails } from '@/lib/queries/reception'
import CheckInsFullList from '@/components/reception/check-ins-full-list'

interface CheckInsListClientProps {
  checkIns: ReservationWithDetails[]
}

export default function CheckInsListClient({ checkIns }: CheckInsListClientProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Check-ins Programados para Hoy"
        description={`${checkIns.length} reserva${checkIns.length !== 1 ? 's' : ''} programada${checkIns.length !== 1 ? 's' : ''} para check-in hoy`}
        icon={Clock}
        backHref="/admin/recepcion"
      />

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">Lista de Check-ins</CardTitle>
              <CardDescription className="text-xs sm:text-sm mt-1">
                Todas las reservas que deben hacer check-in hoy
              </CardDescription>
            </div>
            <Link href="/admin/recepcion/check-in">
              <Button size="sm" className="text-xs sm:text-sm">
                <LogIn className="h-4 w-4 mr-2" />
                Hacer Check-in
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <CheckInsFullList checkIns={checkIns} />
        </CardContent>
      </Card>
    </div>
  )
}

