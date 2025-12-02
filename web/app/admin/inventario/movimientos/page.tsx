'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, ArrowDown, ArrowUp, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

// Mock de movimientos
const MOCK_MOVEMENTS = [
  {
    id: '1',
    product_name: 'Jabón tocador 30g',
    movement_type: 'entrada' as const,
    quantity: 50,
    previous_stock: 15,
    new_stock: 65,
    reason: 'compra',
    created_at: new Date().toISOString(),
    created_by: 'Admin',
  },
  {
    id: '2',
    product_name: 'Toalla de baño grande',
    movement_type: 'salida' as const,
    quantity: 4,
    previous_stock: 12,
    new_stock: 8,
    reason: 'uso_habitacion',
    room_name: 'Suite King',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    created_by: 'Admin',
  },
  {
    id: '3',
    product_name: 'Desinfectante multiusos',
    movement_type: 'ajuste' as const,
    quantity: 3,
    previous_stock: 5,
    new_stock: 3,
    reason: 'ajuste_inventario',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: 'Admin',
  },
]

export default function MovimientosPage() {
  const [movements, setMovements] = useState(MOCK_MOVEMENTS)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredMovements = movements.filter((movement) =>
    movement.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'entrada':
        return <ArrowUp className="h-4 w-4 text-green-600" />
      case 'salida':
        return <ArrowDown className="h-4 w-4 text-red-600" />
      case 'ajuste':
        return <RotateCcw className="h-4 w-4 text-blue-600" />
      default:
        return null
    }
  }

  const getMovementColor = (type: string) => {
    switch (type) {
      case 'entrada':
        return 'bg-green-100 text-green-800'
      case 'salida':
        return 'bg-red-100 text-red-800'
      case 'ajuste':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      compra: 'Compra',
      uso_habitacion: 'Uso en habitación',
      merma: 'Merma',
      ajuste_inventario: 'Ajuste de inventario',
      devolucion: 'Devolución',
    }
    return labels[reason] || reason
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy mb-2">Historial de Movimientos</h1>
          <p className="text-sm sm:text-base text-gray-600">Registro completo de entradas, salidas y ajustes</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/inventario/movimientos/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Registrar Movimiento
          </Link>
        </Button>
      </div>

      {/* Búsqueda */}
      <Card>
        <CardContent className="p-4 sm:p-6 pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Movimientos */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Movimientos ({filteredMovements.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {filteredMovements.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-sm sm:text-base text-gray-500">No se encontraron movimientos</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredMovements.map((movement) => (
                <div
                  key={movement.id}
                  className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getMovementIcon(movement.movement_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-semibold text-gray-900">{movement.product_name}</p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {getReasonLabel(movement.reason)}
                          {movement.room_name && ` - ${movement.room_name}`}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 w-fit ${getMovementColor(
                          movement.movement_type
                        )}`}
                      >
                        {movement.movement_type === 'entrada'
                          ? 'Entrada'
                          : movement.movement_type === 'salida'
                          ? 'Salida'
                          : 'Ajuste'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div>
                        <p className="text-gray-600">Cantidad</p>
                        <p className="font-semibold">{movement.quantity}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Stock anterior</p>
                        <p className="font-semibold">{movement.previous_stock}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Stock nuevo</p>
                        <p className="font-semibold">{movement.new_stock}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatDate(movement.created_at)} por {movement.created_by}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

