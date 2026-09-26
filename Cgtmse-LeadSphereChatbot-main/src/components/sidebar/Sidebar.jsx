import React from 'react';
import { Info, Sun, Moon, User } from 'lucide-react';
import SidebarHeader from './SidebarHeader';
import NewChatButton from './NewChatButton';
import ChatHistory from './ChatHistory';

export default function Sidebar({
  conversations,
  activeConvId,
  onSelectConversation,
  onDeleteConversation,
  onNewChat,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  onOpenAbout,
  theme,
  onToggleTheme
}) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-fade-in"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-[#F8F9FA] text-zinc-900 border-r border-zinc-200 dark:bg-[#090909] dark:text-[#ECECEC] dark:border-[#262626] transition-[width,transform] duration-300 ease-[cubic-bezier(0.2,0,0,1)] will-change-[width,transform] overflow-hidden select-none md:static ${
          // Mobile state
          isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'
        } ${
          // Desktop collapsed vs expanded
          isCollapsed ? 'md:w-[68px]' : 'md:w-[260px]'
        }`}
      >
        {/* Top: Header */}
        <SidebarHeader
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
        />

        {/* Action: New Chat */}
        <NewChatButton
          onClick={() => {
            onNewChat();
            if (isMobileOpen) onCloseMobile();
          }}
          isCollapsed={isCollapsed}
        />

        <div className="mx-3 my-1 border-t border-zinc-200 dark:border-[#222222]" />

        {/* Conversation History */}
        <ChatHistory
          conversations={conversations}
          activeConvId={activeConvId}
          onSelectConversation={(id) => {
            onSelectConversation(id);
            if (isMobileOpen) onCloseMobile();
          }}
          onDeleteConversation={onDeleteConversation}
          isCollapsed={isCollapsed}
        />

        {/* Bottom Actions & User Profile */}
        <div className="border-t border-zinc-200 dark:border-[#222222] px-2 py-2 space-y-0.5 overflow-hidden flex-shrink-0">
          {/* About CGTMSE */}
          <button
            onClick={onOpenAbout}
            title="About CGTMSE Scheme & Portals"
            aria-label="About CGTMSE Scheme & Portals"
            className={`flex items-center rounded-lg text-xs text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/70 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/60 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] overflow-hidden ${
              isCollapsed ? 'h-9 w-9 mx-auto justify-center p-0' : 'h-9 w-full px-2.5'
            }`}
          >
            <Info size={16} strokeWidth={1.6} className="flex-shrink-0" />
            <span 
              className={`font-normal whitespace-nowrap overflow-hidden transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)] ${
                isCollapsed 
                  ? 'max-w-0 opacity-0 pointer-events-none ml-0' 
                  : 'max-w-[170px] opacity-100 ml-2.5'
              }`}
            >
              About CGTMSE
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className={`flex items-center rounded-lg text-xs text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/70 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/60 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] overflow-hidden ${
              isCollapsed ? 'h-9 w-9 mx-auto justify-center p-0' : 'h-9 w-full px-2.5'
            }`}
          >
            {theme === 'dark' ? (
              <Sun size={16} strokeWidth={1.6} className="flex-shrink-0" />
            ) : (
              <Moon size={16} strokeWidth={1.6} className="flex-shrink-0" />
            )}
            <span 
              className={`font-normal whitespace-nowrap overflow-hidden transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)] ${
                isCollapsed 
                  ? 'max-w-0 opacity-0 pointer-events-none ml-0' 
                  : 'max-w-[170px] opacity-100 ml-2.5'
              }`}
            >
              {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
            </span>
          </button>

          {/* Institutional User Profile */}
          <div
            className={`flex items-center rounded-lg text-xs transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] overflow-hidden ${
              isCollapsed ? 'h-9 w-9 mx-auto justify-center p-0' : 'h-9 w-full px-2.5'
            }`}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-200 text-zinc-700 border border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700/60 dark:text-zinc-400 flex-shrink-0">
              <User size={13} strokeWidth={1.6} />
            </div>
            <div 
              className={`flex flex-col overflow-hidden whitespace-nowrap transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)] ${
                isCollapsed 
                  ? 'max-w-0 opacity-0 pointer-events-none ml-0' 
                  : 'max-w-[170px] opacity-100 ml-2.5'
              }`}
            >
              <span className="text-[11px] font-medium text-zinc-800 dark:text-zinc-200 truncate">
                Enterprise Portal
              </span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-500 truncate">
                SIDBI & MSME Guide
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
