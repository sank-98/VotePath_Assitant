import React, { useMemo } from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer
} from 'recharts';
import { DecisionEngine } from '../logic/decisionEngine';
import { Language } from '../lib/translations';
import { CheckCircle2, ChevronRight, Info } from 'lucide-react';

interface ExplainableMatchingProps {
  language: Language;
  userWeights: Record<string, number>;
}

const ExplainableMatching: React.FC<ExplainableMatchingProps> = ({ language, userWeights }) => {
  const engine = useMemo(() => new DecisionEngine(), []);
  const results = useMemo(() => engine.calculateMatch(userWeights), [userWeights, engine]);
  
  const issues = engine.getIssues();
  const topMatch = results[0];
  if (!topMatch) return null;
  const candidate = engine.getCandidate(topMatch.candidateId);

  const chartData = issues.map(issue => ({
    subject: issue.label[language],
    A: topMatch.breakdown[issue.id] || 0,
    fullMark: 10,
  }));

  if (!candidate) return null;

  return (
    <div className="space-y-6">
      <div className="bg-emerald-50 border-4 border-emerald-900 rounded-3xl p-8 shadow-bento">
        <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                        {Math.round(topMatch.confidence)}% {language === 'hi' ? 'मिलता है' : 'MATCH'}
                    </span>
                    <span className="text-emerald-900 font-black uppercase text-[10px] tracking-widest flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        {language === 'hi' ? 'शीर्ष अनुशंसा' : 'TOP RECOMMENDATION'}
                    </span>
                </div>
                
                <h3 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">
                    {candidate.name[language]}
                </h3>
                <p className="text-emerald-800 font-bold uppercase text-xs tracking-widest">
                    {candidate.party[language]}
                </p>

                <div className="pt-4 space-y-2">
                    <p className="text-xs font-bold text-slate-600 leading-relaxed max-w-md">
                        {language === 'hi' 
                            ? 'यह उम्मीदवार आपकी प्राथमिकताओं के साथ सबसे अधिक संरेखित है, विशेष रूप से आपके द्वारा चुने गए मुद्दों पर उनकी मजबूती के कारण।'
                            : 'This candidate aligns most closely with your priorities, particularly due to their strong stance on the issues you highlighted as critical.'}
                    </p>
                </div>
            </div>

            <div className="w-full md:w-64 h-64 bg-white/50 rounded-2xl p-4 border-2 border-emerald-200">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                        <PolarGrid stroke="#065f46" strokeOpacity={0.1} />
                        <PolarAngleAxis 
                            dataKey="subject" 
                            tick={{ fill: '#065f46', fontSize: 8, fontWeight: 900 }} 
                        />
                        <PolarRadiusAxis 
                            angle={30} 
                            domain={[0, 10]} 
                            tick={false} 
                            axisLine={false} 
                        />
                        <Radar
                            name="Candidate"
                            dataKey="A"
                            stroke="#065f46"
                            fill="#10b981"
                            fillOpacity={0.6}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.slice(1, 3).map((result, idx) => {
            const cand = engine.getCandidate(result.candidateId);
            if (!cand) return null;
            return (
                <div key={cand.id} className="bg-white border-2 border-slate-900 p-6 rounded-2xl flex justify-between items-center group hover:bg-slate-50 transition-colors">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                {idx === 0 ? (language === 'hi' ? 'दूसरा विकल्प' : 'SECOND CHOICE') : (language === 'hi' ? 'तीसरा विकल्प' : 'THIRD CHOICE')}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400">
                                {Math.round(result.confidence)}%
                            </span>
                        </div>
                        <h4 className="text-lg font-black uppercase tracking-tight text-slate-900">
                            {cand.name[language]}
                        </h4>
                    </div>
                    <ChevronRight className="text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" size={20} />
                </div>
            );
        })}
      </div>
      
      <div className="p-4 bg-blue-50 border-2 border-blue-100 rounded-2xl flex gap-3 items-start">
        <Info className="text-blue-600 shrink-0" size={18} />
        <p className="text-[10px] font-bold text-blue-800 leading-relaxed">
            {language === 'hi'
                ? 'यह विश्लेषण एक भारित औसत स्कोरिंग प्रणाली का उपयोग करता है। प्रयुक्त सूत्र: Σ (मुद्दा_स्कोर * उपयोगकर्ता_महत्व) / अधिकतम_संभव_स्कोर।'
                : 'This analysis utilizes a weighted average scoring system. Formula used: Σ (Issue_Score × User_Importance) / Max_Possible_Score.'}
        </p>
      </div>
    </div>
  );
};

export default ExplainableMatching;
