'use client';
import { useAuth } from '@/lib/hooks/useAuth';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Plus, CheckCircle, Clock, FileText } from 'lucide-react';
import { getNombreMes, getMesActual, getAnioActual, formatearFechaCorta } from '@/lib/utils/dates';

interface Estudiante {
  id: number;
  nombre: string;
  apellido: string;
  carnet: string;
}

interface Expendio {
  id: number;
  archivo?: string;
  nombrePropietario: string;
  ubicacion: string;
  tipo: string;
}

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
  estudiante: Estudiante;
  expendio: Expendio;
}

export default function AsignacionesPage() {
  const { getUser } = useAuth(); // Protección de autenticación
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [expendiosDisponibles, setExpendiosDisponibles] = useState<Expendio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModalAsignar, setShowModalAsignar] = useState(false);
  const [showModalInforme, setShowModalInforme] = useState(false);
  const [selectedAsignacion, setSelectedAsignacion] = useState<Asignacion | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formAsignar, setFormAsignar] = useState({
    estudianteId: '',
    expendioId: '',
  });
  const [formInforme, setFormInforme] = useState({
    observaciones: '',
    calificacion: 'Bueno',
  });
  
  useEffect(() => {
    const user = getUser();
    if (user) {
      setIsAdmin(user.rol === 'ADMIN');
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const fetchData = async () => {
    try {
      const user = getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      
      // ✅ UNA SOLA LLAMADA optimizada que trae todo lo necesario
      const response = await fetch(
        `/api/asignaciones/data?userId=${user.id}&userRol=${user.rol}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Actualizar estados con los datos recibidos
      setAsignaciones(Array.isArray(data.asignaciones) ? data.asignaciones : []);
      setEstudiantes(Array.isArray(data.estudiantes) ? data.estudiantes : []);
      setExpendiosDisponibles(Array.isArray(data.expendiosDisponibles) ? data.expendiosDisponibles : []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setAsignaciones([]);
      setEstudiantes([]);
      setExpendiosDisponibles([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAsignar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/asignaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estudianteId: parseInt(formAsignar.estudianteId),
          expendioId: parseInt(formAsignar.expendioId),
        }),
      });
      
      if (response.ok) {
        setShowModalAsignar(false);
        setFormAsignar({ estudianteId: '', expendioId: '' });
        // ✅ Recargar datos optimizado
        await fetchData();
      } else {
        const error = await response.json();
        console.error('Error al crear asignación:', error.error || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const handleCargarInforme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsignacion) return;
    
    try {
      const response = await fetch(`/api/asignaciones/${selectedAsignacion.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formInforme),
      });
      
      if (response.ok) {
        setShowModalInforme(false);
        setSelectedAsignacion(null);
        setFormInforme({ observaciones: '', calificacion: 'Bueno' });
        // ✅ Recargar datos optimizado
        await fetchData();
      } else {
        const error = await response.json();
        console.error('Error al cargar informe:', error.error || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
            <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <FileText className="text-primary-600 flex-shrink-0" size={24} />
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900">{isAdmin ? 'Asignaciones' : 'Mis Asignaciones'}</h1>
              <p className="text-xs sm:text-base text-gray-600">
                {getNombreMes(getMesActual())} {getAnioActual()}
              </p>
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowModalAsignar(true)}
              className="btn-primary flex items-center space-x-2 text-sm sm:text-base w-full sm:w-auto justify-center"
              disabled={expendiosDisponibles.length === 0}
            >
              <Plus size={18} />
              <span>Nueva Asignación</span>
            </button>
          )}
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">Total Asignaciones</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{Array.isArray(asignaciones) ? asignaciones.length : 0}</p>
              </div>
              <FileText className="text-primary-600 flex-shrink-0 ml-2" size={24} />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">Informes Completados</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  {Array.isArray(asignaciones) ? asignaciones.filter(a => a.informeCompletado).length : 0}
                </p>
              </div>
              <CheckCircle className="text-green-600 flex-shrink-0 ml-2" size={24} />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">Pendientes</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600">
                  {Array.isArray(asignaciones) ? asignaciones.filter(a => !a.informeCompletado).length : 0}
                </p>
              </div>
              <Clock className="text-yellow-600 flex-shrink-0 ml-2" size={24} />
            </div>
          </div>
        </div>
        
        {/* Asignaciones List */}
        <div className="card">
          {loading ? (
            <LoadingSpinner />
          ) : asignaciones.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay asignaciones para este mes
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {asignaciones.map((asignacion) => (
                <div
                  key={asignacion.id}
                  className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900">
                          {asignacion.estudiante.nombre} {asignacion.estudiante.apellido}
                        </h3>
                        <span className="badge-info text-xs">{asignacion.estudiante.carnet}</span>
                        {asignacion.informeCompletado ? (
                          <span className="badge-success flex items-center space-x-1 text-xs">
                            <CheckCircle size={12} />
                            <span>Completado</span>
                          </span>
                        ) : (
                          <span className="badge-warning flex items-center space-x-1 text-xs">
                            <Clock size={12} />
                            <span>Pendiente</span>
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                        <p><strong>Expendio:</strong> {asignacion.expendio.ubicacion}</p>
                        <p><strong>Propietario:</strong> {asignacion.expendio.nombrePropietario}</p>
                        {asignacion.expendio.archivo && (
                          <p><strong>Archivo:</strong> {asignacion.expendio.archivo}</p>
                        )}
                        <p><strong>Fecha de asignación:</strong> {formatearFechaCorta(asignacion.fechaAsignacion)}</p>
                        
                        {asignacion.informeCompletado && (
                          <>
                            <p><strong>Calificación:</strong> {asignacion.calificacion}</p>
                            {asignacion.observaciones && (
                              <p><strong>Observaciones:</strong> {asignacion.observaciones}</p>
                            )}
                            {asignacion.fechaInforme && (
                              <p><strong>Fecha de informe:</strong> {formatearFechaCorta(asignacion.fechaInforme)}</p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    
                    {!asignacion.informeCompletado && (
                      <button
                        onClick={() => {
                          setSelectedAsignacion(asignacion);
                          setShowModalInforme(true);
                        }}
                        className="btn-success text-xs sm:text-sm w-full sm:w-auto justify-center flex-shrink-0"
                      >
                        Cargar Informe
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Modal Asignar */}
        {showModalAsignar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold mb-4">Nueva Asignación</h2>
              
              <form onSubmit={handleAsignar} className="space-y-4">
                <div>
                  <label className="label">Estudiante *</label>
                  <select
                    required
                    value={formAsignar.estudianteId}
                    onChange={(e) => setFormAsignar({ ...formAsignar, estudianteId: e.target.value })}
                    className="input"
                  >
                    <option value="">Seleccionar estudiante</option>
                    {estudiantes.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.nombre} {e.apellido} - {e.carnet}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="label">Expendio Disponible *</label>
                  <select
                    required
                    value={formAsignar.expendioId}
                    onChange={(e) => setFormAsignar({ ...formAsignar, expendioId: e.target.value })}
                    className="input"
                  >
                    <option value="">Seleccionar expendio</option>
                    {expendiosDisponibles.map((exp) => (
                      <option key={exp.id} value={exp.id}>
                        {exp.ubicacion} - {exp.nombrePropietario}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    {expendiosDisponibles.length} expendios disponibles
                  </p>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    Asignar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModalAsignar(false);
                      setFormAsignar({ estudianteId: '', expendioId: '' });
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Modal Informe */}
        {showModalInforme && selectedAsignacion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold mb-4">Cargar Informe</h2>
              
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Estudiante:</strong> {selectedAsignacion.estudiante.nombre} {selectedAsignacion.estudiante.apellido}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Expendio:</strong> {selectedAsignacion.expendio.ubicacion}
                </p>
              </div>
              
              <form onSubmit={handleCargarInforme} className="space-y-4">
                <div>
                  <label className="label">Calificación *</label>
                  <select
                    required
                    value={formInforme.calificacion}
                    onChange={(e) => setFormInforme({ ...formInforme, calificacion: e.target.value })}
                    className="input"
                  >
                    <option value="Excelente">Excelente</option>
                    <option value="Bueno">Bueno</option>
                    <option value="Regular">Regular</option>
                    <option value="Malo">Malo</option>
                  </select>
                </div>
                
                <div>
                  <label className="label">Observaciones *</label>
                  <textarea
                    required
                    value={formInforme.observaciones}
                    onChange={(e) => setFormInforme({ ...formInforme, observaciones: e.target.value })}
                    className="input"
                    rows={4}
                    placeholder="Describe los hallazgos de la auditoría..."
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    Guardar Informe
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModalInforme(false);
                      setSelectedAsignacion(null);
                      setFormInforme({ observaciones: '', calificacion: 'Bueno' });
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
