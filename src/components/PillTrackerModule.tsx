import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Bell,
  CheckCircle2,
  Clock,
  Calendar,
  Plus,
  Trash2,
  Pill,
  Sparkles,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { PillReminder } from '../types';

export const PillTrackerModule: React.FC = () => {
  const {
    pillReminders,
    addPillReminder,
    togglePillReminder,
    markPillTaken,
    deletePillReminder,
  } = useHealth();

  const [showAddModal, setShowAddModal] = useState(false);
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('1 Tablet (20 mg)');
  const [frequency, setFrequency] = useState('Daily');
  const [intakeTimes, setIntakeTimes] = useState<string[]>(['08:00 AM']);
  const [timeInput, setTimeInput] = useState('08:00 AM');
  const [instructions, setInstructions] = useState('With breakfast and water');
  const [startDate, setStartDate] = useState('2026-09-22');
  const [endDate, setEndDate] = useState('2026-11-22');

  // Adherence calculation
  const totalDosesToday = pillReminders.reduce(
    (sum, r) => sum + (r.active ? r.intakeTimes.length : 0),
    0
  );
  const takenDosesToday = pillReminders.reduce(
    (sum, r) => sum + (r.active ? r.todayTakenTimes.length : 0),
    0
  );
  const adherenceRate =
    totalDosesToday > 0 ? Math.round((takenDosesToday / totalDosesToday) * 100) : 100;

  const handleAddTime = () => {
    if (timeInput && !intakeTimes.includes(timeInput)) {
      setIntakeTimes([...intakeTimes, timeInput]);
    }
  };

  const handleRemoveTime = (t: string) => {
    setIntakeTimes(intakeTimes.filter((x) => x !== t));
  };

  const handleSaveReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicineName.trim() || intakeTimes.length === 0) return;

    addPillReminder({
      patientId: 'pat-101',
      medicineName,
      dosage,
      frequency,
      intakeTimes,
      instructions,
      startDate,
      endDate,
    });

    setShowAddModal(false);
    setMedicineName('');
    setIntakeTimes(['08:00 AM']);
  };

  return (
    <div className="space-y-6">
      {/* Header & Metrics */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-teal-600" />
            My Medicines &amp; Daily Schedule
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Keep track of your daily doses, set reminder alarms, and stay on track with your prescriptions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          + Add New Medicine
        </button>
      </div>

      {/* Adherence Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-gradient-to-br from-teal-700 to-teal-900 text-white rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-teal-200 uppercase font-semibold tracking-wider">
              Today's Pill Score
            </span>
            <div className="text-3xl font-black mt-1">{adherenceRate}%</div>
            <p className="text-xs text-teal-100/80 mt-0.5">
              {takenDosesToday} of {totalDosesToday} doses taken today
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
            <TrendingUp className="w-7 h-7 text-teal-300" />
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">
              Active Medicines
            </span>
            <div className="text-3xl font-black text-slate-900 mt-1">
              {pillReminders.filter((r) => r.active).length}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Scheduled prescriptions</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center border border-teal-100">
            <Pill className="w-7 h-7 text-teal-600" />
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">
              Current Streak
            </span>
            <div className="text-3xl font-black text-slate-900 mt-1">18 Days</div>
            <p className="text-xs text-emerald-600 font-medium mt-0.5">
              Great job! On-time streak
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100">
            <Sparkles className="w-7 h-7 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Pill Reminder Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">Today's Medication Schedule</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pillReminders.map((rem) => {
            const allTimesTaken =
              rem.intakeTimes.length > 0 &&
              rem.intakeTimes.every((t) => rem.todayTakenTimes.includes(t));

            return (
              <div
                key={rem.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs space-y-4 transition ${
                  rem.active
                    ? allTimesTaken
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-slate-200'
                    : 'border-slate-200 opacity-60 bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        allTimesTaken
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-teal-50 text-teal-600'
                      }`}
                    >
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{rem.medicineName}</h4>
                      <p className="text-xs text-slate-500">{rem.dosage}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => togglePillReminder(rem.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      rem.active
                        ? 'bg-teal-100 text-teal-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {rem.active ? 'ACTIVE' : 'PAUSED'}
                  </button>
                </div>

                <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Frequency:</span>
                    <span className="font-medium text-slate-800">{rem.frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Directions:</span>
                    <span className="font-medium text-slate-800">{rem.instructions}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/60">
                    <span>Valid until:</span>
                    <span>{rem.endDate}</span>
                  </div>
                </div>

                {/* Intake Times Checklist */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block mb-2 uppercase">
                    Daily Intake Times
                  </span>
                  <div className="space-y-2">
                    {rem.intakeTimes.map((time, idx) => {
                      const isTaken = rem.todayTakenTimes.includes(time);
                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition ${
                            isTaken
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Clock className={`w-3.5 h-3.5 ${isTaken ? 'text-emerald-600' : 'text-slate-400'}`} />
                            <span className="font-bold">{time}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                if (!isTaken) {
                                  markPillTaken(rem.id, time);
                                }
                              }}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition shadow-2xs ${
                                isTaken
                                  ? 'bg-emerald-600 text-white cursor-default'
                                  : 'bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-700 cursor-pointer'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {isTaken ? 'Taken ✓' : 'Mark Dose'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => deletePillReminder(rem.id)}
                    className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove Reminder
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Set Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4"
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Set Up Custom Pill Reminder
                </h3>
                <p className="text-xs text-slate-500">
                  Customize dosage, frequency, times, and duration
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveReminder} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Medicine Name &amp; Strength
                </label>
                <input
                  type="text"
                  placeholder="e.g. Metformin 500mg, Lisinopril"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Twice Daily">Twice Daily</option>
                    <option value="Thrice Daily">Thrice Daily</option>
                    <option value="Every 8 Hours">Every 8 Hours</option>
                    <option value="As Needed (PRN)">As Needed (PRN)</option>
                  </select>
                </div>
              </div>

              {/* Intake Times List */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Specific Intake Times
                </label>
                <div className="flex gap-2 mb-2">
                  <select
                    value={timeInput}
                    onChange={(e) => setTimeInput(e.target.value)}
                    className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="07:00 AM">07:00 AM (Early Morning)</option>
                    <option value="08:00 AM">08:00 AM (Breakfast)</option>
                    <option value="12:30 PM">12:30 PM (Lunch)</option>
                    <option value="04:30 PM">04:30 PM (Afternoon)</option>
                    <option value="07:30 PM">07:30 PM (Dinner)</option>
                    <option value="09:00 PM">09:00 PM (Bedtime)</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddTime}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold"
                  >
                    Add Time
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {intakeTimes.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 text-teal-800 border border-teal-200 rounded-lg text-xs font-semibold"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTime(t)}
                        className="text-teal-600 hover:text-rose-600"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Instructions &amp; Meal Correlation
                </label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Take with food, 30 min before breakfast"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
