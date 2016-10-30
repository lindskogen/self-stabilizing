import React from 'react';
import vis from 'vis';
import _ from 'lodash';

const Graph = React.createClass({
  getDefaultProps() {
    return {
      style: {
        width: 600,
        height: 400,
        border: '1px solid lightgray'
      }
    }
  },
  componentWillReceiveProps(nextProps) {
    this.updateGraph(nextProps)
  },
  componentDidMount() {
    this.createGraph()
  },
  render() {
    return (
      <div ref={(el) => this.elem = el} style={this.props.style}></div>
    );
  },
  updateGraph(nextProps) {
    const { edges, nodes } = nextProps
    this.net.setData({ nodes, edges })
  },
  createGraph() {
    const { edges, nodes } = this.props
    const options = {
      autoResize: true,
      height: '100%',
      width: '100%',
      interaction: {
        dragNodes: false
      },
      layout: {
        randomSeed: 194433
      },
      nodes: {
        shape: 'circle',
        font: {
          color: '#ffffff'
        }
      },
      edges: {
        color: {
          color: '#99c3fa',
          inherit: false
        }
      }
    }
    this.net = new vis.Network(this.elem, { edges, nodes }, options);
    if (this.props.onNodeClick) {
      this.net.on('click', this.props.onNodeClick)
    }
  }
})

export default Graph;
