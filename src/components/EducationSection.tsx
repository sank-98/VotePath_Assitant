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
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900 p-4 rounded-t-xl text-white">
        <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
          <BookOpen size={18} />
          {language === 'hi' ? 'लोकतंत्र को समझें' : 'Understand Democracy'}
        </h2>
        
        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setLevel('simple')}
            aria-label={language === 'hi' ? 'सरल भाषा का स्तर चुनें' : 'Select Simple language level'}
            aria-pressed={level === 'simple'}
            className={`flex items-center gap-2 px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all rounded ${
              level === 'simple' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Baby size={14} />
            {language === 'hi' ? 'सरल' : 'Simple'}
          </button>
          <button
            onClick={() => setLevel('complex')}
            aria-label={language === 'hi' ? 'विस्तृत भाषा का स्तर चुनें' : 'Select Detailed language level'}
            aria-pressed={level === 'complex'}
            className={`flex items-center gap-2 px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all rounded ${
              level === 'complex' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap size={14} />
            {language === 'hi' ? 'विस्तृत' : 'Detailed'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {EDUCATION_DATA.map((item, idx) => {
          const IconComponent = icons[item.icon] || Target;
          const colors = [
            'hover:bg-blue-50 border-blue-600',
            'hover:bg-emerald-50 border-emerald-600',
            'hover:bg-amber-50 border-amber-600'
          ];
          const colorClass = colors[idx % colors.length];
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-white border-4 border-slate-900 shadow-bento p-6 rounded-xl relative group overflow-hidden transition-colors ${colorClass}`}
            >
              <div className={`p-3 inline-block rounded-lg border-2 border-slate-900 mb-4 transition-colors ${
                level === 'simple' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                <IconComponent size={24} />
              </div>
              
              <h3 className="text-xl font-black uppercase tracking-tighter mb-3 leading-tight underline decoration-dotted decoration-slate-300">
                {getTooltip(item.id) ? (
                  <Tooltip content={getTooltip(item.id)!}>
                    {item.topic[language]}
                  </Tooltip>
                ) : (
                  item.topic[language]
                )}
              </h3>

              <AnimatePresence mode="wait">
                <motion.div
                  key={level}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="min-h-[120px]"
                >
                  {level === 'simple' ? (
                    <p className="text-sm font-bold text-slate-800 leading-relaxed italic">
                      "{item.simple[language]}"
                    </p>
                  ) : (
                    <p className="text-xs font-bold text-slate-700 leading-relaxed font-mono">
                      {item.complex[language]}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Decorative background element for engineers */}
              {level === 'complex' && (
                <div className="absolute top-0 right-0 p-2 opacity-10 font-mono text-[8px] text-slate-400 pointer-events-none">
                  ID: {item.id}
                  <br />
                  TYPE: EDUCATIONAL_AFFIDAVIT
                </div>
              )}
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
                {ELECTION_FACTS[randomFact].text[language]}
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
