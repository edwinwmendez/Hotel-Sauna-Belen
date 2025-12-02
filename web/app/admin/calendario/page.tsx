'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from 'date-fns'
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

export default function CalendarioPage() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const isOccupied = (date: Date, roomId: string) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return MOCK_OCCUPANCY[dateStr]?.includes(roomId) || false
  }

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy mb-2">Calendario de Ocupación</h1>
        <p className="text-gray-600">Vista mensual de ocupación por habitación</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Hoy
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 text-left font-semibold text-gray-700">Habitación</th>
                  {days.map((day) => (
                    <th
                      key={day.toISOString()}
                      className={`border p-2 text-center text-xs font-semibold ${
                        isToday(day) ? 'bg-gold/20' : ''
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
                    <td className="border p-3 font-semibold text-gray-700">{room.name}</td>
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
                            className={`h-8 w-8 mx-auto rounded flex items-center justify-center ${
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

          <div className="mt-6 flex gap-6 justify-center">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-green-100 border border-green-300"></div>
              <span className="text-sm text-gray-600">Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-navy"></div>
              <span className="text-sm text-gray-600">Ocupada</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

