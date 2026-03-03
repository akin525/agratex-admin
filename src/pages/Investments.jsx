import { useEffect, useState } from 'react';
import axios from '../services/axios';
import { API_ENDPOINTS } from '../config/api';
import { useToast } from '../components/ui/Toast';
import { TrendingUp, Eye, DollarSign, Clock, CheckCircle, XCircle, Calendar, User } from 'lucide-react';
import { LoadingSpinner, PageHeader, EmptyState, FilterChip, Pagination, Modal, StatusBadge } from '../components/ui';

const Investments = () => {
  const toast = useToast();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { setCurrentPage(1); }, [statusFilter]);
  useEffect(() => { fetchInvestments(); }, [currentPage, statusFilter]);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const status = statusFilter === 'all' ? 'all' : statusFilter;
      const response = await axios.get(`${API_ENDPOINTS.INVESTMENTS(status)}?page=${currentPage}`);
      if (response.data.success) {
        const d = response.data.data;
        setInvestments(d.data || d || []);
        if (d.last_page) setPagination({ currentPage: d.current_page, lastPage: d.last_page, total: d.total, perPage: d.per_page });
        else setPagination(null);
      }
    } catch (error) {
      toast.error('Failed to load investments');
    } finally {
      setLoading(false);
    }
  };

  const viewInvestment = async (inv) => {
    try {
      const response = await axios.get(API_ENDPOINTS.INVESTMENT_DETAILS(inv.id));
      if (response.data.success) {
        setSelectedInvestment(response.data.data);
        setShowModal(true);
      }
    } catch {
      setSelectedInvestment(inv);
      setShowModal(true);
    }
  };

  const getStatusColor = (status) => {
    const map = {
      running: 'bg-green-500/10 text-green-400 border-green-500/30',
      completed: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      cancelled: 'bg-red-500/10 text-red-400 border-red-500/30',
      pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    };
    return map[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/30';
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader icon={TrendingUp} title="Investments" description="Manage user investments" gradient="from-orange-500 to-red-500">
        <div className="px-3 py-1.5 bg-orange-500/10 text-orange-400 border border-orange-500/30 rounded-lg font-medium text-sm">
          {pagination?.total || investments.length} total
        </div>
      </PageHeader>

      {/* Status Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {['all', 'running', 'completed', 'cancelled'].map((s) => (
          <FilterChip key={s} label={s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)} active={statusFilter === s} onClick={() => setStatusFilter(s)} />
        ))}
      </div>

      {/* Table */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
        {loading ? <LoadingSpinner text="Loading investments..." /> : investments.length === 0 ? (
          <EmptyState icon={TrendingUp} title="No investments found" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Plan</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Profit</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Date</th>
                    <th className="text-right p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map((inv) => (
                    <tr key={inv.id} className="border-b border-slate-700/30 hover:bg-slate-800/50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{inv.user?.username || inv.user?.email || `User #${inv.user_id}`}</p>
                            <p className="text-slate-500 text-xs">ID: {inv.user_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300 text-sm">{inv.plan?.name || `Plan #${inv.plan_id}`}</td>
                      <td className="p-4 text-white text-sm font-semibold">${parseFloat(inv.amount || 0).toLocaleString()}</td>
                      <td className="p-4 hidden md:table-cell text-green-400 text-sm font-medium">${parseFloat(inv.profit || 0).toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(inv.status)}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-4 hidden lg:table-cell text-slate-400 text-xs">{inv.created_at ? new Date(inv.created_at).toLocaleDateString() : '-'}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => viewInvestment(inv)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pagination && <Pagination {...pagination} onPageChange={setCurrentPage} />}
          </>
        )}
      </div>

      {/* Detail Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Investment Details" icon={TrendingUp} iconGradient="from-orange-500 to-red-500">
        {selectedInvestment && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'User', value: selectedInvestment.user?.username || selectedInvestment.user?.email || `#${selectedInvestment.user_id}` },
                { label: 'Plan', value: selectedInvestment.plan?.name || `#${selectedInvestment.plan_id}` },
                { label: 'Amount', value: `$${parseFloat(selectedInvestment.amount || 0).toLocaleString()}` },
                { label: 'Profit', value: `$${parseFloat(selectedInvestment.profit || 0).toLocaleString()}` },
                { label: 'Status', value: selectedInvestment.status },
                { label: 'Duration', value: selectedInvestment.plan?.duration ? `${selectedInvestment.plan.duration} days` : '-' },
                { label: 'Created', value: selectedInvestment.created_at ? new Date(selectedInvestment.created_at).toLocaleString() : '-' },
                { label: 'Expires', value: selectedInvestment.end_date ? new Date(selectedInvestment.end_date).toLocaleString() : '-' },
              ].map((item, i) => (
                <div key={i} className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/30">
                  <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                  <p className="text-white text-sm font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Investments;