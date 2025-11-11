import { useEffect, useState } from 'react';
import axios from '../services/axios';
import { API_ENDPOINTS } from '../config/api';
import {
  Settings as SettingsIcon,
  Save,
  Sparkles,
  Globe,
  DollarSign,
  Shield,
  Users,
  Lock,
  Wrench,
  Send,
  MessageCircle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Activity
} from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.SETTINGS);
      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
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

  const statusConfig = {
    registration: {
      enabled: settings?.registration === 1 || settings?.registration === '1',
      icon: Users,
      label: 'Registration',
      description: 'New user signups'
    },
    login: {
      enabled: settings?.login === 1 || settings?.login === '1',
      icon: Lock,
      label: 'Login',
      description: 'User authentication'
    },
    maintain: {
      enabled: settings?.maintain === 1 || settings?.maintain === '1',
      icon: Wrench,
      label: 'Maintenance Mode',
      description: 'System maintenance'
    }
  };

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
                    <SettingsIcon className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      System Settings
                    </h1>
                    <p className="text-slate-400 mt-1">View and manage platform configuration</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <Activity className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-semibold text-green-400">System Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-lg shadow-blue-500/30">
                <Globe className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">General Settings</h2>
                <p className="text-sm text-slate-400">Basic platform configuration</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="group">
                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Site Name
                </label>
                <div className="relative">
                  <input
                      type="text"
                      value={settings?.sitename || ''}
                      readOnly
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white font-medium transition focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-not-allowed"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Lock className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  Currency
                </label>
                <div className="relative">
                  <input
                      type="text"
                      value={settings?.currency || ''}
                      readOnly
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white font-medium transition focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-not-allowed"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Lock className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-yellow-400" />
                  Currency Symbol
                </label>
                <div className="relative">
                  <input
                      type="text"
                      value={settings?.currency_sym || ''}
                      readOnly
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white font-medium transition focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-not-allowed"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Lock className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg shadow-purple-500/30">
                <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">System Status</h2>
                <p className="text-sm text-slate-400">Platform feature toggles</p>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(statusConfig).map(([key, config]) => {
                const StatusIcon = config.icon;
                const isActive = key === 'maintain' ? !config.enabled : config.enabled;

                return (
                    <div
                        key={key}
                        className={`relative p-4 rounded-xl border-2 transition-all overflow-hidden group ${
                            isActive
                                ? 'bg-green-500/5 border-green-500/30 hover:border-green-500/50'
                                : 'bg-red-500/5 border-red-500/30 hover:border-red-500/50'
                        }`}
                    >
                      {/* Glow Effect */}
                      <div className={`absolute inset-0 ${
                          isActive ? 'bg-green-500/5' : 'bg-red-500/5'
                      } opacity-0 group-hover:opacity-100 transition-opacity`}></div>

                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              isActive ? 'bg-green-500/10' : 'bg-red-500/10'
                          }`}>
                            <StatusIcon className={`w-5 h-5 ${
                                isActive ? 'text-green-400' : 'text-red-400'
                            }`} strokeWidth={2.5} />
                          </div>
                          <div>
                            <p className="text-white font-semibold">{config.label}</p>
                            <p className="text-xs text-slate-400">{config.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isActive ? (
                              <>
                                <CheckCircle2 className="w-5 h-5 text-green-400" strokeWidth={2.5} />
                                <span className="px-3 py-1 rounded-full text-sm font-bold bg-green-500/10 text-green-400 border border-green-500/30">
                            {key === 'maintain' ? 'Inactive' : 'Active'}
                          </span>
                              </>
                          ) : (
                              <>
                                <XCircle className="w-5 h-5 text-red-400" strokeWidth={2.5} />
                                <span className="px-3 py-1 rounded-full text-sm font-bold bg-red-500/10 text-red-400 border border-red-500/30">
                            {key === 'maintain' ? 'Active' : 'Inactive'}
                          </span>
                              </>
                          )}
                        </div>
                      </div>
                    </div>
                );
              })}
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/30">
                <Send className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Social Links</h2>
                <p className="text-sm text-slate-400">Community channels</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="group">
                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <Send className="w-4 h-4 text-cyan-400" />
                  Telegram Channel
                </label>
                <div className="relative">
                  <input
                      type="text"
                      value={settings?.telegram_channel || ''}
                      readOnly
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white font-medium transition focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-not-allowed"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Lock className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-blue-400" />
                  Telegram Group
                </label>
                <div className="relative">
                  <input
                      type="text"
                      value={settings?.telegram_group || ''}
                      readOnly
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white font-medium transition focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-not-allowed"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Lock className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trading Hours */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl shadow-lg shadow-orange-500/30">
                <Clock className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Trading Hours</h2>
                <p className="text-sm text-slate-400">Market operation times</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="group">
                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-400" />
                  Opening Time
                </label>
                <div className="relative">
                  <input
                      type="text"
                      value={settings?.opening_time || ''}
                      readOnly
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white font-medium transition focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-not-allowed"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Lock className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-400" />
                  Closing Time
                </label>
                <div className="relative">
                  <input
                      type="text"
                      value={settings?.closing_time || ''}
                      readOnly
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white font-medium transition focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-not-allowed"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Lock className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </div>

              {/* Trading Status Indicator */}
              <div className="mt-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-400">Market Status</span>
                  </div>
                  <span className="text-sm font-bold text-green-400">Open</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-6 border border-blue-500/20 backdrop-blur-sm shadow-xl">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Info className="w-5 h-5 text-blue-400" strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">Read-Only Configuration</h3>
              <p className="text-sm text-blue-200 leading-relaxed">
                These settings are currently in <strong>read-only mode</strong> for security. To modify platform
                configuration, please update the values directly in the database or through the backend
                configuration panel. All changes require proper authentication and will be logged for audit purposes.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <Lock className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-semibold text-blue-300">Protected Settings</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 rounded-lg border border-purple-500/30">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-semibold text-purple-300">Audit Logged</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Settings;
