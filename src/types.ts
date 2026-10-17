export type UserRole = 'patient' | 'doctor' | 'admin' | 'shopkeeper';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone: string;
  specialization?: string;
  licenseNumber?: string;
  hospital?: string;
  age?: number;
  gender?: string;
  bloodGroup?: string;
  experienceYears?: number;
  fee?: number;
  qualifications?: string;
  storeName?: string;
  gstin?: string;
  address?: string;
  operatingHours?: string;
  selectedLanguage?: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialization: string;
  experienceYears: number;
  fee: number;
  rating: number;
  reviewCount: number;
  avatar: string;
  education: string;
  hospital: string;
  availableDays: string[];
  availableSlots: string[];
  bio: string;
  languages: string[];
  isAvailableToday: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAge?: number;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  date: string;
  timeSlot: string;
  type: 'video' | 'in-clinic' | 'audio';
  status: 'confirmed' | 'completed' | 'cancelled' | 'in-progress';
  fee: number;
  paymentStatus: 'paid' | 'pending';
  reason: string;
  clinicalNotes?: string;
  prescriptionId?: string;
}

export interface PrescriptionMedicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientSalutation?: string;
  guardianName?: string;
  patientAge: number;
  patientGender: string;
  doctorId: string;
  doctorName: string;
  doctorDesignation?: string;
  doctorSpecialization: string;
  doctorLicense: string;
  clinicName: string;
  date: string;
  diagnosis: string;
  medicines: PrescriptionMedicine[];
  dietaryAdvice: string;
  followUpDate: string;
  digitalSignature: string;
  qrCodeHash: string;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: 'Cardiovascular' | 'Antibiotics' | 'Pain Relief' | 'Vitamins & Supplements' | 'Diabetes Care' | 'Respiratory' | 'Thyroid Care';
  manufacturer: string;
  price: number;
  discountPrice?: number;
  stock: number;
  requiresPrescription: boolean;
  dosageForm: 'Tablet' | 'Syrup' | 'Capsule' | 'Inhaler' | 'Injection';
  strength: string;
  description: string;
  uses: string[];
  sideEffects: string[];
  rating: number;
  reviewsCount: number;
  image: string;
  backImage?: string; // Back picture of tablet sheet/foil showing composition, batch & expiry
  batchNumber?: string;
  expiryDate?: string;
  mfgDate?: string;
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

export interface PharmacyOrder {
  id: string;
  patientId: string;
  patientName: string;
  items: {
    medicineId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    requiresPrescription: boolean;
  }[];
  totalAmount: number;
  prescriptionFile?: string;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  paymentMethod: string;
  transactionId: string;
  orderedAt: string;
  estimatedDelivery: string;
  trackingSteps: {
    title: string;
    date: string;
    completed: boolean;
  }[];
}

export interface MedicineReturnRequest {
  id: string;
  orderId: string;
  patientId: string;
  patientName: string;
  patientPhone?: string;
  medicineName: string;
  medicineId?: string;
  quantity: number;
  itemPrice: number;
  totalRefundAmount: number;
  reason: 'expired' | 'damaged_seal_foil' | 'broken_bottle_tablets' | 'wrong_item_dispensed' | 'doctor_discontinued';
  reasonDescription: string;
  batchNumber?: string;
  expiryDateFound?: string;
  photoProofUrl?: string;
  resolutionRequested: 'refund' | 'replacement';
  status: 'pending' | 'accepted' | 'approved' | 'rejected' | 'replacement_dispatched';
  requestedAt: string;
  acceptedAt?: string;
  processedAt?: string;
  pharmacyNotes?: string;
  quarantineBinId?: string;
}

export interface PillReminder {
  id: string;
  patientId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  intakeTimes: string[];
  instructions: string;
  prescribedBy?: string;
  startDate: string;
  endDate: string;
  active: boolean;
  todayTakenTimes: string[];
  pillImageUrl?: string;
  pillImprint?: string;
  tabletColor?: string;
  tabletShape?: string;
}

export interface WellnessPlan {
  id: string;
  patientId: string;
  type: 'diet' | 'exercise';
  title: string;
  summary: string;
  assignedBy: string;
  createdAt: string;
  planData: any;
}

export interface Allergy {
  allergen: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  reaction: string;
}

export interface DiagnosisRecord {
  id: string;
  condition: string;
  diagnosedDate: string;
  status: 'active' | 'past';
  doctor: string;
  notes: string;
}

export interface LabReport {
  id: string;
  testName: string;
  category: string;
  testDate: string;
  labName: string;
  status: 'Normal' | 'Abnormal' | 'Under Review';
  summary: string;
  parameters: {
    parameter: string;
    value: string;
    unit: string;
    normalRange: string;
    flag?: 'normal' | 'high' | 'low';
  }[];
}

export interface HealthVitals {
  heightCm: number;
  weightKg: number;
  bmi: number;
  bloodPressure: string;
  heartRateBpm: number;
  bloodSugarMgDl: number;
  oxygenSatPct: number;
  temperatureF: number;
  recordedAt: string;
}

export interface Transaction {
  id: string;
  type: 'Consultation Fee' | 'Pharmacy Order';
  title: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Refunded';
  paymentMethod: 'Credit/Debit Card' | 'Instant UPI / Pay' | 'Health Insurance Co-Pay' | 'Digital Wallet' | 'Cash at Clinic / Doorstep';
  date: string;
  referenceId: string;
  receiptNumber: string;
  patientName: string;
}

export interface HealthArticle {
  id: string;
  title: string;
  category: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  readTime: string;
  publishedAt: string;
  summary: string;
  content: string;
  banner: string;
  tags: string[];
  likes: number;
}

export interface EducationalVideo {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  speaker: string;
  views: number;
  thumbnailUrl: string;
  videoUrl: string;
  inWatchlist?: boolean;
}

export interface Review {
  id: string;
  targetType: 'doctor' | 'medicine';
  targetId: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
  tags: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  category: 'AUTH' | 'EHR_ACCESS' | 'PRESCRIPTION_ISSUED' | 'ORDER_PLACED' | 'PAYMENT' | 'SECURITY';
  ipAddress: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'order' | 'reminder' | 'prescription' | 'system';
  category?: 'clinical' | 'system';
  timestamp: string;
  read: boolean;
  targetRole?: UserRole | 'all';
}

export interface DailyWellnessStats {
  hydration: {
    currentCups: number;
    goalCups: number;
    cupVolumeMl: number;
  };
  activity: {
    currentSteps: number;
    goalSteps: number;
    activeMinutes: number;
    goalMinutes: number;
    caloriesBurned: number;
  };
  sleep: {
    hoursSlept: number;
    goalHours: number;
    qualityScore: number;
    bedTime: string;
    wakeTime: string;
  };
}
