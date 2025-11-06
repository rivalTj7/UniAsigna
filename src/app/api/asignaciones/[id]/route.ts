import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { asignaciones } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { withUserAuth, withAdminAuth } from '@/lib/auth/middleware';

// PUT - Actualizar informe de asignación (ADMIN y USUARIO)
export const PUT = withUserAuth(async (
  request: NextRequest,
  user,
  context
) => {
  try {
    const id = parseInt(context!.params.id);
    const body = await request.json();
    
    const [asignacionActualizada] = await db
      .update(asignaciones)
      .set({
        informeCompletado: true,
        fechaInforme: new Date(),
        observaciones: body.observaciones,
        calificacion: body.calificacion,
        fotoUrl: body.fotoUrl || null,
      })
      .where(eq(asignaciones.id, id))
      .returning();
    
    if (!asignacionActualizada) {
      return NextResponse.json({ error: 'Asignación no encontrada' }, { status: 404 });
    }
    
    return NextResponse.json(asignacionActualizada);
  } catch (error) {
    console.error('Error al actualizar informe:', error);
    return NextResponse.json({ error: 'Error al actualizar informe' }, { status: 500 });
  }
});

// DELETE - Eliminar una asignación (Solo ADMIN)
export const DELETE = withAdminAuth(async (
  request: NextRequest,
  user,
  context
) => {
  try {
    const id = parseInt(context!.params.id);
    
    const [asignacionEliminada] = await db
      .delete(asignaciones)
      .where(eq(asignaciones.id, id))
      .returning();
    
    if (!asignacionEliminada) {
      return NextResponse.json({ error: 'Asignación no encontrada' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Asignación eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar asignación:', error);
    return NextResponse.json({ error: 'Error al eliminar asignación' }, { status: 500 });
  }
});
