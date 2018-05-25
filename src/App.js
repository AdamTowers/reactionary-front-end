import React, { Component } from 'react'
import CanvasContainer from './Components/CanvasContainer'
import './App.css'
import ActionCable from 'actioncable'

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

 render() {
   return (
     <CanvasContainer />
   );
 }

}

export default App;
