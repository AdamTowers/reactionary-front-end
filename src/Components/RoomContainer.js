import React, {Component} from 'react'
import Room from './Room'
import 'semantic-ui-css/semantic.min.css';
class RoomContainer extends Component {

constructor(props){
  super(props)
  this.state = {
    rooms: [],
  }
}

  componentDidMount() {
    fetch('http://localhost:3001/api/v1/rooms').then(r => r.json())
    .then(data =>{
      console.log(data.data)
      this.setState({
        rooms: data.data
      })
    })

  }

  render() {
    const items = this.state.rooms.map(r => <Room users={r.relationships.users.data} room={r.attributes}/>)
    return(
      <div className="ui middle aligned selection list">
        {items}
      </div>
    )
  }
}

export default RoomContainer
