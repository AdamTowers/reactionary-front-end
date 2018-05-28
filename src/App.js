import React, { Component } from 'react'
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom'
import CanvasContainer from './Components/CanvasContainer'
import './App.css'
import ActionCable from 'actioncable'

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

login = (username, password) => {
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
}

register = (username, password) => {
  // fetch('http://localhost:3000/api/v1/users')
}

 render() {
   return (
     <Router>
       <div>
         <Route exact path="/" render={<CanvasContainer />} />
         <Route path="/login" render={(props) => <UserForm submitLabel="Login" onSubmit={this.login}/>} />
         <Route path="/register" render={(props) => <UserForm submitLabel="Register" onSubmit={this.register} />} />
       </div>
     </Router>
   );
 }

}

export default App;
