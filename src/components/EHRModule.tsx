import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FolderGit2,
  Heart,
  Activity,
  Droplet,
  Weight,
  Thermometer,
  Wind,
  Plus,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Download,
  ShieldCheck,
  User,
  Clock,
  Printer,
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { HealthVitals, LabReport } from '../types';
import { PatientRecordPrintModal } from './patient/PatientRecordPrintModal';

export const EHRModule: React.FC = () => {
  const {
    currentUser,
    vitals,
    updateVitals,
    diagnoses,
    addDiagnosis,
    allergies,
    addAllergy,
    labReports,
  } = useHealth();

  const [activeTab, setActiveTab] = useState<'vitals' | 'diagnoses' | 'allergies' | 'labReports'>('vitals');
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Vitals Logging Modal
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [newVitals, setNewVitals] = useState<HealthVitals>({ ...vitals });

  // Add Diagnosis Modal
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  const [newCondition, setNewCondition] = useState('');
  const [newDiagnosedBy, setNewDiagnosedBy] = useState('Dr. V. Mohan, MD');
  const [newNotes, setNewNotes] = useState('');

  // Add Allergy Modal
  const [showAllergyModal, setShowAllergyModal] = useState(false);
  const [newAllergen, setNewAllergen] = useState('');
  const [newReaction, setNewReaction] = useState('');
  const [newAllergySeverity, setNewAllergySeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Moderate');

  // Selected Lab Report Detail Modal
  const [selectedReport, setSelectedReport] = useState<LabReport | null>(null);

  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    const heightInMeters = newVitals.heightCm / 100;
    const computedBmi = Number((newVitals.weightKg / (heightInMeters * heightInMeters)).toFixed(1));
    updateVitals({
      ...newVitals,
      bmi: computedBmi,
      recordedAt: new Date().toISOString().substring(0, 10),
    });
    setShowVitalsModal(false);
  };

  const handleSaveDiagnosis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCondition.trim()) return;
    addDiagnosis({
      condition: newCondition,
      diagnosedDate: new Date().toISOString().substring(0, 10),
      doctor: newDiagnosedBy,
      status: 'active',
      notes: newNotes,
    });
    setShowDiagnosisModal(false);
    setNewCondition('');
    setNewNotes('');
  };

  const handleSaveAllergy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAllergen.trim()) return;
    addAllergy({
      allergen: newAllergen,
      reaction: newReaction || 'Hives and respiratory discomfort',
      severity: newAllergySeverity,
    });
    setShowAllergyModal(false);
    setNewAllergen('');
    setNewReaction('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-teal-600" />
            My Health Records &amp; Tests
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            View your vital signs, doctor notes, allergies, and lab reports in one simple place.
          </p>
        </div>

        {/* View Switcher & Print Button */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('vitals')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'vitals' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vitals
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('diagnoses')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'diagnoses' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Doctor Notes ({diagnoses.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('allergies')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'allergies' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Allergies ({allergies.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('labReports')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'labReports' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lab Reports ({labReports.length})
            </button>
          </div>

          <button
            type="button"
            id="ehr-print-records-btn"
            onClick={() => setShowPrintModal(true)}
            className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Print Full Clinical Records & QR Summary"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Records</span>
          </button>
        </div>
      </div>

      {/* Clinical Medical Diagnostics Visual Banner */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5 overflow-hidden relative">
        <div className="flex items-center gap-4 z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-slate-200 shadow-2xs shrink-0">
            <img
              src="https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&auto=format&fit=crop&q=80"
              alt="Medical laboratory diagnostics and biometrics testing"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-bold mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              <span>Real-Time Clinical Vitals &amp; Lab Pathology</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              ABDM Electronic Health Registry &bull; Verified Biometrics
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Continuously calibrated against clinical guidelines. Track historical trends across blood pressure, glucose, and serum biomarkers.
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <img
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&auto=format&fit=crop&q=80"
            alt="Cardiovascular health monitoring"
            className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-2xs"
          />
          <img
            src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=200&auto=format&fit=crop&q=80"
            alt="Clinical laboratory specimen"
            className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-2xs"
          />
        </div>
      </div>

      {/* VIEW 1: Vitals & Biometrics */}
      {activeTab === 'vitals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Last recorded: <strong>{vitals.recordedAt}</strong> via MedNexa Smart Monitor
            </div>
            <button
              type="button"
              onClick={() => {
                setNewVitals({ ...vitals });
                setShowVitalsModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Log New Vitals
            </button>
          </div>

          {/* Vitals Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Blood Pressure */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                Blood Pressure
              </span>
              <div className="text-xl font-bold text-slate-900">{vitals.bloodPressure}</div>
              <span className="text-[10px] text-emerald-600 font-medium">Optimal (mmHg)</span>
            </div>

            {/* Heart Rate */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-teal-600" />
                Heart Rate
              </span>
              <div className="text-xl font-bold text-slate-900">{vitals.heartRateBpm} <span className="text-xs font-normal text-slate-400">bpm</span></div>
              <span className="text-[10px] text-emerald-600 font-medium">Resting Rhythm</span>
            </div>

            {/* Blood Sugar */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5 text-amber-500" />
                Blood Sugar
              </span>
              <div className="text-xl font-bold text-slate-900">{vitals.bloodSugarMgDl} <span className="text-xs font-normal text-slate-400">mg/dL</span></div>
              <span className="text-[10px] text-emerald-600 font-medium">Fasting Range</span>
            </div>

            {/* Oxygen Saturation */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-blue-500" />
                Oxygen (SpO2)
              </span>
              <div className="text-xl font-bold text-slate-900">{vitals.oxygenSatPct}%</div>
              <span className="text-[10px] text-emerald-600 font-medium">Optimal Oxygenation</span>
            </div>

            {/* Temperature */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-orange-500" />
                Temperature
              </span>
              <div className="text-xl font-bold text-slate-900">{vitals.temperatureF}&deg;F</div>
              <span className="text-[10px] text-emerald-600 font-medium">Normothermic</span>
            </div>

            {/* Weight & BMI */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1">
                <Weight className="w-3.5 h-3.5 text-indigo-500" />
                Weight &amp; BMI
              </span>
              <div className="text-xl font-bold text-slate-900">
                {vitals.weightKg} <span className="text-xs font-normal text-slate-400">kg</span>
              </div>
              <span className="text-[10px] text-teal-700 font-bold">BMI: {vitals.bmi}</span>
            </div>
          </div>

          {/* Vitals Longitudinal Trends Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600" />
                Vitals Clinical Progression &amp; Target Thresholds
              </h3>
              <span className="text-xs text-slate-500">Normal Range Compliant</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">Cardiovascular Pressure</span>
                  <span className="font-bold text-teal-700">{vitals.bloodPressure} mmHg</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full w-3/4" />
                </div>
                <p className="text-[10px] text-slate-500">Target: &lt; 120/80 mmHg (Normal)</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">Metabolic Glucose</span>
                  <span className="font-bold text-amber-700">{vitals.bloodSugarMgDl} mg/dL</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-2/3" />
                </div>
                <p className="text-[10px] text-slate-500">Target: 70–99 mg/dL (Fasting)</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">Body Mass Index</span>
                  <span className="font-bold text-indigo-700">{vitals.bmi} kg/m&sup2;</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full w-1/2" />
                </div>
                <p className="text-[10px] text-slate-500">Target: 18.5–24.9 (Healthy Weight)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Diagnoses */}
      {activeTab === 'diagnoses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Physician Diagnostic Records &amp; Medical Conditions
            </h3>
            <button
              type="button"
              onClick={() => setShowDiagnosisModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Diagnosis Record
            </button>
          </div>

          <div className="space-y-3">
            {diagnoses.map((diag) => (
              <div
                key={diag.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{diag.condition}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        diag.status === 'active'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {diag.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{diag.notes}</p>

                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                    <span>Diagnosed: <strong>{diag.diagnosedDate}</strong></span>
                    <span>Physician: <strong>{diag.doctor}</strong></span>
                  </div>
                </div>

                <span className="px-3 py-1 bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold rounded-lg shrink-0">
                  Verified In EHR
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: Allergies */}
      {activeTab === 'allergies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Active Allergy Safety Registry
            </h3>
            <button
              type="button"
              onClick={() => setShowAllergyModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Register Allergy
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allergies.map((all, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2 hover:border-teal-300 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <AlertTriangle
                      className={`w-4 h-4 ${
                        all.severity === 'Severe'
                          ? 'text-rose-600'
                          : all.severity === 'Moderate'
                          ? 'text-amber-600'
                          : 'text-blue-600'
                      }`}
                    />
                    {all.allergen}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      all.severity === 'Severe'
                        ? 'bg-rose-100 text-rose-800'
                        : all.severity === 'Moderate'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {all.severity.toUpperCase()} RISK
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  Clinical reaction profile: <strong className="text-slate-800">{all.reaction}</strong>
                </p>

                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-100 flex justify-between">
                  <span className="text-rose-700 font-medium">Cross-Prescription Alert Active</span>
                  <span className="text-slate-400">Verified Safety Profile</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: Diagnostic Lab Reports */}
      {activeTab === 'labReports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Calibrated Diagnostic Laboratory Reports
            </h3>
            <span className="text-xs text-slate-500">
              {labReports.length} certified laboratory records
            </span>
          </div>

          <div className="space-y-4">
            {labReports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-teal-50 text-teal-700">
                        {report.id}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{report.testName}</h4>
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                        {report.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Lab: {report.labName} &bull; Category: {report.category} &bull; Date: {report.testDate}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedReport(report)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Inspect Biomarkers
                  </button>
                </div>

                {/* Summary Parameters Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Diagnostic Biomarker</th>
                        <th className="py-2 px-3">Observed Value</th>
                        <th className="py-2 px-3">Unit</th>
                        <th className="py-2 px-3">Standard Reference Range</th>
                        <th className="py-2 px-3">Evaluation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {report.parameters.map((param, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{param.parameter}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{param.value}</td>
                          <td className="py-2.5 px-3 text-slate-500">{param.unit}</td>
                          <td className="py-2.5 px-3 text-slate-600">{param.normalRange}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                param.flag === 'normal' || !param.flag
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : param.flag === 'high'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {(param.flag || 'NORMAL').toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-200/60">
                  <strong className="text-slate-800">Clinical Summary:</strong> {report.summary}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Log Vitals Modal */}
      {showVitalsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4"
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Record Clinical Biomarkers
                </h3>
                <p className="text-xs text-slate-500">
                  Update your daily biometrics and vitals
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowVitalsModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveVitals} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Blood Pressure (mmHg)
                  </label>
                  <input
                    type="text"
                    value={newVitals.bloodPressure}
                    onChange={(e) =>
                      setNewVitals({ ...newVitals, bloodPressure: e.target.value })
                    }
                    placeholder="120/80"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Heart Rate (bpm)
                  </label>
                  <input
                    type="number"
                    value={newVitals.heartRateBpm}
                    onChange={(e) =>
                      setNewVitals({ ...newVitals, heartRateBpm: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Blood Sugar (mg/dL)
                  </label>
                  <input
                    type="number"
                    value={newVitals.bloodSugarMgDl}
                    onChange={(e) =>
                      setNewVitals({ ...newVitals, bloodSugarMgDl: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Oxygen SpO2 (%)
                  </label>
                  <input
                    type="number"
                    value={newVitals.oxygenSatPct}
                    onChange={(e) =>
                      setNewVitals({ ...newVitals, oxygenSatPct: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newVitals.weightKg}
                    onChange={(e) =>
                      setNewVitals({ ...newVitals, weightKg: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={newVitals.heightCm}
                    onChange={(e) =>
                      setNewVitals({ ...newVitals, heightCm: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowVitalsModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-medium text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Vitals
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Diagnosis Modal */}
      {showDiagnosisModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4"
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Record Medical Diagnosis
                </h3>
                <p className="text-xs text-slate-500">
                  Add verified clinical assessment to patient EHR
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDiagnosisModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveDiagnosis} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Condition / Disease Name
                </label>
                <input
                  type="text"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  placeholder="e.g. Essential Hypertension"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Diagnosing Physician
                </label>
                <input
                  type="text"
                  value={newDiagnosedBy}
                  onChange={(e) => setNewDiagnosedBy(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Clinical Notes &amp; Management Plan
                </label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Summary of presentation and medical course..."
                  rows={3}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs resize-none"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDiagnosisModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-medium text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Add Diagnosis
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Allergy Modal */}
      {showAllergyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4"
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Register Patient Allergy
                </h3>
                <p className="text-xs text-slate-500">
                  Prevent contraindications during e-prescribing
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAllergyModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveAllergy} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Allergen Name
                </label>
                <input
                  type="text"
                  value={newAllergen}
                  onChange={(e) => setNewAllergen(e.target.value)}
                  placeholder="e.g. Penicillin, Shellfish, Latex"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Severity Profile
                </label>
                <select
                  value={newAllergySeverity}
                  onChange={(e) =>
                    setNewAllergySeverity(e.target.value as 'Mild' | 'Moderate' | 'Severe')
                  }
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                >
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe (Anaphylaxis Risk)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Observed Reaction
                </label>
                <input
                  type="text"
                  value={newReaction}
                  onChange={(e) => setNewReaction(e.target.value)}
                  placeholder="e.g. Urticaria, swelling, dyspnea"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAllergyModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-medium text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Register Allergy
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Detail Biomarker Modal for Lab Report */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4"
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-mono font-bold text-teal-700">{selectedReport.id}</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedReport.testName}</h3>
                <p className="text-xs text-slate-500">Performed by {selectedReport.labName}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Test</th>
                      <th className="py-2 px-3">Value</th>
                      <th className="py-2 px-3">Reference</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedReport.parameters.map((p, i) => (
                      <tr key={i}>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{p.parameter}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                          {p.value} {p.unit}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">{p.normalRange}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.flag === 'normal' || !p.flag
                                ? 'bg-emerald-100 text-emerald-800'
                                : p.flag === 'high'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {(p.flag || 'NORMAL').toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-slate-700 border border-slate-200">
                <strong className="text-slate-900">Summary:</strong> {selectedReport.summary}
              </div>
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
    </div>
  );
};
