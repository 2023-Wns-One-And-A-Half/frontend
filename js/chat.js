let url = 'http://3.39.230.180:8080';

let productId = sessionStorage.getItem("product");
let cookie = localStorage.getItem("jsessionid");

let mainButton = document.getElementsByClassName("back-icon")[0];
mainButton.addEventListener("click", function(){
    history.go(-1);
})

function getProductInfo() {
    fetch(url + "/products/" + productId, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'JSESSIONID': cookie,
        },
    })
    .then(response => response.json())
    .then(data => {
        let chatTitle = document.querySelector(".chat-title");
        let productPrice = document.querySelector(".product-price");
        
        chatTitle.textContent = data.name;
        productPrice.textContent = data.price + " 원";

        let isSeller = (localStorage.getItem("userId") == data.sellerInfo.id);
        if(!isSeller){
            receiverId = data.sellerInfo.id;
        }
    })
    .catch(error => {
        console.error('Error getting product info:', error);
    });
}
getProductInfo();


/* 채팅의 모든것 */
let sendContent = document.querySelector(".send-box input");
let sendButton = document.querySelector(".send-icon");
let contentBox = document.querySelector(".content-box");

let chatRoomId; // 채팅 룸 ID를 저장할 변수
let receiverId; // 수신자 ID를 저장할 변수

// 메시지를 보내는 함수
function sendMessage() {
    let messageContent = sendContent.value.trim();
    
    if (messageContent !== "") {
        sendContent.value = "";

        // 메시지를 서버로 전송
        fetch(url + "/chats/" + chatRoomId + "/messages", {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'JSESSIONID': cookie,
            },
            body: JSON.stringify({
                "receiverId": receiverId,
                "content": messageContent,
            }),
        })
        .then(data => {
            console.log(data);
            // 메시지가 성공적으로 전송되었을 때, UI 업데이트
            displayRightMessage(messageContent);
        })
        .catch(error => {
            console.error('메시지 전송 중 에러 발생:', error);
        });
    }
}

// 내가 보낸 메시지를 UI에 표시하는 함수
function displayRightMessage(content) {
    let myMessageElement = document.createElement("div");
    myMessageElement.classList.add("myChat");
    myMessageElement.textContent = content;
    contentBox.appendChild(myMessageElement);
}

// 내가 받은 메시지를 UI에 표시하는 함수
function displayLeftMessage(data) {
    let sellerChatBox = document.createElement("div");
    sellerChatBox.classList.add("sellerChat-box");

    let sellerName = document.createElement("div");
    sellerName.classList.add("seller-name");
    sellerName.textContent = data.senderInfo.nickname;
    let sellerMessageElement = document.createElement("div");
    sellerMessageElement.classList.add("sellerChat");
    sellerMessageElement.textContent = data.content;

    sellerChatBox.appendChild(sellerName);
    sellerChatBox.appendChild(sellerMessageElement);

    contentBox.appendChild(sellerChatBox);
}

// "보내기" 버튼 또는 엔터 키를 눌렀을 때 sendMessage 함수 호출
sendButton.addEventListener("click", sendMessage);
sendContent.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        sendMessage();
    }
});

// 채팅 룸에서의 메시지 불러오기
let clientId;

async function loadChatMessages() {
    let isSellerCheck = await isSeller(productId);
    /*if(isSellerCheck){
        clientId = document.querySelectorAll(".popupchatButton");
        popupchatButton.forEach(button => {
            button.addEventListener("click", function(){
                loadChatMessages(this.id);
            })
        })
    }else {*/
        clientId = localStorage.getItem("userId");
    //}
    console.log(clientId);

    fetch(url + "/chats?productId=" + productId + "&clientId=" + clientId, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'JSESSIONID': cookie,
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        chatRoomId = data.id;
        
        let chatMessages = data.chatMessages;
        if (chatMessages.length > 0) {
            chatMessages.forEach(message => {
                if (isSellerCheck && message.senderInfo.id === clientId) {
                    // 나는 판매자인데 고객이 보낸 메시지일 경우 -> 받는거임
                    displayLeftMessage(message);
                } else if (isSellerCheck && message.senderInfo.id !== clientId) {
                    // 나는 판매자인데 내가 보낸 메시지일 경우 -> 보낸거임
                    displayRightMessage(message.content);
                } else if (!isSellerCheck && message.senderInfo.id === clientId) {
                    // 나는 구매자인데, 고객이 보낸 메시지일 경우 -> 보낸거임
                    displayRightMessage(message.content);
                } else {
                    displayLeftMessage(message);
                }
            });
        }
        
    })
    .catch(error => {
        console.error('채팅 메시지 불러오기 중 에러 발생:', error);
    });
}

// 페이지 로드 시 최초 채팅 메시지 불러오기
loadChatMessages();

/* 클릭한 상품의 판매자와 로그인 유저가 같은지 확인 */
async function isSeller(productId){
    let check = await fetch(url + "/products/"+productId, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            //'JSESSIONID': cookie,
        },
    })
    .then(response => response.json())
    .then(data => {
        let check = localStorage.getItem("userId") == data.sellerInfo.id;
        return check;
    })
    .catch(error => {
        console.error('Error fetching check Seller:', error);
    });

    return check;
}