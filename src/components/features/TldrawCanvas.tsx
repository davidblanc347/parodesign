'use client';

import { Tldraw, Editor } from 'tldraw';
import 'tldraw/tldraw.css';

interface TldrawCanvasProps {
  onEditorMount?: (editor: Editor) => void;
}

export function TldrawCanvas({ onEditorMount }: TldrawCanvasProps) {
  return (
    <div className="w-full h-screen">
      <Tldraw
        onMount={(editor) => {
          if (onEditorMount) {
            onEditorMount(editor);
          }
        }}
      />
    </div>
  );
}
