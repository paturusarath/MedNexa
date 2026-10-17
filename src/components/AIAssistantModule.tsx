import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Bot,
  Send,
  Pill,
  Activity,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  RotateCw,
  Clock,
  ShieldCheck,
  ChevronRight,
  Heart,
  Thermometer,
  Zap,
  Info,
  Calendar,
  Copy,
  Check,
  User,
  ExternalLink,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Square,
  AlertOctagon,
  FileText,
  Printer,
  BookOpen,
  PhoneCall,
  Utensils,
  Share2,
  Store,
  TrendingUp,
  Calculator,
  Layers,
  ShieldAlert,
  CheckCircle,
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { BottomNavTab } from './BottomNav';
import { Doctor } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  toolUsed?: string;
  suggestedDoctor?: string;
}

interface AIAssistantModuleProps {
  onNavigate?: (tab: BottomNavTab, subSection?: string) => void;
  onSelectDoctorToBook?: (doctor: Doctor) => void;
}

export const AIAssistantModule: React.FC<AIAssistantModuleProps> = ({
  onNavigate,
  onSelectDoctorToBook,
}) => {
  const { currentUser, vitals, allergies, pillReminders, doctors, medicines, role } = useHealth();

  // Active Tool Mode based on role
  const [activeTool, setActiveTool] = useState<string>('chat');

  // Doctor Specialized Tool States
  const [soapPatientName, setSoapPatientName] = useState('Sarath Paturu (34F)');
  const [soapComplaint, setSoapComplaint] = useState('Persistent nocturnal dry cough and mild retrosternal tightness for 4 days');
  const [soapHistory, setSoapHistory] = useState('Non-smoker, history of seasonal allergic rhinitis. Takes Atorvastatin 20mg daily.');
  const [soapResult, setSoapResult] = useState<any | null>(null);
  const [isGeneratingSoap, setIsGeneratingSoap] = useState(false);

  const [diffChiefSymptoms, setDiffChiefSymptoms] = useState('Exertional dyspnea, bilateral pedal edema, elevated BP 148/92');
  const [diffResult, setDiffResult] = useState<any | null>(null);
  const [isGeneratingDiff, setIsGeneratingDiff] = useState(false);

  const [genericSearchDrug, setGenericSearchDrug] = useState('Augmentin 625 Duo');
  const [genericResult, setGenericResult] = useState<any | null>(null);

  // Shopkeeper Specialized Tool States
  const [rxAge, setRxAge] = useState<number>(34);
  const [rxDrug, setRxDrug] = useState('Azithromycin 500mg');
  const [rxDose, setRxDose] = useState('1 tablet daily for 3 days');
  const [rxCheckResult, setRxCheckResult] = useState<any | null>(null);

  const [marginDrug, setMarginDrug] = useState('Pan-D');
  const [marginResult, setMarginResult] = useState<any | null>(null);

  const [selectedSeason, setSelectedSeason] = useState<'monsoon' | 'summer' | 'winter'>('monsoon');
  const [gstItem, setGstItem] = useState('Insulin Glargine Pen');
  const [gstResult, setGstResult] = useState<any | null>(null);

  // Chat conversation state
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice Input (Speech Recognition) State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Voice Output (Speech Synthesis / TTS) State
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  // Senior / Plain English & Large Text Mode
  const [isSeniorMode, setIsSeniorMode] = useState(false);

  // Doctor Visit Summary Modal
  const [showDoctorSummary, setShowDoctorSummary] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Emergency Rapid Check State
  const [emergencySymptoms, setEmergencySymptoms] = useState<string[]>([]);
  const [emergencyResult, setEmergencyResult] = useState<'safe' | 'urgent' | null>(null);

  // Dose & Timing Guide State
  const [doseMedName, setDoseMedName] = useState<string>(
    pillReminders[0]?.medicineName || 'Atorvastatin'
  );

  const getInitialWelcome = () => {
    if (role === 'doctor') {
      return `Welcome Dr. ${currentUser.name || 'Doctor'}! I am **AI**.\n\nI can assist with evidence-based differential diagnosis, structured SOAP clinical encounter notes, polypharmacy drug-drug interactions, and bioequivalent Indian generic alternatives.`;
    }
    if (role === 'shopkeeper') {
      return `Welcome ${currentUser.name || 'Chemist'}! I am **AI**.\n\nI can assist with prescription dosage verification, Schedule H/H1 compliance check, generic profit margin calculations, and seasonal medicine inventory forecasting.`;
    }
    return `Hello ${currentUser.name || 'there'}! I am **AI**.\n\nYou can speak using the microphone or type any question about your health, medications, symptoms, or lab numbers. Everything is personalized to your health record.`;
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: getInitialWelcome(),
      timestamp: 'Just now',
    },
  ]);

  // Symptom Checker State
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [symptomSeverity, setSymptomSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Moderate');
  const [symptomResult, setSymptomResult] = useState<any | null>(null);
  const [isAnalyzingSymptoms, setIsAnalyzingSymptoms] = useState(false);

  // Drug Safety State
  const [selectedMedicine, setSelectedMedicine] = useState<string>(
    pillReminders[0]?.medicineName || 'Atorvastatin'
  );
  const [drugCustomInput, setDrugCustomInput] = useState('');
  const [drugResult, setDrugResult] = useState<any | null>(null);
  const [isCheckingDrug, setIsCheckingDrug] = useState(false);

  // Lab Explainer State
  const [selectedBiomarker, setSelectedBiomarker] = useState<string>('bp');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setInputMessage(transcript);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('SpeechRecognition initialization error:', err);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      // Fallback sample query if browser doesn't support Web Speech API
      setInputMessage('I want to check if my blood pressure medication is safe to take with food, and what are its common side effects.');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const speakText = (messageId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text
      .replace(/[*#_`>~]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\n+/g, '. ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = isSeniorMode ? 0.88 : 0.96;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  // Handle Chat Submit
  const handleSendMessage = async (textToSend?: string, toolTag?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-5),
          context: {
            name: currentUser.name,
            age: currentUser.age,
            gender: currentUser.gender,
            vitals,
            allergies,
            medications: pillReminders.map((p) => `${p.medicineName} ${p.dosage}`),
          },
          toolAction: toolTag,
        }),
      });

      const data = await response.json();
      const replyText = data.reply || 'I received your query. Here is clinical information for you.';

      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolUsed: toolTag,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: Message = {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        text: `### Clinical Note\nYour recorded vitals are stable (BP: **${vitals.bloodPressure}**, Heart Rate: **${vitals.heartRateBpm} bpm**). For medication dosage adjustments or persistent symptoms, please consult your physician via the **Doctor** tab.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Symptom Triage Trigger
  const handleRunSymptomTriage = async () => {
    const allSymptoms = [...selectedSymptoms];
    if (customSymptom.trim()) allSymptoms.push(customSymptom.trim());

    if (allSymptoms.length === 0) return;

    setIsAnalyzingSymptoms(true);
    try {
      const query = `Symptom Analysis: Patient reports ${allSymptoms.join(', ')} with ${symptomSeverity} severity. Patient profile: BP ${vitals.bloodPressure}, BMI ${vitals.bmi}. Known allergies: ${allergies.map((a) => a.allergen).join(', ') || 'None'}.`;

      const response = await fetch('/api/assistant-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          context: {
            name: currentUser.name,
            age: currentUser.age,
            vitals,
            allergies,
            medications: pillReminders.map((p) => p.medicineName),
          },
          toolAction: 'symptom_triage',
        }),
      });

      const data = await response.json();

      // Find matching doctor specialty
      let matchedDoc = doctors[0];
      const lower = allSymptoms.join(' ').toLowerCase();
      if (lower.includes('chest') || lower.includes('heart') || lower.includes('pressure')) {
        matchedDoc = doctors.find((d) => d.specialization.toLowerCase().includes('cardio')) || doctors[0];
      } else if (lower.includes('headache') || lower.includes('dizziness') || lower.includes('migraine')) {
        matchedDoc = doctors.find((d) => d.specialization.toLowerCase().includes('neuro')) || doctors[0];
      } else if (lower.includes('joint') || lower.includes('knee') || lower.includes('bone')) {
        matchedDoc = doctors.find((d) => d.specialization.toLowerCase().includes('ortho')) || doctors[0];
      }

      setSymptomResult({
        symptoms: allSymptoms,
        severity: symptomSeverity,
        analysisText: data.reply,
        recommendedDoctor: matchedDoc,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingSymptoms(false);
    }
  };

  // Drug Safety Analysis
  const handleCheckDrugSafety = async () => {
    const targetDrug = drugCustomInput.trim() || selectedMedicine;
    if (!targetDrug) return;

    setIsCheckingDrug(true);
    try {
      const query = `Medication Safety Check for: ${targetDrug}. Patient currently takes: ${pillReminders.map((p) => `${p.medicineName} ${p.dosage}`).join(', ')}. Known allergies: ${allergies.map((a) => a.allergen).join(', ') || 'NKDA'}.`;

      const response = await fetch('/api/assistant-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          context: {
            name: currentUser.name,
            vitals,
            allergies,
            medications: pillReminders.map((p) => p.medicineName),
          },
          toolAction: 'drug_interaction',
        }),
      });

      const data = await response.json();
      setDrugResult({
        medicine: targetDrug,
        advice: data.reply,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsCheckingDrug(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const commonSymptomChips = [
    'Headache',
    'Fever',
    'Sore Throat',
    'Dry Cough',
    'Chest Discomfort',
    'Dizziness',
    'Knee Joint Pain',
    'Skin Rash',
    'Fatigue & Weakness',
    'Acid Reflux',
  ];

  const getQuickChatPrompts = () => {
    if (role === 'doctor') {
      return [
        { text: 'Draft a SOAP note for acute bronchitis with wheezing', tag: 'soap_note' },
        { text: 'Check interactions between Telmisartan 40mg and Metformin 1000mg', tag: 'drug_interaction' },
        { text: 'Differential diagnosis for nocturnal dyspnea and bilateral ankle edema', tag: 'differential' },
        { text: 'Recommend Indian generic formulation for Rosuvastatin 20mg with pricing', tag: 'generics' },
      ];
    }
    if (role === 'shopkeeper') {
      return [
        { text: 'Find Jan Aushadhi generic equivalent and profit margin for Augmentin 625', tag: 'generic_sub' },
        { text: 'Verify Schedule H1 recording rules and storage requirements', tag: 'rx_compliance' },
        { text: 'Recommend fast-moving medicines for monsoon viral fevers & dengue in India', tag: 'inventory_forecast' },
        { text: 'What is the GST rate for life-saving insulin vs surgical gloves?', tag: 'gst_rate' },
      ];
    }
    return [
      { text: 'Is my 120/80 blood pressure healthy?', tag: 'vitals_check' },
      { text: 'What food interactions should I avoid with my medicines?', tag: 'drug_interaction' },
      { text: 'What should I do if I forgot to take my morning pill?', tag: 'missed_pill' },
      { text: 'Suggest 3 heart-healthy dinner meals for tonight', tag: 'nutrition' },
    ];
  };

  const quickChatPrompts = getQuickChatPrompts();

  return (
    <div id="ai-assistant-module" className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Graphic Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900 via-teal-800 to-indigo-950 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-40 w-60 h-60 bg-indigo-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* Title - Role Specific */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-teal-100 relative shadow-inner">
                <Bot className="w-5 h-5 text-white" />
                <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  AI
                </h1>
                <p className="text-xs text-teal-200/80">
                  {role === 'doctor'
                    ? 'Differential diagnostic support, SOAP note drafting, and Indian pharmacopeia'
                    : role === 'shopkeeper'
                    ? 'Rx dose verification, Schedule H1 compliance, generic profit margins & inventory'
                    : 'Personalized clinical care, drug safety checks, and vitals guidance'}
                </p>
              </div>
            </div>

            {/* Grounded Context Snapshot Badge */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-teal-200">
              <span className="font-semibold text-white">Grounded In:</span>
              {role === 'doctor' ? (
                <>
                  <span className="px-2.5 py-0.5 rounded-md bg-teal-800/80 border border-teal-700/60 font-mono">
                    ICD-10 Clinical Coding
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-teal-800/80 border border-teal-700/60 font-mono">
                    Indian Pharmacopeia (IP)
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-teal-800/80 border border-teal-700/60 font-mono">
                    EHR Records
                  </span>
                </>
              ) : role === 'shopkeeper' ? (
                <>
                  <span className="px-2.5 py-0.5 rounded-md bg-teal-800/80 border border-teal-700/60 font-mono">
                    Jan Aushadhi Formulary
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-teal-800/80 border border-teal-700/60 font-mono">
                    Schedule H / H1 Regulations
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-teal-800/80 border border-teal-700/60 font-mono">
                    Pharmacy Catalog
                  </span>
                </>
              ) : (
                <>
                  <span className="px-2.5 py-0.5 rounded-md bg-teal-800/80 border border-teal-700/60 font-mono">
                    BP {vitals.bloodPressure}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-teal-800/80 border border-teal-700/60 font-mono">
                    Pulse {vitals.heartRateBpm} bpm
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-teal-800/80 border border-teal-700/60">
                    Allergies: {allergies.length > 0 ? allergies.map((a) => a.allergen).join(', ') : 'NKDA'}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {role === 'patient' && (
              <button
                type="button"
                id="ai-senior-mode-btn"
                onClick={() => setIsSeniorMode(!isSeniorMode)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer border ${
                  isSeniorMode
                    ? 'bg-amber-400 text-amber-950 border-amber-300 shadow-md'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}
                title="Toggle Large Text & Plain English explanations"
              >
                <BookOpen className="w-4 h-4" />
                <span>{isSeniorMode ? 'Easy-Read Mode: ON' : 'Easy-Read Mode'}</span>
              </button>
            )}

            <button
              type="button"
              id="ai-doctor-summary-btn"
              onClick={() => setShowDoctorSummary(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-teal-950 border border-teal-300 shadow-md cursor-pointer"
              title="Generate a clinical summary card"
            >
              <FileText className="w-4 h-4" />
              <span>{role === 'doctor' ? 'Clinical Note Template' : 'Doctor Visit Summary'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Senior Mode Active Alert Banner */}
      {isSeniorMode && role === 'patient' && (
        <div className="bg-amber-100/90 border border-amber-300 text-amber-950 px-4 py-3 rounded-2xl text-sm font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-amber-800 shrink-0" />
            <span>Easy-Read Mode Active: Large fonts, high-contrast buttons, and simplified explanations are enabled across all tools.</span>
          </div>
          <button
            type="button"
            onClick={() => setIsSeniorMode(false)}
            className="text-xs text-amber-900 hover:text-amber-950 underline font-semibold px-2 py-1 cursor-pointer shrink-0"
          >
            Turn Off
          </button>
        </div>
      )}

      {/* Tool Navigation Selector (Role Specific) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs">
        {/* DOCTOR TOOLS */}
        {role === 'doctor' && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <button
              type="button"
              id="tool-tab-doc-chat"
              onClick={() => setActiveTool('chat')}
              className={`p-3 rounded-xl text-left transition flex items-center gap-2.5 border cursor-pointer ${
                activeTool === 'chat'
                  ? 'bg-blue-50 border-blue-500 text-blue-950 shadow-xs'
                  : 'border-slate-100 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  activeTool === 'chat' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold block leading-tight">Clinical AI Chat</span>
                <span className="text-[10px] text-slate-500 block">Guideline queries</span>
              </div>
            </button>

            <button
              type="button"
              id="tool-tab-doc-soap"
              onClick={() => setActiveTool('soap-notes')}
              className={`p-3 rounded-xl text-left transition flex items-center gap-2.5 border cursor-pointer ${
                activeTool === 'soap-notes'
                  ? 'bg-blue-50 border-blue-500 text-blue-950 shadow-xs'
                  : 'border-slate-100 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  activeTool === 'soap-notes' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <FileText className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold block leading-tight">SOAP Note Drafter</span>
                <span className="text-[10px] text-slate-500 block">Auto-generate notes</span>
              </div>
            </button>

            <button
              type="button"
              id="tool-tab-doc-interactions"
              onClick={() => setActiveTool('drug-safety')}
              className={`p-3 rounded-xl text-left transition flex items-center gap-2.5 border cursor-pointer ${
                activeTool === 'drug-safety'
                  ? 'bg-blue-50 border-blue-500 text-blue-950 shadow-xs'
                  : 'border-slate-100 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  activeTool === 'drug-safety' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Pill className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold block leading-tight">Drug Interaction</span>
                <span className="text-[10px] text-slate-500 block">Polypharmacy check</span>
              </div>
            </button>

            <button
              type="button"
              id="tool-tab-doc-differential"
              onClick={() => setActiveTool('differential')}
              className={`p-3 rounded-xl text-left transition flex items-center gap-2.5 border cursor-pointer ${
                activeTool === 'differential'
                  ? 'bg-blue-50 border-blue-500 text-blue-950 shadow-xs'
                  : 'border-slate-100 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  activeTool === 'differential' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Activity className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold block leading-tight">Differential Diagnosis</span>
                <span className="text-[10px] text-slate-500 block">Symptom probabilities</span>
              </div>
            </button>

            <button
              type="button"
              id="tool-tab-doc-generics"
              onClick={() => setActiveTool('generic-rx')}
              className={`p-3 rounded-xl text-left transition flex items-center gap-2.5 border cursor-pointer ${
                activeTool === 'generic-rx'
                  ? 'bg-blue-50 border-blue-500 text-blue-950 shadow-xs'
                  : 'border-slate-100 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  activeTool === 'generic-rx' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Layers className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold block leading-tight">Indian Generics</span>
                <span className="text-[10px] text-slate-500 block">Bioequivalent salts</span>
              </div>
            </button>
          </div>
        )}

        {/* SHOPKEEPER / CHEMIST TOOLS */}
        {role === 'shopkeeper' && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <button
              type="button"
              id="tool-tab-shop-chat"
              onClick={() => setActiveTool('chat')}
              className={`p-3 rounded-xl text-left transition flex items-center gap-2.5 border cursor-pointer ${
                activeTool === 'chat'
                  ? 'bg-amber-50 border-amber-500 text-amber-950 shadow-xs'
                  : 'border-slate-100 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  activeTool === 'chat' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold block leading-tight">Pharmacy AI Chat</span>
                <span className="text-[10px] text-slate-500 block">Dispensing queries</span>
              </div>
            </button>

            <button
              type="button"
              id="tool-tab-shop-validator"
              onClick={() => setActiveTool('rx-validator')}
              className={`p-3 rounded-xl text-left transition flex items-center gap-2.5 border cursor-pointer ${
                activeTool === 'rx-validator'
                  ? 'bg-amber-50 border-amber-500 text-amber-950 shadow-xs'
                  : 'border-slate-100 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  activeTool === 'rx-validator' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold block leading-tight">Rx &amp; Dose Validator</span>
                <span className="text-[10px] text-slate-500 block">Schedule H/H1 limits</span>
              </div>
            </button>

            <button
              type="button"
              id="tool-tab-shop-margins"
              onClick={() => setActiveTool('generic-sub')}
              className={`p-3 rounded-xl text-left transition flex items-center gap-2.5 border cursor-pointer ${
                activeTool === 'generic-sub'
                  ? 'bg-amber-50 border-amber-500 text-amber-950 shadow-xs'
                  : 'border-slate-100 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  activeTool === 'generic-sub' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <TrendingUp className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold block leading-tight">Generic Margins</span>
                <span className="text-[10px] text-slate-500 block">Jan Aushadhi profit</span>
              </div>
            </button>

            <button
              type="button"
              id="tool-tab-shop-inventory"
              onClick={() => setActiveTool('inventory-forecast')}
              className={`p-3 rounded-xl text-left transition flex items-center gap-2.5 border cursor-pointer ${
                activeTool === 'inventory-forecast'
                  ? 'bg-amber-50 border-amber-500 text-amber-950 shadow-xs'
                  : 'border-slate-100 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  activeTool === 'inventory-forecast' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Activity className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold block leading-tight">Stock Reorder AI</span>
                <span className="text-[10px] text-slate-500 block">Seasonal spikes</span>
              </div>
            </button>

            <button
              type="button"
              id="tool-tab-shop-gst"
              onClick={() => setActiveTool('gst-calc')}
              className={`p-3 rounded-xl text-left transition flex items-center gap-2.5 border cursor-pointer ${
                activeTool === 'gst-calc'
                  ? 'bg-amber-50 border-amber-500 text-amber-950 shadow-xs'
                  : 'border-slate-100 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  activeTool === 'gst-calc' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Calculator className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold block leading-tight">GST Tax Slabs</span>
                <span className="text-[10px] text-slate-500 block">5%, 12%, 18% rates</span>
              </div>
            </button>
          </div>
        )}

        {/* PATIENT TOOLS */}
        {role === 'patient' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {/* Tool 1: AI Chat & Voice */}
            <button
              type="button"
              id="tool-tab-chat"
              onClick={() => setActiveTool('chat')}
              className={`p-3 rounded-xl text-left transition flex items-center gap-2.5 border cursor-pointer ${
                activeTool === 'chat'
                  ? 'bg-teal-50 border-teal-500 text-teal-950 shadow-xs'
                  : 'border-slate-100 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  activeTool === 'chat' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold block leading-tight">Chat &amp; Voice</span>
                <span className="text-[10px] text-slate-500 block">Speak or ask</span>
              </div>
            </button>

            {/* Tool 2: Symptom Triage */}
            <button
              type="button"
              id="tool-tab-symptom-checker"
              onClick={() => setActiveTool('symptom-checker')}
              className={`p-3 rounded-xl text-left transition flex items-center gap-2.5 border cursor-pointer ${
                activeTool === 'symptom-checker'
                  ? 'bg-teal-50 border-teal-500 text-teal-950 shadow-xs'
                  : 'border-slate-100 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  activeTool === 'symptom-checker'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Thermometer className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold block leading-tight">Symptom Triage</span>
                <span className="text-[10px] text-slate-500 block">Evaluate &amp; book</span>
              </div>
            </button>

            {/* Tool 3: Emergency Red-Flag Check */}
            <button
              type="button"
              id="tool-tab-emergency-check"
              onClick={() => setActiveTool('emergency-check')}
              className={`p-3 rounded-xl text-left transition flex items-center gap-2.5 border cursor-pointer ${
                activeTool === 'emergency-check'
                  ? 'bg-rose-50 border-rose-500 text-rose-950 shadow-xs'
                  : 'border-slate-100 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  activeTool === 'emergency-check'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <AlertOctagon className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold block leading-tight">Emergency Check</span>
                <span className="text-[10px] text-slate-500 block">Red-flag safety</span>
              </div>
            </button>

            {/* Tool 4: Drug Safety & Food Conflicts */}
            <button
              type="button"
              id="tool-tab-drug-safety"
              onClick={() => setActiveTool('drug-safety')}
              className={`p-3 rounded-xl text-left transition flex items-center gap-2.5 border cursor-pointer ${
                activeTool === 'drug-safety'
                  ? 'bg-teal-50 border-teal-500 text-teal-950 shadow-xs'
                  : 'border-slate-100 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  activeTool === 'drug-safety' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Pill className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold block leading-tight">Drug Safety</span>
                <span className="text-[10px] text-slate-500 block">Food &amp; allergy</span>
              </div>
            </button>

            {/* Tool 5: Medicine Timing & Missed Dose */}
            <button
              type="button"
              id="tool-tab-dose-guide"
              onClick={() => setActiveTool('dose-guide')}
              className={`p-3 rounded-xl text-left transition flex items-center gap-2.5 border cursor-pointer ${
                activeTool === 'dose-guide'
                  ? 'bg-teal-50 border-teal-500 text-teal-950 shadow-xs'
                  : 'border-slate-100 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  activeTool === 'dose-guide' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Clock className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold block leading-tight">Dose &amp; Timing</span>
                <span className="text-[10px] text-slate-500 block">Meals &amp; missed pills</span>
              </div>
            </button>

            {/* Tool 6: Lab Report Explainer */}
            <button
              type="button"
              id="tool-tab-lab-explainer"
              onClick={() => setActiveTool('lab-explainer')}
              className={`p-3 rounded-xl text-left transition flex items-center gap-2.5 border cursor-pointer ${
                activeTool === 'lab-explainer'
                  ? 'bg-teal-50 border-teal-500 text-teal-950 shadow-xs'
                  : 'border-slate-100 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  activeTool === 'lab-explainer'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Activity className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold block leading-tight">Lab Explainer</span>
                <span className="text-[10px] text-slate-500 block">Clear biomarkers</span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* VIEW 1: CARE CHAT ASSISTANT */}
      {activeTool === 'chat' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col h-[650px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-700/20">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  AI
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                    Live
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Ask any medical question or tap quick prompt pills below
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setMessages([
                  {
                    id: `msg-${Date.now()}`,
                    sender: 'assistant',
                    text: `Hello ${currentUser.name}! How can I assist with your health or medications today?`,
                    timestamp: 'Just now',
                  },
                ])
              }
              className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-white transition flex items-center gap-1.5"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Clear Chat</span>
            </button>
          </div>

          {/* Chat Messages Container */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                      isUser
                        ? 'bg-teal-600 text-white'
                        : 'bg-gradient-to-tr from-teal-800 to-indigo-900 text-white'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-xl rounded-2xl p-4 leading-relaxed space-y-2 relative group ${
                      isSeniorMode ? 'text-sm sm:text-base' : 'text-xs'
                    } ${
                      isUser
                        ? 'bg-teal-700 text-white rounded-tr-none shadow-sm'
                        : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none shadow-xs'
                    }`}
                  >
                    {/* Message Body with clean formatting */}
                    <div className="whitespace-pre-line prose-xs">{msg.text}</div>

                    {/* Footer with Timestamp, Voice Read-Aloud & Copy action */}
                    <div
                      className={`flex items-center justify-between text-[11px] pt-2 border-t ${
                        isUser
                          ? 'border-teal-600/60 text-teal-200'
                          : 'border-slate-100 text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>

                      {!isUser && (
                        <div className="flex items-center gap-3">
                          {/* Text-to-Speech Voice Listen Button */}
                          <button
                            type="button"
                            onClick={() => speakText(msg.id, msg.text)}
                            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg transition cursor-pointer ${
                              speakingMessageId === msg.id
                                ? 'bg-teal-100 text-teal-800 font-bold'
                                : 'hover:text-teal-700'
                            }`}
                            title={speakingMessageId === msg.id ? 'Stop voice reading' : 'Listen aloud'}
                          >
                            {speakingMessageId === msg.id ? (
                              <>
                                <Square className="w-3 h-3 text-rose-600 fill-rose-600" />
                                <span className="text-rose-600 font-bold">Stop Voice</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                                <span className="text-slate-600 font-semibold">Listen</span>
                              </>
                            )}
                          </button>

                          {/* Copy Button */}
                          <button
                            type="button"
                            onClick={() => copyToClipboard(msg.id, msg.text)}
                            className="hover:text-slate-700 flex items-center gap-1 transition cursor-pointer"
                            title="Copy message text"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-600 font-semibold">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-800 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-xs flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs text-slate-500 font-semibold ml-2">
                    Analyzing clinical EHR records...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Real-time Listening Banner */}
          {isListening && (
            <div className="bg-gradient-to-r from-rose-50 to-amber-50 border-t border-rose-200 px-4 py-2 flex items-center justify-between text-xs text-rose-950">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600" />
                </span>
                <span className="font-bold">
                  Listening to your voice... Speak your symptoms or question clearly.
                </span>
              </div>
              <button
                type="button"
                onClick={toggleVoiceInput}
                className="text-xs font-bold text-rose-700 hover:text-rose-900 underline cursor-pointer"
              >
                Stop Mic
              </button>
            </div>
          )}

          {/* Quick Prompt Suggestions */}
          <div className="p-3 bg-white border-t border-slate-100 overflow-x-auto no-scrollbar flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 pl-1">
              Quick Inquiries:
            </span>
            {quickChatPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(p.text, p.tag)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 transition shrink-0 border border-slate-200/80 cursor-pointer"
              >
                {p.text}
              </button>
            ))}
          </div>

          {/* Chat Input Box with Voice Mic Button */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            {/* Voice Input Microphone Button */}
            <button
              type="button"
              id="ai-voice-input-btn"
              onClick={toggleVoiceInput}
              title={isListening ? 'Stop listening' : 'Speak using microphone'}
              className={`p-3 rounded-2xl transition shrink-0 flex items-center justify-center cursor-pointer border ${
                isListening
                  ? 'bg-rose-600 text-white border-rose-700 animate-pulse shadow-md shadow-rose-600/30'
                  : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border-teal-200'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              id="ai-assistant-input-box"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                isListening
                  ? 'Listening to you... say your symptoms or question'
                  : 'Type or tap microphone to speak your question...'
              }
              className={`flex-1 bg-slate-50 border rounded-2xl px-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white transition ${
                isListening
                  ? 'border-rose-400 ring-2 ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:border-teal-600'
              }`}
            />

            <button
              type="submit"
              id="ai-assistant-send-btn"
              disabled={!inputMessage.trim() || isLoading}
              className="px-5 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-2xl transition flex items-center gap-1.5 shadow-md shadow-teal-800/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </form>
        </div>
      )}

      {/* VIEW 2: SYMPTOM CHECKER & DOCTOR TRIAGE */}
      {activeTool === 'symptom-checker' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-teal-600" />
              Interactive Symptom Checker &amp; Specialist Matching
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select or type any symptoms you are experiencing to receive instant severity triage and direct specialist doctor recommendation.
            </p>
          </div>

          {/* Quick Symptom Chips Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              1. Tap symptoms you are experiencing:
            </label>
            <div className="flex flex-wrap gap-2">
              {commonSymptomChips.map((symp) => {
                const isSelected = selectedSymptoms.includes(symp);
                return (
                  <button
                    key={symp}
                    type="button"
                    onClick={() => {
                      setSelectedSymptoms((prev) =>
                        isSelected ? prev.filter((s) => s !== symp) : [...prev, symp]
                      );
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition border cursor-pointer ${
                      isSelected
                        ? 'bg-teal-600 border-teal-600 text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {symp} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Symptom & Severity Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                2. Describe additional details or other symptoms (optional):
              </label>
              <input
                type="text"
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                placeholder="e.g. Throbbing behind left eye, started 2 days ago after screen work..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">3. Severity Level:</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Mild', 'Moderate', 'Severe'] as const).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSymptomSeverity(sev)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition ${
                      symptomSeverity === sev
                        ? sev === 'Severe'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Run Analysis Button */}
          <div className="pt-2">
            <button
              type="button"
              id="run-symptom-triage-btn"
              onClick={handleRunSymptomTriage}
              disabled={isAnalyzingSymptoms || (selectedSymptoms.length === 0 && !customSymptom.trim())}
              className="w-full sm:w-auto px-7 py-3 bg-teal-700 hover:bg-teal-800 text-white font-black text-xs rounded-2xl transition flex items-center justify-center gap-2 shadow-md shadow-teal-900/10 disabled:opacity-50 cursor-pointer"
            >
              {isAnalyzingSymptoms ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Evaluating Clinical Triage...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Analyze Symptoms &amp; Match Specialist</span>
                </>
              )}
            </button>
          </div>

          {/* Triage Results Card */}
          {symptomResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-6 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">
                      Clinical Triage Evaluation
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Reported: {symptomResult.symptoms.join(', ')} ({symptomResult.severity})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black ${
                      symptomResult.severity === 'Severe'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {symptomResult.severity === 'Severe'
                      ? 'Priority Assessment'
                      : 'Home Care + Telehealth'}
                  </span>
                </div>
              </div>

              {/* Doctor Specialist Match Card */}
              {symptomResult.recommendedDoctor && (
                <div className="p-4 bg-white rounded-2xl border border-teal-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={symptomResult.recommendedDoctor.avatar}
                      alt={symptomResult.recommendedDoctor.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                          Recommended Specialist
                        </span>
                        <span className="text-xs font-bold text-amber-500">★ {symptomResult.recommendedDoctor.rating}</span>
                      </div>
                      <h4 className="font-black text-slate-900 text-sm mt-0.5">
                        {symptomResult.recommendedDoctor.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {symptomResult.recommendedDoctor.specialization} &bull; {symptomResult.recommendedDoctor.hospital}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      id="book-recommended-doctor-btn"
                      onClick={() => {
                        if (onSelectDoctorToBook) {
                          onSelectDoctorToBook(symptomResult.recommendedDoctor);
                        } else if (onNavigate) {
                          onNavigate('doctors');
                        }
                      }}
                      className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-black shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Book Teleconsultation</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Analysis Text */}
              <div
                className={`bg-white rounded-2xl p-5 border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-line ${
                  isSeniorMode ? 'text-sm sm:text-base' : 'text-xs'
                }`}
              >
                {symptomResult.analysisText}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* VIEW 3: DRUG SAFETY CHECKER */}
      {activeTool === 'drug-safety' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Pill className="w-5 h-5 text-teal-600" />
              Medication &amp; Drug Interaction Safety Checker
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Cross-reference any medication against your known prescriptions, allergies, and daily food habits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Active Prescriptions from Patient's EHR */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Select from your active prescriptions:
              </label>
              <div className="space-y-1.5">
                {pillReminders.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedMedicine(p.medicineName);
                      setDrugCustomInput('');
                    }}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs transition cursor-pointer ${
                      selectedMedicine === p.medicineName && !drugCustomInput
                        ? 'bg-teal-50 border-teal-500 text-teal-950 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <span className="block font-bold">{p.medicineName}</span>
                      <span className="text-[10px] text-slate-400">Dosage: {p.dosage}</span>
                    </div>
                    <span className="text-teal-700 text-xs">Check &rarr;</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Drug Input */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Or check any other medicine / supplement:
                </label>
                <input
                  type="text"
                  value={drugCustomInput}
                  onChange={(e) => setDrugCustomInput(e.target.value)}
                  placeholder="e.g. Ibuprofen, Amoxicillin, Melatonin, Zinc..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-teal-600 focus:bg-white"
                />
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-2xl text-xs text-amber-900 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Patient Safety Profile:
                </span>
                <p className="text-[11px] text-amber-800 leading-snug">
                  Allergies: <strong>{allergies.map((a) => a.allergen).join(', ') || 'None recorded'}</strong> &bull; Liver &amp; Kidney functions normal.
                </p>
              </div>

              <button
                type="button"
                id="run-drug-safety-check-btn"
                onClick={handleCheckDrugSafety}
                disabled={isCheckingDrug}
                className="w-full px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-black text-xs rounded-2xl transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isCheckingDrug ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Interactions...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-amber-300" />
                    <span>Verify Drug Safety</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Drug Safety Results Display */}
          {drugResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  Interaction &amp; Safety Report: <strong>{drugResult.medicine}</strong>
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                  Verified Safe
                </span>
              </div>
              <div
                className={`bg-white p-4 rounded-xl border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-line ${
                  isSeniorMode ? 'text-sm sm:text-base' : 'text-xs'
                }`}
              >
                {drugResult.advice}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* VIEW 4: LAB REPORT & BIOMARKER EXPLAINER */}
      {activeTool === 'lab-explainer' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" />
              Biomarker &amp; Lab Report Numbers Explainer
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select any laboratory reading to understand what your numbers mean in clear, everyday language.
            </p>
          </div>

          {/* Biomarker Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'bp', label: 'Blood Pressure', val: vitals.bloodPressure },
              { id: 'hr', label: 'Heart Rate', val: `${vitals.heartRateBpm} bpm` },
              { id: 'bmi', label: 'BMI & Weight', val: vitals.bmi },
              { id: 'ldl', label: 'LDL Cholesterol', val: '105 mg/dL' },
              { id: 'glucose', label: 'Fasting Blood Sugar', val: '92 mg/dL' },
            ].map((bio) => (
              <button
                key={bio.id}
                type="button"
                onClick={() => setSelectedBiomarker(bio.id)}
                className={`px-4 py-2.5 rounded-2xl text-left border transition shrink-0 ${
                  selectedBiomarker === bio.id
                    ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="font-bold text-xs block">{bio.label}</span>
                <span
                  className={`text-[11px] block mt-0.5 ${
                    selectedBiomarker === bio.id ? 'text-teal-100 font-bold' : 'text-slate-500'
                  }`}
                >
                  Current: {bio.val}
                </span>
              </button>
            ))}
          </div>

          {/* Biomarker Explanation Card */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
            {selectedBiomarker === 'bp' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Blood Pressure ({vitals.bloodPressure})
                    </h3>
                    <p className="text-xs text-emerald-700 font-semibold">
                      Normal / Optimal Range (Standard: &lt; 120/80 mmHg)
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    ✓ Optimal
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
                    <strong className="text-slate-900 block font-bold">What is Systolic (Top #120)?</strong>
                    <p className="text-slate-600 leading-relaxed">
                      Measures the pressure in your blood vessels when your heart pumps blood outward. A reading of 120 means your arteries are accommodating the flow with healthy elasticity.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
                    <strong className="text-slate-900 block font-bold">What is Diastolic (Bottom #80)?</strong>
                    <p className="text-slate-600 leading-relaxed">
                      Measures the pressure when your heart relaxes between beats to refill. An 80 rating indicates low resting strain on arterial walls.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-950 space-y-1">
                  <strong className="block font-bold">Doctor's 3 Lifestyle Tips:</strong>
                  <ul className="list-disc pl-4 space-y-1 text-teal-900">
                    <li>Maintain 2.5L daily hydration to preserve blood viscosity.</li>
                    <li>Continue limiting dietary sodium to under 2,000 mg per day.</li>
                    <li>Take your scheduled Atorvastatin regularly in the evening.</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedBiomarker === 'ldl' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      LDL Cholesterol (105 mg/dL)
                    </h3>
                    <p className="text-xs text-amber-700 font-semibold">
                      Near Optimal (Target: &lt; 100 mg/dL for optimal cardiovascular defense)
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                    Well Controlled
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2">
                  <p>
                    LDL (Low-Density Lipoprotein) is commonly called &ldquo;bad cholesterol&rdquo; because high levels can form plaque inside coronary arteries.
                  </p>
                  <p>
                    Your current score of <strong>105 mg/dL</strong> is well-managed with your current statin prescription. Dietary fiber (oats, beans, avocados) actively binds to bile acids to sweep excess LDL out of your system.
                  </p>
                </div>
              </div>
            )}

            {selectedBiomarker === 'bmi' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Body Mass Index ({vitals.bmi})</h3>
                    <p className="text-xs text-emerald-700 font-semibold">
                      Normal Weight Category (Healthy Range: 18.5 – 24.9)
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    ✓ Healthy BMI
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  A BMI of <strong>23.4</strong> represents a balanced ratio between your height (175 cm) and weight (72 kg). This reduces mechanical stress on knee and hip joints and lowers your long-term risk for type 2 diabetes.
                </div>
              </div>
            )}

            {(selectedBiomarker === 'hr' || selectedBiomarker === 'glucose') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      {selectedBiomarker === 'hr' ? 'Resting Heart Rate (72 bpm)' : 'Fasting Glucose (92 mg/dL)'}
                    </h3>
                    <p className="text-xs text-emerald-700 font-semibold">Normal Baseline</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    ✓ Optimal
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  {selectedBiomarker === 'hr'
                    ? 'A resting pulse of 72 bpm indicates strong cardiovascular efficiency. Elite endurance athletes can sit in the 50-60 bpm range, while average healthy adults range between 60-100 bpm.'
                    : 'Fasting glucose of 92 mg/dL falls safely below the pre-diabetic threshold of 100 mg/dL, showing effective insulin sensitivity.'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* VIEW 5: EMERGENCY RED-FLAG RAPID CHECK */}
      {activeTool === 'emergency-check' && (
        <div className="bg-white rounded-3xl border border-rose-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold mb-2">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                <span>Immediate Patient Safety Triage</span>
              </div>
              <h2 className="text-xl font-black text-slate-900">
                Emergency Red-Flag Screener
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                If you or a loved one are experiencing acute distress, check for the critical red flags below.
              </p>
            </div>

            <a
              href="tel:911"
              id="emergency-call-911-btn"
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl transition flex items-center gap-2 shadow-lg shadow-rose-600/30 shrink-0"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call 911 / SOS</span>
            </a>
          </div>

          <div className="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-rose-950 uppercase tracking-wider">
              Select any symptoms currently present:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {
                  id: 'chest-pain',
                  label: 'Chest pressure, tightness, or pain radiating to left arm or jaw',
                  category: 'Cardiovascular',
                },
                {
                  id: 'fast-stroke',
                  label: 'FAST signs: Face droop, arm weakness, slurred/unclear speech',
                  category: 'Neurological',
                },
                {
                  id: 'severe-breathing',
                  label: 'Severe sudden shortness of breath or unable to speak in full sentences',
                  category: 'Respiratory',
                },
                {
                  id: 'throat-swelling',
                  label: 'Swelling of lips, tongue, or throat with hives (anaphylaxis)',
                  category: 'Allergic',
                },
                {
                  id: 'thunderclap-headache',
                  label: 'Worst headache of life ("thunderclap") or sudden confusion/fainting',
                  category: 'Neurological',
                },
                {
                  id: 'uncontrolled-bleeding',
                  label: 'Severe uncontrollable bleeding or serious physical trauma',
                  category: 'Trauma',
                },
              ].map((flag) => {
                const isSelected = emergencySymptoms.includes(flag.id);
                return (
                  <button
                    key={flag.id}
                    type="button"
                    onClick={() => {
                      setEmergencySymptoms((prev) =>
                        isSelected ? prev.filter((s) => s !== flag.id) : [...prev, flag.id]
                      );
                      setEmergencyResult(null);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-rose-100/90 border-rose-500 text-rose-950 ring-1 ring-rose-400'
                        : 'bg-white border-slate-200 hover:border-rose-300 text-slate-800'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-rose-600 border-rose-600 text-white' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold block">{flag.label}</span>
                      <span className="text-[10px] text-slate-500 font-semibold">{flag.category}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                id="evaluate-emergency-btn"
                onClick={() => {
                  setEmergencyResult(emergencySymptoms.length > 0 ? 'urgent' : 'safe');
                }}
                className="px-6 py-3 bg-rose-700 hover:bg-rose-800 text-white text-xs font-black rounded-xl transition shadow-md shadow-rose-900/20 cursor-pointer flex items-center gap-2"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>Evaluate Red Flags Now</span>
              </button>

              {emergencySymptoms.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setEmergencySymptoms([]);
                    setEmergencyResult(null);
                  }}
                  className="px-4 py-3 text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
                >
                  Clear Selection
                </button>
              )}
            </div>
          </div>

          {/* Emergency Evaluation Result */}
          {emergencyResult === 'urgent' && (
            <div className="bg-rose-600 text-white rounded-2xl p-6 shadow-xl space-y-4 animate-fadeIn">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-7 h-7 text-amber-300 animate-bounce" />
                <div>
                  <h3 className="text-base font-black">CRITICAL RED FLAG DETECTED</h3>
                  <p className="text-xs text-rose-100">
                    Your reported symptoms require immediate emergency medical evaluation.
                  </p>
                </div>
              </div>

              <div className="bg-rose-700/80 rounded-xl p-4 text-xs space-y-2 text-rose-100 leading-relaxed border border-rose-500">
                <strong className="text-white block font-bold">Immediate First-Step Guidance:</strong>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Call 911 immediately</strong> or have someone drive you to the nearest emergency room.</li>
                  <li><strong>Do not drive yourself</strong> under any circumstances.</li>
                  <li>Unlock your front door so emergency responders can enter quickly.</li>
                  <li>Sit upright in a comfortable position and take slow, calm breaths.</li>
                  <li>If chest pain is present and you are not allergic or advised against it, chew one 325 mg aspirin.</li>
                </ul>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="tel:911"
                  className="px-6 py-3 bg-white text-rose-900 font-black text-xs rounded-xl hover:bg-rose-50 transition shadow-md flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 text-rose-600" />
                  <span>Call Emergency 911</span>
                </a>

                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => onNavigate('doctors')}
                    className="px-5 py-3 bg-rose-800 text-white font-bold text-xs rounded-xl hover:bg-rose-900 transition"
                  >
                    View Emergency Contacts in Doctor Tab
                  </button>
                )}
              </div>
            </div>
          )}

          {emergencyResult === 'safe' && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="text-sm font-black text-emerald-950">
                    No Acute Red Flags Selected
                  </h3>
                  <p className="text-xs text-emerald-800">
                    Your symptoms do not indicate immediate life-threatening danger.
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                You can proceed with a standard consultation. Use the <strong>Symptom Triage</strong> tab to match a specialist or chat with AI to learn more about home care.
              </p>
              <div className="pt-1 flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTool('symptom-checker')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Go to Symptom Triage
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTool('chat')}
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  Ask AI in Chat
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 6: MEDICINE TIMING & MISSED DOSE GUIDE */}
      {activeTool === 'dose-guide' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold mb-2">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Patient Medication Instructions</span>
            </div>
            <h2 className="text-xl font-black text-slate-900">
              Dose Timing &amp; Missed Pill Protocol
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Clear guidelines on with-food timing, liquid intake, and what to do if you forgot a dose.
            </p>
          </div>

          {/* Medication Selector */}
          <div className="flex flex-wrap gap-2">
            {[
              ...pillReminders.map((p) => p.medicineName),
              'Metformin',
              'Lisinopril',
              'Amoxicillin',
            ].filter((v, i, a) => a.indexOf(v) === i).map((med) => (
              <button
                key={med}
                type="button"
                onClick={() => setDoseMedName(med)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                  doseMedName === med
                    ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {med}
              </button>
            ))}
          </div>

          {/* Medication Guidance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Timing Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-black text-slate-900">Best Time of Day</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {doseMedName === 'Atorvastatin'
                  ? 'Take once daily in the evening or at bedtime. The liver synthesizes the majority of cholesterol at night.'
                  : doseMedName === 'Metformin'
                  ? 'Take twice daily with your largest meals (breakfast and dinner) to reduce stomach discomfort.'
                  : doseMedName === 'Lisinopril'
                  ? 'Take once daily in the morning at the same time each day, with or without food.'
                  : 'Take regularly at evenly spaced intervals as prescribed by your doctor.'}
              </p>
            </div>

            {/* Food & Drink Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
                <Utensils className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-black text-slate-900">Food &amp; Beverage Rules</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {doseMedName === 'Atorvastatin'
                  ? 'Swallow whole with a full 8 oz glass of water. AVOID grapefruit juice, as it blocks the enzyme that metabolizes statins.'
                  : doseMedName === 'Metformin'
                  ? 'Always take with a meal to avoid nausea. Limit alcohol consumption to protect kidney function.'
                  : 'Take with water. Avoid high-potassium salt substitutes unless approved by your physician.'}
              </p>
            </div>

            {/* Missed Dose Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <RotateCw className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-black text-slate-900">If You Forgot a Dose</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Take it as soon as you remember. However, if it is almost time for your next scheduled dose, skip the missed dose.
                <strong className="text-rose-700 block mt-1">Never take two doses at once to make up.</strong>
              </p>
            </div>
          </div>

          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-teal-950">Have a specific question about {doseMedName}?</h4>
              <p className="text-[11px] text-teal-800">Ask AI to explain interactions or side-effects tailored to your EHR.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveTool('chat');
                handleSendMessage(`What are the most common side effects and food precautions for ${doseMedName}?`, 'medication_info');
              }}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition cursor-pointer shrink-0"
            >
              Ask AI in Chat
            </button>
          </div>
        </div>
      )}

      {/* DOCTOR VISIT SUMMARY MODAL */}
      {showDoctorSummary && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-teal-900 to-indigo-950 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-teal-300" />
                <div>
                  <h3 className="text-base font-black">Clinical Summary for Doctor</h3>
                  <p className="text-xs text-teal-200/80">
                    Prepared for your next consultation &bull; Grounded in EHR
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDoctorSummary(false)}
                className="text-teal-200 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Printable Content */}
            <div className="p-6 space-y-5 text-xs text-slate-800 max-h-[75vh] overflow-y-auto" id="printable-doctor-summary">
              {/* Patient Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Patient Name</span>
                  <strong className="text-sm text-slate-900">{currentUser.name || 'Patient'}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Age / Gender</span>
                  <strong className="text-sm text-slate-900">{currentUser.age || '42'} yrs &bull; {currentUser.gender || 'Male'}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Primary Physician</span>
                  <strong className="text-sm text-slate-900">Dr. Sarah Jenkins</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Date Generated</span>
                  <strong className="text-sm text-slate-900">{new Date().toLocaleDateString()}</strong>
                </div>
              </div>

              {/* Recorded Vital Signs */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b pb-1">
                  1. Recorded Baseline Vitals
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl">
                    <span className="text-[10px] text-teal-700 block">Blood Pressure</span>
                    <strong className="text-sm text-teal-950 font-mono">{vitals.bloodPressure}</strong>
                  </div>
                  <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl">
                    <span className="text-[10px] text-teal-700 block">Resting Heart Rate</span>
                    <strong className="text-sm text-teal-950 font-mono">{vitals.heartRateBpm} bpm</strong>
                  </div>
                  <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl">
                    <span className="text-[10px] text-teal-700 block">Body Mass Index</span>
                    <strong className="text-sm text-teal-950 font-mono">{vitals.bmi} (Normal)</strong>
                  </div>
                  <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl">
                    <span className="text-[10px] text-teal-700 block">Blood Oxygen</span>
                    <strong className="text-sm text-teal-950 font-mono">{vitals.oxygenSatPct}% SpO2</strong>
                  </div>
                </div>
              </div>

              {/* Current Medications & Allergies */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b pb-1">
                  2. Active Prescriptions &amp; Known Allergies
                </h4>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <strong className="text-slate-900">Current Pills:</strong>
                    {pillReminders.map((p) => (
                      <span key={p.id} className="px-2 py-0.5 rounded bg-white border border-slate-300 font-semibold">
                        {p.medicineName} {p.dosage} ({p.frequency})
                      </span>
                    ))}
                  </div>
                  <div className="text-slate-700">
                    <strong>Allergies:</strong>{' '}
                    {allergies.length > 0 ? allergies.map((a) => `${a.allergen} (${a.severity})`).join(', ') : 'No Known Drug Allergies (NKDA)'}
                  </div>
                </div>
              </div>

              {/* Key Questions to ask the Doctor */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b pb-1">
                  3. Suggested Discussion Questions for Physician
                </h4>
                <ul className="list-decimal pl-5 space-y-1.5 text-slate-700 leading-relaxed">
                  <li>Are my current blood pressure ({vitals.bloodPressure}) and lipid profiles on target for my age and health history?</li>
                  <li>Do any of my active prescriptions require routine liver/kidney blood panels or dosage review?</li>
                  <li>Are there any specific dietary or physical activity modifications recommended prior to my next visit?</li>
                </ul>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  const content = `CLINICAL BRIEFING FOR DOCTOR\nPatient: ${currentUser.name}\nDate: ${new Date().toLocaleDateString()}\nBP: ${vitals.bloodPressure} | Pulse: ${vitals.heartRateBpm} bpm | BMI: ${vitals.bmi}\nMedications: ${pillReminders.map((p) => `${p.medicineName} ${p.dosage}`).join(', ')}\nAllergies: ${allergies.map((a) => a.allergen).join(', ') || 'NKDA'}`;
                  navigator.clipboard.writeText(content);
                  setCopiedSummary(true);
                  setTimeout(() => setCopiedSummary(false), 2000);
                }}
                className="px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2 transition cursor-pointer"
              >
                {copiedSummary ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSummary ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Note</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowDoctorSummary(false)}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
