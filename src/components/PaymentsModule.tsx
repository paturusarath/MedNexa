import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CreditCard,
  Printer,
  CheckCircle2,
  Calendar,
  FileText,
  Search,
  Filter,
  ShieldCheck,
  QrCode,
  Plus,
  X,
  Stethoscope,
  Sparkles,
  Receipt,
  Wallet,
  RefreshCw,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Zap,
  AlertCircle,
  Bell,
  Trash2,
  Smartphone,
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { Transaction } from '../types';
import { UnifiedPaymentSelector, PaymentMethodType } from './common/UnifiedPaymentSelector';

export const PaymentsModule: React.FC = () => {
  const { transactions, processDirectPayment } = useHealth();
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null);
  const [activePaymentTab, setActivePaymentTab] = useState<'bills' | 'saved_methods' | 'refunds' | 'wallet' | 'autopay'>('bills');
  const [showGstModal, setShowGstModal] = useState(false);
  const [gstInvoiceItem, setGstInvoiceItem] = useState<Transaction | null>(null);

  // Health Cash Wallet State
  const [walletBalance, setWalletBalance] = useState(450);
  const [walletTopupAmount, setWalletTopupAmount] = useState(500);
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [walletTransactions, setWalletTransactions] = useState([
    { id: 'WTX-901', date: '2026-09-28', title: '5% Cashback on Medicine Refill', amount: 62, type: 'credit' },
    { id: 'WTX-900', date: '2026-09-24', title: 'Paid Consultation with Dr. V. Mohan', amount: -200, type: 'debit' },
    { id: 'WTX-899', date: '2026-09-20', title: 'UPI Top-Up via PhonePe', amount: 500, type: 'credit' },
    { id: 'WTX-898', date: '2026-09-15', title: 'Health Challenge Streak Bonus', amount: 88, type: 'credit' },
  ]);

  // Chronic Care Auto-Pay Subscriptions
  const [autoPaySubscriptions, setAutoPaySubscriptions] = useState([
    {
      id: 'AP-1',
      title: 'Monthly Hypertension & Statin Refill',
      items: 'Telmisartan 40mg + Atorvastatin 20mg (30 tabs pack)',
      amount: 420,
      nextBillingDate: '2026-10-05',
      paymentSource: 'HDFC Regalia Card (•••• 8912)',
      active: true,
      category: 'Chronic Medicine',
    },
    {
      id: 'AP-2',
      title: 'Quarterly HbA1c & Lipid Profile Lab Test',
      items: 'Home Phlebotomy Sample Collection by NABL Accredited Lab',
      amount: 850,
      nextBillingDate: '2026-11-12',
      paymentSource: 'UPI Autopay (sarath.paturu@okaxis)',
      active: true,
      category: 'Preventive Diagnostics',
    },
    {
      id: 'AP-3',
      title: 'Monthly Telehealth Review Consultation',
      items: 'Dr. V. Mohan (Cardiology Check-in)',
      amount: 650,
      nextBillingDate: '2026-10-18',
      paymentSource: 'HDFC Regalia Card (•••• 8912)',
      active: false,
      category: 'Doctor Teleconsult',
    },
  ]);

  // Saved Methods state
  const [savedCards, setSavedCards] = useState([
    {
      id: 'sc-1',
      bank: 'HDFC Bank Regalia',
      type: 'Visa Credit',
      last4: '8912',
      expiry: '08/29',
      holder: 'Sarath Paturu',
      isDefault: true,
    },
    {
      id: 'sc-2',
      bank: 'ICICI Bank Coral',
      type: 'Mastercard Debit',
      last4: '3041',
      expiry: '11/28',
      holder: 'Sarath Paturu',
      isDefault: false,
    },
  ]);
  const [savedUpis, setSavedUpis] = useState([
    { id: 'su-1', vpa: 'sarath.paturu@okaxis', app: 'Google Pay', isDefault: true },
    { id: 'su-2', vpa: 'paturusarath@paytm', app: 'Paytm UPI', isDefault: false },
  ]);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [newCardBank, setNewCardBank] = useState('Axis Bank');
  const [newCardLast4, setNewCardLast4] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('12/28');
  const [showAddUpiModal, setShowAddUpiModal] = useState(false);
  const [newUpiId, setNewUpiId] = useState('');

  // Recent Settled Refunds
  const recentRefunds = [
    {
      id: 'REF-8801',
      date: '2026-09-29',
      claimRef: '#RET-9104',
      originalOrder: 'Order #ORD-8801',
      medicine: 'Augmentin 625 Duo (Damaged Seal)',
      amount: 178,
      destination: 'HDFC Bank A/c ending in •••• 4091',
      utr: 'UTR20260929904128',
      status: 'Settled to Bank',
    },
    {
      id: 'REF-8794',
      date: '2026-09-25',
      claimRef: '#APT-CAN-902',
      originalOrder: 'Appointment #apt-902',
      medicine: 'Cardiology Teleconsultation Slot Cancellation',
      amount: 1200,
      destination: 'Axis UPI (sarath.paturu@okaxis)',
      utr: 'UTR20260925712048',
      status: 'Settled to Bank',
    },
  ];

  // New Payment / Doctor Fee Modal State
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedDoctorKey, setSelectedDoctorKey] = useState('doc-1');
  const [customAmount, setCustomAmount] = useState<number>(800);
  const [serviceDescription, setServiceDescription] = useState('OPD Clinical Consultation');
  const [paymentMethodType, setPaymentMethodType] = useState<PaymentMethodType>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentToast, setPaymentToast] = useState<string | null>(null);

  const DOCTOR_PRESETS = [
    {
      id: 'doc-1',
      name: 'Dr. V. Mohan, MD',
      specialty: 'Cardiologist & Electrophysiology',
      fee: 800,
    },
    {
      id: 'doc-2',
      name: 'Dr. Priya Sharma, MBBS, MD',
      specialty: 'Internal Medicine & Diabetologist',
      fee: 650,
    },
    {
      id: 'doc-3',
      name: 'Dr. Rajesh Iyer, MS, MCh',
      specialty: 'Orthopedic & Joint Surgeon',
      fee: 900,
    },
    {
      id: 'custom',
      name: 'Custom Hospital / Lab / Diagnostic Bill',
      specialty: 'MedNexa Clinical Diagnostics',
      fee: customAmount || 500,
    },
  ];

  const currentDoctor =
    DOCTOR_PRESETS.find((d) => d.id === selectedDoctorKey) || DOCTOR_PRESETS[0];
  const payableAmount =
    selectedDoctorKey === 'custom' ? customAmount : currentDoctor.fee;

  const handleExecutePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      let mappedMethod: Transaction['paymentMethod'] = 'Instant UPI / Pay';
      if (paymentMethodType === 'cod') mappedMethod = 'Cash at Clinic / Doorstep';
      else if (paymentMethodType === 'card') mappedMethod = 'Credit/Debit Card';
      else if (paymentMethodType === 'netbanking') mappedMethod = 'Digital Wallet';

      const refId = `DOC-PAY-${Date.now().toString().slice(-6)}`;
      const title =
        selectedDoctorKey === 'custom'
          ? `Clinical Bill: ${serviceDescription}`
          : `Consultation Fee: ${currentDoctor.name}`;

      const newTx = processDirectPayment(
        'Consultation Fee',
        title,
        payableAmount,
        mappedMethod,
        refId
      );

      setIsProcessing(false);
      setShowPayModal(false);
      setPaymentToast(`Payment of ₹${payableAmount} completed successfully!`);
      setSelectedReceipt(newTx);
      setTimeout(() => setPaymentToast(null), 4000);
    }, 700);
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.referenceId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || tx.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalSpent = transactions
    .filter((tx) => tx.status === 'Completed')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-teal-600" />
            My Bills &amp; Payment Receipts
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            View consultation invoices, pharmacy medicine bills, and download receipts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowPayModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <QrCode className="w-4 h-4" />
            <span>Pay Doctor / Service (Generate QR)</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Secure Verified</span>
          </div>
        </div>
      </div>

      {paymentToast && (
        <div className="p-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold flex items-center justify-between shadow-md animate-in fade-in duration-200">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {paymentToast}
          </span>
          <span className="text-[11px] bg-emerald-700 px-2 py-0.5 rounded">Settled</span>
        </div>
      )}

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Health Spend
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            ₹{totalSpent.toFixed(2)}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">All settled transactions</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Consultations Paid
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {transactions.filter((p) => p.type === 'Consultation Fee').length}
          </div>
          <span className="text-[11px] text-teal-600 font-medium">Telemedicine services</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Pharmacy Dispensations
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {transactions.filter((p) => p.type === 'Pharmacy Order').length}
          </div>
          <span className="text-[11px] text-blue-600 font-medium">Home delivery orders</span>
        </div>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActivePaymentTab('bills')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
            activePaymentTab === 'bills'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Bills &amp; Invoices ({transactions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePaymentTab('wallet')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
            activePaymentTab === 'wallet'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Wallet className="w-3.5 h-3.5 text-emerald-400" />
          <span>Health Cash Wallet (₹{walletBalance})</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePaymentTab('autopay')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
            activePaymentTab === 'autopay'
              ? 'bg-indigo-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-300" />
          <span>Auto-Pay Care Subscriptions ({autoPaySubscriptions.filter((s) => s.active).length} Active)</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePaymentTab('saved_methods')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
            activePaymentTab === 'saved_methods'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5 text-teal-600" />
          <span>Saved Cards &amp; UPI</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePaymentTab('refunds')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
            activePaymentTab === 'refunds'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Refunds &amp; Settlements ({recentRefunds.length})</span>
        </button>
      </div>

      {/* VIEW 1: BILLS & INVOICES */}
      {activePaymentTab === 'bills' && (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by transaction ID or invoice description..."
                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-teal-500"
              >
                <option value="all">All Transactions</option>
                <option value="Consultation Fee">Telemedicine Consultations</option>
                <option value="Pharmacy Order">Pharmacy Dispensations</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Date &amp; Time</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Invoices</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{tx.id}</td>
                    <td className="py-3 px-4 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {tx.date}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">{tx.title}</td>
                    <td className="py-3 px-4 text-slate-600">{tx.paymentMethod}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">₹{tx.amount.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedReceipt(tx)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setGstInvoiceItem(tx);
                            setShowGstModal(true);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg text-xs font-semibold transition cursor-pointer"
                          title="Official GST Tax & Section 80D Exemption Invoice"
                        >
                          <Receipt className="w-3.5 h-3.5 text-teal-600" />
                          <span>GST 80D</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: SAVED PAYMENT METHODS */}
      {activePaymentTab === 'saved_methods' && (
        <div className="space-y-5">
          {/* Saved Cards */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-teal-600" />
                  Saved Credit &amp; Debit Cards
                </h3>
                <p className="text-xs text-slate-500">
                  Encrypted under RBI Tokenization guidelines &bull; Zero CVV stored
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCardModal(!showAddCardModal)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddCardModal ? 'Close' : 'Add Card'}</span>
              </button>
            </div>

            {showAddCardModal && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newCardLast4 || newCardLast4.length !== 4) return;
                  setSavedCards((prev) => [
                    ...prev,
                    {
                      id: `sc-${Date.now()}`,
                      bank: newCardBank,
                      type: 'RuPay / Visa',
                      last4: newCardLast4,
                      expiry: newCardExpiry,
                      holder: 'Sarath Paturu',
                      isDefault: false,
                    },
                  ]);
                  setNewCardLast4('');
                  setShowAddCardModal(false);
                }}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 animate-in fade-in duration-150"
              >
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Bank Name</label>
                  <select
                    value={newCardBank}
                    onChange={(e) => setNewCardBank(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="State Bank of India">State Bank of India</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Bank">Kotak Bank</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Last 4 Digits</label>
                  <input
                    type="text"
                    maxLength={4}
                    required
                    placeholder="e.g. 5521"
                    value={newCardLast4}
                    onChange={(e) => setNewCardLast4(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={newCardExpiry}
                    onChange={(e) => setNewCardExpiry(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    Save Encrypted Card
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {savedCards.map((card) => (
                <div
                  key={card.id}
                  className={`p-4 rounded-2xl border transition flex flex-col justify-between gap-3 ${
                    card.isDefault
                      ? 'bg-teal-50/60 border-teal-300 ring-2 ring-teal-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{card.bank}</h4>
                        <span className="text-[10px] text-slate-500">{card.type}</span>
                      </div>
                    </div>
                    {card.isDefault && (
                      <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                        Default Card
                      </span>
                    )}
                  </div>

                  <div className="font-mono text-sm tracking-wider font-bold text-slate-800">
                    •••• •••• •••• {card.last4}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span>{card.holder}</span>
                    <span>Expires: {card.expiry}</span>
                    <button
                      type="button"
                      onClick={() => setSavedCards((prev) => prev.filter((c) => c.id !== card.id))}
                      className="text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Saved UPI VPAs */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-teal-600" />
                  Saved UPI IDs (VPAs)
                </h3>
                <p className="text-xs text-slate-500">
                  Instant NPCI 1-click authorization for teleconsultations and medicine delivery
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddUpiModal(!showAddUpiModal)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddUpiModal ? 'Close' : 'Add UPI'}</span>
              </button>
            </div>

            {showAddUpiModal && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newUpiId.includes('@')) return;
                  setSavedUpis((prev) => [
                    ...prev,
                    {
                      id: `su-${Date.now()}`,
                      vpa: newUpiId.trim(),
                      app: 'Other UPI',
                      isDefault: false,
                    },
                  ]);
                  setNewUpiId('');
                  setShowAddUpiModal(false);
                }}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3 animate-in fade-in duration-150"
              >
                <input
                  type="text"
                  required
                  placeholder="e.g. name@okaxis or mobile@upi"
                  value={newUpiId}
                  onChange={(e) => setNewUpiId(e.target.value)}
                  className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold"
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  Verify &amp; Save UPI
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {savedUpis.map((u) => (
                <div
                  key={u.id}
                  className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-mono font-bold text-xs text-slate-900 block">{u.vpa}</span>
                      <span className="text-[10px] text-slate-500">{u.app}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {u.isDefault && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Primary
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setSavedUpis((prev) => prev.filter((item) => item.id !== u.id))}
                      className="text-xs text-rose-500 hover:text-rose-700 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: REFUNDS & SETTLEMENTS TRACKER */}
      {activePaymentTab === 'refunds' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Total Settled Refunds</span>
              <div className="text-xl font-black text-emerald-700 mt-1">₹1,378.00 INR</div>
              <span className="text-[10px] text-slate-400">100% credited to source accounts</span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Average Refund TAT</span>
              <div className="text-xl font-black text-slate-900 mt-1">&lt; 2 Hours</div>
              <span className="text-[10px] text-teal-600 font-semibold">Instant IMPS/UPI Reversal</span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Grievance Redressal</span>
              <div className="text-xl font-black text-indigo-700 mt-1">Zero Pending</div>
              <span className="text-[10px] text-slate-400">RBI Ombudsman Compliant</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-bold text-xs text-slate-900 flex items-center justify-between">
              <span>Settled Pharmacy Claims &amp; Cancelled Appointment Refunds</span>
              <span className="text-[11px] text-emerald-700 font-bold">2 Records</span>
            </div>
            <div className="divide-y divide-slate-100">
              {recentRefunds.map((ref) => (
                <div key={ref.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{ref.id}</span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {ref.status}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">Ref: {ref.claimRef}</span>
                    </div>
                    <p className="font-semibold text-slate-800">{ref.medicine}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span>Credited to: <strong>{ref.destination}</strong></span>
                      <span>&bull;</span>
                      <span className="font-mono">UTR: {ref.utr}</span>
                      <span>&bull;</span>
                      <span>{ref.date}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-base font-black text-emerald-700">+₹{ref.amount.toFixed(2)}</div>
                    <span className="text-[10px] text-slate-400">Direct Account Credit</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: HEALTH CASH & REWARDS WALLET */}
      {activePaymentTab === 'wallet' && (
        <div className="space-y-6">
          {/* Wallet Hero Banner */}
          <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 relative z-10 max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>MedNexa Health Cash &amp; Cashback Wallet</span>
              </div>
              <p className="text-xs text-slate-300">Available Balance (1 Coin = ₹1 INR &bull; Zero Expiry)</p>
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight flex items-baseline gap-2">
                <span>₹{walletBalance.toFixed(2)}</span>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Health Cash</span>
              </div>
              <p className="text-xs text-slate-300 pt-1">
                Auto-applies at checkout to save up to 15% on prescription medicines, diagnostic lab tests, and doctor video consults.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 relative z-10 shrink-0">
              <button
                type="button"
                onClick={() => setShowTopupModal(true)}
                className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Top-Up Wallet</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setWalletBalance((prev) => prev + 50);
                  setWalletTransactions((prev) => [
                    {
                      id: `WTX-${Date.now().toString().slice(-4)}`,
                      date: new Date().toISOString().split('T')[0],
                      title: 'Daily Wellness Check-in Reward',
                      amount: 50,
                      type: 'credit',
                    },
                    ...prev,
                  ]);
                }}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-2xl border border-white/20 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Claim +₹50 Reward</span>
              </button>
            </div>

            <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Perks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-1">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>5% Guaranteed Cashback</span>
              </div>
              <p className="text-[11px] text-emerald-950 leading-relaxed">
                Earn 5% instant health cash every time you reorder chronic care medication or book health checkups.
              </p>
            </div>

            <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-1">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-xs">
                <Zap className="w-4 h-4 text-teal-600" />
                <span>1-Tap Instant Checkout</span>
              </div>
              <p className="text-[11px] text-teal-950 leading-relaxed">
                Zero OTP or bank gateway wait times for urgent teleconsultations and emergency pharmacy delivery.
              </p>
            </div>

            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-1">
              <div className="flex items-center gap-2 text-indigo-800 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>100% Refund Guarantee</span>
              </div>
              <p className="text-[11px] text-indigo-950 leading-relaxed">
                Cancelled consultations or damaged medicine returns are credited back into your wallet in &lt; 60 seconds.
              </p>
            </div>
          </div>

          {/* Wallet Transaction Ledger */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900 text-sm">Wallet Activity &amp; Cashback History</h3>
                <p className="text-xs text-slate-500">Live ledger of health credits and redemptions</p>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {walletTransactions.length} Activities
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {walletTransactions.map((tx) => (
                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                        tx.type === 'credit'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {tx.type === 'credit' ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{tx.title}</h4>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="font-mono">{tx.id}</span>
                        <span>&bull;</span>
                        <span>{tx.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-sm font-black font-mono ${
                        tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {tx.type === 'credit' ? `+₹${tx.amount}` : `-₹${Math.abs(tx.amount)}`}
                    </div>
                    <span className="text-[10px] text-slate-400 capitalize font-medium">{tx.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: AUTO-PAY CARE SUBSCRIPTIONS */}
      {activePaymentTab === 'autopay' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Automated Prescription Refills &amp; Chronic Care</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                Never Miss a Chronic Medication Dose
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Automated monthly doorstep delivery for maintenance medications, scheduled lab monitoring, and follow-up teleconsultations. Pause or cancel anytime in 1-click.
              </p>
            </div>

            <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-xs text-slate-200 space-y-1 shrink-0">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Bell className="w-3.5 h-3.5" />
                <span>24-Hour Advance Alert</span>
              </div>
              <p className="text-[11px] text-slate-300">
                You receive an SMS &amp; notification 24 hours prior to every automated debit.
              </p>
            </div>
          </div>

          {/* Subscriptions Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {autoPaySubscriptions.map((sub) => (
              <div
                key={sub.id}
                className={`p-5 rounded-3xl border transition flex flex-col justify-between space-y-4 shadow-xs ${
                  sub.active
                    ? 'bg-white border-slate-200'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                      {sub.category}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setAutoPaySubscriptions((prev) =>
                          prev.map((s) => (s.id === sub.id ? { ...s, active: !s.active } : s))
                        )
                      }
                      className={`text-xs font-bold px-2.5 py-1 rounded-xl transition cursor-pointer ${
                        sub.active
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {sub.active ? '● Active' : '○ Paused'}
                    </button>
                  </div>

                  <h4 className="font-black text-slate-900 text-sm leading-snug">{sub.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 font-medium">{sub.items}</p>

                  <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Monthly Cost:</span>
                      <strong className="text-slate-900">₹{sub.amount}/cycle</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Next Auto-Debit:</span>
                      <strong className="text-indigo-700">{sub.nextBillingDate}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Payment Via:</span>
                      <span className="font-medium text-slate-800 truncate max-w-[150px]">{sub.paymentSource}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setAutoPaySubscriptions((prev) =>
                        prev.map((s) => (s.id === sub.id ? { ...s, active: !s.active } : s))
                      );
                    }}
                    className="flex-1 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                  >
                    {sub.active ? 'Pause Schedule' : 'Resume Auto-Pay'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAutoPaySubscriptions((prev) => prev.filter((s) => s.id !== sub.id));
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Cancel subscription"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOP-UP HEALTH CASH WALLET MODAL */}
      {showTopupModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">Top-Up Health Cash Wallet</h3>
                  <span className="text-[11px] text-slate-500">Instant credit via UPI, Cards, or NetBanking</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTopupModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">Select Amount to Add (₹)</label>
              <div className="grid grid-cols-3 gap-2">
                {[500, 1000, 2000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setWalletTopupAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-black border transition cursor-pointer ${
                      walletTopupAmount === amt
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>

              <input
                type="number"
                value={walletTopupAmount}
                onChange={(e) => setWalletTopupAmount(Number(e.target.value))}
                min="100"
                max="50000"
                placeholder="Or enter custom amount..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Bonus Cashback Active:
                </span>
                <p className="text-[11px] text-emerald-800">
                  Adding ₹{walletTopupAmount} qualifies for an extra 5% instant bonus (+₹{(walletTopupAmount * 0.05).toFixed(0)}).
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowTopupModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const added = walletTopupAmount + walletTopupAmount * 0.05;
                  setWalletBalance((prev) => prev + added);
                  setWalletTransactions((prev) => [
                    {
                      id: `WTX-${Date.now().toString().slice(-4)}`,
                      date: new Date().toISOString().split('T')[0],
                      title: `UPI Wallet Top-Up (+5% bonus)`,
                      amount: added,
                      type: 'credit',
                    },
                    ...prev,
                  ]);
                  setShowTopupModal(false);
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Pay ₹{walletTopupAmount} &amp; Load</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice / Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8"
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-200 print:hidden">
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                Official Clinical Payment Voucher
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                  title="Print Invoice"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="text-slate-400 hover:text-slate-700 text-sm font-semibold"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Receipt Body */}
            <div className="space-y-4 text-xs text-slate-800">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-base text-slate-900">MedNexa Inc.</h3>
                  <p className="text-slate-500 text-[11px]">HIPAA Certified Healthcare Billing</p>
                  <p className="text-slate-500 text-[11px]">EIN: 94-8291041-A</p>
                </div>
                <div className="text-right font-mono">
                  <p className="font-bold text-slate-900">Receipt #{selectedReceipt.receiptNumber}</p>
                  <p className="text-slate-500 text-[11px]">{selectedReceipt.date}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Service Category:</span>
                  <span className="font-bold capitalize">{selectedReceipt.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Reference Token:</span>
                  <span className="font-mono">{selectedReceipt.referenceId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Instrument:</span>
                  <span>{selectedReceipt.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient:</span>
                  <span className="font-semibold">{selectedReceipt.patientName}</span>
                </div>
              </div>

              <div className="border-t border-b border-slate-200 py-3 space-y-2">
                <div className="flex justify-between font-bold">
                  <span>Description</span>
                  <span>Amount</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{selectedReceipt.title}</span>
                  <span>₹{selectedReceipt.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Applied Sales Tax &amp; Clinical Regulatory Fee (0.0% exempt)</span>
                  <span>₹0.00</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-sm text-slate-900 pt-1">
                <span>Total Amount Paid</span>
                <span className="text-teal-700">₹{selectedReceipt.amount.toFixed(2)} INR</span>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl text-center text-[11px] text-emerald-800 font-medium">
                Payment verified &amp; settled via encrypted tokenization.
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 print:hidden">
                <button
                  type="button"
                  onClick={() => {
                    setGstInvoiceItem(selectedReceipt);
                    setShowGstModal(true);
                  }}
                  className="w-full py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5 text-teal-600" />
                  <span>View Official GST &amp; Section 80D Tax Invoice</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* OFFICIAL GST & SECTION 80D TAX INVOICE MODAL */}
      {showGstModal && gstInvoiceItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 my-8"
          >
            {/* Modal Header Actions */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 print:hidden">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Statutory GST Medical Invoice &bull; Sec 80D IT Act Certified
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowGstModal(false)}
                  className="text-slate-400 hover:text-slate-700 text-sm font-semibold p-1"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Printable Tax Invoice Content */}
            <div className="space-y-4 text-xs font-sans text-slate-800">
              <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-300 pb-4 gap-2">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">MedNexa Healthcare Pvt. Ltd.</h2>
                  <p className="text-slate-500 text-xs">Clinical Telemedicine &amp; Pharmacy Dispensation Wing</p>
                  <p className="text-slate-600 font-mono text-[11px] mt-0.5">GSTIN: 29AABCH9912E1ZQ &bull; CIN: U85110KA2024PTC189240</p>
                  <p className="text-slate-500 text-[11px]">Indiranagar Medical Hub, Bengaluru, Karnataka 560038</p>
                </div>
                <div className="text-left sm:text-right font-mono">
                  <span className="text-xs font-black text-slate-900 block">TAX INVOICE #{gstInvoiceItem.receiptNumber}</span>
                  <span className="text-[11px] text-slate-500 block">Date of Issue: {gstInvoiceItem.date}</span>
                  <span className="text-[11px] text-teal-700 font-bold block">Status: Completed &amp; Tax-Filed</span>
                </div>
              </div>

              {/* Billed To */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-[11px]">
                <div>
                  <span className="text-slate-400 font-bold uppercase block text-[10px]">Patient Details (Billed To)</span>
                  <strong className="text-slate-900 text-xs">{gstInvoiceItem.patientName}</strong>
                  <p className="text-slate-600">Patient ID: #PAT-101 &bull; Phone: +91 98765 43210</p>
                  <p className="text-slate-600">PAN: ABCDE1234F (Verified for 80D Exemption)</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase block text-[10px]">Clinical Service / Vendor</span>
                  <strong className="text-slate-900 text-xs">{gstInvoiceItem.title}</strong>
                  <p className="text-slate-600">Service Category: {gstInvoiceItem.type}</p>
                  <p className="text-slate-600 font-mono">Ref ID: {gstInvoiceItem.referenceId}</p>
                </div>
              </div>

              {/* Line Items Table */}
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="p-2.5">HSN/SAC</th>
                    <th className="p-2.5">Item &amp; Clinical Description</th>
                    <th className="p-2.5 text-right">Taxable Amt</th>
                    <th className="p-2.5 text-right">CGST</th>
                    <th className="p-2.5 text-right">SGST</th>
                    <th className="p-2.5 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  <tr>
                    <td className="p-2.5 text-teal-800 font-bold">999312</td>
                    <td className="p-2.5 font-sans font-medium text-slate-900">{gstInvoiceItem.title}</td>
                    <td className="p-2.5 text-right">₹{gstInvoiceItem.amount.toFixed(2)}</td>
                    <td className="p-2.5 text-right text-slate-500">0.00 (Exempt)</td>
                    <td className="p-2.5 text-right text-slate-500">0.00 (Exempt)</td>
                    <td className="p-2.5 text-right font-bold text-slate-900">₹{gstInvoiceItem.amount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              {/* Total & Section 80D Declaration */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 p-4 bg-teal-50/70 rounded-2xl border border-teal-200">
                <div className="space-y-1 text-[11px] text-teal-950">
                  <span className="font-black flex items-center gap-1.5 text-teal-900">
                    <ShieldCheck className="w-4 h-4 text-teal-700" />
                    Section 80D Income Tax Act Certification
                  </span>
                  <p className="leading-relaxed text-slate-600">
                    Certified that the amount of <strong>₹{gstInvoiceItem.amount.toFixed(2)} INR</strong> was incurred for medical consultation / essential drugs by the patient, eligible for income tax deduction under Section 80D (health checkup &amp; medical treatment).
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-500 uppercase block font-bold">Total Net Paid</span>
                  <span className="text-xl font-black text-teal-800">₹{gstInvoiceItem.amount.toFixed(2)} INR</span>
                  <span className="text-[10px] text-emerald-700 block font-semibold">Payment Instrument: {gstInvoiceItem.paymentMethod}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Pay Doctor / Settle Clinical Bill Modal with 4 Payment Options & Dynamic QR */}
      <AnimatePresence>
        {showPayModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8 max-h-[92vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      Pay Doctor / Settle Bill
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Dynamic UPI QR Code, Card, NetBanking or Clinic Cash
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Service / Doctor Selector */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                    <span>Select Specialist Doctor or Clinical Service</span>
                  </label>
                  <select
                    value={selectedDoctorKey}
                    onChange={(e) => setSelectedDoctorKey(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    {DOCTOR_PRESETS.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} - {doc.specialty} (₹{doc.fee})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedDoctorKey === 'custom' && (
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Service Description
                      </label>
                      <input
                        type="text"
                        value={serviceDescription}
                        onChange={(e) => setServiceDescription(e.target.value)}
                        placeholder="e.g. Blood Panel, X-Ray"
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Amount (₹ INR)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                      />
                    </div>
                  </div>
                )}

                {/* 4 Payment Options with Real-Time QR Generation */}
                <div className="pt-2">
                  <UnifiedPaymentSelector
                    amount={payableAmount}
                    title={
                      selectedDoctorKey === 'custom'
                        ? serviceDescription
                        : `OPD Fee - ${currentDoctor.name}`
                    }
                    recipient={
                      selectedDoctorKey === 'custom'
                        ? 'MedNexa Clinical Diagnostics'
                        : `${currentDoctor.name} (${currentDoctor.specialty})`
                    }
                    selectedMethod={paymentMethodType}
                    onMethodChange={(m) => setPaymentMethodType(m)}
                    type="doctor"
                    referenceId={`DOC-${Date.now().toString().slice(-4)}`}
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPayModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleExecutePayment}
                    disabled={isProcessing || payableAmount <= 0}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-60"
                  >
                    {isProcessing ? (
                      <span>Verifying Payment...</span>
                    ) : paymentMethodType === 'cod' ? (
                      <span>Confirm (Pay ₹{payableAmount} at Clinic)</span>
                    ) : (
                      <span>Authorize &amp; Pay ₹{payableAmount}</span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
