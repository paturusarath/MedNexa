import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Phone,
  Mail,
  ShieldCheck,
  FolderGit2,
  Bell,
  CreditCard,
  BrainCircuit,
  GraduationCap,
  Star,
  Lock,
  LogOut,
  AlertCircle,
  Activity,
  Heart,
  Droplet,
  CheckCircle2,
  Calendar,
  FileText,
  PhoneCall,
  ChevronRight,
  ArrowLeft,
  Shield,
  HelpCircle,
  Printer,
  Download,
  Building2,
  Package,
  Edit3,
  Globe,
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { EditProfileModal } from './common/EditProfileModal';
import { BottomNavTab } from './BottomNav';
import { EHRModule } from './EHRModule';
import { PillTrackerModule } from './PillTrackerModule';
import { PaymentsModule } from './PaymentsModule';
import { EducationModule } from './EducationModule';
import { ReviewsModule } from './ReviewsModule';
import { SecurityComplianceModule } from './SecurityComplianceModule';
import { PatientRecordPrintModal } from './patient/PatientRecordPrintModal';
import { PatientOrdersHistorySection } from './patient/PatientOrdersHistorySection';

export type AccountSubTab =
  | 'ehr'
  | 'pills'
  | 'orders'
  | 'payments'
  | 'ai-wellness'
  | 'education'
  | 'reviews'
  | 'security';

interface MyAccountModuleProps {
  initialSubTab?: AccountSubTab | null;
  onNavigate?: (tab: BottomNavTab, subSection?: string) => void;
}

