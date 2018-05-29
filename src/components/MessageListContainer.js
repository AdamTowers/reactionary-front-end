import React, {Component} from 'react'
import MessageListItem from './MessageListItem'
import MessageForm from './MessageForm'
import ActionCable from 'actioncable'

class MessageListContainer extends Component {
  constructor(props){
    super(props)

  }
  componentDidMount(){
    this.props.setMessageLoaded()

  }

  render() {

    const messages = this.props.messages.map((m,i) => <MessageListItem key={i} message={m}/>)
    return(
      <div id="message-container">
        <div id="message-box" className="ui very relaxed list">
          {messages}
        </div>
        <MessageForm sendMessage={this.props.sendMessage}/>
      </div>
    )
  }

}

export default MessageListContainer
