var hls;
var VIDEO_GROUP;
var MINIVIDEO = false;
var PLAYING;
var MINI_TIMEOUT_ID;

function openMiniVideoDialog(stream_url, asset_key, video_group, cid, itid) {
  PLAYING = `note${itid}`;
  const videoOverlay = document.getElementById("videoPopup");
  VIDEO_GROUP = video_group;
  videoOverlay.style.display = "block";
  const custoDialog = document.getElementById("customDialog");
  custoDialog.classList.remove("video-dialog");
  custoDialog.classList.add("video-dialog-mini");
  const referenceNode = document.getElementById("subtitleContainer");
  const video = document.createElement("video");
  video.setAttribute("id", "video");
  // video.setAttribute("height", "280");
  // video.setAttribute("width", "500");
  video.setAttribute("height", "520"); //520/509
  video.setAttribute("class", "videoClass");
  video.setAttribute("width", "928"); //924

  video.setAttribute("itemid", itid);
  video.setAttribute("mini-player", true);

  insertAfter(referenceNode, video);

  let skin = document.getElementById("skin");
  skin.classList.remove("video-skin");
  skin.children[0].style.display = "none";
  document.getElementById("ctr").style.display = "none"; //none
  document.getElementById("subtitleContainer").style.display = "none";
  document.getElementById("cc").style.display = "none";
  let videoTitle = sessionStorage.getItem("video_title");
  document.getElementById(
    "title",
  ).innerHTML = `<span class="video_title">Currently Playing: ${videoTitle}</span>`;
  //<img style="margin-left:-12px;margin-top:10px;" src="./images/white_line.png">
  subtitleOnOff();

  //ad macro vast url bof

  try {
    ADMACRO.__TIMESTAMP__ = Date.now();
    AD_TAG = AD_TAG.replace(
      "__APP_NAME__",
      `${encodeURI(ADMACRO.__APP_NAME__)}`,
    );
    AD_TAG = AD_TAG.replace(
      "__APP_BUNDLE__",
      `${encodeURI(ADMACRO.__APP_BUNDLE__)}`,
    );
    AD_TAG = AD_TAG.replace(
      "__USER_AGENT__",
      `${encodeURI(ADMACRO.__USER_AGENT__)}`,
    );
    AD_TAG = AD_TAG.replace("__IP__", `${encodeURI(ADMACRO.__IP__)}`);
    AD_TAG = AD_TAG.replace(
      "__TIMESTAMP__",
      `${encodeURI(ADMACRO.__TIMESTAMP__)}`,
    );
    AD_TAG = AD_TAG.replace(
      "__DEVICE_ID__",
      `${encodeURI(ADMACRO.__DEVICE_ID__)}`,
    );
    if (ADMACRO.__RDP__) {
      //ccpa
      AD_TAG = AD_TAG.replace("__US_PRIVACY__", `${encodeURI("1YYN")}`);
    } else {
      AD_TAG = AD_TAG.replace("__US_PRIVACY__", `${encodeURI("1YNN")}`);
    }
  } catch (e) {
    console.log("catc ADD TAG", AD_TAG, e.message);
  }
  //ad macro url eof

  if (video_group === "vod") {
    const subtitleContainer = document.getElementById("subtitleContainer");
    subtitleContainer.style.display = "none";
    subtitleContainer.innerHTML = "";
    initPlayer(stream_url, asset_key, AD_TAG, cid);
    console.log("---------- VOD PLAYING... --------");
  } else if (video_group === "live" && asset_key !== undefined) {
    const subtitleContainer = document.getElementById("subtitleContainer");
    subtitleContainer.style.display = "none";
    subtitleContainer.innerHTML = "";
    //initLivePlayer(stream_url, asset_key); //No preroll only DAI
    initPlayer(stream_url, asset_key, AD_TAG, cid); // With preroll & DAI Ads
    console.log("---------- LIVE PLAYING... --------");
  }

  let t = setTimeout(() => {
    document.getElementById(itid).classList.add("focused");
  }, 1000);

  videoElement.addEventListener("playing", function () {
    MINI_TIMEOUT_ID = setTimeout(() => {
      //# maximizePlayer();
    }, 15000);
  });

  videoElement.addEventListener("playing", function () {
    const plyingNow = document.getElementById(PLAYING);
    plyingNow.classList.add("notify-badge");
    plyingNow.textContent = "Now Playing";
    localStorage.setItem("played", PLAYING);
  });
}

function closeMiniVideoDialog() {
  var videoOverlay = document.getElementById("videoPopup");
  var videoElement = document.getElementById("video"); ///experimental
  if (!videoElement) return;
  if (adsManager) {
    adsManager.destroy();
  }
  //document.getElementById("adUi").remove();
  // removeVideoCotrolFocuse(); // remove all focued controlls.
  videoElement.remove();
  hls.detachMedia();
  hls.destroy();
  MINIVIDEO = false;
  hls = new Hls({
    debug: false,
    enableCEA708Captions: true,
    enableCEA608Captions: true,
    enableWebVTT: true,
    enableIMSC1: true,
  });

  if (hls.media) {
    hls.detachMedia();
  }
  videoOverlay.style.display = "none";
}

function miniVideo(video_url, daiAssetKey, video_group, catId, itemid) {
  if (video_group === "vod") {
    //localStorage.setItem("videoPlayed", true);
    localStorage.setItem("focuseFirstItem", true);
    //localStorage.setItem("cc", false); //DO NOT SET IT TO TRUE ON LAUNC , INSTEAD READ PREVIOUS VALUE
    CCDisplay();
    openMiniVideoDialog(video_url, daiAssetKey, video_group, catId, itemid);
  } else if (video_group === "live") {
    //set localstorage
    //localStorage.setItem("videoPlayed", true);
    sessionStorage.setItem("itemId", itemid);
    localStorage.setItem("focuseFirstItem", true);
    //localStorage.setItem("cc", false); //DO NOT SET IT TO TRUE ON LAUNC , INSTEAD READ PREVIOUS VALUE
    CCDisplay();
    openMiniVideoDialog(video_url, daiAssetKey, video_group, catId, itemid);
  }
}

function CCDisplay() {
  let cc = document.getElementById("cc");
  const subEl = document.getElementById("subtitleContainer");

  const ccLocal = localStorage.getItem("cc");
  if (subEl.style.display === "none") {
    if (ccLocal === "true") {
      subEl.style.display = "block";
      cc.textContent = "CC off";
    }
  } else {
    if (ccLocal !== "true" || ccLocal === undefined) {
      subEl.style.display = "none";
      cc.textContent = "CC on";
    }
  }
}
