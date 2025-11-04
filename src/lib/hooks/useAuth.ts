'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') {
      return;
    }
    
    // Rutas públicas
    const publicRoutes = ['/login', '/registro'];
    
    // Si está en una ruta pública, no hacer nada
    if (publicRoutes.includes(pathname)) {
      return;
    }
    
    // Verificar si hay usuario en localStorage
    const userString = localStorage.getItem('user');
    
    if (!userString) {
      // No hay sesión, redirigir a login
      router.push('/login');
      return;
    }
    
    // Verificar permisos por rol
    const user = JSON.parse(userString);
    
    // Si es USUARIO (estudiante), solo puede acceder a Dashboard, Asignaciones e Historial
    if (user.rol === 'USUARIO') {
      const rutasPermitidasUsuario = ['/', '/asignaciones', '/historial'];
      
      // Si intenta acceder a una ruta no permitida, redirigir a historial
      if (!rutasPermitidasUsuario.includes(pathname)) {
        router.push('/historial');
      }
    }
  }, [pathname, router]);
  
  const getUser = () => {
    // Verificar si estamos en el navegador
    if (typeof window === 'undefined') {
      return null;
    }
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  };
  
  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    router.push('/login');
  };
  
  return { getUser, logout };
}
