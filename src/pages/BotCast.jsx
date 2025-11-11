import { useState, useEffect } from 'react';
import axios from '../services/axios';
import { API_ENDPOINTS } from '../config/api';
import { MessageSquare, Send, Users, Sparkles, CheckCircle2, AlertCircle, Zap, Globe, Mail, TrendingUp } from 'lucide-react';

const BotCast = () => {
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('all');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.USERS);
      if (response.data.success) {
        setUsers(response.data.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(API_ENDPOINTS.BOT_CAST, {
        to: recipient,
        message: message,
      });

      if (response.data.success) {
        setSuccess('Message sent successfully!');
        setMessage('');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700/50 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
                  <MessageSquare className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Bot Cast
                  </h1>
                  <p className="text-slate-400 mt-1">Send messages to users via Telegram bot</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message Form */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-lg shadow-blue-500/30">
                  <MessageSquare className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Compose Message</h2>
                  <p className="text-sm text-slate-400">Send notifications to your users</p>
                </div>
              </div>

              {success && (
                  <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl backdrop-blur-sm flex items-start gap-3 animate-slideDown">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-green-300">{success}</p>
                      <p className="text-xs text-green-400/70 mt-1">Your message has been delivered successfully</p>
                    </div>
                  </div>
              )}

              {error && (
                  <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm flex items-start gap-3 animate-slideDown">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-300">{error}</p>
                      <p className="text-xs text-red-400/70 mt-1">Please try again or contact support</p>
                    </div>
                  </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Recipient Selector */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    Recipient
                  </label>
                  <div className="relative">
                    <select
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="w-full px-4 py-3.5 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition backdrop-blur-sm appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a78bfa'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 1rem center',
                          backgroundSize: '1.5em 1.5em',
                          paddingRight: '3rem'
                        }}
                    >
                      <option value="all">🌐 All Users ({users.length} users)</option>
                      {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            👤 {user.name} ({user.email})
                          </option>
                      ))}
                    </select>
                    <div className="absolute right-12 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <Globe className="w-4 h-4 text-purple-400" />
                    </div>
                  </div>
                </div>

                {/* Message Textarea */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-purple-400" />
                    Message
                  </label>
                  <div className="relative">
                  <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={8}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-slate-500 resize-none"
                      placeholder="Enter your message here... Use \n for line breaks."
                      required
                  />
                    <div className="absolute bottom-3 right-3 text-xs text-slate-500 bg-slate-800/80 px-2 py-1 rounded-lg backdrop-blur-sm">
                      {message.length} chars
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <p className="text-xs text-slate-400">
                      Tip: Use <span className="text-purple-400 font-mono">\n</span> to create line breaks in your message
                    </p>
                  </div>
                </div>

                {/* Preview Box */}
                {message && (
                    <div className="bg-slate-900/50 border border-slate-600 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Preview</span>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3 text-sm text-slate-300 whitespace-pre-wrap">
                        {message}
                      </div>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] group"
                >
                  {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending Message...
                      </>
                  ) : (
                      <>
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                        Send Message
                      </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Recipients Stats */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Users className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-semibold text-white">Recipients</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-slate-400">Total Users</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{users.length}</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-slate-400">Selected</span>
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {recipient === 'all' ? 'All Users' : '1 User'}
                  </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-6 border border-blue-500/20 backdrop-blur-sm shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-400" strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-semibold text-blue-300">Tips & Guidelines</h3>
              </div>
              <ul className="space-y-3 text-sm text-blue-200">
                <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 font-bold">1</span>
                </span>
                  <span>Messages are sent via Telegram bot instantly</span>
                </li>
                <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 font-bold">2</span>
                </span>
                  <span>Only users with Telegram ID will receive messages</span>
                </li>
                <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 font-bold">3</span>
                </span>
                  <span>Use <span className="text-purple-300 font-mono">\n</span> for line breaks in your message</span>
                </li>
                <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 font-bold">4</span>
                </span>
                  <span>Keep messages clear, concise, and professional</span>
                </li>
                <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 font-bold">5</span>
                </span>
                  <span>Preview your message before sending</span>
                </li>
              </ul>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-6 shadow-xl">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">Message Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
                  <span className="text-sm text-slate-400">Avg. Message Length</span>
                  <span className="text-sm font-bold text-white">~120 chars</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
                  <span className="text-sm text-slate-400">Success Rate</span>
                  <span className="text-sm font-bold text-green-400">98.5%</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-slate-400">Response Time</span>
                  <span className="text-sm font-bold text-blue-400">Instant</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animation Styles */}
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
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
      </div>
  );
};

export default BotCast;
