'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { ArrowLeft, Edit, Package, AlertTriangle, DollarSign, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

// Mock de producto
const getMockProduct = (id: string) => ({
  id,
  name: 'Jabón tocador 30g',
  category: 'Amenidades',
  category_id: '1',
  current_stock: 15,
  min_stock: 20,
  unit: 'unidad',
  cost_per_unit: 0.80,
  supplier: 'Proveedor A',
  supplier_contact: 'proveedor-a@example.com',
  is_active: true,
  description: 'Jabón de tocador de 30g, ideal para habitaciones',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
})

export default function ProductoDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [product] = useState(getMockProduct(id))
  const isLowStock = product.current_stock <= product.min_stock

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/inventario/productos">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-navy">{product.name}</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">{product.category}</p>
          </div>
        </div>
        <Button asChild size="sm">
          <Link href={`/admin/inventario/productos/${id}/editar`}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Link>
        </Button>
      </div>

      {/* Alerta de Stock Bajo */}
      {isLowStock && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-sm sm:text-base font-semibold text-red-800">
                  ⚠️ Stock Bajo
                </p>
                <p className="text-xs sm:text-sm text-red-700">
                  Faltan {product.min_stock - product.current_stock} {product.unit} para alcanzar el stock mínimo
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Información Principal */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Package className="h-5 w-5 text-gold" />
              Información Principal
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Nombre</p>
              <p className="text-sm sm:text-base font-semibold">{product.name}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Categoría</p>
              <p className="text-sm sm:text-base font-semibold">{product.category}</p>
            </div>
            {product.description && (
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Descripción</p>
                <p className="text-sm sm:text-base">{product.description}</p>
              </div>
            )}
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Estado</p>
              <p className="text-sm sm:text-base font-semibold">
                {product.is_active ? (
                  <span className="text-green-600">Activo</span>
                ) : (
                  <span className="text-red-600">Inactivo</span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stock y Costos */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <ShoppingCart className="h-5 w-5 text-gold" />
              Stock y Costos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Stock actual</p>
              <p className={`text-xl sm:text-2xl font-bold ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
                {product.current_stock} {product.unit}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Stock mínimo</p>
              <p className="text-sm sm:text-base font-semibold">
                {product.min_stock} {product.unit}
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t">
              <DollarSign className="h-5 w-5 text-gold" />
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Costo unitario</p>
                <p className="text-xl sm:text-2xl font-bold text-gold">
                  {formatCurrency(product.cost_per_unit)}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Valor total en stock</p>
              <p className="text-lg sm:text-xl font-bold text-navy">
                {formatCurrency(product.current_stock * product.cost_per_unit)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información del Proveedor */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Información del Proveedor</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 space-y-3">
          <div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Proveedor</p>
            <p className="text-sm sm:text-base font-semibold">{product.supplier}</p>
          </div>
          {product.supplier_contact && (
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Contacto</p>
              <p className="text-sm sm:text-base">{product.supplier_contact}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información del Sistema */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Información del Sistema</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 space-y-2 sm:space-y-3">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-gray-600">Creado el:</span>
            <span className="font-semibold">{new Date(product.created_at).toLocaleDateString('es-PE')}</span>
          </div>
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-gray-600">Última actualización:</span>
            <span className="font-semibold">{new Date(product.updated_at).toLocaleDateString('es-PE')}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

