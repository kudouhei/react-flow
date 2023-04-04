import React, { PureComponent } from 'react';

import { separateElements, parseElements } from './graph-utils';
import GraphView from './GraphView';
import GlobalKeyHandler from './GlobalKeyHandler';
import { Provider } from './GraphContext';

import DefaultNode from './NodeRenderer/NodeTypes/DefaultNode';
import InputNode from './NodeRenderer/NodeTypes/InputNode';
import OutputNode from './NodeRenderer/NodeTypes/OutputNode';
import { createNodeTypes } from './NodeRenderer/utils';

import DefaultEdge from './EdgeRenderer/EdgeTypes/DefaultEdge';
import { createEdgeTypes } from './EdgeRenderer/utils';

import './style.css';

class ReactGraph extends PureComponent {
  constructor(props) {
    super(props);
    this.nodeTypes = createNodeTypes(props.nodeTypes);
    this.edgeTypes = createEdgeTypes(props.edgeTypes);
  }

  render() {
    const {
      style, onElementClick, children, onLoad, onMove, elements, onChange, onNodeRemove
    } = this.props;

    const { nodes, edges } = elements.map(parseElements).reduce(separateElements, {});

    return (
      <div style={style} className="react-graph">
        <Provider nodes={nodes} edges={edges} onElementClick={onElementClick}>
          <GraphView 
            onLoad={onLoad} 
            onMove={onMove} 
            onChange={onChange} 
            nodeTypes={this.nodeTypes}
            edgeTypes={this.edgeTypes}
           />
          <GlobalKeyHandler onNodeRemove={onNodeRemove} />
          {children}
        </Provider>
      </div>
    );
  }
}

ReactGraph.defaultProps = {
	onElementClick: () => {},
  onNodeRemove: () => {},
	onLoad: () => {},
	onMove: () => {},
  onChange: () => {},
  nodeTypes: {
    input: InputNode,
    default: DefaultNode,
    output: OutputNode
  },
  edgeTypes: {
    default: DefaultEdge
  }
};

export default ReactGraph;
