import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  Activity,
  Droplet,
  Wind,
  Calendar,
  Clock,
  Pill,
  Stethoscope,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Star,
  PhoneCall,
  UserCheck,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  Timer,
  Smile,
  Video,
  ShoppingBag,
  Camera,
  MapPin,
  Thermometer,
  Moon,
  Sun,
  Zap,
  Copy,
  X,
  Shield,
  FileText,
  Bell,
  BellRing,
  Droplets,
  CheckCircle,
  Phone,
  PhoneIncoming,
  PhoneOff,
  Volume2,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Eye,
  Palette,
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { Doctor } from '../types';
import { BottomNavTab } from './BottomNav';
import { AIWellnessModule } from './AIWellnessModule';
import { PrescriptionPhotoScanner } from './PrescriptionPhotoScanner';

export type HomeTheme = 'emerald' | 'sapphire' | 'violet' | 'midnight' | 'sunset';

export const THEME_CONFIGS: Record<HomeTheme, {
  id: HomeTheme;
  name: string;
  label: string;
  icon: string;
  previewColor: string;
  wrapperBg: string;
  heroBg: string;
  heroGlow1: string;
  heroGlow2: string;
  heroTextColor: string;
  heroSubtextColor: string;
  heroChipBg: string;
  heroChipBorder: string;
  heroChipText: string;
  consultBtn: string;
  rxBtn: string;
  sosBtn: string;
  cardBaseBg: string;
  cardBorder: string;
  cardHoverBorder: string;
  cardTitleColor: string;
  marqueeBorder: string;
  marqueeBg: string;
  subtextColor: string;
  accentBg: string;
  accentText: string;
  advisoryGradient: string;
  advisoryBorder: string;
  advisoryText: string;
}> = {
  emerald: {
    id: 'emerald',
    name: 'Emerald Vitality',
    label: 'Emerald Mint',
    icon: '🌿',
    previewColor: 'from-emerald-500 to-teal-700',
    wrapperBg: 'bg-gradient-to-b from-emerald-50/40 via-teal-50/20 to-slate-50/60',
    heroBg: 'bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900',
    heroGlow1: 'bg-emerald-500/25',
    heroGlow2: 'bg-teal-400/20',
    heroTextColor: 'text-white',
    heroSubtextColor: 'text-emerald-100/90',
    heroChipBg: 'bg-emerald-500/20',
    heroChipBorder: 'border-emerald-400/30',
    heroChipText: 'text-emerald-300',
    consultBtn: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 shadow-emerald-500/30 text-white',
    rxBtn: 'bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-800 hover:from-teal-700 text-white shadow-teal-500/25',
    sosBtn: 'bg-gradient-to-r from-rose-500 via-red-600 to-rose-700 hover:from-rose-600 text-white shadow-rose-500/25',
    cardBaseBg: 'bg-white',
    cardBorder: 'border-emerald-100/90',
    cardHoverBorder: 'hover:border-emerald-400 hover:shadow-emerald-500/10',
    cardTitleColor: 'text-slate-900',
    marqueeBorder: 'border-emerald-200/80',
    marqueeBg: 'bg-white',
    subtextColor: 'text-slate-600',
    accentBg: 'bg-emerald-50 text-emerald-700',
    accentText: 'text-emerald-700',
    advisoryGradient: 'bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white',
    advisoryBorder: 'border-emerald-500/30',
    advisoryText: 'text-emerald-300',
  },
  sapphire: {
    id: 'sapphire',
    name: 'Oceanic Sapphire',
    label: 'Sapphire Cyan',
    icon: '💎',
    previewColor: 'from-blue-600 to-cyan-500',
    wrapperBg: 'bg-gradient-to-b from-blue-50/40 via-sky-50/20 to-slate-50/60',
    heroBg: 'bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-900',
    heroGlow1: 'bg-blue-500/25',
    heroGlow2: 'bg-cyan-400/20',
    heroTextColor: 'text-white',
    heroSubtextColor: 'text-blue-100/90',
    heroChipBg: 'bg-blue-500/20',
    heroChipBorder: 'border-blue-400/30',
    heroChipText: 'text-blue-300',
    consultBtn: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-700 hover:via-indigo-700 hover:to-cyan-600 shadow-blue-500/30 text-white',
    rxBtn: 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 hover:from-cyan-700 text-white shadow-cyan-500/25',
    sosBtn: 'bg-gradient-to-r from-rose-500 via-red-600 to-rose-700 hover:from-rose-600 text-white shadow-rose-500/25',
    cardBaseBg: 'bg-white',
    cardBorder: 'border-blue-100/90',
    cardHoverBorder: 'hover:border-blue-400 hover:shadow-blue-500/10',
    cardTitleColor: 'text-slate-900',
    marqueeBorder: 'border-blue-200/80',
    marqueeBg: 'bg-white',
    subtextColor: 'text-slate-600',
    accentBg: 'bg-blue-50 text-blue-700',
    accentText: 'text-blue-700',
    advisoryGradient: 'bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white',
    advisoryBorder: 'border-blue-500/30',
    advisoryText: 'text-blue-300',
  },
  violet: {
    id: 'violet',
    name: 'Royal Amethyst',
    label: 'Amethyst Berry',
    icon: '💜',
    previewColor: 'from-purple-600 to-pink-500',
    wrapperBg: 'bg-gradient-to-b from-purple-50/40 via-violet-50/20 to-slate-50/60',
    heroBg: 'bg-gradient-to-br from-purple-950 via-violet-950 to-slate-900',
    heroGlow1: 'bg-purple-500/25',
    heroGlow2: 'bg-pink-400/20',
    heroTextColor: 'text-white',
    heroSubtextColor: 'text-purple-100/90',
    heroChipBg: 'bg-purple-500/20',
    heroChipBorder: 'border-purple-400/30',
    heroChipText: 'text-purple-300',
    consultBtn: 'bg-gradient-to-r from-purple-600 via-violet-600 to-pink-600 hover:from-purple-700 text-white shadow-purple-500/30',
    rxBtn: 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 hover:from-violet-700 text-white shadow-violet-500/25',
    sosBtn: 'bg-gradient-to-r from-rose-500 via-red-600 to-rose-700 hover:from-rose-600 text-white shadow-rose-500/25',
    cardBaseBg: 'bg-white',
    cardBorder: 'border-purple-100/90',
    cardHoverBorder: 'hover:border-purple-400 hover:shadow-purple-500/10',
    cardTitleColor: 'text-slate-900',
    marqueeBorder: 'border-purple-200/80',
    marqueeBg: 'bg-white',
    subtextColor: 'text-slate-600',
    accentBg: 'bg-purple-50 text-purple-700',
    accentText: 'text-purple-700',
    advisoryGradient: 'bg-gradient-to-r from-purple-950 via-violet-950 to-slate-900 text-white',
    advisoryBorder: 'border-purple-500/30',
    advisoryText: 'text-purple-300',
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Cyber-Pulse',
    label: 'Midnight HUD',
    icon: '🌙',
    previewColor: 'from-slate-950 to-teal-500',
    wrapperBg: 'bg-slate-950 text-slate-100',
    heroBg: 'bg-gradient-to-br from-slate-950 via-zinc-900 to-black',
    heroGlow1: 'bg-teal-400/25',
    heroGlow2: 'bg-emerald-500/15',
    heroTextColor: 'text-white',
    heroSubtextColor: 'text-slate-300',
    heroChipBg: 'bg-teal-400/15',
    heroChipBorder: 'border-teal-400/30',
    heroChipText: 'text-teal-300',
    consultBtn: 'bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 hover:from-teal-600 text-white shadow-teal-500/30',
    rxBtn: 'bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-700 hover:from-cyan-700 text-white shadow-cyan-500/25',
    sosBtn: 'bg-gradient-to-r from-rose-500 via-red-600 to-rose-700 hover:from-rose-600 text-white shadow-rose-500/25',
    cardBaseBg: 'bg-slate-900 text-slate-100',
    cardBorder: 'border-slate-800',
    cardHoverBorder: 'hover:border-teal-500/60 hover:shadow-teal-500/15',
    cardTitleColor: 'text-white',
    marqueeBorder: 'border-slate-800',
    marqueeBg: 'bg-slate-900',
    subtextColor: 'text-slate-400',
    accentBg: 'bg-teal-950 text-teal-300 border border-teal-800',
    accentText: 'text-teal-400',
    advisoryGradient: 'bg-gradient-to-r from-slate-900 via-zinc-900 to-slate-950 text-white',
    advisoryBorder: 'border-teal-500/30',
    advisoryText: 'text-teal-300',
  },
  sunset: {
    id: 'sunset',
    name: 'Amber Vitality',
    label: 'Amber Gold',
    icon: '🌅',
    previewColor: 'from-amber-500 to-rose-500',
    wrapperBg: 'bg-gradient-to-b from-amber-50/40 via-orange-50/20 to-slate-50/60',
    heroBg: 'bg-gradient-to-br from-amber-950 via-rose-950 to-slate-900',
    heroGlow1: 'bg-amber-500/25',
    heroGlow2: 'bg-rose-400/20',
    heroTextColor: 'text-white',
    heroSubtextColor: 'text-amber-100/90',
    heroChipBg: 'bg-amber-500/20',
    heroChipBorder: 'border-amber-400/30',
    heroChipText: 'text-amber-300',
    consultBtn: 'bg-gradient-to-r from-amber-500 via-rose-500 to-orange-500 hover:from-amber-600 text-white shadow-amber-500/30',
    rxBtn: 'bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 hover:from-rose-700 text-white shadow-rose-500/25',
    sosBtn: 'bg-gradient-to-r from-rose-500 via-red-600 to-rose-700 hover:from-rose-600 text-white shadow-rose-500/25',
    cardBaseBg: 'bg-white',
    cardBorder: 'border-amber-100/90',
    cardHoverBorder: 'hover:border-amber-400 hover:shadow-amber-500/10',
    cardTitleColor: 'text-slate-900',
    marqueeBorder: 'border-amber-200/80',
    marqueeBg: 'bg-white',
    subtextColor: 'text-slate-600',
    accentBg: 'bg-amber-50 text-amber-800',
    accentText: 'text-amber-700',
    advisoryGradient: 'bg-gradient-to-r from-amber-950 via-rose-950 to-slate-900 text-white',
    advisoryBorder: 'border-amber-500/30',
    advisoryText: 'text-amber-300',
  },
};

