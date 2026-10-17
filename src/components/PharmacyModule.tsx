import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Pill,
  Search,
  ShoppingCart,
  CheckCircle2,
  Truck,
  Package,
  FileCheck,
  AlertTriangle,
  Plus,
  Minus,
  Trash2,
  Clock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  MapPin,
  Upload,
  Camera,
  Sparkles,
  RotateCcw,
  X,
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { Medicine, PharmacyOrder, MedicineReturnRequest } from '../types';
import { PrescriptionPhotoScanner } from './PrescriptionPhotoScanner';
import { OrderTrackingModal } from './pharmacy/OrderTrackingModal';
import { ReturnMedicineModal } from './pharmacy/ReturnMedicineModal';
import { ProcessReturnModal } from './shopkeeper/ProcessReturnModal';
import { UnifiedPaymentSelector, PaymentMethodType } from './common/UnifiedPaymentSelector';

interface PharmacyModuleProps {
  initialSubTab?: 'catalog' | 'cart' | 'orders' | 'returns';
}

// Formats manufacturing date to ensure date (day), month, and year are clearly displayed
export const formatManufacturingDate = (dateStr?: string, medId?: string): string => {
  if (!dateStr) return '15/09/2024';
  const trimmed = dateStr.trim();
  // If already contains date/day + month + year (e.g., DD/MM/YYYY or DD-MM-YYYY)
  const parts = trimmed.split(/[/.-]/);
  if (parts.length === 3) {
    const p0 = parts[0].padStart(2, '0');
    const p1 = parts[1].padStart(2, '0');
    const p2 = parts[2];
    return `${p0}/${p1}/${p2}`;
  }
  // If only MM/YYYY or MM-YYYY is provided, generate a deterministic day (e.g. 15th)
  if (parts.length === 2) {
    let day = '15';
    if (medId) {
      let hash = 0;
      for (let i = 0; i < medId.length; i++) {
        hash = (hash * 31 + medId.charCodeAt(i)) % 25 + 1;
      }
      day = String(hash).padStart(2, '0');
    }
    const month = parts[0].padStart(2, '0');
    const year = parts[1];
    return `${day}/${month}/${year}`;
  }
  return trimmed;
};

// Formats expiring date to ensure date (day), month, and year are clearly displayed
export const formatExpiryDate = (dateStr?: string, medId?: string): string => {
  if (!dateStr) return '28/08/2027';
  const trimmed = dateStr.trim();
  // If already contains date/day + month + year (e.g., DD/MM/YYYY or DD-MM-YYYY)
  const parts = trimmed.split(/[/.-]/);
  if (parts.length === 3) {
    const p0 = parts[0].padStart(2, '0');
    const p1 = parts[1].padStart(2, '0');
    const p2 = parts[2];
    return `${p0}/${p1}/${p2}`;
  }
  // If only MM/YYYY or MM-YYYY is provided, calculate end of month / deterministic day
  if (parts.length === 2) {
    const monthNum = parseInt(parts[0], 10);
    const yearNum = parseInt(parts[1], 10);
    let day = '28';
    if (!isNaN(monthNum) && !isNaN(yearNum) && monthNum >= 1 && monthNum <= 12) {
      const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
      day = String(daysInMonth).padStart(2, '0');
    }
    const month = parts[0].padStart(2, '0');
    const year = parts[1];
    return `${day}/${month}/${year}`;
  }
  return trimmed;
};

