import React from 'react';
import { Globe2, Contrast, Languages } from "lucide-react";
import { motion } from 'motion/react';
import { Language, TranslationType } from '../lib/translations';

interface HeaderProps {
  language: Language;
  t: TranslationType;
  highContrast: boolean;
  toggleHighContrast: () => void;
  toggleLanguage: () => void;
}

const Header: React.FC<HeaderProps> = ({ language, t, highContrast, toggleHighContrast, toggleLanguage }) => {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-4 border-slate-900 pb-8 relative overflow-hidden" role="banner">
      <div className="space-y-2 relative z-10">
        <div className="flex items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white text-[10px] font-black tracking-widest uppercase rounded shadow-bento-sm">
            <Globe2 size={12} aria-hidden="true" />
            {t.cycle}
          </div>
        </div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none"
        >
          {t.appName.split(' ')[0]} <br className="hidden md:block" />
          <span className="text-blue-700 block md:inline">{t.appName.split(' ')[1]}</span>
        </motion.h1>
        <p className="text-lg md:text-xl font-bold text-slate-600 max-w-xl">
          {t.appTagline}
        </p>
      </div>

      <div className="flex flex-col items-end gap-4 relative z-10">
        <div className="flex gap-4">
          <button 
            onClick={toggleHighContrast}
            aria-label={highContrast ? t.normalContrast : t.highContrast}
            className="flex items-center gap-3 px-6 py-3 bg-white border-4 border-slate-900 shadow-bento hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group focus:ring-4 focus:ring-amber-500/20 outline-none"
          >
            <div className={`p-2 rounded transition-colors ${highContrast ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 group-hover:bg-slate-900 group-hover:text-white'}`}>
              <Contrast size={20} />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Accessibility</div>
              <div className="text-sm font-black uppercase tracking-tighter">{highContrast ? t.normalContrast : t.highContrast}</div>
            </div>
          </button>

          <button 
            onClick={toggleLanguage}
            aria-label={`${t.switchLanguage} to ${language === 'hi' ? 'English' : 'Hindi'}`}
            className="flex items-center gap-3 px-6 py-3 bg-white border-4 border-slate-900 shadow-bento hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group focus:ring-4 focus:ring-blue-500/20 outline-none"
          >
            <div className="p-2 bg-blue-100 rounded group-hover:bg-blue-700 group-hover:text-white transition-colors">
              <Languages size={20} />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{t.switchLanguage}</div>
              <div className="text-sm font-black uppercase tracking-tighter">{t.langName}</div>
            </div>
          </button>
        </div>
        <div className="hidden lg:grid grid-cols-2 gap-4" aria-hidden="true">
          <div className="p-4 bg-white border-2 border-slate-900 shadow-bento-sm rounded-lg flex flex-col items-center">
            <span className="text-2xl font-black leading-none">968M+</span>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">{t.votersLabel}</span>
          </div>
          <div className="p-4 bg-white border-2 border-slate-900 shadow-bento-sm rounded-lg flex flex-col items-center">
            <span className="text-2xl font-black leading-none text-emerald-600">1M+</span>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">{t.pollingBoothsLabel}</span>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-5 pointer-events-none" aria-hidden="true">
        <Globe2 size={400} />
      </div>
    </header>
  );
};

export default Header;
