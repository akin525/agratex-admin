import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  LayoutDashboard, Users, Package, TrendingUp, Coins, Settings,
  MessageSquare, UserCog, ChevronLeft, ChevronRight, Layers,
  Activity, Shield, Zap, LogOut, Award, Target, Download,
  Receipt, ArrowLeftRight, DollarSign, Wallet, Trophy,
  ChevronDown, ChevronUp, X
} from 'lucide-react';

// Notice the new props: mobileOpen and setMobileOpen
const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({ main: true, financial: true, staking: true, system: true });
  const { logout } = useAuth();
  const location = useLocation();

  // Close mobile sidebar automatically when route changes
  useEffect(() => {
    if (mobileOpen) setMobileOpen(false);
  }, [location.pathname]);

  const toggleGroup = (group) => {
    if (collapsed) return;
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const menuGroups = [
    {
      id: 'main',
      label: 'Main',
      items: [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', activeColor: 'text-indigo-400' },
        { path: '/users', icon: Users, label: 'Users', activeColor: 'text-purple-400' },
      ],
    },
    {
      id: 'financial',
      label: 'Financial',
      items: [
        { path: '/deposits', icon: Download, label: 'Deposits', activeColor: 'text-emerald-400' },
        { path: '/transactions', icon: Receipt, label: 'Transactions', activeColor: 'text-blue-400' },
        { path: '/exchange-transactions', icon: ArrowLeftRight, label: 'Exchanges', activeColor: 'text-rose-400' },
        { path: '/currency-pairs', icon: DollarSign, label: 'Currency Pairs', activeColor: 'text-amber-400' },
        { path: '/wallet-pools', icon: Wallet, label: 'Wallet Pools', activeColor: 'text-cyan-400' },
      ],
    },
    {
      id: 'staking',
      label: 'Investments & Staking',
      items: [
        { path: '/plans', icon: Package, label: 'Plans', activeColor: 'text-emerald-400' },
        { path: '/investments', icon: TrendingUp, label: 'Investments', activeColor: 'text-orange-400' },
        { path: '/staking', icon: Coins, label: 'Staking', activeColor: 'text-yellow-400', badge: 'Hot' },
        { path: '/user-rankings', icon: Trophy, label: 'User Rankings', activeColor: 'text-amber-400' },
        { path: '/legacy-levels', icon: Award, label: 'Legacy Levels', activeColor: 'text-pink-400' },
        { path: '/legacy-requirements', icon: Target, label: 'Requirements', activeColor: 'text-violet-400' },
        { path: '/referrals', icon: UserCog, label: 'Referrals', activeColor: 'text-indigo-400' },
      ],
    },
    {
      id: 'system',
      label: 'System',
      items: [
        { path: '/bot-cast', icon: MessageSquare, label: 'Bot Cast', activeColor: 'text-cyan-400' },
        { path: '/settings', icon: Settings, label: 'Settings', activeColor: 'text-slate-300' },
      ],
    },
  ];

  return (
      <>
        {/* Mobile Overlay Background */}
        {mobileOpen && (
            <div
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                onClick={() => setMobileOpen(false)}
            />
        )}

        {/* Sidebar Container */}
        <aside
            className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-950 border-r border-slate-800 transition-all duration-300 ease-in-out
          ${collapsed ? 'lg:w-20' : 'lg:w-72'} 
          ${mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0 lg:static'}
        `}
        >
          {/* Header / Logo */}
          <div className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-slate-800/60 shrink-0">
            {(!collapsed || mobileOpen) ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-center">
                    <Layers className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-white tracking-tight leading-none">Agartex</h1>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">Admin</p>
                  </div>
                </div>
            ) : (
                <div className="w-8 h-8 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-center mx-auto">
                  <Layers className="w-5 h-5 text-indigo-400" />
                </div>
            )}

            {/* Mobile Close Button */}
            <button
                className="lg:hidden p-1 text-slate-400 hover:text-white transition-colors"
                onClick={() => setMobileOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Area */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {menuGroups.map((group) => (
                <div key={group.id} className="space-y-1">

                  {/* Group Header */}
                  {(!collapsed || mobileOpen) && (
                      <button
                          onClick={() => toggleGroup(group.id)}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors group/header"
                      >
                        <span className="uppercase tracking-wider">{group.label}</span>
                        {expandedGroups[group.id] ? (
                            <ChevronUp className="w-3.5 h-3.5 opacity-50 group-hover/header:opacity-100 transition-opacity" />
                        ) : (
                            <ChevronDown className="w-3.5 h-3.5 opacity-50 group-hover/header:opacity-100 transition-opacity" />
                        )}
                      </button>
                  )}

                  {/* Group Items */}
                  {((collapsed && !mobileOpen) || expandedGroups[group.id]) && (
                      <div className="space-y-0.5">
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          return (
                              <NavLink
                                  key={item.path}
                                  to={item.path}
                                  className={({ isActive }) =>
                                      `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative ${
                                          isActive
                                              ? 'bg-indigo-500/10 text-white'
                                              : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                                      } ${(collapsed && !mobileOpen) ? 'justify-center' : ''}`
                                  }
                              >
                                {({ isActive }) => (
                                    <>
                                      {/* Active Edge Indicator */}
                                      {isActive && (
                                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-500 rounded-r-full"></div>
                                      )}

                                      {/* Icon */}
                                      <Icon
                                          className={`w-5 h-5 transition-colors ${
                                              isActive ? item.activeColor : 'text-slate-500 group-hover:text-slate-300'
                                          }`}
                                          strokeWidth={isActive ? 2.5 : 2}
                                      />

                                      {/* Label */}
                                      {(!collapsed || mobileOpen) && (
                                          <span className="text-sm font-medium flex-1">
                                {item.label}
                              </span>
                                      )}

                                      {/* Badge */}
                                      {(!collapsed || mobileOpen) && item.badge && (
                                          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 rounded-md border border-indigo-500/20">
                                {item.badge}
                              </span>
                                      )}

                                      {/* Tooltip for collapsed desktop view */}
                                      {(collapsed && !mobileOpen) && (
                                          <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded shadow-xl border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                                            {item.label}
                                          </div>
                                      )}
                                    </>
                                )}
                              </NavLink>
                          );
                        })}
                      </div>
                  )}

                  {/* Divider for collapsed state */}
                  {(collapsed && !mobileOpen) && <div className="h-px bg-slate-800/60 mx-4 my-2" />}
                </div>
            ))}
          </nav>

          {/* Footer Area (Collapse & Logout) */}
          <div className="p-3 border-t border-slate-800/60 space-y-1 shrink-0">

            {/* Desktop Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden lg:flex w-full items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-all justify-center"
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>

            <button
                onClick={logout}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all ${
                    (collapsed && !mobileOpen) ? 'justify-center' : ''
                }`}
                title="Logout"
            >
              <LogOut className="w-5 h-5" />
              {(!collapsed || mobileOpen) && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        </aside>
      </>
  );
};

export default Sidebar;