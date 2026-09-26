import React from 'react';
import Logo from '../common/Logo';

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 py-4 max-w-chat mx-auto w-full animate-fade-in">
      <Logo size={28} className="mt-0.5 flex-shrink-0" />
      <div className="flex flex-col gap-1.5 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            CGTMSE Assist
          </span>
          <span className="text-[10px] text-zinc-500 font-normal">
            processing
          </span>
        </div>

        <div className="inline-flex items-center gap-2.5 rounded-xl bg-zinc-100 px-3.5 py-2 border border-zinc-200 text-xs text-zinc-700 dark:bg-zinc-900/80 dark:border-zinc-800 dark:text-zinc-300 shadow-sm">
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Consulting CGTMSE knowledge base...
          </span>
        </div>
      </div>
    </div>
  );
}
