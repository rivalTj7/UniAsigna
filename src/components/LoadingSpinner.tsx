export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px] animate-fade-in">
      <div className="flex flex-col items-center gap-6">
        {/* Spinner moderno con múltiples capas */}
        <div className="relative">
          {/* Capa externa - Gradiente azul */}
          <div className="w-20 h-20 border-4 border-transparent border-t-primary-600 border-r-primary-500 rounded-full animate-spin"></div>

          {/* Capa media - Anillo de pulso */}
          <div className="absolute inset-0 w-20 h-20 border-4 border-primary-200 rounded-full animate-pulse"></div>

          {/* Capa interna - Rotación lenta inversa */}
          <div className="absolute inset-2 w-16 h-16 border-4 border-transparent border-b-primary-400 border-l-primary-300 rounded-full animate-spin-slow"></div>

          {/* Punto central brillante */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full animate-pulse shadow-glow"></div>
          </div>
        </div>

        {/* Texto de carga con gradiente */}
        <div className="text-center space-y-2 animate-fade-in-up">
          <p className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent animate-pulse">
            Cargando...
          </p>
          <p className="text-sm text-gray-500">
            Por favor espera un momento
          </p>

          {/* Barra de progreso animada */}
          <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden mt-4">
            <div className="h-full bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
