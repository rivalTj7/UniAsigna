'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import { Calendar, Search, Filter } from 'lucide-react';
import { getNombreMes, formatearFechaCorta } from '@/lib/utils/dates';

interface Asignacion {
  id: number;
  estudianteId: number;
  expendioId: number;
  mes: number;
  anio: number;
  fechaAsignacion: string;
  informeCompletado: boolean;
  fechaInforme?: string;
  observaciones?: string;
  calificacion?: string;
  estudiante: {
    id: number;
    nombre: string;
    apellido: string;
    carnet: string;
  };
  expendio: {
    id: number;
    archivo?: string;
    nombrePropietario: string;
    ubicacion: string;
    tipo: string;
  };
}

export default function HistorialPage() {
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMes, setFilterMes] = useState('');
  const [filterAnio, setFilterAnio] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  
  useEffect(() => {
    fetchHistorial();
  }, []);
  
  const fetchHistorial = async () => {
    try {
      const response = await fetch('/api/asignaciones');
      const data = await response.json();
      setAsignaciones(data);
    } catch (error) {
      console.error('Error al cargar historial:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Obtener años únicos
  const aniosUnicos = [...new Set(asignaciones.map(a => a.anio))].sort((a, b) => b - a);
  
  // Filtrar asignaciones
  const asignacionesFiltradas = asignaciones.filter((a) => {
    const matchSearch = searchTerm === '' || 
      `${a.estudiante.nombre} ${a.estudiante.apellido} ${a.estudiante.carnet} ${a.expendio.ubicacion} ${a.expendio.nombrePropietario}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    
    const matchMes = filterMes === '' || a.mes === parseInt(filterMes);
    const matchAnio = filterAnio === '' || a.anio === parseInt(filterAnio);
    const matchEstado = filterEstado === '' || 
      (filterEstado === 'completado' && a.informeCompletado) ||
      (filterEstado === 'pendiente' && !a.informeCompletado);
    
    return matchSearch && matchMes && matchAnio && matchEstado;
  });
  
  // Agrupar por mes/año
  const asignacionesAgrupadas = asignacionesFiltradas.reduce((groups, asignacion) => {
    const key = `${asignacion.anio}-${asignacion.mes}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(asignacion);
    return groups;
  }, {} as Record<string, Asignacion[]>);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Calendar className="text-primary-600" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Historial</h1>
              <p className="text-gray-600">Todas las asignaciones registradas</p>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            
            <select
              value={filterAnio}
              onChange={(e) => setFilterAnio(e.target.value)}
              className="input"
            >
              <option value="">Todos los años</option>
              {aniosUnicos.map((anio) => (
                <option key={anio} value={anio}>{anio}</option>
              ))}
            </select>
            
            <select
              value={filterMes}
              onChange={(e) => setFilterMes(e.target.value)}
              className="input"
            >
              <option value="">Todos los meses</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((mes) => (
                <option key={mes} value={mes}>{getNombreMes(mes)}</option>
              ))}
            </select>
            
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="input"
            >
              <option value="">Todos los estados</option>
              <option value="completado">Completados</option>
              <option value="pendiente">Pendientes</option>
            </select>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              {asignacionesFiltradas.length} asignación(es) encontrada(s)
            </span>
            {(searchTerm || filterMes || filterAnio || filterEstado) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterMes('');
                  setFilterAnio('');
                  setFilterEstado('');
                }}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
        
        {/* Content */}
        {loading ? (
          <div className="text-center py-8 text-gray-500">Cargando...</div>
        ) : asignacionesFiltradas.length === 0 ? (
          <div className="card text-center py-8 text-gray-500">
            No se encontraron asignaciones
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(asignacionesAgrupadas)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([key, asignacionesGrupo]) => {
                const [anio, mes] = key.split('-').map(Number);
                return (
                  <div key={key} className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                      <Calendar size={24} className="text-primary-600" />
                      <span>{getNombreMes(mes)} {anio}</span>
                      <span className="badge-info">{asignacionesGrupo.length}</span>
                    </h2>
                    
                    <div className="space-y-3">
                      {asignacionesGrupo.map((asignacion) => (
                        <div
                          key={asignacion.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-bold text-gray-900">
                                  {asignacion.estudiante.nombre} {asignacion.estudiante.apellido}
                                </h3>
                                <span className="badge-info text-xs">
                                  {asignacion.estudiante.carnet}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                                <div>
                                  <p><strong>Expendio:</strong> {asignacion.expendio.ubicacion}</p>
                                  <p><strong>Propietario:</strong> {asignacion.expendio.nombrePropietario}</p>
                                  {asignacion.expendio.archivo && (
                                    <p><strong>Archivo:</strong> {asignacion.expendio.archivo}</p>
                                  )}
                                </div>
                                
                                <div>
                                  <p><strong>Fecha asignación:</strong> {formatearFechaCorta(asignacion.fechaAsignacion)}</p>
                                  {asignacion.informeCompletado && asignacion.fechaInforme && (
                                    <p><strong>Fecha informe:</strong> {formatearFechaCorta(asignacion.fechaInforme)}</p>
                                  )}
                                  {asignacion.calificacion && (
                                    <p><strong>Calificación:</strong> {asignacion.calificacion}</p>
                                  )}
                                </div>
                              </div>
                              
                              {asignacion.observaciones && (
                                <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                                  <strong>Observaciones:</strong> {asignacion.observaciones}
                                </div>
                              )}
                            </div>
                            
                            <div>
                              {asignacion.informeCompletado ? (
                                <span className="badge-success">Completado</span>
                              ) : (
                                <span className="badge-warning">Pendiente</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
