import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  CreditCard,
  MapPin,
  Clock,
  LogOut,
  Building2,
  CheckCircle2,
  Phone,
  Mail,
  Truck,
  FileText,
  TrendingUp,
  Edit,
  Save,
  Printer,
  ChevronRight,
  ArrowLeft,
  Thermometer,
  Layers,
  Star,
  ShieldAlert,
  AlertTriangle,
  Plus,
  Trash2,
  Check,
  FileCheck,
  Search,
  Sparkles,
  RotateCcw,
  Globe,
  Edit3,
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { MedicineReturnRequest } from '../../types';
import { BottomNavTab } from '../BottomNav';
import { ShopkeeperProfilePrintModal } from './ShopkeeperProfilePrintModal';
import { ProcessReturnModal } from './ProcessReturnModal';

interface ShopkeeperPortalViewProps {
  onNavigate?: (tab: BottomNavTab, subSection?: string) => void;
  initialSubTab?: ShopkeeperPortalTab | null;
}

export type ShopkeeperPortalTab =
  | 'licenses'
  | 'settlements'
  | 'store_timings'
  | 'distributors'
  | 'schedule_register'
  | 'temperature_logs'
  | 'customer_reviews'
  | 'return_requests';

export const ShopkeeperPortalView: React.FC<ShopkeeperPortalViewProps> = ({
  onNavigate,
  initialSubTab = null,
}) => {
  const { logout, orders, medicines, medicineReturns, processReturnRequest, addNotification, selectedLanguage, openEditProfile } = useHealth();

  // Active Sub-Section: null = Main List View (one by one, like doctor/patient portal)
  const [activeTab, setActiveTab] = useState<ShopkeeperPortalTab | null>(initialSubTab);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showPrintProfileModal, setShowPrintProfileModal] = useState(false);
  const [selectedReturnForProcessing, setSelectedReturnForProcessing] = useState<MedicineReturnRequest | null>(null);
  const [returnFilter, setReturnFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Pharmacy Profile & License State
  const [storeName, setStoreName] = useState('PulseMed 24x7 Chemist & Druggists');
  const [pharmacistName, setPharmacistName] = useState('Rajesh Kumar (B.Pharm)');
  const [pharmacistRegNo, setPharmacistRegNo] = useState('KA-PC-49102 (Karnataka State Pharmacy Council)');
  const [drugLicense, setDrugLicense] = useState('Form 20 & 21: KA-BLR-DL-2019-48201');
  const [gstin, setGstin] = useState('29AABCP1330F1Z4');
  const [fssaiLicense, setFssaiLicense] = useState('FSSAI 11221334000492 (Dietary Supplements & Nutra)');
  const [storeAddress, setStoreAddress] = useState('Shop #12, Ground Floor, Indiranagar 100ft Road, Bengaluru, Karnataka - 560038');
  const [storePhone, setStorePhone] = useState('+91 80 4910 2200');
  const [storeEmail, setStoreEmail] = useState('chemist.indiranagar@pulsemed.in');

  // Settlements & Bank Payout State
  const [bankName, setBankName] = useState('HDFC Bank Ltd, Indiranagar Branch');
  const [bankAccountNo, setBankAccountNo] = useState('50200049102941');
  const [bankIfsc, setBankIfsc] = useState('HDFC0001048');
  const [payoutUpi, setPayoutUpi] = useState('pulsemed.pharmacy@okhdfcbank');
  const [todayDispenseVolume, setTodayDispenseVolume] = useState('₹28,450.00');
  const [monthlyVolume, setMonthlyVolume] = useState('₹8,42,900.00');

  // Store Operations & Timings State
  const [operatingHours, setOperatingHours] = useState('24 Hours / 7 Days Open');
  const [is24x7Open, setIs24x7Open] = useState(true);
  const [nightPharmacist, setNightPharmacist] = useState('Suresh Gowda (D.Pharm, Reg: KA-PC-55102)');
  const [deliveryRadiusKm, setDeliveryRadiusKm] = useState(8);
  const [emergencyDispensingOnCall, setEmergencyDispensingOnCall] = useState(true);

  // Wholesalers & Distributors Directory State
  const [distributorsList, setDistributorsList] = useState([
    {
      id: 'dist-1',
      name: 'Sun Pharma Stockist Depot',
      agency: 'Venkateshwara Pharma Distributors',
      contactPerson: 'K. Srinivasan',
      phone: '+91 98451 22334',
      creditDays: 21,
      gstin: '29AAACV4910F1Z2',
      status: 'Active / Preferred',
    },
    {
      id: 'dist-2',
      name: 'Cipla C&F Agency Bengaluru',
      agency: 'National Drug Agencies',
      contactPerson: 'Anand Mehta',
      phone: '+91 98452 33445',
      creditDays: 30,
      gstin: '29AABCN5520D1Z9',
      status: 'Active / Cold-Chain Approved',
    },
    {
      id: 'dist-3',
      name: 'Micro Labs & Abbott Regional Hub',
      agency: 'Balaji Healthcare Wholesalers',
      contactPerson: 'Pradeep Shenoy',
      phone: '+91 98453 44556',
      creditDays: 14,
      gstin: '29AABCB6630C1Z4',
      status: 'Active',
    },
  ]);

  // Schedule H & H1 Dispensing Audit Register State
  const [scheduleHLogs, setScheduleHLogs] = useState([
    {
      id: 'SCH-8041',
      date: 'May 10, 2025',
      time: '10:45 AM',
      medicineName: 'Augmentin 625 Duo (Strip of 10 Tablets)',
      patientName: 'Sarath Paturu',
      patientPhone: '+91 98450 11223',
      doctorName: 'Dr. V. Mohan (NMC-90482)',
      batchNumber: 'AUG-88410',
      quantityDispensed: '2 Strips',
      rxVerification: 'Digitally Verified e-Rx',
    },
    {
      id: 'SCH-8040',
      date: 'May 09, 2025',
      time: '04:15 PM',
      medicineName: 'Telma 40 (Strip of 30 Tablets)',
      patientName: 'Rajeev Menon',
      patientPhone: '+91 98451 99881',
      doctorName: 'Dr. V. Mohan (NMC-90482)',
      batchNumber: 'TLM-49201',
      quantityDispensed: '1 Strip',
      rxVerification: 'Physical Rx Scanned & Archived',
    },
    {
      id: 'SCH-8039',
      date: 'May 08, 2025',
      time: '08:30 PM',
      medicineName: 'Janumet 50mg/500mg (Strip of 15 Tablets)',
      patientName: 'Kavita Sundaram',
      patientPhone: '+91 98452 77665',
      doctorName: 'Dr. V. Mohan (NMC-80124)',
      batchNumber: 'JNM-41029',
      quantityDispensed: '2 Strips',
      rxVerification: 'Digitally Verified e-Rx',
    },
  ]);

  // Cold Chain & Refrigerator Temperature Logs (2°C - 8°C) State
  const [tempLogs, setTempLogs] = useState([
    {
      date: 'Today (May 10)',
      morningTemp: '4.2°C',
      eveningTemp: '4.5°C',
      unit: 'Insulin & Vaccine Chiller #1',
      recordedBy: 'Rajesh Kumar',
      status: 'Normal (Within 2°-8°C)',
    },
    {
      date: 'Yesterday (May 09)',
      morningTemp: '3.9°C',
      eveningTemp: '4.4°C',
      unit: 'Insulin & Vaccine Chiller #1',
      recordedBy: 'Rajesh Kumar',
      status: 'Normal (Within 2°-8°C)',
    },
    {
      date: 'May 08, 2025',
      morningTemp: '4.1°C',
      eveningTemp: '4.6°C',
      unit: 'Insulin & Vaccine Chiller #1',
      recordedBy: 'Suresh Gowda',
      status: 'Normal (Within 2°-8°C)',
    },
  ]);

  // Customer Reviews State
  const [customerReviews, setCustomerReviews] = useState([
    {
      id: 'crev-1',
      customerName: 'Meera Deshmukh',
      rating: 5,
      date: 'May 08, 2025',
      comment:
        'Always has genuine cardiac medications in stock. The blister packs are fresh with clear batch details and expiration dates.',
      chemistReply: 'Thank you Meera! We store all cardiovascular therapeutics under temperature-controlled racks.',
    },
    {
      id: 'crev-2',
      customerName: 'Anil Kulkarni',
      rating: 5,
      date: 'May 04, 2025',
      comment:
        'Express delivery in under 35 minutes across Indiranagar! Uploaded Dr. V. Mohan\'s e-prescription and the counter pharmacist verified it immediately.',
      chemistReply: 'Glad to assist you Anil! Our delivery fleet is on standby 24 hours.',
    },
    {
      id: 'crev-3',
      customerName: 'Sneha Rao',
      rating: 5,
      date: 'Apr 29, 2025',
      comment:
        'Very professional chemist. They provided a proper GST tax invoice with batch number and expiry printed clearly for insurance claim.',
      chemistReply: 'All our sales are 100% compliant with state drug controller rules.',
    },
  ]);

  const [newReplyText, setNewReplyText] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingProfile(false);
    setSavedSuccess(true);
    addNotification(
      'Pharmacy Profile Updated',
      'Pharmacy trade details and statutory license records saved.',
      'system',
      'shopkeeper'
    );
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddReviewReply = (id: string) => {
    if (!newReplyText.trim()) return;
    setCustomerReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, chemistReply: newReplyText.trim() } : r))
    );
    setNewReplyText('');
    setReplyingToId(null);
  };

  // SHOPKEEPER PORTAL SECTIONS: ONE BY ONE (Exactly matching Doctor/Patient Portal format)
  const shopkeeperSections = [
    {
      id: 'licenses' as ShopkeeperPortalTab,
      title: 'Drug Licenses & State Council Reg',
      shortLabel: 'Licenses',
      icon: ShieldCheck,
      description: 'Retail Drug License Form 20/21, Pharmacist Registration Certificate, and FSSAI nutraceutical license',
      badge: 'Form 20/21 Active',
      iconBg: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'settlements' as ShopkeeperPortalTab,
      title: 'Daily UPI Settlements & Bank Payouts',
      shortLabel: 'Settlements',
      icon: CreditCard,
      description: 'Daily gross dispense payouts (₹28,450 today), HDFC Bank settlement account, and GST tax ledger',
      badge: 'T+0 Settled (₹ INR)',
      iconBg: 'bg-indigo-100 text-indigo-700',
    },
    {
      id: 'store_timings' as ShopkeeperPortalTab,
      title: 'Store Operations & Night-Duty Roster',
      shortLabel: 'Store Hours',
      icon: Clock,
      description: '24x7 operational toggle, night pharmacist in-charge, delivery radius (8 km), and emergency dispatch',
      badge: '24x7 Live',
      iconBg: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'distributors' as ShopkeeperPortalTab,
      title: 'Authorized Wholesalers & Distributor Directory',
      shortLabel: 'Wholesalers',
      icon: Building2,
      description: 'Authorized C&F agents and pharmaceutical stockists (Sun Pharma, Cipla, Micro Labs) with credit terms',
      badge: `${distributorsList.length} Wholesalers`,
      iconBg: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'schedule_register' as ShopkeeperPortalTab,
      title: 'Schedule H & H1 Dispensing Audit Register',
      shortLabel: 'Schedule H',
      icon: FileText,
      description: 'Mandatory statutory drug inspection register recording patient, doctor NMC, batch number, and verified e-Rx',
      badge: 'Inspection Ready',
      iconBg: 'bg-purple-100 text-purple-700',
    },
    {
      id: 'temperature_logs' as ShopkeeperPortalTab,
      title: 'Cold-Chain & Refrigerator Temperature Log',
      shortLabel: 'Cold-Chain',
      icon: Thermometer,
      description: 'Mandatory 2°C - 8°C insulin, biologicals, and vaccine storage daily morning & evening log with calibration',
      badge: '4.2°C Calibrated',
      iconBg: 'bg-teal-100 text-teal-700',
    },
    {
      id: 'customer_reviews' as ShopkeeperPortalTab,
      title: 'Customer Ratings & Delivery Feedback',
      shortLabel: 'Reviews',
      icon: Star,
      description: 'Verified patient testimonials, 4.9★ rating breakdown, and direct pharmacist response desk',
      badge: '4.9 ★ (640 Reviews)',
      iconBg: 'bg-orange-100 text-orange-700',
    },
    {
      id: 'return_requests' as ShopkeeperPortalTab,
      title: 'Customer Return Requests & Damage Quarantine',
      shortLabel: 'Return Claims',
      icon: RotateCcw,
      description: 'Review, approve, or reject customer claims for damaged, broken foil, or expired items with quarantine rack logging',
      badge: `${medicineReturns.filter((r) => r.status === 'pending').length} Pending Claims`,
      iconBg: 'bg-rose-100 text-rose-700',
    },
  ];

  const currentSection = shopkeeperSections.find((s) => s.id === activeTab);

  return (
    <div id="shopkeeper-portal-page" className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* ========================================================================= */}
      {/* 1. SIMPLE PHARMACY PROFILE CARD (Clean, Professional, Easy to Read)       */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Avatar & Store Identity */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-amber-600 border-2 border-amber-400 text-slate-950 font-black text-2xl flex items-center justify-center shadow-sm">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <span
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold"
                title="Licensed Pharmacy Counter Active"
              >
                ✓
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {storeName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  Form 20/21 Licensed
                </span>
              </div>

              {/* Pharmacy Practice Tags & Language under the name */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-slate-700">
                <button
                  type="button"
                  onClick={() => openEditProfile()}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-medium transition cursor-pointer"
                  title="Click to view or change selected language"
                >
                  <Globe className="w-3.5 h-3.5 text-amber-700" />
                  Language Selected: <strong className="text-amber-950">{selectedLanguage || 'English'}</strong>
                </button>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 font-medium">
                  <Award className="w-3.5 h-3.5 text-amber-700" />
                  Pharmacist: <strong>{pharmacistName}</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  GSTIN: <strong>{gstin}</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  Status: <strong>24x7 Dispensing • Cold Chain Active</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions (Edit Profile, Print Profile & Sign Out) */}
          <div className="flex items-center gap-2 shrink-0 self-start md:self-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 flex-wrap">
            <button
              type="button"
              id="shopkeeper-edit-profile-btn"
              onClick={() => openEditProfile()}
              className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-amber-200 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-700" />
              <span>Edit Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPrintProfileModal(true)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-900 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-200 hover:border-amber-200 cursor-pointer"
              title="Print Pharmacy Regulatory Certificate Summary & QR Verification"
            >
              <Printer className="w-3.5 h-3.5 text-amber-700" />
              <span>Print Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-200 hover:border-rose-200 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Pharmacy business profile and statutory settings updated successfully!</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. PORTAL SECTIONS: ONE BY ONE (Exactly matching Doctor/Patient Portal)   */}
      {/* ========================================================================= */}
      {activeTab === null ? (
        /* Main View: List sections one by one with arrow marks at the end */
        <div className="space-y-4">
          <div className="px-1 flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Chemist Practice &amp; Statutory Records
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select any pharmacy record below to view and update details on its page
              </p>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              {shopkeeperSections.length} Sections
            </span>
          </div>

          <div className="space-y-2.5">
            {shopkeeperSections.map((sec) => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  type="button"
                  id={`shopkeeper-portal-item-${sec.id}`}
                  onClick={() => setActiveTab(sec.id)}
                  className="w-full bg-white hover:bg-slate-50/90 border border-slate-200/90 hover:border-amber-400 p-4 sm:p-5 rounded-2xl sm:rounded-3xl transition shadow-xs hover:shadow-md flex items-center justify-between gap-4 text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                    {/* Left Icon Pill */}
                    <div
                      className={`w-12 h-12 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center shrink-0 ${sec.iconBg} transition-transform group-hover:scale-105 shadow-xs`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Title & Description */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-amber-900 transition tracking-tight">
                          {sec.title}
                        </h3>
                        {sec.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-slate-100 text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-900 transition">
                            {sec.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-1 leading-snug">
                        {sec.description}
                      </p>
                    </div>
                  </div>

                  {/* Arrow symbol at right */}
                  <div className="shrink-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-50 group-hover:bg-amber-600 border border-slate-200 group-hover:border-amber-600 flex items-center justify-center text-slate-400 group-hover:text-white transition shadow-2xs">
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Sub-page view with clean top header and back button */
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab(null)}
              className="p-2 -ml-1 text-slate-700 hover:text-amber-800 hover:bg-amber-50 rounded-xl transition cursor-pointer"
              aria-label="Back"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">{currentSection?.title}</span>
              {currentSection?.badge && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                  {currentSection.badge}
                </span>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SUB-PAGE 1: LICENSES & COMPLIANCE                                         */}
          {/* ========================================================================= */}
          {activeTab === 'licenses' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Drugs &amp; Cosmetics Act Regulatory Compliance
                  </h3>
                  <p className="text-xs text-slate-500">
                    State Drug Controller licensed premises under Pharmacy Act 1948 and Drugs &amp; Cosmetics Rules 1945.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5 text-amber-700" />
                  <span>{isEditingProfile ? 'Cancel' : 'Edit Licenses'}</span>
                </button>
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Pharmacy Trade Name
                      </label>
                      <input
                        type="text"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Pharmacist In-Charge (Chief Chemist)
                      </label>
                      <input
                        type="text"
                        value={pharmacistName}
                        onChange={(e) => setPharmacistName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        State Pharmacy Council Registration
                      </label>
                      <input
                        type="text"
                        value={pharmacistRegNo}
                        onChange={(e) => setPharmacistRegNo(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Retail Drug License (Form 20 &amp; 21)
                      </label>
                      <input
                        type="text"
                        value={drugLicense}
                        onChange={(e) => setDrugLicense(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        GSTIN Number
                      </label>
                      <input
                        type="text"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        FSSAI Nutraceutical License
                      </label>
                      <input
                        type="text"
                        value={fssaiLicense}
                        onChange={(e) => setFssaiLicense(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save License Records</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div>
                      <span className="text-slate-400 font-medium block text-[11px]">
                        Registered Drug License (Form 20 &amp; 21)
                      </span>
                      <span className="font-bold text-slate-900">{drugLicense}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block text-[11px]">
                        State Pharmacy Council Registration
                      </span>
                      <span className="font-bold text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {pharmacistRegNo}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block text-[11px]">
                        FSSAI Nutraceutical License
                      </span>
                      <span className="font-mono font-bold text-slate-800">{fssaiLicense}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div>
                      <span className="text-slate-400 font-medium block text-[11px]">
                        Goods &amp; Services Tax (GSTIN)
                      </span>
                      <span className="font-mono font-bold text-slate-900">{gstin}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block text-[11px]">
                        Physical Store Address
                      </span>
                      <span className="font-medium text-slate-800">{storeAddress}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block text-[11px]">
                        Drug Inspector Inspection Status
                      </span>
                      <span className="font-bold text-emerald-700">
                        ✓ Last Inspected: Dec 14, 2024 (Satisfactory / Full Compliance)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUB-PAGE 2: SETTLEMENTS & BANK PAYOUTS                                    */}
          {/* ========================================================================= */}
          {activeTab === 'settlements' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Chemist Settlements &amp; Bank Account
                  </h3>
                  <p className="text-xs text-slate-500">
                    Instant T+0 UPI payouts, card merchant settlements, and GST input credit logs in ₹ INR.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  Daily Auto-Settlement Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-slate-400 font-bold text-[11px] block">Today's Dispense Payout</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">{todayDispenseVolume}</div>
                  <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
                    ✓ Settled via UPI to {payoutUpi}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-slate-400 font-bold text-[11px] block">Monthly Dispense Volume</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">{monthlyVolume}</div>
                  <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                    Total 640+ Doctor Prescriptions Dispensed
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-slate-400 font-bold text-[11px] block">GST Input Tax Credit (ITC)</span>
                  <div className="text-2xl font-black text-indigo-700 mt-1">₹42,180</div>
                  <span className="text-[11px] text-indigo-600 font-semibold mt-1 block">
                    GSTR-2B Wholesaler Input Matched
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <h4 className="font-bold text-slate-900">Registered Settlement Account:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Bank Name &amp; Branch</span>
                    <span className="font-bold text-slate-800">{bankName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Account Number</span>
                    <span className="font-mono font-bold text-slate-800">{bankAccountNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">IFSC Code</span>
                    <span className="font-mono font-bold text-slate-800">{bankIfsc}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Primary UPI Settlement ID</span>
                    <span className="font-mono font-bold text-indigo-700">{payoutUpi}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUB-PAGE 3: STORE TIMINGS & OPERATIONS                                    */}
          {/* ========================================================================= */}
          {activeTab === 'store_timings' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Store Availability &amp; Night Shift Roster
                  </h3>
                  <p className="text-xs text-slate-500">
                    Operating shifts, on-duty pharmacist schedule, and home delivery radius configuration.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  {is24x7Open ? '24 Hours Open' : 'Custom Hours'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-slate-400 font-bold block text-[11px]">Pharmacy Shift Mode</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="toggle-247"
                      checked={is24x7Open}
                      onChange={(e) => setIs24x7Open(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    <label htmlFor="toggle-247" className="font-bold text-slate-900 cursor-pointer">
                      24 Hours / 7 Days Pharmacy Counter Active
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Allows patients to order emergency therapeutics and request night dispatch anytime.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-slate-400 font-bold block text-[11px]">Delivery Radius</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={3}
                      max={20}
                      value={deliveryRadiusKm}
                      onChange={(e) => setDeliveryRadiusKm(Number(e.target.value))}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                    <span className="font-black text-slate-900 font-mono text-sm shrink-0">
                      {deliveryRadiusKm} km
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Under 60 minutes express delivery radius from Indiranagar store counter.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 sm:col-span-2">
                  <span className="text-slate-400 font-bold block text-[11px]">Night Shift Pharmacist In-Charge</span>
                  <div className="font-bold text-slate-900">{nightPharmacist}</div>
                  <p className="text-[11px] text-slate-500">
                    Shift Timings: 09:00 PM – 07:00 AM (Holds registered key to Schedule H locked storage cabinets)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUB-PAGE 4: WHOLESALER DIRECTORY                                          */}
          {/* ========================================================================= */}
          {activeTab === 'distributors' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Authorized Pharmaceutical Distributors
                  </h3>
                  <p className="text-xs text-slate-500">
                    State Drug Controller authorized C&amp;F agents and stockists for replenishment.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
                  {distributorsList.length} Approved Suppliers
                </span>
              </div>

              <div className="space-y-3">
                {distributorsList.map((dist) => (
                  <div
                    key={dist.id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-sm">{dist.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          {dist.status}
                        </span>
                      </div>
                      <p className="text-slate-600 font-medium">Agency: {dist.agency}</p>
                      <p className="text-slate-500 text-[11px]">
                        Contact: <strong className="text-slate-800">{dist.contactPerson}</strong> • Phone: {dist.phone}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-bold text-slate-800 text-[11px] block">
                        Credit Terms: {dist.creditDays} Days
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 mt-1 block">
                        GSTIN: {dist.gstin}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUB-PAGE 5: SCHEDULE H REGISTER AUDIT                                     */}
          {/* ========================================================================= */}
          {activeTab === 'schedule_register' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Schedule H &amp; H1 Prescription Dispensing Register
                  </h3>
                  <p className="text-xs text-slate-500">
                    Official inspection log maintained under Rule 65 of Drugs and Cosmetics Rules 1945.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Inspection Register</span>
                </button>
              </div>

              <div className="space-y-3">
                {scheduleHLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1.5 border-b border-slate-200/60">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-purple-900">{log.id}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600 font-medium">
                          {log.date} at {log.time}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold self-start sm:self-auto">
                        {log.rxVerification}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Dispensed Medicine:</span>
                        <span className="font-bold text-slate-900">{log.medicineName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Patient Name &amp; Phone:</span>
                        <span className="font-medium text-slate-800">
                          {log.patientName} ({log.patientPhone})
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Prescribing Doctor:</span>
                        <span className="font-bold text-indigo-700">{log.doctorName}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 pt-1">
                      Batch Dispensed: <strong className="font-mono text-slate-800">{log.batchNumber}</strong> • Quantity: <strong className="text-slate-800">{log.quantityDispensed}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUB-PAGE 6: COLD CHAIN & TEMPERATURE LOGS                                 */}
          {/* ========================================================================= */}
          {activeTab === 'temperature_logs' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Cold-Chain &amp; Refrigerator Temperature Log
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mandatory 2°C - 8°C twice daily logging for insulin vials, biologicals, and hepatitis/tetanus vaccines.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
                  Calibrated Sensor Active
                </span>
              </div>

              <div className="space-y-3">
                {tempLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-black text-slate-900 text-sm">{log.date}</span>
                      <p className="text-slate-500 mt-0.5">
                        Equipment: <strong className="text-slate-700">{log.unit}</strong>
                      </p>
                      <p className="text-[11px] text-slate-400">Recorded By: {log.recordedBy}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-400 block">Morning (09:00 AM)</span>
                        <span className="font-mono font-black text-teal-800 text-sm">
                          {log.morningTemp}
                        </span>
                      </div>
                      <div className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-400 block">Evening (07:00 PM)</span>
                        <span className="font-mono font-black text-teal-800 text-sm">
                          {log.eveningTemp}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {log.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUB-PAGE 7: CUSTOMER REVIEWS & RATINGS                                    */}
          {/* ========================================================================= */}
          {activeTab === 'customer_reviews' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Customer Ratings &amp; Delivery Reviews
                  </h3>
                  <p className="text-xs text-slate-500">
                    Patient ratings for medicine genuineness, prompt delivery, and prescription verification.
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full text-xs font-bold text-amber-900 border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>4.9 / 5.0 (640 Reviews)</span>
                </div>
              </div>

              <div className="space-y-4">
                {customerReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{rev.customerName}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500 text-[11px]">{rev.date}</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-slate-700 font-medium leading-relaxed">{rev.comment}</p>

                    {rev.chemistReply ? (
                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-600 text-[11px] space-y-1">
                        <span className="font-bold text-amber-900 block">Pharmacist Response:</span>
                        <p>{rev.chemistReply}</p>
                      </div>
                    ) : replyingToId === rev.id ? (
                      <div className="space-y-2 pt-1">
                        <textarea
                          rows={2}
                          value={newReplyText}
                          onChange={(e) => setNewReplyText(e.target.value)}
                          placeholder="Type pharmacist response..."
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setReplyingToId(null)}
                            className="px-3 py-1 bg-slate-200 rounded-lg text-xs"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddReviewReply(rev.id)}
                            className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold"
                          >
                            Post Reply
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setReplyingToId(rev.id)}
                        className="text-xs text-amber-800 font-bold hover:underline cursor-pointer"
                      >
                        + Reply to Customer
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: RETURN REQUESTS FOR DAMAGED / EXPIRED ITEMS */}
          {activeTab === 'return_requests' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Customer Medicine Return Requests Desk
                  </h3>
                  <p className="text-xs text-slate-500">
                    Inspect, approve or reject claims for expired items, torn blister foils, and damaged seals
                  </p>
                </div>

                {/* Filter Chips */}
                <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                  {(['all', 'pending', 'approved', 'rejected'] as const).map((filterKey) => (
                    <button
                      key={filterKey}
                      type="button"
                      onClick={() => setReturnFilter(filterKey)}
                      className={`px-3 py-1 rounded-lg transition cursor-pointer capitalize ${
                        returnFilter === filterKey
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

              {/* Summary KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Total Claims</span>
                  <div className="text-xl font-black text-slate-900 mt-0.5">{medicineReturns.length}</div>
                  <span className="text-[10px] text-slate-400">All submissions</span>
                </div>
                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-amber-700">Pending Review</span>
                  <div className="text-xl font-black text-amber-900 mt-0.5">
                    {medicineReturns.filter((r) => r.status === 'pending').length}
                  </div>
                  <span className="text-[10px] text-amber-700 font-bold">Action required</span>
                </div>
                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-700">Approved &amp; Settled</span>
                  <div className="text-xl font-black text-emerald-900 mt-0.5">
                    {medicineReturns.filter((r) => r.status === 'approved' || r.status === 'accepted').length}
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold">Refunded / Replaced</span>
                </div>
                <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-rose-700">Rejected Claims</span>
                  <div className="text-xl font-black text-rose-900 mt-0.5">
                    {medicineReturns.filter((r) => r.status === 'rejected').length}
                  </div>
                  <span className="text-[10px] text-rose-600">Disallowed</span>
                </div>
              </div>

              {/* Return Claims List */}
              <div className="space-y-3">
                {medicineReturns
                  .filter((ret) => {
                    if (returnFilter === 'pending') return ret.status === 'pending';
                    if (returnFilter === 'approved') return ret.status === 'approved' || ret.status === 'accepted';
                    if (returnFilter === 'rejected') return ret.status === 'rejected';
                    return true;
                  })
                  .map((ret) => (
                    <div
                      key={ret.id}
                      className={`p-4 rounded-2xl border transition space-y-3 ${
                        ret.status === 'approved' || ret.status === 'accepted'
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : ret.status === 'rejected'
                          ? 'bg-rose-50/50 border-rose-200'
                          : 'bg-white border-amber-300 shadow-xs'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
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
                                : 'Pending Action'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">
                            Customer: <strong className="text-slate-900">{ret.patientName}</strong> &bull;{' '}
                            {ret.patientPhone} &bull; Submitted on {ret.requestedAt}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-black text-slate-900">
                            ₹{ret.totalRefundAmount.toFixed(2)}
                          </span>
                          <span className="block text-[11px] text-indigo-700 font-bold capitalize">
                            Resolution: {ret.resolutionRequested}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Returned Item
                          </span>
                          <p className="font-bold text-slate-900 text-sm">{ret.medicineName}</p>
                          <p className="text-slate-500 text-[11px]">
                            Qty: {ret.quantity} &bull; Unit Price: ₹{ret.itemPrice}
                          </p>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Defect Reason
                          </span>
                          <p className="font-bold text-amber-900 capitalize">
                            {ret.reason.replace(/_/g, ' ')}
                          </p>
                          <p className="text-slate-600 text-[11px] mt-0.5 italic">
                            &ldquo;{ret.reasonDescription}&rdquo;
                          </p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                            <span>Batch: <strong>{ret.batchNumber || 'N/A'}</strong></span>
                            <span>Printed Exp: <strong>{ret.expiryDateFound || 'N/A'}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Quarantine and Verification Notes */}
                      {ret.pharmacyNotes && (
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Pharmacist Notes &bull; Quarantine:
                          </span>
                          <p className="text-slate-800 font-medium">{ret.pharmacyNotes}</p>
                          {ret.quarantineBinId && (
                            <span className="text-[11px] text-amber-800 font-mono mt-0.5 block">
                              Quarantine Location: {ret.quarantineBinId}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Action Bar with Process Return Button */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                        <span className="text-[11px] text-slate-500">
                          {ret.status === 'pending'
                            ? 'Review required by pharmacist on duty'
                            : `Processed on ${ret.processedAt || ret.acceptedAt || 'Recently'}`}
                        </span>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedReturnForProcessing(ret)}
                            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black shadow-xs transition cursor-pointer flex items-center gap-1.5 active:scale-95"
                            title="Open detailed modal to approve or reject this request"
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
                                    'Inspection failed: Product blister seals intact and well within shelf-life.'
                                  )
                                }
                                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
                              >
                                Quick Reject
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  processReturnRequest(
                                    ret.id,
                                    'approve',
                                    `Counter pharmacist verified ${ret.reason.replace(/_/g, ' ')}. Refund of ₹${ret.totalRefundAmount} settled.`,
                                    'Bin Q-04 (Damaged Shelf)'
                                  )
                                }
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition cursor-pointer flex items-center gap-1.5 active:scale-95"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Quick Approve (₹{ret.totalRefundAmount})</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Sign Out of Chemist Portal?</h3>
              <p className="text-xs text-slate-500 mt-1">
                You will need to re-authenticate to verify patient prescriptions and access dispensing counters.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={logout}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer transition"
              >
                Confirm Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Pharmacy Legal Profile Print & QR Scanner Modal */}
      <ShopkeeperProfilePrintModal
        isOpen={showPrintProfileModal}
        onClose={() => setShowPrintProfileModal(false)}
        storeName={storeName}
        pharmacistName={pharmacistName}
        licenseNumber={drugLicense}
        gstin={gstin}
        fssaiNumber={fssaiLicense}
        address={storeAddress}
        phone={storePhone}
        email={storeEmail}
      />

      {/* Process Return Request Modal */}
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
