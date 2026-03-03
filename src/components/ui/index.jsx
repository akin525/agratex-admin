import { Sparkles, Inbox, AlertCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';

// ─── Loading Spinner ─────────────────────────────────────────
export const LoadingSpinner = ({ size = 'lg', text = 'Loading...' }) => {
  const sizes = { sm: 'h-8 w-8', md: 'h-12 w-12', lg: 'h-16 w-16' };
  const iconSizes = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-6 h-6' };
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="relative">
        <div className={`animate-spin rounded-full ${sizes[size]} border-4 border-slate-700`}></div>
        <div className={`animate-spin rounded-full ${sizes[size]} border-4 border-t-purple-500 border-r-blue-500 border-b-transparent border-l-transparent absolute top-0 left-0`}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className={`${iconSizes[size]} text-purple-400 animate-pulse`} />
        </div>
      </div>
      {text && <p className="text-sm text-slate-400 animate-pulse">{text}</p>}
    </div>
  );
};

// ─── Empty State ─────────────────────────────────────────────
export const EmptyState = ({ icon: Icon = Inbox, title = 'No data found', description = '', action, actionLabel }) => (
  <div className="text-center py-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50">
    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700/50">
      <Icon className="w-8 h-8 text-slate-600" />
    </div>
    <p className="text-slate-300 text-lg font-semibold">{title}</p>
    {description && <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">{description}</p>}
    {action && (
      <button onClick={action} className="mt-4 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition-all text-sm font-medium">
        {actionLabel || 'Take Action'}
      </button>
    )}
  </div>
);

// ─── Error State ─────────────────────────────────────────────
export const ErrorState = ({ message = 'Something went wrong', onRetry }) => (
  <div className="text-center py-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-red-500/20">
    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
    <p className="text-slate-300 text-lg font-semibold">Error</p>
    <p className="text-slate-500 text-sm mt-1">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="mt-4 px-6 py-2.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-all text-sm font-medium">
        Try Again
      </button>
    )}
  </div>
);

// ─── Page Header ─────────────────────────────────────────────
export const PageHeader = ({ icon: Icon, title, description, gradient = 'from-purple-600 to-blue-600', children }) => (
  <div className="relative">
    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl blur-3xl"></div>
    <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 md:p-8 border border-slate-700/50 overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30`}>
              <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
          )}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {title}
            </h1>
            {description && <p className="text-slate-400 mt-1 text-sm">{description}</p>}
          </div>
        </div>
        {children && <div className="flex items-center gap-3 flex-wrap">{children}</div>}
      </div>
    </div>
  </div>
);

// ─── Stat Card ───────────────────────────────────────────────
export const StatCard = ({ title, value, icon: Icon, gradient, subtitle, onClick, badge }) => (
  <div
    onClick={onClick}
    className={`relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700/50 shadow-xl hover:border-slate-600 transition-all group overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
  >
    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-10 blur-2xl rounded-full group-hover:opacity-20 transition-opacity`}></div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {badge && (
          <span className="px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full">
            {badge}
          </span>
        )}
      </div>
      <p className="text-slate-400 text-xs mb-1">{title}</p>
      <p className="text-xl font-bold text-white">{value}</p>
      {subtitle && <p className={`text-sm font-medium bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>{subtitle}</p>}
    </div>
  </div>
);

// ─── Status Badge ────────────────────────────────────────────
export const StatusBadge = ({ status, size = 'sm' }) => {
  const configs = {
    active: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30', label: 'Active' },
    inactive: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', label: 'Inactive' },
    blocked: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', label: 'Blocked' },
    pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', label: 'Pending' },
    success: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30', label: 'Success' },
    failed: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', label: 'Failed' },
    expired: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30', label: 'Expired' },
    running: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', label: 'Running' },
    completed: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30', label: 'Completed' },
    withdrawn: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', label: 'Withdrawn' },
    cancelled: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', label: 'Cancelled' },
    credit: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30', label: '+ Credit' },
    debit: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', label: '- Debit' },
    1: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30', label: 'Active' },
    0: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', label: 'Disabled' },
  };
  const config = configs[status] || { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30', label: String(status) };
  const sizeClass = size === 'xs' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`${sizeClass} rounded-full font-semibold border ${config.bg} ${config.text} ${config.border} inline-flex items-center gap-1 capitalize`}>
      {config.label}
    </span>
  );
};

