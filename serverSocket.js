//클라이언트와 웹소켓 연결
const socket = require('socket.io');

module.exports = (server) => {
  const io = socket(server);

  io.on('connection', (socket) => {

    console.log('Connected');

    socket.on('join', (rid) => {
      socket.join(rid);
      console.log("rooms", socket.rooms);
    });

    socket.on('disconnect', function () {
      console.log("leave", socket.rooms);
    });

    socket.on('update', (rid, data) => {
      console.log(data);
      socket.to(rid).emit('update', data);
    });
    socket.on('play', (rid) => {
      console.log("play");
      socket.to(rid).emit('play')
    });
    socket.on('pause', (rid) => {
      socket.to(rid).emit('pause');
    })
    socket.on('slider', (rid, data) => {
      socket.to(rid).emit('slider', data)
    })

    socket.on('chat message', (rid, msg) => {
      console.log('message: ' + msg, rid);
      socket.to(rid).emit('chat message', msg);
    });
  });

}
