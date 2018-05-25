import React, { Component } from 'react';
import Canvas from './Canvas'
import SocketIOClient from 'socket.io-client';

class CanvasContainer extends Component {
  constructor(){
    super()
    this.state = {
      tool: {},
      coordinates: [100,100],
      ctx: {}
    }
    this.isDown = false
    this.canvas = {}
    this.xOffset = 0
    this.yOffset = 0
    this.socket = SocketIOClient('http://localhost:3001');
  }

  componentDidMount(){
    this.canvas = document.getElementById('canvas')
    this.xOffset = this.getOffset(this.canvas).x
    this.yOffset = this.getOffset(this.canvas).y
    const ctx = this.canvas.getContext('2d')
    ctx.lineWidth=3;
    ctx.save()

    this.socket.on('draw', (line) => {
      if(line){
        this.drawLine(ctx, line.x, line.y, this.originX, this.originY)
        console.log('receiving draw line')
      }
        });

    this.socket.on('begin-path', () => this.beginPath)
    this.socket.on('close-path', () => this.closePath)
  }

  onMouseDown = (e) => {
    e.persist()
    this.isDown = true
    this.canvas.getContext('2d').beginPath();
    const mouseX = e.clientX - this.xOffset
    const mouseY = e.clientY - this.yOffset
    this.setState({
      coordinates: [mouseX, mouseY]
    })
    this.beginPath()
    this.socket.on('begin-path')
  }

  onMouseMove = (e) => {
    if (this.isDown) {
      e.preventDefault();
      e.stopPropagation();
      const mouseX = e.clientX - this.xOffset
      const mouseY = e.clientY - this.yOffset

      this.drawLine(e.target.getContext('2d'), mouseX, mouseY, this.state.coordinates[0], this.state.coordinates[1]);
      this.setState({
        coordinates: [mouseX, mouseY]
      })

      this.drawLine(e.target.getContext('2d'), mouseX, mouseY, this.state.coordinates[0], this.state.coordinates[1])
      console.log('sending drawing line')
      this.socket.emit('draw', {x: mouseX, y: mouseY})
    }
  }

  onMouseOut = () => {
    this.isDown = false
    this.socket.emit('close-path')
    this.closePath()
  }

  onMouseUp = () => {
    this.isDown = false
    this.socket.emit('close-path')
    this.closePath()
  }

  beginPath = () => {
    this.canvas.getContext('2d').beginPath()
  }
  closePath = () => {
    this.canvas.getContext('2d').closePath();
  }

  drawLine = (ctx, x, y, originX, originY) => {
    ctx.moveTo(originX, originY)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  getOffset = (ele) => {
    let x = 0;
    let y = 0;

    while(ele){
      x += ele.offsetLeft - ele.scrollLeft + ele.clientLeft;
      y += ele.offsetTop - ele.scrollTop + ele.clientTop;
      ele = ele.offsetParent;
    }
    return {x: x, y: y}
  }

  render() {
    return (
      <div className="canvas-container">
        <Canvas onMouseOut={this.onMouseOut} onMouseDown={this.onMouseDown.bind(this)} onMouseMove={this.onMouseMove.bind(this)} onMouseUp={this.onMouseUp.bind(this)}/>
      </div>
    );
  }

}

export default CanvasContainer;
