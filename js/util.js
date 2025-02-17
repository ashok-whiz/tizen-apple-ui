const userNavigation = () => {
  // registerKey();
  let selectedItem = document.getElementsByClassName("item focused");
  let selectedTitle = selectedItem[0].attributes["video_title"].nodeValue;
  let id = selectedItem[0].attributes["id"].nodeValue;

  // setting left image of header
  /*
  const icon_uri = document.getElementById("thumb" + id).src;
  document.documentElement.style.setProperty(
    "--bg-image",
    `url('${icon_uri}')`,
  );
  */
  document.getElementById(
    "selected-item",
  ).innerHTML = `<span class="selected-item">${selectedTitle}</span>`;
};

const weatherNminivideoFocuse = (dnleftKey) => {
  const isWheather = document.getElementById("weather-icon");
  const miniVideo = document.getElementById("video");
  if (isWheather.classList.contains("focused")) {
    isWheather.classList.remove("focused");
    const itemid = dnleftKey.children[0].children[1].id;
    const selectedItem = document.getElementById(itemid);

    selectedItem.classList.add("focused");
    document.getElementById("selected-item").innerHTML = "";
    selectedItem.scrollIntoView(true);
    return;
  } else if (miniVideo.classList.contains("focused")) {
    miniVideo.classList.remove("focused");
    miniVideo.classList.add("videoClass");
    const itemid = dnleftKey.children[0].children[1].id;
    const selectedItem = document.getElementById(itemid);
    selectedItem.classList.add("focused");
    selectedItem.scrollIntoView(true);
    return;
  }
};

function registerKey() {
  document.addEventListener("keydown", function (e) {
    tizen.tvinputdevice.registerKey("MediaPlayPause");
    tizen.tvinputdevice.registerKey("MediaPlay");
    tizen.tvinputdevice.registerKey("MediaStop");
    tizen.tvinputdevice.registerKey("MediaPause");
    tizen.tvinputdevice.registerKey("MediaRewind");
    tizen.tvinputdevice.registerKey("MediaFastForward");
    tizen.tvinputdevice.registerKey("Exit");

    switch (e.keyCode) {
      case 37: //LEFT arrow
        const miniv = document.getElementById("video");
        if (miniv.className === "focused") {
          const weather = document.getElementById("weather-icon");
          miniv.classList.remove("focused");
          weather.classList.add("focused");
        }
        break;

      case 38: //UP arrow
        break;

      case 39: //RIGHT arrow
        const weather = document.getElementById("weather-icon");
        if (weather.className === "focused") {
          weather.classList.remove("focused");
          const video = document.getElementById("video");
          video.classList.add("focused");
          // document.getElementById(
          //   "selected-item",
          // ).innerHTML = `<span class="selected-item">Tap to full screen...</span>`;
        }

        break;

      case 40: //DOWN arrow
        break;
      // case 13: //OK button
      //   break;
      case 10009: //RETURN button
        break;
      case 10182: //Exit button
        terminate();
        break;

      case 19: //Media Pause
        break;

      case 415: // Media Play trick play
        break;
      case 412: // Rewind trick play
        break;
      case 417: //fast forword (trick key)
        break;
      case 10252:
        break;

      default:
        console.log("Key code : " + e.keyCode);
        break;
    }
  });
}

// Example: Set a dynamic video URL
//#const dynamicVideoUrl = 'https://example.com/path/to/your/video.mp4';
//#setVideoSource(dynamicVideoUrl);
// playing weather video eof mp4

// Example: Set a dynamic HLS video URL
// const dynamicHlsUrl = 'https://example.com/path/to/your/playlist.m3u8';
// setHlsVideoSource(dynamicHlsUrl);
function downloadAndSaveImage(imageUrl, fileName) {
  console.log("in download functino", imageUrl);
  fetch(imageUrl)
    .then((response) => response.blob())
    .then((blob) => {
      tizen.filesystem.resolve(
        "images",
        (dir) => {
          let file = dir.createFile(fileName);
          if (file) {
            file.openStream(
              "w",
              (fs) => {
                fs.write(blob);
                fs.close();
                console.log("Image saved successfully!");
              },
              (e) => console.error("Error writing file:", e),
            );
          }
        },
        (error) => console.error("File system error:", error),
        "rw",
      );
    })
    .catch((error) => console.error("Download failed:", error));
}
