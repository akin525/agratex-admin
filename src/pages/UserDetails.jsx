import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../services/axios';
import { API_ENDPOINTS } from '../config/api';
import {
  ArrowLeft,
  Mail,
  User,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Shield,
  Activity,
  CheckCircle,
  XCircle,
  Ban,
  Wallet,
  BarChart3,
  Target,
  Award,
  Clock,
  Hash
} from 'lucide-react';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.USER_DETAILS(id));
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
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

  if (!data) {
    return (
        <div className="text-center py-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border-2 border-dashed border-slate-700 shadow-xl">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-slate-600" strokeWidth={2} />
          </div>
          <p className="text-slate-300 font-semibold text-lg">User not found</p>
        </div>
    );
  }

  const stats = [
    {
      title: 'Total Bids',
      value: data.bids || 0,
      icon: TrendingUp,
      gradient: 'from-blue-600 to-cyan-600',
      color: 'blue',
      bgGlow: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    {
      title: 'Success Bids',
      value: data.success_bids || 0,
      icon: CheckCircle,
      gradient: 'from-green-600 to-emerald-600',
      color: 'green',
      bgGlow: 'bg-green-500/10',
      borderColor: 'border-green-500/30'
    },
    {
      title: 'Total Asks',
      value: data.asks || 0,
      icon: TrendingDown,
      gradient: 'from-purple-600 to-pink-600',
      color: 'purple',
      bgGlow: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30'
    },
    {
      title: 'Success Asks',
      value: data.success_asks || 0,
      icon: Award,
      gradient: 'from-orange-600 to-red-600',
      color: 'orange',
      bgGlow: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30'
    },
  ];

  const getStatusStyle = (status) => {
    const styles = {
      active: {
        bg: 'bg-green-500/10',
        text: 'text-green-400',
        border: 'border-green-500/30',
        icon: CheckCircle,
        glow: 'shadow-green-500/30'
      },
      inactive: {
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-400',
        border: 'border-yellow-500/30',
        icon: XCircle,
        glow: 'shadow-yellow-500/30'
      },
      blocked: {
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        border: 'border-red-500/30',
        icon: Ban,
        glow: 'shadow-red-500/30'
      },
    };
    return styles[status] || styles.inactive;
  };

  const statusStyle = getStatusStyle(data.profile?.status);
  const StatusIcon = statusStyle.icon;

  const bidSuccessRate = data.bids > 0 ? ((data.success_bids / data.bids) * 100).toFixed(1) : 0;
  const askSuccessRate = data.asks > 0 ? ((data.success_asks / data.asks) * 100).toFixed(1) : 0;

  return (
      <div className="space-y-6 p-6">
        {/* Header with Back Button */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex items-center gap-4">
              <button
                  onClick={() => navigate('/users')}
                  className="p-3 bg-slate-900/50 hover:bg-slate-700/50 border border-slate-600 hover:border-slate-500 rounded-xl transition-all group"
              >
                <ArrowLeft className="w-5 h-5 text-slate-300 group-hover:text-white group-hover:-translate-x-1 transition-all" strokeWidth={2.5} />
              </button>
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
                  <User className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    User Details
                  </h1>
                  <p className="text-slate-400 mt-1">Detailed user profile and statistics</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl">
          <div className="p-8">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-75"></div>
                <div className="relative w-28 h-28 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50">
                  <User className="w-14 h-14 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center border-4 border-slate-900">
                  <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-white">{data.profile?.name}</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <Hash className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-400">ID: {id}</span>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-xl flex items-center gap-2 $${statusStyle.bg}$$ {statusStyle.text} border $${statusStyle.border} backdrop-blur-sm shadow-lg$$ {statusStyle.glow}`}>
                    <StatusIcon className="w-4 h-4" strokeWidth={2.5} />
                    <span className="font-bold text-sm uppercase">{data.profile?.status}</span>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/30">
                      <Mail className="w-5 h-5 text-blue-400" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Email</p>
                      <p className="text-sm text-white font-medium">{data.profile?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/30">
                      <User className="w-5 h-5 text-purple-400" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Username</p>
                      <p className="text-sm text-white font-medium">@{data.profile?.username || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/30">
                      <Calendar className="w-5 h-5 text-cyan-400" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Member Since</p>
                      <p className="text-sm text-white font-medium">{new Date(data.profile?.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/30">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/30">
                      <Wallet className="w-5 h-5 text-green-400" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-xs text-green-400/70 uppercase tracking-wide">Balance</p>
                      <p className="text-lg text-green-400 font-bold">${(data.profile?.balance || 0).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const StatIcon = stat.icon;
            return (
                <div key={index} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-6 shadow-xl hover:border-slate-600 transition-all group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">{stat.title}</p>
                      <p className="text-4xl font-bold text-white mt-2 group-hover:scale-105 transition-transform">{stat.value}</p>
                    </div>
                    <div className={`relative`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity`}></div>
                      <div className={`relative p-4 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg`}>
                        <StatIcon className="w-8 h-8 text-white" strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>
                </div>
            );
          })}
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bid Summary */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-lg shadow-blue-500/30">
                <TrendingUp className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Bid Summary</h3>
                <p className="text-sm text-slate-400">Trading performance</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-blue-400" strokeWidth={2.5} />
                    <span className="text-slate-400">Total Bids Amount</span>
                  </div>
                  <span className="font-bold text-xl text-white">${(data.sum_bids || 0).toLocaleString()}</span>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/30">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-400" strokeWidth={2.5} />
                    <span className="text-green-300">Success Rate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-2xl text-green-400">{bidSuccessRate}%</span>
                    <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                          style={{ width: `${bidSuccessRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
                  <p className="text-xs text-slate-500 mb-1">Total</p>
                  <p className="text-lg font-bold text-blue-400">{data.bids || 0}</p>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
                  <p className="text-xs text-slate-500 mb-1">Success</p>
                  <p className="text-lg font-bold text-green-400">{data.success_bids || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ask Summary */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg shadow-purple-500/30">
                <TrendingDown className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Ask Summary</h3>
                <p className="text-sm text-slate-400">Trading performance</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-purple-400" strokeWidth={2.5} />
                    <span className="text-slate-400">Total Asks Amount</span>
                  </div>
                  <span className="font-bold text-xl text-white">${(data.sum_asks || 0).toLocaleString()}</span>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/30">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-400" strokeWidth={2.5} />
                    <span className="text-green-300">Success Rate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-2xl text-green-400">{askSuccessRate}%</span>
                    <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                          style={{ width: `${askSuccessRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
                  <p className="text-xs text-slate-500 mb-1">Total</p>
                  <p className="text-lg font-bold text-purple-400">{data.asks || 0}</p>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
                  <p className="text-xs text-slate-500 mb-1">Success</p>
                  <p className="text-lg font-bold text-green-400">{data.success_asks || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default UserDetails;
