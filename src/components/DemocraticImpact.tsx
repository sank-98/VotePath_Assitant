import React, { useState } from 'react';
import { Language } from '../lib/translations';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Zap, AlertTriangle, TrendingUp } from 'lucide-react';

interface DemocraticImpactProps {
  language: Language;
}

export default function DemocraticImpact({ language }: DemocraticImpactProps) {
  const [voterTurnout, setVoterTurnout] = useState(67);

  // Derive simulation logic: Higher turnout changes margins
  const shift = (voterTurnout - 60) * 0.1;
  const partyA = parseFloat(Math.max(0, Math.min(100, 48 + shift)).toFixed(1));
  const partyB = parseFloat((100 - partyA).toFixed(1));

  const data = [
    { name: language === 'hi' ? 'गठबंधन अ' : 'Party A', value: partyA, color: '#2563eb' },
    { name: language === 'hi' ? 'गठबंधन ब' : 'Party B', value: partyB, color: '#10b981' },
  ];

  return (
    <div className="bg-white border-4 border-slate-900 shadow-bento rounded-xl overflow-hidden">
      <div className="bg-amber-400 p-4 border-b-4 border-slate-900 flex justify-between items-center">
        <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
          <Zap size={18} />
          {language === 'hi' ? 'मतदान का प्रभाव सिम्युलेटर' : 'Voting Impact Simulator'}
        </h2>
        <TrendingUp size={20} className="text-slate-900" />
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-black uppercase tracking-tighter">
              {language === 'hi' ? 'मतदाता मतदान (टर्नआउट)' : 'Voter Turnout'}
            </h3>
            <p className="text-xs text-slate-500 font-medium mb-4">
              {language === 'hi' 
                ? 'स्लाइडर को यह देखने के लिए ले जाएं कि बदलता हुआ टर्नआउट चुनाव के परिणाम को कैसे बदल सकता है।'
                : 'Move the slider to see how changing turnout could shift the election outcome.'}
            </p>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={voterTurnout} 
              aria-label={language === 'hi' ? 'मतदाता मतदान प्रतिशत चुनें' : 'Select Voter Turnout Percentage'}
              aria-valuemin={10}
              aria-valuemax={100}
              aria-valuenow={voterTurnout}
              onChange={(e) => setVoterTurnout(parseInt(e.target.value))}
              className="w-full h-4 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900 border-2 border-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <div className="flex justify-between font-black text-xl">
              <span>10%</span>
              <span className="text-4xl text-blue-600">{voterTurnout}%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-2 border-slate-900 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} className="text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">{language === 'hi' ? 'महत्वपूर्ण तथ्य' : 'The Reality'}</span>
            </div>
            <p className="text-xs font-bold text-slate-600 leading-relaxed italic">
              {voterTurnout < 50 
                ? (language === 'hi' 
                    ? "जब आधे से कम लोग मतदान करते हैं, तो अल्पसंख्यक बहुमत पर निर्णय लेते हैं।" 
                    : "When less than half the people vote, a minority decides for the majority.")
                : (language === 'hi'
                    ? "उच्च मतदान का अर्थ है अधिक प्रतिनिधि परिणाम और अधिक स्थिर लोकतंत्र।"
                    : "High turnout means a more representative result and a more stable democracy.")}
            </p>
          </div>
        </div>

        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: -20, right: 30, top: 20 }}>
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis type="category" dataKey="name" fontSize={10} width={70} stroke="#0f172a" fontWeight="900" />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  color: '#fff', 
                  borderRadius: '8px', 
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-8 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 border border-slate-900" />
              <span className="text-[10px] font-black uppercase">{language === 'hi' ? 'पार्टी अ' : 'Party A'}: {partyA}%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-600 border border-slate-900" />
              <span className="text-[10px] font-black uppercase">{language === 'hi' ? 'पार्टी ब' : 'Party B'}: {partyB}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
