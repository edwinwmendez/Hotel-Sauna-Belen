'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/components/providers/client-provider'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Calendar, 
  Bed, 
  Package, 
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  List,
  ShoppingCart,
  TrendingUp,
  FolderTree,
  BarChart,
  Users,
  LogIn,
  UserPlus,
  LogOut as LogOutIcon,
  CalendarPlus
} from 'lucide-react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  subItems?: Array<{
    href: string
    label: string
    icon: React.ComponentType<{ className?: string }>
  }>
}

const navItems: NavItem[] = [
  { 
    href: '/admin', 
    label: 'Dashboard', 
    icon: LayoutDashboard 
  },
  { 
    href: '/admin/reservas', 
    label: 'Reservas', 
    icon: Calendar,
    subItems: [
      { href: '/admin/reservas', label: 'Lista de Reservas', icon: List },
      { href: '/admin/calendario', label: 'Calendario', icon: Calendar },
    ]
  },
  { 
    href: '/admin/habitaciones', 
    label: 'Habitaciones', 
    icon: Bed 
  },
  { 
    href: '/admin/inventario', 
    label: 'Inventario', 
    icon: Package,
    subItems: [
      { href: '/admin/inventario', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/inventario/productos', label: 'Productos', icon: ShoppingCart },
      { href: '/admin/inventario/movimientos', label: 'Movimientos', icon: TrendingUp },
      { href: '/admin/inventario/categorias', label: 'Categorías', icon: FolderTree },
      { href: '/admin/inventario/reportes', label: 'Reportes', icon: BarChart },
    ]
  },
  { 
    href: '/admin/recepcion', 
    label: 'Recepción', 
    icon: Users,
    subItems: [
      { href: '/admin/recepcion', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/recepcion/check-in', label: 'Check-in', icon: LogIn },
      { href: '/admin/recepcion/walk-in', label: 'Walk-in', icon: UserPlus },
      { href: '/admin/recepcion/extender-estancia', label: 'Extender Estancia', icon: CalendarPlus },
      { href: '/admin/recepcion/check-out', label: 'Check-out', icon: LogOutIcon },
    ]
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Determinar qué módulos deben estar expandidos basado en la ruta actual
  const getExpandedModules = () => {
    const expanded: Record<string, boolean> = {}
    navItems.forEach((item) => {
      if (item.subItems) {
        // Expandir si la ruta actual coincide con el módulo, sus subitems, o rutas relacionadas
        const isModuleActive = 
          pathname === item.href || 
          pathname.startsWith(item.href + '/') ||
          item.subItems.some(subItem => pathname === subItem.href || pathname.startsWith(subItem.href + '/'))
        expanded[item.href] = isModuleActive
      }
    })
    return expanded
  }
  
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(getExpandedModules)

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login?redirect=' + encodeURIComponent(pathname))
    }
    // Actualizar módulos expandidos cuando cambia la ruta
    setExpandedModules(getExpandedModules())
  }, [user, loading, router, pathname])

  const toggleModule = (href: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [href]: !prev[href],
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link href="/admin" className="flex items-center gap-2 text-lg sm:text-xl font-bold text-navy">
              {/* Logo Admin - Opcional: puedes agregar un logo aquí también */}
              <span className="hidden sm:inline">Hotel Sauna Belén - Admin</span>
              <span className="sm:hidden">Admin</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm text-gray-600 hidden md:block truncate max-w-[200px]">{user.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await signOut()
                router.push('/')
              }}
              className="text-xs sm:text-sm"
            >
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed md:static inset-y-0 left-0 z-30
            w-64 bg-white border-r
            transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            pt-14 sm:pt-16 md:pt-0
          `}
        >
          <nav className="p-3 sm:p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const hasSubItems = item.subItems && item.subItems.length > 0
              const isModuleActive = 
                pathname === item.href || 
                (hasSubItems && item.subItems && (
                  pathname.startsWith(item.href + '/') ||
                  item.subItems.some(subItem => pathname === subItem.href || pathname.startsWith(subItem.href + '/'))
                ))
              const isExpanded = expandedModules[item.href] ?? false
              
              return (
                <div key={item.href}>
                  {hasSubItems ? (
                    <>
                      <button
                        onClick={() => toggleModule(item.href)}
                        className={cn(
                          'w-full flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base',
                          isModuleActive
                            ? 'bg-navy text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        )}
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 flex-shrink-0" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="ml-4 sm:ml-6 mt-1 space-y-1 border-l-2 border-gray-200 pl-3 sm:pl-4">
                          {item.subItems?.map((subItem) => {
                            const SubIcon = subItem.icon
                            const isSubActive = pathname === subItem.href
                            
                            return (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                  'flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm',
                                  isSubActive
                                    ? 'bg-gold text-navy font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                )}
                              >
                                <SubIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span>{subItem.label}</span>
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base',
                        isModuleActive
                          ? 'bg-navy text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      )}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )}
                </div>
              )
            })}
          </nav>
        </aside>

        {/* Overlay para mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 w-full overflow-x-hidden">{children}</main>
      </div>
    </div>
  )
}

