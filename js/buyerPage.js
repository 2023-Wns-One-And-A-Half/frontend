let url = 'http://3.39.230.180:8080';

let productId = sessionStorage.getItem("product");
let cookie = localStorage.getItem("jsessionid");

/* 채팅 페이지로 이동 */
let chatButton = document.getElementsByClassName("chatButton")[0];
chatButton.addEventListener("click", function(){
    window.open('./chat.html', '_self');
})


/* 게시글 정보 불러오기 */
let sellerName = document.getElementsByClassName("seller-name")[0];
let title = document.getElementsByClassName("title")[0];
let price = document.getElementsByClassName("price")[0];
let viewCount = document.getElementsByClassName("view-count")[0];
let heartCount = document.getElementsByClassName("heart-count")[0];
let post = document.getElementsByClassName("post-content")[0];
function getInfo(productId){
    fetch(url + "/products/"+productId, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            //'JSESSIONID': cookie,
        },
    })
    .then(response => response.json())
    .then(data => {
        sellerName.innerHTML = data.sellerInfo.nickname;
        title.innerHTML = data.name;
        price.innerHTML = data.price+" 원";
        viewCount.innerHTML = "조회 "+data.viewCount;
        heartCount.innerHTML = "관심 "+data.interestedCount;
        post.innerHTML = data.description;
        console.log(data);
    })
    .catch(error => {
        console.error('Error fetching check Seller:', error);
    });
}

/* 페이지 새로고침/새 창 띄울 때마다 로드 */
getInfo(productId);


/* 구매 신청 */
let buyButton = document.getElementsByClassName("buyButton")[0];
buyButton.addEventListener("click", function(){
    let user = localStorage.getItem("user");
    let id = localStorage.getItem("id");
    if(user == null){
        alert("로그인 후 가능합니다.");
    }else if(user == "admin" && id == null){
        alert("관리자는 구매신청 할 수 없습니다.");
    }else{
        viewPopup();
    }
});

function viewPopup(){
    if(confirm("구매신청 하시겠습니까?")){
        alert("신청되었습니다.");
    }
}


/* 댓글 작성 */
var sendContent = document.getElementById("send-content");
let sendButton = document.getElementsByClassName("send-icon")[0];
sendButton.addEventListener("click", function(){
    // 입력의 앞 뒤 공백 제거
    while(sendContent.value.startsWith(" ")){
        sendContent.value = sendContent.value.substring(1);
    }
    while(sendContent.value.endsWith(" ")){
        sendContent.value = sendContent.value.substring(0, sendContent.value.length-1);
    }

    if(sendContent.value == ""){
        alert("댓글을 입력해주세요.");
    }else{
        sendComment(sendContent.value);
        sendContent.value = "";
    }
})


/* 댓글 작성 시 엔터키 입력 인식 */
sendContent.addEventListener("keyup", function (event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        sendButton.click();
    }
});


/* 서버에 작성한 댓글 전송 */
function sendComment(comment){
    const data = {
        "productId": productId,
        "content": comment,
    }
    fetch(url+"/comments",{
    method: 'POST',
    credentials : 'include',
    headers: {
        'Content-Type': 'application/json',
        'JSESSIONID' : cookie,
    },
    body: JSON.stringify(data),
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


/* 게시글에 달린 댓글 조회 */
function getComment(){
    fetch(url+"/comments?productId="+productId, {
        method: 'GET',
        credentials : 'include',
        headers: {
          'Content-Type': 'application/json',
          'JSESSIONID' : cookie,
        },
    }).then(response => response.json())
    .then(data => {
        for(let i=0; i<data.length; i++){
            console.log(data[i]);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

/* 페이지 새로고침/새 창 띄울 때마다 로드 */
getComment();


/* 내 관심상품 조회, 이 상품이 관심상품인지 비교 */
let noHeart = document.getElementById("noHeart");
let yesHeart = document.getElementById("yesHeart");
function isHeart(){
    fetch(url+"/interest-products/my", {
        method: 'GET',
        credentials : 'include',
        headers: {
          'Content-Type': 'application/json',
          'JSESSIONID' : cookie,
        },
    }).then(response => response.json())
    .then(data => {
        if(data.length == 0){
            noHeart.style.display = 'block';
        }else{
            for(let i=0; i<data.length; i++){
                if(productId == data[i].id){
                    yesHeart.style.display = 'block';
                }else{
                    noHeart.style.display = 'block';
                }
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

/* 페이지 새로고침/새 창 띄울 때마다 로드 */
//로그인 하지 않았거나 관리자인 경우 하트 아이콘 숨김
if(localStorage.getItem("user")!=null){
    isHeart();
}


/* 관심상품 등록 */
noHeart.addEventListener("click", function(){
    addHeart(productId);
})
function addHeart(productId){
    const data = {
        "productId": productId,
    }
    fetch(url+"/interest-products", {
        method: 'POST',
        credentials : 'include',
        headers: {
          'Content-Type': 'application/json',
          'JSESSIONID' : cookie,
        },
        body: JSON.stringify(data),
    })
    .then(data => {
        console.log(data);
        noHeart.style.display = 'none';
        yesHeart.style.display = 'block';
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


/* 관심상품 삭제 */
yesHeart.addEventListener("click", function(){
    deleteHeart(productId);
})
function deleteHeart(productId){
    const data = {
        "productId": productId,
    }
    fetch(url+"/interest-products", {
        method: 'DELETE',
        credentials : 'include',
        headers: {
          'Content-Type': 'application/json',
          'JSESSIONID' : cookie,
        },
        body: JSON.stringify(data),
    })
    .then(data => {
        console.log(data);
        noHeart.style.display = 'block';
        yesHeart.style.display = 'none';
    })
    .catch(error => {
        console.error('Error:', error);
    });
}