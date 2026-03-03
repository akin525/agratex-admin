import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/axios';
import { API_ENDPOINTS } from '../config/api';
import { useToast } from '../components/ui/Toast';
import { useDebounce } from '../hooks/useDebounce';
import {
  Users as UsersIcon, Eye, CheckCircle, Ban, Crown
} from 'lucide-react';
import {
  LoadingSpinner, PageHeader, SearchInput, StatusBadge,
  Pagination, EmptyState, FilterChip
} from '../components/ui';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const Users = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const [confirmDialog, setConfirmDialog] = useState({ open: false, userId: null, action: '' });
  const [actionLoading, setActionLoading] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, debouncedSearch, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', currentPage);
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await axios.get(`${API_ENDPOINTS.USERS}?${params}`);
      if (response.data.success) {
        const d = response.data.data;
        setUsers(d.data || d);
        if (d.last_page) {
          setPagination({ currentPage: d.current_page, lastPage: d.last_page, total: d.total, perPage: d.per_page });
        }
      }
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    const { userId, action } = confirmDialog;
    setActionLoading(true);
    try {
      const response = await axios.get(API_ENDPOINTS.UPDATE_USER_STATUS(userId, action));
      if (response.data.success) {
        toast.success(response.data.message || `User ${action}d successfully`);
        fetchUsers();
      } else {
        toast.error(response.data.message || 'Failed to update status');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user status');
    } finally {
      setActionLoading(false);
      setConfirmDialog({ open: false, userId: null, action: '' });
    }
  };

  const getStatusAction = (currentStatus) => {
    if (currentStatus === 'active') return { action: 'blocked', label: 'Block', variant: 'danger', icon: Ban };
    return { action: 'active', label: 'Activate', variant: 'success', icon: CheckCircle };
  };

  // Helper to generate consistent, subtle avatar colors
  const getAvatarColor = (name) => {
    const colors = ['bg-indigo-500/10 text-indigo-400', 'bg-emerald-500/10 text-emerald-400', 'bg-blue-500/10 text-blue-400', 'bg-amber-500/10 text-amber-400'];
    return colors[(name ? name.length : 0) % colors.length];
  };

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <PageHeader
              icon={UsersIcon}
              title="Users"
              description="Manage members, balances, tiers, and account status."
          />

          {/* KPI + Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* KPI Cards */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-sm">
                <div className="text-xs uppercase tracking-wider text-slate-500">Total users</div>
                <div className="mt-2 flex items-baseline justify-between">
                  <div className="text-2xl font-semibold text-slate-100">
                    {pagination?.total || users.length}
                  </div>
                  <div className="text-xs text-slate-500">Directory</div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-sm">
                <div className="text-xs uppercase tracking-wider text-slate-500">Active</div>
                <div className="mt-2 text-2xl font-semibold text-emerald-400">
                  {users.filter(u => u.status === "active").length}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-sm">
                <div className="text-xs uppercase tracking-wider text-slate-500">Blocked</div>
                <div className="mt-2 text-2xl font-semibold text-rose-400">
                  {users.filter(u => u.status === "blocked").length}
                </div>
              </div>
            </div>

            {/* Search + Filters */}
            <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-sm">
              <div className="space-y-3">
                <SearchInput
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search name, email, username…"
                />

                <div className="flex flex-wrap gap-2">
                  {["all", "active", "inactive", "blocked"].map((status) => (
                      <button
                          key={status}
                          onClick={() => setStatusFilter(status)}
                          className={[
                            "px-3 py-1.5 rounded-lg text-xs font-semibold border transition",
                            statusFilter === status
                                ? "bg-white/10 border-white/20 text-slate-100"
                                : "bg-transparent border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/5"
                          ].join(" ")}
                      >
                        {status === "all"
                            ? "All"
                            : status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="rounded-2xl border border-white/10 bg-slate-900 shadow-xl overflow-hidden">
          {/* Top bar */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/10 bg-slate-900/60">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <div className="text-sm font-medium text-slate-200">User Directory</div>
              <div className="text-xs text-slate-500">
                {pagination?.total ? `${pagination.total} records` : `${users.length} records`}
              </div>
            </div>

            <div className="text-xs text-slate-500 hidden sm:block">
              Tip: Click the eye icon to view full profile
            </div>
          </div>

          {loading ? (
              <div className="py-20">
                <LoadingSpinner text="Loading users…" />
              </div>
          ) : users.length === 0 ? (
              <div className="py-20">
                <EmptyState
                    icon={UsersIcon}
                    title="No users found"
                    description="Try a different search term or change the status filter."
                />
              </div>
          ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-white/10">
                  <tr className="text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4 text-left font-semibold">User</th>
                    <th className="px-6 py-4 text-left font-semibold hidden md:table-cell">Contact</th>
                    <th className="px-6 py-4 text-left font-semibold">USDT</th>
                    <th className="px-6 py-4 text-left font-semibold">AGR</th>
                    <th className="px-6 py-4 text-left font-semibold hidden lg:table-cell">Tier</th>
                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                    <th className="px-6 py-4 text-left font-semibold hidden xl:table-cell">Joined</th>
                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                  </tr>
                  </thead>

                  <tbody className="divide-y divide-white/5">
                  {users.map((user, idx) => {
                    const statusAction = getStatusAction(user.status);
                    const StatusActionIcon = statusAction.icon;

                    return (
                        <tr
                            key={user.id}
                            className={[
                              "transition-colors",
                              idx % 2 === 0 ? "bg-white/[0.01]" : "bg-transparent",
                              "hover:bg-white/[0.04]"
                            ].join(" ")}
                        >
                          {/* User */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                  className={[
                                    "w-10 h-10 rounded-xl flex items-center justify-center font-semibold",
                                    "ring-1 ring-inset ring-white/10",
                                    getAvatarColor(user.firstname)
                                  ].join(" ")}
                              >
                                {(user.firstname || "U").charAt(0).toUpperCase()}
                              </div>

                              <div className="min-w-0">
                                <div className="text-slate-100 font-semibold truncate">
                                  {user.firstname || "Unknown User"}
                                </div>
                                <div className="text-xs text-slate-500 truncate">
                                  @{user.username || "N/A"}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Contact */}
                          <td className="px-6 py-4 hidden md:table-cell">
                            <div className="text-slate-200 truncate max-w-[260px]">{user.email}</div>
                            {user.phone ? (
                                <div className="text-xs text-slate-500 mt-1">{user.phone}</div>
                            ) : (
                                <div className="text-xs text-slate-600 mt-1">—</div>
                            )}
                          </td>

                          {/* USDT */}
                          <td className="px-6 py-4">
                            <div className="font-mono font-semibold text-emerald-400">
                              $
                              {parseFloat(user.usdt_balance || 0).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                            </div>
                            <div className="text-xs text-slate-600 mt-1">Vault</div>
                          </td>

                          {/* AGR */}
                          <td className="px-6 py-4">
                            <div className="font-mono font-semibold text-indigo-400">
                              {parseFloat(user.agr_balance || 0).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                            </div>
                            <div className="text-xs text-slate-600 mt-1">Staked</div>
                          </td>

                          {/* Tier */}
                          <td className="px-6 py-4 hidden lg:table-cell">
                            {user.rank ? (
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 ring-1 ring-inset ring-amber-500/20 text-xs font-semibold">
                                  <Crown className="w-3.5 h-3.5" />
                                  {user.rank}
                                </div>
                            ) : (
                                <span className="text-slate-600">—</span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            <StatusBadge status={user.status} />
                          </td>

                          {/* Joined */}
                          <td className="px-6 py-4 hidden xl:table-cell text-slate-400">
                            {new Date(user.created_at).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric"
                            })}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end">
                              <div className="inline-flex rounded-xl border border-white/10 bg-slate-950/40 overflow-hidden">
                                <button
                                    onClick={() => navigate(`/users/${user.id}`)}
                                    className="px-3 py-2 text-slate-300 hover:text-white hover:bg-white/5 transition"
                                    title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>

                                <div className="w-px bg-white/10" />

                                <button
                                    onClick={() =>
                                        setConfirmDialog({
                                          open: true,
                                          userId: user.id,
                                          action: statusAction.action,
                                          variant: statusAction.variant,
                                          title: `${statusAction.label} User`,
                                          message: `Are you sure you want to ${statusAction.label.toLowerCase()} "${user.name || user.email}"?`
                                        })
                                    }
                                    className={[
                                      "px-3 py-2 transition",
                                      statusAction.action === "blocked"
                                          ? "text-rose-300 hover:text-rose-200 hover:bg-rose-500/10"
                                          : "text-emerald-300 hover:text-emerald-200 hover:bg-emerald-500/10"
                                    ].join(" ")}
                                    title={statusAction.label}
                                >
                                  <StatusActionIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                    );
                  })}
                  </tbody>
                </table>
              </div>
          )}

          {/* Pagination */}
          {!loading && pagination && users.length > 0 && (
              <div className="border-t border-white/10 bg-slate-900/60 px-4 py-4">
                <Pagination
                    currentPage={pagination.currentPage}
                    lastPage={pagination.lastPage}
                    total={pagination.total}
                    perPage={pagination.perPage}
                    onPageChange={setCurrentPage}
                />
              </div>
          )}
        </div>

        {/* Confirm Dialog */}
        <ConfirmDialog
            isOpen={confirmDialog.open}
            onClose={() => setConfirmDialog({ open: false, userId: null, action: "" })}
            onConfirm={handleStatusUpdate}
            title={confirmDialog.title}
            message={confirmDialog.message}
            confirmText={confirmDialog.action === "blocked" ? "Block User" : "Activate User"}
            variant={confirmDialog.variant || "danger"}
            loading={actionLoading}
        />
      </div>
  );

};

export default Users;