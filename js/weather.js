var weatherData;
async function weather(url) {
  url = "https://wx.whizti.com/api/weather/803?zip_code=39503";
  // const spinner = document.getElementById("spinner");
  // spinner.removeAttribute("hidden");
  if (url === undefined) return;
  const city = document.querySelector("#city");
  const icon = document.querySelector("#wicon");
  const temp = document.querySelector("#temp");

  try {
    const response = await getData(url, {
      timeout: 30000,
    });
    weatherData = await response.json();
    //return data;

    city.textContent = weatherData.CurrentCondition.City;
    temp.innerHTML = `${weatherData.CurrentCondition.Temperature}&deg;`;
    icon.innerHTML = `<span ><img src="${weatherData.CurrentCondition.WeatherIconURL}"class="weather-icon" /> 
    </span>`;

    //WeatherIconURL
    //Temperature
  } catch (error) {
    // Timeouts if the request takes
    // longer than 30 seconds
    SERVER_ERROR = true;
    console.log(error.name === "AbortError");
    console.log("ERROR : ", error);
    openErrorNotification("Error", "An error occured");
    //  spinner.setAttribute("hidden", "");
  }
}

function openWeather() {
  const weatherPage = document.getElementById("weatherPage");
  weatherPage.style.display = "block";
  const currentHeading = document.querySelector("#current-heading");
  currentHeading.textContent = `Current conditons for ${weatherData.CurrentCondition.City}`;
  const table = document.querySelector("#current-condition-container");
  table.innerHTML = "";
  const halfCurrentConditons = `
              <div id="current-condition-div">

              <div class="current-box-temperature">
              <div class="ftemp">${weatherData.CurrentCondition.Temperature}&#8457;</div>
              <div class="current-text">${weatherData.CurrentCondition.WeatherDescShort}</div>
              </div>

              <div class="current-box">
              <div class="icondiv"><img class="current-icon-xx" src="${weatherData.CurrentCondition.WeatherIconURL}"/></div>
              <div class="current-text">Feels like ${weatherData.CurrentCondition.RealFeelTemperature}&#8457;</div>
              </div>

              </div>
              
              <div class="sunrise-container">

              <div class="sunrise-box">Temperature<p class="ptext" />${weatherData.CurrentCondition.HighTemperature}&#8457;/
              ${weatherData.CurrentCondition.LowTemperature}&#8457;</p>
              </div>

              <div class="sunrise-box">Wind<p class="ptext">${weatherData.CurrentCondition.WindDirection} 
              ${weatherData.CurrentCondition.WindSpeedMiles}mph </p>
              </div>

              <div class="sunrise-box">Humidity<p class="ptext">${weatherData.CurrentCondition.Humidity}% </p></div>
              <div class="sunrise-box">Pressure<p class="ptext">${weatherData.CurrentCondition.Pressure}Hg</p> </div>
              <div class="sunrise-box">Sunrise<p class="ptext">${weatherData.CurrentCondition.Sunrise} </p></div>
              <div class="sunrise-box">Sunset<p class="ptext">${weatherData.CurrentCondition.Sunset} </p></div>
              <div class="sunrise-box">Moonrise<p class="ptext">${weatherData.CurrentCondition.Moonrise}</p></div>
              <div class="sunrise-box">Moonset<p class="ptext">${weatherData.CurrentCondition.Moonset} </p></div>
              <div class="sunrise-box" id="moon">Moon phase<p class="ptext">${weatherData.CurrentCondition.MoonPhase}</p> </div>

            </div>

  `;

  const fullWidthCurrentConditons = `
              <div id="current-condition-div">

              <div class="current-box-temperature">
              <div class="ftemp">${weatherData.CurrentCondition.Temperature}&#8457;</div>
              <div class="current-text">${weatherData.CurrentCondition.WeatherDescShort}</div>
              </div>

              <div class="current-box">
              <div class="icondiv"><img class="current-icon-xx" src="${weatherData.CurrentCondition.WeatherIconURL}"/></div>
              <div class="current-text">Feels like ${weatherData.CurrentCondition.RealFeelTemperature}&#8457;</div>
              </div>

              </div>
              
              <div class="sunrise-container">

              <div class="sunrise-box">Temperature<p class="ptext" />${weatherData.CurrentCondition.HighTemperature}&#8457;/
              ${weatherData.CurrentCondition.LowTemperature}&#8457;</p>
              </div>

              <div class="sunrise-box">Wind<p class="ptext">${weatherData.CurrentCondition.WindDirection} 
              ${weatherData.CurrentCondition.WindSpeedMiles}mph </p>
              </div>

              <div class="sunrise-box">Humidity<p class="ptext">${weatherData.CurrentCondition.Humidity}% </p></div>
              <div class="sunrise-box">Pressure<p class="ptext">${weatherData.CurrentCondition.Pressure}Hg</p> </div>
              <div class="sunrise-box">Sunrise<p class="ptext">${weatherData.CurrentCondition.Sunrise} </p></div>
              <div class="sunrise-box">Sunset<p class="ptext">${weatherData.CurrentCondition.Sunset} </p></div>
              <div class="sunrise-box">Moonrise<p class="ptext">${weatherData.CurrentCondition.Moonrise}</p></div>
              <div class="sunrise-box">Moonset<p class="ptext">${weatherData.CurrentCondition.Moonset} </p></div>
              <div class="sunrise-box" id="moon">Moon phase<p class="ptext">${weatherData.CurrentCondition.MoonPhase}</p> </div>

            </div>

  `;
  if (weatherData.StationForecast.VideoForecastUrl) {
    table.innerHTML = halfCurrentConditons;
  } else {
    table.innerHTML = fullWidthCurrentConditons;
    console.log("FULL WIDHTH");
  }
  const currentheading = document.querySelector("#currentheading");
  currentIndex = 0;
  currentheading.scrollIntoView(true);
  currentheading.scrollIntoView({
    block: "start",
  });

  //video
  const ext = weatherData.StationForecast.VideoForecastUrl.split(".").pop();
  var video = document.getElementById("weather-video");
  //if (weatherData.StationForecast.VideoForecastMediaType == "video/mp4") {
  if (ext == "mp4") {
    // mp4 video
    video.setAttribute("src", weatherData.StationForecast.VideoForecastUrl);
    video.setAttribute("autoplay", "autoplay");
    video.setAttribute(
      "poster",
      weatherData.StationForecast.VideoForecastThumbnailUrl,
    );
  } else {
    var videoSrcHls = weatherData.StationForecast.VideoForecastUrl;
    // var videoSrcHls =
    //   "https://fueltools-prod01-v1-fast.fuelmedia.io/fast/clip/play/60da9136-c915-4159-b6d2-740394a21c08.m3u8";

    if (Hls.isSupported()) {
      var weatherhls = new Hls();
      weatherhls.loadSource(videoSrcHls);
      weatherhls.attachMedia(video);
      weatherhls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play();
      });
    }
  }
  // eof video

  const hourlyContainer = document.querySelector("#hourly-container");
  hourlyContainer.innerHTML = "";
  weatherData.HourlyForecast.forEach((element, index) => {
    hourlyContainer.innerHTML += ` <div class="hourly-item"><div class="hourly-box">${element.Hour_Display}</div>
  <div class="hour-desc">${element.WeatherDescShort}</div>
  <div class="hourly-box"><img class="current-icon" src="${element.WeatherIconURL}"/></div>
  <div class="hour-precip">

  <div class="hourly-temperature">${element.Temperature}&#8457;</div>
  <div class="hourly-precipitation">${element.PrecipChance}%</div>
  
  </div>
  
  <div class="hourly-box">Wind: ${element.WindDirection} ${element.WindSpeed} mph</div></div>`;
  });

  const weekdays = document.querySelector("#weekly");
  weekdays.innerHTML = "";
  weatherData.WeeklyForecast.forEach((day) => {
    weekdays.innerHTML += `<div id="day-container">
    <div class="dayfont">${day.Date}</div>
    <div class="hrline"></div>
    <div class="heightemp">${day.TempMaxF}&#8457;</div>
    <div><img class="current-icon" src="${day.WeatherIconURL}"/></div>
    <div class="lowtemp">${day.TempMinF}&#8457;</div>
    <div class="hour-desc">${day.WeatherDescShort}</div>
    </div>
    `;
  });
}
function closeWeather() {
  const weatherPage = document.getElementById("weatherPage");
  var weatherVideo = document.getElementById("weather-video");
  weatherVideo.pause();
  removeFocus();
  weatherPage.style.display = "none";
}

function removeFocus() {
  console.log("CALLED REMOVE FOCUS");
  const container = document.querySelector("#hourly-container");
  const weekly = document.querySelector("#weekly");

  let count = container.children;
  for (let i = 0; i < count.length; i++) {
    console.log("CALLED 24 HOUR");
    if (container.children[i].className === "hourly-item focused") {
      container.children[i].classList.remove("focused");
      break;
    }
  }
  if (weekly.children[0].className === "focused") {
    console.log("CALLED WEEKLY");
    weekly.children[0].classList.remove("focused");
  }
}