interface HomeViewProps {
  onNavigate: (tab: BottomNavTab, subSection?: string) => void;
  onSelectDoctorToBook?: (doctor: Doctor) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onSelectDoctorToBook }) => {
  const {
    currentUser,
    vitals,
    pillReminders,
    markPillTaken,
    appointments,
    startConsultation,
    doctors,
    wellnessPlans,
  } = useHealth();

  // Active Homepage Color Theme
  const [currentTheme, setCurrentTheme] = useState<HomeTheme>(() => {
    return (localStorage.getItem('mednexa_home_theme') as HomeTheme) || 'emerald';
  });

  const handleThemeChange = (newTheme: HomeTheme) => {
    setCurrentTheme(newTheme);
    localStorage.setItem('mednexa_home_theme', newTheme);
  };

  const theme = THEME_CONFIGS[currentTheme] || THEME_CONFIGS.emerald;

  const [showSosModal, setShowSosModal] = useState(false);
  const [dialFeedback, setDialFeedback] = useState<string | null>(null);
  const [showRxScannerModal, setShowRxScannerModal] = useState(false);

  // Dose by time & Call Reminder States
  const [selectedPillIdTime, setSelectedPillIdTime] = useState<string | null>(null);
  const [showAllPillsExpanded, setShowAllPillsExpanded] = useState(false);
  const [incomingCallDose, setIncomingCallDose] = useState<any | null>(null);
  const [callStatus, setCallStatus] = useState<'idle' | 'ringing' | 'connected'>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [snoozeNotice, setSnoozeNotice] = useState<string | null>(null);
  const [showPillPhotoModal, setShowPillPhotoModal] = useState<any | null>(null);
  const ringtoneRef = useRef<{ stop: () => void } | null>(null);

  // Next upcoming confirmed appointment
  const nextAppointment = appointments.find((a) => a.status === 'confirmed');

  // Doctor treating the patient (e.g. from upcoming appointment, or primary cardiologist/endocrinologist doc-1)
  const treatingDoctor =
    doctors.find((d) => d.id === nextAppointment?.doctorId) ||
    doctors.find((d) => d.id === 'doc-1') ||
    doctors[0];

  // Pill adherence calculation
  const totalDosesToday = pillReminders.reduce(
    (sum, r) => sum + (r.active ? r.intakeTimes.length : 0),
    0
  );
  const takenDosesToday = pillReminders.reduce(
    (sum, r) => sum + (r.active ? r.todayTakenTimes.length : 0),
    0
  );
  const adherencePct = totalDosesToday > 0 ? Math.round((takenDosesToday / totalDosesToday) * 100) : 100;

  // Gentle pop audio feedback on pill take
  const playPopSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12); // A5 note
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.13);
    } catch {
      // AudioContext unavailable or blocked
    }
  };

  // Start realistic telephone ringtone
  const startRingtone = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      let isPlaying = true;
      let intervalId: any;

      const playRingBurst = () => {
        if (!isPlaying || audioCtx.state === 'closed') return;
        const now = audioCtx.currentTime;

        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc1.frequency.setValueAtTime(440, now);
        osc2.frequency.setValueAtTime(480, now);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.setValueAtTime(0.12, now + 1.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.5);
        osc2.stop(now + 1.5);
      };

      playRingBurst();
      intervalId = setInterval(() => {
        if (isPlaying) playRingBurst();
      }, 3000);

      ringtoneRef.current = {
        stop: () => {
          isPlaying = false;
          clearInterval(intervalId);
          try {
            audioCtx.close();
          } catch {}
          ringtoneRef.current = null;
        },
      };
    } catch {
      // AudioContext blocked
    }
  };

  const stopRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.stop();
    }
  };

  const speakReminder = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch {}
  };

  const triggerReminderCall = (dose: any) => {
    setIncomingCallDose(dose);
    setCallStatus('ringing');
    startRingtone();
  };

  const handleAnswerCall = (dose: any) => {
    stopRingtone();
    setCallStatus('connected');
    const msg = `Hello! This is a reminder from your health care team. It is time for your ${dose.medicineName}, ${dose.dosage}. Please take it with a glass of water, ${dose.instructions}. Tap the confirmation button on your screen once you have taken it.`;
    speakReminder(msg);
  };

  const handleConfirmTakenInCall = (pillId: string, time: string) => {
    markPillTaken(pillId, time);
    playPopSound();
    speakReminder('Thank you! Your dose is recorded. Take care!');
    setTimeout(() => {
      stopRingtone();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIncomingCallDose(null);
      setCallStatus('idle');
    }, 1800);
  };

  const handleSnoozeCall = () => {
    stopRingtone();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIncomingCallDose(null);
    setCallStatus('idle');
    setSnoozeNotice('Dose reminder call snoozed for 10 minutes ⏰');
    setTimeout(() => setSnoozeNotice(null), 4000);
  };

  const handleEndCall = () => {
    stopRingtone();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIncomingCallDose(null);
    setCallStatus('idle');
  };

  // Call duration timer
  useEffect(() => {
    let timer: any;
    if (callStatus === 'connected') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callStatus]);

  // Cleanup audio & speech on unmount
  useEffect(() => {
    return () => {
      stopRingtone();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  // Flatten & format all individual dose events with clinical instructions
  const allTodayDoses = pillReminders.flatMap((pill) =>
    pill.intakeTimes.map((time) => {
      const isTaken = pill.todayTakenTimes.includes(time);
      const lower = pill.medicineName.toLowerCase();
      let pillVisual = {
        color: 'from-amber-400 to-amber-500',
        slotName: time.includes('PM') ? 'Evening Dose' : 'Morning Dose',
      };
      if (lower.includes('glycomet')) {
        pillVisual = {
          color: 'from-blue-500 to-indigo-600',
          slotName: time.includes('PM') ? 'Night / Dinner' : 'Morning',
        };
      } else if (lower.includes('telma')) {
        pillVisual = {
          color: 'from-rose-400 to-orange-500',
          slotName: 'Breakfast',
        };
      } else if (lower.includes('thyronorm')) {
        pillVisual = {
          color: 'from-amber-300 to-yellow-400',
          slotName: 'Fasting / AM',
        };
      } else {
        pillVisual = {
          color: 'from-teal-400 to-emerald-500',
          slotName: 'Scheduled',
        };
      }

      const pillImageUrl =
        pill.pillImageUrl ||
        (lower.includes('glycomet')
          ? 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80'
          : lower.includes('telma')
          ? 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&auto=format&fit=crop&q=80');

      const pillImprint =
        pill.pillImprint ||
        (lower.includes('glycomet') ? 'USV 1000/1' : lower.includes('telma') ? 'GLEN 40' : '50');

      const tabletColor =
        pill.tabletColor ||
        (lower.includes('glycomet')
          ? 'Bi-layer White & Soft Blue'
          : lower.includes('telma')
          ? 'Salmon Pink / Light Coral'
          : 'Pure White');

      const tabletShape =
        pill.tabletShape ||
        (lower.includes('glycomet')
          ? 'Oblong / Capsule-shaped tablet with score line'
          : lower.includes('telma')
          ? 'Round biconvex film-coated tablet'
          : 'Micro-round flat-faced tablet with bevelled edge');

      return {
        pillId: pill.id,
        medicineName: pill.medicineName,
        dosage: pill.dosage,
        frequency: pill.frequency,
        instructions: pill.instructions,
        time,
        isTaken,
        pillVisual,
        pillImageUrl,
        pillImprint,
        tabletColor,
        tabletShape,
      };
    })
  );

  // Sort: pending first, then by time
  const sortedTodayDoses = [...allTodayDoses].sort((a, b) => {
    if (a.isTaken === b.isTaken) {
      return a.time.localeCompare(b.time);
    }
    return a.isTaken ? 1 : -1;
  });

  // Find currently active main pill
  const currentMainDose = useMemo(() => {
    if (allTodayDoses.length === 0) return null;

    if (selectedPillIdTime) {
      const found = allTodayDoses.find(
        (d) => `${d.pillId}-${d.time}` === selectedPillIdTime
      );
      if (found) return found;
    }

    // Default to the first untaken dose of today
    const untaken = allTodayDoses.find((d) => !d.isTaken);
    if (untaken) return untaken;

    // If all are completed, show the last dose
    return allTodayDoses[allTodayDoses.length - 1];
  }, [allTodayDoses, selectedPillIdTime]);

  // Automatic Clock Monitor state
  const [autoCallEnabled, setAutoCallEnabled] = useState(true);
  const [rungDoses, setRungDoses] = useState<string[]>([]);
  const [autoTestCountdown, setAutoTestCountdown] = useState<number | null>(null);

  // Background Automatic Clock Monitor: checks every second if a scheduled pill time has arrived!
  useEffect(() => {
    if (!autoCallEnabled) return;

    const interval = setInterval(() => {
      // Don't interrupt if already in a call or ringing
      if (incomingCallDose || callStatus !== 'idle') return;

      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const strHours = hours < 10 ? `0${hours}` : `${hours}`;
      const strMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const nowStr = `${strHours}:${strMinutes} ${ampm}`;

      // Look for untaken dose scheduled for this exact minute
      const dueNowDose = sortedTodayDoses.find((dose) => {
        if (dose.isTaken) return false;
        const key = `${dose.pillId}-${dose.time}`;
        if (rungDoses.includes(key)) return false;
        return dose.time === nowStr;
      });

      if (dueNowDose) {
        setRungDoses((prev) => [...prev, `${dueNowDose.pillId}-${dueNowDose.time}`]);
        triggerReminderCall(dueNowDose);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [autoCallEnabled, sortedTodayDoses, rungDoses, incomingCallDose, callStatus]);

  // Automatic Test Countdown Simulator (rings automatically after 3 seconds)
  useEffect(() => {
    if (autoTestCountdown === null) return;
    if (autoTestCountdown > 0) {
      const timer = setTimeout(() => {
        setAutoTestCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (autoTestCountdown === 0) {
      setAutoTestCountdown(null);
      if (currentMainDose) {
        triggerReminderCall(currentMainDose);
      }
    }
  }, [autoTestCountdown, currentMainDose]);

  // Handle SOS emergency dispatch
  const handleCallEmergency = (number: string, serviceLabel: string) => {
    try {
      navigator.clipboard.writeText(number);
      setDialFeedback(`Calling ${serviceLabel} (${number}). Number copied to clipboard.`);
    } catch {
      setDialFeedback(`Calling ${serviceLabel} (${number})...`);
    }
    window.location.href = `tel:${number}`;
  };

  return (
    <div className={`space-y-6 max-w-7xl mx-auto font-sans p-1 sm:p-3 rounded-3xl transition-colors duration-300 ${theme.wrapperBg}`}>
      {/* Radiant Executive Medical Hero Banner with Dynamic Themes */}
      <div className={`rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden transition-all duration-500 border ${theme.heroBg} ${theme.cardBorder}`}>
        {/* Soft atmospheric ambient glow orbs */}
        <div className={`absolute right-0 top-0 w-96 h-96 rounded-full blur-3xl pointer-events-none ${theme.heroGlow1}`} />
        <div className={`absolute left-1/3 -bottom-10 w-80 h-80 rounded-full blur-2xl pointer-events-none ${theme.heroGlow2}`} />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border backdrop-blur-md ${theme.heroChipBg} ${theme.heroChipBorder} ${theme.heroChipText}`}>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Vitals Active &bull; Health Profile Verified
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/90 text-xs font-mono font-medium border border-white/15 backdrop-blur-md">
                Patient #{currentUser.id}
              </span>
              {treatingDoctor && (
                <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold border border-white/15 backdrop-blur-md">
                  Treating Physician: {treatingDoctor.name.split(',')[0]}
                </span>
              )}
            </div>

            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight flex items-center gap-2 ${theme.heroTextColor}`}>
              <span>Good Day, {currentUser.name}!</span>
              <span className="text-2xl sm:text-3xl animate-bounce">👋</span>
            </h1>

            <p className={`text-xs sm:text-sm max-w-xl leading-relaxed font-normal ${theme.heroSubtextColor}`}>
              Welcome to your personal MedNexa health desk. Review daily biometrics, take scheduled medications, order door-step prescriptions in ₹ INR, and consult top specialist doctors.
            </p>
          </div>

          {/* Action Buttons: High-Visibility Vibrant Theme Gradient Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* 1. Consult Doctor: Vibrant button */}
            <button
              type="button"
              id="home-talk-doctor-btn"
              onClick={() => {
                if (onSelectDoctorToBook && treatingDoctor) {
                  onSelectDoctorToBook(treatingDoctor);
                } else {
                  onNavigate('doctors');
                }
              }}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-lg transition active:scale-95 flex items-center gap-2 cursor-pointer ${theme.consultBtn}`}
              title={`Consult ${treatingDoctor ? treatingDoctor.name : 'Your Treating Doctor'}`}
            >
              <Stethoscope className="w-4 h-4 text-white" />
              <span>Consult Doctor</span>
            </button>

            {/* 2. Upload Rx Photo: Theme button */}
            <button
              type="button"
              id="home-upload-rx-btn"
              onClick={() => setShowRxScannerModal(true)}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-lg transition active:scale-95 flex items-center gap-2 cursor-pointer ${theme.rxBtn}`}
              title="Open camera scanner or upload doctor prescription"
            >
              <Camera className="w-4 h-4 text-white" />
              <span>Upload Rx Photo</span>
            </button>

            {/* 3. Emergency Helpline & SOS */}
            <button
              type="button"
              id="home-emergency-sos-btn"
              onClick={() => {
                setDialFeedback(null);
                setShowSosModal(true);
              }}
              className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-lg transition active:scale-95 flex items-center gap-1.5 cursor-pointer ${theme.sosBtn}`}
              title="Emergency Helpline & SOS (112)"
            >
              <PhoneCall className="w-4 h-4" />
              <span>SOS (112)</span>
            </button>
          </div>
        </div>

        {/* Theme Palette Bar with Quick Switcher */}
        <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-white/90">
            <Palette className="w-4 h-4 text-white" />
            <span>Homepage Color Themes:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-black/35 backdrop-blur-md rounded-2xl border border-white/15">
            {(Object.keys(THEME_CONFIGS) as HomeTheme[]).map((themeKey) => {
              const cfg = THEME_CONFIGS[themeKey];
              const isSelected = currentTheme === themeKey;
              return (
                <button
                  key={themeKey}
                  type="button"
                  onClick={() => handleThemeChange(themeKey)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-md scale-105'
                      : 'text-white/80 hover:text-white hover:bg-white/15'
                  }`}
                  title={`Switch to ${cfg.name} Theme`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${cfg.previewColor}`} />
                  <span>{cfg.label}</span>
                  {isSelected && <span className="text-[10px] text-emerald-600 font-black">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Daily Body Vitals: Auto-Scrolling Continuously from Left to Right */}
      {(() => {
        const clinicalBiometricsList = [
          {
            id: 'bio-bp',
            title: 'Blood Pressure',
            value: vitals.bloodPressure,
            unit: 'mmHg',
            subtext: 'Systolic / Diastolic',
            target: '120/80 Target',
            icon: Heart,
            bg: 'bg-rose-500 text-white shadow-xs',
            cardBg: 'bg-gradient-to-br from-rose-50/90 via-white to-red-50/40',
            border: 'border-rose-200/90 hover:border-rose-400',
            bar: 'bg-gradient-to-r from-rose-500 to-red-600',
            pct: '75%',
          },
          {
            id: 'bio-pulse',
            title: 'Resting Pulse',
            value: `${vitals.heartRateBpm}`,
            unit: 'BPM',
            subtext: 'Normal adult sinus rhythm',
            target: '60-100 Normal',
            icon: Activity,
            bg: 'bg-blue-600 text-white shadow-xs',
            cardBg: 'bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/40',
            border: 'border-blue-200/90 hover:border-blue-400',
            bar: 'bg-gradient-to-r from-blue-500 to-indigo-600',
            pct: '80%',
          },
          {
            id: 'bio-sugar',
            title: 'Fasting Sugar',
            value: `${vitals.bloodSugarMgDl}`,
            unit: 'mg/dL',
            subtext: 'Pre-meal glycemic control',
            target: '< 100 Normal',
            icon: Droplet,
            bg: 'bg-amber-500 text-white shadow-xs',
            cardBg: 'bg-gradient-to-br from-amber-50/90 via-white to-orange-50/40',
            border: 'border-amber-200/90 hover:border-amber-400',
            bar: 'bg-gradient-to-r from-amber-500 to-orange-500',
            pct: '68%',
          },
          {
            id: 'bio-spo2',
            title: 'Oxygen (SpO2)',
            value: `${vitals.oxygenSatPct}`,
            unit: '%',
            subtext: 'Arterial oxygen saturation',
            target: '95-100% Target',
            icon: Wind,
            bg: 'bg-cyan-600 text-white shadow-xs',
            cardBg: 'bg-gradient-to-br from-cyan-50/90 via-white to-teal-50/40',
            border: 'border-cyan-200/90 hover:border-cyan-400',
            bar: 'bg-gradient-to-r from-cyan-500 to-teal-600',
            pct: '99%',
          },
          {
            id: 'bio-temp',
            title: 'Body Temperature',
            value: `${vitals.temperatureF || 98.6}`,
            unit: '°F',
            subtext: 'Basal thermal homeostasis',
            target: '98.6°F Oral',
            icon: Thermometer,
            bg: 'bg-emerald-600 text-white shadow-xs',
            cardBg: 'bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/40',
            border: 'border-emerald-200/90 hover:border-emerald-400',
            bar: 'bg-gradient-to-r from-emerald-500 to-teal-600',
            pct: '98%',
          },
          {
            id: 'bio-resp',
            title: 'Respiration Rate',
            value: '16',
            unit: 'Breaths/min',
            subtext: 'Resting eupneic cadence',
            target: '12-20 Normal',
            icon: Wind,
            bg: 'bg-indigo-600 text-white shadow-xs',
            cardBg: 'bg-gradient-to-br from-indigo-50/90 via-white to-violet-50/40',
            border: 'border-indigo-200/90 hover:border-indigo-400',
            bar: 'bg-gradient-to-r from-indigo-500 to-violet-600',
            pct: '80%',
          },
          {
            id: 'bio-hrv',
            title: 'HRV Rhythm',
            value: '62',
            unit: 'ms',
            subtext: 'R-R Interval autonomic balance',
            target: '> 50ms Recovery',
            icon: Zap,
            bg: 'bg-purple-600 text-white shadow-xs',
            cardBg: 'bg-gradient-to-br from-purple-50/90 via-white to-fuchsia-50/40',
            border: 'border-purple-200/90 hover:border-purple-400',
            bar: 'bg-gradient-to-r from-purple-500 to-fuchsia-600',
            pct: '85%',
          },
          {
            id: 'bio-bmi',
            title: 'Body Mass Index',
            value: `${vitals.bmi || 23.4}`,
            unit: 'BMI',
            subtext: `Weight: ${vitals.weightKg || 72}kg (${vitals.heightCm || 175}cm)`,
            target: '18.5 - 24.9',
            icon: ShieldCheck,
            bg: 'bg-teal-600 text-white shadow-xs',
            cardBg: 'bg-gradient-to-br from-teal-50/90 via-white to-emerald-50/40',
            border: 'border-teal-200/90 hover:border-teal-400',
            bar: 'bg-gradient-to-r from-teal-500 to-emerald-600',
            pct: '72%',
          },
          {
            id: 'bio-hydration',
            title: 'Daily Hydration',
            value: '2.4',
            unit: 'Liters',
            subtext: 'Target 2.8L daily water intake',
            target: '86% Achieved',
            icon: Droplet,
            bg: 'bg-sky-600 text-white shadow-xs',
            cardBg: 'bg-gradient-to-br from-sky-50/90 via-white to-blue-50/40',
            border: 'border-sky-200/90 hover:border-sky-400',
            bar: 'bg-gradient-to-r from-sky-500 to-blue-600',
            pct: '86%',
          },
          {
            id: 'bio-sleep',
            title: 'Sleep & Recovery',
            value: '8.2',
            unit: 'Hours',
            subtext: 'Deep & REM restful cycles',
            target: '92% Quality',
            icon: Moon,
            bg: 'bg-violet-600 text-white shadow-xs',
            cardBg: 'bg-gradient-to-br from-violet-50/90 via-white to-purple-50/40',
            border: 'border-violet-200/90 hover:border-violet-400',
            bar: 'bg-gradient-to-r from-violet-500 to-purple-600',
            pct: '92%',
          },
        ];

        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`p-1.5 rounded-xl ${theme.accentBg}`}>
                  <Activity className="w-4 h-4" />
                </span>
                <h2 className={`text-base font-black ${theme.cardTitleColor}`}>
                  Daily Clinical Biometrics
                </h2>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 border ${theme.accentBg} ${theme.cardBorder}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Auto-Scrolling &bull; Hover to Pause
                </span>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('account', 'ehr')}
                className={`px-3.5 py-1.5 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition active:scale-95 ${theme.consultBtn}`}
              >
                <span>Complete Medical EHR</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Continuous Automatic Horizontal Marquee */}
            <div className={`overflow-hidden w-full relative py-1 rounded-3xl border shadow-xs ${theme.marqueeBorder} ${theme.marqueeBg}`}>
              <div className="animate-scroll-rtl flex items-stretch gap-4 px-2 hover:[animation-play-state:paused]">
                {[...clinicalBiometricsList, ...clinicalBiometricsList, ...clinicalBiometricsList].map((bio, index) => {
                  const BioIcon = bio.icon;
                  return (
                    <div
                      key={`${bio.id}-${index}`}
                      onClick={() => onNavigate('account', 'ehr')}
                      className={`min-w-[240px] sm:min-w-[270px] max-w-[290px] shrink-0 rounded-3xl border p-4 shadow-xs hover:shadow-lg transition cursor-pointer space-y-3 group ${bio.cardBg} ${bio.border}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-xl ${bio.bg} flex items-center justify-center font-bold`}
                          >
                            <BioIcon className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-bold text-xs text-slate-800">{bio.title}</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-slate-700 border border-slate-200/80 shadow-2xs">
                          {bio.target}
                        </span>
                      </div>

                      <div>
                        <div className="text-2xl font-black text-slate-900 tracking-tight flex items-baseline gap-1.5 font-mono">
                          <span>{bio.value}</span>
                          <span className="text-xs text-slate-500 font-semibold">{bio.unit}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 truncate">{bio.subtext}</p>
                      </div>

                      <div className="w-full h-1.5 bg-slate-200/70 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${bio.bar} rounded-full transition-all duration-300`}
                          style={{ width: bio.pct }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* 2-Column Section: Doctor Visit & Pill Reminders with Theme Styling */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Doctor Visit Card */}
        <div className={`rounded-3xl border p-6 shadow-xs flex flex-col justify-between space-y-4 transition ${theme.cardBaseBg} ${theme.cardBorder} ${theme.cardHoverBorder}`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-2xl ${theme.accentBg} flex items-center justify-center font-bold`}>
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-sm font-black ${theme.cardTitleColor}`}>Upcoming Consultation</h3>
                <span className={`text-xs ${theme.subtextColor}`}>Telemedicine Video Encounter</span>
              </div>
            </div>
            {nextAppointment && (
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1 ${theme.accentBg} ${theme.cardBorder}`}>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Confirmed
              </span>
            )}
          </div>

          {nextAppointment ? (
            <div className="space-y-3.5">
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${theme.cardBorder} bg-gradient-to-r from-blue-50/40 via-indigo-50/20 to-white`}>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border-2 border-indigo-200 overflow-hidden shadow-xs shrink-0 relative">
                    <img
                      src={treatingDoctor?.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80"}
                      alt={nextAppointment.doctorName}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm sm:text-base">
                      {nextAppointment.doctorName}
                    </h4>
                    <p className={`text-xs font-bold ${theme.accentText}`}>
                      {nextAppointment.doctorSpecialization}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
                      <span className="flex items-center gap-1 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {nextAppointment.date}
                      </span>
                      <span className="flex items-center gap-1 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {nextAppointment.timeSlot}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => startConsultation(nextAppointment)}
                  className={`px-4 py-2.5 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto active:scale-95 ${theme.consultBtn}`}
                >
                  <Video className="w-4 h-4" />
                  <span>Join Video Room</span>
                </button>
              </div>

              <div className={`text-xs ${theme.subtextColor} flex items-center gap-1.5 p-2.5 rounded-xl border ${theme.cardBorder} bg-slate-50/60`}>
                <span className="font-bold text-slate-800">Reason:</span>
                <span>{nextAppointment.reason}</span>
              </div>
            </div>
          ) : (
            <div className={`p-4 rounded-2xl border border-dashed flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left ${theme.cardBorder} bg-slate-50/50`}>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border border-slate-200 shadow-2xs">
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=300&auto=format&fit=crop&q=80"
                  alt="Doctor with stethoscope consultation"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="text-xs font-bold text-slate-800">No Video Calls Scheduled Today</h4>
                <p className={`text-xs ${theme.subtextColor}`}>
                  Need clinical advice? Connect with top certified doctors via instant encrypted video room.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('doctors')}
                className={`mt-1 inline-flex items-center gap-1.5 px-3.5 py-2 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md active:scale-95 shrink-0 ${theme.consultBtn}`}
              >
                <span>Find Doctor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
            <span>
              Consultations: <strong className="text-slate-800">{appointments.length} Total</strong>
            </span>
            <button
              type="button"
              onClick={() => onNavigate('doctors')}
              className={`${theme.accentText} hover:underline font-bold cursor-pointer`}
            >
              See All Appointments &rarr;
            </button>
          </div>
        </div>

        {/* Today's Medication Schedule Card with Theme Styling */}
        <div className={`rounded-3xl border p-5 sm:p-7 shadow-xs space-y-6 transition-colors ${theme.cardBaseBg} ${theme.cardBorder} ${theme.cardHoverBorder}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Today's Medication</h3>
                <span className="text-xs text-slate-400">&bull;</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {takenDosesToday} of {totalDosesToday} taken
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentMainDose && !currentMainDose.isTaken
                  ? `Next up: ${currentMainDose.medicineName} at ${currentMainDose.time}`
                  : 'All daily doses completed'}
              </p>
            </div>

            {/* Call Reminder Switch */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setAutoCallEnabled(!autoCallEnabled)}
                  className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-medium cursor-pointer"
                  title="Toggle automatic phone calls when medication is due"
                >
                  <span
                    className={`w-2 h-2 rounded-full transition-colors ${
                      autoCallEnabled ? 'bg-emerald-500 ring-2 ring-emerald-100' : 'bg-slate-300'
                    }`}
                  />
                  <span>Call Reminders: <strong>{autoCallEnabled ? 'On' : 'Off'}</strong></span>
                </button>

                {autoCallEnabled && (
                  <>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (autoTestCountdown !== null) {
                          setAutoTestCountdown(null);
                        } else {
                          setAutoTestCountdown(3);
                        }
                      }}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer text-[11px]"
                      title="Test automated phone call"
                    >
                      {autoTestCountdown !== null ? `Calling in ${autoTestCountdown}s...` : 'Test Call'}
                    </button>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => onNavigate('account', 'pills')}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                title="Manage all pill reminders"
              >
                <BellRing className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Snooze notice if active */}
          {snoozeNotice && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 px-3.5 py-2.5 rounded-2xl text-xs font-medium flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>{snoozeNotice}</span>
              </span>
              <button
                type="button"
                onClick={() => setSnoozeNotice(null)}
                className="text-amber-700 hover:text-amber-900 text-xs font-bold cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Focused Active Dose Hero */}
          {currentMainDose ? (
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Authentic Pill Photo in Pill Symbol Box */}
                  <div
                    onClick={() => setShowPillPhotoModal(currentMainDose)}
                    className="relative group cursor-pointer shrink-0"
                    title={`Inspect verified pill photo for ${currentMainDose.medicineName}`}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border-2 border-slate-200/90 overflow-hidden shadow-xs relative flex items-center justify-center group-hover:border-indigo-500 group-hover:shadow-md transition">
                      <img
                        src={currentMainDose.pillImageUrl}
                        alt={`${currentMainDose.medicineName} tablet photo`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                        <Maximize2 className="w-5 h-5 drop-shadow" />
                        <span className="text-[10px] font-bold mt-0.5">Inspect</span>
                      </div>
                      {currentMainDose.isTaken && (
                        <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[0.5px] flex items-center justify-center">
                          <Check className="w-7 h-7 text-white stroke-[3] drop-shadow-md" />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-semibold text-indigo-600 flex items-center justify-center gap-1 mt-1 group-hover:underline">
                      <Eye className="w-3 h-3" /> Pill Photo
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-0.5">
                      <span className="font-mono font-bold text-slate-800">{currentMainDose.time}</span>
                      <span aria-hidden="true">&bull;</span>
                      <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.2 rounded">
                        {currentMainDose.pillVisual.slotName}
                      </span>
                      <span aria-hidden="true">&bull;</span>
                      <span className={currentMainDose.isTaken ? 'text-emerald-700 font-bold bg-emerald-50 px-2 py-0.2 rounded' : 'text-amber-700 font-bold bg-amber-50 px-2 py-0.2 rounded'}>
                        {currentMainDose.isTaken ? 'Dose Taken ✓' : 'Scheduled / Due'}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-slate-900 tracking-tight">
                      {currentMainDose.medicineName}
                    </h4>

                    <p className="text-xs text-slate-600 mt-0.5">
                      {currentMainDose.dosage} &bull; {currentMainDose.frequency}
                    </p>
                  </div>
                </div>

                {/* Status indicator */}
                {currentMainDose.isTaken ? (
                  <span className="self-start text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    Verified Taken
                  </span>
                ) : (
                  <span className="self-start text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-full px-3 py-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    Due at {currentMainDose.time}
                  </span>
                )}
              </div>

              {/* Instructions and Tablet Markings in clean, natural prose */}
              <div className="bg-white rounded-xl p-4 border border-slate-200/70 text-xs text-slate-700 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
                  <div>
                    <span className="font-semibold text-slate-900 block">How to take:</span>
                    <span className="text-slate-600">{currentMainDose.instructions}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPillPhotoModal(currentMainDose)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer self-start sm:self-auto shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Pill Photo ({currentMainDose.pillImprint})</span>
                  </button>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-0.5 flex-wrap">
                  <span><strong>Appearance:</strong> {currentMainDose.tabletColor}, {currentMainDose.tabletShape}</span>
                  <span>&bull;</span>
                  <span><strong>Imprint:</strong> <span className="font-mono text-slate-800 font-bold bg-slate-100 px-1.5 py-0.5 rounded">{currentMainDose.pillImprint}</span></span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    playPopSound();
                    markPillTaken(currentMainDose.pillId, currentMainDose.time);
                  }}
                  className={`flex-1 py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-md active:scale-95 flex items-center justify-center gap-2 ${
                    currentMainDose.isTaken
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700'
                      : theme.consultBtn
                  }`}
                >
                  {currentMainDose.isTaken ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3] text-white" />
                      <span>Verified Taken</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Mark as Taken</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => triggerReminderCall(currentMainDose)}
                  className="py-3 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
                  title="Receive an instant automated phone call reminder"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
                  <span>Call Reminder</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
              <p>No medications scheduled for today.</p>
            </div>
          )}

          {/* Simple expandable summary drawer */}
          <div className="border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => setShowAllPillsExpanded(!showAllPillsExpanded)}
              className="w-full text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center justify-between cursor-pointer py-1"
            >
              <span>View full schedule for today ({sortedTodayDoses.length} doses total)</span>
              {showAllPillsExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {showAllPillsExpanded && (
              <div className="mt-3 space-y-2 max-h-56 overflow-y-auto pr-1">
                {sortedTodayDoses.map((dose, idx) => (
                  <div
                    key={`all-${dose.pillId}-${dose.time}-${idx}`}
                    className="p-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold text-slate-600">
                        {dose.time}
                      </span>
                      <div>
                        <span className="font-semibold text-slate-900 block">{dose.medicineName}</span>
                        <span className="text-[11px] text-slate-500">{dose.dosage} &bull; {dose.pillVisual.slotName} ({dose.instructions})</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        playPopSound();
                        markPillTaken(dose.pillId, dose.time);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition ${
                        dose.isTaken
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-2xs'
                      }`}
                    >
                      {dose.isTaken ? 'Taken ✓' : 'Mark Taken'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Patient Diet Plans & Daily Exercise: AI Wellness Module */}
      <AIWellnessModule />

      {/* Certified Specialist Doctors Carousel with Automatic Scrolling */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-base font-black flex items-center gap-2 ${theme.cardTitleColor}`}>
              <Stethoscope className={`w-5 h-5 ${theme.accentText}`} />
              Certified Specialist Doctors
            </h2>
            <p className={`text-xs ${theme.subtextColor}`}>
              Browse top verified clinicians across India with clear fees in Indian Rupees (₹ INR)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 border ${theme.accentBg} ${theme.cardBorder}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Auto-Scrolling &bull; Hover to Pause
            </span>

            <button
              type="button"
              onClick={() => onNavigate('doctors')}
              className={`px-3 py-1.5 rounded-xl text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-md transition active:scale-95 ${theme.consultBtn}`}
            >
              <span>View All ({doctors.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Automatic Continuous Scrolling from Right to Left */}
        <div className={`overflow-hidden w-full relative py-1 rounded-3xl border shadow-xs ${theme.marqueeBorder} ${theme.marqueeBg}`}>
          <div className="animate-scroll-rtl-slow flex items-stretch gap-4 px-2 hover:[animation-play-state:paused]">
            {[...doctors, ...doctors, ...doctors].map((doc, index) => (
              <div
                key={`${doc.id}-${index}`}
                className={`min-w-[280px] sm:min-w-[320px] max-w-[340px] shrink-0 rounded-3xl border p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-lg transition group ${theme.cardBaseBg} ${theme.cardBorder} ${theme.cardHoverBorder}`}
              >
                <div>
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={doc.avatar}
                        alt={doc.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                      />
                      <span
                        className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"
                        title="Available today"
                      />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition">
                        {doc.name}
                      </h3>
                      <span className={`text-xs font-semibold block ${theme.accentText}`}>
                        {doc.specialization}
                      </span>
                      <span className="text-[11px] text-slate-500 block truncate max-w-[180px]">
                        {doc.hospital}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-700 bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-1 font-bold">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{doc.rating}</span>
                      <span className="text-slate-400 font-normal">({doc.reviewCount})</span>
                    </div>
                    <div className="font-black text-slate-900">
                      Fee: ₹{doc.fee} INR
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Available Today
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectDoctorToBook) {
                        onSelectDoctorToBook(doc);
                      } else {
                        onNavigate('doctors');
                      }
                    }}
                    className={`px-4 py-2 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer active:scale-95 ${theme.consultBtn}`}
                  >
                    Book Doctor
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MedNexa Clinical Wellness Advisory - Dynamic Radiant Healthcare Card */}
      <div className={`rounded-3xl p-5 sm:p-6 shadow-md flex items-center gap-4 border transition-all duration-300 ${theme.advisoryGradient} ${theme.advisoryBorder}`}>
        <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md text-white flex items-center justify-center shrink-0 shadow-inner text-2xl border border-white/20">
          🛡️
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`font-black text-sm block ${theme.advisoryText}`}>
              MedNexa Clinical Wellness Advisory
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/15 text-white border border-white/20">
              Evidence-Based Care
            </span>
          </div>
          <p className="text-white/90 leading-relaxed font-medium">
            Maintain adequate hydration (2.5L daily), limit dietary sodium to under 2,000 mg, and walk 25 minutes after meals for optimal cardiovascular and glycemic health.
          </p>
        </div>
      </div>

      {/* Emergency Helpline Modal with Verified Working SOS Numbers - Responsive to screen size */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.15 }}
            className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200/90 max-h-[94vh] sm:max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Sticky Header */}
            <div className="shrink-0 p-4 sm:px-6 sm:py-4 border-b border-slate-200/90 bg-white flex items-center justify-between gap-2.5 z-10">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shadow-xs shrink-0">
                  <AlertTriangle className="w-5 h-5 animate-pulse" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">National Emergency SOS Desk</h3>
                  <span className="text-[11px] sm:text-xs text-slate-500 block truncate">24/7 Verified Indian Emergency Helplines</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSosModal(false)}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition cursor-pointer shrink-0"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-6 sm:py-4 space-y-3 text-xs overscroll-contain">
              {dialFeedback && (
                <div className="p-3 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{dialFeedback}</span>
                </div>
              )}

              {/* Primary 112 Helpline */}
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-black text-rose-950 text-sm block flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                    National Emergency Helpline (112)
                  </span>
                  <span className="text-rose-700 text-[11px] block mt-0.5">
                    Unified 24x7 emergency response for Police, Fire &amp; Medical dispatch
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCallEmergency('112', 'National Emergency')}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black shadow-md transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call 112</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('112');
                      setDialFeedback('Copied 112 to clipboard!');
                    }}
                    className="p-2 bg-white hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-xl transition cursor-pointer"
                    title="Copy 112"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 108 Ambulance */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-slate-900 block text-xs sm:text-sm">
                    Ambulance Emergency (108)
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Free 24x7 Medical and trauma emergency dispatch
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCallEmergency('108', 'Ambulance Emergency')}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition active:scale-95 flex items-center gap-1 cursor-pointer"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Call 108</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('108');
                      setDialFeedback('Copied 108 to clipboard!');
                    }}
                    className="p-1.5 bg-white text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                    title="Copy 108"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* 102 Maternity Ambulance */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-slate-900 block text-xs sm:text-sm">
                    Maternity &amp; Infant Transport (102)
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Free pregnancy and neonatal emergency transit
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCallEmergency('102', 'Maternity Emergency')}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition active:scale-95 flex items-center gap-1 cursor-pointer"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Call 102</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('102');
                      setDialFeedback('Copied 102 to clipboard!');
                    }}
                    className="p-1.5 bg-white text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                    title="Copy 102"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Toll-free Ministry of Health */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-slate-900 block text-xs sm:text-sm">
                    National Health Helpline
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Toll-Free Ministry of Health &amp; Family Welfare
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCallEmergency('18001801104', 'Ministry of Health')}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition active:scale-95 cursor-pointer font-mono"
                  >
                    1800-180-1104
                  </button>
                </div>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="shrink-0 px-4 py-3 sm:px-6 sm:py-3.5 border-t border-slate-200 bg-slate-50/95 flex items-center justify-between gap-3 z-10">
              <span className="text-[11px] text-slate-500 truncate">
                Direct telephony dispatch &bull; Instant carrier dialing
              </span>
              <button
                type="button"
                onClick={() => setShowSosModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer shrink-0"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Prescription Photo Scanner Modal from Home */}
      {showRxScannerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 my-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Camera className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Upload Rx Photo / Camera Scanner</h3>
                  <span className="text-xs text-slate-500">
                    Take a live camera picture or upload prescription file to auto-extract medicines
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRxScannerModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <PrescriptionPhotoScanner
              onProceedToCart={() => {
                setShowRxScannerModal(false);
                onNavigate('shopping', 'cart');
              }}
              onClose={() => setShowRxScannerModal(false)}
            />
          </div>
        </div>
      )}

      {/* Automated Incoming Pill Reminder Call Modal */}
      {incomingCallDose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-700/80 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden space-y-5">
            {/* Background glowing rings */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

            {/* Caller Header */}
            <div className="text-center space-y-2 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>MedNexa Care Desk</span>
              </div>

              <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-800 border border-slate-700 text-white flex items-center justify-center shadow-lg relative my-3">
                {callStatus === 'ringing' ? (
                  <PhoneIncoming className="w-9 h-9 animate-bounce text-emerald-400" />
                ) : (
                  <Volume2 className="w-9 h-9 animate-pulse text-indigo-400" />
                )}
                {callStatus === 'ringing' && (
                  <span className="absolute -inset-2 rounded-3xl border-2 border-emerald-400/40 animate-ping" />
                )}
              </div>

              <h3 className="text-xl font-bold tracking-tight text-white">
                {callStatus === 'ringing' ? 'Medication Reminder Call' : 'Call Connected'}
              </h3>

              <div className="text-xs text-slate-300">
                {callStatus === 'ringing' ? (
                  <span className="text-emerald-400 font-medium animate-pulse">
                    Incoming call &bull; Scheduled dose
                  </span>
                ) : (
                  <span className="text-slate-400 font-mono">
                    00:{callDuration < 10 ? `0${callDuration}` : callDuration}
                  </span>
                )}
              </div>
            </div>

            {/* Medicine Briefing Card with Named Pill Photo */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 text-xs space-y-3 relative z-10">
              <div className="flex items-center gap-3">
                <img
                  src={incomingCallDose.pillImageUrl}
                  alt={incomingCallDose.medicineName}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-600 shrink-0 shadow-xs"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Scheduled Dose</span>
                    <span className="text-indigo-300 font-mono font-medium">{incomingCallDose.time}</span>
                  </div>
                  <div className="text-base font-bold text-white truncate">
                    {incomingCallDose.medicineName}
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    {incomingCallDose.dosage} &bull; {incomingCallDose.frequency}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/60 text-slate-300 text-xs leading-relaxed">
                <span className="text-slate-400 block mb-0.5 font-medium">Instructions:</span>
                <span>{incomingCallDose.instructions}. Take with a full glass of water.</span>
              </div>
            </div>

            {/* Call State Controls */}
            {callStatus === 'ringing' ? (
              <div className="flex items-center justify-center gap-4 relative z-10 pt-2">
                {/* Decline / Snooze */}
                <button
                  type="button"
                  onClick={handleSnoozeCall}
                  className="flex-1 py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Snooze 10m</span>
                </button>

                {/* Answer Call */}
                <button
                  type="button"
                  onClick={() => handleAnswerCall(incomingCallDose)}
                  className="flex-1 py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/40 animate-pulse transition cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Answer Call</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 relative z-10 pt-2">
                {/* Confirm Pill Taken */}
                <button
                  type="button"
                  onClick={() => handleConfirmTakenInCall(incomingCallDose.pillId, incomingCallDose.time)}
                  className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 transition cursor-pointer"
                >
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>I Have Taken This Pill Now ✓</span>
                </button>

                {/* End Call */}
                <button
                  type="button"
                  onClick={handleEndCall}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-rose-950/40 border border-slate-700/60 hover:border-rose-700/60 text-slate-400 hover:text-rose-400 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <PhoneOff className="w-3.5 h-3.5" />
                  <span>End Reminder Call</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pill Photo & Visual Verification Lightbox Modal - Responsive to screen size */}
      {showPillPhotoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/90 max-h-[94vh] sm:max-h-[90vh] flex flex-col overflow-hidden">
            {/* Sticky Header */}
            <div className="shrink-0 p-4 sm:px-6 sm:py-4 border-b border-slate-100 bg-white flex items-center justify-between gap-3 z-10">
              <div className="min-w-0">
                <span className="text-[10px] sm:text-[11px] font-semibold text-indigo-600 uppercase tracking-wider block">
                  Pill Visual Identification
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                  {showPillPhotoModal.medicineName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPillPhotoModal(null)}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer shrink-0"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-6 sm:py-5 space-y-4 text-xs overscroll-contain">
              {/* High-Resolution Pill Photo */}
              <div className="w-full h-48 sm:h-56 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative shadow-inner">
                <img
                  src={showPillPhotoModal.pillImageUrl}
                  alt={showPillPhotoModal.medicineName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] px-2.5 py-0.5 rounded-full font-medium">
                  Verified Packaging &bull; {showPillPhotoModal.dosage}
                </div>
              </div>

              {/* Visual Identification Characteristics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Tablet Color</span>
                  <span className="font-semibold text-slate-900">{showPillPhotoModal.tabletColor}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Tablet Shape</span>
                  <span className="font-semibold text-slate-900">{showPillPhotoModal.tabletShape}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Tablet Imprint / Score</span>
                  <span className="font-semibold text-slate-900 font-mono">{showPillPhotoModal.pillImprint}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Clinical Instructions</span>
                  <span className="font-semibold text-slate-900 truncate block">{showPillPhotoModal.instructions}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                💡 <strong>Safety Check:</strong> Compare your physical tablet with this reference image and imprint before swallowing.
              </p>
            </div>

            {/* Sticky Footer */}
            <div className="shrink-0 px-4 py-3 sm:px-6 sm:py-3.5 border-t border-slate-200 bg-slate-50/95 flex items-center gap-3 z-10">
              <button
                type="button"
                onClick={() => setShowPillPhotoModal(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  playPopSound();
                  markPillTaken(showPillPhotoModal.pillId, showPillPhotoModal.time);
                  setShowPillPhotoModal(null);
                }}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition cursor-pointer shadow-xs active:scale-95"
              >
                {showPillPhotoModal.isTaken ? 'Mark as Pending' : 'Mark as Taken ✓'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
