import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const TOAST_TYPES = {
  success: { icon: CheckCircle, bg: 'from-green-500/20 to-green-600/10', border: 'border-green-500/30', text: 'text-green-400', iconColor: 'text-green-400' },
  error: { icon: XCircle, bg: 'from-red-500/20 to-red-600/10', border: 'border-red-500/30', text: 'text-red-400', iconColor: 'text-red-400' },
  warning: { icon: AlertTriangle, bg: 'from-yellow-500/20 to-yellow-600/10', border: 'border-yellow-500/30', text: 'text-yellow-400', iconColor: 'text-yellow-400' },
  info: { icon: Info, bg: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/30', text: 'text-blue-400', iconColor: 'text-blue-400' },
};

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type, duration }]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback({
    success: (msg, dur) => addToast(msg, 'success', dur),
    error: (msg, dur) => addToast(msg, 'error', dur),
    warning: (msg, dur) => addToast(msg, 'warning', dur),
    info: (msg, dur) => addToast(msg, 'info', dur),
  }, [addToast]);

  // Fix: toast needs to be an object with methods
  const value = {
    toast: {
      success: (msg, dur) => addToast(msg, 'success', dur),
      error: (msg, dur) => addToast(msg, 'error', dur ?? 5000),
      warning: (msg, dur) => addToast(msg, 'warning', dur),
      info: (msg, dur) => addToast(msg, 'info', dur),
    },
    removeToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => {
          const config = TOAST_TYPES[t.type] || TOAST_TYPES.info;
          const Icon = config.icon;
          return (
            <div
              key={t.id}
              className={`pointer-events-auto bg-gradient-to-r ${config.bg} backdrop-blur-xl border ${config.border} rounded-xl p-4 shadow-2xl flex items-start gap-3 animate-slideIn`}
            >
              <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
              <p className={`text-sm font-medium ${config.text} flex-1`}>{t.message}</p>
              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-500 hover:text-white transition p-0.5 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context.toast;
};

export default ToastProvider;