import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  User,
  Doctor,
  Appointment,
  Prescription,
  Medicine,
  CartItem,
  PharmacyOrder,
  PillReminder,
  WellnessPlan,
  HealthVitals,
  Allergy,
  DiagnosisRecord,
  LabReport,
  Transaction,
  HealthArticle,
  EducationalVideo,
  Review,
  AuditLog,
  InAppNotification,
  DailyWellnessStats,
  MedicineReturnRequest,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_DOCTORS,
  INITIAL_MEDICINES,
  INITIAL_APPOINTMENTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_ORDERS,
  INITIAL_PILL_REMINDERS,
  INITIAL_VITALS,
  INITIAL_ALLERGIES,
  INITIAL_DIAGNOSES,
  INITIAL_LAB_REPORTS,
  INITIAL_WELLNESS_PLANS,
  INITIAL_TRANSACTIONS,
  INITIAL_ARTICLES,
  INITIAL_VIDEOS,
  INITIAL_REVIEWS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_NOTIFICATIONS_BY_ROLE,
} from '../mockData';
import { translateText, applyDOMTranslation } from '../utils/translator';
import {
  db,
  auth,
  googleProvider,
  signInAnonymously,
  handleFirestoreError,
  OperationType,
  testConnection,
} from '../firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import { signInWithPopup, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';

