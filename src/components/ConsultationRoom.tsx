import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Send,
  FilePlus2,
  Shield,
  Activity,
  Heart,
  Plus,
  Trash2,
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { PrescriptionMedicine } from '../types';

export const ConsultationRoom: React.FC = () => {
  const { activeConsultation, endConsultation, createPrescription, vitals, allergies, role } = useHealth();
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'System', text: 'Encrypted Telehealth session established. HIPAA compliant end-to-end.', time: '10:30 AM' },
    { sender: 'Dr. V. Mohan', text: 'Good morning Sarath! How have you been feeling since starting the medication?', time: '10:31 AM' },
    { sender: 'Sarath Paturu', text: 'Good morning Doctor! Mild muscle fatigue in the evenings, but my resting heart rate has been very steady.', time: '10:32 AM' },
  ]);
  const [messageInput, setMessageInput] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState(
    'Patient reports mild evening fatigue on Atorvastatin 20mg. Resting BP 118/76. Recommending morning CoQ10 100mg to alleviate muscle tension.'
  );

  // e-Rx composer modal within consultation
  const [showRxComposer, setShowRxComposer] = useState(false);
  const [patientSalutation, setPatientSalutation] = useState('Ms.');
  const [patientCustomName, setPatientCustomName] = useState(activeConsultation?.patientName || 'Sarath Paturu');
  const [patientGuardian, setPatientGuardian] = useState('');
  const [doctorCustomName, setDoctorCustomName] = useState(activeConsultation?.doctorName || 'Dr. V. Mohan');
  const [doctorDesignation, setDoctorDesignation] = useState('Senior Consultant Cardiologist');
  const [diagnosis, setDiagnosis] = useState('Primary Hyperlipidemia & Mild Statin-Associated Myalgia');
  const [rxMedicines, setRxMedicines] = useState<PrescriptionMedicine[]>([
    {
      name: 'Atorvastatin Calcium 20 mg',
      dosage: '1 Tablet',
      frequency: 'Once Daily at Bedtime',
      duration: '60 Days',
      instructions: 'Take after dinner with full glass of water.',
    },
    {
      name: 'Coenzyme Q10 100 mg',
      dosage: '1 Softgel',
      frequency: 'Daily with Breakfast',
      duration: '60 Days',
      instructions: 'Take with morning meal to support mitochondrial endurance.',
    },
  ]);
  const [newMed, setNewMed] = useState<PrescriptionMedicine>({
    name: '',
    dosage: '1 Tablet',
    frequency: 'Once Daily',
    duration: '30 Days',
    instructions: 'Take with water',
  });
  const [dietAdvice, setDietAdvice] = useState(
    'Maintain low-saturated fat Mediterranean dietary habits. Limit sodium to <2,000 mg/day.'
  );
  const [followUp, setFollowUp] = useState('2026-11-20');

  if (!activeConsultation) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    const senderName = role === 'doctor' ? activeConsultation.doctorName : activeConsultation.patientName;
    setChatMessages((prev) => [
      ...prev,
      {
        sender: senderName,
        text: messageInput.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setMessageInput('');
  };

  const handleAddMed = () => {
    if (!newMed.name.trim()) return;
    setRxMedicines((prev) => [...prev, newMed]);
    setNewMed({
      name: '',
      dosage: '1 Tablet',
      frequency: 'Once Daily',
      duration: '30 Days',
      instructions: 'Take with water',
    });
  };

  const handleRemoveMed = (idx: number) => {
    setRxMedicines((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleFinalizePrescription = () => {
    if (rxMedicines.length === 0) return;
    createPrescription({
      appointmentId: activeConsultation.id,
      patientId: activeConsultation.patientId,
      patientName: patientCustomName.trim() || activeConsultation.patientName,
      patientSalutation,
      guardianName: patientGuardian.trim() || undefined,
      patientAge: activeConsultation.patientAge || 34,
      patientGender: 'Female',
      doctorId: activeConsultation.doctorId,
      doctorName: doctorCustomName.trim() || activeConsultation.doctorName,
      doctorDesignation: doctorDesignation.trim() || undefined,
      doctorSpecialization: activeConsultation.doctorSpecialization,
      doctorLicense: 'NMC-2012-90482',
      clinicName: 'MedNexa Clinical Telehealth Wing',
      date: new Date().toISOString().substring(0, 10),
      diagnosis,
      medicines: rxMedicines,
      dietaryAdvice: dietAdvice,
      followUpDate: followUp,
    });
    setShowRxComposer(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h3 className="font-semibold text-sm flex items-center gap-2">
              Telemedicine Consultation Room
              <span className="text-xs px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono">
                {activeConsultation.id}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Dr. {activeConsultation.doctorName} &bull; {activeConsultation.patientName} &bull; {activeConsultation.type.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Quick Vitals Strip for Doctor */}
        <div className="hidden md:flex items-center gap-4 px-4 py-1.5 bg-slate-800/80 rounded-xl border border-slate-700 text-xs">
          <div className="flex items-center gap-1 text-slate-300">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>BP: <strong>{vitals.bloodPressure}</strong></span>
          </div>
          <div className="flex items-center gap-1 text-slate-300">
            <Activity className="w-3.5 h-3.5 text-teal-400" />
            <span>Pulse: <strong>{vitals.heartRateBpm} bpm</strong></span>
          </div>
          <div className="text-slate-300">
            <span>BMI: <strong>{vitals.bmi}</strong></span>
          </div>
          {allergies.length > 0 && (
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-medium text-[11px]">
              Allergy: {allergies[0].allergen}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {role === 'doctor' && (
            <button
              type="button"
              onClick={() => setShowRxComposer(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              <FilePlus2 className="w-3.5 h-3.5" />
              Generate e-Prescription
            </button>
          )}
          <button
            type="button"
            onClick={() => endConsultation(clinicalNotes)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition shadow-sm"
          >
            <PhoneOff className="w-4 h-4" />
            End Call
          </button>
        </div>
      </div>

      {/* Main Grid: Video Stream + Chat & Notes */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
        {/* Video Canvas Area */}
        <div className="lg:col-span-2 relative bg-slate-900 p-4 flex flex-col items-center justify-center">
          {/* Main Feed */}
          <div className="relative w-full h-full max-h-[72vh] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center">
            {videoOn ? (
              <div className="relative w-full h-full">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=1000&auto=format&fit=crop&q=80"
                  alt="Doctor video feed"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-slate-950/70 backdrop-blur-md rounded-lg text-xs font-medium border border-slate-700/50 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  {activeConsultation.doctorName} (Host)
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-slate-500">
                <VideoOff className="w-12 h-12" />
                <p className="text-sm font-medium">Camera Feed Disabled</p>
              </div>
            )}

            {/* Picture-in-Picture Patient Cam */}
            <div className="absolute bottom-4 right-4 w-40 h-28 rounded-xl overflow-hidden border-2 border-teal-500/80 shadow-2xl bg-slate-900 z-10">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
                alt="Patient Self Cam"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 left-2 text-[10px] font-medium bg-black/60 px-1.5 py-0.5 rounded text-white">
                You (Patient)
              </div>
            </div>
          </div>

          {/* Bottom Floating Controls */}
          <div className="mt-4 flex items-center gap-3 bg-slate-800/90 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-slate-700 shadow-xl">
            <button
              type="button"
              onClick={() => setMicOn(!micOn)}
              className={`p-3 rounded-full transition ${micOn ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-rose-600 text-white'}`}
              title={micOn ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={() => setVideoOn(!videoOn)}
              className={`p-3 rounded-full transition ${videoOn ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-rose-600 text-white'}`}
              title={videoOn ? 'Turn Camera Off' : 'Turn Camera On'}
            >
              {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
            <div className="h-6 w-px bg-slate-700 mx-1" />
            <button
              type="button"
              onClick={() => endConsultation(clinicalNotes)}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
            >
              <PhoneOff className="w-4 h-4" />
              Disconnect
            </button>
          </div>
        </div>

        {/* Right Sidebar: Tabs for Chat and Clinical Notes */}
        <div className="border-l border-slate-800 bg-slate-900 flex flex-col h-full overflow-hidden">
          {/* Notes Section (especially for Doctor, visible to both) */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-teal-400" />
                Clinical Encounter Notes
              </span>
              <span className="text-[10px] text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/50">
                Auto-Saved
              </span>
            </div>
            <textarea
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="Enter clinical examination notes, differential diagnosis..."
              rows={3}
              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-teal-500 transition resize-none"
            />
          </div>

          {/* Consultation Chat */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-4 py-2 bg-slate-800/60 text-xs font-semibold text-slate-300 border-b border-slate-800">
              Live Consultation Messages
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl text-xs max-w-[85%] ${
                    msg.sender === 'System'
                      ? 'bg-slate-800/80 text-teal-300 text-center mx-auto border border-slate-700/50'
                      : msg.sender.includes('Dr.')
                      ? 'bg-teal-950/70 border border-teal-800/40 text-slate-100 ml-auto'
                      : 'bg-slate-800 text-slate-200 mr-auto'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[10px] opacity-70 mb-1">
                    <span className="font-semibold">{msg.sender}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2 bg-slate-950">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message or medical question..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                className="p-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Prescription Composer Modal */}
      {showRxComposer && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white text-slate-900 rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Issue Digital Prescription (e-Rx)
                </h3>
                <p className="text-xs text-slate-500">
                  Patient: {activeConsultation.patientName} &bull; Appointment #{activeConsultation.id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowRxComposer(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Patient & Doctor Name Identification */}
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-2">
                <div className="text-[11px] font-bold text-indigo-900 flex items-center justify-between">
                  <span>Patient &amp; Prescribing Doctor Information</span>
                  <span className="text-[10px] text-indigo-600 font-normal">Editable for exact legal records</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="flex gap-1 sm:col-span-2">
                    <select
                      value={patientSalutation}
                      onChange={(e) => setPatientSalutation(e.target.value)}
                      className="px-2 py-1.5 bg-white border border-indigo-200 rounded-lg text-xs font-semibold text-slate-800"
                    >
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Master">Master</option>
                      <option value="Dr.">Dr.</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Patient Full Legal Name *"
                      value={patientCustomName}
                      onChange={(e) => setPatientCustomName(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 bg-white border border-indigo-200 rounded-lg text-xs font-bold text-slate-900"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Caregiver / Guardian Name (Opt)"
                      value={patientGuardian}
                      onChange={(e) => setPatientGuardian(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-indigo-200 rounded-lg text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-indigo-100/60">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Doctor Full Name</label>
                    <input
                      type="text"
                      value={doctorCustomName}
                      onChange={(e) => setDoctorCustomName(e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Doctor Designation / Specialty</label>
                    <input
                      type="text"
                      value={doctorDesignation}
                      onChange={(e) => setDoctorDesignation(e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Diagnosis</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              {/* Medication list */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Medications ({rxMedicines.length})
                </label>
                <div className="space-y-2 mb-3">
                  {rxMedicines.map((m, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900">{m.name}</span>
                        <span className="text-slate-600 ml-2">({m.dosage} &bull; {m.frequency} &bull; {m.duration})</span>
                        <p className="text-slate-500 text-[11px] mt-0.5">{m.instructions}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMed(i)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new medication row */}
                <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 space-y-2">
                  <div className="font-semibold text-teal-900 text-xs">Add Medication to e-Rx</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <input
                      type="text"
                      placeholder="Med Name (e.g. Amoxicillin)"
                      value={newMed.name}
                      onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                      className="p-1.5 border border-slate-300 rounded text-xs col-span-2"
                    />
                    <input
                      type="text"
                      placeholder="Dosage (500mg)"
                      value={newMed.dosage}
                      onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                      className="p-1.5 border border-slate-300 rounded text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Frequency"
                      value={newMed.frequency}
                      onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                      className="p-1.5 border border-slate-300 rounded text-xs"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Instructions (e.g., After meals)"
                      value={newMed.instructions}
                      onChange={(e) => setNewMed({ ...newMed, instructions: e.target.value })}
                      className="flex-1 p-1.5 border border-slate-300 rounded text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddMed}
                      className="px-3 py-1.5 bg-teal-600 text-white rounded font-medium hover:bg-teal-700 transition flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Dietary & Lifestyle Advice</label>
                <textarea
                  value={dietAdvice}
                  onChange={(e) => setDietAdvice(e.target.value)}
                  rows={2}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Follow-up Date</label>
                <input
                  type="date"
                  value={followUp}
                  onChange={(e) => setFollowUp(e.target.value)}
                  className="p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRxComposer(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFinalizePrescription}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shadow-sm transition"
              >
                Sign & Issue Official e-Rx
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
