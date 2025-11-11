import { useEffect, useState } from 'react';
import axios from '../services/axios';
import { API_ENDPOINTS } from '../config/api';
import { Users, TrendingUp, DollarSign, Activity, ArrowUp, ArrowDown, Sparkles, Zap, Target } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.DASHBOARD);
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
  };

  const stats = [
    {
      title: 'Total Users',
      value: data?.users || 0,
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      change: '+12%',
      trend: 'up',
      bgGlow: 'shadow-blue-500/20',
    },
    {
      title: 'Active Users',
      value: data?.active_users || 0,
      icon: Activity,
      gradient: 'from-green-500 to-emerald-500',
      change: '+8%',
      trend: 'up',
      bgGlow: 'shadow-green-500/20',
    },
    // {
    //   title: 'Total Bids',
    //   value: data?.bids || 0,
    //   icon: TrendingUp,
    //   gradient: 'from-purple-500 to-pink-500',
    //   change: '+15%',
    //   trend: 'up',
    //   bgGlow: 'shadow-purple-500/20',
    // },
    // {
    //   title: 'Total Asks',
    //   value: data?.asks || 0,
    //   icon: DollarSign,
    //   gradient: 'from-orange-500 to-red-500',
    //   change: '-3%',
    //   trend: 'down',
    //   bgGlow: 'shadow-orange-500/20',
    // },
  ];

  const financialStats = [
    // {
    //   title: 'Success Bids',
    //   value: data?.success_bids || 0,
    //   amount: `$${(data?.sum_bids || 0).toLocaleString()}`,
    //   gradient: 'from-green-500 to-emerald-500',
    //   icon: TrendingUp,
    //   percentage: '68%',
    // },
    // {
    //   title: 'Success Asks',
    //   value: data?.success_asks || 0,
    //   amount: `$${(data?.sum_asks || 0).toLocaleString()}`,
    //   gradient: 'from-blue-500 to-cyan-500',
    //   icon: DollarSign,
    //   percentage: '72%',
    // },
  ];

  const quickActions = [
    {
      title: 'Manage Users',
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      description: 'View & manage all users',
    },
    {
      title: 'View Investments',
      icon: TrendingUp,
      gradient: 'from-purple-500 to-pink-500',
      description: 'Track user investments',
    },
    {
      title: 'Manage Plans',
      icon: DollarSign,
      gradient: 'from-orange-500 to-red-500',
      description: 'Create & edit plans',
    },
  ];

  return (
      <div className="space-y-6 p-6">
        {/* Page Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700/50 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
                  <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Dashboard Overview
                  </h1>
                  <p className="text-slate-400 mt-1">Monitor your platform's key metrics and performance</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {stats.map((stat, index) => (
              <div
                  key={index}
                  className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                {/* Background Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-400 mb-2">{stat.title}</p>
                      <p className="text-3xl font-bold text-white mb-3">{stat.value.toLocaleString()}</p>
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                            stat.trend === 'up' ? 'bg-green-500/10' : 'bg-red-500/10'
                        }`}>
                          {stat.trend === 'up' ? (
                              <ArrowUp className="w-3 h-3 text-green-400" strokeWidth={3} />
                          ) : (
                              <ArrowDown className="w-3 h-3 text-red-400" strokeWidth={3} />
                          )}
                          <span className={`text-sm font-bold ${
                              stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                          }`}>
                        {stat.change}
                      </span>
                        </div>
                        <span className="text-xs text-slate-500">vs last month</span>
                      </div>
                    </div>

                    {/* Icon */}
                    <div className={`bg-gradient-to-br $${stat.gradient} p-4 rounded-xl shadow-lg$$ {stat.bgGlow} group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-700/30 rounded-full h-1.5 overflow-hidden">
                    <div
                        className={`bg-gradient-to-r ${stat.gradient} h-full rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${Math.min((stat.value / 1000) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Animated Border */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${stat.gradient} opacity-20 blur-xl`}></div>
                </div>
              </div>
          ))}
        </div>

        {/* Financial Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {financialStats.map((stat, index) => (
              <div
                  key={index}
                  className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 overflow-hidden group"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}></div>
                </div>

                {/* Glow Effect */}
                <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${stat.gradient} opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity duration-300`}></div>

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`bg-gradient-to-br ${stat.gradient} p-3 rounded-xl shadow-lg`}>
                        <stat.icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{stat.title}</h3>
                        <p className="text-xs text-slate-400">Success Rate: {stat.percentage}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 bg-gradient-to-r ${stat.gradient} rounded-lg shadow-lg`}>
                      <span className="text-sm font-bold text-white">{stat.percentage}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-4">
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Total Count</span>
                        <span className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Total Amount</span>
                        <span className={`text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                      {stat.amount}
                    </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Ring */}
                  <div className="mt-4 flex justify-center">
                    <div className="relative w-24 h-2 bg-slate-700/30 rounded-full overflow-hidden">
                      <div
                          className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1000`}
                          style={{ width: stat.percentage }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 overflow-hidden">
          {/* Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold text-white">Quick Actions</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                  <button
                      key={index}
                      className="group relative bg-slate-800/50 backdrop-blur-sm border-2 border-dashed border-slate-700 hover:border-slate-600 rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden"
                  >
                    {/* Hover Glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                    <div className="relative z-10 text-center">
                      <div className={`w-14 h-14 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                      </div>
                      <p className="font-bold text-white mb-1">{action.title}</p>
                      <p className="text-xs text-slate-400">{action.description}</p>
                    </div>

                    {/* Arrow Indicator */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Target className="w-5 h-5 text-slate-400" />
                    </div>
                  </button>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;
