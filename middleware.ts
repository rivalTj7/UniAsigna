import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/login', '/registro'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Si está en una ruta pública, permitir acceso
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }
  
  // Si está en una ruta de API, permitir (las APIs manejan su propia auth)
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  
  // Si está en archivos estáticos, permitir
  if (pathname.startsWith('/_next') || pathname.startsWith('/logo') || pathname.startsWith('/escudo')) {
    return NextResponse.next();
  }
  
  // Para cualquier otra ruta, verificar si hay sesión
  // Como estamos usando localStorage en el cliente, aquí solo redirigimos
  // La verificación real se hace en el cliente
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
