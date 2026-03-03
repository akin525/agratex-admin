import { useEffect, useState } from 'react';
import axios from '../services/axios';
import { API_ENDPOINTS } from '../config/api';
import { useToast } from '../components/ui/Toast';
import { Settings as SettingsIcon, Save, Globe, DollarSign, Bell, Shield, Mail, Phone, Palette, Server } from 'lucide-react';
import { LoadingSpinner, PageHeader, FormInput, Button } from '../components/ui';

const Settings = () => {
  const toast = useToast();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.SETTINGS);
      if (response.data.success) {
        const data = response.data.data;
        setSettings(data);
        setForm(data || {});
      }
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await axios.post(API_ENDPOINTS.UPDATE_SETTINGS, form);
      if (response.data.success) {
        toast.success(response.data.message || 'Settings updated successfully');
        setSettings(form);
      } else {
        toast.error(response.data.message || 'Failed to update settings');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  if (loading) return <div className="p-6"><LoadingSpinner text="Loading settings..." /></div>;

  const sections = [
    {
      title: 'General Settings',
      icon: Globe,
      gradient: 'from-blue-500 to-cyan-500',
      fields: [
        { key: 'sitename', label: 'Site Name', placeholder: 'Agartex', icon: Globe },
        { key: 'currency', label: 'Currency Code', placeholder: 'AGR', icon: DollarSign },
        { key: 'currency_symbol', label: 'Currency Symbol', placeholder: '$', icon: DollarSign },
        { key: 'site_email', label: 'Site Email', placeholder: 'admin@agartex.com', icon: Mail, type: 'email' },
        { key: 'site_phone', label: 'Site Phone', placeholder: '+1234567890', icon: Phone },
      ],
    },
    {
      title: 'Financial Settings',
      icon: DollarSign,
      gradient: 'from-green-500 to-emerald-500',
      fields: [
        { key: 'min_deposit', label: 'Min Deposit', placeholder: '10', type: 'number' },
        { key: 'max_deposit', label: 'Max Deposit', placeholder: '100000', type: 'number' },
        { key: 'min_withdrawal', label: 'Min Withdrawal', placeholder: '10', type: 'number' },
        { key: 'max_withdrawal', label: 'Max Withdrawal', placeholder: '50000', type: 'number' },
        { key: 'withdrawal_fee', label: 'Withdrawal Fee (%)', placeholder: '2', type: 'number' },
        { key: 'exchange_fee', label: 'Exchange Fee (%)', placeholder: '1', type: 'number' },
      ],
    },
    {
      title: 'System Toggles',
      icon: Shield,
      gradient: 'from-purple-500 to-pink-500',
      toggles: [
        { key: 'registration', label: 'User Registration' },
        { key: 'deposit_status', label: 'Deposits' },
        { key: 'withdrawal_status', label: 'Withdrawals' },
        { key: 'exchange_status', label: 'Exchange' },
        { key: 'staking_status', label: 'Staking' },
        { key: 'kyc_status', label: 'KYC Verification' },
        { key: 'email_verification', label: 'Email Verification' },
        { key: 'maintenance_mode', label: 'Maintenance Mode' },
      ],
    },
    {
      title: 'Notification Settings',
      icon: Bell,
      gradient: 'from-orange-500 to-red-500',
      fields: [
        { key: 'telegram_bot_token', label: 'Telegram Bot Token', placeholder: 'bot123456:ABC...' },
        { key: 'telegram_chat_id', label: 'Telegram Chat ID', placeholder: '-100123456789' },
        { key: 'smtp_host', label: 'SMTP Host', placeholder: 'smtp.gmail.com' },
        { key: 'smtp_port', label: 'SMTP Port', placeholder: '587', type: 'number' },
        { key: 'smtp_username', label: 'SMTP Username', placeholder: 'user@gmail.com' },
        { key: 'smtp_password', label: 'SMTP Password', placeholder: '••••••••', type: 'password' },
      ],
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader icon={SettingsIcon} title="Settings" description="Configure your platform settings" gradient="from-gray-500 to-slate-500">
        <Button icon={Save} onClick={handleSave} loading={saving}>Save Changes</Button>
      </PageHeader>

      <form onSubmit={handleSave} className="space-y-6">
        {sections.map((section) => {
          const SectionIcon = section.icon;
          return (
            <div key={section.title} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden">
              <div className="p-5 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${section.gradient} rounded-xl flex items-center justify-center`}>
                    <SectionIcon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-white font-bold text-lg">{section.title}</h2>
                </div>
              </div>
              <div className="p-5">
                {section.fields && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.fields.map((field) => (
                      <FormInput
                        key={field.key}
                        label={field.label}
                        type={field.type || 'text'}
                        value={form[field.key] || ''}
                        onChange={(e) => updateField(field.key, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    ))}
                  </div>
                )}
                {section.toggles && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.toggles.map((toggle) => (
                      <div key={toggle.key} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/30">
                        <span className="text-sm text-slate-300 font-medium">{toggle.label}</span>
                        <button
                          type="button"
                          onClick={() => updateField(toggle.key, form[toggle.key] == 1 ? 0 : 1)}
                          className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                            form[toggle.key] == 1 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-slate-600'
                          }`}
                        >
                          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
                            form[toggle.key] == 1 ? 'left-6' : 'left-0.5'
                          }`}></div>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div className="flex justify-end">
          <Button type="submit" icon={Save} loading={saving} className="px-8">Save All Settings</Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;