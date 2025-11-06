import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { estudiantes, expendios, asignaciones } from '@/lib/db/schema';
import { eq, and, count } from 'drizzle-orm';
import { getMesActual, getAnioActual } from '@/lib/utils/dates';
import { withUserAuth } from '@/lib/auth/middleware';

export const GET = withUserAuth(async (request, user) => {
  try {
    // Usar datos del usuario autenticado desde JWT
    const userId = user.id;
    const userRol = user.rol;
    
    const mesActual = getMesActual();
    const anioActual = getAnioActual();
    
    const isAdmin = userRol === 'ADMIN';
    
    // Si es USUARIO normal, solo mostrar sus estadísticas
    if (!isAdmin && userId) {
      const userIdNum = userId;
      
      // Asignaciones del usuario en el mes actual
      const asignacionesMes = await db
        .select({ count: count() })
        .from(asignaciones)
        .where(
          and(
            eq(asignaciones.estudianteId, userIdNum),
            eq(asignaciones.mes, mesActual),
            eq(asignaciones.anio, anioActual)
          )
        );
      
      // Informes completados por el usuario este mes
      const informesCompletados = await db
        .select({ count: count() })
        .from(asignaciones)
        .where(
          and(
            eq(asignaciones.estudianteId, userIdNum),
            eq(asignaciones.mes, mesActual),
            eq(asignaciones.anio, anioActual),
            eq(asignaciones.informeCompletado, true)
          )
        );
      
      // Para usuario normal, no mostrar totales de estudiantes/expendios
      return NextResponse.json({
        totalEstudiantes: 0,
        totalExpendios: 0,
        asignacionesMesActual: asignacionesMes[0].count,
        informesCompletados: informesCompletados[0].count,
        expendiosDisponibles: 0,
        mes: mesActual,
        anio: anioActual,
        isUsuario: true,
      });
    }
    
    // Si es ADMIN, mostrar estadísticas completas
    const totalEstudiantes = await db
      .select({ count: count() })
      .from(estudiantes)
      .where(eq(estudiantes.activo, true));
    
    const totalExpendios = await db
      .select({ count: count() })
      .from(expendios)
      .where(eq(expendios.activo, true));
    
    const asignacionesMes = await db
      .select({ count: count() })
      .from(asignaciones)
      .where(
        and(
          eq(asignaciones.mes, mesActual),
          eq(asignaciones.anio, anioActual)
        )
      );
    
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
    
    const expendiosDisponibles = totalExpendios[0].count - asignacionesMes[0].count;
    
    return NextResponse.json({
      totalEstudiantes: totalEstudiantes[0].count,
      totalExpendios: totalExpendios[0].count,
      asignacionesMesActual: asignacionesMes[0].count,
      informesCompletados: informesCompletados[0].count,
      expendiosDisponibles,
      mes: mesActual,
      anio: anioActual,
      isUsuario: false,
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 });
  }
});
