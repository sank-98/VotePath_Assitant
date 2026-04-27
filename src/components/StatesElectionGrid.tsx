import React, { useState, useMemo, useEffect } from 'react';
import { INDIA_ELECTION_DATA, StateElectionData } from '../data/indiaElectionData';
import { Language, translations } from '../lib/translations';
import { 
  Calendar, MapPin, Search, AlertCircle, CheckSquare, Square, X, 
  ArrowLeft, BarChart2, Twitter, Facebook, MessageCircle, History, 
  Bell, BellOff 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { followState, unfollowState, subscribeToFollowing } from '../lib/firebase';

interface StatesElectionGridProps {
  language: Language;
}

export default function StatesElectionGrid({ language }: StatesElectionGridProps) {
  const t = translations[language];
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState<number | 'all'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [followedIds, setFollowedIds] = useState<string[]>([]);
  const [view, setView] = useState<'grid' | 'comparison'>('grid');

  useEffect(() => {
    const unsub = subscribeToFollowing((ids) => {
      setFollowedIds(ids);
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  const toggleFollow = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (followedIds.includes(id)) {
      await unfollowState(id);
    } else {
      await followState(id);
    }
  };

  const states = Object.values(INDIA_ELECTION_DATA);

  const availableYears = useMemo(() => {
    const years = states.map(s => s.nextElectionYear);
    return Array.from(new Set(years)).sort();
  }, [states]);

  const filteredStates = useMemo(() => {
    return states.filter(state => {
      const nameMatch = (language === 'hi' ? state.hindiName : state.name)
        .toLowerCase()
        .includes(search.toLowerCase()) || 
        state.id.toLowerCase().includes(search.toLowerCase());
      
      const yearMatch = yearFilter === 'all' || state.nextElectionYear === yearFilter;
      
      return nameMatch && yearMatch;
    }).sort((a, b) => a.nextElectionYear - b.nextElectionYear);
  }, [states, search, yearFilter, language]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('live') || s.includes('polling')) return 'bg-red-100 text-red-700 border-red-200';
    if (s.includes('pre-election') || s.includes('new')) return 'bg-amber-100 text-amber-700 border-amber-200';
    if (s.includes('stable') || s.includes('mid-term')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const selectedStates = useMemo(() => {
    return states.filter(s => selectedIds.includes(s.id));
  }, [states, selectedIds]);

  const shareState = (state: StateElectionData, platform: 'twitter' | 'facebook' | 'whatsapp') => {
    const stateName = language === 'hi' ? state.hindiName : state.name;
    const nextElection = state.nextElection[language];
    const status = state.status[language];
    const text = `${stateName} Elections: Status - ${status}, Next Election - ${nextElection}. via #VotePathIndia`;
    const url = window.location.href;

    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + '\n' + url)}`, '_blank');
    }
  };

  const getCountdown = (year: number) => {
    const currentYear = new Date().getFullYear();
    const diff = year - currentYear;
    if (diff === 0) return language === 'hi' ? 'इस वर्ष' : 'THIS YEAR';
    if (diff < 0) return language === 'hi' ? 'संपन्न' : 'COMPLETED';
    return `${diff} ${language === 'hi' ? 'साल बाकी' : 'YEARS TO GO'}`;
  };

  return (
    <div className="bg-white border-4 border-slate-900 shadow-bento rounded-2xl overflow-hidden mt-12" id="states-explorer">
      {/* Header Section */}
      <div className="bg-slate-900 p-6 border-b-4 border-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl border-2 border-white/20 shadow-lg transition-colors ${view === 'comparison' ? 'bg-blue-600' : 'bg-red-600'}`}>
              {view === 'comparison' ? <BarChart2 size={28} className="text-white" /> : <Calendar size={28} className="text-white" />}
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none mb-1">
                {view === 'grid' ? t.statesGridTitle : t.comparisonView}
              </h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                {view === 'grid' ? `${states.length} ${t.statesTracked}` : `${selectedStates.length} ${t.selectedCount}`}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {view === 'grid' ? (
              <>
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" size={16} />
                  <input 
                    type="text"
                    placeholder={t.searchStates}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2.5 bg-slate-800 border-2 border-slate-700 text-white text-sm font-bold rounded-xl focus:outline-none focus:border-red-500 w-full sm:w-64 transition-all"
                  />
                </div>
                
                {selectedIds.length > 0 && (
                  <button 
                    onClick={() => setView('comparison')}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-xl border-2 border-blue-500 shadow-lg hover:bg-blue-500 transition-all"
                  >
                    <BarChart2 size={16} />
                    {t.compareStates}
                  </button>
                )}
              </>
            ) : (
              <button 
                onClick={() => setView('grid')}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-700 text-white text-xs font-black uppercase tracking-widest rounded-xl border-2 border-slate-600 shadow-lg hover:bg-slate-600 transition-all"
              >
                <ArrowLeft size={16} />
                {t.backToGrid}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-6 min-h-[400px]">
        <AnimatePresence mode="wait">
          {view === 'grid' ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Year Filter Bar */}
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border-2 border-slate-200 overflow-x-auto">
                <button 
                  onClick={() => setYearFilter('all')}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    yearFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {t.allYears}
                </button>
                {availableYears.map(year => (
                  <button 
                    key={year}
                    onClick={() => setYearFilter(year)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                      yearFilter === year ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {year}
                  </button>
                ))}
                
                {selectedIds.length > 0 && (
                  <div className="ml-auto flex items-center gap-2 pl-4 border-l-2 border-slate-200">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                      {selectedIds.length}/4 {t.selectedCount}
                    </span>
                    <button 
                      onClick={() => setSelectedIds([])}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                      title={t.clearSelection}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {filteredStates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStates.map((state) => {
                    const isSelected = selectedIds.includes(state.id);
                    return (
                      <motion.div 
                        layout
                        key={state.id}
                        className={`group relative flex flex-col p-6 bg-white border-2 transition-all rounded-2xl overflow-hidden cursor-pointer ${
                          isSelected ? 'border-blue-600 ring-4 ring-blue-500/10' : 'border-slate-900 shadow-bento-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none'
                        }`}
                        onClick={() => toggleSelection(state.id)}
                      >
                        {/* Comparison Selector */}
                        <div className="absolute top-4 right-4 z-20 flex gap-2">
                          <button
                            onClick={(e) => toggleFollow(e, state.id)}
                            className={`p-1.5 rounded-lg border-2 transition-all ${
                              followedIds.includes(state.id) 
                                ? 'bg-amber-100 border-amber-900 text-amber-900' 
                                : 'bg-white border-slate-200 text-slate-300 hover:border-slate-900 hover:text-slate-900 shadow-sm'
                            }`}
                            title={followedIds.includes(state.id) ? "Stop following" : "Follow for updates"}
                          >
                            {followedIds.includes(state.id) ? <Bell size={16} fill="currentColor" /> : <BellOff size={16} />}
                          </button>
                          {isSelected ? (
                            <CheckSquare className="text-blue-600" size={24} />
                          ) : (
                            <Square className="text-slate-200 group-hover:text-slate-400" size={24} />
                          )}
                        </div>

                        <div className="absolute top-0 left-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                          <MapPin size={100} className="rotate-12" />
                        </div>

                        <div className="relative z-10 flex flex-col h-full">
                          <div className="flex justify-between items-start gap-4 mb-6">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-1">
                                {state.id}
                              </span>
                              <h3 className="text-2xl font-black tracking-tighter uppercase text-slate-900 leading-tight">
                                {language === 'hi' ? state.hindiName : state.name}
                              </h3>
                            </div>
                          </div>

                          <div className="space-y-4 mb-6">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                <AlertCircle size={10} />
                                {t.stateStatus}
                              </div>
                              <div className={`px-3 py-1.5 rounded-lg border-2 text-[11px] font-black uppercase tracking-wider text-center ${getStatusColor(state.status.en)}`}>
                                {state.status[language]}
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                <History size={10} />
                                {t.stateNext}
                              </div>
                              <div className="flex items-center justify-between gap-4">
                                <div className="text-xl font-black text-slate-900">
                                  {state.nextElection[language]}
                                </div>
                                <div className="px-2 py-1 bg-blue-50 text-blue-700 text-[8px] font-black uppercase rounded border border-blue-100">
                                  {getCountdown(state.nextElectionYear)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4 border-4 border-slate-50">
                    <Search size={32} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                    {t.noStatesFound}
                  </h3>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="comparison"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="overflow-x-auto pb-4"
            >
              <div className="flex gap-6 min-w-max md:min-w-0 md:grid md:grid-cols-2 lg:grid-cols-4">
                {selectedStates.map(state => (
                  <div key={state.id} className="w-[300px] md:w-auto bg-white border-4 border-slate-900 rounded-2xl p-6 shadow-bento-sm relative overflow-hidden flex flex-col">
                    <button 
                      onClick={() => toggleSelection(state.id)}
                      className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-600 rounded-lg transition-colors z-10"
                    >
                      <X size={16} />
                    </button>
                    
                    <div className="mb-4">
                      <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-1">
                        {state.id}
                      </span>
                      <h3 className="text-3xl font-black tracking-tighter uppercase text-slate-900 leading-tight">
                        {language === 'hi' ? state.hindiName : state.name}
                      </h3>
                    </div>

                    <div className="flex gap-2 mb-6">
                      <button 
                        onClick={() => shareState(state, 'twitter')}
                        title={t.shareTwitter}
                        className="p-2 bg-slate-50 border-2 border-slate-200 hover:border-slate-900 transition-all rounded-lg"
                      >
                        <Twitter size={14} className="text-[#1DA1F2]" />
                      </button>
                      <button 
                        onClick={() => shareState(state, 'facebook')}
                        title={t.shareFacebook}
                        className="p-2 bg-slate-50 border-2 border-slate-200 hover:border-slate-900 transition-all rounded-lg"
                      >
                        <Facebook size={14} className="text-[#1877F2]" />
                      </button>
                      <button 
                        onClick={() => shareState(state, 'whatsapp')}
                        title={t.shareWhatsApp}
                        className="p-2 bg-slate-50 border-2 border-slate-200 hover:border-slate-900 transition-all rounded-lg"
                      >
                        <MessageCircle size={14} className="text-[#25D366]" />
                      </button>
                    </div>

                    <div className="space-y-8 flex-1">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <AlertCircle size={14} />
                          {t.stateStatus}
                        </div>
                        <div className={`px-4 py-3 rounded-xl border-4 text-xs font-black uppercase tracking-wider text-center ${getStatusColor(state.status.en)}`}>
                          {state.status[language]}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <History size={14} />
                          {t.stateNext}
                        </div>
                        <div className="text-3xl font-black text-blue-700 bg-blue-50/50 p-4 rounded-xl border-2 border-blue-100 text-center">
                          {state.nextElection[language]}
                        </div>
                        <div className="text-center text-[10px] font-black text-slate-400 uppercase">
                          {state.nextElectionYear}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <CheckSquare size={14} />
                          {t.stateKeyMilestones}
                        </div>
                        <div className="space-y-2">
                          {state.timeline[language].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 border-2 border-slate-100 rounded-lg text-[11px] font-bold text-slate-700">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