export const MyAccountModule: React.FC<MyAccountModuleProps> = ({
  initialSubTab = null,
  onNavigate,
}) => {
  const {
    currentUser,
    logout,
    selectedLanguage,
    openEditProfile,
    vitals,
    pillReminders,
    appointments,
    allergies,
    diagnoses,
    labReports,
    transactions,
    orders,
    medicineReturns,
  } = useHealth();

  const safeInitialSubTab =
    initialSubTab === 'ai-wellness' ? 'ehr' : initialSubTab || null;
  const [activeSubTab, setActiveSubTab] = useState<AccountSubTab | null>(safeInitialSubTab);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  // Synchronize active sub-tab when user navigates into Portal from Home links
  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab === 'ai-wellness' ? 'ehr' : initialSubTab);
    }
  }, [initialSubTab]);

  // Retrieve any emergency contact saved during account setup
  const emergencyName =
    localStorage.getItem('pulse_patient_emergency_name') || 'Dr. V. Mohan (Primary Care)';
  const emergencyPhone =
    localStorage.getItem('pulse_patient_emergency_phone') || '+91 98765 01234';

  // Medicine calculations for overview card
  const totalPillDosesToday = pillReminders.reduce(
    (sum, r) => sum + (r.active ? r.intakeTimes.length : 0),
    0
  );
  const takenPillDosesToday = pillReminders.reduce(
    (sum, r) => sum + (r.active ? r.todayTakenTimes.length : 0),
    0
  );

  // Account Navigation Sections with simple, friendly titles and plain-English descriptions
  const accountSections = [
    {
      id: 'ehr' as AccountSubTab,
      title: 'Health Records',
      shortLabel: 'Records',
      icon: FolderGit2,
      description: 'Doctor reports, blood pressure, and lab test results',
      badge: `${labReports.length} Reports`,
      iconBg: 'bg-teal-100 text-teal-700',
      activeBorder: 'border-teal-600 bg-teal-50/70',
    },
    {
      id: 'pills' as AccountSubTab,
      title: 'My Medicines',
      shortLabel: 'Medicines',
      icon: Bell,
      description: 'Daily pill schedule, reminders, and doses',
      badge: `${pillReminders.filter((p) => p.active).length} Active`,
      iconBg: 'bg-blue-100 text-blue-700',
      activeBorder: 'border-blue-600 bg-blue-50/70',
    },
    {
      id: 'orders' as AccountSubTab,
      title: 'Orders & Returns',
      shortLabel: 'Orders',
      icon: Package,
      description: 'Medicine delivery history, invoices, and return/refund claims',
      badge: `${orders.length} Orders`,
      iconBg: 'bg-teal-100 text-teal-700',
      activeBorder: 'border-teal-600 bg-teal-50/70',
    },
    {
      id: 'payments' as AccountSubTab,
      title: 'Bills & Receipts',
      shortLabel: 'Bills',
      icon: CreditCard,
      description: 'Consultation fees, medicine bills, and receipts',
      badge: `${transactions.length} Paid`,
      iconBg: 'bg-amber-100 text-amber-700',
      activeBorder: 'border-amber-600 bg-amber-50/70',
    },
    {
      id: 'security' as AccountSubTab,
      title: 'Privacy & Safety',
      shortLabel: 'Privacy',
      icon: Lock,
      description: 'Your health records are encrypted and protected',
      badge: 'Protected',
      iconBg: 'bg-emerald-100 text-emerald-700',
      activeBorder: 'border-emerald-600 bg-emerald-50/70',
    },
    {
      id: 'education' as AccountSubTab,
      title: 'Health Guides',
      shortLabel: 'Guides',
      icon: GraduationCap,
      description: 'Simple, doctor-approved wellness tips and videos',
      badge: 'Helpful',
      iconBg: 'bg-indigo-100 text-indigo-700',
      activeBorder: 'border-indigo-600 bg-indigo-50/70',
    },
    {
      id: 'reviews' as AccountSubTab,
      title: 'Doctor Reviews',
      shortLabel: 'Reviews',
      icon: Star,
      description: 'Read and share feedback for your doctors',
      badge: 'Feedback',
      iconBg: 'bg-orange-100 text-orange-700',
      activeBorder: 'border-orange-600 bg-orange-50/70',
    },
  ];

  const currentSection = accountSections.find((s) => s.id === activeSubTab);

  return (
    <div id="my-account-page" className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* ========================================================================= */}
      {/* 1. SIMPLE PATIENT PROFILE CARD (Clean, Friendly, Easy to Read)            */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Avatar & Patient Identity */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-teal-600 shadow-sm"
              />
              <span
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold"
                title="Active Patient Account"
              >
                ✓
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {currentUser.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
                  Patient #{currentUser.id}
                </span>
              </div>

              {/* Patient Tags under the name */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-slate-700">
                <button
                  type="button"
                  onClick={() => openEditProfile()}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 font-medium transition cursor-pointer"
                  title="Click to view or change selected language"
                >
                  <Globe className="w-3.5 h-3.5 text-indigo-600" />
                  Language Selected: <strong className="text-indigo-900">{selectedLanguage || 'English'}</strong>
                </button>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-teal-600" />
                  Doctor: <strong>Dr. V. Mohan</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 font-medium">
                  <Droplet className="w-3.5 h-3.5 text-rose-600" />
                  Blood: <strong>{currentUser.bloodGroup || 'O+'}</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Insurance: <strong>Active</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions (Edit Profile, Print Summary & Sign Out) */}
          <div className="flex items-center gap-2 shrink-0 self-start md:self-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 flex-wrap">
            <button
              type="button"
              id="account-edit-profile-btn"
              onClick={() => openEditProfile()}
              className="px-4 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-teal-200 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-teal-600" />
              <span>Edit Profile</span>
            </button>

            <button
              type="button"
              id="account-print-ehr-btn"
              onClick={() => setShowPrintModal(true)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-200 hover:border-teal-200 cursor-pointer"
              title="Print your complete medical records with QR verification"
            >
              <Printer className="w-3.5 h-3.5 text-teal-600" />
              <span>Print Records</span>
            </button>

            <button
              type="button"
              id="account-signout-btn"
              onClick={() => setShowLogoutConfirm(true)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-200 hover:border-rose-200 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>


      {/* ========================================================================= */}
      {/* 2. PORTAL SECTIONS: ONE BY ONE OR NEXT PAGE VIEW                         */}
      {/* ========================================================================= */}
      {activeSubTab === null ? (
        /* Main View: List sections one by one with arrow marks at the end */
        <div className="space-y-3">
          <div className="px-1 flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Medical &amp; Account Records
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select any record below to view details on its page
              </p>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
              {accountSections.length} Sections
            </span>
          </div>

          <div className="space-y-2.5">
            {accountSections.map((sec) => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  type="button"
                  id={`portal-item-${sec.id}`}
                  onClick={() => setActiveSubTab(sec.id)}
                  className="w-full bg-white hover:bg-slate-50/90 border border-slate-200/90 hover:border-teal-400 p-4 sm:p-5 rounded-2xl sm:rounded-3xl transition shadow-xs hover:shadow-md flex items-center justify-between gap-4 text-left group cursor-pointer"
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
                        <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-teal-800 transition tracking-tight">
                          {sec.title}
                        </h3>
                        {sec.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-slate-100 text-slate-600 group-hover:bg-teal-100 group-hover:text-teal-800 transition">
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
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-slate-100 group-hover:bg-teal-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all shadow-xs group-hover:translate-x-1">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Next Page View: Displays selected section with Back button at top */
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {/* Top Back Navigation Bar */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-3.5 sm:p-4 shadow-xs flex items-center justify-between gap-3">
            <button
              type="button"
              id="portal-back-to-menu-btn"
              onClick={() => setActiveSubTab(null)}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-teal-50 text-slate-800 hover:text-teal-900 transition border border-slate-200 hover:border-teal-300 shadow-xs cursor-pointer group"
              title="Back"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-teal-700 transition-transform group-hover:-translate-x-1" />
            </button>

            {currentSection && (
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    currentSection.iconBg || 'bg-teal-100 text-teal-700'
                  }`}
                >
                  <currentSection.icon className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <h2 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                    {currentSection.title}
                  </h2>
                  <span className="text-[10px] text-slate-400 font-semibold hidden sm:inline">
                    {currentSection.badge}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Sub-module Content displayed on its own next page */}
          <div id="account-subpage-content">
            {activeSubTab === 'ehr' && <EHRModule />}
            {activeSubTab === 'pills' && <PillTrackerModule />}
            {activeSubTab === 'orders' && (
              <PatientOrdersHistorySection
                onNavigateToPharmacy={() => onNavigate?.('shopping', 'catalog')}
              />
            )}
            {activeSubTab === 'payments' && <PaymentsModule />}
            {activeSubTab === 'security' && <SecurityComplianceModule />}
            {activeSubTab === 'education' && <EducationModule />}
            {activeSubTab === 'reviews' && <ReviewsModule />}
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 3. LOG OUT CONFIRMATION MODAL                                            */}
      {/* ========================================================================= */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Sign Out of Patient Portal?</h3>
              <p className="text-xs text-slate-500 mt-1">
                You will need to verify your phone number or Google account to access your records again.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-signout-btn"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
              >
                Confirm Sign Out
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Full Patient Medical Record Print & QR Scanner Modal */}
      <PatientRecordPrintModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        patientName={currentUser?.name || 'Sarath Paturu'}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
      />
    </div>
  );
};
