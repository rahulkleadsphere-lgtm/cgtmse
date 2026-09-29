import { authService } from './authService';

/**
 * Normalizes varied n8n / AI Agent JSON responses into a consistent contract.
 * Backend might respond with .answer, .output, .response, .message, or direct string.
 */
export function normalizeChatResponse(data) {
  if (data === null || data === undefined) {
    return {
      answer: "No response was received from CGTMSE Assist.",
      sources: [],
      suggestions: []
    };
  }

  // Handle direct string response
  if (typeof data === 'string') {
    return {
      answer: data.trim() || "Empty response received.",
      sources: [],
      suggestions: []
    };
  }

  // Extract answer from possible fields
  let answer = 
    data?.answer ??
    data?.output ??
    data?.response ??
    data?.message ??
    data?.text;

  // Sometimes n8n output is nested, e.g. data.output.text or data.output.output
  if (typeof answer === 'object' && answer !== null) {
    answer = answer.text ?? answer.output ?? answer.answer ?? JSON.stringify(answer);
  }

  if (!answer || typeof answer !== 'string') {
    answer = "I couldn't generate a response.";
  }

  // Safely extract sources
  let sources = [];
  if (Array.isArray(data?.sources)) {
    sources = data.sources.filter(s => s && (s.title || s.url));
  }

  // Safely extract follow-up suggestions
  let suggestions = [];
  if (Array.isArray(data?.suggestions)) {
    suggestions = data.suggestions.filter(s => typeof s === 'string' && s.trim().length > 0);
  }

  return {
    answer: answer.trim(),
    sources,
    suggestions
  };
}

/**
 * Sends a chat message to the RAG backend via SSE stream.
 * Provides real-time token, source, and suggestion callbacks.
 * 
 * @param {Object} params
 * @param {string} params.message
 * @param {string} params.sessionId
 * @param {function} [params.onSources] - Called when sources are retrieved
 * @param {function} [params.onToken] - Called for each streaming token
 * @param {function} [params.onDone] - Called when generation completes
 * @param {function} [params.onError] - Called if an error occurs
 * @param {AbortSignal} [params.signal]
 * @returns {Promise<{answer: string, sources: Array, suggestions: Array}>}
 */
