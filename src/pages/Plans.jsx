import { useEffect, useState } from 'react';
import axios from '../services/axios';
import { API_ENDPOINTS } from '../config/api';
import { useToast } from '../components/ui/Toast';
import { Package, Plus, Edit, Power, Save, Clock, TrendingUp, DollarSign, Percent, Shield, Star } from 'lucide-react';
import { LoadingSpinner, PageHeader, EmptyState, Modal, FormInput, Button, StatusBadge } from '../components/ui';

const PLAN_GRADIENTS = [
  'from-blue-500 to-cyan-500',
  'from-green-500 to-emerald-500',
  'from-purple-500 to-pink-500',
  'from-orange-500 to-red-500',
  'from-yellow-500 to-amber-500',
  'from-teal-500 to-cyan-500',
];

const Plans = () => {
  const toast = useToast();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form, setForm] = useState({
    name: '', min_amount: '', max_amount: '', duration: '', max_return: '',
    daily_profit: '', rank_level: '', status: 1,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchPlans(); }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.PLANS);
      if (response.data.success) setPlans(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingPlan(null);
    setForm({ name: '', min_amount: '', max_amount: '', duration: '', max_return: '', daily_profit: '', rank_level: '', status: 1 });
    setShowModal(true);
  };

  const openEdit = (plan) => {
    setEditingPlan(plan);
    setForm({
      name: plan.name, min_amount: plan.min_amount, max_amount: plan.max_amount,
      duration: plan.duration, max_return: plan.max_return, daily_profit: plan.daily_profit || '',
      rank_level: plan.rank_level || '', status: plan.status,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let response;
      if (editingPlan) {
        response = await axios.put(API_ENDPOINTS.EDIT_PLAN(editingPlan.id), form);
      } else {
        response = await axios.post(API_ENDPOINTS.CREATE_PLAN, form);
      }
      if (response.data.success) {
        toast.success(response.data.message || `Plan ${editingPlan ? 'updated' : 'created'}`);
        setShowModal(false);
        fetchPlans();
      } else {
        toast.error(response.data.message || 'Operation failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (plan) => {
    try {
      const response = await axios.patch(API_ENDPOINTS.TOGGLE_PLAN_STATUS(plan.id));
      if (response.data.success) { toast.success('Status toggled'); fetchPlans(); }
    } catch (error) { toast.error('Failed to toggle status'); }
  };

  if (loading) return <div className="p-6"><LoadingSpinner text="Loading plans..." /></div>;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader icon={Package} title="Investment Plans" description="Manage staking and investment plans" gradient="from-green-500 to-emerald-500">
        <Button icon={Plus} onClick={openCreate}>Add Plan</Button>
      </PageHeader>

      {plans.length === 0 ? (
        <EmptyState icon={Package} title="No plans" description="Create your first investment plan" action={openCreate} actionLabel="Add Plan" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan, idx) => {
            const gradient = PLAN_GRADIENTS[idx % PLAN_GRADIENTS.length];
            return (
              <div key={plan.id} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden hover:border-slate-600/50 transition-all group">
                <div className={`h-1.5 bg-gradient-to-r ${gradient}`}></div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">{plan.name}</h3>
                        {plan.rank_level ? <p className="text-slate-400 text-xs flex items-center gap-1"><Shield className="w-3 h-3" /> Rank Level {plan.rank_level}+</p> : null}
                      </div>
                    </div>
                    <StatusBadge status={plan.status} />
                  </div>

                  <div className="space-y-2.5 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400 flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> Amount Range</span>
                      <span className="text-white font-semibold">${parseFloat(plan.min_amount || 0).toLocaleString()} - ${parseFloat(plan.max_amount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Duration</span>
                      <span className="text-white font-semibold">{plan.duration} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> Max Return</span>
                      <span className="text-green-400 font-bold">{plan.max_return}%</span>
                    </div>
                    {plan.daily_profit && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400 flex items-center gap-1.5"><Percent className="w-3.5 h-3.5" /> Daily Profit</span>
                        <span className="text-cyan-400 font-bold">{plan.daily_profit}%</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-700/50">
                    <button onClick={() => toggleStatus(plan)} className={`flex-1 py-2 rounded-lg text-xs font-medium transition ${plan.status == 1 ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'}`}>
                      <Power className="w-3.5 h-3.5 inline mr-1" />{plan.status == 1 ? 'Active' : 'Inactive'}
                    </button>
                    <button onClick={() => openEdit(plan)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingPlan ? 'Edit Plan' : 'Create Plan'} icon={Package} iconGradient="from-green-500 to-emerald-500">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput label="Plan Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Starter Plan" required />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Min Amount ($)" type="number" step="any" value={form.min_amount} onChange={(e) => setForm({ ...form, min_amount: e.target.value })} placeholder="100" required />
            <FormInput label="Max Amount ($)" type="number" step="any" value={form.max_amount} onChange={(e) => setForm({ ...form, max_amount: e.target.value })} placeholder="10000" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Duration (days)" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="30" required />
            <FormInput label="Max Return (%)" type="number" step="any" value={form.max_return} onChange={(e) => setForm({ ...form, max_return: e.target.value })} placeholder="150" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Daily Profit (%)" type="number" step="any" value={form.daily_profit} onChange={(e) => setForm({ ...form, daily_profit: e.target.value })} placeholder="0.5" />
            <FormInput label="Required Rank Level" type="number" value={form.rank_level} onChange={(e) => setForm({ ...form, rank_level: e.target.value })} placeholder="0" />
          </div>
          <Button type="submit" loading={saving} icon={Save} className="w-full">{editingPlan ? 'Update Plan' : 'Create Plan'}</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Plans;