'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Edit, Package, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

// Mock de productos
const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Jabón tocador 30g',
    category: 'Amenidades',
    current_stock: 15,
    min_stock: 20,
    unit: 'unidad',
    cost_per_unit: 0.80,
    supplier: 'Proveedor A',
    is_active: true,
  },
  {
    id: '2',
    name: 'Toalla de baño grande',
    category: 'Blancos',
    current_stock: 8,
    min_stock: 12,
    unit: 'unidad',
    cost_per_unit: 25.00,
    supplier: 'Proveedor B',
    is_active: true,
  },
  {
    id: '3',
    name: 'Desinfectante multiusos',
    category: 'Limpieza',
    current_stock: 3,
    min_stock: 5,
    unit: 'litro',
    cost_per_unit: 12.00,
    supplier: 'Proveedor C',
    is_active: true,
  },
  {
    id: '4',
    name: 'Papel higiénico doble hoja',
    category: 'Papelería',
    current_stock: 48,
    min_stock: 24,
    unit: 'rollo',
    cost_per_unit: 1.50,
    supplier: 'Proveedor A',
    is_active: true,
  },
]

export default function ProductosPage() {
  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const isLowStock = (current: number, min: number) => current <= min

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Gestión de Productos</h1>
          <p className="text-gray-600">Administra el catálogo de productos del inventario</p>
        </div>
        <Button asChild>
          <Link href="/admin/inventario/productos/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Link>
        </Button>
      </div>

      {/* Búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const lowStock = isLowStock(product.current_stock, product.min_stock)
          
          return (
            <Card key={product.id} className={lowStock ? 'border-red-200' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{product.name}</CardTitle>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </div>
                  {lowStock && (
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Stock actual:</span>
                    <span className={`font-semibold ${lowStock ? 'text-red-600' : 'text-green-600'}`}>
                      {product.current_stock} {product.unit}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Stock mínimo:</span>
                    <span className="font-semibold">{product.min_stock} {product.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Costo unitario:</span>
                    <span className="font-semibold">{formatCurrency(product.cost_per_unit || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Proveedor:</span>
                    <span className="font-semibold">{product.supplier}</span>
                  </div>
                </div>

                {lowStock && (
                  <div className="bg-red-50 border border-red-200 rounded p-2">
                    <p className="text-xs text-red-800 font-semibold">
                      ⚠️ Stock bajo: Faltan {product.min_stock - product.current_stock} {product.unit}
                    </p>
                  </div>
                )}

                <Button asChild variant="outline" className="w-full" size="sm">
                  <Link href={`/admin/inventario/productos/${product.id}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No se encontraron productos</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

