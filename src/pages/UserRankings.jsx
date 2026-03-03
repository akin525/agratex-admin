import { useEffect, useState } from 'react';
import axios from '../services/axios';
import { API_ENDPOINTS } from '../config/api';
import { useToast } from '../components/ui/Toast';
import { Trophy, Plus, Edit, Trash2, Power, Save, Star, Crown, Award, Shield, Zap } from 'lucide-react';
import { LoadingSpinner, PageHeader, EmptyState, Modal, FormInput, Button, StatusBadge } from '../components/ui';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const RANK_ICONS = [Shield, Star, Award, Crown, Zap, Trophy];
const RANK_GRADIENTS = [
  'from-slate-500 to-slate-600',
  'from-blue-500 to-cyan-500',
  'from-green-500 to-emerald-500',
  'from-purple-500 to-pink-500',
  'from-yellow-500 to-orange-500',
  'from-red-500 to-rose-500',
];

const UserRankings = () => {
  const toast = useToast();
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRank, setEditingRank] = useState(null);
  const [form, setForm] = useState({ name: '', level: '', min_invest: '', min_referrals: '', bonus: '', status: 1 });
  const [saving, setSaving] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null });

  useEffect(() => { fetchRankings(); }, []);

  const fetchRankings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.USER_RANKINGS);
      if (response.data.success) setRankings(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load rankings');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingRank(null);
    setForm({ name: '', level: '', min_invest: '', min_referrals: '', bonus: '', status: 1 });
    setShowModal(true);
  };

  const openEdit = (rank) => {
    setEditingRank(rank);
    setForm({ name: rank.name, level: rank.level, min_invest: rank.min_invest, min_referrals: rank.min_referrals, bonus: rank.bonus, status: rank.status });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let response;
      if (editingRank) {
        response = await axios.put(API_ENDPOINTS.UPDATE_USER_RANKING(editingRank.id), form);
      } else {
        response = await axios.post(API_ENDPOINTS.CREATE_USER_RANKING, form);
      }
      if (response.data.success) {
        toast.success(response.data.message || `Rank ${editingRank ? 'updated' : 'created'}`);
        setShowModal(false);
        fetchRankings();
      } else {
        toast.error(response.data.message || 'Operation failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (rank) => {
    try {
      const response = await axios.post(API_ENDPOINTS.TOGGLE_USER_RANKING(rank.id));
      if (response.data.success) { toast.success('Status toggled'); fetchRankings(); }
    } catch (error) { toast.error('Failed to toggle status'); }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(API_ENDPOINTS.DELETE_USER_RANKING(confirmDialog.id));
      if (response.data.success) { toast.success('Ranking deleted'); fetchRankings(); }
    } catch (error) { toast.error('Failed to delete ranking'); }
    finally { setConfirmDialog({ open: false, id: null }); }
  };

  if (loading) return <div className="p-6"><LoadingSpinner text="Loading rankings..." /></div>;

  const sorted = [...rankings].sort((a, b) => (a.level || 0) - (b.level || 0));

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader icon={Trophy} title="User Rankings" description="Manage rank tiers and requirements" gradient="from-amber-500 to-yellow-500">
        <Button icon={Plus} onClick={openCreate}>Add Rank</Button>
      </PageHeader>

      {sorted.length === 0 ? (
        <EmptyState icon={Trophy} title="No rankings" description="Create your first rank tier" action={openCreate} actionLabel="Add Rank" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((rank, idx) => {
            const Icon = RANK_ICONS[idx % RANK_ICONS.length];
            const gradient = RANK_GRADIENTS[idx % RANK_GRADIENTS.length];
            return (
              <div key={rank.id} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden hover:border-slate-600/50 transition-all group">
                <div className={`h-1.5 bg-gradient-to-r ${gradient}`}></div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">{rank.name}</h3>
                        <p className="text-slate-400 text-xs">Level {rank.level}</p>
                      </div>
                    </div>
                    <StatusBadge status={rank.status} />
                  </div>

                  <div className="space-y-2.5 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Min Investment</span>
                      <span className="text-white font-semibold">${parseFloat(rank.min_invest || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Min Referrals</span>
                      <span className="text-white font-semibold">{rank.min_referrals || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Bonus</span>
                      <span className="text-green-400 font-bold">${parseFloat(rank.bonus || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-700/50">
                    <button onClick={() => toggleStatus(rank)} className={`flex-1 py-2 rounded-lg text-xs font-medium transition ${rank.status == 1 ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'}`}>
                      <Power className="w-3.5 h-3.5 inline mr-1" />{rank.status == 1 ? 'Active' : 'Inactive'}
                    </button>
                    <button onClick={() => openEdit(rank)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => setConfirmDialog({ open: true, id: rank.id })} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingRank ? 'Edit Ranking' : 'Add Ranking'} icon={Trophy} iconGradient="from-amber-500 to-yellow-500">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Gold" required />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Level" type="number" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} placeholder="1" required />
            <FormInput label="Bonus ($)" type="number" step="any" value={form.bonus} onChange={(e) => setForm({ ...form, bonus: e.target.value })} placeholder="0" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Min Investment ($)" type="number" step="any" value={form.min_invest} onChange={(e) => setForm({ ...form, min_invest: e.target.value })} placeholder="0" />
            <FormInput label="Min Referrals" type="number" value={form.min_referrals} onChange={(e) => setForm({ ...form, min_referrals: e.target.value })} placeholder="0" />
          </div>
          <Button type="submit" loading={saving} icon={Save} className="w-full">{editingRank ? 'Update Ranking' : 'Create Ranking'}</Button>
        </form>
      </Modal>

      <ConfirmDialog isOpen={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, id: null })} onConfirm={handleDelete}
        title="Delete Ranking" message="Are you sure you want to delete this ranking tier?" confirmText="Delete" variant="danger" />
    </div>
  );
};

export default UserRankings;