import dagre from '@dagrejs/dagre';
import { GraphModel, LayoutResult, PositionedNode } from '@/types/graph';

// Default node dimensions
const NODE_WIDTH = 180;
const NODE_HEIGHT = 80;

/**
 * Layout configuration options
 */
export interface LayoutOptions {
  rankdir?: 'TB' | 'BT' | 'LR' | 'RL'; // Layout direction
  nodesep?: number; // Horizontal spacing between nodes
  ranksep?: number; // Vertical spacing between ranks
  nodeWidth?: number;
  nodeHeight?: number;
}

/**
 * Compute automatic layout for a graph using Dagre
 * @param graphModel - The semantic graph model from AI
 * @param options - Layout configuration options
 * @returns Layout result with positioned nodes
 */
export function getAutoLayout(
  graphModel: GraphModel,
  options: LayoutOptions = {}
): LayoutResult {
  const {
    rankdir = 'TB',
    nodesep = 50,
    ranksep = 100,
    nodeWidth = NODE_WIDTH,
    nodeHeight = NODE_HEIGHT
  } = options;

  // Create new Dagre graph
  const graph = new dagre.graphlib.Graph();

  // Configure layout
  graph.setGraph({
    rankdir,
    nodesep,
    ranksep
  });

  graph.setDefaultEdgeLabel(() => ({}));

  // Add nodes to Dagre graph
  graphModel.nodes.forEach(node => {
    graph.setNode(node.id, {
      label: node.label,
      width: nodeWidth,
      height: nodeHeight
    });
  });

  // Add edges to Dagre graph
  graphModel.edges.forEach(edge => {
    graph.setEdge(edge.source, edge.target);
  });

  // Compute layout
  dagre.layout(graph);

  // Extract positioned nodes
  const positionedNodes: PositionedNode[] = graphModel.nodes.map(node => {
    const nodeWithPosition = graph.node(node.id);

    // Dagre returns center position, we need top-left
    return {
      ...node,
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
      width: nodeWidth,
      height: nodeHeight
    };
  });

  return {
    nodes: positionedNodes,
    edges: graphModel.edges
  };
}
