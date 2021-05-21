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
        autoplay: 0,                //로드시 자동재생 x
        modestbranding: 1,          //youtube 로고 컨트롤바에 표시 x
        controls: 0,                 //동영상 플레이어 컨트롤 표시 x
        disablekb: 1,                //키보드 컨트롤에 응답 x
        enablejsapi: 1,              //api 호출로 플레이어 제어 
      },
    });
  })();
}


$(function () {
  const name = $('#name').text();
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

  function moveSlider(){
    let fraction = player.getCurrentTime() / player.getDuration() * 100;
    $slider.val(fraction);
    socket.emit('slider', slider.value);
  }

  function playVideo() {
    socket.emit('play')
    player.playVideo();
    setInterval(moveSlider, 200)
  }

  function pauseVideo() {
    socket.emit('pause')
    player.pauseVideo();
    clearInterval(moveSlider)
  }


  function changeTime(self) {
    console.log("changeTime");
    let goTo = player.getDuration() * (self.value / 100);
    self.value = goTo;
    socket.emit('update', goTo);
    player.seekTo(goTo, true);
  }

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

  //서버와 소켓 통신으로 전환 (http => 웹소켓)
  let socket = io.connect('http://localhost:3000');
  socket.emit('join', rid, name, true);

  socket.on('request hostplayinfo', (socketId)=>{
    const state= player.getPlayerState();
    const time = player.getCurrentTime();
    socket.emit('reply hostplayinfo', socketId, state, time);
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




