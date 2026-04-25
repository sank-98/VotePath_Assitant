import { Step } from "../data/electionData";
import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { Language } from "../lib/translations";

interface TimelineProps {
  steps: Step[];
  activeStepId: string;
  onStepSelect: (id: string) => void;
  language: Language;
}

export default function Timeline({ steps, activeStepId, onStepSelect, language }: TimelineProps) {
  return (
    <div className="relative pt-4 overflow-x-auto">
      {/* Decorative Line */}
      <div className="absolute top-[44px] left-10 right-10 h-1 bg-slate-100 z-0" />

      <div className="flex justify-between items-start gap-8 min-w-[800px] px-10">
        {steps.map((step, index) => {
          const isActive = step.id === activeStepId;
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';

          return (
            <motion.button 
              key={step.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative z-10 flex flex-col items-center gap-3 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2"
              onClick={() => onStepSelect(step.id)}
              aria-label={`${step.title[language]} - ${step.dateRange[language]}`}
              aria-current={isActive ? 'step' : undefined}
            >
              {/* Status Circle */}
              <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg border-2 border-slate-900 shadow-bento-sm transition-all group-hover:scale-110 ${
                isActive 
                  ? 'bg-blue-700 text-white' 
                  : isCompleted 
                    ? 'bg-green-600 text-white'
                    : isCurrent 
                      ? 'bg-blue-100 text-blue-900'
                      : 'bg-slate-200 text-slate-500 font-black'
              }`}>
                {isCompleted ? <CheckCircle2 size={24} aria-hidden="true" /> : <span>0{index + 1}</span>}
              </div>

              {/* Step Info */}
              <div className="flex flex-col items-center text-center">
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                  isActive ? 'text-blue-700' : 'text-slate-500'
                }`}>
                  {step.dateRange[language]}
                </span>
                <span className={`text-sm font-bold truncate max-w-[120px] ${
                  isActive ? 'text-blue-950 underline decoration-2 underline-offset-4' : 'text-slate-800'
                }`}>
                  {step.title[language]}
                </span>
              </div>
              
              {isActive && (
                <div className="absolute -bottom-2 w-2 h-2 bg-blue-700 rotate-45" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

