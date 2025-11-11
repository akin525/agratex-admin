import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Bell } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 px-6 py-4 shadow-xl relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

        <div className="flex items-center justify-between relative z-10">
          {/* Page Title */}
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h2>
            <p className="text-sm text-slate-400 flex items-center gap-2 mt-1">
              Welcome back,
              <span className="text-purple-400 font-semibold">{user?.name || 'Admin'}</span>
              <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              <span className="text-xs text-green-400">Online</span>
            </span>
            </p>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all border border-slate-700/50 hover:border-slate-600 hover:shadow-lg hover:shadow-purple-500/10 group">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></span>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-white text-xs flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              3
            </span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-3 p-2 pr-4 hover:bg-slate-700/50 rounded-xl transition-all border border-slate-700/50 hover:border-slate-600 hover:shadow-lg hover:shadow-purple-500/10 group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 relative overflow-hidden group-hover:shadow-purple-500/50 transition-shadow">
                  <User className="w-5 h-5 text-white relative z-10" strokeWidth={2.5} />
                  <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors"></div>
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-semibold text-white">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-slate-400">{user?.email || 'admin@agartex.com'}</p>
                </div>
                <svg
                    className={`w-4 h-4 text-slate-400 transition-transform hidden md:block ${showDropdown ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {showDropdown && (
                  <div className="absolute right-0 mt-3 w-56 bg-slate-800 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl z-50 overflow-hidden animate-slideDown">
                    {/* Profile Info */}
                    <div className="px-4 py-3 border-b border-slate-700/50 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                          <User className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{user?.name || 'Admin'}</p>
                          <p className="text-xs text-slate-400">{user?.email || 'admin@agartex.com'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Logout Button */}
                    <div className="p-2">
                      <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all group font-medium"
                      >
                        <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Logout
                      </button>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>

        <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
      </header>
  );
};

export default Header;
