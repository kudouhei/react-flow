import React, { useContext, useState, memo } from 'react';
import ReactDraggable from 'react-draggable';

import { GraphContext } from '../GraphContext';
import { isNode } from '../graph-utils';
import {  updateNodePos } from '../state/actions';

function getStartPositions(elements) {
  return elements
    .filter(isNode)
    .reduce((res, node) => {
      const startPosition = {
        x: node.__rg.position.x || node.position.x,
        y: node.__rg.position.y || node.position.x
      };

      res[node.id] = startPosition;

      return res;
  }, {});
}

export default memo(() => {
  const graphContext = useContext(GraphContext);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [startPositions, setStartPositions] = useState({});
  const { state, dispatch } = graphContext;
  const [x, y, k] = state.transform;
  const position = state.selectedNodesBbox;

  const onStart = (evt) => {
    const scaledClient = {
      x: evt.clientX * (1 / k),
      y: evt.clientY * (1 / k)
    };
    const offsetX = scaledClient.x - position.x - x;
    const offsetY = scaledClient.y - position.y - y;
    const startPositions = getStartPositions(state.selectedElements);

    setOffset({ x: offsetX, y: offsetY });
    setStartPositions(startPositions);
  };

  const onDrag = (evt) => {
    const scaledClient = {
      x: evt.clientX * (1 / k),
      y: evt.clientY * (1 / k)
    };

    state.selectedElements.filter(isNode).forEach(node => {
      dispatch(updateNodePos(node.id, {
        x: startPositions[node.id].x + scaledClient.x - position.x - offset.x - x ,
        y: startPositions[node.id].y + scaledClient.y - position.y - offset.y - y
      }));
    });
  };

  return (
    <div
      className="react-graph__nodesselection"
      style={{
        transform: `translate(${state.transform[0]}px,${state.transform[1]}px) scale(${state.transform[2]})`
      }}
    >
      <ReactDraggable
        scale={k}
        onStart={onStart}
        onDrag={onDrag}
      >
        <div
          className="react-graph__nodesselection-rect"
          style={{
            width: state.selectedNodesBbox.width,
            height: state.selectedNodesBbox.height,
            top: state.selectedNodesBbox.y,
            left: state.selectedNodesBbox.x
          }}
        />
      </ReactDraggable>
    </div>
  );
});