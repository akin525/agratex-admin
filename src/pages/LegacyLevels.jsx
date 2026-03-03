import { useEffect, useState } from 'react';
import axios from '../services/axios';
import { API_ENDPOINTS } from '../config/api';
import { useToast } from '../components/ui/Toast';
import { Award, Plus, Edit, Trash2, Save, Layers, Star } from 'lucide-react';
import { LoadingSpinner, PageHeader, EmptyState, Modal, FormInput, Button } from '../components/ui';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const LEVEL_GRADIENTS = [
  'from-blue-500 to-cyan-500', 'from-green-500 to-emerald-500', 'from-purple-500 to-pink-500',
  'from-orange-500 to-red-500', 'from-yellow-500 to-amber-500', 'from-teal-500 to-cyan-500',
  'from-rose-500 to-pink-500', 'from-indigo-500 to-violet-500',
];

const LegacyLevels = () => {
  const toast = useToast();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLevel, setEditingLevel] = useState(null);
  const [form, setForm] = useState({ name: '', level: '', stage: '', referral_percentage: '', status: 1 });
  const [saving, setSaving] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null });

  useEffect(() => { fetchLevels(); }, []);

  const fetchLevels = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.LEGACY_LEVELS);
      if (response.data.success) setLevels(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load legacy levels');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingLevel(null);
    setForm({ name: '', level: '', stage: '', referral_percentage: '', status: 1 });
    setShowModal(true);
  };

  const openEdit = (level) => {
    setEditingLevel(level);
    setForm({
      name: level.name || '', level: level.level || '', stage: level.stage || '',
      referral_percentage: level.referral_percentage || '', status: level.status ?? 1,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let response;
      if (editingLevel) {
        response = await axios.put(API_ENDPOINTS.UPDATE_LEGACY_LEVEL(editingLevel.id), form);
      } else {
        response = await axios.post(API_ENDPOINTS.CREATE_LEGACY_LEVEL, form);
      }
      if (response.data.success) {
        toast.success(response.data.message || `Level ${editingLevel ? 'updated' : 'created'}`);
        setShowModal(false);
        fetchLevels();
      } else {
        toast.error(response.data.message || 'Operation failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(API_ENDPOINTS.DELETE_LEGACY_LEVEL(confirmDialog.id));
      if (response.data.success) { toast.success('Level deleted'); fetchLevels(); }
    } catch (error) { toast.error('Failed to delete level'); }
    finally { setConfirmDialog({ open: false, id: null }); }
  };

  if (loading) return <div className="p-6"><LoadingSpinner text="Loading legacy levels..." /></div>;

  const sorted = [...levels].sort((a, b) => (a.level || 0) - (b.level || 0));

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader icon={Award} title="Legacy Levels" description="Manage legacy level tiers" gradient="from-pink-500 to-rose-500">
        <Button icon={Plus} onClick={openCreate}>Add Level</Button>
      </PageHeader>

      {sorted.length === 0 ? (
        <EmptyState icon={Award} title="No legacy levels" description="Create your first legacy level" action={openCreate} actionLabel="Add Level" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sorted.map((level, idx) => {
            const gradient = LEVEL_GRADIENTS[idx % LEVEL_GRADIENTS.length];
            return (
              <div key={level.id} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden hover:border-slate-600/50 transition-all group">
                <div className={`h-1.5 bg-gradient-to-r ${gradient}`}></div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Layers className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold">{level.name || `Level ${level.level}`}</h3>
                        <p className="text-slate-400 text-xs">Level {level.level} • Stage {level.stage || '-'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Referral %</span>
                      <span className="text-green-400 font-bold">{level.referral_percentage || 0}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Status</span>
                      <span className={`text-xs font-semibold ${level.status == 1 ? 'text-green-400' : 'text-red-400'}`}>
                        {level.status == 1 ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-700/50">
                    <button onClick={() => openEdit(level)} className="flex-1 py-2 bg-slate-700/50 text-slate-300 rounded-lg text-xs font-medium hover:bg-slate-700 transition flex items-center justify-center gap-1">
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button onClick={() => setConfirmDialog({ open: true, id: level.id })} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingLevel ? 'Edit Level' : 'Add Level'} icon={Award} iconGradient="from-pink-500 to-rose-500">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Bronze" required />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Level" type="number" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} placeholder="1" required />
            <FormInput label="Stage" type="number" value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })} placeholder="1" />
          </div>
          <FormInput label="Referral Percentage (%)" type="number" step="any" value={form.referral_percentage} onChange={(e) => setForm({ ...form, referral_percentage: e.target.value })} placeholder="5" />
          <Button type="submit" loading={saving} icon={Save} className="w-full">{editingLevel ? 'Update Level' : 'Create Level'}</Button>
        </form>
      </Modal>

      <ConfirmDialog isOpen={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, id: null })} onConfirm={handleDelete}
        title="Delete Level" message="Are you sure you want to delete this legacy level?" confirmText="Delete" variant="danger" />
    </div>
  );
};

export default LegacyLevels;