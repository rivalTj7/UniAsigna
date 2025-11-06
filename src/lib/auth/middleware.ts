import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, JWTPayload } from './jwt';

type RouteContext = { params: any };

/**
 * Middleware para proteger rutas API
 * Verifica que el usuario esté autenticado y opcionalmente valida roles
 */
export function withAuth(
  handler: (req: NextRequest, user: JWTPayload) => Promise<NextResponse>,
  options?: {
    roles?: ('ADMIN' | 'USUARIO')[];
  }
) {
  return async (req: NextRequest, context?: RouteContext) => {
    try {
      // Obtener usuario actual desde el token JWT
      const user = await getCurrentUser();

      if (!user) {
        return NextResponse.json(
          { error: 'No autenticado. Por favor inicia sesión.' },
          { status: 401 }
        );
      }

      // Verificar roles si se especificaron
      if (options?.roles && !options.roles.includes(user.rol)) {
        return NextResponse.json(
          { error: 'No tienes permisos para acceder a este recurso.' },
          { status: 403 }
        );
      }

      // Usuario autenticado y con permisos correctos
      return handler(req, user);
    } catch (error) {
      console.error('Error en middleware de autenticación:', error);
      return NextResponse.json(
        { error: 'Error de autenticación' },
        { status: 500 }
      );
    }
  };
}

/**
 * Middleware que solo permite ADMIN
 */
export function withAdminAuth(
  handler: (req: NextRequest, user: JWTPayload) => Promise<NextResponse>
) {
  return withAuth(handler, { roles: ['ADMIN'] });
}

/**
 * Middleware que permite tanto ADMIN como USUARIO
 */
export function withUserAuth(
  handler: (req: NextRequest, user: JWTPayload) => Promise<NextResponse>
) {
  return withAuth(handler, { roles: ['ADMIN', 'USUARIO'] });
}
