setWallpaper("_xWallpapers");

function setInStorage(obj) {
  chrome.storage.local.set(obj);
}

function setWallpaper(key) {
  chrome.storage.local.get(key, async (result) => {
    const cache = result[key];
    if (cache) {
      const randomNum = Math.ceil(Math.random() * (79 - 0) + 0);
      document.body.style.background = `linear-gradient(315deg, rgb(40, 49, 59,0.1) 0%, rgb(72, 84, 97,0.1) 74%), url(${cache[randomNum].src.landscape}) no-repeat center center fixed`;
      document.body.style.backgroundSize = "cover";
      onboard();
    } else {
      const response = await fetch("https://ex-srvr.herokuapp.com/wallpaper");
      const _xWallpapers = await response.json();
      setInStorage({ _xWallpapers });
      setWallpaper("_xWallpapers");
    }
  });
}

async function setQuote() {
  const quote = document.querySelector(".quote_wrapper");
  const res = await fetch("https://api.quotable.io/random?maxLength=50");
  const data = await res.json();
  document.querySelector(".quote").innerText = data.content;
  document.querySelector(".quote_author").innerText = `—${data.author}`;
  quote.classList.add("set_visible_flex");
  getWeatherData();
}

const calenderData = {
  day: {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Friday",
    5: "Saturday",
  },
  month: {
    0: "January",
    1: "Febraury",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December",
  },
};

async function getWeatherData() {
  let lat, lon;

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      const response = await fetch(
        `https://ex-srvr.herokuapp.com/weather?lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      document.querySelector(".desc").innerText = `${data.weather[0].main}`;
      document.querySelector(".temp").innerText = `${data.main.temp}`;
      const today = new Date();
      const day = today.getDay();
      const month = today.getMonth();
      const date = today.getDate();
      const year = today.getFullYear();
      document.querySelector(
        ".date"
      ).innerText = `${calenderData.day[day]}, ${date} ${calenderData.month[month]}, ${year}`;
      document.querySelector(
        ".location"
      ).innerText = `${data.name}, ${data.sys.country}`;
      document.querySelector(
        ".weather_image"
      ).src = ` http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      const weather = document.querySelector(".weather_wrapper");
      weather.classList.add("set_visible_block");
      focus();
    },
    (error) => console.log(error)
  );
}

function setClock() {
  const hour = document.querySelector(".time_hour");
  const minutes = document.querySelector(".time_minutes");
  const clock = document.querySelector(".clock_wrapper");
  clock.classList.add("set_visible_flex");
  setInterval(() => {
    const newDate = new Date();
    hour.innerText = newDate.getHours() + " : ";
    minutes.innerText = newDate.getMinutes();
  }, 1000);
  setQuote();
}

function onboard() {
  const nameForm = document.querySelector(".name_form");
  const nameContent = document.querySelector(".name_content");
  const key = "_xUsername";

  chrome.storage.local.get(key, (result) => {
    if (result[key]) {
      nameContent.innerText = "Welcome! " + result[key];
      nameContent.classList.add("set_visible_flex");
      setClock();
    } else {
      nameForm.classList.add("set_visible_flex");
      nameForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = e.target.name_input.value;
        chrome.storage.local.set({ _xUsername: username });
        nameForm.classList.remove("set_visible_flex");
        onboard();
      });
    }
  });
}

function focus() {
  const d = new Date();
  const today = `${d.getDate()}${d.getMonth()}${d.getFullYear()}`;
  const focusForm = document.querySelector(".focus_form");
  const focusContent = document.querySelector(".focus_content");
  const focusCheckbox = document.querySelector(".focus_checkbox");
  const focusContainer = document.querySelector(".focus_container");
  const key = `focus${today}`;

  chrome.storage.local.get(key, (result) => {
    if (result[key]) {
      focusContent.innerText = result[key];
      focusCheckbox.addEventListener("change", (e) => {
        focusContent.classList.toggle("strike_text");
      });
      focusContainer.classList.add("set_visible_flex");
    } else {
      focusForm.classList.add("set_visible_flex");
      focusForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const focus = e.target.focus_input.value;
        chrome.storage.local.set({ key: focus });
        focusForm.classList.remove("set_visible_flex");
        focusContainer.classList.add("set_visible_flex");
        focusContent.innerText = focus;
        focusCheckbox.addEventListener("change", (e) => {
          focusContent.classList.toggle("strike_text");
        });
      });
    }
  });
}
