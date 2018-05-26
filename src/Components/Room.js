import React, {Component} from 'react'
import 'semantic-ui-css/semantic.min.css';
class Room extends Component {

  render(){
    return(
      <div className="item" key={this.props.room.host_id}>
        <div className="content">
          <div className="header">{this.props.room.name}</div>
          <p>{this.props.users.length} /10 people</p>
        </div>

      </div>


    )
  }
}


export default Room
