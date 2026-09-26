import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Header from './Header';
import AboutModal from '../common/AboutModal';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function AppLayout({
  children,
  conversations,
  activeConvId,
  activeConversation,
  onSelectConversation,
  onDeleteConversation,
  onNewChat
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useLocalStorage('cgtmse-sidebar-collapsed-v1', false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [theme, setTheme] = useLocalStorage('cgtmse-assist-theme-v1', 'dark');

  // Synchronize theme class with document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="flex h-screen h-[100dvh] w-screen overflow-hidden bg-white text-zinc-900 dark:bg-[#0D0D0D] dark:text-[#ECECEC] transition-colors duration-150">
      {/* Collapsible Sidebar / Mobile Drawer */}
      <Sidebar
        conversations={conversations}
        activeConvId={activeConvId}
        onSelectConversation={onSelectConversation}
        onDeleteConversation={onDeleteConversation}
        onNewChat={onNewChat}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenAbout={() => setIsAboutOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Conversation Area */}
      <main className="flex flex-1 flex-col h-full min-w-0 overflow-hidden relative bg-[#F8F9FA] dark:bg-[#0D0D0D] transition-colors duration-150">
        <Header
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          conversationTitle={activeConversation?.title}
          onOpenAbout={() => setIsAboutOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* Chat viewport */}
        <div className="flex-1 min-h-0 relative">
          {children}
        </div>
      </main>

      {/* About & Sources Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}
