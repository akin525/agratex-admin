import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Eye, EyeOff, LogIn, Shield, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError(result.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) return null;

  return (
      <div className="flex min-h-screen bg-slate-950 font-sans text-slate-200">

        {/* Left Side: Brand Visuals (Hidden on smaller screens) */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 items-center justify-center border-r border-slate-800">
          {/* Abstract Background Elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(99,102,241,0.15),transparent_50%)]"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,rgba(168,85,247,0.15),transparent_50%)]"></div>
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}></div>
          </div>

          {/* Content */}
          <div className="relative z-10 p-12 max-w-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl shadow-indigo-500/20 mb-8 relative">
              <Shield className="w-8 h-8 text-white" />
              <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-slate-950 rounded-full flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              Manage your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
               Agartex Admin.
            </span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Secure, scalable, and intuitive. Access your control panel to oversee operations, manage users, and analyze system metrics in real-time.
            </p>

            {/* Social Proof / Stats placeholder */}
            <div className="flex items-center gap-6 pt-8 border-t border-slate-800/60">
              <div>
                <p className="text-2xl font-bold text-white">99.9%</p>
                <p className="text-sm text-slate-500">System Uptime</p>
              </div>
              <div className="w-px h-10 bg-slate-800"></div>
              <div>
                <p className="text-2xl font-bold text-white">256-bit</p>
                <p className="text-sm text-slate-500">Encryption</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
          <div className="w-full max-w-md space-y-8">

            {/* Mobile Header (Only visible on small screens) */}
            <div className="lg:hidden flex flex-col items-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Agartex Admin</h2>
            </div>

            {/* Form Header */}
            <div>
              <h1 className="text-3xl font-semibold text-white tracking-tight">Welcome back</h1>
              <p className="text-slate-400 mt-2 text-sm">Please enter your details to sign in.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Error Message */}
              {error && (
                  <div className="flex items-center gap-3 p-3.5 bg-red-500/10 border border-red-500/20 rounded-lg animate-shake">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <p className="text-red-400 text-sm font-medium">{error}</p>
                  </div>
              )}

              {/* Input Group */}
              <div className="space-y-5">

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-300 block">
                    Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
                        placeholder="admin@agartex.com"
                        required
                        autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-slate-300 block">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
                        placeholder="••••••••"
                        required
                        autoComplete="current-password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Options Row */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer appearance-none w-4 h-4 border border-slate-700 rounded bg-slate-900 checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer" />
                    <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-lg shadow-indigo-500/20"
              >
                {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Authenticating...
                    </>
                ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
              </button>
            </form>

            <p className="text-center text-slate-500 text-xs mt-8">
              © {new Date().getFullYear()} Agartex Systems. All rights reserved.
            </p>
          </div>
        </div>

        <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
      </div>
  );
};

export default Login;