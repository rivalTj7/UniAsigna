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
    <nav className="bg-gradient-to-r from-blue-900 to-blue-800 shadow-2xl">
      <div className="container mx-auto px-2 sm:px-4">
        {/* Header con logo, título y usuario */}
        <div className="flex items-center justify-between py-2 sm:py-3 gap-2">
          {/* Logo más pequeño en móvil */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <div className="relative">
              <Image 
                src="/logo-laboratorio.jpeg" 
                alt="Laboratorio" 
                width={80} 
                height={30}
                className="object-cover rounded-lg shadow-lg ring-2 ring-white/20 group-hover:ring-white/40 transition-all sm:hidden"
              />
              <Image 
                src="/logo-laboratorio.jpeg" 
                alt="Laboratorio de Control" 
                width={120} 
                height={45}
                className="object-cover rounded-lg shadow-lg ring-2 ring-white/20 group-hover:ring-white/40 transition-all hidden sm:block"
              />
            </div>
          </Link>
          
          {/* Título - responsive */}
          <div className="flex flex-col items-center flex-1 px-2">
            <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
              UniAsigna
            </h1>
            <p className="text-[10px] sm:text-xs text-blue-200 leading-tight text-center hidden sm:block">
              Laboratorio de Control Microbiológico de Alimentos
            </p>
          </div>
          
          {/* Usuario y botones */}
          <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
            {user && (
              <div className="hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20">
                <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full">
                  <User size={16} className="text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white leading-tight">
                    {user.nombre} {user.apellido}
                  </span>
                  <span className={`text-xs font-semibold leading-tight ${
                    user.rol === 'ADMIN' ? 'text-yellow-300' : 'text-green-300'
                  }`}>
                    {user.rol === 'ADMIN' ? 'Administrador' : 'Estudiante'}
                  </span>
                </div>
              </div>
            )}
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-red-500/90 hover:bg-red-600 text-white text-xs sm:text-sm font-medium rounded-lg transition-all shadow-lg hover:shadow-xl"
              title="Cerrar sesión"
            >
              <LogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
        
        {/* Barra de navegación - responsive */}
        <div className="flex items-center justify-center border-t border-white/10 pt-2 pb-2 sm:pb-3 overflow-x-auto">
          <div className="flex gap-1 min-w-max px-2">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-blue-900 shadow-lg'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" />
                  <span className="text-xs sm:text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
