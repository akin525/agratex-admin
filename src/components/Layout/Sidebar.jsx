import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  TrendingUp,
  Coins,
  Settings,
  MessageSquare,
  UserCog,
  ChevronLeft,
  ChevronRight,
  Layers,
  Activity,
  Shield,
  Zap, LogOut,
} from 'lucide-react';
import { useState } from 'react';
import {useAuth} from "../../context/AuthContext.jsx";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();

  const menuItems = [
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      color: 'from-blue-500 to-cyan-500',
      badge: null
    },
    {
      path: '/users',
      icon: Users,
      label: 'Users',
      color: 'from-purple-500 to-pink-500',
      badge: null
    },
    // {
    //   path: '/plans',
    //   icon: Package,
    //   label: 'Plans',
    //   color: 'from-green-500 to-emerald-500',
    //   badge: null
    // },
    {
      path: '/investments',
      icon: TrendingUp,
      label: 'Investments',
      color: 'from-orange-500 to-red-500',
      badge: null
    },
    {
      path: '/staking',
      icon: Coins,
      label: 'Staking',
      color: 'from-yellow-500 to-orange-500',
      badge: 'Hot'
    },
    {
      path: '/referrals',
      icon: UserCog,
      label: 'Referrals',
      color: 'from-indigo-500 to-purple-500',
      badge: null
    },
    {
      path: '/bot-cast',
      icon: MessageSquare,
      label: 'Bot Cast',
      color: 'from-teal-500 to-cyan-500',
      badge: null
    },
    {
      path: '/settings',
      icon: Settings,
      label: 'Settings',
      color: 'from-gray-500 to-slate-500',
      badge: null
    },
  ];
  const handleLogout = () => {
    // if (window.confirm('Are you sure you want to logout?')) {
      logout();
    // }
  };
  return (
      <aside
          className={`bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-300 ${
              collapsed ? 'w-20' : 'w-72'
          } min-h-screen flex flex-col relative border-r border-slate-700/50 shadow-2xl`}
      >
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>

        {/* Glow Effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>

        {/* Logo Section */}
        <div className="p-6 border-b border-slate-700/50 relative z-10">
          <div className="flex items-center justify-between">
            {!collapsed ? (
                <div className="flex items-center gap-3">
                  {/* Logo Icon */}
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50 relative">
                    <Layers className="w-6 h-6 text-white" strokeWidth={2.5} />
                    <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse"></div>
                  </div>

                  {/* Logo Text */}
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      Agartex
                    </h1>
                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Admin Portal
                    </p>
                  </div>
                </div>
            ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50 mx-auto relative">
                  <Layers className="w-6 h-6 text-white" strokeWidth={2.5} />
                  <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse"></div>
                </div>
            )}

            {/* Collapse Button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className={`p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 border border-slate-600/30 ${
                    collapsed ? 'absolute -right-3 top-6 bg-slate-800 shadow-lg' : ''
                }`}
                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                  <ChevronRight className="w-4 h-4 text-purple-400" />
              ) : (
                  <ChevronLeft className="w-4 h-4 text-purple-400" />
              )}
            </button>
          </div>

          {/* Quick Stats (when expanded) */}
          {!collapsed && (
              <div className="mt-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-green-400">
                    <Activity className="w-3 h-3" />
                    <span>System Active</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-yellow-400 animate-pulse" />
                    <span className="text-slate-400">Live</span>
                  </div>
                </div>
              </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 relative z-10 overflow-y-auto custom-scrollbar">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
                <li key={item.path}>
                  <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                          `group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 relative overflow-hidden ${
                              isActive
                                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-white hover:translate-x-1'
                          }`
                      }
                      title={collapsed ? item.label : ''}
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                  >
                    {/* Active Indicator */}
                    <NavLink to={item.path}>
                      {({ isActive }) => (
                          <>
                            {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-pulse"></div>
                            )}
                          </>
                      )}
                    </NavLink>

                    {/* Icon with gradient background on hover */}
                    <div className="relative">
                      <item.icon className="w-5 h-5 flex-shrink-0 relative z-10" strokeWidth={2} />
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`}></div>
                    </div>

                    {/* Label */}
                    {!collapsed && (
                        <span className="font-semibold flex-1 relative z-10">
                    {item.label}
                  </span>
                    )}

                    {/* Badge */}
                    {!collapsed && item.badge && (
                        <span className="px-2 py-0.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full shadow-lg shadow-orange-500/50 animate-pulse">
                    {item.badge}
                  </span>
                    )}

                    {/* Hover Effect Line */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-r-full"></div>
                  </NavLink>
                </li>
            ))}
          </ul>

          {/* Divider */}
          {!collapsed && (
              <div className="my-6 border-t border-slate-700/50 relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
              </div>
          )}

          {/* Quick Actions (when expanded) */}
          {!collapsed && (
              <div className="mt-4 p-4 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl border border-purple-500/20 backdrop-blur-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button
                      className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200 flex items-center gap-2 group">
                    <Zap className="w-4 h-4 text-yellow-400 group-hover:animate-pulse"/>
                    <span>New Broadcast</span>
                  </button>
                  <button
                      className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200 flex items-center gap-2 group">
                    <Activity className="w-4 h-4 text-green-400"/>
                    <span>System Status</span>
                  </button>

                  <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all group font-medium"
                  >
                    <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform"/>
                    Logout
                  </button>
                </div>
              </div>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50 relative z-10">
          {!collapsed ? (
              <div className="space-y-3">
                {/* Status Card */}
                <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-400">Server Status</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                      <span className="text-xs text-green-400 font-medium">Online</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-400 to-emerald-400 h-full rounded-full animate-pulse" style={{ width: '94%' }}></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">94% Uptime</p>
                </div>

                {/* Copyright */}
                <p className="text-xs text-slate-500 text-center font-medium">
                  © 2024 Agartex. <span className="text-purple-400">v1.0</span>
                </p>
              </div>
          ) : (
              <div className="flex justify-center">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              </div>
          )}
        </div>

        {/* Custom Scrollbar Styles */}
        <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #8b5cf6, #3b82f6);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7c3aed, #2563eb);
        }
      `}</style>
      </aside>
  );
};

export default Sidebar;
