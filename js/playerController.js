function maximizePlayer() {
  const subtitleContainer = document.getElementById("subtitleContainer");
  subtitleContainer.innerHTML = "";

  let mini = document.getElementById("mini-player");
  if (mini) mini.classList.remove("mini-player");
  const video = document.getElementById("video");
  const custoDialog = document.getElementById("customDialog");
  custoDialog.classList.remove("video-dialog-mini");
  custoDialog.classList.add("video-dialog");
  video.classList.remove("videoClass");
  video.setAttribute("height", "1080");
  video.setAttribute("width", "100%");

  if (video) video.setAttribute("mini-player", "false");
  let skin = document.getElementById("skin");
  skin.classList.add("video-skin");
  skin.children[0].style.display = "block";
  document.getElementById("ctr").style.display = "block";
  document.getElementById("cc").style.display = "block";
  document.getElementById("title").display = "none";
  ///////////// SETTING FOCUSE ON PLYING ITEM WEHN CLICKED ON MINI PLAYER TO MAXIMIZE IT
  const itemid = sessionStorage.getItem("itemId");
  const item = document.getElementById(itemid);
  item.classList.add("focused");

  ///////////////

  return;
}

function checkMaxPlayer() {
  const miniPlayer = document.getElementById("video");
  if (miniPlayer.getAttribute("mini-player") == "false") {
    return false;
  } else {
    return true;
  }
}

function miniPlayer(cb) {
  //subtitleOnOff();
  const subtitleContainer = document.getElementById("subtitleContainer");
  subtitleContainer.innerHTML = "";

  let customDialog = document.getElementById("customDialog");
  customDialog.classList.remove("video-dialog");
  customDialog.classList.add("video-dialog-mini");

  let video = document.getElementById("video");
  // video.setAttribute("height", "280");
  // video.setAttribute("width", "500");
  video.setAttribute("height", "auto"); //527
  video.setAttribute("width", "950");
  //video.setAttribute("class", "videoClass");
  video.classList.add("videoClass");
  video.setAttribute("mini-player", true);
  document.getElementById("ctr").style.display = "none";
  let skin = document.getElementById("skin");
  skin.classList.remove("video-skin");
  skin.children[0].style.display = "none";
  var ply = document.getElementById("play");
  if (videoElement.paused && ply.textContent == "Play") {
    ply.textContent = "Pause";
    videoElement.play();
  }
  let videoTitle = sessionStorage.getItem("video_title");
  document.getElementById(
    "title",
  ).innerHTML = `<span class="video_title">Currently Playing: ${videoTitle}</span>`;
  // <img style="margin-left:-12px;margin-top:10px;" src="./images/white_line.png">
  if (!videoElement.paused) {
    cb();
  }
  if (fatalError) {
    mediaError();
  } else {
    removeMediaError();
  }
}
