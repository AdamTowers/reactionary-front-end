import React, {Component} from 'react'

class MessageListItem extends Component {

  render() {
    return(
      <div className="item">
        <div className="content">
          <div className="header">{'hi'}</div>
          {/* this.props.user.name */}
          {/* this.props.message */}
        </div>
      </div>
    )
  }

}

export default MessageListItem
