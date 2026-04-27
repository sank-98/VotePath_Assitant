import React from 'react';
import { TranslationType } from '../lib/translations';

interface FooterProps {
  t: TranslationType;
}

const Footer: React.FC<FooterProps> = ({ t }) => {
  return (
    <footer className="pt-12 pb-8 border-t-4 border-slate-900 mt-12" role="contentinfo">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-2xl font-black tracking-tighter uppercase">{t.appName}</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.appTagline}</span>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded border-2 border-slate-900">{t.footerSources}</div>
          <div className="px-4 py-2 bg-white border-2 border-slate-900 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded">{t.footerScope}</div>
        </div>
      </div>
      <div className="mt-8 text-center text-[10px] font-mono opacity-50 uppercase tracking-widest">
        {t.footerHub} • Designed for Bharat
      </div>
    </footer>
  );
};

export default Footer;
