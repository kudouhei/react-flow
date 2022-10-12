import React, { PureComponent } from 'react';

import { Consumer } from '../GraphContext';

class NodeRenderer extends PureComponent {
  renderNode(d, onNodeClick) {
    const nodeType = d.data.type || 'default';
    if (!this.props.nodeTypes[nodeType]) {
      console.warn(`No node type found for type "${nodeType}". Using type "default".`);
    }

    const NodeComponent = this.props.nodeTypes[nodeType] || this.props.nodeTypes.default;

    return (
      <NodeComponent
        key={d.data.id}
        position={d.position}
        data={d.data}
        style={d.style || {}}
        onNodeClick={onNodeClick}
      />
    );
  }

  render() {
    return (
      <Consumer>
        {({ state, onNodeClick }) => (
          <div
          className="react-graph__nodes"
          style={{
            transform: `translate(${state.transform[0]}px,${state.transform[1]}px) scale(${state.transform[2]})`
          }}
        >
          {state.nodes.map(d => this.renderNode(d, onNodeClick))}
        </div>
        )}
      </Consumer>
    );
  }
}

export default NodeRenderer;
