import { useState, useRef, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { sendChatMessageStream } from '../services/chatApi';
import {
  createNewConversation,
  createMessage,
  generateConversationTitle
} from '../utils/conversations';

const CONVERSATIONS_KEY = 'cgtmse-assist-conversations-v1';
const ACTIVE_CONV_KEY = 'cgtmse-assist-active-conversation-v1';

export function useChat() {
  const [conversations, setConversations] = useLocalStorage(CONVERSATIONS_KEY, []);
  const [activeConvId, setActiveConvId] = useLocalStorage(ACTIVE_CONV_KEY, null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  // Initialize or find current active conversation
  const activeConversation = conversations.find(c => c.id === activeConvId) || null;

  // Start a fresh conversation
  const startNewChat = useCallback(() => {
    // If current conversation is already empty, just keep it
    if (activeConversation && activeConversation.messages.length === 0) {
      return activeConversation;
    }
    const newConv = createNewConversation();
    setConversations(prev => [newConv, ...prev]);
    setActiveConvId(newConv.id);
    setError(null);
    return newConv;
  }, [activeConversation, setConversations, setActiveConvId]);

  // Select an existing conversation
  const selectConversation = useCallback((id) => {
    if (isLoading && abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
    setActiveConvId(id);
    setError(null);
  }, [isLoading, setActiveConvId]);

  // Delete a conversation
  const deleteConversation = useCallback((id) => {
    setConversations(prev => {
      const filtered = prev.filter(c => c.id !== id);
      if (activeConvId === id) {
        if (filtered.length > 0) {
          setActiveConvId(filtered[0].id);
        } else {
          setActiveConvId(null);
        }
      }
      return filtered;
    });
  }, [activeConvId, setConversations, setActiveConvId]);

  // Abort an in-flight request
  const abortRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  }, []);

  // Ensure an active conversation always exists on mount
  useEffect(() => {
    if (conversations.length === 0) {
      const newConv = createNewConversation();
      setConversations([newConv]);
      setActiveConvId(newConv.id);
    } else if (!activeConvId || !conversations.some(c => c.id === activeConvId)) {
      setActiveConvId(conversations[0].id);
    }
  }, [conversations, activeConvId, setConversations, setActiveConvId]);

  // Send a message with real-time token streaming
  const sendMessage = useCallback(async (content) => {
    if (!content || !content.trim() || isLoading) {
      return;
    }

    const trimmedContent = content.trim();

    if (trimmedContent.length > 4000) {
      setError(`Your query is too lengthy (${trimmedContent.length.toLocaleString()} characters). Please shorten your question to under 4,000 characters.`);
      return;
    }

    // Ensure we have a valid conversation to send to
    let currentConv = activeConversation;
    if (!currentConv) {
      currentConv = createNewConversation();
    }

    const targetConvId = currentConv.id;
    const sessionId = currentConv.sessionId;

    // Prepare user message
    const userMessage = createMessage({
      role: 'user',
      content: trimmedContent
    });

    // Prepare streaming assistant placeholder
    const assistantMessage = createMessage({
      role: 'assistant',
      content: '',
      sources: [],
      suggestions: [],
      isStreaming: true
    });

    const isFirstMessage = currentConv.messages.length === 0;
    const conversationTitle = isFirstMessage 
      ? generateConversationTitle(trimmedContent) 
      : currentConv.title;

    // Optimistically update conversation in state with BOTH messages
    const updatedMessagesWithUser = [...currentConv.messages, userMessage, assistantMessage];
    const now = new Date().toISOString();

    const updatedConv = {
      ...currentConv,
      title: conversationTitle,
      updatedAt: now,
      messages: updatedMessagesWithUser
    };

    setConversations(prev => {
      const exists = prev.some(c => c.id === targetConvId);
      if (exists) {
        return prev.map(c => c.id === targetConvId ? updatedConv : c);
      }
      return [updatedConv, ...prev];
    });
    setActiveConvId(targetConvId);

    setIsLoading(true);
    setError(null);

    // Setup abort controller
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    let streamedAnswer = "";
    let capturedSources = [];

    try {
      await sendChatMessageStream({
        message: trimmedContent,
        sessionId: sessionId,
        signal: abortController.signal,
        onSources: (sources) => {
          capturedSources = sources;
          setConversations(prev => prev.map(c => {
            if (c.id === targetConvId) {
              return {
                ...c,
                messages: c.messages.map(m =>
                  m.id === assistantMessage.id ? { ...m, sources } : m
                )
              };
            }
            return c;
          }));
        },
        onToken: (delta) => {
          streamedAnswer += delta;
          setConversations(prev => prev.map(c => {
            if (c.id === targetConvId) {
              return {
                ...c,
                messages: c.messages.map(m =>
                  m.id === assistantMessage.id ? { ...m, content: streamedAnswer } : m
                )
              };
            }
            return c;
          }));
        },
        onDone: ({ suggestions, full_answer }) => {
          const finalAnswer = full_answer || streamedAnswer;
          setConversations(prev => prev.map(c => {
            if (c.id === targetConvId) {
              return {
                ...c,
                updatedAt: new Date().toISOString(),
                messages: c.messages.map(m =>
                  m.id === assistantMessage.id ? {
                    ...m,
                    content: finalAnswer,
                    suggestions: suggestions || [],
                    sources: capturedSources.length ? capturedSources : m.sources,
                    isStreaming: false
                  } : m
                )
              };
            }
            return c;
          }));
        },
        onError: (streamErr) => {
          throw streamErr;
        }
      });
    } catch (err) {
      if (err.name === 'AbortError' || err.message === 'Request was cancelled.') {
        console.log('Request aborted');
        setConversations(prev => prev.map(c => {
          if (c.id === targetConvId) {
            return {
              ...c,
              messages: c.messages.map(m =>
                m.id === assistantMessage.id ? { ...m, isStreaming: false } : m
              )
            };
          }
          return c;
        }));
      } else {
        const errorMsg = err.message || 'Something went wrong while contacting CGTMSE Assist.';
        setError(errorMsg);

        setConversations(prev => prev.map(c => {
          if (c.id === targetConvId) {
            return {
              ...c,
              updatedAt: new Date().toISOString(),
              messages: c.messages.map(m =>
                m.id === assistantMessage.id ? {
                  ...m,
                  content: `**Connection Error**: ${errorMsg}\n\nPlease check your network or verify that the CGTMSE backend is running.`,
                  isError: true,
                  isStreaming: false
                } : m
              )
            };
          }
          return c;
        }));
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [activeConversation, isLoading, setConversations, setActiveConvId]);

  // Retry the last message with streaming
  const retryLastMessage = useCallback(async () => {
    if (!activeConversation || isLoading) return;

    // Find the last user message
    const messages = activeConversation.messages;
    let lastUserMessage = null;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        lastUserMessage = messages[i];
        break;
      }
    }

    if (!lastUserMessage) return;

    const targetConvId = activeConversation.id;
    const sessionId = activeConversation.sessionId;

    // Remove any trailing assistant error or streaming message
    const cleanedMessages = messages.filter((m, idx) => {
      if (idx === messages.length - 1 && m.role === 'assistant' && (m.isError || m.isStreaming)) {
        return false;
      }
      return true;
    });

    const assistantMessage = createMessage({
      role: 'assistant',
      content: '',
      sources: [],
      suggestions: [],
      isStreaming: true
    });

    setConversations(prev => prev.map(c => {
      if (c.id === targetConvId) {
        return {
          ...c,
          messages: [...cleanedMessages, assistantMessage]
        };
      }
      return c;
    }));

    setIsLoading(true);
    setError(null);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    let streamedAnswer = "";
    let capturedSources = [];

    try {
      await sendChatMessageStream({
        message: lastUserMessage.content,
        sessionId: sessionId,
        signal: abortController.signal,
        onSources: (sources) => {
          capturedSources = sources;
          setConversations(prev => prev.map(c => {
            if (c.id === targetConvId) {
              return {
                ...c,
                messages: c.messages.map(m =>
                  m.id === assistantMessage.id ? { ...m, sources } : m
                )
              };
            }
            return c;
          }));
        },
        onToken: (delta) => {
          streamedAnswer += delta;
          setConversations(prev => prev.map(c => {
            if (c.id === targetConvId) {
              return {
                ...c,
                messages: c.messages.map(m =>
                  m.id === assistantMessage.id ? { ...m, content: streamedAnswer } : m
                )
              };
            }
            return c;
          }));
        },
        onDone: ({ suggestions, full_answer }) => {
          const finalAnswer = full_answer || streamedAnswer;
          setConversations(prev => prev.map(c => {
            if (c.id === targetConvId) {
              return {
                ...c,
                updatedAt: new Date().toISOString(),
                messages: c.messages.map(m =>
                  m.id === assistantMessage.id ? {
                    ...m,
                    content: finalAnswer,
                    suggestions: suggestions || [],
                    sources: capturedSources.length ? capturedSources : m.sources,
                    isStreaming: false
                  } : m
                )
              };
            }
            return c;
          }));
        },
        onError: (streamErr) => {
          throw streamErr;
        }
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        const errorMsg = err.message || 'Something went wrong while contacting CGTMSE Assist.';
        setError(errorMsg);
        setConversations(prev => prev.map(c => {
          if (c.id === targetConvId) {
            return {
              ...c,
              updatedAt: new Date().toISOString(),
              messages: c.messages.map(m =>
                m.id === assistantMessage.id ? {
                  ...m,
                  content: `**Connection Error**: ${errorMsg}`,
                  isError: true,
                  isStreaming: false
                } : m
              )
            };
          }
          return c;
        }));
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [activeConversation, isLoading, setConversations]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    conversations,
    activeConversation,
    activeConvId,
    isLoading,
    error,
    sendMessage,
    retryLastMessage,
    abortRequest,
    startNewChat,
    selectConversation,
    deleteConversation
  };
}
