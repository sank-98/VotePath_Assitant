import React from 'react';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';

interface GoogleMapEmbedProps {
  address: string;
  className?: string;
}

const GoogleMapEmbed: React.FC<GoogleMapEmbedProps> = ({ address, className = "" }) => {
  const encodedAddress = encodeURIComponent(address);
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.VITE_GOOGLE_MAPS_API_KEY || ''}&q=${encodedAddress}`;

  if (!process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY') {
    return (
      <div className={`bg-slate-100 border-2 border-slate-900 flex flex-col items-center justify-center p-8 text-center rounded-xl ${className}`}>
        <MapPin size={32} className="text-slate-300 mb-2" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Map Preview Unavailable</p>
        <p className="text-[8px] font-bold text-slate-400 mt-1">(Sign in to ECI Portal for Live Maps)</p>
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded shadow-bento-sm hover:translate-y-[-2px] transition-all"
        >
          Open External Map
        </a>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative border-2 border-slate-900 rounded-xl overflow-hidden shadow-bento-sm bg-slate-200 ${className}`}
    >
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={embedUrl}
      ></iframe>
    </motion.div>
  );
};

export default GoogleMapEmbed;
