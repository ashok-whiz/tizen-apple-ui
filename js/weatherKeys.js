var items = document.querySelectorAll(".weatheritem");
var currentIndex = 0;
// items[currentIndex].children[0].classList.add("focused");

items[currentIndex].scrollIntoView(true);
items[currentIndex].scrollIntoView({
  block: "nearest",
});

function weatherKeys() {
  document.addEventListener("keydown", function (e) {
    tizen.tvinputdevice.registerKey("MediaPlayPause");
    tizen.tvinputdevice.registerKey("MediaPlay");
    tizen.tvinputdevice.registerKey("MediaStop");
    tizen.tvinputdevice.registerKey("MediaPause");
    tizen.tvinputdevice.registerKey("MediaRewind");
    tizen.tvinputdevice.registerKey("MediaFastForward");
    tizen.tvinputdevice.registerKey("Exit");
    const wvideo = document.getElementById("weather-video");
    const status = document.getElementById("weather-video-status");
    if (!popupVisibilitybyId("weatherPage")) return;
    switch (e.keyCode) {
      case 13:
        if (BADURL) return; // if bad url prevent any ok action.
        setTimeout(() => {
          weatherPageKeyEvents.fullscreen = true;
        }, 1000);
        // weatherPageKeyEvents.fullscreen = true;
        if (!weatherPageKeyEvents.fullscreen) return;

        if (wvideo.classList.contains("weather-video-focused")) {
          fullScreen();
          return;
        }
        if (wvideo.classList.contains("full-screen") && wvideo.paused) {
          status.style.display = "none";
          wvideo.play();
        } else {
          status.style.display = "block";
          status.textContent = "Play";
          wvideo.pause();
        }
        break;

      case 37: // Left key
        if (wvideo.classList.contains("full-screen")) return;
        let leftElement = document.getElementsByClassName(
          "hourly-item focused",
        );

        let leftid = leftElement[0].parentElement.id;
        //let leftKey = document.getElementById("hourly-container");
        let leftKey = document.getElementById(leftid);

        let lcount = leftKey.children;
        let lcounter = 0;

        for (let i = 0; i < lcount.length; i++) {
          if (leftKey.children[i].className === "hourly-item focused") {
            lcounter = i;

            break;
          }
        }

        for (let i = 0; i < lcount.length; i++) {
          if (i === lcounter) {
            if (lcounter <= 0) break;
            leftKey.children[i].classList.remove("focused");
            lcounter--;
            leftKey.children[lcounter].classList.add("focused");

            let focuseEl = document.getElementsByClassName(
              "hourly-item focused",
            );
            // let setfocus = focuseEl[0].attributes["id"].nodeValue;
            // document.getElementById(setfocus).focus();

            leftKey.children[lcounter].scrollIntoView(false);
            leftKey.children[lcounter].scrollIntoView({ block: "start" });
            leftKey.children[lcounter].scrollIntoView({
              behavior: "smooth",
              block: "start",
              inline: "nearest",
            });

            break;
          }
        }
        break;

      case 38: // up arrow
        if (currentIndex > 0) {
          currentIndex--;
          updateHighlight(currentIndex);
          // addVideoFocuse();
        }
        if (currentIndex === 0) {
          addVideoFocuse();
        }
        break;

      case 39: //Right arrow
        if (!popupVisibilitybyId("weatherPage")) return;
        if (wvideo.classList.contains("full-screen")) return;
        if (MINI_TIMEOUT_ID) {
          clearTimeout(MINI_TIMEOUT_ID);
        }

        let element = document.getElementsByClassName("hourly-item focused");
        let id = element[0].parentElement.id;
        //const container = document.querySelector("#hourly-container");
        const container = document.querySelector(`#${id}`);

        let count = container.children;
        let right_counter = 0;

        for (let i = 0; i < count.length; i++) {
          if (container.children[i].className === "hourly-item focused") {
            right_counter = i;

            break;
          }
        }

        for (let i = 0; i < count.length - 1; i++) {
          if (i === right_counter) {
            container.children[i].classList.remove("focused");
            right_counter++;
            container.children[right_counter].classList.add("focused");
            var focuseEl = document.getElementsByClassName(
              "hourly-item focused",
            );

            container.children[right_counter].scrollIntoView(false);
            container.children[right_counter].scrollIntoView({
              block: "start",
            });
            container.children[right_counter].scrollIntoView({
              behavior: "smooth",
              block: "start",
              inline: "nearest",
            });

            break;
          }
        }
        break;
      case 40: //DOWN arrow
        //console.log("currI ndex", currentIndex, "item lenght ", items.length);

        if (wvideo.classList.contains("full-screen")) return;
        if (currentIndex < items.length - 1) {
          currentIndex++;
          updateHighlight(currentIndex);
        }

        break;

      case 10009: //back button
        if (
          popupVisibilitybyId("weatherPage") &&
          document
            .getElementById("weather-video")
            .classList.contains("full-screen")
        ) {
          const video = document.getElementById("weather-video");
          video.classList.remove("full-screen");
          video.classList.add("weatherVideo");
          video.classList.add("weather-video-focused");
          //weatherPageKeyEvents.fullscreen = false;
          // throw new Error("Minimized video!");
        } else {
          weatherPageKeyEvents.fullscreen = false;
          closeWeather();
          videoElement.play();
        }
        break;

      case 19: //Media Pause
        status.style.display = "block";
        status.textContent = "Play";
        wvideo.pause();
        break;

      case 415: // Media Play trick play
        if (wvideo.paused) {
          status.style.display = "none";
          wvideo.play();
        }

        break;

      case 413: //stop
        wvideo.pause();
        wvideo.currentTime = 0;
        status.textContent = "Play";
        status.style.display = "block";
        break;

      case 10252:
        const MediaPlayPause = document.getElementById("play");
        if (videoElement.paused) {
          MediaPlayPause.textContent = "Pause";
          videoElement.play();
        } else {
          MediaPlayPause.textContent = "Play";
          videoElement.pause();
        }
        var skn = document.getElementById("skin");
        skn.style.display = "block";
        videoElement.addEventListener("timeupdate", updateProgress);
        setTimeout(() => {
          skn.style.display = "none";
        }, 5000);
        break;

      default:
        console.log("Key code : " + e.keyCode);
        break;
    }
  });
}

var ctr = {
  counter: 0,
};

function updateHighlight(index) {
  items.forEach((item, idx) => {
    // item.classList.remove("focused");

    if (idx === 1) {
      const hitem = document.querySelector("#hourly-container");
      const week = document.querySelector("#weekly");
      for (let i = 0; i < hitem.children.length; i++) {
        hitem.children[i].classList.remove("focused");
      }
      for (let j = 0; j < week.children.length; j++) {
        week.children[j].classList.remove("focused");
      }
    }
    if (item.childElementCount > 0) {
      item.children[0].classList.remove("focused");
    } else {
      item.classList.remove("focused");
    }
  });
  const weather_video = document.getElementById("weather-video");
  if (weather_video.classList.contains("weather-video-focused")) {
    weather_video.classList.remove("weather-video-focused");
  }

  if (index !== 0) items[index].children[0].classList.add("focused");

  items[index].children[0].scrollIntoView(true);
  items[index].children[0].scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
  // items[index].scrollIntoView({
  //   behavior: "instant",
  //   block: "start",
  //   //inline: "nearest",
  // });
}

function addVideoFocuse() {
  const weather_video = document.getElementById("weather-video");
  if (!weather_video.classList.contains("weather-video-focused")) {
    weather_video.classList.add("weather-video-focused");
  }
}
