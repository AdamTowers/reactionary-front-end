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

  render() {

    const users = this.props.users.map(u => <UserListItem key={u.id} user={u.attributes} /> )
    console.log('USERS:')
    console.log(this.props.users)
    return(
      <div>
        <h1>Players</h1>
        {users}
      </div>
    )
  }
}

export default UserListContainer
