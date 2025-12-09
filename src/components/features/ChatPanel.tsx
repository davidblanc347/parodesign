'use client';

import { useEffect, useRef } from 'react';
import { Editor } from 'tldraw';
import { useChatAPI } from '@/hooks/useChatAPI';
import { ChatMessage } from '@/components/ui/ChatMessage';
import { ChatInput } from '@/components/ui/ChatInput';
import { generateTldrawShapes, clearCanvas } from '@/lib/tldraw-helpers';
import { getAutoLayout } from '@/lib/layout-engine';
import { MessageSquare, Trash2 } from 'lucide-react';

interface ChatPanelProps {
  editor: Editor | null;
}

/**
 * Main chat panel component with message history and input
 */
export function ChatPanel({ editor }: ChatPanelProps) {
  const { messages, isLoading, error, sendMessage, clearMessages } = useChatAPI();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Generate diagram when AI returns diagram data
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.diagramData && editor) {
      console.log('Generating diagram from AI response:', lastMessage.diagramData);

      // Clear canvas and generate new diagram
      clearCanvas(editor);
      const layout = getAutoLayout(lastMessage.diagramData);
      generateTldrawShapes(layout, editor);
      editor.zoomToFit();
    }
  }, [messages, editor]);

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          <h2 className="font-semibold text-gray-900">Diagram Chat</h2>
        </div>
        <button
          onClick={clearMessages}
          disabled={messages.length === 0}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Clear conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Welcome!
            </h3>
            <p className="text-sm text-gray-600 max-w-sm">
              Describe the diagram you want to create, and I'll generate it for you.
              Try something like "Create a login flow diagram" or "Show me an e-commerce checkout process."
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-200">
          <p className="text-sm text-red-600">Error: {error}</p>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <ChatInput
          onSend={sendMessage}
          isLoading={isLoading}
          disabled={!editor}
        />
        {!editor && (
          <p className="text-xs text-gray-500 mt-2">
            Waiting for canvas to load...
          </p>
        )}
      </div>
    </div>
  );
}
