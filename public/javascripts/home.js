const room_info = [{
    video_url: 'https://www.youtube.com/watch?v=W4vzZbAvyDY',
    title: 'Tiny desk concert | Fly me to the moon☽ with penguin🚀',
    host: '또리',
    room_id : 1,
},
{
    video_url: 'https://www.youtube.com/watch?v=u5WK5nU0-Dk',
    title: '가난해야 예술한다고? 자기만의 방과 500파운드의 의미 | 버지니아 울프의 삶과 작품 세계',
    host: '용남',
    room_id : 2,
},
{
    video_url: 'https://www.youtube.com/watch?v=wSw7Dpoc3rI',
    title: '(ENG) 저 목욕하는 펭귄입니다. [EP.181]',
    host: '민수',
    room_id : 3,
},
{
    video_url: 'https://www.youtube.com/watch?v=XmDJDiM7HG8',
    title: 'Tiny desk concert | Fly me to the moon☽ with penguin🚀',
    host: '수은',
    room_id : 4,
},
{
    video_url: 'https://www.youtube.com/watch?v=lGXJoGLeLn0',
    title: 'Tiny desk concert | Fly me to the moon☽ with penguin🚀',
    host: '찬혁',
    room_id : 5,
},
{
    video_url: 'https://www.youtube.com/watch?v=SYIEFsP8Hy0',
    title: 'Tiny desk concert | Fly me to the moon☽ with penguin🚀',
    host: '수현',
    room_id : 6,
},
{
    video_url: 'https://www.youtube.com/watch?v=CyelIVCa-5Q',
    title: 'Tiny desk concert | Fly me to the moon☽ with penguin🚀',
    host: '폴킴',
    room_id : 7,
}];

$(function () {
    //팝업
    function myFunction() {
        var popup = document.getElementById("myPopup");
        popup.classList.toggle("show");
    }


    let $rooms = $('.rooms');
    console.log($rooms, "rooms tqtq");
    function add_thumbnail(video_id, title, host, room_id) {
        console.log(video_id, title, host,room_id);
        let elem = `<li>
                <a href="/chat/${room_id}"><img src="https://img.youtube.com/vi/${video_id}/mqdefault.jpg"></a>
                <div>${title}</div>
                <div>${host}님이 호스트 중</div>
                </li>`;
        console.log($rooms, $(elem));
        $rooms.append(elem);
    }

    room_info.forEach(info => {
        const { video_url, title, host, room_id } = info;
        let video_id = [...video_url.match(/(?<=\?v=).+$/)][0];
        add_thumbnail(video_id, title, host, room_id);
    });
})
