'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
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
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [expendiosDisponibles, setExpendiosDisponibles] = useState<Expendio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModalAsignar, setShowModalAsignar] = useState(false);
  const [showModalInforme, setShowModalInforme] = useState(false);
  const [selectedAsignacion, setSelectedAsignacion] = useState<Asignacion | null>(null);
  const [formAsignar, setFormAsignar] = useState({
    estudianteId: '',
    expendioId: '',
  });
  const [formInforme, setFormInforme] = useState({
    observaciones: '',
    calificacion: 'Bueno',
  });
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const [asignacionesRes, estudiantesRes, expendiosRes] = await Promise.all([
        fetch(`/api/asignaciones?mes=${getMesActual()}&anio=${getAnioActual()}`),
        fetch('/api/estudiantes'),
        fetch('/api/expendios/disponibles'),
      ]);
      
      const asignacionesData = await asignacionesRes.json();
      const estudiantesData = await estudiantesRes.json();
      const expendiosData = await expendiosRes.json();
      
      setAsignaciones(asignacionesData);
      setEstudiantes(estudiantesData.filter((e: Estudiante & { activo: boolean }) => e.activo));
      setExpendiosDisponibles(expendiosData.disponibles || []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
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
        await fetchData();
        setShowModalAsignar(false);
        setFormAsignar({ estudianteId: '', expendioId: '' });
        alert('Asignación creada exitosamente');
      } else {
        const error = await response.json();
        alert(error.error || 'Error al crear asignación');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear asignación');
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
        await fetchData();
        setShowModalInforme(false);
        setSelectedAsignacion(null);
        setFormInforme({ observaciones: '', calificacion: 'Bueno' });
        alert('Informe cargado exitosamente');
      } else {
        const error = await response.json();
        alert(error.error || 'Error al cargar informe');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar informe');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Asignaciones</h1>
            <p className="text-gray-600 mt-1">
              {getNombreMes(getMesActual())} {getAnioActual()}
            </p>
          </div>
          <button
            onClick={() => setShowModalAsignar(true)}
            className="btn-primary flex items-center space-x-2"
            disabled={expendiosDisponibles.length === 0}
          >
            <Plus size={20} />
            <span>Nueva Asignación</span>
          </button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Asignaciones</p>
                <p className="text-2xl font-bold text-gray-900">{asignaciones.length}</p>
              </div>
              <FileText className="text-primary-600" size={32} />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Informes Completados</p>
                <p className="text-2xl font-bold text-green-600">
                  {asignaciones.filter(a => a.informeCompletado).length}
                </p>
              </div>
              <CheckCircle className="text-green-600" size={32} />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {asignaciones.filter(a => !a.informeCompletado).length}
                </p>
              </div>
              <Clock className="text-yellow-600" size={32} />
            </div>
          </div>
        </div>
        
        {/* Asignaciones List */}
        <div className="card">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Cargando...</div>
          ) : asignaciones.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay asignaciones para este mes
            </div>
          ) : (
            <div className="space-y-4">
              {asignaciones.map((asignacion) => (
                <div
                  key={asignacion.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {asignacion.estudiante.nombre} {asignacion.estudiante.apellido}
                        </h3>
                        <span className="badge-info">{asignacion.estudiante.carnet}</span>
                        {asignacion.informeCompletado ? (
                          <span className="badge-success flex items-center space-x-1">
                            <CheckCircle size={14} />
                            <span>Completado</span>
                          </span>
                        ) : (
                          <span className="badge-warning flex items-center space-x-1">
                            <Clock size={14} />
                            <span>Pendiente</span>
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
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
                        className="btn-success text-sm"
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
