import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HeartPulse,
  Phone,
  Mail,
  User,
  Shield,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Lock,
  Calendar,
  Droplet,
  Activity,
  Check,
  Stethoscope,
  Package,
  Pill,
  ShoppingBag,
  Building2,
  Award,
  Radio,
  Headphones,
  Watch,
  Thermometer,
  Clock,
  Cpu,
  Users,
  AlertTriangle,
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { UserRole } from '../types';

interface CountryCode {
  code: string;
  dialCode: string;
  name: string;
  flag: string;
}

const COUNTRY_CODES: CountryCode[] = [
  { code: 'IN', dialCode: '+91', name: 'India', flag: '🇮🇳' },
  { code: 'US', dialCode: '+1', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', dialCode: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', dialCode: '+1', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', dialCode: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: 'AE', dialCode: '+971', name: 'UAE', flag: '🇦🇪' },
  { code: 'DE', dialCode: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: 'SG', dialCode: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: 'SA', dialCode: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'FR', dialCode: '+33', name: 'France', flag: '🇫🇷' },
  { code: 'JP', dialCode: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: 'BD', dialCode: '+880', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'NP', dialCode: '+977', name: 'Nepal', flag: '🇳🇵' },
  { code: 'LK', dialCode: '+94', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'MY', dialCode: '+60', name: 'Malaysia', flag: '🇲🇾' },
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];

const COMMON_ALLERGIES = [
  'No Known Allergies (NKDA)',
  'Penicillin',
  'Sulfa Drugs',
  'Aspirin / NSAIDs',
  'Latex',
  'Peanuts / Nuts',
  'Contrast Dye',
];

// Reusable MedNexa Logo (Connected Medical Nexus & Cardiogram Wave mark)
export const MedNexaLogo: React.FC<{ size?: 'sm' | 'md' | 'lg'; iconOnly?: boolean }> = ({
  size = 'md',
  iconOnly = false,
}) => {
  const iconDimensions =
    size === 'sm' ? 'w-4.5 h-4.5' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6';
  const boxDimensions =
    size === 'sm' ? 'w-8.5 h-8.5' : size === 'lg' ? 'w-14 h-14' : 'w-11 h-11';
  const titleSize =
    size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-2xl';
  const tagSize =
    size === 'sm' ? 'text-[8px]' : size === 'lg' ? 'text-[11px]' : 'text-[9px]';

  return (
    <div className="flex items-center gap-3 select-none">
      <div
        className={`${boxDimensions} rounded-2xl bg-gradient-to-tr from-teal-400 via-cyan-500 to-indigo-600 p-[2px] shadow-lg shadow-teal-500/20 flex items-center justify-center shrink-0 relative group transition-transform duration-300 hover:scale-105`}
      >
        <div className="w-full h-full bg-[#07111e] rounded-[14px] flex items-center justify-center relative overflow-hidden">
          {/* Subtle nexus grid glow in emblem background */}
          <div className="absolute inset-0 bg-radial from-teal-500/15 via-transparent to-transparent pointer-events-none" />
          <svg
            className={`${iconDimensions} relative z-10`}
            viewBox="0 0 24 24"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <defs>
              <linearGradient id="mednexa-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="45%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
            {/* MedNexa Interconnected Cross & Nexus Ring */}
            <path
              d="M12 3v3m0 12v3M3 12h3m12 0h3"
              stroke="url(#mednexa-logo-grad)"
              strokeWidth="2"
              strokeOpacity="0.6"
            />
            {/* Nexus Connected Nodes */}
            <circle cx="12" cy="4" r="1.2" fill="#06b6d4" />
            <circle cx="12" cy="20" r="1.2" fill="#14b8a6" />
            <circle cx="4" cy="12" r="1.2" fill="#2dd4bf" />
            <circle cx="20" cy="12" r="1.2" fill="#6366f1" />
            {/* Center Nexus Ring */}
            <circle
              cx="12"
              cy="12"
              r="6.5"
              stroke="url(#mednexa-logo-grad)"
              strokeWidth="1.8"
              strokeDasharray="28 4"
            />
            {/* Vital Pulse Line fusing through the nexus */}
            <path
              d="M6 12h2.2l1.6-3 2.2 6 1.8-4 1.4 2h2.8"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      {!iconOnly && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1 leading-none">
            <span className={`font-black text-slate-900 tracking-tight ${titleSize}`}>
              Med<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600">Nexa</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse mt-0.5 ml-0.5" />
          </div>
          <span className={`tracking-[0.22em] font-semibold text-teal-700 uppercase mt-1 ${tagSize}`}>
            CONNECTED HEALTH • CLINICAL NEXUS
          </span>
        </div>
      )}
    </div>
  );
};

// Backward-compatibility export
export const HealaraLogo = MedNexaLogo;

