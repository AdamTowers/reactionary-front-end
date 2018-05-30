import React, {Component} from 'react'

class MessageListItem extends Component {

  render() {
    return(
        <p><strong>{ this.props.message.username }:</strong> { this.props.message.content }</p>
    )
  }
}

export default MessageListItem
