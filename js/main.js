let url = 'http://3.39.230.180:8080';

let mypageButton = document.getElementsByClassName("goto-mypage")[0];

let loginOrsignup = document.getElementsByClassName("login-or-signup")[0];
let logout = document.getElementsByClassName("logout")[0];
let loginButton = document.getElementById("loginButton");
let logoutButton = document.getElementById("logoutButton");
let signupButton = document.getElementById("signupButton");
let cookie = localStorage.getItem("jsessionid");
let uploadButton = document.getElementsByClassName("goto-upload")[0];

let username = document.getElementsByClassName("nickname")[0];
let userarea = document.getElementsByClassName("userarea")[0];

if(cookie == null){
    console.log("로그아웃 상태");
    loginOrsignup.style.display = 'block';
    logout.style.display = 'none';
    
}else{
    console.log("로그인 상태");
    loginOrsignup.style.display = 'none';
    logout.style.display = 'block';
}

//페이지 이동
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
        viewInfo(data.nickname, data.activityArea, profileURL)
        console.log(data.id);
        console.log(data.nickname);
        console.log(data.profileImageName);
        console.log(data.activityArea);
        console.log(data.black);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

//getInfo();

function viewInfo(nickname, activityArea, profileURL){
    username.innerHTML = nickname;
    userarea.innerHTML = "활동지역 : "+activityArea
}


/* api post

FormData() 상품등록, 회원가입
function postInfo(){
    let formData = new FormData();
    formData.append("username", id);
    formData.append("password", pw);
    formData.append("activityArea", area);
    formData.append("nickname", nickname);
    formData.append("profileImage", img);

    fetch(url+"", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: formData,
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

JSON 그 외
function postInfo(id, pw){
    const data = {
        "username":id,
        "password":pw,
    }

    fetch(url+"/members/login", {
    method: 'POST',
    withCredentials: true,
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