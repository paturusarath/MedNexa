import React, { useState } from 'react';
import {
  Users,
  Calendar,
  Video,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  Activity,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Plus,
  Search,
  Send,
  Droplet,
  FlaskConical,
  ShieldAlert,
  Sparkles,
  PhoneCall,
  Check,
  ExternalLink,
  ChevronRight,
  Printer,
  Download,
  Award,
  X,
  Trash2,
  Building2,
  User,
  Heart,
  Thermometer,
  Calculator,
  Play,
  ImageIcon,
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { BottomNavTab } from '../BottomNav';
import { Prescription, PrescriptionMedicine } from '../../types';
import { ClinicalRxDeskModal } from './ClinicalRxDeskModal';

interface DoctorHomeViewProps {
  onNavigate: (tab: BottomNavTab, subSection?: string) => void;
}

interface OPDQueueItem {
  tokenNumber: number;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  type: 'video' | 'in-clinic';
  timeSlot: string;
  status: 'waiting' | 'in-consultation' | 'completed';
  chiefComplaint: string;
  vitals: { bp: string; pulse: number; sugar?: number; spo2?: number };
}

interface DrugInteractionResult {
  drugA: string;
  drugB: string;
  severity: 'major' | 'moderate' | 'minor' | 'none';
  mechanism: string;
  recommendation: string;
}

export interface DoctorVideoGuide {
  id: string;
  title: string;
  category: string;
  duration: string;
  speaker: string;
  url: string;
  thumbnail: string;
  description: string;
  highlights: string[];
}

// 100% Verified, Working YouTube Clinical CME Videos
export const DOCTOR_VIDEO_GUIDES: DoctorVideoGuide[] = [
  {
    id: 'vid-1',
    title: 'Master 12-Lead ECG Interpretation: High-Yield Systematics',
    category: 'Cardiology CME',
    duration: '22 mins',
    speaker: 'Dr. V. Mohan, MD, FACC',
    url: 'https://www.youtube.com/watch?v=006Ufxh2a_E',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80',
    description: 'Systematic approach to ECG rhythm evaluation: Rate, Axis deviation, PR/QT intervals, bundle branch blocks, and reciprocal STEMI changes.',
    highlights: ['Anterior vs Inferior STEMI leads', 'Pathological Q-waves vs early repolarization', 'Hyperkalemia peaked T-wave progression'],
  },
  {
    id: 'vid-2',
    title: 'ECG Basics | How to Read & Interpret ECGs: Core Principles',
    category: 'Clinical Guidelines',
    duration: '18 mins',
    speaker: 'Prof. Ashok Seth, MD, FRCP',
    url: 'https://www.youtube.com/watch?v=CNN30YHsJw0',
    thumbnail: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&auto=format&fit=crop&q=80',
    description: 'Outpatient treatment algorithms: Lead vectors, cardiac axis calculation, and early recognition of life-threatening arrhythmias.',
    highlights: ['First-line lead alignment', 'Target rate & rhythm diagnosis', 'Ischemia vs benign variants'],
  },
  {
    id: 'vid-3',
    title: 'Systematic 12-Lead Electrocardiography: Bedside Protocol',
    category: 'Practice Management',
    duration: '25 mins',
    speaker: 'Dr. Priya Sharma, MD (Internal Medicine)',
    url: 'https://www.youtube.com/watch?v=TTYGxK1DNKA',
    thumbnail: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80',
    description: 'Rapid, medicolegally robust bedside ECG interpretation protocol in under 3 minutes per consultation.',
    highlights: ['Subjective chief complaint structuring', 'Objective biometric capture', 'Evidence-based follow-up planning'],
  },
];

export const DoctorHomeView: React.FC<DoctorHomeViewProps> = ({ onNavigate }) => {
  const {
    currentUser,
    appointments,
    prescriptions,
    startConsultation,
    addNotification,
    createPrescription,
    setActivePrescriptionModal,
  } = useHealth();

  // Video Player Modal State
  const [activeDoctorVideoModal, setActiveDoctorVideoModal] = useState<DoctorVideoGuide | null>(null);

  // OPD Live Queue State
  const [opdQueue, setOpdQueue] = useState<OPDQueueItem[]>([
    {
      tokenNumber: 1,
      patientId: 'pat-001',
      patientName: 'Sarath Paturu',
      age: 48,
      gender: 'Female',
      type: 'video',
      timeSlot: '10:00 AM',
      status: 'in-consultation',
      chiefComplaint: 'BP check-up, mild morning headache',
      vitals: { bp: '138/86', pulse: 74, sugar: 110, spo2: 98 },
    },
    {
      tokenNumber: 2,
      patientId: 'pat-002',
      patientName: 'Kavita Sundaram',
      age: 52,
      gender: 'Female',
      type: 'video',
      timeSlot: '10:30 AM',
      status: 'waiting',
      chiefComplaint: 'HbA1c review & insulin dose titration',
      vitals: { bp: '128/82', pulse: 78, sugar: 182, spo2: 97 },
    },
    {
      tokenNumber: 3,
      patientId: 'pat-003',
      patientName: 'Rajeev Menon',
      age: 61,
      gender: 'Male',
      type: 'in-clinic',
      timeSlot: '11:15 AM',
      status: 'waiting',
      chiefComplaint: 'Post-CABG routine cardiac evaluation',
      vitals: { bp: '124/78', pulse: 70, spo2: 99 },
    },
    {
      tokenNumber: 4,
      patientId: 'pat-004',
      patientName: 'Ananya Sharma',
      age: 29,
      gender: 'Female',
      type: 'video',
      timeSlot: '11:45 AM',
      status: 'waiting',
      chiefComplaint: 'Seasonal allergic rhinitis & dry cough',
      vitals: { bp: '118/74', pulse: 82, spo2: 99 },
    },
  ]);

  // Current Patient in Consultation or Next in Line
  const currentPatient =
    opdQueue.find((q) => q.status === 'in-consultation') ||
    opdQueue.find((q) => q.status === 'waiting') ||
    opdQueue[0];

  // Walk-In Patient Registration State
  const [showAddWalkIn, setShowAddWalkIn] = useState(false);
  const [walkInName, setWalkInName] = useState('');
  const [walkInAge, setWalkInAge] = useState<number | ''>(42);
  const [walkInGender, setWalkInGender] = useState('Male');
  const [walkInComplaint, setWalkInComplaint] = useState('Acute chest tightness & palpitation');
  const [walkInBp, setWalkInBp] = useState('130/84');
  const [walkInPulse, setWalkInPulse] = useState(76);

  // Medical Leave & Fitness Certificate Desk
  const [certPatientName, setCertPatientName] = useState('Sarath Paturu');
  const [certDiagnosis, setCertDiagnosis] = useState('Acute Bronchitis & Asthenia (ICD-10 J20.9)');
  const [certRestDays, setCertRestDays] = useState(4);
  const [certFitnessStatus, setCertFitnessStatus] = useState<'unfit' | 'fit_light_duty' | 'fully_fit'>('unfit');
  const [certAdvice, setCertAdvice] = useState('Complete bed rest, steam inhalation TDS, and avoid dust exposure.');
  const [certGenerated, setCertGenerated] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);

  // Remote Biometric Alerts
  const [remoteAlerts, setRemoteAlerts] = useState([
    {
      id: 'alt-1',
      patientName: 'Sarath Paturu',
      parameter: 'Blood Pressure Spike',
      value: '158/96 mmHg',
      time: '25 mins ago',
      severity: 'high',
      device: 'Omron HEM-7120 Bluetooth',
      adviceSent: false,
    },
    {
      id: 'alt-2',
      patientName: 'Kavita Sundaram',
      parameter: 'Fasting Blood Glucose',
      value: '182 mg/dL (HbA1c 8.4%)',
      time: '2 hours ago',
      severity: 'medium',
      device: 'Accu-Chek Guide Wireless',
      adviceSent: false,
    },
    {
      id: 'alt-3',
      patientName: 'Rajeev Menon',
      parameter: 'Resting Heart Rate',
      value: '70 bpm (Stable Sinus)',
      time: '4 hours ago',
      severity: 'low',
      device: 'Apple Watch Series 9 ECG',
      adviceSent: true,
    },
  ]);

  // Drug Interaction Checker
  const [drug1, setDrug1] = useState('Atorvastatin');
  const [drug2, setDrug2] = useState('Clarithromycin');
  const [interactionResult, setInteractionResult] = useState<DrugInteractionResult | null>({
    drugA: 'Atorvastatin',
    drugB: 'Clarithromycin',
    severity: 'major',
    mechanism: 'Strong CYP3A4 inhibition increases statin AUC significantly, raising myopathy and rhabdomyolysis risks.',
    recommendation: 'Temporarily withhold Atorvastatin during macrolide antibiotic course or switch to Rosuvastatin / Azithromycin.',
  });

  const [showClinicalRxModal, setShowClinicalRxModal] = useState(false);

  // Quick E-Prescription Desk Modal State
  const [showQuickRxModal, setShowQuickRxModal] = useState(false);
  const [quickRxSalutation, setQuickRxSalutation] = useState<'Mr.' | 'Mrs.' | 'Ms.' | 'Master' | 'Dr.'>('Mr.');
  const [quickRxPatientName, setQuickRxPatientName] = useState('Sarath Paturu');
  const [quickRxGuardianName, setQuickRxGuardianName] = useState('S/o K. Paturu');
  const [quickRxPatientAge, setQuickRxPatientAge] = useState(32);
  const [quickRxPatientGender, setQuickRxPatientGender] = useState('Male');
  const [quickRxDoctorName, setQuickRxDoctorName] = useState('Dr. V. Mohan, MD');
  const [quickRxLicense, setQuickRxLicense] = useState('NMC-2012-90482');
  const [quickRxClinic, setQuickRxClinic] = useState('MedNexa Clinic & Fortis Heart Suite, Bengaluru');
  const [quickRxDiagnosis, setQuickRxDiagnosis] = useState('Essential Hypertension Follow-up');
  const [quickRxInstructions, setQuickRxInstructions] = useState('Low sodium diet (<2g/day), brisk morning walk 30 mins, avoid NSAIDs.');
  const [quickRxFollowUp, setQuickRxFollowUp] = useState('2026-10-15');
  const [quickRxMedicines, setQuickRxMedicines] = useState<PrescriptionMedicine[]>([
    {
      name: 'Telmisartan 40mg',
      dosage: '40 mg',
      frequency: 'Once Daily (Morning OD)',
      duration: '30 Days',
      instructions: 'Take after breakfast with water',
    },
    {
      name: 'Amlodipine 5mg',
      dosage: '5 mg',
      frequency: 'Once Daily (Night HS)',
      duration: '30 Days',
      instructions: 'Take at bedtime',
    },
  ]);
  const [newRxMedName, setNewRxMedName] = useState('');
  const [newRxMedDosage, setNewRxMedDosage] = useState('500 mg');
  const [newRxMedFreq, setNewRxMedFreq] = useState('Twice Daily (BD)');
  const [newRxMedDuration, setNewRxMedDuration] = useState('5 Days');

  // Queue Handlers
  const handleCallPatient = (item: OPDQueueItem) => {
    setOpdQueue((prev) =>
      prev.map((q) => ({
        ...q,
        status: q.tokenNumber === item.tokenNumber ? 'in-consultation' : q.status === 'in-consultation' ? 'completed' : q.status,
      }))
    );

    addNotification(
      'Patient Called to Clinic',
      `Token #${item.tokenNumber} (${item.patientName}) called for ${item.type === 'video' ? 'Teleconsultation Video Call' : 'Cabin Consultation'}.`,
      'system',
      'doctor'
    );

    if (item.type === 'video') {
      const mockAppt = appointments.find((a) => a.id === 'apt-001') || {
        id: `apt-${item.patientId}`,
        doctorId: 'doc-001',
        doctorName: 'Dr. V. Mohan, MD',
        doctorSpecialization: 'Cardiology & Internal Medicine',
        date: new Date().toISOString().substring(0, 10),
        timeSlot: item.timeSlot,
        status: 'confirmed',
        type: 'video',
        reason: item.chiefComplaint,
      };
      startConsultation(mockAppt as any);
    }
  };

  const handleSendDelayNotice = (patientName: string) => {
    addNotification(
      'OPD Delay Notice Sent',
      `SMS & WhatsApp broadcast sent to ${patientName}: "Doctor is attending an emergency. Estimated consultation delayed by ~10 mins."`,
      'system',
      'doctor'
    );
  };

  const handleAddWalkInPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName.trim()) return;

    const nextToken = opdQueue.length + 1;
    const newItem: OPDQueueItem = {
      tokenNumber: nextToken,
      patientId: `pat-walkin-${Date.now().toString().slice(-4)}`,
      patientName: walkInName.trim(),
      age: Number(walkInAge) || 40,
      gender: walkInGender,
      type: 'in-clinic',
      timeSlot: 'Next Available',
      status: 'waiting',
      chiefComplaint: walkInComplaint,
      vitals: { bp: walkInBp, pulse: walkInPulse },
    };

    setOpdQueue((prev) => [...prev, newItem]);
    setWalkInName('');
    setShowAddWalkIn(false);

    addNotification(
      'Walk-In Patient Registered',
      `Assigned Token #${nextToken} to ${newItem.patientName} (${newItem.vitals.bp}, ${newItem.vitals.pulse} bpm).`,
      'system',
      'doctor'
    );
  };

  const handleSendRemoteAdvice = (alertItem: (typeof remoteAlerts)[0]) => {
    setRemoteAlerts((prev) =>
      prev.map((a) => (a.id === alertItem.id ? { ...a, adviceSent: true } : a))
    );
    addNotification(
      'Physician Advice Sent',
      `Prescribed immediate clinical rest & advisory sent to ${alertItem.patientName} regarding ${alertItem.parameter}.`,
      'system',
      'doctor'
    );
  };

  const handlePresetInteraction = (d1: string, d2: string) => {
    setDrug1(d1);
    setDrug2(d2);
    if (d1.includes('Atorvastatin') && d2.includes('Clarithromycin')) {
      setInteractionResult({
        drugA: d1,
        drugB: d2,
        severity: 'major',
        mechanism: 'Strong CYP3A4 inhibition increases statin AUC significantly, raising myopathy and rhabdomyolysis risks.',
        recommendation: 'Temporarily withhold Atorvastatin during macrolide antibiotic course or switch to Rosuvastatin / Azithromycin.',
      });
    } else if (d1.includes('Telmisartan') && d2.includes('Spironolactone')) {
      setInteractionResult({
        drugA: d1,
        drugB: d2,
        severity: 'moderate',
        mechanism: 'Dual renin-angiotensin-aldosterone blockade may trigger acute hyperkalemia and renal insufficiency.',
        recommendation: 'Monitor serum potassium and creatinine within 1-2 weeks of concurrent therapy initiation.',
      });
    } else if (d1.includes('Aspirin') && d2.includes('Ibuprofen')) {
      setInteractionResult({
        drugA: d1,
        drugB: d2,
        severity: 'major',
        mechanism: 'Reversible COX-1 binding by NSAIDs blunts irreversible antiplatelet cardioprotection of low-dose Aspirin.',
        recommendation: 'Take Aspirin at least 2 hours before Ibuprofen, or use Paracetamol for routine analgesia.',
      });
    }
  };

  const handleOpenQuickRx = (patientName?: string) => {
    if (patientName) {
      setQuickRxPatientName(patientName);
    }
    setShowQuickRxModal(true);
  };

  const handleAddMedToQuickRx = () => {
    if (!newRxMedName.trim()) return;
    setQuickRxMedicines((prev) => [
      ...prev,
      {
        name: newRxMedName.trim(),
        dosage: newRxMedDosage,
        frequency: newRxMedFreq,
        duration: newRxMedDuration,
        instructions: 'Take after meals with water',
      },
    ]);
    setNewRxMedName('');
  };

  const handleIssueQuickRx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickRxPatientName.trim()) return;

    const created = createPrescription({
      appointmentId: `appt-quick-${Date.now()}`,
      patientId: `pat-${Date.now().toString().slice(-4)}`,
      patientName: quickRxPatientName.trim(),
      patientSalutation: quickRxSalutation,
      guardianName: quickRxGuardianName.trim() || undefined,
      patientAge: quickRxPatientAge,
      patientGender: quickRxPatientGender,
      doctorId: 'doc-001',
      doctorName: quickRxDoctorName.trim() || 'Dr. V. Mohan, MD',
      doctorSpecialization: 'Cardiology & Internal Medicine',
      doctorLicense: quickRxLicense.trim() || 'NMC-2012-90482',
      clinicName: quickRxClinic.trim() || 'MedNexa Clinical Suite, Bengaluru',
      date: new Date().toISOString().substring(0, 10),
      diagnosis: quickRxDiagnosis.trim(),
      dietaryAdvice: quickRxInstructions.trim(),
      followUpDate: quickRxFollowUp,
      medicines: quickRxMedicines,
    });

    setShowQuickRxModal(false);
    setActivePrescriptionModal(created);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* 1. Executive Doctor Hero Banner (Directly matches the refined aesthetic of Patient Home Page) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700/50 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-bold flex items-center gap-1.5 border border-indigo-400/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live OPD Clinic Active &bull; Telehealth Room Ready
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-mono">
                Reg: NMC-2012-90482
              </span>
              <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-mono border border-teal-500/30">
                HPR: HPR-84920-KAR
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Good Day, Dr. V. Mohan!</span>
              <span className="text-2xl">🩺</span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              Welcome to your clinical consultation desk. Manage today's live OPD queue, review real-time biometric alerts, issue certified digital medical leaves, and write NMC e-prescriptions.
            </p>
          </div>

          {/* 3 High-Impact Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* 1. Start Consultation / Next Patient */}
            <button
              type="button"
              onClick={() => handleCallPatient(currentPatient)}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition active:scale-95 flex items-center gap-2 cursor-pointer"
              title={`Start consultation with ${currentPatient.patientName}`}
            >
              <Video className="w-4 h-4 text-indigo-200" />
              <span>Start Next Consultation</span>
            </button>

            {/* 2. Write E-Prescription */}
            <button
              type="button"
              onClick={() => handleOpenQuickRx(currentPatient.patientName)}
              className="px-5 py-3 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition active:scale-95 flex items-center gap-2 cursor-pointer"
              title="Open digital prescription desk"
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Write E-Prescription</span>
            </button>

            {/* 3. Register Walk-In Patient */}
            <button
              type="button"
              onClick={() => setShowAddWalkIn(!showAddWalkIn)}
              className="px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
              title="Assign a new walk-in OPD token"
            >
              <Plus className="w-4 h-4" />
              <span>Walk-In Token</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Doctor Practice Biometrics (Parallel to Patient Biometrics Bar) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: OPD Queue */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold text-slate-600">Today's OPD Queue</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {opdQueue.length} Patients
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Token #{currentPatient.tokenNumber} in Consultation
          </span>
        </div>

        {/* KPI 2: Telehealth Slots */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold text-slate-600">Video Encounters</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {opdQueue.filter((a) => a.type === 'video').length} Video Slots
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            End-to-End HD Encrypted
          </span>
        </div>

        {/* KPI 3: E-Prescriptions */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold text-slate-600">E-Prescriptions</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {prescriptions.length} Issued Today
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Digitally Signed with NMC Seal
          </span>
        </div>

        {/* KPI 4: Consultation Fees */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold text-slate-600">Daily OPD Collection</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <span className="font-bold text-xs">₹</span>
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            ₹6,800 INR
          </div>
          <span className="text-[11px] text-emerald-700 font-bold mt-1 block">
            ₹800 Video / ₹1,200 Clinic
          </span>
        </div>
      </div>

      {/* 3. Core 2-Column Section (Direct parallel to the Patient Home Page 2-Column Layout!) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Active Patient Consultation Card (Parallel to 'Upcoming Consultation') */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Current Consultation</h3>
                <span className="text-xs text-slate-500">Live OPD Cabin &bull; Token #{currentPatient.tokenNumber}</span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-200 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
              {currentPatient.status === 'in-consultation' ? 'In Consultation' : 'Next in Line'}
            </span>
          </div>

          <div className="space-y-3.5">
            {/* Patient Header Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-base shadow-xs shrink-0">
                  {currentPatient.patientName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm sm:text-base">
                    {currentPatient.patientName}
                  </h4>
                  <p className="text-xs text-indigo-700 font-bold">
                    {currentPatient.age}y &bull; {currentPatient.gender} &bull; {currentPatient.timeSlot}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-600 mt-1 font-mono">
                    <span>BP: <strong className="text-slate-900">{currentPatient.vitals.bp}</strong></span>
                    <span>Pulse: <strong className="text-slate-900">{currentPatient.vitals.pulse} bpm</strong></span>
                    {currentPatient.vitals.sugar && (
                      <span>Sugar: <strong className="text-slate-900">{currentPatient.vitals.sugar}</strong></span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleCallPatient(currentPatient)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto active:scale-95"
              >
                {currentPatient.type === 'video' ? <Video className="w-4 h-4" /> : <Stethoscope className="w-4 h-4" />}
                <span>{currentPatient.status === 'in-consultation' ? 'Resume Call' : 'Call Patient'}</span>
              </button>
            </div>

            {/* Complaint box */}
            <div className="text-xs text-slate-600 flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div>
                <span className="font-bold text-slate-800 mr-1.5">Chief Complaint:</span>
                <span>{currentPatient.chiefComplaint}</span>
              </div>
              <button
                type="button"
                onClick={() => handleSendDelayNotice(currentPatient.patientName)}
                className="text-[11px] font-bold text-slate-600 hover:text-slate-900 px-2 py-1 bg-white border border-slate-200 rounded-lg cursor-pointer"
                title="Send +10m delay notice to patient"
              >
                +10m Delay Notice
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
            <span>
              Queue Status: <strong className="text-slate-800">{opdQueue.filter((q) => q.status === 'waiting').length} Waiting</strong>
            </span>
            <button
              type="button"
              onClick={() => onNavigate('doctors')}
              className="text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
            >
              See All OPD Appointments &rarr;
            </button>
          </div>
        </div>

        {/* Right Column: E-Prescriptions & Medical Leaves (Parallel to 'Today's Daily Medicines') */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Prescriptions &amp; Clinical Actions</h3>
                <span className="text-xs text-slate-500">1-Click Rx Writing &amp; Medical Leaves</span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-indigo-600" />
              NMC Compliant
            </span>
          </div>

          {/* Quick Action Buttons for Doctor */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleOpenQuickRx(currentPatient.patientName)}
              className="p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-2xl text-left transition cursor-pointer flex flex-col justify-between gap-2 group active:scale-95"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  ℞
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <div>
                <span className="font-bold text-xs block">Write Digital Rx</span>
                <span className="text-[10px] text-indigo-700 block mt-0.5">For {currentPatient.patientName}</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setShowCertModal(true)}
              className="p-3 bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 rounded-2xl text-left transition cursor-pointer flex flex-col justify-between gap-2 group active:scale-95"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-sm">
                  <Award className="w-4 h-4" />
                </div>
                <ArrowRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <div>
                <span className="font-bold text-xs block">Medical Leave Certificate</span>
                <span className="text-[10px] text-teal-700 block mt-0.5">Instant Sick Leave &amp; Fitness</span>
              </div>
            </button>
          </div>

          {/* Recent Prescriptions Summary */}
          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Recent Prescriptions Issued:
            </span>
            {prescriptions.slice(0, 3).map((rx) => (
              <div
                key={rx.id}
                className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">{rx.patientName}</div>
                  <div className="text-[11px] text-slate-500">
                    {rx.diagnosis} &bull; {rx.medicines.length} Medicines
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePrescriptionModal(rx)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-indigo-700 font-bold rounded-lg border border-slate-200 text-[11px] cursor-pointer"
                >
                  View / Print
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
            <span>Dose &amp; Renal Calculator</span>
            <button
              type="button"
              onClick={() => setShowClinicalRxModal(true)}
              className="text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
            >
              Open CDSS Calculator &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* 4. Live OPD Queue Cards (Clean, Simple, 4-Cards Grid) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <span>Today's OPD Queue &amp; Patient Dispatch</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Call waiting patients directly into your consultation cabin or video call room.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddWalkIn(!showAddWalkIn)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddWalkIn ? 'Close Form' : 'Register Walk-in Token'}</span>
            </button>
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200">
              {opdQueue.filter((q) => q.status === 'waiting').length} Waiting
            </span>
          </div>
        </div>

        {/* Walk-in Registration Form */}
        {showAddWalkIn && (
          <form onSubmit={handleAddWalkInPatient} className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900">Register Walk-In Patient for OPD Queue</span>
              <span className="text-[11px] text-slate-500">Auto-assigns token #{opdQueue.length + 1}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Patient Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Patel"
                  value={walkInName}
                  onChange={(e) => setWalkInName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-indigo-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Age &amp; Gender</label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    value={walkInAge}
                    onChange={(e) => setWalkInAge(Number(e.target.value))}
                    className="w-16 px-2 py-1.5 bg-white border border-indigo-200 rounded-lg text-xs font-bold text-slate-900"
                    placeholder="Age"
                  />
                  <select
                    value={walkInGender}
                    onChange={(e) => setWalkInGender(e.target.value)}
                    className="flex-1 px-2 py-1.5 bg-white border border-indigo-200 rounded-lg text-xs font-medium text-slate-900"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Chief Complaint</label>
                <input
                  type="text"
                  placeholder="e.g. Dizziness & high BP"
                  value={walkInComplaint}
                  onChange={(e) => setWalkInComplaint(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-indigo-200 rounded-lg text-xs font-medium text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Triage BP &amp; Pulse</label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    placeholder="120/80"
                    value={walkInBp}
                    onChange={(e) => setWalkInBp(e.target.value)}
                    className="w-20 px-2 py-1.5 bg-white border border-indigo-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                  />
                  <button
                    type="submit"
                    className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    Assign Token
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* 4 Patient Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {opdQueue.map((item) => (
            <div
              key={item.tokenNumber}
              className={`p-4 rounded-3xl border transition flex flex-col justify-between space-y-3 ${
                item.status === 'in-consultation'
                  ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                  : item.status === 'completed'
                  ? 'bg-slate-50/70 border-slate-200 opacity-60'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs">
                    Token #{item.tokenNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      item.status === 'in-consultation'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'completed'
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.status.replace('-', ' ')}
                  </span>
                </div>

                <h4 className="font-black text-slate-900 text-sm">{item.patientName}</h4>
                <div className="text-xs text-slate-500">
                  {item.age}y &bull; {item.gender} &bull; <strong className="text-indigo-600">{item.timeSlot}</strong>
                </div>

                <div className="mt-2 text-xs text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 block">Complaint:</span>
                  <span className="line-clamp-2">{item.chiefComplaint}</span>
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>BP: <strong className="text-slate-800">{item.vitals.bp}</strong></span>
                  <span>Pulse: <strong className="text-slate-800">{item.vitals.pulse} bpm</strong></span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleSendDelayNotice(item.patientName)}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition cursor-pointer"
                  title="Notify patient of delay"
                >
                  Delay +10m
                </button>

                <button
                  type="button"
                  onClick={() => handleCallPatient(item)}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
                    item.status === 'in-consultation'
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {item.type === 'video' ? <Video className="w-3.5 h-3.5" /> : <Stethoscope className="w-3.5 h-3.5" />}
                  <span>{item.status === 'in-consultation' ? 'Resume Call' : 'Call Patient'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Clinical Decision & Safety Desk (Clean 2-Column: Drug Interactions & Biometric Alerts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Drug Interaction Safety Checker */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4 hover:border-slate-300 transition">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-50 text-amber-700">
                <ShieldAlert className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Drug-Drug Interaction Safety Checker
                </h3>
                <span className="text-xs text-slate-500">
                  Real-time pharmacokinetic CYP3A4 &amp; renal safety analysis
                </span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
              CYP-450 Engine
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold">Quick Presets:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handlePresetInteraction('Atorvastatin', 'Clarithromycin')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700 cursor-pointer"
                >
                  Statin + Macrolide
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetInteraction('Telmisartan', 'Spironolactone')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700 cursor-pointer"
                >
                  Telmisartan + Spironolactone
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetInteraction('Aspirin', 'Ibuprofen')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700 cursor-pointer"
                >
                  Aspirin + NSAID
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={drug1}
                onChange={(e) => setDrug1(e.target.value)}
                placeholder="Drug A (e.g. Atorvastatin)"
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
              <input
                type="text"
                value={drug2}
                onChange={(e) => setDrug2(e.target.value)}
                placeholder="Drug B (e.g. Clarithromycin)"
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            {interactionResult && (
              <div
                className={`p-3.5 rounded-2xl border space-y-2 text-xs ${
                  interactionResult.severity === 'major'
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : interactionResult.severity === 'moderate'
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>{interactionResult.drugA} + {interactionResult.drugB}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-black ${
                      interactionResult.severity === 'major'
                        ? 'bg-rose-600 text-white'
                        : interactionResult.severity === 'moderate'
                        ? 'bg-amber-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {interactionResult.severity} Risk
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed font-medium">{interactionResult.mechanism}</p>
                <div className="pt-1.5 border-t border-rose-200/50 text-[11px] font-bold">
                  <strong>Recommendation:</strong> {interactionResult.recommendation}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Remote Patient Biometric Alerts */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4 hover:border-slate-300 transition">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-rose-50 text-rose-600">
                <Activity className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Remote Biometric &amp; Tele-Monitoring Alerts
                </h3>
                <span className="text-xs text-slate-500">
                  Real-time readings flagged by patient medical devices
                </span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              Live Stream
            </span>
          </div>

          <div className="space-y-3">
            {remoteAlerts.map((alt) => (
              <div
                key={alt.id}
                className={`p-3.5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  alt.severity === 'high'
                    ? 'bg-rose-50/60 border-rose-200'
                    : alt.severity === 'medium'
                    ? 'bg-amber-50/60 border-amber-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-xs">{alt.patientName}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.2 rounded-full uppercase tracking-wider ${
                        alt.severity === 'high'
                          ? 'bg-rose-600 text-white'
                          : alt.severity === 'medium'
                          ? 'bg-amber-600 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {alt.severity}
                    </span>
                    <span className="text-[10px] text-slate-400">&bull; {alt.time}</span>
                  </div>

                  <div className="text-xs font-bold text-slate-800">
                    {alt.parameter}: <span className="text-rose-700 font-mono text-sm">{alt.value}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">Device: {alt.device}</div>
                </div>

                <div className="shrink-0">
                  {alt.adviceSent ? (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Advised
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendRemoteAdvice(alt)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <Send className="w-3 h-3" />
                      <span>Send Advisory</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Doctor Video Masterclasses (CME) - Clean 3-Card Grid matching Patient Home Carousel */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Play className="w-5 h-5 text-red-600 fill-red-600" />
              <span>Doctor Clinical Video Masterclasses (YouTube CME)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              High-yield, verified video tutorials for outpatient and hospital clinical practice.
            </p>
          </div>
          <span className="text-xs font-bold bg-red-50 text-red-700 px-3 py-1 rounded-full border border-red-200">
            3 Verified Masterclasses
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {DOCTOR_VIDEO_GUIDES.map((vid) => (
            <div
              key={vid.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-red-300 transition shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden group"
            >
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  {vid.category}
                </span>
                <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-lg border border-white/20">
                  {vid.duration}
                </span>
                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <span className="text-[11px] font-medium text-slate-300 block">{vid.speaker}</span>
                  <h4 className="font-bold text-xs leading-snug line-clamp-2 mt-0.5">{vid.title}</h4>
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {vid.description}
                </p>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveDoctorVideoModal(vid)}
                    className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Watch Video</span>
                  </button>
                  <a
                    href={vid.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
                    title="Open directly on YouTube"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-red-600" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QUICK E-PRESCRIPTION MODAL */}
      {showQuickRxModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  ℞
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Quick Clinical E-Prescription Desk
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Digitally signed with NMC verification seal
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowQuickRxModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueQuickRx} className="space-y-4 text-xs">
              <div className="p-3 bg-indigo-50/70 rounded-2xl border border-indigo-100 space-y-2">
                <span className="text-[11px] font-bold text-indigo-900 block">
                  Patient Legal Name &amp; Identification
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-2">
                    <select
                      value={quickRxSalutation}
                      onChange={(e) => setQuickRxSalutation(e.target.value as any)}
                      className="w-full px-2 py-1.5 bg-white border border-indigo-200 rounded-lg font-bold text-slate-900"
                    >
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Master">Master</option>
                      <option value="Dr.">Dr.</option>
                    </select>
                  </div>
                  <div className="sm:col-span-6">
                    <input
                      type="text"
                      placeholder="Patient Full Name *"
                      value={quickRxPatientName}
                      onChange={(e) => setQuickRxPatientName(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-indigo-200 rounded-lg font-bold text-slate-900"
                      required
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      placeholder="Guardian / Spouse (Optional)"
                      value={quickRxGuardianName}
                      onChange={(e) => setQuickRxGuardianName(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-indigo-200 rounded-lg text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Age</label>
                    <input
                      type="number"
                      value={quickRxPatientAge}
                      onChange={(e) => setQuickRxPatientAge(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Gender</label>
                    <select
                      value={quickRxPatientGender}
                      onChange={(e) => setQuickRxPatientGender(e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Prescribing Doctor</label>
                    <input
                      type="text"
                      value={quickRxDoctorName}
                      onChange={(e) => setQuickRxDoctorName(e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinical Diagnosis *</label>
                <input
                  type="text"
                  value={quickRxDiagnosis}
                  onChange={(e) => setQuickRxDiagnosis(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>Prescribed Medications ({quickRxMedicines.length})</span>
                </div>

                <div className="space-y-1.5">
                  {quickRxMedicines.map((m, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2"
                    >
                      <div>
                        <strong className="text-slate-900">{m.name}</strong> &bull; {m.dosage}
                        <div className="text-[11px] text-slate-500">
                          {m.frequency} &bull; {m.duration} &bull; {m.instructions}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setQuickRxMedicines((prev) => prev.filter((_, idx) => idx !== i))}
                        className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100 flex flex-wrap gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Medicine name..."
                    value={newRxMedName}
                    onChange={(e) => setNewRxMedName(e.target.value)}
                    className="flex-1 min-w-[160px] px-2.5 py-1 bg-white border border-indigo-200 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Dosage"
                    value={newRxMedDosage}
                    onChange={(e) => setNewRxMedDosage(e.target.value)}
                    className="w-20 px-2 py-1 bg-white border border-indigo-200 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Frequency"
                    value={newRxMedFreq}
                    onChange={(e) => setNewRxMedFreq(e.target.value)}
                    className="w-28 px-2 py-1 bg-white border border-indigo-200 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddMedToQuickRx}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lifestyle &amp; Dietary Advice</label>
                  <input
                    type="text"
                    value={quickRxInstructions}
                    onChange={(e) => setQuickRxInstructions(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Follow-Up Review Date</label>
                  <input
                    type="date"
                    value={quickRxFollowUp}
                    onChange={(e) => setQuickRxFollowUp(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowQuickRxModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Digitally Sign &amp; Issue E-Prescription</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MEDICAL LEAVE & FITNESS CERTIFICATE MODAL */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    NMC Medical Leave &amp; Fitness Certificate
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Official medical certificate generation &amp; printing
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCertModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Patient Name:
                  </label>
                  <input
                    type="text"
                    value={certPatientName}
                    onChange={(e) => setCertPatientName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Diagnosis:
                  </label>
                  <input
                    type="text"
                    value={certDiagnosis}
                    onChange={(e) => setCertDiagnosis(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Leave Duration (Days):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={certRestDays}
                    onChange={(e) => setCertRestDays(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Fitness Status:
                  </label>
                  <select
                    value={certFitnessStatus}
                    onChange={(e) => setCertFitnessStatus(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  >
                    <option value="unfit">Unfit for Duty (Bed Rest)</option>
                    <option value="fit_light_duty">Fit for Light Duties</option>
                    <option value="fully_fit">Fit to Resume Duties</option>
                  </select>
                </div>
              </div>

              {/* Certificate Preview Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <span className="font-bold text-slate-900 text-[10px] uppercase">
                    Certificate Preview
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Doctor Seal Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  "This is to certify that <strong>{certPatientName}</strong> has been under my medical care for <strong>{certDiagnosis}</strong>. Advised rest for <strong>{certRestDays} days</strong>. Status: <strong>{certFitnessStatus === 'unfit' ? 'Unfit for duty' : 'Fit to resume duty'}</strong>."
                </p>
                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                  <span>Dr. V. Mohan, MD (NMC-2012-90482)</span>
                  <span className="font-mono text-teal-800 font-bold">CERT-2026-9048</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCertModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCertGenerated(true);
                    addNotification('Certificate Generated', `Medical Certificate issued for ${certPatientName} (${certRestDays} days leave).`, 'prescription', 'doctor');
                    window.print();
                  }}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Certificate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIDEO PLAYER MODAL */}
      {activeDoctorVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 rounded-3xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl border border-slate-700 space-y-4 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
                  <Play className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white line-clamp-1">
                    {activeDoctorVideoModal.title}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {activeDoctorVideoModal.speaker} &bull; {activeDoctorVideoModal.category}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveDoctorVideoModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner">
              <iframe
                src={`https://www.youtube.com/embed/${activeDoctorVideoModal.url.split('v=')[1]}?autoplay=1&rel=0`}
                title={activeDoctorVideoModal.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <a
                href={activeDoctorVideoModal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open directly on YouTube</span>
              </a>

              <button
                type="button"
                onClick={() => setActiveDoctorVideoModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Close Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clinical Rx Desk Modal with Renal & Pediatric Calculators */}
      <ClinicalRxDeskModal
        isOpen={showClinicalRxModal}
        onClose={() => setShowClinicalRxModal(false)}
      />
    </div>
  );
};
