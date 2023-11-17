let url = 'http://3.39.230.180:8080';

let id = document.getElementsByClassName("id-input")[0];
let pw = document.getElementsByClassName("pw-input")[0];
let area = document.getElementById("area");
let nickname = document.getElementsByClassName("nickname-input")[0];
let img = document.getElementsByClassName("file-box")[0];

let okButton = document.getElementsByClassName("okButton")[0];

okButton.addEventListener("click", function(){
    var option = area.options[area.selectedIndex];

    let check_1st = firstCheck(id.value, pw.value, nickname.value);
    let check_2nd = secondCheck(option.value, img.files[0]);
    if(check_1st && check_2nd){
        postInfo(id.value, pw.value, option.value, nickname.value, img.files[0]);
    }
})

function handleOnInput(e)  {
    e.value = e.value.replace(/[^A-Za-z0-9]+$/gi, '')
}

function firstCheck(idValue, pwValue, nicknameValue){
    if(idValue == "" || pwValue == "" || nicknameValue == ""){
        alert("빈칸을 모두 채워주세요.");
        return false;
    }else if(idValue.length<8 || pwValue.length<8){
        alert("아이디와 비밀번호는 8자 이상이어야합니다.");
        return false;
    }else{
        return true;
    }
}

function secondCheck(areaValue, imgValue){
    if(areaValue == "NONE"){
        alert("활동 지역을 선택해주세요.");
        return false;
    }

    if(imgValue == undefined){
        alert("프로필 사진을 선택해주세요.");
        return false;
    }
    return true;
}


function postInfo(id, pw, area, nickname, img){
    let formData = new FormData();
    formData.append("username", id);
    formData.append("password", pw);
    formData.append("activityArea", area);
    formData.append("nickname", nickname);
    formData.append("profileImage", img);

    fetch(url+"/members", {
    method: 'POST',
    headers: {
        //'Content-Type': 'multipart/form-data',
    },
    body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        alert(data.message);
        
    })
    .catch(error => {
        console.error('Error:', error);
    });
}