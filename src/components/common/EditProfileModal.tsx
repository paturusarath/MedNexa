import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Check,
  User,
  Mail,
  Phone,
  Globe,
  Languages,
  Stethoscope,
  Pill,
  Shield,
  Building2,
  Clock,
  MapPin,
  Sparkles,
  Camera,
  RefreshCw,
  Pin,
  CheckCircle2,
  Layers,
  Activity,
  ChevronDown,
  Upload,
  Pencil,
  Eye,
  Trash2,
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { UserRole } from '../../types';

export interface CountryOption {
  code: string;
  dialCode: string;
  name: string;
  flag: string;
}

export const CountryFlag: React.FC<{ code: string; className?: string }> = ({
  code,
  className = 'w-4.5 h-3',
}) => {
  switch (code) {
    case 'IN': // India (Saffron, White, Green with Ashoka Chakra)
      return (
        <svg className={`${className} rounded-[2px] overflow-hidden shrink-0 shadow-2xs border border-black/15`} viewBox="0 0 640 480">
          <path fill="#FF9933" d="M0 0h640v160H0z" />
          <path fill="#FFFFFF" d="M0 160h640v160H0z" />
          <path fill="#138808" d="M0 320h640v160H0z" />
          <circle cx="320" cy="240" r="56" fill="none" stroke="#000080" strokeWidth="7" />
          <circle cx="320" cy="240" r="16" fill="#000080" />
        </svg>
      );
    case 'US': // USA
      return (
        <svg className={`${className} rounded-[2px] overflow-hidden shrink-0 shadow-2xs border border-black/15`} viewBox="0 0 640 480">
          <path fill="#bd3d44" d="M0 0h640v480H0z" />
          <path stroke="#fff" strokeWidth="37" d="M0 55h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640" />
          <path fill="#192f5d" d="M0 0h260v260H0z" />
        </svg>
      );
    case 'GB': // UK
      return (
        <svg className={`${className} rounded-[2px] overflow-hidden shrink-0 shadow-2xs border border-black/15`} viewBox="0 0 640 480">
          <path fill="#012169" d="M0 0h640v480H0z" />
          <path stroke="#fff" strokeWidth="60" d="m0 0 640 480M640 0 0 480" />
          <path stroke="#c8102e" strokeWidth="40" d="m0 0 640 480M640 0 0 480" />
          <path stroke="#fff" strokeWidth="100" d="M320 0v480M0 240h640" />
          <path stroke="#c8102e" strokeWidth="60" d="M320 0v480M0 240h640" />
        </svg>
      );
    case 'AE': // UAE
      return (
        <svg className={`${className} rounded-[2px] overflow-hidden shrink-0 shadow-2xs border border-black/15`} viewBox="0 0 640 480">
          <path fill="#00732f" d="M0 0h640v160H0z" />
          <path fill="#fff" d="M0 160h640v160H0z" />
          <path fill="#000" d="M0 320h640v160H0z" />
          <path fill="#f00" d="M0 0h160v480H0z" />
        </svg>
      );
    case 'SG': // Singapore
      return (
        <svg className={`${className} rounded-[2px] overflow-hidden shrink-0 shadow-2xs border border-black/15`} viewBox="0 0 640 480">
          <path fill="#ed2939" d="M0 0h640v240H0z" />
          <path fill="#fff" d="M0 240h640v240H0z" />
          <circle cx="160" cy="120" r="70" fill="#fff" />
          <circle cx="180" cy="120" r="65" fill="#ed2939" />
        </svg>
      );
    case 'CA': // Canada
      return (
        <svg className={`${className} rounded-[2px] overflow-hidden shrink-0 shadow-2xs border border-black/15`} viewBox="0 0 640 480">
          <path fill="#ff0000" d="M0 0h160v480H0zm480 0h160v480H480z" />
          <path fill="#ffffff" d="M160 0h320v480H160z" />
          <circle cx="320" cy="240" r="60" fill="#ff0000" />
        </svg>
      );
    case 'AU': // Australia
      return (
        <svg className={`${className} rounded-[2px] overflow-hidden shrink-0 shadow-2xs border border-black/15`} viewBox="0 0 640 480">
          <path fill="#00008b" d="M0 0h640v480H0z" />
          <path fill="#fff" d="m0 0 320 240m0-240L0 240" stroke="#fff" strokeWidth="20" />
          <path stroke="#ff0000" strokeWidth="12" d="m0 0 320 240m0-240L0 240" />
          <path fill="#fff" stroke="#fff" strokeWidth="30" d="M160 0v240M0 120h320" />
          <path stroke="#ff0000" strokeWidth="18" d="M160 0v240M0 120h320" />
        </svg>
      );
    case 'DE': // Germany
      return (
        <svg className={`${className} rounded-[2px] overflow-hidden shrink-0 shadow-2xs border border-black/15`} viewBox="0 0 640 480">
          <path fill="#000" d="M0 0h640v160H0z" />
          <path fill="#dd0000" d="M0 160h640v160H0z" />
          <path fill="#ffce00" d="M0 320h640v160H0z" />
        </svg>
      );
    case 'SA': // Saudi Arabia
      return (
        <svg className={`${className} rounded-[2px] overflow-hidden shrink-0 shadow-2xs border border-black/15`} viewBox="0 0 640 480">
          <path fill="#006c35" d="M0 0h640v480H0z" />
          <rect x="180" y="270" width="280" height="20" fill="#fff" rx="4" />
        </svg>
      );
    case 'FR': // France
      return (
        <svg className={`${className} rounded-[2px] overflow-hidden shrink-0 shadow-2xs border border-black/15`} viewBox="0 0 640 480">
          <path fill="#0055a4" d="M0 0h213v480H0z" />
          <path fill="#fff" d="M213 0h214v480H213z" />
          <path fill="#ef4135" d="M427 0h213v480H427z" />
        </svg>
      );
    case 'JP': // Japan
      return (
        <svg className={`${className} rounded-[2px] overflow-hidden shrink-0 shadow-2xs border border-black/15`} viewBox="0 0 640 480">
          <path fill="#fff" d="M0 0h640v480H0z" />
          <circle cx="320" cy="240" r="130" fill="#bc002d" />
        </svg>
      );
    case 'BD': // Bangladesh
      return (
        <svg className={`${className} rounded-[2px] overflow-hidden shrink-0 shadow-2xs border border-black/15`} viewBox="0 0 640 480">
          <path fill="#006a4e" d="M0 0h640v480H0z" />
          <circle cx="280" cy="240" r="140" fill="#f42a41" />
        </svg>
      );
    case 'NP': // Nepal
      return (
        <svg className={`${className} rounded-[2px] overflow-hidden shrink-0 shadow-2xs border border-black/15`} viewBox="0 0 640 480">
          <path fill="#dc143c" d="M120 40 440 240H120zM120 200 440 440H120z" />
        </svg>
      );
    case 'LK': // Sri Lanka
      return (
        <svg className={`${className} rounded-[2px] overflow-hidden shrink-0 shadow-2xs border border-black/15`} viewBox="0 0 640 480">
          <path fill="#ffbe29" d="M0 0h640v480H0z" />
          <path fill="#00534e" d="M60 40h70v400H60z" />
          <path fill="#eb7c21" d="M130 40h70v400h-70z" />
          <path fill="#8d153a" d="M220 40h360v400H220z" />
        </svg>
      );
    case 'MY': // Malaysia
      return (
        <svg className={`${className} rounded-[2px] overflow-hidden shrink-0 shadow-2xs border border-black/15`} viewBox="0 0 640 480">
          <path fill="#cc0000" d="M0 0h640v480H0z" />
          <path stroke="#fff" strokeWidth="34" d="M0 34h640M0 102h640M0 170h640M0 238h640M0 306h640M0 374h640M0 442h640" />
          <path fill="#000066" d="M0 0h320v272H0z" />
          <circle cx="140" cy="136" r="65" fill="#ffcc00" />
          <circle cx="160" cy="136" r="58" fill="#000066" />
        </svg>
      );
    default:
      return <span className="text-xs font-bold leading-none">{code}</span>;
  }
};

