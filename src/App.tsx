/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { LayoutGrid, Info } from "lucide-react";
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
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      return (localStorage.getItem('votePath_lang') as Language) || 'hi';
    } catch {
      return 'hi';
    }
  });
  const [activeStepId, setActiveStepId] = useState(() => {
    try {
      return localStorage.getItem('votePath_activeStep') || ELECTION_STEPS[0].id;
    } catch {
      return ELECTION_STEPS[0].id;
    }
  });
  const [highContrast, setHighContrast] = useState(() => {
    try {
      return localStorage.getItem('votePath_highContrast') === 'true';
    } catch {
      return false;
    }
  });

  // New State for Matching Engine
  const userWeights = useMemo<Record<string, number>>(() => ({
    economy: 5,
    education: 5,
    healthcare: 5,
    environment: 5,
    security: 5
  }), []);

  useEffect(() => {
    try {
      localStorage.setItem('votePath_lang', language);
    } catch (e) {
      console.warn('LocalStorage blocked:', e);
    }
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem('votePath_activeStep', activeStepId);
    } catch (e) {
      console.warn('LocalStorage blocked:', e);
    }
  }, [activeStepId]);

  useEffect(() => {
    try {
      localStorage.setItem('votePath_highContrast', String(highContrast));
    } catch (e) {
      console.warn('LocalStorage blocked:', e);
    }
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
    <div className={`min-h-screen bg-[#f8fafc] text-slate-900 p-4 md:p-10 font-sans selection:bg-blue-100 selection:text-blue-900 transition-colors duration-500 ${highContrast ? 'high-contrast' : ''}`}>
      <div className="max-w-[1400px] mx-auto space-y-12">
        <Header 
          language={language} 
          t={t} 
          highContrast={highContrast} 
          toggleHighContrast={toggleHighContrast} 
          toggleLanguage={toggleLanguage} 
        />

        <NewsTicker t={t} />
        
        <main id="main-content" className="space-y-20">
          {/* 0. Landing Hero */}
          <ErrorBoundary>
            <section className="scroll-mt-24">
              <LandingHero language={language} onGetStarted={scrollToAssistant} />
            </section>
          </ErrorBoundary>

          {/* 1. Education & Impact - Balanced Grid */}
          <ErrorBoundary>
            <section aria-label="Education and Impact" className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-7">
                <EducationSection language={language} />
              </div>
              <div className="lg:col-span-5 sticky top-24 h-fit">
                <DemocraticImpact language={language} />
              </div>
            </section>
          </ErrorBoundary>

          {/* 2. Primary Experience: AI + Analytics */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-10" id="ai-assistant-section">
            {/* AI Assistant */}
            <aside className="lg:col-span-7 xl:col-span-8 flex flex-col min-h-[650px] no-print" aria-label="AI Voting Assistant">
              <ErrorBoundary>
                <div className="bg-white border-4 border-slate-900 shadow-bento-lg overflow-hidden rounded-[2.5rem] flex-1 flex flex-col relative transition-all duration-300">
                  <AIAssistant key={language} language={language} />
                </div>
              </ErrorBoundary>
            </aside>

            {/* Trends Dashboard */}
            <div className="lg:col-span-5 xl:col-span-4 min-h-[450px]">
              <ErrorBoundary>
                <AnalyticsDashboard language={language} />
              </ErrorBoundary>
            </div>
          </section>

          {/* 3. Decision Support: Explainable Matching */}
          <ErrorBoundary>
            <section aria-labelledby="matching-title" className="space-y-8 bg-blue-50/50 p-8 md:p-12 rounded-[3rem] border-4 border-slate-900">
             <div className="flex flex-col gap-2">
                <h2 id="matching-title" className="text-5xl font-black uppercase tracking-tighter text-slate-900 font-display">
                    {language === 'hi' ? 'आपका व्यक्तिगत मिलान' : 'YOUR PERSONAL MATCH'}
                </h2>
                <div className="flex items-center gap-2 text-slate-500 font-black uppercase text-[11px] tracking-[0.2em]">
                    <Info size={16} className="text-blue-500" />
                    {language === 'hi' ? 'पारदर्शी एल्गोरिदम विश्लेषण' : 'TRANSPARENT ALGORITHMIC ANALYSIS'}
                </div>
             </div>
             <ExplainableMatching language={language} userWeights={userWeights} />
          </section>
          </ErrorBoundary>

          {/* 4. Voter Tools: Booth Finder & States */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 no-print">
            <div className="h-[600px]">
              <PollingStationFinder language={language} />
            </div>
            <div className="h-[600px] overflow-y-auto border-4 border-slate-900 shadow-bento rounded-[2.5rem] bg-white bento-hover">
              <StatesElectionGrid language={language} />
            </div>
          </section>

          {/* 5. Roadmap Section */}
          <section className="space-y-10" role="region" aria-labelledby="roadmap-title">
            <div className="bg-white border-4 border-slate-900 shadow-bento-lg overflow-hidden rounded-[3rem]">
              <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                <h2 id="roadmap-title" className="text-3xl font-black uppercase tracking-[0.05em] flex items-center gap-4 font-display">
                  <LayoutGrid size={28} aria-hidden="true" className="text-blue-400" />
                  {t.roadmapTitle}
                </h2>
                <div className="hidden md:flex gap-3" aria-hidden="true">
                  {[1, 2, 3].map(i => <div key={i} className="w-3 h-3 rounded-full bg-slate-700" />)}
                </div>
              </div>
              
              <div className="p-6 md:p-12">
                <Timeline 
                  steps={ELECTION_STEPS} 
                  activeStepId={activeStepId} 
                  onStepSelect={setActiveStepId}
                  language={language}
                />
              </div>

              <div className="border-t-4 border-slate-900 min-h-[450px]" aria-live="polite">
                <StepDetail step={activeStep} language={language} />
              </div>
            </div>
          </section>
        </main>
        
        <div className="pt-10">
          <VoterDashboard language={language} />
        </div>
        
        <div className="no-print pt-10">
          <FeedbackSection language={language} />
        </div>

        <Footer t={t} />
      </div>
    </div>
  );
}

