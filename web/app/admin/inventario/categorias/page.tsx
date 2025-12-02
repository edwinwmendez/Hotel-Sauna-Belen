'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Package } from 'lucide-react'

// Mock de categorías
const MOCK_CATEGORIES = [
  { id: '1', name: 'Amenidades', description: 'Productos de tocador para huéspedes', icon: 'Package', productCount: 5 },
  { id: '2', name: 'Blancos', description: 'Sábanas, toallas y ropa de cama', icon: 'Package', productCount: 4 },
  { id: '3', name: 'Limpieza', description: 'Productos de limpieza y desinfección', icon: 'Package', productCount: 3 },
  { id: '4', name: 'Papelería', description: 'Papel higiénico, pañuelos, servilletas', icon: 'Package', productCount: 2 },
  { id: '5', name: 'Sauna', description: 'Insumos específicos para el sauna', icon: 'Package', productCount: 2 },
  { id: '6', name: 'Mantenimiento', description: 'Repuestos y artículos de mantenimiento', icon: 'Package', productCount: 1 },
]

export default function CategoriasPage() {
  const [categories, setCategories] = useState(MOCK_CATEGORIES)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Categorías de Inventario</h1>
          <p className="text-gray-600">Organiza tus productos por categorías</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Categoría
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-gold" />
                {category.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{category.description}</p>
              <p className="text-xs text-gray-500">
                {category.productCount} {category.productCount === 1 ? 'producto' : 'productos'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