export const PhoneLogin: React.FC = () => {
  const { loginWithPhone, loginWithEmail, loginWithGoogle, createAccount, isFirebaseConnected } = useHealth();

  // STEP 1 vs STEP 2
  // When selectedRole is null: STEP 1 (Landing screen with Choose Your Role)
  // When selectedRole is 'patient' | 'doctor' | 'pharmacy': STEP 2 (Role Login Screen)
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor' | 'pharmacy' | null>(null);

  // Mode in Step 2: 'signin' vs 'signup'
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Phone Login State (Sign In)
  const [phoneStep, setPhoneStep] = useState<'phone' | 'otp'>('phone');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRY_CODES[0]); // Default India +91
  const [phoneNumber, setPhoneNumber] = useState('9845012345');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const DEMO_OTP = '123456';

  // Patient Registration Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhoneCountry, setNewPhoneCountry] = useState<CountryCode>(COUNTRY_CODES[0]);
  const [newPhone, setNewPhone] = useState('');
  const [dob, setDob] = useState('1994-05-18');
  const [calculatedAge, setCalculatedAge] = useState<number>(30);
  const [gender, setGender] = useState('Female');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(['No Known Allergies (NKDA)']);
  const [customAllergy, setCustomAllergy] = useState('');
  const [hipaaConsent, setHipaaConsent] = useState(true);

  // Doctor Registration Form State
  const [doctorLicense, setDoctorLicense] = useState('NMC-2018-84729');
  const [doctorSpecialization, setDoctorSpecialization] = useState('Cardiology & Internal Medicine');
  const [doctorHospital, setDoctorHospital] = useState('Fortis Hospital & MedNexa Telehealth Suite');
  const [doctorExperience, setDoctorExperience] = useState<number>(12);
  const [doctorFee, setDoctorFee] = useState<number>(800);
  const [doctorQualifications, setDoctorQualifications] = useState('MBBS, MD (Medicine), DNB');
  const [doctorAddress, setDoctorAddress] = useState('Indiranagar 100ft Road, Bengaluru - 560038');
  const [telemedConsent, setTelemedConsent] = useState(true);

  // Pharmacy / Chemist Registration Form State
  const [shopStoreName, setShopStoreName] = useState('PulseMed 24x7 Chemist & Druggists');
  const [shopPharmacistName, setShopPharmacistName] = useState('Rajesh Kumar');
  const [shopDrugLicense, setShopDrugLicense] = useState('KA-BLR-DL-2019-48201 (Form 20/21)');
  const [shopGstin, setShopGstin] = useState('29AABCP1330F1Z4');
  const [shopAddress, setShopAddress] = useState('Shop 12, Indiranagar 100ft Road, Bengaluru - 560038');
  const [shopOperatingHours, setShopOperatingHours] = useState('24 Hours / 7 Days Open');
  const [pharmacyConsent, setPharmacyConsent] = useState(true);

  // UI state
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<string>('');

  // Update calculated age when DOB changes
  useEffect(() => {
    if (dob) {
      const birth = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      if (!isNaN(age) && age >= 0 && age <= 130) {
        setCalculatedAge(age);
      }
    }
  }, [dob]);

  // Update default phone when role changes
  useEffect(() => {
    if (selectedRole === 'patient') {
      setPhoneNumber('9845012345');
      setSelectedCountry(COUNTRY_CODES[0]); // +91
    } else if (selectedRole === 'doctor') {
      setPhoneNumber('9845089012');
      setSelectedCountry(COUNTRY_CODES[0]);
    } else if (selectedRole === 'pharmacy') {
      setPhoneNumber('9845067890');
      setSelectedCountry(COUNTRY_CODES[0]);
    }
    setPhoneStep('phone');
    setErrorMessage('');
  }, [selectedRole]);

  // OTP Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (phoneStep === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [phoneStep, resendTimer]);

  const formatPhoneNumber = (val: string) => {
    return val.replace(/\D/g, '').slice(0, 15);
  };

  // Google Login via Firebase Authentication
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setLoadingType('google');
    setErrorMessage('');

    const targetUserRole: UserRole =
      selectedRole === 'doctor'
        ? 'doctor'
        : selectedRole === 'pharmacy'
        ? 'shopkeeper'
        : 'patient';

    try {
      await loginWithGoogle(targetUserRole);
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
    } finally {
      setIsLoading(false);
      setLoadingType('');
    }
  };

  // Phone Submit -> Proceed to OTP
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = phoneNumber.replace(/\D/g, '');
    if (cleanNum.length < 7) {
      setErrorMessage('Please enter a valid mobile phone number (at least 7 digits).');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);
    setLoadingType('phone');

    setTimeout(() => {
      setIsLoading(false);
      setLoadingType('');
      setPhoneStep('otp');
      setResendTimer(30);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
    }, 450);
  };

  // OTP handlers
  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setErrorMessage('');

    if (digit && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleFillDemoOtp = () => {
    setOtpDigits(DEMO_OTP.split(''));
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join('');
    if (code.length < 6) {
      setErrorMessage('Please enter the complete 6-digit code.');
      return;
    }

    setIsLoading(true);
    setLoadingType('otp');
    setTimeout(() => {
      const fullPhone = `${selectedCountry.dialCode} ${phoneNumber}`;
      const targetUserRole: UserRole =
        selectedRole === 'doctor'
          ? 'doctor'
          : selectedRole === 'pharmacy'
          ? 'shopkeeper'
          : 'patient';

      const defaultName =
        selectedRole === 'doctor'
          ? 'Dr. V. Mohan, MD'
          : selectedRole === 'pharmacy'
          ? 'Rajesh Kumar (PulseMed Chemist)'
          : 'Sarath Paturu';

      loginWithPhone(fullPhone, defaultName, targetUserRole);
      setIsLoading(false);
      setLoadingType('');
    }, 450);
  };

  // Allergy toggle
  const toggleAllergy = (allergy: string) => {
    if (allergy === 'No Known Allergies (NKDA)') {
      setSelectedAllergies(['No Known Allergies (NKDA)']);
      return;
    }

    let updated = selectedAllergies.filter((a) => a !== 'No Known Allergies (NKDA)');
    if (updated.includes(allergy)) {
      updated = updated.filter((a) => a !== allergy);
      if (updated.length === 0) {
        updated = ['No Known Allergies (NKDA)'];
      }
    } else {
      updated.push(allergy);
    }
    setSelectedAllergies(updated);
  };

  const handleAddCustomAllergy = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!customAllergy.trim()) return;
    const item = customAllergy.trim();
    if (!selectedAllergies.includes(item)) {
      const updated = selectedAllergies
        .filter((a) => a !== 'No Known Allergies (NKDA)')
        .concat(item);
      setSelectedAllergies(updated);
    }
    setCustomAllergy('');
  };

  // Create Account Submit
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedRole === 'doctor') {
      if (!newName.trim()) {
        setErrorMessage('Please enter Doctor legal full name.');
        return;
      }
      if (!newEmail.trim() || !newEmail.includes('@')) {
        setErrorMessage('Please enter an official medical email address.');
        return;
      }
      if (!newPhone.trim() || newPhone.replace(/\D/g, '').length < 7) {
        setErrorMessage('Please provide a valid contact mobile number.');
        return;
      }
      if (!doctorLicense.trim()) {
        setErrorMessage('Please provide your National Medical Commission (NMC) registration number.');
        return;
      }
      if (!telemedConsent) {
        setErrorMessage('Please agree to Telemedicine Practice Guidelines declaration.');
        return;
      }

      setErrorMessage('');
      setIsLoading(true);
      setLoadingType('create');

      setTimeout(() => {
        createAccount({
          name: newName.trim(),
          email: newEmail.trim(),
          phone: `${newPhoneCountry.dialCode} ${newPhone.trim()}`,
          role: 'doctor',
          licenseNumber: doctorLicense.trim(),
          specialization: doctorSpecialization.trim(),
          hospital: doctorHospital.trim(),
          experienceYears: doctorExperience,
          fee: doctorFee,
          qualifications: doctorQualifications.trim(),
          address: doctorAddress.trim(),
        });
        setIsLoading(false);
        setLoadingType('');
      }, 500);
      return;
    }

    if (selectedRole === 'pharmacy') {
      if (!shopStoreName.trim()) {
        setErrorMessage('Please enter Pharmacy / Chemist Store legal name.');
        return;
      }
      if (!shopPharmacistName.trim()) {
        setErrorMessage('Please enter Registered Pharmacist In-Charge name.');
        return;
      }
      if (!newEmail.trim() || !newEmail.includes('@')) {
        setErrorMessage('Please enter a valid store email address.');
        return;
      }
      if (!newPhone.trim() || newPhone.replace(/\D/g, '').length < 7) {
        setErrorMessage('Please provide a valid store phone number.');
        return;
      }
      if (!shopDrugLicense.trim()) {
        setErrorMessage('Please provide your Retail Drug License Number (Form 20/21).');
        return;
      }
      if (!shopGstin.trim()) {
        setErrorMessage('Please enter your 15-character GSTIN number.');
        return;
      }
      if (!pharmacyConsent) {
        setErrorMessage('Please agree to Pharmacy Council & Drugs and Cosmetics Act compliance.');
        return;
      }

      setErrorMessage('');
      setIsLoading(true);
      setLoadingType('create');

      setTimeout(() => {
        createAccount({
          name: shopPharmacistName.trim(),
          email: newEmail.trim(),
          phone: `${newPhoneCountry.dialCode} ${newPhone.trim()}`,
          role: 'shopkeeper',
          storeName: shopStoreName.trim(),
          licenseNumber: shopDrugLicense.trim(),
          gstin: shopGstin.trim(),
          address: shopAddress.trim(),
          operatingHours: shopOperatingHours.trim(),
        });
        setIsLoading(false);
        setLoadingType('');
      }, 500);
      return;
    }

    // Default: Patient registration
    if (!newName.trim()) {
      setErrorMessage('Please enter your full legal name.');
      return;
    }
    if (!newEmail.trim() || !newEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!newPhone.trim() || newPhone.replace(/\D/g, '').length < 7) {
      setErrorMessage('Please provide a valid mobile contact number.');
      return;
    }
    if (!hipaaConsent) {
      setErrorMessage('Please agree to HIPAA & ABHA Privacy Terms.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);
    setLoadingType('create');

    setTimeout(() => {
      createAccount({
        name: newName.trim(),
        email: newEmail.trim(),
        phone: `${newPhoneCountry.dialCode} ${newPhone.trim()}`,
        role: 'patient',
        age: calculatedAge,
        gender,
        bloodGroup,
        emergencyContactName: emergencyContactName.trim() || undefined,
        emergencyContactPhone: emergencyContactPhone.trim() || undefined,
        allergies: selectedAllergies,
      });
      setIsLoading(false);
      setLoadingType('');
    }, 500);
  };

  // =========================================================================
  // STEP 1: LANDING SCREEN (Shown first when selectedRole is null)
  // =========================================================================
  if (selectedRole === null) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900 overflow-x-hidden relative">
        {/* Soft geometric light mesh grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-80" />

        {/* Soft atmospheric radial gradients */}
        <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-teal-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 flex flex-wrap items-center justify-between gap-3">
          {/* MedNexa logo and name at top left */}
          <MedNexaLogo size="md" />

          {/* Quick 1-Click Launch buttons in header */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => loginWithEmail('paturusarath@gmail.com', undefined, 'patient', 'Sarath Paturu')}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-600 to-teal-700 hover:from-teal-600 text-white text-xs font-bold shadow-md shadow-teal-500/20 transition cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <User className="w-3.5 h-3.5" />
              <span>Launch Patient App</span>
            </button>
            <button
              type="button"
              onClick={() => loginWithEmail('dr.vmohan@pulsehealth.org', undefined, 'doctor', 'Dr. V. Mohan, MD')}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer hidden sm:flex items-center gap-1.5 active:scale-95"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctor Portal</span>
            </button>
            <button
              type="button"
              onClick={() => loginWithEmail('rajesh.chemist@pulsehealth.org', undefined, 'shopkeeper', 'Rajesh Kumar (PulseMed)')}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition cursor-pointer hidden md:flex items-center gap-1.5 active:scale-95"
            >
              <Pill className="w-3.5 h-3.5" />
              <span>Pharmacy</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col justify-center my-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Headlines & 4 Feature Badges */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>Next-Gen Unified Clinical Platform</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Firebase Database Connected</span>
                  </div>
                </div>
                <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                  Your Health.
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600">
                    Connected Everywhere.
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-normal mt-2.5 leading-relaxed max-w-lg">
                  MedNexa brings patients, doctors and pharmacies together for a healthier, smarter and more connected tomorrow.
                </p>
              </div>

              {/* Instant 1-Click Launch Bar */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 block mb-2">
                  ⚡ 1-Click Instant App Access:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => loginWithEmail('paturusarath@gmail.com', undefined, 'patient', 'Sarath Paturu')}
                    className="flex-1 min-w-[120px] px-2.5 py-1.5 rounded-xl bg-white hover:bg-teal-50/80 border border-teal-200 text-teal-800 text-xs font-bold text-center transition cursor-pointer shadow-2xs"
                  >
                    🧑 Patient (Sarath)
                  </button>
                  <button
                    type="button"
                    onClick={() => loginWithEmail('dr.vmohan@pulsehealth.org', undefined, 'doctor', 'Dr. V. Mohan, MD')}
                    className="flex-1 min-w-[120px] px-2.5 py-1.5 rounded-xl bg-white hover:bg-blue-50/80 border border-blue-200 text-blue-800 text-xs font-bold text-center transition cursor-pointer shadow-2xs"
                  >
                    🩺 Doctor (Dr. V. Mohan)
                  </button>
                  <button
                    type="button"
                    onClick={() => loginWithEmail('rajesh.chemist@pulsehealth.org', undefined, 'shopkeeper', 'Rajesh Kumar (PulseMed)')}
                    className="flex-1 min-w-[120px] px-2.5 py-1.5 rounded-xl bg-white hover:bg-amber-50/80 border border-amber-200 text-amber-800 text-xs font-bold text-center transition cursor-pointer shadow-2xs"
                  >
                    💊 Pharmacy (Rajesh)
                  </button>
                </div>
              </div>

              {/* Four feature icons: Real-time Health Insights, Secure & Private, Connected Care, 24/7 Support */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-teal-300 transition">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shrink-0">
                    <Radio className="w-4 h-4 animate-pulse" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 leading-tight">
                    Real-time Health Insights
                  </span>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-cyan-300 transition">
                  <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 leading-tight">
                    Secure &amp; Private
                  </span>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-teal-300 transition">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shrink-0">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 leading-tight">
                    Connected Care
                  </span>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-cyan-300 transition">
                  <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 shrink-0">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 leading-tight">
                    24/7 Support
                  </span>
                </div>
              </div>
            </div>

            {/* Right: The "Choose Your Role" card with three clickable role cards */}
            <div className="lg:col-span-5">
              <div className="p-6 sm:p-7 rounded-3xl bg-white/95 backdrop-blur-xl border border-teal-100/90 shadow-2xl shadow-indigo-950/10 relative overflow-hidden">
                <div className="text-center mb-4">
                  <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-[11px] font-bold border border-teal-200 mb-2 inline-block">
                    Unified Login Portal
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Choose Your Role
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Select a portal or enter with 1-click
                  </p>
                </div>

                {/* 3 Clickable Role Cards with Instant Enter */}
                <div className="space-y-3">
                  {/* 1. Patient (green/teal) */}
                  <div
                    id="choose-role-patient-btn"
                    className="group p-3.5 rounded-2xl bg-gradient-to-r from-teal-50/70 to-emerald-50/40 border border-teal-200/90 hover:border-teal-400 hover:shadow-md transition-all duration-200 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-100 border border-teal-300 flex items-center justify-center text-teal-700 shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition">
                            Patient Portal
                          </h3>
                          <p className="text-[11px] text-slate-600 leading-snug">
                            Track health, devices &amp; appointments
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-1 border-t border-teal-100">
                      <button
                        type="button"
                        onClick={() => loginWithEmail('paturusarath@gmail.com', undefined, 'patient', 'Sarath Paturu')}
                        className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-600 to-teal-700 hover:from-teal-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-teal-500/20 active:scale-95"
                      >
                        <span>Enter Patient App ⚡</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRole('patient');
                          setAuthMode('signin');
                          setPhoneStep('phone');
                        }}
                        className="py-2 px-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-[11px] font-bold transition cursor-pointer shadow-2xs"
                      >
                        Phone / OTP
                      </button>
                    </div>
                  </div>

                  {/* 2. Doctor (blue) */}
                  <div
                    id="choose-role-doctor-btn"
                    className="group p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/70 to-indigo-50/40 border border-blue-200/90 hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-700 shrink-0">
                          <Stethoscope className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition">
                            Doctor Portal
                          </h3>
                          <p className="text-[11px] text-slate-600 leading-snug">
                            Consultations, EHR &amp; clinical charts
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-1 border-t border-blue-100">
                      <button
                        type="button"
                        onClick={() => loginWithEmail('dr.vmohan@pulsehealth.org', undefined, 'doctor', 'Dr. V. Mohan, MD')}
                        className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-blue-500/20 active:scale-95"
                      >
                        <span>Enter Doctor Suite ⚡</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRole('doctor');
                          setAuthMode('signin');
                          setPhoneStep('phone');
                        }}
                        className="py-2 px-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-[11px] font-bold transition cursor-pointer shadow-2xs"
                      >
                        Phone / OTP
                      </button>
                    </div>
                  </div>

                  {/* 3. Pharmacy (orange) */}
                  <div
                    id="choose-role-pharmacy-btn"
                    className="group p-3.5 rounded-2xl bg-gradient-to-r from-amber-50/70 to-orange-50/40 border border-amber-200/90 hover:border-amber-400 hover:shadow-md transition-all duration-200 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
                          <Pill className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition">
                            Pharmacy Portal
                          </h3>
                          <p className="text-[11px] text-slate-600 leading-snug">
                            Inventory, dispense Rx &amp; track orders
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-1 border-t border-amber-100">
                      <button
                        type="button"
                        onClick={() => loginWithEmail('rajesh.chemist@pulsehealth.org', undefined, 'shopkeeper', 'Rajesh Kumar (PulseMed)')}
                        className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-amber-500/20 active:scale-95"
                      >
                        <span>Enter Pharmacy ⚡</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRole('pharmacy');
                          setAuthMode('signin');
                          setPhoneStep('phone');
                        }}
                        className="py-2 px-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-[11px] font-bold transition cursor-pointer shadow-2xs"
                      >
                        Phone / OTP
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer text */}
                <div className="text-center text-[11px] text-slate-500 mt-4 tracking-wide font-medium">
                  One Platform &bull; Three Roles &bull; Instant Access
                </div>
              </div>
            </div>

          </div>
        </main>

        {/* Footer */}
        <footer className="w-full py-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white relative z-10">
          <span>MedNexa Connected Health Operating System &bull; Healthcare &bull; People &bull; Possibilities</span>
        </footer>
      </div>
    );
  }

  // =========================================================================
  // STEP 2: ROLE LOGIN SCREEN (Shown only after a role card is clicked)
  // =========================================================================
  const isPatient = selectedRole === 'patient';
  const isDoctor = selectedRole === 'doctor';
  const isPharmacy = selectedRole === 'pharmacy';

  // Role Theme Colors matching the panel in the design images
  const accentBorder = isPatient
    ? 'border-teal-200/90 shadow-teal-500/10'
    : isDoctor
    ? 'border-blue-200/90 shadow-blue-500/10'
    : 'border-amber-200/90 shadow-amber-500/10';

  const accentBadgeBg = isPatient
    ? 'bg-teal-50 text-teal-700 border-teal-200'
    : isDoctor
    ? 'bg-blue-50 text-blue-700 border-blue-200'
    : 'bg-amber-50 text-amber-700 border-amber-200';

  const accentButtonBg = isPatient
    ? 'bg-gradient-to-r from-teal-500 via-emerald-600 to-teal-700 hover:from-teal-600 hover:to-emerald-700 text-white shadow-md shadow-teal-500/20 active:scale-95'
    : isDoctor
    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-md shadow-blue-500/20 active:scale-95'
    : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-amber-500/20 active:scale-95';

  const activeTabClass = isPatient
    ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-sm'
    : isDoctor
    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
    : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm';

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900 overflow-x-hidden relative">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-80" />

      {/* Top Header with Back Button - Show MedNexa logo once per screen */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            setSelectedRole(null);
            setErrorMessage('');
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-bold transition cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>&larr; Back to Role Selection</span>
        </button>

        {/* MedNexa logo shown once per screen in header */}
        <MedNexaLogo size="sm" />
      </header>

      {/* Main Login / Signup Card Layout */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col justify-center my-auto relative z-10">
        <div className={`rounded-3xl bg-white border ${accentBorder} shadow-2xl overflow-hidden flex flex-col lg:flex-row transition-all duration-300`}>
          {/* Visual Panel: Matching photo strip at full height with object-fit: cover */}
          <div className="lg:w-2/5 relative overflow-hidden bg-slate-950 min-h-[260px] lg:min-h-[560px] flex flex-col justify-between p-5">
            {/* Real photo strip asset matching role with object-fit: cover */}
            <img
              src={
                isPatient
                  ? '/assets/04_patient_photo_strip.png'
                  : isDoctor
                  ? '/assets/06_doctor_photo_strip.png'
                  : '/assets/08_pharmacy_photo_strip.png'
              }
              alt={
                isPatient
                  ? 'Patient Health'
                  : isDoctor
                  ? 'Doctor Clinical Console'
                  : 'Pharmacy Dispensary'
              }
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Soft gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1730] via-transparent to-[#0a1730]/60 pointer-events-none" />

            {/* Top slogan & metric chips inside image */}
            <div className="relative z-10 space-y-2">
              {isPatient && (
                <>
                  <div className="font-serif italic text-sm text-teal-200 drop-shadow-md">
                    Small Steps Big Changes ♡
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#061224]/90 border border-teal-500/40 backdrop-blur-md text-xs font-bold text-teal-300 shadow-md">
                    <HeartPulse className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                    <span>Heart Rate: 72 bpm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#061224]/90 border border-teal-500/30 backdrop-blur-md text-[10px] font-bold text-cyan-300">
                      <Droplet className="w-3 h-3 text-cyan-400" />
                      <span>SpO₂: 98%</span>
                    </div>
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#061224]/90 border border-teal-500/30 backdrop-blur-md text-[10px] font-bold text-emerald-300">
                      <Thermometer className="w-3 h-3 text-emerald-400" />
                      <span>Temp: 36.6°C</span>
                    </div>
                  </div>
                </>
              )}

              {isDoctor && (
                <div className="space-y-1.5">
                  <div className="text-lg font-black text-white leading-tight drop-shadow-md">
                    Better Insights.
                    <span className="block text-blue-400 font-bold">Better Care.</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-300/90 text-[10px] font-bold uppercase tracking-wider">
                    <Activity className="w-3.5 h-3.5 text-blue-400" />
                    <span>Live Telemetry Desk</span>
                  </div>
                </div>
              )}

              {isPharmacy && (
                <div className="space-y-1.5">
                  <div className="font-serif italic text-base text-amber-200 drop-shadow-md">
                    Right Medicine Right Time 💊
                  </div>
                  <div className="text-[10px] font-bold text-amber-300/90 uppercase tracking-wider">
                    Licensed Prescription Dispensing
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Section on the visual panel */}
            <div className="relative z-10 mt-8 pt-3 border-t border-slate-800/80">
              {isPatient && (
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Radio className="w-3 h-3 text-teal-400" /> Connected Devices
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div className="p-1.5 rounded-lg bg-[#06101f]/80 border border-slate-800">
                      <Watch className="w-3 h-3 text-teal-400 mx-auto" />
                      <span className="text-[9px] text-slate-300 block">Smart Watch</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#06101f]/80 border border-slate-800">
                      <HeartPulse className="w-3 h-3 text-teal-400 mx-auto" />
                      <span className="text-[9px] text-slate-300 block">ECG Sensor</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#06101f]/80 border border-slate-800">
                      <Thermometer className="w-3 h-3 text-teal-400 mx-auto" />
                      <span className="text-[9px] text-slate-300 block">Temp Sensor</span>
                    </div>
                  </div>
                </div>
              )}

              {isDoctor && (
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Radio className="w-3 h-3 text-blue-400" /> Connected Systems
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div className="p-1.5 rounded-lg bg-[#06101f]/80 border border-slate-800">
                      <span className="text-xs font-bold text-blue-400 block font-mono">128</span>
                      <span className="text-[9px] text-slate-400 block">Patients</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#06101f]/80 border border-slate-800">
                      <span className="text-xs font-bold text-cyan-400 block font-mono">42</span>
                      <span className="text-[9px] text-slate-400 block">Live Devices</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#06101f]/80 border border-slate-800">
                      <span className="text-xs font-bold text-rose-400 block font-mono">07</span>
                      <span className="text-[9px] text-slate-400 block">Active Alerts</span>
                    </div>
                  </div>
                </div>
              )}

              {isPharmacy && (
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Radio className="w-3 h-3 text-amber-400" /> Pharmacy System Status
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div className="p-1.5 rounded-lg bg-[#06101f]/80 border border-slate-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 mx-auto" />
                      <span className="text-[9px] text-slate-300 block">Inventory Online</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#06101f]/80 border border-slate-800">
                      <ShoppingBag className="w-3 h-3 text-amber-400 mx-auto" />
                      <span className="text-[9px] text-slate-300 block">Orders 24/7</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#06101f]/80 border border-slate-800">
                      <Cpu className="w-3 h-3 text-cyan-400 mx-auto" />
                      <span className="text-[9px] text-slate-300 block">Connected 08</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:w-3/5 p-6 sm:p-7 flex flex-col justify-between">
            <div>
              {/* Header inside Form Card - Portal Title without duplicate MedNexa Logo */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-full ${accentBadgeBg} flex items-center justify-center shrink-0`}>
                    {isPatient ? (
                      <User className="w-5 h-5 text-teal-400" />
                    ) : isDoctor ? (
                      <Stethoscope className="w-5 h-5 text-blue-400" />
                    ) : (
                      <Pill className="w-5 h-5 text-amber-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">
                      {isPatient ? 'Patient Portal' : isDoctor ? 'Doctor Portal' : 'Pharmacy Portal'}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {isPatient
                        ? 'Your Health. Our Priority.'
                        : isDoctor
                        ? 'Clinical Access. Better Outcomes.'
                        : 'Manage Inventory. Serve Better.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Top Tabs: "Sign In" and "Create Account" styled with role colors */}
              <div className="bg-slate-100 border border-slate-200 p-1 rounded-2xl flex items-center mb-4 shadow-2xs">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer text-center ${
                    authMode === 'signin'
                      ? activeTabClass
                      : 'text-slate-600 hover:text-slate-900 font-semibold'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                    authMode === 'signup'
                      ? activeTabClass
                      : 'text-slate-600 hover:text-slate-900 font-semibold'
                  }`}
                >
                  <span>Create Account</span>
                  {isPatient && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-teal-100 text-teal-800 font-bold">
                      New
                    </span>
                  )}
                </button>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 1: SIGN IN (OTP Flow + 1-Click + Google)                    */}
              {/* ============================================================== */}
              {authMode === 'signin' && (
                <div className="space-y-4">
                  {/* Role Info Card */}
                  <div
                    className={`p-3 rounded-2xl border text-xs flex items-start gap-2.5 ${
                      isDoctor
                        ? 'bg-blue-50/80 border-blue-200 text-blue-950'
                        : isPharmacy
                        ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                        : 'bg-teal-50/80 border-teal-200 text-teal-950'
                    }`}
                  >
                    {isDoctor ? (
                      <Stethoscope className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    ) : isPharmacy ? (
                      <Package className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    ) : (
                      <User className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-bold">
                        {isDoctor
                          ? 'Doctor Clinical Console'
                          : isPharmacy
                          ? 'Chemist & Pharmacy Dispensing'
                          : 'Patient Care & EHR Account'}
                      </div>
                      <p className="text-[11px] opacity-90 mt-0.5">
                        {isDoctor
                          ? 'Prescribe medicines, review appointment bookings, launch video consult rooms, and write clinical notes.'
                          : isPharmacy
                          ? 'Dispense medications, verify attached digital e-prescriptions, update order fulfillment (Processing, Shipped, Delivered).'
                          : 'Book certified doctors, order doorstep prescription medicines, view digital e-Rx, and track biometrics.'}
                      </p>
                    </div>
                  </div>

                  {/* PHONE NUMBER / OTP FLOW */}
                  <AnimatePresence mode="wait">
                    {phoneStep === 'phone' ? (
                      <form onSubmit={handlePhoneSubmit} className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {isDoctor
                              ? 'Doctor Registered Mobile Number'
                              : isPharmacy
                              ? 'Pharmacy Mobile'
                              : 'Mobile Phone Number'}
                          </label>
                          <div className="flex gap-2">
                            <div className="relative w-28 shrink-0">
                              <select
                                id="login-country-select"
                                value={selectedCountry.code}
                                onChange={(e) => {
                                  const c = COUNTRY_CODES.find((c) => c.code === e.target.value);
                                  if (c) setSelectedCountry(c);
                                }}
                                className="w-full py-2.5 px-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500 cursor-pointer shadow-2xs"
                              >
                                {COUNTRY_CODES.map((c) => (
                                  <option key={c.code} value={c.code} className="bg-white text-slate-900">
                                    {c.flag} {c.dialCode}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="relative flex-1">
                              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                              <input
                                id="login-phone-input"
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                                placeholder="98450 12345"
                                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 shadow-2xs"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* Send OTP button */}
                        <button
                          type="submit"
                          id="send-otp-btn"
                          disabled={isLoading}
                          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 ${accentButtonBg}`}
                        >
                          {isLoading && loadingType === 'phone' ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <>
                              <Phone className="w-3.5 h-3.5" />
                              <span>
                                {isDoctor
                                  ? 'Send Doctor OTP'
                                  : isPharmacy
                                  ? 'Send Chemist OTP'
                                  : 'Send Mobile OTP Code'}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>

                        {/* Instant 1-Click Role Logins */}
                        {isPatient && (
                          <button
                            type="button"
                            id="quick-demo-login-btn"
                            onClick={() => {
                              setIsLoading(true);
                              setLoadingType('demo');
                              setTimeout(() => {
                                loginWithPhone('+91 98765 43210', 'Sarath Paturu', 'patient');
                                setIsLoading(false);
                                setLoadingType('');
                              }, 400);
                            }}
                            className="w-full py-2.5 bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 text-teal-900 border border-teal-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                          >
                            <User className="w-3.5 h-3.5 text-teal-600" />
                            <span>Instant 1-Click Patient Login (Sarath Paturu)</span>
                          </button>
                        )}

                        {isDoctor && (
                          <button
                            type="button"
                            id="quick-doctor-login-btn"
                            onClick={() => {
                              setIsLoading(true);
                              setLoadingType('demo');
                              setTimeout(() => {
                                loginWithEmail('dr.vmohan@pulsehealth.org', undefined, 'doctor', 'Dr. V. Mohan, MD');
                                setIsLoading(false);
                                setLoadingType('');
                              }, 400);
                            }}
                            className="w-full py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-900 border border-blue-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                          >
                            <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                            <span>Instant 1-Click Doctor Login (Dr. V. Mohan, MD)</span>
                          </button>
                        )}

                        {isPharmacy && (
                          <button
                            type="button"
                            id="quick-shopkeeper-login-btn"
                            onClick={() => {
                              setIsLoading(true);
                              setLoadingType('demo');
                              setTimeout(() => {
                                loginWithPhone('+91 98450 67890', 'Rajesh Kumar (PulseMed Chemist)', 'shopkeeper');
                                setIsLoading(false);
                                setLoadingType('');
                              }, 400);
                            }}
                            className="w-full py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                          >
                            <Package className="w-3.5 h-3.5 text-amber-600" />
                            <span>Instant 1-Click Pharmacy Login (Rajesh Kumar - Chemist)</span>
                          </button>
                        )}
                      </form>
                    ) : (
                      /* OTP Verification Screen */
                      <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">
                              Enter 6-Digit SMS Code
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Sent to {selectedCountry.dialCode} {phoneNumber}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setPhoneStep('phone');
                              setErrorMessage('');
                            }}
                            className="text-xs text-teal-600 font-bold hover:underline cursor-pointer"
                          >
                            Edit Number
                          </button>
                        </div>

                        {/* Auto-fill demo helper */}
                        <div className="p-2 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between text-xs">
                          <span className="text-teal-800 font-medium text-[11px]">
                            Demo Code: <strong className="font-mono">{DEMO_OTP}</strong>
                          </span>
                          <button
                            type="button"
                            onClick={handleFillDemoOtp}
                            className="px-2 py-0.5 bg-teal-100 hover:bg-teal-200 text-teal-800 border border-teal-300 rounded text-[11px] font-bold transition cursor-pointer"
                          >
                            Auto-fill
                          </button>
                        </div>

                        {/* 6 Digit Input Boxes */}
                        <div className="flex justify-between gap-1.5">
                          {otpDigits.map((digit, idx) => (
                            <input
                              key={idx}
                              id={`otp-input-${idx}`}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(idx, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                              className="w-11 h-11 text-center text-lg font-black font-mono bg-white border-2 border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-500 transition shadow-2xs"
                              autoFocus={idx === 0}
                            />
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>Didn't receive SMS?</span>
                          {canResend ? (
                            <button
                              type="button"
                              onClick={() => {
                                setResendTimer(30);
                                setCanResend(false);
                                setOtpDigits(['', '', '', '', '', '']);
                              }}
                              className="text-teal-600 hover:text-teal-700 font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <RefreshCw className="w-3 h-3" /> Resend Code
                            </button>
                          ) : (
                            <span className="text-slate-500 text-[11px]">
                              Resend in <strong className="text-slate-700">{resendTimer}s</strong>
                            </span>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 ${accentButtonBg}`}
                        >
                          {isLoading && loadingType === 'otp' ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Verify &amp; Enter Portal</span>
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </AnimatePresence>

                  {/* OR CONTINUE WITH DIVIDER */}
                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-200" />
                    <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      OR CONTINUE WITH
                    </span>
                    <div className="flex-grow border-t border-slate-200" />
                  </div>

                  {/* CONTINUE WITH GOOGLE EMAIL */}
                  <div>
                    <button
                      type="button"
                      id="continue-with-google-btn"
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                      className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold shadow-2xs transition flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-70"
                    >
                      {isLoading && loadingType === 'google' ? (
                        <RefreshCw className="w-4 h-4 text-teal-700 animate-spin" />
                      ) : (
                        <>
                          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                          </svg>
                          <span>Continue with Google Email</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 2: CREATE ACCOUNT (Role-Specific Clinical Registration)     */}
              {/* ============================================================== */}
              {authMode === 'signup' && (
                <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      {isDoctor ? (
                        <Stethoscope className="w-4 h-4 text-blue-600" />
                      ) : isPharmacy ? (
                        <Package className="w-4 h-4 text-amber-600" />
                      ) : (
                        <Activity className="w-4 h-4 text-teal-600" />
                      )}
                      New {isDoctor ? 'Doctor' : isPharmacy ? 'Pharmacy' : 'Patient'} Registration
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {isDoctor
                        ? 'Register physician credentials to consult patients and issue digital e-prescriptions.'
                        : isPharmacy
                        ? 'Register pharmacy store license to dispense medicines and fulfill orders.'
                        : 'Please provide your details to establish your electronic health record.'}
                    </p>
                  </div>

                  <form onSubmit={handleCreateAccount} className="space-y-3">
                    {/* Legal Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Full Legal Name *
                        </label>
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="e.g. Venki Kumar"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 shadow-2xs"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 shadow-2xs"
                          required
                        />
                      </div>
                    </div>

                    {/* Mobile Number with Country Code */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Mobile Phone Number *
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={newPhoneCountry.code}
                          onChange={(e) => {
                            const c = COUNTRY_CODES.find((item) => item.code === e.target.value);
                            if (c) setNewPhoneCountry(c);
                          }}
                          className="w-24 py-2 px-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-500 shadow-2xs cursor-pointer"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.code} value={c.code} className="bg-white text-slate-900">
                              {c.flag} {c.dialCode}
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          value={newPhone}
                          onChange={(e) => setNewPhone(formatPhoneNumber(e.target.value))}
                          placeholder="98450 12345"
                          className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 shadow-2xs"
                          required
                        />
                      </div>
                    </div>

                    {/* Role Specific Fields */}
                    {isPatient && (
                      <>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              DOB
                            </label>
                            <input
                              type="date"
                              value={dob}
                              onChange={(e) => setDob(e.target.value)}
                              className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-xl text-[11px] text-slate-900 focus:outline-none focus:border-teal-500 shadow-2xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Gender
                            </label>
                            <select
                              value={gender}
                              onChange={(e) => setGender(e.target.value)}
                              className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-xl text-[11px] text-slate-800 focus:outline-none focus:border-teal-500 shadow-2xs cursor-pointer"
                            >
                              <option value="Female">Female</option>
                              <option value="Male">Male</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Blood
                            </label>
                            <select
                              value={bloodGroup}
                              onChange={(e) => setBloodGroup(e.target.value)}
                              className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-xl text-[11px] text-slate-800 focus:outline-none focus:border-teal-500 shadow-2xs cursor-pointer"
                            >
                              {BLOOD_GROUPS.map((bg) => (
                                <option key={bg} value={bg}>
                                  {bg}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Allergies &amp; Sensitivities
                          </label>
                          <div className="flex flex-wrap gap-1">
                            {COMMON_ALLERGIES.slice(0, 4).map((a) => (
                              <button
                                key={a}
                                type="button"
                                onClick={() => toggleAllergy(a)}
                                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                                  selectedAllergies.includes(a)
                                    ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-2xs'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                                }`}
                              >
                                {a}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {isDoctor && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            NMC Registration License *
                          </label>
                          <input
                            type="text"
                            value={doctorLicense}
                            onChange={(e) => setDoctorLicense(e.target.value)}
                            placeholder="NMC-2018-84729"
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Specialization
                          </label>
                          <input
                            type="text"
                            value={doctorSpecialization}
                            onChange={(e) => setDoctorSpecialization(e.target.value)}
                            placeholder="Cardiology"
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
                          />
                        </div>
                      </div>
                    )}

                    {isPharmacy && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Store Legal Name *
                          </label>
                          <input
                            type="text"
                            value={shopStoreName}
                            onChange={(e) => setShopStoreName(e.target.value)}
                            placeholder="PulseMed 24x7 Chemist"
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 shadow-2xs"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Drug License (Form 20/21) *
                          </label>
                          <input
                            type="text"
                            value={shopDrugLicense}
                            onChange={(e) => setShopDrugLicense(e.target.value)}
                            placeholder="KA-BLR-DL-2019-48201"
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 shadow-2xs"
                            required
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 ${accentButtonBg}`}
                    >
                      {isLoading ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Complete Registration &amp; Enter Portal</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Footer Badges: "256-Bit SSL Encrypted" and "HIPAA & ABHA Compliant" */}
            <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold text-slate-700">256-Bit SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-cyan-600" />
                <span className="font-semibold text-slate-700">HIPAA &amp; ABHA Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="w-full py-3.5 text-center text-xs text-slate-500 border-t border-slate-200 bg-white relative z-10">
        <span>MedNexa Connected Health Operating System &bull; Healthcare &bull; People &bull; Possibilities</span>
      </footer>
    </div>
  );
};
