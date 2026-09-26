import React from 'react';
import { Menu, Info, Sun, Moon } from 'lucide-react';
import Logo from '../common/Logo';

export default function Header({
  onOpenMobileSidebar,
  conversationTitle,
  onOpenAbout,
  theme,
  onToggleTheme
}) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-200 bg-white/90 backdrop-blur-md dark:border-[#262626] dark:bg-[#0D0D0D]/90 px-4 z-10 flex-shrink-0 transition-colors duration-150">
      {/* Left: Mobile Menu + Conversation Title */}
      <div className="flex items-center gap-3 overflow-hidden">
        <button
          onClick={onOpenMobileSidebar}
          title="Open sidebar"
          aria-label="Open sidebar"
          className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Menu size={18} strokeWidth={1.6} />
        </button>

        <div className="flex items-center gap-2.5 overflow-hidden select-none">
          <div className="md:hidden flex-shrink-0">
            <Logo size={24} />
          </div>
          <h1 className="text-xs md:text-sm font-medium text-zinc-900 dark:text-zinc-200 truncate tracking-tight">
            {conversationTitle || 'CGTMSE Assist'}
          </h1>
        </div>
      </div>

      {/* Right: Institutional Badge & Controls */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] text-zinc-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-500" />
          <span className="font-normal text-[11px]">Scheme Guide</span>
        </div>

        <button
          onClick={onOpenAbout}
          title="About CGTMSE"
          aria-label="About CGTMSE"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Info size={16} strokeWidth={1.6} />
        </button>

        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? "Switch to light theme" : "Switch to dark theme"}
          aria-label={theme === 'dark' ? "Switch to light theme" : "Switch to dark theme"}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          {theme === 'dark' ? (
            <Sun size={16} strokeWidth={1.6} />
          ) : (
            <Moon size={16} strokeWidth={1.6} />
          )}
        </button>
      </div>
    </header>
  );
}
