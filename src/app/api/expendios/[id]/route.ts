import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { expendios } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET - Obtener un expendio por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const expendio = await db.select().from(expendios).where(eq(expendios.id, id)).limit(1);
    
    if (expendio.length === 0) {
      return NextResponse.json({ error: 'Expendio no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json(expendio[0]);
  } catch (error) {
    console.error('Error al obtener expendio:', error);
    return NextResponse.json({ error: 'Error al obtener expendio' }, { status: 500 });
  }
}

// PUT - Actualizar un expendio
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    
    const [expendioActualizado] = await db
      .update(expendios)
      .set({
        archivo: body.archivo,
        nombrePropietario: body.nombrePropietario,
        ubicacion: body.ubicacion,
        tipo: body.tipo,
        activo: body.activo,
      })
      .where(eq(expendios.id, id))
      .returning();
    
    if (!expendioActualizado) {
      return NextResponse.json({ error: 'Expendio no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json(expendioActualizado);
  } catch (error) {
    console.error('Error al actualizar expendio:', error);
    return NextResponse.json({ error: 'Error al actualizar expendio' }, { status: 500 });
  }
}

// DELETE - Eliminar un expendio
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    const [expendioEliminado] = await db
      .delete(expendios)
      .where(eq(expendios.id, id))
      .returning();
    
    if (!expendioEliminado) {
      return NextResponse.json({ error: 'Expendio no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Expendio eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar expendio:', error);
    return NextResponse.json({ error: 'Error al eliminar expendio' }, { status: 500 });
  }
}
