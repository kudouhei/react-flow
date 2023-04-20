import React, { PureComponent } from "react";

if (process.env.NODE_ENV !== 'production') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}

import { parseElements, separateElements } from "../graph-utils";
import GraphView from "../GraphView";
import GlobalKeyHandler from "../GlobalKeyHandler";
import { Provider } from "../GraphContext";

import DefaultNode from "../NodeRenderer/NodeTypes/DefaultNode";
import InputNode from "../NodeRenderer/NodeTypes/InputNode";
import OutputNode from "../NodeRenderer/NodeTypes/OutputNode";
import { createNodeTypes } from "../NodeRenderer/utils";

import BezierEdge from "../EdgeRenderer/EdgeTypes/BezierEdge";
import StraightEdge from "../EdgeRenderer/EdgeTypes/StraightEdge";
import { createEdgeTypes } from "../EdgeRenderer/utils";

import "../style.css";

class ReactGraph extends PureComponent {
  constructor(props) {
    super(props);

    this.nodeTypes = createNodeTypes(props.nodeTypes);
    this.edgeTypes = createEdgeTypes(props.edgeTypes);
  }

  render() {
    const {
      style,
      onElementClick,
      children,
      onLoad,
      onMove,
      onChange,
      elements,
      onElementsRemove,
      onConnect, onNodeDragStop, connectionLineType,
      connectionLineStyle
    } = this.props;

    const { nodes, edges } = elements
      .map(parseElements)
      .reduce(separateElements, {});

    return (
      <div style={style} className="react-graph">
        <Provider nodes={nodes} edges={edges} onConnect={onConnect}>
          <GraphView
            onLoad={onLoad}
            onMove={onMove}
            onChange={onChange}
            onElementClick={onElementClick}
            onNodeDragStop={onNodeDragStop}
            nodeTypes={this.nodeTypes}
            edgeTypes={this.edgeTypes}
            connectionLineType={connectionLineType}
            connectionLineStyle={connectionLineStyle}
          />
          <GlobalKeyHandler onElementsRemove={onElementsRemove} />
          {children}
        </Provider>
      </div>
    );
  }
}

ReactGraph.defaultProps = {
    onElementClick: () => {},
    onElementsRemove: () => {},
    onNodeDragStop: () => {},
    onConnect: () => {},
      onLoad: () => {},
    onMove: () => {},
    onChange: () => {},
    nodeTypes: {
      input: InputNode,
      default: DefaultNode,
      output: OutputNode
    },
    edgeTypes: {
      default: BezierEdge,
      straight: StraightEdge
    },
    connectionLineType: 'bezier',
    connectionLineStyle: {}
  };
  
  export default ReactGraph;
