import React, { useState, useEffect, useRef } from 'react';
import {
  HeartPulse,
  Bell,
  ShoppingCart,
  User,
  Stethoscope,
  Pill,
  FlaskConical,
  Shield,
  Video,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Users,
  Package,
  LogOut,
  ChevronDown,
  Calendar,
  FileText,
  Activity,
  ArrowRight,
  Clock,
  Info,
  CheckCheck,
  RotateCcw,
  Sparkles,
  Globe,
  Languages,
  ChevronRight,
  Edit3,
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { UserRole, InAppNotification } from '../types';
import { EditProfileModal, AVAILABLE_LANGUAGES } from './common/EditProfileModal';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string, subSection?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const {
    role,
    setRole,
    currentUser,
    cartItemCount,
    orders,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearAllNotifications,
    activeConsultation,
    logout,
    selectedLanguage,
    setSelectedLanguage,
    openEditProfile,
    t,
  } = useHealth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const roleMenuRef = useRef<HTMLDivElement>(null);

  // Filter notifications according to current login role (doctor, patient, shopkeeper)
  const roleNotifications = notifications.filter(
    (n) => !n.targetRole || n.targetRole === 'all' || n.targetRole === role
  );
  const unreadNotificationCount = roleNotifications.filter((n) => !n.read).length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  // Directly navigate to the related screen / record when clicking any notification (WITHOUT pop alert in all portals)
  const handleOpenNotificationDirectly = (notif: InAppNotification) => {
    markNotificationRead(notif.id);
    setShowNotifications(false);
    const text = `${notif.title} ${notif.message}`.toLowerCase();

    // 1. Medicine Returns / Replacements / Damage Claims
    if (
      text.includes('return') ||
      text.includes('replacement') ||
      text.includes('damaged') ||
      text.includes('refund')
    ) {
      if (role === 'shopkeeper') {
        setActiveTab('shopping');
      } else {
        setActiveTab('shopping', 'returns');
      }
      return;
    }

    // 2. Appointment / Teleconsultation
    if (
      notif.type === 'appointment' ||
      text.includes('appointment') ||
      text.includes('consultation') ||
      text.includes('telehealth') ||
      text.includes('video room') ||
      text.includes('lobby') ||
      text.includes('dr.')
    ) {
      if (role === 'doctor') {
        setActiveTab('doctors');
      } else {
        setActiveTab('doctors');
      }
      return;
    }

    // 3. Vitals Deterioration / BP Spike
    if (text.includes('spike') || text.includes('vitals') || text.includes('mmhg')) {
      if (role === 'doctor') {
        setActiveTab('home');
      } else {
        setActiveTab('home');
      }
      return;
    }

    // 4. Pharmacy Order / Shipment / Delivery
    if (
      notif.type === 'order' ||
      text.includes('order') ||
      text.includes('shipped') ||
      text.includes('dispatched') ||
      text.includes('bluedart') ||
      text.includes('dunzo') ||
      text.includes('courier')
    ) {
      if (role === 'shopkeeper') {
        setActiveTab('shopping');
      } else {
        setActiveTab('shopping', 'orders');
      }
      return;
    }

    // 5. Medication Dose / Pill Reminder
    if (
      notif.type === 'reminder' ||
      text.includes('pill') ||
      text.includes('dose') ||
      text.includes('medication') ||
      text.includes('telma')
    ) {
      if (role === 'doctor') {
        setActiveTab('home');
      } else {
        setActiveTab('account', 'pills');
      }
      return;
    }

    // 6. Prescription / e-Rx
    if (
      notif.type === 'prescription' ||
      text.includes('prescription') ||
      text.includes('e-rx') ||
      text.includes('rx-') ||
      text.includes('dispens')
    ) {
      if (role === 'doctor') {
        setActiveTab('home');
      } else if (role === 'shopkeeper') {
        setActiveTab('shopping');
      } else {
        setActiveTab('shopping', 'catalog');
      }
      return;
    }

    // 7. Bills, Payouts & Daily Settlements
    if (
      text.includes('bill') ||
      text.includes('payment') ||
      text.includes('receipt') ||
      text.includes('paid') ||
      text.includes('payout') ||
      text.includes('settlement')
    ) {
      if (role === 'doctor') {
        setActiveTab('account', 'fees_earnings');
      } else if (role === 'shopkeeper') {
        setActiveTab('account', 'settlements');
      } else {
        setActiveTab('account', 'bills');
      }
      return;
    }

    // 8. Low Stock Inventory Alert
    if (text.includes('stock') || text.includes('inventory')) {
      if (role === 'shopkeeper') {
        setActiveTab('shopping');
      } else {
        setActiveTab('shopping', 'catalog');
      }
      return;
    }

    // 9. System / Lab Reports / EHR
    if (
      notif.type === 'system' ||
      text.includes('lab') ||
      text.includes('report') ||
      text.includes('ehr') ||
      text.includes('diagnostic') ||
      text.includes('hba1c') ||
      text.includes('lipid')
    ) {
      if (role === 'doctor') {
        setActiveTab('home');
      } else {
        setActiveTab('account', 'ehr');
      }
      return;
    }

    // Default: open account / EHR
    setActiveTab('account', 'ehr');
  };

  // Auto-close popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        roleMenuRef.current &&
        !roleMenuRef.current.contains(event.target as Node)
      ) {
        setShowRoleMenu(false);
        setShowLanguagePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Active Video Consultation Ongoing Alert Bar */}
      {activeConsultation && (
        <div className="bg-indigo-900 text-white px-4 py-2 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold">
              Live Telehealth Encounter in Progress: {activeConsultation.doctorName} &amp; {activeConsultation.patientName}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('doctors')}
            className="underline font-bold hover:text-indigo-200 cursor-pointer"
          >
            Return to Video Room &rarr;
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand: MedNexa Connected Medical Nexus */}
          <div
            id="mednexa-nav-symbol"
            className="flex items-center gap-3 select-none text-left cursor-pointer"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-400 via-cyan-500 to-indigo-600 p-[2px] shadow-md shadow-teal-500/20 flex items-center justify-center shrink-0 transition-transform hover:scale-105">
              <div className="w-full h-full bg-[#07111e] rounded-[10px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-radial from-teal-500/20 via-transparent to-transparent pointer-events-none" />
                <svg
                  className="w-5 h-5 relative z-10"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <defs>
                    <linearGradient id="mednexa-nav-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#14b8a6" />
                      <stop offset="50%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                  {/* MedNexa Cross & Orbit Nodes */}
                  <path d="M12 3v3m0 12v3M3 12h3m12 0h3" stroke="url(#mednexa-nav-grad)" strokeWidth="1.8" strokeOpacity="0.7" />
                  <circle cx="12" cy="4" r="1.1" fill="#06b6d4" />
                  <circle cx="12" cy="20" r="1.1" fill="#14b8a6" />
                  <circle cx="4" cy="12" r="1.1" fill="#2dd4bf" />
                  <circle cx="20" cy="12" r="1.1" fill="#6366f1" />
                  <circle cx="12" cy="12" r="6" stroke="url(#mednexa-nav-grad)" strokeWidth="1.6" strokeDasharray="24 4" />
                  <path d="M6 12h2l1.6-2.8 2 5.6 1.8-3.8 1.4 1.8h2.6" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl text-slate-900 tracking-tight leading-none">
                  Med<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600">Nexa</span>
                </span>
                {/* Active Role Badge in Header: e.g. "MedNexa [PATIENT CARE]" */}
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    role === 'doctor'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : role === 'shopkeeper'
                      ? 'bg-amber-100 text-amber-900 border border-amber-200'
                      : 'bg-teal-50 text-teal-800 border border-teal-200'
                  }`}
                >
                  {role === 'doctor'
                    ? 'DOCTOR CONSOLE'
                    : role === 'shopkeeper'
                    ? 'PHARMACY DISPENSING'
                    : 'PATIENT CARE'}
                </span>
                <span
                  title="Connected to Firebase Firestore database: ai-studio-remixremixremixr-f07f3482-a58f-4e68-b706-d959ef71ed29"
                  className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Firebase Live</span>
                </span>
              </div>
              <p className="text-[10px] text-teal-700 font-semibold tracking-wider uppercase mt-0.5 hidden sm:block">
                Connected Health &bull; Clinical Nexus
              </p>
            </div>
          </div>

          {/* Right Action Icons: Role-Specific Action, Notification Bell, User Switcher */}
          <div className="flex items-center gap-2">
            {/* ROLE SPECIFIC PRIMARY NAV SHORTCUT */}
            {role === 'patient' && (
              <button
                type="button"
                id="nav-pharmacy-bag-btn"
                onClick={() => setActiveTab('shopping', 'cart')}
                className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                title="View Medimart Bag"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}

            {role === 'doctor' && (
              <button
                type="button"
                id="nav-doctor-rx-tools-btn"
                onClick={() => {
                  setActiveTab('home');
                  setTimeout(() => {
                    const el = document.getElementById('doctor-rx-safety-desk');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="relative px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                title="Open Clinical Rx Drug Interaction Desk"
              >
                <FlaskConical className="w-4 h-4 text-blue-700" />
                <span className="hidden sm:inline">Rx Interaction Desk</span>
              </button>
            )}

            {role === 'shopkeeper' && (
              <button
                type="button"
                id="nav-shopkeeper-orders-btn"
                onClick={() => setActiveTab('shopping')}
                className="relative px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                title="View Pharmacy Prescription Orders"
              >
                <Package className="w-4 h-4 text-amber-700" />
                <span className="hidden sm:inline">Pharmacy Orders</span>
                {pendingOrdersCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-amber-600 text-white rounded-full text-[10px] font-bold">
                    {pendingOrdersCount}
                  </span>
                )}
              </button>
            )}

            {/* Notification Bell with Dropdown */}
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                id="nav-notification-bell-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* Simple Clean Notification Popover Dropdown */}
              {showNotifications && (
                <div
                  id="notifications-popover"
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col"
                >
                  {/* Simple Header */}
                  <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
                    <div className="font-bold text-xs flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center">
                        <Bell className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-white text-xs">Notifications</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {unreadNotificationCount > 0 && (
                        <button
                          type="button"
                          onClick={() => markAllNotificationsRead(role)}
                          className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-bold text-slate-200 transition flex items-center gap-1 cursor-pointer"
                          title="Mark all notifications as read"
                        >
                          <CheckCheck className="w-3 h-3 text-emerald-400" />
                          <span>Mark Read</span>
                        </button>
                      )}
                      <span className="text-[10px] font-bold bg-teal-600 text-white px-2 py-0.5 rounded-full">
                        {unreadNotificationCount} New
                      </span>
                    </div>
                  </div>

                  {/* Simple Notifications Feed */}
                  <div className="max-h-84 overflow-y-auto divide-y divide-slate-100">
                    {roleNotifications.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-500 space-y-1">
                        <Bell className="w-6 h-6 mx-auto text-slate-300" />
                        <p className="font-bold text-slate-700">No notifications</p>
                        <p className="text-[11px] text-slate-400">
                          You are all caught up with your updates.
                        </p>
                      </div>
                    ) : (
                      roleNotifications.map((notif, index) => (
                        <div
                          key={`${notif.id || 'notif'}-${index}`}
                          onClick={() => handleOpenNotificationDirectly(notif)}
                          className={`p-3.5 text-xs transition cursor-pointer hover:bg-slate-50 flex items-start justify-between gap-3 group ${
                            !notif.read ? 'bg-teal-50/40' : 'bg-white'
                          }`}
                        >
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 group-hover:text-teal-700 transition truncate">
                                {notif.title}
                              </span>
                              {!notif.read && (
                                <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />
                              )}
                            </div>

                            <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">
                              {notif.message}
                            </p>

                            <span className="text-[10px] text-slate-400 block pt-0.5">
                              {notif.timestamp}
                            </span>
                          </div>

                          <ChevronDown className="w-4 h-4 text-slate-300 -rotate-90 group-hover:text-teal-600 transition shrink-0 mt-2" />
                        </div>
                      ))
                    )}
                  </div>

                  {/* Simple Footer */}
                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <button
                      type="button"
                      onClick={() => clearAllNotifications(true)}
                      className="text-slate-500 hover:text-slate-800 transition font-bold cursor-pointer"
                    >
                      Clear read
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      className="font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
                    >
                      Close &times;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Menu */}
            <div className="relative" ref={roleMenuRef}>
              <button
                type="button"
                id="nav-user-profile-menu-btn"
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 rounded-xl hover:bg-slate-100 transition cursor-pointer border border-transparent hover:border-slate-200"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-2xs ${
                    role === 'doctor'
                      ? 'bg-blue-600'
                      : role === 'shopkeeper'
                      ? 'bg-amber-600'
                      : 'bg-indigo-600'
                  }`}
                >
                  {role === 'doctor' ? (
                    <Stethoscope className="w-4 h-4" />
                  ) : role === 'shopkeeper' ? (
                    <Pill className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>

                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 capitalize flex items-center gap-1">
                    <span>{role === 'shopkeeper' ? 'Pharmacy' : role}</span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-teal-600 font-semibold truncate max-w-[65px]">
                      {selectedLanguage || 'English'}
                    </span>
                  </div>
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* User Account Popover */}
              {showRoleMenu && (
                <div
                  id="user-account-popover"
                  className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2.5 space-y-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  {/* User Profile Header */}
                  <div className="px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-xs font-black text-slate-900 block truncate">
                          {currentUser.name}
                        </span>
                        <span className="text-[11px] text-slate-500 truncate block">
                          {currentUser.email}
                        </span>
                      </div>
                      <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                        {role === 'shopkeeper' ? 'Pharmacy' : role}
                      </span>
                    </div>
                  </div>

                  {/* Options under the name */}
                  <div className="space-y-1 pt-0.5">
                    {/* 1. Edit Profile Option */}
                    <button
                      type="button"
                      id="popover-edit-profile-btn"
                      onClick={() => {
                        setShowRoleMenu(false);
                        openEditProfile();
                      }}
                      className="w-full px-3 py-2 text-slate-700 hover:text-teal-700 hover:bg-teal-50 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition">
                          <Edit3 className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-left">
                          <span className="block leading-none">Edit Profile</span>
                          <span className="text-[10px] text-slate-400 font-normal">Update personal &amp; credentials</span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 transition" />
                    </button>

                    {/* 2. Language Selected Option with quick picker */}
                    <div className="relative">
                      <button
                        type="button"
                        id="popover-language-selector-btn"
                        onClick={() => setShowLanguagePicker(!showLanguagePicker)}
                        className="w-full px-3 py-2 text-slate-700 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
                            <Languages className="w-3.5 h-3.5" />
                          </div>
                          <div className="text-left">
                            <span className="block leading-none">Language Selected</span>
                            <span className="text-[10px] text-indigo-600 font-medium">
                              {selectedLanguage || 'English'}
                            </span>
                          </div>
                        </div>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                            showLanguagePicker ? 'rotate-180 text-indigo-600' : ''
                          }`}
                        />
                      </button>

                      {showLanguagePicker && (
                        <div className="mt-1 p-1 bg-slate-50 rounded-xl border border-slate-200 max-h-44 overflow-y-auto space-y-0.5">
                          {AVAILABLE_LANGUAGES.map((lang) => (
                            <button
                              key={lang.code}
                              type="button"
                              onClick={() => {
                                setSelectedLanguage(lang.name);
                                setShowLanguagePicker(false);
                              }}
                              className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer transition ${
                                selectedLanguage === lang.name
                                  ? 'bg-indigo-600 text-white shadow-xs'
                                  : 'text-slate-700 hover:bg-white hover:text-indigo-600'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <span className="text-[10px] opacity-75 font-mono">{lang.native}</span>
                                <span>{lang.name}</span>
                              </span>
                              {selectedLanguage === lang.name && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sign Out */}
                  <div className="pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setShowRoleMenu(false);
                        logout();
                      }}
                      className="w-full px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
