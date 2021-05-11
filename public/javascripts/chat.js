
console.log("hello");
let url = window.location.href;
let rid = url.slice(url.lastIndexOf('/')+1);
console.log(url,rid);
let player;
function onYouTubeIframeAPIReady() {
  (async function () {
    console.log("ytd-ready");
    video_id = await $.ajax({ url: `/api/video_id?rid=${rid}`, type: "GET" });
    player = new YT.Player('player', {
      height: '500px',
      width: '100%',
      videoId: video_id,
      playerVars: {
        autoplay: 0,
        rel: 0,
        modestbranding: 1,
        controls: 1,
        disablekb: 1,
        enablejsapi: 1,
      },
    });
  })();
}

function openNav() {
  document.getElementById("mySidenav").style.width = "300px";
  document.getElementById("main").style.marginRight = "330px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginRight = "0";
}


//DOM 에 이벤트 리스너 등록
$(function () {
  console.log("ready");
  $('#playBtn').on('click', playVideo);
  $('#pauseBtn').on('click', pauseVideo);
  $('#form').on('submit', function(e) {
    e.preventDefault();
    if ($('#input').val()) {
      socket.emit('chat message', rid,  $('#input').val());
      $('#input').val('');
    }
  });
})

//소켓 관련
let socket = io.connect('http://localhost:3000');
socket.emit('join', rid);
let $slider = $('#slider');
function playVideo(){
  socket.emit('play',rid)
  player.playVideo();
  // 이거 때매 슬라이더 움직임
  setInterval(()=>{
      let fraction = player.getCurrentTime()/player.getDuration() * 100;
      $slider.val(fraction);
      socket.emit('slider', rid, slider.value);
  },200)
}

function pauseVideo() {
  socket.emit('pause',rid)
  player.pauseVideo();
}

function changeTime(e) {
  console.log("changeTime");
  let goTo = player.getDuration() * (e.value / 100);
  player.seekTo(goTo, true);
  e.value = goTo;
  socket.emit('update', rid, goTo);
}

socket.on('update', (data) => {
  console.log('Received data', data);
  $slider.val(data);
  player.seekTo(data, true);
})

socket.on('play', () => {
  player.playVideo();
})

socket.on('pause', () => {
  player.pauseVideo();
})

socket.on('slider', (data) => {
  $slider.val(data);
})

socket.on('chat message', (msg)=> {
  console.log('got message', msg);
  $('#messages').append(`<li>${msg}</li>` );
  window.scrollTo(0, document.body.scrollHeight);
});