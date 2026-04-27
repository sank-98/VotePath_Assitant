/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BarChart3, LayoutGrid, Info } from "lucide-react";
import { ELECTION_STEPS } from './data/electionData';
import Timeline from './components/Timeline';
import StepDetail from './components/StepDetail';
import AIAssistant from './components/AIAssistant';
import StatesElectionGrid from './components/StatesElectionGrid';
import EducationSection from './components/EducationSection';
import DemocraticImpact from './components/DemocraticImpact';
import PollingStationFinder from './components/PollingStationFinder';
import { Language, translations } from './lib/translations';

import Header from './components/Header';
import Footer from './components/Footer';
import FeedbackSection from './components/FeedbackSection';
import VoterDashboard from './components/VoterDashboard';
import NewsTicker from './components/NewsTicker';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('votePath_lang') as Language) || 'hi';
  });
  const [activeStepId, setActiveStepId] = useState(() => {
    return localStorage.getItem('votePath_activeStep') || ELECTION_STEPS[0].id;
  });
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('votePath_highContrast') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('votePath_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('votePath_activeStep', activeStepId);
  }, [activeStepId]);

  useEffect(() => {
    localStorage.setItem('votePath_highContrast', String(highContrast));
  }, [highContrast]);
  
  const activeStep = ELECTION_STEPS.find(s => s.id === activeStepId);
  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };

  return (
    <div className={`min-h-screen bg-blue-50/30 text-slate-900 p-4 md:p-8 font-sans selection:bg-blue-100 selection:text-blue-900 transition-colors duration-500 ${highContrast ? 'high-contrast' : ''}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        <Header 
          language={language} 
          t={t} 
          highContrast={highContrast} 
          toggleHighContrast={toggleHighContrast} 
          toggleLanguage={toggleLanguage} 
        />

        <NewsTicker t={t} />
        
        <main className="space-y-8">
          {/* Knowledge & Impact Sections */}
          <section aria-label="Education and Impact" className="space-y-8">
            <EducationSection language={language} />
            <DemocraticImpact language={language} />
          </section>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* AI Assistant Section - Now Primary */}
            <aside className="lg:col-span-7 xl:col-span-8 flex flex-col min-h-[600px] no-print" aria-label="AI Voting Assistant">
              <div className="bg-white border-4 border-slate-900 shadow-bento overflow-hidden rounded-xl flex-1 flex flex-col relative">
                <AIAssistant key={language} language={language} />
              </div>
            </aside>

            {/* Side Info Panel */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-8 no-print">
            {/* Booth Finder - NEW */}
            <div className="h-[500px]">
              <PollingStationFinder language={language} />
            </div>

            {/* Quick Election Status */}
            <div className="bg-white border-4 border-slate-900 shadow-bento p-6" role="region" aria-labelledby="status-title">
              <h2 id="status-title" className="text-xl font-black uppercase tracking-tighter mb-4 flex items-center gap-2">
                <BarChart3 className="text-blue-600" aria-hidden="true" />
                {t.statesTracked}
              </h2>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 border-2 border-slate-900 rounded flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-widest">{t.cycle}</span>
                  <span className="text-sm font-black text-blue-600">2024-2029</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pb-2">
                   <div className="p-3 bg-slate-50 border-2 border-slate-900 rounded">
                      <div className="text-[8px] font-black text-slate-400 uppercase mb-1">Lok Sabha</div>
                      <div className="text-sm font-black underline decoration-blue-500">2029</div>
                   </div>
                   <div className="p-3 bg-slate-50 border-2 border-slate-900 rounded">
                      <div className="text-[8px] font-black text-slate-400 uppercase mb-1">Vidhan Sabha</div>
                      <div className="text-sm font-black underline decoration-emerald-500">Rolling</div>
                   </div>
                </div>
              </div>
            </div>

            {/* Upcoming State Elections Grid */}
            <div className="overflow-y-auto max-h-[400px] border-4 border-slate-900 shadow-bento rounded-xl bg-white" role="region" aria-label="State Election Data">
              <StatesElectionGrid language={language} />
            </div>

            {/* EVM / VVPAT Guide Card */}
            <div className="bg-slate-900 text-white border-4 border-slate-900 shadow-bento p-6 rounded-xl" role="region" aria-labelledby="evm-guide-title">
              <h2 id="evm-guide-title" className="text-xl font-black uppercase tracking-tighter mb-4 flex items-center gap-2">
                <Info className="text-blue-400" aria-hidden="true" />
                {language === 'hi' ? 'ईवीएम और वीवीपैट' : 'EVM & VVPAT Guide'}
              </h2>
              <p className="text-xs text-slate-400 mb-4 font-medium leading-relaxed">
                {language === 'hi' 
                  ? 'ईवीएम और वीवीपैट भारतीय चुनाव की रीढ़ हैं। जानें कि आपका वोट कैसे सुरक्षित और सत्यापित रहता है।' 
                  : 'EVMs and VVPATs are the backbone of Indian elections. Learn how your vote remains secure and verified.'}
              </p>
              <ul className="space-y-2 mb-6" role="list">
                <li className="flex items-start gap-2 text-[10px] font-bold uppercase">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" aria-hidden="true" />
                  {language === 'hi' ? 'स्टैंड-अलोन और गैर-नेटवर्किंग' : 'Stand-alone & Non-networked'}
                </li>
                <li className="flex items-start gap-2 text-[10px] font-bold uppercase">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" aria-hidden="true" />
                  {language === 'hi' ? '7-सेकंड की वीवीपैट पर्ची' : '7-Second VVPAT Slip'}
                </li>
                <li className="flex items-start gap-2 text-[10px] font-bold uppercase">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" aria-hidden="true" />
                  {language === 'hi' ? 'छेड़छाड़ मुक्त निर्माण' : 'Tamper-proof construction'}
                </li>
              </ul>
              <button 
                onClick={() => {
                  const evmInput = language === 'hi' ? 'ईवीएम और वीवीपैट कैसे काम करते हैं?' : 'How do EVM and VVPAT work?';
                  window.dispatchEvent(new CustomEvent('trigger-ai-query', { detail: evmInput }));
                }}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest transition-colors rounded focus:ring-4 focus:ring-blue-400/30 outline-none"
              >
                {language === 'hi' ? 'एआई सहायक से पूछें' : 'Ask AI Assistant'}
              </button>
            </div>
          </div>
        </div>

        {/* Roadmap Section - Below the Assistant */}
        <div className="space-y-8" role="region" aria-labelledby="roadmap-title">
            <div className="bg-white border-4 border-slate-900 shadow-bento overflow-hidden rounded-xl">
              <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
                <h2 id="roadmap-title" className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <LayoutGrid size={18} aria-hidden="true" />
                  {t.roadmapTitle}
                </h2>
                <div className="flex gap-1" aria-hidden="true">
                  {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-700" />)}
                </div>
              </div>
              
              <div className="p-2 md:p-6 overflow-hidden">
                <Timeline 
                  steps={ELECTION_STEPS} 
                  activeStepId={activeStepId} 
                  onStepSelect={setActiveStepId}
                  language={language}
                />
              </div>

              <div className="border-t-4 border-slate-900 min-h-[400px]" aria-live="polite">
                <StepDetail step={activeStep} language={language} />
              </div>
            </div>
          </div>
        </main>
        
        <VoterDashboard language={language} />
        
        <div className="no-print">
          <FeedbackSection language={language} />
        </div>

        <Footer t={t} />
      </div>
    </div>
  );
}

