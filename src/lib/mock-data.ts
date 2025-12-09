import { GraphModel } from '@/types/graph';

/**
 * Mock flowchart for testing
 */
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

/**
 * Simple linear process diagram
 */
export const mockLinearProcess: GraphModel = {
  nodes: [
    { id: '1', label: 'Step 1', type: 'start' },
    { id: '2', label: 'Step 2', type: 'process' },
    { id: '3', label: 'Step 3', type: 'process' },
    { id: '4', label: 'Step 4', type: 'end' }
  ],
  edges: [
    { id: 'e1', source: '1', target: '2' },
    { id: 'e2', source: '2', target: '3' },
    { id: 'e3', source: '3', target: '4' }
  ]
};

/**
 * Complex branching diagram
 */
export const mockComplexDiagram: GraphModel = {
  nodes: [
    { id: '1', label: 'User Input', type: 'start' },
    { id: '2', label: 'Validate', type: 'process' },
    { id: '3', label: 'Valid?', type: 'decision' },
    { id: '4', label: 'Parse Data', type: 'process' },
    { id: '5', label: 'Transform', type: 'process' },
    { id: '6', label: 'Check Type', type: 'decision' },
    { id: '7', label: 'Type A Handler', type: 'process' },
    { id: '8', label: 'Type B Handler', type: 'process' },
    { id: '9', label: 'Type C Handler', type: 'process' },
    { id: '10', label: 'Store Result', type: 'data' },
    { id: '11', label: 'Success', type: 'end' },
    { id: '12', label: 'Error', type: 'end' }
  ],
  edges: [
    { id: 'e1', source: '1', target: '2' },
    { id: 'e2', source: '2', target: '3' },
    { id: 'e3', source: '3', target: '4', label: 'Yes' },
    { id: 'e4', source: '3', target: '12', label: 'No' },
    { id: 'e5', source: '4', target: '5' },
    { id: 'e6', source: '5', target: '6' },
    { id: 'e7', source: '6', target: '7', label: 'Type A' },
    { id: 'e8', source: '6', target: '8', label: 'Type B' },
    { id: 'e9', source: '6', target: '9', label: 'Type C' },
    { id: 'e10', source: '7', target: '10' },
    { id: 'e11', source: '8', target: '10' },
    { id: 'e12', source: '9', target: '10' },
    { id: 'e13', source: '10', target: '11' }
  ]
};

/**
 * All available mock diagrams
 */
export const mockDiagrams = {
  flowchart: mockFlowchart,
  linear: mockLinearProcess,
  complex: mockComplexDiagram
};