export const UserAvatarSilhouette: React.FC<{ className?: string }> = ({
  className = 'w-full h-full text-slate-900',
}) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
    {/* Circular Head */}
    <circle cx="50" cy="35" r="21" />
    {/* Torso & curved shoulders */}
    <path d="M 16 88 C 16 63, 30 55, 50 55 C 70 55, 84 63, 84 88 C 84 90, 82 91, 79 91 L 21 91 C 18 91, 16 90, 16 88 Z" />
  </svg>
);

export const COUNTRY_OPTIONS: CountryOption[] = [
  { code: 'IN', dialCode: '+91', name: 'India', flag: '🇮🇳' },
  { code: 'US', dialCode: '+1', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', dialCode: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'AE', dialCode: '+971', name: 'UAE', flag: '🇦🇪' },
  { code: 'SG', dialCode: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: 'CA', dialCode: '+1', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', dialCode: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', dialCode: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: 'SA', dialCode: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'FR', dialCode: '+33', name: 'France', flag: '🇫🇷' },
  { code: 'JP', dialCode: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: 'BD', dialCode: '+880', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'NP', dialCode: '+977', name: 'Nepal', flag: '🇳🇵' },
  { code: 'LK', dialCode: '+94', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'MY', dialCode: '+60', name: 'Malaysia', flag: '🇲🇾' },
];

const parsePhone = (raw: string): { country: CountryOption; number: string } => {
  if (!raw) return { country: COUNTRY_OPTIONS[0], number: '' };
  const trimmed = raw.trim();
  for (const c of COUNTRY_OPTIONS) {
    if (trimmed.startsWith(c.dialCode)) {
      return {
        country: c,
        number: trimmed.slice(c.dialCode.length).trim(),
      };
    }
  }
  return { country: COUNTRY_OPTIONS[0], number: trimmed };
};

export const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
];

