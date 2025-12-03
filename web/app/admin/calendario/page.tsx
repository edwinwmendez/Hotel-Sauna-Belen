'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { PageHeader } from '@/components/admin/page-header'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, addMonths, subMonths, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns'
import { es } from 'date-fns/locale'

// Mock de ocupación
const MOCK_OCCUPANCY: Record<string, string[]> = {
  '2025-12-15': ['1', '2'],
  '2025-12-16': ['1', '2'],
  '2025-12-20': ['3'],
  '2025-12-21': ['3'],
}

const ROOMS = [
  { id: '1', name: 'Suite King' },
  { id: '2', name: 'Matrimonial' },
  { id: '3', name: 'Simple' },
]

type ViewMode = 'month' | 'week'

export default function CalendarioPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>('week')

  const isOccupied = (date: Date, roomId: string) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return MOCK_OCCUPANCY[dateStr]?.includes(roomId) || false
  }

  const previousPeriod = () => {
    if (viewMode === 'week') {
      setCurrentDate(subWeeks(currentDate, 1))
    } else {
      setCurrentDate(subMonths(currentDate, 1))
    }
  }

  const nextPeriod = () => {
    if (viewMode === 'week') {
      setCurrentDate(addWeeks(currentDate, 1))
    } else {
      setCurrentDate(addMonths(currentDate, 1))
    }
  }

  const getDaysForView = () => {
    if (viewMode === 'week') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }) // Lunes
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
      return eachDayOfInterval({ start: weekStart, end: weekEnd })
    } else {
      const monthStart = startOfMonth(currentDate)
      const monthEnd = endOfMonth(currentDate)
      return eachDayOfInterval({ start: monthStart, end: monthEnd })
    }
  }

  const days = getDaysForView()
  const periodLabel = viewMode === 'week' 
    ? `Semana del ${format(days[0], 'd', { locale: es })} al ${format(days[days.length - 1], 'd MMMM yyyy', { locale: es })}`
    : format(currentDate, 'MMMM yyyy', { locale: es })

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        title="Calendario de Ocupación"
        description={`Vista ${viewMode === 'week' ? 'semanal' : 'mensual'} de ocupación por habitación`}
        icon={CalendarIcon}
        backHref="/admin"
      >
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('week')}
            className="text-xs md:text-sm"
          >
            Semana
          </Button>
          <Button
            variant={viewMode === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('month')}
            className="text-xs md:text-sm"
          >
            Mes
          </Button>
        </div>
      </PageHeader>

      <Card>
        <CardHeader className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <CalendarIcon className="h-4 w-4 md:h-5 md:w-5 text-gold" />
              <span className="text-sm md:text-base">{periodLabel}</span>
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={previousPeriod} className="flex-1 sm:flex-initial">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Anterior</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())} className="flex-1 sm:flex-initial text-xs md:text-sm">
                Hoy
              </Button>
              <Button variant="outline" size="sm" onClick={nextPeriod} className="flex-1 sm:flex-initial">
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Siguiente</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2 md:p-6">
          {/* Vista Desktop/Tablet - Tabla */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse min-w-full">
              <thead>
                <tr>
                  <th className="border p-3 text-left font-semibold text-gray-700 bg-gray-50 sticky left-0 z-10 min-w-[150px]">
                    Habitación
                  </th>
                  {days.map((day) => (
                    <th
                      key={day.toISOString()}
                      className={`border p-2 text-center text-xs font-semibold min-w-[80px] ${
                        isToday(day) ? 'bg-gold/20' : 'bg-gray-50'
                      }`}
                    >
                      <div>{format(day, 'd')}</div>
                      <div className="text-gray-500 font-normal">
                        {format(day, 'EEE', { locale: es })}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROOMS.map((room) => (
                  <tr key={room.id}>
                    <td className="border p-3 font-semibold text-gray-700 bg-gray-50 sticky left-0 z-10">
                      {room.name}
                    </td>
                    {days.map((day) => {
                      const occupied = isOccupied(day, room.id)
                      return (
                        <td
                          key={day.toISOString()}
                          className={`border p-2 text-center ${
                            isToday(day) ? 'bg-gold/10' : ''
                          }`}
                        >
                          <div
                            className={`h-8 w-8 mx-auto rounded flex items-center justify-center cursor-pointer transition-all hover:scale-110 ${
                              occupied
                                ? 'bg-navy text-white'
                                : 'bg-green-100 text-green-800'
                            }`}
                            title={
                              occupied
                                ? `Ocupada - ${format(day, 'dd/MM/yyyy')}`
                                : `Disponible - ${format(day, 'dd/MM/yyyy')}`
                            }
                          >
                            {occupied ? '●' : '○'}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vista Mobile - Cards por habitación */}
          <div className="md:hidden space-y-4">
            {ROOMS.map((room) => (
              <Card key={room.id} className="border">
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-base">{room.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="grid grid-cols-7 gap-1">
                    {days.map((day) => {
                      const occupied = isOccupied(day, room.id)
                      return (
                        <div
                          key={day.toISOString()}
                          className={`flex flex-col items-center p-1 rounded ${
                            isToday(day) ? 'bg-gold/10' : ''
                          }`}
                        >
                          <div className="text-xs text-gray-600 mb-1">
                            {format(day, 'EEE', { locale: es }).substring(0, 1)}
                          </div>
                          <div className="text-xs font-semibold mb-1">
                            {format(day, 'd')}
                          </div>
                          <div
                            className={`h-5 w-5 rounded flex items-center justify-center ${
                              occupied
                                ? 'bg-navy text-white'
                                : 'bg-green-100 text-green-800'
                            }`}
                            title={
                              occupied
                                ? `Ocupada - ${format(day, 'dd/MM/yyyy')}`
                                : `Disponible - ${format(day, 'dd/MM/yyyy')}`
                            }
                          >
                            {occupied ? '●' : '○'}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Leyenda */}
          <div className="mt-4 md:mt-6 flex gap-4 md:gap-6 justify-center flex-wrap">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 md:h-4 md:w-4 rounded bg-green-100 border border-green-300"></div>
              <span className="text-xs md:text-sm text-gray-600">Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 md:h-4 md:w-4 rounded bg-navy"></div>
              <span className="text-xs md:text-sm text-gray-600">Ocupada</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
