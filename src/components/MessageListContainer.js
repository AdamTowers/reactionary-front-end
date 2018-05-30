import React, {Component} from 'react'
import MessageListItem from './MessageListItem'
import MessageForm from './MessageForm'
import ActionCable from 'actioncable'
import { Segment, Button } from 'semantic-ui-react'


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
      <Segment.Group>
        <Segment attached="top">
          <h1>Messages</h1>
          <MessageForm sendMessage={this.props.sendMessage}/>
        </Segment>
        <Segment>
          {messages.reverse()}
        </Segment>
      </Segment.Group>
    )
  }

}

export default MessageListContainer
