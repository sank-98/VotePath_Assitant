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
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ExplainableMatching from './components/ExplainableMatching';
import LandingHero from './components/LandingHero';

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

  // New State for Matching Engine
  const [userWeights, setUserWeights] = useState<Record<string, number>>({
    economy: 5,
    education: 5,
    healthcare: 5,
    environment: 5,
    security: 5
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

  const scrollToAssistant = () => {
    const el = document.getElementById('ai-assistant-section');
    el?.scrollIntoView({ behavior: 'smooth' });
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
        
        <main className="space-y-12">
          {/* 0. Landing Hero */}
          <LandingHero language={language} onGetStarted={scrollToAssistant} />

          {/* 1. Landing & Impact */}
          <section aria-label="Education and Impact" className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <EducationSection language={language} />
            <DemocraticImpact language={language} />
          </section>

          {/* 2. Primary Experience: AI + Analytics */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="ai-assistant-section">
            {/* AI Assistant */}
            <aside className="lg:col-span-7 xl:col-span-8 flex flex-col min-h-[600px] no-print" aria-label="AI Voting Assistant">
              <div className="bg-white border-4 border-slate-900 shadow-bento overflow-hidden rounded-3xl flex-1 flex flex-col relative">
                <AIAssistant key={language} language={language} />
              </div>
            </aside>

            {/* Trends Dashboard */}
            <div className="lg:col-span-5 xl:col-span-4 min-h-[400px]">
              <AnalyticsDashboard language={language} />
            </div>
          </section>

          {/* 3. Decision Support: Explainable Matching */}
          <section aria-labelledby="matching-title" className="space-y-6">
             <div className="flex flex-col gap-2">
                <h2 id="matching-title" className="text-4xl font-black uppercase tracking-tighter text-slate-900">
                    {language === 'hi' ? 'आपका व्यक्तिगत मिलान' : 'YOUR PERSONAL MATCH'}
                </h2>
                <div className="flex items-center gap-2 text-slate-500 font-black uppercase text-[10px] tracking-widest">
                    <Info size={14} className="text-blue-500" />
                    {language === 'hi' ? 'पारदर्शी एल्गोरिदम विश्लेषण' : 'TRANSPARENT ALGORITHMIC ANALYSIS'}
                </div>
             </div>
             <ExplainableMatching language={language} userWeights={userWeights} />
          </section>

          {/* 4. Voter Tools: Booth Finder & States */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 no-print">
            <div className="h-[550px]">
              <PollingStationFinder language={language} />
            </div>
            <div className="h-[550px] overflow-y-auto border-4 border-slate-900 shadow-bento rounded-3xl bg-white">
              <StatesElectionGrid language={language} />
            </div>
          </section>

          {/* 5. Roadmap Section */}
          <section className="space-y-8" role="region" aria-labelledby="roadmap-title">
            <div className="bg-white border-4 border-slate-900 shadow-bento overflow-hidden rounded-3xl">
              <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                <h2 id="roadmap-title" className="text-2xl font-black uppercase tracking-widest flex items-center gap-3">
                  <LayoutGrid size={24} aria-hidden="true" />
                  {t.roadmapTitle}
                </h2>
                <div className="flex gap-2" aria-hidden="true">
                  {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-slate-700" />)}
                </div>
              </div>
              
              <div className="p-4 md:p-8">
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
          </section>
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

