import React, { useEffect } from 'react';
import AppLayout from './components/layout/AppLayout';
import ChatView from './components/chat/ChatView';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { useChat } from './hooks/useChat';

export default function App() {
  const {
    conversations,
    activeConversation,
    activeConvId,
    isLoading,
    sendMessage,
    retryLastMessage,
    abortRequest,
    startNewChat,
    selectConversation,
    deleteConversation
  } = useChat();

  // Keyboard shortcut: Cmd+N or Ctrl+N / Ctrl+K for new chat
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        startNewChat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [startNewChat]);

  return (
    <ErrorBoundary>
      <AppLayout
        conversations={conversations}
        activeConvId={activeConvId}
        activeConversation={activeConversation}
        onSelectConversation={selectConversation}
        onDeleteConversation={deleteConversation}
        onNewChat={startNewChat}
      >
        <ChatView
          conversation={activeConversation}
          isLoading={isLoading}
          onSendMessage={sendMessage}
          onRetry={retryLastMessage}
          onAbortRequest={abortRequest}
        />
      </AppLayout>
    </ErrorBoundary>
  );
}
