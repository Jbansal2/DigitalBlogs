/* <!-- <-----------------Navbar Js---------------> */
function toggleMenu() {
  const menu = document.getElementById("menu");
  if (menu.style.right === "0px") {
    menu.style.right = "-100%";
  } else {
    menu.style.right = "0px";
  }
}
/* <!-- <-----------------user icon loading Js---------------> */
function toggleLoginForm() {
  // Show the loader
  document.getElementById("loader").style.display = "block";

  // Redirect to the login page after 5 seconds
  setTimeout(function () {
    window.location.href = "login.html";
  }, 5000);
}
/* <!-- <-----------------weather api  loading Js---------------> */
const aqiToken = "580d39dd2c2e857c42a70d08c636fd432f84ac1a";
const weatherApiKey = "93872f3baemsh6e3dbc813ceb523p135bcdjsn803c4a2495f3"; // Ensure this key is valid

// Function to show the popup
function showPopup() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      showWeatherAndAQI,
      handleLocationError
    );
  } else {
    showErrorToast("Geolocation is not supported by this browser.");
  }
}

// Function to show weather and AQI for the user's location
function showWeatherAndAQI(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  const aqiUrl = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${aqiToken}`;
  const weatherUrl = `https://weatherapi-com.p.rapidapi.com/current.json?q=${lat},${lon}`;

  // Fetch AQI data
  fetch(aqiUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "ok") {
        displayAQI(data.data);
        document.querySelector(".popup").style.display = "block"; // Show the popup
        showSuccessToast("Location access granted.");
      } else {
        showErrorToast("Failed to retrieve AQI data.");
      }
    })
    .catch((error) => {
      showErrorToast("Error fetching AQI data.");
    });

  // Fetch weather data
  fetch(weatherUrl, {
    method: "GET",
    headers: {
      "x-rapidapi-key": weatherApiKey,
      "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      displayWeather(data);
    })
    .catch((error) => {
      showErrorToast("Failed to fetch weather data.");
    });
}

// Function to display AQI data in the pop-up
function displayAQI(data) {
  const aqiElement = document.querySelector(".aqi");
  const aqiBar = document.querySelector(".aqi-bar");

  aqiElement.innerHTML = `AQI: ${data.aqi} | ${getAQIDescription(data.aqi)}`;
  aqiBar.style.width = `${(data.aqi / 500) * 100}%`;
  aqiBar.style.backgroundColor = getAQIColor(data.aqi);
}

// Function to display weather data in the pop-up
function displayWeather(data) {
  const cityElement = document.querySelector(".city");
  const tempElement = document.querySelector(".temperature");
  const conditionElement = document.querySelector(".condition");

  // Convert temperature from Celsius to Fahrenheit if needed
  const tempCelsius = data.current.temp_c.toFixed(2);

  cityElement.innerHTML = data.location.name || "Unknown City";
  tempElement.innerHTML = `${tempCelsius}°C`;
  conditionElement.innerHTML = data.current.condition.text || "N/A";
}

// Function to get AQI description
function getAQIDescription(aqi) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

// Function to get AQI color based on the AQI value
function getAQIColor(aqi) {
  if (aqi <= 50) return "#00e400"; // Green
  if (aqi <= 100) return "#ffff00"; // Yellow
  if (aqi <= 150) return "#ff7e00"; // Orange
  if (aqi <= 200) return "#ff0000"; // Red
  if (aqi <= 300) return "#8f3f97"; // Purple
  return "#7e0023"; // Maroon
}

// Handle location error
function handleLocationError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      showErrorToast("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      showErrorToast("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      showErrorToast("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      showErrorToast("An unknown error occurred.");
      break;
  }
}

// Show success toast
function showSuccessToast(message) {
  const toast = document.getElementById("toast-success");
  toast.querySelector(".message").textContent = message;
  toast.style.display = "block";
  setTimeout(() => (toast.style.display = "none"), 3000);
}

