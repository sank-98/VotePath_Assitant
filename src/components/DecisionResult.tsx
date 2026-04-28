import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  candidateName: string;
  party: string;
  confidence: number;
  isTopMatch?: boolean;
}

/**
 * PRODUCTION COMPONENT: DecisionResult
 * 
 * Displays an individual matching result with strict accessibility and 
 * clear visual hierarchy.
 */
export const DecisionResult: React.FC<Props> = ({ candidateName, party, confidence, isTopMatch }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-slate-600 bg-slate-50 border-slate-200';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      role="listitem"
      className={`p-4 border-2 border-slate-900 rounded-2xl flex items-center justify-between gap-4 transition-all ${
        isTopMatch ? 'bg-blue-50 shadow-bento-sm scale-[1.02]' : 'bg-white'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full border-2 border-slate-900 ${isTopMatch ? 'bg-blue-600 text-white' : 'bg-white text-slate-400'}`}>
          {isTopMatch ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
        </div>
        <div>
          <h4 className="font-black uppercase tracking-tighter text-slate-900 leading-none">{candidateName}</h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{party}</p>
        </div>
      </div>

      <div 
        className={`px-3 py-1 rounded-full border-2 font-black text-xs tabular-nums ${getScoreColor(confidence)}`}
        aria-label={`Match confidence: ${confidence}%`}
      >
        {confidence}%
      </div>
    </motion.div>
  );
};
