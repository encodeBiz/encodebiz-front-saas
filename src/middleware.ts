// src/middleware.ts
import { NextResponse } from 'next/server'

export function middleware() {
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/about/:path*',
}