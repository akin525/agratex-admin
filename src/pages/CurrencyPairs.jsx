import { useEffect, useState, useCallback, useMemo } from 'react';
import axios from '../services/axios';
import { API_ENDPOINTS } from '../config/api';
import { useToast } from '../components/ui/Toast';
import { DollarSign, Plus, Edit, Trash2, Power, ArrowRight, Save, Activity, Percent, Zap, ArrowDownUp, Search } from 'lucide-react';
import { LoadingSpinner, PageHeader, EmptyState, Modal, FormInput, FormSelect, Button, StatusBadge, SearchInput } from '../components/ui';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const INITIAL_FORM = { from: '', to: '', rate: '', fee: '', fee_type: 'percent', status: 1 };

const CurrencyPairs = () => {
  const toast = useToast();
  const [pairs, setPairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPair, setEditingPair] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPairs = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(API_ENDPOINTS.CURRENCY_PAIRS);
      if (data.success) setPairs(data.data || []);
    } catch (error) {
      toast.error('Sync failed: Could not reach currency service');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchPairs(); }, [fetchPairs]);

  // V3 Feature: Fast client-side filtering
  const filteredPairs = useMemo(() => {
    if (!searchTerm) return pairs;
    const lowerSearch = searchTerm.toLowerCase();
    return pairs.filter(p =>
        p.from.toLowerCase().includes(lowerSearch) ||
        p.to.toLowerCase().includes(lowerSearch)
    );
  }, [pairs, searchTerm]);

  const handleOpenModal = (pair = null) => {
    if (pair) {
      setEditingPair(pair);
      setForm({ ...pair });
    } else {
      setEditingPair(null);
      setForm(INITIAL_FORM);
    }
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // V3 Feature: Swap Base and Target easily
  const handleSwapCurrencies = () => {
    setForm(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from,
      // Optional: Auto-invert the rate if it exists
      rate: prev.rate ? (1 / parseFloat(prev.rate)).toFixed(6) : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const endpoint = editingPair
          ? API_ENDPOINTS.UPDATE_CURRENCY_PAIR(editingPair.id)
          : API_ENDPOINTS.CREATE_CURRENCY_PAIR;

      const method = editingPair ? 'put' : 'post';
      const response = await axios[method](endpoint, form);

      if (response.data.success) {
        toast.success(response.data.message || 'Ledger updated successfully');
        setShowModal(false);
        fetchPairs();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Transaction failed');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (pair) => {
    try {
      setPairs(prev => prev.map(p => p.id === pair.id ? { ...p, status: p.status === 1 ? 0 : 1 } : p));
      const response = await axios.post(API_ENDPOINTS.TOGGLE_CURRENCY_PAIR(pair.id));
      if (!response.data.success) throw new Error();
      toast.success(`${pair.from}/${pair.to} status updated`);
    } catch (error) {
      toast.error('Failed to toggle status');
      fetchPairs();
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(API_ENDPOINTS.DELETE_CURRENCY_PAIR(confirmDialog.id));
      if (response.data.success) {
        toast.success('Liquidity pair liquidated');
        fetchPairs();
      }
    } catch (error) {
      toast.error('Failed to delete currency pair');
    } finally {
      setConfirmDialog({ open: false, id: null });
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><LoadingSpinner text="Analyzing Market Pairs..." /></div>;

  return (
      <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <PageHeader
            icon={Zap}
            title="Exchange Pairs"
            description="Configure automated conversion rates and liquidity fees"
            gradient="from-amber-400 to-orange-600"
        >
          <Button icon={Plus} onClick={() => handleOpenModal()} className="shadow-lg shadow-orange-500/20">
            New Pair
          </Button>
        </PageHeader>

        {/* V3 Feature: Search Bar */}
        {pairs.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search pairs (e.g., BTC, USD)..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-orange-500/50 outline-none transition-all"
                />
              </div>
              <div className="text-xs font-medium text-slate-500">
                Showing <span className="text-white">{filteredPairs.length}</span> active pairs
              </div>
            </div>
        )}

        {filteredPairs.length === 0 ? (
            <EmptyState
                icon={Search}
                title={searchTerm ? "No pairs found" : "No Pairs Active"}
                description={searchTerm ? `No results matching "${searchTerm}"` : "Your exchange is currently empty."}
                action={!searchTerm ? () => handleOpenModal() : () => setSearchTerm('')}
                actionLabel={!searchTerm ? "Add Liquidity Pair" : "Clear Search"}
            />
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPairs.map((pair) => (
                  <div key={pair.id} className="group relative bg-slate-900 border border-white/5 rounded-[2rem] p-1 transition-all hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/10">
                    <div className="bg-slate-800/40 rounded-[1.8rem] p-6">

                      {/* Header */}
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-xs font-black ring-4 ring-slate-900 uppercase">{pair.from.slice(0,2)}</div>
                            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-black ring-4 ring-slate-900 uppercase">{pair.to.slice(0,2)}</div>
                          </div>
                          <div>
                            <h3 className="text-white font-bold leading-none uppercase">{pair.from} <span className="text-slate-500 text-xs mx-1">/</span> {pair.to}</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-widest">Market Pair</p>
                          </div>
                        </div>
                        <StatusBadge status={pair.status} />
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-slate-950/50 p-3 rounded-2xl border border-white/5">
                          <div className="flex items-center gap-1.5 mb-1 opacity-50">
                            <Activity className="w-3 h-3 text-orange-400" />
                            <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-300">Rate</span>
                          </div>
                          <div className="text-lg font-mono font-bold text-white">
                            {parseFloat(pair.rate).toFixed(4)}
                          </div>
                        </div>
                        <div className="bg-slate-950/50 p-3 rounded-2xl border border-white/5">
                          <div className="flex items-center gap-1.5 mb-1 opacity-50">
                            <Percent className="w-3 h-3 text-emerald-400" />
                            <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-300">Fee</span>
                          </div>
                          <div className="text-lg font-mono font-bold text-white">
                            {pair.fee}<span className="text-[10px] ml-0.5 text-slate-500">{pair.fee_type === 'percent' ? '%' : ' FIX'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Dynamic Action Bar */}
                      <div className="flex gap-2">
                        <button
                            onClick={() => toggleStatus(pair)}
                            className={`flex-1 h-11 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                                pair.status === 1
                                    ? 'bg-slate-950 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10'
                                    : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                            }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                          {pair.status === 1 ? 'Disable' : 'Enable'}
                        </button>

                        <button onClick={() => handleOpenModal(pair)} className="w-11 h-11 flex items-center justify-center bg-slate-950 text-slate-400 hover:text-white rounded-2xl transition-colors border border-white/5">
                          <Edit className="w-4 h-4" />
                        </button>

                        <button onClick={() => setConfirmDialog({ open: true, id: pair.id })} className="w-11 h-11 flex items-center justify-center bg-slate-950 text-slate-400 hover:text-rose-500 rounded-2xl transition-colors border border-white/5">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
        )}

        <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={editingPair ? 'Adjust Liquidity' : 'Provision New Pair'}
            icon={Zap}
        >
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* V3 Feature: Form Swap & Layout */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <FormInput label="Base Currency" name="from" value={form.from} onChange={handleInputChange} placeholder="e.g. BTC" className="uppercase" required />
              </div>

              <button
                  type="button"
                  onClick={handleSwapCurrencies}
                  className="mt-6 p-3 bg-slate-800 hover:bg-orange-500 hover:text-white text-slate-400 rounded-xl transition-all border border-white/5"
                  title="Swap Currencies"
              >
                <ArrowDownUp className="w-4 h-4" />
              </button>

              <div className="flex-1">
                <FormInput label="Target Currency" name="to" value={form.to} onChange={handleInputChange} placeholder="e.g. USD" className="uppercase" required />
              </div>
            </div>

            <FormInput label="Conversion Rate" name="rate" type="number" step="any" value={form.rate} onChange={handleInputChange} placeholder="0.0000" required />

            {/* V3 Feature: Live Rate Preview */}
            {form.from && form.to && form.rate && (
                <div className="py-3 px-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-500 uppercase tracking-wide">Live Preview</span>
                  <span className="font-mono text-sm text-emerald-400">
                 1 <span className="font-bold uppercase">{form.from}</span> = {parseFloat(form.rate).toLocaleString()} <span className="font-bold uppercase">{form.to}</span>
               </span>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Fee Value" name="fee" type="number" step="any" value={form.fee} onChange={handleInputChange} placeholder="0" required />
              <FormSelect label="Fee Structure" name="fee_type" value={form.fee_type} onChange={handleInputChange}>
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Fixed Amount</option>
              </FormSelect>
            </div>

            <Button type="submit" loading={saving} icon={Save} className="w-full py-4 rounded-2xl text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-500">
              {editingPair ? 'Save Configuration' : 'Initialize Market Pair'}
            </Button>
          </form>
        </Modal>

        <ConfirmDialog
            isOpen={confirmDialog.open}
            onClose={() => setConfirmDialog({ open: false, id: null })}
            onConfirm={handleDelete}
            title="Liquidate Pair?"
            message="This will remove the currency pair from the active exchange desk. Historical data will remain."
            confirmText="Confirm Deletion"
            variant="danger"
        />
      </div>
  );
};

export default CurrencyPairs;