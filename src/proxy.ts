import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // No redirigir la propia página de mantenimiento ni otras subrutas
  if (pathname.startsWith('/tools/checking/maintenance')) return NextResponse.next()

  // Redirigir solo la raíz /tools/checking (con o sin barra) a mantenimiento
  if (pathname === '/tools/checking' || pathname === '/tools/checking/') {
    const url = request.nextUrl.clone()
    url.pathname = '/tools/checking/maintenance'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/tools/checking/:path*'],
}
