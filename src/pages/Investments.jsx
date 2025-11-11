import { useEffect, useState } from 'react';
import axios from '../services/axios';
import { API_ENDPOINTS } from '../config/api';
import {
  TrendingUp,
  Filter,
  Eye,
  Sparkles,
  DollarSign,
  Target,
  Calendar,
  Hash,
  CheckCircle,
  XCircle,
  Clock,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  Activity,
  BarChart3,
  PieChart,
  ArrowUpRight,
  User
} from 'lucide-react';

const Investments = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchInvestments();
  }, [filter, currentPage]);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_ENDPOINTS.INVESTMENTS(filter)}?page=${currentPage}`);
      if (response.data.success) {
        setInvestments(response.data.data.data);
        setPagination({
          current_page: response.data.data.current_page,
          last_page: response.data.data.last_page,
          total: response.data.data.total,
        });
      }
    } catch (error) {
      console.error('Error fetching investments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      running: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        border: 'border-blue-500/30',
        icon: PlayCircle,
        glow: 'shadow-blue-500/30'
      },
      completed: {
        bg: 'bg-green-500/10',
        text: 'text-green-400',
        border: 'border-green-500/30',
        icon: CheckCircle,
        glow: 'shadow-green-500/30'
      },
      cancelled: {
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        border: 'border-red-500/30',
        icon: XCircle,
        glow: 'shadow-red-500/30'
      },
      pending: {
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-400',
        border: 'border-yellow-500/30',
        icon: Clock,
        glow: 'shadow-yellow-500/30'
      },
    };
    return badges[status] || {
      bg: 'bg-slate-500/10',
      text: 'text-slate-400',
      border: 'border-slate-500/30',
      icon: Activity,
      glow: 'shadow-slate-500/30'
    };
  };

  const filterOptions = [
    { value: 'all', label: 'All', icon: Activity, color: 'purple' },
    { value: 'running', label: 'Running', icon: PlayCircle, color: 'blue' },
    { value: 'completed', label: 'Completed', icon: CheckCircle, color: 'green' },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'red' },
    { value: 'pending', label: 'Pending', icon: Clock, color: 'yellow' }
  ];

  // Calculate stats
  const stats = {
    total: investments.length,
    totalAmount: investments.reduce((sum, inv) => sum + (inv.amount || 0), 0),
    totalProfit: investments.reduce((sum, inv) => sum + (inv.expected_profit || 0), 0),
    totalReturn: investments.reduce((sum, inv) => sum + (inv.expected_return || 0), 0),
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
                    <TrendingUp className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Investments
                    </h1>
                    <p className="text-slate-400 mt-1">Monitor all investment activities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Investments</p>
                <p className="text-3xl font-bold text-white">{pagination?.total || 0}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <BarChart3 className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-blue-400">${stats.totalAmount.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/30">
                <DollarSign className="w-6 h-6 text-blue-400" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Expected Profit</p>
                <p className="text-3xl font-bold text-green-400">${stats.totalProfit.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/30">
                <Target className="w-6 h-6 text-green-400" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Expected Return</p>
                <p className="text-3xl font-bold text-cyan-400">${stats.totalReturn.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center border border-cyan-500/30">
                <ArrowUpRight className="w-6 h-6 text-cyan-400" strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 border border-slate-700/50 shadow-xl">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/50 rounded-lg border border-slate-700/50">
              <Filter className="w-5 h-5 text-slate-400" strokeWidth={2.5} />
              <span className="text-sm font-semibold text-slate-300">Filter:</span>
            </div>
            {filterOptions.map((option) => {
              const OptionIcon = option.icon;
              const isActive = filter === option.value;
              return (
                  <button
                      key={option.value}
                      onClick={() => {
                        setFilter(option.value);
                        setCurrentPage(1);
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                          isActive
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30 scale-105'
                              : 'bg-slate-900/50 text-slate-300 hover:text-white border border-slate-600 hover:border-slate-500'
                      }`}
                  >
                    <OptionIcon className="w-4 h-4" strokeWidth={2.5} />
                    {option.label}
                  </button>
              );
            })}
          </div>
        </div>

        {/* Investments Table */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50 border-b border-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Expected Profit
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Expected Return
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Return Date
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
              {investments.map((investment) => {
                const statusStyle = getStatusBadge(investment.status);
                const StatusIcon = statusStyle.icon;

                return (
                    <tr key={investment.id} className="hover:bg-slate-700/20 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-slate-500" strokeWidth={2.5} />
                          <span className="text-sm font-bold text-white">{investment.reference}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                            <User className="w-4 h-4 text-white" strokeWidth={2.5} />
                          </div>
                          <span className="text-sm text-slate-300 font-medium">#{investment.user_id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4 text-blue-400" strokeWidth={2.5} />
                          <span className="text-sm font-bold text-white">
                          ${(investment.amount || 0).toFixed(2)}
                        </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Target className="w-4 h-4 text-green-400" strokeWidth={2.5} />
                          <span className="text-sm font-bold text-green-400">
                          ${(investment.expected_profit || 0).toFixed(2)}
                        </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <ArrowUpRight className="w-4 h-4 text-cyan-400" strokeWidth={2.5} />
                          <span className="text-sm font-bold text-cyan-400">
                          ${(investment.expected_return || 0).toFixed(2)}
                        </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 inline-flex items-center gap-1.5 text-xs leading-5 font-bold rounded-xl $${statusStyle.bg}$$ {statusStyle.text} border ${statusStyle.border} backdrop-blur-sm`}>
                        <StatusIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                        {investment.status}
                      </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-sm text-slate-400">
                          <Calendar className="w-4 h-4" strokeWidth={2.5} />
                          {investment.return_date ? new Date(investment.return_date).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                            className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 rounded-lg transition-all border border-blue-500/30 hover:border-blue-500/50 group/btn"
                            title="View Details"
                        >
                          <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" strokeWidth={2.5} />
                        </button>
                      </td>
                    </tr>
                );
              })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && (
              <div className="bg-slate-900/50 px-6 py-4 flex items-center justify-between border-t border-slate-700/50">
                <div className="text-sm text-slate-400">
                  Showing page <span className="font-semibold text-white">{pagination.current_page}</span> of{' '}
                  <span className="font-semibold text-white">{pagination.last_page}</span>
                  {' '}(<span className="font-semibold text-purple-400">{pagination.total}</span> total investments)
                </div>
                <div className="flex items-center gap-2">
                  <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-xl text-slate-300 hover:text-white hover:border-slate-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group"
                  >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" strokeWidth={2.5} />
                    Previous
                  </button>
                  <div className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-semibold shadow-lg shadow-purple-500/30">
                    {currentPage}
                  </div>
                  <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === pagination.last_page}
                      className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-xl text-slate-300 hover:text-white hover:border-slate-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
          )}
        </div>

        {/* Empty State */}
        {investments.length === 0 && (
            <div className="text-center py-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border-2 border-dashed border-slate-700 shadow-xl">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-10 h-10 text-slate-600" strokeWidth={2} />
              </div>
              <p className="text-slate-300 font-semibold text-lg mb-2">No Investments Found</p>
              <p className="text-slate-500 text-sm">Try adjusting your filter criteria</p>
            </div>
        )}
      </div>
  );
};

export default Investments;
