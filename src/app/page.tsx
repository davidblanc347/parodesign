'use client';

import { useState } from 'react';
import { Editor } from 'tldraw';
import { TldrawCanvas } from '@/components/features/TldrawCanvas';
import { ChatPanel } from '@/components/features/ChatPanel';
import { addTestShapes, generateTldrawShapes, clearCanvas } from '@/lib/tldraw-helpers';
import { getAutoLayout } from '@/lib/layout-engine';
import { mockFlowchart } from '@/lib/mock-data';

export default function Home() {
  const [editor, setEditor] = useState<Editor | null>(null);

  // Test button handlers
  const handleAddTestShapes = () => {
    if (editor) {
      addTestShapes(editor);
      editor.zoomToFit();
    }
  };

  const handleGenerateGraph = () => {
    if (!editor) return;
    clearCanvas(editor);
    const layout = getAutoLayout(mockFlowchart);
    generateTldrawShapes(layout, editor);
    editor.zoomToFit();
  };

  return (
    <main className="relative w-full h-screen flex">
      {/* Left Sidebar - Chat Panel */}
      <div className="w-96 h-full flex-shrink-0">
        <ChatPanel editor={editor} />
      </div>

      {/* Right Side - Tldraw Canvas */}
      <div className="flex-1 h-full relative">
        <TldrawCanvas onEditorMount={setEditor} />

        {/* Test Buttons - positioned in top right */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={handleAddTestShapes}
            disabled={!editor}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg"
          >
            Add Test Shapes
          </button>
          <button
            onClick={handleGenerateGraph}
            disabled={!editor}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg"
          >
            Generate Graph
          </button>
        </div>
      </div>
    </main>
  );
}
