let url = 'http://3.39.230.180:8080';

let productId = sessionStorage.getItem("product");
let cookie = localStorage.getItem("jsessionid");

/* 게시글 정보 불러오기 */
/* 상품 및 판매자 정보 보이기 */
let sellerName = document.getElementsByClassName("seller-name")[0];
let title = document.getElementsByClassName("title")[0];
let price = document.getElementsByClassName("price")[0];
let viewCount = document.getElementsByClassName("view-count")[0];
let heartCount = document.getElementsByClassName("heart-count")[0];
let post = document.getElementsByClassName("post-content")[0];

let postImgContainer = document.getElementById("postImageContainer");
let sellerImgContainer = document.getElementById("sellerImageContainer");
let productImages = []; // 여러 상품 이미지 경로를 저장할 배열
let sellerImage = ""; // 판매자 이미지 경로를 저장할 변수

let imgURL = 'https://d1npdfz46uvcun.cloudfront.net/';

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
        
        sellerImage = data.sellerInfo.profileImageName;
        updateSellerImage();
        productImages = data.productImageNames;
        updatePostImages();

        console.log(data);
    })
    .catch(error => {
        console.error('Error fetching check Seller:', error);
    });
}

function updateSellerImage() {
    sellerImgContainer.innerHTML = "";
  
    let imgElement = document.createElement("img");
    imgElement.classList.add("sellerimg")
    imgElement.src = imgURL + sellerImage; // 이미지 경로를 조합합니다.
    imgElement.alt = "Seller Image";
    sellerImgContainer.appendChild(imgElement);
}

let currentImageIndex = 0; // 좌우 화살표 클릭 시 이미지 인덱스
  
function updatePostImages() {
    postImgContainer.innerHTML = "";

    if (productImages && productImages.length > 0) {
        let imgElement = document.createElement("img");
        imgElement.classList.add("productimg");
        imgElement.src = imgURL + productImages[currentImageIndex];
        imgElement.alt = `Product Image ${currentImageIndex + 1}`;
        postImgContainer.appendChild(imgElement);
    }
}

function changeImage(isNext) {
    if (isNext) {
        currentImageIndex = (currentImageIndex + 1) % productImages.length;
    } else {
        currentImageIndex = (currentImageIndex - 1 + productImages.length) % productImages.length;
    }

    updatePostImages();
}

document.querySelector(".prevImg-icon").addEventListener("click", function () {
    changeImage(false);
});

document.querySelector(".nextImg-icon").addEventListener("click", function () {
    changeImage(true);
});

// 페이지 로드 시 첫 번째 이미지 표시
updatePostImages();

//페이지 새로고침/새 창 띄울 때마다 로드
getInfo(productId);



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

/* 댓글 작성 -> 서버에 작성한 댓글 전송 */
function sendComment(comment) {
    const data = {
        "productId": productId,
        "content": comment,
    }

    fetch(url + "/comments", {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'JSESSIONID': cookie,
        },
        body: JSON.stringify(data),
    })
        .then(data => {
            console.log(data);
            getComment();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

/* 댓글 보내고 불러오고 보여주는 모든것 */

// 페이지 로드 시 댓글 불러오기
getComment();

// 댓글 조회 후 댓글 수 업데이트
function getComment() {
    fetch(url + "/comments?productId=" + productId, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'JSESSIONID': cookie,
        },
    }).then(response => response.json())
        .then(data => {
            let commentBox = document.querySelector(".comment-box");
            let commentCountElement = document.querySelector(".comment-count");
            commentBox.innerHTML = "";
            commentCountElement.textContent = `댓글 ${data.length}`;
            commentBox.appendChild(commentCountElement);
            
            for (let i = 0; i < data.length; i++) {
                let commentElement = createCommentElement(data[i]);
                commentBox.appendChild(commentElement);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function padZero(num) {
    return num < 10 ? `0${num}` : num;
}
function createCommentElement(commentData) {
    let itemElement = document.createElement("div");
    itemElement.classList.add("item--Qws");
  
    let userBoxElement = document.createElement("div");
    userBoxElement.classList.add("user-box");
  
    let userImgElement = document.createElement("div");
    userImgElement.classList.add("user-img");
    // 이미지 불러오기
    let userImg = document.createElement("img");
    userImg.classList.add("userimg");
    userImg.src = imgURL + commentData.writerInfo.profileImageName;
    userImg.alt = "User Image";
    userImgElement.appendChild(userImg);
  
    let userNameElement = document.createElement("p");
    userNameElement.classList.add("user-name");
    userNameElement.textContent = commentData.writerInfo.nickname;
  
    userBoxElement.appendChild(userImgElement);
    userBoxElement.appendChild(userNameElement);
  
    let userCommentBoxElement = document.createElement("div");
    userCommentBoxElement.classList.add("userComment-box");
  
    let userCommentElement = document.createElement("p");
    userCommentElement.classList.add("userComment");
    userCommentElement.textContent = commentData.content;
  
    let userCommentTimeElement = document.createElement("p");
    userCommentTimeElement.classList.add("userComment-time");
    let date = new Date(commentData.createdDate);
    let formattedDate = `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
    userCommentTimeElement.textContent = formattedDate
    
  
    userCommentBoxElement.appendChild(userCommentElement);
    userCommentBoxElement.appendChild(userCommentTimeElement);
  
    itemElement.appendChild(userBoxElement);
    itemElement.appendChild(userCommentBoxElement);
  
    return itemElement;
}

/* 페이지 새로고침/새 창 띄울 때마다 로드 */
getComment();

/* 구매 신청 목록 팝업 */
let popup = document.getElementsByClassName("popup")[0];
let sellButton = document.getElementsByClassName("sellButton")[0];
let closeButton = document.getElementsByClassName("closeButton")[0];
sellButton.addEventListener("click", function(){
    popup.style.display = 'block';
})
closeButton.addEventListener("click", function(){
    popup.style.display = 'none';
})