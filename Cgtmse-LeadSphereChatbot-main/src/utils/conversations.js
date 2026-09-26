import { createSessionId } from './session';

/**
 * Creates a brand new conversation object
 */
export function createNewConversation(title = 'New chat') {
  const now = new Date().toISOString();
  return {
    id: createSessionId(),
    sessionId: createSessionId(),
    title,
    createdAt: now,
    updatedAt: now,
    messages: []
  };
}

/**
 * Creates a formatted message object
 */
export function createMessage({
  role,
  content,
  sources = [],
  suggestions = [],
  isError = false,
  isStreaming = false
}) {
  return {
    id: createSessionId(),
    role,
    content: content || '',
    createdAt: new Date().toISOString(),
    sources: Array.isArray(sources) ? sources : [],
    suggestions: Array.isArray(suggestions) ? suggestions : [],
    isError: Boolean(isError),
    isStreaming: Boolean(isStreaming)
  };
}

/**
 * Derives a clean, readable conversation title from the first user message
 */
export function generateConversationTitle(userMessage) {
  if (!userMessage || typeof userMessage !== 'string') {
    return 'New conversation';
  }

  const cleaned = userMessage.trim().replace(/^["']|["']$/g, '');

  // Common pattern replacements for CGTMSE questions
  const patterns = [
    { regex: /^(what is|what are|explain|tell me about)\s+/i, replace: '' },
    { regex: /^(who is eligible under|who is eligible for)\s+/i, replace: 'Eligibility for ' },
    { regex: /^(how does the|how do I|how can I)\s+/i, replace: '' },
    { regex: /^(what documents are required for|documents required for)\s+/i, replace: 'Required documents - ' },
    { regex: /^(what guarantee cover is available for|guarantee cover for)\s+/i, replace: 'Guarantee coverage - ' },
  ];

  let title = cleaned;
  for (const { regex, replace } of patterns) {
    if (regex.test(title)) {
      title = title.replace(regex, replace);
      break;
    }
  }

  // Capitalize first character
  title = title.charAt(0).toUpperCase() + title.slice(1);

  // Remove trailing question mark/period
  title = title.replace(/[?.!]+$/, '');

  // Truncate to reasonable length (e.g., 36-40 chars)
  if (title.length > 38) {
    return title.substring(0, 36).trim() + '...';
  }

  return title || 'CGTMSE Query';
}

/**
 * Filter conversations based on a search query across title and message contents
 */
export function searchConversations(conversations, query) {
  if (!query || !query.trim()) return conversations;
  const q = query.toLowerCase().trim();

  return conversations.filter(conv => {
    // Check title
    if (conv.title && conv.title.toLowerCase().includes(q)) return true;

    // Check message contents
    if (Array.isArray(conv.messages)) {
      return conv.messages.some(m => 
        m.content && m.content.toLowerCase().includes(q)
      );
    }

    return false;
  });
}
