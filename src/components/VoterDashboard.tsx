import React from 'react';
import { 
  BarChart3, MapPin, CheckCircle2, Clock, 
  Map as MapIcon, ArrowRight, Share2, Printer, Pin, PinOff, Trophy, Medal, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, translations } from '../lib/translations';
import { useVoterData } from '../hooks/useVoterData';
import GoogleMapEmbed from './GoogleMapEmbed';
import { handleAddToCalendar } from '../lib/calendar';

interface VoterDashboardProps {
  language: Language;
}

const VoterDashboard: React.FC<VoterDashboardProps> = ({ language }) => {
  const t = translations[language];
  const { 
    followedStates, 
    checklist, 
    pinnedStation, 
    toggleChecklist, 
    unpinStation 
  } = useVoterData();

  const checklistItems = [
    { id: 'voterId', label: t.cl_voterId },
    { id: 'checkList', label: t.cl_checkList },
    { id: 'location', label: t.cl_location },
    { id: 'idProof', label: t.cl_idProof },
    { id: 'downloadSlip', label: t.cl_downloadSlip },
  ];

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const progressPercent = (completedCount / checklistItems.length) * 100;

  const getBadge = () => {
    if (completedCount === checklistItems.length) return { level: 'gold', label: t.dashBadgeLevels.gold, icon: <Trophy className="text-amber-500" />, color: 'bg-amber-50 border-amber-500 text-amber-900' };
    if (completedCount >= 3) return { level: 'silver', label: t.dashBadgeLevels.silver, icon: <Medal className="text-blue-500" />, color: 'bg-blue-50 border-blue-500 text-blue-900' };
    if (completedCount >= 1) return { level: 'bronze', label: t.dashBadgeLevels.bronze, icon: <Medal className="text-orange-500" />, color: 'bg-orange-50 border-orange-500 text-orange-900' };
    return null;
  };

  const badge = getBadge();

  return (
    <section className="mt-12 space-y-8" aria-labelledby="dashboard-title">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 id="dashboard-title" className="text-4xl font-black uppercase tracking-tighter">{t.dashTitle}</h2>
          <p className="text-slate-600 font-bold">{t.dashSubtitle}</p>
        </div>
        <div className="flex items-center gap-4">
           {badge && (
             <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className={`flex items-center gap-3 px-4 py-2 border-2 rounded-xl font-black uppercase text-xs tracking-widest shadow-bento-sm ${badge.color}`}
             >
                <div className="animate-bounce">{badge.icon}</div>
                {badge.label}
             </motion.div>
           )}
           <div className="flex gap-2 no-print">
              <button 
                onClick={() => {
                  const text = language === 'hi' ? 'मेरा वोटपथ भारत डैशबोर्ड!' : 'My VotePath Bharat Dashboard!';
                  navigator.share?.({ title: text, url: window.location.href }).catch(() => alert(text));
                }}
                className="p-3 bg-white border-2 border-slate-900 rounded-xl shadow-bento-sm hover:translate-y-[-2px] transition-all"
              >
                <Share2 size={20} />
              </button>
              <button 
                onClick={() => window.print()}
                className="p-3 bg-white border-2 border-slate-900 rounded-xl shadow-bento-sm hover:translate-y-[-2px] transition-all"
              >
                <Printer size={20} />
              </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Readiness Checklist */}
        <div className="lg:col-span-2 bg-white border-4 border-slate-900 shadow-bento p-8 rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
              <CheckCircle2 className="text-emerald-600" />
              {t.dashChecklist}
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{completedCount}/{checklistItems.length} {language === 'hi' ? 'पूर्ण' : 'COMPLETED'}</span>
              <div className="w-32 h-3 bg-slate-100 border-2 border-slate-900 rounded-full p-0.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {checklistItems.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all group ${
                  checklist[item.id] 
                    ? 'bg-emerald-50 border-emerald-900 text-emerald-900' 
                    : 'bg-white border-slate-200 hover:border-slate-900 text-slate-600'
                }`}
              >
                <div className={`shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                  checklist[item.id] ? 'bg-emerald-600 border-emerald-900 text-white' : 'border-slate-200 group-hover:border-slate-900'
                }`}>
                  {checklist[item.id] && <CheckCircle2 size={14} />}
                </div>
                <span className="text-sm font-black uppercase tracking-tight">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pinned Station */}
        <div className="bg-amber-50 border-4 border-slate-900 shadow-bento p-8 rounded-2xl relative overflow-hidden">
          <h3 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-2">
            <Pin className="text-amber-600 rotate-45" />
            {t.dashPinnedStation}
          </h3>

          <AnimatePresence mode="wait">
            {pinnedStation ? (
              <motion.div 
                key="pinned"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                <div className="bg-white border-2 border-slate-900 p-6 rounded-2xl shadow-bento-sm">
                  <div className="h-48 mb-6">
                    <GoogleMapEmbed address={pinnedStation.address} className="h-full" />
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="text-amber-600" size={20} />
                    <h4 className="text-lg font-black uppercase tracking-tighter leading-tight">{pinnedStation.name}</h4>
                  </div>
                  <p className="text-sm font-bold text-slate-600 mb-6">{pinnedStation.address}</p>
                  
                  <div className="flex flex-col gap-2">
                    <button className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-colors">
                      <MapIcon size={16} /> 
                      {language === 'hi' ? 'रास्ता देखें' : 'View Map'}
                    </button>
                    <button 
                      onClick={() => unpinStation()}
                      className="flex items-center justify-center gap-2 w-full py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <PinOff size={12} /> {t.dashUnpinBooth}
                    </button>
                  </div>
                </div>
                
                <div className="p-4 bg-amber-100/50 border-2 border-amber-200 border-dashed rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock size={14} className="text-amber-700" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">Polling Hours</span>
                  </div>
                  <p className="text-sm font-black text-amber-900">07:00 AM — 06:00 PM</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center space-y-4"
              >
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-300">
                  <Pin size={32} />
                </div>
                <p className="text-xs font-bold text-amber-900/60 uppercase tracking-widest leading-relaxed">
                  {t.dashNoStation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Followed States Quick Feed */}
      <div className="bg-white border-4 border-slate-900 shadow-bento rounded-2xl overflow-hidden">
        <div className="p-6 border-b-4 border-slate-900 bg-slate-50 flex items-center justify-between">
          <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <BarChart3 className="text-blue-600" />
            {t.dashFollowedStates}
          </h3>
          <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase rounded shadow-bento-sm">
            {followedStates.length} {language === 'hi' ? 'राज्य' : 'STATES'}
          </span>
        </div>

        <div className="p-8">
          {followedStates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               {followedStates.map((state) => (
                <div key={state.id} className="p-5 border-2 border-slate-900 rounded-xl shadow-bento-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group">
                   <div className="flex items-center justify-between mb-3">
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{state.id}</span>
                     <motion.div 
                       animate={{ scale: [1, 1.2, 1] }} 
                       transition={{ repeat: Infinity, duration: 4 }}
                       className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
                     />
                   </div>
                   <h4 className="text-lg font-black uppercase tracking-tighter mb-1">{language === 'hi' ? state.hindiName : state.name}</h4>
                   <p className="text-xs font-bold text-blue-600 mb-4">{state.nextElection[language]}</p>
                   <button 
                     onClick={() => {
                        const name = language === 'hi' ? state.hindiName : state.name;
                        const date = state.nextElection[language] || state.nextElection.en;
                        handleAddToCalendar(name, date, language);
                     }}
                     className="w-full py-2 border-2 border-slate-900 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 group-hover:bg-slate-900 group-hover:text-white transition-all"
                   >
                     {language === 'hi' ? 'कैलेंडर में जोड़ें' : 'Add to Calendar'} <Calendar size={12} />
                   </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                <BarChart3 size={32} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest max-w-xs transition-all">
                {t.dashNoFollowing}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VoterDashboard;
