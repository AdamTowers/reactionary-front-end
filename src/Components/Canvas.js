import React from 'react'

const Canvas = (props) => {
  return <canvas
    id="canvas"
    height="500px"
    width="500px"
    onMouseOut={props.onMouseOut}
    onMouseDown={props.onMouseDown}
    onMouseMove={props.onMouseMove}
    onMouseUp={props.onMouseUp}>
  </canvas>
}

export default Canvas
