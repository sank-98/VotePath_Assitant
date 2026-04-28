import React from 'react';
import { 
  BarChart3, MapPin, CheckCircle2, Clock, 
  Map as MapIcon, Share2, Printer, Pin, PinOff, Trophy, Medal, Calendar
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
    <section className="mt-12 space-y-12" aria-labelledby="dashboard-title">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 bg-blue-600 rounded-full" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
              {language === 'hi' ? 'मेरा मतदान डैशबोर्ड' : 'MY VOTING DASHBOARD'}
            </h2>
          </div>
          <h2 id="dashboard-title" className="text-5xl font-black uppercase tracking-tighter font-display leading-none">{t.dashTitle}</h2>
          <p className="text-slate-500 font-bold max-w-xl">{t.dashSubtitle}</p>
        </div>
        <div className="flex items-center gap-4">
           {badge && (
             <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               whileHover={{ scale: 1.05 }}
               animate={{ scale: 1, opacity: 1 }}
               className={`flex items-center gap-4 px-6 py-3 border-4 rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-bento-sm transition-all ${badge.color}`}
             >
                <div className="animate-bounce p-1 bg-white/20 rounded-lg">{badge.icon}</div>
                <div className="flex flex-col">
                  <span className="text-[8px] opacity-60">ACHIEVEMENT</span>
                  {badge.label}
                </div>
             </motion.div>
           )}
           <div className="flex gap-3 no-print">
              <button 
                onClick={() => {
                  const text = language === 'hi' ? 'मेरा वोटपथ भारत डैशबोर्ड!' : 'My VotePath Bharat Dashboard!';
                  navigator.share?.({ title: text, url: window.location.href }).catch(() => alert(text));
                }}
                className="p-4 bg-white border-4 border-slate-900 rounded-2xl shadow-bento-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all bento-hover"
              >
                <Share2 size={24} />
              </button>
              <button 
                onClick={() => window.print()}
                className="p-4 bg-white border-4 border-slate-900 rounded-2xl shadow-bento-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all bento-hover"
              >
                <Printer size={24} />
              </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Readiness Checklist */}
        <div className="lg:col-span-12 xl:col-span-8 bg-white border-4 border-slate-900 shadow-bento-lg p-10 rounded-[3rem] bento-hover">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 border-2 border-emerald-200">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter font-display">
                {t.dashChecklist}
              </h3>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{completedCount}/{checklistItems.length} {language === 'hi' ? 'पूर्ण' : 'COMPLETED'}</span>
                <span className="text-xs font-black text-emerald-600">{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-48 h-2.5 bg-slate-100 border-2 border-slate-900 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="h-full bg-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {checklistItems.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`flex flex-col gap-4 p-6 rounded-[2rem] border-4 text-left transition-all duration-300 relative overflow-hidden group/item ${
                  checklist[item.id] 
                    ? 'bg-emerald-50 border-emerald-600 shadow-none translate-y-1' 
                    : 'bg-white border-slate-100 hover:border-slate-900 shadow-bento-sm hover:shadow-none'
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl border-4 flex items-center justify-center transition-all ${
                  checklist[item.id] ? 'bg-emerald-600 border-emerald-700 text-white' : 'bg-white border-slate-100 text-slate-200'
                }`}>
                  {checklist[item.id] ? <CheckCircle2 size={18} /> : <div className="w-2.5 h-2.5 rounded-full bg-slate-100" />}
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className={`text-xs font-black uppercase tracking-tight leading-tight transition-colors ${
                    checklist[item.id] ? 'text-emerald-900' : 'text-slate-500'
                  }`}>
                    {item.label}
                  </span>
                  
                  {item.id === 'downloadSlip' && checklist[item.id] && (
                    <motion.a 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      href="https://voters.eci.gov.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-[9px] text-blue-700 bg-blue-100 px-3 py-1 rounded-full font-black border-2 border-blue-200 hover:bg-blue-200 w-fit uppercase tracking-tighter"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {language === 'hi' ? 'आधिकारिक पोर्टल खोलें' : 'Open Portal'}
                    </motion.a>
                  )}
                </div>

                {checklist[item.id] && (
                  <div className="absolute top-0 right-0 p-4 opacity-5 scale-[2] rotate-12">
                    <CheckCircle2 size={64} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Pinned Station */}
        <div className="lg:col-span-12 xl:col-span-4 bg-amber-50 border-4 border-slate-900 shadow-bento-lg p-10 rounded-[3rem] relative overflow-hidden bento-hover">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-amber-200 rounded-2xl flex items-center justify-center text-amber-700 border-2 border-amber-300">
              <MapPin size={28} />
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tighter font-display">
              {t.dashPinnedStation}
            </h3>
          </div>

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
