let chatButton = document.getElementsByClassName("chatButton")[0];
let buyButton = document.getElementsByClassName("buyButton")[0];

chatButton.addEventListener("click", function(){
    window.open('./chat.html');
})
//채팅 페이지로 이동

buyButton.addEventListener("click", function(){
    viewPopup();
});

function viewPopup(){
    confirm("구매신청 하시겠습니까?");
}
