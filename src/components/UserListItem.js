import React from 'react'

const UserListItem = (props) => {
  console.log(props)
  return (
    <div>{props.user.username}</div>
  )
}
export default UserListItem
