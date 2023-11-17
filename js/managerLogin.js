let url = 'http://3.39.230.180:8080';

let id = document.getElementsByClassName("id-input")[0];
let pw = document.getElementsByClassName("pw-input")[0];
let userButton = document.getElementsByClassName("setting-icon")[0];
let okButton = document.getElementsByClassName("okButton")[0];

userButton.addEventListener("click", function(){
    window.open('./login.html', '_self');
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

    fetch(url+"/admin/auth/login", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if(data.status == "NOT_FOUND"){
            alert(data.message);
        }else{
            console.log(data);
            alert("로그인 되었습니다.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}