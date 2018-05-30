import React, {Component} from 'react';
import Canvas from './Canvas'
import ActionCable from 'actioncable'
// import { Button} from 'semantic-ui-react'

class CanvasContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tool: {},
      coordinates: [100, 100],
      ctx: {}
    }
    this.isDown = false
    this.canvas = {}
    this.xOffset = 0
    this.yOffset = 0
  }

  componentDidMount() {
    this.canvas = document.getElementById('canvas')
    this.xOffset = this.getOffset(this.canvas).x
    this.yOffset = this.getOffset(this.canvas).y
    const ctx = this.canvas.getContext('2d')
    ctx.lineWidth = 3;
    ctx.save()

    const cable = ActionCable.createConsumer('ws://localhost:3001/cable')
      this.sub = cable.subscriptions.create({
        channel: 'CanvasChannel',
        room: 'canvas_' + this.props.roomId,
        room_id: this.props.roomId,
        user_id: localStorage.user_id,
        username: localStorage.username
      }, {
      connected: () => {
        console.log("connected");
      },
      disconnected: () => {
        console.log("disconnected");
      },
      received: (data) => {
        console.log('received: ')
        console.log(data)
        if(!this.isArtist()){
          if (data.message.action === 'mouseDown') {
            this.beginPath(data.message.x, data.message.y)
            console.log('begin path')
          } else if (data.message.action === 'mouseUp' || data.message.action === 'mouseOut') {
            console.log('close path')
            this.closePath()
          } else if (data.message.action === 'mouseMove') {
            this.drawLine(data.message.x, data.message.y)
          }
        }
      }
    })
  }


  onMouseDown = (e) => {
    if(this.isArtist()){
      e.persist()
      this.isDown = true
      const mouseX = e.clientX - this.xOffset
      const mouseY = e.clientY - this.yOffset
      console.log('begin mouse down: ')
      console.log(mouseX, mouseY)

      this.beginPath(mouseX, mouseY);

      this.sub.send({
        to: 'canvas_' + this.props.roomId,
        message: {
          action: 'mouseDown',
          x: mouseX,
          y: mouseY
        }
      })
      console.log('mousedown sent')
    }
  }

  onMouseMove = (e) => {
    if (this.isDown && this.isArtist()) {
      e.preventDefault();
      e.stopPropagation();
      const mouseX = e.clientX - this.xOffset
      const mouseY = e.clientY - this.yOffset
      console.log('begin mouse move: x,y: ')
      console.log(mouseX, mouseY)
      console.log('offsetx, offsety : ')
      console.log(this.xOffset, this.yOffset)
      this.drawLine(mouseX, mouseY)

      this.sub.send({
        to: 'canvas_' + this.props.roomId,
        message: {
          action: 'mouseMove',
          x: mouseX,
          y: mouseY
        },
      })
    }
  }

  onMouseOut = (e) => {
    if(this.isArtist()){
      e.persist()
      this.closePath()
      this.sub.send({
        to: 'canvas_' + this.props.roomId,
        message: {
          action: 'mouseUp',
          x: e.clientX,
          y: e.clientY
        },
      })
    }
  }

  onMouseUp = (e) => {
    if(this.isArtist()){
      e.persist()
      console.log('mouse up event sent')
      this.closePath()
      this.sub.send({
        to: 'canvas_' + this.props.roomId,
        message: {
          action: 'mouseUp',
          x: e.clientX,
          y: e.clientY
        },
      })
    }
  }

  beginPath = (x,y) => {
    this.setState({
      coordinates: [x,y]
    })
    this.canvas.getContext('2d').beginPath()
  }

  closePath = () => {
    if(this.isDown){
      this.isDown = false
      this.canvas.getContext('2d').closePath();
      // debugger
    }
  }

  drawLine = (x, y) => {
    const ctx = this.canvas.getContext('2d')
    const coord = this.state.coordinates

    ctx.moveTo(coord[0], coord[1])
    ctx.lineTo(x, y)
    ctx.closePath()
    ctx.stroke()
    this.setState({
      coordinates: [x, y]
    })
  }

  getOffset = (ele) => {
    let x = 0;
    let y = 0;

    while (ele) {
      x += ele.offsetLeft - ele.scrollLeft + ele.clientLeft;
      y += ele.offsetTop - ele.scrollTop + ele.clientTop;
      ele = ele.offsetParent;
    }
    return {
      x: x,
      y: y
    }
  }

  isArtist = () => {
    return parseInt(localStorage.user_id) === parseInt(this.props.artistId)
  }

  render() {
    return (
      <div className = "canvas-container" >
        <Canvas onMouseOut = {
          this.onMouseOut
        }
        onMouseDown = {
          this.onMouseDown.bind(this)
        }
        onMouseMove = {
          this.onMouseMove.bind(this)
        }
        onMouseUp = {
          this.onMouseUp.bind(this)
        }
        />

    </div>
    )
  }

}

export default CanvasContainer;
