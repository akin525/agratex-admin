import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../services/axios';
import { API_ENDPOINTS } from '../config/api';
import { useToast } from '../components/ui/Toast';
import {
  ArrowLeft, User, Mail, Phone, Calendar, Shield, CheckCircle, XCircle, Ban,
  Wallet, Coins, DollarSign, TrendingUp, Award, Target, Activity, Clock,
  Hash, Copy, Edit3, Save, ArrowUpRight, ArrowDownRight, Receipt, Download,
  ArrowLeftRight, Crown, Layers, Eye, Lock, Users
} from 'lucide-react';
import { LoadingSpinner, StatusBadge, EmptyState } from '../components/ui';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Balance Edit State
  const [editBalance, setEditBalance] = useState(null);
  const [balanceForm, setBalanceForm] = useState({ wallet: '', amount: '', type: 'credit' });
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: '' });

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.USER_DETAILS(id));
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.UPDATE_USER_STATUS(id, confirmDialog.action));
      if (response.data.success) {
        toast.success(response.data.message || 'Status updated');
        fetchUserDetails();
      } else {
        toast.error(response.data.message || 'Failed to update status');
      }
    } catch (error) {
      toast.error('Failed to update user status');
    } finally {
      setConfirmDialog({ open: false, action: '' });
    }
  };

  const handleBalanceUpdate = async (e) => {
    e.preventDefault();
    if (!balanceForm.amount || parseFloat(balanceForm.amount) <= 0) {
      toast.warning('Please enter a valid amount');
      return;
    }
    setBalanceLoading(true);
    try {
      const response = await axios.post(API_ENDPOINTS.UPDATE_USER_BALANCE(id), balanceForm);
      if (response.data.success) {
        toast.success(response.data.message || 'Balance updated successfully');
        setEditBalance(null);
        setBalanceForm({ wallet: '', amount: '', type: 'credit' });
        fetchUserDetails();
      } else {
        toast.error(response.data.message || 'Failed to update balance');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update balance');
    } finally {
      setBalanceLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.info('Copied to clipboard');
  };

  if (loading) return <div className="py-24"><LoadingSpinner text="Loading user profile..." /></div>;

  if (!user) {
    return (
        <div className="p-6 max-w-7xl mx-auto">
          <EmptyState icon={XCircle} title="User not found" description="The user profile you're looking for doesn't exist or has been removed." action={() => navigate('/users')} actionLabel="Return to Directory" />
        </div>
    );
  }

  // Minimal Status Configurations
  const getStatusConfig = (status) => {
    const configs = {
      active: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', ring: 'ring-emerald-500/20', icon: CheckCircle, label: 'Active' },
      inactive: { bg: 'bg-amber-500/10', text: 'text-amber-400', ring: 'ring-amber-500/20', icon: Clock, label: 'Inactive' },
      blocked: { bg: 'bg-rose-500/10', text: 'text-rose-400', ring: 'ring-rose-500/20', icon: Ban, label: 'Restricted' },
    };
    return configs[status] || configs.inactive;
  };

  const statusConfig = getStatusConfig(user.status);
  const StatusIcon = statusConfig.icon;

  // Data Mappings
  const userStakes = user.stakes || [];
  const userDeposits = user.deposits || [];
  const userTransactions = user.transactions || [];
  const userExchanges = user.exchange_transactions || [];
  const userInvestments = user.invests || user.investments || [];
  const userLogins = user.logins || [];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'wallets', label: 'Wallets & Points', icon: Wallet },
    { id: 'staking', label: 'Staking & Legacy', icon: Layers },
    { id: 'activity', label: 'Activity Log', icon: Activity },
  ];

  // Component Helpers
  const MetricCard = ({ title, value, icon: Icon, valueColor = 'text-white', prefix = '' }) => (
      <div className="bg-slate-900 ring-1 ring-inset ring-white/10 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <Icon className="w-4 h-4 text-slate-400" />
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</h3>
        </div>
        <div className={`text-2xl font-bold font-mono ${valueColor}`}>
          {prefix}{value}
        </div>
      </div>
  );

  const DescriptionItem = ({ label, value, copyable = false }) => (
      <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 px-6">
        <dt className="text-sm font-medium text-slate-400">{label}</dt>
        <dd className="mt-1 text-sm text-slate-200 sm:col-span-2 sm:mt-0 flex items-center justify-between">
          <span className={copyable ? "font-mono" : ""}>{value || <span className="text-slate-600">—</span>}</span>
          {copyable && value && (
              <button onClick={() => copyToClipboard(value)} className="text-slate-500 hover:text-white transition-colors">
                <Copy className="w-4 h-4" />
              </button>
          )}
        </dd>
      </div>
  );

  return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

        {/* Top Navigation */}
        <button onClick={() => navigate('/users')} className="group flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Directory
        </button>

        {/* Profile Header */}
        <div className="bg-slate-900 ring-1 ring-inset ring-white/10 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-start justify-between gap-6">

            {/* Identity Section */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="w-20 h-20 bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20 rounded-full flex items-center justify-center text-3xl font-bold flex-shrink-0">
                {(user.firstname || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-white tracking-tight">{user.firstname || 'Unknown User'}</h1>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ring-1 ring-inset ${statusConfig.bg} ${statusConfig.text} ${statusConfig.ring}`}>
                  <StatusIcon className="w-3.5 h-3.5" /> {statusConfig.label}
                </span>
                  {user.rank && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/20 text-xs font-semibold">
                    <Crown className="w-3.5 h-3.5" /> {user.rank}
                  </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400 mt-3">
                  <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-500" /> {user.email}</span>
                  <span className="flex items-center gap-2"><Hash className="w-4 h-4 text-slate-500" /> @{user.username}</span>
                  <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-500" /> Joined {new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric'})}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 md:flex-shrink-0 border-t border-white/10 md:border-t-0 pt-4 md:pt-0">
              {user.status !== 'active' && (
                  <button
                      onClick={() => setConfirmDialog({ open: true, action: 'active', title: 'Activate User', message: `Activate "${user.name}"?`, variant: 'success' })}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 ring-1 ring-inset ring-emerald-500/30 hover:ring-emerald-500/50 rounded-lg transition-all text-sm font-semibold flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" /> Activate
                  </button>
              )}
              {user.status !== 'blocked' && (
                  <button
                      onClick={() => setConfirmDialog({ open: true, action: 'blocked', title: 'Restrict User', message: `Restrict "${user.name}"? They will lose platform access.`, variant: 'danger' })}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-rose-400 ring-1 ring-inset ring-rose-500/30 hover:ring-rose-500/50 rounded-lg transition-all text-sm font-semibold flex items-center gap-2"
                  >
                    <Ban className="w-4 h-4" /> Restrict
                  </button>
              )}
            </div>
          </div>

          {/* Flat Tab Navigation */}
          <div className="border-t border-white/10 px-6 sm:px-8 bg-slate-900/50">
            <nav className="-mb-px flex space-x-6 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                  <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                          activeTab === tab.id
                              ? 'border-indigo-500 text-indigo-400'
                              : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-700'
                      }`}
                  >
                    <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-indigo-400' : 'text-slate-500'}`} />
                    {tab.label}
                  </button>
              ))}
            </nav>
          </div>
        </div>

        {/* ─── OVERVIEW TAB ─── */}
        {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard title="USDT Vault" value={parseFloat(user.usdt_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} icon={DollarSign} valueColor="text-emerald-400" prefix="$" />
                <MetricCard title="AGR Stake" value={parseFloat(user.agr_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} icon={Coins} valueColor="text-indigo-400" />
                <MetricCard title="Personal Staked" value={parseFloat(user.personal_staked || 0).toLocaleString()} icon={TrendingUp} prefix="$" />
                <MetricCard title="Legacy Volume" value={parseFloat(user.legacy_volume || 0).toLocaleString()} icon={Layers} prefix="$" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Identity Details */}
                <div className="bg-slate-900 ring-1 ring-inset ring-white/10 rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-6 py-5 border-b border-white/10 bg-slate-900/50">
                    <h3 className="text-base font-semibold text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" /> Identity Information
                    </h3>
                  </div>
                  <dl className="divide-y divide-white/5">
                    <DescriptionItem label="Full Name" value={user.firstname} />
                    <DescriptionItem label="Username" value={`@${user.username}`} copyable />
                    <DescriptionItem label="Email Address" value={user.email} copyable />
                    <DescriptionItem label="Phone Number" value={user.phone} />
                    <DescriptionItem label="Location" value={[user.city, user.state, user.country].filter(Boolean).join(', ')} />
                  </dl>
                </div>

                {/* System Details */}
                <div className="bg-slate-900 ring-1 ring-inset ring-white/10 rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-6 py-5 border-b border-white/10 bg-slate-900/50">
                    <h3 className="text-base font-semibold text-white flex items-center gap-2">
                      <Shield className="w-4 h-4 text-slate-400" /> System Records
                    </h3>
                  </div>
                  <dl className="divide-y divide-white/5">
                    <DescriptionItem label="Internal User ID" value={user.id} copyable />
                    <DescriptionItem label="Referral Code" value={user.referral_code} copyable />
                    <DescriptionItem label="Referred By" value={user.referrer ? `@${user.referrer}` : null} />
                    <DescriptionItem label="Current Rank Level" value={user.current_level_id || '0'} />
                    <DescriptionItem label="Last Updated" value={user.updated_at ? new Date(user.updated_at).toLocaleString() : null} />
                  </dl>
                </div>
              </div>
            </div>
        )}

        {/* ─── WALLETS TAB ─── */}
        {activeTab === 'wallets' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Adjustable Wallets */}
                {[
                  { title: 'USDT Vault', balance: user.usdt_balance, id: 'usdt', color: 'emerald', icon: DollarSign },
                  { title: 'AGR Holdings', balance: user.agr_balance, id: 'agr', color: 'indigo', icon: Coins }
                ].map(w => (
                    <div key={w.id} className="bg-slate-900 ring-1 ring-inset ring-white/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-${w.color}-500/10 text-${w.color}-400 ring-1 ring-${w.color}-500/20`}>
                            <w.icon className="w-5 h-5" />
                          </div>
                          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">{w.title}</h3>
                        </div>
                        <button
                            onClick={() => { setEditBalance(w.id); setBalanceForm({ wallet: w.id, amount: '', type: 'credit' }); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 rounded-md transition-colors ring-1 ring-inset ring-white/10"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Modify
                        </button>
                      </div>
                      <div>
                        <div className={`text-4xl font-bold font-mono text-${w.color}-400`}>
                          {w.id === 'usdt' && '$'}{parseFloat(w.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                ))}
              </div>

              {/* Points Overview */}
              <h3 className="text-lg font-semibold text-white mt-8 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-slate-400" /> Network Points
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard title="Direct" value={parseFloat(user.direct_points || 0).toLocaleString()} icon={Target} />
                <MetricCard title="Reserved" value={parseFloat(user.reserved_points || 0).toLocaleString()} icon={Lock} />
                <MetricCard title="Left Leg" value={parseFloat(user.left_points || 0).toLocaleString()} icon={ArrowLeft} />
                <MetricCard title="Right Leg" value={parseFloat(user.right_points || 0).toLocaleString()} icon={ArrowUpRight} />
              </div>
            </div>
        )}

        {/* ─── STAKING & ACTIVITY TABS (Unified Clean Tables) ─── */}
        {(activeTab === 'staking' || activeTab === 'activity') && (
            <div className="space-y-8">

              {/* Helper function to render clean tables */}
              {(() => {
                const renderTable = (title, icon, data, columns, renderRow) => {
                  if (!data || data.length === 0) {
                    return <EmptyState icon={icon} title={`No ${title} found`} description={`User has no recorded ${title.toLowerCase()}.`} />;
                  }
                  const Icon = icon;
                  return (
                      <div className="bg-slate-900 ring-1 ring-inset ring-white/10 rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-6 py-5 border-b border-white/10 bg-slate-900/50 flex items-center justify-between">
                          <h3 className="text-base font-semibold text-white flex items-center gap-2">
                            <Icon className="w-4 h-4 text-slate-400" /> {title}
                          </h3>
                          <span className="text-xs font-semibold text-slate-500 bg-white/5 px-2 py-1 rounded-md">{data.length} Records</span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-900/50 border-b border-white/10">
                            <tr>
                              {columns.map((col, i) => (
                                  <th key={i} className={`px-6 py-3 font-semibold text-slate-400 text-xs uppercase tracking-wider ${col.align === 'right' ? 'text-right' : ''}`}>
                                    {col.label}
                                  </th>
                              ))}
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                            {data.map((item, i) => renderRow(item, i))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                  );
                };

                if (activeTab === 'staking') {
                  return (
                      <>
                        {renderTable('Staking History', Coins, userStakes,
                            [{label: 'Amount'}, {label: 'Reward'}, {label: 'APR'}, {label: 'Status'}, {label: 'Date', align: 'right'}],
                            (stake, i) => (
                                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                  <td className="px-6 py-4 font-mono text-slate-200">${parseFloat(stake.amount || 0).toLocaleString()}</td>
                                  <td className="px-6 py-4 font-mono text-emerald-400">+${parseFloat(stake.reward || 0).toLocaleString()}</td>
                                  <td className="px-6 py-4 font-mono text-slate-400">{stake.apr || 0}%</td>
                                  <td className="px-6 py-4"><StatusBadge status={stake.status} /></td>
                                  <td className="px-6 py-4 text-right text-slate-500">{new Date(stake.created_at).toLocaleDateString()}</td>
                                </tr>
                            )
                        )}
                        {renderTable('Investment Plans', TrendingUp, userInvestments,
                            [{label: 'Plan'}, {label: 'Principal'}, {label: 'Return'}, {label: 'Status'}, {label: 'Date', align: 'right'}],
                            (inv, i) => (
                                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                  <td className="px-6 py-4 text-slate-200 font-medium">{inv.plan?.name || `Plan #${inv.plan_id}`}</td>
                                  <td className="px-6 py-4 font-mono text-slate-300">${parseFloat(inv.amount || 0).toLocaleString()}</td>
                                  <td className="px-6 py-4 font-mono text-emerald-400">${parseFloat(inv.return_amount || inv.total_return || 0).toLocaleString()}</td>
                                  <td className="px-6 py-4"><StatusBadge status={inv.status} /></td>
                                  <td className="px-6 py-4 text-right text-slate-500">{new Date(inv.created_at).toLocaleDateString()}</td>
                                </tr>
                            )
                        )}
                      </>
                  );
                }

                if (activeTab === 'activity') {
                  return (
                      <>
                        {renderTable('Ledger Transactions', Receipt, userTransactions,
                            [{label: 'Action'}, {label: 'Category'}, {label: 'Amount'}, {label: 'Wallet'}, {label: 'Date', align: 'right'}],
                            (tx, i) => (
                                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                  <td className="px-6 py-4"><StatusBadge status={tx.type} /></td>
                                  <td className="px-6 py-4 text-slate-300 capitalize">{(tx.category || '').replace(/_/g, ' ')}</td>
                                  <td className={`px-6 py-4 font-mono ${tx.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {tx.type === 'credit' ? '+' : '-'}${parseFloat(tx.amount || 0).toLocaleString()}
                                  </td>
                                  <td className="px-6 py-4 text-slate-400 uppercase tracking-wider text-xs">{tx.wallet || '—'}</td>
                                  <td className="px-6 py-4 text-right text-slate-500">{new Date(tx.created_at).toLocaleDateString()}</td>
                                </tr>
                            )
                        )}
                        {renderTable('Deposit History', Download, userDeposits,
                            [{label: 'Amount'}, {label: 'Reference ID'}, {label: 'Status'}, {label: 'Date', align: 'right'}],
                            (dep, i) => (
                                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                  <td className="px-6 py-4 font-mono text-emerald-400">${parseFloat(dep.amount || 0).toLocaleString()}</td>
                                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{dep.reference || '—'}</td>
                                  <td className="px-6 py-4"><StatusBadge status={dep.status} /></td>
                                  <td className="px-6 py-4 text-right text-slate-500">{new Date(dep.created_at).toLocaleDateString()}</td>
                                </tr>
                            )
                        )}
                        {renderTable('Login Sessions', Lock, userLogins,
                            [{label: 'IP Address'}, {label: 'Location'}, {label: 'Device Details'}, {label: 'Timestamp', align: 'right'}],
                            (login, i) => (
                                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                  <td className="px-6 py-4 font-mono text-slate-300">{login.user_ip || login.ip || '—'}</td>
                                  <td className="px-6 py-4 text-slate-400">{login.location || '—'}</td>
                                  <td className="px-6 py-4 text-slate-400 text-xs truncate max-w-[200px]">{login.details || '—'}</td>
                                  <td className="px-6 py-4 text-right text-slate-500">{new Date(login.created_at).toLocaleString()}</td>
                                </tr>
                            )
                        )}
                      </>
                  );
                }
              })()}
            </div>
        )}

        {/* ─── BALANCE ADJUSTMENT MODAL ─── */}
        {editBalance && (
            <div className="fixed inset-0 bg-[#0A0A0A]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
              <div className="bg-slate-900 ring-1 ring-inset ring-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="px-6 py-5 border-b border-white/10 bg-slate-900/50 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-slate-400" /> Modify {editBalance.toUpperCase()} Vault
                  </h3>
                  <button onClick={() => setEditBalance(null)} className="p-1 hover:bg-white/10 rounded-md transition-colors">
                    <XCircle className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleBalanceUpdate} className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Transaction Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => setBalanceForm({ ...balanceForm, type: 'credit' })}
                              className={`p-3 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                                  balanceForm.type === 'credit'
                                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                      : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10'
                              }`}>
                        <ArrowUpRight className="w-4 h-4" /> Credit (+)
                      </button>
                      <button type="button" onClick={() => setBalanceForm({ ...balanceForm, type: 'debit' })}
                              className={`p-3 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                                  balanceForm.type === 'debit'
                                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                      : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10'
                              }`}>
                        <ArrowDownRight className="w-4 h-4" /> Debit (-)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Amount</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-slate-500 font-mono font-medium">{editBalance === 'usdt' ? '$' : ''}</span>
                      </div>
                      <input
                          type="number" step="any" required
                          value={balanceForm.amount}
                          onChange={(e) => setBalanceForm({ ...balanceForm, amount: e.target.value })}
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-mono placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <span className="text-slate-500 font-semibold text-xs uppercase tracking-wider">{editBalance}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button type="submit" disabled={balanceLoading}
                            className="w-full py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                      {balanceLoading ? <div className="w-4 h-4 border-2 border-slate-400 border-t-black rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                      Confirm Adjustment
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {/* Confirm Dialog */}
        <ConfirmDialog
            isOpen={confirmDialog.open}
            onClose={() => setConfirmDialog({ open: false, action: '' })}
            onConfirm={updateStatus}
            title={confirmDialog.title}
            message={confirmDialog.message}
            confirmText={confirmDialog.action === 'blocked' ? 'Restrict User' : 'Activate User'}
            variant={confirmDialog.action === 'blocked' ? 'danger' : 'success'}
        />
      </div>
  );
};

export default UserDetails;