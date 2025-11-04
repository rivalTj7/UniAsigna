export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner animado */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-400 rounded-full animate-spin-slow"></div>
        </div>
        
        {/* Texto de carga */}
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700 animate-pulse">
            Cargando...
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Por favor espera un momento
          </p>
        </div>
      </div>
    </div>
  );
}
