'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
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
    }
  }, [pathname, router]);
  
  const getUser = () => {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  };
  
  const logout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };
  
  return { getUser, logout };
}