// Show error toast
function showErrorToast(message) {
  const toast = document.getElementById("toast-error");
  toast.querySelector(".message").textContent = message;
  toast.style.display = "block";
  const progressBar = toast.querySelector(".progress-bar");
  let width = 0;
  const interval = setInterval(() => {
    if (width >= 100) {
      clearInterval(interval);
      toast.style.display = "none";
    } else {
      width += 10;
      progressBar.style.width = width + "%";
    }
  }, 300);
}

// Close button functionality for toast notifications
document.querySelectorAll(".toast .close-button").forEach((button) => {
  button.addEventListener("click", function () {
    this.parentElement.style.display = "none";
  });
});

// Close button functionality for the popup
document
  .querySelector(".popup .close-button")
  .addEventListener("click", function () {
    document.querySelector(".popup").style.display = "none";
  });

/* <!-- <-----------------news-1-Js---------------> */

const BASE_URL = "https://saurav.tech/NewsAPI/";
const topHeadlinesAPI = `${BASE_URL}top-headlines/category/general/in.json`;

async function news1() {
  try {
    const response = await fetch(topHeadlinesAPI);
    const data = await response.json();
    const articles = data.articles;
    const newsGrid = document.getElementById("newsGrid");

    newsGrid.innerHTML = "";

    articles.slice(1, 7).forEach((article) => {
      const card = document.createElement("div");
      card.className = "card-1";

      const img = document.createElement("img");
      img.src = article.urlToImage;
      img.alt = article.title;

      const cardContent = document.createElement("div");
      cardContent.className = "card-content-1";

      const category = document.createElement("span");
      category.className = "category-1";
      category.textContent = article.category || "News";

      const title = document.createElement("h3");
      title.className = "title-1";
      title.textContent = article.title;

      const description = document.createElement("p");
      description.className = "description-1";
      description.textContent = article.description || "";

      cardContent.appendChild(category);
      cardContent.appendChild(title);
      cardContent.appendChild(description);

      card.appendChild(img);
      card.appendChild(cardContent);

      newsGrid.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching news:", error);
  }
}

news1();

/* <!-- <-----------------news-2-Js---------------> */

function fetchAndDisplayNews() {
  const BASE_URL = "https://saurav.tech/NewsAPI/";
  const top_headlines_api = `${BASE_URL}top-headlines/category/business/us.json`;

  fetch(top_headlines_api)
    .then((response) => response.json())
    .then((data) => {
      const newsGrid = document.getElementById("news-grid-a");
      data.articles.slice(1, 6).forEach((article, index) => {
        const newsItem = document.createElement("div");
        newsItem.classList.add(index < 1 ? "large-item-a" : "small-item-a");

        const imageContainer = document.createElement("div");
        imageContainer.classList.add("image-container-a");
        const img = document.createElement("img");
        img.src = article.urlToImage || "https://via.placeholder.com/800x450";
        img.alt = article.title;
        imageContainer.appendChild(img);

        const category = document.createElement("span");
        category.classList.add("category-a");
        category.textContent = "Business";

        const title = document.createElement("h3");
        title.classList.add("news-title-a");
        title.textContent = article.title;

        newsItem.appendChild(imageContainer);
        newsItem.appendChild(category);
        newsItem.appendChild(title);

        newsGrid.appendChild(newsItem);
      });
    })
    .catch((error) => console.error("Error fetching news:", error));
}

fetchAndDisplayNews();

/* <!-- <-----------------news-3-Js---------------> */

document.addEventListener("DOMContentLoaded", function () {
  const API_URL =
    "https://saurav.tech/NewsAPI/top-headlines/category/entertainment/us.json";

  async function fetchArticles() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const articles = data.articles;

      const articlesGrid = document.querySelector(".articles-grid");

      articlesGrid.innerHTML = "";

      articles.forEach((article) => {
        const articleCard = document.createElement("a");
        articleCard.classList.add("article-card");
        articleCard.href = article.url;
        articleCard.target = "_blank";

        const articleHTML = `
                  <img src="${article.urlToImage || "default.jpg"}" alt="${
          article.title
        }">
                  <div class="article-info">
                      <span class="category">${article.source.name}</span>
                      <h3 class="article-title">${article.title}</h3>
                      <p class="article-date">${new Date(
                        article.publishedAt
                      ).toLocaleDateString()} • BY ${
          article.author || "Unknown"
        }</p>
                  </div>
              `;

        articleCard.innerHTML = articleHTML;
        articlesGrid.appendChild(articleCard);
      });
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  }

  fetchArticles();
});

/* <!-- <-----------------news-4-Js---------------> */

function loadNewsData() {
  const BASE_URL = "https://saurav.tech/NewsAPI/";
  const topHeadlinesAPI = `${BASE_URL}top-headlines/category/general/in.json`;
  const everythingAPI = `${BASE_URL}everything/guardian.json`;

  async function fetchData(apiUrl, containerId) {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const container = document.getElementById(containerId);

      container.innerHTML = "";

      const articlesToShow = data.articles.slice(0, 5);

      articlesToShow.forEach((article, index) => {
        const articleHTML = `
                  <article class="CNBCTV18-grid-item">
                      <img src="${article.urlToImage}" alt="${article.title}">
                      <div class="CNBCTV18-grid-item-content">
                          <p class="CNBCTV18-category">${article.source.name}</p>
                          <h3>${article.title}</h3>
                          <p>${article.description}</p>
                      </div>
                  </article>
              `;

        if (index < 2) {
          document.getElementById("top-headlines-container").innerHTML +=
            articleHTML;
        } else {
          document.getElementById("everything-container").innerHTML +=
            articleHTML;
        }
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  fetchData(topHeadlinesAPI, "top-headlines-container");
  fetchData(everythingAPI, "everything-container");
}

loadNewsData();

/* <!-- <-----------------news-5-Js---------------> */
function fetchArticles() {
  const BASE_URL = "https://saurav.tech/NewsAPI";
  const category = "sports";
  const country_code = "in";

  const top_headlines_api = `${BASE_URL}/top-headlines/category/${category}/${country_code}.json`;

  fetch(top_headlines_api)
    .then((response) => response.json())
    .then((data) => {
      const articlesContainer = document.getElementById("articles456");
      const articles = data.articles.slice(0, 7);
      articles.forEach((article, index) => {
        const articleElement = document.createElement("a");
        articleElement.href = article.url;
        articleElement.target = "_blank";
        articleElement.classList.add("grid-item789", "jkl5");
        if (index === 0) {
          articleElement.classList.add("grid-item-large321", "mno6");
        }
        articleElement.innerHTML = `
                  <img src="${article.urlToImage}" alt="${article.title}">
                  <div class="content987 pqr7">
                      <span class="tag654 stu8">${category}</span>
                      <h3 class="vwx9">${article.title}</h3>
                      <p class="yz10">${article.description}</p>
                  </div>
              `;
        articlesContainer.appendChild(articleElement);
      });
    })
    .catch((error) => console.error("Error fetching the articles:", error));
}

fetchArticles();

/* <!-- <-----------------Home-5-Js---------------> */
function initializeNewsApp() {
  const BASE_URL = "https://saurav.tech/NewsAPI/";
  const countryCode = "in";

  async function fetchNews(category) {
    const topHeadlinesApi = `${BASE_URL}/top-headlines/category/${category}/${countryCode}.json`;

    try {
      const response = await fetch(topHeadlinesApi);
      const data = await response.json();

      if (data && data.articles) {
        const articles = data.articles;

        if (articles.length > 0) {
          const featuredArticleSection =
            document.getElementById("featured-article");
          const featuredArticle = articles[0];

          featuredArticleSection.innerHTML = `
                      <img src="${featuredArticle.urlToImage}" alt="${
            featuredArticle.title
          }">
                      <div class="business-info">
                          <span class="business-tag">${
                            featuredArticle.source.name
                          }</span>
                          <h2>${featuredArticle.title}</h2>
                          <p>By ${
                            featuredArticle.author || "Unknown"
                          }, ${new Date(
            featuredArticle.publishedAt
          ).toLocaleDateString()}</p>
                          <p>${featuredArticle.description}</p>
                      </div>
                  `;
        }

        const newsList = document.getElementById("news-list");
        newsList.innerHTML = articles
          .slice(1, 6)
          .map(
            (article) => `
                  <article class="business-item">
                      <img src="${article.urlToImage}" alt="${article.title}">
                      <div class="business-item-info">
                          <p>By ${article.author || "Unknown"}, ${new Date(
              article.publishedAt
            ).toLocaleDateString()}</p>
                          <a href="${article.url}" target="_blank">${
              article.title
            }</a>
                      </div>
                  </article>
              `
          )
          .join("");
      } else {
        console.error("No articles found.");
      }
    } catch (error) {
      console.error("Error fetching the news:", error);
    }
  }

  function handleCategoryClick(event) {
    const selectedCategory = event.target.id;

    document.querySelectorAll(".business-button").forEach((button) => {
      button.classList.remove("active");
    });

    event.target.classList.add("active");

    fetchNews(selectedCategory);
  }

  document.querySelectorAll(".business-button").forEach((button) => {
    button.addEventListener("click", handleCategoryClick);
  });

  fetchNews("business");
}

window.onload = initializeNewsApp;

/* <!-- <-----------------News-page--Js---------------> */

function initializeNewsContent() {
  const BASE_URL = "https://saurav.tech/NewsAPI/";
  const topHeadlinesApi = `${BASE_URL}top-headlines/category/general/in.json`;

  async function fetchNews() {
    try {
      const response = await fetch(topHeadlinesApi);
      const data = await response.json();

      const mainArticle = data.articles[0];
      const sideArticle = data.articles[1];

      const mainNews = `
              <div class="news-grid">
                  <div class="main-news">
                      <div class="category">${mainArticle.source.name}</div>
                      <h1>${mainArticle.title}</h1>
                      <div class="meta">
                          <div class="date">${new Date(
                            mainArticle.publishedAt
                          ).toDateString()}</div>
                          <div class="author">by ${
                            mainArticle.author || "Unknown"
                          }</div>
                      </div>
                      <div class="description">${mainArticle.description}</div>
                      <a href="${
                        mainArticle.url
                      }" class="read-more" target="_blank">READ MORE</a>
                  </div>
                  <div class="side-news">
                      <div class="category">${sideArticle.source.name}</div>
                      <h1>${sideArticle.title}</div>
                      <div class="meta">
                          <div class="date">${new Date(
                            sideArticle.publishedAt
                          ).toDateString()}</div>
                          <div class="author">by ${
                            sideArticle.author || "Unknown"
                          }</div>
                      </div>
                  </div>
              </div>
          `;

      const articles = data.articles
        .slice(2, 105)
        .map(
          (article) => `
              <div class="article-card">
                  <img src="${article.urlToImage}" alt="News Image">
                  <h2>${article.title}</h2>
                  <div class="description">${article.description}</div>
                  <div class="meta">
                      <div class="date">${new Date(
                        article.publishedAt
                      ).toDateString()}</div>
                      <div class="author">by ${
                        article.author || "Unknown"
                      }</div>
                  </div>
              </div>
          `
        )
        .join("");

      document.getElementById("news-content").innerHTML =
        mainNews + `<div class="article-grid">${articles}</div>`;
    } catch (error) {
      console.error("Error fetching the news:", error);
    }
  }

  fetchNews();
}

initializeNewsContent();

/* <!-- <-----------------Buisness-page--Js---------------> */

function fetchTopHeadlines() {
  const topHeadlinesApi =
    "https://saurav.tech/NewsAPI/top-headlines/category/business/us.json";

  fetch(topHeadlinesApi)
    .then((response) => response.json())
    .then((data) => {
      const newsGrid = document.getElementById("fox-business-news-grid");
      newsGrid.innerHTML = "";

      data.articles.forEach((article) => {
        const newsItem = document.createElement("article");
        newsItem.classList.add("fox-business-news-item");

        newsItem.innerHTML = `
                  <a href="${
                    article.url
                  }" target="_blank" rel="noopener noreferrer">
                      <img src="${article.urlToImage}" alt="${article.title}">
                      <div class="fox-business-news-details">
                          <p><strong>${
                            article.source.name
                          }</strong> • ${new Date(
          article.publishedAt
        ).toLocaleTimeString()}</p>
                          <h3>${article.title}</h3>
                          <p>${article.description}</p>
                      </div>
                  </a>
              `;
        newsGrid.appendChild(newsItem);
      });
    })
    .catch((error) => {
      console.error("Error fetching the news:", error);
    });
}

fetchTopHeadlines();

/* <!-- <-----------------Sports-page--Js---------------> */
function fetchAndDisplaySportsHeadlines() {
  const BASE_URL = "https://saurav.tech/NewsAPI";
  const category = "sports";
  const country_code = "in";
  const top_headlines_api = `${BASE_URL}/top-headlines/category/${category}/${country_code}.json`;

  fetch(top_headlines_api)
    .then((response) => response.json())
    .then((data) => {
      if (data.articles.length > 0) {
        const mainCard = document.getElementById("main-card");
        const sideCards = document.getElementById("side-cards");

        const mainArticle = data.articles[0];
        mainCard.innerHTML = `
                  <img src="${mainArticle.urlToImage}" alt="Main news image">
                  <div class="API-FOOTBALL-details">
                      <p class="API-FOOTBALL-tag">${mainArticle.source.name}</p>
                      <h2>${mainArticle.title}</h2>
                      <p class="API-FOOTBALL-read-time">${mainArticle.publishedAt}</p>
                  </div>
              `;

        data.articles.slice(1, 4).forEach((article) => {
          const sideCard = document.createElement("div");
          sideCard.className = "API-FOOTBALL-side-card";
          sideCard.innerHTML = `
                      <img src="${article.urlToImage}" alt="News image">
                      <div class="API-FOOTBALL-text-content">
                          <p class="API-FOOTBALL-tag">${article.source.name}</p>
                          <h4>${article.title}</h4>
                          <p class="API-FOOTBALL-read-time">${article.publishedAt}</p>
                      </div>
                  `;
          sideCards.appendChild(sideCard);
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching the news:", error);
    });
}
fetchAndDisplaySportsHeadlines();

/* <!-- <-----------------Sports-2--page--Js---------------> */
function fetchNewsArticles() {
  const BASE_URL = "https://saurav.tech/NewsAPI/";
  const category = "sports";
  const country_code = "in";

  const top_headlines_api = `${BASE_URL}top-headlines/category/${category}/${country_code}.json`;

  fetch(top_headlines_api)
    .then((response) => response.json())
    .then((data) => {
      const articlesContainer = document.querySelector(
        ".sports-page-articles-container"
      );
      articlesContainer.innerHTML = "";

      data.articles.forEach((article) => {
        const articleCard = document.createElement("div");
        articleCard.className = "sports-page-article-card";

        articleCard.innerHTML = `
                  <img src="${
                    article.urlToImage || "https://via.placeholder.com/150"
                  }" alt="${article.title}">
                  <div class="sports-page-article-info">
                      <div class="sports-page-author">
                          <img src="${
                            article.authorImage ||
                            "https://via.placeholder.com/40"
                          }" alt="${article.author}">
                          <span>${article.author || "Unknown Author"}</span>
                          <span> | ${new Date(
                            article.publishedAt
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })} hours ago</span>
                      </div>
                      <h3>${article.title}</h3>
                      <div class="sports-page-meta-info">
                          <span>${article.source.name}</span>
                          <span> | ${Math.ceil(
                            article.content.length / 200
                          )} minute read</span>
                      </div>
                  </div>
              `;

        articlesContainer.appendChild(articleCard);
      });
    })
    .catch((error) => console.error("Error fetching news:", error));
}

fetchNewsArticles();

/* <!-- <-----------------Tech-2--page--Js---------------> */
function fetchNews() {
  const BASE_URL = "https://saurav.tech/NewsAPI";
  const top_headlines_api = `${BASE_URL}/top-headlines/category/technology/in.json`;
  
  document.addEventListener("DOMContentLoaded", function() {
      fetchNews();
  });
  fetch(top_headlines_api)
      .then(response => response.json())
      .then(data => {
          displayNews(data.articles);
      })
      .catch(error => {
          console.error("Error fetching the news:", error);
      });
}

function displayNews(articles) {
  const newsGrid = document.getElementById('news-grid');
  newsGrid.innerHTML = "";

  articles.forEach(article => {
      const newsItem = document.createElement('div');
      newsItem.classList.add('news-item');

      newsItem.innerHTML = `
          <img src="${article.urlToImage}" alt="News Image">
          <h3>${article.title}</h3>
      `;

      newsItem.addEventListener('click', () => {
          window.location.href = article.url;
      });

      newsGrid.appendChild(newsItem);
  });
}


function initializeNews() {
  document.addEventListener("DOMContentLoaded", function() {
      fetchNews();
  });
}


initializeNews();


/* <!-- <-----------------ertainmentNews--page--Js---------------> */
function loadEntertainmentNews() {
  const BASE_URL = "https://saurav.tech/NewsAPI/";
  const top_headlines_api = `${BASE_URL}top-headlines/category/entertainment/in.json`;

  async function fetchNews() {
      try {
          const response = await fetch(top_headlines_api);
          const data = await response.json();
          renderNews(data.articles);
      } catch (error) {
          console.error('Error fetching news:', error);
      }
  }

  function renderNews(articles) {
      const newsGrid = document.getElementById('news-grid1');
      articles.forEach(article => {
          const newsItem = document.createElement('div');
          newsItem.className = 'news-item';
          newsItem.innerHTML = `
              <img src="${article.urlToImage}" alt="${article.title}">
              <h3>${article.title}</h3>
          `;
          newsItem.addEventListener('click', () => {
              window.open(article.url, '_blank');
          });
          newsGrid.appendChild(newsItem);
      });
  }

  fetchNews();
}


loadEntertainmentNews();

/* <!-- <-----------------health--page--Js---------------> */
function loadHealthNews() {
  const BASE_URL = "https://saurav.tech/NewsAPI/";
  const top_headlines_api = `${BASE_URL}top-headlines/category/health/in.json`;

  async function fetchNews() {
      try {
          const response = await fetch(top_headlines_api);
          const data = await response.json();
          renderNews(data.articles);
      } catch (error) {
          console.error('Error fetching news:', error);
      }
  }

  function renderNews(articles) {
      const newsGrid = document.getElementById('healthnews1-grid1');
      articles.forEach(article => {
          const newsItem = document.createElement('div');
          newsItem.className = 'healthnews1-item';
          const publishedDate = new Date(article.publishedAt);
          const formattedDate = publishedDate.toLocaleDateString();
          const formattedTime = publishedDate.toLocaleTimeString();
          const author = article.author || 'Unknown Author';

          newsItem.innerHTML = `
              <img src="${article.urlToImage}" alt="${article.title}">
              <h3>${article.title}</h3>
              <div class="details">
                  <p>${formattedDate} ${formattedTime}</p>
                  <p>By ${author}</p>
              </div>
          `;
          newsItem.addEventListener('click', () => {
              window.open(article.url, '_blank');
          });
          newsGrid.appendChild(newsItem);
      });
  }

  fetchNews();
}


loadHealthNews();
