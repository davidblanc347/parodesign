import { Editor, createShapeId, TLGeoShape } from 'tldraw';
import { LayoutResult, PositionedNode } from '@/types/graph';

/**
 * Add test shapes to the canvas for testing programmatic control
 */
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
      text: 'Test Node',
      fill: 'solid',
      color: 'blue'
    }
  });

  // Add a second shape with an arrow
  const shapeId2 = createShapeId();
  editor.createShape({
    id: shapeId2,
    type: 'geo',
    x: 400,
    y: 100,
    props: {
      w: 200,
      h: 100,
      geo: 'rectangle',
      text: 'Test Node 2',
      fill: 'solid',
      color: 'green'
    }
  });

  // Create an arrow between them using absolute coordinates
  const arrowId = createShapeId();
  editor.createShape({
    id: arrowId,
    type: 'arrow',
    x: 0,
    y: 0,
    props: {
      start: { x: 300, y: 150 }, // End of first shape
      end: { x: 400, y: 150 }    // Start of second shape
    }
  });
}

/**
 * Map node types to Tldraw geo shapes
 */
function getGeoTypeForNode(nodeType: string): TLGeoShape['props']['geo'] {
  switch (nodeType) {
    case 'decision':
      return 'diamond';
    case 'start':
    case 'end':
      return 'ellipse';
    case 'data':
      return 'trapezoid';
    default:
      return 'rectangle';
  }
}

/**
 * Generate Tldraw shapes from positioned graph nodes
 */
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
        color: node.type === 'start' ? 'green' : node.type === 'end' ? 'red' : 'blue'
      }
    });
  });

  // Create edge arrows with bindings
  layout.edges.forEach(edge => {
    const sourceShapeId = nodeShapeMap.get(edge.source);
    const targetShapeId = nodeShapeMap.get(edge.target);

    if (sourceShapeId && targetShapeId) {
      // Get source and target nodes to calculate positions
      const sourceNode = layout.nodes.find(n => n.id === edge.source);
      const targetNode = layout.nodes.find(n => n.id === edge.target);

      if (sourceNode && targetNode) {
        const arrowId = createShapeId();

        // Calculate start and end points (bottom center of source, top center of target)
        const startX = sourceNode.x + sourceNode.width / 2;
        const startY = sourceNode.y + sourceNode.height;
        const endX = targetNode.x + targetNode.width / 2;
        const endY = targetNode.y;

        editor.createShape({
          id: arrowId,
          type: 'arrow',
          x: 0,
          y: 0,
          props: {
            start: { x: startX, y: startY },
            end: { x: endX, y: endY },
            text: edge.label || ''
          }
        });
      }
    }
  });
}

/**
 * Clear all shapes from the canvas
 */
export function clearCanvas(editor: Editor) {
  editor.selectAll();
  editor.deleteShapes(editor.getSelectedShapeIds());
}
