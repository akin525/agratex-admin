import { useEffect, useState, useCallback, useMemo } from 'react';
import axios from '../services/axios';
import { API_ENDPOINTS } from '../config/api';
import { useToast } from '../components/ui/Toast';
import { Wallet, Plus, Edit, Trash2, Power, Unlock, Eye, EyeOff, Copy, Save, Shield, Server, CheckCircle2 } from 'lucide-react';
import { LoadingSpinner, PageHeader, EmptyState, Modal, FormInput, FormSelect, Button, StatusBadge } from '../components/ui';
import ConfirmDialog from '../components/ui/ConfirmDialog';

// Enriched Blockchain Config for better UI rendering
const BLOCKCHAINS = [
  { value: 'eth', label: 'Ethereum', symbol: 'ETH', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { value: 'bsc', label: 'BNB Chain', symbol: 'BNB', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  { value: 'pol', label: 'Polygon', symbol: 'POL', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  { value: 'tron', label: 'TRON', symbol: 'TRX', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
];

const INITIAL_FORM = { label: '', address: '', password: '', balance: 0, blockchain: 'bsc', status: 1 };

const WalletPools = () => {
  const toast = useToast();
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & Form State
  const [showModal, setShowModal] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [showKey, setShowKey] = useState(false); // Fixed: Toggle for private key

  // Filtering & Dialogs
  const [blockchainFilter, setBlockchainFilter] = useState('all');
  const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null });

  const fetchWallets = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(API_ENDPOINTS.WALLET_POOLS, {
        params: { blockchain: blockchainFilter !== 'all' ? blockchainFilter : undefined }
      });
      if (data.success) setWallets(data.data || []);
    } catch (error) {
      toast.error('Failed to sync node connections');
    } finally {
      setLoading(false);
    }
  }, [blockchainFilter, toast]);

  useEffect(() => { fetchWallets(); }, [fetchWallets]);

  // Unified Form Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = (wallet = null) => {
    if (wallet) {
      setEditingWallet(wallet);
      setForm({ ...wallet, password: wallet.password || '' }); // Ensure password field isn't undefined
    } else {
      setEditingWallet(null);
      setForm(INITIAL_FORM);
    }
    setShowKey(false); // Always hide key when opening modal
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const endpoint = editingWallet
          ? API_ENDPOINTS.UPDATE_WALLET_POOL(editingWallet.id)
          : API_ENDPOINTS.CREATE_WALLET_POOL;
      const method = editingWallet ? 'put' : 'post';

      const { data } = await axios[method](endpoint, form);

      if (data.success) {
        toast.success(data.message || `Wallet successfully ${editingWallet ? 'updated' : 'provisioned'}`);
        setShowModal(false);
        fetchWallets();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Configuration failed');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (wallet) => {
    try {
      setWallets(prev => prev.map(w => w.id === wallet.id ? { ...w, status: w.status === 1 ? 0 : 1 } : w));
      await axios.post(API_ENDPOINTS.TOGGLE_WALLET_POOL(wallet.id));
      toast.success(`${wallet.label} status updated`);
    } catch (error) {
      toast.error('Failed to toggle node status');
      fetchWallets(); // Rollback on fail
    }
  };

  const releaseWallet = async (wallet) => {
    try {
      setWallets(prev => prev.map(w => w.id === wallet.id ? { ...w, inuse: 0 } : w));
      await axios.post(API_ENDPOINTS.RELEASE_WALLET_POOL(wallet.id));
      toast.success('Wallet lock released');
    } catch (error) {
      toast.error('Failed to release lock');
      fetchWallets();
    }
  };

  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(API_ENDPOINTS.DELETE_WALLET_POOL(confirmDialog.id));
      if (data.success) {
        toast.success('Wallet purged from system');
        fetchWallets();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cannot delete in-use wallet');
    } finally {
      setConfirmDialog({ open: false, id: null });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.info('Address copied to clipboard');
  };

  // Utilities for formatting
  const formatAddress = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : 'N/A';
  const getNetwork = (bc) => BLOCKCHAINS.find(b => b.value === bc) || { label: bc, symbol: '', color: 'text-slate-400', bg: 'bg-slate-800' };

  return (
      <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <PageHeader
            icon={Server}
            title="Liquidity Pools"
            description="Manage secure wallet addresses and network integrations"
            gradient="from-teal-400 to-emerald-600"
        >
          <Button icon={Plus} onClick={() => handleOpenModal()} className="shadow-lg shadow-teal-500/20">
            Provision Wallet
          </Button>
        </PageHeader>

        {/* Modern Filter Tabs */}
        <div className="flex bg-slate-900/50 p-1.5 rounded-2xl w-fit border border-white/5 shadow-inner">
          <button
              onClick={() => setBlockchainFilter('all')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${blockchainFilter === 'all' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            All Networks
          </button>
          {BLOCKCHAINS.map(bc => (
              <button
                  key={bc.value}
                  onClick={() => setBlockchainFilter(bc.value)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${blockchainFilter === bc.value ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                {bc.label}
              </button>
          ))}
        </div>

        <div className="bg-slate-900/40 backdrop-blur-sm rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
          {loading ? (
              <div className="py-24"><LoadingSpinner text="Querying Blockchain Nodes..." /></div>
          ) : wallets.length === 0 ? (
              <EmptyState icon={Shield} title="No Wallets Configured" description="Provision your first liquidity pool to begin processing." action={() => handleOpenModal()} actionLabel="Add Wallet" />
          ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                  <tr className="bg-slate-800/30 text-slate-400 text-[10px] uppercase tracking-[0.15em] font-bold">
                    <th className="p-5">Identifier / Address</th>
                    <th className="p-5">Network</th>
                    <th className="p-5 hidden md:table-cell">Pool Balance</th>
                    <th className="p-5 hidden md:table-cell">Allocation</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 text-right">Controls</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                  {wallets.map((wallet) => {
                    const net = getNetwork(wallet.blockchain);
                    return (
                        <tr key={wallet.id} className="group hover:bg-teal-500/5 transition-colors cursor-default">
                          <td className="p-5">
                            <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                            {wallet.label}
                          </span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-slate-500">{formatAddress(wallet.address)}</span>
                                {wallet.address && (
                                    <button onClick={() => copyToClipboard(wallet.address)} className="text-slate-600 hover:text-teal-400 transition-colors">
                                      <Copy className="w-3 h-3" />
                                    </button>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="p-5">
                        <span className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider ${net.bg} ${net.color}`}>
                          {net.label}
                        </span>
                          </td>

                          <td className="p-5 hidden md:table-cell">
                            <div className="flex items-end gap-1.5">
                              <span className="text-sm font-mono font-bold text-white">{parseFloat(wallet.balance).toLocaleString()}</span>
                              <span className="text-[10px] font-bold text-slate-500 mb-0.5">{net.symbol}</span>
                            </div>
                          </td>

                          <td className="p-5 hidden md:table-cell">
                            {wallet.inuse == 1 ? (
                                <div className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full w-fit">
                                  <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span></span>
                                  <span className="text-[10px] font-bold uppercase tracking-wider">Locked</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 text-slate-400 bg-slate-800 px-3 py-1 rounded-full w-fit border border-white/5">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span className="text-[10px] font-bold uppercase tracking-wider">Idle</span>
                                </div>
                            )}
                          </td>

                          <td className="p-5"><StatusBadge status={wallet.status} /></td>

                          <td className="p-5">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => toggleStatus(wallet)} className={`p-2.5 rounded-xl transition-all shadow-lg border border-white/5 ${wallet.status == 1 ? 'bg-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'}`} title={wallet.status == 1 ? "Disable" : "Enable"}>
                                <Power className="w-4 h-4" />
                              </button>

                              {wallet.inuse == 1 && (
                                  <button onClick={() => releaseWallet(wallet)} className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 rounded-xl transition-all shadow-lg" title="Force Release Lock">
                                    <Unlock className="w-4 h-4" />
                                  </button>
                              )}

                              <button onClick={() => handleOpenModal(wallet)} className="p-2.5 bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all shadow-lg border border-white/5" title="Edit Configuration">
                                <Edit className="w-4 h-4" />
                              </button>

                              <button onClick={() => setConfirmDialog({ open: true, id: wallet.id })} className="p-2.5 bg-slate-800 text-slate-400 hover:text-rose-500 rounded-xl transition-all shadow-lg border border-white/5" title="Delete Wallet">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                    );
                  })}
                  </tbody>
                </table>
              </div>
          )}
        </div>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingWallet ? 'Reconfigure Wallet' : 'Provision New Pool'} icon={Shield}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput label="Identifier / Label" name="label" value={form.label} onChange={handleInputChange} placeholder="e.g. Master Settlement Wallet" required />
            <FormInput label="Public Address" name="address" value={form.address} onChange={handleInputChange} placeholder="0x..." className="font-mono text-sm" required />

            {/* Custom field for Private Key to include the toggle button */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Private Key / Password</label>
              <div className="relative">
                <input
                    type={showKey ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleInputChange}
                    placeholder={editingWallet ? "•••••••• (Leave blank to keep unchanged)" : "Enter secure key"}
                    required={!editingWallet}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all pr-12"
                />
                <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-teal-400 transition-colors"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormSelect label="Blockchain Network" name="blockchain" value={form.blockchain} onChange={handleInputChange}>
                {BLOCKCHAINS.map(bc => <option key={bc.value} value={bc.value}>{bc.label}</option>)}
              </FormSelect>
              <FormInput label="Initial Ledger Balance" name="balance" type="number" step="any" value={form.balance} onChange={handleInputChange} placeholder="0.00" font="font-mono" />
            </div>

            <Button type="submit" loading={saving} icon={Save} className="w-full py-4 rounded-2xl text-sm font-bold bg-gradient-to-r from-teal-500 to-emerald-500">
              {editingWallet ? 'Save Configuration' : 'Initialize Vault'}
            </Button>
          </form>
        </Modal>

        <ConfirmDialog
            isOpen={confirmDialog.open}
            onClose={() => setConfirmDialog({ open: false, id: null })}
            onConfirm={handleDelete}
            title="Decommission Wallet"
            message="Are you sure you want to remove this wallet? Any funds must be manually swept. In-use wallets cannot be deleted."
            confirmText="Confirm Purge"
            variant="danger"
        />
      </div>
  );
};

export default WalletPools;