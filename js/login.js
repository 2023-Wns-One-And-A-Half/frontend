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


function postInfo(id, pw){
    let formData = new FormData();
    formData.append("username", id);
    formData.append("password", pw);

    fetch(url+"/members/login", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: formData,
    })
    .then(data => {
        if(data.status == "NOT_FOUND" || data.status == "UNAUTHORIZED"){
            alert(data.message);
        }else{
            console.log(data);
            alert("로그인 되었습니다.");
            window.open('./main.html', '_self');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}