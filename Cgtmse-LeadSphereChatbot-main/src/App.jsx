import React, { useState } from 'react';
import GmsPortalPage from './components/portal/GmsPortalPage';
import AwsChatWidget from './components/chatbot/AwsChatWidget';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { useChat } from './hooks/useChat';

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const {
    activeConversation,
    isLoading,
    sendMessage,
    retryLastMessage,
    abortRequest,
    startNewChat
  } = useChat();

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen w-full bg-[#f8f9fa] text-slate-800">
        
        {/* Main Single Page: CGTMSE GMS Portal Login Clone */}
        <GmsPortalPage onOpenChat={() => setIsChatOpen(true)} />

        {/* Floating AWS-Style Chat Widget at Bottom-Right */}
        <AwsChatWidget
          conversation={activeConversation}
          isLoading={isLoading}
          onSendMessage={sendMessage}
          onRetry={retryLastMessage}
          onAbortRequest={abortRequest}
          onNewChat={startNewChat}
          isOpen={isChatOpen}
          setIsOpen={setIsChatOpen}
        />

      </div>
    </ErrorBoundary>
  );
}
