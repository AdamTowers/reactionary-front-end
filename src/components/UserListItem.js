import React from 'react'

const UserListItem = (props) => {
  console.log(props)
  return (
    <div className="item">
      <div className="content">
        <div className="header">{props.user.username}</div>
      </div>
    </div>
  )
}
export default UserListItem
