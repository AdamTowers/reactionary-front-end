import React, {Component} from 'react'
import { Button} from 'semantic-ui-react'

class RoomButton extends Component {
  componentDidMount() {
    this.props.setButtonLoaded()
  }

  render() {
    return (
      <Button onClick={this.props.onClick.bind(this)}>{this.props.text}</Button>
    )
  }
}

export default RoomButton
