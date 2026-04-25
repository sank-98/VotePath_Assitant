import * as Icons from "lucide-react";
import { Step } from "../data/electionData";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, Twitter, Facebook, MessageCircle, Share2, Link, Check, LucideIcon } from "lucide-react";
import { useState } from "react";
import { Language, translations } from "../lib/translations";

interface StepDetailProps {
  step: Step | undefined;
  language: Language;
}

export default function StepDetail({ step, language }: StepDetailProps) {
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const t = translations[language];

  if (!step) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-slate-50">
        <Icons.MousePointer2 size={48} className="text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-slate-400 uppercase tracking-tighter">{t.selectStage}</h3>
        <p className="text-sm text-slate-500 max-w-xs mt-2 italic">
          {t.clickTimeline}
        </p>
      </div>
    );
  }

  const Icon = (Icons as unknown as Record<string, LucideIcon>)[step.icon] || Icons.HelpCircle;

  const toggleItem = (item: string) => {
    setCompletedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const shareOnTwitter = () => {
    const text = `${step.title[language]} - ${step.longDescription[language].substring(0, 100)}... via #VotePathIndia`;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    const text = `*${step.title[language]}*\n\n${step.longDescription[language]}\n\nLearn more at: ${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="p-6 md:p-8 h-full overflow-y-auto flex flex-col"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-900 border-2 border-slate-900 shadow-bento-sm text-white rounded-xl">
              <Icon size={24} />
            </div>
            <div>
              <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{t.detailedGuide}</div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">{step.title[language]}</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-2 mr-2">
              <Share2 size={14} className="text-slate-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.shareTitle}</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={shareOnTwitter}
                title={t.shareTwitter}
                className="p-2 bg-white border-2 border-slate-900 shadow-bento-sm hover:bg-slate-50 transition-all rounded-lg"
              >
                <Twitter size={16} className="text-[#1DA1F2]" />
              </button>
              <button 
                onClick={shareOnFacebook}
                title={t.shareFacebook}
                className="p-2 bg-white border-2 border-slate-900 shadow-bento-sm hover:bg-slate-50 transition-all rounded-lg"
              >
                <Facebook size={16} className="text-[#1877F2]" />
              </button>
              <button 
                onClick={shareOnWhatsApp}
                title={t.shareWhatsApp}
                className="p-2 bg-white border-2 border-slate-900 shadow-bento-sm hover:bg-slate-50 transition-all rounded-lg"
              >
                <MessageCircle size={16} className="text-[#25D366]" />
              </button>
              <button 
                onClick={copyToClipboard}
                title={t.copyLink}
                className="p-2 bg-white border-2 border-slate-900 shadow-bento-sm hover:bg-slate-50 transition-all rounded-lg flex items-center gap-2"
              >
                {copied ? <Check size={16} className="text-green-600" /> : <Link size={16} className="text-slate-600" />}
                {copied && <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">{t.linkCopied}</span>}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-5 bg-slate-50 border-2 border-slate-900 shadow-bento-sm rounded-xl">
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {step.longDescription[language]}
            </p>
          </div>

          <div className="flex-1">
            <h4 className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-widest mb-4">
              <span className="w-4 h-4 bg-red-700 rounded-sm" aria-hidden="true"></span>
              {t.actionChecklist}
            </h4>
            <div className="grid gap-2" role="list">
              {step.checklist[language].map((item, idx) => (
                <button 
                  key={idx}
                  onClick={() => toggleItem(item)}
                  aria-pressed={!!completedItems[item]}
                  role="listitem"
                  className={`w-full flex items-center gap-4 p-3 border-2 border-slate-900 transition-all cursor-pointer shadow-bento-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    completedItems[item] 
                      ? 'bg-green-600 text-white' 
                      : 'bg-white text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-5 h-5 border-2 flex items-center justify-center shrink-0 ${
                    completedItems[item] ? 'border-white' : 'border-slate-900 bg-slate-50'
                  }`}>
                    {completedItems[item] && <span aria-hidden="true">✓</span>}
                  </div>
                  <span className={`text-xs font-bold ${completedItems[item] ? 'line-through' : ''}`}>
                    {item}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 mt-auto">
            <a 
              href={step.id === 'registration' ? 'https://voters.eci.gov.in/' : 'https://eci.gov.in/'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.exploreOfficial}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-950 text-white text-xs font-black uppercase tracking-widest border-2 border-slate-900 shadow-bento-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {t.exploreOfficial}
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

