import { AlertTriangle, X, Trash2, CheckCircle, Ban, Shield } from 'lucide-react';

const VARIANTS = {
  danger: {
    icon: Trash2,
    iconBg: 'bg-red-500/10',
    iconColor: 'text-red-400',
    buttonBg: 'from-red-600 to-red-700 hover:from-red-500 hover:to-red-600',
    buttonShadow: 'shadow-red-500/20',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-yellow-500/10',
    iconColor: 'text-yellow-400',
    buttonBg: 'from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500',
    buttonShadow: 'shadow-yellow-500/20',
  },
  success: {
    icon: CheckCircle,
    iconBg: 'bg-green-500/10',
    iconColor: 'text-green-400',
    buttonBg: 'from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500',
    buttonShadow: 'shadow-green-500/20',
  },
  block: {
    icon: Ban,
    iconBg: 'bg-red-500/10',
    iconColor: 'text-red-400',
    buttonBg: 'from-red-600 to-red-700 hover:from-red-500 hover:to-red-600',
    buttonShadow: 'shadow-red-500/20',
  },
  info: {
    icon: Shield,
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
    buttonBg: 'from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500',
    buttonShadow: 'shadow-blue-500/20',
  },
};

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) => {
  if (!isOpen) return null;

  const config = VARIANTS[variant] || VARIANTS.danger;
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9998] p-4" onClick={onClose}>
      <div
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 w-full max-w-md shadow-2xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 ${config.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{message}</p>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-slate-700 rounded-lg transition flex-shrink-0">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-700 transition-all text-sm font-medium border border-slate-600/50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${config.buttonBg} text-white rounded-xl transition-all text-sm font-semibold shadow-lg ${config.buttonShadow} flex items-center justify-center gap-2 disabled:opacity-50`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : null}
            {confirmText}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn { animation: scaleIn 0.2s ease-out; }
      `}</style>
    </div>
  );
};

export default ConfirmDialog;