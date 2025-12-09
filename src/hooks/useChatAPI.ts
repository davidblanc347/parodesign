'use client';

import { useState, useCallback } from 'react';
import { OPENAI_CONFIG, validateOpenAIConfig } from '@/lib/openai-config';
import { DIAGRAM_GENERATION_SYSTEM_PROMPT } from '@/lib/chat-prompts';
import { extractDiagramFromResponse } from '@/lib/diagram-parser';
import { GraphModel } from '@/types/graph';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  diagramData?: GraphModel;
}

interface UseChatAPIReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (userMessage: string) => Promise<void>;
  clearMessages: () => void;
}

/**
 * Hook for managing chat conversation with OpenAI Chat Completions API
 */
export function useChatAPI(): UseChatAPIReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Send a message to OpenAI and process the response
   */
  const sendMessage = useCallback(async (userMessage: string) => {
    if (!validateOpenAIConfig()) {
      setError('OpenAI API key not configured');
      return;
    }

    if (!userMessage.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    // Add user message to chat
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);

    try {
      // Prepare messages for API call
      const apiMessages = [
        {
          role: 'system',
          content: DIAGRAM_GENERATION_SYSTEM_PROMPT,
        },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: 'user',
          content: userMessage,
        },
      ];

      // Call OpenAI Chat Completions API
      const response = await fetch(`${OPENAI_CONFIG.apiBase}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_CONFIG.apiKey}`,
        },
        body: JSON.stringify({
          model: OPENAI_CONFIG.model,
          messages: apiMessages,
          temperature: OPENAI_CONFIG.temperature,
          max_tokens: OPENAI_CONFIG.maxTokens,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response from OpenAI');
      }

      const data = await response.json();
      const assistantContent = data.choices[0]?.message?.content || '';

      // Extract diagram if present
      const diagramData = extractDiagramFromResponse(assistantContent);

      // Add assistant message to chat
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
        diagramData: diagramData || undefined,
      };

      setMessages(prev => [...prev, assistantMsg]);

    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);

      // Add error message to chat
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  /**
   * Clear all messages
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
