import React from 'react';
import {
  Home,
  ShoppingBag,
  Stethoscope,
  Sparkles,
  User,
  Users,
  Calendar,
  Package,
  Pill,
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';

export type BottomNavTab = 'home' | 'shopping' | 'doctors' | 'account';

interface BottomNavProps {
  activeTab: BottomNavTab;
  setActiveTab: (tab: BottomNavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { cartItemCount, appointments, orders, role, t } = useHealth();
  const confirmedAppointmentsCount = appointments.filter((a) => a.status === 'confirmed').length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  // Dynamic Navigation Items based on User Role (Patient, Doctor, Shopkeeper)
  const getNavItems = () => {
    if (role === 'doctor') {
      return [
        {
          id: 'home' as BottomNavTab,
          label: 'Home',
          icon: Home,
          badge: undefined,
        },
        {
          id: 'shopping' as BottomNavTab,
          label: 'Patients',
          icon: Users,
          badge: undefined,
        },
        {
          id: 'doctors' as BottomNavTab,
          label: 'Schedule',
          icon: Calendar,
          badge: confirmedAppointmentsCount > 0 ? confirmedAppointmentsCount : undefined,
        },
        {
          id: 'account' as BottomNavTab,
          label: 'Portal',
          icon: Stethoscope,
          badge: undefined,
        },
      ];
    }

    if (role === 'shopkeeper') {
      return [
        {
          id: 'home' as BottomNavTab,
          label: 'Home',
          icon: Home,
          badge: undefined,
        },
        {
          id: 'shopping' as BottomNavTab,
          label: 'Orders',
          icon: Package,
          badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
        },
        {
          id: 'doctors' as BottomNavTab,
          label: 'Inventory',
          icon: Pill,
          badge: undefined,
        },
        {
          id: 'account' as BottomNavTab,
          label: 'Portal',
          icon: User,
          badge: undefined,
        },
      ];
    }

    // Default: Patient
    return [
      {
        id: 'home' as BottomNavTab,
        label: 'Home',
        icon: Home,
        badge: undefined,
      },
      {
        id: 'shopping' as BottomNavTab,
        label: 'Medimart',
        icon: ShoppingBag,
        badge: cartItemCount > 0 ? cartItemCount : undefined,
      },
      {
        id: 'doctors' as BottomNavTab,
        label: 'Doctor',
        icon: Stethoscope,
        badge: confirmedAppointmentsCount > 0 ? confirmedAppointmentsCount : undefined,
      },
      {
        id: 'account' as BottomNavTab,
        label: 'Portal',
        icon: User,
        badge: undefined,
      },
    ];
  };

  const navItems = getNavItems();

  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Bottom Navigation"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg py-1.5 px-3 select-none"
    >
      <div className="max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 sm:px-5 rounded-2xl transition-all duration-200 group ${
                isActive
                  ? role === 'doctor'
                    ? 'text-blue-700 font-bold'
                    : role === 'shopkeeper'
                    ? 'text-amber-700 font-bold'
                    : 'text-indigo-700 font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              {/* Active Tab Pill Indicator */}
              <div
                className={`relative flex items-center justify-center w-10 h-7 rounded-full transition ${
                  isActive
                    ? role === 'doctor'
                      ? 'bg-blue-50'
                      : role === 'shopkeeper'
                      ? 'bg-amber-50'
                      : 'bg-indigo-50'
                    : 'bg-transparent group-hover:bg-slate-100/70'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive
                      ? role === 'doctor'
                        ? 'scale-110 text-blue-600'
                        : role === 'shopkeeper'
                        ? 'scale-110 text-amber-600'
                        : 'scale-110 text-indigo-600'
                      : 'text-slate-500'
                  }`}
                />

                {/* Badge */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`absolute -top-1 -right-1.5 min-w-[18px] h-[18px] px-1 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs ${
                      role === 'doctor'
                        ? 'bg-blue-600'
                        : role === 'shopkeeper'
                        ? 'bg-amber-600'
                        : 'bg-indigo-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[11px] mt-0.5 tracking-tight ${
                  isActive
                    ? role === 'doctor'
                      ? 'font-black text-blue-900'
                      : role === 'shopkeeper'
                      ? 'font-black text-amber-900'
                      : 'font-black text-indigo-900'
                    : 'font-semibold text-slate-600'
                }`}
              >
                {t(item.label)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
