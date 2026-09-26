import React from 'react';
import WelcomeState from './WelcomeState';
import MessageList from './MessageList';
import ChatComposer from './ChatComposer';

export default function ChatView({
  conversation,
  isLoading,
  onSendMessage,
  onRetry,
  onAbortRequest
}) {
  const messages = conversation?.messages || [];
  const hasMessages = messages.length > 0;

  return (
    <div className="relative flex flex-1 flex-col h-full overflow-hidden bg-[#F8F9FA] dark:bg-[#0D0D0D] transition-colors duration-150">
      {/* Messages area or Welcome landing */}
      {hasMessages ? (
        <MessageList
          messages={messages}
          isLoading={isLoading}
          onSelectSuggestion={onSendMessage}
          onRetry={onRetry}
        />
      ) : (
        <div className="flex-1 overflow-y-auto flex items-center justify-center">
          <WelcomeState onSelectSuggestion={onSendMessage} />
        </div>
      )}

      {/* Fixed/Sticky Composer */}
      <ChatComposer
        onSendMessage={onSendMessage}
        onAbortRequest={onAbortRequest}
        isLoading={isLoading}
      />
    </div>
  );
}
