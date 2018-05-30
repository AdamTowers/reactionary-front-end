import React, {Component} from 'react'
import { Container, Segment, Button, Image } from 'semantic-ui-react'
import logo from '../images/reactionary_logo.png'

class Register extends Component {
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

  onLogin = (event) => {
    event.preventDefault()
    this.props.history.push('/login')
  }

  render() {
    return (
      <Container text>
        <Image src={logo} centered={true} />
        <Segment.Group>
          <Segment>
            <h1>Register</h1>
              <form onSubmit={this.onSubmit.bind(this)} className="ui form">
                <div className="field">
                  <label>Username</label>
                  <input type="text" name="username" onChange={this.handleChange} value={this.state.username} />
                </div>

                <div className="field">
                  <label>Password</label>
                  <input type="password" name="password" onChange={this.handleChange} value={this.state.password}/>
                </div>

                <Button primary type="submit">Submit</Button>
                <Button secondary tabIndex="0" onClick={this.onLogin}>Login</Button>
              </form>
            </Segment>
          </Segment.Group>
        </Container>
    )
  }
}

export default Register
