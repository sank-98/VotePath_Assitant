import React, { useEffect, useState } from 'react';
import { FirebaseService } from '../services/firebaseService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
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

  const COLORS = ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b'];

  return (
    <div className="bg-white border-4 border-slate-900 rounded-3xl p-8 shadow-bento h-full flex flex-col">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-3xl font-black uppercase tracking-tighter leading-tight">
            {language === 'hi' ? 'लोकप्रिय रुझान' : 'DEMOCRACY TRENDS'}
          </h3>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
            <TrendingUp size={12} />
            {language === 'hi' ? 'वास्तविक समय डेटा' : 'REAL-TIME COMMUNITY INTEREST'}
          </p>
        </div>
        <div className="bg-slate-900 text-white p-3 rounded-xl flex flex-col items-center">
            <Users size={16} className="mb-1" />
            <span className="font-black text-xs">{totalInteractions}+</span>
        </div>
      </div>

      <div className="flex-1 min-h-[250px]">
        {trends.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trends} layout="vertical" margin={{ left: 10, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 900, fill: '#0f172a' }}
                />
                <Tooltip 
                cursor={{ fill: 'transparent' }}
                content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                    return (
                        <div className="bg-slate-900 text-white p-2 text-[10px] font-black uppercase rounded shadow-lg">
                        {payload[0].value} {language === 'hi' ? 'अनुयायी' : 'Followers'}
                        </div>
                    );
                    }
                    return null;
                }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                {trends.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Bar>
            </BarChart>
            </ResponsiveContainer>
        ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs font-bold uppercase tracking-widest border-2 border-dashed border-slate-200 rounded-2xl">
                {language === 'hi' ? 'डेटा लोड हो रहा है...' : 'Syncing Live Trends...'}
            </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl">
        <p className="text-[9px] font-black uppercase text-slate-500 leading-relaxed italic">
          {language === 'hi' 
            ? '* यह डेटा उपयोगकर्ताओं की गतिविधियों पर आधारित है और वास्तविक मतदान रुझानों का प्रतिनिधित्व नहीं करता है।'
            : '* Data aggregated from anonymous user interactions. Does not represent official voting outcomes.'}
        </p>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
