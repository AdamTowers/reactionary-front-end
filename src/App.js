import React, { Component } from 'react'
import CanvasContainer from './components/CanvasContainer'
import './App.css'
import Home from './routes/Home'
import Login from './routes/Login'
import Register from './routes/Register'
import Room from './routes/Room'
import { BrowserRouter as Router, Route, NavLink, Redirect } from 'react-router-dom';

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
        localStorage.setItem('token', json.token);
        localStorage.setItem('user_id', json.user_id);
        localStorage.setItem('username', json.username);
        callback("/");
      });
  }
  register = (username, password, callback) => {
    console.log(JSON.stringify({ username, password }))
    fetch('http://localhost:3001/api/v1/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ username, password })
    }).then(r => r.json())
      .then(json => {
        localStorage.setItem('token', json.token);
        localStorage.setItem('user_id', json.user_id);
        localStorage.setItem('username', json.username);
        callback("/");
      });
  }

  joinRoom = (callback, route) => {
    callback(route)
  }

  // TODO: Add a logout button somewhere and call this.
  logout = () => {
    // You'll want to use:
    localStorage.removeItem('user_id')
    localStorage.removeItem('username')
    localStorage.removeItem('token')
  }


 render = () => {
   return (
     <div>
      <Router>
       <div>
         <Route exact path="/" component={Home} joinRoom={this.joinRoom} {...this.props} />
         {/* Notice how we're passing down our router props with the spread operator. */}
         <Route path="/login" render={(props) => <Login onSubmit={this.login} {...props} />} />
         <Route path="/register" render={(props) => <Register onSubmit={this.register} {...props} />} />
         <Route path="/room/:id" render={(props) => <Room {...props} />} />


         {/* FYI, this is how you can make a comment in React JSX */}
         {/*
           _Things to Think About_
           We're protecting our /mysnacks route using a very simple method.
           There are more robust and DRY ways to handle this which we will
           get to when we learn about HOC (higher order components).
           Style-wise, we're using localStorage in a not so pretty way.
           It's acting like an interface. How could we handle this better?
         */}
         {
           // localStorage.getItem('token') ?
           //   <Route path="/mysnacks" render={(props) => <Snacks {...props} />} />
           // :
           //   <Redirect to="/register" />
         }
         {/* Redirect is a component from react-router-dom that let's us redirect. */}
       </div>
     </Router>

    </div>
   )
 }

}

export default App;
