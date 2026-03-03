import { useEffect, useState } from 'react';
import axios from '../services/axios';
import { API_ENDPOINTS } from '../config/api';
import { useToast } from '../components/ui/Toast';
import { useDebounce } from '../hooks/useDebounce';
import {
  Receipt, Eye, ArrowUpRight, ArrowDownRight, Search,
  XCircle, Filter, ChevronLeft, ChevronRight, Download
} from 'lucide-react';
import { PageHeader, StatusBadge, Pagination, EmptyState } from '../components/ui';

const CATEGORIES = ['all', 'deposit', 'staking', 'exchange', 'profit', 'referral', 'withdrawal', 'admin_adjustment', 'agr_adjustment', 'bonus', 'transfer', 'fee', 'penalty', 'reward', 'commission', 'refund', 'other'];

// --- SLEEK LEDGER SKELETON ---
const LedgerSkeleton = () => (
    <div className="w-full animate-pulse">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="flex items-center gap-6 px-6 py-4 border-b border-white/[0.04]">
            <div className="w-8 h-8 rounded-full bg-white/[0.05] shrink-0"></div>
            <div className="space-y-2 w-[200px]">
              <div className="h-4 bg-white/[0.05] rounded w-3/4"></div>
              <div className="h-3 bg-white/[0.05] rounded w-1/2"></div>
            </div>
            <div className="h-5 bg-white/[0.05] rounded-full w-24 hidden md:block"></div>
            <div className="h-4 bg-white/[0.05] rounded w-24 hidden lg:block"></div>
            <div className="h-4 bg-white/[0.05] rounded w-20 hidden xl:block"></div>
            <div className="h-6 bg-white/[0.05] rounded-md w-24 ml-auto"></div>
          </div>
      ))}
    </div>
);

