let news = [];
//async와 await은 세트임
const getLatesNews = async () => {
  let url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=10`
  );
  //URL이 api 분석해줌

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

getLatesNews();

//렌더하기
function render(){
    
    let resultHTML = '';
    for(let i=0; i<news.length; i++){
        resultHTML += `<div id="news-board" class="row" onclick="window.open('${news[i].link}')">
        <div class="col-lg-4">
        <img
          class="news-img-size"
          src="${news[i].media}"
        />
      </div>
      <div class="col-lg-8">
        <h2>${news[i].title}</h2>
        <p>${news[i].excerpt}</p>
        <div class="news-author" style="float:left">${news[i].author}</div>
        <div class="news-author"> &nbsp;${news[i].published_date}</div>
      </div>
      </div>`;
    }
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

