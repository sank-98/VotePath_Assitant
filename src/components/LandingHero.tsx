import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Shield, Users, ArrowRight } from 'lucide-react';
import { Language, translations } from '../lib/translations';

interface LandingHeroProps {
  language: Language;
  onGetStarted: () => void;
}

const LandingHero: React.FC<LandingHeroProps> = ({ language, onGetStarted }) => {
  const t = translations[language];

  return (
    <div className="bg-slate-900 border-4 border-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
      {/* Decorative Circles */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-900/50 border border-blue-400/30 rounded-full text-[10px] font-black uppercase tracking-[0.2em]"
        >
           <Shield size={14} className="text-blue-400" />
           {language === 'hi' ? 'सत्यापित चुनावी मार्गदर्शन' : 'VERIFIED ELECTORAL GUIDANCE'}
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none"
        >
          {language === 'hi' ? 'वोटपथ भारत' : 'VOTEPATH BHARAT'}
          <span className="block text-blue-500">.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-slate-400 font-bold max-w-2xl leading-relaxed"
        >
          {language === 'hi' 
            ? 'निर्णय लेने के लिए सशक्त बने। हमारा व्यक्तिगत एआई सहायक आपको आपकी प्राथमिकताओं के आधार पर सर्वोत्तम उम्मीदवारों और चुनावी प्रक्रियाओं से जोड़ता है।'
            : 'Be empowered to decide. Our personalized AI assistant matches you with candidates and electoral processes based on your specific values and priorities.'}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 pt-4"
        >
           <button 
             onClick={onGetStarted}
             className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-blue-500 hover:text-white transition-all shadow-bento group"
           >
             {language === 'hi' ? 'शुरू करें' : 'GET STARTED'}
             <ArrowRight className="inline-block ml-2 group-hover:translate-x-2 transition-transform" size={18} />
           </button>
           <div className="flex -space-x-4 items-center pl-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                  <Users size={20} className="text-slate-600" />
                </div>
              ))}
              <div className="pl-6 text-xs font-black uppercase tracking-widest text-slate-500">
                {language === 'hi' ? '१०,०००+ भारतीय नागरिक' : '10,000+ INDIAN CITIZENS'}
              </div>
           </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full pt-12 border-t border-slate-800">
          <div className="flex flex-col items-center gap-3">
             <CheckCircle2 className="text-emerald-500" size={24} />
             <div className="text-xs font-black uppercase tracking-widest leading-none">Explainable Matches</div>
          </div>
          <div className="flex flex-col items-center gap-3">
             <CheckCircle2 className="text-emerald-500" size={24} />
             <div className="text-xs font-black uppercase tracking-widest leading-none">Real-time Trends</div>
          </div>
          <div className="flex flex-col items-center gap-3">
             <CheckCircle2 className="text-emerald-500" size={24} />
             <div className="text-xs font-black uppercase tracking-widest leading-none">Secure & Verified</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingHero;