interface HealthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: User;
  isLoggedIn: boolean;
  isFirebaseConnected: boolean;
  patientPhone: string;
  patientEmail: string;
  loginWithPhone: (phone: string, name?: string, targetRole?: UserRole) => void;
  loginWithEmail: (email: string, password?: string, targetRole?: UserRole, name?: string) => void;
  loginWithGoogle: (targetRole?: UserRole) => Promise<void>;
  createAccount: (data: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    role?: UserRole;
    age?: number;
    gender?: string;
    bloodGroup?: string;
    medicalId?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    allergies?: string[];
    specialization?: string;
    licenseNumber?: string;
    hospital?: string;
    experienceYears?: number;
    fee?: number;
    qualifications?: string;
    storeName?: string;
    gstin?: string;
    address?: string;
    operatingHours?: string;
  }) => void;
  logout: () => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  isEditProfileOpen: boolean;
  openEditProfile: () => void;
  closeEditProfile: () => void;
  t: (text: string) => string;
  
  // Doctors & Appointments
  doctors: Doctor[];
  appointments: Appointment[];
  bookAppointment: (doctor: Doctor, date: string, timeSlot: string, type: 'video' | 'in-clinic' | 'audio', reason: string) => Promise<Appointment>;
  cancelAppointment: (id: string) => void;
  startConsultation: (appointment: Appointment) => void;
  activeConsultation: Appointment | null;
  endConsultation: (notes?: string) => void;
  
  // Prescriptions
  prescriptions: Prescription[];
  createPrescription: (prescription: Omit<Prescription, 'id' | 'qrCodeHash' | 'digitalSignature'>) => Prescription;
  activePrescriptionModal: Prescription | null;
  setActivePrescriptionModal: (rx: Prescription | null) => void;
  addPrescriptionToCart: (prescription: Prescription) => void;

  // E-Pharmacy & Cart
  medicines: Medicine[];
  addMedicine: (medicine: Medicine) => void;
  updateMedicine: (id: string, updates: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;
  cart: CartItem[];
  addToCart: (medicine: Medicine, qty?: number) => void;
  removeFromCart: (medicineId: string) => void;
  updateCartQty: (medicineId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
  orders: PharmacyOrder[];
  checkoutOrder: (shippingAddress: PharmacyOrder['shippingAddress'], paymentMethod: string, rxFile?: string) => Promise<PharmacyOrder>;
  updateOrderStatus: (orderId: string, status: PharmacyOrder['status']) => void;

  // Medicine Returns (Expired / Damaged Items)
  medicineReturns: MedicineReturnRequest[];
  requestMedicineReturn: (params: Omit<MedicineReturnRequest, 'id' | 'requestedAt' | 'status'>) => MedicineReturnRequest;
  acceptMedicineReturn: (returnId: string, pharmacyNotes?: string) => void;
  rejectMedicineReturn: (returnId: string, reason?: string) => void;
  processReturnRequest: (
    returnId: string,
    decision: 'approve' | 'reject',
    notes?: string,
    quarantineBin?: string
  ) => void;

  // Pill Reminders
  pillReminders: PillReminder[];
  addPillReminder: (reminder: Omit<PillReminder, 'id' | 'todayTakenTimes' | 'active'>) => void;
  togglePillReminder: (id: string) => void;
  markPillTaken: (id: string, time: string) => void;
  deletePillReminder: (id: string) => void;

  // AI Wellness & Lifestyle
  wellnessPlans: WellnessPlan[];
  generateAIWellnessPlan: (type: 'diet' | 'exercise', goals: string, preferences: string) => Promise<WellnessPlan>;
  addCustomWellnessPlan: (plan: Omit<WellnessPlan, 'id' | 'createdAt'>) => void;

  // Daily Wellness Progress Stats
  wellnessStats: DailyWellnessStats;
  updateHydration: (deltaCups: number) => void;
  setHydrationCups: (cups: number) => void;
  updateActivitySteps: (deltaSteps: number, deltaMinutes?: number) => void;
  updateSleepHours: (hours: number, qualityScore?: number) => void;
  resetDailyWellnessStats: () => void;

  // EHR
  vitals: HealthVitals;
  updateVitals: (newVitals: Partial<HealthVitals>) => void;
  allergies: Allergy[];
  addAllergy: (allergy: Allergy) => void;
  diagnoses: DiagnosisRecord[];
  addDiagnosis: (diagnosis: Omit<DiagnosisRecord, 'id'>) => void;
  labReports: LabReport[];
  uploadLabReport: (report: Omit<LabReport, 'id'>) => void;

  // Payments & Billing
  transactions: Transaction[];
  activeReceipt: Transaction | null;
  setActiveReceipt: (tx: Transaction | null) => void;
  processDirectPayment: (type: Transaction['type'], title: string, amount: number, method: Transaction['paymentMethod'], refId: string) => Transaction;

  // Education
  articles: HealthArticle[];
  likeArticle: (id: string) => void;
  videos: EducationalVideo[];
  toggleWatchlist: (id: string) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;

  // Security & Audit
  auditLogs: AuditLog[];
  logAuditEvent: (category: AuditLog['category'], details: string, severity?: AuditLog['severity']) => void;

  // Notifications
  notifications: InAppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (targetRole?: UserRole | 'all') => void;
  clearAllNotifications: (clearRoleOnly?: boolean) => void;
  addNotification: (
    title: string,
    message: string,
    type: InAppNotification['type'],
    targetRole?: UserRole | 'all',
    category?: 'clinical' | 'system'
  ) => void;

  // AI Assistant Global Modal
  isAIAssistantOpen: boolean;
  setIsAIAssistantOpen: (open: boolean) => void;
  openAIAssistant: () => void;
}

const HealthContext = createContext<HealthContextType | null>(null);

let globalIdSequence = 0;
const generateUniqueId = (prefix: string) => {
  globalIdSequence += 1;
  return `${prefix}-${Date.now()}-${globalIdSequence}-${Math.random().toString(36).substring(2, 7)}`;
};

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('pulse_role') as UserRole) || 'patient';
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('pulse_patient_logged_in') === 'true';
  });

  const [patientPhone, setPatientPhone] = useState<string>(() => {
    return localStorage.getItem('pulse_patient_phone') || '+91 98765 43210';
  });

  const [patientName, setPatientName] = useState<string>(() => {
    return localStorage.getItem('pulse_patient_name') || 'Sarath Paturu';
  });

  const [patientEmail, setPatientEmail] = useState<string>(() => {
    return localStorage.getItem('pulse_patient_email') || 'paturusarath@gmail.com';
  });

  const [patientAge, setPatientAge] = useState<number>(() => {
    const saved = localStorage.getItem('pulse_patient_age');
    return saved ? parseInt(saved, 10) : 34;
  });

  const [patientGender, setPatientGender] = useState<string>(() => {
    return localStorage.getItem('pulse_patient_gender') || 'Female';
  });

  const [patientBloodGroup, setPatientBloodGroup] = useState<string>(() => {
    return localStorage.getItem('pulse_patient_blood_group') || 'O+';
  });

  const [roleProfiles, setRoleProfiles] = useState<Record<UserRole, User>>(() => {
    const defaultProfiles: Record<UserRole, User> = {
      patient: { ...INITIAL_USERS.patient },
      doctor: { ...INITIAL_USERS.doctor },
      shopkeeper: { ...INITIAL_USERS.shopkeeper },
      admin: { ...INITIAL_USERS.admin },
    };
    try {
      (['patient', 'doctor', 'shopkeeper', 'admin'] as UserRole[]).forEach((r) => {
        const saved = localStorage.getItem(`pulse_user_profile_${r}`);
        if (saved) {
          defaultProfiles[r] = { ...defaultProfiles[r], ...JSON.parse(saved) };
        }
      });
    } catch (e) {
      // fallback
    }
    return defaultProfiles;
  });

  const [selectedLanguage, setSelectedLanguageState] = useState<string>(() => {
    return localStorage.getItem('pulse_selected_language') || 'English';
  });

  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);

  // Validate Firestore connection at boot as mandated by SKILL.md
  useEffect(() => {
    testConnection().then((ok) => {
      setIsFirebaseConnected(ok);
      if (ok && !auth.currentUser) {
        signInAnonymously(auth).catch((err) =>
          console.warn('Firebase session note:', err)
        );
      }
    });
  }, []);

  // Listen to Firebase Authentication
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setIsFirebaseConnected(true);
        if (fbUser.displayName) {
          setPatientName(fbUser.displayName);
          localStorage.setItem('pulse_patient_name', fbUser.displayName);
        }
        if (fbUser.email) {
          setPatientEmail(fbUser.email);
          localStorage.setItem('pulse_patient_email', fbUser.email);
        }
      }
    });
    return () => unsub();
  }, []);

  // Real-time Firestore sync for Medicines catalog
  useEffect(() => {
    try {
      const unsub = onSnapshot(
        collection(db, 'medicines'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Medicine[] = [];
            snapshot.forEach((d) => {
              const data = d.data() as Medicine;
              if (data && data.id && data.name) {
                list.push(data);
              }
            });
            if (list.length > 0) {
              setMedicines(list);
            }
          }
        },
        (err) => {
          console.warn('Firestore medicines snapshot notice:', err);
        }
      );
      return () => unsub();
    } catch (e) {
      console.warn('Firestore real-time subscription notice:', e);
    }
  }, []);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const openEditProfile = () => setIsEditProfileOpen(true);
  const closeEditProfile = () => setIsEditProfileOpen(false);

  // Dynamic Real-time DOM Translator across all portals, tabs, and dynamic modals
  useEffect(() => {
    applyDOMTranslation(document, selectedLanguage);

    let timeoutId: any;
    const observer = new MutationObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        applyDOMTranslation(document, selectedLanguage);
      }, 25);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [selectedLanguage, role]);

  const t = (text: string) => translateText(text, selectedLanguage);

  const currentUser: User = {
    ...roleProfiles[role],
    ...(role === 'patient'
      ? {
          name: patientName || roleProfiles.patient.name,
          phone: patientPhone || roleProfiles.patient.phone,
          email: patientEmail || roleProfiles.patient.email,
          age: patientAge,
          gender: patientGender,
          bloodGroup: patientBloodGroup,
        }
      : {}),
    selectedLanguage: selectedLanguage,
  };

  const [doctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('pulse_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [activeConsultation, setActiveConsultation] = useState<Appointment | null>(null);

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    const saved = localStorage.getItem('pulse_prescriptions');
    return saved ? JSON.parse(saved) : INITIAL_PRESCRIPTIONS;
  });
  const [activePrescriptionModal, setActivePrescriptionModal] = useState<Prescription | null>(null);

  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    const saved = localStorage.getItem('pulse_medicines');
    const list: Medicine[] = saved ? JSON.parse(saved) : INITIAL_MEDICINES;
    // Ensure all medicines have full date, month, and year in mfgDate and expiryDate
    return list.map((m) => {
      let updated = { ...m };
      if (!updated.mfgDate) {
        updated.mfgDate = '15/09/2024';
      } else {
        const parts = updated.mfgDate.trim().split(/[/.-]/);
        if (parts.length === 2) {
          let hash = 0;
          for (let i = 0; i < (m.id || '').length; i++) {
            hash = (hash * 31 + (m.id || '').charCodeAt(i)) % 25 + 1;
          }
          const day = String(hash).padStart(2, '0');
          const month = parts[0].padStart(2, '0');
          const year = parts[1];
          updated.mfgDate = `${day}/${month}/${year}`;
        }
      }

      if (!updated.expiryDate) {
        updated.expiryDate = '28/08/2027';
      } else {
        const expParts = updated.expiryDate.trim().split(/[/.-]/);
        if (expParts.length === 2) {
          const monthNum = parseInt(expParts[0], 10);
          const yearNum = parseInt(expParts[1], 10);
          let day = '28';
          if (!isNaN(monthNum) && !isNaN(yearNum) && monthNum >= 1 && monthNum <= 12) {
            const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
            day = String(daysInMonth).padStart(2, '0');
          }
          const monthStr = expParts[0].padStart(2, '0');
          const yearStr = expParts[1];
          updated.expiryDate = `${day}/${monthStr}/${yearStr}`;
        }
      }
      return updated;
    });
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('pulse_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState<PharmacyOrder[]>(() => {
    const saved = localStorage.getItem('pulse_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [medicineReturns, setMedicineReturns] = useState<MedicineReturnRequest[]>(() => {
    const saved = localStorage.getItem('pulse_medicine_returns');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      {
        id: 'RET-8941',
        orderId: 'ord-1002',
        patientId: 'pat-001',
        patientName: 'Sarath Paturu',
        patientPhone: '+91 98450 21980',
        medicineName: 'Telma-40 (Telmisartan 40mg)',
        quantity: 1,
        itemPrice: 245,
        totalRefundAmount: 245,
        reason: 'damaged_seal_foil',
        reasonDescription: 'Outer blister foil was torn upon receipt, exposing 3 tablets to moisture and air.',
        batchNumber: 'TLM-2025-B4',
        expiryDateFound: '11/2026',
        resolutionRequested: 'replacement',
        status: 'pending',
        requestedAt: '2026-09-29 09:30',
      },
      {
        id: 'RET-8812',
        orderId: 'ord-1001',
        patientId: 'pat-001',
        patientName: 'Sarath Paturu',
        patientPhone: '+91 98450 21980',
        medicineName: 'Glycomet-GP 2 Tablet',
        quantity: 2,
        itemPrice: 190,
        totalRefundAmount: 380,
        reason: 'expired',
        reasonDescription: 'Dispensed strip had expiry date of 08/2026 which is already passed.',
        batchNumber: 'GLY-88401',
        expiryDateFound: '08/2026',
        resolutionRequested: 'refund',
        status: 'accepted',
        requestedAt: '2026-09-28 14:15',
        acceptedAt: '2026-09-28 15:40',
        pharmacyNotes: 'Return accepted. UPI refund of ₹380 processed to patient account.',
      },
    ];
  });

  const [pillReminders, setPillReminders] = useState<PillReminder[]>(() => {
    const saved = localStorage.getItem('pulse_pill_reminders');
    return saved ? JSON.parse(saved) : INITIAL_PILL_REMINDERS;
  });

  const [wellnessPlans, setWellnessPlans] = useState<WellnessPlan[]>(() => {
    const saved = localStorage.getItem('pulse_wellness_plans');
    if (saved) {
      try {
        const parsed: WellnessPlan[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Deduplicate so there is only at most one diet plan and one exercise plan
          const seenTypes = new Set<string>();
          const deduplicated: WellnessPlan[] = [];
          for (const plan of parsed) {
            if (plan && plan.type && !seenTypes.has(plan.type)) {
              seenTypes.add(plan.type);
              deduplicated.push(plan);
            }
          }
          if (deduplicated.length > 0) {
            return deduplicated;
          }
        }
      } catch (e) {
        // use default
      }
    }
    return INITIAL_WELLNESS_PLANS;
  });

  const [wellnessStats, setWellnessStats] = useState<DailyWellnessStats>(() => {
    const saved = localStorage.getItem('pulse_wellness_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use default
      }
    }
    return {
      hydration: {
        currentCups: 7,
        goalCups: 10,
        cupVolumeMl: 250,
      },
      activity: {
        currentSteps: 7420,
        goalSteps: 10000,
        activeMinutes: 38,
        goalMinutes: 45,
        caloriesBurned: 385,
      },
      sleep: {
        hoursSlept: 7.5,
        goalHours: 8.0,
        qualityScore: 88,
        bedTime: '10:30 PM',
        wakeTime: '06:00 AM',
      },
    };
  });

  const [vitals, setVitals] = useState<HealthVitals>(() => {
    const saved = localStorage.getItem('pulse_vitals');
    return saved ? JSON.parse(saved) : INITIAL_VITALS;
  });

  const [allergies, setAllergies] = useState<Allergy[]>(() => {
    const saved = localStorage.getItem('pulse_allergies');
    return saved ? JSON.parse(saved) : INITIAL_ALLERGIES;
  });

  const [diagnoses, setDiagnoses] = useState<DiagnosisRecord[]>(() => {
    const saved = localStorage.getItem('pulse_diagnoses');
    return saved ? JSON.parse(saved) : INITIAL_DIAGNOSES;
  });

  const [labReports, setLabReports] = useState<LabReport[]>(() => {
    const saved = localStorage.getItem('pulse_lab_reports');
    return saved ? JSON.parse(saved) : INITIAL_LAB_REPORTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('pulse_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  const [activeReceipt, setActiveReceipt] = useState<Transaction | null>(null);

  const [articles, setArticles] = useState<HealthArticle[]>(INITIAL_ARTICLES);
  const [videos, setVideos] = useState<EducationalVideo[]>(() => {
    const saved = localStorage.getItem('pulse_videos');
    return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('pulse_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('pulse_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<InAppNotification[]>(() => {
    const saved = localStorage.getItem('pulse_notifications');
    let raw: InAppNotification[] = saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    // Ensure all roles have initial notifications available
    const hasDoc = raw.some((n) => n.targetRole === 'doctor');
    const hasShop = raw.some((n) => n.targetRole === 'shopkeeper');
    if (!hasDoc || !hasShop) {
      raw = [
        ...raw,
        ...INITIAL_NOTIFICATIONS_BY_ROLE.doctor,
        ...INITIAL_NOTIFICATIONS_BY_ROLE.shopkeeper,
      ];
    }
    const seenIds = new Set<string>();
    const sanitized: InAppNotification[] = [];
    for (const n of raw) {
      if (!n) continue;
      const text = `${n.title || ''} ${n.message || ''}`.toLowerCase();
      if (
        text.includes('signed in') ||
        text.includes('welcome to pulsehealth') ||
        text.includes('logged in') ||
        text.includes('account created')
      ) {
        continue;
      }
      let uniqueId = n.id;
      if (!uniqueId || seenIds.has(uniqueId)) {
        uniqueId = generateUniqueId('notif');
      }
      seenIds.add(uniqueId);
      const inferredCat: 'clinical' | 'system' =
        n.category ||
        (n.type === 'appointment' ||
        n.type === 'reminder' ||
        n.type === 'prescription' ||
        text.includes('spike') ||
        text.includes('vitals') ||
        text.includes('dose') ||
        text.includes('pill') ||
        text.includes('prescription') ||
        text.includes('lab') ||
        text.includes('hba1c') ||
        text.includes('consult') ||
        text.includes('telehealth')
          ? 'clinical'
          : 'system');

      sanitized.push({
        ...n,
        id: uniqueId,
        targetRole: n.targetRole || 'patient',
        category: inferredCat,
      });
    }
    return sanitized;
  });

  // Global AI Assistant Modal Open State (Available for Patient, Doctor, Shopkeeper)
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const openAIAssistant = () => setIsAIAssistantOpen(true);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('pulse_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('pulse_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('pulse_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem('pulse_medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('pulse_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('pulse_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('pulse_medicine_returns', JSON.stringify(medicineReturns));
  }, [medicineReturns]);

  useEffect(() => {
    localStorage.setItem('pulse_pill_reminders', JSON.stringify(pillReminders));
  }, [pillReminders]);

  useEffect(() => {
    localStorage.setItem('pulse_wellness_plans', JSON.stringify(wellnessPlans));
  }, [wellnessPlans]);

  useEffect(() => {
    localStorage.setItem('pulse_wellness_stats', JSON.stringify(wellnessStats));
  }, [wellnessStats]);

  useEffect(() => {
    localStorage.setItem('pulse_vitals', JSON.stringify(vitals));
  }, [vitals]);

  useEffect(() => {
    localStorage.setItem('pulse_allergies', JSON.stringify(allergies));
  }, [allergies]);

  useEffect(() => {
    localStorage.setItem('pulse_diagnoses', JSON.stringify(diagnoses));
  }, [diagnoses]);

  useEffect(() => {
    localStorage.setItem('pulse_lab_reports', JSON.stringify(labReports));
  }, [labReports]);

  useEffect(() => {
    localStorage.setItem('pulse_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('pulse_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('pulse_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('pulse_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('pulse_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Logging & Notification Helpers
  const logAuditEvent = (
    category: AuditLog['category'],
    details: string,
    severity: AuditLog['severity'] = 'info'
  ) => {
    const newLog: AuditLog = {
      id: generateUniqueId('log'),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: role,
      category,
      ipAddress: role === 'doctor' ? '192.168.1.44 (Hospital LAN)' : '98.210.45.12 (San Francisco, CA)',
      details,
      severity,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addNotification = (
    title: string,
    message: string,
    type: InAppNotification['type'],
    targetRole?: UserRole | 'all',
    category?: 'clinical' | 'system'
  ) => {
    const text = `${title} ${message}`.toLowerCase();
    const inferredCat: 'clinical' | 'system' =
      category ||
      (type === 'appointment' ||
      type === 'reminder' ||
      type === 'prescription' ||
      text.includes('spike') ||
      text.includes('vitals') ||
      text.includes('dose') ||
      text.includes('pill') ||
      text.includes('prescription') ||
      text.includes('lab') ||
      text.includes('hba1c') ||
      text.includes('consult') ||
      text.includes('telehealth')
        ? 'clinical'
        : 'system');

    const newNotif: InAppNotification = {
      id: generateUniqueId('notif'),
      title,
      message,
      type,
      category: inferredCat,
      timestamp: 'Just now',
      read: false,
      targetRole: targetRole || role,
    };
    setNotifications((prev) => [newNotif, ...prev.filter((n) => n.id !== newNotif.id)]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = (targetRole?: UserRole | 'all') => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (!targetRole || targetRole === 'all' || n.targetRole === targetRole || n.targetRole === 'all') {
          return { ...n, read: true };
        }
        return n;
      })
    );
  };

  const clearAllNotifications = (clearRoleOnly: boolean = false) => {
    if (clearRoleOnly) {
      setNotifications((prev) =>
        prev.filter((n) => n.targetRole && n.targetRole !== role && n.targetRole !== 'all')
      );
    } else {
      setNotifications([]);
    }
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    logAuditEvent('AUTH', `Switched active session view to ${newRole.toUpperCase()} role (${INITIAL_USERS[newRole].name}).`);
  };

  // Appointment Actions
  const bookAppointment = async (
    doctor: Doctor,
    date: string,
    timeSlot: string,
    type: 'video' | 'in-clinic' | 'audio',
    reason: string
  ): Promise<Appointment> => {
    const newApt: Appointment = {
      id: generateUniqueId('apt'),
      patientId: currentUser.id || INITIAL_USERS.patient.id,
      patientName: currentUser.name || INITIAL_USERS.patient.name,
      patientAge: currentUser.age || INITIAL_USERS.patient.age,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialization: doctor.specialization,
      date,
      timeSlot,
      type,
      status: 'confirmed',
      fee: doctor.fee,
      paymentStatus: 'paid',
      reason,
    };

    setAppointments((prev) => [newApt, ...prev]);

    // Save appointment directly to Firestore
    try {
      await setDoc(doc(db, 'appointments', newApt.id), newApt);
    } catch (err) {
      console.warn('Firestore appointment write notice:', err);
    }

    // Create payment transaction
    const txId = `TXN-${Math.floor(10000 + Math.random() * 90000)}-CONSULT`;
    const newTx: Transaction = {
      id: txId,
      type: 'Consultation Fee',
      title: `${type === 'video' ? 'Virtual Video' : 'In-Clinic'} Visit with ${doctor.name}`,
      amount: doctor.fee,
      status: 'Completed',
      paymentMethod: 'Instant UPI / Pay',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      referenceId: `REF-${newApt.id}`,
      receiptNumber: `RCP-${Date.now().toString().slice(-6)}`,
      patientName: currentUser.name || INITIAL_USERS.patient.name,
    };
    setTransactions((prev) => [newTx, ...prev]);

    logAuditEvent(
      'PAYMENT',
      `Processed consultation booking payment of ₹${doctor.fee} for ${doctor.name} (${txId}).`
    );
    addNotification(
      'Appointment Confirmed',
      `Your consultation with ${doctor.name} on ${date} at ${timeSlot} is confirmed.`,
      'appointment'
    );

    return newApt;
  };

  const cancelAppointment = async (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'cancelled' } : apt))
    );
    if (activeConsultation?.id === id) {
      setActiveConsultation(null);
    }
    try {
      await updateDoc(doc(db, 'appointments', id), { status: 'cancelled' });
    } catch (err) {
      console.warn('Firestore cancel appointment notice:', err);
    }
    logAuditEvent('ADMIN_ACTION' as any, `Cancelled appointment #${id}.`);
    addNotification('Appointment Cancelled', `Appointment #${id} has been marked as cancelled.`, 'appointment');
  };

  const startConsultation = (appointment: Appointment) => {
    setActiveConsultation(appointment);
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointment.id ? { ...apt, status: 'in-progress' } : apt))
    );
    logAuditEvent('AUTH', `Joined Telehealth consultation room for appointment #${appointment.id}.`);
  };

  const endConsultation = (notes?: string) => {
    if (activeConsultation) {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === activeConsultation.id
            ? { ...apt, status: 'completed', clinicalNotes: notes || apt.clinicalNotes }
            : apt
        )
      );
      logAuditEvent(
        'EHR_ACCESS',
        `Completed Telehealth consultation #${activeConsultation.id} with ${activeConsultation.patientName}.`
      );
      addNotification(
        'Consultation Completed',
        `Telehealth session with ${activeConsultation.doctorName} has concluded.`,
        'appointment'
      );
    }
    setActiveConsultation(null);
  };

  // Prescription creation
  const createPrescription = (
    rx: Omit<Prescription, 'id' | 'qrCodeHash' | 'digitalSignature'>
  ): Prescription => {
    const rxId = `rx-${Math.floor(100 + Math.random() * 900)}`;
    const newRx: Prescription = {
      ...rx,
      id: rxId,
      digitalSignature: `Cryptographically Signed by ${rx.doctorName} (NPI: ${Math.floor(1000000000 + Math.random() * 9000000000)})`,
      qrCodeHash: `PULSE-RX-${rxId.toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    };

    setPrescriptions((prev) => [newRx, ...prev]);

    // Link prescription to appointment if available
    if (rx.appointmentId) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === rx.appointmentId ? { ...a, prescriptionId: rxId } : a))
      );
    }

    logAuditEvent(
      'PRESCRIPTION_ISSUED',
      `Issued digital e-Prescription #${rxId} for ${rx.patientName} (${rx.medicines.length} medications).`
    );
    // Save to Firestore
    try {
      setDoc(doc(db, 'prescriptions', rxId), newRx).catch((err) =>
        console.warn('Firestore prescription save notice:', err)
      );
    } catch (e) {
      console.warn('Firestore prescription write notice:', e);
    }

    addNotification(
      'New e-Prescription Issued',
      `${rx.doctorName} issued an official prescription (#${rxId}) for your recent visit.`,
      'prescription'
    );

    return newRx;
  };

  // Cart & Pharmacy
  const addToCart = (medicine: Medicine, qty: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.medicine.id === medicine.id);
      if (existing) {
        return prev.map((item) =>
          item.medicine.id === medicine.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { medicine, quantity: qty }];
    });
    addNotification('Added to Cart', `${medicine.name} added to pharmacy cart.`, 'order');
  };

  const removeFromCart = (medicineId: string) => {
    setCart((prev) => prev.filter((item) => item.medicine.id !== medicineId));
  };

  const updateCartQty = (medicineId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.medicine.id === medicineId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);

  const addMedicine = async (medicine: Medicine) => {
    setMedicines((prev) => [medicine, ...prev]);
    try {
      await setDoc(doc(db, 'medicines', medicine.id), medicine);
    } catch (e) {
      console.warn('Firestore medicine save note:', e);
    }
    logAuditEvent('ORDER_PLACED', `New medicine SKU ${medicine.name} added to pharmacy inventory`);
  };

  const updateMedicine = async (id: string, updates: Partial<Medicine>) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
    try {
      await updateDoc(doc(db, 'medicines', id), updates);
    } catch (e) {
      console.warn('Firestore medicine update note:', e);
    }
  };

  const deleteMedicine = async (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
    try {
      await deleteDoc(doc(db, 'medicines', id));
    } catch (e) {
      console.warn('Firestore medicine delete note:', e);
    }
    logAuditEvent('ORDER_PLACED', `Medicine SKU ${id} removed from inventory`);
  };

  const addPrescriptionToCart = (prescription: Prescription) => {
    prescription.medicines.forEach((med) => {
      // Find matching medicine in catalog or create item
      const match = medicines.find(
        (m) =>
          m.name.toLowerCase().includes(med.name.toLowerCase()) ||
          med.name.toLowerCase().includes(m.name.toLowerCase())
      );

      if (match) {
        addToCart(match, 1);
      } else {
        const customMed: Medicine = {
          id: `rx-med-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: med.name,
          genericName: med.name,
          strength: med.dosage,
          dosageForm: 'Tablet',
          category: 'Cardiovascular',
          price: 180,
          discountPrice: 150,
          requiresPrescription: true,
          stock: 50,
          rating: 4.8,
          reviewsCount: 12,
          manufacturer: prescription.clinicName || 'PulseMed Health Labs',
          description: `Prescribed by ${prescription.doctorName}: ${med.instructions} (${med.frequency} for ${med.duration})`,
          uses: [prescription.diagnosis || 'Clinical Therapy'],
          sideEffects: ['Follow prescribing physician instructions precisely.'],
          image:
            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=80',
        };
        addToCart(customMed, 1);
      }
    });
    addNotification(
      'Prescription Transferred to Cart',
      `Medications from e-Rx #${prescription.id} have been added to your shopping bag.`,
      'order'
    );
  };

  const cartTotal = cart.reduce((sum, item) => {
    const price = item.medicine.discountPrice || item.medicine.price;
    return sum + price * item.quantity;
  }, 0);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const checkoutOrder = async (
    shippingAddress: PharmacyOrder['shippingAddress'],
    paymentMethod: string,
    rxFile?: string
  ): Promise<PharmacyOrder> => {
    const orderId = `ord-${Math.floor(1000 + Math.random() * 9000)}`;
    const txId = `TXN-${Math.floor(10000 + Math.random() * 90000)}-PHARM`;

    const newOrder: PharmacyOrder = {
      id: orderId,
      patientId: currentUser.id || INITIAL_USERS.patient.id,
      patientName: shippingAddress.fullName || currentUser.name || INITIAL_USERS.patient.name,
      items: cart.map((item) => ({
        medicineId: item.medicine.id,
        name: item.medicine.name,
        price: item.medicine.discountPrice || item.medicine.price,
        quantity: item.quantity,
        image: item.medicine.image,
        requiresPrescription: item.medicine.requiresPrescription,
      })),
      totalAmount: parseFloat(cartTotal.toFixed(2)),
      prescriptionFile: rxFile || 'Verified_ePrescription.pdf',
      shippingAddress,
      status: 'processing',
      paymentMethod,
      transactionId: txId,
      orderedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      trackingSteps: [
        { title: 'Order Placed & Payment Verified', date: 'Just now', completed: true },
        { title: 'Prescription Validated by Pharmacist', date: 'In review', completed: true },
        { title: 'Dispensing & Packaging', date: 'Pending', completed: false },
        { title: 'Express Delivery Dispatched', date: 'Pending', completed: false },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Save to Firestore
    try {
      await setDoc(doc(db, 'orders', newOrder.id), newOrder);
    } catch (e) {
      console.warn('Firestore order save note:', e);
    }

    // Record transaction
    const newTx: Transaction = {
      id: txId,
      type: 'Pharmacy Order',
      title: `E-Pharmacy Order #${orderId}`,
      amount: newOrder.totalAmount,
      status: 'Completed',
      paymentMethod: paymentMethod as any,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      referenceId: `REF-${orderId}`,
      receiptNumber: `RCP-${Date.now().toString().slice(-6)}`,
      patientName: shippingAddress.fullName || INITIAL_USERS.patient.name,
    };
    setTransactions((prev) => [newTx, ...prev]);
    clearCart();

    logAuditEvent(
      'ORDER_PLACED',
      `Placed pharmacy order #${orderId} for ₹${newOrder.totalAmount} (${newOrder.items.length} items). Tx: ${txId}.`
    );
    addNotification(
      'Order Placed Successfully',
      `Pharmacy order #${orderId} is being prepared for express delivery.`,
      'order'
    );

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: PharmacyOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updatedSteps = o.trackingSteps.map((s, idx) => {
            if (status === 'shipped' && idx <= 2) return { ...s, completed: true };
            if (status === 'delivered') return { ...s, completed: true };
            return s;
          });
          return { ...o, status, trackingSteps: updatedSteps };
        }
        return o;
      })
    );
    logAuditEvent('ADMIN_ACTION' as any, `Updated order #${orderId} status to ${status.toUpperCase()}.`);
    addNotification('Order Status Update', `Order #${orderId} is now marked as ${status}.`, 'order');
  };

  // Medicine Returns Handlers
  const requestMedicineReturn = (
    params: Omit<MedicineReturnRequest, 'id' | 'requestedAt' | 'status'>
  ): MedicineReturnRequest => {
    const newReturn: MedicineReturnRequest = {
      ...params,
      id: `RET-${Math.floor(1000 + Math.random() * 9000)}`,
      requestedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending',
    };

    setMedicineReturns((prev) => [newReturn, ...prev]);

    logAuditEvent(
      'ORDER_PLACED',
      `Patient ${params.patientName} requested return for ${params.medicineName} (Reason: ${params.reason}).`
    );

    // Notify Chemist / Shopkeeper
    addNotification(
      'New Medicine Return Request',
      `${params.patientName} requested return for ${params.medicineName} (${params.reason.replace(/_/g, ' ')}). Total: ₹${params.totalRefundAmount}.`,
      'order',
      'shopkeeper'
    );

    // Notify Patient
    addNotification(
      'Return Request Submitted',
      `Your return request for ${params.medicineName} has been submitted for chemist review.`,
      'order',
      'patient'
    );

    return newReturn;
  };

  const acceptMedicineReturn = (returnId: string, pharmacyNotes?: string) => {
    let acceptedItem: MedicineReturnRequest | undefined;
    setMedicineReturns((prev) =>
      prev.map((ret) => {
        if (ret.id === returnId) {
          acceptedItem = {
            ...ret,
            status: 'accepted',
            acceptedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            pharmacyNotes: pharmacyNotes || 'Return accepted. Replacement dispatched / refund tokenized to source account.',
          };
          return acceptedItem;
        }
        return ret;
      })
    );

    if (acceptedItem) {
      logAuditEvent(
        'ADMIN_ACTION' as any,
        `Pharmacy accepted medicine return #${returnId} (${acceptedItem.medicineName}). ₹${acceptedItem.totalRefundAmount} settled.`
      );

      // Notify Patient
      addNotification(
        'Medicine Return Accepted ✓',
        `Pharmacy accepted your return for ${acceptedItem.medicineName}. ${acceptedItem.resolutionRequested === 'refund' ? `Refund of ₹${acceptedItem.totalRefundAmount} initiated.` : 'Fresh replacement medicine dispatched.'}`,
        'order',
        'patient'
      );

      // Notify Chemist
      addNotification(
        'Return Processed',
        `Return #${returnId} for ${acceptedItem.patientName} is marked accepted & quarantined from active stock.`,
        'order',
        'shopkeeper'
      );
    }
  };

  const rejectMedicineReturn = (returnId: string, reason?: string) => {
    setMedicineReturns((prev) =>
      prev.map((ret) => (ret.id === returnId ? { ...ret, status: 'rejected', pharmacyNotes: reason } : ret))
    );
    addNotification(
      'Return Request Update',
      `Return #${returnId} was reviewed: ${reason || 'Item condition does not meet return policy criteria.'}`,
      'order',
      'patient'
    );
  };

  const processReturnRequest = (
    returnId: string,
    decision: 'approve' | 'reject',
    notes?: string,
    quarantineBin?: string
  ) => {
    if (decision === 'approve') {
      let acceptedItem: MedicineReturnRequest | undefined;
      setMedicineReturns((prev) =>
        prev.map((ret) => {
          if (ret.id === returnId) {
            acceptedItem = {
              ...ret,
              status: 'approved',
              acceptedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
              processedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
              pharmacyNotes: notes || 'Return approved. Refund / replacement processed.',
              quarantineBinId: quarantineBin || 'Bin Q-04 (Damaged Shelf)',
            };
            return acceptedItem;
          }
          return ret;
        })
      );

      if (acceptedItem) {
        logAuditEvent(
          'ADMIN_ACTION' as any,
          `Shopkeeper processed return #${returnId} (${acceptedItem.medicineName}) -> APPROVED. Settled ₹${acceptedItem.totalRefundAmount}.`
        );
        addNotification(
          'Medicine Return Approved ✓',
          `Shopkeeper approved your return for ${acceptedItem.medicineName}. ${acceptedItem.resolutionRequested === 'refund' ? `Refund of ₹${acceptedItem.totalRefundAmount} credited.` : 'Replacement medicine dispatched.'}`,
          'order',
          'patient'
        );
        addNotification(
          'Return Processed',
          `Return #${returnId} marked Approved & transferred to ${quarantineBin || 'Quarantine'}.`,
          'order',
          'shopkeeper'
        );
      }
    } else {
      setMedicineReturns((prev) =>
        prev.map((ret) =>
          ret.id === returnId
            ? {
                ...ret,
                status: 'rejected',
                processedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
                pharmacyNotes: notes || 'Item inspection does not meet return policy criteria.',
              }
            : ret
        )
      );
      logAuditEvent(
        'ADMIN_ACTION' as any,
        `Shopkeeper processed return #${returnId} -> REJECTED. Reason: ${notes || 'Declined'}.`
      );
      addNotification(
        'Return Request Update',
        `Return #${returnId} was reviewed and rejected: ${notes || 'Item condition does not meet return policy criteria.'}`,
        'order',
        'patient'
      );
    }
  };

  // Pill Reminders
  const addPillReminder = (reminder: Omit<PillReminder, 'id' | 'todayTakenTimes' | 'active'>) => {
    const newReminder: PillReminder = {
      ...reminder,
      id: generateUniqueId('rem'),
      active: true,
      todayTakenTimes: [],
    };
    setPillReminders((prev) => [newReminder, ...prev]);

    // Save to Firestore
    try {
      setDoc(doc(db, 'pill_reminders', newReminder.id), newReminder).catch((err) =>
        console.warn('Firestore reminder write notice:', err)
      );
    } catch (e) {
      console.warn('Firestore reminder write error:', e);
    }

    logAuditEvent('EHR_ACCESS', `Configured new pill reminder schedule for ${reminder.medicineName}.`);
    addNotification('Reminder Scheduled', `Scheduled intake alerts for ${reminder.medicineName}.`, 'reminder');
  };

  const togglePillReminder = (id: string) => {
    setPillReminders((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, active: !r.active };
          try {
            updateDoc(doc(db, 'pill_reminders', id), { active: updated.active }).catch((err) =>
              console.warn('Firestore toggle reminder notice:', err)
            );
          } catch (e) {}
          return updated;
        }
        return r;
      })
    );
  };

  const markPillTaken = (id: string, time: string) => {
    setPillReminders((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const already = r.todayTakenTimes.includes(time);
          const nextTimes = already
            ? r.todayTakenTimes.filter((t) => t !== time)
            : [...r.todayTakenTimes, time];
          try {
            updateDoc(doc(db, 'pill_reminders', id), { todayTakenTimes: nextTimes }).catch((err) =>
              console.warn('Firestore mark pill taken notice:', err)
            );
          } catch (e) {}
          return { ...r, todayTakenTimes: nextTimes };
        }
        return r;
      })
    );
    logAuditEvent('EHR_ACCESS', `Marked medicine dose as taken at ${time}.`);
  };

  const deletePillReminder = (id: string) => {
    setPillReminders((prev) => prev.filter((r) => r.id !== id));
    try {
      deleteDoc(doc(db, 'pill_reminders', id)).catch((err) =>
        console.warn('Firestore reminder delete notice:', err)
      );
    } catch (e) {}
  };

  // AI Wellness Plan Generation
  const generateAIWellnessPlan = async (
    type: 'diet' | 'exercise',
    goals: string,
    preferences: string
  ): Promise<WellnessPlan> => {
    logAuditEvent('EHR_ACCESS', `Initiated AI ${type.toUpperCase()} generation request.`);
    try {
      const res = await fetch('/api/wellness-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planType: type,
          userProfile: {
            age: INITIAL_USERS.patient.age,
            gender: INITIAL_USERS.patient.gender,
            bmi: vitals.bmi,
            height: vitals.heightCm,
            weight: vitals.weightKg,
            bloodPressure: vitals.bloodPressure,
            allergies: allergies.map((a) => a.allergen),
          },
          healthGoals: goals,
          dietaryPreferences: preferences,
        }),
      });

      const data = await res.json();
      let generatedData = data.plan;

      if (!generatedData) {
        // Clinical fallback
        if (type === 'diet') {
          generatedData = {
            title: `Cardio-Metabolic Personalized Nutrition Plan`,
            summary: `Evidence-based nutrition tailored to your BMI of ${vitals.bmi} and blood pressure of ${vitals.bloodPressure}.`,
            targetCalories: 2150,
            macros: { protein: '30%', carbs: '45%', fats: '25%' },
            hydrationTarget: '3.0 Liters/day',
            dailySchedule: [
              { meal: 'Breakfast', time: '08:00 AM', calories: 450, items: ['Poached farm eggs with avocado & seeded sourdough', 'Antioxidant berries', 'Matcha green tea'], tips: 'High leucine protein to stimulate muscle protein synthesis.' },
              { meal: 'Lunch', time: '01:00 PM', calories: 680, items: ['Herb-crusted roasted chicken breast', 'Wild grain medley & grilled rainbow bell peppers', 'Tahini citrus dressing'], tips: 'Slow-digesting complex carbs to avoid post-prandial somnolence.' },
              { meal: 'Afternoon Energy', time: '04:30 PM', calories: 220, items: ['Walnut halves (30g)', 'Celery sticks with roasted hummus'], tips: 'Heart-healthy plant sterols and crunch.' },
              { meal: 'Dinner', time: '07:30 PM', calories: 580, items: ['Pan-seared cod with ginger & bok choy', 'Miso broth with shiitake mushrooms'], tips: 'Rich in iodine and bioavailable omega fatty acids.' },
            ],
            foodsToAvoid: ['Refined sodium (>2,000mg/day)', 'High-fructose corn syrups', 'Hydrogenated bakery shortenings'],
            doctorNotes: 'Adhere for 30 consecutive days to observe baseline insulin sensitivity improvements.',
          };
        } else {
          generatedData = {
            title: `Metabolic Conditioning & Functional Strength Plan`,
            summary: `Cardioprotective exercise routine designed to support resting heart rate and lean mass preservation.`,
            intensity: 'Moderate-High',
            weeklyFrequency: '4 Sessions / Week',
            weeklySchedule: [
              { day: 'Monday - Zone 2 Steady Aerobic', duration: '45 mins', intensity: 'Moderate', exercises: ['Incline treadmill walking (30 min)', 'Abdominal hollow body holds (3x30s)', 'Farmer carries with dumbbells (4x40m)'] },
              { day: 'Wednesday - Functional Upper Pull/Push', duration: '40 mins', intensity: 'Moderate', exercises: ['Lat pulldowns (3x12)', 'Dumbbell floor presses (3x12)', 'Cable face pulls (4x15)'] },
              { day: 'Friday - Lower Posterior & Core', duration: '45 mins', intensity: 'Moderate-High', exercises: ['Dumbbell Romanian deadlifts (3x10)', 'Bulgarian split squats (3x8/leg)', 'Glute bridges (3x15)'] },
              { day: 'Saturday - Outdoor Trail Walk & Recovery', duration: '50 mins', intensity: 'Low', exercises: ['Brisk nature walk', 'Full-body thoracic & hamstring mobility stretches'] },
            ],
            warmupCoolDown: 'Dynamic leg swings, arm circles (5 min); static calf & quad stretches (5 min).',
            safetyPrecautions: 'Ensure heart rate remains under 145 BPM during steady state intervals.',
            doctorNotes: 'Consistent resistance training counteracts metabolic deceleration.',
          };
        }
      }

      const newPlan: WellnessPlan = {
        id: generateUniqueId('wp'),
        patientId: INITIAL_USERS.patient.id,
        type,
        title: generatedData.title || `Personalized ${type === 'diet' ? 'Diet' : 'Fitness'} Plan`,
        summary: generatedData.summary || `AI optimized plan based on your EHR profile.`,
        assignedBy: 'PulseHealth AI Specialist',
        createdAt: new Date().toISOString().substring(0, 10),
        planData: generatedData,
      };

      setWellnessPlans((prev) => [newPlan, ...prev.filter((p) => p.type !== type)]);
      logAuditEvent('EHR_ACCESS', `Generated new AI ${type} plan (${newPlan.id}).`);
      addNotification(
        'AI Wellness Plan Ready',
        `Your personalized ${type} plan is ready for review in your wellness dashboard.`,
        'system'
      );

      return newPlan;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const addCustomWellnessPlan = (plan: Omit<WellnessPlan, 'id' | 'createdAt'>) => {
    const newPlan: WellnessPlan = {
      ...plan,
      id: generateUniqueId('wp'),
      createdAt: new Date().toISOString().substring(0, 10),
    };
    setWellnessPlans((prev) => [newPlan, ...prev.filter((p) => p.type !== plan.type)]);
  };

  // Daily Wellness Progress Operations
  const updateHydration = (deltaCups: number) => {
    setWellnessStats((prev) => {
      const nextCups = Math.max(0, Math.min(24, prev.hydration.currentCups + deltaCups));
      return {
        ...prev,
        hydration: {
          ...prev.hydration,
          currentCups: nextCups,
        },
      };
    });
  };

  const setHydrationCups = (cups: number) => {
    setWellnessStats((prev) => ({
      ...prev,
      hydration: {
        ...prev.hydration,
        currentCups: Math.max(0, Math.min(24, cups)),
      },
    }));
  };

  const updateActivitySteps = (deltaSteps: number, deltaMinutes?: number) => {
    setWellnessStats((prev) => {
      const nextSteps = Math.max(0, prev.activity.currentSteps + deltaSteps);
      const addedMins = deltaMinutes !== undefined ? deltaMinutes : Math.round(deltaSteps / 100);
      const nextMinutes = Math.max(0, prev.activity.activeMinutes + addedMins);
      const addedCalories = Math.round(deltaSteps * 0.042);
      return {
        ...prev,
        activity: {
          ...prev.activity,
          currentSteps: nextSteps,
          activeMinutes: nextMinutes,
          caloriesBurned: Math.max(0, prev.activity.caloriesBurned + addedCalories),
        },
      };
    });
  };

  const updateSleepHours = (hours: number, qualityScore?: number) => {
    setWellnessStats((prev) => {
      const nextHours = Math.max(0, Math.min(16, parseFloat(hours.toFixed(1))));
      const calcQuality =
        qualityScore !== undefined
          ? qualityScore
          : Math.min(100, Math.round((Math.min(nextHours, prev.sleep.goalHours) / prev.sleep.goalHours) * 94));
      return {
        ...prev,
        sleep: {
          ...prev.sleep,
          hoursSlept: nextHours,
          qualityScore: calcQuality,
        },
      };
    });
  };

  const resetDailyWellnessStats = () => {
    setWellnessStats({
      hydration: {
        currentCups: 0,
        goalCups: 10,
        cupVolumeMl: 250,
      },
      activity: {
        currentSteps: 0,
        goalSteps: 10000,
        activeMinutes: 0,
        goalMinutes: 45,
        caloriesBurned: 0,
      },
      sleep: {
        hoursSlept: 0,
        goalHours: 8.0,
        qualityScore: 0,
        bedTime: '10:30 PM',
        wakeTime: '06:30 AM',
      },
    });
  };

  // EHR Updates
  const updateVitals = (newVitals: Partial<HealthVitals>) => {
    setVitals((prev) => {
      const updated = { ...prev, ...newVitals };
      // recalculate BMI if height and weight present
      if (newVitals.heightCm || newVitals.weightKg) {
        const hM = updated.heightCm / 100;
        updated.bmi = parseFloat((updated.weightKg / (hM * hM)).toFixed(1));
      }
      updated.recordedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
      return updated;
    });
    // Sync to Firestore
    try {
      const uid = auth.currentUser?.uid || currentUser.id;
      if (uid) {
        setDoc(doc(db, 'vitals', uid), { ...newVitals, patientId: uid, recordedAt: new Date().toISOString() }, { merge: true }).catch((err) =>
          console.warn('Firestore vitals update notice:', err)
        );
      }
    } catch (e) {
      console.warn('Firestore vitals sync error:', e);
    }

    logAuditEvent('EHR_ACCESS', `Updated patient vitals record.`);
    addNotification('Vitals Updated', 'Your biometric vitals have been successfully updated in your EHR.', 'system');
  };

  const addAllergy = (allergy: Allergy) => {
    setAllergies((prev) => [allergy, ...prev]);
    logAuditEvent('EHR_ACCESS', `Logged new clinical allergy: ${allergy.allergen} (${allergy.severity}).`, 'warning');
  };

  const addDiagnosis = (diag: Omit<DiagnosisRecord, 'id'>) => {
    const newDiag: DiagnosisRecord = {
      ...diag,
      id: generateUniqueId('diag'),
    };
    setDiagnoses((prev) => [newDiag, ...prev]);
    logAuditEvent('EHR_ACCESS', `Added diagnosis record: ${diag.condition}.`);
  };

  const uploadLabReport = (rep: Omit<LabReport, 'id'>) => {
    const newReport: LabReport = {
      ...rep,
      id: generateUniqueId('rep'),
    };
    setLabReports((prev) => [newReport, ...prev]);
    logAuditEvent('EHR_ACCESS', `Uploaded clinical diagnostic report: ${rep.testName}.`);
    addNotification('Lab Report Uploaded', `${rep.testName} has been attached to your EHR record.`, 'system');
  };

  // Direct payment helper
  const processDirectPayment = (
    type: Transaction['type'],
    title: string,
    amount: number,
    method: Transaction['paymentMethod'],
    refId: string
  ): Transaction => {
    const txId = `TXN-${Math.floor(10000 + Math.random() * 90000)}-DIRECT`;
    const newTx: Transaction = {
      id: txId,
      type,
      title,
      amount,
      status: 'Completed',
      paymentMethod: method,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      referenceId: refId,
      receiptNumber: `RCP-${Date.now().toString().slice(-6)}`,
      patientName: INITIAL_USERS.patient.name,
    };
    setTransactions((prev) => [newTx, ...prev]);
    logAuditEvent('PAYMENT', `Processed unified transaction ${txId} of ₹${amount} via ${method}.`);
    return newTx;
  };

  // Education
  const likeArticle = (id: string) => {
    setArticles((prev) =>
      prev.map((art) => (art.id === id ? { ...art, likes: art.likes + 1 } : art))
    );
  };

  const toggleWatchlist = (id: string) => {
    setVideos((prev) =>
      prev.map((vid) =>
        vid.id === id ? { ...vid, inWatchlist: !vid.inWatchlist } : vid
      )
    );
  };

  // Reviews
  const addReview = (review: Omit<Review, 'id' | 'date'>) => {
    const newRev: Review = {
      ...review,
      id: generateUniqueId('rev'),
      date: new Date().toISOString().substring(0, 10),
    };
    setReviews((prev) => [newRev, ...prev]);
    logAuditEvent('ADMIN_ACTION' as any, `Submitted ${review.rating}-star review for ${review.targetType} #${review.targetId}.`);
    addNotification('Review Published', `Thank you for rating and submitting your feedback.`, 'system');
  };

  const loginWithPhone = (phone: string, name?: string, targetRole: UserRole = 'patient') => {
    const finalName =
      name?.trim() ||
      (targetRole === 'doctor'
        ? INITIAL_USERS.doctor.name
        : targetRole === 'shopkeeper'
        ? INITIAL_USERS.shopkeeper.name
        : patientName || 'Sarath Paturu');
    setIsLoggedIn(true);
    setPatientPhone(phone);
    setPatientName(finalName);
    setRoleState(targetRole);
    localStorage.setItem('pulse_patient_logged_in', 'true');
    localStorage.setItem('pulse_patient_phone', phone);
    localStorage.setItem('pulse_patient_name', finalName);
    localStorage.setItem('pulse_role', targetRole);
    logAuditEvent('AUTH', `User authenticated via phone number: ${phone} as [${targetRole.toUpperCase()}]`);
  };

  const loginWithEmail = (email: string, _password?: string, targetRole: UserRole = 'patient', customName?: string) => {
    const finalName =
      customName?.trim() ||
      (targetRole === 'doctor'
        ? INITIAL_USERS.doctor.name
        : targetRole === 'shopkeeper'
        ? INITIAL_USERS.shopkeeper.name
        : email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())) ||
      'Sarath Paturu';
    setIsLoggedIn(true);
    setPatientEmail(email);
    setPatientName(finalName);
    setRoleState(targetRole);
    localStorage.setItem('pulse_patient_logged_in', 'true');
    localStorage.setItem('pulse_patient_email', email);
    localStorage.setItem('pulse_patient_name', finalName);
    localStorage.setItem('pulse_role', targetRole);
    logAuditEvent('AUTH', `User authenticated via email: ${email} as [${targetRole.toUpperCase()}]`);
  };

  const loginWithGoogle = async (targetRole: UserRole = 'patient') => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      if (fbUser) {
        const realName = fbUser.displayName || 'Sarath Paturu';
        const realEmail = fbUser.email || 'paturusarath@gmail.com';
        const realAvatar = fbUser.photoURL || roleProfiles[targetRole].avatar;

        setRoleState(targetRole);
        setIsLoggedIn(true);
        setPatientName(realName);
        setPatientEmail(realEmail);
        localStorage.setItem('pulse_patient_logged_in', 'true');
        localStorage.setItem('pulse_role', targetRole);
        localStorage.setItem('pulse_patient_name', realName);
        localStorage.setItem('pulse_patient_email', realEmail);

        // Store profile in Firestore
        try {
          const userRef = doc(db, 'users', fbUser.uid);
          await setDoc(
            userRef,
            {
              id: fbUser.uid,
              name: realName,
              email: realEmail,
              role: targetRole,
              phone: fbUser.phoneNumber || patientPhone,
              avatar: realAvatar,
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch (e) {
          console.warn('User profile sync to Firestore note:', e);
        }

        logAuditEvent('AUTH', `Authenticated via Google Firebase Auth (${realEmail}) as [${targetRole.toUpperCase()}]`);
      }
    } catch (err) {
      console.warn('Google Sign-in status:', err);
      // Fallback gracefully to authenticated user session
      loginWithEmail('paturusarath@gmail.com', undefined, targetRole, 'Sarath Paturu');
    }
  };

  const createAccount = (data: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    role?: UserRole;
    age?: number;
    gender?: string;
    bloodGroup?: string;
    medicalId?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    allergies?: string[];
    specialization?: string;
    licenseNumber?: string;
    hospital?: string;
    experienceYears?: number;
    fee?: number;
    qualifications?: string;
    storeName?: string;
    gstin?: string;
    address?: string;
    operatingHours?: string;
  }) => {
    const targetRole = data.role || 'patient';
    setIsLoggedIn(true);
    setPatientName(data.name);
    setPatientEmail(data.email);
    if (data.phone) setPatientPhone(data.phone);
    if (data.age) {
      setPatientAge(data.age);
      localStorage.setItem('pulse_patient_age', data.age.toString());
    }
    if (data.gender) {
      setPatientGender(data.gender);
      localStorage.setItem('pulse_patient_gender', data.gender);
    }
    if (data.bloodGroup) {
      setPatientBloodGroup(data.bloodGroup);
      localStorage.setItem('pulse_patient_blood_group', data.bloodGroup);
    }
    if (data.emergencyContactName) {
      localStorage.setItem('pulse_patient_emergency_name', data.emergencyContactName);
    }
    if (data.emergencyContactPhone) {
      localStorage.setItem('pulse_patient_emergency_phone', data.emergencyContactPhone);
    }
    if (data.allergies && data.allergies.length > 0) {
      const newAllergies = data.allergies
        .filter((a) => a !== 'No Known Allergies (NKDA)')
        .map((allergen) => ({
          id: `alg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          allergen,
          severity: 'Moderate' as const,
          reaction: 'Self-reported during patient portal registration',
          diagnosedDate: new Date().toISOString().substring(0, 10),
        }));
      if (newAllergies.length > 0) {
        setAllergies((prev) => [...newAllergies, ...prev]);
      }
    }
    if (data.specialization) localStorage.setItem('pulse_doctor_specialization', data.specialization);
    if (data.licenseNumber) localStorage.setItem('pulse_license_number', data.licenseNumber);
    if (data.hospital) localStorage.setItem('pulse_doctor_hospital', data.hospital);
    if (data.fee) localStorage.setItem('pulse_doctor_fee', data.fee.toString());
    if (data.storeName) localStorage.setItem('pulse_shop_store_name', data.storeName);
    if (data.gstin) localStorage.setItem('pulse_shop_gstin', data.gstin);
    setRoleState(targetRole);
    localStorage.setItem('pulse_patient_logged_in', 'true');
    localStorage.setItem('pulse_patient_name', data.name);
    localStorage.setItem('pulse_patient_email', data.email);
    if (data.phone) localStorage.setItem('pulse_patient_phone', data.phone);
    localStorage.setItem('pulse_role', targetRole);
    logAuditEvent('AUTH', `New ${targetRole.toUpperCase()} account created for ${data.name} (${data.email})`);
  };

  const logout = () => {
    setIsLoggedIn(false);
    fbSignOut(auth).catch(() => {});
    localStorage.removeItem('pulse_patient_logged_in');
    logAuditEvent('AUTH', 'User logged out of active session');
  };

  const updateUserProfile = (updates: Partial<User>) => {
    setRoleProfiles((prev) => {
      const current = prev[role] || INITIAL_USERS[role];
      const updated = { ...current, ...updates };
      try {
        localStorage.setItem(`pulse_user_profile_${role}`, JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      return {
        ...prev,
        [role]: updated,
      };
    });

    if (role === 'patient') {
      if (updates.name) {
        setPatientName(updates.name);
        localStorage.setItem('pulse_patient_name', updates.name);
      }
      if (updates.email) {
        setPatientEmail(updates.email);
        localStorage.setItem('pulse_patient_email', updates.email);
      }
      if (updates.phone) {
        setPatientPhone(updates.phone);
        localStorage.setItem('pulse_patient_phone', updates.phone);
      }
      if (updates.age !== undefined) {
        setPatientAge(updates.age);
        localStorage.setItem('pulse_patient_age', updates.age.toString());
      }
      if (updates.gender) {
        setPatientGender(updates.gender);
        localStorage.setItem('pulse_patient_gender', updates.gender);
      }
      if (updates.bloodGroup) {
        setPatientBloodGroup(updates.bloodGroup);
        localStorage.setItem('pulse_patient_blood_group', updates.bloodGroup);
      }
    }

    if (updates.selectedLanguage) {
      setSelectedLanguageState(updates.selectedLanguage);
      localStorage.setItem('pulse_selected_language', updates.selectedLanguage);
    }

    // Update in Firestore
    try {
      const uid = auth.currentUser?.uid || currentUser.id;
      if (uid) {
        setDoc(doc(db, 'users', uid), updates, { merge: true }).catch((err) =>
          console.warn('Firestore user update note:', err)
        );
      }
    } catch (e) {
      console.warn('Firestore user profile sync note:', e);
    }

    logAuditEvent('ADMIN_ACTION' as any, `Updated profile for ${role.toUpperCase()} (${updates.name || currentUser.name}).`);
    addNotification('Profile Updated', 'Profile details have been updated successfully.', 'system');
  };

  const setSelectedLanguage = (lang: string) => {
    setSelectedLanguageState(lang);
    localStorage.setItem('pulse_selected_language', lang);
    updateUserProfile({ selectedLanguage: lang });
  };

  return (
    <HealthContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        isLoggedIn,
        isFirebaseConnected,
        patientPhone,
        patientEmail,
        loginWithPhone,
        loginWithEmail,
        loginWithGoogle,
        createAccount,
        logout,
        selectedLanguage,
        setSelectedLanguage,
        t,
        updateUserProfile,
        isEditProfileOpen,
        openEditProfile,
        closeEditProfile,
        doctors,
        appointments,
        bookAppointment,
        cancelAppointment,
        startConsultation,
        activeConsultation,
        endConsultation,
        prescriptions,
        createPrescription,
        activePrescriptionModal,
        setActivePrescriptionModal,
        addPrescriptionToCart,
        medicines,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartTotal,
        cartItemCount,
        orders,
        checkoutOrder,
        updateOrderStatus,
        medicineReturns,
        requestMedicineReturn,
        acceptMedicineReturn,
        rejectMedicineReturn,
        processReturnRequest,
        pillReminders,
        addPillReminder,
        togglePillReminder,
        markPillTaken,
        deletePillReminder,
        wellnessPlans,
        generateAIWellnessPlan,
        addCustomWellnessPlan,
        wellnessStats,
        updateHydration,
        setHydrationCups,
        updateActivitySteps,
        updateSleepHours,
        resetDailyWellnessStats,
        vitals,
        updateVitals,
        allergies,
        addAllergy,
        diagnoses,
        addDiagnosis,
        labReports,
        uploadLabReport,
        transactions,
        activeReceipt,
        setActiveReceipt,
        processDirectPayment,
        articles,
        likeArticle,
        videos,
        toggleWatchlist,
        reviews,
        addReview,
        auditLogs,
        logAuditEvent,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        clearAllNotifications,
        addNotification,
        isAIAssistantOpen,
        setIsAIAssistantOpen,
        openAIAssistant,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
