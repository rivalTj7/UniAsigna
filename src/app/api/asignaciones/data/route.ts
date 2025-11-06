import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { asignaciones, estudiantes, expendios } from '@/lib/db/schema';
import { eq, and, desc, notInArray, sql } from 'drizzle-orm';
import { getMesActual, getAnioActual } from '@/lib/utils/dates';
import { withUserAuth } from '@/lib/auth/middleware';

/**
 * Endpoint optimizado que devuelve todo lo necesario para la página de asignaciones
 * en una sola llamada HTTP
 * Protegido con autenticación JWT - tanto ADMIN como USUARIO pueden acceder
 */
export const GET = withUserAuth(async (request, user) => {
  try {
    // Usar datos del usuario autenticado desde JWT
    const userId = user.id;
    const userRol = user.rol;

    const mesActual = getMesActual();
    const anioActual = getAnioActual();
    const isAdmin = userRol === 'ADMIN';
    
    // Construir condiciones para asignaciones
    const asignacionesConditions = [
      eq(asignaciones.mes, mesActual),
      eq(asignaciones.anio, anioActual)
    ];
    
    // Si es USUARIO, filtrar solo sus asignaciones
    if (!isAdmin && userId) {
      asignacionesConditions.push(eq(asignaciones.estudianteId, parseInt(userId)));
    }
    
    // Obtener asignaciones del mes
    const asignacionesData = await db
      .select({
        id: asignaciones.id,
        estudianteId: asignaciones.estudianteId,
        expendioId: asignaciones.expendioId,
        mes: asignaciones.mes,
        anio: asignaciones.anio,
        fechaAsignacion: asignaciones.fechaAsignacion,
        informeCompletado: asignaciones.informeCompletado,
        fechaInforme: asignaciones.fechaInforme,
        observaciones: asignaciones.observaciones,
        calificacion: asignaciones.calificacion,
        fotoUrl: asignaciones.fotoUrl,
        estudiante: {
          id: estudiantes.id,
          nombre: estudiantes.nombre,
          apellido: estudiantes.apellido,
          carnet: estudiantes.carnet,
        },
        expendio: {
          id: expendios.id,
          archivo: expendios.archivo,
          nombrePropietario: expendios.nombrePropietario,
          ubicacion: expendios.ubicacion,
          tipo: expendios.tipo,
        },
      })
      .from(asignaciones)
      .innerJoin(estudiantes, eq(asignaciones.estudianteId, estudiantes.id))
      .innerJoin(expendios, eq(asignaciones.expendioId, expendios.id))
      .where(and(...asignacionesConditions))
      .orderBy(desc(asignaciones.fechaAsignacion));
    
    // Respuesta base
    const response: any = {
      asignaciones: asignacionesData,
      estudiantes: [],
      expendiosDisponibles: [],
    };
    
    // Si es ADMIN, incluir estudiantes activos y expendios disponibles
    if (isAdmin) {
      // Obtener estudiantes activos
      const estudiantesActivos = await db
        .select({
          id: estudiantes.id,
          nombre: estudiantes.nombre,
          apellido: estudiantes.apellido,
          carnet: estudiantes.carnet,
        })
        .from(estudiantes)
        .where(eq(estudiantes.activo, true))
        .orderBy(estudiantes.apellido);
      
      // Obtener IDs de expendios ya asignados este mes
      const expendiosAsignadosIds = asignacionesData.map(a => a.expendioId);
      
      // Obtener expendios disponibles (activos y no asignados este mes)
      let expendiosQuery = db
        .select({
          id: expendios.id,
          archivo: expendios.archivo,
          nombrePropietario: expendios.nombrePropietario,
          ubicacion: expendios.ubicacion,
          tipo: expendios.tipo,
        })
        .from(expendios)
        .where(eq(expendios.activo, true))
        .$dynamic();
      
      // Si hay expendios asignados, excluirlos
      if (expendiosAsignadosIds.length > 0) {
        expendiosQuery = expendiosQuery.where(
          notInArray(expendios.id, expendiosAsignadosIds)
        );
      }
      
      const expendiosDisponibles = await expendiosQuery.orderBy(expendios.ubicacion);
      
      response.estudiantes = estudiantesActivos;
      response.expendiosDisponibles = expendiosDisponibles;
    }
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error al obtener datos de asignaciones:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos de asignaciones' },
      { status: 500 }
    );
  }
});
