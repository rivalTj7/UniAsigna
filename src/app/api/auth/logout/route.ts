import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth/jwt';

// Forzar renderizado dinámico (usa cookies)
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await clearAuthCookie();
    
    return NextResponse.json({ 
      success: true,
      message: 'Sesión cerrada exitosamente' 
    });
  } catch (error) {
    console.error('Error en logout:', error);
    return NextResponse.json(
      { error: 'Error al cerrar sesión' },
      { status: 500 }
    );
  }
}
