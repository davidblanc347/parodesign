/**
 * Diagram Parser Utility
 *
 * Extracts and validates diagram JSON from AI responses
 */

import { GraphModel } from '@/types/graph';

/**
 * Extract diagram JSON from AI response text
 * Looks for content between [DIAGRAM_START] and [DIAGRAM_END] markers
 */
export function extractDiagramFromResponse(response: string): GraphModel | null {
  try {
    const startMarker = '[DIAGRAM_START]';
    const endMarker = '[DIAGRAM_END]';

    const startIndex = response.indexOf(startMarker);
    const endIndex = response.indexOf(endMarker);

    if (startIndex === -1 || endIndex === -1) {
      console.log('No diagram markers found in response');
      return null;
    }

    const jsonStr = response.substring(
      startIndex + startMarker.length,
      endIndex
    ).trim();

    const diagram = JSON.parse(jsonStr) as GraphModel;

    // Validate diagram structure
    if (!validateDiagram(diagram)) {
      console.error('Invalid diagram structure');
      return null;
    }

    return diagram;
  } catch (error) {
    console.error('Failed to extract diagram from response:', error);
    return null;
  }
}

/**
 * Validate diagram structure
 */
export function validateDiagram(diagram: any): diagram is GraphModel {
  if (!diagram || typeof diagram !== 'object') {
    return false;
  }

  if (!Array.isArray(diagram.nodes) || !Array.isArray(diagram.edges)) {
    return false;
  }

  // Validate nodes
  for (const node of diagram.nodes) {
    if (!node.id || !node.label || !node.type) {
      console.error('Invalid node structure:', node);
      return false;
    }

    const validTypes = ['start', 'process', 'decision', 'end', 'data', 'default'];
    if (!validTypes.includes(node.type)) {
      console.error('Invalid node type:', node.type);
      return false;
    }
  }

  // Validate edges
  for (const edge of diagram.edges) {
    if (!edge.id || !edge.source || !edge.target) {
      console.error('Invalid edge structure:', edge);
      return false;
    }

    // Check that source and target nodes exist
    const sourceExists = diagram.nodes.some((n: any) => n.id === edge.source);
    const targetExists = diagram.nodes.some((n: any) => n.id === edge.target);

    if (!sourceExists || !targetExists) {
      console.error('Edge references non-existent node:', edge);
      return false;
    }
  }

  return true;
}

/**
 * Remove diagram markers from response text (for display)
 */
export function stripDiagramMarkers(response: string): string {
  return response
    .replace(/\[DIAGRAM_START\][\s\S]*?\[DIAGRAM_END\]/g, '[Diagram generated]')
    .trim();
}
