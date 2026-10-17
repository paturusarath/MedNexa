/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HealthProvider, useHealth } from './context/HealthContext';
import { Navbar } from './components/Navbar';
import { PhoneLogin } from './components/PhoneLogin';
import { BottomNav, BottomNavTab } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { PharmacyModule } from './components/PharmacyModule';
import { TelemedicineModule } from './components/TelemedicineModule';
import { MyAccountModule, AccountSubTab } from './components/MyAccountModule';
import { FloatingAIAssistant } from './components/FloatingAIAssistant';
import { SecurityComplianceModule } from './components/SecurityComplianceModule';
import { PrescriptionModal } from './components/PrescriptionModal';
import { ConsultationRoom } from './components/ConsultationRoom';
import { EditProfileModal } from './components/common/EditProfileModal';
import { Doctor } from './types';

// Doctor Role Dedicated Views
import { DoctorHomeView } from './components/doctor/DoctorHomeView';
import { DoctorPatientsView } from './components/doctor/DoctorPatientsView';
import { DoctorScheduleView } from './components/doctor/DoctorScheduleView';
import { DoctorPortalView } from './components/doctor/DoctorPortalView';

// Shopkeeper Role Dedicated Views
import { ShopkeeperHomeView } from './components/shopkeeper/ShopkeeperHomeView';
import { ShopkeeperOrdersView } from './components/shopkeeper/ShopkeeperOrdersView';
import { ShopkeeperInventoryView } from './components/shopkeeper/ShopkeeperInventoryView';
import { ShopkeeperPortalView } from './components/shopkeeper/ShopkeeperPortalView';

import {
  HeartPulse,
  Shield,
  Activity,
  User,
  Stethoscope,
  ShoppingBag,
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    isLoggedIn,
    role,
    activePrescriptionModal,
    setActivePrescriptionModal,
    activeConsultation,
    isEditProfileOpen,
    closeEditProfile,
  } = useHealth();

  // Bottom Navigation Active Tab
  const [activeTab, setActiveTab] = useState<BottomNavTab>('home');
  const [accountSubTab, setAccountSubTab] = useState<AccountSubTab | null>(null);
  const [pharmacySubTab, setPharmacySubTab] = useState<'catalog' | 'cart' | 'orders'>('catalog');
  const [selectedDoctorToBook, setSelectedDoctorToBook] = useState<Doctor | null>(null);

  // Sync tab on role change to ensure starting at home
  useEffect(() => {
    setActiveTab('home');
  }, [role]);

  // If user is not yet logged in, show the mobile phone login screen
  if (!isLoggedIn) {
    return <PhoneLogin />;
  }

  const handleNavigate = (tab: BottomNavTab, subSection?: string) => {
    setActiveTab(tab);
    if (tab === 'account') {
      setAccountSubTab(subSection ? (subSection as AccountSubTab) : null);
    }
    if (tab === 'shopping') {
      setPharmacySubTab(subSection ? (subSection as 'catalog' | 'cart' | 'orders') : 'cart');
    }
  };

  const handleSelectDoctorToBook = (doc: Doctor) => {
    setSelectedDoctorToBook(doc);
    setActiveTab('doctors');
  };

  // Render role-specific main view
  const renderMainContent = () => {
    if (role === 'doctor') {
      switch (activeTab) {
        case 'home':
          return <DoctorHomeView onNavigate={handleNavigate} />;
        case 'shopping': // Labeled "Patients" in bottom nav
          return <DoctorPatientsView onNavigate={handleNavigate} />;
        case 'doctors': // Labeled "Schedule" in bottom nav
          return <DoctorScheduleView onNavigate={handleNavigate} />;
        case 'account': // Labeled "Portal" in bottom nav
          return <DoctorPortalView onNavigate={handleNavigate} />;
        default:
          return <DoctorHomeView onNavigate={handleNavigate} />;
      }
    }

    if (role === 'shopkeeper') {
      switch (activeTab) {
        case 'home':
          return <ShopkeeperHomeView onNavigate={handleNavigate} />;
        case 'shopping': // Labeled "Orders" in bottom nav
          return <ShopkeeperOrdersView onNavigate={handleNavigate} />;
        case 'doctors': // Labeled "Inventory" in bottom nav
          return <ShopkeeperInventoryView onNavigate={handleNavigate} />;
        case 'account': // Labeled "Portal" in bottom nav
          return <ShopkeeperPortalView onNavigate={handleNavigate} />;
        default:
          return <ShopkeeperHomeView onNavigate={handleNavigate} />;
      }
    }

    // Default: Patient
    switch (activeTab) {
      case 'home':
        return (
          <HomeView
            onNavigate={handleNavigate}
            onSelectDoctorToBook={handleSelectDoctorToBook}
          />
        );
      case 'shopping':
        return <PharmacyModule initialSubTab={pharmacySubTab} />;
      case 'doctors':
        return (
          <TelemedicineModule
            initialDoctorToBook={selectedDoctorToBook}
            onNavigateToShopping={() => handleNavigate('shopping', 'cart')}
          />
        );
      case 'account':
        return <MyAccountModule initialSubTab={accountSubTab} onNavigate={handleNavigate} />;
      default:
        return (
          <HomeView
            onNavigate={handleNavigate}
            onSelectDoctorToBook={handleSelectDoctorToBook}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Top Fixed Header with Brand, Role Switcher & Notifications */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab, subSection) => {
          setActiveTab(tab as BottomNavTab);
          if (tab === 'account') {
            setAccountSubTab(subSection ? (subSection as AccountSubTab) : null);
          }
          if (tab === 'shopping') {
            setPharmacySubTab(subSection ? (subSection as 'catalog' | 'cart' | 'orders') : 'cart');
          }
        }}
      />

      {/* Main Content Area with Bottom Padding for BottomNav */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28">
        {renderMainContent()}
      </main>

      {/* Fixed Position AI Assistant Floating Widget available for Patient, Doctor, and Shopkeeper */}
      <FloatingAIAssistant
        onNavigate={handleNavigate}
        onSelectDoctorToBook={handleSelectDoctorToBook}
      />

      {/* Fixed Bottom Navigation with requested tabs */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'account') {
            setAccountSubTab(null);
          }
        }}
      />

      {/* Prescription Certificate Modal */}
      {activePrescriptionModal && (
        <PrescriptionModal
          prescription={activePrescriptionModal}
          onClose={() => setActivePrescriptionModal(null)}
          onNavigateToShopping={() => {
            setActivePrescriptionModal(null);
            handleNavigate('shopping', 'cart');
          }}
        />
      )}

      {/* Interactive Consultation Room Video Overlay */}
      {activeConsultation && <ConsultationRoom />}

      {/* Global Centered Edit Profile Modal kept in front with background processing */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={closeEditProfile}
      />
    </div>
  );
};

export default function App() {
  return (
    <HealthProvider>
      <MainAppContent />
    </HealthProvider>
  );
}
