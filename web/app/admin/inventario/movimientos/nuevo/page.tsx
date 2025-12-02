'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

// Mock de productos
const MOCK_PRODUCTS = [
  { id: '1', name: 'Jabón tocador 30g' },
  { id: '2', name: 'Toalla de baño grande' },
  { id: '3', name: 'Desinfectante multiusos' },
]

export default function NuevoMovimientoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    productId: '',
    movementType: 'entrada' as 'entrada' | 'salida' | 'ajuste',
    quantity: '',
    reason: 'compra',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Mock: Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success('Movimiento registrado correctamente')
    router.push('/admin/inventario/movimientos')
    setLoading(false)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <Button asChild variant="ghost" size="sm" className="w-full sm:w-auto">
          <Link href="/admin/inventario/movimientos">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy mb-2">Registrar Movimiento</h1>
          <p className="text-sm sm:text-base text-gray-600">Registra una entrada, salida o ajuste de inventario</p>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Nuevo Movimiento</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Completa los datos para registrar el movimiento de inventario
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <label htmlFor="productId" className="text-sm font-medium text-gray-700">
                Producto *
              </label>
              <select
                id="productId"
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="">Selecciona un producto</option>
                {MOCK_PRODUCTS.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="movementType" className="text-sm font-medium text-gray-700">
                Tipo de Movimiento *
              </label>
              <select
                id="movementType"
                value={formData.movementType}
                onChange={(e) => setFormData({ ...formData, movementType: e.target.value as 'entrada' | 'salida' | 'ajuste' })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="entrada">Entrada (Compra/Ingreso)</option>
                <option value="salida">Salida (Consumo/Uso)</option>
                <option value="ajuste">Ajuste de Inventario</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                Cantidad *
              </label>
              <Input
                id="quantity"
                type="number"
                min="0.01"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium text-gray-700">
                Razón
              </label>
              <select
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="compra">Compra</option>
                <option value="uso_habitacion">Uso en habitación</option>
                <option value="merma">Merma</option>
                <option value="ajuste_inventario">Ajuste de inventario</option>
                <option value="devolucion">Devolución</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium text-gray-700">
                Notas
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Notas adicionales sobre el movimiento..."
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-3 sm:pt-4">
              <Button type="button" variant="outline" asChild className="w-full sm:w-auto order-2 sm:order-1">
                <Link href="/admin/inventario/movimientos">Cancelar</Link>
              </Button>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto order-1 sm:order-2">
                {loading ? (
                  'Guardando...'
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Registrar Movimiento
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

