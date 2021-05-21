const url = window.location.href;
const rid = [...url.match(/(?<=\?rid=).+$/)][0];

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
        modestbranding: 1,         
        controls: 0,                
        disablekb: 1,               
        enablejsapi: 1,              
      },
      events: {
        'onReady': onPlayerReady,
      }
    });
  })();
}




$(function () {
  const name = $('#name').text();
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

  $('#form').on('submit', sendMessage);
  $('#volume').on('input', (e) => changeVolume(e.target))


  function changeVolume(self){
    player.setVolume(+self.value);
  }

  function sendMessage(e){
    e.preventDefault();
    let msg =  $input.val();
    if(!msg) return;
    $input.val('');
    socket.emit('chat message', msg);
    $messages.append(`<li class="me">${msg}</li>`);
    document.getElementById('mySidenav').scrollTo(0, document.body.scrollHeight);
  }

  //소켓 통신으로 전환
  let socket = io.connect('http://localhost:3000');

  window.onPlayerReady = function(){
    //호스트 재생정보 요청
    socket.emit('request hostplayinfo', rid);
  }
  
  socket.emit('join', rid, name, false);

  //받은 호스트 재생 정보로 초기 실행 싱크 맞추기
  socket.on('reply hostplayinfo', (state,time)=>{
      console.log("replied host play info", state, time);
      if(state===1 || state===3){
        player.seekTo(time,true);
        player.playVideo();
      }
  })

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

  socket.on('info message', (msg)=>{
    $messages.append(`<li class="info">${msg}</li>`);
    document.getElementById('mySidenav').scrollTo(0, document.body.scrollHeight);
  })

  socket.on('chat message', (data) => {
    let {name, msg} = data;
    $messages.append(`<li>${name} : ${msg}</li>`);
    document.getElementById('mySidenav').scrollTo(0, document.body.scrollHeight);
  });

  socket.on('error', (msg)=>{
    console.log(msg);
    window.location.href='/home';
  })

})