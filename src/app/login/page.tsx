'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginSchema, type LoginFormData } from '@/lib/validations/schemas';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        // La cookie httpOnly ya fue establecida por el servidor
        toast.success('Inicio de sesión exitoso');
        // Redirigir al dashboard
        router.push('/');
      } else {
        toast.error(responseData.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      toast.error('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-300"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-500"></div>
      </div>

      <div className="max-w-md w-full relative z-10 animate-fade-in-up">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-blue-400 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-white p-4 rounded-2xl shadow-2xl ring-4 ring-white/50">
                <Image
                  src="/logo-laboratorio.webp"
                  alt="Laboratorio"
                  width={80}
                  height={80}
                  priority
                  quality={90}
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary-600 via-blue-600 to-primary-700 bg-clip-text text-transparent mb-3">
            UniAsigna
          </h1>
          <p className="text-gray-600 text-sm sm:text-base font-medium flex items-center justify-center gap-2">
            <ShieldCheck size={16} className="text-primary-500" />
            Sistema de Auditoría de Expendios
          </p>
        </div>

        {/* Formulario de login */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/20">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="text-primary-500" size={24} />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Iniciar Sesión
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label text-gray-700">
                Código de Estudiante
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                <input
                  type="text"
                  {...register('codigo')}
                  className={`input pl-12 ${errors.codigo ? 'input-error' : ''}`}
                  placeholder="Ej: EST001"
                  disabled={loading}
                />
              </div>
              {errors.codigo && (
                <p className="text-red-600 text-xs sm:text-sm mt-2 flex items-center gap-1 animate-fade-in">
                  <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.codigo.message}
                </p>
              )}
            </div>

            <div>
              <label className="label text-gray-700">
                Contraseña
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`input pl-12 pr-12 ${errors.password ? 'input-error' : ''}`}
                  placeholder="Tu contraseña"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-xs sm:text-sm mt-2 flex items-center gap-1 animate-fade-in">
                  <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 text-base sm:text-lg mt-6"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Iniciar Sesión</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-center text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link
                href="/registro"
                className="text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-all"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2 text-xs sm:text-sm text-gray-600 animate-fade-in animation-delay-150">
          <p className="font-medium">Universidad de San Carlos de Guatemala</p>
          <p className="text-gray-500">© 2025 UniAsigna - Todos los derechos reservados</p>
        </div>
      </div>
    </div>
  );
}
