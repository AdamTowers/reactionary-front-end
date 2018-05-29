import React, {Component} from 'react'
import ActionCable from 'actioncable'
import RoomListContainer from '../components/RoomListContainer'
import CreateRoomModal from '../components/CreateRoomModal'

class Home extends Component {
  constructor(props){
    super(props)
    this.state = {
      newRoom: "",
      rooms: []
    }
    this.sub=[]
    this.createSubscription = this.createSubscription.bind(this)
  }

  componentDidMount = () => {
    this.setup()
  }

  setup = ()=> {
    const that = this
    const cable = ActionCable.createConsumer('ws://localhost:3001/cable')
    fetch('http://localhost:3001/api/v1/rooms').then(r => r.json())
    .then(data => {
      that.setState({
        rooms: data.data
      })
      for(let i = 0; i < data.data.length; i++) {
        this.createSubscription(data.data[i], cable)
      }
    })
    this.createSubscription({id: 0}, cable)
  }

  createSubscription = (room, cable) => {
    const that = this
    that.sub['rooms_'+room.id] = cable.subscriptions.create({
      channel: 'RoomsChannel',
      room: 'rooms_'+room.id
    }, {
    connected: () => {
      console.log("connected to main page/ logged in?");
    },
    disconnected: () => {
      console.log("disconnected/ logged out");
    },
    received: (data) => {
      if(data.type === 'create'){
        that.createSubscription(data, cable)
        let tempRooms = that.state.rooms
        tempRooms.push(data)
        that.setState({
          rooms: tempRooms
        })
      } else if(data.type === 'join'){
        that.setState({
          rooms: that.state.rooms.map(r=> r.id === data.id ? data : r)
        })
        console.log(that.state.rooms)
      }
    }})
  }

  joinRoom = (room_id) => {
    this.sub['rooms_'+room_id].send({
      to: "rooms_" + room_id,
      type: "join",
      message: {
        room_id: room_id,
        user_id: localStorage.user_id
      },
    })
    this.props.history.push('/room/'+room_id)
  }

  createRoom = (e) => {
    const that = this;
    fetch('http://localhost:3001/api/v1/rooms',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name: that.state.newRoom, user_id: parseInt(localStorage.user_id)})
    })
    .then(resp => resp.json())
    .then(r => {
      const cable = ActionCable.createConsumer('ws://localhost:3001/cable')
      that.createSubscription(r.data,cable)
      that.sub['rooms_' + 0].send({
        to: "rooms_" + 0,
        type: "create",
        message: {
          room_id: r.data.id,
          user_id: localStorage.user_id,
        }
      })
      that.props.history.push('/room/'+ r.data.id)
    })
  }

  onChange = (e) => {
    e.persist()
    this.setState({
      newRoom: e.target.value
    })
  }

  render(){

    return(
      <div>
        <CreateRoomModal onChange={this.onChange} onSubmit={this.createRoom}/>
        <RoomListContainer rooms={this.state.rooms} joinRoom={this.joinRoom.bind(this)} />
      </div>
    )
  }
}

export default Home