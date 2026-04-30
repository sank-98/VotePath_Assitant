import React, { useState } from 'react';
import { EDUCATION_DATA } from '../data/educationData';
import { ELECTION_FACTS } from '../data/electionFacts';
import { Language, translations } from '../lib/translations';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Settings, Users, BookOpen, GraduationCap, Baby, MapPin, ListChecks, DoorOpen, UserCog, Gavel, Ban, Trophy, Cpu, FileText, Sparkles, RefreshCw, LucideIcon } from 'lucide-react';
import Tooltip from './ui/Tooltip';

interface EducationSectionProps {
  language: Language;
}

export default function EducationSection({ language }: EducationSectionProps) {
  const [level, setLevel] = useState<'simple' | 'complex'>('simple');
  const [randomFact, setRandomFact] = useState<number>(() => 
    Math.floor(Math.random() * ELECTION_FACTS.length)
  );
  const t = translations[language];

  const refreshFact = () => {
    let next;
    do {
      next = Math.floor(Math.random() * ELECTION_FACTS.length);
    } while (next === randomFact && ELECTION_FACTS.length > 1);
    setRandomFact(next);
  };

  const getTooltip = (id: string) => {
    switch (id) {
      case 'evm': return t.evmTooltip;
      case 'vvpat': return t.vvpatTooltip;
      case 'mcc': return t.mccTooltip;
      default: return null;
    }
  };

  const icons: Record<string, LucideIcon> = {
    Target,
    Settings,
    Users,
    MapPin,
    ListChecks,
    DoorOpen,
    UserCog,
    Gavel,
    Ban,
    Trophy,
    Cpu,
    FileText
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-slate-900 px-8 py-6 rounded-[2rem] text-white shadow-bento-lg border-4 border-slate-900">
        <div className="space-y-1 mb-4 md:mb-0">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 flex items-center gap-2">
            <BookOpen size={14} />
            {language === 'hi' ? 'सीखें और समझें' : 'LEARN & UNDERSTAND'}
          </h2>
          <h2 className="text-2xl font-black uppercase tracking-tighter font-display">
            {language === 'hi' ? 'लोकतंत्र की शक्ति' : 'Democracy Power'}
          </h2>
        </div>
        
        <div className="flex bg-slate-800 p-1.5 rounded-2xl border-4 border-slate-700 shadow-inner">
          <button
            onClick={() => setLevel('simple')}
            aria-label={language === 'hi' ? 'सरल भाषा का स्तर चुनें' : 'Select Simple language level'}
            className={`flex items-center gap-2 px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${
              level === 'simple' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Baby size={14} />
            {language === 'hi' ? 'सरल' : 'Simple'}
          </button>
          <button
            onClick={() => setLevel('complex')}
            aria-label={language === 'hi' ? 'विस्तृत भाषा का स्तर चुनें' : 'Select Detailed language level'}
            className={`flex items-center gap-2 px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${
              level === 'complex' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <GraduationCap size={14} />
            {language === 'hi' ? 'विस्तृत' : 'Detailed'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {EDUCATION_DATA.map((item, idx) => {
          const IconComponent = icons[item.icon] || Target;
          const colors = [
            'border-blue-600 group-hover:bg-blue-50/50',
            'border-emerald-600 group-hover:bg-emerald-50/50',
            'border-amber-500 group-hover:bg-amber-50/50',
            'border-purple-600 group-hover:bg-purple-50/50'
          ];
          const colorClass = colors[idx % colors.length];
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-white border-4 border-slate-900 shadow-bento p-8 rounded-[2rem] relative group overflow-hidden transition-all duration-300 bento-hover ${colorClass}`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-bento-sm group-hover:scale-110 transition-transform">
                  <IconComponent size={24} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter leading-tight font-display text-slate-900">
                  {getTooltip(item.id) ? (
                    <Tooltip content={getTooltip(item.id)!}>
                      <span className="underline decoration-slate-200 decoration-4 underline-offset-4 cursor-help">
                        {item.topic[language]}
                      </span>
                    </Tooltip>
                  ) : (
                    item.topic[language]
                  )}
                </h3>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={level}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="min-h-[100px]"
                >
                  {level === 'simple' ? (
                    <p className="text-sm font-bold text-slate-800 leading-relaxed italic">
                      {item.simple[language]}
                    </p>
                  ) : (
                    <p className="text-[13px] font-bold text-slate-700 leading-relaxed font-mono bg-slate-50 p-4 rounded-xl border-2 border-slate-100">
                      {item.complex[language]}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[8px] font-black text-slate-300 tracking-[0.3em] uppercase">VERIFIED_PROCEDURE</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Did You Know? Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-12 bg-slate-900 border-4 border-slate-900 shadow-bento rounded-2xl p-6 relative overflow-hidden group"
      >
        {/* Background Decoration */}
        <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12 pointer-events-none group-hover:rotate-45 transition-transform duration-700">
          <Sparkles size={120} className="text-white" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500 rounded-lg shadow-lg">
                <Sparkles size={20} className="text-slate-900" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                {language === 'hi' ? 'क्या आप जानते हैं?' : 'Did You Know?'}
              </h3>
            </div>
            
            <button 
              onClick={refreshFact}
              className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all flex items-center gap-2 group/btn"
              title={language === 'hi' ? 'अगला तथ्य' : 'Next Fact'}
            >
              <RefreshCw size={16} className="group-hover/btn:rotate-180 transition-transform duration-500" />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">
                {language === 'hi' ? 'अगला' : 'Next'}
              </span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={randomFact}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="min-h-[60px] flex items-center"
            >
              <p className="text-lg md:text-xl font-bold text-amber-50 leading-tight">
                {ELECTION_FACTS[randomFact]?.text[language]}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
              {language === 'hi' ? 'निर्वाचन आयोग के रोचक तथ्य' : 'Election Commission Fun Facts'}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
