import React, {Component} from 'react'

class Login extends Component {
  constructor(props){
    super(props)
    this.state = {
      username: "",
      password: ""
    }
  }

  handleChange = (event) => {
   this.setState({
     [event.target.name]: event.target.value,
   })
  }

  onSubmit = (event) => {
    event.preventDefault()
    this.props.onSubmit(this.state.username, this.state.password, this.props.history.push);
  }

  onRegister = (event) => {
    event.preventDefault()
    this.props.history.push('/register')
  }

  render() {
    return (
      <div id="login">
      <h1>Login</h1>
        <form onSubmit={this.onSubmit.bind(this)} className="ui form">
          <div className="field">
            <label>Username</label>
            <input type="text" name="username" onChange={this.handleChange} value={this.state.username} />
          </div>

          <div className="field">
            <label>Password</label>
            <input type="password" name="password" onChange={this.handleChange} value={this.state.password}/>
          </div>

          <button className="ui button" type="submit">Submit</button>
        </form>
        <button className="ui button" tabIndex="0" type="button" onClick={this.onRegister}>Register</button>
      </div>
    )
  }
}

export default Login
