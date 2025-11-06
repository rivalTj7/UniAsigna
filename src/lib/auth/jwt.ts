import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Secret key para JWT - en producción debe estar en variables de entorno
const JWT_SECRET = process.env.JWT_SECRET || 'tu-super-secreto-cambiar-en-produccion-2024';
const TOKEN_NAME = 'auth-token';

export interface JWTPayload {
  id: number;
  codigo: string;
  nombre: string;
  apellido: string;
  carnet: string;
  rol: 'ADMIN' | 'USUARIO';
}

/**
 * Genera un JWT token
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // Token válido por 7 días
  });
}

/**
 * Verifica y decodifica un JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Establece el token en una cookie httpOnly
 */
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: '/',
  });
}

/**
 * Obtiene el token de la cookie
 */
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(TOKEN_NAME);
  return cookie?.value || null;
}

/**
 * Elimina la cookie de autenticación
 */
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
}

/**
 * Obtiene el usuario actual desde el token
 */
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const token = await getAuthToken();
  if (!token) return null;
  return verifyToken(token);
}
