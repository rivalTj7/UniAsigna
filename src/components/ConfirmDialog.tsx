'use client';

import { AlertTriangle, X, AlertCircle, Info } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger'
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getTypeConfig = () => {
    switch (type) {
      case 'danger':
        return {
          icon: AlertCircle,
          iconColor: 'text-red-600',
          bg: 'bg-gradient-to-br from-red-50 to-red-100',
          border: 'border-red-300',
          button: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-lg shadow-red-500/30',
          iconBg: 'bg-red-100',
          ringColor: 'ring-red-200'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-yellow-600',
          bg: 'bg-gradient-to-br from-yellow-50 to-amber-100',
          border: 'border-yellow-300',
          button: 'bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-700 hover:to-amber-800 focus:ring-yellow-500 shadow-lg shadow-yellow-500/30',
          iconBg: 'bg-yellow-100',
          ringColor: 'ring-yellow-200'
        };
      case 'info':
        return {
          icon: Info,
          iconColor: 'text-blue-600',
          bg: 'bg-gradient-to-br from-blue-50 to-cyan-100',
          border: 'border-blue-300',
          button: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow-lg shadow-blue-500/30',
          iconBg: 'bg-blue-100',
          ringColor: 'ring-blue-200'
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in">
      {/* Overlay con blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-in overflow-hidden my-auto">
        {/* Header con gradiente */}
        <div className={`${config.bg} border-b ${config.border} px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-2xl`}>
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 ${config.iconBg} rounded-2xl ring-4 ${config.ringColor} shadow-lg flex-shrink-0`}>
              <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${config.iconColor}`} strokeWidth={2.5} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-lg transition-all flex-shrink-0 ml-2"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 sm:px-6 py-4 sm:py-5">
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="btn-secondary w-full sm:w-auto"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`btn text-white w-full sm:w-auto ${config.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
