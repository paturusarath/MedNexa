import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  BookOpen,
  Video,
  Play,
  Heart,
  Clock,
  Eye,
  Bookmark,
  Search,
  Filter,
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { HealthArticle, EducationalVideo } from '../types';

export const EducationModule: React.FC = () => {
  const { articles, videos, likeArticle, toggleWatchlist } = useHealth();

  const [activeTab, setActiveTab] = useState<'articles' | 'videos'>('articles');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Reader Modal for Article
  const [readingArticle, setReadingArticle] = useState<HealthArticle | null>(null);

  // Video Player Modal
  const [activeVideo, setActiveVideo] = useState<EducationalVideo | null>(null);

  const categories = ['All', 'Cardiology', 'Metabolic Health', 'Pharmacology', 'Nutrition', 'Mental Health'];

  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const filteredVideos = videos.filter((vid) => {
    const matchesSearch =
      vid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vid.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || vid.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-teal-600" />
            Health Guides &amp; Wellness Videos
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Simple, doctor-approved wellness tips and videos to help you feel your best.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('articles')}
            className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'articles' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Medical Articles ({articles.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('videos')}
            className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'videos' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            Video Library ({videos.length})
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medical topics, guides, symptoms..."
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-teal-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All Clinical Specialties' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* VIEW 1: Articles */}
      {activeTab === 'articles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredArticles.map((art) => (
            <motion.div
              key={art.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.15 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between hover:border-teal-300 transition"
            >
              <div>
                <div className="relative aspect-16/9 overflow-hidden bg-slate-100">
                  <img
                    src={art.banner}
                    alt={art.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-teal-900/80 backdrop-blur-xs text-teal-100 text-[10px] font-bold">
                    {art.category}
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-950/70 backdrop-blur-xs text-white text-[10px] font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {art.readTime}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {art.summary}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-medium">{art.author.name}</span>
                    <span>{art.publishedAt}</span>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => likeArticle(art.id)}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-rose-600 font-medium transition"
                >
                  <Heart className="w-4 h-4 fill-rose-50 text-rose-500" />
                  <span>{art.likes}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReadingArticle(art)}
                  className="inline-flex items-center gap-1 font-bold text-teal-700 hover:text-teal-900 transition"
                >
                  Read Article &rarr;
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* VIEW 2: Video Library */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVideos.map((vid) => (
            <motion.div
              key={vid.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.15 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between hover:border-teal-300 transition"
            >
              <div>
                <div
                  className="relative aspect-16/9 overflow-hidden bg-slate-900 group cursor-pointer"
                  onClick={() => setActiveVideo(vid)}
                >
                  <img
                    src={vid.thumbnailUrl}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition">
                    <div className="w-12 h-12 rounded-full bg-teal-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono">
                    {vid.duration}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    {vid.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 mt-1">
                    {vid.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Presented by {vid.speaker}
                  </p>
                </div>
              </div>

              <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {vid.views.toLocaleString()} views
                </span>

                <button
                  type="button"
                  onClick={() => toggleWatchlist(vid.id)}
                  className={`flex items-center gap-1 font-semibold transition ${
                    vid.inWatchlist ? 'text-teal-700' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${vid.inWatchlist ? 'fill-teal-600' : ''}`} />
                  {vid.inWatchlist ? 'In Watchlist' : 'Save'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Article Reader Modal */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 space-y-5 my-8"
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
                {readingArticle.category} &bull; {readingArticle.readTime}
              </span>
              <button
                type="button"
                onClick={() => setReadingArticle(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 leading-tight">
                {readingArticle.title}
              </h2>

              <div className="flex items-center gap-3 text-xs text-slate-500 pb-3 border-b border-slate-100">
                <span className="font-semibold text-slate-800">{readingArticle.author.name}</span>
                <span>&bull;</span>
                <span>Published on {readingArticle.publishedAt}</span>
              </div>

              <img
                src={readingArticle.banner}
                alt={readingArticle.title}
                className="w-full h-64 object-cover rounded-xl border border-slate-200"
              />

              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p className="font-medium text-slate-900">{readingArticle.summary}</p>
                <p>{readingArticle.content}</p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => likeArticle(readingArticle.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 font-bold rounded-xl border border-rose-200"
                >
                  <Heart className="w-4 h-4 fill-rose-600 text-rose-600" />
                  Helpful ({readingArticle.likes})
                </button>
                <span className="text-slate-400">MedNexa Clinical Editorial Board</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Video Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-950 text-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-800"
          >
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <img
                src={activeVideo.thumbnailUrl}
                alt={activeVideo.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center shadow-xl animate-pulse">
                  <Play className="w-7 h-7 fill-slate-950 ml-1" />
                </div>
                <p className="text-xs text-slate-200 font-medium bg-black/60 px-3 py-1 rounded-full">
                  Simulated Video Lecture ({activeVideo.duration})
                </p>
              </div>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-teal-400">{activeVideo.category}</span>
                  <h3 className="text-lg font-bold text-white mt-1">{activeVideo.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Presented by {activeVideo.speaker} &bull; {activeVideo.views.toLocaleString()} Views
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
                >
                  Close Player
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
