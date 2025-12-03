'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Save } from 'lucide-react'
import { PageHeader } from '@/components/admin/page-header'
import Link from 'next/link'
import { toast } from 'sonner'

// Mock de categorías
const MOCK_CATEGORIES = [
  { id: '1', name: 'Amenidades' },
  { id: '2', name: 'Blancos' },
  { id: '3', name: 'Limpieza' },
  { id: '4', name: 'Papelería' },
  { id: '5', name: 'Sauna' },
  { id: '6', name: 'Mantenimiento' },
]

// Mock de producto
const getMockProduct = (id: string) => ({
  id,
  name: 'Jabón tocador 30g',
  category_id: '1',
  current_stock: 15,
  min_stock: 20,
  unit: 'unidad',
  cost_per_unit: 0.80,
  supplier: 'Proveedor A',
  supplier_contact: 'proveedor-a@example.com',
  is_active: true,
  description: 'Jabón de tocador de 30g, ideal para habitaciones',
})

export default function EditarProductoPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [product, setProduct] = useState(getMockProduct(id))
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // TODO: Implementar actualización real
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success('Producto actualizado correctamente')
    setLoading(false)
    router.push(`/admin/inventario/productos/${id}`)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Editar Producto"
        description={product.name}
        backHref={`/admin/inventario/productos/${id}`}
      />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Información Básica */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                  Nombre *
                </label>
                <Input
                  value={product.name}
                  onChange={(e) => setProduct({ ...product, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                  Categoría *
                </label>
                <Select
                  value={product.category_id}
                  onChange={(e) => setProduct({ ...product, category_id: e.target.value })}
                  required
                >
                  {MOCK_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                  Descripción
                </label>
                <textarea
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={product.description || ''}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  placeholder="Descripción del producto..."
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                  Unidad de medida *
                </label>
                <Input
                  value={product.unit}
                  onChange={(e) => setProduct({ ...product, unit: e.target.value })}
                  placeholder="Ej: unidad, litro, kg"
                  required
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                  Estado *
                </label>
                <Select
                  value={product.is_active ? 'active' : 'inactive'}
                  onChange={(e) => setProduct({ ...product, is_active: e.target.value === 'active' })}
                  required
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Stock y Costos */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Stock y Costos</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                  Stock actual *
                </label>
                <Input
                  type="number"
                  min="0"
                  value={product.current_stock}
                  onChange={(e) => setProduct({ ...product, current_stock: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                  Stock mínimo *
                </label>
                <Input
                  type="number"
                  min="0"
                  value={product.min_stock}
                  onChange={(e) => setProduct({ ...product, min_stock: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                  Costo unitario (S/) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={product.cost_per_unit}
                  onChange={(e) => setProduct({ ...product, cost_per_unit: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                  Proveedor *
                </label>
                <Input
                  value={product.supplier}
                  onChange={(e) => setProduct({ ...product, supplier: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                  Contacto del proveedor
                </label>
                <Input
                  type="email"
                  value={product.supplier_contact || ''}
                  onChange={(e) => setProduct({ ...product, supplier_contact: e.target.value })}
                  placeholder="email@proveedor.com"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
          <Button type="button" variant="outline" asChild className="w-full sm:w-auto">
            <Link href={`/admin/inventario/productos/${id}`}>Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}

