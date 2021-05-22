# ytd-party
왓챠파티를 패러디한 유튜브 파티. 친구와 채팅하면서 유튜브 같이보기.

[참고한 코드](https://github.com/aayush1408/Socket-Player)

|    |   |
|-------------|-------------|
| ![로그인화면](https://github.com/jjyoummmin/ytd-party/blob/main/%EB%8D%B0%EB%AA%A8%EC%98%81%EC%83%81/1.PNG)  |![홈화면](https://github.com/jjyoummmin/ytd-party/blob/main/%EB%8D%B0%EB%AA%A8%EC%98%81%EC%83%81/2.PNG)|
|![게스트채팅화면](https://github.com/jjyoummmin/ytd-party/blob/main/%EB%8D%B0%EB%AA%A8%EC%98%81%EC%83%81/3.PNG)|![호스트채팅화면](https://github.com/jjyoummmin/ytd-party/blob/main/%EB%8D%B0%EB%AA%A8%EC%98%81%EC%83%81/4.PNG)|



### 실행하기

1. npm install
2. config 디렉토리 아래의 *.template.json 파일들 채워서 *.json 파일로 저장

| config file | Description |
| --- | --- |
| login.json | OAuth 위한 각 RO 관련 클라이언트 아이디, 클라이언트 시크릿, 콜백 URL |
| apikey.json | youtube data api v3 key |
| session.json | 세션ID 암호화하기 위해 express-session 모듈이 사용할 시크릿 키 (원하는 것으로 설정 ..?) |

3. npm start

### 이용한 것

- noejs, express
- youtube iframe API  
[YouTube Player API 참조 문서](https://developers.google.com/youtube/iframe_api_reference)
- socket.io
- passport.js OAuth2.0  
passport.js 공부하면서 작성한 글     
[쿠키, 세션, passport.js 기본](https://pinball1973.tistory.com/33)  
[passport.js oauth](https://pinball1973.tistory.com/34)



