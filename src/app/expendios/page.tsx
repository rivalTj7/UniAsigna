'use client';
import { useAuth } from '@/lib/hooks/useAuth';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

interface Expendio {
  id: number;
  archivo?: string;
  nombrePropietario: string;
  ubicacion: string;
  tipo: string;
  activo: boolean;
}

export default function ExpendiosPage() {
  useAuth(); // Protección de autenticación
  const [expendios, setExpendios] = useState<Expendio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    id: null as number | null,
    archivo: '',
    nombrePropietario: '',
    ubicacion: '',
    tipo: 'KIOSKO',
    activo: true,
  });
  
  useEffect(() => {
    fetchExpendios();
  }, []);
  
  const fetchExpendios = async () => {
    try {
      const response = await fetch('/api/expendios');
      const data = await response.json();
      setExpendios(data);
    } catch (error) {
      console.error('Error al cargar expendios:', error);
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
      } else {
        const error = await response.json();
        alert(error.error || 'Error al guardar expendio');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar expendio');
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
  
  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este expendio?')) return;
    
    try {
      const response = await fetch(`/api/expendios/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchExpendios();
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
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
  
  const filteredExpendios = expendios.filter((e) =>
    `${e.nombrePropietario} ${e.ubicacion} ${e.archivo}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Expendios</h1>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Nuevo Expendio</span>
          </button>
        </div>
        
        {/* Search */}
        <div className="card mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por propietario, ubicación o archivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>
        
        {/* Table */}
        <div className="card overflow-x-auto">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Cargando...</div>
          ) : filteredExpendios.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No hay expendios registrados</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Archivo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Propietario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ubicación</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredExpendios.map((expendio) => (
                  <tr key={expendio.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {expendio.archivo || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {expendio.nombrePropietario}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {expendio.ubicacion}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {expendio.tipo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={expendio.activo ? 'badge-success' : 'badge-danger'}>
                        {expendio.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(expendio)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(expendio.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    </div>
  );
}
