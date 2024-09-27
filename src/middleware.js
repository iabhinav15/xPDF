import { NextResponse } from 'next/server'

// This middleware will run for every request
export function middleware(request) {

  const path = request.nextUrl.pathname

  const isPublicPath = path === '/login' || path === '/register';

  const token = request.cookies.get('token')?.value || '';

  if(isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }
}

// Path: src/config.js
export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/allpdf',
  ]
}