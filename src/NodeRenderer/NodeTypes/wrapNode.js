import React, { useEffect, useRef, useContext, useState } from 'react';
import ReactDraggable from 'react-draggable';

import { GraphContext } from '../../GraphContext';
import { updateNodeData, updateNodePos, setSelectedElements } from '../../state/actions';
import cx from 'classnames';
import { isEdge } from '../../graph-utils';

const isInputTarget = (e) => ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.nodeName);

export default NodeComponent => (props) => {
  const nodeElement = useRef(null);
  const { state, dispatch } = useContext(GraphContext);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const { data, onClick, __rg } = props;
  const { position } = __rg;
  const { id } = data;

  const [ x, y, k ] = state.transform;

  const selected = state.selectedElements.filter(e => !isEdge(e)).map(e => e.data.id).includes(id);
  const nodeClasses = cx('react-graph__node', { selected });

  useEffect(() => {
    const bounds = nodeElement.current.getBoundingClientRect();
    const unscaledWidth = Math.round(bounds.width * (1 / k));
    const unscaledHeight = Math.round(bounds.height * (1 / k));

    dispatch(updateNodeData(id, { width: unscaledWidth, height: unscaledHeight }));
  }, []);

  return (
    <ReactDraggable.DraggableCore
      grid={[1, 1]}
      onStart={(e) => {
        if (isInputTarget(e)) {
          return false;
        }
        const unscaledPos = {
          x: e.clientX * (1 / k),
          y: e.clientY * (1 / k)
        }
        const offsetX = unscaledPos.x - position.x - x;
        const offsetY = unscaledPos.y - position.y - y;

        setOffset({ x: offsetX, y: offsetY });
      }}
      onDrag={(e, d) => {
        const unscaledPos = {
          x: e.clientX * (1 / k),
          y: e.clientY * (1 / k)
        }

        e.preventDefault();
        e.stopPropagation();

        dispatch(updateNodePos(id, {
          x: unscaledPos.x - x - offset.x,
          y: unscaledPos.y - y - offset.y
        }));
      }}
      scale={k}
    >
      <div
        className={nodeClasses}
        ref={nodeElement}
        style={{ zIndex: selected ? 10 : 3, transform: `translate(${position.x}px,${position.y}px)` }}
        onClick={(e) => {
          if (isInputTarget(e)) {
            return false;
          }
          dispatch(setSelectedElements(id))
          onClick({ data, position });
        }}
      >
        <NodeComponent {...props} />
      </div>
    </ReactDraggable.DraggableCore>
  );
};
