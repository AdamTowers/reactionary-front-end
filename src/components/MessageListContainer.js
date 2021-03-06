import React, {Component} from 'react'
import MessageListItem from './MessageListItem'
import MessageForm from './MessageForm'

import { Segment } from 'semantic-ui-react'


class MessageListContainer extends Component {
<<<<<<< HEAD
  constructor(props){
    super(props)
  }
=======

>>>>>>> 00b2e6e46895d042e12b544516112893c08961bc
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
