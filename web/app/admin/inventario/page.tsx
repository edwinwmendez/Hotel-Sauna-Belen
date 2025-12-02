'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, AlertTriangle, TrendingUp, DollarSign, Plus } from 'lucide-react'
import Link from 'next/link'

// Mock data
const MOCK_STATS = {
  totalProducts: 25,
  lowStockCount: 5,
  movementsToday: 8,
  totalValue: 12500,
}

const MOCK_LOW_STOCK = [
  {
    id: '1',
    name: 'Jabón tocador 30g',
    current_stock: 15,
    min_stock: 20,
    category: 'Amenidades',
    alert_level: 'low' as const,
  },
  {
    id: '2',
    name: 'Toalla de baño grande',
    current_stock: 8,
    min_stock: 12,
    category: 'Blancos',
    alert_level: 'critical' as const,
  },
  {
    id: '3',
    name: 'Desinfectante multiusos',
    current_stock: 3,
    min_stock: 5,
    category: 'Limpieza',
    alert_level: 'critical' as const,
  },
]

export default function InventarioDashboard() {
  const [stats, setStats] = useState(MOCK_STATS)
  const [lowStock, setLowStock] = useState(MOCK_LOW_STOCK)

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'low':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-orange-100 text-orange-800 border-orange-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Dashboard de Inventario</h1>
          <p className="text-gray-600">Control y gestión de productos y suministros</p>
        </div>
        <Button asChild>
          <Link href="/admin/inventario/movimientos/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Registrar Movimiento
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Productos Totales</CardTitle>
            <Package className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-navy">{stats.totalProducts}</div>
            <p className="text-xs text-gray-500 mt-1">Productos activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Stock Bajo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.lowStockCount}</div>
            <p className="text-xs text-gray-500 mt-1">Requieren atención</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Movimientos Hoy</CardTitle>
            <TrendingUp className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-navy">{stats.movementsToday}</div>
            <p className="text-xs text-gray-500 mt-1">Entradas y salidas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-navy">S/ {stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Valor del inventario</p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de Stock Bajo */}
      <Card className="border-red-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Alertas de Stock Bajo
            </CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/inventario/productos">Ver Todos</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {lowStock.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              ¡Excelente! No hay productos con stock bajo
            </p>
          ) : (
            <div className="space-y-3">
              {lowStock.map((product) => (
                <div
                  key={product.id}
                  className={`p-4 rounded-lg border ${getAlertColor(product.alert_level)}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm opacity-80">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm opacity-80">Stock actual</p>
                      <p className="text-2xl font-bold">
                        {product.current_stock} / {product.min_stock}
                      </p>
                      <p className="text-xs mt-1">
                        Faltan {product.min_stock - product.current_stock} unidades
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Accesos Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/admin/inventario/productos">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-gold" />
                Gestión de Productos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Ver, crear y editar productos del inventario
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/admin/inventario/movimientos">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-gold" />
                Historial de Movimientos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Registro completo de entradas y salidas
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/admin/inventario/reportes">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-gold" />
                Reportes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Análisis y reportes de consumo
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  )
}

