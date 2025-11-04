import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { expendios, type NuevoExpendio } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET - Obtener todos los expendios
export async function GET() {
  try {
    const todosExpendios = await db.select().from(expendios).orderBy(expendios.ubicacion);
    return NextResponse.json(todosExpendios);
  } catch (error) {
    console.error('Error al obtener expendios:', error);
    return NextResponse.json({ error: 'Error al obtener expendios' }, { status: 500 });
  }
}

// POST - Crear nuevo expendio
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar campos requeridos
    if (!body.nombrePropietario || !body.ubicacion) {
      return NextResponse.json(
        { error: 'Nombre del propietario y ubicación son requeridos' },
        { status: 400 }
      );
    }

    const nuevoExpendio: NuevoExpendio = {
      archivo: body.archivo || null,
      nombrePropietario: body.nombrePropietario,
      ubicacion: body.ubicacion,
      tipo: body.tipo || 'KIOSKO',
      activo: body.activo !== undefined ? body.activo : true,
    };

    const [expendioCreado] = await db.insert(expendios).values(nuevoExpendio).returning();
    
    return NextResponse.json(expendioCreado, { status: 201 });
  } catch (error) {
    console.error('Error al crear expendio:', error);
    return NextResponse.json({ error: 'Error al crear expendio' }, { status: 500 });
  }
}
