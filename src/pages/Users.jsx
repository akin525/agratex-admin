import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/axios';
import { API_ENDPOINTS } from '../config/api';
import {
  Search,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Users as UsersIcon,
  UserPlus,
  UserCheck,
  UserX,
  Filter,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  DollarSign,
  Calendar,
  Mail,
  Shield
} from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_ENDPOINTS.USERS}?page=${currentPage}`);
      if (response.data.success) {
        setUsers(response.data.data.data);
        setPagination({
          current_page: response.data.data.current_page,
          last_page: response.data.data.last_page,
          total: response.data.data.total,
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this user?`)) {
      return;
    }

    try {
      const response = await axios.get(API_ENDPOINTS.UPDATE_USER_STATUS(userId, status));
      if (response.data.success) {
        alert(response.data.message);
        fetchUsers();
      }
    } catch (error) {
      alert('Failed to update user status');
      console.error('Error updating user status:', error);
    }
  };

  const filteredUsers = users.filter(
      (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const badges = {
      active: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30', icon: CheckCircle },
      inactive: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', icon: XCircle },
      blocked: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', icon: Ban },
    };
    return badges[status] || { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30', icon: XCircle };
  };

  // Calculate stats
  const stats = {
    total: pagination?.total || 0,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    blocked: users.filter(u => u.status === 'blocked').length,
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
                    <UsersIcon className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Users Management
                    </h1>
                    <p className="text-slate-400 mt-1">Manage and monitor all platform users</p>
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
                <p className="text-sm text-slate-400 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <UsersIcon className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Active</p>
                <p className="text-3xl font-bold text-green-400">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/30">
                <UserCheck className="w-6 h-6 text-green-400" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-yellow-500/20 hover:border-yellow-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Inactive</p>
                <p className="text-3xl font-bold text-yellow-400">{stats.inactive}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center border border-yellow-500/30">
                <XCircle className="w-6 h-6 text-yellow-400" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-red-500/20 hover:border-red-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Blocked</p>
                <p className="text-3xl font-bold text-red-400">{stats.blocked}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/30">
                <UserX className="w-6 h-6 text-red-400" strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 border border-slate-700/50 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" strokeWidth={2.5} />
              <input
                  type="text"
                  placeholder="Search by name, email, or username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>
            <button className="px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-slate-300 hover:text-white hover:border-slate-500 transition-all flex items-center gap-2">
              <Filter className="w-5 h-5" strokeWidth={2.5} />
              <span className="font-medium">Filter</span>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50 border-b border-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
              {filteredUsers.map((user) => {
                const statusStyle = getStatusBadge(user.status);
                const StatusIcon = statusStyle.icon;

                return (
                    <tr key={user.id} className="hover:bg-slate-700/20 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-sm">
                            {user.name?.charAt(0).toUpperCase()}
                          </span>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">{user.name}</div>
                            <div className="flex items-center gap-1 text-xs text-slate-400">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-300 font-medium">
                          {user.username || <span className="text-slate-500">N/A</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 inline-flex items-center gap-1.5 text-xs leading-5 font-bold rounded-xl $${statusStyle.bg}$$ {statusStyle.text} border ${statusStyle.border} backdrop-blur-sm`}>
                        <StatusIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                        {user.status}
                      </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4 text-green-400" strokeWidth={2.5} />
                          <span className="text-sm font-bold text-white">
                          ${(user.balance || 0).toFixed(2)}
                        </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-sm text-slate-400">
                          <Calendar className="w-4 h-4" strokeWidth={2.5} />
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                              onClick={() => navigate(`/users/${user.id}`)}
                              className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 rounded-lg transition-all border border-blue-500/30 hover:border-blue-500/50 group/btn"
                              title="View Details"
                          >
                            <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" strokeWidth={2.5} />
                          </button>
                          {user.status === 'active' && (
                              <button
                                  onClick={() => updateUserStatus(user.id, 'blocked')}
                                  className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-all border border-red-500/30 hover:border-red-500/50 group/btn"
                                  title="Block User"
                              >
                                <Ban className="w-4 h-4 group-hover/btn:scale-110 transition-transform" strokeWidth={2.5} />
                              </button>
                          )}
                          {(user.status === 'blocked' || user.status === 'inactive') && (
                              <button
                                  onClick={() => updateUserStatus(user.id, 'active')}
                                  className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 rounded-lg transition-all border border-green-500/30 hover:border-green-500/50 group/btn"
                                  title="Activate User"
                              >
                                <CheckCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" strokeWidth={2.5} />
                              </button>
                          )}
                        </div>
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
                  {' '}(<span className="font-semibold text-purple-400">{pagination.total}</span> total users)
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
        {filteredUsers.length === 0 && (
            <div className="text-center py-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border-2 border-dashed border-slate-700 shadow-xl">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="w-10 h-10 text-slate-600" strokeWidth={2} />
              </div>
              <p className="text-slate-300 font-semibold text-lg mb-2">No Users Found</p>
              <p className="text-slate-500 text-sm">Try adjusting your search criteria</p>
            </div>
        )}
      </div>
  );
};

export default Users;
