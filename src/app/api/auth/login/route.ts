import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { estudiantes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { generateToken, setAuthCookie } from '@/lib/auth/jwt';

// Forzar renderizado dinámico (usa cookies)
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { codigo, password } = await request.json();
    
    // Buscar estudiante por código
    const [estudiante] = await db
      .select()
      .from(estudiantes)
      .where(eq(estudiantes.codigo, codigo))
      .limit(1);
    
    if (!estudiante) {
      return NextResponse.json(
        { error: 'Código o contraseña incorrectos' },
        { status: 401 }
      );
    }
    
    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, estudiante.password);
    
    if (!passwordValida) {
      return NextResponse.json(
        { error: 'Código o contraseña incorrectos' },
        { status: 401 }
      );
    }
    
    if (!estudiante.activo) {
      return NextResponse.json(
        { error: 'Tu cuenta está inactiva. Contacta al administrador.' },
        { status: 403 }
      );
    }
    
    // Generar JWT token
    const token = generateToken({
      id: estudiante.id,
      codigo: estudiante.codigo,
      nombre: estudiante.nombre,
      apellido: estudiante.apellido,
      carnet: estudiante.carnet,
      rol: estudiante.rol as 'ADMIN' | 'USUARIO',
    });
    
    // Establecer cookie httpOnly
    await setAuthCookie(token);
    
    // Login exitoso - devolver usuario sin password
    const { password: _, ...userSinPassword } = estudiante;
    
    return NextResponse.json({
      message: 'Login exitoso',
      user: userSinPassword,
    });
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
