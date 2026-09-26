import React from 'react';
import { 
  Landmark, 
  Building2, 
  ShieldCheck, 
  FileCheck, 
  Calculator, 
  Scale,
  ArrowUpRight 
} from 'lucide-react';
import Logo from '../common/Logo';
import { WELCOME_SUGGESTIONS } from '../../constants/suggestions';

const iconMap = {
  Landmark,
  Building2,
  ShieldCheck,
  FileCheck,
  Calculator,
  Scale
};

export default function WelcomeState({ onSelectSuggestion }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 max-w-chat mx-auto w-full animate-fade-in select-none">
      {/* Centered Institutional Logo */}
      <div className="mb-4">
        <Logo size={48} className="shadow-md shadow-black/10 dark:shadow-black/40" />
      </div>

      {/* Headline */}
      <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 text-center mb-1.5">
        How can I help with CGTMSE?
      </h2>

      {/* Supporting text */}
      <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 text-center max-w-md mb-8 leading-relaxed">
        Guidance on credit guarantee cover, eligibility, AGF fee structure, documentation, and claim procedures.
      </p>

      {/* 6 Suggestion Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
        {WELCOME_SUGGESTIONS.map((item) => {
          const IconComponent = iconMap[item.icon] || Landmark;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSuggestion(item.title)}
              className="group flex items-center justify-between rounded-xl bg-white p-3 text-left border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-all duration-150 shadow-sm dark:bg-zinc-900/40 dark:border-zinc-800/90 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/80 dark:shadow-none"
            >
              <div className="flex items-start gap-3 min-w-0 pr-2">
                <div className="mt-0.5 rounded-lg bg-zinc-100 p-2 text-zinc-600 group-hover:text-blue-600 dark:bg-zinc-800/70 dark:text-zinc-400 dark:group-hover:text-blue-400 transition-colors flex-shrink-0">
                  <IconComponent size={16} strokeWidth={1.6} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-zinc-900 group-hover:text-blue-600 dark:text-zinc-200 dark:group-hover:text-white truncate transition-colors">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-500 truncate mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
              <ArrowUpRight 
                size={14} 
                strokeWidth={1.6}
                className="text-zinc-400 opacity-0 group-hover:opacity-100 group-hover:text-zinc-700 dark:text-zinc-500 dark:group-hover:text-zinc-300 transition-all flex-shrink-0" 
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
