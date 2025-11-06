import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { estudiantes } from '@/lib/db/schema';
import bcrypt from 'bcryptjs';
import { withAdminAuth } from '@/lib/auth/middleware';

// Solo ADMIN puede registrar nuevos usuarios
export const POST = withAdminAuth(async (request: NextRequest, user) => {
  try {
    const { codigo, nombre, apellido, carnet, password } = await request.json();
    
    // Validar campos
    if (!codigo || !nombre || !apellido || !carnet || !password) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }
    
    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear estudiante
    const [nuevoEstudiante] = await db
      .insert(estudiantes)
      .values({
        codigo,
        nombre,
        apellido,
        carnet,
        password: hashedPassword,
        rol: 'USUARIO', // Por defecto usuario normal
        activo: true,
      })
      .returning();
    
    // Remover password de la respuesta
    const { password: _, ...userSinPassword } = nuevoEstudiante;
    
    return NextResponse.json({
      message: 'Registro exitoso',
      user: userSinPassword,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error en registro:', error);
    
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'El código o carnet ya está registrado' },
        { status: 409 }
      );
    }
    
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
});
