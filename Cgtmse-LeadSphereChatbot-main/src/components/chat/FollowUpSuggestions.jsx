import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function FollowUpSuggestions({ suggestions, onSelectSuggestion }) {
  if (!Array.isArray(suggestions) || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelectSuggestion(suggestion)}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs text-zinc-700 hover:text-blue-600 hover:bg-zinc-50 border border-zinc-300 hover:border-blue-400 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-700/80 dark:hover:border-zinc-500 transition group shadow-sm"
        >
          <span>{suggestion}</span>
          <ArrowRight size={12} className="text-zinc-400 group-hover:text-blue-500 dark:text-zinc-500 dark:group-hover:text-zinc-300 transition" />
        </button>
      ))}
    </div>
  );
}
