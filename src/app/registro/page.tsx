'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegistroPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    apellido: '',
    carnet: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validar contraseñas
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigo: formData.codigo,
          nombre: formData.nombre,
          apellido: formData.apellido,
          carnet: formData.carnet,
          password: formData.password,
        }),
      });
      
      const data = await response.json();

      if (data.success) {
        toast.success('Usuario registrado exitosamente');
        router.push('/login');
      } else {
        toast.error(data.error || 'Error al registrarse');
      }
    } catch (error) {
      toast.error('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image 
              src="/logo-laboratorio.webp" 
              alt="Laboratorio" 
              width={100} 
              height={100}
              priority
              quality={90}
              className="rounded-lg shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">UniAsigna</h1>
          <p className="text-gray-600 text-sm">
            Laboratorio de Control Microbiológico de Alimentos
          </p>
        </div>
        
        {/* Formulario de registro */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Crear Cuenta
          </h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label text-xs">Nombre *</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="input text-sm"
                  placeholder="Juan"
                />
              </div>
              
              <div>
                <label className="label text-xs">Apellido *</label>
                <input
                  type="text"
                  required
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  className="input text-sm"
                  placeholder="Pérez"
                />
              </div>
            </div>
            
            <div>
              <label className="label text-xs">Código de Estudiante *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  required
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  className="input pl-10 text-sm"
                  placeholder="EST001"
                />
              </div>
            </div>
            
            <div>
              <label className="label text-xs">Carnet Universitario *</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  required
                  value={formData.carnet}
                  onChange={(e) => setFormData({ ...formData, carnet: e.target.value })}
                  className="input pl-10 text-sm"
                  placeholder="202212345"
                />
              </div>
            </div>
            
            <div>
              <label className="label text-xs">Contraseña *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input pl-10 pr-10 text-sm"
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="label text-xs">Confirmar Contraseña *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="input pl-10 text-sm"
                  placeholder="Repite tu contraseña"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center space-x-2 py-3 mt-6"
            >
              {loading ? (
                <span>Registrando...</span>
              ) : (
                <>
                  <UserPlus size={20} />
                  <span>Crear Cuenta</span>
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Inicia sesión
              </a>
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>Universidad de San Carlos de Guatemala</p>
          <p className="mt-1">© 2025 UniAsigna</p>
        </div>
      </div>
    </div>
  );
}
