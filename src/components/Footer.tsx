'use client';

import { Heart, Github, Linkedin, Mail, Sparkles } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-auto border-t border-gray-700/50">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-900/10 to-transparent pointer-events-none"></div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Información del proyecto */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary-400" size={20} />
              <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                UniAsigna
              </h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Sistema de asignación y auditoría de expendios universitarios para el
              Laboratorio de Control Microbiológico de Alimentos.
            </p>
            <div className="inline-block px-3 py-1 bg-primary-900/30 border border-primary-700/50 rounded-full">
              <p className="text-primary-300 text-xs font-semibold">
                Universidad de San Carlos de Guatemala
              </p>
            </div>
          </div>

          {/* Información del laboratorio */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Laboratorio</h3>
            <div className="space-y-2">
              <p className="text-gray-300 text-sm font-medium">
                Laboratorio de Control Microbiológico de Alimentos
              </p>
              <div className="h-px bg-gradient-to-r from-gray-700 to-transparent"></div>
              <p className="text-gray-400 text-sm">
                Facultad de Ciencias Químicas y Farmacia
              </p>
              <p className="text-gray-400 text-sm font-semibold">
                USAC - Universidad de San Carlos
              </p>
            </div>
          </div>

          {/* Desarrollador */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <h3 className="text-xl font-bold text-white">Desarrollador</h3>
            <p className="text-gray-300 text-sm flex items-center gap-2">
              Desarrollado con
              <Heart className="inline text-red-500 animate-pulse" size={16} fill="currentColor" />
              por
            </p>
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-primary-600/20 to-primary-800/20 border border-primary-600/30 rounded-xl">
              <p className="text-white font-bold text-base">
                Rivaldo Alexander Tojín
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="mailto:rival.alex7@gmail.com"
                className="flex items-center justify-center w-10 h-10 bg-gray-800 hover:bg-primary-600 text-gray-300 hover:text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary-500/50 hover:scale-110"
                title="Email"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
              <a
                href="https://github.com/rivalTj7"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-gray-800 hover:bg-primary-600 text-gray-300 hover:text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary-500/50 hover:scale-110"
                title="GitHub"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/rivaldo-tojín-54286b307"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-gray-800 hover:bg-primary-600 text-gray-300 hover:text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary-500/50 hover:scale-110"
                title="LinkedIn"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="relative mt-10 pt-8 border-t border-gray-700/50">
          <div className="text-center space-y-2">
            <p className="text-gray-400 text-sm font-medium">
              © {currentYear} UniAsigna. Todos los derechos reservados.
            </p>
            <p className="text-gray-500 text-xs">
              Desarrollado por Rivaldo Alexander Tojín
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
