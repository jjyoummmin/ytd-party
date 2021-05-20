//DOM 에 이벤트 리스너 등록
$(function () {
  let url = window.location.href;
  let rid = [...url.match(/(?<=\?rid=).+$/)][0];
  let player;
  window.onYouTubeIframeAPIReady = () => {
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
  const $mySidenav = $('#mySidenav');
  const $main = $('#main');

  $('.chatopen').click((e) => {
    $mySidenav.width('300px');
    $main.css({ marginRight: "330px" });
    $(e.target).addClass('hide');
  })

  $('.closebtn').click(() => {
    $mySidenav.width('0px');
    $main.css({ marginRight: "0" });
    $('.chatopen').removeClass('hide');

  })

  $('#playBtn').on('click', playVideo);
  $('#pauseBtn').on('click', pauseVideo);
  $('#form').on('submit', function (e) {
    e.preventDefault();
    if ($('#input').val()) {
      socket.emit('chat message', rid, $('#input').val());
      $('#input').val('');
    }
  });

  $('#slider').on('input', (e) => changeTime(e.target))

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

  //소켓 관련
  let socket = io.connect('http://localhost:3000');
  socket.emit('join', rid);

  let $slider = $('#slider');

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
    $('#messages').append(`<li>${msg}</li>`);
    window.scrollTo(0, document.body.scrollHeight);
  });


})




