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

  render() {

    const users = this.props.users.map(u => <UserListItem key={u.id} user={u.attributes} /> )
    return(
      <div>
        <h1>Players</h1>
        {users}
        {parseInt(localStorage.user_id) === parseInt(this.props.hostId) ? <Button primary onClick={this.clickReady}>Start game</Button> : ""}
      </div>
    )
  }
}

export default UserListContainer
