var server = require('http').createServer()
var io = require('socket.io')(server)

console.log(io)
io.on('connection', function(socket){

  console.log('connection is made: '+ socket)
  socket.on('join-room', (data)=>{
    console.log('joined room'+data)
  })

  socket.on('draw', (line) => {
    console.log(line)
    if(line)
      socket.broadcast.emit("draw",line);
    else {
      console.log('noope')
    }
  })

  socket.on('begin-path', ()=>{
    socket.broadcast.emit("begin-path");
  })

  socket.on('close-path', ()=>{
    socket.broadcast.emit("close-path");
  })
});

server.listen(3001, function(){
  console.log('listening on port 3001.')
});
