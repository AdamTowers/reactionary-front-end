import React, { Component } from 'react';
import Canvas from './Canvas'
import ActionCable from 'actioncable'

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
  }

  componentDidMount(){
    this.canvas = document.getElementById('canvas')
    this.xOffset = this.getOffset(this.canvas).x
    this.yOffset = this.getOffset(this.canvas).y
    const ctx = this.canvas.getContext('2d')
    ctx.lineWidth=3;
    ctx.save()

    const cable = ActionCable.createConsumer('ws://localhost:3002/cable')
    this.sub = cable.subscriptions.create(
      {channel: 'RoomsChannel'}, {
        connected: function() {
          console.log("connected");
        },
        disconnected: function() {
          console.log("disconnected");
        },
        received: function(data){
          console.log(data)
        }
      }
    )
    this.sub.send({user_id: 2, room_id: 1})
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

      this.sub.send({
        to: "rooms_test",
        message: {x: mouseX, y: mouseY}
      })

    }
  }

  onMouseOut = () => {
    this.isDown = false
  }

  onMouseUp = () => {
    this.isDown = false
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
