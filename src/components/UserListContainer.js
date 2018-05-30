import React, {Component} from 'react'
import UserListItem from './UserListItem'
import { Button } from 'semantic-ui-react'
class UserListContainer extends Component {
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
      <div>
        <h1>Players</h1>
        {users}


        {parseInt(localStorage.user_id, 10) === parseInt(this.props.hostId, 10) ? <Button primary disabled={disabled} onClick={this.clickReady}>Start game</Button> : ""}
        {parseInt(localStorage.user_id, 10) === parseInt(this.props.hostId, 10) ? <Button color="secondary" onClick={this.props.deleteRoom}>Delete room</Button> : ""}

      </div>
    )
  }
}

export default UserListContainer
