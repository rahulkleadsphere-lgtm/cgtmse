import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Sparkles,
  ArrowRight,
  Minus,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  RotateCcw,
  Square,
  X,
  MessageSquare,
  ShieldAlert,
  Info
} from 'lucide-react';

export default function AwsChatWidget({
  conversation,
  isLoading,
  onSendMessage,
  onRetry,
  onAbortRequest,
  onNewChat,
  isOpen,
  setIsOpen
}) {
  const [inputVal, setInputVal] = useState('');
  const [showNotification, setShowNotification] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const messages = conversation?.messages || [];
  const hasMessages = messages.length > 0;

  // Auto-scroll when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Focus single input when chat opens
  useEffect(() => {
    if (isOpen) {
      setShowNotification(false);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 200);
    }
  }, [isOpen]);

  const handleSend = (text) => {
    const query = (typeof text === 'string' ? text : inputVal).trim();
    if (!query || isLoading) return;
    onSendMessage(query);
    setInputVal('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopyMessage = async (msgId, content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(msgId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.warn('Copy failed:', err);
    }
  };

  const handleFeedback = (msgId, type) => {
    setFeedbackGiven(prev => ({
      ...prev,
      [msgId]: prev[msgId] === type ? null : type
    }));
  };

  const starterPills = [
    "I want to learn about CGTMSE schemes and products",
    "What is the maximum guarantee coverage limit?",
    "What are the annual guarantee fee (AGF) rates?",
    "How does an MLI submit claims in GMS?"
  ];

  return (
    <>
      {/* ======================================================== */}
      {/* FLOATING LAUNCHER & NOTIFICATION (AWS REFERENCE)        */}
      {/* ======================================================== */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        
        {/* Notification Speech Banner (Screenshot 3) */}
        {!isOpen && showNotification && (
          <div className="mb-3 max-w-[340px] sm:max-w-[380px] bg-[#1e293b] text-white p-3.5 pr-3 rounded-2xl shadow-2xl border border-slate-700/80 flex items-start gap-3 animate-fade-in text-xs leading-relaxed select-none">
            <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <div 
              className="flex-1 cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              Hi, I can connect you with a CGTMSE representative or answer questions you have on CGTMSE.
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowNotification(false);
              }}
              className="text-slate-400 hover:text-white p-1 rounded-md transition"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Launcher Button (Screenshot 1 & 2 bottom right) */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-14 h-14 rounded-[18px] bg-gradient-to-tr from-[#2563eb] to-[#7c3aed] hover:from-[#1d4ed8] hover:to-[#6d28d9] active:scale-95 shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center text-white focus:outline-none focus:ring-4 focus:ring-blue-500/30 group"
            aria-label={isOpen ? "Minimize chat" : "Open chat"}
          >
            {isOpen ? (
              <Minus className="w-6 h-6 transition-transform group-hover:scale-110" />
            ) : (
              <div className="relative">
                {/* AWS-style speech icon */}
                <svg
                  className="w-6 h-6 fill-none stroke-current stroke-2 transition-transform group-hover:scale-110"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
            )}
          </button>

          {/* Red unread badge when closed */}
          {!isOpen && showNotification && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[11px] font-bold text-white shadow">
              1
            </span>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* AWS-STYLE CHAT WINDOW                                    */}
      {/* ======================================================== */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[380px] sm:w-[400px] max-w-[calc(100vw-32px)] h-[580px] sm:h-[620px] max-h-[calc(100vh-120px)] bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-scale-up font-sans">
          
          {/* ---------------------------------------------------- */}
          {/* HEADER (Toggle: Welcome Header vs In-Chat Header)     */}
          {/* ---------------------------------------------------- */}
          {!hasMessages ? (
            /* Welcome Header (Clean, NO duplicate input) */
            <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-4 pb-4 flex-shrink-0">
              {/* Top row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold tracking-tight text-white">
                    Ask CGTMSE
                  </h2>
                  <span className="px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase bg-white/20 text-white rounded-full border border-white/30 backdrop-blur-sm">
                    built-in
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white p-1 rounded-md transition"
                  aria-label="Minimize"
                >
                  <Minus className="w-5 h-5" />
                </button>
              </div>

              {/* Subtitle */}
              <p className="text-xs text-white/90 leading-snug">
                Get helpful guidance and recommendations from CGTMSE generative AI assistant.
              </p>
            </div>
          ) : (
            /* In-Chat Header (Screenshot 1) */
            <div className="relative bg-white flex-shrink-0">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                {/* Left: 3-dots Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100 transition"
                    aria-label="Chat options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {showMenu && (
                    <div className="absolute top-8 left-0 z-20 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1 text-xs text-slate-700 animate-fade-in">
                      <button
                        onClick={() => {
                          if (onNewChat) onNewChat();
                          setShowMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 font-medium"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                        <span>New Conversation</span>
                      </button>
                      <button
                        onClick={() => {
                          const fullChat = messages
                            .map(m => `${m.role === 'user' ? 'User' : 'CGTMSE'}: ${m.content}`)
                            .join('\n\n');
                          navigator.clipboard.writeText(fullChat);
                          setShowMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copy Transcript</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowDisclaimer(true);
                          setShowMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Info className="w-3.5 h-3.5 text-slate-500" />
                        <span>Disclaimer & Terms</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Center Title & Badge */}
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">
                    Ask CGTMSE
                  </h2>
                  <span className="px-2 py-0.5 text-[10px] font-medium text-slate-600 rounded-full border border-slate-300 bg-slate-50">
                    built-in
                  </span>
                </div>

                {/* Right: Minimize */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100 transition"
                  aria-label="Minimize"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>

              {/* Multi-color Rainbow Gradient Line (AWS style) */}
              <div 
                className="w-full h-[2.5px]"
                style={{
                  background: 'linear-gradient(90deg, #ec4899 0%, #8b5cf6 33%, #3b82f6 66%, #06b6d4 100%)'
                }}
              />
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* CHAT BODY                                            */}
          {/* ---------------------------------------------------- */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            
            {/* If NO messages: Welcome view with suggestions (Screenshot 2) */}
            {!hasMessages ? (
              <div className="pt-2 animate-fade-in">
                <p className="text-xs font-semibold text-slate-800 mb-0.5">
                  Want help getting started?
                </p>
                <p className="text-[11px] text-slate-500 mb-3.5">
                  Tell us a little bit about what you're looking for.
                </p>

                <div className="space-y-2">
                  {starterPills.map((pill, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(pill)}
                      className="w-full text-left p-3 rounded-xl border border-blue-200/80 bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-purple-50/40 hover:from-blue-100/60 hover:to-indigo-100/60 text-xs font-medium text-slate-800 shadow-sm transition active:scale-[0.99] flex items-center justify-between group"
                    >
                      <span className="leading-snug">{pill}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Conversation Messages List (Screenshot 1) */
              <div className="space-y-4 pt-1">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  const feedback = feedbackGiven[msg.id];
                  const isCopied = copiedId === msg.id;

                  if (isUser) {
                    return (
                      <div key={msg.id} className="flex justify-end animate-fade-in">
                        <div className="max-w-[85%] px-3.5 py-2 rounded-2xl rounded-tr-sm bg-[#f1f5f9] text-slate-800 text-[13px] leading-relaxed shadow-sm">
                          {msg.content}
                        </div>
                      </div>
                    );
                  }

                  // Assistant Message
                  return (
                    <div key={msg.id} className="flex items-start gap-2.5 animate-fade-in group">
                      
                      {/* Avatar: Blue/purple gradient circle with Sparkles */}
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>

                      {/* Content Area */}
                      <div className="flex-1 min-w-0">
                        
                        {/* Response Text (Compact Markdown - "response size small") */}
                        <div className="text-[13px] text-slate-800 leading-relaxed">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ children }) => <p className="mb-1.5 last:mb-0 leading-relaxed text-[13px]">{children}</p>,
                              ul: ({ children }) => <ul className="list-disc pl-4 space-y-0.5 mb-1.5 text-[13px]">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal pl-4 space-y-0.5 mb-1.5 text-[13px]">{children}</ol>,
                              li: ({ children }) => <li className="leading-snug">{children}</li>,
                              strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
                              h1: ({ children }) => <h3 className="text-[13.5px] font-bold text-slate-900 mt-2 mb-1">{children}</h3>,
                              h2: ({ children }) => <h3 className="text-[13.5px] font-bold text-slate-900 mt-2 mb-1">{children}</h3>,
                              h3: ({ children }) => <h4 className="text-[13px] font-semibold text-slate-900 mt-1.5 mb-1">{children}</h4>,
                              table: ({ children }) => (
                                <div className="overflow-x-auto my-1.5 border border-slate-200 rounded-lg">
                                  <table className="w-full text-[12px] text-left divide-y divide-slate-200">
                                    {children}
                                  </table>
                                </div>
                              ),
                              th: ({ children }) => <th className="px-2 py-1 bg-slate-50 font-semibold text-slate-700">{children}</th>,
                              td: ({ children }) => <td className="px-2 py-1 border-t border-slate-100">{children}</td>,
                              code: ({ inline, children }) => inline ? (
                                <code className="px-1 py-0.5 bg-slate-100 text-blue-700 rounded text-[11px] font-mono">{children}</code>
                              ) : (
                                <pre className="p-2 bg-slate-900 text-slate-100 rounded-lg text-xs overflow-x-auto my-1.5 font-mono">{children}</pre>
                              )
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>

                          {/* Streaming Blinking Cursor */}
                          {msg.isStreaming && (
                            <span className="inline-block w-1.5 h-3 bg-blue-600 animate-pulse ml-0.5" />
                          )}
                        </div>

                        {/* Error state alert */}
                        {msg.isError && onRetry && (
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              onClick={onRetry}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Retry query</span>
                            </button>
                          </div>
                        )}

                        {/* Action buttons: Thumbs Up / Down / Copy (Screenshot 1) */}
                        {!msg.isStreaming && msg.content && (
                          <div className="flex items-center gap-2 mt-1.5 text-slate-400">
                            {/* Thumbs Up */}
                            <button
                              onClick={() => handleFeedback(msg.id, 'up')}
                              className={`p-1 rounded hover:text-slate-700 transition ${
                                feedback === 'up' ? 'text-blue-600 bg-blue-50' : ''
                              }`}
                              title="Helpful response"
                              aria-label="Thumbs up"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>

                            {/* Thumbs Down */}
                            <button
                              onClick={() => handleFeedback(msg.id, 'down')}
                              className={`p-1 rounded hover:text-slate-700 transition ${
                                feedback === 'down' ? 'text-amber-600 bg-amber-50' : ''
                              }`}
                              title="Needs improvement"
                              aria-label="Thumbs down"
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                            </button>

                            {/* Copy Answer */}
                            <button
                              onClick={() => handleCopyMessage(msg.id, msg.content)}
                              className="p-1 rounded hover:text-slate-700 transition ml-0.5"
                              title="Copy answer"
                              aria-label="Copy answer"
                            >
                              {isCopied ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {feedback && (
                              <span className="text-[10px] text-slate-500 font-normal">
                                Thanks for feedback!
                              </span>
                            )}
                          </div>
                        )}

                        {/* Follow-up Suggestions Chips from Backend */}
                        {Array.isArray(msg.suggestions) && msg.suggestions.length > 0 && !msg.isStreaming && (
                          <div className="mt-3 pt-2 border-t border-slate-100 space-y-1.5">
                            <span className="text-[11px] font-semibold text-slate-500 block">
                              Suggested questions:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {msg.suggestions.map((sug, sIdx) => (
                                <button
                                  key={sIdx}
                                  onClick={() => handleSend(sug)}
                                  className="text-[11px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-full border border-blue-200/80 transition text-left leading-tight"
                                >
                                  {sug}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })}

                {/* Loading indicator when waiting for first token */}
                {isLoading && !messages.some(m => m.role === 'assistant' && m.isStreaming) && (
                  <div className="flex items-center gap-2.5 text-slate-400 text-xs py-2 animate-fade-in">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} className="h-1" />
              </div>
            )}

          </div>

          {/* ---------------------------------------------------- */}
          {/* THE SINGLE BOTTOM CHAT INPUT AREA                    */}
          {/* ---------------------------------------------------- */}
          <div className="p-3 border-t border-slate-100 bg-white flex-shrink-0">
            
            {/* Input pill container */}
            <div className="relative flex items-center rounded-full border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition shadow-sm bg-white">
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question"
                disabled={isLoading}
                className="w-full h-10 pl-4 pr-11 text-xs text-slate-800 bg-transparent focus:outline-none placeholder:text-slate-400 font-normal disabled:opacity-50"
              />

              {/* Stop generation button when streaming */}
              {isLoading ? (
                <button
                  type="button"
                  onClick={onAbortRequest}
                  className="absolute right-1.5 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 active:scale-95 transition shadow-sm"
                  title="Stop generating"
                >
                  <Square className="w-3 h-3 fill-current" />
                </button>
              ) : (
                /* Submit button (Circle with Arrow Right) */
                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={!inputVal.trim() || isLoading}
                  className={`absolute right-1.5 w-7 h-7 rounded-full flex items-center justify-center transition shadow-sm ${
                    inputVal.trim() && !isLoading
                      ? 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                  aria-label="Send message"
                >
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              )}
            </div>

            {/* Disclaimer text at bottom */}
            <div className="mt-2 text-center text-[11px] text-slate-400 select-none">
              By chatting, you agree to this{' '}
              <button
                type="button"
                onClick={() => setShowDisclaimer(true)}
                className="text-blue-600 underline hover:text-blue-800 font-normal"
              >
                disclaimer
              </button>
              .
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* DISCLAIMER MODAL                                         */}
      {/* ======================================================== */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <ShieldAlert className="w-4 h-4 text-blue-600" />
                <span>CGTMSE AI Assistant Disclaimer</span>
              </div>
              <button
                onClick={() => setShowDisclaimer(false)}
                className="text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-slate-600 space-y-2.5 leading-relaxed">
              <p>
                The CGTMSE Virtual Assistant is an intelligent conversational guide trained on official scheme circulars, eligibility criteria, guarantee caps, and portal operational guides.
              </p>
              <p>
                Responses are provided for reference only and do not constitute legal or statutory guarantees. Member Lending Institutions (MLIs) should verify specific account parameters via the official GMS portal.
              </p>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowDisclaimer(false)}
                className="px-3.5 py-1.5 bg-[#182a65] text-white font-medium rounded-lg hover:bg-[#111f4d] transition"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
