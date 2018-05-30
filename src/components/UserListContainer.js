import React, {Component} from 'react'
import UserListItem from './UserListItem'

class UserListContainer extends Component {
  componentDidMount(){
    this.props.setUserLoaded()
  }

  clickReady = (e) => {
    this.props.clickReady(e.target)
  }

  render() {

    const users = this.props.users.map(u => <UserListItem key={u.id} user={u.attributes} /> )
    return(
      <div>
        <h1>Players</h1>
        {users}
      </div>
    )
  }
}

export default UserListContainer
