import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Bot,
  X,
  Maximize2,
  Minimize2,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { AIAssistantModule } from './AIAssistantModule';
import { BottomNavTab } from './BottomNav';
import { Doctor } from '../types';
import { useHealth } from '../context/HealthContext';

interface FloatingAIAssistantProps {
  onNavigate?: (tab: BottomNavTab, subSection?: string) => void;
  onSelectDoctorToBook?: (doctor: Doctor) => void;
}

export const FloatingAIAssistant: React.FC<FloatingAIAssistantProps> = ({
  onNavigate,
  onSelectDoctorToBook,
}) => {
  const { role, isAIAssistantOpen, setIsAIAssistantOpen } = useHealth();
  const isOpen = isAIAssistantOpen;
  const setIsOpen = setIsAIAssistantOpen;
  const [isExpanded, setIsExpanded] = useState(false);

  const getRoleLabel = () => {
    return 'AI';
  };

  const getRoleHeader = () => {
    return 'AI';
  };

  return (
    <>
      {/* FIXED POSITION FLOATING TRIGGER BUTTON */}
      <div
        id="fixed-ai-assistant-button-container"
        className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50 select-none"
      >
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              type="button"
              id="fixed-ai-trigger-btn"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              aria-label="Open AI"
              className="group relative flex items-center gap-2 bg-gradient-to-r from-teal-700 via-teal-800 to-indigo-950 text-white px-4 py-3 rounded-full shadow-2xl shadow-teal-950/50 border border-teal-400/40 hover:border-teal-300 transition-all cursor-pointer"
            >
              {/* Pulsing Beacon Ring */}
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-teal-500 border-2 border-white" />
              </span>

              {/* Distinctive AI Symbol (Sparkles + Bot) */}
              <div className="relative w-7 h-7 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-teal-100 group-hover:bg-white/25 transition">
                <Bot className="w-4.5 h-4.5 text-white" />
                <Sparkles className="w-3 h-3 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
              </div>

              {/* Role-specific label */}
              <span className="text-sm font-black tracking-wider text-white flex items-center gap-1.5">
                {getRoleLabel()}
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* FLOATING AI ASSISTANT MODAL / DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <div
            id="ai-assistant-floating-overlay"
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs"
          >
            {/* Backdrop click dismiss */}
            <div
              className="absolute inset-0"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className={`relative z-10 bg-slate-100 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden w-full transition-all duration-300 ${
                isExpanded
                  ? 'h-[96vh] max-w-6xl'
                  : 'h-[88vh] sm:h-[680px] max-w-4xl'
              }`}
            >
              {/* Header Bar */}
              <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-indigo-950 text-white px-5 py-3.5 flex items-center justify-between shrink-0 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-teal-100 relative">
                    <Bot className="w-4.5 h-4.5 text-white" />
                    <Sparkles className="w-3 h-3 text-amber-300 absolute -top-0.5 -right-0.5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      {getRoleHeader()}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-400/20 text-teal-200 border border-teal-300/30">
                        Online
                      </span>
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 text-teal-200 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer hidden sm:flex"
                    title={isExpanded ? 'Collapse size' : 'Expand full view'}
                  >
                    {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    id="close-floating-ai-assistant-btn"
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-teal-200 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
                    title="Close Assistant"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Assistant Module Content (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <AIAssistantModule
                  onNavigate={(tab, subSection) => {
                    setIsOpen(false);
                    if (onNavigate) onNavigate(tab, subSection);
                  }}
                  onSelectDoctorToBook={(doc) => {
                    setIsOpen(false);
                    if (onSelectDoctorToBook) onSelectDoctorToBook(doc);
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
