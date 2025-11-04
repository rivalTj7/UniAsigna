'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Users, Store, ClipboardCheck, CheckCircle, Calendar } from 'lucide-react';
import { getNombreMes, getMesActual, getAnioActual } from '@/lib/utils/dates';
import { useAuth } from '@/lib/hooks/useAuth';

interface Stats {
  totalEstudiantes: number;
  totalExpendios: number;
  asignacionesMesActual: number;
  informesCompletados: number;
  expendiosDisponibles: number;
  mes: number;
  anio: number;
}

export default function Home() {
  const { getUser } = useAuth(); // Protección de autenticación
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      setLoading(false);
      return;
    }
    
    setUser(currentUser);
    
    // Cargar stats
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/dashboard/stats?userId=${currentUser.id}&userRol=${currentUser.rol}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }
  
  // Tarjetas de estadísticas según el rol
  const statCards = user?.rol === 'ADMIN' 
    ? [
        {
          title: 'Estudiantes Activos',
          value: stats?.totalEstudiantes || 0,
          icon: Users,
          color: 'bg-blue-500',
        },
        {
          title: 'Expendios Totales',
          value: stats?.totalExpendios || 0,
          icon: Store,
          color: 'bg-green-500',
        },
        {
          title: 'Asignaciones del Mes',
          value: stats?.asignacionesMesActual || 0,
          icon: ClipboardCheck,
          color: 'bg-purple-500',
        },
        {
          title: 'Informes Completados',
          value: stats?.informesCompletados || 0,
          icon: CheckCircle,
          color: 'bg-yellow-500',
        },
      ]
    : [
        // Para USUARIO solo mostrar sus estadísticas personales
        {
          title: 'Mis Asignaciones del Mes',
          value: stats?.asignacionesMesActual || 0,
          icon: ClipboardCheck,
          color: 'bg-purple-500',
        },
        {
          title: 'Mis Informes Completados',
          value: stats?.informesCompletados || 0,
          icon: CheckCircle,
          color: 'bg-green-500',
        },
      ];
  
  const mesActual = getMesActual();
  const anioActual = getAnioActual();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <div className="flex items-center space-x-2 text-sm sm:text-base text-gray-600">
            <Calendar size={18} className="sm:w-5 sm:h-5" />
            <span>Ciclo Actual: {getNombreMes(mesActual)} {anioActual}</span>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${user?.rol === 'ADMIN' ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-4 sm:gap-6 mb-6 sm:mb-8`}>
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">{stat.title}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-2 sm:p-3 rounded-lg flex-shrink-0 ml-2`}>
                    <Icon className="text-white" size={20} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Estado de Asignaciones - Solo para ADMIN */}
        {user && user.rol === 'ADMIN' && (
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Estado de Asignaciones</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Expendios Disponibles</span>
                <span className="text-2xl font-bold text-green-600">
                  {stats?.expendiosDisponibles || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-primary-600 h-4 rounded-full transition-all"
                  style={{
                    width: `${
                      stats?.totalExpendios
                        ? ((stats.asignacionesMesActual / stats.totalExpendios) * 100).toFixed(0)
                        : 0
                    }%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  {stats?.asignacionesMesActual || 0} de {stats?.totalExpendios || 0} asignados
                </span>
                <span>
                  {stats?.totalExpendios
                    ? ((stats.asignacionesMesActual / stats.totalExpendios) * 100).toFixed(0)
                    : 0}
                  % completado
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Quick Actions - Solo para ADMIN */}
        {user && user.rol === 'ADMIN' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <a href="/asignaciones" className="card hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-center">
                <ClipboardCheck className="mx-auto mb-2 sm:mb-3 text-primary-600" size={32} />
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Nueva Asignación</h3>
                <p className="text-xs sm:text-sm text-gray-600">Asignar expendio a estudiante</p>
              </div>
            </a>
            
            <a href="/estudiantes" className="card hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-center">
                <Users className="mx-auto mb-2 sm:mb-3 text-green-600" size={32} />
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Gestionar Estudiantes</h3>
                <p className="text-xs sm:text-sm text-gray-600">Ver y administrar estudiantes</p>
              </div>
            </a>
            
            <a href="/expendios" className="card hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-center">
                <Store className="mx-auto mb-2 sm:mb-3 text-purple-600" size={32} />
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Gestionar Expendios</h3>
                <p className="text-xs sm:text-sm text-gray-600">Ver y administrar expendios</p>
              </div>
            </a>
          </div>
        )}
        
        {/* Mensaje para usuarios normales */}
        {user && user.rol === 'USUARIO' && (
          <div className="card text-center py-6 sm:py-8">
            <Calendar className="mx-auto mb-3 sm:mb-4 text-primary-600" size={40} />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Bienvenido, {user.nombre}</h3>
            <p className="text-sm sm:text-base text-gray-600 px-4">
              Puedes ver y gestionar tus asignaciones mensuales, cargar tus informes de auditoría y consultar el historial completo.
            </p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
