var weatherData;
var weatherPageKeyEvents = {
  page: true,
  fullscreen: false,
};
var BADURL = false;
async function weather(url) {
  //url = "https://test.whizti.com/json/weather123.json";
  // const spinner = document.getElementById("spinner");
  // spinner.removeAttribute("hidden");
  //console.log(url);
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
  const weatherIcon = document.getElementById("weather-icon");
  if (weatherIcon.classList.contains("focused"))
    weatherIcon.classList.remove("focused");
  const weatherPage = document.getElementById("weatherPage");
  weatherPage.style.display = "block";
  const currentHeading = document.querySelector("#current-heading");
  currentHeading.textContent = `Current conditons for ${weatherData.CurrentCondition.City}`;
  const table = document.querySelector("#current-condition-container");

  table.innerHTML = "";
  let halfCurrentConditons =
    '<div id="current-condition-div"><div class="current-box-temperature"><div class="ftemp">';
  if (weatherData.CurrentCondition.Temperature) {
    halfCurrentConditons +=
      weatherData.CurrentCondition.Temperature + "&#8457;";
  } else {
    halfCurrentConditons += "-";
  }
  halfCurrentConditons += "</div>";
  halfCurrentConditons += '<div class="current-text">';
  if (weatherData.CurrentCondition.WeatherDescShort) {
    halfCurrentConditons += weatherData.CurrentCondition.WeatherDescShort;
  } else {
    halfCurrentConditons += "-";
  }
  halfCurrentConditons += "</div></div>";

  halfCurrentConditons += '<div class="current-box"><div class="icondiv">';
  if (weatherData.CurrentCondition.WeatherIconURL) {
    halfCurrentConditons +=
      '<img class="current-icon" src="' +
      weatherData.CurrentCondition.WeatherIconURL +
      '"/>';
  } else {
    halfCurrentConditons += "-";
  }

  halfCurrentConditons += "</div>";

  halfCurrentConditons += '<div class="current-text">';
  if (weatherData.CurrentCondition.RealFeelTemperature) {
    halfCurrentConditons +=
      "Feels like " +
      weatherData.CurrentCondition.RealFeelTemperature +
      "&#8457;";
  } else {
    halfCurrentConditons += "-";
  }
  halfCurrentConditons += "</div></div> </div>";

  halfCurrentConditons += '<div class="sunrise-container">';

  halfCurrentConditons +=
    '<div class="sunrise-box">Temperature<p class="ptext" />';
  if (weatherData.CurrentCondition.HighTemperature) {
    halfCurrentConditons +=
      weatherData.CurrentCondition.HighTemperature + "&#8457;";
  } else {
    halfCurrentConditons += "-";
  }
  halfCurrentConditons += "/";
  if (weatherData.CurrentCondition.LowTemperature) {
    halfCurrentConditons +=
      weatherData.CurrentCondition.LowTemperature + "&#8457;";
  } else {
    halfCurrentConditons += "-";
  }
  halfCurrentConditons += "</p>";
  halfCurrentConditons += "</div>";

  halfCurrentConditons += '<div class="sunrise-box">Wind<p class="ptext">';
  if (weatherData.CurrentCondition.WindDirection) {
    halfCurrentConditons += weatherData.CurrentCondition.WindDirection;
  } else {
    halfCurrentConditons += "- ";
  }
  if (weatherData.CurrentCondition.WindSpeedMiles) {
    halfCurrentConditons += weatherData.CurrentCondition.WindSpeedMiles + "mph";
  } else {
    halfCurrentConditons += "-";
  }
  halfCurrentConditons += "</p>";
  halfCurrentConditons += "</div>";

  halfCurrentConditons += '<div class="sunrise-box">Humidity<p class="ptext">';
  if (weatherData.CurrentCondition.Humidity) {
    halfCurrentConditons += weatherData.CurrentCondition.Humidity + "%";
  } else {
    halfCurrentConditons += "-";
  }
  halfCurrentConditons += "</p></div>";

  halfCurrentConditons += '<div class="sunrise-box">Pressure<p class="ptext">';
  if (weatherData.CurrentCondition.Pressure) {
    halfCurrentConditons += weatherData.CurrentCondition.Pressure + "Hg";
  } else {
    halfCurrentConditons += "-";
  }
  halfCurrentConditons += "</p> </div>";

  halfCurrentConditons += '<div class="sunrise-box">Sunrise<p class="ptext">';
  if (weatherData.CurrentCondition.Sunrise) {
    halfCurrentConditons += weatherData.CurrentCondition.Sunrise;
  } else {
    halfCurrentConditons += "-";
  }
  halfCurrentConditons += "</p></div>";

  halfCurrentConditons += '<div class="sunrise-box">Sunset<p class="ptext">';
  if (weatherData.CurrentCondition.Sunset) {
    halfCurrentConditons += weatherData.CurrentCondition.Sunset;
  } else {
    halfCurrentConditons += "-";
  }
  halfCurrentConditons += "</p></div>";

  halfCurrentConditons += '<div class="sunrise-box">Moonrise<p class="ptext">';
  if (weatherData.CurrentCondition.Moonrise) {
    halfCurrentConditons += weatherData.CurrentCondition.Moonrise;
  } else {
    halfCurrentConditons += "-";
  }
  halfCurrentConditons += "</p></div>";

  halfCurrentConditons += '<div class="sunrise-box">Moonset<p class="ptext">';
  if (weatherData.CurrentCondition.Moonset) {
    halfCurrentConditons += weatherData.CurrentCondition.Moonset;
  } else {
    halfCurrentConditons += "-";
  }
  halfCurrentConditons += "</p></div>";
  halfCurrentConditons +=
    '<div class="sunrise-box" id="moon">Moon phase<p class="ptext">';
  if (weatherData.CurrentCondition.MoonPhase) {
    halfCurrentConditons += weatherData.CurrentCondition.MoonPhase;
  } else {
    halfCurrentConditons += "-";
  }

  halfCurrentConditons += "</p> </div>";
  halfCurrentConditons += "</div>";

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

  if (ext == "mp4") {
    let mp4 = weatherData.StationForecast.VideoForecastUrl;
    let poster = weatherData.StationForecast.VideoForecastThumbnailUrl;
    setVideoSource(mp4, poster);
  } else if (ext === "m3u8") {
    var videoSrcHls = weatherData.StationForecast.VideoForecastUrl;
    setHlsVideoSource(videoSrcHls);
  } else {
    const noVideo = document.getElementById("weather-video");
    noVideo.style.width = "924";
  }
  // eof video
  const hours24 = document.querySelector("#hours24");
  if (weatherData.HourlyForecast.length > 0) {
    hours24.textContent = `Next ${weatherData.HourlyForecast.length} hours`;
  }
  const hourlyContainer = document.querySelector("#hourly-container");
  hourlyContainer.innerHTML = "";
  weatherData.HourlyForecast.forEach((element, index) => {
    let hourly = '<div class="hourly-item">';

    hourly += '<div class="time">';
    if (element.Hour_Display) {
      hourly += element.Hour_Display;
    } else {
      hourly += "-";
    }

    hourly += "</div>";

    hourly += '<div class="current_text">';
    if (element.WeatherDescShort) {
      hourly += element.WeatherDescShort;
    } else {
      hourly += "-";
    }

    hourly += "</div>";

    hourly += "<div>";
    if (element.WeatherIconURL) {
      hourly +=
        '<img class="current-icon-top-new" src="' +
        element.WeatherIconURL +
        '"/>';
    } else {
      hourly += "-";
    }
    hourly += "</div>";
    hourly += '<div class="pan">';
    hourly += '<div class="pan_child">';
    if (element.Temperature) {
      hourly += element.Temperature + "&#8457;";
    } else {
      hourly += "-";
    }
    hourly += "</div>";
    hourly += "<div>";
    if (element.PrecipChance) {
      hourly += element.PrecipChance + "%";
    } else {
      hourly += "-";
    }
    hourly += "</div>";
    hourly += "</div>";

    hourly += '<div class="h-wind">Wind:';
    if (element.WindDirection) {
      hourly += element.WindDirection;
    } else {
      hourly += "- ";
    }

    if (element.WindSpeed) {
      hourly += " " + element.WindSpeed + "mph";
    } else {
      hourly += "-";
    }
    hourly += "</div>";
    hourly += "</div> ";
    hourlyContainer.innerHTML += hourly;
  });

  const days = document.querySelector("#days");
  if (weatherData.WeeklyForecast.length > 0) {
    days.textContent = `${weatherData.WeeklyForecast.length} days forecast`;
  }
  const weekdays = document.querySelector("#weekly");
  weekdays.innerHTML = "";

  weatherData.WeeklyForecast.forEach((day) => {
    let weekly = '<div class="hourly-item">';
    weekly += '<div class="dayfont">' + day.Date + "</div>";
    weekly += '<div class="hrline"></div>';
    weekly += '<div class="heightemp">';
    if (day.TempMaxF) {
      weekly += day.TempMaxF + "&#8457;";
    } else {
      weekly += "-";
    }

    weekly += "</div>";

    weekly += '<div class="day-icon">';
    if (day.WeatherIconURL) {
      weekly +=
        '<img class="current-icon-top" src="' + day.WeatherIconURL + '" />';
    } else {
      weekly += "-";
    }

    weekly += "</div>";
    weekly += '<div class="pan">';

    weekly += '<div class="lowtemp">';
    if (day.TempMinF) {
      weekly += day.TempMinF + "&#8457;";
    } else {
      weekly += "-";
    }

    weekly += "</div>";
    weekly += "</div>";

    weekly += '<div class="wind">';
    if (day.PrecipChance) {
      weekly += day.PrecipChance + "%";
    } else {
      weekly += "-";
    }

    weekly += "</div></div>";

    weekdays.innerHTML += weekly;
  });
}
function closeWeather() {
  CATEGORYID = sessionStorage.getItem("cid");
  const weatherPage = document.getElementById("weatherPage");
  var weatherVideo = document.getElementById("weather-video");
  weatherVideo.pause();

  removeFocus();
  weatherPage.style.display = "none";
  const itemid = sessionStorage.getItem("itemId");
  const playingItem = document.getElementById(itemid);
  playingItem.classList.add("focused");
  //CATEGORYID = sessionStorage.getItem("cid");
  playingItem.scrollIntoView(true);
  playingItem.scrollIntoView({
    block: "start",
  });
}

