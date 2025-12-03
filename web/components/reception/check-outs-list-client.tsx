'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/reception/page-header'
import { LogOut } from 'lucide-react'
import Link from 'next/link'
import { ReservationWithDetails } from '@/lib/queries/reception'
import CheckOutsFullList from '@/components/reception/check-outs-full-list'

interface CheckOutsListClientProps {
  checkOuts: ReservationWithDetails[]
}

export default function CheckOutsListClient({ checkOuts }: CheckOutsListClientProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Check-outs Programados para Hoy"
        description={`${checkOuts.length} reserva${checkOuts.length !== 1 ? 's' : ''} programada${checkOuts.length !== 1 ? 's' : ''} para check-out hoy`}
        icon={LogOut}
        backHref="/admin/recepcion"
      />

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">Lista de Check-outs</CardTitle>
              <CardDescription className="text-xs sm:text-sm mt-1">
                Todas las reservas que deben hacer check-out hoy
              </CardDescription>
            </div>
            <Link href="/admin/recepcion/check-out">
              <Button size="sm" className="text-xs sm:text-sm">
                <LogOut className="h-4 w-4 mr-2" />
                Hacer Check-out
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <CheckOutsFullList checkOuts={checkOuts} />
        </CardContent>
      </Card>
    </div>
  )
}

