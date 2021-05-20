//클라이언트와 웹소켓 연결
const socket = require('socket.io');

module.exports = (server) => {
  const io = socket(server);

  io.on('connection', (socket) => {
    console.log('Connected');

    socket.on('join', (rid, name) => {
      //validate host
      socket.join(rid);
      socket.name = name;
      socket.rid = rid;
      // console.log("rooms", io.sockets.adapter.rooms.get(rid).size)
      console.log("rooms", socket.rooms);
      socket.to(socket.rid).emit('info message', 
        `${name}님이 입장하셨습니다. ${io.sockets.adapter.rooms.get(rid) && io.sockets.adapter.rooms.get(rid).size}명 참가중`);
    });

    socket.on('disconnect', function () {
      socket.to(socket.rid).emit('info message', 
      `${socket.name}님이 퇴장하셨습니다. ${io.sockets.adapter.rooms.get(socket.rid) && io.sockets.adapter.rooms.get(socket.rid).size}명 참가중`);
      console.log("leave", socket.rooms);
    });

    socket.on('update', (data) => {
      console.log(data);
      socket.to(socket.rid).emit('update', data);
    });

    socket.on('play', () => {
      console.log("play");
      socket.to(socket.rid).emit('play')
    });
    socket.on('pause', () => {
      socket.to(socket.rid).emit('pause');
    })
    socket.on('slider', (data) => {
      socket.to(socket.rid).emit('slider', data)
    })

    socket.on('chat message', (msg) => {
      console.log('message: ' + msg);
      socket.to(socket.rid).emit('chat message', {name:socket.name, msg});
    });
  });

}
