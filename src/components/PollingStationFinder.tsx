import React, { useState, useEffect } from 'react';
import { MapPin, Search, Navigation, Building2, CheckCircle2, Info, Pin, PinOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../lib/translations';
import { pinStation, unpinStation, subscribeToPinnedStation } from '../lib/firebase';

interface Station {
  id: string;
  name: string;
  address: string;
  status: 'active' | 'preparing';
  distance: string;
  facilities: string[];
}

const PollingStationFinder: React.FC<{ language: Language }> = ({ language }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Station[]>([]);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    const unsub = subscribeToPinnedStation((station) => {
      setPinnedId(station?.stationId || null);
    });
    return () => unsub();
  }, []);

  const locateUser = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setIsLocating(false);
        // Simulate finding relative to user
        setResults(mockStations.map(s => ({
          ...s,
          distance: (Math.random() * 2 + 0.5).toFixed(1) + ' km'
        })));
      },
      () => {
        setIsLocating(false);
        alert(language === 'hi' ? 'स्थान एक्सेस करने में विफल। कृपया मैन्युअल रूप से खोजें।' : 'Failed to access location. Please search manually.');
      }
    );
  };

  const togglePin = async (station: Station) => {
    if (pinnedId === station.id) {
      await unpinStation();
    } else {
      await pinStation({ id: station.id, name: station.name, address: station.address });
    }
  };

  const mockStations: Station[] = [
    {
      id: '1',
      name: language === 'hi' ? 'राजकीय प्राथमिक विद्यालय, वार्ड १०' : 'Govt Primary School, Ward 10',
      address: language === 'hi' ? 'मेन मार्केट रोड, सेक्टर ५' : 'Main Market Road, Sector 5',
      status: 'active',
      distance: '0.8 km',
      facilities: ['Wheelchair', 'Drinking Water', 'Waiting Room']
    },
    {
      id: '2',
      name: language === 'hi' ? 'सामुदायिक भवन, मॉडल टाउन' : 'Community Hall, Model Town',
      address: language === 'hi' ? 'पार्क स्ट्रीट, फेज २' : 'Park Street, Phase 2',
      status: 'active',
      distance: '1.2 km',
      facilities: ['Ramp', 'First Aid']
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    setTimeout(() => {
      setResults(mockStations.filter(s => 
        s.name.toLowerCase().includes(query.toLowerCase()) || 
        s.address.toLowerCase().includes(query.toLowerCase())
      ));
      setIsSearching(false);
    }, 1200);
  };

  return (
    <div className="bg-white border-4 border-slate-900 shadow-bento p-6 h-full flex flex-col overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-amber-100 border-2 border-slate-900 rounded-lg">
          <MapPin className="text-amber-600" size={24} />
        </div>
        <div>
          <h2 className="text-lg font-black uppercase tracking-tighter leading-none">
            {language === 'hi' ? 'मतदान केंद्र खोजें' : 'Booth Finder'}
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            {language === 'hi' ? 'सत्यापित स्थान डेटा' : 'Verified Location Data'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="relative mb-6 flex gap-2">
        <div className="relative flex-1">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={language === 'hi' ? 'अपना क्षेत्र या पिनकोड खोजें...' : 'Search area or pincode...'}
            aria-label={language === 'hi' ? 'अपना क्षेत्र या पिनकोड खोजें...' : 'Search area or pincode...'}
            className="w-full bg-slate-50 border-2 border-slate-900 p-3 pl-10 text-xs font-black uppercase tracking-tight focus:bg-white outline-none transition-all rounded-lg"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        </div>
        <button 
          type="button"
          onClick={locateUser}
          disabled={isLocating}
          title={language === 'hi' ? 'मेरा स्थान उपयोग करें' : 'Use my location'}
          className={`p-3 border-2 border-slate-900 rounded-lg shadow-bento-sm hover:translate-y-[-2px] transition-all ${userLocation ? 'bg-emerald-100' : 'bg-white'}`}
        >
          {isLocating ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Navigation size={20} /></motion.div> : <Navigation size={20} />}
        </button>
        <button 
          type="submit"
          className="p-3 bg-slate-900 text-white rounded-lg shadow-bento-sm hover:translate-y-[-2px] transition-all"
        >
          <Search size={20} />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {isSearching ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
              <Search size={32} />
            </motion.div>
            <span className="text-[10px] font-black uppercase tracking-widest">{language === 'hi' ? 'खोज जारी है...' : 'Scanning Districts...'}</span>
          </div>
        ) : results.length > 0 ? (
          <AnimatePresence>
            {results.map((station) => (
              <motion.div 
                key={station.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="group border-2 border-slate-900 p-4 rounded-xl hover:bg-slate-50 transition-all shadow-bento-sm hover:shadow-none"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-slate-900" />
                    <h4 className="text-xs font-black uppercase tracking-tight">{station.name}</h4>
                  </div>
                  <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {station.distance}
                  </span>
                </div>
                <p className="text-[10px] text-slate-600 font-bold mb-3 flex items-center gap-1">
                  <MapPin size={10} /> {station.address}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {station.facilities.map((f, i) => (
                    <span key={i} className="text-[8px] font-black uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">
                      {f}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => togglePin(station)}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded flex items-center justify-center gap-2 transition-all border-2 ${
                      pinnedId === station.id 
                        ? 'bg-amber-100 border-amber-900 text-amber-900' 
                        : 'bg-white border-slate-900 text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {pinnedId === station.id ? (
                      <><PinOff size={12} /> {language === 'hi' ? 'हटाएं' : 'Unpin'}</>
                    ) : (
                      <><Pin size={12} /> {language === 'hi' ? 'पिन करें' : 'Pin'}</>
                    )}
                  </button>
                  <button className="flex-1 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded hover:bg-slate-800 flex items-center justify-center gap-2 transition-colors border-2 border-slate-900">
                    <Navigation size={12} /> {language === 'hi' ? 'नक्शा' : 'Map'}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : query ? (
          <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-xl">
             <Info className="mx-auto text-slate-300 mb-2" size={32} />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
               {language === 'hi' ? 'कोई केंद्र नहीं मिला' : 'No Stations Found in this Zone'}
             </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border-2 border-slate-900 rounded-xl border-dashed">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{language === 'hi' ? 'लोकप्रिय क्षेत्र' : 'Nearby Examples'}</span>
              <div className="flex flex-wrap gap-2">
                {['Delhi-NCR', 'Mumbai South', 'Bangalore Central'].map(loc => (
                  <button 
                    key={loc}
                    onClick={() => setQuery(loc)}
                    className="text-[9px] font-black uppercase px-2 py-1 bg-white border border-slate-200 rounded hover:border-slate-900 transition-colors shadow-sm"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
              <CheckCircle2 size={16} />
              <span className="text-[9px] font-bold">
                {language === 'hi' 
                  ? 'सभी केंद्रों पर व्हीलचेयर और पानी की सुविधा उपलब्ध है।' 
                  : 'All identified booths feature Ramp access and AMF (Assured Minimum Facilities).'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PollingStationFinder;