export async function sendChatMessageStream({
  message,
  sessionId,
  onSources,
  onToken,
  onDone,
  onError,
  signal
}) {
  const trimmed = message.trim();
  const cleanQuery = trimmed.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase().trim();
  const isGreeting = /^(hi|hello|hey|good\s+(morning|afternoon|evening)|hi\s+there|namaste|greetings)$/i.test(cleanQuery);

  if (isGreeting) {
    const greetingAnswer = "Hello! I'm CGTMSE virtual assistant. How can I help you today with your CGTMSE-related questions?";
    const suggestions = [
      "What is the maximum guarantee coverage limit?",
      "Who is eligible for CGTMSE credit guarantee?",
      "What are the annual guarantee fee (AGF) rates?",
      "How does an MLI submit claims in GMS?"
    ];
    // Stream greeting tokens smoothly
    const words = greetingAnswer.split(' ');
    for (let i = 0; i < words.length; i++) {
      const delta = (i === 0 ? '' : ' ') + words[i];
      if (onToken) onToken(delta);
      await new Promise(r => setTimeout(r, 22));
    }
    if (onDone) onDone({ suggestions, full_answer: greetingAnswer, sessionId });
    return {
      answer: greetingAnswer,
      sources: [],
      suggestions,
      sessionId
    };
  }

  // Refine query for the live backend to return concise, short bullet responses
  let backendMessage = trimmed;
  if (!backendMessage.toLowerCase().includes('concise') && !backendMessage.toLowerCase().includes('short')) {
    backendMessage += ' (Please provide a concise, direct answer in 2-3 short bullet points without unnecessary length.)';
  }

  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

  if (!webhookUrl || webhookUrl.trim() === '' || webhookUrl.includes('YOUR-N8N-DOMAIN')) {
    throw new Error(
      "VITE_N8N_WEBHOOK_URL is not configured. Please set your backend endpoint in your .env file."
    );
  }

  const timeoutMs = 60000;
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => {
    timeoutController.abort(new Error('Request timed out after 60 seconds.'));
  }, timeoutMs);

  const combinedSignal = signal 
    ? anySignal([signal, timeoutController.signal])
    : timeoutController.signal;

  try {
    const token = authService.getAuthToken();
    const reqHeaders = {
      "Content-Type": "application/json",
      "Accept": "text/event-stream"
    };
    if (token) {
      reqHeaders["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: reqHeaders,
      body: JSON.stringify({
        message: backendMessage,
        sessionId,
        language: "en",
        client: "web",
        stream: true
      }),
      signal: combinedSignal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorDetail = '';
      try {
        const errorJson = await response.json();
        errorDetail = errorJson.message || errorJson.error || errorJson.detail || '';
      } catch (e) {}
      throw new Error(
        `Request failed with status ${response.status}${errorDetail ? `: ${errorDetail}` : ''}`
      );
    }

    const contentType = response.headers.get("content-type") || "";

    // If server responded with standard JSON instead of SSE
    if (!contentType.includes("text/event-stream")) {
      const data = await response.json();
      const normalized = normalizeChatResponse(data);
      if (onSources && normalized.sources) onSources(normalized.sources);
      if (onToken && normalized.answer) onToken(normalized.answer);
      if (onDone) onDone({ suggestions: normalized.suggestions, full_answer: normalized.answer, sessionId });
      return normalized;
    }

    // Process SSE stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let accumulatedAnswer = "";
    let finalSources = [];
    let finalSuggestions = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop(); // keep last incomplete line

      let currentEvent = null;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith("event: ")) {
          currentEvent = line.substring(7).trim();
        } else if (line.startsWith("data: ")) {
          const rawData = line.substring(6).trim();
          try {
            const parsedData = JSON.parse(rawData);

            if (currentEvent === "sources") {
              finalSources = parsedData.sources || [];
              if (onSources) onSources(finalSources);
            } else if (currentEvent === "token") {
              const delta = parsedData.delta || "";
              accumulatedAnswer += delta;
              if (onToken) onToken(delta);
            } else if (currentEvent === "done") {
              finalSuggestions = parsedData.suggestions || [];
              if (parsedData.full_answer) {
                accumulatedAnswer = parsedData.full_answer;
              }
              if (onDone) {
                onDone({
                  suggestions: finalSuggestions,
                  sessionId: parsedData.sessionId || sessionId,
                  full_answer: accumulatedAnswer
                });
              }
            } else if (currentEvent === "error") {
              const err = new Error(parsedData.error || "Streaming error encountered");
              if (onError) onError(err);
              else throw err;
            }
          } catch (jsonErr) {
            console.warn("Failed to parse SSE JSON payload:", rawData, jsonErr);
          }
        } else if (line === "") {
          currentEvent = null;
        }
      }
    }

    return {
      answer: accumulatedAnswer,
      sources: finalSources,
      suggestions: finalSuggestions,
      sessionId
    };

  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      if (timeoutController.signal.aborted) {
        throw new Error('CGTMSE Assist request timed out after 60 seconds.');
      }
      throw new Error('Request was cancelled.');
    }
    throw error;
  }
}

/**
 * Sends a chat message with promise return (falls back to sendChatMessageStream).
 */
export async function sendChatMessage({ message, sessionId, signal }) {
  return sendChatMessageStream({ message, sessionId, signal });
}

/**
 * Polyfill / helper to combine multiple AbortSignals
 */
function anySignal(signals) {
  if (typeof AbortSignal.any === 'function') {
    return AbortSignal.any(signals);
  }
  const controller = new AbortController();
  for (const sig of signals) {
    if (sig.aborted) {
      controller.abort(sig.reason);
      return controller.signal;
    }
    sig.addEventListener('abort', () => controller.abort(sig.reason), { once: true });
  }
  return controller.signal;
}
