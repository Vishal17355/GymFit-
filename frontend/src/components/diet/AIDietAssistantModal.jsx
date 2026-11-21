import React, { useState } from 'react';
import { X, Bot, Sparkles, Send, User, CheckCircle2, Dumbbell, Apple } from 'lucide-react';

export const AIDietAssistantModal = ({ isOpen, onClose, userProfile, targetMacros }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello ${userProfile?.name || 'Athlete'}! I am your GymFit AI Sports Nutrition Assistant. I have tailored guidance ready for your ${userProfile?.fitnessGoal || 'fitness goal'} target of ${targetMacros?.calories || 2400} kcal and ${targetMacros?.protein || 140}g protein. How can I help optimize your meals today?`
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');

  if (!isOpen) return null;

  const quickPrompts = [
    'What should I eat 60 mins before gym?',
    'Hostel-friendly cheap vegetarian protein options?',
    'How do I hit my protein goal without whey?',
    'Best post-workout recovery meal?'
  ];

  const handleSend = (queryText) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    const userMsg = { sender: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    // Generate intelligent contextual response
    setTimeout(() => {
      let reply = '';
      const l = q.toLowerCase();

      if (l.includes('before gym') || l.includes('pre-workout')) {
        reply = `For optimal gym performance, consume easily digestible complex carbohydrates and moderate protein 45-60 mins prior. Recommended combo: 1 medium banana + 1 slice whole-wheat toast with 1 tbsp peanut butter, or 40g oats in water with a pinch of salt. Avoid heavy fats before training to prevent sluggishness!`;
      } else if (l.includes('hostel') || l.includes('cheap') || l.includes('budget')) {
        reply = `Hostel-friendly budget protein champions in India:\n1. Soya Chunks (52% protein by weight, ~₹45 for 200g).\n2. Roasted Chana (Bhuna Chana - no cooking required, great snack).\n3. Boiled Eggs (if eggetarian, 6g protein per egg).\n4. Curd & Peanut Butter Sandwich.\n5. Sattu / Sprouted Moong!`;
      } else if (l.includes('without whey') || l.includes('no whey') || l.includes('whey')) {
        reply = `To hit ${targetMacros?.protein || 140}g protein without whey protein powder:\n• 100g Paneer/Tofu = ~18-24g protein\n• 50g Soya Chunks = 26g protein\n• 200g Dal/Rajma = 12-14g protein\n• 200g Curd = 7g protein\n• 4 Egg Whites (if consumed) = 15g protein\nCombining these across 4 meals easily exceeds your target naturally!`;
      } else if (l.includes('post-workout') || l.includes('recovery')) {
        reply = `Within 45-90 minutes post-training, replenish glycogen stores and trigger muscle protein synthesis (MPS). Recommended: 1 scoop whey or 4 egg whites or 100g low-fat paneer paired with 1 banana or a bowl of white rice for fast glycogen recovery.`;
      } else {
        reply = `Based on your ${userProfile?.dietType || 'Vegetarian'} preference and ${targetMacros?.protein || 140}g daily protein target: Focus on consistent meal spacing (every 3-4 hours) with at least 25-35g of protein per meal to maximize muscle protein synthesis. Drink 3.5L of water daily to support nutrient absorption!`;
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl h-[85vh] max-h-[700px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                  AI Nutrition Coach
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                GymFit Diet Assistant
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-500 hover:text-white text-slate-400 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                  m.sender === 'user'
                    ? 'bg-amber-500 text-slate-950 font-bold rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700/60'
                }`}
              >
                {m.text}
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Question Chips */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 overflow-x-auto flex gap-1.5 scrollbar-none">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(qp)}
              className="text-[11px] whitespace-nowrap px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-500 hover:text-amber-500 transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about meals, protein, food swaps..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
          />

          <button
            type="button"
            onClick={() => handleSend()}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
