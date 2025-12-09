// Node in the semantic graph (before layout)
export interface GraphNode {
  id: string;
  label: string;
  type: 'process' | 'decision' | 'start' | 'end' | 'data' | 'default';
  metadata?: Record<string, unknown>;
}

// Edge connecting nodes
export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

// Complete graph structure from AI
export interface GraphModel {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// Node after Dagre layout (with coordinates)
export interface PositionedNode extends GraphNode {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Layout result
export interface LayoutResult {
  nodes: PositionedNode[];
  edges: GraphEdge[];
}

// Application state types
export type ConnectionState = 'disconnected' | 'connecting' | 'connected';
export type RecordingState = 'idle' | 'recording';
export type ProcessingState = 'idle' | 'processing' | 'generating';

// OpenAI Realtime API event types
export interface FunctionCallEvent {
  type: 'response.function_call_arguments.done';
  call_id: string;
  name: string;
  arguments: string; // JSON string of GraphModel
}
