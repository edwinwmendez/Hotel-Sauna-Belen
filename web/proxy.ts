// proxy.ts - Reemplaza middleware.ts en Next.js 16
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Verificar si hay configuración de Supabase
  const hasSupabaseConfig = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co' &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY !== 'your-publishable-key-here'

  // Si no hay Supabase configurado, permitir acceso (modo mock)
  if (!hasSupabaseConfig) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => 
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Proteger rutas admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', '/admin')
      return NextResponse.redirect(url)
    }
    
    const role = user.user_metadata?.role
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Proteger rutas cliente
  if (request.nextUrl.pathname.startsWith('/mis-reservas') || 
      request.nextUrl.pathname.startsWith('/perfil')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*', '/mis-reservas/:path*', '/perfil/:path*'],
}

