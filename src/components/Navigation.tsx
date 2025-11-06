'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Users, Store, ClipboardCheck, Calendar, LogOut, User, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCurrentUser, logout } from '@/lib/auth/client';
import ConfirmDialog from './ConfirmDialog';

export default function Navigation() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    loadUser();
  }, []);

  const handleLogout = () => {
    setShowLogoutDialog(true);
    setMobileMenuOpen(false);
  };

  const confirmLogout = async () => {
    await logout();
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
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 shadow-2xl border-b border-white/10 backdrop-blur-sm">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header Principal */}
        <div className="flex items-center justify-between py-3 sm:py-4 gap-3">
          {/* Logo y Título */}
          <Link href="/" className="flex items-center gap-3 sm:gap-4 group flex-shrink-0">
            <div className="relative">
              {/* Logo móvil */}
              <div className="sm:hidden">
                <Image
                  src="/logo-laboratorio.webp"
                  alt="Laboratorio"
                  width={50}
                  height={50}
                  priority
                  quality={90}
                  className="object-contain rounded-xl shadow-lg ring-2 ring-white/30 group-hover:ring-white/50 transition-all group-hover:scale-105"
                />
              </div>
              {/* Logo desktop */}
              <div className="hidden sm:block">
                <Image
                  src="/logo-laboratorio.webp"
                  alt="Laboratorio de Control"
                  width={60}
                  height={60}
                  priority
                  quality={90}
                  className="object-contain rounded-xl shadow-lg ring-2 ring-white/30 group-hover:ring-white/50 transition-all group-hover:scale-105"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight group-hover:text-blue-100 transition-colors">
                UniAsigna
              </h1>
              <p className="text-[10px] sm:text-xs text-blue-200/80 leading-tight hidden md:block">
                Sistema de Auditoría de Expendios
              </p>
            </div>
          </Link>

          {/* Sección derecha: Usuario + Botones */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Info de Usuario - Desktop */}
            {user && (
              <div className="hidden lg:flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 shadow-lg hover:bg-white/15 transition-all">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-white/30 to-white/10 rounded-full ring-2 ring-white/20">
                  <User size={18} className="text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white leading-tight">
                    {user.nombre} {user.apellido}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-xs font-bold leading-tight ${
                    user.rol === 'ADMIN' ? 'text-yellow-300' : 'text-emerald-300'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      user.rol === 'ADMIN' ? 'bg-yellow-300' : 'bg-emerald-300'
                    }`}></div>
                    {user.rol === 'ADMIN' ? 'Administrador' : 'Estudiante'}
                  </span>
                </div>
              </div>
            )}

            {/* Botón Logout - Desktop */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              title="Cerrar sesión"
            >
              <LogOut size={18} />
              <span>Salir</span>
            </button>

            {/* Botón Mobile Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
            </button>
          </div>
        </div>

        {/* Barra de navegación - Desktop */}
        <div className="hidden sm:flex items-center justify-center border-t border-white/10 py-2">
          <div className="flex gap-2">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-primary-900 shadow-lg scale-105'
                      : 'text-blue-100 hover:bg-white/15 hover:text-white hover:scale-105'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Menú Mobile - Slide Down */}
      <div className={`sm:hidden overflow-hidden transition-all duration-300 ${
        mobileMenuOpen ? 'max-h-screen' : 'max-h-0'
      }`}>
        <div className="container mx-auto px-3 pb-4 space-y-2 border-t border-white/10 pt-3 animate-fade-in-up">
          {/* Info de Usuario Mobile */}
          {user && (
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20 mb-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-white/30 to-white/10 rounded-full">
                <User size={18} className="text-white" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-sm font-semibold text-white">
                  {user.nombre} {user.apellido}
                </span>
                <span className={`inline-flex items-center gap-1 text-xs font-bold ${
                  user.rol === 'ADMIN' ? 'text-yellow-300' : 'text-emerald-300'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    user.rol === 'ADMIN' ? 'bg-yellow-300' : 'bg-emerald-300'
                  }`}></div>
                  {user.rol === 'ADMIN' ? 'Administrador' : 'Estudiante'}
                </span>
              </div>
            </div>
          )}

          {/* Links de navegación Mobile */}
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-primary-900 shadow-lg'
                    : 'text-blue-100 hover:bg-white/15 hover:text-white active:scale-95'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}

          {/* Botón Logout Mobile */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl transition-all shadow-lg active:scale-95 mt-2"
          >
            <LogOut size={20} />
            <span className="text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Confirm Logout Dialog */}
      <ConfirmDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={confirmLogout}
        title="Cerrar Sesión"
        message="¿Estás seguro de que deseas cerrar sesión?"
        confirmText="Cerrar Sesión"
        cancelText="Cancelar"
        type="warning"
      />
    </nav>
  );
}
