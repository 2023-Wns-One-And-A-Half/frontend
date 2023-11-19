let url = 'http://3.39.230.180:8080';

let mypageButton = document.getElementsByClassName("goto-mypage")[0];

let logout = document.getElementsByClassName("logout")[0];
let logoutButton = document.getElementById("logoutButton");
let cookie = localStorage.getItem("jsessionid");

/* 페이지 이동 */
mypageButton.addEventListener("click", function(){
    window.open('./managerPage.html', '_self');
})

logoutButton.addEventListener("click", function(){
    alert("로그아웃 되었습니다.");
    localStorage.removeItem("jsessionid");
    localStorage.removeItem("user");
    window.open('./main.html', '_self');
})

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
        let check = localStorage.getItem("user") == data.sellerInfo.nickname;
        return check;
    })
    .catch(error => {
        console.error('Error fetching check Seller:', error);
    });

    return check;
}