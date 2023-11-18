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