// ─── Pagination ──────────────────────────────────────────────
export const Pagination = ({ currentPage, lastPage, total, perPage, onPageChange }) => {
  if (!lastPage || lastPage <= 1) return null;
  const from = (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, total);

  const getPages = () => {
    const pages = [];
    const delta = 2;
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(lastPage - 1, currentPage + delta);

    pages.push(1);
    if (left > 2) pages.push('...');
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < lastPage - 1) pages.push('...');
    if (lastPage > 1) pages.push(lastPage);
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-700/50">
      <p className="text-sm text-slate-400">
        Showing <span className="font-semibold text-white">{from}</span> to <span className="font-semibold text-white">{to}</span> of <span className="font-semibold text-white">{total}</span> results
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {getPages().map((page, i) =>
          page === '...' ? (
            <span key={`dots-${i}`} className="px-2 text-slate-500">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                page === currentPage
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= lastPage}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ─── Modal ───────────────────────────────────────────────────
export const Modal = ({ isOpen, onClose, title, icon: Icon, iconGradient = 'from-purple-600 to-blue-600', children, maxWidth = 'max-w-lg' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9997] p-4" onClick={onClose}>
      <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 w-full ${maxWidth} shadow-2xl animate-scaleIn max-h-[90vh] flex flex-col`} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={`w-10 h-10 bg-gradient-to-br ${iconGradient} rounded-xl flex items-center justify-center shadow-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            )}
            <h3 className="text-lg font-bold text-white">{title}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
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

// ─── Search Input ────────────────────────────────────────────
export const SearchInput = ({ value, onChange, placeholder = 'Search...', className = '' }) => (
  <div className={`relative ${className}`}>
    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition"
    />
  </div>
);

// ─── Filter Chip ─────────────────────────────────────────────
export const FilterChip = ({ label, active, onClick, count }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
      active
        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20'
        : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:text-white hover:border-slate-600'
    }`}
  >
    {label}
    {count !== undefined && (
      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${active ? 'bg-white/20' : 'bg-slate-700'}`}>
        {count}
      </span>
    )}
  </button>
);

// ─── Form Input ──────────────────────────────────────────────
export const FormInput = ({ label, error, ...props }) => (
  <div>
    {label && <label className="block text-sm font-semibold text-slate-300 mb-2">{label}</label>}
    <input
      {...props}
      className={`w-full px-4 py-2.5 bg-slate-900/50 border ${error ? 'border-red-500/50' : 'border-slate-600'} rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition ${props.className || ''}`}
    />
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

// ─── Form Select ─────────────────────────────────────────────
export const FormSelect = ({ label, error, children, ...props }) => (
  <div>
    {label && <label className="block text-sm font-semibold text-slate-300 mb-2">{label}</label>}
    <select
      {...props}
      className={`w-full px-4 py-2.5 bg-slate-900/50 border ${error ? 'border-red-500/50' : 'border-slate-600'} rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition appearance-none ${props.className || ''}`}
    >
      {children}
    </select>
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

// ─── Button ──────────────────────────────────────────────────
export const Button = ({ children, variant = 'primary', size = 'md', loading = false, icon: Icon, ...props }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/20',
    secondary: 'bg-slate-700/50 text-slate-300 border border-slate-600/50 hover:bg-slate-700',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20',
    success: 'bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20',
    ghost: 'text-slate-400 hover:text-white hover:bg-slate-700/50',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`${variants[variant]} ${sizes[size]} rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${props.className || ''}`}
    >
      {loading ? <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" /> : Icon ? <Icon className="w-4 h-4" /> : null}
      {children}
    </button>
  );
};

// ─── Data Table ──────────────────────────────────────────────
export const DataTable = ({ columns, data, loading, emptyIcon, emptyTitle, emptyDescription, onRowClick }) => {
  if (loading) return <LoadingSpinner />;
  if (!data || data.length === 0) return <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700/50">
            {columns.map((col, i) => (
              <th key={i} className={`text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-slate-700/30 hover:bg-slate-800/50 transition ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex} className={`p-4 ${col.cellClassName || ''}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};