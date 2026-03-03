import { useState, useEffect } from 'react';
import axios from '../services/axios';
import { API_ENDPOINTS } from '../config/api';
import { useToast } from '../components/ui/Toast';
import { MessageSquare, Send, Users, Globe, User } from 'lucide-react';
import { LoadingSpinner, PageHeader, FormInput, FormSelect, Button } from '../components/ui';

const BotCast = () => {
  const toast = useToast();
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('all');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.USERS);
        if (response.data.success) {
          const d = response.data.data;
          setUsers(d.data || d || []);
        }
      } catch (error) {
        // silent
      } finally {
        setUsersLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.warning('Please enter a message');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(API_ENDPOINTS.BOT_CAST, {
        message: message.trim(),
        recipient,
      });
      if (response.data.success) {
        toast.success(response.data.message || 'Message sent successfully');
        setMessage('');
      } else {
        toast.error(response.data.message || 'Failed to send message');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader icon={MessageSquare} title="Bot Cast" description="Send broadcast messages to users" gradient="from-teal-500 to-cyan-500" />

      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Send className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Compose Message</h2>
                <p className="text-slate-400 text-sm">Send a message via Telegram bot</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSend} className="p-6 space-y-5">
            {/* Recipient */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Recipient</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRecipient('all')}
                  className={`p-4 rounded-xl border transition-all flex items-center gap-3 ${
                    recipient === 'all'
                      ? 'bg-teal-500/10 border-teal-500/50 text-teal-400'
                      : 'bg-slate-800/50 border-slate-700/30 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <Globe className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-semibold text-sm">All Users</p>
                    <p className="text-xs opacity-70">Broadcast to everyone</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setRecipient('specific')}
                  className={`p-4 rounded-xl border transition-all flex items-center gap-3 ${
                    recipient === 'specific'
                      ? 'bg-teal-500/10 border-teal-500/50 text-teal-400'
                      : 'bg-slate-800/50 border-slate-700/30 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-semibold text-sm">Specific User</p>
                    <p className="text-xs opacity-70">Send to one user</p>
                  </div>
                </button>
              </div>
            </div>

            {recipient === 'specific' && (
              <FormSelect
                label="Select User"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              >
                <option value="specific">-- Select a user --</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username || user.email} (ID: {user.id})
                  </option>
                ))}
              </FormSelect>
            )}

            {/* Message */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition resize-none"
                placeholder="Type your broadcast message here..."
                required
              />
              <p className="text-xs text-slate-500 mt-1.5">{message.length} characters</p>
            </div>

            <Button type="submit" icon={Send} loading={loading} className="w-full">
              {loading ? 'Sending...' : 'Send Broadcast'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BotCast;