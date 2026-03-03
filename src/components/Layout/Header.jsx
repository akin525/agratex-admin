import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bell, LogOut, User, ChevronRight, Shield, Search, Menu } from 'lucide-react';

const PAGE_TITLES = {
  '/dashboard': { title: 'Dashboard', description: 'Overview & Analytics' },
  '/users': { title: 'Users', description: 'User Management' },
  '/deposits': { title: 'Deposits', description: 'Deposit Management' },
  '/transactions': { title: 'Transactions', description: 'Transaction Ledger' },
  '/exchange-transactions': { title: 'Exchanges', description: 'Exchange History' },
  '/currency-pairs': { title: 'Currency Pairs', description: 'Exchange Rates' },
  '/wallet-pools': { title: 'Wallet Pools', description: 'Crypto Wallets' },
  '/plans': { title: 'Plans', description: 'Investment Plans' },
  '/investments': { title: 'Investments', description: 'User Investments' },
  '/staking': { title: 'Staking', description: 'Staking Management' },
  '/user-rankings': { title: 'Rankings', description: 'User Rank Tiers' },
  '/legacy-levels': { title: 'Legacy Levels', description: 'Level Tiers' },
  '/legacy-requirements': { title: 'Requirements', description: 'Level Requirements' },
  '/referrals': { title: 'Referrals', description: 'Commission Config' },
  '/bot-cast': { title: 'Bot Cast', description: 'Broadcast Messages' },
  '/settings': { title: 'Settings', description: 'Platform Configuration' },
};

// Notice the new prop: setMobileOpen
const Header = ({ setMobileOpen }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);

  // Safely extract the base path
  const pathBase = '/' + (location.pathname.split('/')[1] || '');
  const pageInfo = PAGE_TITLES[pathBase] || { title: 'Admin Panel', description: '' };

  // Dynamic override for specific routes
  const isUserDetails = location.pathname.match(/^\/users\/\d+/);
  if (isUserDetails) {
    pageInfo.title = 'User Details';
    pageInfo.description = 'User Profile & Activity';
  }

  return (
      <header className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60 flex items-center justify-between px-4 lg:px-8 transition-all">

        {/* Left: Mobile Toggle & Page Identity */}
        <div className="flex items-center gap-4">
          {/* Mobile Hamburger Button */}
          <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
              aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-0.5">
              <span className="hover:text-slate-300 cursor-pointer transition-colors">Admin</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-indigo-400">{pageInfo.title}</span>
            </div>
            <h2 className="text-xl font-semibold text-white leading-none tracking-tight">
              {pageInfo.title}
            </h2>
          </div>

          {/* Mobile Title (Simplified) */}
          <h2 className="sm:hidden text-lg font-semibold text-white">
            {pageInfo.title}
          </h2>
        </div>

        {/* Right: Quick Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Utility Icons (Search & Notifications) */}
          <div className="flex items-center gap-1 sm:gap-2 mr-2 border-r border-slate-800/60 pr-4">
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-full transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-full transition-colors relative">
              <Bell className="w-4 h-4" />
              {/* Notification Dot */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 border-2 border-slate-950 rounded-full"></span>
            </button>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <div className="hidden md:flex flex-col items-end text-right">
              <span className="text-sm font-semibold text-white leading-none mb-1">
                {user?.name || user?.email || 'Admin'}
              </span>
                <span className="text-xs text-slate-500 leading-none">Administrator</span>
              </div>

              {/* Avatar */}
              <div className="w-9 h-9 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 shrink-0">
                <User className="w-4 h-4" />
              </div>
            </button>

            {/* Dropdown Menu */}
            {showProfile && (
                <>
                  {/* Invisible overlay to catch outside clicks */}
                  <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowProfile(false)}
                  ></div>

                  <div className="absolute right-0 top-[calc(100%+0.5rem)] w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info Header */}
                    <div className="p-4 border-b border-slate-800/60 bg-slate-800/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center shrink-0">
                          <Shield className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-white truncate">
                            {user?.name || 'Super Admin'}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            {user?.email || 'admin@agartex.com'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-2">
                      <button
                          onClick={() => {
                            setShowProfile(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors text-sm font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
            )}
          </div>
        </div>
      </header>
  );
};

export default Header;