export const PharmacyModule: React.FC<PharmacyModuleProps> = ({ initialSubTab = 'catalog' }) => {
  const {
    medicines,
    cart,
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    cartTotal,
    cartItemCount,
    orders,
    checkoutOrder,
    updateOrderStatus,
    medicineReturns,
    processReturnRequest,
    role,
  } = useHealth();

  const [activeTab, setActiveTab] = useState<'catalog' | 'cart' | 'orders' | 'returns'>(
    initialSubTab || (role === 'shopkeeper' ? 'orders' : 'catalog')
  );

  React.useEffect(() => {
    if (initialSubTab) {
      setActiveTab(initialSubTab);
    }
  }, [initialSubTab]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [requireRxFilter, setRequireRxFilter] = useState<boolean | null>(null);

  // Detail Modal
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [showPhotoScanner, setShowPhotoScanner] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<PharmacyOrder | null>(null);
  const [returnOrder, setReturnOrder] = useState<PharmacyOrder | null>(null);
  const [selectedReturnForProcessing, setSelectedReturnForProcessing] = useState<MedicineReturnRequest | null>(null);
  const [returnStatusFilter, setReturnStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [orderViewFilter, setOrderViewFilter] = useState<'all' | 'active' | 'delivered' | 'returns'>('all');

  // Checkout State
  const [shippingAddress, setShippingAddress] = useState({
    fullName: 'Sarath Paturu',
    street: '42, 12th Main, 4th Cross, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    zip: '560038',
    phone: '+91 98450 12345',
  });
  const [paymentMethod, setPaymentMethod] = useState('UPI / GPay (Instant QR)');
  const [paymentMethodType, setPaymentMethodType] = useState<PaymentMethodType>('upi');
  const [rxFileName, setRxFileName] = useState('Prescription_Sarath_Paturu_rx501.pdf');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const categories = [
    'All',
    'Diabetes Care',
    'Cardiovascular',
    'Thyroid Care',
    'Respiratory',
    'Antibiotics',
    'Pain Relief',
    'Vitamins & Supplements',
  ];

  const filteredMedicines = medicines.filter((med) => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || med.category === selectedCategory;
    const matchesRx =
      requireRxFilter === null ? true : med.requiresPrescription === requireRxFilter;
    return matchesSearch && matchesCategory && matchesRx;
  });

  const cartHasRxItems = cart.some((item) => item.medicine.requiresPrescription);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsCheckingOut(true);
    try {
      await checkoutOrder(shippingAddress, paymentMethod, rxFileName);
      setActiveTab('orders');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Pill className="w-5 h-5 text-teal-600" />
            Medimart &bull; Prescription &amp; Medicine Store
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Search certified therapeutics, attach valid e-Rx certificates, and live track temperature-controlled home delivery.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('catalog');
              setShowPhotoScanner(false);
            }}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'catalog' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Medicine Catalog
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('cart');
              setShowPhotoScanner(false);
            }}
            className={`px-3 py-1.5 rounded-lg transition relative cursor-pointer ${
              activeTab === 'cart' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cart &amp; Checkout
            {cartItemCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 bg-indigo-600 text-white rounded-full text-[10px] font-bold">
                {cartItemCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('orders');
              setShowPhotoScanner(false);
            }}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'orders' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Orders ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('returns');
              setShowPhotoScanner(false);
            }}
            className={`px-3 py-1.5 rounded-lg transition relative cursor-pointer ${
              activeTab === 'returns' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Return Requests
            {medicineReturns.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 bg-amber-600 text-white rounded-full text-[10px] font-bold">
                {medicineReturns.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* VIEW 1: Catalog */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* UPLOAD PHOTO PRESCRIPTION BANNER & SCANNER */}
          <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 shadow-md relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-bold border border-teal-400/30">
                  <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                  <span>AI Prescription Photo Reader &amp; Auto-Order</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  Have a Doctor's Prescription Slip? Upload Photo
                </h3>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  Upload a photo of your doctor's handwritten slip or printed prescription. Our AI / OCR scans and detects prescribed tablets, dosages, and prices in Indian Rupees (₹), and lets you add them directly to your bag with 1 click.
                </p>
              </div>

              <button
                type="button"
                id="shopping-upload-rx-photo-btn"
                onClick={() => setShowPhotoScanner(!showPhotoScanner)}
                className="px-5 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Camera className="w-4 h-4 text-slate-950" />
                <span>{showPhotoScanner ? 'Hide Photo Scanner' : 'Upload Prescription Photo'}</span>
              </button>
            </div>
          </div>

          {/* Expanded Prescription Photo Scanner Component */}
          {showPhotoScanner && (
            <div className="p-1 rounded-3xl border-2 border-teal-500/30 shadow-lg">
              <PrescriptionPhotoScanner
                onProceedToCart={() => {
                  setShowPhotoScanner(false);
                  setActiveTab('cart');
                }}
                onClose={() => setShowPhotoScanner(false)}
              />
            </div>
          )}

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by brand name, generic salt, or therapeutic use..."
                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-teal-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() =>
                  setRequireRxFilter((prev) => (prev === null ? true : prev === true ? false : null))
                }
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition ${
                  requireRxFilter === null
                    ? 'bg-slate-50 border-slate-200 text-slate-600'
                    : requireRxFilter === true
                    ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                }`}
              >
                {requireRxFilter === null
                  ? 'All Prescriptions'
                  : requireRxFilter === true
                  ? 'Rx Required Only'
                  : 'Over-the-Counter (OTC)'}
              </button>
            </div>
          </div>

          {/* Catalog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMedicines.map((med) => (
              <motion.div
                key={med.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.15 }}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3 hover:border-teal-300 transition"
              >
                <div>
                  <div
                    className="relative aspect-16/10 rounded-xl overflow-hidden bg-slate-100 mb-3 cursor-pointer"
                    onClick={() => setSelectedMedicine(med)}
                  >
                    <img
                      src={med.image}
                      alt={med.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 flex gap-1">
                      {med.requiresPrescription ? (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/90 backdrop-blur-xs text-white text-[10px] font-bold tracking-wide flex items-center gap-1">
                          <FileCheck className="w-3 h-3" />
                          Rx Required
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-bold tracking-wide">
                          OTC Available
                        </span>
                      )}
                    </div>
                  </div>

                  <h3
                    className="font-bold text-slate-900 text-sm mt-1 truncate cursor-pointer hover:text-teal-700 transition"
                    onClick={() => setSelectedMedicine(med)}
                    title={med.name}
                  >
                    {med.name}
                  </h3>

                  {/* Under the tablet: Only Manufacturing Date & Expiring Date */}
                  <div className="mt-2.5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between py-1.5 px-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-500 font-medium">Manufacturing Date:</span>
                      <span className="font-semibold text-slate-800">{formatManufacturingDate(med.mfgDate, med.id)}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 px-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-500 font-medium">Expiring Date:</span>
                      <span className="font-semibold text-rose-600">{formatExpiryDate(med.expiryDate, med.id)}</span>
                    </div>
                  </div>
                </div>

                {/* Price and Add to Cart only */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-bold text-slate-900">
                      ₹{med.discountPrice || med.price}
                    </span>
                    {med.discountPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{med.price}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => addToCart(med, 1)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: Cart & Checkout */}
      {activeTab === 'cart' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Medimart Bag ({cartItemCount} items)
              </h3>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium"
                >
                  Clear Bag
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
                <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-800 text-sm">Your pharmacy bag is empty</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Browse our certified medicine catalog to order medications and clinical supplements.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('catalog')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Browse Medicines
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => {
                  const price = item.medicine.discountPrice || item.medicine.price;
                  return (
                    <div
                      key={item.medicine.id}
                      className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.medicine.image}
                          alt={item.medicine.name}
                          className="w-14 h-14 object-cover rounded-xl border border-slate-200"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{item.medicine.name}</h4>
                          <span className="text-xs text-slate-500 font-medium">
                            {item.medicine.dosageForm} &bull; {item.medicine.strength}
                          </span>
                          {item.medicine.requiresPrescription && (
                            <span className="ml-2 text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                              Rx Required
                            </span>
                          )}
                          <div className="text-xs font-bold text-slate-900 mt-1">
                            ₹{price.toFixed(2)} each
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-slate-200 rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.medicine.id, -1)}
                            className="p-1 text-slate-500 hover:text-slate-800"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.medicine.id, 1)}
                            className="p-1 text-slate-500 hover:text-slate-800"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.medicine.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Checkout & Address Form */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
                Delivery &amp; Payment Checkout
              </h3>

              {cartHasRxItems && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1.5">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-amber-700" />
                    Prescription Verification Required
                  </div>
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    Your cart contains prescription medications. Your official digital e-Rx (#rx-501) has been attached automatically.
                  </p>
                  <div className="flex items-center gap-1.5 pt-1 text-[11px] font-mono text-amber-900">
                    <Upload className="w-3 h-3 text-amber-700" />
                    Attached: <strong>{rxFileName}</strong>
                  </div>
                </div>
              )}

              <form onSubmit={handlePlaceOrder} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.fullName}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, fullName: e.target.value })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={shippingAddress.street}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, street: e.target.value })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, city: e.target.value })
                      }
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, state: e.target.value })
                      }
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      value={shippingAddress.zip}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, zip: e.target.value })
                      }
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={shippingAddress.phone}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, phone: e.target.value })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>

                <div className="pt-2">
                  <UnifiedPaymentSelector
                    amount={cartTotal}
                    title="Medimart Prescription Medicines"
                    recipient="PulseMed 24x7 Chemist"
                    selectedMethod={paymentMethodType}
                    onMethodChange={(m) => {
                      setPaymentMethodType(m);
                      if (m === 'cod') setPaymentMethod('Cash on Delivery (Doorstep)');
                      else if (m === 'upi') setPaymentMethod('UPI / GPay / PhonePe (Instant QR)');
                      else if (m === 'card') setPaymentMethod('Debit / Credit Card (RuPay/Visa)');
                      else setPaymentMethod('NetBanking & Digital Wallets');
                    }}
                    type="pharmacy"
                  />
                </div>

                {/* Order Summary */}
                <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Medicines Subtotal:</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Express Temperature-Controlled Delivery:</span>
                    <span className="text-emerald-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registered Pharmacist Verification:</span>
                    <span className="text-emerald-600 font-medium">Included</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 text-sm pt-2 border-t border-slate-200">
                    <span>Total Amount:</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={cart.length === 0 || isCheckingOut}
                  className="w-full mt-2 py-3 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {isCheckingOut
                    ? 'Processing Secure Checkout...'
                    : paymentMethodType === 'cod'
                    ? `Confirm Order & Pay ₹${cartTotal.toFixed(2)} on Delivery`
                    : `Authorize & Place Order (₹${cartTotal.toFixed(2)})`}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Order Management & Tracking */}
      {activeTab === 'orders' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-teal-600" />
                <span>Orders &amp; Returns History</span>
              </h3>
              <p className="text-xs text-slate-500">
                Track live courier dispatches, review past invoices, and manage returned medications or refund claims.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {role === 'patient' && orders.length > 0 && (
                <button
                  type="button"
                  onClick={() => setReturnOrder(orders[0])}
                  className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                  <span>+ Request Return on Order</span>
                </button>
              )}
            </div>
          </div>

          {/* Sub-navigation inside Order Page */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold overflow-x-auto w-fit">
            <button
              type="button"
              onClick={() => setOrderViewFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                orderViewFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Orders ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setOrderViewFilter('active')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                orderViewFilter === 'active'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active Deliveries ({orders.filter((o) => o.status !== 'delivered').length})
            </button>
            <button
              type="button"
              onClick={() => setOrderViewFilter('delivered')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                orderViewFilter === 'delivered'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Delivered ({orders.filter((o) => o.status === 'delivered').length})
            </button>
            <button
              type="button"
              onClick={() => setOrderViewFilter('returns')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                orderViewFilter === 'returns'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span>Returned Orders ({medicineReturns.length})</span>
            </button>
          </div>

          {/* Sub-view: Returned Orders & Claims */}
          {orderViewFilter === 'returns' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-white rounded-2xl border border-slate-200 text-center shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Claims</span>
                  <div className="text-xl font-black text-slate-900 mt-0.5">{medicineReturns.length}</div>
                </div>
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-amber-700">Pending Review</span>
                  <div className="text-xl font-black text-amber-900 mt-0.5">
                    {medicineReturns.filter((r) => r.status === 'pending').length}
                  </div>
                </div>
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-emerald-700">Settled &amp; Replaced</span>
                  <div className="text-xl font-black text-emerald-900 mt-0.5">
                    {medicineReturns.filter((r) => r.status === 'approved' || r.status === 'accepted').length}
                  </div>
                </div>
                <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-center shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-rose-700">Rejected</span>
                  <div className="text-xl font-black text-rose-900 mt-0.5">
                    {medicineReturns.filter((r) => r.status === 'rejected').length}
                  </div>
                </div>
              </div>

              {medicineReturns.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                  No return requests have been made yet.
                </div>
              ) : (
                medicineReturns.map((ret) => (
                  <div
                    key={ret.id}
                    className={`bg-white rounded-2xl border p-5 shadow-xs space-y-3 transition ${
                      ret.status === 'approved' || ret.status === 'accepted'
                        ? 'border-emerald-300'
                        : ret.status === 'rejected'
                        ? 'border-rose-300'
                        : 'border-amber-300 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-slate-900">
                            Claim #{ret.id}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            (Order #{ret.orderId})
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                              ret.status === 'approved' || ret.status === 'accepted'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ret.status === 'rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-900 animate-pulse'
                            }`}
                          >
                            {ret.status === 'approved' || ret.status === 'accepted'
                              ? 'Approved & Settled ✓'
                              : ret.status === 'rejected'
                              ? 'Rejected'
                              : 'Pending Chemist Review'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Requested: <strong>{ret.requestedAt}</strong> &bull; Resolution: <strong className="capitalize">{ret.resolutionRequested}</strong>
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-base font-black text-slate-900">
                          ₹{ret.totalRefundAmount.toFixed(2)}
                        </span>
                        <span className="block text-[11px] text-amber-800 font-bold capitalize">
                          {ret.resolutionRequested === 'refund' ? 'Refund Credited' : 'Direct Replacement'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Returned Medicine
                        </span>
                        <p className="font-bold text-slate-900 text-sm">{ret.medicineName}</p>
                        <p className="text-slate-500 text-[11px]">
                          Qty: {ret.quantity} unit(s) &bull; Unit Price: ₹{ret.itemPrice}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Reason / Defect Reported
                        </span>
                        <span className="inline-block px-2 py-0.5 rounded-md font-bold text-[11px] bg-amber-100 text-amber-900 capitalize">
                          {ret.reason.replace(/_/g, ' ')}
                        </span>
                        <p className="text-slate-600 text-[11px] mt-0.5 italic">
                          &ldquo;{ret.reasonDescription}&rdquo;
                        </p>
                      </div>
                    </div>

                    {ret.pharmacyNotes && (
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Pharmacy Inspection Record:
                        </span>
                        <p className="text-slate-800 font-medium">{ret.pharmacyNotes}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Sub-view: Filtered Orders List */
            <div className="space-y-4">
              {orders
                .filter((order) => {
                  if (orderViewFilter === 'active') return order.status !== 'delivered';
                  if (orderViewFilter === 'delivered') return order.status === 'delivered';
                  return true;
                })
                .map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-teal-300 transition"
                  >
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <span className="font-mono text-xs font-bold text-slate-900">
                          Order #{order.id}
                        </span>
                        <span className="text-xs text-slate-500 ml-2">Placed: {order.orderedAt}</span>
                        <span className="text-xs text-slate-500 ml-2 font-mono">
                          (Tx: {order.transactionId})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          id={`track-order-btn-${order.id}`}
                          onClick={() => setTrackingOrder(order)}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer group active:scale-95"
                          title="Track Live Order Status & Courier Route"
                        >
                          <Truck className="w-3.5 h-3.5 animate-bounce" />
                          <span>Track Order</span>
                        </button>

                        {role === 'patient' && (
                          <button
                            type="button"
                            onClick={() => setReturnOrder(order)}
                            className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                            title="Return expired or damaged medicine to pharmacy"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                            <span>Return Item (Expired/Damaged)</span>
                          </button>
                        )}

                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            order.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          Status: {order.status.toUpperCase()}
                        </span>

                        {/* Admin or Doctor or Shopkeeper quick status selector */}
                        {role !== 'patient' && (
                          <div className="flex items-center gap-1.5 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-xl">
                            <span className="text-[10px] font-black text-teal-800 uppercase tracking-wider">
                              {role === 'shopkeeper' ? 'Pharmacy Dispensing Action:' : 'Status Control:'}
                            </span>
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as PharmacyOrder['status'])}
                              className="text-[11px] bg-white border border-teal-300 rounded-lg px-2 py-0.5 font-bold text-slate-800 focus:outline-none cursor-pointer"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing (Dispensing)</option>
                              <option value="shipped">Shipped (In Transit)</option>
                              <option value="delivered">Delivered</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Active Returns / Replacements on this order */}
                    {medicineReturns
                      .filter((r) => r.orderId === order.id)
                      .map((ret) => (
                        <div
                          key={ret.id}
                          className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
                            <div>
                              <span className="font-bold text-slate-900">
                                Return Claim #{ret.id} ({ret.medicineName}):
                              </span>
                              <span className="text-slate-600 ml-1">
                                {ret.reason.replace(/_/g, ' ')} &bull; {ret.reasonDescription}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] shrink-0 ${
                              ret.status === 'accepted'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ret.status === 'rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-200 text-amber-900'
                            }`}
                          >
                            {ret.status === 'accepted'
                              ? 'Return Accepted & Settled ✓'
                              : ret.status === 'rejected'
                              ? 'Return Declined'
                              : 'Chemist Review Pending ⏳'}
                          </span>
                        </div>
                      ))}

                    {/* Items & Shipping Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="font-semibold text-slate-500 block mb-2 text-[11px] uppercase">
                          Ordered Medications ({order.items.length})
                        </span>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-slate-700">
                              <div className="flex items-center gap-2">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-7 h-7 object-cover rounded-md border border-slate-200"
                                />
                                <span>
                                  {item.name} <strong className="text-slate-900">x{item.quantity}</strong>
                                </span>
                              </div>
                              <span className="font-bold text-slate-900">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 space-y-1">
                        <span className="font-semibold text-slate-500 block text-[11px] uppercase">
                          Delivery Destination
                        </span>
                        <p className="font-bold text-slate-900">{order.shippingAddress.fullName}</p>
                        <p className="text-slate-600">{order.shippingAddress.street}</p>
                        <p className="text-slate-600">
                          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                        </p>
                        <p className="text-slate-500 text-[11px] pt-1">
                          Payment: {order.paymentMethod} &bull; Total: <strong>₹{order.totalAmount}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Step-by-Step Delivery Progress Tracker */}
                    <div className="pt-3 border-t border-slate-100">
                      <span className="font-semibold text-slate-500 block mb-3 text-[11px] uppercase flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-teal-600" />
                        Delivery Timeline &bull; Expected: {order.estimatedDelivery}
                      </span>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {order.trackingSteps.map((step, idx) => (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-xl border text-xs ${
                              step.completed
                                ? 'bg-teal-50/70 border-teal-200 text-teal-950'
                                : 'bg-slate-50 border-slate-200 text-slate-400'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 font-bold mb-1">
                              <CheckCircle2
                                className={`w-3.5 h-3.5 ${
                                  step.completed ? 'text-teal-600' : 'text-slate-300'
                                }`}
                              />
                              <span className="text-[11px]">Step {idx + 1}</span>
                            </div>
                            <p className="font-medium text-[11px] leading-tight">{step.title}</p>
                            <span className="text-[10px] opacity-70 block mt-1">{step.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 4: Return Requests for Damaged or Expired Items */}
      {activeTab === 'returns' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-600" />
                <span>Return Requests &bull; Damaged or Expired Items</span>
              </h3>
              <p className="text-xs text-slate-500">
                Track and process claims for expired medicines, broken blister foils, and damaged seals
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {role === 'patient' && orders.length > 0 && (
                <button
                  type="button"
                  onClick={() => setReturnOrder(orders[0])}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>+ Request Return on Order</span>
                </button>
              )}

              {/* Status Filter Chips */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((filterKey) => (
                  <button
                    key={filterKey}
                    type="button"
                    onClick={() => setReturnStatusFilter(filterKey)}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer capitalize ${
                      returnStatusFilter === filterKey
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {filterKey === 'all'
                      ? `All (${medicineReturns.length})`
                      : filterKey === 'pending'
                      ? `Pending (${medicineReturns.filter((r) => r.status === 'pending').length})`
                      : filterKey === 'approved'
                      ? `Approved (${medicineReturns.filter((r) => r.status === 'approved' || r.status === 'accepted').length})`
                      : `Rejected (${medicineReturns.filter((r) => r.status === 'rejected').length})`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Metric KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200 text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Claims</span>
              <div className="text-xl font-black text-slate-900 mt-0.5">{medicineReturns.length}</div>
              <span className="text-[10px] text-slate-500">Tracked in Pharmacy</span>
            </div>
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-amber-700">Pending Review</span>
              <div className="text-xl font-black text-amber-900 mt-0.5">
                {medicineReturns.filter((r) => r.status === 'pending').length}
              </div>
              <span className="text-[10px] text-amber-700 font-bold">Awaiting shopkeeper</span>
            </div>
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-emerald-700">Approved &amp; Settled</span>
              <div className="text-xl font-black text-emerald-900 mt-0.5">
                {medicineReturns.filter((r) => r.status === 'approved' || r.status === 'accepted').length}
              </div>
              <span className="text-[10px] text-emerald-700 font-bold">Refunded / Replaced</span>
            </div>
            <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-rose-700">Rejected Claims</span>
              <div className="text-xl font-black text-rose-900 mt-0.5">
                {medicineReturns.filter((r) => r.status === 'rejected').length}
              </div>
              <span className="text-[10px] text-rose-600">Disallowed</span>
            </div>
          </div>

          {/* Return Requests List */}
          {medicineReturns.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
              <p className="text-slate-600 font-bold text-sm">No Return Requests Found</p>
              <p className="text-xs text-slate-400">
                You can return any delivered order item if it arrived expired or with damaged packaging.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {medicineReturns
                .filter((ret) => {
                  if (returnStatusFilter === 'pending') return ret.status === 'pending';
                  if (returnStatusFilter === 'approved')
                    return ret.status === 'approved' || ret.status === 'accepted';
                  if (returnStatusFilter === 'rejected') return ret.status === 'rejected';
                  return true;
                })
                .map((ret) => (
                  <div
                    key={ret.id}
                    className={`bg-white rounded-2xl border p-5 shadow-xs space-y-3 transition ${
                      ret.status === 'approved' || ret.status === 'accepted'
                        ? 'border-emerald-300'
                        : ret.status === 'rejected'
                        ? 'border-rose-300'
                        : 'border-amber-300 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-slate-900">
                            Claim #{ret.id}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            (Order #{ret.orderId})
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                              ret.status === 'approved' || ret.status === 'accepted'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ret.status === 'rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-900 animate-pulse'
                            }`}
                          >
                            {ret.status === 'approved' || ret.status === 'accepted'
                              ? 'Approved & Settled ✓'
                              : ret.status === 'rejected'
                              ? 'Rejected'
                              : 'Pending Chemist Review'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Patient: <strong className="text-slate-900">{ret.patientName}</strong> &bull;{' '}
                          {ret.patientPhone} &bull; Requested on {ret.requestedAt}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-slate-900">
                          ₹{ret.totalRefundAmount.toFixed(2)}
                        </span>
                        <span className="block text-[11px] text-indigo-700 font-bold capitalize">
                          Resolution: {ret.resolutionRequested}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Returned Medicine
                        </span>
                        <p className="font-bold text-slate-900 text-sm">{ret.medicineName}</p>
                        <p className="text-slate-500 text-[11px]">
                          Qty: {ret.quantity} unit(s) &bull; Unit MRP: ₹{ret.itemPrice}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Defect / Expiry Details
                        </span>
                        <span className="inline-block px-2 py-0.5 rounded-md font-bold text-[11px] bg-amber-100 text-amber-900 capitalize">
                          {ret.reason.replace(/_/g, ' ')}
                        </span>
                        <p className="text-slate-600 text-[11px] mt-0.5 italic">
                          &ldquo;{ret.reasonDescription}&rdquo;
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                          <span>Batch: <strong>{ret.batchNumber || 'N/A'}</strong></span>
                          <span>Printed Exp: <strong>{ret.expiryDateFound || 'N/A'}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Verification and Notes */}
                    {ret.pharmacyNotes && (
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Pharmacy Inspection Record:
                        </span>
                        <p className="text-slate-800 font-medium">{ret.pharmacyNotes}</p>
                        {ret.quarantineBinId && (
                          <span className="text-[11px] text-amber-800 font-mono mt-0.5 block">
                            Quarantine Location: {ret.quarantineBinId}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                      <span className="text-slate-500">
                        {ret.status === 'pending'
                          ? 'Claim is pending review by counter pharmacist'
                          : `Processed on ${ret.processedAt || ret.acceptedAt || 'Recently'}`}
                      </span>

                      {/* Process Return Action Button for Shopkeepers */}
                      {role !== 'patient' && (
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedReturnForProcessing(ret)}
                            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black shadow-xs transition cursor-pointer flex items-center gap-1.5 active:scale-95"
                            title="Open review modal to approve or reject this return request"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Process Return</span>
                          </button>

                          {ret.status === 'pending' && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  processReturnRequest(
                                    ret.id,
                                    'reject',
                                    'Item condition inspected: Packaging intact and within statutory shelf-life.'
                                  )
                                }
                                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
                              >
                                Reject
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  processReturnRequest(
                                    ret.id,
                                    'approve',
                                    `Pharmacist confirmed ${ret.reason.replace(/_/g, ' ')}. ₹${ret.totalRefundAmount} settled.`,
                                    'Bin Q-04 (Damaged Shelf)'
                                  )
                                }
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition cursor-pointer flex items-center gap-1.5 active:scale-95"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approve (₹{ret.totalRefundAmount})</span>
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Medicine Details Modal - Responsive to any screen size */}
      {selectedMedicine && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.15 }}
            className="bg-white rounded-3xl max-w-lg sm:max-w-xl w-full shadow-2xl border border-slate-200/90 max-h-[94vh] sm:max-h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Sticky Header: Medicine identity, Mfg & Exp Date pills, and Close button */}
            <div className="shrink-0 p-4 sm:px-6 sm:py-4 border-b border-slate-200/90 bg-white flex items-center justify-between gap-3 z-10">
              <div className="min-w-0 flex items-center gap-3">
                {selectedMedicine.image && (
                  <img
                    src={selectedMedicine.image}
                    alt={selectedMedicine.name}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                  />
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                      {selectedMedicine.name}
                    </h3>
                    {selectedMedicine.dosageForm && (
                      <span className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {selectedMedicine.dosageForm}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] mt-1">
                    <span className="py-0.5 px-2 bg-slate-50 rounded-md border border-slate-200 text-slate-700">
                      <span className="text-slate-500 font-medium mr-1">Mfg Date:</span>
                      <strong className="text-slate-800 font-semibold">{formatManufacturingDate(selectedMedicine.mfgDate, selectedMedicine.id)}</strong>
                    </span>
                    <span className="py-0.5 px-2 bg-rose-50 rounded-md border border-rose-200 text-rose-700">
                      <span className="text-rose-500 font-medium mr-1">Exp Date:</span>
                      <strong className="text-rose-700 font-semibold">{formatExpiryDate(selectedMedicine.expiryDate, selectedMedicine.id)}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMedicine(null)}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer shrink-0"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body: Description, Therapeutic Uses, Reported Side Effects */}
            <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-6 sm:py-5 space-y-4 text-xs overscroll-contain">
              <div className="space-y-1">
                <span className="font-bold text-slate-800 block text-xs">Clinical Description:</span>
                <p className="text-slate-600 leading-relaxed bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80 text-xs">
                  {selectedMedicine.description}
                </p>
              </div>

              {selectedMedicine.uses && selectedMedicine.uses.length > 0 && (
                <div>
                  <span className="font-bold text-slate-800 block mb-1.5 text-xs">Therapeutic Indications:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMedicine.uses.map((u, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg text-xs font-medium"
                      >
                        {u}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedMedicine.sideEffects && selectedMedicine.sideEffects.length > 0 && (
                <div>
                  <span className="font-bold text-slate-800 block mb-1.5 text-xs">Reported Precautions &amp; Side Effects:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMedicine.sideEffects.map((s, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Footer: Price & Add to Cart button */}
            <div className="shrink-0 px-4 py-3 sm:px-6 sm:py-3.5 border-t border-slate-200 bg-slate-50/95 backdrop-blur-xs flex items-center justify-between gap-3 z-10">
              <div>
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium block">Price per Unit</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg sm:text-xl font-black text-slate-900 font-mono">
                    ₹{selectedMedicine.discountPrice || selectedMedicine.price}
                  </span>
                  {selectedMedicine.discountPrice && (
                    <span className="text-xs text-slate-400 line-through">
                      ₹{selectedMedicine.price}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMedicine(null)}
                  className="px-3.5 sm:px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addToCart(selectedMedicine, 1);
                    setSelectedMedicine(null);
                  }}
                  className="px-4 sm:px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Medimart Bag</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Live Order Tracking Modal */}
      <OrderTrackingModal
        order={trackingOrder}
        isOpen={!!trackingOrder}
        onClose={() => setTrackingOrder(null)}
        onUpdateStatus={updateOrderStatus}
      />

      {/* Return Medicine Modal (Expired / Damaged Items) */}
      {returnOrder && (
        <ReturnMedicineModal
          order={returnOrder}
          isOpen={Boolean(returnOrder)}
          onClose={() => setReturnOrder(null)}
        />
      )}

      {/* Process Return Request Modal (For Shopkeepers to Approve or Reject) */}
      {selectedReturnForProcessing && (
        <ProcessReturnModal
          isOpen={Boolean(selectedReturnForProcessing)}
          onClose={() => setSelectedReturnForProcessing(null)}
          returnRequest={selectedReturnForProcessing}
          onProcessReturn={(id, decision, notes, bin) => {
            processReturnRequest(id, decision, notes, bin);
          }}
        />
      )}
    </div>
  );
};
