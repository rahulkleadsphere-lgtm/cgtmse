import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, RotateCcw, AlertCircle } from 'lucide-react';
import Logo from '../common/Logo';
import SourceList from './SourceList';
import FollowUpSuggestions from './FollowUpSuggestions';
import { formatMessageTime } from '../../utils/formatDate';

export default function AssistantMessage({
  message,
  onSelectSuggestion,
  onRetry
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Clipboard copy failed:', e);
    }
  };

  const isError = message.isError;

  return (
    <div className="flex items-start gap-3 py-4 max-w-chat mx-auto w-full animate-fade-in group">
      {/* Assistant Emblem Avatar */}
      <Logo size={28} className="mt-1 flex-shrink-0" />

      <div className="flex-1 min-w-0">
        {/* Header: Name & Time */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              CGTMSE Assist
            </span>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-500 font-normal">
              Guide
            </span>
            {message.createdAt && (
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                · {formatMessageTime(message.createdAt)}
              </span>
            )}
          </div>

          {/* Copy Action */}
          {!isError && !message.isStreaming && message.content && (
            <button
              onClick={handleCopy}
              title={copied ? "Copied to clipboard" : "Copy answer"}
              aria-label="Copy answer"
              className="opacity-0 group-hover:opacity-100 flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200 dark:text-zinc-500 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 transition"
            >
              {copied ? (
                <>
                  <Check size={12} strokeWidth={2} className="text-emerald-500 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={12} strokeWidth={1.6} />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Message Content */}
        {isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 dark:border-red-500/30 dark:bg-red-500/5 dark:text-red-300">
            <div className="flex items-start gap-2.5">
              <AlertCircle size={16} strokeWidth={1.8} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1">
                <p className="font-medium text-red-800 dark:text-red-200">
                  Unable to connect to CGTMSE Assist backend.
                </p>
                <div className="markdown-content text-red-700 dark:text-red-300/90">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                </div>
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-800 hover:bg-red-200 border border-red-300 dark:bg-red-500/20 dark:text-red-200 dark:hover:bg-red-500/30 dark:border-red-500/30 transition"
                  >
                    <RotateCcw size={12} strokeWidth={1.8} />
                    <span>Retry Query</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="markdown-content text-zinc-800 dark:text-zinc-100 leading-relaxed text-sm">
            {message.content ? (
              <>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5 font-medium"
                      />
                    ),
                    table: ({ node, ...props }) => (
                      <div className="table-wrapper">
                        <table {...props} />
                      </div>
                    )
                  }}
                >
                  {message.content}
                </ReactMarkdown>
                {message.isStreaming && (
                  <span className="inline-block w-1.5 h-4 ml-1 bg-blue-600 dark:bg-blue-400 animate-pulse align-middle rounded-sm" />
                )}
              </>
            ) : (
              message.isStreaming ? (
                <div className="inline-flex items-center gap-2.5 py-1 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-blue-500"></span>
                  </span>
                  <span>Consulting CGTMSE knowledge base...</span>
                </div>
              ) : null
            )}
          </div>
        )}

        {/* Sources (if returned by backend) */}
        {!isError && <SourceList sources={message.sources} />}

        {/* Follow-up Suggestions (if returned by backend) */}
        {!isError && (
          <FollowUpSuggestions
            suggestions={message.suggestions}
            onSelectSuggestion={onSelectSuggestion}
          />
        )}
      </div>
    </div>
  );
}
