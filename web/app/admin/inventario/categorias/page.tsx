'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Package, Edit, FolderTree } from 'lucide-react'
import { PageHeader } from '@/components/admin/page-header'
import Link from 'next/link'

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
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Categorías de Inventario"
        description="Organiza tus productos por categorías"
        icon={FolderTree}
        backHref="/admin/inventario"
      >
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/inventario/categorias/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Categoría
          </Link>
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-gold" />
                {category.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">{category.description}</p>
              <p className="text-xs text-gray-500 mb-3 sm:mb-4">
                {category.productCount} {category.productCount === 1 ? 'producto' : 'productos'}
              </p>
              <Button asChild variant="outline" className="w-full" size="sm">
                <Link href={`/admin/inventario/categorias/${category.id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Ver / Editar
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

