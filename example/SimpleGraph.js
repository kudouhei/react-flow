import React, { PureComponent } from 'react';

import Graph from '../src';
// import Graph from '../dist/ReactGraph';
// import wrapNode from '../src/NodeRenderer/NodeTypes/wrapNode';

const SpecialNode = ({ data, styles }) => (
  <div
    style={{ background: '#FFCC00', padding: 10, borderRadius: 30, ...styles }}
  >
    <div>I am <strong>special</strong>!<br />{data.label}</div>
    <select onChange={(e) => data.onChange(e.target.value, data)}>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </select>
  </div>
);

class App extends PureComponent {
  constructor() {
    super();

    const onChange = (id, d) => {
      this.setState(prevState => (
        { elements: prevState.elements.map(e => ({
          ...e,
          data: {
            ...e.data,
            label: '6' === e.data.id ? `option ${id} selected` : e.data.label
          }
        }))
        }
      ));
    }

    this.state = {
      elements: [
        { data: { id: '1', label: 'Tests', type: 'input' }, position: { x: 50, y: 50 } },
        { data: { id: '2', label: 'This is a node This is a node This is a node This is a node' }, position: { x: 100, y: 100 } },
        { data: { id: '3', label: 'This is a node' }, position: { x: 100, y: 200 }, style: { background: '#222', color: '#fff' } },
        { data: { id: '4', label: 'nody nodes', type: 'output' }, position: { x: 50, y: 300 } },
        { data: { id: '5', label: 'Another node', type: 'default' }, position: { x: 400, y: 300 } },
        { data: { id: '6', label: 'no option selected', type: 'special', onChange }, position: { x: 400, y: 400 } },
        { data: { source: '1', target: '2', type: 'bezier', style: { stroke: 'orange' } } },
        { data: { source: '2', target: '3' } },
        { data: { source: '3', target: '4' } },
        { data: { source: '3', target: '5' } },
        { data: { source: '5', target: '6' } }
      ]
    };
  }

  onLoad(graphInstance) {
    this.graphInstance = graphInstance;
    console.log('graph loaded:', this.graphInstance);

    this.graphInstance.fitView();
  }

  onChange(elements) {
    if (!this.graphInstance) {
      return false;
    }
    // console.log('graph changed', elements);
  }

  onFitView() {
    if (!this.graphInstance) {
      return false;
    }
    this.graphInstance.fitView();
  }

  onAdd() {
    this.setState(prevState => ({
      ...prevState,
      elements: prevState.elements.concat({
        data: { id: prevState.elements.length + 1, label: 'Added node' },
        position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }
      })
    }));
  }

  render() {
    console.log(this.state.elements);
    return (
      <Graph
        elements={this.state.elements}
        onElementClick={node => console.log('clicked', node)}
        onNodeRemove={elements => console.log('remove', elements)}
        style={{ width: '100%', height: '100%' }}
        onLoad={graphInstance => this.onLoad(graphInstance)}
        onChange={(elements) => this.onChange(elements)}
        nodeTypes={{
          special: SpecialNode
        }}
      >
        <button
          type="button"
          style={{ position: 'absolute', right: '10px', bottom: '10px', zIndex: 4 }}
          onClick={() => this.onFitView()}
        >
          fit
        </button>
        <button
          type="button"
          style={{ position: 'absolute', bottom: '10px', left: '10px', zIndex: 4 }}
          onClick={() => this.onAdd()}
        >
          add
        </button>
      </Graph>
    );
  }
}

export default App;