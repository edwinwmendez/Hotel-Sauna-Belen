'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, Package, ShoppingCart } from 'lucide-react'
import { PageHeader } from '@/components/admin/page-header'
import Link from 'next/link'

// Mock de categoría
const getMockCategory = (id: string) => ({
  id,
  name: 'Amenidades',
  description: 'Productos de tocador para huéspedes',
  productCount: 5,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
})

export default function CategoriaDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [category] = useState(getMockCategory(id))

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title={category.name}
        description="Categoría de inventario"
        backHref="/admin/inventario/categorias"
      >
        <Button asChild size="sm">
          <Link href={`/admin/inventario/categorias/${id}/editar`}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Link>
        </Button>
      </PageHeader>

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
              <p className="text-sm sm:text-base font-semibold">{category.name}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Descripción</p>
              <p className="text-sm sm:text-base">{category.description}</p>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t">
              <ShoppingCart className="h-5 w-5 text-gold" />
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Productos en esta categoría</p>
                <p className="text-xl sm:text-2xl font-bold text-navy">
                  {category.productCount} {category.productCount === 1 ? 'producto' : 'productos'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información del Sistema */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Información del Sistema</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 space-y-2 sm:space-y-3">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-600">Creada el:</span>
              <span className="font-semibold">{new Date(category.created_at).toLocaleDateString('es-PE')}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-600">Última actualización:</span>
              <span className="font-semibold">{new Date(category.updated_at).toLocaleDateString('es-PE')}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

