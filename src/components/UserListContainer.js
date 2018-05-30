import React, {Component} from 'react'
import UserListItem from './UserListItem'
import { Button } from 'semantic-ui-react'
class UserListContainer extends Component {
  constructor(props){
    super(props)
  }

  componentDidMount(){
    this.props.setUserLoaded()
  }

  clickReady = (e) => {
    console.log(e.target)
    this.props.clickReady(e.target)
  }
  componentDidUpdate(){

  }

  render() {
    const users = this.props.users.map(u => <UserListItem key={u.id} user={u.attributes} /> )
    console.log('USERS:')
    console.log(this.props.users)
    const disabled = users.length < 2
    return(
      <div id="user-container" className="ui celled list">
        {users}
        {parseInt(localStorage.user_id) === parseInt(this.props.hostId) ? <Button disabled={disabled} onClick={this.clickReady}>Start game</Button> : ""}
        {parseInt(localStorage.user_id) === parseInt(this.props.hostId) ? <Button onClick={this.props.deleteRoom}>Delete room</Button> : ""}

      </div>
    )
  }
}

export default UserListContainer
