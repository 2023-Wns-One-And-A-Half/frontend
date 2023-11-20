let url = 'http://3.39.230.180:8080';

let mypageButton = document.getElementsByClassName("goto-mypage")[0];

let loginOrsignup = document.getElementsByClassName("login-or-signup")[0];
let logout = document.getElementsByClassName("logout")[0];
let loginButton = document.getElementById("loginButton");
let logoutButton = document.getElementById("logoutButton");
let signupButton = document.getElementById("signupButton");
let cookie = localStorage.getItem("jsessionid");

let uploadButton = document.getElementsByClassName("goto-upload")[0];
let addKeywordButton = document.getElementsByClassName("keyword-addButton")[0];
let addKeywordBack = document.getElementsByClassName("addButton-background")[0];
let keywordList = document.getElementsByClassName("keyword-list")[0];

let username = document.getElementsByClassName("nickname")[0];
let userarea = document.getElementsByClassName("userarea")[0];
let userimg = document.getElementsByClassName("profile-img")[0];

if(cookie == null){
    console.log("로그아웃 상태");
    loginOrsignup.style.display = 'block';
    logout.style.display = 'none';
    
}else{
    console.log("로그인 상태");
    loginOrsignup.style.display = 'none';
    logout.style.display = 'block';
}


/* 페이지 이동 */
mypageButton.addEventListener("click", function(){
    if(cookie!=null){
        window.open('./userPage.html', '_self');
    }else{
        alert("로그인 후 확인할 수 있습니다.");
    }
})

loginButton.addEventListener("click", function(){
    window.open('./login.html', '_self');
})

logoutButton.addEventListener("click", function(){
    alert("로그아웃 되었습니다.");
    localStorage.removeItem("jsessionid");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    window.open('./main.html', '_self');
})

signupButton.addEventListener("click", function(){
    window.open('./signup.html', '_self');
})

uploadButton.addEventListener("click", function(){
    if(cookie!=null){
        window.open('./upload.html', '_self');
    }else{
        alert("로그인 후 등록할 수 있습니다.");
    }
})


/* 서버로부터 로그인 정보 불러오기 */
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
            viewInfo(data.nickname, activityArea, profileURL);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


/* 새로고침/창 띄울 때마다 정보 가져옴 */
getInfo();


/* 메인페이지에 로그인 유저 정보 띄우기 */
function viewInfo(nickname, activityArea, profileURL){
    if(localStorage.getItem("user")==null){
        username.innerHTML = "admin";
    }else{
        username.innerHTML = nickname;
        userarea.innerHTML = "활동지역 : "+activityArea;
        userimg.innerHTML = "<img id=\"profile-img\" src=\""+profileURL+"\"/>";
        addKeywordBack.style.display = 'flex';
        getKeyword(cookie);
    }
}


/* 키워드 추가 */
addKeywordButton.addEventListener("click", function(){
    if(keywordList.childElementCount<9){
        let keyword = prompt("추가할 키워드를 입력해주세요");
        if(keyword == null){
            alert("키워드 추가가 취소되었습니다.");
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
                    postKeyword(keyword);
                }
            }
        }
    }else{
        alert("키워드는 최대 9개까지 작성 가능합니다.");
    }
})
 

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
        if(data.status == 409){
            alert("중복된 키워드가 존재합니다.");
        }else{
            window.open('./main.html', '_self');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


/* 내 키워드 조회하고 html에 적용하기 */
function getKeyword(cookie){
    fetch(url+"/keywords/my", {
        method: 'GET',
        credentials : 'include',
        headers: {
          'Content-Type': 'application/json',
          'JSESSIONID' : cookie,
        },
      }).then(response => response.json())
        .then(data => {
            let html = "";
            for(let i=0; i<data.length; i++){
                html += "<div class=\"keyword\" id=\"keyword"+data[i].id+"\">"+data[i].content+"</div>\n";
            }
            keywordList.innerHTML = html;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


/* 상품 보여주기 및 검색 */
// 초기 페이지 로드 시 전체 상품을 보여주는 함수
function showAllProducts() {
    fetchProducts(); // 기본적으로 페이지 로드 시 모든 상품을 보여줌
}

// 검색 버튼 클릭 시 검색 수행
document.querySelector('.search-icon').addEventListener('click', searchProducts);

// 검색어에 따른 상품 보여주는 함수
function searchProducts() {
    let area = document.getElementById('area').value;
    let word = document.querySelector('.search-word').value;
    let minPrice = document.querySelector('.price .min').value;
    let maxPrice = document.querySelector('.price .max').value;

    let queryParams = new URLSearchParams({
        page: 0,
        size: 30,
        name: word,
        activityArea: area,
        minPrice: minPrice,
        maxPrice: maxPrice
    });

    let detailUrl = `/products?${queryParams}`;

    fetchProducts(detailUrl);
}

// 상품을 가져와 화면에 보여주는 함수
function fetchProducts(detailUrl = "/products") {
    fetch(url + detailUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
            //'Content-Type': 'application/json',
            //'JSESSIONID': cookie,
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        viewProducts(data);
    })
    .catch(error => {
        console.error('Error fetching products:', error);
    });
}

// 상품을 화면에 보여주는 함수
function viewProducts(products) {
    let productsList = document.querySelector('.products-list');
    productsList.innerHTML = '';

    products.content.forEach(product => {
        let productSet = makeProductSet(product);
        productsList.appendChild(productSet);
    });
}

// 초기 페이지 로드 시 전체 상품 보여줌
showAllProducts();

/* 상품 set 만드는 함수*/
function makeProductSet(product){
    // productSet 생성
    let productSet = document.createElement('div');
    productSet.classList.add('productSet');
    
    // productSet을 생성할 때 클릭시 페이지 이동 이벤트를 함께 추가
    productSet.addEventListener("click", async function(){
        sessionStorage.setItem("product", product.id);
        if(cookie!=null){
            let isSellerCheck = await isSeller(product.id);
            if(isSellerCheck){
                window.open('./sellerPage.html', '_self');
            }else{
                window.open('./buyerPage.html', '_self');
            }
        }else{
            window.open('./buyerPage.html', '_self');
        }
    })

    // product-img 생성
    let productImg = document.createElement('div');
    productImg.classList.add('product-img');
    // 만약 이미지가 있다면, 첫 번째 이미지를 설정
    if (product.productImageNames && product.productImageNames.length > 0) {
        let imageURL = 'https://d1npdfz46uvcun.cloudfront.net/'+product.productImageNames[0];
        productImg.style.backgroundImage = "url("+imageURL+")";
        productImg.style.backgroundSize = "cover";
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