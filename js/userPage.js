let url = 'http://3.39.230.180:8080';

let cookie = localStorage.getItem("jsessionid");

/* 뒤로가기 화살표 동작 */
let mainButton = document.getElementsByClassName("back-icon")[0];
mainButton.addEventListener("click", function(){
    window.open('./main.html', '_self');
})

/* 키워드 편집 (추가 및 삭제) */
let keywordEditButton = document.getElementsByClassName("keyword-editButton")[0];
keywordEditButton.addEventListener("click", function(){
    let input = checkKeyword();
    let exist = false;
    let deleteId = "";

    if(input != null){
        let keywordList = document.querySelectorAll('.keyword');
        keywordList.forEach(keyword => {
            console.log(keyword.innerHTML);
            if(input == keyword.innerHTML){
                exist = true;
                deleteId = keyword.getAttribute('id');
            }
        });
    
        if(exist){
            alert("키워드 \'"+input+"\'를 삭제합니다.");
            deleteKeyword(deleteId);
        }else{
            let keywordList = document.getElementsByClassName("keyword-list")[0];
            if(keywordList.childElementCount<9){
                postKeyword(input);
            }else{
                alert("키워드는 최대 9개까지 작성 가능합니다.");
            }
        }
    }
})

/* 프로필 정보 보여주기 */
//서버로부터 로그인 정보 불러오기/
let username = document.getElementsByClassName("nickname")[0];
let userarea = document.getElementsByClassName("userarea")[0];
let userimg = document.getElementsByClassName("profile-img")[0];

