'use client';

export const dynamic = 'force-dynamic';

import { useAuth } from '@/lib/hooks/useAuth';
import { useEffect, useState, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import ConfirmDialog from '@/components/ConfirmDialog';
import { Plus, Edit2, Trash2, Search, Upload, Trash, Download } from 'lucide-react';
import toast from 'react-hot-toast';

interface Expendio {
  id: number;
  archivo?: string;
  nombrePropietario: string;
  ubicacion: string;
  tipo: string;
  activo: boolean;
}

export default function ExpendiosPage() {
  const { getUser, loading: authLoading } = useAuth(); // Protección de autenticación
  const [expendios, setExpendios] = useState<Expendio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [expendioToDelete, setExpendioToDelete] = useState<number | null>(null);
  const [selectedExpendios, setSelectedExpendios] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    id: null as number | null,
    archivo: '',
    nombrePropietario: '',
    ubicacion: '',
    tipo: 'KIOSKO',
    activo: true,
  });

  useEffect(() => {
    // Esperar a que termine la autenticación
    if (authLoading) return;

    // Verificar que el usuario sea ADMIN
    const user = getUser();
    if (!user || user.rol !== 'ADMIN') {
      window.location.href = '/';
      return;
    }
    fetchExpendios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading]);
  
  const fetchExpendios = async () => {
    try {
      const response = await fetch('/api/expendios');
      const data = await response.json();
      setExpendios(data);
    } catch (error) {
      console.error('Error al cargar expendios:', error);
      toast.error('Error al cargar expendios');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = formData.id ? `/api/expendios/${formData.id}` : '/api/expendios';
      const method = formData.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        await fetchExpendios();
        setShowModal(false);
        resetForm();
        toast.success(formData.id ? 'Expendio actualizado exitosamente' : 'Expendio creado exitosamente');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al guardar expendio');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    }
  };
  
  const handleEdit = (expendio: Expendio) => {
    setFormData({
      id: expendio.id,
      archivo: expendio.archivo || '',
      nombrePropietario: expendio.nombrePropietario,
      ubicacion: expendio.ubicacion,
      tipo: expendio.tipo,
      activo: expendio.activo,
    });
    setShowModal(true);
  };
  
  const handleDelete = (id: number) => {
    setExpendioToDelete(id);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (!expendioToDelete) return;
    
    try {
      const response = await fetch(`/api/expendios/${expendioToDelete}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchExpendios();
        toast.success('Expendio eliminado exitosamente');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al eliminar expendio');
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      toast.error('Error de conexión');
    } finally {
      setExpendioToDelete(null);
    }
  };
  
  const resetForm = () => {
    setFormData({
      id: null,
      archivo: '',
      nombrePropietario: '',
      ubicacion: '',
      tipo: 'KIOSKO',
      activo: true,
    });
  };

  // Funciones para carga masiva
  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        // Saltar header si existe
        const dataLines = lines[0].includes('archivo') || lines[0].includes('Archivo') 
          ? lines.slice(1) 
          : lines;

        const expendiosData = dataLines.map(line => {
          const [archivo, nombrePropietario, ubicacion, tipo, activo] = line.split(',').map(s => s.trim());
          return {
            archivo: archivo || null,
            nombrePropietario,
            ubicacion,
            tipo: tipo || 'KIOSKO',
            activo: activo?.toLowerCase() !== 'false',
          };
        });

        const response = await fetch('/api/expendios/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ expendios: expendiosData }),
        });

        const result = await response.json();
        
        if (response.ok) {
          toast.success(result.message);
          await fetchExpendios();
          setShowBulkUploadModal(false);
        } else {
          toast.error(result.error || 'Error en la carga masiva');
          if (result.detalles) {
            console.error('Detalles de errores:', result.detalles);
          }
        }
      } catch (error) {
        console.error('Error al procesar archivo:', error);
        toast.error('Error al procesar el archivo CSV');
      }
    };
    reader.readAsText(file);
    
    // Limpiar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadCSVTemplate = () => {
    const template = 'archivo,nombrePropietario,ubicacion,tipo,activo\n' +
                     '1,Juan Pérez,Edificio T1,KIOSKO,true\n' +
                     '2,María López,Edificio T3,CAFETERIA,true\n' +
                     '3,Carlos Gómez,Parqueo Central,COMEDOR,true';
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_expendios.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Funciones para borrado masivo
  const toggleSelectExpendio = (id: number) => {
    setSelectedExpendios(prev => 
      prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedExpendios.length === filteredExpendios.length) {
      setSelectedExpendios([]);
    } else {
      setSelectedExpendios(filteredExpendios.map(e => e.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedExpendios.length === 0) {
      toast.error('Selecciona al menos un expendio');
      return;
    }

    try {
      const response = await fetch('/api/expendios/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedExpendios }),
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success(result.message);
        await fetchExpendios();
        setSelectedExpendios([]);
        setShowBulkDeleteModal(false);
      } else {
        toast.error(result.error || 'Error en el borrado masivo');
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      toast.error('Error de conexión');
    }
  };
  
  const filteredExpendios = expendios.filter((e) =>
    `${e.nombrePropietario} ${e.ubicacion} ${e.archivo}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Expendios</h1>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="btn-primary flex items-center space-x-2 text-sm sm:text-base flex-1 sm:flex-initial justify-center"
            >
              <Plus size={18} />
              <span>Nuevo</span>
            </button>
            <button
              onClick={() => setShowBulkUploadModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm sm:text-base flex-1 sm:flex-initial justify-center transition-colors"
            >
              <Upload size={18} />
              <span>Carga Masiva</span>
            </button>
            {selectedExpendios.length > 0 && (
              <button
                onClick={() => setShowBulkDeleteModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm sm:text-base flex-1 sm:flex-initial justify-center transition-colors"
              >
                <Trash size={18} />
                <span>Eliminar ({selectedExpendios.length})</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Search */}
        <div className="card mb-4 sm:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar expendio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 text-sm sm:text-base"
            />
          </div>
        </div>
        
        {/* Table */}
        <div className="card p-0 sm:p-6">
          {loading ? (
            <div className="p-6">
              <LoadingSpinner />
            </div>
          ) : filteredExpendios.length === 0 ? (
            <div className="text-center py-8 text-gray-500 px-4">No hay expendios registrados</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedExpendios.length === filteredExpendios.length && filteredExpendios.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Archivo</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propietario</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredExpendios.map((expendio) => (
                    <tr key={expendio.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <input
                          type="checkbox"
                          checked={selectedExpendios.includes(expendio.id)}
                          onChange={() => toggleSelectExpendio(expendio.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                        {expendio.archivo || '-'}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                        {expendio.nombrePropietario}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">
                        {expendio.ubicacion}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                        {expendio.tipo}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${expendio.activo ? 'badge-success' : 'badge-danger'}`}>
                          {expendio.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(expendio)}
                            className="text-primary-600 hover:text-primary-900 p-1"
                            title="Editar"
                          >
                            <Edit2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                          </button>
                          <button
                            onClick={() => handleDelete(expendio.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Eliminar"
                          >
                            <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold mb-4">
                {formData.id ? 'Editar Expendio' : 'Nuevo Expendio'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Número de Archivo</label>
                  <input
                    type="text"
                    value={formData.archivo}
                    onChange={(e) => setFormData({ ...formData, archivo: e.target.value })}
                    className="input"
                    placeholder="Opcional"
                  />
                </div>
                
                <div>
                  <label className="label">Nombre del Propietario *</label>
                  <input
                    type="text"
                    required
                    value={formData.nombrePropietario}
                    onChange={(e) => setFormData({ ...formData, nombrePropietario: e.target.value })}
                    className="input"
                  />
                </div>
                
                <div>
                  <label className="label">Ubicación *</label>
                  <input
                    type="text"
                    required
                    value={formData.ubicacion}
                    onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                    className="input"
                  />
                </div>
                
                <div>
                  <label className="label">Tipo</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="input"
                  >
                    <option value="KIOSKO">Kiosko</option>
                    <option value="CARRETA">Carreta</option>
                    <option value="MESA">Mesa</option>
                    <option value="FOTOCOPIADORA">Fotocopiadora</option>
                    <option value="LIBRERIA">Librería</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="activo"
                    checked={formData.activo}
                    onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="activo" className="text-sm text-gray-700">Activo</label>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
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

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false);
          setExpendioToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Eliminar Expendio"
        message="¿Estás seguro de que deseas eliminar este expendio? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Bulk Upload Modal */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Carga Masiva de Expendios</h2>
            <p className="text-gray-600 mb-4">
              Sube un archivo CSV con los datos de los expendios. El formato debe ser:
            </p>
            <code className="block bg-gray-100 p-2 rounded text-xs mb-4">
              archivo,nombrePropietario,ubicacion,tipo,activo
            </code>
            
            <div className="space-y-4">
              <button
                onClick={downloadCSVTemplate}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <Download size={18} />
                <span>Descargar Plantilla CSV</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleBulkUpload}
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <Upload size={18} />
                <span>Seleccionar Archivo CSV</span>
              </button>

              <button
                onClick={() => setShowBulkUploadModal(false)}
                className="w-full btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation */}
      <ConfirmDialog
        isOpen={showBulkDeleteModal}
        onClose={() => setShowBulkDeleteModal(false)}
        onConfirm={handleBulkDelete}
        title="Eliminar Múltiples Expendios"
        message={`¿Estás seguro de que deseas eliminar ${selectedExpendios.length} expendio${selectedExpendios.length > 1 ? 's' : ''}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar Todos"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
}
