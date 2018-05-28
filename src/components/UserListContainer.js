import React, {Component} from 'react'
import UserListItem from './UserListItem'

class UserListContainer extends Component {
  constructor(props){
    super(props)
    this.state = {
      users: []
    }
  }

  componentDidMount(){
    if(this.props.roomId)
      fetch('http://localhost:3001/api/v1/user_room/'+this.props.roomId).then(r => r.json()).then(res => {
        this.setState({
          users: res.data
        })
        this.props.setUserLoaded()
      })

  }

  render() {
    console.log('rendering')
    const users = this.state.users.map(u => <UserListItem key={u.id} user={u.attributes} /> )
    return(
      <div className="ui celled list">
        {users}
      </div>
    )
  }
}

export default UserListContainer
