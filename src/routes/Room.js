import React, {Component} from 'react'
import UserListContainer from '../components/UserListContainer'
import MessageListContainer from '../components/MessageListContainer'
import CanvasContainer from '../components/CanvasContainer'
import ActionCable from 'actioncable'
import { Grid, Segment, Button, Image } from 'semantic-ui-react'
import logo from '../images/reactionary_logo.png'

class Room extends Component {
  constructor(props){
    super(props)
    this.state = {
      users: [],
      isMessageListLoaded: true,
      isUserListLoaded: false,
      messages: [],
      host_id: 0,
      isReady: false,
      artistId: "",
      word: "",
      aftermath: false
    }
    this.room = this.props.match.params.id
    this.roomname = ""
    this.hostname = ""
    this.sub = {}
    this.createSubscription = this.createSubscription.bind(this)
  }

  componentDidMount() {
    if (localStorage.getItem('token')) {
      const that = this
      fetch('http://localhost:3001/api/v1/user_room/'+that.room).then(r => r.json()).then(res => {
        that.setState({
          users: res.data
        })
        console.log(res.data)
      })
      fetch('http://localhost:3001/api/v1/rooms/'+that.room).then(r => r.json()).then(res => {
        that.setState({
          host_id: res.data.attributes['user-id'],
        })
        that.roomname = res.data.attributes.name
      })
      const cable = ActionCable.createConsumer('ws://localhost:3001/cable')
      that.createSubscription(that.room, cable)
    } else {
      this.props.history.push("/login")
    }

  }

  createSubscription = (room, cable) => {
    const that = this
    that.sub['game_'+ that.room] = cable.subscriptions.create({
      channel: 'GamesChannel',
      room: 'game_'+ that.room,
      user_id: localStorage.user_id,
      username: localStorage.username
    }, {
    connected: () => {
    },
    disconnected: () => {
    },
    received: (data) => {

      if(data.type === 'message'){
        let messages = that.state.messages
        messages.push({username: data.username, content: data.content})
        that.setState({
          messages: messages
        })
        if(data.content == that.state.word.content && !that.state.aftermath){
          const messages = that.state.messages
          messages.push({username: 'Game Bot', content: data.username+' wins! The word is: '+ data.content})
          that.setState({
            messages: messages,
            aftermath: true
          })
        }
      } else if(data.type ==='start_game'){
        if(localStorage.user_id === data.artistId){
          alert('You\'re the current artist. Your word is: '+ data.word.content)
        }
        that.setState({
          isReady: true,
          artistId: data.artistId,
          word: data.word
        })
      } else if(data.type ==='disconnect'){
        let messages = that.state.messages
        messages.push({username: 'Game Bot', content: data.username+' left the room.'})
        that.setState({
          users: that.state.users.filter(u => parseInt(u.id, 10) !== parseInt(data.userId, 10)),
        })
      } else if(data.type === 'clear'){
        that.clearCanvas()
      } else if(data.type === 'join'){
        const users = that.state.users
        if(users){
          users.push(data.user)
          const uniques = users.filter((v,i,a) => a.indexOf(v) == i)
          that.setState({
            users: uniques,
            messages:data.messages
          })
        }
      }else if(data.type === 'delete_game'){
        this.props.history.push('/')
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

    const msg = e.target.querySelector('input').value
    if(parseInt(localStorage.user_id, 10) === parseInt(this.state.artistId, 10) && msg && msg !== "" && msg.toLowerCase().indexOf(this.state.word.content.toLowerCase()) > -1) {
      const messages = this.state.messages
      messages.push({username: 'Game Bot', content: 'Don\'t be like Christian'})
      this.setState({
        messages: messages
      })
    } else {
        this.sub['game_' + this.room].send({
        to: 'game_'+this.room,
        type: 'message',
        content: msg,
        user_id: localStorage.user_id,
        username: localStorage.username
      })
    }
    e.target.querySelector('input').value = ""
  }

  clickReady = (e) => {
    const that = this
      fetch('http://localhost:3001/api/v1/random-word').then(res => res.json()).then(r => {
        const randomUser = that.state.users[Math.floor(Math.random()*that.state.users.length)].id
        that.setState({
          isReady: true,
          artistId: randomUser,
          word: r
        })
        that.sub['game_'+that.room].send({
          to: 'game_'+that.room,
          type: 'start_game',
          isReady: true,
          artistId: randomUser,
          word: r
        })
      })
  }

  leaveRoom = () => {
    this.sub['game_'+this.room].unsubscribe()
    delete this.sub['game_'+this.room]
    this.props.history.push('/')
  }

  onClearCanvas = () => {
    this.sub['game_'+this.room].send({
      to: 'game_'+this.room,
      type: 'clear',
    })
  }

  isLoaded = () => {
    return this.state.isUserListLoaded && this.state.isMessageListLoaded
  }

  isHost = () => {
    return parseInt(this.state.host_id, 10) === parseInt(localStorage.user_id, 10)
  }
  isArtist = () => {
    return parseInt(this.state.artistId, 10) === parseInt(localStorage.user_id, 10)
  }

  isPartOfRoom= () => {
    if(this.state.users)
      return this.state.users.indexOf(localStorage.user_id)
    else {
      return []
    }
  }

  clearCanvas = () => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  isGameStarted = () => {
    return this.state.isReady && this.state.artistId!== ""
  }

  deleteRoom = () => {

    this.sub['game_'+this.room].send({
      to: 'game_'+this.room,
      type: 'delete_game',
      user_id: localStorage.user_id,
    })
    this.props.history.push('/')
  }

  render() {
    const disabled = this.state.users.length < 2
    return(
      <div>
        <Grid columns={1} stackable>
          <Image src={logo} centered={true} />
        </Grid>
        <Grid columns={2} stackable>
          <Grid.Column>
            <Segment>
              { this.isLoaded() ? <CanvasContainer artistId={this.state.artistId} roomId={this.room} setUserLoaded={this.state.setUserLoaded} xOffset={this.xOffset} yOffset={this.yOffset}/> : "" }
              { this.isLoaded() && this.isArtist() && this.isPartOfRoom() && this.isGameStarted()  ? <Button primary size="small" onClick={this.clearCanvas} >Clear</Button> : "" }
              { parseInt(localStorage.user_id, 10) === parseInt(this.state.host_id, 10) ? <Button secondary size="small" disabled={disabled} onClick={this.clickReady}>Start game</Button> : "" }
              { parseInt(localStorage.user_id, 10) === parseInt(this.state.host_id, 10) ? <Button secondary size="small" onClick={this.deleteRoom}>Delete room</Button> : "" }
              <Button default size="small" onClick={this.leaveRoom.bind(this)}>Leave Room</Button>
              <UserListContainer clickReady={this.clickReady} hostId={this.state.host_id} setUserLoaded={this.setUserLoaded}  users={this.state.users}/>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <MessageListContainer setMessageLoaded={this.setMessageLoaded} sendMessage={this.sendMessage.bind(this)} messages={this.state.messages ? this.state.messages : []} deleteRoom={this.deleteRoom} clickReady={this.clickReady} setUserLoaded={this.setUserLoaded}  users={this.state.users ? this.state.users : []} />
         </Grid.Column>
       </Grid>
      </div>
    )
  }
}

export default Room
