import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

type CookieToSet = { name: string; value: string; options?: CookieOptions }
const PUBLIC_PATHS = ['/login', '/signup', '/auth']

/**
 * (Next 16 "proxy", antes "middleware".)
 * Refresca la sesión de Supabase en cada request y protege las rutas:
 * - Sin sesión → redirige a /login (excepto rutas públicas).
 * - Con sesión en /login o /signup → redirige al inicio.
 * Si faltan las variables de entorno de Supabase, no hace nada (deja correr la app).
 */
export async function proxy(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  // Sin credenciales válidas (o con placeholders), no protege: deja correr la app.
  if (!anon || !url || !/^https?:\/\//.test(url)) return NextResponse.next()

  let res = NextResponse.next({ request: req })

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return req.cookies.getAll()
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
        res = NextResponse.next({ request: req })
        cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options))
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = req.nextUrl.pathname
  const isPublic = PUBLIC_PATHS.some((p) => path === p || path.startsWith(p + '/'))

  if (!user && !isPublic) {
    const redirect = req.nextUrl.clone()
    redirect.pathname = '/login'
    return NextResponse.redirect(redirect)
  }
  if (user && (path === '/login' || path === '/signup')) {
    const redirect = req.nextUrl.clone()
    redirect.pathname = '/'
    return NextResponse.redirect(redirect)
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
}
