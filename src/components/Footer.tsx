'use client';

import { Heart, Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Información del proyecto */}
          <div>
            <h3 className="text-lg font-bold mb-3">UniAsigna</h3>
            <p className="text-gray-400 text-sm">
              Sistema de asignación y auditoría de expendios universitarios para el 
              Laboratorio de Control Microbiológico de Alimentos.
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Universidad de San Carlos de Guatemala
            </p>
          </div>
          
          {/* Información del laboratorio */}
          <div>
            <h3 className="text-lg font-bold mb-3">Laboratorio</h3>
            <p className="text-gray-400 text-sm">
              Laboratorio de Control Microbiológico de Alimentos
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Facultad de Ingeniería
            </p>
            <p className="text-gray-400 text-sm">
              USAC - Universidad de San Carlos
            </p>
          </div>
          
          {/* Desarrollador */}
          <div>
            <h3 className="text-lg font-bold mb-3">Desarrollador</h3>
            <p className="text-gray-400 text-sm mb-3">
              Desarrollado con <Heart className="inline text-red-500" size={14} /> por
            </p>
            <p className="text-white font-semibold text-lg mb-2">
              Rivaldo Alexander Tojín
            </p>
            <div className="flex space-x-3">
              <a 
                href="mailto:rival.alex7@gmail.com" 
                className="text-gray-400 hover:text-white transition-colors"
                title="Email"
              >
                <Mail size={20} />
              </a>
              <a 
                href="https://github.com/RivaldoTJ" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://linkedin.com/in/rivaldo-tojin" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} UniAsigna. Todos los derechos reservados.
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Desarrollado para la Universidad de San Carlos de Guatemala
          </p>
        </div>
      </div>
    </footer>
  );
}
