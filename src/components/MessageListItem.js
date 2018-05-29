import React, {Component} from 'react'

class MessageListItem extends Component {

  render() {
    return(
      <div className="item">
        <div className="content">
          <div className="header">{this.props.message.username} </div>
          { this.props.message.content }
        </div>
      </div>
    )
  }

}

export default MessageListItem
