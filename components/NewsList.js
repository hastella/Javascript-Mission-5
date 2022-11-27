// do something!
import { store } from "./index.js";
import { observe } from "./Observer.js";

function NewsList() {
  let container = document.createElement("div");
  container.classList.add("news-list-container");

  let article = document.createElement("article");
  article.classList.add("news-list");
  container.appendChild(article);
  document.querySelector("#root").appendChild(container);
  container.appendChild(article);

  let scrollObs = document.createElement("div");
  scrollObs.classList.add("scroll-observer");
  document.querySelector("#root").appendChild(scrollObs);

  // 페이지 로딩시 스피너 구현
  function spinner() {
    const image = document.createElement("img");
    image.src = "img/ball-triangle.svg";
    image.alt = "Loading...";
    return image;
  }
  const spin = spinner();

  // 뉴스 리스트 추가해주기
  const showPost = (posts) => {
    posts.forEach((post) => {
      const newsItem = document.createElement("section");
      newsItem.classList.add("news-item");
      newsItem.innerHTML = `
            <div class="thumbnail">
              <a href=${post.url} target="_blank" rel="noopener noreferrer">
                <img
                  src=${post.urlToImage}
                  alt="thumbnail" />
              </a>
            </div>
            <div class="contents">
              <h2>
                <a href=${post.url} target="_blank" rel="noopener noreferrer">
                  ${post.title}
                </a>
              </h2>
              <p>
                ${post.description}
              </p>
            </div>
            `;
      article.appendChild(newsItem);
    });
  };

  let page = 0;
  const pageSize = 5;
  const apiKey = "6db14d4d97cb418e8e235ee96b414697";
  let category = "all";
  let url;

  observe(async () => {
    category = store.state.category;
    page = 0;
    reset();
  });

  function reset() {
    const reset = document.querySelector(".news-list");
    reset.innerHTML = "";
  }

  // 페이지 추가해주기
  const pageLoad = (entries, observer) => {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        // IntersectionObserver 와 같이 쓰이기 때문에 isIntersecting
        page++;
        console.log("페이지", page);
        const url = `https://newsapi.org/v2/top-headlines?country=kr&category=${
          category === "all" ? "" : category
        }&page=${page}&pageSize=${pageSize}&apiKey=${apiKey}`;
        console.log(url);

        // error 방지 try catch문
        try {
          let response = await axios.get(url);
          await showPost(response.data.articles);
          scrollObs.appendChild(spin);
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const option = {
    root: null,
    rootMargin: "0px",
    threshold: 0.8, // 전체 리스트의 80%가 로딩되면 pageLoad함수 실행
  };

  // IntersectionsObserver 생성
  const observer = new IntersectionObserver(pageLoad, option);

  // target 관찰
  observer.observe(scrollObs);
}

export default NewsList;
