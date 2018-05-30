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

  // componentWillUnmount = () => {
  //   console.log('unmounted')
  //   this.sub['game_'+this.room].send({
  //     to: 'game_'+this.room,
  //     type: 'disconnect',
  //     isReady: true,
  //     user_id: parseInt(localStorage.user_id)
  //   })
  // }

  createSubscription = (room, cable) => {
    const that = this
    that.sub['game_'+ that.room] = cable.subscriptions.create({
      channel: 'GamesChannel',
      room: 'game_'+ that.room,
      user_id: localStorage.user_id
    }, {
    connected: () => {
      console.log(that.sub)
      console.log("connected to game room");
    },
    disconnected: () => {
      console.log("disconnected/ logged out");
      //
      // this.sub['game_' + this.room].send({
      //   to: 'game_'+this.room,
      //   type: 'disconnect',
      //   user_id: localStorage.user_id,
      // })
      // cable.subscriptions.remove(this.sub)
      // this.perform('unsubscribed')
    },
    received: (data) => {
      console.log(data)

      if(data.type === 'message'){
        let messages = that.state.messages
        messages.push({username: data.username, content: data.content})
        that.setState({
          messages: messages
        })

        if(data.content == that.state.word.content){
          console.log(data.username+' wins! The word is: '+ data.content)
          alert(data.username+' wins! The word is: '+ data.content)
          const messages = this.state.messages
          messages.push({username: 'Admin', content: data.username+' wins! The word is: '+ data.content})
          this.setState({
            messages: messages,
            aftermath: true
          })
        }
      } else if(data.type ==='start_game'){
        if(localStorage.user_id === data.artistId){
          console.log('asldjfalsjdf')
          console.log(data.word.content)
          alert('You\'re the current artist. Your word is: '+ data.word.content)
        }

        that.setState({
          isReady: true,
          artistId: data.artistId,
          word: data.word
        })
      } else if(data.type ==='disconnect'){
        that.setState({
          users: that.state.users.filter(u => parseInt(u.id) !== parseInt(data.userId))
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
    const msg = e.target.querySelector('input').value
    if(localStorage.user_id === this.artistId && msg && msg !== "" && msg.toLowerCase().indexOf(this.state.word.content.toLowerCase()) > -1) {
      const messages = this.state.messages
      messages.push({username: 'Admin', content: 'You can\'t compete this round'})
      this.setState({
        messages: messages
      })
      /*
      var string = "foo",
          expr = /oo/;
      string.match(expr);
      */
    }else {
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
    // if(this.state.users){
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

      //grab user to be the artist
      //give user the word
      //start a timer for everyone
    // }
  }

  leaveRoom = () => {
    this.sub['game_'+this.room].unsubscribe()
    delete this.sub['game_'+this.room]
    this.props.history.push('/')
  }

  clearCanvas = () => {
    // const context = this.canvas
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height);

  }

  render() {
    return(
      <div>
        <Grid columns={1} stackable>
          <Image src={logo} centered={true} />
        </Grid>

        <Grid columns={2} stackable>
          <Grid.Column>
            <Segment>
              { this.state.isUserListLoaded && this.state.isMessageListLoaded ? <CanvasContainer roomId={this.room} setUserLoaded={this.state.setUserLoaded} xOffset={this.xOffset} yOffset={this.yOffset}/> : "" }
              { this.state.isUserListLoaded && this.state.isMessageListLoaded ? <Button secondary size='tiny' onClick={this.clearCanvas}>Clear</Button>: "" }
              <UserListContainer clickReady={this.clickReady} hostId={this.state.host_id} setUserLoaded={this.setUserLoaded}  users={this.state.users}/>
              <Button secondary size='tiny' onClick={this.leaveRoom.bind(this)}>Leave Room</Button>
            </Segment>
          </Grid.Column>

          <Grid.Column>
            <MessageListContainer sendMessage={this.sendMessage.bind(this)} setMessageLoaded={this.setMessageLoaded} messages={this.state.messages}/>
         </Grid.Column>
       </Grid>
      </div>
    )
  }

}

export default Room


//Old JSX, in case we can't fix the positioning of the canvas

/*
<div id="room">
  <div id="top">
    { this.state.isUserListLoaded && this.state.isMessageListLoaded ? <CanvasContainer roomId={this.room} setUserLoaded={this.state.setUserLoaded} xOffset={this.xOffset} yOffset={this.yOffset}/> : "" }
    { this.state.isUserListLoaded && this.state.isMessageListLoaded ? <Button onClick={this.clearCanvas}>Clear</Button>: "" }
    <MessageListContainer sendMessage={this.sendMessage.bind(this)} setMessageLoaded={this.setMessageLoaded} messages={this.state.messages}/>
  </div>
  <UserListContainer clickReady={this.clickReady} hostId={this.state.host_id} setUserLoaded={this.setUserLoaded}  users={this.state.users}/>

 <Button onClick={this.leaveRoom.bind(this)}>Leave Room</Button>
</div>
*/
