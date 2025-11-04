import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { estudiantes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET - Obtener un estudiante por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const estudiante = await db.select().from(estudiantes).where(eq(estudiantes.id, id)).limit(1);
    
    if (estudiante.length === 0) {
      return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json(estudiante[0]);
  } catch (error) {
    console.error('Error al obtener estudiante:', error);
    return NextResponse.json({ error: 'Error al obtener estudiante' }, { status: 500 });
  }
}

// PUT - Actualizar un estudiante
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    
    const [estudianteActualizado] = await db
      .update(estudiantes)
      .set({
        nombre: body.nombre,
        apellido: body.apellido,
        carnet: body.carnet,
        email: body.email,
        telefono: body.telefono,
        activo: body.activo,
      })
      .where(eq(estudiantes.id, id))
      .returning();
    
    if (!estudianteActualizado) {
      return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json(estudianteActualizado);
  } catch (error: any) {
    console.error('Error al actualizar estudiante:', error);
    
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'El carnet o email ya existe' },
        { status: 409 }
      );
    }
    
    return NextResponse.json({ error: 'Error al actualizar estudiante' }, { status: 500 });
  }
}

// DELETE - Eliminar un estudiante
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    const [estudianteEliminado] = await db
      .delete(estudiantes)
      .where(eq(estudiantes.id, id))
      .returning();
    
    if (!estudianteEliminado) {
      return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Estudiante eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar estudiante:', error);
    return NextResponse.json({ error: 'Error al eliminar estudiante' }, { status: 500 });
  }
}
