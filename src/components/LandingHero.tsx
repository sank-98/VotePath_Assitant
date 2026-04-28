import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Shield, Users, ArrowRight } from 'lucide-react';
import { Language } from '../lib/translations';

interface LandingHeroProps {
  language: Language;
  onGetStarted: () => void;
}

const LandingHero: React.FC<LandingHeroProps> = ({ language, onGetStarted }) => {

  return (
    <div className="bg-slate-900 border-4 border-slate-900 rounded-[3rem] p-10 md:p-16 lg:p-24 text-white relative overflow-hidden shadow-bento-lg group">
      {/* Dynamic Background Elements */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto space-y-10">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="inline-flex items-center gap-3 px-6 py-2 bg-blue-500/10 border-2 border-blue-400/20 rounded-full text-[11px] font-black uppercase tracking-[0.4em] text-blue-400"
        >
           <Shield size={16} className="animate-pulse" />
           {language === 'hi' ? 'सत्यापित चुनावी मार्गदर्शन' : 'VERIFIED ELECTORAL GUIDANCE'}
        </motion.div>

        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl lg:text-[7rem] font-black uppercase tracking-tighter leading-[0.85] font-display"
          >
            {language === 'hi' ? 'वोटपथ भारत' : 'VOTEPATH'}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400">
              {language === 'hi' ? 'प्रजातंत्र' : 'BHARAT'}
            </span>
            <span className="text-white">.</span>
          </motion.h1>
        </div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl md:text-2xl text-slate-400 font-bold max-w-3xl leading-snug font-sans tracking-tight"
        >
          {language === 'hi' 
            ? 'निर्णय लेने के लिए सशक्त बने। हमारा व्यक्तिगत एआई सहायक आपको आपकी प्राथमिकताओं के आधार पर सर्वोत्तम उम्मीदवारों और चुनावी प्रक्रियाओं से जोड़ता है।'
            : 'Sovereignty reimagined. Our personalized AI engine bridges the gap between citizens and candidates through transparent, data-driven insights.'}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-6 pt-6 items-center"
        >
           <button 
             onClick={onGetStarted}
             className="px-10 py-5 bg-white text-slate-900 rounded-[2rem] font-black uppercase tracking-[0.1em] text-sm hover:bg-blue-500 hover:text-white transition-all shadow-bento group relative overflow-hidden"
           >
             <span className="relative z-10">
               {language === 'hi' ? 'अभी शुरू करें' : 'GET STARTED NOW'}
               <ArrowRight className="inline-block ml-2 group-hover:translate-x-2 transition-transform" size={20} />
             </span>
           </button>

           <div className="flex items-center gap-4 pl-4 bg-white/5 px-6 py-3 rounded-full border border-white/10">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                    <Users size={14} className="text-slate-500" />
                  </div>
                ))}
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                {language === 'hi' ? '१०,०००+ सक्रिय नागरिक' : '10,000+ ACTIVE CITIZENS'}
              </div>
           </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full pt-16 border-t border-white/5">
          <div className="flex flex-col items-center gap-4 group/item">
             <div className="p-3 bg-white/5 rounded-2xl group-hover/item:bg-blue-500/20 transition-colors">
              <CheckCircle2 className="text-blue-500" size={24} />
             </div>
             <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{language === 'hi' ? 'स्पष्ट मिलान' : 'EXPLAINABLE MATCH'}</div>
          </div>
          <div className="flex flex-col items-center gap-4 group/item">
             <div className="p-3 bg-white/5 rounded-2xl group-hover/item:bg-emerald-500/20 transition-colors">
              <CheckCircle2 className="text-emerald-500" size={24} />
             </div>
             <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{language === 'hi' ? 'लाइव रुझान' : 'LIVE TRENDS'}</div>
          </div>
          <div className="flex flex-col items-center gap-4 group/item">
             <div className="p-3 bg-white/5 rounded-2xl group-hover/item:bg-amber-500/20 transition-colors">
              <CheckCircle2 className="text-amber-500" size={24} />
             </div>
             <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{language === 'hi' ? 'सुरक्षित डेटा' : 'SECURE DATA'}</div>
          </div>
          <div className="flex flex-col items-center gap-4 group/item">
             <div className="p-3 bg-white/5 rounded-2xl group-hover/item:bg-purple-500/20 transition-colors">
              <CheckCircle2 className="text-purple-500" size={24} />
             </div>
             <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{language === 'hi' ? 'सत्यापित स्रोत' : 'VERIFIED SOURCES'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingHero;
