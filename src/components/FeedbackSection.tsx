import React, { useState } from 'react';
import { Star, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { submitFeedback } from '../lib/firebase';
import { Language, translations } from '../lib/translations';

const FeedbackSection: React.FC<{ language: Language }> = ({ language }) => {
  const t = translations[language];
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    setIsSubmitting(true);
    try {
      await submitFeedback(rating, comment);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Feedback submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white border-4 border-slate-900 shadow-bento p-8 my-12 relative overflow-hidden" aria-labelledby="feedback-title">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none" aria-hidden="true">
        <Star size={120} />
      </div>

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div 
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 space-y-6"
          >
            <div className="space-y-1">
              <h2 id="feedback-title" className="text-3xl font-black uppercase tracking-tighter">{t.feedbackTitle || "Rate Your Experience"}</h2>
              <p className="text-slate-600 font-bold">{t.feedbackSubtitle || "Help us improve voting assistance for everyone."}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-4">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">{t.feedbackRatingLabel || "How helpful was the AI?"}</span>
                <div role="radiogroup" aria-label="Rating" className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      aria-label={`Rate ${star} out of 5 stars`}
                      aria-checked={rating === star}
                      className={`p-2 rounded-lg border-2 transition-all ${
                        (hover || rating) >= star 
                          ? 'bg-amber-100 border-amber-900 text-amber-900 transform scale-110' 
                          : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                      }`}
                    >
                      <Star size={32} fill={(hover || rating) >= star ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="feedback-comment" className="text-xs font-black uppercase tracking-widest text-slate-400">
                  {t.feedbackCommentLabel || "Additional comments (optional)"}
                </label>
                <textarea
                  id="feedback-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t.feedbackPlaceholder || "What can we do better?"}
                  className="w-full h-24 bg-slate-50 border-2 border-slate-900 p-4 font-bold text-sm outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all rounded-lg"
                />
              </div>

              <button
                type="submit"
                disabled={rating === 0 || isSubmitting}
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white border-4 border-slate-900 shadow-bento hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-black uppercase tracking-widest"
              >
                {isSubmitting ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Send size={20} /></motion.div>
                ) : (
                  <Send size={20} />
                )}
                {t.feedbackSubmit || "Submit Feedback"}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            key="success"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 space-y-4 text-center"
          >
            <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center shadow-bento-sm">
              <CheckCircle2 size={48} />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">{t.feedbackThankYou || "Thank You!"}</h2>
              <p className="text-slate-600 font-bold max-w-sm">{t.feedbackSuccess || "Your feedback helps make Indian democracy more accessible."}</p>
            </div>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="mt-4 text-xs font-black text-blue-600 uppercase tracking-widest hover:underline"
            >
              {t.feedbackAnother || "Send another response"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FeedbackSection;