const PRESET_AVATARS: Record<UserRole, string[]> = {
  patient: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  ],
  doctor: [
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1594824813590-7856c3044996?w=150&auto=format&fit=crop&q=80',
  ],
  shopkeeper: [
    'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=150&auto=format&fit=crop&q=80',
  ],
  admin: [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  ],
};

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, role, updateUserProfile, selectedLanguage, setSelectedLanguage } = useHealth();

  const initialPhone = parsePhone(currentUser.phone || '');
  const [name, setName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [phoneCountry, setPhoneCountry] = useState<CountryOption>(initialPhone.country);
  // Numbers removed from typing input initially, placeholder shows "Mobile Number"
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [avatar, setAvatar] = useState(currentUser.avatar || '');
  const [activeLang, setActiveLang] = useState(currentUser.selectedLanguage || selectedLanguage || 'English');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const photoMenuRef = useRef<HTMLDivElement>(null);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isPhotoMenuOpen, setIsPhotoMenuOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryOpen(false);
      }
      if (photoMenuRef.current && !photoMenuRef.current.contains(event.target as Node)) {
        setIsPhotoMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Role-specific fields
  const [age, setAge] = useState<number | string>(currentUser.age ?? 34);
  const [gender, setGender] = useState(currentUser.gender || 'Female');
  const [bloodGroup, setBloodGroup] = useState(currentUser.bloodGroup || 'O+');

  const [specialization, setSpecialization] = useState(currentUser.specialization || 'Cardiologist');
  const [hospital, setHospital] = useState(currentUser.hospital || 'Pulse Health Medical Center');
  const [licenseNumber, setLicenseNumber] = useState(currentUser.licenseNumber || 'MD-CAL-892410');
  const [experienceYears, setExperienceYears] = useState<number | string>(currentUser.experienceYears ?? 12);
  const [fee, setFee] = useState<number | string>(currentUser.fee ?? 800);

  const [storeName, setStoreName] = useState(currentUser.storeName || 'PulseMed Chemist & Druggist');
  const [gstin, setGstin] = useState(currentUser.gstin || '29AABCU9603R1ZM');
  const [address, setAddress] = useState(currentUser.address || '74 Brigade Road, Bangalore, KA 560025');
  const [operatingHours, setOperatingHours] = useState(currentUser.operatingHours || '08:00 AM - 11:00 PM Daily');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const formattedPhone = phoneNumber.trim()
      ? `${phoneCountry.dialCode} ${phoneNumber.trim()}`
      : (currentUser.phone || `${phoneCountry.dialCode} 9845012345`);

    const updates: Record<string, any> = {
      name: name.trim() || currentUser.name,
      email: email.trim() || currentUser.email,
      phone: formattedPhone,
      avatar: avatar || currentUser.avatar,
      selectedLanguage: activeLang,
    };

    if (role === 'patient') {
      updates.age = typeof age === 'number' ? age : parseInt(age as string, 10) || 34;
      updates.gender = gender;
      updates.bloodGroup = bloodGroup;
    } else if (role === 'doctor') {
      updates.specialization = specialization;
      updates.hospital = hospital;
      updates.licenseNumber = licenseNumber;
      updates.experienceYears = typeof experienceYears === 'number' ? experienceYears : parseInt(experienceYears as string, 10) || 10;
      updates.fee = typeof fee === 'number' ? fee : parseInt(fee as string, 10) || 800;
    } else if (role === 'shopkeeper') {
      updates.storeName = storeName;
      updates.gstin = gstin;
      updates.address = address;
      updates.operatingHours = operatingHours;
    }

    updateUserProfile(updates);
    setSelectedLanguage(activeLang);

    setTimeout(() => {
      setIsProcessing(false);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 700);
    }, 350);
  };

  const roleTheme = {
    patient: {
      accent: 'teal',
      badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
      btnBg: 'bg-teal-600 hover:bg-teal-700 text-white',
      title: 'Patient Account',
      icon: <User className="w-4 h-4 text-teal-600" />,
    },
    doctor: {
      accent: 'blue',
      badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
      btnBg: 'bg-blue-600 hover:bg-blue-700 text-white',
      title: 'Doctor Console',
      icon: <Stethoscope className="w-4 h-4 text-blue-600" />,
    },
    shopkeeper: {
      accent: 'amber',
      badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
      btnBg: 'bg-amber-600 hover:bg-amber-700 text-white',
      title: 'Pharmacy Dispensing',
      icon: <Pill className="w-4 h-4 text-amber-600" />,
    },
    admin: {
      accent: 'purple',
      badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
      btnBg: 'bg-purple-600 hover:bg-purple-700 text-white',
      title: 'Admin Desk',
      icon: <Shield className="w-4 h-4 text-purple-600" />,
    },
  }[role] || {
    accent: 'teal',
    badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
    btnBg: 'bg-teal-600 hover:bg-teal-700 text-white',
    title: 'Account Settings',
    icon: <User className="w-4 h-4 text-teal-600" />,
  };

  const modalContent = (
    <div
      id="edit-profile-modal-portal"
      className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto"
      style={{ pointerEvents: 'auto' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.18 }}
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200/90 flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden my-auto relative z-10"
      >
        {/* Hidden File Input for uploading photo from system */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Sticky Header with Customer Avatar & Name */}
        <div className="shrink-0 px-4 py-3 sm:px-6 sm:py-3.5 border-b border-slate-100 flex items-center justify-between gap-3 bg-white z-10">
          <div className="flex items-center gap-3.5">
            {/* Left side of the name: User Logo with increased size & Pencil edit button with action menu */}
            <div className="relative shrink-0" ref={photoMenuRef}>
              <div
                onClick={() => {
                  if (avatar) {
                    setIsPreviewModalOpen(true);
                  } else {
                    fileInputRef.current?.click();
                  }
                }}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-50 border-2 border-slate-200 overflow-hidden flex items-center justify-center cursor-pointer shadow-xs hover:border-teal-500 transition relative group"
                title={avatar ? "Click to view profile photo" : "Click to upload profile photo"}
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt={name}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full p-2.5 flex items-center justify-center text-slate-900">
                    <UserAvatarSilhouette className="w-full h-full" />
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-slate-900/35 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                  {avatar ? <Eye className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                </div>
              </div>

              {/* Corner Pencil Icon Button: click opens menu with Remove Photo, See Profile Photo, and Upload New Photo */}
              <button
                type="button"
                id="profile-pencil-options-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPhotoMenuOpen((prev) => !prev);
                }}
                className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full text-white shadow-md border-2 border-white flex items-center justify-center transition hover:scale-110 cursor-pointer z-20 ${
                  isPhotoMenuOpen ? 'bg-teal-700 ring-2 ring-teal-400' : 'bg-teal-600 hover:bg-teal-700'
                }`}
                title="Profile photo options"
              >
                <Pencil className="w-3.5 h-3.5 text-white" />
              </button>

              {/* Dropdown Menu when Pencil is clicked */}
              <AnimatePresence>
                {isPhotoMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 w-52 sm:w-56 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-1.5 z-50 text-xs overflow-hidden"
                  >
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Profile Photo
                    </div>

                    {/* 1. See Profile Photo */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsPhotoMenuOpen(false);
                        setIsPreviewModalOpen(true);
                      }}
                      className="w-full px-3.5 py-2.5 text-left font-semibold text-slate-700 hover:text-teal-700 hover:bg-teal-50 flex items-center gap-2.5 transition cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                        <Eye className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">See Profile Photo</span>
                    </button>

                    {/* 2. Upload New Photo */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsPhotoMenuOpen(false);
                        fileInputRef.current?.click();
                      }}
                      className="w-full px-3.5 py-2.5 text-left font-semibold text-slate-700 hover:text-teal-700 hover:bg-teal-50 flex items-center gap-2.5 transition cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">Upload New Photo</span>
                    </button>

                    {/* 3. Remove Photo */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsPhotoMenuOpen(false);
                        setAvatar('');
                      }}
                      disabled={!avatar}
                      className={`w-full px-3.5 py-2.5 text-left font-semibold flex items-center gap-2.5 transition ${
                        avatar
                          ? 'text-rose-600 hover:bg-rose-50 cursor-pointer'
                          : 'text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        avatar ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-300'
                      }`}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">Remove Photo</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Name and Account Badge */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {name.trim() || currentUser.name || 'User Profile'}
                </h2>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${roleTheme.badgeBg}`}>
                  {roleTheme.title}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form id="edit-profile-form" onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">

          {/* Section 1: Personal Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-teal-600" />
              <span>General Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rajesh.chemist@pulsehealth.org"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  {/* Small compact country code box with clear country flags */}
                  <div className="relative shrink-0" ref={countryDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsCountryOpen(!isCountryOpen)}
                      className="w-24 h-10 px-2 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-1 shadow-2xs hover:border-teal-500 focus:outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition cursor-pointer"
                      title={`${phoneCountry.name} (${phoneCountry.dialCode})`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <CountryFlag code={phoneCountry.code} className="w-5 h-3.5" />
                        <span className="text-xs font-bold text-slate-800">{phoneCountry.dialCode}</span>
                      </div>
                      <ChevronDown className={`w-3 h-3 text-slate-400 shrink-0 transition-transform ${isCountryOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isCountryOpen && (
                      <div className="absolute left-0 top-full mt-1 w-56 max-h-56 overflow-y-auto bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-1 divide-y divide-slate-100">
                        {COUNTRY_OPTIONS.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              setPhoneCountry(c);
                              setIsCountryOpen(false);
                            }}
                            className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-left rounded-lg text-xs transition cursor-pointer ${
                              phoneCountry.code === c.code ? 'bg-teal-50 text-teal-900 font-bold' : 'hover:bg-slate-50 text-slate-700 font-medium'
                            }`}
                          >
                            <CountryFlag code={c.code} className="w-5 h-3.5" />
                            <span className="truncate flex-1">{c.name}</span>
                            <span className="text-slate-500 font-mono text-[11px] shrink-0">{c.dialCode}</span>
                            {phoneCountry.code === c.code && <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mobile number input: numbers removed, placeholder="Mobile Number" */}
                  <div className="relative flex-1">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Mobile Number"
                      className="w-full h-10 pl-9 pr-3 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition shadow-2xs font-medium text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Language Selected (Prominent Indian and International languages) */}
          <div className="space-y-3 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-indigo-600" />
                <span>Language Selected</span>
              </h3>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-md">
                Active: {activeLang}
              </span>
            </div>

            <p className="text-xs text-slate-600">
              Select your preferred language for consultation alerts, medicine labels, prescription summaries, and portal interfaces.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1">
              {AVAILABLE_LANGUAGES.map((lang) => {
                const isSelected = activeLang === lang.name;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setActiveLang(lang.name);
                      setSelectedLanguage(lang.name);
                    }}
                    className={`p-2 rounded-xl text-left transition border cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm ring-2 ring-indigo-200'
                        : 'bg-white hover:bg-indigo-50/60 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate">{lang.name}</span>
                      {isSelected && <Check className="w-3 h-3 text-white shrink-0" />}
                    </div>
                    <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-400 font-mono'}`}>
                      {lang.native}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Role-Specific Credentials */}
          {role === 'patient' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Patient Health Attributes</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition"
                  >
                    <option value="A+">A+ Positive</option>
                    <option value="A-">A- Negative</option>
                    <option value="B+">B+ Positive</option>
                    <option value="B-">B- Negative</option>
                    <option value="O+">O+ Positive</option>
                    <option value="O-">O- Negative</option>
                    <option value="AB+">AB+ Positive</option>
                    <option value="AB-">AB- Negative</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {role === 'doctor' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                <span>Doctor Professional Credentials</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Specialization
                  </label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g. Senior Cardiologist & Internal Medicine"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Medical Council License No.
                  </label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="e.g. MCI-2015-89410"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hospital / Clinic Affiliation
                  </label>
                  <input
                    type="text"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    placeholder="e.g. Apollo Heart & Vascular Institute"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Consultation Fee (₹ INR)
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="10000"
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
              </div>
            </div>
          )}

          {role === 'shopkeeper' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-amber-600" />
                <span>Pharmacy &amp; Drug License Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pharmacy Store Name
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. PulseMed Chemist & Druggist"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    GSTIN / Drug License ID
                  </label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    placeholder="e.g. 29AABCU9603R1ZM"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    value={operatingHours}
                    onChange={(e) => setOperatingHours(e.target.value)}
                    placeholder="e.g. 08:00 AM - 11:00 PM Daily"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Physical Dispensing Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 74 Brigade Road, Bangalore, KA 560025"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition"
                  />
                </div>
              </div>
            </div>
          )}

          {role === 'admin' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-purple-600" />
                <span>Admin Authority Credentials</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    defaultValue="Lead Compliance & Operations Officer"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Security Clearance
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Level 4 - HIPAA / CDSCO Full Access"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-100 text-slate-600"
                  />
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Sticky Footer */}
        <div className="shrink-0 px-4 py-3 sm:px-6 sm:py-3.5 border-t border-slate-100 bg-slate-50/95 flex items-center justify-between gap-3 z-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Language Selected: <strong className="text-slate-800">{activeLang}</strong>
            </span>
            {savedSuccess && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <Check className="w-3.5 h-3.5" />
                Saved Successfully!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-profile-form"
              disabled={isProcessing}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-60 ${roleTheme.btnBg}`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Profile Changes...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Profile Photo Lightbox Preview Modal */}
      <AnimatePresence>
        {isPreviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPreviewModalOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative z-10 border border-slate-200"
            >
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Profile Photo</h3>
                    <p className="text-[11px] text-slate-500">{name.trim() || currentUser.name}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 bg-slate-50 flex items-center justify-center">
                <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-white flex items-center justify-center">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full p-8 flex items-center justify-center text-slate-900 bg-slate-100">
                      <UserAvatarSilhouette className="w-full h-full" />
                    </div>
                  )}
                </div>
              </div>

              <div className="px-5 py-3.5 bg-white border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPreviewModalOpen(false);
                    setAvatar('');
                  }}
                  disabled={!avatar}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Photo</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPreviewModalOpen(false);
                      fileInputRef.current?.click();
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPreviewModalOpen(false)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
};
