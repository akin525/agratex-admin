import { useEffect, useState } from 'react';
import axios from '../services/axios';
import { API_ENDPOINTS } from '../config/api';
import { Target, Plus, Edit, Trash2, X, Save, Search, Award, Users, TrendingUp, Sparkles } from 'lucide-react';

const LegacyLevelRequirements = () => {
  const [requirements, setRequirements] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    legacy_level_id: '',
    stage: '',
    referral_percent: '',
    required_career: '',
    required_personal: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [requirementsRes, levelsRes] = await Promise.all([
        axios.get(API_ENDPOINTS.LEGACY_REQUIREMENTS),
        axios.get(API_ENDPOINTS.LEGACY_LEVELS),
      ]);

      if (requirementsRes.data.success) {
        setRequirements(requirementsRes.data.data);
      }
      if (levelsRes.data.success) {
        setLevels(levelsRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
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
    if (!formData.legacy_level_id) {
      newErrors.legacy_level_id = 'Legacy level is required';
    }
    if (!formData.stage || formData.stage < 1) {
      newErrors.stage = 'Stage must be at least 1';
    }
    if (!formData.referral_percent || formData.referral_percent < 0) {
      newErrors.referral_percent = 'Referral percent must be positive';
    }
    if (!formData.required_career || formData.required_career < 0) {
      newErrors.required_career = 'Required career must be positive';
    }
    if (!formData.required_personal || formData.required_personal < 0) {
      newErrors.required_personal = 'Required personal must be positive';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingRequirement) {
        const response = await axios.put(
          API_ENDPOINTS.UPDATE_LEGACY_REQUIREMENT(editingRequirement.id),
          formData
        );
        if (response.data.success) {
          await fetchData();
          closeModal();
        }
      } else {
        const response = await axios.post(
          API_ENDPOINTS.CREATE_LEGACY_REQUIREMENT,
          formData
        );
        if (response.data.success) {
          await fetchData();
          closeModal();
        }
      }
    } catch (error) {
      console.error('Error saving requirement:', error);
      if (error.response?.data?.error) {
        setErrors(error.response.data.error);
      }
    }
  };

  const handleEdit = (requirement) => {
    setEditingRequirement(requirement);
    setFormData({
      legacy_level_id: requirement.legacy_level_id,
      stage: requirement.stage,
      referral_percent: requirement.referral_percent,
      required_career: requirement.required_career,
      required_personal: requirement.required_personal,
      notes: requirement.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this requirement?')) {
      return;
    }

    try {
      const response = await axios.delete(API_ENDPOINTS.DELETE_LEGACY_REQUIREMENT(id));
      if (response.data.success) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error deleting requirement:', error);
      alert('Failed to delete requirement');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRequirement(null);
    setFormData({
      legacy_level_id: '',
      stage: '',
      referral_percent: '',
      required_career: '',
      required_personal: '',
      notes: '',
    });
    setErrors({});
  };

  const getLevelName = (levelId) => {
    const level = levels.find(l => l.id === levelId);
    return level ? level.name : 'Unknown';
  };

  const filteredRequirements = requirements.filter(req => {
    const levelName = getLevelName(req.legacy_level_id).toLowerCase();
    const stage = req.stage.toString();
    return levelName.includes(searchTerm.toLowerCase()) || stage.includes(searchTerm);
  });

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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
                  <Target className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Legacy Level Requirements
                  </h1>
                  <p className="text-slate-400 mt-1">Manage requirements for each legacy level</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Requirement
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Total Requirements</p>
              <p className="text-3xl font-bold text-white">{requirements.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Avg Referral %</p>
              <p className="text-3xl font-bold text-white">
                {requirements.length > 0
                  ? (requirements.reduce((sum, r) => sum + parseFloat(r.referral_percent), 0) / requirements.length).toFixed(1)
                  : 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Total Stages</p>
              <p className="text-3xl font-bold text-white">
                {requirements.length > 0 ? Math.max(...requirements.map(r => r.stage)) : 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Legacy Levels</p>
              <p className="text-3xl font-bold text-white">{levels.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden">
        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-900/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by level or stage..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-slate-500"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Legacy Level
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Referral %
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Required Career
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Required Personal
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {filteredRequirements.map((req) => (
                <tr key={req.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-white">#{req.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-semibold text-white">{getLevelName(req.legacy_level_id)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-sm font-bold border border-blue-500/30">
                      Stage {req.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-green-400">{req.referral_percent}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-white">{req.required_career}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-white">{req.required_personal}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(req)}
                        className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(req.id)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredRequirements.length === 0 && (
          <div className="text-center py-16">
            <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No requirements found</p>
            <p className="text-slate-500 text-sm mt-2">
              {searchTerm ? 'Try adjusting your search' : 'Create your first requirement to get started'}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
              <h3 className="text-xl font-bold text-white">
                {editingRequirement ? 'Edit Requirement' : 'Add Requirement'}
              </h3>
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
                    Legacy Level *
                  </label>
                  <select
                    name="legacy_level_id"
                    value={formData.legacy_level_id}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-slate-900/50 border ${
                      errors.legacy_level_id ? 'border-red-500' : 'border-slate-600'
                    } rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition`}
                  >
                    <option value="">Select a legacy level</option>
                    {levels.map(level => (
                      <option key={level.id} value={level.id}>
                        {level.name} (Points: {level.level_point})
                      </option>
                    ))}
                  </select>
                  {errors.legacy_level_id && (
                    <p className="mt-1 text-sm text-red-400">{errors.legacy_level_id}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Stage *
                  </label>
                  <input
                    type="number"
                    name="stage"
                    value={formData.stage}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-4 py-3 bg-slate-900/50 border ${
                      errors.stage ? 'border-red-500' : 'border-slate-600'
                    } rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition`}
                    placeholder="Enter stage number"
                  />
                  {errors.stage && (
                    <p className="mt-1 text-sm text-red-400">{errors.stage}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Referral Percent *
                  </label>
                  <input
                    type="number"
                    name="referral_percent"
                    value={formData.referral_percent}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-3 bg-slate-900/50 border ${
                      errors.referral_percent ? 'border-red-500' : 'border-slate-600'
                    } rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition`}
                    placeholder="Enter referral percent"
                  />
                  {errors.referral_percent && (
                    <p className="mt-1 text-sm text-red-400">{errors.referral_percent}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Required Career *
                  </label>
                  <input
                    type="number"
                    name="required_career"
                    value={formData.required_career}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-3 bg-slate-900/50 border ${
                      errors.required_career ? 'border-red-500' : 'border-slate-600'
                    } rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition`}
                    placeholder="Enter required career"
                  />
                  {errors.required_career && (
                    <p className="mt-1 text-sm text-red-400">{errors.required_career}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Required Personal *
                  </label>
                  <input
                    type="number"
                    name="required_personal"
                    value={formData.required_personal}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-3 bg-slate-900/50 border ${
                      errors.required_personal ? 'border-red-500' : 'border-slate-600'
                    } rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition`}
                    placeholder="Enter required personal"
                  />
                  {errors.required_personal && (
                    <p className="mt-1 text-sm text-red-400">{errors.required_personal}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
                    placeholder="Enter any additional notes (optional)"
                  />
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
                  {editingRequirement ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LegacyLevelRequirements;