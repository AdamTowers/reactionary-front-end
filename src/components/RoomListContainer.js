import React, {Component} from 'react'
import RoomListItem from './RoomListItem'
import 'semantic-ui-css/semantic.min.css'

class RoomListContainer extends Component {
<<<<<<< HEAD
  constructor(props){
    super(props)
=======

  componentDidMount() {
>>>>>>> 00b2e6e46895d042e12b544516112893c08961bc
  }

  joinRoom = (e) => {
    if(localStorage.user_id && localStorage.user_id !== "" && e.target.id ){
      this.props.joinRoom(e.target.id)
    }
  }

  render() {
    const items = this.props.rooms.map(r => <RoomListItem id={r.id} key={r.id} hostId={r.attributes['user-id']} onClick={this.joinRoom.bind(this)} users={r.relationships.users.data.length} room={r.attributes}/>)
    return(
      <div>
        {items}
      </div>
    )
  }
}

export default RoomListContainer
