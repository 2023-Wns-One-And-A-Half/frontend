let url = 'http://3.39.230.180:8080';

let adminButton = document.getElementsByClassName("setting-icon")[0];
let signupButton = document.getElementsByClassName("goto-signup")[0];
let id = document.getElementsByClassName("id-input")[0];
let pw = document.getElementsByClassName("pw-input")[0];
let okButton = document.getElementsByClassName("okButton")[0];

adminButton.addEventListener("click", function(){
    window.open('./managerLogin.html', '_self');
})

signupButton.addEventListener("click", function(){
    window.open('./signup.html', '_self');
})



okButton.addEventListener("click", function(){
    if(id.value != "" && pw.value != ""){
        postInfo(id.value, pw.value);
    }else{
        alert("아이디, 비밀번호를 모두 입력해주세요.");
    }
})


/* 서버에 로그인 정보 전송 */
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
    }).then(response => response.json())
    .then(async data => {
        if(data.status == "NOT_FOUND" || data.status == "UNAUTHORIZED" || data.status == "BAD_REQUEST"){
            alert(data.message);
        }else{
            //console.log(data);
            localStorage.setItem("jsessionid", data.jsessionid);
            getInfo(data.jsessionid);
            let black = await checkBlack(data.jsessionid);
            if(black == false){
                alert("로그인 되었습니다.");
                window.open('./main.html', '_self');
            }else{
                alert("해당 계정은 블랙리스트에 등록되어 로그인 하실 수 없습니다.");
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


/* 로그인 하려는 계정이 블랙리스트인지 확인 */
async function checkBlack(cookie){
    let black = await fetch(url+"/members/my", {
        method: 'GET',
        credentials : 'include',
        headers: {
        'Content-Type': 'application/json',
        'JSESSIONID' : cookie,
        },
    }).then(response => response.json())
        .then(data => {
           return data.black; 
        })
        .catch(error => {
            console.error('Error:', error);
    });

    return black;
}

/* localstorage에 로그인 유저 정보 저장 */
function getInfo(cookie){
    fetch(url+"/members/my", {
      method: 'GET',
      credentials : 'include',
      headers: {
        'Content-Type': 'application/json',
        'JSESSIONID' : cookie,
      },
    }).then(response => response.json())
      .then(data => {
        //console.log(data);
        localStorage.setItem("userId", data.id);
        localStorage.setItem("user", data.nickname);
      })
      .catch(error => {
          console.error('Error:', error);
      })
};