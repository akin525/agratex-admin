import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
  Users, TrendingUp, DollarSign, ArrowLeftRight, Receipt, Coins, Download,
  Wallet, Server, ShieldCheck, ArrowUpRight, ArrowDownRight, Activity, Sparkles
} from 'lucide-react';
import axios from '../services/axios';
import { API_ENDPOINTS } from '../config/api';

// --- SMART NUMBER FORMATTER ---
// Automatically formats numbers (e.g. 500 -> 500, 1500 -> 1.5k, 2500000 -> 2.50M)
const formatCompact = (num) => {
  if (!num || isNaN(num)) return '0';
  const n = Number(num);
  if (n >= 1000000) return (n / 1000000).toFixed(2) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

// --- OPTIMIZED TOOLTIP ---
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
      <div className="bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
        <p className="text-slate-400 text-[10px] uppercase tracking-widest font-semibold mb-3">{label}</p>
        <div className="space-y-2.5">
          {payload.map((entry, i) => (
              <div key={i} className="flex items-center justify-between gap-8 text-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color, boxShadow: `0 0 8px ${entry.color}` }}></div>
                  <span className="text-slate-300 font-medium capitalize">{entry.name}</span>
                </div>
                <span className="text-white font-mono font-medium">
              ${parseFloat(entry.value).toLocaleString()}
            </span>
              </div>
          ))}
        </div>
      </div>
  );
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_ENDPOINTS.DASHBOARD);

        if (response.data.success && isMounted) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const chartData = data?.chart_data || [];

  const pieData = data ? [
    { name: 'Staked AGR', value: Number(data.total_staked) || 0, color: '#818cf8' },
    { name: 'Liquid USDT', value: Number(data.usdt_pool) || 0, color: '#34d399' },
    { name: 'Pending Deps', value: Number(data.pending_deposits_amount) || 0, color: '#fbbf24' },
  ] : [];

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
          <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium animate-pulse">Syncing nodes...</p>
        </div>
    );
  }

  return (
      <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-700">

        {/* --- HERO HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Platform Active
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
              Overview
            </h1>
            <p className="text-slate-400 mt-2 text-sm font-medium">
              Welcome back, {data?.admin?.name || 'Admin'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/deposits')} className="px-5 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 rounded-xl text-sm font-medium text-white transition-all">
              Review Deposits
            </button>
            {/*<button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)] border border-indigo-500/50 rounded-xl text-sm font-medium text-white transition-all flex items-center gap-2">*/}
            {/*  <Download className="w-4 h-4" /> Export Ledger*/}
            {/*</button>*/}
          </div>
        </div>

        {/* --- BENTO GRID SYSTEM --- */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">

          {/* 1. Primary Metrics (Top Row) */}
          {[
            { label: 'Total Volume', value: `$${formatCompact(data?.total_deposits)}`, trend: 'Lifetime', isUp: true, icon: Activity },
            { label: 'Active Users', value: (data?.active_users || 0).toLocaleString(), trend: `${data?.active_users}/${data?.users}`, isUp: true, icon: Users },
            { label: 'Total Staked', value: `$${formatCompact(data?.total_staked)}`, trend: `${data?.active_stakes} Active`, isUp: true, icon: Coins },
            { label: 'Pending Docs', value: data?.pending_deposits || 0, trend: 'Action Needed', isUp: false, icon: ShieldCheck },
          ].map((stat, i) => (
              <div key={i} className="col-span-12 sm:col-span-6 lg:col-span-3 bg-[#0A0A0A]/40 backdrop-blur-xl border border-white/[0.05] rounded-3xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center group-hover:bg-white/[0.08] transition-colors">
                    <stat.icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                  <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-lg ${stat.isUp ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-400 bg-rose-400/10'}`}>
                {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.trend}
              </span>
                </div>
                <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold font-mono tracking-tight text-white group-hover:scale-[1.02] origin-left transition-transform duration-300">
                  {stat.value}
                </h3>
              </div>
          ))}

          {/* 2. Main Chart */}
          <div className="col-span-12 xl:col-span-8 bg-[#0A0A0A]/40 backdrop-blur-xl border border-white/[0.05] rounded-3xl p-6 relative group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-lg font-semibold text-white">Cashflow Dynamics</h2>
                <p className="text-sm text-slate-500">Deposit, Staking, and Exchange Action</p>
              </div>
            </div>

            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {/* Removed manual domain to let Recharts auto-scale naturally */}
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDep" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorStake" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorEx" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f472b6" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#f472b6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#334155" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis hide />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }} />

                  <Area type="monotone" dataKey="deposits" name="Deposits" stroke="#818cf8" strokeWidth={3} fill="url(#colorDep)" activeDot={{ r: 6, fill: "#0f172a", stroke: "#818cf8", strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="stakes" name="Stakes" stroke="#34d399" strokeWidth={3} fill="url(#colorStake)" activeDot={{ r: 6, fill: "#0f172a", stroke: "#34d399", strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="exchanges" name="Exchanges" stroke="#f472b6" strokeWidth={3} fill="url(#colorEx)" activeDot={{ r: 6, fill: "#0f172a", stroke: "#f472b6", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. Portfolio/Pools Donut */}
          <div className="col-span-12 md:col-span-6 xl:col-span-4 bg-[#0A0A0A]/40 backdrop-blur-xl border border-white/[0.05] rounded-3xl p-6 flex flex-col">
            <div>
              <h2 className="text-lg font-semibold text-white">Value Distribution</h2>
              <p className="text-sm text-slate-500">Global asset allocation</p>
            </div>

            <div className="flex-1 flex items-center justify-center relative min-h-[220px]">
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
                <span className="text-3xl font-bold text-white font-mono tracking-tighter">{data?.active_wallets || 0}</span>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Active Wallets</span>
              </div>

              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={75} outerRadius={95} paddingAngle={8} dataKey="value" stroke="none" cornerRadius={8}>
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3 mt-4">
              {pieData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.02] p-3 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}` }}></div>
                      <span className="text-sm font-medium text-slate-300">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-white font-mono">${formatCompact(item.value)}</span>
                  </div>
              ))}
            </div>
          </div>

          {/* 4. Infrastructure Stats */}
          <div className="col-span-12 md:col-span-6 xl:col-span-4 bg-gradient-to-br from-indigo-500/[0.05] to-transparent border border-indigo-500/10 rounded-3xl p-6 group cursor-pointer hover:border-indigo-500/30 transition-colors" onClick={() => navigate('/wallet-pools')}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Network Status</p>
                <p className="text-lg font-bold text-white">Wallet Infrastructure</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/[0.05] pb-3">
                <span className="text-sm text-slate-400">Total Provisioned</span>
                <span className="text-sm font-bold text-white font-mono">{data?.total_wallets || 0}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/[0.05] pb-3">
                <span className="text-sm text-slate-400">USDT Reserves</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">${formatCompact(data?.usdt_pool)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">AGR Liquidity</span>
                <span className="text-sm font-bold text-indigo-400 font-mono">{formatCompact(data?.agr_pool)}</span>
              </div>
            </div>
          </div>

          {/* 5. Quick Actions Bento */}
          <div className="col-span-12 xl:col-span-8 bg-[#0A0A0A]/40 backdrop-blur-xl border border-white/[0.05] rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Quick Access</h2>
              <button className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">View All Routing</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Manage Users', icon: Users, link: '/users' },
                { label: 'Transactions', icon: Receipt, link: '/transactions' },
                { label: 'Exchange Log', icon: ArrowLeftRight, link: '/exchange-transactions' },
                { label: 'Staking Plans', icon: Coins, link: '/plans' }
              ].map((action, i) => (
                  <button key={i} onClick={() => navigate(action.link)} className="flex flex-col items-center justify-center gap-3 p-5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.02] hover:border-white/[0.1] rounded-2xl transition-all group">
                    <action.icon className="w-6 h-6 text-slate-400 group-hover:text-white group-hover:-translate-y-1 transition-all" />
                    <span className="text-sm font-medium text-slate-300 group-hover:text-white">{action.label}</span>
                  </button>
              ))}
            </div>
          </div>

        </div>
      </div>
  );
};

export default Dashboard;