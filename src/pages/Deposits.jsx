import { useEffect, useState } from 'react';
import axios from '../services/axios';
import { API_ENDPOINTS } from '../config/api';
import { useToast } from '../components/ui/Toast';
import { useDebounce } from '../hooks/useDebounce';
import {
  Download, CheckCircle, XCircle, Clock, Eye, DollarSign, Hash,
  Calendar, Wallet, Copy, ExternalLink, AlertTriangle,
} from 'lucide-react';
import { LoadingSpinner, PageHeader, SearchInput, StatusBadge, Pagination, EmptyState, FilterChip, Modal, StatCard } from '../components/ui';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const Deposits = () => {
  const toast = useToast();
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null, status: '' });
  const [actionLoading, setActionLoading] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => { setCurrentPage(1); }, [debouncedSearch, statusFilter]);
  useEffect(() => { fetchDeposits(); }, [currentPage, debouncedSearch, statusFilter]);

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', currentPage);
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      const response = await axios.get(`${API_ENDPOINTS.DEPOSITS}?${params}`);
      if (response.data.success) {
        const d = response.data.data;
        setDeposits(d.data || []);
        if (d.last_page) setPagination({ currentPage: d.current_page, lastPage: d.last_page, total: d.total, perPage: d.per_page });
      }
    } catch (error) {
      toast.error('Failed to load deposits');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    const { id, status } = confirmDialog;
    setActionLoading(true);
    try {
      const response = await axios.post(API_ENDPOINTS.UPDATE_DEPOSIT_STATUS(id), { status });
      if (response.data.success) {
        toast.success(response.data.message || `Deposit ${status} successfully`);
        fetchDeposits();
        if (showModal && selectedDeposit?.id === id) {
          setSelectedDeposit({ ...selectedDeposit, status });
        }
      } else {
        toast.error(response.data.message || 'Failed to update deposit');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update deposit status');
    } finally {
      setActionLoading(false);
      setConfirmDialog({ open: false, id: null, status: '' });
    }
  };

  const viewDeposit = (deposit) => {
    setSelectedDeposit(deposit);
    setShowModal(true);
  };

  const copyText = (text) => { navigator.clipboard.writeText(text); toast.info('Copied to clipboard'); };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader icon={Download} title="Deposits" description="Manage user deposit requests" gradient="from-green-500 to-emerald-500">
        <div className="flex items-center gap-2 text-sm">
          <div className="px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/30 rounded-lg font-medium">
            {pagination?.total || deposits.length} total
          </div>
        </div>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search by reference, address, txid..." className="w-full sm:w-80" />
        <div className="flex items-center gap-2 flex-wrap">
          {['all', 'pending', 'success', 'failed', 'expired'].map((s) => (
            <FilterChip key={s} label={s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)} active={statusFilter === s} onClick={() => setStatusFilter(s)} />
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
        {loading ? <LoadingSpinner text="Loading deposits..." /> : deposits.length === 0 ? (
          <EmptyState icon={Download} title="No deposits found" description="Try adjusting your search or filters" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Reference</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Address</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Date</th>
                    <th className="text-right p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.map((dep) => (
                    <tr key={dep.id} className="border-b border-slate-700/30 hover:bg-slate-800/50 transition">
                      <td className="p-4">
                        <div>
                          <p className="text-white text-sm font-medium">{dep.user?.name || dep.user?.username || `User #${dep.user_id}`}</p>
                          <p className="text-slate-500 text-xs">{dep.user?.email || ''}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-green-400 font-bold text-sm">${parseFloat(dep.amount || 0).toLocaleString()}</span>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className="text-slate-400 text-xs font-mono">{dep.reference ? dep.reference.substring(0, 16) + '...' : 'N/A'}</span>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <span className="text-slate-400 text-xs font-mono">{dep.address ? dep.address.substring(0, 12) + '...' : 'N/A'}</span>
                      </td>
                      <td className="p-4"><StatusBadge status={dep.status} /></td>
                      <td className="p-4 hidden md:table-cell text-slate-400 text-sm">{new Date(dep.created_at).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => viewDeposit(dep)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition" title="View"><Eye className="w-4 h-4" /></button>
                          {dep.status === 'pending' && (
                            <>
                              <button onClick={() => setConfirmDialog({ open: true, id: dep.id, status: 'success', title: 'Approve Deposit', message: `Approve $${parseFloat(dep.amount).toLocaleString()} deposit? This will credit the user's wallet.`, variant: 'success' })}
                                className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition" title="Approve"><CheckCircle className="w-4 h-4" /></button>
                              <button onClick={() => setConfirmDialog({ open: true, id: dep.id, status: 'failed', title: 'Reject Deposit', message: `Reject this $${parseFloat(dep.amount).toLocaleString()} deposit?`, variant: 'danger' })}
                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition" title="Reject"><XCircle className="w-4 h-4" /></button>
                            </>
                          )}
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
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Deposit Details" icon={Download} iconGradient="from-green-500 to-emerald-500" maxWidth="max-w-xl">
        {selectedDeposit && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Deposit ID', value: `#${selectedDeposit.id}` },
                { label: 'Status', value: selectedDeposit.status, badge: true },
                { label: 'Amount', value: `$${parseFloat(selectedDeposit.amount || 0).toLocaleString()}` },
                { label: 'User', value: selectedDeposit.user?.name || `User #${selectedDeposit.user_id}` },
                { label: 'Date', value: new Date(selectedDeposit.created_at).toLocaleString() },
              ].map((item, i) => (
                <div key={i} className="p-3 bg-slate-900/50 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                  {item.badge ? <StatusBadge status={item.value} /> : <p className="text-sm font-medium text-white">{item.value}</p>}
                </div>
              ))}
            </div>
            {selectedDeposit.reference && (
              <div className="p-3 bg-slate-900/50 rounded-xl">
                <p className="text-xs text-slate-500 mb-1">Reference</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-mono text-white break-all flex-1">{selectedDeposit.reference}</p>
                  <button onClick={() => copyText(selectedDeposit.reference)} className="p-1.5 hover:bg-slate-700 rounded-lg transition"><Copy className="w-4 h-4 text-slate-400" /></button>
                </div>
              </div>
            )}
            {selectedDeposit.address && (
              <div className="p-3 bg-slate-900/50 rounded-xl">
                <p className="text-xs text-slate-500 mb-1">Wallet Address</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-mono text-white break-all flex-1">{selectedDeposit.address}</p>
                  <button onClick={() => copyText(selectedDeposit.address)} className="p-1.5 hover:bg-slate-700 rounded-lg transition"><Copy className="w-4 h-4 text-slate-400" /></button>
                </div>
              </div>
            )}
            {selectedDeposit.txid && (
              <div className="p-3 bg-slate-900/50 rounded-xl">
                <p className="text-xs text-slate-500 mb-1">Transaction ID</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-mono text-white break-all flex-1">{selectedDeposit.txid}</p>
                  <button onClick={() => copyText(selectedDeposit.txid)} className="p-1.5 hover:bg-slate-700 rounded-lg transition"><Copy className="w-4 h-4 text-slate-400" /></button>
                </div>
              </div>
            )}
            {selectedDeposit.status === 'pending' && (
              <div className="flex items-center gap-3 pt-2">
                <button onClick={() => { setShowModal(false); setConfirmDialog({ open: true, id: selectedDeposit.id, status: 'success', title: 'Approve Deposit', message: `Approve this deposit?`, variant: 'success' }); }}
                  className="flex-1 py-2.5 bg-green-500/10 text-green-400 border border-green-500/30 rounded-xl hover:bg-green-500/20 transition text-sm font-medium flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
                <button onClick={() => { setShowModal(false); setConfirmDialog({ open: true, id: selectedDeposit.id, status: 'failed', title: 'Reject Deposit', message: `Reject this deposit?`, variant: 'danger' }); }}
                  className="flex-1 py-2.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition text-sm font-medium flex items-center justify-center gap-2">
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, id: null, status: '' })} onConfirm={handleStatusUpdate}
        title={confirmDialog.title} message={confirmDialog.message} confirmText={confirmDialog.status === 'success' ? 'Approve' : 'Reject'} variant={confirmDialog.variant || 'danger'} loading={actionLoading} />
    </div>
  );
};

export default Deposits;