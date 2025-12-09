# Implementation Plan: Voice-to-Diagram (Tldraw + OpenAI Realtime)

## Overview

Build a web application that converts natural spoken descriptions into live, auto-laid-out diagrams using Next.js 14+, Tldraw for the canvas, Dagre for graph layout, and OpenAI Realtime API for voice processing. The application will interpret spoken descriptions, generate graph structures, compute layout positions, and render diagrams in real-time.

## Requirements Summary

- **Framework**: Next.js 14+ with App Router for server-side rendering and optimal performance
- **Canvas Library**: Tldraw (latest version) for infinite canvas and shape rendering
- **Layout Engine**: Dagre for automatic node/edge graph layout computation
- **AI/Voice Processing**: OpenAI Realtime API via WebSockets for speech-to-diagram conversion
- **Styling**: TailwindCSS for modern, utility-first styling
- **Icons**: lucide-react for UI icons
- **Core Principle**: AI never generates coordinates; it outputs semantic graph models (nodes + edges)
- **Interaction Flow**: Voice → AI Graph JSON → Dagre Layout → Tldraw Canvas
- **State Management**: Tldraw's internal store for all shapes, bindings, and metadata

## Research Findings

### Best Practices

#### Next.js 14+ App Router (2025)
- **Server Components by Default**: Use React Server Components to reduce client-side JavaScript and improve performance
- **Recommended Directory Structure**:
  - `src/app/` for routes and pages
  - `src/components/ui/` for reusable UI components
  - `src/components/features/` for feature-specific components
  - `src/lib/` for utilities and helpers
  - `src/types/` for TypeScript interfaces
- **Performance Optimization**: Use built-in Image and Link components for automatic optimization
- **API Routes**: Leverage route handlers in App Router for API endpoints
- **Progressive Enhancement**: Use Server Actions for form handling and data mutations

#### Tldraw Integration
- **Programmatic Control**: Use the Editor instance via `onMount` callback for full programmatic control
- **Custom Shapes**: Define custom shape utilities when needed for specialized diagram nodes
- **Runtime API**: The editor provides methods to create shapes, control viewport, and manage selections
- **Store Management**: Tldraw uses an internal store that can be updated programmatically
- **React Integration**: Import `Tldraw` component and CSS, render in full-screen container

#### Dagre Graph Layout
- **TypeScript Support**: Use `@dagrejs/dagre` with `@types/dagre` for type safety
- **Basic Pattern**:
  ```typescript
  const graph = new dagre.graphlib.Graph();
  graph.setGraph({ rankdir: 'LR' }); // Layout direction
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setNode(id, { label, width, height });
  graph.setEdge(source, target);
  dagre.layout(graph); // Computes x, y coordinates
  ```
- **Integration with React**: Commonly used with React Flow, adaptable to any canvas library
- **Node Dimensions**: Must specify node width/height for accurate layout calculation

#### OpenAI Realtime API
- **WebSocket Connection**: `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview`
- **Authentication**: Pass API key via Bearer token in header + `OpenAI-Beta: realtime=v1`
- **Event-Based Protocol**: Send and receive JSON events over WebSocket
- **Function Calling**:
  - Define functions the AI can call
  - AI sends function call events when detected
  - Client executes function and returns results with `tool.output` event
  - AI continues turn with response incorporating function results
- **Audio Streaming**: Supports bidirectional audio streaming (PCM16, 24kHz)
- **Security**: Use relay server or API route to hide API key from client

### Reference Implementations