const Transactions = () => {
  const toast = useToast();

  // State
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  // Modal
  const [selectedTx, setSelectedTx] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, typeFilter, categoryFilter]);

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, debouncedSearch, typeFilter, categoryFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: currentPage });
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (typeFilter !== 'all') params.append('type', typeFilter);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);

      const response = await axios.get(`${API_ENDPOINTS.TRANSACTIONS}?${params}`);
      if (response.data.success) {
        const d = response.data.data;
        setTransactions(d.data || []);
        if (d.last_page) {
          setPagination({ currentPage: d.current_page, lastPage: d.last_page, total: d.total, perPage: d.per_page });
        }
      }
    } catch (error) {
      toast.error('Failed to load transaction ledger');
    } finally {
      setLoading(false);
    }
  };

  // Avatar helper
  const getAvatarColor = (name) => {
    const colors = ['bg-indigo-500/10 text-indigo-400 ring-indigo-500/20', 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20', 'bg-blue-500/10 text-blue-400 ring-blue-500/20', 'bg-amber-500/10 text-amber-400 ring-amber-500/20'];
    return colors[(name ? name.length : 0) % colors.length];
  };

  return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {/* --- HEADER --- */}
        <PageHeader
            icon={Receipt}
            title="Transaction Ledger"
            description="Comprehensive log of all financial movements across the platform."
        >
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 ring-1 ring-inset ring-white/10 rounded-lg text-sm font-medium transition-colors">
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-700/50 rounded-lg shadow-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
              <span className="text-sm font-medium text-slate-300">
              {pagination?.total || transactions.length} Records
            </span>
            </div>
          </div>
        </PageHeader>

        {/* --- CONTROL BAR --- */}
        <div className="bg-slate-900/50 ring-1 ring-inset ring-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-sm">

          {/* Top Row: Search & Type Filter */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:max-w-md group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by reference ID or user..."
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="flex items-center w-full md:w-auto p-1 bg-white/5 rounded-lg border border-white/10">
              {['all', 'credit', 'debit'].map((t) => (
                  <button
                      key={t}
                      onClick={() => setTypeFilter(t)}
                      className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${
                          typeFilter === t
                              ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10'
                              : 'text-slate-400 hover:text-slate-200'
                      }`}
                  >
                    {t === 'all' ? 'All Types' : t}
                  </button>
              ))}
            </div>
          </div>

          {/* Bottom Row: Scrollable Categories */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <Filter className="w-4 h-4 text-slate-500 shrink-0 mr-1" />
            {CATEGORIES.map((c) => (
                <button
                    key={c}
                    onClick={() => setCategoryFilter(c)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                        categoryFilter === c
                            ? 'bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20'
                            : 'text-slate-400 hover:bg-white/5 hover:text-slate-300'
                    }`}
                >
                  {c === 'all' ? 'All Categories' : c.replace(/_/g, ' ')}
                </button>
            ))}
          </div>
        </div>

        {/* --- LEDGER TABLE --- */}
        <div className="bg-slate-900 ring-1 ring-inset ring-white/10 shadow-xl sm:rounded-2xl overflow-hidden">
          {loading ? (
              <LedgerSkeleton />
          ) : transactions.length === 0 ? (
              <div className="py-24">
                <EmptyState icon={Receipt} title="No transactions found" description="Try adjusting your search or filters." />
              </div>
          ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-900/50 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-slate-500 text-[10px] uppercase tracking-widest w-12">Dir</th>
                    <th className="px-6 py-4 font-semibold text-slate-500 text-[10px] uppercase tracking-widest">User Entity</th>
                    <th className="px-6 py-4 font-semibold text-slate-500 text-[10px] uppercase tracking-widest hidden md:table-cell">Category</th>
                    <th className="px-6 py-4 font-semibold text-slate-500 text-[10px] uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-4 font-semibold text-slate-500 text-[10px] uppercase tracking-widest hidden lg:table-cell">Wallet</th>
                    <th className="px-6 py-4 font-semibold text-slate-500 text-[10px] uppercase tracking-widest hidden xl:table-cell">Balance After</th>
                    <th className="px-6 py-4 font-semibold text-slate-500 text-[10px] uppercase tracking-widest hidden md:table-cell text-right">Date</th>
                    <th className="px-6 py-4 font-semibold text-slate-500 text-[10px] uppercase tracking-widest text-right">Log</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                  {transactions.map((tx) => {
                    const isCredit = tx.type === 'credit';

                    return (
                        <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">

                          {/* Direction Icon */}
                          <td className="px-6 py-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ring-1 ring-inset ${
                                isCredit ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20' : 'bg-rose-500/10 text-rose-400 ring-rose-500/20'
                            }`}>
                              {isCredit ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            </div>
                          </td>

                          {/* User */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ring-1 ring-inset shrink-0 ${getAvatarColor(tx.user?.username)}`}>
                                {(tx.user?.name || 'U').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-slate-200 font-medium text-sm leading-tight">
                                  {tx.user?.name || tx.user?.username || `ID: #${tx.user_id}`}
                                </p>
                                <p className="text-slate-500 text-xs mt-0.5">{tx.user?.email || '—'}</p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="px-6 py-4 hidden md:table-cell">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white/5 text-slate-300 capitalize ring-1 ring-inset ring-white/10">
                          {(tx.category || 'other').replace(/_/g, ' ')}
                        </span>
                          </td>

                          {/* Amount (Monospace Tabular) */}
                          <td className="px-6 py-4">
                        <span className={`font-mono text-sm font-semibold tabular-nums ${isCredit ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isCredit ? '+' : '-'}${parseFloat(tx.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                          </td>

                          {/* Wallet */}
                          <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                          {tx.wallet || '—'}
                        </span>
                          </td>

                          {/* Balance After */}
                          <td className="px-6 py-4 hidden xl:table-cell">
                        <span className="text-slate-300 font-mono text-sm tabular-nums">
                          ${parseFloat(tx.balance_after || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                          </td>

                          {/* Date */}
                          <td className="px-6 py-4 hidden md:table-cell text-right">
                        <span className="text-slate-400 text-sm">
                          {new Date(tx.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                          </td>

                          {/* Action */}
                          <td className="px-6 py-4 text-right">
                            <button
                                onClick={() => { setSelectedTx(tx); setShowModal(true); }}
                                className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                title="View Receipt"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                    );
                  })}
                  </tbody>
                </table>
              </div>
          )}

          {/* Pagination */}
          {!loading && pagination && transactions.length > 0 && (
              <div className="border-t border-white/10 bg-slate-900/50 p-4">
                <Pagination
                    currentPage={pagination.currentPage}
                    lastPage={pagination.lastPage}
                    total={pagination.total}
                    perPage={pagination.perPage}
                    onPageChange={setCurrentPage}
                />
              </div>
          )}
        </div>

        {/* --- SLEEK RECEIPT MODAL --- */}
        {showModal && selectedTx && (
            <div className="fixed inset-0 bg-[#0A0A0A]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
              <div className="bg-slate-900 ring-1 ring-inset ring-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>

                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-white/10 bg-slate-900/50 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-slate-400" /> Digital Receipt
                  </h3>
                  <button onClick={() => setShowModal(false)} className="p-1 hover:bg-white/10 rounded-md transition-colors text-slate-400 hover:text-white">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                {/* Main Modal Content */}
                <div className="p-6">

                  {/* Highlight Amount */}
                  <div className="flex flex-col items-center justify-center py-6 mb-6 bg-white/[0.02] rounded-xl ring-1 ring-inset ring-white/5">
                    <span className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">Net Amount</span>
                    <span className={`text-4xl font-mono font-bold tracking-tight ${selectedTx.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selectedTx.type === 'credit' ? '+' : '-'}${parseFloat(selectedTx.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                  </div>

                  {/* Data List */}
                  <dl className="space-y-4 text-sm">
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <dt className="text-slate-400">Transaction ID</dt>
                      <dd className="text-slate-200 font-mono">#{selectedTx.id}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <dt className="text-slate-400">Reference</dt>
                      <dd className="text-slate-200 font-mono text-xs mt-0.5">{selectedTx.reference || '—'}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <dt className="text-slate-400">Category</dt>
                      <dd className="text-slate-200 capitalize">{(selectedTx.category || 'other').replace(/_/g, ' ')}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <dt className="text-slate-400">Target Wallet</dt>
                      <dd className="text-slate-200 uppercase font-semibold">{selectedTx.wallet || '—'}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <dt className="text-slate-400">Associated User</dt>
                      <dd className="text-slate-200">{selectedTx.user?.name || `User #${selectedTx.user_id}`}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <dt className="text-slate-400">Balance Before</dt>
                      <dd className="text-slate-400 font-mono">${parseFloat(selectedTx.balance_before || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <dt className="text-slate-400">Balance After</dt>
                      <dd className="text-slate-200 font-mono font-medium">${parseFloat(selectedTx.balance_after || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</dd>
                    </div>
                    <div className="flex justify-between py-2">
                      <dt className="text-slate-400">Timestamp</dt>
                      <dd className="text-slate-400 text-right">
                        {new Date(selectedTx.created_at).toLocaleDateString()} <br/>
                        <span className="text-xs">{new Date(selectedTx.created_at).toLocaleTimeString()}</span>
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-white/10 bg-slate-900/50 flex justify-end">
                  <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-slate-200 transition-colors">
                    Close Receipt
                  </button>
                </div>

              </div>
            </div>
        )}
      </div>
  );
};

export default Transactions;