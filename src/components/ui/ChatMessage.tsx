'use client';

import { ChatMessage as ChatMessageType } from '@/hooks/useChatAPI';
import { User, Bot, CheckCircle } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

/**
 * Individual chat message display component
 */
export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={`flex gap-3 p-4 ${
        isUser ? 'bg-blue-50' : 'bg-gray-50'
      } rounded-lg`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-500' : 'bg-gray-700'
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm text-gray-900">
            {isUser ? 'You' : 'Assistant'}
          </span>
          <span className="text-xs text-gray-500">
            {message.timestamp.toLocaleTimeString()}
          </span>
          {message.diagramData && (
            <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
              <CheckCircle className="w-3 h-3" />
              Diagram generated
            </span>
          )}
        </div>

        <div className="text-sm text-gray-800 whitespace-pre-wrap break-words">
          {/* Remove diagram markers from display */}
          {message.content
            .replace(/\[DIAGRAM_START\][\s\S]*?\[DIAGRAM_END\]/g, '[Diagram generated]')
            .trim()}
        </div>
      </div>
    </div>
  );
}
