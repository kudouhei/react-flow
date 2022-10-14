import React, { PureComponent } from 'react';

import { separateElements, parseElements } from './graph-utils';
import GraphView from './GraphView';
import { Provider } from './GraphContext';
import { createNodeTypes } from './NodeRenderer/utils';

import DefaultNode from './NodeRenderer/NodeTypes/DefaultNode';
import InputNode from './NodeRenderer/NodeTypes/InputNode';
import OutputNode from './NodeRenderer/NodeTypes/OutputNode';

import './style.css';

class ReactGraph extends PureComponent {
  constructor(props) {
    super(props);
    this.nodeTypes = createNodeTypes(props.nodeTypes);
  }

  render() {
    const {
      style, onNodeClick, children, onLoad, onMove, elements, onChange
    } = this.props;

    const { nodes, edges } = elements.map(parseElements).reduce(separateElements, {});

    return (
      <div style={style} className="react-graph">
        <Provider nodes={nodes} edges={edges} onNodeClick={onNodeClick}>
          <GraphView onLoad={onLoad} onMove={onMove} onChange={onChange} nodeTypes={this.nodeTypes} />
          {children}
        </Provider>
      </div>
    );
  }
}

ReactGraph.defaultProps = {
	onNodeClick: () => {},
	onLoad: () => {},
	onMove: () => {},
  onChange: () => {},
  nodeTypes: {
    input: InputNode,
    default: DefaultNode,
    output: OutputNode
  },
};

export default ReactGraph;
