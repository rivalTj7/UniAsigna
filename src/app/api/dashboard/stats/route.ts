import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { estudiantes, expendios, asignaciones } from '@/lib/db/schema';
import { eq, and, count } from 'drizzle-orm';
import { getMesActual, getAnioActual } from '@/lib/utils/dates';

export async function GET() {
  try {
    const mesActual = getMesActual();
    const anioActual = getAnioActual();
    
    // Total de estudiantes activos
    const totalEstudiantes = await db
      .select({ count: count() })
      .from(estudiantes)
      .where(eq(estudiantes.activo, true));
    
    // Total de expendios activos
    const totalExpendios = await db
      .select({ count: count() })
      .from(expendios)
      .where(eq(expendios.activo, true));
    
    // Asignaciones del mes actual
    const asignacionesMes = await db
      .select({ count: count() })
      .from(asignaciones)
      .where(
        and(
          eq(asignaciones.mes, mesActual),
          eq(asignaciones.anio, anioActual)
        )
      );
    
    // Informes completados este mes
    const informesCompletados = await db
      .select({ count: count() })
      .from(asignaciones)
      .where(
        and(
          eq(asignaciones.mes, mesActual),
          eq(asignaciones.anio, anioActual),
          eq(asignaciones.informeCompletado, true)
        )
      );
    
    // Expendios disponibles (no asignados)
    const expendiosDisponibles = totalExpendios[0].count - asignacionesMes[0].count;
    
    return NextResponse.json({
      totalEstudiantes: totalEstudiantes[0].count,
      totalExpendios: totalExpendios[0].count,
      asignacionesMesActual: asignacionesMes[0].count,
      informesCompletados: informesCompletados[0].count,
      expendiosDisponibles,
      mes: mesActual,
      anio: anioActual,
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 });
  }
}
