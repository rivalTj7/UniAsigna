import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { asignaciones, estudiantes, expendios, type NuevaAsignacion } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getMesActual, getAnioActual } from '@/lib/utils/dates';

// GET - Obtener todas las asignaciones con filtros opcionales
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mes = searchParams.get('mes');
    const anio = searchParams.get('anio');
    const estudianteId = searchParams.get('estudianteId');
    
    // Construir condiciones de filtro
    const conditions = [];
    if (mes) conditions.push(eq(asignaciones.mes, parseInt(mes)));
    if (anio) conditions.push(eq(asignaciones.anio, parseInt(anio)));
    if (estudianteId) conditions.push(eq(asignaciones.estudianteId, parseInt(estudianteId)));
    
    // Construir query base
    let query = db
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
      .$dynamic();
    
    // Aplicar filtros si existen
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const resultado = await query.orderBy(desc(asignaciones.fechaAsignacion));
    
    return NextResponse.json(resultado);
  } catch (error) {
    console.error('Error al obtener asignaciones:', error);
    return NextResponse.json({ error: 'Error al obtener asignaciones' }, { status: 500 });
  }
}

// POST - Crear nueva asignación
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar campos requeridos
    if (!body.estudianteId || !body.expendioId) {
      return NextResponse.json(
        { error: 'ID de estudiante y expendio son requeridos' },
        { status: 400 }
      );
    }

    const mesActual = getMesActual();
    const anioActual = getAnioActual();

    // Verificar que el expendio no esté ya asignado este mes
    const asignacionExistente = await db
      .select()
      .from(asignaciones)
      .where(
        and(
          eq(asignaciones.expendioId, body.expendioId),
          eq(asignaciones.mes, mesActual),
          eq(asignaciones.anio, anioActual)
        )
      )
      .limit(1);

    if (asignacionExistente.length > 0) {
      return NextResponse.json(
        { error: 'Este expendio ya está asignado en el mes actual' },
        { status: 409 }
      );
    }

    const nuevaAsignacion: NuevaAsignacion = {
      estudianteId: body.estudianteId,
      expendioId: body.expendioId,
      mes: mesActual,
      anio: anioActual,
    };

    const [asignacionCreada] = await db.insert(asignaciones).values(nuevaAsignacion).returning();
    
    // Obtener la asignación completa con datos de estudiante y expendio
    const asignacionCompleta = await db
      .select({
        id: asignaciones.id,
        estudianteId: asignaciones.estudianteId,
        expendioId: asignaciones.expendioId,
        mes: asignaciones.mes,
        anio: asignaciones.anio,
        fechaAsignacion: asignaciones.fechaAsignacion,
        informeCompletado: asignaciones.informeCompletado,
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
      .where(eq(asignaciones.id, asignacionCreada.id))
      .limit(1);
    
    return NextResponse.json(asignacionCompleta[0], { status: 201 });
  } catch (error: any) {
    console.error('Error al crear asignación:', error);
    
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Este expendio ya está asignado en este mes' },
        { status: 409 }
      );
    }
    
    return NextResponse.json({ error: 'Error al crear asignación' }, { status: 500 });
  }
}
