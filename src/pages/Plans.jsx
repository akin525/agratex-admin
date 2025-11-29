import { useEffect, useState } from 'react';
import axios from '../services/axios';
import { API_ENDPOINTS } from '../config/api';
import { Package, Clock, DollarSign, TrendingUp, Edit, Power, Save, X, Sparkles } from 'lucide-react';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    time: 'days',
    duration: '',
    amount: '',
    maximum_return: '',
    unit_per_time: '',
    rank_level: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.PLANS);
      if (response.data.success) {
        setPlans(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      time: plan.time,
      duration: plan.duration,
      amount: plan.amount,
      maximum_return: plan.maximum_return,
      unit_per_time: plan.unit_per_time,
      rank_level: plan.rank_level,
    });
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.duration || formData.duration < 1) newErrors.duration = 'Duration must be at least 1';
    if (!formData.amount || formData.amount < 0) newErrors.amount = 'Amount must be positive';
    if (!formData.maximum_return || formData.maximum_return < 0) newErrors.maximum_return = 'Maximum return must be positive';
    if (!formData.unit_per_time || formData.unit_per_time < 0) newErrors.unit_per_time = 'Unit per time must be positive';
    if (!formData.rank_level || formData.rank_level < 0) newErrors.rank_level = 'Rank level must be positive';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.put(
        API_ENDPOINTS.EDIT_PLAN(editingPlan.id),
        formData
      );
      if (response.data.success) {
        await fetchPlans();
        closeModal();
      }
    } catch (error) {
      console.error('Error updating plan:', error);
      if (error.response?.data?.error) {
        setErrors(error.response.data.error);
      }
    }
  };

  const handleToggleStatus = async (planId) => {
    try {
      const response = await axios.patch(API_ENDPOINTS.TOGGLE_PLAN_STATUS(planId));
      if (response.data.success) {
        await fetchPlans();
      }
    } catch (error) {
      console.error('Error toggling plan status:', error);
    }
  };

  const closeModal = () => {
    setShowEditModal(false);
    setEditingPlan(null);
    setFormData({
      name: '',
      time: 'days',
      duration: '',
      amount: '',
      maximum_return: '',
      unit_per_time: '',
      rank_level: '',
    });
    setErrors({});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-700"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-purple-500 border-r-blue-500 absolute top-0 left-0"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl blur-3xl"></div>
        <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700/50 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
                <Package className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Investment Plans
                </h1>
                <p className="text-slate-400 mt-1">Manage investment plans and packages</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden hover:border-slate-600 transition-all duration-300 hover:scale-105">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Header */}
            <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Package className="w-8 h-8" strokeWidth={2.5} />
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    title="Edit plan"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(plan.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      plan.status ? 'bg-green-500/20 hover:bg-green-500/30' : 'bg-red-500/20 hover:bg-red-500/30'
                    }`}
                    title={plan.status ? 'Disable plan' : 'Enable plan'}
                  >
                    <Power className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-blue-100">Rank Level: {plan.rank_level}</p>
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm">Duration</span>
                </div>
                <span className="font-semibold text-white">
                  {plan.duration} {plan.time}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <DollarSign className="w-5 h-5" />
                  <span className="text-sm">Amount</span>
                </div>
                <span className="font-semibold text-white">${plan.amount}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm">Max Return</span>
                </div>
                <span className="font-semibold text-green-400">${plan.maximum_return}</span>
              </div>

              <div className="pt-4 border-t border-slate-700/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Unit per time:</span>
                  <span className="font-semibold text-white">${plan.unit_per_time}</span>
                </div>
              </div>

              <div className="pt-2">
                <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-bold rounded-xl border backdrop-blur-sm ${
                  plan.status 
                    ? 'bg-green-500/10 text-green-400 border-green-500/30' 
                    : 'bg-red-500/10 text-red-400 border-red-500/30'
                }`}>
                  {plan.status ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {plans.length === 0 && (
        <div className="text-center py-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border-2 border-dashed border-slate-700">
          <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-300 font-semibold text-lg mb-2">No Plans Available</p>
          <p className="text-slate-500 text-sm">Investment plans will appear here</p>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
              <h3 className="text-xl font-bold text-white">Edit Plan</h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-slate-900/50 border ${
                      errors.name ? 'border-red-500' : 'border-slate-600'
                    } rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition`}
                    placeholder="Enter plan name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Time Period *
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  >
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Duration *
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-4 py-3 bg-slate-900/50 border ${
                      errors.duration ? 'border-red-500' : 'border-slate-600'
                    } rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition`}
                    placeholder="Enter duration"
                  />
                  {errors.duration && <p className="mt-1 text-sm text-red-400">{errors.duration}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Amount *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-3 bg-slate-900/50 border ${
                      errors.amount ? 'border-red-500' : 'border-slate-600'
                    } rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition`}
                    placeholder="Enter amount"
                  />
                  {errors.amount && <p className="mt-1 text-sm text-red-400">{errors.amount}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Maximum Return *
                  </label>
                  <input
                    type="number"
                    name="maximum_return"
                    value={formData.maximum_return}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-3 bg-slate-900/50 border ${
                      errors.maximum_return ? 'border-red-500' : 'border-slate-600'
                    } rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition`}
                    placeholder="Enter maximum return"
                  />
                  {errors.maximum_return && <p className="mt-1 text-sm text-red-400">{errors.maximum_return}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Unit Per Time *
                  </label>
                  <input
                    type="number"
                    name="unit_per_time"
                    value={formData.unit_per_time}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-3 bg-slate-900/50 border ${
                      errors.unit_per_time ? 'border-red-500' : 'border-slate-600'
                    } rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition`}
                    placeholder="Enter unit per time"
                  />
                  {errors.unit_per_time && <p className="mt-1 text-sm text-red-400">{errors.unit_per_time}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Rank Level *
                  </label>
                  <input
                    type="number"
                    name="rank_level"
                    value={formData.rank_level}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full px-4 py-3 bg-slate-900/50 border ${
                      errors.rank_level ? 'border-red-500' : 'border-slate-600'
                    } rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition`}
                    placeholder="Enter rank level"
                  />
                  {errors.rank_level && <p className="mt-1 text-sm text-red-400">{errors.rank_level}</p>}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg hover:shadow-purple-500/50 text-white rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Update Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plans;