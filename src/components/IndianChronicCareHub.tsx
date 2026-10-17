import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  Heart,
  Sparkles,
  Wind,
  Pill,
  Stethoscope,
  Utensils,
  Dumbbell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Clock,
  ShieldCheck,
  ChevronRight,
  TrendingDown,
  Apple,
  Sun,
  Flame,
  UserCheck,
  Building2,
  Check,
  ExternalLink,
} from 'lucide-react';
import { INDIAN_CHRONIC_CARE_DATA, IndianDiseaseAnalysis } from '../data/indianChronicCareData';
import { useHealth } from '../context/HealthContext';
import { Doctor, Medicine } from '../types';

interface IndianChronicCareHubProps {
  onNavigateToPharmacy?: (query?: string) => void;
  onSelectDoctorToBook?: (doctor: Doctor) => void;
  initialDiseaseId?: 'diabetes' | 'heart_bp' | 'thyroid' | 'respiratory';
}

export const IndianChronicCareHub: React.FC<IndianChronicCareHubProps> = ({
  onNavigateToPharmacy,
  onSelectDoctorToBook,
  initialDiseaseId = 'diabetes',
}) => {
  const { doctors, medicines, addToCart, addNotification } = useHealth();
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<'diabetes' | 'heart_bp' | 'thyroid' | 'respiratory'>(initialDiseaseId);
  const [activeSection, setActiveSection] = useState<'all' | 'tablets' | 'doctors' | 'diet' | 'exercise'>('all');
  const [addedItemName, setAddedItemName] = useState<string | null>(null);

  const disease = INDIAN_CHRONIC_CARE_DATA.find((d) => d.id === selectedDiseaseId) || INDIAN_CHRONIC_CARE_DATA[0];

  const mapDosageForm = (form?: string): Medicine['dosageForm'] => {
    if (!form) return 'Tablet';
    const lower = form.toLowerCase();
    if (lower.includes('capsule')) return 'Capsule';
    if (lower.includes('syrup')) return 'Syrup';
    if (lower.includes('inhaler')) return 'Inhaler';
    if (lower.includes('injection')) return 'Injection';
    return 'Tablet';
  };

  const mapCategory = (diseaseName: string): Medicine['category'] => {
    if (diseaseName.includes('Diabetes')) return 'Diabetes Care';
    if (diseaseName.includes('Heart') || diseaseName.includes('Hypertension')) return 'Cardiovascular';
    if (diseaseName.includes('Thyroid')) return 'Thyroid Care';
    if (diseaseName.includes('Respiratory')) return 'Respiratory';
    return 'Diabetes Care';
  };

  const handleAddToCart = (tablet: typeof disease.tablets[0]) => {
    // Check if this medicine exists in our store catalog
    const foundMed = medicines.find(
      (m) =>
        m.name.toLowerCase().includes(tablet.brandName.toLowerCase().split(' ')[0]) ||
        tablet.brandName.toLowerCase().includes(m.name.toLowerCase().split(' ')[0])
    );

    if (foundMed) {
      addToCart(foundMed, 1);
    } else {
      const fallbackMed: Medicine = {
        id: `med-ind-${tablet.brandName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: tablet.brandName,
        genericName: tablet.genericComposition,
        strength: tablet.strength,
        dosageForm: mapDosageForm(tablet.dosageForm),
        category: mapCategory(disease.name),
        price: tablet.mrpInINR,
        discountPrice: tablet.discountPriceInINR,
        stock: 50,
        rating: 4.8,
        reviewsCount: 36,
        requiresPrescription: tablet.requiresPrescription,
        manufacturer: tablet.manufacturer,
        description: `${tablet.clinicalUse}. Frequency: ${tablet.frequency}. ${tablet.instructions}`,
        uses: [tablet.clinicalUse],
        sideEffects: ['Use as prescribed by a licensed healthcare professional'],
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80',
      };
      addToCart(fallbackMed, 1);
    }

    addNotification(
      'Added to Pharmacy Bag',
      `${tablet.brandName} (${tablet.strength}) added to cart for ₹${tablet.discountPriceInINR}.`,
      'order'
    );

    setAddedItemName(tablet.brandName);
    setTimeout(() => {
      setAddedItemName(null);
    }, 2500);
  };

  const handleBookDoctor = (docInfo: typeof disease.doctors[0]) => {
    // Find matching doctor in context or create compatible doctor
    const match = doctors.find((d) => d.name.toLowerCase().includes(docInfo.name.toLowerCase().split(' ')[1] || ''));
    if (match && onSelectDoctorToBook) {
      onSelectDoctorToBook(match);
    } else if (onSelectDoctorToBook) {
      // Fallback object matching Doctor interface
      const tempDoc: Doctor = {
        id: `doc-ind-${selectedDiseaseId}`,
        name: docInfo.name,
        title: docInfo.qualifications,
        specialization: docInfo.specialization,
        experienceYears: docInfo.experienceYears,
        fee: docInfo.feeInINR,
        rating: docInfo.rating,
        reviewCount: docInfo.reviewCount,
        avatar: docInfo.avatar,
        education: docInfo.qualifications,
        hospital: docInfo.hospital,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        availableSlots: ['10:00 AM', '11:30 AM', '04:00 PM', '06:00 PM'],
        bio: `${docInfo.specialization} with ${docInfo.experienceYears}+ years of clinical excellence in India.`,
        languages: docInfo.languages,
        isAvailableToday: docInfo.availableToday,
      };
      onSelectDoctorToBook(tempDoc);
    }
  };

  const getDiseaseIcon = (id: string) => {
    switch (id) {
      case 'diabetes':
        return <Activity className="w-5 h-5 text-emerald-600" />;
      case 'heart_bp':
        return <Heart className="w-5 h-5 text-rose-600" />;
      case 'thyroid':
        return <Sparkles className="w-5 h-5 text-purple-600" />;
      case 'respiratory':
        return <Wind className="w-5 h-5 text-blue-600" />;
      default:
        return <Activity className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-teal-800/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold">
            <span>🇮🇳 Indian Healthcare Priority Focus</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Top 4 Chronic Conditions in India: Analysis &amp; Clinical Protocols
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Researched clinical analysis for India’s primary chronic conditions: <strong>Diabetes</strong>, <strong>Heart / High BP</strong>, <strong>Thyroid</strong>, and <strong>Respiratory</strong>. Explore verified Indian pharmaceutical tablets, leading specialist doctors, authentic Indian diets, and yoga exercises — priced accurately in Indian Rupees (₹ INR).
          </p>

          {/* Quick Notification of item added to cart */}
          {addedItemName && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-bold shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>Added {addedItemName} to Pharmacy Bag in ₹ INR!</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* 4 Disease Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {INDIAN_CHRONIC_CARE_DATA.map((d) => {
          const isSelected = d.id === selectedDiseaseId;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                setSelectedDiseaseId(d.id);
                setActiveSection('all');
              }}
              className={`p-4 rounded-2xl border text-left transition relative cursor-pointer ${
                isSelected
                  ? 'bg-white border-teal-600 shadow-md ring-2 ring-teal-500/20'
                  : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  d.id === 'diabetes' ? 'bg-emerald-100' :
                  d.id === 'heart_bp' ? 'bg-rose-100' :
                  d.id === 'thyroid' ? 'bg-purple-100' : 'bg-blue-100'
                }`}>
                  {getDiseaseIcon(d.id)}
                </div>
                {isSelected && (
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                )}
              </div>

              <h3 className="font-black text-slate-900 text-sm">{d.name.split(' ')[0]}</h3>
              <p className="text-[11px] font-bold text-teal-700 mt-0.5">{d.hindiName.split(' ')[0]}</p>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{d.tagline}</p>
            </button>
          );
        })}
      </div>

      {/* Sub-Section Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-2xl text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveSection('all')}
          className={`px-4 py-2 rounded-xl transition ${
            activeSection === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Complete Overview
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('tablets')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeSection === 'tablets' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Pill className="w-3.5 h-3.5 text-teal-600" />
          <span>Tablets in India (₹ INR)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('doctors')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeSection === 'doctors' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
          <span>Specialist Doctors (₹ INR)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('diet')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeSection === 'diet' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Utensils className="w-3.5 h-3.5 text-emerald-600" />
          <span>Indian Diet &amp; Meals</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('exercise')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeSection === 'exercise' ? 'bg-white text-purple-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Dumbbell className="w-3.5 h-3.5 text-purple-600" />
          <span>Yoga &amp; Exercises</span>
        </button>
      </div>

      {/* Disease Detail Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={disease.id + activeSection}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Analysis & Context in India */}
          {(activeSection === 'all') && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${disease.badgeColor}`}>
                      {disease.name}
                    </span>
                    <span className="text-xs font-bold text-slate-500">({disease.hindiName})</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    Epidemiological Analysis &amp; Impact in India
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-xs">
                {/* Left: Prevalence & Causes */}
                <div className="md:col-span-7 space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 leading-relaxed text-slate-700">
                    <strong className="text-slate-900 block mb-1">Prevalence &amp; Clinical Context:</strong>
                    {disease.prevalenceInIndia}
                  </div>

                  <div>
                    <h4 className="font-black text-slate-900 mb-2">Key Drivers &amp; Root Causes in India:</h4>
                    <div className="space-y-1.5">
                      {disease.rootCausesInIndia.map((cause, i) => (
                        <div key={i} className="flex items-start gap-2 text-slate-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                          <span>{cause}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-black text-slate-900 mb-2">Primary Symptoms to Monitor:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {disease.keySymptoms.map((sym, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-amber-950 font-medium text-[11px] flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{sym}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Ideal Target Lab Markers */}
                <div className="md:col-span-5 bg-gradient-to-br from-teal-50/50 to-slate-50 rounded-2xl p-4 border border-teal-100 space-y-3">
                  <div className="flex items-center gap-2 text-teal-900 font-black text-xs uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    <span>Target Clinical Blood &amp; Lab Values</span>
                  </div>

                  <p className="text-[11px] text-slate-600">
                    Standard healthy reference thresholds recommended by Indian medical councils (ICMR / Endocrine Society of India / CSI):
                  </p>

                  <div className="space-y-2">
                    {disease.idealLabTargets.map((item, i) => (
                      <div key={i} className="p-2.5 bg-white rounded-xl border border-teal-100 shadow-2xs space-y-0.5">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-800 text-[11px]">{item.test}</span>
                          <span className="font-black text-teal-700 text-xs px-2 py-0.5 bg-teal-50 rounded-md">
                            {item.target}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section: Tablets & Medications in India */}
          {(activeSection === 'all' || activeSection === 'tablets') && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-teal-600" />
                    <h3 className="font-black text-slate-900 text-base">
                      Prescribed Tablets &amp; Medications in India (Prices in ₹ INR)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Authentic formulations manufactured by certified Indian pharmaceutical companies with official MRP and discounted patient pricing.
                  </p>
                </div>

                {onNavigateToPharmacy && (
                  <button
                    type="button"
                    onClick={() => onNavigateToPharmacy(disease.name.split(' ')[0])}
                    className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                  >
                    <span>View in E-Pharmacy</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {disease.tablets.map((tab, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-teal-300 hover:shadow-xs transition space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                            {tab.dosageForm}
                          </span>
                          <h4 className="font-black text-slate-900 text-sm mt-1">{tab.brandName}</h4>
                          <p className="text-xs text-slate-600 font-medium">Salt: {tab.genericComposition}</p>
                          <p className="text-[11px] text-slate-400">Mfr: {tab.manufacturer}</p>
                        </div>

                        {tab.requiresPrescription && (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold shrink-0">
                            Rx Required
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-100">
                        {tab.clinicalUse}
                      </p>

                      <div className="text-[11px] text-slate-500 space-y-0.5">
                        <div><strong className="text-slate-700">Frequency:</strong> {tab.frequency}</div>
                        <div><strong className="text-slate-700">Instructions:</strong> {tab.instructions}</div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-black text-slate-900">
                            ₹{tab.discountPriceInINR}
                          </span>
                          <span className="text-xs text-slate-400 line-through">
                            MRP ₹{tab.mrpInINR}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                            {Math.round(((tab.mrpInINR - tab.discountPriceInINR) / tab.mrpInINR) * 100)}% OFF
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block font-medium">Inclusive of GST</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(tab)}
                        className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Pill className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Specialist Doctors in India */}
          {(activeSection === 'all' || activeSection === 'doctors') && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-teal-600" />
                    <h3 className="font-black text-slate-900 text-base">
                      Top Specialist Doctors in India for {disease.name.split(' ')[0]}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Consult with board-certified physicians, professors, and senior consultants across major Indian medical institutes (AIIMS, CMC, Medanta, Apollo).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {disease.doctors.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-teal-400 hover:shadow-xs transition flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-start gap-3">
                        <img
                          src={doc.avatar}
                          alt={doc.name}
                          className="w-13 h-13 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-black text-slate-900 text-sm truncate">{doc.name}</h4>
                          <p className="text-xs font-bold text-teal-700 truncate">{doc.specialization}</p>
                          <p className="text-[11px] text-slate-500 truncate">{doc.qualifications}</p>
                        </div>
                      </div>

                      <div className="mt-3 space-y-1 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-1.5 truncate">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{doc.hospital}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                          <span>{doc.experienceYears} Years Exp.</span>
                          <span className="text-slate-500">{doc.languages.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Consultation Fee</span>
                        <span className="text-base font-black text-slate-900">₹{doc.feeInINR}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleBookDoctor(doc)}
                        className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Book Visit</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Tailored Indian Diet Food */}
          {(activeSection === 'all' || activeSection === 'diet') && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-black text-slate-900 text-base">
                    Tailored Indian Diet Plan &amp; Meal Chart (भारतीय आहार)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Nutritionally balanced using traditional, bioavailable Indian whole foods, millets, and therapeutic spices.
                </p>
              </div>

              {/* Focus Banner */}
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
                <Apple className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Dietary Focus:</strong>
                  <span>{disease.dietPlan.focus}</span>
                </div>
              </div>

              {/* Morning Empty Stomach Ritual */}
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-amber-950 font-black">
                  <Sun className="w-4 h-4 text-amber-600" />
                  <span>Early Morning Empty Stomach Ritual (सुबह खाली पेट):</span>
                </div>
                <div className="text-amber-900 font-bold text-sm">
                  {disease.dietPlan.morningEmptyStomach.item}
                </div>
                <p className="text-amber-800 text-[11px] leading-relaxed">
                  <strong className="text-amber-950">Why it works: </strong>
                  {disease.dietPlan.morningEmptyStomach.rationale}
                </p>
              </div>

              {/* Daily Meal Timeline */}
              <div className="space-y-3">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">
                  Complete Daily Meal Schedule (नाश्ता, दोपहर का खाना, रात का खाना)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {disease.dietPlan.meals.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <div className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                          <span>{m.meal}</span>
                        </div>
                        <span className="font-mono text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                          {m.timing}
                        </span>
                      </div>

                      <ul className="space-y-1 text-slate-700">
                        {m.items.map((it, i) => (
                          <li key={i} className="flex items-start gap-2 text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="p-2 bg-white rounded-xl border border-slate-100 text-[10px] text-slate-500 italic">
                        Tip: {m.tips}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Foods to Eat vs Foods to Strictly Avoid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2 text-xs">
                  <div className="font-black text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Beneficial Indian Foods to Eat Regularly</span>
                  </div>
                  <ul className="space-y-1.5 text-emerald-900 text-[11px]">
                    {disease.dietPlan.foodsToEat.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">&check;</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-2 text-xs">
                  <div className="font-black text-rose-950 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Foods to Strictly Avoid (परहेज करें)</span>
                  </div>
                  <ul className="space-y-1.5 text-rose-900 text-[11px]">
                    {disease.dietPlan.foodsToStrictlyAvoid.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-rose-600 font-bold">&times;</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Section: Tailored Exercises & Yoga Asanas */}
          {(activeSection === 'all' || activeSection === 'exercise') && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-purple-600" />
                  <h3 className="font-black text-slate-900 text-base">
                    Tailored Exercise Routine &amp; Yogic Asanas (व्यायाम एवं योगासन)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Scientifically structured physical activity, Pranayama breathing, and restorative asanas safe for this condition.
                </p>
              </div>

              {/* Intensity & Frequency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200">
                  <span className="text-purple-700 font-bold block text-[11px]">Recommended Intensity:</span>
                  <span className="font-black text-purple-950 text-sm mt-0.5 block">{disease.exercisePlan.intensity}</span>
                </div>
                <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200">
                  <span className="text-purple-700 font-bold block text-[11px]">Weekly Frequency:</span>
                  <span className="font-black text-purple-950 text-sm mt-0.5 block">{disease.exercisePlan.frequency}</span>
                </div>
              </div>

              {/* Key Pranayamas */}
              <div className="space-y-2 text-xs">
                <h4 className="font-black text-slate-900 uppercase tracking-wider text-[11px]">
                  Therapeutic Pranayama (प्राणायाम एवं श्वसन क्रिया)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {disease.exercisePlan.keyPranayamas.map((pran, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex justify-between items-center">
                        <strong className="font-black text-slate-900 text-xs">{pran.name}</strong>
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-md">
                          {pran.duration}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">{pran.benefits}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Yoga Asanas */}
              <div className="space-y-2 text-xs">
                <h4 className="font-black text-slate-900 uppercase tracking-wider text-[11px]">
                  Recommended Yoga Asanas (योगासन)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {disease.exercisePlan.recommendedAsanas.map((as, i) => (
                    <div key={i} className="p-3 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-xs">{as.name}</span>
                        <span className="text-slate-400 text-[11px]">({as.englishName})</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{as.action}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Precautions */}
              <div className="p-3.5 bg-rose-50/70 rounded-2xl border border-rose-200 text-xs text-rose-950 space-y-1">
                <strong className="font-bold flex items-center gap-1.5 text-rose-900">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Important Safety Precautions:
                </strong>
                <ul className="space-y-1 text-rose-800 text-[11px]">
                  {disease.exercisePlan.precautions.map((prec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span>{prec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
