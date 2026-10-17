import React, { useState } from 'react';
import {
  Users,
  Search,
  FileText,
  Plus,
  Activity,
  Heart,
  Calendar,
  Clock,
  CheckCircle2,
  Trash2,
  Send,
  Video,
  AlertCircle,
  FileSpreadsheet,
  Droplet,
  ShieldCheck,
  QrCode,
  X,
  User,
  Stethoscope,
  Pill,
  Sparkles,
  Phone,
  Building2,
  Package,
  RotateCcw,
  Truck,
  Check,
  Eye,
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { BottomNavTab } from '../BottomNav';
import { Prescription } from '../../types';

interface DoctorPatientsViewProps {
  onNavigate?: (tab: BottomNavTab, subSection?: string) => void;
}

interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  abhaId: string;
  bloodGroup: string;
  primaryCondition: string;
  lastVisit: string;
  bp: string;
  pulse: number;
  sugar: number;
  allergies: string[];
}

export const DoctorPatientsView: React.FC<DoctorPatientsViewProps> = ({ onNavigate }) => {
  const {
    createPrescription,
    setActivePrescriptionModal,
    orders,
    medicineReturns,
    addNotification,
    pillReminders,
  } = useHealth();
  const [acknowledgedReturns, setAcknowledgedReturns] = useState<Record<string, boolean>>({});

  const [patients, setPatients] = useState<PatientRecord[]>([
    {
      id: 'pat-001',
      name: 'Sarath Paturu',
      age: 48,
      gender: 'Female',
      phone: '+91 98450 12345',
      abhaId: '91-4820-1940-5821',
      bloodGroup: 'O+',
      primaryCondition: 'Essential Hypertension & Borderline Dyslipidemia',
      lastVisit: '2025-05-10',
      bp: '138/86 mmHg',
      pulse: 74,
      sugar: 110,
      allergies: ['Penicillin', 'Sulfa Drugs'],
    },
    {
      id: 'pat-002',
      name: 'Kavita Sundaram',
      age: 52,
      gender: 'Female',
      phone: '+91 98451 44556',
      abhaId: '91-2391-4402-9912',
      bloodGroup: 'B+',
      primaryCondition: 'Type 2 Diabetes Mellitus & Mild Neuropathy',
      lastVisit: '2025-05-08',
      bp: '128/82 mmHg',
      pulse: 78,
      sugar: 182,
      allergies: ['Latex'],
    },
    {
      id: 'pat-003',
      name: 'Rajeev Menon',
      age: 61,
      gender: 'Male',
      phone: '+91 98452 77889',
      abhaId: '91-8890-3341-2019',
      bloodGroup: 'A+',
      primaryCondition: 'Post-CABG Coronary Artery Disease & Hyperlipidemia',
      lastVisit: '2025-05-02',
      bp: '124/78 mmHg',
      pulse: 70,
      sugar: 104,
      allergies: ['Aspirin (Mild GI distress)'],
    },
    {
      id: 'pat-004',
      name: 'Ananya Sharma',
      age: 29,
      gender: 'Female',
      phone: '+91 98453 11223',
      abhaId: '91-5501-8821-3948',
      bloodGroup: 'AB+',
      primaryCondition: 'Allergic Rhinitis & Seasonal Bronchial Asthma',
      lastVisit: '2025-04-28',
      bp: '118/74 mmHg',
      pulse: 82,
      sugar: 95,
      allergies: ['Dust Mites', 'Pollen'],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord>(patients[0]);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  // New Prescription Form State (with Explicit Name features for Patient & Doctor)
  const [rxPatientSalutation, setRxPatientSalutation] = useState<'Mr.' | 'Mrs.' | 'Ms.' | 'Master' | 'Dr.'>('Mr.');
  const [rxPatientName, setRxPatientName] = useState(patients[0].name);
  const [rxGuardianName, setRxGuardianName] = useState('S/o K. Paturu');
  const [rxPatientAge, setRxPatientAge] = useState(patients[0].age);
  const [rxPatientGender, setRxPatientGender] = useState(patients[0].gender);
  const [rxPatientPhone, setRxPatientPhone] = useState(patients[0].phone);
  const [rxPatientAbha, setRxPatientAbha] = useState(patients[0].abhaId);

  const [rxDoctorName, setRxDoctorName] = useState('Dr. V. Mohan, MD');
  const [rxDoctorDesignation, setRxDoctorDesignation] = useState('Senior Consultant Cardiologist & HOD');
  const [rxDoctorSpecialization, setRxDoctorSpecialization] = useState('Cardiology & Internal Medicine');
  const [rxDoctorLicense, setRxDoctorLicense] = useState('NMC-2012-90482');
  const [rxClinicName, setRxClinicName] = useState('Fortis Heart Clinic & MedNexa Clinical Suite, Bengaluru');

  const [rxDiagnosis, setRxDiagnosis] = useState('Essential Hypertension Follow-up');
  const [rxInstructions, setRxInstructions] = useState(
    'Low sodium diet (<2g/day), daily 30-minute brisk walk, monitor blood pressure morning and evening.'
  );
  const [rxFollowUp, setRxFollowUp] = useState('2025-06-15');

  const [rxMedicines, setRxMedicines] = useState([
    {
      name: 'Telma-40 Tablet',
      genericSalt: 'Telmisartan 40mg',
      dosage: '40mg',
      frequency: 'Once daily (Morning after breakfast)',
      duration: '30 Days',
      instructions: 'Take with water. Regular BP monitoring recommended.',
    },
    {
      name: 'Rosuvas-10 Tablet',
      genericSalt: 'Rosuvastatin 10mg',
      dosage: '10mg',
      frequency: 'Once daily at bedtime',
      duration: '30 Days',
      instructions: 'Lipid profile review at next 3-month follow-up.',
    },
  ]);

  // Add Medicine Form Fields
  const [newMedName, setNewMedName] = useState('');
  const [newMedSalt, setNewMedSalt] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('Once daily (Morning)');
  const [newMedDuration, setNewMedDuration] = useState('30 Days');
  const [newMedInstructions, setNewMedInstructions] = useState('After meals with water');

  // Quick 1-Click Popular Medicine Templates
  const POPULAR_MEDICINES = [
    { name: 'Telma-40 Tablet', salt: 'Telmisartan 40mg', dosage: '40mg', freq: 'Once daily (Morning)', dur: '30 Days' },
    { name: 'Glycomet-GP 2 Tablet', salt: 'Metformin 500mg + Glimepiride 2mg', dosage: '500mg/2mg', freq: 'Twice daily (After meals)', dur: '30 Days' },
    { name: 'Pan-D Capsule', salt: 'Pantoprazole 40mg + Domperidone 30mg', dosage: '40mg/30mg', freq: 'Once daily (Empty stomach)', dur: '15 Days' },
    { name: 'Dolo 650 Tablet', salt: 'Paracetamol 650mg', dosage: '650mg', freq: 'As needed (SOS for fever)', dur: '5 Days' },
    { name: 'Augmentin 625 Duo', salt: 'Amoxicillin 500mg + Clavulanic Acid 125mg', dosage: '625mg', freq: 'Twice daily (After food)', dur: '7 Days' },
    { name: 'Shelcal 500 Tablet', salt: 'Calcium 500mg + Vitamin D3 250 IU', dosage: '500mg', freq: 'Once daily (Post lunch)', dur: '30 Days' },
  ];

  const handleSelectQuickMed = (med: typeof POPULAR_MEDICINES[0]) => {
    setNewMedName(med.name);
    setNewMedSalt(med.salt);
    setNewMedDosage(med.dosage);
    setNewMedFreq(med.freq);
    setNewMedDuration(med.dur);
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.primaryCondition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenRxModalForPatient = (patient: PatientRecord) => {
    setSelectedPatient(patient);
    setRxPatientSalutation(patient.gender === 'Female' ? (patient.age < 30 ? 'Ms.' : 'Mrs.') : 'Mr.');
    setRxPatientName(patient.name);
    setRxGuardianName(patient.gender === 'Female' ? 'W/o Spouse / D/o Parent' : 'S/o Parent');
    setRxPatientAge(patient.age);
    setRxPatientGender(patient.gender);
    setRxPatientPhone(patient.phone);
    setRxPatientAbha(patient.abhaId);
    setRxDiagnosis(patient.primaryCondition);
    setShowPrescriptionModal(true);
  };

  const handleSelectExistingPatientInModal = (patientId: string) => {
    const found = patients.find((p) => p.id === patientId);
    if (found) {
      setSelectedPatient(found);
      setRxPatientSalutation(found.gender === 'Female' ? (found.age < 30 ? 'Ms.' : 'Mrs.') : 'Mr.');
      setRxPatientName(found.name);
      setRxGuardianName(found.gender === 'Female' ? 'W/o Spouse / D/o Parent' : 'S/o Parent');
      setRxPatientAge(found.age);
      setRxPatientGender(found.gender);
      setRxPatientPhone(found.phone);
      setRxPatientAbha(found.abhaId);
      setRxDiagnosis(found.primaryCondition);
    }
  };

  const handleAddMedicineToRx = () => {
    if (!newMedName.trim()) {
      alert('Please enter a medicine name.');
      return;
    }
    setRxMedicines((prev) => [
      ...prev,
      {
        name: newMedName.trim(),
        genericSalt: newMedSalt.trim() || newMedName.trim(),
        dosage: newMedDosage.trim() || 'Standard Dose',
        frequency: newMedFreq,
        duration: newMedDuration,
        instructions: newMedInstructions,
      },
    ]);
    setNewMedName('');
    setNewMedSalt('');
    setNewMedDosage('');
  };

  const handleRemoveMedicine = (idx: number) => {
    setRxMedicines((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleIssuePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rxPatientName.trim()) {
      alert('Please enter the patient name.');
      return;
    }
    if (rxMedicines.length === 0) {
      alert('Please add at least one medication to the prescription.');
      return;
    }

    const created = createPrescription({
      appointmentId: `appt-tele-${Date.now()}`,
      patientId: selectedPatient.id,
      patientName: rxPatientName.trim(),
      patientSalutation: rxPatientSalutation,
      guardianName: rxGuardianName.trim() || undefined,
      patientAge: Number(rxPatientAge) || selectedPatient.age,
      patientGender: rxPatientGender,
      doctorId: 'doc-001',
      doctorName: rxDoctorName.trim() || 'Dr. V. Mohan, MD',
      doctorDesignation: rxDoctorDesignation.trim() || undefined,
      doctorSpecialization: rxDoctorSpecialization.trim() || 'Cardiology & Internal Medicine',
      doctorLicense: rxDoctorLicense.trim() || 'NMC-2012-90482',
      clinicName: rxClinicName.trim() || 'Fortis Clinic & MedNexa Clinical Suite, Bengaluru',
      date: new Date().toISOString().substring(0, 10),
      diagnosis: rxDiagnosis.trim(),
      dietaryAdvice: rxInstructions.trim(),
      followUpDate: rxFollowUp,
      medicines: rxMedicines.map((m) => ({
        name: m.genericSalt ? `${m.name} (${m.genericSalt})` : m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        duration: m.duration,
        instructions: m.instructions,
      })),
    });

    setShowPrescriptionModal(false);
    setActivePrescriptionModal(created);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Patient Medical Records &amp; E-Prescription Desk
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Access patient EHR dossiers, evaluate biometric trends, and issue digitally signed e-Prescriptions with complete patient &amp; doctor identification.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenRxModalForPatient(selectedPatient)}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs sm:text-sm font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <FileText className="w-4 h-4" />
          <span>Write E-Prescription</span>
        </button>
      </div>

      {/* Main Grid: Patient List (Left) and Patient Clinical Dossier (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Search & Patient List (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patients by name, mobile, or condition..."
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition shadow-2xs"
            />
          </div>

          <div className="space-y-2">
            {filteredPatients.map((patient) => {
              const isSelected = selectedPatient.id === patient.id;
              return (
                <button
                  key={patient.id}
                  type="button"
                  onClick={() => setSelectedPatient(patient)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {patient.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{patient.name}</h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {patient.age}y &bull; {patient.gender} &bull; BP: {patient.bp}
                      </p>
                      <span className="text-[10px] text-indigo-700 font-semibold block truncate">
                        {patient.primaryCondition}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0">
                    {patient.bloodGroup}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Patient Comprehensive EHR Dossier (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-xs">
                {selectedPatient.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900">{selectedPatient.name}</h2>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 text-xs font-bold border border-indigo-200">
                    ABHA: {selectedPatient.abhaId}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedPatient.age} Years &bull; {selectedPatient.gender} &bull; Contact: {selectedPatient.phone}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenRxModalForPatient(selectedPatient)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <FileText className="w-4 h-4" />
              <span>Prescribe for {selectedPatient.name}</span>
            </button>
          </div>

          {/* Vitals & Telemetry */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold mb-1">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>Blood Pressure</span>
              </div>
              <div className="text-base font-black text-slate-900">{selectedPatient.bp}</div>
              <span className="text-[10px] text-slate-500 font-semibold">Target: 120/80 mmHg</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold mb-1">
                <Activity className="w-3.5 h-3.5 text-blue-500" />
                <span>Resting Heart Rate</span>
              </div>
              <div className="text-base font-black text-slate-900">{selectedPatient.pulse} bpm</div>
              <span className="text-[10px] text-slate-500 font-semibold">Normal Sinus Rhythm</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold mb-1">
                <Droplet className="w-3.5 h-3.5 text-amber-500" />
                <span>Fasting Glucose</span>
              </div>
              <div className="text-base font-black text-slate-900">{selectedPatient.sugar} mg/dL</div>
              <span className="text-[10px] text-slate-500 font-semibold">Target: &lt;120 mg/dL</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Blood Group</span>
              </div>
              <div className="text-base font-black text-slate-900">{selectedPatient.bloodGroup}</div>
              <span className="text-[10px] text-slate-500 font-semibold">Verified on EHR</span>
            </div>
          </div>

          {/* Documented Allergies */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-amber-900 block">
                Documented Drug &amp; Clinical Allergies:
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {selectedPatient.allergies.map((allergy, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-white text-amber-900 border border-amber-300 font-bold text-[11px]"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Clinical Assessment */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Primary Diagnosis &amp; Clinical Progress Notes
            </h3>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900 block mb-1">
                {selectedPatient.primaryCondition}
              </strong>
              Patient was last reviewed on {selectedPatient.lastVisit}. Vital signs stable under medical therapy. Advised regular home blood pressure &amp; fasting sugar telemetry logging, salt restriction, and periodic follow-up.
            </div>
          </div>

          {/* Today's Medication Adherence & Schedule (Live Patient Telemetry) */}
          <div className="space-y-2.5 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-indigo-600" />
                <span>Today's Medication Compliance &amp; Intake Telemetry</span>
              </h3>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Live Daily Telemetry Sync
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-slate-900">
                    Cycle Date: Today
                  </span>
                  <span className="text-slate-400 ml-2">&bull;</span>
                  <span className="text-slate-600 ml-2">
                    {pillReminders.reduce((acc, r) => acc + (r.active ? r.todayTakenTimes.length : 0), 0)} of{' '}
                    {pillReminders.reduce((acc, r) => acc + (r.active ? r.intakeTimes.length : 0), 0)} doses verified taken today
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-indigo-100 text-indigo-800">
                    {pillReminders.reduce((acc, r) => acc + (r.active ? r.intakeTimes.length : 0), 0) > 0
                      ? Math.round(
                          (pillReminders.reduce((acc, r) => acc + (r.active ? r.todayTakenTimes.length : 0), 0) /
                            pillReminders.reduce((acc, r) => acc + (r.active ? r.intakeTimes.length : 0), 0)) *
                            100
                        )
                      : 100}
                    % Adherence
                  </span>
                </div>
              </div>

              {/* Medication Intake Status Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {pillReminders.map((rem) => {
                  const allDone = rem.intakeTimes.every((t) => rem.todayTakenTimes.includes(t));
                  return (
                    <div
                      key={`doc-pill-${rem.id}`}
                      className="p-2.5 rounded-xl bg-white border border-slate-200/90 text-xs space-y-1 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 truncate">{rem.medicineName}</span>
                        {allDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{rem.dosage}</div>
                      <div className="flex items-center justify-between text-[10px] text-slate-600 pt-1 border-t border-slate-100">
                        <span>Slots: {rem.intakeTimes.join(', ')}</span>
                        <span className={allDone ? 'text-emerald-700 font-bold' : 'text-amber-700 font-semibold'}>
                          {rem.todayTakenTimes.length}/{rem.intakeTimes.length} Taken
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* E-Pharmacy Dispensation & Returned Medicines Record */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-teal-600" />
                <span>Medication Orders &amp; Returns History</span>
              </h3>
              <span className="text-[11px] text-teal-800 font-semibold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                E-Pharmacy Linked
              </span>
            </div>

            {/* If patient has any return requests */}
            {medicineReturns.filter(
              (r) =>
                r.patientId === selectedPatient.id ||
                r.patientName.toLowerCase() === selectedPatient.name.toLowerCase()
            ).length > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                    <RotateCcw className="w-4 h-4 text-amber-700" />
                    <span>Returned Medications &amp; Safety Claims</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                    Pharmacovigilance Alert
                  </span>
                </div>

                <div className="space-y-2">
                  {medicineReturns
                    .filter(
                      (r) =>
                        r.patientId === selectedPatient.id ||
                        r.patientName.toLowerCase() === selectedPatient.name.toLowerCase()
                    )
                    .map((ret) => {
                      const isAck = acknowledgedReturns[ret.id];
                      return (
                        <div
                          key={ret.id}
                          className="bg-white p-3 rounded-xl border border-amber-200/90 text-xs space-y-2 shadow-2xs"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <div>
                              <span className="font-bold text-slate-900">{ret.medicineName}</span>
                              <span className="text-slate-500 ml-1.5 font-mono">
                                (Batch: {ret.batchNumber || 'N/A'}, Claim #{ret.id})
                              </span>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] capitalize self-start sm:self-auto ${
                                ret.status === 'approved' || ret.status === 'accepted'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ret.status === 'rejected'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-900'
                              }`}
                            >
                              Status: {ret.status}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 space-y-0.5">
                            <p>
                              <strong className="text-slate-800">Return Reason:</strong>{' '}
                              <span className="capitalize">{ret.reason.replace(/_/g, ' ')}</span> &bull;{' '}
                              <em>&ldquo;{ret.reasonDescription}&rdquo;</em>
                            </p>
                            <p className="text-slate-500">
                              Refund/Replacement: ₹{ret.totalRefundAmount} &bull; Requested on {ret.requestedAt}
                            </p>
                            {ret.pharmacyNotes && (
                              <p className="text-teal-800 font-medium pt-0.5">
                                Chemist Record: {ret.pharmacyNotes}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[11px] text-slate-500">
                              {isAck
                                ? '✓ Clinically verified by attending physician'
                                : 'Pending clinical verification'}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setAcknowledgedReturns((prev) => ({ ...prev, [ret.id]: true }));
                                addNotification(
                                  'Physician Verified Medicine Return',
                                  `Dr. V. Mohan acknowledged return claim #${ret.id} (${ret.medicineName}) for ${selectedPatient.name}.`,
                                  'prescription',
                                  'doctor'
                                );
                              }}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                                isAck
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-2xs'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{isAck ? 'Clinically Reviewed ✓' : 'Acknowledge & Sign-off'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Fulfilled Pharmacy Orders */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-500 block">
                Prescription Dispensation &amp; Delivery Orders:
              </span>
              {orders.filter(
                (o) =>
                  o.patientId === selectedPatient.id ||
                  o.shippingAddress.fullName.toLowerCase() === selectedPatient.name.toLowerCase()
              ).length === 0 ? (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                  No pharmacy orders recorded for this patient.
                </div>
              ) : (
                orders
                  .filter(
                    (o) =>
                      o.patientId === selectedPatient.id ||
                      o.shippingAddress.fullName.toLowerCase() === selectedPatient.name.toLowerCase()
                  )
                  .map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">Order #{ord.id}</span>
                          <span className="text-slate-500">({ord.orderedAt})</span>
                          <span className="px-2 py-0.2 rounded-md bg-white border border-slate-200 text-[10px] font-bold capitalize text-slate-700">
                            {ord.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          {ord.items.map((it) => `${it.name} (x${it.quantity})`).join(', ')}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-slate-900 block">₹{ord.totalAmount}</span>
                        <span className="text-[10px] text-slate-500">{ord.paymentMethod}</span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* WRITE E-PRESCRIPTION MODAL WITH DEDICATED NAME FEATURE         */}
      {/* ============================================================== */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full p-6 space-y-4 my-8 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Official Digital E-Prescription Pad
                  </h3>
                  <p className="text-xs text-slate-500">
                    Includes patient identification, doctor credentials, and cryptographic signature
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPrescriptionModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssuePrescription} className="space-y-4">
              {/* SECTION 1: PATIENT NAME & IDENTIFICATION FEATURES */}
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                    <User className="w-4 h-4 text-indigo-700" />
                    <span>Patient Identification &amp; Demographics</span>
                  </div>

                  {/* Quick Patient Switcher */}
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="text-slate-500 font-medium">Select Registered:</span>
                    <select
                      value={selectedPatient.id}
                      onChange={(e) => handleSelectExistingPatientInModal(e.target.value)}
                      className="py-1 px-2 bg-white border border-indigo-200 rounded-lg text-xs font-bold text-indigo-900 focus:outline-none"
                    >
                      {patients.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.age}y, {p.gender})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-800 mb-1">
                      Salutation
                    </label>
                    <select
                      value={rxPatientSalutation}
                      onChange={(e) => setRxPatientSalutation(e.target.value as any)}
                      className="w-full px-2.5 py-2 bg-white border border-indigo-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                    >
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Master">Master</option>
                      <option value="Dr.">Dr.</option>
                    </select>
                  </div>

                  <div className="sm:col-span-6">
                    <label className="block text-[11px] font-bold text-slate-800 mb-1">
                      Patient Full Legal Name * (Type any patient name)
                    </label>
                    <input
                      type="text"
                      value={rxPatientName}
                      onChange={(e) => setRxPatientName(e.target.value)}
                      placeholder="e.g. Sarath Paturu / Ramesh Patel"
                      className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-2xs"
                      required
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-bold text-slate-800 mb-1">
                      Caregiver / Guardian Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={rxGuardianName}
                      onChange={(e) => setRxGuardianName(e.target.value)}
                      placeholder="e.g. S/o or W/o or Guardian"
                      className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1">
                      Patient Age *
                    </label>
                    <input
                      type="number"
                      value={rxPatientAge}
                      onChange={(e) => setRxPatientAge(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1">
                      Gender
                    </label>
                    <select
                      value={rxPatientGender}
                      onChange={(e) => setRxPatientGender(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      value={rxPatientPhone}
                      onChange={(e) => setRxPatientPhone(e.target.value)}
                      placeholder="+91 98450 12345"
                      className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1">
                      ABHA Health ID
                    </label>
                    <input
                      type="text"
                      value={rxPatientAbha}
                      onChange={(e) => setRxPatientAbha(e.target.value)}
                      placeholder="91-4820-1940-5821"
                      className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: PRESCRIBING DOCTOR NAME & CREDENTIALS */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-indigo-700" />
                    <span>Prescribing Clinician Information &amp; Digital Stamp</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                    ABDM Registered Clinician
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                      Doctor Name *
                    </label>
                    <input
                      type="text"
                      value={rxDoctorName}
                      onChange={(e) => setRxDoctorName(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                      Designation / Department
                    </label>
                    <input
                      type="text"
                      value={rxDoctorDesignation}
                      onChange={(e) => setRxDoctorDesignation(e.target.value)}
                      placeholder="e.g. Senior Consultant Cardiologist"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                      NMC Registration No. *
                    </label>
                    <input
                      type="text"
                      value={rxDoctorLicense}
                      onChange={(e) => setRxDoctorLicense(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                      Specialization
                    </label>
                    <input
                      type="text"
                      value={rxDoctorSpecialization}
                      onChange={(e) => setRxDoctorSpecialization(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Real-time Header Preview */}
                <div className="p-2.5 bg-white rounded-xl border border-indigo-100 flex items-center justify-between text-[11px] text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="font-serif italic font-black text-indigo-700 text-sm">℞ Preview:</span>
                    <span>
                      Issued to <strong className="text-slate-900">{rxPatientSalutation} {rxPatientName}</strong>
                      {rxGuardianName ? ` (${rxGuardianName})` : ''} by <strong className="text-slate-900">{rxDoctorName}</strong>
                      {rxDoctorDesignation ? ` [${rxDoctorDesignation}]` : ''}
                    </span>
                  </div>
                  <span className="text-[10px] text-indigo-600 font-mono font-bold bg-indigo-50 px-2 py-0.5 rounded">
                    {rxDoctorLicense}
                  </span>
                </div>
              </div>

              {/* SECTION 3: DIAGNOSIS */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Clinical Diagnosis *
                </label>
                <input
                  type="text"
                  value={rxDiagnosis}
                  onChange={(e) => setRxDiagnosis(e.target.value)}
                  placeholder="e.g. Essential Hypertension Grade 1 &amp; Dyslipidemia"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  required
                />
              </div>

              {/* SECTION 4: PRESCRIBED MEDICINES TABLE WITH SALT & DOSAGE */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    Prescribed Medications ({rxMedicines.length} items added)
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Auto-populates to Patient Medimart Bag
                  </span>
                </div>

                {/* Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Brand &amp; Generic Salt</th>
                        <th className="p-2.5">Strength</th>
                        <th className="p-2.5">Frequency</th>
                        <th className="p-2.5">Duration</th>
                        <th className="p-2.5 text-right">Remove</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {rxMedicines.map((med, i) => (
                        <tr key={i} className="hover:bg-slate-50/60">
                          <td className="p-2.5">
                            <span className="font-bold text-slate-900 block">{med.name}</span>
                            <span className="text-[10px] text-slate-500">{med.genericSalt}</span>
                          </td>
                          <td className="p-2.5 text-slate-700 font-mono">{med.dosage}</td>
                          <td className="p-2.5 text-slate-700">{med.frequency}</td>
                          <td className="p-2.5 text-slate-700">{med.duration}</td>
                          <td className="p-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveMedicine(i)}
                              className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add Next Medicine Card */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-indigo-600" />
                      Add Next Medicine to Prescription:
                    </span>

                    {/* Quick 1-click popular suggestions */}
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      <span className="text-slate-400 self-center">Popular:</span>
                      {POPULAR_MEDICINES.slice(0, 3).map((m) => (
                        <button
                          key={m.name}
                          type="button"
                          onClick={() => handleSelectQuickMed(m)}
                          className="px-2 py-0.5 rounded bg-white hover:bg-indigo-50 border border-slate-200 text-slate-700 cursor-pointer"
                        >
                          + {m.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                        Brand / Tablet Name *
                      </label>
                      <input
                        type="text"
                        value={newMedName}
                        onChange={(e) => setNewMedName(e.target.value)}
                        placeholder="e.g. Telma-40 / Dolo 650"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                        Generic Salt Composition
                      </label>
                      <input
                        type="text"
                        value={newMedSalt}
                        onChange={(e) => setNewMedSalt(e.target.value)}
                        placeholder="e.g. Telmisartan 40mg IP"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                        Strength / Dosage
                      </label>
                      <input
                        type="text"
                        value={newMedDosage}
                        onChange={(e) => setNewMedDosage(e.target.value)}
                        placeholder="e.g. 40mg / 1 tablet"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                        Frequency &amp; Timing
                      </label>
                      <select
                        value={newMedFreq}
                        onChange={(e) => setNewMedFreq(e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                      >
                        <option value="Once daily (Morning)">Once daily (Morning)</option>
                        <option value="Twice daily (Morning & Night)">Twice daily (Morning & Night)</option>
                        <option value="Thrice daily (After meals)">Thrice daily (After meals)</option>
                        <option value="Once daily at bedtime">Once daily at bedtime</option>
                        <option value="Every 8 hours with water">Every 8 hours with water</option>
                        <option value="As needed (SOS for pain/fever)">As needed (SOS for pain/fever)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                        Course Duration
                      </label>
                      <select
                        value={newMedDuration}
                        onChange={(e) => setNewMedDuration(e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                      >
                        <option value="5 Days">5 Days</option>
                        <option value="7 Days">7 Days</option>
                        <option value="15 Days">15 Days</option>
                        <option value="30 Days">30 Days</option>
                        <option value="60 Days">60 Days</option>
                        <option value="90 Days (Chronic)">90 Days (Chronic)</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleAddMedicineToRx}
                        className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add To Medicine List</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 5: CLINICAL ADVICE & FOLLOW-UP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Dietary &amp; Clinical Lifestyle Advice
                  </label>
                  <textarea
                    rows={2}
                    value={rxInstructions}
                    onChange={(e) => setRxInstructions(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Recommended Next Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={rxFollowUp}
                    onChange={(e) => setRxFollowUp(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
                <div className="text-[11px] text-slate-500">
                  Patient: <strong className="text-slate-800">{rxPatientName}</strong> &bull; Prescribing Doctor: <strong className="text-slate-800">{rxDoctorName}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPrescriptionModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Digitally Sign &amp; Issue e-Prescription</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
