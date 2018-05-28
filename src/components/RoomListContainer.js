import React, {Component} from 'react'
import RoomListItem from './RoomListItem'
import 'semantic-ui-css/semantic.min.css';
import ActionCable from 'actioncable'

class RoomListContainer extends Component {

  constructor(props){
    super(props)
  }

  componentDidMount() {



  }

  joinRoom = (e) => {
    if(localStorage.user_id && localStorage.user_id !== "" && e.target.id ){
      this.props.joinRoom(e.target.id)
    }
  }

  render() {
    const items = this.props.rooms.map(r => <RoomListItem id={r.id} key={r.id} onClick={this.joinRoom.bind(this)} users={r.relationships.users.data.length} room={r.attributes}/>)
    return(
      <div className="roomlist-container">
        <div className="ui middle aligned selection list">
          {items}
        </div>
      </div>
    )
  }
}

export default RoomListContainer
