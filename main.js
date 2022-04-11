let news = [];

//토픽 선택 받아오기
const menus = document.querySelectorAll(".menus button");
const m_menus = document.querySelectorAll(".m-menus a");

menus.forEach((menu) => menu.addEventListener("click",(event)=>getNewsByTopic(event)));
m_menus.forEach((menu) => menu.addEventListener("click",(event)=>getNewsByTopic(event)));


//검색 버튼,인풋창 가져오기
let submit = document.getElementById("search-submit");
let searches = document.getElementById("search-area");


const headerSet = async (url) =>{
  let header = new Headers({
    "x-api-key": "tipwF8XKqzTe30KcJUQItYCw7ShucEbWaCLOQkODmfE",
  });

  let response = await fetch(url, { headers: header });
  //ajax, http, fetch, axios 등으로 보낼 수 있음
  //서버를 통신하는 애는 기다려줘야함
  let data = await response.json();
  //json은 서버통신에서 자주쓰이는 타입, 객체랑 똑같은데 text타입
  news = data.articles;

  console.log(news);
  render();
};

//async와 await은 세트임
//기본 화면
const getLatesNews = async () => {  
  //URL이 api 분석해줌
  let url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=10`
  );
  headerSet(url);
};

//뉴스 토픽설정
const getNewsByTopic = async (event) =>{
  let topic = event.target.textContent.toLowerCase();
  let url = new URL(
     `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`
     );
  headerSet(url);
}

//검색하기
const searchNews = async() => {
let keyword = searches.value;
let url = new URL(
  `https://api.newscatcherapi.com/v2/search?q=${keyword}&countries=KR&page_size=10`
  );
headerSet(url);
}

//렌더하기
const render = () => {
    
    let resultHTML = '';
  //news는 어레이고 이 어레이는 각각의 아이템을 item 변수로 바꿔올것
  //item 변수 각각의 media title 등등
    resultHTML = news.map(item =>{
      return `<div id="news-board" class="row" onclick="window.open('${item.link}')">
      <div class="col-lg-4">
      <img class="news-img-size" src="${item.media}"/>
    </div>
    <div class="col-lg-8">
      <h2>${item.title}</h2>
      <p class="news-text">${item.summary}</p>
      <div class="news-author" style="float:left">${item.author==null?item.rights:item.author}</div>
      <div class="news-author"> &nbsp; * &nbsp;${moment(item.published_date).fromNow()}</div>
    </div>
    </div>`;
    }).join('');

    document.getElementById("news-thread").innerHTML = resultHTML;
}



//햄버거 바 열기
function openNav() {
  document.getElementById("mySidenav").style.width = "200px";
}

//햄버거 바 닫기
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

//검색창 열었다 닫았다
function openSCH(){
    let con = document.getElementById("search-display");
    
    if(con.style.display == 'block'){
        con.style.display = 'none';
    }else{
        con.style.display = 'block';
    }
}

/*함수를function이 아닌 const로 정의했기 때문에 
함수가 정의되기 전에 호출하는 호이스팅 문제가 일어남
그래서 클릭 이벤트를 맨 아래에서 실행하는 것*/
submit.addEventListener("click",searchNews);
searches.addEventListener("keypress",(e)=>{
  if(e.code === 'Enter'){
    searchNews();
    searches.value = '';
  }
})

getLatesNews();

