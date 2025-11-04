'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
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
  
  useEffect(() => {
    fetchStats();
  }, []);
  
  const fetchStats = async () => {
    try {
      const user = getUser();
      if (!user) return;
      
      const response = await fetch(`/api/dashboard/stats?userId=${user.id}&userRol=${user.rol}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Cargando...</div>
          </div>
        </div>
      </div>
    );
  }
  
  const statCards = [
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
  ];
  
  const mesActual = getMesActual();
  const anioActual = getAnioActual();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar size={20} />
            <span>Ciclo Actual: {getNombreMes(mesActual)} {anioActual}</span>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="text-white" size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Expendios Disponibles */}
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
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="/asignaciones" className="card hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center">
              <ClipboardCheck className="mx-auto mb-3 text-primary-600" size={40} />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Nueva Asignación</h3>
              <p className="text-sm text-gray-600">Asignar expendio a estudiante</p>
            </div>
          </a>
          
          <a href="/estudiantes" className="card hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center">
              <Users className="mx-auto mb-3 text-green-600" size={40} />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Gestionar Estudiantes</h3>
              <p className="text-sm text-gray-600">Ver y administrar estudiantes</p>
            </div>
          </a>
          
          <a href="/expendios" className="card hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center">
              <Store className="mx-auto mb-3 text-purple-600" size={40} />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Gestionar Expendios</h3>
              <p className="text-sm text-gray-600">Ver y administrar expendios</p>
            </div>
          </a>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
