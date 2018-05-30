import React, {Component} from 'react'
import { Button } from 'semantic-ui-react'


class RoomListItem extends Component {


  render(){
    return(
      <p><Button secondary size='mini' id={this.props.id} onClick={this.props.onClick}>Join</Button> <strong>{this.props.room.name}:</strong> {this.props.users > 1 ? this.props.users + ' users joined' : this.props.users + ' user joined'}</p>
    )
  }
}


export default RoomListItem
