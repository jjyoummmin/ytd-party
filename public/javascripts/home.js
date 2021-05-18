$(async function () {
    $('#playbtn').click(()=>$('#id01').show());
    $('.close').click(()=>$('#id01').hide());
    $('.cancelbtn').click(()=>$('#id01').hide());

    try {
        let room_info = await $.ajax({ url: "/api/room_info_all", type: "GET" });
        let $rooms = $('.rooms');

        function add_thumbnail(info) {
            const {video_url, title, host, room_id} = info;
            let video_id = [...video_url.match(/(?<=\?v=).+$/)][0];
            let elem = `<li>
                <a href="/chat?rid=${room_id}"><img src="https://img.youtube.com/vi/${video_id}/mqdefault.jpg"></a>
                <div>${title}</div>
                <div>${host}님이 호스트 중</div>
                </li>`;
            $rooms.append(elem);
        }

        room_info.forEach(info => add_thumbnail(info));
    }catch(e){
        console.log("서버로 부터 room info를 가져올 수 없습니다.");
        console.log(e);
    }
    
})
