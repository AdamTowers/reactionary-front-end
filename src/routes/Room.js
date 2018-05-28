import React, {Component} from 'react'
import UserListContainer from '../components/UserListContainer'
import MessageListContainer from '../components/MessageListContainer'
import CanvasContainer from '../components/CanvasContainer'
import ActionCable from 'actioncable'

class Room extends Component {
  constructor(props){
    super(props)
    this.state = {
      isUserListLoaded: false,
      isMessageListLoaded: false
    }
  }

  componentDidMount() {

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

  render() {

    return(
      <div id="room">
        { this.state.isUserListLoaded && this.state.isMessageListLoaded ? <CanvasContainer setUserLoaded={this.state.setUserLoaded} xOffset={this.xOffset} yOffset={this.yOffset}/> : "" }
        <UserListContainer setUserLoaded={this.setUserLoaded} roomId={this.props.match.params.id} />
        {/*
          <MessageListContainer setMessageLoaded={this.setMessageLoaded}/>

          */}
      </div>
    )
  }

}

export default Room
