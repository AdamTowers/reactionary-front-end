import React, {Component} from 'react'
import 'semantic-ui-css/semantic.min.css'


class RoomListItem extends Component {


  render(){
    return(
      <div className="item">
        <div className="content">
          <div className="right floated content">
            <div id={this.props.id} onClick={this.props.onClick} className="ui button">Join</div>
          </div>
          <div className="header">{this.props.room.name}</div>
          <p>{this.props.users > 1 ? this.props.users + ' users joined' : this.props.users + ' user joined'}</p>
        </div>

      </div>
    )
  }
}


export default RoomListItem
