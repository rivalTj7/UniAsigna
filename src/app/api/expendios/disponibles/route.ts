import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { expendios, asignaciones } from '@/lib/db/schema';
import { eq, and, notInArray } from 'drizzle-orm';
import { getMesActual, getAnioActual } from '@/lib/utils/dates';

// GET - Obtener expendios disponibles (no asignados en el mes actual)
export async function GET() {
  try {
    const mesActual = getMesActual();
    const anioActual = getAnioActual();
    
    // Obtener IDs de expendios ya asignados en este mes
    const expendiosAsignados = await db
      .select({ expendioId: asignaciones.expendioId })
      .from(asignaciones)
      .where(
        and(
          eq(asignaciones.mes, mesActual),
          eq(asignaciones.anio, anioActual)
        )
      );
    
    const idsAsignados = expendiosAsignados.map(a => a.expendioId);
    
    // Obtener expendios disponibles (activos y no asignados)
    let expendiosDisponibles;
    
    if (idsAsignados.length > 0) {
      expendiosDisponibles = await db
        .select()
        .from(expendios)
        .where(
          and(
            eq(expendios.activo, true),
            notInArray(expendios.id, idsAsignados)
          )
        )
        .orderBy(expendios.ubicacion);
    } else {
      // Si no hay asignaciones, todos los expendios activos están disponibles
      expendiosDisponibles = await db
        .select()
        .from(expendios)
        .where(eq(expendios.activo, true))
        .orderBy(expendios.ubicacion);
    }
    
    return NextResponse.json({
      disponibles: expendiosDisponibles,
      totalDisponibles: expendiosDisponibles.length,
      totalAsignados: idsAsignados.length,
      mes: mesActual,
      anio: anioActual,
    });
  } catch (error) {
    console.error('Error al obtener expendios disponibles:', error);
    return NextResponse.json({ error: 'Error al obtener expendios disponibles' }, { status: 500 });
  }
}
