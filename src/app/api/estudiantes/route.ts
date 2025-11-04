import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { estudiantes, type NuevoEstudiante } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET - Obtener todos los estudiantes
export async function GET() {
  try {
    const todosEstudiantes = await db.select().from(estudiantes).orderBy(estudiantes.apellido);
    return NextResponse.json(todosEstudiantes);
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    return NextResponse.json({ error: 'Error al obtener estudiantes' }, { status: 500 });
  }
}

// POST - Crear nuevo estudiante
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar campos requeridos
    if (!body.codigo || !body.nombre || !body.apellido || !body.carnet) {
      return NextResponse.json(
        { error: 'Código, nombre, apellido y carnet son requeridos' },
        { status: 400 }
      );
    }

    const nuevoEstudiante: NuevoEstudiante = {
      codigo: body.codigo,
      nombre: body.nombre,
      apellido: body.apellido,
      carnet: body.carnet,
      rol: body.rol || 'USUARIO',
      activo: body.activo !== undefined ? body.activo : true,
    };

    const [estudianteCreado] = await db.insert(estudiantes).values(nuevoEstudiante).returning();
    
    return NextResponse.json(estudianteCreado, { status: 201 });
  } catch (error: any) {
    console.error('Error al crear estudiante:', error);
    
    // Manejar errores de duplicados
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'El código o carnet ya existe' },
        { status: 409 }
      );
    }
    
    return NextResponse.json({ error: 'Error al crear estudiante' }, { status: 500 });
  }
}
