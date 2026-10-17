import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  Banknote,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Lock,
  ArrowRight,
  Tag,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { QRCodeDisplay } from './QRCodeDisplay';

export type PaymentMethodType = 'cod' | 'upi' | 'card' | 'netbanking';

interface UnifiedPaymentSelectorProps {
  amount: number;
  title: string;
  recipient: string;
  selectedMethod: PaymentMethodType;
  onMethodChange: (method: PaymentMethodType) => void;
  onConfirmPayment?: () => void;
  isProcessing?: boolean;
  type?: 'doctor' | 'pharmacy' | 'bill';
  referenceId?: string;
}

export const UnifiedPaymentSelector: React.FC<UnifiedPaymentSelectorProps> = ({
  amount,
  title,
  recipient,
  selectedMethod,
  onMethodChange,
  onConfirmPayment,
  isProcessing = false,
  type = 'pharmacy',
  referenceId = `TXN-${Date.now().toString().slice(-6)}`,
}) => {
  // UPI State
  const upiId = 'mednexa.pulse@okicici';
  const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    'MedNexa Healthcare'
  )}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(
    `${title} - Ref:${referenceId}`
  )}`;

  const [upiSubMode, setUpiSubMode] = useState<'apps' | 'id' | 'qr'>('apps');
  const [selectedUpiApp, setSelectedUpiApp] = useState('Google Pay');
  const [customUpiId, setCustomUpiId] = useState('');
  const [isUpiVerified, setIsUpiVerified] = useState(false);

  // Card form state
  const [selectedCardId, setSelectedCardId] = useState<string>('card-1');
  const [isAddingNewCard, setIsAddingNewCard] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('Sarath Paturu');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [savedCardCvv, setSavedCardCvv] = useState('');

  // Net banking state
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Simple Coupon / Gift Voucher (Amazon / Flipkart style)
  const [showPromoBox, setShowPromoBox] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoFeedback, setPromoFeedback] = useState<string | null>(null);

  const handleApplyPromo = () => {
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'MEDNEXA10' || clean === 'HEALARA10' || clean === 'FLIP10' || clean === 'SAVE10') {
      const disc = Math.round(amount * 0.1);
      setDiscountAmount(disc);
      setPromoFeedback(`Coupon applied! Flat 10% (₹${disc}) discount applied.`);
    } else if (clean === 'PULSE50' || clean === 'FIRST50') {
      const disc = Math.min(50, Math.round(amount * 0.5));
      setDiscountAmount(disc);
      setPromoFeedback(`Coupon applied! Flat ₹${disc} discount applied.`);
    } else if (clean) {
      setPromoFeedback('Invalid code. Try "MEDNEXA10" or "PULSE50".');
    }
  };

  const finalPayable = Math.max(0, amount - discountAmount);

  const savedCards = [
    {
      id: 'card-1',
      bank: 'HDFC Bank Regalia',
      number: '•••• •••• •••• 8912',
      type: 'Visa Credit',
      holder: 'Sarath Paturu',
      expiry: '08/29',
    },
    {
      id: 'card-2',
      bank: 'ICICI Bank Coral',
      number: '•••• •••• •••• 3041',
      type: 'Mastercard Debit',
      holder: 'Sarath Paturu',
      expiry: '11/28',
    },
  ];

  const popularBanks = [
    { name: 'HDFC Bank', code: 'HDFC' },
    { name: 'State Bank of India', code: 'SBI' },
    { name: 'ICICI Bank', code: 'ICICI' },
    { name: 'Axis Bank', code: 'AXIS' },
    { name: 'Kotak Mahindra Bank', code: 'KOTAK' },
    { name: 'Punjab National Bank', code: 'PNB' },
  ];

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-teal-600" />
            <span>Select Payment Method</span>
          </h3>
          <p className="text-[11px] text-slate-500">
            Simple, secure checkout (Amazon &amp; Flipkart standard)
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Payable</span>
          <span className="text-base font-black text-slate-900">
            ₹{finalPayable.toFixed(2)}
          </span>
          {discountAmount > 0 && (
            <span className="text-[10px] text-emerald-600 font-bold block line-through">
              ₹{amount.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Accordion / Radio Option Rows (Flipkart / Amazon Style) */}
      <div className="space-y-3">
        {/* ================= OPTION 1: UPI ================= */}
        <div
          className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
            selectedMethod === 'upi'
              ? 'bg-white border-teal-600 shadow-sm ring-1 ring-teal-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          {/* Radio Row Header */}
          <div
            onClick={() => onMethodChange('upi')}
            className="p-4 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="payment_method_group"
                checked={selectedMethod === 'upi'}
                onChange={() => onMethodChange('upi')}
                className="w-4 h-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    UPI (Google Pay, PhonePe, Paytm, QR)
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Instant &amp; Free
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pay directly from your bank account using any UPI app or dynamic QR
                </p>
              </div>
            </div>

            {/* Quick App Icons Preview */}
            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
              <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-blue-600">
                GPay
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-purple-600">
                PhonePe
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-sky-600">
                Paytm
              </span>
            </div>
          </div>

          {/* Expanded Drawer */}
          {selectedMethod === 'upi' && (
            <div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-slate-50/60 space-y-3">
              {/* Segmented Sub-Mode Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl text-xs font-semibold max-w-sm">
                <button
                  type="button"
                  onClick={() => setUpiSubMode('apps')}
                  className={`flex-1 py-1.5 rounded-lg transition cursor-pointer text-center ${
                    upiSubMode === 'apps' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  UPI Apps
                </button>
                <button
                  type="button"
                  onClick={() => setUpiSubMode('id')}
                  className={`flex-1 py-1.5 rounded-lg transition cursor-pointer text-center ${
                    upiSubMode === 'id' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Enter UPI ID
                </button>
                <button
                  type="button"
                  onClick={() => setUpiSubMode('qr')}
                  className={`flex-1 py-1.5 rounded-lg transition cursor-pointer text-center ${
                    upiSubMode === 'qr' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Scan QR Code
                </button>
              </div>

              {/* Sub-mode 1: Popular UPI Apps */}
              {upiSubMode === 'apps' && (
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-600 block">
                    Select your preferred UPI app for instant payment:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { name: 'Google Pay', color: 'text-blue-600', border: 'hover:border-blue-400' },
                      { name: 'PhonePe', color: 'text-purple-600', border: 'hover:border-purple-400' },
                      { name: 'Paytm UPI', color: 'text-sky-600', border: 'hover:border-sky-400' },
                      { name: 'BHIM UPI', color: 'text-orange-600', border: 'hover:border-orange-400' },
                    ].map((app) => (
                      <button
                        key={app.name}
                        type="button"
                        onClick={() => setSelectedUpiApp(app.name)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                          selectedUpiApp === app.name
                            ? 'bg-white border-teal-600 text-slate-900 shadow-2xs ring-1 ring-teal-500/20'
                            : `bg-white border-slate-200 ${app.border} text-slate-700`
                        }`}
                      >
                        <span className={app.color}>{app.name}</span>
                        {selectedUpiApp === app.name && (
                          <Check className="w-3.5 h-3.5 text-teal-600" />
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                    <Smartphone className="w-3.5 h-3.5 text-teal-600" />
                    <span>A payment authorization prompt will be opened in {selectedUpiApp}.</span>
                  </p>
                </div>
              )}

              {/* Sub-mode 2: Enter UPI ID */}
              {upiSubMode === 'id' && (
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-700 block">
                    Enter your Virtual Payment Address (UPI ID):
                  </label>
                  <div className="flex gap-2 max-w-md">
                    <input
                      type="text"
                      placeholder="e.g. mobileNumber@upi or user@okicici"
                      value={customUpiId}
                      onChange={(e) => {
                        setCustomUpiId(e.target.value);
                        setIsUpiVerified(false);
                      }}
                      className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customUpiId.includes('@')) {
                          setIsUpiVerified(true);
                        }
                      }}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                    >
                      {isUpiVerified ? 'Verified ✓' : 'Verify'}
                    </button>
                  </div>
                  {isUpiVerified && (
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      UPI ID verified! Ready for checkout.
                    </span>
                  )}
                </div>
              )}

              {/* Sub-mode 3: Dynamic QR Code */}
              {upiSubMode === 'qr' && (
                <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-white rounded-2xl border border-slate-200">
                  <QRCodeDisplay
                    value={upiString}
                    size={140}
                    title="Scan & Pay"
                    subtext={`₹${finalPayable.toFixed(2)}`}
                    copyLabel="Copy UPI Link"
                    downloadFileName={`MedNexa_Payment_${referenceId}.png`}
                    showDownloadImage={false}
                  />
                  <div className="text-xs text-slate-600 space-y-1 text-center sm:text-left">
                    <h5 className="font-bold text-slate-900">Scan using any UPI App</h5>
                    <p className="text-[11px] text-slate-500">
                      Open Google Pay, PhonePe, Paytm, or BHIM on your phone and point the camera at this code.
                    </p>
                    <div className="pt-1 text-[11px] text-teal-800 font-mono">
                      Payee: <strong>{upiId}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================= OPTION 2: CREDIT / DEBIT CARD ================= */}
        <div
          className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
            selectedMethod === 'card'
              ? 'bg-white border-teal-600 shadow-sm ring-1 ring-teal-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          {/* Radio Row Header */}
          <div
            onClick={() => onMethodChange('card')}
            className="p-4 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="payment_method_group"
                checked={selectedMethod === 'card'}
                onChange={() => onMethodChange('card')}
                className="w-4 h-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    Credit / Debit / ATM Card
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    Visa, MasterCard, RuPay
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Save card or pay securely with 256-bit bank encryption
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
              <span className="px-2 py-0.5 rounded bg-blue-50 text-[10px] font-black text-blue-700 border border-blue-200">
                Visa
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-50 text-[10px] font-black text-amber-700 border border-amber-200">
                MasterCard
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-[10px] font-black text-emerald-700 border border-emerald-200">
                RuPay
              </span>
            </div>
          </div>

          {/* Expanded Drawer */}
          {selectedMethod === 'card' && (
            <div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-slate-50/60 space-y-3">
              {/* Saved Cards */}
              {!isAddingNewCard && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-600 block">
                    Choose a saved card or enter details:
                  </span>
                  <div className="space-y-2">
                    {savedCards.map((c) => {
                      const isSelected = selectedCardId === c.id;
                      return (
                        <div
                          key={c.id}
                          onClick={() => setSelectedCardId(c.id)}
                          className={`p-3 rounded-xl border text-xs transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                            isSelected
                              ? 'bg-white border-teal-600 ring-1 ring-teal-500/20 shadow-2xs'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="saved_card_select"
                              checked={isSelected}
                              onChange={() => setSelectedCardId(c.id)}
                              className="w-3.5 h-3.5 text-teal-600 cursor-pointer"
                            />
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-2">
                                <span>{c.bank}</span>
                                <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                                  {c.type}
                                </span>
                              </div>
                              <div className="text-slate-500 font-mono text-[11px]">
                                {c.number} &bull; Exp {c.expiry}
                              </div>
                            </div>
                          </div>

                          {/* CVV Input for Selected Card (Flipkart/Amazon style) */}
                          {isSelected && (
                            <div className="flex items-center gap-2 self-start sm:self-auto pl-6 sm:pl-0">
                              <label className="text-[11px] font-semibold text-slate-600">CVV:</label>
                              <input
                                type="password"
                                maxLength={3}
                                placeholder="•••"
                                value={savedCardCvv}
                                onChange={(e) => setSavedCardCvv(e.target.value)}
                                className="w-16 p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-center focus:outline-teal-600"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddingNewCard(true)}
                    className="text-xs font-bold text-teal-700 hover:text-teal-900 cursor-pointer inline-flex items-center gap-1 pt-1"
                  >
                    + Add a new credit or debit card
                  </button>
                </div>
              )}

              {/* Add New Card Form */}
              {isAddingNewCard && (
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Enter Card Information</span>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewCard(false)}
                      className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      Use Saved Cards
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="16-digit card number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono tracking-wider focus:outline-none focus:border-teal-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sarath Paturu"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-teal-600 focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Expiry
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-center font-mono focus:outline-none focus:border-teal-600 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-center font-mono focus:outline-none focus:border-teal-600 focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Card details are tokenized securely with RBI 3D-Secure 2.0 standards.</span>
              </div>
            </div>
          )}
        </div>

        {/* ================= OPTION 3: NET BANKING ================= */}
        <div
          className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
            selectedMethod === 'netbanking'
              ? 'bg-white border-teal-600 shadow-sm ring-1 ring-teal-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          {/* Radio Row Header */}
          <div
            onClick={() => onMethodChange('netbanking')}
            className="p-4 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="payment_method_group"
                checked={selectedMethod === 'netbanking'}
                onChange={() => onMethodChange('netbanking')}
                className="w-4 h-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">Net Banking</span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    50+ Indian Banks
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct authorization via your bank's secure net banking portal
                </p>
              </div>
            </div>

            <Building2 className="w-5 h-5 text-slate-400 hidden sm:block" />
          </div>

          {/* Expanded Drawer */}
          {selectedMethod === 'netbanking' && (
            <div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-slate-50/60 space-y-3">
              <span className="text-[11px] font-bold text-slate-600 block">
                Popular Banks:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {popularBanks.map((b) => (
                  <button
                    key={b.name}
                    type="button"
                    onClick={() => setSelectedBank(b.name)}
                    className={`p-2.5 rounded-xl border text-xs text-left transition flex items-center justify-between cursor-pointer ${
                      selectedBank === b.name
                        ? 'bg-white border-teal-600 font-bold text-teal-900 shadow-2xs ring-1 ring-teal-500/20'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="truncate">{b.name}</span>
                    {selectedBank === b.name && (
                      <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-1">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Or choose from all other Indian Banks:
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="State Bank of India">State Bank of India (SBI)</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  <option value="Bank of Baroda">Bank of Baroda</option>
                  <option value="Canara Bank">Canara Bank</option>
                  <option value="Union Bank of India">Union Bank of India</option>
                  <option value="IndusInd Bank">IndusInd Bank</option>
                  <option value="Federal Bank">Federal Bank</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* ================= OPTION 4: CASH ON DELIVERY ================= */}
        <div
          className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
            selectedMethod === 'cod'
              ? 'bg-white border-teal-600 shadow-sm ring-1 ring-teal-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          {/* Radio Row Header */}
          <div
            onClick={() => onMethodChange('cod')}
            className="p-4 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="payment_method_group"
                checked={selectedMethod === 'cod'}
                onChange={() => onMethodChange('cod')}
                className="w-4 h-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    {type === 'doctor' ? 'Pay at Clinic Counter' : 'Cash on Delivery (COD)'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    Cash / UPI at Doorstep
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {type === 'doctor'
                    ? `Pay ₹${finalPayable.toFixed(2)} in person at ${recipient}'s clinic front-desk`
                    : `Pay ₹${finalPayable.toFixed(2)} via cash or UPI to delivery agent upon receiving your order`}
                </p>
              </div>
            </div>

            <Banknote className="w-5 h-5 text-slate-400 hidden sm:block" />
          </div>

          {/* Expanded Drawer */}
          {selectedMethod === 'cod' && (
            <div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-slate-50/60 space-y-2">
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Zero advance deposit needed.</strong> Pay only after your package is delivered to your hands.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Simple Coupon / Promo Code Accordion (Amazon & Flipkart Standard) */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowPromoBox(!showPromoBox)}
          className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1.5 cursor-pointer"
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Have a Gift Card, Coupon or Health Voucher?</span>
          {showPromoBox ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showPromoBox && (
          <div className="mt-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 animate-in fade-in duration-150">
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter coupon (e.g. MEDNEXA10, PULSE50)"
                className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold uppercase text-slate-900 focus:outline-teal-600"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition text-xs cursor-pointer"
              >
                Apply
              </button>
            </div>
            {promoFeedback && (
              <p
                className={`text-[11px] font-semibold ${
                  discountAmount > 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {promoFeedback}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Security Guarantee Banner */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Safe &amp; Secure Payments &bull; RBI &amp; NPCI Compliant</span>
        </div>

        {onConfirmPayment && (
          <button
            type="button"
            onClick={onConfirmPayment}
            disabled={isProcessing}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-60 active:scale-95"
          >
            <span>
              {isProcessing
                ? 'Processing...'
                : selectedMethod === 'cod'
                ? `Confirm Order (₹${finalPayable.toFixed(2)})`
                : `Pay ₹${finalPayable.toFixed(2)}`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
