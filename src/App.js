import React, { Component } from 'react'
import CanvasContainer from './Components/CanvasContainer'
import './App.css'
import Rooms from './Containers/Rooms'
// import ActionCable from 'actioncable'

class App extends Component {

 render() {
   return (
     <Rooms />
     // <CanvasContainer />
   );
 }

}

export default App;
