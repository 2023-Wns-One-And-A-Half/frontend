let url = 'http://3.39.230.180:8080';

// 뒤로가기 화살표 동작
let mainButton = document.getElementsByClassName("back-icon")[0];
mainButton.addEventListener("click", function(){
    window.open('./main.html', '_self');
})

// 사진 업로드 시 사진 미리보기
document.querySelector('.file-box').addEventListener('change', function(event) {
    previewImages(event);
});
  
function previewImages(event) {
    let previewContainer = document.getElementById('image-preview-container');
    previewContainer.innerHTML = ''; // 컨테이너 내의 기존 콘텐츠를 지움

    let files = event.target.files;  // 선택한 파일들
    for (let i = 0; i < files.length; i++) {
        let file = files[i];

        if (file.type.match('image.*')) {
            let reader = new FileReader();
            
            reader.onload = function (e) {// 파일 읽기 완료했을 때의 이벤트 핸들러
                var image = document.createElement('img');
                image.src = e.target.result;
                image.className = 'preview-image';
                previewContainer.appendChild(image);
            };
            reader.readAsDataURL(file);
        }
    }
}

// 업로드 버튼 클릭 시 서버에 데이터 보내기
let cookie = localStorage.getItem("jsessionid");

let uploadButton = document.getElementById("upload-button");
uploadButton.addEventListener("click", function () {
    let name = document.getElementById("product-name").value;
    let price = document.getElementById("product-price").value;
    let area = document.getElementById("area").value;
    let description = document.getElementById("product-description").value;
    let imageInput = document.getElementById("product-images");
    
    let productImages = imageInput.files;
    console.log(name, price, area, description, productImages);

    if (check(name, price)) {
        postInfo(name, price, area, description, productImages);
    }
});

function check(name, price){
    // 상품 제목과 가격이 비어있을 경우 경고 팝업 표시
    if(name.trim() == "" || price.trim == "" ){
        alert("상품 제목과 가격을 작성해주세요.");
        return false;
    }else{
        return true;
    }
}

function postInfo(name, price, area, description, productImages){
    let formData = new FormData();
    formData.append("name", name);
    //formData.append("area", area);
    formData.append("description", description);
    formData.append("price", price);
    
    // productImages가 비어있을 경우 기본 초기 사진 추가
    if (productImages.length === 0) {
        let defaultImageFile = new File(["defaultProductImg.png"], "./assets/defaultProductImg.png", { type: "image/png" });
        formData.append("productImages", defaultImageFile);
    } else {
        for (let i = 0; i < productImages.length; i++) {
            formData.append("productImages", productImages[i]);
        }
    }
    
    fetch(url+"/products", {
    method: 'POST',
    credentials: 'include',
    headers: {
        //'Content-Type': 'multipart/form-data',
        'JSESSIONID' : cookie,
    },
    body: formData,
    })
    .then(data => {
        console.log(data);
        alert("상품이 등록되었습니다.");
        window.open('./main.html', '_self');
    })
    .catch(error => {
        console.error('Error:', error);
    });
}