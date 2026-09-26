import React from 'react';
import { Plus } from 'lucide-react';

export default function NewChatButton({ onClick, isCollapsed }) {
  return (
    <div className="px-3 py-2 overflow-hidden flex-shrink-0">
      <button
        onClick={onClick}
        title="New chat (Ctrl+N)"
        aria-label="New chat"
        className={`flex items-center rounded-lg bg-white border border-zinc-300 hover:bg-zinc-100 hover:border-zinc-400 hover:text-zinc-950 dark:bg-zinc-900/70 dark:text-zinc-200 dark:border-zinc-800 dark:hover:bg-zinc-800/80 dark:hover:border-zinc-700 dark:hover:text-white transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] group shadow-sm overflow-hidden ${
          isCollapsed 
            ? 'h-9 w-9 justify-center mx-auto p-0' 
            : 'h-9 w-full px-3 justify-between'
        }`}
      >
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <Plus 
            size={16} 
            strokeWidth={1.8} 
            className="text-zinc-500 group-hover:text-zinc-800 dark:text-zinc-400 dark:group-hover:text-zinc-200 transition-colors flex-shrink-0" 
          />
          <span 
            className={`text-xs font-medium whitespace-nowrap overflow-hidden transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)] ${
              isCollapsed 
                ? 'max-w-0 opacity-0 pointer-events-none' 
                : 'max-w-[120px] opacity-100'
            }`}
          >
            New chat
          </span>
        </div>

        <span 
          className={`text-[10px] text-zinc-400 dark:text-zinc-500 font-mono tracking-wider whitespace-nowrap overflow-hidden transition-all duration-200 ${
            isCollapsed 
              ? 'max-w-0 opacity-0 pointer-events-none' 
              : 'max-w-[60px] opacity-100'
          }`}
        >
          Ctrl+N
        </span>
      </button>
    </div>
  );
}
