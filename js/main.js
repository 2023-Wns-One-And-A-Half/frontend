let url = 'http://3.39.230.180:8080';

let mypageButton = document.getElementsByClassName("goto-mypage")[0];
let loginButton = document.getElementById("loginButton");
let signupButton = document.getElementById("signupButton");
let uploadButton = document.getElementsByClassName("goto-upload")[0];


//페이지 이동
mypageButton.addEventListener("click", function(){
    window.open('./userPage.html', '_self');
})

loginButton.addEventListener("click", function(){
    window.open('./login.html', '_self');
})

signupButton.addEventListener("click", function(){
    window.open('./signup.html', '_self');
})

uploadButton.addEventListener("click", function(){
    window.open('./upload.html', '_self');
})



/* api get

function getInfo(){
fetch(url+"", {
  method: 'GET',
})
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
}
*/


/* api post

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
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
*/