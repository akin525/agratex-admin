import { useEffect, useState } from 'react';
import axios from '../services/axios';
import { API_ENDPOINTS } from '../config/api';
import { useToast } from '../components/ui/Toast';
import { useDebounce } from '../hooks/useDebounce';
import { Coins, Eye, TrendingUp, DollarSign, Activity, User, Trash2, Edit, BarChart3 } from 'lucide-react';
import { LoadingSpinner, PageHeader, SearchInput, EmptyState, FilterChip, Pagination, Modal, StatusBadge, StatCard } from '../components/ui';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const Staking = () => {
  const toast = useToast();
  const [stakes, setStakes] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [selectedStake, setSelectedStake] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null });

  useEffect(() => { fetchOverview(); }, []);
  useEffect(() => { setCurrentPage(1); }, [statusFilter]);
  useEffect(() => { fetchStakes(); }, [currentPage, statusFilter]);

  const fetchOverview = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.STAKING_DASHBOARD);
      if (response.data.success) setOverview(response.data.data?.overview || null);
    } catch (error) { /* silent */ }
  };

  const fetchStakes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', currentPage);
      if (statusFilter) params.append('status', statusFilter);
      const response = await axios.get(`${API_ENDPOINTS.STAKING_STAKES}?${params}`);
      if (response.data.success) {
        const d = response.data.data;
        setStakes(d.data || []);
        if (d.last_page) setPagination({ currentPage: d.current_page, lastPage: d.last_page, total: d.total, perPage: d.per_page });
      }
    } catch (error) {
      toast.error('Failed to load stakes');
    } finally {
      setLoading(false);
    }
  };

  const updateStakeStatus = async (stakeId, status) => {
    try {
      const response = await axios.post(API_ENDPOINTS.STAKING_UPDATE_STATUS(stakeId), { status });
      if (response.data.success) {
        toast.success(`Stake ${status} successfully`);
        fetchStakes();
        fetchOverview();
      }
    } catch (error) {
      toast.error('Failed to update stake status');
    }
  };

  const deleteStake = async () => {
    try {
      const response = await axios.delete(API_ENDPOINTS.STAKING_DELETE(confirmDialog.id));
      if (response.data.success) {
        toast.success('Stake deleted');
        fetchStakes();
        fetchOverview();
      }
    } catch (error) {
      toast.error('Failed to delete stake');
    } finally {
      setConfirmDialog({ open: false, id: null });
    }
  };

  const getStatusColor = (status) => {
    const map = {
      running: 'bg-green-500/10 text-green-400 border-green-500/30',
      completed: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      withdrawn: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      cancelled: 'bg-red-500/10 text-red-400 border-red-500/30',
    };
    return map[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/30';
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader icon={Coins} title="Staking" description="Manage user stakes and rewards" gradient="from-yellow-500 to-orange-500">
        <div className="px-3 py-1.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 rounded-lg font-medium text-sm">
          {pagination?.total || stakes.length} total
        </div>
      </PageHeader>

      {/* Overview Stats */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Staked" value={`$${parseFloat(overview.total_staked || 0).toLocaleString()}`} icon={DollarSign} gradient="from-yellow-500 to-orange-500" />
          <StatCard title="Total Rewards" value={`$${parseFloat(overview.total_rewards || 0).toLocaleString()}`} icon={TrendingUp} gradient="from-green-500 to-emerald-500" />
          <StatCard title="Active Stakes" value={overview.active_stakes || 0} icon={Activity} gradient="from-blue-500 to-cyan-500" />
          <StatCard title="Withdrawn" value={overview.withdrawn_stakes || 0} icon={BarChart3} gradient="from-purple-500 to-pink-500" />
        </div>
      )}

      {/* Status Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { value: '', label: 'All' },
          { value: 'running', label: 'Running' },
          { value: 'completed', label: 'Completed' },
          { value: 'withdrawn', label: 'Withdrawn' },
          { value: 'pending', label: 'Pending' },
        ].map((s) => (
          <FilterChip key={s.value} label={s.label} active={statusFilter === s.value} onClick={() => setStatusFilter(s.value)} />
        ))}
      </div>

      {/* Table */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
        {loading ? <LoadingSpinner text="Loading stakes..." /> : stakes.length === 0 ? (
          <EmptyState icon={Coins} title="No stakes found" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Reward</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">APR</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Date</th>
                    <th className="text-right p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stakes.map((stake) => (
                    <tr key={stake.id} className="border-b border-slate-700/30 hover:bg-slate-800/50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{stake.user?.username || stake.user?.email || `User #${stake.user_id}`}</p>
                            <p className="text-slate-500 text-xs">ID: {stake.user_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-white text-sm font-semibold">${parseFloat(stake.amount || 0).toLocaleString()}</td>
                      <td className="p-4 text-green-400 text-sm font-medium">${parseFloat(stake.reward || 0).toLocaleString()}</td>
                      <td className="p-4 hidden md:table-cell text-cyan-400 text-sm">{stake.apr || 0}%</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(stake.status)}`}>
                          {stake.status}
                        </span>
                      </td>
                      <td className="p-4 hidden lg:table-cell text-slate-400 text-xs">{stake.created_at ? new Date(stake.created_at).toLocaleDateString() : '-'}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setSelectedStake(stake); setShowModal(true); }} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => setConfirmDialog({ open: true, id: stake.id })} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Stake Details" icon={Coins} iconGradient="from-yellow-500 to-orange-500">
        {selectedStake && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'User', value: selectedStake.user?.username || selectedStake.user?.email || `#${selectedStake.user_id}` },
                { label: 'Amount', value: `$${parseFloat(selectedStake.amount || 0).toLocaleString()}` },
                { label: 'Reward', value: `$${parseFloat(selectedStake.reward || 0).toLocaleString()}` },
                { label: 'APR', value: `${selectedStake.apr || 0}%` },
                { label: 'Status', value: selectedStake.status },
                { label: 'Created', value: selectedStake.created_at ? new Date(selectedStake.created_at).toLocaleString() : '-' },
              ].map((item, i) => (
                <div key={i} className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/30">
                  <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                  <p className="text-white text-sm font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
            {selectedStake.status === 'running' && (
              <div className="flex gap-2 pt-2">
                <button onClick={() => { updateStakeStatus(selectedStake.id, 'completed'); setShowModal(false); }}
                  className="flex-1 py-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-xl text-sm font-medium hover:bg-blue-500/20 transition">
                  Mark Completed
                </button>
                <button onClick={() => { updateStakeStatus(selectedStake.id, 'withdrawn'); setShowModal(false); }}
                  className="flex-1 py-2.5 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-xl text-sm font-medium hover:bg-purple-500/20 transition">
                  Mark Withdrawn
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, id: null })} onConfirm={deleteStake}
        title="Delete Stake" message="Are you sure you want to delete this stake record?" confirmText="Delete" variant="danger" />
    </div>
  );
};

export default Staking;