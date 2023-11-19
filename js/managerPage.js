let url = 'http://3.39.230.180:8080';

let cookie = localStorage.getItem("jsessionid");

/* 뒤로가기 화살표 동작 */
let mainButton = document.getElementsByClassName("back-icon")[0];
mainButton.addEventListener("click", function(){
    window.open('./mainManager.html', '_self');
})

/* 유저 보여줌 */
function getUser(){
    fetch(url+"/admin/blacklists/not", {
        method: 'GET',
        credentials : 'include',
        headers: {
            'Content-Type': 'application/json',
            'JSESSIONID' : cookie,
        },
    }).then(response => response.json())
    .then(data => {
        viewUser(data);
    })
    .catch(error => {
        console.error('Error fetching not blackList:', error);
    });
}

getUser();

function viewUser(users) {
    let userContainer = document.querySelector('.users');
    userContainer.innerHTML = '';

    users.forEach(user => {
        let userElement = document.createElement('div');
        userElement.classList.add('user-element');

        // 체크박스 추가
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = user.id; // 유저 식별자를 value로 설정
        userElement.appendChild(checkbox);

        // 유저 정보 추가
        let userInfo = document.createElement('span');
        userInfo.textContent = user.nickname; // 또는 다른 필요한 정보를 표시
        userElement.appendChild(userInfo);

        userContainer.appendChild(userElement);
    });
}

/* 블랙리스트 유저 보여줌 */
function getBlackUser(){
    fetch(url+"/admin/blacklists", {
        method: 'GET',
        credentials : 'include',
        headers: {
            'Content-Type': 'application/json',
            'JSESSIONID' : cookie,
        },
    }).then(response => response.json())
    .then(data => {
        viewBlackUser(data);
    })
    .catch(error => {
        console.error('Error fetching blackList:', error);
    });
}

getBlackUser();

function viewBlackUser(blackUsers) {
    let blackListContainer = document.querySelector('.black-list');
    blackListContainer.innerHTML = '';

    blackUsers.forEach(blackUser => {
        let blackUserElement = document.createElement('div');
        blackUserElement.classList.add('black-user-element');
        blackUserElement.textContent = `Member ID: ${blackUser.memberId}, Created Date: ${blackUser.createdData}`;

        blackListContainer.appendChild(blackUserElement);
    });
}

