import { useEffect, useState } from 'react';
import axios from '../services/axios';
import { API_ENDPOINTS } from '../config/api';
import { useToast } from '../components/ui/Toast';
import { Target, Plus, Edit, Trash2, Save, Users, DollarSign, TrendingUp } from 'lucide-react';
import { LoadingSpinner, PageHeader, EmptyState, Modal, FormInput, Button } from '../components/ui';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const LegacyLevelRequirements = () => {
  const toast = useToast();
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReq, setEditingReq] = useState(null);
  const [form, setForm] = useState({
    legacy_level_id: '', direct_referrals: '', team_volume: '',
    personal_investment: '', left_volume: '', right_volume: '', status: 1,
  });
  const [saving, setSaving] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null });

  useEffect(() => { fetchRequirements(); }, []);

  const fetchRequirements = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.LEGACY_REQUIREMENTS);
      if (response.data.success) setRequirements(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load requirements');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingReq(null);
    setForm({ legacy_level_id: '', direct_referrals: '', team_volume: '', personal_investment: '', left_volume: '', right_volume: '', status: 1 });
    setShowModal(true);
  };

  const openEdit = (req) => {
    setEditingReq(req);
    setForm({
      legacy_level_id: req.legacy_level_id || '', direct_referrals: req.direct_referrals || '',
      team_volume: req.team_volume || '', personal_investment: req.personal_investment || '',
      left_volume: req.left_volume || '', right_volume: req.right_volume || '', status: req.status ?? 1,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let response;
      if (editingReq) {
        response = await axios.put(API_ENDPOINTS.UPDATE_LEGACY_REQUIREMENT(editingReq.id), form);
      } else {
        response = await axios.post(API_ENDPOINTS.CREATE_LEGACY_REQUIREMENT, form);
      }
      if (response.data.success) {
        toast.success(response.data.message || `Requirement ${editingReq ? 'updated' : 'created'}`);
        setShowModal(false);
        fetchRequirements();
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
      const response = await axios.delete(API_ENDPOINTS.DELETE_LEGACY_REQUIREMENT(confirmDialog.id));
      if (response.data.success) { toast.success('Requirement deleted'); fetchRequirements(); }
    } catch (error) { toast.error('Failed to delete requirement'); }
    finally { setConfirmDialog({ open: false, id: null }); }
  };

  if (loading) return <div className="p-6"><LoadingSpinner text="Loading requirements..." /></div>;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader icon={Target} title="Legacy Level Requirements" description="Manage requirements for each legacy level" gradient="from-violet-500 to-purple-500">
        <Button icon={Plus} onClick={openCreate}>Add Requirement</Button>
      </PageHeader>

      {requirements.length === 0 ? (
        <EmptyState icon={Target} title="No requirements" description="Create your first level requirement" action={openCreate} actionLabel="Add Requirement" />
      ) : (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Level</th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Direct Referrals</th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Team Volume</th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Personal Invest</th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Left Vol</th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Right Vol</th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="text-right p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requirements.map((req) => (
                  <tr key={req.id} className="border-b border-slate-700/30 hover:bg-slate-800/50 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Target className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white text-sm font-medium">
                          {req.legacy_level?.name || `Level #${req.legacy_level_id}`}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-white text-sm font-semibold">{req.direct_referrals || 0}</td>
                    <td className="p-4 hidden md:table-cell text-slate-300 text-sm">${parseFloat(req.team_volume || 0).toLocaleString()}</td>
                    <td className="p-4 hidden md:table-cell text-slate-300 text-sm">${parseFloat(req.personal_investment || 0).toLocaleString()}</td>
                    <td className="p-4 hidden lg:table-cell text-slate-300 text-sm">${parseFloat(req.left_volume || 0).toLocaleString()}</td>
                    <td className="p-4 hidden lg:table-cell text-slate-300 text-sm">${parseFloat(req.right_volume || 0).toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${req.status == 1 ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                        {req.status == 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(req)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => setConfirmDialog({ open: true, id: req.id })} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingReq ? 'Edit Requirement' : 'Add Requirement'} icon={Target} iconGradient="from-violet-500 to-purple-500">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput label="Legacy Level ID" type="number" value={form.legacy_level_id} onChange={(e) => setForm({ ...form, legacy_level_id: e.target.value })} placeholder="1" required />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Direct Referrals" type="number" value={form.direct_referrals} onChange={(e) => setForm({ ...form, direct_referrals: e.target.value })} placeholder="0" />
            <FormInput label="Team Volume ($)" type="number" step="any" value={form.team_volume} onChange={(e) => setForm({ ...form, team_volume: e.target.value })} placeholder="0" />
          </div>
          <FormInput label="Personal Investment ($)" type="number" step="any" value={form.personal_investment} onChange={(e) => setForm({ ...form, personal_investment: e.target.value })} placeholder="0" />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Left Volume ($)" type="number" step="any" value={form.left_volume} onChange={(e) => setForm({ ...form, left_volume: e.target.value })} placeholder="0" />
            <FormInput label="Right Volume ($)" type="number" step="any" value={form.right_volume} onChange={(e) => setForm({ ...form, right_volume: e.target.value })} placeholder="0" />
          </div>
          <Button type="submit" loading={saving} icon={Save} className="w-full">{editingReq ? 'Update Requirement' : 'Create Requirement'}</Button>
        </form>
      </Modal>

      <ConfirmDialog isOpen={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, id: null })} onConfirm={handleDelete}
        title="Delete Requirement" message="Are you sure you want to delete this requirement?" confirmText="Delete" variant="danger" />
    </div>
  );
};

export default LegacyLevelRequirements;