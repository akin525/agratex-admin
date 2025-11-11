import { useEffect, useState } from 'react';
import axios from '../services/axios';
import { API_ENDPOINTS } from '../config/api';
import { Coins, TrendingUp, Users, DollarSign, Award, Sparkles, ArrowUpRight, ArrowDownRight, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const Staking = () => {
  const [dashboard, setDashboard] = useState(null);
  const [stakes, setStakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchStakingData();
  }, [currentPage]);

  const fetchStakingData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, stakesRes] = await Promise.all([
        axios.get(API_ENDPOINTS.STAKING_DASHBOARD),
        axios.get(`${API_ENDPOINTS.STAKING_STAKES}?page=${currentPage}`),
      ]);

      if (dashboardRes.data.success) {
        setDashboard(dashboardRes.data.data);
      }

      if (stakesRes.data.success) {
        setStakes(stakesRes.data.data.data || stakesRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching staking data:', error);
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

  const stats = [
    {
      title: 'Total Users',
      value: dashboard?.overview?.total_users || 0,
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      change: '+12.5%',
      trend: 'up',
    },
    {
      title: 'Total Staked',
      value: `$${(dashboard?.overview?.total_staked || 0).toLocaleString()}`,
      icon: Coins,
      gradient: 'from-green-500 to-emerald-500',
      change: '+24.3%',
      trend: 'up',
    },
    {
      title: 'Total Rewards',
      value: `$${(dashboard?.overview?.total_rewards || 0).toLocaleString()}`,
      icon: Award,
      gradient: 'from-purple-500 to-pink-500',
      change: '+18.2%',
      trend: 'up',
    },
    {
      title: 'Active Stakes',
      value: dashboard?.overview?.active_stakes || 0,
      icon: TrendingUp,
      gradient: 'from-orange-500 to-red-500',
      change: '+8.7%',
      trend: 'up',
    },
  ];

  const additionalStats = [
    {
      title: 'Pending Stakes',
      value: dashboard?.overview?.pending_stakes || 0,
      gradient: 'from-yellow-500 to-orange-500',
      icon: TrendingUp,
    },
    {
      title: 'Withdrawn Stakes',
      value: dashboard?.overview?.withdrawn_stakes || 0,
      gradient: 'from-blue-500 to-cyan-500',
      icon: ArrowDownRight,
    },
    {
      title: 'Average Stake',
      value: `$${dashboard?.overview?.total_users > 0
          ? ((dashboard?.overview?.total_staked || 0) / dashboard?.overview?.total_users).toFixed(2)
          : '0.00'}`,
      gradient: 'from-purple-500 to-pink-500',
      icon: DollarSign,
    },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      completed: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
      pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' },
      withdrawn: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
      cancelled: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
    };
    return badges[status] || { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30' };
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
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
                  <Coins className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Staking Management
                  </h1>
                  <p className="text-slate-400 mt-1">Monitor and manage all staking activities</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                      <p className="text-3xl font-bold text-white mb-3">{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</p>
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                            stat.trend === 'up' ? 'bg-green-500/10' : 'bg-red-500/10'
                        }`}>
                          {stat.trend === 'up' ? (
                              <ArrowUpRight className="w-3 h-3 text-green-400" strokeWidth={3} />
                          ) : (
                              <ArrowDownRight className="w-3 h-3 text-red-400" strokeWidth={3} />
                          )}
                          <span className={`text-sm font-bold ${
                              stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                          }`}>
                        {stat.change}
                      </span>
                        </div>
                      </div>
                    </div>

                    {/* Icon */}
                    <div className={`bg-gradient-to-br ${stat.gradient} p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-700/30 rounded-full h-1.5 overflow-hidden">
                    <div
                        className={`bg-gradient-to-r ${stat.gradient} h-full rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: '75%' }}
                    ></div>
                  </div>
                </div>
              </div>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {additionalStats.map((stat, index) => (
              <div
                  key={index}
                  className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 overflow-hidden group"
              >
                {/* Glow Effect */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity duration-300`}></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`bg-gradient-to-br ${stat.gradient} p-3 rounded-xl shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-slate-400 mb-2">{stat.title}</h3>
                  <p className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </p>
                </div>
              </div>
          ))}
        </div>

        {/* Stakes Table */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-900/50">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Coins className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Recent Stakes</h3>
                  <p className="text-xs text-slate-400">Latest staking transactions</p>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                      type="text"
                      placeholder="Search..."
                      className="pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-600 rounded-xl text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-slate-500"
                  />
                </div>
                <button className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-xl text-slate-300 hover:text-white hover:border-slate-500 transition-all flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">Filter</span>
                </button>
              </div>
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
                  User ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Reward
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Created
                </th>
              </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
              {stakes.map((stake) => {
                const statusStyle = getStatusBadge(stake.status);
                return (
                    <tr key={stake.id} className="hover:bg-slate-700/20 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-bold text-white">#{stake.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-300 font-medium">User #{stake.user_id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-white">
                          ${(stake.amount || 0).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-green-400" />
                          <span className="text-sm font-bold text-green-400">
                          ${(stake.reward || 0).toFixed(2)}
                        </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-bold rounded-xl $${statusStyle.bg}$$ {statusStyle.text} border ${statusStyle.border} backdrop-blur-sm`}>
                        {stake.status}
                      </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        {stake.created_at ? new Date(stake.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                );
              })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {stakes.length > 0 && (
              <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-900/50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-400">
                    Showing <span className="font-semibold text-white">{stakes.length}</span> stakes
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-xl text-slate-300 hover:text-white hover:border-slate-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <div className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-semibold">
                      {currentPage}
                    </div>
                    <button
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-xl text-slate-300 hover:text-white hover:border-slate-500 transition-all flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
          )}
        </div>

        {/* Empty State */}
        {stakes.length === 0 && (
            <div className="text-center py-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border-2 border-dashed border-slate-700 shadow-xl">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="w-10 h-10 text-slate-600" />
              </div>
              <p className="text-slate-300 font-semibold text-lg mb-2">No Stakes Found</p>
              <p className="text-slate-500 text-sm">There are no staking transactions to display</p>
            </div>
        )}
      </div>
  );
};

export default Staking;
