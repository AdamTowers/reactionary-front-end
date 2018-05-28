import React, {Component} from 'react'
import MessageListItem from './MessageListItem'
import ActionCable from 'actioncable'

class MessageListContainer extends Component {
  constructor(props){
    super(props)
    this.state = {
      messages:[]
    }
  }
  componentDidMount(){
    const cable = ActionCable.createConsumer('ws://localhost:3001/cable')
      this.sub = cable.subscriptions.create({
        channel: 'MessagesChannel'
      }, {
      connected: () => {
        console.log("connected");
        this.props.setMessageLoaded()
      },
      disconnected: () => {
        console.log("disconnected");
      },
      received: (data) => {
        console.log('received: '+data.message.action)
        if (data.message.action === 'mouseDown') {
          this.beginPath(data.message.x, data.message.y)
          console.log('begin path')
        } else if (data.message.action === 'mouseUp' || data.message.action === 'mouseOut') {
          console.log('close path')
          this.closePath()
        } else if (data.message.action === 'mouseMove') {
          this.drawLine(data.message.x - this.xOffset, data.message.y - this.yOffset)

        }
      }
    })

  }
  render() {
    const messages = this.state.messages.map(m => <MessageListItem message={m}/>)
    return(
      <div className="ui very relaxed list">
        {messages}
      </div>
    )
  }

}

export default MessageListContainer
