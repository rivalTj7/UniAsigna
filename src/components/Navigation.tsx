'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Users, Store, ClipboardCheck, Calendar, LogOut, User } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      setUser(JSON.parse(userString));
    }
  }, []);
  
  const handleLogout = () => {
    if (confirm('¿Cerrar sesión?')) {
      localStorage.removeItem('user');
      router.push('/login');
    }
  };
  
  const navItems = [
    { href: '/', label: 'Dashboard', icon: Home, roles: ['ADMIN', 'USUARIO'] },
    { href: '/estudiantes', label: 'Estudiantes', icon: Users, roles: ['ADMIN'] },
    { href: '/expendios', label: 'Expendios', icon: Store, roles: ['ADMIN'] },
    { href: '/asignaciones', label: 'Asignaciones', icon: ClipboardCheck, roles: ['ADMIN', 'USUARIO'] },
    { href: '/historial', label: 'Historial', icon: Calendar, roles: ['ADMIN', 'USUARIO'] },
  ];
  
  // Filtrar items según rol del usuario
  const filteredNavItems = user ? navItems.filter(item => item.roles.includes(user.rol)) : navItems;
  
  return (
    <nav className="bg-white shadow-lg border-b-4 border-blue-800">
      <div className="container mx-auto px-4">
        {/* Header con logo y título */}
        <div className="flex items-center justify-between py-4">
          {/* Logo y nombre */}
          <Link href="/" className="flex items-center space-x-4">
            <Image 
              src="/logo-laboratorio.jpeg" 
              alt="Laboratorio de Control" 
              width={60} 
              height={60}
              className="object-contain rounded-lg"
            />
            <div>
              <h1 className="text-2xl font-bold text-blue-900">UniAsigna</h1>
              <p className="text-xs text-gray-600">
                Laboratorio de Control Microbiológico de Alimentos
              </p>
            </div>
          </Link>
          
          {/* Usuario y botones */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <User size={16} className="text-gray-600" />
                <span className="text-gray-700">{user.nombre} {user.apellido}</span>
                <span className={`badge ${user.rol === 'ADMIN' ? 'badge-info' : 'badge-success'} text-xs`}>
                  {user.rol === 'ADMIN' ? 'Admin' : 'Usuario'}
                </span>
              </div>
            )}
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Cerrar sesión"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
        
        {/* Barra de navegación */}
        <div className="flex items-center justify-center border-t border-gray-200">
          <div className="flex space-x-1 py-2">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-900 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
