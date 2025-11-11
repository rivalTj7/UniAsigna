import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { expendios, type NuevoExpendio } from '@/lib/db/schema';
import { withAdminAuth } from '@/lib/auth/middleware';
import { inArray } from 'drizzle-orm';

// Forzar renderizado dinámico (usa cookies)
export const dynamic = 'force-dynamic';

// POST - Carga masiva de expendios desde CSV (Solo ADMIN)
export const POST = withAdminAuth(async (request, user) => {
  try {
    const body = await request.json();
    const { expendios: expendiosData } = body;

    if (!Array.isArray(expendiosData) || expendiosData.length === 0) {
      return NextResponse.json(
        { error: 'Debe proporcionar un array de expendios' },
        { status: 400 }
      );
    }

    // Validar que todos los expendios tengan los campos requeridos
    const expendiosValidos: NuevoExpendio[] = [];
    const errores: string[] = [];

    expendiosData.forEach((exp, index) => {
      if (!exp.nombrePropietario || !exp.ubicacion) {
        errores.push(`Línea ${index + 1}: Falta nombre del propietario o ubicación`);
        return;
      }

      expendiosValidos.push({
        archivo: exp.archivo || null,
        nombrePropietario: exp.nombrePropietario.trim(),
        ubicacion: exp.ubicacion.trim(),
        tipo: exp.tipo || 'KIOSKO',
        activo: exp.activo !== undefined ? exp.activo : true,
      });
    });

    if (errores.length > 0) {
      return NextResponse.json(
        { 
          error: 'Algunos expendios tienen datos inválidos',
          detalles: errores 
        },
        { status: 400 }
      );
    }

    // Insertar todos los expendios válidos
    const expendiosCreados = await db.insert(expendios).values(expendiosValidos).returning();

    return NextResponse.json({
      message: `${expendiosCreados.length} expendios creados exitosamente`,
      total: expendiosCreados.length,
      expendios: expendiosCreados,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error en carga masiva de expendios:', error);
    
    // Manejar errores de duplicados
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Algunos expendios ya existen en el sistema' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Error al realizar la carga masiva de expendios' },
      { status: 500 }
    );
  }
});

// DELETE - Borrado masivo de expendios (Solo ADMIN)
export const DELETE = withAdminAuth(async (request, user) => {
  try {
    const body = await request.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Debe proporcionar un array de IDs' },
        { status: 400 }
      );
    }

    // Validar que todos sean números
    const idsValidos = ids.filter(id => typeof id === 'number' && !isNaN(id));
    
    if (idsValidos.length === 0) {
      return NextResponse.json(
        { error: 'No se proporcionaron IDs válidos' },
        { status: 400 }
      );
    }

    // Eliminar todos los expendios con los IDs proporcionados
    const expendiosEliminados = await db
      .delete(expendios)
      .where(inArray(expendios.id, idsValidos))
      .returning();

    return NextResponse.json({
      message: `${expendiosEliminados.length} expendios eliminados exitosamente`,
      total: expendiosEliminados.length,
      eliminados: expendiosEliminados.map(e => e.id),
    });

  } catch (error) {
    console.error('Error en borrado masivo de expendios:', error);
    return NextResponse.json(
      { error: 'Error al realizar el borrado masivo de expendios' },
      { status: 500 }
    );
  }
});
