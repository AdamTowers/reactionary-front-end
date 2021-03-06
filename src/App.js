import React, { Component } from 'react'

import './App.css'
import Home from './routes/Home'
import Login from './routes/Login'
import Register from './routes/Register'
import Room from './routes/Room'
import { BrowserRouter as Router, Route } from 'react-router-dom';

class App extends Component {
  login = (username, password, callback) => {
    fetch('http://localhost:3001/api/v1/sessions/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ username: username, password_digest: password })
    }).then(res => res.json())
      .then(json => {
        if (json.token) {
          localStorage.setItem('token', json.token);
          localStorage.setItem('user_id', json.user_id);
          localStorage.setItem('username', json.username);
          callback("/");
        } else {
          alert("Wrong username/password combination.")
        }
      });
  }
  register = (username, password, callback) => {
    fetch('http://localhost:3001/api/v1/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ username, password })
    }).then(r => r.json())
      .then(json => {
        if (json.token) {
          localStorage.setItem('token', json.token);
          localStorage.setItem('user_id', json.user_id);
          localStorage.setItem('username', json.username);
          callback("/");
        } else {
          json.forEach(error => alert(error))
        }
      });
  }

  joinRoom = (callback, route) => {
    callback(route)
  }

 render = () => {
   return (
     <div className="app-container">
      <Router>
       <div>
         <Route exact path="/" component={Home} joinRoom={this.joinRoom} {...this.props} />
         <Route path="/login" render={(props) => <Login onSubmit={this.login} {...props} />} />
         <Route path="/register" render={(props) => <Register onSubmit={this.register} {...props} />} />
         <Route path="/room/:id" render={(props) => <Room {...props} />} />
       </div>
     </Router>
    </div>
   )
 }
}

export default App;
