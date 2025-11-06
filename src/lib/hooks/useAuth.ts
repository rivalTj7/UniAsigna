'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, logout as clientLogout } from '@/lib/auth/client';

interface User {
  id: number;
  codigo: string;
  nombre: string;
  apellido: string;
  carnet: string;
  rol: 'ADMIN' | 'USUARIO';
}

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      // Rutas públicas
      const publicRoutes = ['/login', '/registro'];
      
      // Si está en una ruta pública, no verificar autenticación
      if (publicRoutes.includes(pathname)) {
        setLoading(false);
        return;
      }
      
      // Obtener usuario desde cookies (vía API)
      const currentUser = await getCurrentUser();
      
      if (!currentUser) {
        // No hay sesión, redirigir a login
        router.push('/login');
        return;
      }
      
      setUser(currentUser);
      
      // Verificar permisos por rol
      if (currentUser.rol === 'USUARIO') {
        const rutasPermitidasUsuario = ['/', '/asignaciones', '/historial'];
        
        // Si intenta acceder a una ruta no permitida, redirigir a historial
        if (!rutasPermitidasUsuario.includes(pathname)) {
          router.push('/historial');
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [pathname, router]);
  
  const getUser = () => user;
  
  const logout = async () => {
    await clientLogout();
  };
  
  return { getUser, logout, loading };
}
