import { zoomIdentity } from 'd3-zoom';

import { getBoundingBox, getNodesInside, getConnectedEdges } from '../graph-utils';

export const SET_EDGES = 'SET_EDGES';
export const SET_NODES = 'SET_NODES';
export const UPDATE_NODE_DATA = 'UPDATE_NODE_DATA';
export const UPDATE_NODE_POS = 'UPDATE_NODE_POS';
export const UPDATE_TRANSFORM = 'UPDATE_TRANSFORM';
export const UPDATE_SIZE = 'UPDATE_SIZE';
export const INIT_D3 = 'INIT_D3';
export const FIT_VIEW = 'FIT_VIEW';
export const ZOOM_IN = 'ZOOM_IN';
export const ZOOM_OUT = 'ZOOM_OUT';
export const UPDATE_SELECTION = 'UPDATE_SELECTION';
export const SET_SELECTION = 'SET_SELECTION';
export const SET_NODES_SELECTION = 'SET_NODES_SELECTION';
export const SET_SELECTED_ELEMENTS = 'SET_SELECTED_ELEMENTS';
export const REMOVE_NODES = 'REMOVE_NODES';
export const SET_CONNECTING = 'SET_CONNECTING';
export const SET_CONNECTION_POS = 'SET_CONNECTION_POS';

export const initialState = {
  width: 0,
  height: 0,
  transform: [0, 0, 1],
  nodes: [],
  edges: [],
  selectedElements: [],
  selectedNodesBbox: { x: 0, y: 0, width: 0, height: 0 },

  d3Zoom: null,
  d3Selection: null,
  d3Initialised: false,

  nodesSelectionActive: false,
  selectionActive: false,
  selection: {},

  connectionSourceId: null,
  connectionPosition: { x: 0, y: 0 }
};

export const reducer = (state, action) => {
  switch (action.type) {
    case UPDATE_NODE_DATA: {
      return {
        ...state,
        nodes: state.nodes.map((n) => {
          if (n.id === action.payload.id) {
            n.__rg = {
              ...n.__rg,
              ...action.payload.data
            };
          }
          return n;
        })
      };
    }
    case UPDATE_NODE_POS: {
      return {
        ...state,
        nodes: state.nodes.map((n) => {
          if (n.id === action.payload.id) {
            n.__rg = {
              ...n.__rg,
              position: action.payload.pos
            };
          }

          return n;
        })
      };
    }
    case FIT_VIEW: {
      const bounds = getBoundingBox(state.nodes);
      const maxBoundsSize = Math.max(bounds.width, bounds.height);
      const k = Math.min(state.width, state.height) / (maxBoundsSize);
      const boundsCenterX = bounds.x + (bounds.width / 2);
      const boundsCenterY = bounds.y + (bounds.height / 2);
      const transform = [(state.width / 2) - (boundsCenterX * k), (state.height / 2) - (boundsCenterY * k)];
      const fittedTransform = zoomIdentity.translate(transform[0], transform[1]).scale(k);

      state.d3Selection.call(state.d3Zoom.transform, fittedTransform);

      return state;
    }
    case ZOOM_IN: {
      const { transform } = state;
      state.d3Zoom.scaleTo(state.d3Selection, transform[2] + 0.2);
      return state;
    }
    case ZOOM_OUT: {
      const { transform } = state;
      state.d3Zoom.scaleTo(state.d3Selection, transform[2] - 0.2);

      return state;
    }
    case UPDATE_SELECTION: {
      const selectedNodes = getNodesInside(state.nodes, action.payload.selection, state.transform);
      const selectedEdges = getConnectedEdges(selectedNodes, state.edges);

      return {
        ...state,
        ...action.payload,
        selectedElements: [...selectedNodes, ...selectedEdges]
      };
    }
    case SET_NODES_SELECTION: {
      if (!action.payload.nodesSelectionActive) {
        return { ...state, nodesSelectionActive: false, selectedElements: [] };
      }
      const selectedNodes = getNodesInside(state.nodes, action.payload.selection, state.transform);
      const selectedNodesBbox = getBoundingBox(selectedNodes);

      return { ...state, ...action.payload, selectedNodesBbox };
    }
    // unused
    case REMOVE_NODES: {
      const { ids } = action.payload;
      const nextEdges = state.edges.filter(e => !ids.includes(e.target) && !ids.includes(e.source));
      const nextNodes = state.nodes.filter(n => !ids.includes(n.id));

      return { ...state, nodes: nextNodes, edges: nextEdges };
    }
    case SET_CONNECTING: {
      if (!action.payload.connectionPosition) {
        return { ...state, connectionSourceId: action.payload.connectionSourceId };
      }
      return { ...state, ...action.payload };
    }
    case SET_NODES:
    case SET_EDGES:
    case UPDATE_TRANSFORM:
    case INIT_D3:
    case UPDATE_SIZE:
    case SET_SELECTION:
    case SET_SELECTED_ELEMENTS:
    case SET_CONNECTION_POS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};