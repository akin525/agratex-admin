import { useEffect, useState } from 'react';
import axios from '../services/axios';
import { API_ENDPOINTS } from '../config/api';
import { useToast } from '../components/ui/Toast';
import { UserCog, Save, Percent, Layers, Edit, Plus, Trash2 } from 'lucide-react';
import { LoadingSpinner, PageHeader, EmptyState, FormInput, Button } from '../components/ui';

const Referrals = () => {
  const toast = useToast();
  const [config, setConfig] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchConfig(); }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.REFERRAL_CONFIG);
      if (response.data.success) {
        const data = response.data.data;
        setConfig(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      toast.error('Failed to load referral config');
    } finally {
      setLoading(false);
    }
  };

  const updateLevel = (index, field, value) => {
    setConfig(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addLevel = () => {
    const nextLevel = config.length > 0 ? Math.max(...config.map(c => c.level || 0)) + 1 : 1;
    setConfig(prev => [...prev, { level: nextLevel, percentage: '', status: 1 }]);
  };

  const removeLevel = (index) => {
    setConfig(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await axios.post(API_ENDPOINTS.UPDATE_REFERRAL_CONFIG, { config });
      if (response.data.success) {
        toast.success(response.data.message || 'Referral config updated');
        fetchConfig();
      } else {
        toast.error(response.data.message || 'Failed to update');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update referral config');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6"><LoadingSpinner text="Loading referral config..." /></div>;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader icon={UserCog} title="Referral Configuration" description="Manage referral commission levels" gradient="from-indigo-500 to-purple-500">
        <div className="flex items-center gap-2">
          <Button icon={Plus} onClick={addLevel} variant="secondary">Add Level</Button>
          <Button icon={Save} onClick={handleSave} loading={saving}>Save Config</Button>
        </div>
      </PageHeader>

      {config.length === 0 ? (
        <EmptyState icon={UserCog} title="No referral levels" description="Add your first referral commission level" action={addLevel} actionLabel="Add Level" />
      ) : (
        <div className="space-y-3">
          {config.map((level, index) => (
            <div key={index} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-5 hover:border-slate-600/50 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-white font-bold text-lg">{level.level || index + 1}</span>
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormInput
                    label="Level"
                    type="number"
                    value={level.level || ''}
                    onChange={(e) => updateLevel(index, 'level', e.target.value)}
                    placeholder="1"
                  />
                  <FormInput
                    label="Commission (%)"
                    type="number"
                    step="any"
                    value={level.percentage || ''}
                    onChange={(e) => updateLevel(index, 'percentage', e.target.value)}
                    placeholder="5"
                  />
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Status</label>
                    <div className="flex items-center gap-3 h-[42px]">
                      <button
                        type="button"
                        onClick={() => updateLevel(index, 'status', level.status == 1 ? 0 : 1)}
                        className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                          level.status == 1 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-slate-600'
                        }`}
                      >
                        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
                          level.status == 1 ? 'left-6' : 'left-0.5'
                        }`}></div>
                      </button>
                      <span className={`text-xs font-medium ${level.status == 1 ? 'text-green-400' : 'text-slate-500'}`}>
                        {level.status == 1 ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                <button onClick={() => removeLevel(index)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <Button icon={Save} onClick={handleSave} loading={saving} className="px-8">Save All Changes</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Referrals;