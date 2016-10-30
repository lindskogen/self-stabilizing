import React from 'react';
import Graph from './Graph'
import requestInterval from './requestInterval'

const speed = 1000

const neighborsForId = (nodes, edges, id) => edges
  .filter(edge => edge.from === id || edge.to === id)
  .map(edge => edge.from !== id ? edge.from : edge.to)
  .map(neighborId => nodes.find(n => n.id === neighborId))

const matchForId = (nodes, id) => nodes.find(node => node.pointer === id)

const findFirstFreeForId = (nodes, id) => nodes.find(node => node.pointer === undefined)

const MaximalMatching = React.createClass({
  generateNodes(nodeCount) {
    return Array(nodeCount)
      .fill()
      .map((e,i) => ({id: i, label: String(i) + ','}))
  },
  generateEdges(nodes) {
    return [
      {from: 0, to: 1},
      {from: 1, to: 2},
      {from: 0, to: 2},
      {from: 1, to: 3},
      {from: 2, to: 3},
      {from: 3, to: 4},
      {from: 3, to: 7},
      {from: 4, to: 5},
      {from: 5, to: 6},
      {from: 6, to: 8},
      {from: 8, to: 7},
      {from: 7, to: 9},
    ]
  },
  randomizeGraph(numberOfNodes = 6) {
    const nodes = this.generateNodes(numberOfNodes)
    const edges = this.generateEdges(nodes)

    return { nodes, edges }
  },
  updateNodes(node, index) {
    this.setState({
        nodes: this.state.nodes.map((n, i) => {
          if (i !== index) {
            return n
          } else {
            return node
          }
        })
    })
  },
  doNodeTick(index) {
    const nodes = this.state.nodes
    let node = nodes[index]
    const neighbors = neighborsForId(nodes, this.state.edges, node.id)

    const match = matchForId(neighbors, node.id)
    const firstEmpty = findFirstFreeForId(neighbors, node.id)

    if (node.pointer === undefined && match) {
      node = {
        ...node,
        pointer: match.id,
        label: node.id + ',' + match.id
      }
      this.updateNodes(node, index)
    } else if (node.pointer === undefined && !match && firstEmpty) {
      node = {
        ...node,
        pointer: firstEmpty.id,
        label: node.id + ',' + firstEmpty.id
      }
      this.updateNodes(node, index)
    } else if (node.pointer !== undefined && nodes[node.pointer].pointer !== node.id) {
      node = {
        ...node,
        pointer: undefined,
        label: node.id + ','
      }
      this.updateNodes(node, index)
    }
  },
  componentDidMount() {
    const { nodes } = this.state
    nodes.forEach((node, i) => {
      // if (i === 0) {
      //   requestInterval(() => this.doRootTick(), speed)
      // } else {
        requestInterval(() => this.doNodeTick(i), speed + (speed/2) * i + Math.random() * speed)
      // }
    })
  },
  getInitialState() {
    const { nodes, edges } = this.randomizeGraph(10)
    return {
      nodes,
      edges
    }
  },
  render() {
    const { nodes, edges } = this.state

    return (
      <div>
        <Graph nodes={nodes} edges={edges} />
      </div>
    );
  }
})

export default MaximalMatching;
