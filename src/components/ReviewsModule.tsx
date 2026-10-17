import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Star,
  Plus,
  ShieldCheck,
  Stethoscope,
  Pill,
  UserCheck,
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { Review } from '../types';

export const ReviewsModule: React.FC = () => {
  const { reviews, addReview, doctors, medicines } = useHealth();

  const [activeTab, setActiveTab] = useState<'doctor' | 'medicine'>('doctor');
  const [showAddModal, setShowAddModal] = useState(false);

  // New review form
  const [targetId, setTargetId] = useState(doctors[0]?.id || 'doc-1');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [tagInput, setTagInput] = useState('Punctual & Thorough');

  const filteredReviews = reviews.filter((r) => r.targetType === activeTab);

  const averageRating =
    filteredReviews.length > 0
      ? (
          filteredReviews.reduce((sum, r) => sum + r.rating, 0) /
          filteredReviews.length
        ).toFixed(1)
      : '5.0';

  const getTargetName = (rev: Review) => {
    if (rev.targetType === 'doctor') {
      const doc = doctors.find((d) => d.id === rev.targetId);
      return doc ? doc.name : 'Physician';
    }
    const med = medicines.find((m) => m.id === rev.targetId);
    return med ? `${med.name} (${med.strength})` : 'Medication';
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    addReview({
      targetType: activeTab,
      targetId,
      authorName: 'Sarath Paturu',
      rating,
      comment,
      tags: [tagInput],
    });

    setShowAddModal(false);
    setComment('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
            Doctor &amp; Medicine Reviews
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Read and share honest feedback to help fellow patients choose the best care.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('doctor')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'doctor' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              Doctor Reviews
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('medicine')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'medicine' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Pill className="w-3.5 h-3.5" />
              Medicine Reviews
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setTargetId(activeTab === 'doctor' ? doctors[0]?.id : medicines[0]?.id);
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            Write Review
          </button>
        </div>
      </div>

      {/* Aggregate Score Banner */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-black text-slate-900">{averageRating}</div>
          <div>
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Based on {filteredReviews.length} verified {activeTab} experiences
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-teal-50 text-teal-800 rounded-xl border border-teal-200">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          100% Verified Telehealth &amp; Pharmacy Encounters
        </div>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-bold text-slate-900 text-sm">{getTargetName(rev)}</span>
                <p className="text-xs text-slate-400">{rev.date}</p>
              </div>

              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed italic">
              "{rev.comment}"
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>{rev.authorName}</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                  Verified
                </span>
              </div>

              <div className="flex gap-1">
                {rev.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Write Review Modal */}
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
                  Submit Clinical Review
                </h3>
                <p className="text-xs text-slate-500">
                  Share your medical or pharmaceutical feedback
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

            <form onSubmit={handleSaveReview} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select {activeTab === 'doctor' ? 'Doctor' : 'Medication'}
                </label>
                <select
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                >
                  {activeTab === 'doctor'
                    ? doctors.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.specialization})
                        </option>
                      ))
                    : medicines.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.strength})
                        </option>
                      ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Star Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setRating(num)}
                      className={`p-2 rounded-xl border flex items-center gap-1 ${
                        rating >= num
                          ? 'bg-amber-50 border-amber-400 text-amber-700 font-bold'
                          : 'border-slate-200 text-slate-400'
                      }`}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          rating >= num ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                      <span>{num}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Feedback Tag</label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="e.g. Excellent Diagnosis, Fast Relief"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Review</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Describe your care experience or medication effectiveness..."
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-teal-500 resize-none"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-medium text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