function removeFocus() {
  const container = document.querySelector("#hourly-container");
  const weekly = document.querySelector("#weekly");

  let count = container.children;
  for (let i = 0; i < count.length; i++) {
    if (container.children[i].className === "hourly-item focused") {
      container.children[i].classList.remove("focused");
      break;
    }
  }
  if (weekly.children[0].className === "focused") {
    weekly.children[0].classList.remove("focused");
  }
}

function fullScreen() {
  const video = document.getElementById("weather-video");
  video.classList.remove("weatherVideo");
  video.classList.remove("weather-video-focused");
  video.classList.add("full-screen");

  return;
}

function miniWeatherVideo() {
  if (
    popupVisibilitybyId("weatherPage") &&
    document.getElementById("weather-video").classList.contains("full-screen")
  ) {
    const video = document.getElementById("weather-video");
    video.classList.remove("full-screen");
    video.classList.add("weatherVideo");
    video.classList.add("weather-video-focused");
    weatherPageKeyEvents.fullscreen = false;
    // throw new Error("Minimized video!");
  } else {
    closeWeather();
    videoElement.play();
  }
}

// Playing weather video bof mp4
// Function to set the video source dynamically
function setVideoSource(videoUrl, poster = "") {
  const videoElement = document.getElementById("weather-video");
  const sourceElement = document.getElementById("videoSource");
  const errorMessageElement = document.getElementById("errorMessage");

  // Reset error message
  errorMessageElement.style.display = "none";

  // Set the new video source

  sourceElement.src = videoUrl;

  videoElement.setAttribute("autoplay", "autoplay");
  videoElement.classList.add("weather-video-focused");
  videoElement.setAttribute("poster", poster);

  // check video url validity
  checkUrl(videoUrl);
  videoElement.load(); // Load the new source

  // Add event listeners for error handling
  videoElement.addEventListener("error", handleVideoError);
  //videoElement.addEventListener("stalled", handleVideoError);
  // videoElement.addEventListener("abort", handleVideoError);
}

