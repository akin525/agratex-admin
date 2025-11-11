import { useEffect, useState } from 'react';
import axios from '../services/axios';
import { API_ENDPOINTS } from '../config/api';
import { UserCog, Save, Plus, Trash2, Sparkles, Shield, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

const Referrals = () => {
  const [referrals, setReferrals] = useState([]);
  const [commissionTypes, setCommissionTypes] = useState({});
  const [selectedType, setSelectedType] = useState('deposit_commission');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReferralConfig();
  }, []);

  const fetchReferralConfig = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.REFERRAL_CONFIG);
      if (response.data.success) {
        setReferrals(response.data.data);
        setCommissionTypes(response.data.commissionTypes);
      }
    } catch (error) {
      console.error('Error fetching referral config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    const filteredReferrals = referrals.filter(
        (ref) => ref.commission_type === selectedType
    );

    const percentages = filteredReferrals.map((ref) => ref.percent);

    try {
      const response = await axios.post(API_ENDPOINTS.UPDATE_REFERRAL_CONFIG, {
        percent: percentages,
        commission_type: selectedType,
      });

      if (response.data.success) {
        setSuccess(response.data.message);
        fetchReferralConfig();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update referral config');
    } finally {
      setSaving(false);
    }
  };

  const addLevel = () => {
    const newLevel = {
      level: referrals.filter((r) => r.commission_type === selectedType).length + 1,
      percent: 0,
      commission_type: selectedType,
    };
    setReferrals([...referrals, newLevel]);
  };

  const removeLevel = (index) => {
    const filtered = referrals.filter(
        (ref, i) => !(ref.commission_type === selectedType && i === index)
    );
    setReferrals(filtered);
  };

  const updatePercent = (index, value) => {
    const updated = [...referrals];
    updated[index].percent = parseFloat(value) || 0;
    setReferrals(updated);
  };

  const currentTypeReferrals = referrals.filter(
      (ref) => ref.commission_type === selectedType
  );

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
                  <UserCog className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Referral Configuration
                  </h1>
                  <p className="text-slate-400 mt-1">Manage referral commission levels and percentages</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Form */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-lg shadow-blue-500/30">
                  <UserCog className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Commission Settings</h2>
                  <p className="text-sm text-slate-400">Configure referral commission levels</p>
                </div>
              </div>

              {success && (
                  <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl backdrop-blur-sm flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-300">{success}</p>
                  </div>
              )}

              {error && (
                  <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Commission Type Selector */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-3">
                    Commission Type
                  </label>
                  <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-4 py-3.5 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition backdrop-blur-sm appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a78bfa'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '3rem'
                      }}
                  >
                    {Object.entries(commissionTypes).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                    ))}
                  </select>
                </div>

                {/* Commission Levels */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-semibold text-slate-200">
                      Commission Levels
                    </label>
                    <button
                        type="button"
                        onClick={addLevel}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95"
                    >
                      <Plus className="w-4 h-4" strokeWidth={2.5} />
                      Add Level
                    </button>
                  </div>

                  <div className="space-y-3">
                    {currentTypeReferrals.map((referral, index) => (
                        <div
                            key={index}
                            className="group bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            {/* Level Badge */}
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                                <div className="text-center">
                                  <div className="text-xs text-purple-200 font-medium">Level</div>
                                  <div className="text-xl font-bold text-white">{referral.level}</div>
                                </div>
                              </div>
                            </div>

                            {/* Input Field */}
                            <div className="flex-1">
                              <div className="relative group">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={referral.percent}
                                    onChange={(e) =>
                                        updatePercent(
                                            referrals.findIndex(
                                                (r) =>
                                                    r.commission_type === selectedType &&
                                                    r.level === referral.level
                                            ),
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-3 pr-12 bg-slate-800/50 border border-slate-600 rounded-xl text-white text-lg font-semibold focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-slate-500"
                                    placeholder="0.00"
                                />
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                                  <span className="text-lg font-bold text-purple-400">%</span>
                                </div>
                              </div>
                            </div>

                            {/* Delete Button */}
                            <button
                                type="button"
                                onClick={() =>
                                    removeLevel(
                                        referrals.findIndex(
                                            (r) =>
                                                r.commission_type === selectedType &&
                                                r.level === referral.level
                                        )
                                    )
                                }
                                className="flex-shrink-0 p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all hover:scale-110 active:scale-95"
                            >
                              <Trash2 className="w-5 h-5" strokeWidth={2.5} />
                            </button>
                          </div>
                        </div>
                    ))}
                  </div>

                  {currentTypeReferrals.length === 0 && (
                      <div className="text-center py-12 bg-slate-900/30 rounded-xl border-2 border-dashed border-slate-700">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Plus className="w-8 h-8 text-slate-600" />
                        </div>
                        <p className="text-slate-400 font-medium">No levels configured</p>
                        <p className="text-sm text-slate-500 mt-1">Click "Add Level" to create one</p>
                      </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={saving || currentTypeReferrals.length === 0}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {saving ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving Changes...
                      </>
                  ) : (
                      <>
                        <Save className="w-5 h-5" strokeWidth={2.5} />
                        Save Configuration
                      </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Commission Types */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-purple-400" strokeWidth={2.5} />
                <h3 className="text-lg font-semibold text-white">Commission Types</h3>
              </div>
              <div className="space-y-3">
                {Object.entries(commissionTypes).map(([key, label]) => (
                    <div
                        key={key}
                        className={`group p-4 rounded-xl border-2 transition-all cursor-pointer ${
                            selectedType === key
                                ? 'border-purple-500 bg-gradient-to-r from-purple-500/10 to-blue-500/10 shadow-lg shadow-purple-500/20'
                                : 'border-slate-700/50 hover:border-slate-600 bg-slate-900/30'
                        }`}
                        onClick={() => setSelectedType(key)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-white">{label}</p>
                          <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                            selectedType === key ? 'bg-purple-400 animate-pulse' : 'bg-slate-600'
                        }`}></span>
                            {referrals.filter((r) => r.commission_type === key).length} levels configured
                          </p>
                        </div>
                        {selectedType === key && (
                            <CheckCircle2 className="w-5 h-5 text-purple-400" strokeWidth={2.5} />
                        )}
                      </div>
                    </div>
                ))}
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-6 border border-blue-500/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-blue-400" strokeWidth={2.5} />
                <h3 className="text-lg font-semibold text-blue-300">How it works</h3>
              </div>
              <ul className="space-y-3 text-sm text-blue-200">
                <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 font-bold">1</span>
                </span>
                  <span>Set commission percentages for each referral level</span>
                </li>
                <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 font-bold">2</span>
                </span>
                  <span>Level 1 represents the direct referral commission</span>
                </li>
                <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 font-bold">3</span>
                </span>
                  <span>Higher levels are for sub-referral tiers</span>
                </li>
                <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 font-bold">4</span>
                </span>
                  <span>Commissions are calculated based on the selected type</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Referrals;
