import React, {Component} from 'react'
import UserListContainer from '../components/UserListContainer'
import MessageListContainer from '../components/MessageListContainer'
import CanvasContainer from '../components/CanvasContainer'
import ActionCable from 'actioncable'

class Room extends Component {
  constructor(props){
    super(props)
    this.state = {
      users: [],
      isMessageListLoaded: true,
      isUserListLoaded: false,
      messages: [],
      host_id:0
    }
    this.room = this.props.match.params.id
    this.sub = {}
    this.createSubscription = this.createSubscription.bind(this)
  }

  componentDidMount() {
    const that = this
    fetch('http://localhost:3001/api/v1/user_room/'+that.room).then(r => r.json()).then(res => {
      that.setState({
        users: res.data
      })
    })
    fetch('http://localhost:3001/api/v1/rooms/'+that.room).then(r => r.json()).then(res => {
      that.setState({
        host_id: res.data.attributes['user-id']
      })

    })
    const cable = ActionCable.createConsumer('ws://localhost:3001/cable')
    that.createSubscription(that.room, cable)
  }

  createSubscription = (room, cable) => {
    const that = this
    that.sub['game_'+ that.room] = cable.subscriptions.create({
      channel: 'GamesChannel',
      room: 'game_'+ that.room
    }, {
    connected: () => {
      console.log(that.sub)
      console.log("connected to game room");
    },
    disconnected: () => {
      console.log("disconnected/ logged out");
    },
    received: (data) => {
      console.log(data)

      if(data.type === 'message'){
        let messages = that.state.messages
        messages.push({username: data.username, content: data.content})
        that.setState({
          messages: messages
        })
      }

    }})
  }

  setUserLoaded = () => {
    this.setState({
      isUserListLoaded:true
    })
  }

  setMessageLoaded = () => {
    this.setState({
      isMessageListLoaded:true
    })
  }

  sendMessage = (e) => {
    this.sub['game_' + this.room].send({
      to: 'game_'+this.room,
      type: 'message',
      content: e.target.querySelector('input').value,
      user_id: localStorage.user_id,
      username: localStorage.username
    })
  }

  render() {
    return(
      <div id="room">
        <div id="top">
          { this.state.isUserListLoaded && this.state.isMessageListLoaded ? <CanvasContainer roomId={this.room} setUserLoaded={this.state.setUserLoaded} xOffset={this.xOffset} yOffset={this.yOffset}/> : "" }
          <UserListContainer hostId={this.state.host_id} setUserLoaded={this.setUserLoaded}  users={this.state.users}/>
        </div>
        <MessageListContainer sendMessage={this.sendMessage.bind(this)} setMessageLoaded={this.setMessageLoaded} messages={this.state.messages}/>
      </div>
    )
  }

}

export default Room