async function checkUrl(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    if (!response.ok) {
      const errorMessageElement = document.getElementById("errorMessage");
      errorMessageElement.textContent = "The video failed to load or play.";
      errorMessageElement.style.display = "block";
      BADURL = true;
    }
  } catch (error) {
    console.error(error.message);
  }
}

// Function to handle video errors
function handleVideoError() {
  console.log("Error happend!");
  const videoElement = document.getElementById("weather-video");
  const errorMessageElement = document.getElementById("errorMessage");

  // Display error message
  errorMessageElement.style.display = "block";

  // Log the error (optional)
  console.error("Video failed to load or play:", videoElement.error);
}

///////// HLS VIDEO BOF
//let hls; // Store Hls instance globally

function setHlsVideoSource(videoUrl) {
  const weathervideoElement = document.getElementById("weather-video");
  const errorMessageElement = document.getElementById("errorMessage");

  // Reset UI
  errorMessageElement.style.display = "none";

  if (Hls.isSupported()) {
    // if (hls) {
    //   hls.destroy(); // Clean up previous Hls instance
    // }
    hls = new Hls();

    // Attach Hls.js to the video element
    weathervideoElement.setAttribute("autoplay", "autoplay");
    weathervideoElement.classList.add("weather-video-focused");
    if (weathervideoElement.pause()) {
      weathervideoElement.play();
    } else {
      hls.loadSource(videoUrl);
      hls.attachMedia(weathervideoElement);
    }

    // Handle HLS errors
    hls.on(Hls.Events.ERROR, (event, data) => {
      handleHlsError(data);
    });
  } else {
    // HLS not supported
    errorMessageElement.textContent =
      "HLS playback is not supported in this system.";
    errorMessageElement.style.display = "block";
  }
}

function handleHlsError(data) {
  const errorMessageElement = document.getElementById("errorMessage");
  if (data.fatal) {
    switch (data.type) {
      case Hls.ErrorTypes.NETWORK_ERROR:
        errorMessageElement.textContent =
          "A network error/Stale video. Try again.";
        break;
      // case Hls.ErrorTypes.MEDIA_ERROR:
      //   errorMessageElement.textContent =
      //     "A media error occurred. The video may be corrupted or unsupported.";
      //   break;
      // default:
      //   errorMessageElement.textContent = "An unknown error occurred.";
      //   break;
    }

    errorMessageElement.style.display = "block";
  }
}
