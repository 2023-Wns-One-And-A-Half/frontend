# frontend
2023 WNS 일과 이분의 일 프론트
  
### 1. 메인페이지 (main.html)
- 마이페이지, 로그인/회원가입, 상품등록 창 연결
- 기능 구현 (서버에서 사용자 정보 들고오기, 서버에서 게시글 들고오기, 검색 필터에 맞춰 게시글 정렬하기, 관심키워드 추가하기 등)

### 2. 로그인페이지 (login.html)
- 관리자 로그인, 회원가입 창 연결
- 기능 구현 (서버에서 아이디 비밀번호 비교하고 로그인)

### 3. 관리자로그인페이지 (managerLogin.html)
- 로그인 창 연결
- 기능 구현 (관리자 아이디/비밀번호 비교 후 로그인)

### 4. 회원가입페이지 (signup.html)
- 메인페이지 연결
- 기능 구현 (아이디 비밀번호 정해진 양식에 맞지 않으면 회원가입 불가, 양식에 맞으면 서버로 보내기)
  
### 5. 상품업로드페이지 (upload.html)
- 메인페이지 연결
- 기능 구현 (칸 모두 안 채우면 업로드 불가, 다 채우면 서버로 보내기)
  
### 6. 마이페이지 (userPage.html)
- html, css, 클래스명 정리 x
- 메인페이지 연결
- 기능 구현 (관심 키워드 추가, 알림 받아오기, 관심내역/판매내역/구매내역 서버에서 가져오기)

### 7. 관리자페이지 (managerPage.html)
- html, css, 클래스명 정리 x
- 메인페이지 연결
- 기능 구현 (서버에서 유저리스트, 블랙리스트 들고오기, 검색 시 해당 유저만 표시)

### 8. 게시글(판매자) 페이지 (sellerPage.html)
- html, css, 클래스명 정리 x (@지금 하는 중)
- sellerPopup(temp).html(구매 고객 확정창)은 디자인 참고만 하고 sellerPage.html에 구현하고 없앨거임
- 기능 구현 (서버에서 게시글/사진/상품정보 가져오기, 관심/조회 수 갱신, 서버에서 댓글 가져오기, 댓글 입력한 것 서버에 보내기, 팝업창에서 구매 고객 확정하기)

### 9. 게시글(구매자) 페이지 (buyerPage.html)
- 채팅페이지 연결 o
- buyerPopup(temp).html(구매 고객 확정창)은 디자인 참고만 하고 buyerPage.html에 구현하고 없앨거임
- 기능 구현 (서버에서 게시글/사진/상품정보 가져오기, 관심/조회 수 갱신, 서버에서 댓글 가져오기, 댓글 입력한 것 서버에 보내기)

### 10. 채팅페이지 (chat.html) (1:1 채팅 누르면 새창 띄울 것)
- html, css, 클래스명 정리 x
- 기능 구현 (서버에서 상대 채팅 받기, 내 채팅 전송하기)
  
  
### git 사용법
fork 한 후
1. 원본 레포지토리를 리모트에 추가 (한 번만 수행):  
  ```git remote add upstream 원본_레포지토리_URL.git```  
위 명령어로 원본 레포지토리를 리모트에 upstream이라는 이름으로 추가  
  
2. 원본 레포지토리에서 변경사항 가져오기 (Fetch):  
  ```git fetch upstream```  
위 명령어로 원본 레포지토리의 변경사항을 가져온다  
  
3. 내 브랜치로 변경사항 병합 (Merge):  
  ```git merge upstream/main```  
가져온 변경사항을 현재 작업 중인 브랜치로 병합. main 대신에 다른 브랜치 이름을 사용할 수 있다.  
  
4. 내 레포지토리에 변경사항 푸시 (Push):  
  ```git push origin main```  
변경사항을 자신의 fork된 레포지토리에 푸시  
  
이러면 fork된 레포지토리에는 원본 레포지토리의 최신 변경사항이 반영되어 있다. 이 후에 작업하고 싶은 브랜치로 이동하여 작업을 계속할 수 있다.  
  
그 후 자신의 레포지토리로 이동한 후, "Pull Request"를 생성하기
