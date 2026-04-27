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
  const shift = (voterTurnout - 60) * 0.15; // Increased sensitivity
  const baseA = 48;
  const partyA = parseFloat(Math.max(0, Math.min(100, baseA + shift)).toFixed(1));
  const partyB = parseFloat((100 - partyA).toFixed(1));

  const data = [
    { name: language === 'hi' ? 'गठबंधन अ' : 'Party A', value: partyA, color: '#3b82f6' },
    { name: language === 'hi' ? 'गठबंधन ब' : 'Party B', value: partyB, color: '#10b981' },
  ];

  return (
    <div className="bg-white border-4 border-slate-900 shadow-bento rounded-[2rem] overflow-hidden flex flex-col group transition-all duration-300 bento-hover">
      <div className="bg-amber-400 p-5 border-b-4 border-slate-900 flex justify-between items-center group-hover:bg-amber-300 transition-colors">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={18} className="text-slate-900 fill-slate-900" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800">
              {language === 'hi' ? 'सिम्युलेशन' : 'SIMULATION'}
            </h2>
          </div>
          <h2 className="text-xl font-black uppercase tracking-tighter leading-none font-display">
            {language === 'hi' ? 'मतदान का प्रभाव' : 'Voting Impact'}
          </h2>
        </div>
        <TrendingUp size={24} className="text-slate-900 opacity-20 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-8 flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
          <div className="md:col-span-2 space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                {language === 'hi' ? 'मतदाता टर्नआउट' : 'VOTER TURNOUT'}
              </label>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black font-display text-blue-600 tracking-tighter tabular-nums">{voterTurnout}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{language === 'hi' ? 'भागीदारी' : 'PARTICIPATION'}</span>
              </div>
            </div>
            
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={voterTurnout} 
              aria-label={language === 'hi' ? 'मतदाता मतदान प्रतिशत चुनें' : 'Select Voter Turnout Percentage'}
              onChange={(e) => setVoterTurnout(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600 transition-all hover:accent-blue-700"
            />

            <div className="p-4 bg-slate-50 border-2 border-slate-900 border-dashed rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={14} className="text-amber-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{language === 'hi' ? 'महत्वपूर्ण तथ्य' : 'DEMOCRACY ALERT'}</span>
              </div>
              <p className="text-[11px] font-bold text-slate-700 leading-snug">
                {voterTurnout < 50 
                  ? (language === 'hi' 
                      ? "कम टर्नआउट से परिणाम असामान्य हो सकता है।" 
                      : "Low turnout can lead to skewed, unrepresentative outcomes.")
                  : (language === 'hi'
                      ? "उच्च टर्नआउट लोकतंत्र को मजबूत बनाता है।"
                      : "Higher turnout ensures the will of the people is accurately reflected.")}
              </p>
            </div>
          </div>

          <div className="md:col-span-3 h-[180px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" barGap={8}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis type="category" dataKey="name" hide />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    color: '#fff', 
                    borderRadius: '12px', 
                    border: 'none',
                    fontSize: '10px',
                    fontWeight: '900',
                    padding: '8px 12px'
                  }}
                />
                <Bar dataKey="value" radius={[0, 20, 20, 0]} barSize={48}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex flex-col justify-around pointer-events-none pr-4">
              {data.map((item, i) => (
                <div key={i} className="flex justify-between items-center pl-2">
                  <span className="text-[10px] font-black uppercase text-white drop-shadow-md">{item.name}</span>
                  <span className="text-xs font-black text-white drop-shadow-md">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
