import React, { useState, useRef, useEffect, FormEvent, useCallback } from 'react';
import DOMPurify from 'dompurify';
import { Send, Bot, Loader2, Clock, FileText, ShieldCheck, Cpu, ClipboardCheck, ChevronDown, ChevronUp, Globe, Copy, Check, Volume2, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { processUser } from '../lib/decisionEngine';
import { generateAIResponse, AIResponse as AIStructuredResponse, AIError, AIErrorType } from '../services/geminiService';
import { logQuery } from '../lib/firebase';
import { FirebaseService } from '../services/firebaseService';
import { Language, translations } from '../lib/translations';
import Tooltip from './ui/Tooltip';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  structured?: AIStructuredResponse;
}

const sanitize = (text: string): string => {
  if (!text) return '';
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'code', 'ul', 'li', 'ol', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
};

const AIAssistant: React.FC<{ language: Language }> = ({ language }) => {
  const t = translations[language];
  const SCHEMA_VERSION = 'v2_steps';

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('voter_chat_history');
    const savedVersion = localStorage.getItem('voter_chat_schema_version');
    
    if (saved && savedVersion === SCHEMA_VERSION) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
    // If version mismatch or no history, reset and save new version
    localStorage.setItem('voter_chat_schema_version', SCHEMA_VERSION);
    return [{ role: 'assistant', content: translations[language].aiAssistantInitial }];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [isEvmHubOpen, setIsEvmHubOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Persistence: Save to storage
  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem('voter_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const speak = (text: string, idx: number) => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsPlaying(null);
      if (isPlaying === idx) return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.onend = () => setIsPlaying(null);
    window.speechSynthesis.speak(utterance);
    setIsPlaying(idx);
  };

  const clearHistory = () => {
    setConfirmClear(true);
  };

  const confirmClearHistory = () => {
    setMessages([{ role: 'assistant', content: t.aiAssistantInitial }]);
    localStorage.removeItem('voter_chat_history');
    setConfirmClear(false);
  };

  const renderTextWithTooltips = (text: string) => {
    const sanitizedText = sanitize(text);
    if (!sanitizedText) return null;
    const terms = [
      { id: 'EVM', en: 'EVM', hi: 'ईवीएम', tooltip: t.evmTooltip },
      { id: 'VVPAT', en: 'VVPAT', hi: 'वीवीपैट', tooltip: t.vvpatTooltip },
      { id: 'MCC', en: 'Model Code of Conduct', hi: 'आदर्श आचार संहिता', tooltip: t.mccTooltip },
    ];

    const pattern = terms.map(term => `(${term.en}|${term.hi})`).join('|');
    const regex = new RegExp(pattern, 'gi');

    const parts = sanitizedText.split(regex);
    
    return parts.map((part, i) => {
      if (!part) return null;
      
      const matchingTerm = terms.find(term => 
        term.en.toLowerCase() === part.toLowerCase() || 
        term.hi === part
      );

      if (matchingTerm) {
        return (
          <Tooltip key={i} content={matchingTerm.tooltip}>
            <span className="underline decoration-dotted decoration-current cursor-help font-black px-0.5 rounded hover:bg-slate-200 transition-colors" dangerouslySetInnerHTML={{ __html: sanitize(part) }} />
          </Tooltip>
        );
      }
      return <span key={i} dangerouslySetInnerHTML={{ __html: sanitize(part) }} />;
    });
  };

  const handleSend = useCallback(async (overrideInput?: string) => {
    const messageText = overrideInput || input;
    if (!messageText.trim() || isLoading) return;

    const now = Date.now();
    if (now - lastRequestTime < 1500) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            language === 'hi'
              ? 'कृपया थोड़ा धीमे चलें। हम आपके प्रश्नों को प्रोसेस कर रहे हैं।'
              : 'Please slow down slightly. We are processing your requests.',
        },
      ]);
      return;
    }
    setLastRequestTime(now);

    const userMessage: Message = { role: 'user', content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    if (!overrideInput) setInput('');
    setIsLoading(true);

    try {
      const context = processUser(messageText);
      const data = await generateAIResponse(context, messageText, language);

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.whatHappens,
        structured: data,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setErrorCount(0); // Reset error count on success

      // Log to Firebase for aggregated insights
      logQuery(context.intent, context.flow).catch(e => console.warn("Log Query Failed", e));
      FirebaseService.logInteraction('ai_query', { intent: context.intent, flow: context.flow });
    } catch (error: unknown) {
      console.error('Chat Error:', error);
      setErrorCount((prev) => prev + 1);

      let errorMessage =
        language === 'hi'
          ? 'क्षमा करें, मुझे इस समय मार्गदर्शन प्रदान करने में समस्या हो रही है। कृपया पुनः प्रयास करें।'
          : "Sorry, I'm having trouble providing guidance at this time. Please try again.";

      if (error instanceof AIError) {
        switch (error.type) {
          case AIErrorType.RATE_LIMIT:
            errorMessage =
              language === 'hi'
                ? 'बहुत सारे अनुरोध! कृपया थोड़ी देर प्रतीक्षा करें और पुनः प्रयास करें।'
                : 'Too many requests! Please wait a moment and try again.';
            break;
          case AIErrorType.SAFETY:
            errorMessage =
              language === 'hi'
                ? 'क्षमा करें, सुरक्षा नीतियों के कारण मैं उस प्रश्न का उत्तर नहीं दे सकता। कृपया चुनाव संबंधित बुनियादी सवाल पूछें।'
                : 'Sorry, I cannot answer that due to safety policies. Please ask election-related process questions.';
            break;
          case AIErrorType.NETWORK:
            errorMessage =
              language === 'hi'
                ? 'नेटवर्क कनेक्शन में समस्या। कृपया अपने इंटरनेट की जाँच करें।'
                : 'Network connection issue. Please check your internet.';
            break;
        }
      } else if (errorCount >= 2) {
        errorMessage =
          language === 'hi'
            ? 'लगातार समस्या के लिए आधिकारिक चुनाव पोर्टल eci.gov.in देखें।'
            : 'Persistent connection issues. Please consult eci.gov.in for official guidance.';
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, lastRequestTime, language, errorCount]);

  // Handle external triggers (like the EVM Card)
  useEffect(() => {
    const handleTrigger = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const query = customEvent.detail;
      if (query) {
        setInput(query);
        handleSend(query);
      }
    };
    window.addEventListener('trigger-ai-query', handleTrigger);
    return () => window.removeEventListener('trigger-ai-query', handleTrigger);
  }, [handleSend]); // Depend on handleSend which is memoized

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 overflow-hidden" role="region" aria-label="AI Voting Assistant">
      {/* Header */}
      <div className="p-4 bg-white border-b-4 border-slate-900 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Bot size={20} className="text-blue-600" aria-hidden="true" />
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">{t.aiAssistantTitle}</h3>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.aiLiveGuidance}</span>
          </div>
          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">{t.aiTrySimply}</span>
        </div>
      </div>

      {/* EVM & VVPAT Knowledge Hub Section */}
      <div className="bg-blue-50 border-b-2 border-slate-100 overflow-hidden shrink-0">
        <button 
          onClick={() => setIsEvmHubOpen(!isEvmHubOpen)}
          aria-expanded={isEvmHubOpen}
          aria-controls="evm-hub-content"
          className="w-full p-3 flex items-center justify-between hover:bg-blue-100/50 transition-colors focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-blue-700" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{t.aiEvmHubTitle}</span>
          </div>
          {isEvmHubOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        <AnimatePresence>
          {isEvmHubOpen && (
            <motion.div 
              id="evm-hub-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pb-4 space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                {/* Security */}
                <div 
                  className="bg-white p-3 rounded border-2 border-slate-900 shadow-bento-sm"
                  tabIndex={0}
                  role="region"
                  aria-labelledby="standalone-title"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Cpu size={14} className="text-emerald-700" aria-hidden="true" />
                    <span className="text-[9px] font-black uppercase tracking-tighter text-slate-700">{t.aiEvmSecurityLabel}</span>
                  </div>
                  <h4 id="standalone-title" className="text-[10px] font-black uppercase mb-1 leading-tight">{t.aiEvmStandaloneTitle}</h4>
                  <p className="text-[9px] text-slate-600 leading-normal font-medium">{t.aiEvmStandaloneDesc}</p>
                </div>

                {/* Working */}
                <div 
                  className="bg-white p-3 rounded border-2 border-slate-900 shadow-bento-sm"
                  tabIndex={0}
                  role="region"
                  aria-labelledby="vvpat-title"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <FileText size={14} className="text-blue-700" aria-hidden="true" />
                    <span className="text-[9px] font-black uppercase tracking-tighter text-slate-700">{t.aiEvmWorkingLabel}</span>
                  </div>
                  <h4 id="vvpat-title" className="text-[10px] font-black uppercase mb-1 leading-tight">{t.aiEvmVvpatTitle}</h4>
                  <p className="text-[9px] text-slate-600 leading-normal font-medium">{t.aiEvmVvpatDesc}</p>
                </div>

                {/* Integrity */}
                <div 
                  className="bg-white p-3 rounded border-2 border-slate-900 shadow-bento-sm"
                  tabIndex={0}
                  role="region"
                  aria-labelledby="audit-title"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <ClipboardCheck size={14} className="text-amber-700" aria-hidden="true" />
                    <span className="text-[9px] font-black uppercase tracking-tighter text-slate-700">{t.aiEvmIntegrityLabel}</span>
                  </div>
                  <h4 id="audit-title" className="text-[10px] font-black uppercase mb-1 leading-tight">{t.aiEvmAuditTitle}</h4>
                  <p className="text-[9px] text-slate-600 leading-normal font-medium">{t.aiEvmAuditDesc}</p>
                </div>

                {/* Protocols */}
                <div 
                  className="bg-white p-3 rounded border-2 border-slate-900 shadow-bento-sm"
                  tabIndex={0}
                  role="region"
                  aria-labelledby="protocol-title"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <ShieldCheck size={14} className="text-red-700" aria-hidden="true" />
                    <span className="text-[9px] font-black uppercase tracking-tighter text-slate-700">{t.aiEvmProtocolLabel}</span>
                  </div>
                  <h4 id="protocol-title" className="text-[10px] font-black uppercase mb-1 leading-tight">{t.aiEvmProtocolTitle}</h4>
                  <p className="text-[9px] text-slate-600 leading-normal font-medium">{t.aiEvmProtocolDesc}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  const query = language === 'hi' ? 'ईवीएम और वीवीपैट की सुरक्षा के बारे में विस्तार से बताएं' : 'Explain in detail about the security of EVM and VVPAT';
                  handleSend(query);
                  setIsEvmHubOpen(false);
                }}
                className="w-full py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 focus:ring-2 focus:ring-slate-500 outline-none transition-colors rounded"
              >
                {language === 'hi' ? 'विस्तृत सुरक्षा विश्लेषण मांगें' : 'Request Detailed Security Analysis'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50"
        role="log"
        aria-live="polite"
        aria-label="VotePath assistant responses"
        aria-atomic="false"
      >
        <div className="flex justify-between items-center mb-2 px-2">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <Cpu size={12} /> {t.aiEngineActive}
          </div>
          {messages.length > 1 && (
            confirmClear ? (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase">{t.clearHistoryConfirm || 'Clear?'}</span>
                <button
                  onClick={confirmClearHistory}
                  className="px-2 py-1 bg-red-100 text-red-600 rounded text-[9px] font-black uppercase tracking-wider"
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-2 py-1 bg-slate-200 text-slate-600 rounded text-[9px] font-black uppercase tracking-wider"
                >
                  No
                </button>
              </div>
            ) : (
              <button 
                onClick={clearHistory}
                className="flex items-center gap-1 text-[10px] font-black text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest"
              >
                <RotateCcw size={10} /> {t.clearHistory}
              </button>
            )
          )}
        </div>

        <AnimatePresence initial={false}>
          {messages.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`group relative max-w-[95%] p-3 border-2 border-slate-900 shadow-bento-sm rounded-lg ${
                m.role === 'user' 
                  ? 'bg-blue-700 text-white' 
                  : 'bg-white text-slate-900'
              }`}>
                {/* Assistant Tools (Copy & Grounding) */}
                {m.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    {m.structured?.isGrounded && (
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded text-[8px] font-black text-blue-700 uppercase tracking-tighter">
                        <Globe size={10} className="animate-pulse" />
                        {t.webVerified}
                      </div>
                    )}
                    <button 
                      onClick={() => copyToClipboard(m.content, idx)}
                      className="ml-auto p-1 text-slate-400 hover:text-slate-600 transition-colors"
                      title="Copy response"
                      aria-label={copiedIdx === idx ? 'Copied' : 'Copy response'}
                    >
                      {copiedIdx === idx ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                    </button>
                    <button 
                      onClick={() => speak(m.content, idx)}
                      className={`p-1 text-slate-400 hover:text-slate-600 transition-colors ${isPlaying === idx ? 'text-blue-600' : ''}`}
                      title="Read aloud"
                      aria-label="Read aloud"
                      aria-pressed={isPlaying === idx}
                    >
                      <Volume2 size={12} />
                    </button>
                  </div>
                )}

                <div className="text-xs font-bold leading-relaxed whitespace-pre-wrap">
                  {m.role === 'assistant' ? renderTextWithTooltips(m.content) : m.content}
                </div>

                {m.structured && (
                  <div className="mt-4 pt-4 border-t-2 border-slate-100 space-y-4">
                    {/* Current Step Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-bento-sm">
                      <Bot size={12} className="text-blue-400" />
                      {m.structured?.currentStep || 'Assistance'}
                    </div>

                    {/* What You Must Do */}
                    {m.structured?.whatYouMustDo && (
                      <div className="space-y-2 bg-blue-50/50 p-3 rounded-lg border-2 border-blue-100">
                        <div className="flex items-center gap-2 text-[10px] font-black text-blue-700 uppercase tracking-[0.1em]">
                          <ClipboardCheck size={12} /> {t.aiWhatYouMustDo}
                        </div>
                        <p className="text-[11px] text-slate-700 leading-relaxed font-bold">
                          {renderTextWithTooltips(m.structured.whatYouMustDo)}
                        </p>
                      </div>
                    )}

                    {/* Required Documents */}
                    {m.structured?.requiredDocuments && m.structured.requiredDocuments.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black text-red-700 uppercase tracking-[0.1em]">
                          <FileText size={12} /> {t.aiRequiredDocs}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {m.structured.requiredDocuments.map((doc, i) => (
                            <span key={i} className="text-[9px] bg-red-50 text-red-700 px-2 py-1 rounded border-2 border-red-100 font-black uppercase tracking-wider">
                              {renderTextWithTooltips(doc)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Timeline / Deadlines */}
                    {m.structured?.timelineDeadlines && m.structured.timelineDeadlines.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black text-amber-700 uppercase tracking-[0.1em]">
                          <Clock size={12} /> {t.aiTimeline}
                        </div>
                        <div className="flex flex-col gap-1.5">
                          {m.structured.timelineDeadlines.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 group/time">
                              <div className="w-1.5 h-1.5 bg-amber-600 rounded-full group-hover/time:scale-125 transition-transform" />
                              <span className="text-[10px] text-slate-700 font-black">
                                {renderTextWithTooltips(item)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Common Mistakes */}
                    {m.structured?.commonMistakes && m.structured.commonMistakes.length > 0 && (
                      <div className="p-3 bg-red-50 rounded-lg border-2 border-red-100">
                        <div className="flex items-center gap-2 text-[10px] font-black text-red-800 uppercase mb-2">
                          <ShieldCheck size={14} /> {t.aiCommonMistakes}
                        </div>
                        <ul className="space-y-1.5">
                          {m.structured.commonMistakes.map((mistake, i) => (
                            <li key={i} className="text-[10px] text-red-900 font-bold flex items-center gap-2">
                              <span className="w-1 h-1 bg-red-400 rounded-full" />
                              {renderTextWithTooltips(mistake)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Next Step */}
                    {m.structured?.nextStep && (
                      <div className="p-3 bg-emerald-50 rounded-lg border-2 border-emerald-100 border-dashed">
                        <div className="flex items-center gap-2 text-[10px] font-black text-emerald-800 uppercase mb-1">
                          <RotateCcw size={14} className="rotate-90" /> {t.aiNextStep}
                        </div>
                        <p className="text-[11px] text-emerald-900 leading-relaxed font-black">
                          {renderTextWithTooltips(m.structured.nextStep)}
                        </p>
                      </div>
                    )}

                    {/* Question for User & Options */}
                    {m.structured?.questionForUser && (
                      <div className="mt-4 p-4 bg-slate-900 rounded-xl border-4 border-slate-700 shadow-bento-lg">
                        <p className="text-white text-xs font-black mb-4 uppercase tracking-wider animate-pulse text-center">
                          {m.structured.questionForUser}
                        </p>
                        {m.structured.options && (
                          <div className="grid grid-cols-1 gap-2">
                            {m.structured.options.map((option, i) => (
                              <button
                                key={i}
                                onClick={() => handleSend(option)}
                                className="bg-white hover:bg-blue-50 text-slate-900 text-[10px] font-black py-2.5 px-4 rounded-lg border-2 border-slate-900 shadow-bento-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-left uppercase tracking-tight"
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Grounding Sources */}
                    {m.structured.sources && m.structured.sources.length > 0 && (
                      <div className="pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                          <Globe size={10} /> {t.verifiedSources}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {m.structured.sources.map((source, i) => (
                            <a 
                              key={i}
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[9px] text-blue-600 hover:text-blue-800 underline flex items-center gap-1 font-bold bg-blue-50/50 px-2 py-1 rounded"
                            >
                              {source.title.length > 25 ? source.title.substring(0, 25) + '...' : source.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start" aria-live="assertive">
            <div className="bg-white border-2 border-slate-900 p-3 rounded-lg flex items-center gap-2 shadow-bento-sm">
              <Loader2 size={14} className="animate-spin text-blue-700" aria-hidden="true" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.aiAnalyzing}</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form 
        onSubmit={handleSubmit}
        className="p-4 bg-white border-t-4 border-slate-900 flex gap-2"
      >
        <input
          type="text"
          value={input}
          maxLength={500}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.aiAssistantPlaceholder}
          aria-label={t.aiAssistantPlaceholder}
          className="flex-1 bg-slate-50 border-2 border-slate-900 p-3 text-sm font-bold focus:ring-0 focus:bg-white outline-none transition-all placeholder:text-slate-400 rounded-lg"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
          className="p-3 bg-slate-900 text-white hover:translate-x-0.5 hover:translate-y-0.5 border-2 border-slate-900 shadow-bento-sm hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-slate-500 outline-none rounded-lg"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default AIAssistant;


