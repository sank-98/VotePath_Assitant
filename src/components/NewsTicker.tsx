import React from 'react';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';
import { TranslationType } from '../lib/translations';

interface NewsTickerProps {
  t: TranslationType;
}

const NewsTicker: React.FC<NewsTickerProps> = ({ t }) => {
  return (
    <div className="w-full bg-slate-900 text-white py-2 overflow-hidden border-b-4 border-slate-900 group">
      <div className="flex items-center">
        <div className="bg-red-600 px-3 py-1 flex items-center gap-1.5 z-10 shrink-0 font-black text-[10px] tracking-widest animate-pulse border-r-2 border-slate-900">
           <Zap size={10} fill="currentColor" />
           {t.newsLive}
        </div>
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="flex items-center gap-12 whitespace-nowrap px-8"
        >
          {t.newsUpdates.map((news, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
              <span className="text-[11px] font-black uppercase tracking-tight">{news}</span>
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {t.newsUpdates.map((news, i) => (
            <div key={`dup-${i}`} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
              <span className="text-[11px] font-black uppercase tracking-tight">{news}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default NewsTicker;
