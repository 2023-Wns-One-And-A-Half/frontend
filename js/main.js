let url = 'http://3.39.230.180:8080';

let mypageButton = document.getElementsByClassName("goto-mypage")[0];

let loginOrsignup = document.getElementsByClassName("login-or-signup")[0];
let logout = document.getElementsByClassName("logout")[0];
let loginButton = document.getElementById("loginButton");
let logoutButton = document.getElementById("logoutButton");
let signupButton = document.getElementById("signupButton");
let cookie = localStorage.getItem("jsessionid");

let uploadButton = document.getElementsByClassName("goto-upload")[0];
let addKeywordButton = document.getElementsByClassName("keyword-addButton")[0];
let addKeywordBack = document.getElementsByClassName("addButton-background")[0];

let username = document.getElementsByClassName("nickname")[0];
let userarea = document.getElementsByClassName("userarea")[0];
let userimg = document.getElementsByClassName("profile-img")[0];

if(cookie == null){
    console.log("로그아웃 상태");
    loginOrsignup.style.display = 'block';
    logout.style.display = 'none';
    
}else{
    console.log("로그인 상태");
    loginOrsignup.style.display = 'none';
    logout.style.display = 'block';
}


/* 페이지 이동 */
mypageButton.addEventListener("click", function(){
    window.open('./userPage.html', '_self');
})

loginButton.addEventListener("click", function(){
    window.open('./login.html', '_self');
})

logoutButton.addEventListener("click", function(){
    alert("로그아웃 되었습니다.");
    localStorage.removeItem("jsessionid");
    localStorage.removeItem("user");
    window.open('./main.html', '_self');
})

signupButton.addEventListener("click", function(){
    window.open('./signup.html', '_self');
})

uploadButton.addEventListener("click", function(){
    window.open('./upload.html', '_self');
})


/* 서버로부터 로그인 정보 불러오기 */
function getInfo(){
  fetch(url+"/members/my", {
    method: 'GET',
    credentials : 'include',
    headers: {
      'Content-Type': 'application/json',
      'JSESSIONID' : cookie,
    },
  }).then(response => response.json())
    .then(data => {
        let profileURL = 'https://d1npdfz46uvcun.cloudfront.net/'+data.profileImageName;
        let activityArea = "";
        switch(data.activityArea){
            case "SEOUL":
                activityArea = "서울";
                break;
            case "INCHEON":
                activityArea = "인천";
                break;
            case "DAEJEON":
                activityArea = "대전";
                break;
            case "GWANGJU":
                activityArea = "광주";
                break;
            case "DAEGU":
                activityArea = "대구";
                break;
            case "BUSAN":
                activityArea = "부산";
                break;
            case "ULSAN":
                activityArea = "울산";
                break;
            default:
                activityArea = "미정";
        }
        console.log(data.id);
        console.log(data.nickname);
        console.log(profileURL);
        console.log(data.activityArea);
        console.log(data.black);

        if(cookie!=null){
            viewInfo(data.nickname, activityArea, profileURL)
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


/* 새로고침/창 띄울 때마다 정보 가져옴 */
getInfo();


/* 메인페이지에 로그인 유저 정보 띄우기 */
function viewInfo(nickname, activityArea, profileURL){
    if(localStorage.getItem("user")==null){
        username.innerHTML = "admin";
    }else{
        username.innerHTML = nickname;
        userarea.innerHTML = "활동지역 : "+activityArea;
        userimg.innerHTML = "<img id=\"profile-img\" src=\""+profileURL+"\"/>";
        addKeywordBack.style.display = 'block';
    }
}


/* 키워드 추가 */
addKeywordButton.addEventListener("click", function(){
    let keyword = prompt("추가할 키워드를 입력해주세요");
    if(keyword == null){
        alert("키워드 추가가 취소되었습니다.");
    }else{
        while(keyword.startsWith(" ")){
            keyword = keyword.substring(1);
        }

        while(keyword.endsWith(" ")){
            keyword = keyword.substring(0, keyword.length-1);
        }
        
        if(keyword == ""){
            alert("키워드가 입력되지 않았습니다.");
        }else{
            keyword = keyword.replace(/(^ *)|( *$)/g, "").replace(/ +/g, "_");
            console.log(keyword);
            postKeyword(keyword);
        }
    }
})
 

/* 서버에 추가할 키워드 보내기 */
function postKeyword(keyword){
    const data = {
        "content": keyword,
    }

    fetch(url+"/keywords",{
    method: 'POST',
    credentials : 'include',
    headers: {
        'Content-Type': 'application/json',
        'JSESSIONID' : cookie,
    },
    body: JSON.stringify(data),
    }).then(response => response.json())
    .then(data => {
        if(data.status == "CONFLICT"){
            alert(data.message);
        }else{
            console.log(data);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


/* JSON 그 외
function postInfo(id, pw){
    const data = {
        "username":id,
        "password":pw,
    }

    fetch(url+"/members/login", {
    method: 'POST',
    credentials : 'include',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    })
    .then(data => {
        if(data.status == "NOT_FOUND"){
            alert(data.message);
        }else{
            console.log(data);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
*/