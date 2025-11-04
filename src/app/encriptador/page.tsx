'use client';

import { useState } from 'react';
import { Lock, Unlock, Copy, Check } from 'lucide-react';

export default function EncriptadorPage() {
  const [password, setPassword] = useState('');
  const [hashedPassword, setHashedPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const handleEncrypt = async () => {
    if (!password) {
      alert('Por favor ingresa una contraseña');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/tools/hash-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setHashedPassword(data.hashedPassword);
      } else {
        alert('Error al encriptar');
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(hashedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Encriptador de Contraseñas
          </h1>
          <p className="text-gray-600">
            Herramienta para hashear contraseñas con bcrypt
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="space-y-6">
            {/* Input de contraseña */}
            <div>
              <label className="label text-lg mb-2">
                Contraseña a Encriptar
              </label>
              <div className="relative">
                <Unlock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa la contraseña aquí"
                  className="input pl-10 text-lg"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Ejemplo: admin123, mipassword2024
              </p>
            </div>
            
            {/* Botón encriptar */}
            <button
              onClick={handleEncrypt}
              disabled={loading || !password}
              className="w-full btn-primary py-3 text-lg flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Encriptando...</span>
              ) : (
                <>
                  <Lock size={20} />
                  <span>Encriptar Contraseña</span>
                </>
              )}
            </button>
            
            {/* Resultado */}
            {hashedPassword && (
              <div className="mt-6">
                <label className="label text-lg mb-2">
                  Contraseña Encriptada (Hash)
                </label>
                <div className="relative">
                  <textarea
                    value={hashedPassword}
                    readOnly
                    rows={3}
                    className="input font-mono text-sm bg-gray-50"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="absolute top-3 right-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    title="Copiar"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {copied ? '✓ Copiado al portapapeles' : 'Haz click en el botón para copiar'}
                </p>
              </div>
            )}
            
            {/* Info */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                💡 Cómo usar:
              </h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Ingresa la contraseña que quieres encriptar</li>
                <li>Click en "Encriptar Contraseña"</li>
                <li>Copia el hash generado</li>
                <li>Úsalo directamente en SQL para insertar usuarios</li>
              </ol>
            </div>
            
            {/* Ejemplo de uso */}
            {hashedPassword && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  📝 Ejemplo de SQL:
                </h3>
                <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
{`INSERT INTO estudiantes 
(codigo, nombre, apellido, carnet, password, rol) 
VALUES 
('EST001', 'Juan', 'Pérez', '202212345', 
'${hashedPassword}', 
'USUARIO');`}
                </pre>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-8">
          <a href="/" className="text-purple-600 hover:text-purple-700 font-medium">
            ← Volver al Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
