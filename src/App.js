import React from 'react';
import Graph from './Graph'
import requestInterval from './requestInterval'

const speed = 1000

const colors = [
  '#E53935',
  '#8E24AA',
  '#00897B',
  '#3949AB',
  '#43A047',
  '#6D4C41',
  '#757575',
]

const nextColor = (currentColor) => {
  const nextIndex = (colors.indexOf(currentColor) + 1) % colors.length
  return colors[nextIndex]
}

const App = React.createClass({
  getRandomColor() {
    const randomIndex = Math.floor(Math.random() * colors.length - 1)
    return colors[randomIndex]
  },
  generateNodes(nodeCount) {
    return Array(nodeCount)
      .fill()
      .map((e,i) => ({id: i, label: String(i), color: this.getRandomColor()}))
  },
  generateCircleOfNodes(nodes) {
    let edges = []

    for (var i = 0; i < nodes.length - 1; i++) {
      edges[i] = { from: nodes[i].id, to: nodes[i+1].id }
    }
    edges.push({ from: nodes[nodes.length - 1].id, to: nodes[0].id })

    return edges
  },
  randomizeGraph(numberOfNodes = 6) {
    const nodes = this.generateNodes(numberOfNodes)
    const edges = this.generateCircleOfNodes(nodes)

    return { nodes, edges }
  },
  doRootTick() {
    const nodes = this.state.nodes
    let node = nodes[0]
    const prevNode = nodes[nodes.length - 1]

    if (prevNode.color === node.color) {
      node = {
        ...node,
        color: nextColor(node.color)
      }
      console.log("new color", node.color);
      this.updateNodes(node, 0)
    }
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
    const prevNode = nodes[index-1]

    if (prevNode.color !== node.color) {
      node = {
        ...node,
        color: prevNode.color
      }
      this.updateNodes(node, index)
    }
  },
  componentDidMount() {
    const { nodes } = this.state
    nodes.forEach((node, i) => {
      if (i === 0) {
        requestInterval(() => this.doRootTick(), speed)
      } else {
        requestInterval(() => this.doNodeTick(i), speed + (speed/2) * i + Math.random() * speed)
      }
    })
  },
  getInitialState() {
    const { nodes, edges } = this.randomizeGraph(6)
    return {
      nodes,
      edges
    }
  },
  render() {
    const { nodes, edges } = this.state

    return (
      <div className="App">
        <Graph nodes={nodes} edges={edges} />
      </div>
    );
  }
})

export default App;
