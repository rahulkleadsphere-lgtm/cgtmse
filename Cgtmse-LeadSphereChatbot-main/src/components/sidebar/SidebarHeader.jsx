import React from 'react';
import { PanelLeftClose, PanelLeft } from 'lucide-react';
import Logo from '../common/Logo';

export default function SidebarHeader({ isCollapsed, onToggleCollapse }) {
  return (
    <div className="flex h-14 items-center justify-between px-3.5 border-b border-zinc-200 dark:border-[#262626] overflow-hidden flex-shrink-0">
      {/* Brand logo + title (Smoothly hides without popping) */}
      <div 
        className={`flex items-center gap-2.5 overflow-hidden whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
          isCollapsed 
            ? 'max-w-0 opacity-0 pointer-events-none' 
            : 'max-w-[180px] opacity-100'
        }`}
      >
        <Logo size={28} />
        <div className="flex flex-col select-none min-w-0">
          <span className="text-xs font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 truncate">
            CGTMSE Assist
          </span>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-500 font-medium tracking-wide truncate">
            Credit Guarantee Guide
          </span>
        </div>
      </div>

      {/* Toggle button: smoothly centers when collapsed */}
      <button
        onClick={onToggleCollapse}
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={`flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/70 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/70 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] flex-shrink-0 ${
          isCollapsed ? 'mx-auto' : ''
        }`}
      >
        {isCollapsed ? (
          <PanelLeft size={18} strokeWidth={1.6} />
        ) : (
          <PanelLeftClose size={17} strokeWidth={1.6} />
        )}
      </button>
    </div>
  );
}
