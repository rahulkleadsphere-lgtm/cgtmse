import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import UserMessage from './UserMessage';
import AssistantMessage from './AssistantMessage';
import TypingIndicator from './TypingIndicator';

export default function MessageList({
  messages,
  isLoading,
  onSelectSuggestion,
  onRetry
}) {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const isNearBottomRef = useRef(true);

  // Check scroll position to determine if we should show "scroll to bottom" button
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    const nearBottom = distanceFromBottom < 120;
    isNearBottomRef.current = nearBottom;
    setShowScrollDown(!nearBottom);
  };

  const scrollToBottom = (behavior = 'smooth') => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior });
    }
  };

  // Scroll to bottom when new messages arrive if user is near bottom
  useEffect(() => {
    if (isNearBottomRef.current) {
      scrollToBottom('smooth');
    }
  }, [messages, isLoading]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="relative flex-1 overflow-y-auto px-4 md:px-6 pt-4 pb-6"
    >
      <div className="flex flex-col space-y-1">
        {messages.map((message) => {
          if (message.role === 'user') {
            return <UserMessage key={message.id} message={message} />;
          }
          return (
            <AssistantMessage
              key={message.id}
              message={message}
              onSelectSuggestion={onSelectSuggestion}
              onRetry={onRetry}
            />
          );
        })}

        {isLoading && !messages.some(m => m.role === 'assistant' && m.isStreaming) && <TypingIndicator />}
        <div ref={bottomRef} className="h-2" />
      </div>

      {/* Floating Scroll to Bottom button */}
      {showScrollDown && (
        <button
          onClick={() => scrollToBottom('smooth')}
          aria-label="Scroll to bottom"
          className="fixed bottom-24 right-6 md:right-10 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-dark-composer border border-dark-border text-text-secondary hover:text-text-primary shadow-lg shadow-black/40 light:bg-white light:border-light-border light:text-text-light-secondary transition-all duration-150 animate-fade-in"
        >
          <ChevronDown size={18} />
        </button>
      )}
    </div>
  );
}
