import React, {Component} from 'react'
import UserListItem from './UserListItem'

class UserListContainer extends Component {
  constructor(props){
    super(props)
  }

  componentDidMount(){
    this.props.setUserLoaded()
  }

  clickReady = (e) => {
    console.log(e.target)
  }

  render() {
    const users = this.props.users.map(u => <UserListItem key={u.id} user={u.attributes} /> )
    return(
      <div id="user-container" className="ui celled list">
        {users}
        {parseInt(localStorage.user_id) === parseInt(this.props.hostId) ? <button>Start game</button> : ""}
      </div>
    )
  }
}

export default UserListContainer
