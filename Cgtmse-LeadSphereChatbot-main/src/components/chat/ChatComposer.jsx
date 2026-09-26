import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Square, AlertTriangle } from 'lucide-react';

const MAX_INPUT_CHARS = 4000;
const WARN_INPUT_CHARS = 3200;

export default function ChatComposer({
  onSendMessage,
  onAbortRequest,
  isLoading,
  placeholder = "Ask anything about CGTMSE..."
}) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  const charCount = input.length;
  const isTooLong = charCount > MAX_INPUT_CHARS;
  const isWarning = charCount > WARN_INPUT_CHARS;

  // Auto-grow textarea height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const nextHeight = Math.min(Math.max(textarea.scrollHeight, 24), 160);
    textarea.style.height = `${nextHeight}px`;
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isTooLong) return;
      handleSubmit();
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (isLoading || isTooLong) return;
    if (!input.trim()) return;

    const message = input;
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    onSendMessage(message);
  };

  const isSendDisabled = !input.trim() || isLoading || isTooLong;

  return (
    <div className="w-full bg-gradient-to-t from-[#F8F9FA] via-[#F8F9FA]/95 to-transparent pt-3 pb-4 px-4 dark:from-[#0D0D0D] dark:via-[#0D0D0D]/95 z-10 flex-shrink-0 transition-colors duration-150">
      <div className="max-w-chat mx-auto w-full">
        {/* Context length error banner when input is too lengthy */}
        {isTooLong && (
          <div className="mb-2 flex items-center justify-between gap-2 rounded-xl bg-red-50 border border-red-200 px-3.5 py-2 text-xs text-red-800 dark:bg-red-950/40 dark:border-red-800/60 dark:text-red-300 animate-fade-in shadow-sm">
            <div className="flex items-center gap-2 min-w-0">
              <AlertTriangle size={15} className="flex-shrink-0 text-red-600 dark:text-red-400" />
              <span className="font-medium">
                Input is too lengthy ({charCount.toLocaleString()} / {MAX_INPUT_CHARS.toLocaleString()} characters).
              </span>
            </div>
            <span className="text-[11px] text-red-600 dark:text-red-400 flex-shrink-0 font-medium">
              Please shorten by {(charCount - MAX_INPUT_CHARS).toLocaleString()} chars
            </span>
          </div>
        )}

        {/* Approaching limit warning */}
        {isWarning && !isTooLong && (
          <div className="mb-2 flex items-center justify-between gap-2 rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-1.5 text-xs text-amber-800 dark:bg-amber-950/40 dark:border-amber-800/60 dark:text-amber-300 animate-fade-in">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="flex-shrink-0 text-amber-600 dark:text-amber-400" />
              <span>Approaching context limit ({charCount.toLocaleString()} / {MAX_INPUT_CHARS.toLocaleString()} characters)</span>
            </div>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              {MAX_INPUT_CHARS - charCount} left
            </span>
          </div>
        )}

        {/* Rounded composer card */}
        <form
          onSubmit={handleSubmit}
          className={`relative flex items-end gap-2 rounded-2xl bg-white p-2 sm:p-2.5 border shadow-md dark:bg-[#1C1C1E] dark:shadow-xl dark:shadow-black/30 transition-all ${
            isTooLong
              ? 'border-red-400 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500/20 dark:border-red-500/50'
              : isWarning
              ? 'border-amber-400 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500/20 dark:border-amber-500/50'
              : 'border-zinc-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20 dark:border-[#2C2C2E] dark:focus-within:border-zinc-500 dark:focus-within:ring-zinc-600/40'
          }`}
        >
          {/* Auto-growing Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 max-h-[160px] min-h-[26px] resize-none bg-transparent px-2.5 py-1 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500 leading-relaxed"
            aria-label="Ask CGTMSE Assist"
          />

          {/* Character counter (shown when typing exceeds 500 characters) */}
          {charCount > 500 && (
            <span
              className={`text-[10px] self-end mb-1 px-1.5 py-0.5 rounded select-none transition-colors ${
                isTooLong
                  ? 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/40 font-semibold'
                  : isWarning
                  ? 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/40 font-medium'
                  : 'text-zinc-400 dark:text-zinc-500'
              }`}
            >
              {charCount.toLocaleString()}/{MAX_INPUT_CHARS.toLocaleString()}
            </span>
          )}

          {/* Action Button: Send or Stop */}
          {isLoading ? (
            <button
              type="button"
              onClick={onAbortRequest}
              title="Stop generating"
              aria-label="Stop generating"
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-200 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 transition flex-shrink-0"
            >
              <Square size={12} className="fill-current" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSendDisabled}
              title={isTooLong ? "Input is too lengthy to send" : "Send message"}
              aria-label="Send message"
              className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-150 flex-shrink-0 ${
                isSendDisabled
                  ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-800/60 dark:text-zinc-600'
                  : 'bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500 shadow-sm active:scale-95'
              }`}
            >
              <ArrowUp size={15} strokeWidth={2.2} />
            </button>
          )}
        </form>

        {/* Advisory disclaimer */}
        <p className="mt-2 text-center text-[11px] text-zinc-500 dark:text-zinc-500 tracking-tight select-none">
          AI-guided information based on CGTMSE guidelines. Always verify sanction terms with your lending institution.
        </p>
      </div>
    </div>
  );
}