function getInfo(){
    fetch(url+"/members/my", {
        method: 'GET',
        credentials : 'include',
        headers: {
            'Content-Type': 'application/json',
            'JSESSIONID' : cookie,
        },
    }).then(response => response.json())
    .then(data => {
        let profileURL = 'https://d1npdfz46uvcun.cloudfront.net/'+data.profileImageName;
        let activityArea = "";
        switch(data.activityArea){
            case "SEOUL":
                activityArea = "서울";
                break;
            case "INCHEON":
                activityArea = "인천";
                break;
            case "DAEJEON":
                activityArea = "대전";
                break;
            case "GWANGJU":
                activityArea = "광주";
                break;
            case "DAEGU":
                activityArea = "대구";
                break;
            case "BUSAN":
                activityArea = "부산";
                break;
            case "ULSAN":
                activityArea = "울산";
                break;
            default:
                activityArea = "미정";
        }
        /*
        console.log(data.id);
        console.log(data.nickname);
        console.log(profileURL);
        console.log(data.activityArea);
        console.log(data.black);
        */
        if(cookie!=null){
            viewInfo(data.nickname, activityArea, profileURL)
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
// 새로고침/창 띄울 때마다 정보 가져옴
getInfo();
// 마이페이지에 로그인 유저 정보 띄우기
function viewInfo(nickname, activityArea, profileURL){
    if(localStorage.getItem("user")==null){
        username.innerHTML = "admin";
    }else{
        username.innerHTML = nickname;
        userarea.innerHTML = "활동지역 : "+activityArea;
        userimg.innerHTML = "<img id=\"profile-img\" src=\""+profileURL+"\"/>";
    }
}

/* 관심키워드 보여줌 */
function getKeyword(){
    fetch(url+"/keywords/my", {
        method: 'GET',
        credentials : 'include',
        headers: {
            'Content-Type': 'application/json',
            'JSESSIONID' : cookie,
        },
    }).then(response => response.json())
    .then(data => {
        viewKeyword(data);
    })
    .catch(error => {
        console.error('Error fetching keywords:', error);
    });
}
// 새로고침/창 띄울 때마다 키워드 조회한 거 가져옴
getKeyword();
// 키워드 보여주기
function viewKeyword(keywords){
    let keywordList = document.querySelector('.keyword-list');
    // 기존에 있는 키워드 요소들을 모두 지우기
    keywordList.innerHTML = '';
    // 받아온 키워드 데이터를 이용하여 새로운 키워드 요소들 생성 및 추가
    keywords.forEach(keyword => {
        let keywordElement = document.createElement('div');
        keywordElement.classList.add('keyword');
        keywordElement.setAttribute('id', keyword.id);
        keywordElement.textContent = keyword.content;
        // 생성한 키워드 요소를 키워드 리스트에 추가
        keywordList.appendChild(keywordElement);
    });
}

/* 키워드 입력 및 양식에 맞는지 검사 */
function checkKeyword(){
    let keyword = prompt("키워드를 추가하거나 삭제할 수 있습니다.\n\
기존에 등록되어있던 키워드를 입력하면 해당 키워드가 삭제되고,\n\
기존에 없던 키워드를 새로 입력하면 키워드가 추가됩니다.");
    if(keyword == null){
        alert("키워드 편집이 취소되었습니다.");
    }else{
        while(keyword.startsWith(" ")){
            keyword = keyword.substring(1);
        }

        while(keyword.endsWith(" ")){
            keyword = keyword.substring(0, keyword.length-1);
        }
        
        if(keyword == ""){
            alert("키워드가 입력되지 않았습니다.");
        }else{
            keyword = keyword.replace(/(^ *)|( *$)/g, "").replace(/ +/g, "_");
            
            if(keyword.length>8){
                alert("키워드는 공백포함 8자 이내로 작성 가능합니다.");
            }else{
                return keyword;
            }
        }
    }
}

/* 서버에 추가할 키워드 보내기 */
function postKeyword(keyword){
    const data = {
        "content": keyword,
    }

    fetch(url+"/keywords",{
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
        window.open('./userPage.html', '_self');
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

/* 서버에 삭제할 키워드 보내기 */
function deleteKeyword(deleteId){
    fetch(url+"/keywords/"+deleteId, {
        method: 'DELETE',
        credentials : 'include',
        headers: {
            'Content-Type': 'application/json',
            'JSESSIONID' : cookie,
        },
    })
    .then(data => {
        console.log(data);
        alert("키워드가 삭제되었습니다.");
        window.open('./userPage.html', '_self');
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

/* 알람 보여줌 */
function getAlarm(){
    fetch(url+"/notifications/my", {
        method: 'GET',
        credentials : 'include',
        headers: {
            'Content-Type': 'application/json',
            'JSESSIONID' : cookie,
        },
    }).then(response => response.json())
    .then(data => {
        viewAlarm(data);
    })
    .catch(error => {
        console.error('Error fetching alarms:', error);
    });
}
// 새로고침/창 띄울 때마다 내 알림 가져옴
getAlarm();
// 키워드 보여주기
function viewAlarm(alarms){
    let alarmList = document.querySelector('.alarm-contents-list');
    alarmList.innerHTML = '';
    alarms.notifications.forEach(alarm => {
        let alarmElement = document.createElement('div');
        alarmElement.classList.add('alarm-content');
        alarmElement.textContent = alarm.content;

        // 만약 알림에 링크가 있다면, 링크를 추가
        if (alarm.linkedURI) {
            let link = document.createElement('a');
            link.href = alarm.linkedURI;
            link.appendChild(alarmElement);
            alarmList.appendChild(link);
        } else {// 알림에 링크가 없으면 그냥 추가
            alarmList.appendChild(alarmElement);
        }
    });
}

/* 관심 내역 보여줌 */
function getInterest(){
    fetch(url+"/interest-products/my", {
        method: 'GET',
        credentials : 'include',
        headers: {
            'Content-Type': 'application/json',
            'JSESSIONID' : cookie,
        },
    }).then(response => response.json())
    .then(data => {
        viewInterest(data);
    })
    .catch(error => {
        console.error('Error fetching interest-products:', error);
    });
}

getInterest();

function viewInterest(interests){
    let interestsProductsBox = document.querySelector('.interests-products');
    interestsProductsBox.innerHTML = '';
    interests.forEach(product => {
        let productSet = makeProductSet(product);
        interestsProductsBox.appendChild(productSet);
    });
}

/* 판매 내역 보여줌 */
function getSold(){
    fetch(url+"/trades/sold", {
        method: 'GET',
        credentials : 'include',
        headers: {
            //'Content-Type': 'application/json',
            'JSESSIONID' : cookie,
        },
    }).then(response => response.json())
    .then(data => {
        viewSold(data);
    })
    .catch(error => {
        console.error('Error fetching sold-products:', error);
    });
}

getSold();

function viewSold(solds){
    let saleProductsBox = document.querySelector('.sale-products');
    saleProductsBox.innerHTML = '';
    solds.forEach(product => {
        let productSet = makeProductSet(product);
        saleProductsBox.appendChild(productSet);
    });
}

/* 구매 내역 보여줌 */
function getBuy(){
    fetch(url+"/trades/purchased", {
        method: 'GET',
        credentials : 'include',
        headers: {
            //'Content-Type': 'application/json',
            'JSESSIONID' : cookie,
        },
    }).then(response => response.json())
    .then(data => {
        viewBuy(data);
    })
    .catch(error => {
        console.error('Error fetching buy-products:', error);
    });
}

getBuy();

function viewBuy(buys){
    let buyProductsBox = document.querySelector('.buy-products');
    buyProductsBox.innerHTML = '';
    buys.forEach(product => {
        let productSet = makeProductSet(product);
        buyProductsBox.appendChild(productSet);
    });
}


/* 상품 set 만드는 함수 - 각 내역 상품에 맞게 product 정보 배열만 넣어주면 됨 */
function makeProductSet(product){
    // productSet 생성
    let productSet = document.createElement('div');
    productSet.classList.add('productSet');

    // product-img 생성
    let productImg = document.createElement('div');
    productImg.classList.add('product-img');
    // 만약 이미지가 있다면, 첫 번째 이미지를 설정
    if (product.productImageNames && product.productImageNames.length > 0) {
        let imageURL = 'https://d1npdfz46uvcun.cloudfront.net/'+product.productImageNames[0];
        productImg.style.backgroundImage = "URL("+imageURL+")";
    }
    productSet.appendChild(productImg);

    // product-info 생성
    let productInfo = document.createElement('div');
    productInfo.classList.add('product-info');
    // 상품 이름 추가
    let productName = document.createElement('p');
    productName.classList.add('product-name');
    productName.textContent = product.name;
    productInfo.appendChild(productName);
    // 상품 가격추가
    let productPrice = document.createElement('p');
    productPrice.classList.add('product-price');
    productPrice.textContent = `${product.price} 원`;
    productInfo.appendChild(productPrice);

    productSet.appendChild(productInfo);

    return productSet;
}