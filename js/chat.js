let url = 'http://3.39.230.180:8080';

let productId = sessionStorage.getItem("product");
let cookie = localStorage.getItem("jsessionid");

let mainButton = document.getElementsByClassName("back-icon")[0];
mainButton.addEventListener("click", function(){
    history.go(-1);
})

