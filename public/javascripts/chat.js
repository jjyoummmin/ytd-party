const url = window.location.href;
const rid = [...url.match(/(?<=\?rid=).+$/)][0];
  
//유튜브 화면 그리기
// DOMContentLoaded 이전에 iframe api가 ready되서 이 함수 호출을 못하게 되는 경우가 있어서 이것은 dom-ready 함수 밖으로 뺌
let player;
window.onYouTubeIframeAPIReady = () => {
  (async function () {
    console.log("ytd-ready");
    video_id = await $.ajax({ url: `/api/video_id?rid=${rid}`, type: "GET" });
    player = new YT.Player('player', {
      height: '480px',
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

$(function () {
  //각종 이벤트 핸들러 등록하기
  //두번이상 참조되는 dom들은 따로 상수화
  const $mySidenav = $('#mySidenav');
  const $main = $('#main');
  const $chatopen = $('.chatopen');
  const $messages = $('#messages');
  const $input = $('#input');
  const $slider = $('#slider');

  $('.chatopen').click((e) => {
    $mySidenav.width('300px');
    $main.css({ marginRight: "330px" });
    $(e.target).addClass('hide');
  })

  $('.closebtn').click(() => {
    $mySidenav.width('0px');
    $main.css({ marginRight: "0" });
    $chatopen.removeClass('hide');
  })

  $('#playBtn').on('click', playVideo);
  $('#pauseBtn').on('click', pauseVideo);
  $('#form').on('submit', sendMessage);
  $('#slider').on('input', (e) => changeTime(e.target))
  $('#volume').on('input', (e) => changeVolume(e.target))

  function playVideo() {
    socket.emit('play', rid)
    player.playVideo();
    // 이거 때매 슬라이더 움직임
    setInterval(() => {
      let fraction = player.getCurrentTime() / player.getDuration() * 100;
      $slider.val(fraction);
      socket.emit('slider', rid, slider.value);
    }, 200)
  }

  function pauseVideo() {
    socket.emit('pause', rid)
    player.pauseVideo();
  }


  function changeTime(self) {
    console.log("changeTime");
    let goTo = player.getDuration() * (self.value / 100);
    self.value = goTo;
    socket.emit('update', rid, goTo);
    player.seekTo(goTo, true);

  }

  function changeVolume(self){
    player.setVolume(+self.value);
  }

  function sendMessage(e){
    e.preventDefault();
    let msg =  $input.val();
    $input.val('');
    if (msg) {
      socket.emit('chat message', rid, msg);
      $messages.append(`<li class="me">${msg}</li>`);
      document.getElementById('mySidenav').scrollTo(0, document.body.scrollHeight);
    }
  }

  //서버와 소켓 통신으로 전환 (http => 웹소켓)
  let socket = io.connect('http://localhost:3000');
  socket.emit('join', rid);


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

  socket.on('chat message', (msg) => {
    console.log('got message', msg);
    $messages.append(`<li>${msg}</li>`);
    document.getElementById('mySidenav').scrollTo(0, document.body.scrollHeight);
  });

  socket.on('disconnect',()=>{
    console.log('소켓 연결 끊겼다..')
    window.location.href='/home';
  })
})