- [Next.js 14 Best Practices](https://medium.com/@GoutamSingha/next-js-best-practices-in-2025-build-faster-cleaner-scalable-apps-7efbad2c3820)
- [Next.js File Structure Guide](https://medium.com/better-dev-nextjs-react/inside-the-app-router-best-practices-for-next-js-file-and-directory-structure-2025-edition-ed6bc14a8da3)
- [Tldraw Quick Start](https://tldraw.dev/quick-start)
- [Tldraw Customization](https://tldraw.dev/features/customization)
- [Dagre with React Flow](https://reactflow.dev/examples/layout/dagre)
- [OpenAI Realtime WebSocket Guide](https://platform.openai.com/docs/guides/realtime-websocket)
- [OpenAI Realtime API Tutorial](https://skywork.ai/blog/agent/openai-realtime-api-javascript-tutorial-websocket-guide/)

### Technology Decisions

1. **Next.js 14+ App Router**:
   - Rationale: Latest React features, Server Components for performance, built-in optimizations
   - Benefit: Reduces client bundle size, improves Core Web Vitals, better SEO

2. **Tldraw Latest Version**:
   - Rationale: Mature infinite canvas library with excellent React integration
   - Benefit: Programmatic API, custom shapes, production-ready, active development

3. **Dagre for Layout**:
   - Rationale: Proven directed graph layout algorithm, TypeScript support
   - Benefit: Automatic coordinate calculation, hierarchical layouts, configurable

4. **OpenAI Realtime API**:
   - Rationale: Low-latency speech-to-speech, function calling, streaming audio
   - Benefit: Real-time voice interaction, GPT-4o intelligence, native function calling

5. **TailwindCSS**:
   - Rationale: Utility-first CSS framework, excellent with Next.js
   - Benefit: Fast development, small production bundle, consistent design system

6. **TypeScript**:
   - Rationale: Type safety for complex data flows (graph models, API events)
   - Benefit: Early error detection, better IDE support, maintainable codebase

## Implementation Tasks

### Phase 1: Foundation & Project Setup

#### Task 1.1: Initialize Next.js Project
- **Description**: Create a new Next.js 14+ project with TypeScript, TailwindCSS, and recommended directory structure
- **Files to create**:
  - `package.json` - Project dependencies
  - `next.config.js` - Next.js configuration
  - `tailwind.config.ts` - TailwindCSS configuration
  - `tsconfig.json` - TypeScript configuration
  - `src/app/layout.tsx` - Root layout component
  - `src/app/page.tsx` - Home page component
  - `src/app/globals.css` - Global styles with Tailwind directives
- **Commands**:
  ```bash
  npx create-next-app@latest voice-to-diagram --typescript --tailwind --app --src-dir
  cd voice-to-diagram
  ```
- **Dependencies**: None
- **Estimated Effort**: 30 minutes

#### Task 1.2: Install Core Dependencies
- **Description**: Install Tldraw, Dagre, Lucide React, and their TypeScript types
- **Commands**:
  ```bash
  npm install tldraw @dagrejs/dagre lucide-react
  npm install -D @types/dagre
  ```
- **Files to modify**:
  - `package.json` - Updated with new dependencies
- **Dependencies**: Task 1.1
- **Estimated Effort**: 15 minutes

#### Task 1.3: Create Project Directory Structure
- **Description**: Set up the recommended directory structure for components, utilities, and types
- **Directories to create**:
  - `src/components/ui/` - Reusable UI components
  - `src/components/features/` - Feature-specific components
  - `src/lib/` - Utilities and helper functions
  - `src/types/` - TypeScript interfaces and types
  - `src/hooks/` - Custom React hooks
- **Dependencies**: Task 1.1
- **Estimated Effort**: 10 minutes

#### Task 1.4: Configure Environment Variables
- **Description**: Set up environment variables for OpenAI API key and configuration
- **Files to create**:
  - `.env.local` - Local environment variables (gitignored)
  - `.env.example` - Template for environment variables
- **Variables**:
  - `OPENAI_API_KEY` - OpenAI API key
  - `NEXT_PUBLIC_WS_URL` - WebSocket relay URL (optional)
- **Dependencies**: Task 1.1
- **Estimated Effort**: 10 minutes

### Phase 2: Canvas & Programmatic Control

#### Task 2.1: Create TldrawCanvas Component
- **Description**: Build a dedicated Tldraw canvas component with proper TypeScript types and full-screen container
- **Files to create**:
  - `src/components/features/TldrawCanvas.tsx` - Main canvas component
- **Implementation Details**:
  - Import Tldraw component and styles
  - Create full-screen container with Tailwind
  - Set up ref for Editor instance
  - Implement `onMount` callback to capture Editor
  - Export Editor instance via callback prop
  - Add proper TypeScript typing for Editor
- **Key Code Pattern**:
  ```typescript
  import { Tldraw, Editor } from 'tldraw';
  import 'tldraw/tldraw.css';

  interface TldrawCanvasProps {
    onEditorMount?: (editor: Editor) => void;
  }

  export function TldrawCanvas({ onEditorMount }: TldrawCanvasProps) {
    return (
      <div className="w-full h-screen">
        <Tldraw onMount={(editor) => onEditorMount?.(editor)} />
      </div>
    );
  }
  ```
- **Dependencies**: Task 1.2
- **Estimated Effort**: 45 minutes

#### Task 2.2: Define TypeScript Interfaces for Graph Models
- **Description**: Create comprehensive TypeScript interfaces for nodes, edges, and graph structures
- **Files to create**:
  - `src/types/graph.ts` - Graph data structures
- **Interfaces to Define**:
  ```typescript
  // Node in the semantic graph (before layout)
  interface GraphNode {
    id: string;
    label: string;
    type: 'process' | 'decision' | 'start' | 'end' | 'data' | 'default';
    metadata?: Record<string, unknown>;
  }

  // Edge connecting nodes
  interface GraphEdge {
    id: string;
    source: string;
    target: string;
    label?: string;
  }

  // Complete graph structure from AI
  interface GraphModel {
    nodes: GraphNode[];
    edges: GraphEdge[];
  }

  // Node after Dagre layout (with coordinates)
  interface PositionedNode extends GraphNode {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  // Layout result
  interface LayoutResult {
    nodes: PositionedNode[];
    edges: GraphEdge[];
  }
  ```
- **Dependencies**: Task 1.3
- **Estimated Effort**: 30 minutes

#### Task 2.3: Implement Test Shape Injection
- **Description**: Create a test button that programmatically inserts shapes into the Tldraw store
- **Files to create**:
  - `src/lib/tldraw-helpers.ts` - Helper functions for Tldraw operations
- **Files to modify**:
  - `src/app/page.tsx` - Add test button to home page
- **Implementation Details**:
  - Create helper function to generate shape IDs
  - Implement function to create basic shapes (rectangle, arrow, text)
  - Use Editor API to insert shapes into store
  - Add button with click handler to trigger shape creation
- **Key Code Pattern**:
  ```typescript
  import { Editor, createShapeId } from 'tldraw';

  export function addTestShapes(editor: Editor) {
    const shapeId = createShapeId();
    editor.createShape({
      id: shapeId,
      type: 'geo',
      x: 100,
      y: 100,
      props: {
        w: 200,
        h: 100,
        geo: 'rectangle',
        text: 'Test Node'
      }
    });
  }
  ```
- **Dependencies**: Task 2.1
- **Estimated Effort**: 1 hour

#### Task 2.4: Test Canvas Integration
- **Description**: Verify that Tldraw canvas renders correctly and test shapes can be added programmatically
- **Testing Steps**:
  - Start dev server and navigate to home page
  - Verify Tldraw canvas renders in full screen
  - Click "Add Test Shapes" button
  - Verify shapes appear on canvas
  - Test manual drawing and interaction
- **Success Criteria**:
  - Canvas loads without errors
  - Programmatic shape creation works
  - Manual interaction works (draw, select, move)
- **Dependencies**: Task 2.3
- **Estimated Effort**: 30 minutes

### Phase 3: Layout Engine (Dagre)

#### Task 3.1: Implement Dagre Layout Utility
- **Description**: Create a utility function that takes a graph model and returns positioned nodes using Dagre
- **Files to create**:
  - `src/lib/layout-engine.ts` - Graph layout computation
- **Implementation Details**:
  - Import Dagre and types
  - Create `getAutoLayout` function accepting GraphModel
  - Configure Dagre graph (rankdir, nodesep, ranksep)
  - Set default node dimensions (or accept as parameters)
  - Add nodes and edges to Dagre graph
  - Run layout computation
  - Extract computed positions and return LayoutResult
- **Key Code Pattern**:
  ```typescript
  import dagre from '@dagrejs/dagre';
  import { GraphModel, LayoutResult, PositionedNode } from '@/types/graph';

  const NODE_WIDTH = 180;
  const NODE_HEIGHT = 80;

  export function getAutoLayout(graphModel: GraphModel): LayoutResult {
    const graph = new dagre.graphlib.Graph();

    // Configure layout
    graph.setGraph({
      rankdir: 'TB', // Top to bottom
      nodesep: 50,   // Horizontal spacing
      ranksep: 100   // Vertical spacing
    });
    graph.setDefaultEdgeLabel(() => ({}));

    // Add nodes
    graphModel.nodes.forEach(node => {
      graph.setNode(node.id, {
        label: node.label,
        width: NODE_WIDTH,
        height: NODE_HEIGHT
      });
    });

    // Add edges
    graphModel.edges.forEach(edge => {
      graph.setEdge(edge.source, edge.target);
    });

    // Compute layout
    dagre.layout(graph);

    // Extract positioned nodes
    const positionedNodes: PositionedNode[] = graphModel.nodes.map(node => {
      const nodeWithPosition = graph.node(node.id);
      return {
        ...node,
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
        width: NODE_WIDTH,
        height: NODE_HEIGHT
      };
    });

    return {
      nodes: positionedNodes,
      edges: graphModel.edges
    };
  }
  ```
- **Dependencies**: Task 1.2, Task 2.2
- **Estimated Effort**: 1.5 hours

#### Task 3.2: Create Tldraw Shape Generator
- **Description**: Build a function that converts positioned nodes and edges into Tldraw shapes and arrows
- **Files to modify**:
  - `src/lib/tldraw-helpers.ts` - Add shape generation from layout result
- **Implementation Details**:
  - Create function to map node types to Tldraw geo shapes (rectangle, diamond, ellipse)
  - Generate unique shape IDs for each node
  - Create geo shapes with computed positions
  - Generate arrows for edges with proper bindings
  - Handle edge labels if present
  - Return array of shape objects for batch creation
- **Key Code Pattern**:
  ```typescript
  import { Editor, TLGeoShape, TLArrowShape, createShapeId } from 'tldraw';
  import { LayoutResult } from '@/types/graph';

  export function generateTldrawShapes(layout: LayoutResult, editor: Editor) {
    const nodeShapeMap = new Map<string, string>();

    // Create node shapes
    layout.nodes.forEach(node => {
      const shapeId = createShapeId();
      nodeShapeMap.set(node.id, shapeId);

      const geoType = getGeoTypeForNode(node.type);

      editor.createShape({
        id: shapeId,
        type: 'geo',
        x: node.x,
        y: node.y,
        props: {
          w: node.width,
          h: node.height,
          geo: geoType,
          text: node.label,
          fill: 'solid',
          color: 'blue'
        }
      });
    });

    // Create edge arrows
    layout.edges.forEach(edge => {
      const sourceShapeId = nodeShapeMap.get(edge.source);
      const targetShapeId = nodeShapeMap.get(edge.target);

      if (sourceShapeId && targetShapeId) {
        const arrowId = createShapeId();
        editor.createShape({
          id: arrowId,
          type: 'arrow',
          props: {
            start: { type: 'binding', boundShapeId: sourceShapeId },
            end: { type: 'binding', boundShapeId: targetShapeId },
            text: edge.label || ''
          }
        });
      }
    });
  }

  function getGeoTypeForNode(nodeType: string): string {
    switch (nodeType) {
      case 'decision': return 'diamond';
      case 'start':
      case 'end': return 'ellipse';
      default: return 'rectangle';
    }
  }
  ```
- **Dependencies**: Task 3.1
- **Estimated Effort**: 2 hours

#### Task 3.3: Create Mock Graph Generator
- **Description**: Build a function that generates mock graph data for testing the layout pipeline
- **Files to create**:
  - `src/lib/mock-data.ts` - Mock graph generation
- **Implementation Details**:
  - Create function to generate sample graph with various node types
  - Include realistic graph structures (flowcharts, process diagrams)
  - Add multiple test cases (linear, branching, cyclic)
- **Mock Examples**:
  ```typescript
  import { GraphModel } from '@/types/graph';

  export const mockFlowchart: GraphModel = {
    nodes: [
      { id: '1', label: 'Start', type: 'start' },
      { id: '2', label: 'Process Data', type: 'process' },
      { id: '3', label: 'Is Valid?', type: 'decision' },
      { id: '4', label: 'Save', type: 'process' },
      { id: '5', label: 'Error', type: 'end' },
      { id: '6', label: 'Success', type: 'end' }
    ],
    edges: [
      { id: 'e1', source: '1', target: '2' },
      { id: 'e2', source: '2', target: '3' },
      { id: 'e3', source: '3', target: '4', label: 'Yes' },
      { id: 'e4', source: '3', target: '5', label: 'No' },
      { id: 'e5', source: '4', target: '6' }
    ]
  };
  ```
- **Dependencies**: Task 2.2
- **Estimated Effort**: 45 minutes

#### Task 3.4: Add "Generate Graph" Test Button
- **Description**: Implement a button that takes mock graph data, runs layout, and renders to Tldraw
- **Files to modify**:
  - `src/app/page.tsx` - Add generate button and wire up pipeline
- **Implementation Details**:
  - Import mock data, layout engine, and shape generator
  - Add button with click handler
  - On click: get mock graph → run layout → generate shapes → update canvas
  - Clear previous shapes before adding new ones
- **Key Code Pattern**:
  ```typescript
  const handleGenerateGraph = () => {
    if (!editor) return;

    // Clear canvas
    editor.selectAll();
    editor.deleteShapes(editor.getSelectedShapeIds());

    // Run layout
    const layout = getAutoLayout(mockFlowchart);

    // Generate and add shapes
    generateTldrawShapes(layout, editor);

    // Zoom to fit
    editor.zoomToFit();
  };
  ```
- **Dependencies**: Task 3.2, Task 3.3
- **Estimated Effort**: 1 hour

#### Task 3.5: Test Layout Pipeline
- **Description**: Verify the complete layout pipeline from graph model to rendered diagram
- **Testing Steps**:
  - Click "Generate Graph" button
  - Verify mock flowchart appears with proper layout
  - Check node shapes match types (diamonds for decisions, etc.)
  - Verify arrows connect correctly
  - Test zoom to fit functionality
  - Try different mock graphs
- **Success Criteria**:
  - All nodes render in correct positions
  - Edges connect properly with bindings
  - Layout is visually clean and hierarchical
  - No overlapping nodes
- **Dependencies**: Task 3.4
- **Estimated Effort**: 45 minutes

### Phase 4: OpenAI Realtime Integration

#### Task 4.1: Create API Route for WebSocket Relay
- **Description**: Set up a Next.js API route to relay WebSocket connections and hide the OpenAI API key
- **Files to create**:
  - `src/app/api/realtime/route.ts` - WebSocket relay endpoint
- **Implementation Details**:
  - Handle GET requests for WebSocket upgrade
  - Establish connection to OpenAI Realtime API
  - Relay messages bidirectionally between client and OpenAI
  - Add error handling and connection management
  - Inject API key from environment variables
- **Key Code Pattern**:
  ```typescript
  import { NextRequest } from 'next/server';

  export async function GET(req: NextRequest) {
    const upgradeHeader = req.headers.get('upgrade');

    if (upgradeHeader !== 'websocket') {
      return new Response('Expected websocket', { status: 426 });
    }

    // WebSocket relay implementation
    // This is a simplified pattern; full implementation needs WebSocket handling
    const url = 'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview';
    const headers = {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'OpenAI-Beta': 'realtime=v1'
    };

    // Proxy WebSocket connection
    // Note: Next.js requires additional setup for WebSocket support
    // Consider using a separate WebSocket server or external relay service
  }
  ```
- **Alternative Approach**: Use a separate Node.js WebSocket server for better compatibility
- **Dependencies**: Task 1.4
- **Estimated Effort**: 2 hours

#### Task 4.2: Create WebSocket Client Hook
- **Description**: Build a custom React hook to manage WebSocket connection state and message handling
- **Files to create**:
  - `src/hooks/useRealtimeAPI.ts` - WebSocket client hook
- **Implementation Details**:
  - Manage WebSocket connection lifecycle
  - Handle connection state (connecting, open, closed, error)
  - Provide methods to send events
  - Set up event listeners for receiving messages
  - Implement reconnection logic
  - Type-safe event interfaces
- **Key Code Pattern**:
  ```typescript
  import { useEffect, useRef, useState, useCallback } from 'react';

  interface UseRealtimeAPIOptions {
    onMessage?: (event: any) => void;
    onError?: (error: Error) => void;
  }

  export function useRealtimeAPI(options: UseRealtimeAPIOptions) {
    const [connectionState, setConnectionState] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
    const wsRef = useRef<WebSocket | null>(null);

    const connect = useCallback(() => {
      const ws = new WebSocket('ws://localhost:3000/api/realtime');

      ws.onopen = () => setConnectionState('connected');
      ws.onclose = () => setConnectionState('disconnected');
      ws.onerror = (error) => options.onError?.(new Error('WebSocket error'));
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        options.onMessage?.(data);
      };

      wsRef.current = ws;
    }, [options]);

    const sendEvent = useCallback((event: any) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(event));
      }
    }, []);

    const disconnect = useCallback(() => {
      wsRef.current?.close();
      wsRef.current = null;
    }, []);

    useEffect(() => {
      return () => disconnect();
    }, [disconnect]);

    return {
      connectionState,
      connect,
      disconnect,
      sendEvent
    };
  }
  ```
- **Dependencies**: Task 4.1
- **Estimated Effort**: 2.5 hours

#### Task 4.3: Implement Audio Input Handling
- **Description**: Set up microphone access and audio streaming to WebSocket
- **Files to create**:
  - `src/hooks/useAudioInput.ts` - Audio capture and streaming
- **Implementation Details**:
  - Request microphone permissions
  - Capture audio using Web Audio API
  - Convert audio to PCM16 format at 24kHz (OpenAI requirement)
  - Stream audio chunks to WebSocket as base64
  - Handle start/stop recording
- **Key Code Pattern**:
  ```typescript
  import { useEffect, useRef, useState } from 'react';

  export function useAudioInput(onAudioData: (data: string) => void) {
    const [isRecording, setIsRecording] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new AudioContext({ sampleRate: 24000 });
        const source = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(2048, 1, 1);

        processor.onaudioprocess = (e) => {
          const inputData = e.inputBuffer.getChannelData(0);
          const pcm16 = convertToPCM16(inputData);
          const base64 = btoa(String.fromCharCode(...pcm16));
          onAudioData(base64);
        };

        source.connect(processor);
        processor.connect(audioContext.destination);

        streamRef.current = stream;
        audioContextRef.current = audioContext;
        setIsRecording(true);
      } catch (error) {
        console.error('Failed to access microphone:', error);
      }
    };

    const stopRecording = () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
      audioContextRef.current?.close();
      setIsRecording(false);
    };

    return { isRecording, startRecording, stopRecording };
  }

  function convertToPCM16(float32Array: Float32Array): Int16Array {
    const pcm16 = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return pcm16;
  }
  ```
- **Dependencies**: Task 4.2
- **Estimated Effort**: 2 hours

#### Task 4.4: Implement Audio Output Handling
- **Description**: Set up audio playback for responses from OpenAI Realtime API
- **Files to create**:
  - `src/hooks/useAudioOutput.ts` - Audio playback
- **Implementation Details**:
  - Receive base64 PCM16 audio chunks from WebSocket
  - Decode and queue audio chunks
  - Play audio using Web Audio API
  - Handle audio buffering for smooth playback
- **Key Code Pattern**:
  ```typescript
  import { useEffect, useRef } from 'react';

  export function useAudioOutput() {
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioQueueRef = useRef<AudioBuffer[]>([]);

    useEffect(() => {
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
    }, []);

    const playAudioChunk = (base64Audio: string) => {
      if (!audioContextRef.current) return;

      const binary = atob(base64Audio);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      const pcm16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(pcm16.length);
      for (let i = 0; i < pcm16.length; i++) {
        float32[i] = pcm16[i] / (pcm16[i] < 0 ? 0x8000 : 0x7FFF);
      }

      const audioBuffer = audioContextRef.current.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.start();
    };

    return { playAudioChunk };
  }
  ```
- **Dependencies**: Task 4.2
- **Estimated Effort**: 1.5 hours

#### Task 4.5: Define generate_diagram Function Schema
- **Description**: Create the function definition that OpenAI will use to output diagram structures
- **Files to create**:
  - `src/lib/function-schemas.ts` - OpenAI function definitions
- **Implementation Details**:
  - Define JSON schema for `generate_diagram` function
  - Specify parameters: nodes array and edges array
  - Include node properties: id, label, type
  - Include edge properties: source, target, label
  - Add descriptions for AI understanding
- **Function Schema**:
  ```typescript
  export const generateDiagramSchema = {
    name: 'generate_diagram',
    description: 'Generate a diagram from the user\'s spoken description. Create nodes for entities/steps and edges for relationships/flow. Do not specify coordinates.',
    parameters: {
      type: 'object',
      properties: {
        nodes: {
          type: 'array',
          description: 'List of nodes in the diagram',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: 'Unique identifier for the node'
              },
              label: {
                type: 'string',
                description: 'Display text for the node'
              },
              type: {
                type: 'string',
                enum: ['process', 'decision', 'start', 'end', 'data', 'default'],
                description: 'Semantic type of the node'
              }
            },
            required: ['id', 'label', 'type']
          }
        },
        edges: {
          type: 'array',
          description: 'List of edges connecting nodes',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: 'Unique identifier for the edge'
              },
              source: {
                type: 'string',
                description: 'ID of the source node'
              },
              target: {
                type: 'string',
                description: 'ID of the target node'
              },
              label: {
                type: 'string',
                description: 'Optional label for the edge'
              }
            },
            required: ['id', 'source', 'target']
          }
        }
      },
      required: ['nodes', 'edges']
    }
  };
  ```
- **Dependencies**: Task 2.2
- **Estimated Effort**: 1 hour

#### Task 4.6: Implement Session Configuration
- **Description**: Set up the initial session configuration for OpenAI Realtime API with function definitions
- **Files to modify**:
  - `src/hooks/useRealtimeAPI.ts` - Add session setup
- **Implementation Details**:
  - Send `session.update` event on connection
  - Configure modalities (text and audio)
  - Register `generate_diagram` function
  - Set instructions for the AI assistant
  - Configure voice and turn detection
- **Key Code Pattern**:
  ```typescript
  const configureSession = () => {
    sendEvent({
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        instructions: 'You are a diagram generation assistant. Listen to the user\'s description and create a structured diagram by calling the generate_diagram function. Identify entities, processes, decisions, and their relationships. Do not specify coordinates or positions.',
        voice: 'alloy',
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        input_audio_transcription: {
          model: 'whisper-1'
        },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500
        },
        tools: [generateDiagramSchema],
        tool_choice: 'auto'
      }
    });
  };
  ```
- **Dependencies**: Task 4.5
- **Estimated Effort**: 1 hour

#### Task 4.7: Test WebSocket Connection
- **Description**: Verify WebSocket connection to OpenAI and basic event flow
- **Testing Steps**:
  - Start application and connect to WebSocket
  - Send test events and verify responses
  - Check browser console for WebSocket messages
  - Verify session configuration is accepted
- **Success Criteria**:
  - WebSocket connects successfully
  - Session configuration is acknowledged
  - No connection errors in console
- **Dependencies**: Task 4.6
- **Estimated Effort**: 30 minutes

### Phase 5: Fusion & Real-Time Diagram Generation

#### Task 5.1: Create Voice Interface Component
- **Description**: Build a UI component with microphone button and connection status
- **Files to create**:
  - `src/components/features/VoiceInterface.tsx` - Voice control UI
- **Implementation Details**:
  - Use lucide-react for icons (Mic, MicOff, Wifi, WifiOff)
  - Add record button with visual feedback
  - Display connection status
  - Show transcription of user speech
  - Add loading states during processing
- **UI Elements**:
  - Connection status indicator
  - Microphone button (start/stop recording)
  - Transcription display area
  - Visual feedback during recording
- **Dependencies**: Task 4.3, Task 4.4
- **Estimated Effort**: 2 hours

#### Task 5.2: Implement Function Call Handler
- **Description**: Handle function_call events from OpenAI and trigger diagram generation
- **Files to create**:
  - `src/lib/realtime-handlers.ts` - Event handlers for Realtime API
- **Implementation Details**:
  - Listen for `response.function_call_arguments.done` events
  - Parse function call arguments (GraphModel)
  - Validate graph structure
  - Run layout computation
  - Generate Tldraw shapes
  - Send function output back to OpenAI
  - Handle errors gracefully
- **Key Code Pattern**:
  ```typescript
  import { Editor } from 'tldraw';
  import { GraphModel } from '@/types/graph';
  import { getAutoLayout } from './layout-engine';
  import { generateTldrawShapes } from './tldraw-helpers';

  export function handleFunctionCall(
    event: any,
    editor: Editor,
    sendEvent: (event: any) => void
  ) {
    if (event.name === 'generate_diagram') {
      try {
        const graphModel: GraphModel = JSON.parse(event.arguments);

        // Validate
        if (!graphModel.nodes || !graphModel.edges) {
          throw new Error('Invalid graph model');
        }

        // Clear canvas
        editor.selectAll();
        editor.deleteShapes(editor.getSelectedShapeIds());

        // Run layout
        const layout = getAutoLayout(graphModel);

        // Generate shapes
        generateTldrawShapes(layout, editor);

        // Zoom to fit
        editor.zoomToFit();

        // Send success response
        sendEvent({
          type: 'conversation.item.create',
          item: {
            type: 'function_call_output',
            call_id: event.call_id,
            output: JSON.stringify({
              success: true,
              nodesCreated: graphModel.nodes.length,
              edgesCreated: graphModel.edges.length
            })
          }
        });

        // Request AI to continue
        sendEvent({ type: 'response.create' });

      } catch (error) {
        console.error('Failed to generate diagram:', error);

        // Send error response
        sendEvent({
          type: 'conversation.item.create',
          item: {
            type: 'function_call_output',
            call_id: event.call_id,
            output: JSON.stringify({
              success: false,
              error: error.message
            })
          }
        });
      }
    }
  }
  ```
- **Dependencies**: Task 4.2, Task 3.2
- **Estimated Effort**: 2 hours

#### Task 5.3: Wire Up Complete Event Flow
- **Description**: Connect all components together for end-to-end voice-to-diagram flow
- **Files to modify**:
  - `src/app/page.tsx` - Integrate all components
- **Implementation Details**:
  - Import VoiceInterface, TldrawCanvas, and hooks
  - Set up WebSocket connection
  - Connect audio input to WebSocket
  - Route audio output from WebSocket to speakers
  - Handle function calls and update canvas
  - Manage application state (recording, processing, idle)
- **Key Code Pattern**:
  ```typescript
  'use client';

  import { useState, useCallback } from 'react';
  import { Editor } from 'tldraw';
  import { TldrawCanvas } from '@/components/features/TldrawCanvas';
  import { VoiceInterface } from '@/components/features/VoiceInterface';
  import { useRealtimeAPI } from '@/hooks/useRealtimeAPI';
  import { useAudioInput } from '@/hooks/useAudioInput';
  import { useAudioOutput } from '@/hooks/useAudioOutput';
  import { handleFunctionCall } from '@/lib/realtime-handlers';

  export default function Home() {
    const [editor, setEditor] = useState<Editor | null>(null);

    const { playAudioChunk } = useAudioOutput();

    const { connectionState, connect, disconnect, sendEvent } = useRealtimeAPI({
      onMessage: (event) => {
        // Handle different event types
        if (event.type === 'response.audio.delta') {
          playAudioChunk(event.delta);
        } else if (event.type === 'response.function_call_arguments.done') {
          if (editor) {
            handleFunctionCall(event, editor, sendEvent);
          }
        }
      }
    });

    const { isRecording, startRecording, stopRecording } = useAudioInput((audioData) => {
      sendEvent({
        type: 'input_audio_buffer.append',
        audio: audioData
      });
    });

    return (
      <main className="relative w-full h-screen">
        <TldrawCanvas onEditorMount={setEditor} />
        <div className="absolute top-4 right-4 z-10">
          <VoiceInterface
            connectionState={connectionState}
            isRecording={isRecording}
            onConnect={connect}
            onDisconnect={disconnect}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
          />
        </div>
      </main>
    );
  }
  ```
- **Dependencies**: Task 5.1, Task 5.2
- **Estimated Effort**: 2.5 hours

#### Task 5.4: Add User Feedback and Loading States
- **Description**: Implement visual feedback during voice processing and diagram generation
- **Files to modify**:
  - `src/components/features/VoiceInterface.tsx` - Add status messages
- **Implementation Details**:
  - Show "Listening..." when recording
  - Display "Processing..." while AI thinks
  - Show "Generating diagram..." during layout computation
  - Display transcription of user's speech
  - Show error messages if generation fails
  - Add success notification when diagram is created
- **UI States**:
  - Idle: Ready to record
  - Recording: Actively capturing audio
  - Processing: AI is analyzing speech
  - Generating: Creating diagram
  - Error: Display error message
  - Success: Diagram created confirmation
- **Dependencies**: Task 5.3
- **Estimated Effort**: 1.5 hours

#### Task 5.5: End-to-End Testing
- **Description**: Test the complete voice-to-diagram pipeline with real voice input
- **Testing Steps**:
  1. Connect to WebSocket
  2. Click record and speak a diagram description
  3. Verify transcription appears
  4. Wait for AI to process and call function
  5. Verify diagram appears on canvas with correct layout
  6. Test multiple descriptions in sequence
  7. Test error cases (unclear speech, invalid descriptions)
- **Test Cases**:
  - Simple linear process: "Create a diagram with start, process, and end"
  - Branching flow: "Show a decision between two paths"
  - Complex flowchart: "Create a user registration flow with validation"
- **Success Criteria**:
  - Voice input is captured and transcribed
  - AI generates appropriate graph structure
  - Layout is computed correctly
  - Diagram renders on canvas
  - Arrows connect nodes properly
  - Multiple iterations work without errors
- **Dependencies**: Task 5.4
- **Estimated Effort**: 2 hours

### Phase 6: Polish & Optimization

#### Task 6.1: Implement Clear Canvas Function
- **Description**: Add a button to clear the canvas and reset for a new diagram
- **Files to modify**:
  - `src/components/features/VoiceInterface.tsx` - Add clear button
  - `src/lib/tldraw-helpers.ts` - Add clear function
- **Implementation Details**:
  - Add clear/trash icon button
  - Implement function to remove all shapes
  - Add confirmation dialog for destructive action
- **Dependencies**: Task 5.3
- **Estimated Effort**: 30 minutes

#### Task 6.2: Add Diagram Export Functionality
- **Description**: Enable users to export diagrams as images or JSON
- **Files to create**:
  - `src/lib/export-helpers.ts` - Export utilities
- **Files to modify**:
  - `src/components/features/VoiceInterface.tsx` - Add export buttons
- **Implementation Details**:
  - Export as PNG using Tldraw's export API
  - Export as SVG for vector graphics
  - Export graph structure as JSON
  - Add download triggers for each format
- **Dependencies**: Task 5.3
- **Estimated Effort**: 1.5 hours

#### Task 6.3: Improve Layout Algorithm Configuration
- **Description**: Add options to customize layout direction and spacing
- **Files to modify**:
  - `src/lib/layout-engine.ts` - Add configuration parameters
- **Implementation Details**:
  - Accept layout options (rankdir, nodesep, ranksep)
  - Expose layout configuration in UI (optional)
  - Support different layout directions (TB, LR, BT, RL)
  - Adjust spacing based on diagram complexity
- **Dependencies**: Task 3.1
- **Estimated Effort**: 1 hour

#### Task 6.4: Add Error Boundaries and Error Handling
- **Description**: Implement comprehensive error handling and user-friendly error messages
- **Files to create**:
  - `src/components/ui/ErrorBoundary.tsx` - React error boundary
- **Files to modify**:
  - `src/app/layout.tsx` - Wrap with error boundary
- **Implementation Details**:
  - Catch React errors with error boundary
  - Handle WebSocket errors gracefully
  - Display user-friendly error messages
  - Add retry mechanisms for recoverable errors
  - Log errors for debugging
- **Dependencies**: Task 5.3
- **Estimated Effort**: 1.5 hours

#### Task 6.5: Optimize Performance
- **Description**: Implement performance optimizations for large diagrams and real-time updates
- **Files to modify**:
  - `src/lib/tldraw-helpers.ts` - Batch shape creation
  - `src/hooks/useRealtimeAPI.ts` - Optimize event handling
- **Implementation Details**:
  - Batch shape creation instead of individual creates
  - Debounce audio streaming for efficiency
  - Optimize re-renders with useMemo and useCallback
  - Profile and optimize layout computation for large graphs
- **Dependencies**: Task 5.3
- **Estimated Effort**: 2 hours

#### Task 6.6: Add Keyboard Shortcuts
- **Description**: Implement keyboard shortcuts for common actions
- **Files to create**:
  - `src/hooks/useKeyboardShortcuts.ts` - Keyboard shortcut handling
- **Implementation Details**:
  - Space bar: Start/stop recording
  - Ctrl/Cmd + K: Clear canvas
  - Ctrl/Cmd + E: Export diagram
  - Ctrl/Cmd + Z: Undo (use Tldraw's built-in)
  - Escape: Stop recording and disconnect
- **Dependencies**: Task 6.1, Task 6.2
- **Estimated Effort**: 1 hour

#### Task 6.7: Style and UI Polish
- **Description**: Refine UI with better styling, animations, and responsive design
- **Files to modify**:
  - `src/components/features/VoiceInterface.tsx` - Improve styling
  - `src/app/globals.css` - Add custom styles and animations
- **Implementation Details**:
  - Add smooth transitions for state changes
  - Implement responsive design for mobile devices
  - Add loading spinners and progress indicators
  - Improve color scheme and visual hierarchy
  - Add hover states and focus indicators
  - Polish button styles with lucide-react icons
- **Dependencies**: Task 5.4
- **Estimated Effort**: 2 hours

#### Task 6.8: Create Documentation
- **Description**: Write comprehensive documentation for setup, usage, and development
- **Files to create**:
  - `README.md` - Project overview and setup guide
  - `docs/DEVELOPMENT.md` - Development guide
  - `docs/ARCHITECTURE.md` - Technical architecture
  - `docs/API.md` - API documentation
- **Documentation Sections**:
  - Project overview and features
  - Installation and setup instructions
  - Environment variable configuration
  - Usage guide with examples
  - Architecture overview
  - Component documentation
  - Troubleshooting guide
  - Contributing guidelines
- **Dependencies**: Task 6.7
- **Estimated Effort**: 2 hours

### Phase 7: Testing & Quality Assurance

#### Task 7.1: Write Unit Tests for Layout Engine
- **Description**: Create unit tests for the Dagre layout computation
- **Files to create**:
  - `src/lib/__tests__/layout-engine.test.ts` - Layout tests
- **Test Cases**:
  - Test basic linear layout
  - Test branching structures
  - Test cyclic graphs
  - Test empty graphs
  - Test single node graphs
  - Verify position calculations
  - Test different layout directions
- **Dependencies**: Task 3.1
- **Estimated Effort**: 1.5 hours

#### Task 7.2: Write Unit Tests for Tldraw Helpers
- **Description**: Create unit tests for shape generation functions
- **Files to create**:
  - `src/lib/__tests__/tldraw-helpers.test.ts` - Shape generation tests
- **Test Cases**:
  - Test shape ID generation
  - Test node type to geo shape mapping
  - Test edge to arrow conversion
  - Test shape property generation
  - Mock Editor and verify method calls
- **Dependencies**: Task 3.2
- **Estimated Effort**: 1.5 hours

#### Task 7.3: Write Integration Tests for Function Handler
- **Description**: Test the function call handling and diagram generation pipeline
- **Files to create**:
  - `src/lib/__tests__/realtime-handlers.test.ts` - Handler integration tests
- **Test Cases**:
  - Test valid function call handling
  - Test invalid graph model handling
  - Test error responses
  - Test Editor integration
  - Mock WebSocket events
- **Dependencies**: Task 5.2
- **Estimated Effort**: 2 hours

#### Task 7.4: E2E Testing Setup
- **Description**: Set up end-to-end testing with Playwright or Cypress
- **Files to create**:
  - `e2e/voice-to-diagram.spec.ts` - E2E test suite
  - `playwright.config.ts` or `cypress.config.ts` - Test configuration
- **Test Scenarios**:
  - Test canvas rendering
  - Test mock graph generation
  - Test WebSocket connection (mocked)
  - Test UI interactions
  - Test export functionality
- **Dependencies**: Task 6.7
- **Estimated Effort**: 2.5 hours

#### Task 7.5: Browser Compatibility Testing
- **Description**: Test application across different browsers and devices
- **Testing Matrix**:
  - Chrome/Edge (latest)
  - Firefox (latest)
  - Safari (latest)
  - Mobile Safari (iOS)
  - Mobile Chrome (Android)
- **Test Areas**:
  - WebSocket connectivity
  - Audio input/output
  - Canvas rendering
  - UI responsiveness
  - Performance
- **Dependencies**: Task 6.7
- **Estimated Effort**: 2 hours

#### Task 7.6: Accessibility Audit
- **Description**: Ensure application meets accessibility standards
- **Files to modify**:
  - All component files - Add ARIA labels
- **Accessibility Checklist**:
  - Keyboard navigation support
  - Screen reader compatibility
  - Focus indicators
  - Color contrast ratios
  - ARIA labels and roles
  - Alt text for icons
- **Tools**: Use Lighthouse, axe DevTools
- **Dependencies**: Task 6.7
- **Estimated Effort**: 2 hours

#### Task 7.7: Performance Profiling
- **Description**: Profile application performance and optimize bottlenecks
- **Testing Areas**:
  - Initial load time
  - Time to interactive
  - WebSocket message latency
  - Layout computation speed
  - Canvas rendering performance
  - Memory usage
- **Tools**: Chrome DevTools, Lighthouse
- **Optimization Targets**:
  - First Contentful Paint < 1.5s
  - Time to Interactive < 3s
  - Layout computation < 100ms for 50 nodes
- **Dependencies**: Task 6.5
- **Estimated Effort**: 2 hours

### Phase 8: Deployment & DevOps

#### Task 8.1: Configure Production Build
- **Description**: Optimize Next.js configuration for production deployment
- **Files to modify**:
  - `next.config.js` - Production optimizations
- **Configuration**:
  - Enable minification and compression
  - Configure output standalone mode
  - Set up environment variable handling
  - Configure security headers
  - Enable static optimization where possible
- **Dependencies**: Task 6.8
- **Estimated Effort**: 1 hour

#### Task 8.2: Set Up Docker Configuration
- **Description**: Create Docker configuration for containerized deployment
- **Files to create**:
  - `Dockerfile` - Production container
  - `docker-compose.yml` - Local development with Docker
  - `.dockerignore` - Exclude files from image
- **Implementation**:
  - Multi-stage build for optimized image size
  - Node.js Alpine base image
  - Production dependencies only
  - Health check endpoint
- **Dependencies**: Task 8.1
- **Estimated Effort**: 1.5 hours

#### Task 8.3: Create Deployment Documentation
- **Description**: Document deployment process for various platforms
- **Files to create**:
  - `docs/DEPLOYMENT.md` - Deployment guide
- **Platforms to Document**:
  - Vercel (recommended for Next.js)
  - Docker deployment
  - AWS deployment
  - Environment variable setup
  - WebSocket relay configuration
- **Dependencies**: Task 8.2
- **Estimated Effort**: 1.5 hours

#### Task 8.4: Set Up CI/CD Pipeline
- **Description**: Configure automated testing and deployment
- **Files to create**:
  - `.github/workflows/ci.yml` - CI workflow
  - `.github/workflows/deploy.yml` - Deployment workflow
- **Pipeline Steps**:
  - Lint code
  - Run unit tests
  - Run integration tests
  - Build application
  - Deploy to staging
  - Deploy to production (on release)
- **Dependencies**: Task 7.4
- **Estimated Effort**: 2 hours

#### Task 8.5: Configure Monitoring and Logging
- **Description**: Set up application monitoring and error tracking
- **Implementation**:
  - Integrate error tracking (Sentry, LogRocket, etc.)
  - Set up performance monitoring
  - Configure WebSocket connection monitoring
  - Add custom logging for critical paths
  - Set up alerts for errors
- **Dependencies**: Task 8.1
- **Estimated Effort**: 2 hours

## Codebase Integration Points

### New Files to Create

#### Core Application
- `src/app/layout.tsx` - Root layout with Tldraw styles
- `src/app/page.tsx` - Main application page
- `src/app/globals.css` - Global styles and Tailwind directives

#### Components
- `src/components/features/TldrawCanvas.tsx` - Tldraw canvas wrapper
- `src/components/features/VoiceInterface.tsx` - Voice control UI
- `src/components/ui/ErrorBoundary.tsx` - Error handling component

#### Hooks
- `src/hooks/useRealtimeAPI.ts` - WebSocket client for OpenAI
- `src/hooks/useAudioInput.ts` - Microphone capture
- `src/hooks/useAudioOutput.ts` - Audio playback
- `src/hooks/useKeyboardShortcuts.ts` - Keyboard controls

#### Libraries
- `src/lib/layout-engine.ts` - Dagre layout computation
- `src/lib/tldraw-helpers.ts` - Tldraw shape utilities
- `src/lib/function-schemas.ts` - OpenAI function definitions
- `src/lib/realtime-handlers.ts` - Event handlers
- `src/lib/export-helpers.ts` - Export utilities
- `src/lib/mock-data.ts` - Test data

#### Types
- `src/types/graph.ts` - Graph model interfaces

#### API Routes
- `src/app/api/realtime/route.ts` - WebSocket relay endpoint

#### Configuration
- `package.json` - Dependencies and scripts
- `next.config.js` - Next.js configuration
- `tailwind.config.ts` - TailwindCSS configuration
- `tsconfig.json` - TypeScript configuration
- `.env.local` - Local environment variables
- `.env.example` - Environment variable template

#### Documentation
- `README.md` - Project overview and setup
- `docs/DEVELOPMENT.md` - Development guide
- `docs/ARCHITECTURE.md` - Technical architecture
- `docs/API.md` - API documentation
- `docs/DEPLOYMENT.md` - Deployment guide

#### Testing
- `src/lib/__tests__/layout-engine.test.ts` - Layout tests
- `src/lib/__tests__/tldraw-helpers.test.ts` - Shape generation tests
- `src/lib/__tests__/realtime-handlers.test.ts` - Handler tests
- `e2e/voice-to-diagram.spec.ts` - E2E tests
- `playwright.config.ts` or `cypress.config.ts` - Test config

#### DevOps
- `Dockerfile` - Production container
- `docker-compose.yml` - Docker development setup
- `.dockerignore` - Docker ignore rules
- `.github/workflows/ci.yml` - CI pipeline
- `.github/workflows/deploy.yml` - Deployment pipeline

### Existing Patterns to Follow

Since this is a greenfield project, we'll establish these patterns:

#### Component Structure
- Use TypeScript for all files
- Functional components with hooks
- Props interfaces defined above component
- Separate UI components from feature components

#### State Management
- React hooks for local state
- Tldraw store for canvas state
- No global state library needed initially

#### Code Organization
- Feature-based organization for components
- Utility functions in `lib/` directory
- Shared types in `types/` directory
- One component per file

#### Naming Conventions
- PascalCase for components and types
- camelCase for functions and variables
- kebab-case for file names (except components)
- Descriptive names that indicate purpose

#### Error Handling
- Try-catch for async operations
- Error boundaries for React errors
- User-friendly error messages
- Console logging for debugging

## Technical Design

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                       User Interface                         │
│  ┌────────────────┐                    ┌─────────────────┐  │
│  │ VoiceInterface │                    │  TldrawCanvas   │  │
│  │  - Mic Button  │                    │  - Infinite     │  │
│  │  - Status      │                    │    Canvas       │  │
│  │  - Transcript  │                    │  - Shapes       │  │
│  └────────┬───────┘                    └────────▲────────┘  │
│           │                                      │           │
└───────────┼──────────────────────────────────────┼───────────┘
            │                                      │
            │ Audio                                │ Shapes
            │ Stream                               │ Update
            │                                      │
┌───────────▼──────────────────────────────────────┼───────────┐
│                    Application Logic              │           │
│                                                   │           │
│  ┌──────────────────┐        ┌──────────────────┴────────┐  │
│  │ useRealtimeAPI   │        │  Realtime Handlers        │  │
│  │  - WebSocket     │────────▶  - Parse function calls   │  │
│  │  - Send events   │        │  - Validate graph model   │  │
│  │  - Receive events│        │  - Trigger diagram gen    │  │
│  └────────┬─────────┘        └──────────┬────────────────┘  │
│           │                              │                   │
│           │ Function                     │ Graph              │
│           │ Call                         │ Model             │
│           │                              │                   │
│  ┌────────▼──────────┐        ┌─────────▼────────────────┐  │
│  │ OpenAI Events     │        │  Layout Engine (Dagre)   │  │
│  │  - Audio delta    │        │  - Compute positions     │  │
│  │  - Transcripts    │        │  - Auto-layout           │  │
│  │  - Function calls │        │  - No hallucination      │  │
│  └───────────────────┘        └─────────┬────────────────┘  │
│                                          │                   │
│                                          │ Positioned         │
│                                          │ Nodes/Edges       │
│                                          │                   │
│                               ┌──────────▼────────────────┐  │
│                               │  Tldraw Helpers          │  │
│                               │  - Shape generation      │  │
│                               │  - Editor API calls      │  │
│                               └──────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                               │
                               │ WebSocket
                               │
┌──────────────────────────────▼───────────────────────────────┐
│                    External Services                          │
│                                                               │
│  ┌────────────────────────┐      ┌──────────────────────┐   │
│  │ Next.js API Route      │      │ OpenAI Realtime API  │   │
│  │  - WebSocket Relay     │◀─────▶  - GPT-4o Model     │   │
│  │  - Hide API key        │      │  - Function Calling  │   │
│  └────────────────────────┘      │  - Audio Streaming   │   │
│                                   └──────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

### Data Flow

#### Voice-to-Diagram Flow

1. **User Speaks**: User clicks record button and speaks description
2. **Audio Capture**: `useAudioInput` captures microphone audio
3. **Audio Encoding**: Convert to PCM16 format at 24kHz
4. **Stream to OpenAI**: Send audio chunks via WebSocket
5. **AI Processing**: OpenAI Realtime API transcribes and understands
6. **Function Call**: AI decides to call `generate_diagram` function
7. **Graph Model**: Function call contains JSON graph (nodes + edges)
8. **Layout Computation**: Dagre calculates X/Y positions
9. **Shape Generation**: Convert positioned nodes to Tldraw shapes
10. **Canvas Update**: Insert shapes into Tldraw editor
11. **Visual Feedback**: User sees diagram appear in real-time
12. **AI Response**: OpenAI speaks confirmation of diagram creation

#### Event Flow Diagram

```
User → Mic Button → useAudioInput → WebSocket
                                      ↓
                          OpenAI Realtime API
                                      ↓
                        Transcription + Understanding
                                      ↓
                         Function Call: generate_diagram
                                      ↓
                     GraphModel: { nodes, edges }
                                      ↓
                    Realtime Handler (validates)
                                      ↓
                   Layout Engine (Dagre computes positions)
                                      ↓
                  PositionedNodes + Edges
                                      ↓
                  Tldraw Helpers (generate shapes)
                                      ↓
                  Editor.createShape() × N
                                      ↓
                  Canvas Updates (diagram appears)
                                      ↓
                  Function Output sent to OpenAI
                                      ↓
                  AI Confirmation (audio response)
```

### State Management

#### Application State
- **Connection State**: disconnected | connecting | connected
- **Recording State**: idle | recording
- **Processing State**: idle | processing | generating
- **Error State**: null | Error object

#### Tldraw State
- Managed internally by Tldraw store
- Shapes, arrows, selections
- Viewport position and zoom
- Accessed via Editor instance

#### WebSocket State
- Connection reference in `useRealtimeAPI`
- Audio streaming active/inactive
- Pending function calls

### API Endpoints

#### Next.js API Routes

**`GET /api/realtime`**
- Purpose: WebSocket relay to OpenAI Realtime API
- Authentication: Server-side API key injection
- Upgrade: HTTP → WebSocket
- Relay: Bidirectional message passing

#### OpenAI Realtime API Events

**Client → Server**:
- `session.update` - Configure session
- `input_audio_buffer.append` - Stream audio
- `conversation.item.create` - Send function output
- `response.create` - Request AI response

**Server → Client**:
- `session.created` - Session ready
- `input_audio_buffer.speech_started` - User started speaking
- `input_audio_buffer.speech_stopped` - User stopped speaking
- `conversation.item.created` - New conversation item
- `response.audio.delta` - Audio response chunk
- `response.function_call_arguments.done` - Function call ready
- `response.done` - Response complete

### Type System

#### Core Types

```typescript
// Graph model (from AI)
interface GraphNode {
  id: string;
  label: string;
  type: 'process' | 'decision' | 'start' | 'end' | 'data' | 'default';
  metadata?: Record<string, unknown>;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

interface GraphModel {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// Positioned nodes (after layout)
interface PositionedNode extends GraphNode {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface LayoutResult {
  nodes: PositionedNode[];
  edges: GraphEdge[];
}

// OpenAI events
interface FunctionCallEvent {
  type: 'response.function_call_arguments.done';
  call_id: string;
  name: string;
  arguments: string; // JSON string of GraphModel
}

// Application state
type ConnectionState = 'disconnected' | 'connecting' | 'connected';
type RecordingState = 'idle' | 'recording';
type ProcessingState = 'idle' | 'processing' | 'generating';
```

## Dependencies and Libraries

### Production Dependencies

- **next** (14.3.0+) - React framework with App Router
- **react** (18.3.0+) - UI library
- **react-dom** (18.3.0+) - React DOM rendering
- **tldraw** (latest) - Infinite canvas and shape library
- **@dagrejs/dagre** (latest) - Graph layout algorithm
- **lucide-react** (latest) - Icon library
- **tailwindcss** (3.4.0+) - CSS framework

### Development Dependencies

- **typescript** (5.3.0+) - Type checking
- **@types/react** - React type definitions
- **@types/react-dom** - React DOM type definitions
- **@types/dagre** - Dagre type definitions
- **eslint** - Code linting
- **eslint-config-next** - Next.js ESLint configuration
- **prettier** - Code formatting
- **@playwright/test** or **cypress** - E2E testing
- **jest** - Unit testing framework
- **@testing-library/react** - React component testing

### Optional Dependencies

- **@sentry/nextjs** - Error tracking
- **ws** - WebSocket library for custom relay server

## Testing Strategy

### Unit Tests

#### Layout Engine Tests
- Test Dagre layout computation
- Verify position calculations
- Test different graph structures
- Test edge cases (empty, single node)

#### Tldraw Helpers Tests
- Test shape generation
- Test node type mapping
- Test edge/arrow creation
- Mock Editor API calls

#### Function Handler Tests
- Test function call parsing
- Test error handling
- Test Editor integration
- Mock WebSocket events

### Integration Tests

#### Realtime Handler Integration
- Test complete function call flow
- Test layout + shape generation pipeline
- Test error propagation
- Mock WebSocket and Editor

### End-to-End Tests

#### User Workflows
- Test canvas rendering
- Test mock graph generation button
- Test WebSocket connection (mocked)
- Test UI state transitions
- Test export functionality

#### Browser Compatibility
- Chrome/Edge
- Firefox
- Safari
- Mobile browsers

### Performance Tests

- Layout computation speed (target: <100ms for 50 nodes)
- Canvas rendering performance
- WebSocket latency
- Memory usage over time
- Audio streaming latency

### Accessibility Tests

- Keyboard navigation
- Screen reader compatibility
- Focus management
- Color contrast
- ARIA labels

## Success Criteria

### Functional Requirements
- ✅ User can speak naturally to describe a diagram
- ✅ System transcribes and understands speech
- ✅ AI generates semantic graph model (no coordinates)
- ✅ Dagre computes layout automatically
- ✅ Diagram appears on Tldraw canvas in real-time
- ✅ Nodes have correct shapes based on type
- ✅ Edges connect nodes with proper arrows
- ✅ Multiple diagrams can be created in sequence
- ✅ User receives audio confirmation from AI

### Performance Requirements
- ✅ Initial page load < 3 seconds
- ✅ WebSocket connection < 1 second
- ✅ Layout computation < 100ms (50 nodes)
- ✅ Audio-to-diagram latency < 5 seconds
- ✅ Smooth canvas interaction (60 FPS)

### Quality Requirements
- ✅ No coordinate hallucination from AI
- ✅ TypeScript type safety throughout
- ✅ Comprehensive error handling
- ✅ Clean separation of concerns
- ✅ 80%+ test coverage
- ✅ Accessible (WCAG AA)
- ✅ Browser compatible (modern browsers)

### User Experience Requirements
- ✅ Clear visual feedback during processing
- ✅ Error messages are user-friendly
- ✅ Microphone permissions handled gracefully
- ✅ Canvas is responsive and intuitive
- ✅ Export functionality works reliably
- ✅ Keyboard shortcuts for power users

## Notes and Considerations

### Technical Challenges

#### WebSocket Relay in Next.js
- **Challenge**: Next.js doesn't natively support WebSocket in API routes
- **Solution Options**:
  1. Use a separate Node.js WebSocket server alongside Next.js
  2. Use Vercel's serverless functions with WebSocket support
  3. Use external relay service
  4. Deploy custom server with Next.js custom server mode
- **Recommendation**: Start with separate WebSocket server for development, evaluate Vercel deployment options

#### Audio Processing
- **Challenge**: Browser audio APIs can be complex and browser-specific
- **Considerations**:
  - Ensure microphone permissions are requested correctly
  - Handle different sample rates across browsers
  - Test audio quality and latency
  - Consider using existing audio libraries if needed

#### Real-Time Performance
- **Challenge**: Large diagrams may cause performance issues
- **Optimizations**:
  - Batch shape creation instead of individual operations
  - Use Tldraw's built-in performance optimizations
  - Limit diagram complexity (suggest breaking into multiple diagrams)
  - Profile and optimize hot paths

#### Function Calling Reliability
- **Challenge**: AI may not always call function correctly
- **Mitigations**:
  - Clear function schema with examples
  - Strong system instructions
  - Validation of function arguments
  - Graceful error handling and retry logic
  - User feedback if AI doesn't understand

### Future Enhancements

#### Phase 9: Advanced Features
- **Collaborative Editing**: Multiple users working on same diagram
- **Diagram Templates**: Pre-built templates for common diagram types
- **Custom Node Types**: User-defined shapes and styling
- **Animation**: Animate diagram creation step-by-step
- **Undo/Redo**: Enhanced history management beyond Tldraw default
- **Auto-Save**: Persist diagrams to database or local storage
- **Diagram Library**: Save and browse previous diagrams

#### Phase 10: AI Enhancements
- **Diagram Modification**: Voice commands to edit existing diagrams
- **Multi-Turn Conversations**: Build diagrams iteratively
- **Intelligent Layout**: AI suggests optimal layout configurations
- **Diagram Analysis**: AI explains or critiques diagram structure
- **Style Suggestions**: AI recommends colors, shapes based on content

#### Phase 11: Export & Integration
- **Multiple Export Formats**: Mermaid, PlantUML, Graphviz
- **API for Programmatic Access**: REST API for diagram generation
- **Embeddable Widget**: Embed voice-to-diagram in other apps
- **Cloud Storage Integration**: Save to Google Drive, Dropbox
- **Presentation Mode**: Full-screen diagram presentation

### Known Limitations

1. **OpenAI API Costs**: Realtime API is relatively expensive; monitor usage
2. **Browser Compatibility**: Some browsers may not support required audio APIs
3. **Microphone Required**: Application requires working microphone
4. **Internet Required**: Cannot work offline due to OpenAI dependency
5. **Diagram Complexity**: Very large diagrams (100+ nodes) may have performance issues
6. **Language Support**: Initially English only; expand later
7. **Diagram Types**: Optimized for flowcharts and process diagrams; other types may need custom handling

### Security Considerations

1. **API Key Protection**: Never expose OpenAI API key to client
2. **Input Validation**: Validate all graph models from AI before rendering
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **Authentication**: Consider adding user authentication for production
5. **CORS**: Configure CORS properly for WebSocket relay
6. **Content Security Policy**: Set up CSP headers for Next.js app
7. **Error Information**: Don't leak sensitive error details to client

### Monitoring & Observability

1. **Error Tracking**: Set up Sentry or similar for production errors
2. **Performance Monitoring**: Track key metrics (layout time, render time)
3. **WebSocket Health**: Monitor connection success rate and latency
4. **API Usage**: Track OpenAI API calls and costs
5. **User Analytics**: Track feature usage (export, clear, etc.)
6. **Logging**: Structured logging for debugging and audit trails

## Resources and References

### Official Documentation
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Tldraw Documentation](https://tldraw.dev/)
- [Dagre GitHub Repository](https://github.com/dagrejs/dagre)
- [OpenAI Realtime API Documentation](https://platform.openai.com/docs/guides/realtime)

### Research References
- [Next.js Best Practices 2025](https://medium.com/@GoutamSingha/next-js-best-practices-in-2025-build-faster-cleaner-scalable-apps-7efbad2c3820)
- [Next.js File Structure Guide](https://medium.com/better-dev-nextjs-react/inside-the-app-router-best-practices-for-next-js-file-and-directory-structure-2025-edition-ed6bc14a8da3)
- [Tldraw SDK 4.0 Announcement](https://tldraw.dev/blog/tldraw-sdk-4-0)
- [React Flow Dagre Example](https://reactflow.dev/examples/layout/dagre)
- [OpenAI Realtime API Tutorial](https://skywork.ai/blog/agent/openai-realtime-api-javascript-tutorial-websocket-guide/)
- [OpenAI Realtime API Cheat Sheet](https://skywork.ai/blog/openai-realtime-api-cheat-sheet-2025-quick-reference/)

### Community Resources
- [Tldraw GitHub](https://github.com/tldraw/tldraw)
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)
- [OpenAI Community Forum](https://community.openai.com/)

---

*This implementation plan is ready for execution with `/execute-plan PRPs/requests/voice-to-diagram.md`*

**Plan Created**: 2025-12-09
**Estimated Total Effort**: 70-90 hours
**Target Timeline**: 4-6 weeks (based on team size and velocity)
**Risk Level**: Medium (WebSocket relay setup, audio processing complexity)
**Key Success Metric**: User can speak a description and see a properly laid-out diagram within 5 seconds
