import React, { Component } from 'react'
import { BrowserRouter as Router, Redirect, Route, NavLink } from 'react-router-dom'
import CanvasContainer from './Components/CanvasContainer'
import './App.css'

import UserForm from './Components/UserForm'

class App extends Component {
  // componentDidMount() {
  //   const cable = ActionCable.createConsumer('ws://localhost:3002/cable')
  //   this.sub = cable.subscriptions.create(
  //     {channel: 'RoomsChannel', room: 'test'},{
  //       connected: function() {
  //         console.log("connected");
  //       },
  //       disconnected: function() {
  //         console.log("disconnected");
  //       },
  //       received: function(data){
  //         console.log(data)
  //       }
  //     }
  //   )
  //   this.sub.send({user_id: 2, room_id: 1})
  // }

login = (username, password, callback) => {
  fetch('http://localhost:3000/api/v1/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: password,
    })
  })
  .then(res => res.json())
  .then(json => {
    localStorage.setItem('token', json.token)
    localStorage.setItem('user_id', json.user_id)
    localStorage.setItem('username', json.username)

    callback("/")
  })
}

register = (username, password, callback) => {
  fetch('http://localhost:3000/api/v1/users', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(json => {
    localStorage.setItem('token', json.token)
    localStorage.setItem('user_id', json.user_id)
    localStorage.setItem('username', json.username)

    callback("/")
  })
}

 render() {
   return (
     <Router>
       <div>
         <Route exact path="/" component={CanvasContainer} />
         <Route path="/login" render={(props) => <UserForm submitLabel="Login" onSubmit={this.login} {...props} />} />
         <Route path="/register" render={(props) => <UserForm submitLabel="Register" onSubmit={this.register} {...props} />} />
         {
           localStorage.getItem('token') ?
            <Route exact path="/" component={CanvasContainer} />
            :
            <Redirect to="/register" />
         }
       </div>
     </Router>
   );
 }

}

export default App;
