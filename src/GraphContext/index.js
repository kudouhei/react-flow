import React, { createContext, useEffect, useReducer } from "react";
import PropTypes from "prop-types";

import isEqual from 'lodash.isequal';

import { reducer, initialState } from '../state';
import { setNodes, setEdges } from '../state/actions';

export const GraphContext = createContext({});

export const Provider = (props) => {
  const { 
    onNodeClick,
    children
  } = props;

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const nextNodes = props.nodes.map(propNode => {
      const existingNode = state.nodes.find(n => n.data.id === propNode.data.id);

      if (existingNode) {
        return {
          ...existingNode,
          data: { ...existingNode.data, ...propNode.data }
        }
      }
      return propNode;
    });

    const nodesChanged = !isEqual(state.nodes, nextNodes);
    const edgesChanged = !isEqual(state.edges, props.edges);

    if (nodesChanged) {
      dispatch(setNodes(nextNodes));
    }

    if (edgesChanged) {
      dispatch(setEdges(props.edges));
    }
  });

  const graphContext = {
    onNodeClick,
    state,
    dispatch
  };

  return (
    <GraphContext.Provider
      value={graphContext}
    >
      {children}
    </GraphContext.Provider>
  );
};

export const { Consumer } = GraphContext;

Provider.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.object),
  edges: PropTypes.arrayOf(PropTypes.object)
};

Provider.defaultProps = {
  nodes: [],
  edges: []
};
