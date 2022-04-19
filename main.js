let news = [];

let page = 1;
let total_pages = 0;

//토픽 선택 받아오기
const menus = document.querySelectorAll(".menus button");
const m_menus = document.querySelectorAll(".m-menus a");

menus.forEach((menu) => menu.addEventListener("click",(event)=>getNewsByTopic(event)));
m_menus.forEach((menu) => menu.addEventListener("click",(event)=>getNewsByTopic(event)));


//검색 버튼,인풋창 가져오기
let submit = document.getElementById("search-submit");
let searches = document.getElementById("search-area");

//url 전역변수 지정
let url;



//반복되는 기본 api호출 세팅 함수
const getNews = async () =>{
  try{
    let header = new Headers({
      "x-api-key": "tipwF8XKqzTe30KcJUQItYCw7ShucEbWaCLOQkODmfE",
    });
    
    //url에 페이지값을 추가하는 작업
    url.searchParams.set('page',page);
    let response = await fetch(url, { headers: header });
    //ajax, http, fetch, axios 등으로 보낼 수 있음
    //서버를 통신하는 애는 기다려줘야함
    let data = await response.json();
    //json은 서버통신에서 자주쓰이는 타입, 객체랑 똑같은데 text타입

    //API응답에서 에러가 났는지 확인할때
    if(response.status == 200){
      //데이터 검색시 결과값이 없을 때 에러핸들링
      if(data.total_hits == 0){
        throw new Error("검색된 결과가 없습니다.");
      }
      console.log(data); 
      news = data.articles;
      total_pages = data.total_pages;
      page = data.page;
      console.log(news);
      
      render();
      pagination();

    }else{
      throw new Error(data.message)
    }

  }catch(error){
      console.log("에러는",error.message);
      errorRender(error.message);
    }

};


 

//async와 await은 세트임
//기본 화면
const getLatesNews = async () => {  
  //URL이 api 분석해줌
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=10`
  );
  getNews();
};

//뉴스 토픽설정
const getNewsByTopic = async (event) =>{
  let topic = event.target.textContent.toLowerCase();
  url = new URL(
     `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`
     );
  
  page = 1; //다른 카테고리로 옮길시 1페이지로 시작
  getNews();
}

//검색하기
const searchNews = async() => {
  let keyword = searches.value;
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${keyword}&countries=KR&page_size=10`
    );
  
  page = 1;
  getNews();
}



//화면을 보여주는 렌더함수
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

//에러 렌더함수
const errorRender = (message) =>{
  let errorHTML = `<div class="alert alert-danger text-center" role="alert">
  ${message}</div>`;
  document.getElementById("news-thread").innerHTML = errorHTML;
  
}



//페이지 네이션 함수
const pagination = () => {


  let paginationHTML = '';
  //total_page 총 페이지 수
  //page 내가 지금 몇페이지에 있는지
  //page group 내가 어떤 페이지 그룹에 있는지
  let pageGroup = Math.ceil(page/5); //다섯페이지씩 보여줄것
  //last page 마지막페이지가 뭔지
  let last = pageGroup*5;
  //first page 첫번째페이지가 뭔지
  let first = last-4;
  //first~last 페이지 프린트

  
  //total page 3개 일경우, 3개의 페이지만 프린트 하는법 last,first
  if(total_pages <= 5){
    last = total_pages;
    first = 1;
  }

  //마지막페이지가 5개로 안떨어지는 경우 마지막페이지에 맞춰 5개 보여주기
  if(last > total_pages){
    last = total_pages;
  }

  // <,> 이 화살표들은 한 그룹씩 띄어넘는 용도
  // <<,>> 이 화살표들은 맨 처음 맨끝으로 가는 용도

  //내가 그룹1 일때 << < 이 버튼이 없다
  if(pageGroup==1){
    paginationHTML ='';
  }else{
      //이전
    paginationHTML = ` 
    <li class="page-item">
    <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(1)">
      <span aria-hidden="true">&laquo;</span>
    </a>
    </li>
    <li class="page-item">
      <a class="page-link" href="#" aria-label="re-Previous" onclick="moveToPage(${((pageGroup-1)*5)-4})">
        <span aria-hidden="true">&lsaquo;</span>
      </a>
    </li>`;
  }

  for(let i=first; i<=last; i++){
    paginationHTML += `<li class="page-item ${page==i?"active":""}"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`;
    
  }

  //내가 마지막그룹일때 >> > 이 버튼이 없다
  if(pageGroup==Math.ceil(total_pages/5)){
    paginationHTML += '';
  }else{
      //이후
    paginationHTML += `<li class="page-item">
    <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${((pageGroup+1)*5)-4})">
      <span aria-hidden="true">&rsaquo;</span>
    </a>
  </li>
  <li class="page-item">
        <a class="page-link" href="#" aria-label="re-Next" onclick="moveToPage(${total_pages})">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>`;
  }


  document.querySelector(".pagination").innerHTML = paginationHTML;
};


const moveToPage = (pageNum) =>{
  //1.이동하고싶은 페이지를 알아야지
  page = pageNum;
  
  //2. 이동하고 싶은 페이지를 가지고 api를 다시 호출해주자
  getNews();
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

