import React, { useEffect, useState } from 'react';
import { FirebaseService } from '../services/firebaseService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { TrendingUp, Users } from 'lucide-react';
import { Language } from '../lib/translations';

interface AnalyticsDashboardProps {
  language: Language;
}

interface TrendItem {
  name: string;
  value: number;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ language }) => {
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [totalInteractions, setTotalInteractions] = useState(0);

  useEffect(() => {
    return FirebaseService.getTrends((data) => {
      const formatted = Object.entries(data).map(([state, count]) => ({
        name: state,
        value: count
      })).sort((a, b) => b.value - a.value).slice(0, 5);
      
      setTrends(formatted);
      setTotalInteractions(Object.values(data).reduce((a, b) => a + b, 0));
    });
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ec4899'];

  return (
    <div className="bg-white border-4 border-slate-900 rounded-[2.5rem] p-10 shadow-bento-lg h-full flex flex-col group bento-hover transition-all duration-300">
      <div className="flex justify-between items-start mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className="text-blue-600" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              {language === 'hi' ? 'लाइव रुझान' : 'LIVE TRENDS'}
            </h3>
          </div>
          <h3 className="text-3xl font-black uppercase tracking-tighter leading-none font-display">
            {language === 'hi' ? 'लोकप्रिय रुचि' : 'Public Interest'}
          </h3>
        </div>
        <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl flex flex-col items-center shadow-bento-sm transform -rotate-3 group-hover:rotate-0 transition-transform">
            <Users size={18} className="mb-1 text-blue-400" />
            <span className="font-black text-sm tracking-tighter">{totalInteractions}+</span>
            <span className="text-[8px] font-bold opacity-50 uppercase tracking-widest">{language === 'hi' ? 'सक्रिय' : 'ACTIVE'}</span>
        </div>
      </div>

      <div className="flex-1 min-h-[300px] relative">
        {trends.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trends} layout="vertical" margin={{ left: -10, right: 30, top: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  width={80}
                  tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.03)', radius: 8 }}
                  content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                      return (
                          <div className="bg-slate-900 text-white p-3 text-[10px] font-black uppercase rounded-xl shadow-xl border-2 border-slate-700">
                            <div className="text-blue-400 mb-1">{payload[0].payload.name}</div>
                            {payload[0].value} {language === 'hi' ? 'अनुयायी' : 'Interactions'}
                          </div>
                      );
                      }
                      return null;
                  }}
                />
                <Bar dataKey="value" radius={[0, 12, 12, 0]} barSize={24}>
                  {trends.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
            </BarChart>
            </ResponsiveContainer>
        ) : (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-slate-300 border-4 border-dashed border-slate-100 rounded-[2rem]">
                <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-blue-500 animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {language === 'hi' ? 'डेटा लोड हो रहा है...' : 'Syncing Community Data...'}
                </span>
            </div>
        )}
      </div>

      <div className="mt-8 p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] relative overflow-hidden group/alert">
        <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic relative z-10">
          {language === 'hi' 
            ? '* यह डेटा उपयोगकर्ताओं की गतिविधियों पर आधारित है और केवल सामुदायिक रुचि को दर्शाता है।'
            : '* Data aggregated from anonymous user interactions. Reflects internal community awareness.'}
        </p>
        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover/alert:scale-125 transition-transform">
          <TrendingUp size={64} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
