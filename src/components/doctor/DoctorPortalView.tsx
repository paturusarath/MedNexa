import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Award,
  Stethoscope,
  Building2,
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  CheckCircle2,
  Lock,
  LogOut,
  FileCheck,
  Star,
  Activity,
  Edit,
  Save,
  FileText,
  TrendingUp,
  Download,
  Check,
  Plus,
  AlertCircle,
  Phone,
  Mail,
  Printer,
  HeartHandshake,
  GraduationCap,
  FolderGit2,
  Shield,
  Trash2,
  X,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Globe,
  Edit3,
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { BottomNavTab } from '../BottomNav';
import { DoctorProfilePrintModal } from './DoctorProfilePrintModal';

interface DoctorPortalViewProps {
  onNavigate?: (tab: BottomNavTab, subSection?: string) => void;
  initialSubTab?: DoctorPortalTab | null;
}

export type DoctorPortalTab =
  | 'credentials'
  | 'fees_earnings'
  | 'availability'
  | 'rx_templates'
  | 'reviews'
  | 'certificates'
  | 'referrals'
  | 'compliance';

export const DoctorPortalView: React.FC<DoctorPortalViewProps> = ({
  onNavigate,
  initialSubTab = null,
}) => {
  const { logout, prescriptions, appointments, addNotification, selectedLanguage, openEditProfile } = useHealth();

  // Active Sub-Section: null = Main List View (one by one, like patient portal)
  const [activeTab, setActiveTab] = useState<DoctorPortalTab | null>(initialSubTab);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showPrintProfileModal, setShowPrintProfileModal] = useState(false);

  // Doctor Credentials State
  const [doctorName, setDoctorName] = useState('Dr. V. Mohan, MD');
  const [specialization, setSpecialization] = useState('Cardiology & Internal Medicine');
  const [licenseNumber, setLicenseNumber] = useState('NMC-2012-90482 (Karnataka Medical Council)');
  const [hospital, setHospital] = useState('Fortis Hospital & PulseMed Heart Clinic, Bengaluru');
  const [qualifications, setQualifications] = useState('MBBS (Madras Medical College), MD (General Medicine), DM (Cardiology, AIIMS), FACC');
  const [experienceYears, setExperienceYears] = useState(16);
  const [clinicAddress, setClinicAddress] = useState('Suite 402, 100ft Road, Indiranagar, Bengaluru, Karnataka - 560038');
  const [doctorPhone, setDoctorPhone] = useState('+91 98450 88990');
  const [doctorEmail, setDoctorEmail] = useState('dr.vmohan@pulsehealth.org');
  const [hprId, setHprId] = useState('HPR-84920-KAR-2012');

  // Consultation Fees & Payout State (₹ INR)
  const [videoFee, setVideoFee] = useState(800);
  const [clinicFee, setClinicFee] = useState(1200);
  const [followUpFee, setFollowUpFee] = useState(400);
  const [bankUpiId, setBankUpiId] = useState('dr.vance@hdfcbank');
  const [bankAccountNo, setBankAccountNo] = useState('50100294820194');
  const [bankIfsc, setBankIfsc] = useState('HDFC0001048');
  const [bankName, setBankName] = useState('HDFC Bank Ltd, Indiranagar Branch');

  // OPD Schedule State
  const [opdDays, setOpdDays] = useState<Record<string, boolean>>({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: true,
    Sunday: false,
  });
  const [slotDuration, setSlotDuration] = useState('20 Mins');
  const [emergencyOnCall, setEmergencyOnCall] = useState(true);

  // Edit / Notification States
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Prescription Protocols State
  const [rxTemplates, setRxTemplates] = useState([
    {
      id: 'tmpl-1',
      title: 'Essential Hypertension Starter Protocol',
      category: 'Cardiology',
      medicines: [
        'Telma-40 (Telmisartan 40mg) - 1 tab morning',
        'Rosuvas-10 (Rosuvastatin 10mg) - 1 tab bedtime',
      ],
      instructions: 'Low sodium diet (<2g/day), daily 30-min walk, 30-day BP diary.',
    },
    {
      id: 'tmpl-2',
      title: 'Type-2 Diabetes Glycemic Control Protocol',
      category: 'Endocrinology',
      medicines: [
        'Glycomet-GP 2 Tablet - 1 tab twice daily with meals',
        'Pan-D Capsule - 1 cap morning before food',
      ],
      instructions: 'Fasting glucose self-monitoring twice weekly, HbA1c repeat at 90 days.',
    },
    {
      id: 'tmpl-3',
      title: 'Post-Viral Bronchial & Cough Protocol',
      category: 'Pulmonology',
      medicines: [
        'Montelukast 10mg + Levocetirizine 5mg - 1 tab at night',
        'Azithromycin 500mg - 1 tab daily for 3 days',
      ],
      instructions: 'Steam inhalation twice daily, warm saline gargling, avoid chilled drinks.',
    },
  ]);

  // Patient Reviews State
  const [reviewsList, setReviewsList] = useState([
    {
      id: 'rev-1',
      patientName: 'Sarath Paturu',
      rating: 5,
      date: 'May 10, 2025',
      comment:
        'Dr. V. Mohan is exceptionally thorough. He took the time to explain the rationale for Telmisartan titration and reviewed my Bluetooth vitals seamlessly.',
      doctorReply: 'Thank you Sarath! Keep monitoring your morning readings.',
    },
    {
      id: 'rev-2',
      patientName: 'Rajeev Menon',
      rating: 5,
      date: 'May 02, 2025',
      comment:
        'Post-CABG recovery has been very smooth under Dr. V. Mohan. Video consultation clarity was outstanding, and e-prescription was accepted by my local chemist immediately.',
      doctorReply: 'Glad to hear Rajeev. Your cardiac stress test looked very stable.',
    },
    {
      id: 'rev-3',
      patientName: 'Kavita Sundaram',
      rating: 5,
      date: 'Apr 28, 2025',
      comment:
        'Excellent physician with deep understanding of diabetes cardio-renal risks. Very polite, punctual, and helpful consultation.',
      doctorReply: '',
    },
  ]);
  const [newReplyText, setNewReplyText] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);

  // Medical Certificates State
  const [issuedCertificates, setIssuedCertificates] = useState([
    {
      id: 'CERT-9041',
      patientName: 'Sarath Paturu',
      type: 'Medical Sick Leave / Rest',
      period: 'May 10, 2025 – May 14, 2025 (4 Days)',
      diagnosis: 'Hypertensive Cephalea & Acute Stress Requiring Rest',
      status: 'Active / Digitally Signed',
    },
    {
      id: 'CERT-8902',
      patientName: 'Rajeev Menon',
      type: 'Fit to Resume Work',
      period: 'From May 03, 2025 onwards',
      diagnosis: 'Post-CABG Cardiac Rehabilitation Completed & Stable',
      status: 'Verified',
    },
    {
      id: 'CERT-8714',
      patientName: 'Ananya Sharma',
      type: 'Physical Fitness / Gym Clearance',
      period: 'Annual Clearance (2025-2026)',
      diagnosis: 'Controlled Allergic Rhinitis, Asymptomatic Cardio-Pulmonary',
      status: 'Verified',
    },
  ]);

  // Clinical Referrals State
  const [referralsList, setReferralsList] = useState([
    {
      id: 'REF-104',
      patientName: 'Sarath Paturu',
      specialty: 'Nephrology & Renal Medicine',
      hospital: 'Narayana Institute of Cardiac & Renal Sciences',
      urgency: 'Priority (48h)',
      date: 'May 10, 2025',
      status: 'Appointment Scheduled',
    },
    {
      id: 'REF-098',
      patientName: 'Rajeev Menon',
      specialty: 'Cardiothoracic Surgery Post-Op',
      hospital: 'Fortis Hospital Bengaluru',
      urgency: 'Routine Review',
      date: 'May 02, 2025',
      status: 'Completed / Discharge Summary Received',
    },
  ]);

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSavedSuccess(true);
    addNotification('Profile Updated', 'Doctor credentials and practice settings saved successfully.', 'system', 'doctor');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleToggleDay = (day: string) => {
    setOpdDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const handleAddReply = (revId: string) => {
    if (!newReplyText.trim()) return;
    setReviewsList((prev) =>
      prev.map((r) => (r.id === revId ? { ...r, doctorReply: newReplyText.trim() } : r))
    );
    setNewReplyText('');
    setReplyingToId(null);
  };

  // DOCTOR PORTAL SECTIONS: ONE BY ONE (Exactly referencing patient portal)
  const doctorSections = [
    {
      id: 'credentials' as DoctorPortalTab,
      title: 'Credentials & NMC Registration',
      shortLabel: 'Credentials',
      icon: Stethoscope,
      description: 'National Medical Commission license, degree credentials, and digital seal',
      badge: 'NMC Active',
      iconBg: 'bg-indigo-100 text-indigo-700',
    },
    {
      id: 'fees_earnings' as DoctorPortalTab,
      title: 'Consultation Fees & Bank Payouts',
      shortLabel: 'Fees & Payouts',
      icon: CreditCard,
      description: 'Video consult fee (₹800), clinic fee (₹1,200), bank account, and daily UPI settlements in ₹ INR',
      badge: '₹6,800 Today',
      iconBg: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 'availability' as DoctorPortalTab,
      title: 'OPD Schedule & Working Hours',
      shortLabel: 'Schedule',
      icon: Calendar,
      description: 'Weekly consulting days, 20m slot duration, and emergency on-call status',
      badge: 'Mon – Sat Active',
      iconBg: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'rx_templates' as DoctorPortalTab,
      title: 'Prescription Protocols & Bundles',
      shortLabel: 'Rx Protocols',
      icon: FileText,
      description: 'Pre-configured 1-click prescription templates for hypertension, diabetes, and cardiac care',
      badge: `${rxTemplates.length} Protocols`,
      iconBg: 'bg-amber-100 text-amber-700',
    },
    {
      id: 'reviews' as DoctorPortalTab,
      title: 'Patient Reviews & Clinical Feedback',
      shortLabel: 'Reviews',
      icon: Star,
      description: 'Verified patient testimonials, 4.9★ rating breakdown, and direct doctor reply desk',
      badge: '4.9 ★ (540 Reviews)',
      iconBg: 'bg-orange-100 text-orange-700',
    },
    {
      id: 'certificates' as DoctorPortalTab,
      title: 'Medical Certificates & Fitness Clearances',
      shortLabel: 'Certificates',
      icon: Award,
      description: 'Official medical sick leave, return-to-work, and fitness certificates with verified doctor seal',
      badge: `${issuedCertificates.length} Issued`,
      iconBg: 'bg-purple-100 text-purple-700',
    },
    {
      id: 'referrals' as DoctorPortalTab,
      title: 'Clinical Referrals & Specialist Network',
      shortLabel: 'Referrals',
      icon: HeartHandshake,
      description: 'Cross-specialty referrals to nephrologists, cardiothoracic surgeons, and partner hospitals',
      badge: `${referralsList.length} Referrals`,
      iconBg: 'bg-teal-100 text-teal-700',
    },
    {
      id: 'compliance' as DoctorPortalTab,
      title: 'Telemedicine Compliance & ABDM',
      shortLabel: 'Compliance',
      icon: ShieldCheck,
      description: 'Telemedicine Practice Guidelines 2020, ABDM HPR compliance, and encrypted audit log',
      badge: 'MoHFW Verified',
      iconBg: 'bg-cyan-100 text-cyan-700',
    },
  ];

  const currentSection = doctorSections.find((s) => s.id === activeTab);

  return (
    <div id="doctor-portal-page" className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* ========================================================================= */}
      {/* 1. SIMPLE DOCTOR PROFILE CARD (Clean, Professional, Easy to Read)         */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Avatar & Doctor Identity */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-indigo-600 border-2 border-indigo-400 text-white font-black text-2xl flex items-center justify-center shadow-sm">
                MV
              </div>
              <span
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold"
                title="Active NMC Licensed Doctor"
              >
                ✓
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {doctorName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                  NMC Reg: NMC-2012-90482
                </span>
              </div>

              {/* Doctor Practice Tags & Language under the name */}
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
                  <Stethoscope className="w-3.5 h-3.5 text-indigo-600" />
                  Specialty: <strong>{specialization}</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  Hospital: <strong>Fortis Hospital Bengaluru</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  Consultation Fee: <strong>₹{videoFee} Video / ₹{clinicFee} Clinic</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions (Edit Profile, Print Profile & Sign Out) */}
          <div className="flex items-center gap-2 shrink-0 self-start md:self-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 flex-wrap">
            <button
              type="button"
              id="doctor-edit-profile-btn"
              onClick={() => openEditProfile()}
              className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-indigo-200 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Edit Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPrintProfileModal(true)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-200 hover:border-indigo-200 cursor-pointer"
              title="Print Doctor Practice Summary & Verification Certificate"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-600" />
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
          <span>Doctor credentials, consultation pricing, and clinic schedule updated successfully!</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. PORTAL SECTIONS: ONE BY ONE (Exactly referencing Patient Portal)       */}
      {/* ========================================================================= */}
      {activeTab === null ? (
        /* Main View: List sections one by one with arrow marks at the end */
        <div className="space-y-4">
          <div className="px-1 flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Doctor Practice &amp; Clinical Management
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select any practice record below to view and update details on its page
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              {doctorSections.length} Sections
            </span>
          </div>

          <div className="space-y-2.5">
            {doctorSections.map((sec) => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  type="button"
                  id={`doctor-portal-item-${sec.id}`}
                  onClick={() => setActiveTab(sec.id)}
                  className="w-full bg-white hover:bg-slate-50/90 border border-slate-200/90 hover:border-indigo-400 p-4 sm:p-5 rounded-2xl sm:rounded-3xl transition shadow-xs hover:shadow-md flex items-center justify-between gap-4 text-left group cursor-pointer"
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
                        <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-indigo-800 transition tracking-tight">
                          {sec.title}
                        </h3>
                        {sec.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-800 transition">
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
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-50 group-hover:bg-indigo-600 border border-slate-200 group-hover:border-indigo-600 flex items-center justify-center text-slate-400 group-hover:text-white transition shadow-2xs">
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
              className="p-2 -ml-1 text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition cursor-pointer"
              aria-label="Back"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              {currentSection?.title}
            </span>
          </div>

          {/* SUB-SECTION 1: CREDENTIALS & NMC REGISTRATION */}
          {activeTab === 'credentials' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    National Medical Commission (NMC) Practice Credentials
                  </h3>
                  <p className="text-xs text-slate-500">
                    Verified physician registration, academic degrees, and prescription header details.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Cancel' : 'Edit Credentials'}</span>
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveCredentials} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Doctor Full Legal Name *</label>
                      <input
                        type="text"
                        value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">NMC Registration No. *</label>
                      <input
                        type="text"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Specialization *</label>
                      <input
                        type="text"
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Hospital Affiliation</label>
                      <input
                        type="text"
                        value={hospital}
                        onChange={(e) => setHospital(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">ABDM Health ID (HPR-ID)</label>
                      <input
                        type="text"
                        value={hprId}
                        onChange={(e) => setHprId(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Medical Degrees &amp; Fellowships</label>
                      <input
                        type="text"
                        value={qualifications}
                        onChange={(e) => setQualifications(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Physical Clinic Address</label>
                      <input
                        type="text"
                        value={clinicAddress}
                        onChange={(e) => setClinicAddress(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                    >
                      Save Credentials
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-slate-400 font-semibold block">Full Legal Name:</span>
                    <span className="font-bold text-slate-900 text-sm">{doctorName}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-slate-400 font-semibold block">NMC / State Registration No:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">{licenseNumber}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-slate-400 font-semibold block">Specialization:</span>
                    <span className="font-bold text-slate-900">{specialization}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-slate-400 font-semibold block">ABDM Healthcare ID:</span>
                    <span className="font-mono font-bold text-indigo-700">{hprId}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 sm:col-span-2">
                    <span className="text-slate-400 font-semibold block">Academic Background:</span>
                    <span className="font-medium text-slate-800">{qualifications}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 sm:col-span-2">
                    <span className="text-slate-400 font-semibold block">Clinic Address:</span>
                    <span className="font-medium text-slate-800">{clinicAddress}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SUB-SECTION 2: CONSULTATION FEES & BANK PAYOUTS */}
          {activeTab === 'fees_earnings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Today's OPD Revenue</span>
                  <div className="text-3xl font-black text-slate-900 mt-1">₹6,800</div>
                  <span className="text-xs text-emerald-600 font-bold">+14% vs last week</span>
                </div>

                <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-semibold text-slate-500 uppercase">This Month Settled</span>
                  <div className="text-3xl font-black text-slate-900 mt-1">₹1,42,400</div>
                  <span className="text-xs text-indigo-600 font-medium">178 Consultations</span>
                </div>

                <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Next Payout</span>
                  <div className="text-3xl font-black text-slate-900 mt-1">Tomorrow 10 AM</div>
                  <span className="text-xs text-slate-500">Direct to {bankUpiId}</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Consultation Pricing Configuration (₹ INR)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Set standard patient charges for video telehealth and in-person OPD clinics.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    100% Retained &bull; Direct Payouts
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      Virtual Video Consultation Fee (₹ INR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 font-bold text-slate-500">₹</span>
                      <input
                        type="number"
                        value={videoFee}
                        onChange={(e) => setVideoFee(Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-base font-black text-slate-900 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      Paid online by patients via UPI / Cards / NetBanking.
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      Physical In-Clinic OPD Fee (₹ INR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 font-bold text-slate-500">₹</span>
                      <input
                        type="number"
                        value={clinicFee}
                        onChange={(e) => setClinicFee(Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-base font-black text-slate-900 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      Collected at clinic reception or prepaid digitally.
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      Follow-up Review Fee (₹ INR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 font-bold text-slate-500">₹</span>
                      <input
                        type="number"
                        value={followUpFee}
                        onChange={(e) => setFollowUpFee(Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-base font-black text-slate-900 focus:outline-none"
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      Valid for 7 days post-consultation.
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Doctor Bank Account &amp; UPI ID for Daily Payout Transfers
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Doctor UPI ID</label>
                      <input
                        type="text"
                        value={bankUpiId}
                        onChange={(e) => setBankUpiId(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Bank Account Number</label>
                      <input
                        type="text"
                        value={bankAccountNo}
                        onChange={(e) => setBankAccountNo(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Bank IFSC Code</label>
                      <input
                        type="text"
                        value={bankIfsc}
                        onChange={(e) => setBankIfsc(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-SECTION 3: OPD SCHEDULE & WORKING HOURS */}
          {activeTab === 'availability' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">Weekly OPD Consultation Schedule</h3>
                  <p className="text-xs text-slate-500">
                    Control days and hours you appear active for patient bookings.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Slot Duration:</span>
                  <select
                    value={slotDuration}
                    onChange={(e) => setSlotDuration(e.target.value)}
                    className="py-1 px-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                  >
                    <option value="15 Mins">15 Mins / Patient</option>
                    <option value="20 Mins">20 Mins / Patient</option>
                    <option value="30 Mins">30 Mins / Patient</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {Object.entries(opdDays).map(([day, enabled]) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleToggleDay(day)}
                    className={`p-4 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-between gap-3 ${
                      enabled
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-950 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    <span className="font-bold text-xs">{day}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        enabled ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {enabled ? 'Active OPD' : 'Off'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {enabled ? '10 AM - 6 PM' : 'No Slots'}
                    </span>
                  </button>
                ))}
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-slate-900 text-xs block">Emergency On-Call Support</span>
                  <span className="text-[11px] text-slate-500">
                    Allow patients to request emergency cardiac / hypertension tele-triage outside OPD hours.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setEmergencyOnCall(!emergencyOnCall)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    emergencyOnCall
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {emergencyOnCall ? 'Enabled ✓' : 'Disabled'}
                </button>
              </div>
            </div>
          )}

          {/* SUB-SECTION 4: PRESCRIPTION PROTOCOLS & BUNDLES */}
          {activeTab === 'rx_templates' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Clinical Prescription Protocols &amp; Bundles
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pre-configured medication protocols for rapid outpatient prescription creation.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate?.('shopping')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-xs"
                >
                  Write Custom Rx
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {rxTemplates.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:border-indigo-300 transition space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200">
                        {tmpl.category}
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs mt-2">{tmpl.title}</h4>

                      <div className="mt-2 space-y-1">
                        <span className="text-[11px] font-semibold text-slate-500 block">Medications:</span>
                        {tmpl.medicines.map((m, i) => (
                          <div key={i} className="text-[11px] text-slate-700 bg-white p-1.5 rounded-lg border border-slate-100">
                            &bull; {m}
                          </div>
                        ))}
                      </div>

                      <p className="text-[11px] text-slate-500 mt-2 italic">{tmpl.instructions}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigate?.('shopping')}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      Use Protocol for Patient
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-SECTION 5: PATIENT REVIEWS & CLINICAL RATINGS (4.9★) */}
          {activeTab === 'reviews' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">Verified Patient Testimonials</h3>
                  <p className="text-xs text-slate-500">
                    Feedback from patients who completed teleconsultations and clinic visits.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-amber-500 font-black text-sm bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>4.9 / 5.0 (540 Reviews)</span>
                </div>
              </div>

              <div className="space-y-3">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{rev.patientName}</span>
                        <span className="text-[10px] text-slate-400">&bull; {rev.date}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-medium">{rev.comment}</p>

                    {rev.doctorReply ? (
                      <div className="p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-900">
                        <strong className="block text-[11px] text-indigo-700 mb-0.5">Doctor's Reply:</strong>
                        <span>{rev.doctorReply}</span>
                      </div>
                    ) : replyingToId === rev.id ? (
                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          value={newReplyText}
                          onChange={(e) => setNewReplyText(e.target.value)}
                          placeholder="Write clinical reply to patient..."
                          className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddReply(rev.id)}
                          className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Post Reply
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setReplyingToId(rev.id)}
                        className="text-xs text-indigo-600 hover:underline font-bold cursor-pointer"
                      >
                        Reply to Patient Feedback &rarr;
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-SECTION 6: MEDICAL CERTIFICATES & FITNESS CLEARANCES */}
          {activeTab === 'certificates' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Issued Medical Certificates &amp; Fitness Clearances
                  </h3>
                  <p className="text-xs text-slate-500">
                    Official medical leave and fitness documents issued with NMC digital seal.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate?.('home')}
                  className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs transition"
                >
                  + Issue New Certificate
                </button>
              </div>

              <div className="space-y-3">
                {issuedCertificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{cert.patientName}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                          {cert.type}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">({cert.id})</span>
                      </div>
                      <p className="text-xs text-slate-700 mt-1">
                        Duration: <strong className="text-slate-900">{cert.period}</strong>
                      </p>
                      <p className="text-xs text-slate-500 italic mt-0.5">{cert.diagnosis}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5 text-purple-600" />
                        <span>Print</span>
                      </button>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        {cert.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-SECTION 7: CLINICAL REFERRALS & SPECIALIST NETWORK */}
          {activeTab === 'referrals' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Clinical Referrals &amp; Specialist Network
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cross-specialty referrals to partner hospitals and tertiary care consultants.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate?.('home')}
                  className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs transition"
                >
                  + New Specialist Referral
                </button>
              </div>

              <div className="space-y-3">
                {referralsList.map((ref) => (
                  <div
                    key={ref.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{ref.patientName}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                          {ref.urgency}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">({ref.id})</span>
                      </div>
                      <p className="text-xs text-slate-700 mt-1">
                        Referred to: <strong>{ref.specialty}</strong> &bull; {ref.hospital}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">Date: {ref.date}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200">
                        {ref.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-SECTION 8: TELEMEDICINE COMPLIANCE & ABDM */}
          {activeTab === 'compliance' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900">
                  Telemedicine Practice Guidelines 2020 &amp; ABDM Compliance
                </h3>
                <p className="text-xs text-slate-500">
                  National Medical Commission &amp; Ministry of Health regulatory audit readiness.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>NMC Online CME Module</span>
                  </div>
                  <p className="text-slate-600">
                    Mandatory online training on Telemedicine Practice Guidelines completed. Valid through 2028.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Patient Identity &amp; Explicit Consent</span>
                  </div>
                  <p className="text-slate-600">
                    Mandatory two-way audio-video identification and explicit teleconsult consent recorded per encounter.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>ABDM Healthcare Professional Registry (HPR)</span>
                  </div>
                  <p className="text-slate-600">
                    Doctor ABHA address verified: <code className="text-slate-800 font-mono">marcus.vance@hpr.abdm</code>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>End-to-End Encryption &amp; Audit Trail</span>
                  </div>
                  <p className="text-slate-600">
                    AES-256 encrypted EHR storage with immutable digital signatures on all issued prescriptions.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-black text-slate-900 text-lg">Sign Out of Doctor Portal?</h3>
            <p className="text-xs text-slate-600">
              You will need to re-authenticate with your mobile number or hospital email to access OPD queue.
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Confirm Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Doctor Practice Profile Print & QR Scanner Modal */}
      <DoctorProfilePrintModal
        isOpen={showPrintProfileModal}
        onClose={() => setShowPrintProfileModal(false)}
        doctorName={doctorName}
        regNumber={licenseNumber}
        specialization={specialization}
        hospital={hospital}
        qualifications={qualifications}
        phone={doctorPhone}
        email={doctorEmail}
        address={clinicAddress}
        videoFee={videoFee}
        clinicFee={clinicFee}
        hprId={hprId}
      />
    </div>
  );
};
