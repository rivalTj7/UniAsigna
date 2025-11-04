import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    if (!password) {
      return NextResponse.json(
        { error: 'Se requiere una contraseña' },
        { status: 400 }
      );
    }
    
    // Hashear la contraseña con bcrypt (10 rounds)
    const hashedPassword = await bcrypt.hash(password, 10);
    
    return NextResponse.json({
      password: password,
      hashedPassword: hashedPassword,
    });
  } catch (error) {
    console.error('Error al hashear contraseña:', error);
    return NextResponse.json(
      { error: 'Error al procesar la contraseña' },
      { status: 500 }
    );
  }
}
