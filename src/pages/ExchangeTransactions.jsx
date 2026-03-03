import { useEffect, useState, useCallback } from 'react';
import axios from '../services/axios';
import { API_ENDPOINTS } from '../config/api';
import { useToast } from '../components/ui/Toast';
import { useDebounce } from '../hooks/useDebounce';
import { ArrowLeftRight, Eye, ArrowRight, ArrowDownUp, Calendar, Info } from 'lucide-react';
import { LoadingSpinner, PageHeader, SearchInput, Pagination, EmptyState, Modal } from '../components/ui';

// Helper for status colors - keeps the JSX clean
const getStatusStyles = (status) => {
  const styles = {
    completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    failed: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };
  return styles[status?.toLowerCase()] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';
};

const ExchangeTransactions = () => {
  const toast = useToast();
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [selectedExchange, setSelectedExchange] = useState(null);

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Memoized fetch function to prevent recreation on every render
  const fetchExchanges = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(API_ENDPOINTS.EXCHANGE_TRANSACTIONS, {
        params: {
          page: currentPage,
          search: debouncedSearch || undefined, // undefined prevents sending empty keys
        },
      });

      if (data.success) {
        const d = data.data;
        setExchanges(d.data || []);
        setPagination({
          currentPage: d.current_page,
          lastPage: d.last_page,
          total: d.total,
          perPage: d.per_page,
        });
      }
    } catch (error) {
      toast.error('Unable to sync transaction history');
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, toast]);

  // Reset page to 1 only when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchExchanges();
  }, [fetchExchanges]);

  return (
      <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-8 animate-in fade-in duration-500">
        <PageHeader
            icon={ArrowLeftRight}
            title="Exchange Desk"
            description="Monitor and manage cross-currency liquidities"
            gradient="from-indigo-500 to-purple-600"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full shadow-inner">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
            <span className="text-xs font-bold text-slate-300 tracking-tight uppercase">
            {pagination?.total || 0} Records Found
          </span>
          </div>
        </PageHeader>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search TxID, User or Currency..."
              className="w-full sm:w-96 ring-1 ring-slate-700/50 focus-within:ring-indigo-500/50 transition-all"
          />
          {/* Potentially add a Refresh button here */}
        </div>

        <div className="bg-slate-900/40 backdrop-blur-sm rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
          {loading ? (
              <div className="py-24"><LoadingSpinner text="Synchronizing Ledger..." /></div>
          ) : exchanges.length === 0 ? (
              <EmptyState icon={ArrowLeftRight} title="No transactions match your criteria" />
          ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                  <tr className="bg-slate-800/30 text-slate-400 text-[10px] uppercase tracking-[0.15em] font-bold">
                    <th className="p-5">Initiator</th>
                    <th className="p-5 text-center">Flow</th>
                    <th className="p-5">Conversion</th>
                    <th className="p-5 hidden md:table-cell">Net Fee</th>
                    <th className="p-5 hidden lg:table-cell">Timestamp</th>
                    <th className="p-5 text-right">Details</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                  {exchanges.map((ex) => (
                      <tr key={ex.id} className="group hover:bg-indigo-500/5 transition-colors cursor-default">
                        <td className="p-5">
                          <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                          {ex.user?.name || `UID: ${ex.user_id}`}
                        </span>
                            <span className="text-xs text-slate-500">{ex.user?.email}</span>
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center justify-center gap-3">
                            <span className="w-10 text-center text-xs font-black py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">{ex.from_currency}</span>
                            <ArrowRight className="w-3 h-3 text-indigo-500" />
                            <span className="w-10 text-center text-xs font-black py-1 rounded bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">{ex.to_currency}</span>
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="flex flex-col">
                        <span className="text-sm font-mono text-white tracking-tighter">
                          {parseFloat(ex.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                            <span className="text-[10px] text-emerald-400 font-bold">
                          +{parseFloat(ex.received_amount).toLocaleString()} {ex.to_currency}
                        </span>
                          </div>
                        </td>
                        <td className="p-5 hidden md:table-cell">
                      <span className="text-xs font-medium text-slate-400">
                        {parseFloat(ex.fee).toLocaleString()} <span className="text-[10px] opacity-50">{ex.from_currency}</span>
                      </span>
                        </td>
                        <td className="p-5 hidden lg:table-cell text-xs text-slate-500">
                          {new Date(ex.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-5 text-right">
                          <button
                              onClick={() => setSelectedExchange(ex)}
                              className="p-2.5 bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-xl transition-all shadow-lg"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}
          <div className="p-4 border-t border-white/5 bg-slate-800/20">
            {pagination && <Pagination {...pagination} onPageChange={setCurrentPage} />}
          </div>
        </div>

        {/* Improved Detail View */}
        <Modal
            isOpen={!!selectedExchange}
            onClose={() => setSelectedExchange(null)}
            title="Transaction Intelligence"
            icon={Info}
        >
          {selectedExchange && (
              <div className="space-y-6">
                <div className="relative overflow-hidden bg-slate-950 rounded-2xl border border-white/5 p-8 text-center">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <ArrowLeftRight className="w-24 h-24" />
                  </div>

                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Debit</span>
                      <span className="text-2xl font-bold text-white">{selectedExchange.amount}</span>
                      <span className="text-xs font-bold text-indigo-400">{selectedExchange.from_currency}</span>
                    </div>
                    <div className="h-px flex-1 mx-4 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Credit</span>
                      <span className="text-2xl font-bold text-emerald-400">{selectedExchange.received_amount}</span>
                      <span className="text-xs font-bold text-emerald-500">{selectedExchange.to_currency}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <DetailCard label="Exchange Rate" value={`1:${parseFloat(selectedExchange.rate).toFixed(4)}`} icon={ArrowDownUp} />
                  <DetailCard label="Processing Fee" value={selectedExchange.fee} icon={ArrowLeftRight} />
                  <DetailCard label="Date" value={new Date(selectedExchange.created_at).toLocaleDateString()} icon={Calendar} />
                  <DetailCard label="Reference ID" value={`#${selectedExchange.id}`} icon={Info} />
                </div>
              </div>
          )}
        </Modal>
      </div>
  );
};

// Sub-component for modal details
const DetailCard = ({ label, value, icon: Icon }) => (
    <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-3 h-3 text-slate-500" />
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{label}</span>
      </div>
      <div className="text-sm font-semibold text-slate-200">{value}</div>
    </div>
);

export default ExchangeTransactions;