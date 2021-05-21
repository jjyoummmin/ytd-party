//클라이언트와 웹소켓 연결
const socket = require('socket.io');

module.exports = (server, db) => {
  const io = socket(server);

  //[1] 각 룸의 호스트 socket id 저장...
  //이걸 일단 맵으로 처리했는데 규모가 커지면 어쩔껀가.....?
  const roomMap = new Map();

  io.on('connection', (socket) => {
    console.log('Connected');

    //[2] 여기도 그냥 조악하게 host인지 클라이언트에서 보내는 true/false 정보로만 판단..
    //고쳐야됨
    socket.on('join', (rid, name, host) => {
      //validate host
      if(host){
        console.log("호스트입니다.");
        if(roomMap.has(rid)){
          io.to(socket.id).emit("error","호스트가 다중 연결되었습니다.");
          return;
        }
        roomMap.set(rid, socket.id);
        console.log(roomMap);
      }
      socket.join(rid);
      socket.name = name;
      socket.rid = rid;

      socket.to(socket.rid).emit('info message', 
        `${name}님이 입장하셨습니다. ${io.sockets.adapter.rooms.get(rid) && io.sockets.adapter.rooms.get(rid).size}명 참가중`);
    });

    socket.on('disconnect', function () {
      const rid = socket.rid;
      if(socket.id===roomMap.get(rid)){
        db.get('rooms').remove({room_id:rid}).write();
        roomMap.delete(rid);
        socket.to(rid).emit("error", "호스트가 퇴장했습니다.");
        return;
      }
      socket.to(rid).emit('info message', 
      `${socket.name}님이 퇴장하셨습니다. ${io.sockets.adapter.rooms.get(rid) && io.sockets.adapter.rooms.get(rid).size}명 참가중`);
    });

    socket.on('request hostplayinfo', (rid)=>{
      if(!roomMap.has(rid)) io.to(socket.id).emit("error", "호스트를 찾을 수 없습니다..");
      else{
        const host = roomMap.get(rid);
        io.to(host).emit("request hostplayinfo", socket.id);
      }

    })

    socket.on('reply hostplayinfo', (socketId, state, time)=>{
      io.to(socketId).emit('reply hostplayinfo', state, time);
    })

    socket.on('update', (data) => {
      console.log(data);
      socket.to(socket.rid).emit('update', data);
    });
    socket.on('play', () => {
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
