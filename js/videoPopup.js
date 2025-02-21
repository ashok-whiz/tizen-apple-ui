//registerPopupKeyHandler();

var hls;
var VIDEO_GROUP;
var INTERVAL_ID;
function openVideoDialog(
  stream_url,
  asset_key,
  video_group,
  cid,
  itid,
  video_title,
  category_name,
  guid,
) {
  const STRAM_URL = stream_url;
  removeMediaError(); //removeing error dom element if it is there.
  // ad macro
  try {
    ADMACRO.__TIMESTAMP__ = Date.now();
    stream_url = stream_url.replace(
      /__(.*?)__/g,
      (match) => ADMACRO[match] || "",
    );
    /*
    stream_url = stream_url.replace("__APP_NAME__", `${ADMACRO.__APP_NAME__}`);
    stream_url = stream_url.replace(
      "__APP_BUNDLE__",
      `${encodeURI(ADMACRO.__APP_BUNDLE__)}`,
    );
    stream_url = stream_url.replace(
      "__USER_AGENT__",
      `${encodeURI(ADMACRO.__USER_AGENT__)}`,
    );
    stream_url = stream_url.replace("__IP__", `${encodeURI(ADMACRO.__IP__)}`);
    stream_url = stream_url.replace(
      "__TIMESTAMP__",
      `${encodeURI(ADMACRO.__TIMESTAMP__)}`,
    );
    stream_url = stream_url.replace(
      "__DEVICE_ID__",
      `${encodeURI(ADMACRO.__DEVICE_ID__)}`,
    );
    */
  } catch (e) {
    console.log(e.message);
  }
  // ad mocro eof

  const videoOverlay = document.getElementById("videoPopup");
  VIDEO_GROUP = video_group;
  videoOverlay.style.display = "block";

  const custoDialog = document.getElementById("customDialog");
  custoDialog.classList.remove("video-dialog-mini");
  custoDialog.classList.add("video-dialog");
  custoDialog.removeAttribute("style");

  const referenceNode = document.getElementById("subtitleContainer");
  const video = document.createElement("video");
  video.setAttribute("id", "video");
  video.setAttribute("height", "1080");
  video.setAttribute("width", "100%");
  video.setAttribute("itemid", itid);
  video.setAttribute("mini-player", false);

  insertAfter(referenceNode, video);

  /* prevent controls appear befor video play*/

  /*
  let skin = document.getElementById("skin");
  skin.classList.add('video-skin');
  skin.children[0].style.display = "block";
  document.getElementById("ctr").style.display = "block";
  document.getElementById("cc").style.display='block';

  */

  //--subtitleOnOff();

  //ad macro url vast tag bof
  try {
    ADMACRO.__TIMESTAMP__ = Date.now();
    AD_TAG = AD_TAG.replace(/__(.*?)__/g, (match) => ADMACRO[match] || "");
    /*
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
    */
  } catch (e) {
    console.log(e.message);
  }
  //ad macro url eof

  clearInterval(INTERVAL_ID);
  if (video_group === "vod") {
    const subtitleContainer = document.getElementById("subtitleContainer");
    subtitleContainer.style.display = "none";
    subtitleContainer.innerHTML = "";

    sessionStorage.setItem("cid", cid);

    initPlayer(stream_url, asset_key, AD_TAG, cid);

    VideoPlayed(
      "VideoPlayed",
      STRAM_URL.substr(-100),
      video_title,
      category_name,
      video_group,
      "Home Page",
      "DIRECT",
      guid,
      LOCATION,
      BRAND,
      APP_VERSION,
    );

    var SENT = false;
    videoElement.addEventListener("timeupdate", (event) => {
      if (videoElement.duration > 0) {
        let seconds = Math.floor(videoElement.currentTime);
        let percent = (videoElement.currentTime / videoElement.duration) * 100;

        const P = Math.floor(percent);

        if (
          (P == 10 && !SENT) ||
          (P == 25 && !SENT) ||
          (P == 50 && !SENT) ||
          (P == 75 && !SENT) ||
          (P == 100 && !SENT)
        ) {
          const vod = {
            event: "VideoProgress",
            item_name: video_title,
            item_id: STRAM_URL.substr(-100),
            item_category: category_name,
            content_type: video_group,
            method: "Home Page",
            source: "DIRECT",
            whiz_guid: guid,
            video_current_time: seconds,
            video_percent: P,
            location: LOCATION,
            item_brand: BRAND,
            app_version: APP_VERSION,
          };

          VideoProgress(
            vod.event,
            vod.item_name,
            vod.item_id,
            vod.item_category,
            vod.content_type,
            vod.method,
            vod.source,
            vod.whiz_guid,
            vod.video_current_time,
            vod.video_percent,
            vod.location,
            vod.item_brand,
            vod.app_version,
          );
          SENT = true;
          //console.log("Event sent to ga ", percent, seconds);
          if (SENT) {
            setTimeout(() => {
              SENT = false;
            }, 25000);
          }
        }
      }
    });

    //analytics eof

    console.log("---------- VOD PLAYING... --------");
  } else if (video_group === "live" && asset_key !== undefined) {
    const subtitleContainer = document.getElementById("subtitleContainer");
    subtitleContainer.style.display = "none";
    subtitleContainer.innerHTML = "";
    //initLivePlayer(stream_url, asset_key); //No preroll only DAI
    sessionStorage.setItem("cid", cid);
    initPlayer(stream_url, asset_key, AD_TAG, cid); // With preroll & DAI Ads

    //analytics bof
    //removeInterval();
    VideoPlayed(
      "VideoPlayed",
      STRAM_URL.substr(-100),
      video_title,
      category_name,
      video_group,
      "Home Page",
      "DIRECT",
      guid,
      LOCATION,
      BRAND,
      APP_VERSION,
    );

    var videoTime = 0;
    INTERVAL_ID = setInterval(function () {
      //let secconds = videoProgressLive(); not in use since 3 sencods diffrnece.
      videoTime += 300;
      const live = {
        event: "VideoProgress",
        item_name: video_title,
        item_id: STRAM_URL.substr(-100),
        item_category: category_name,
        content_type: video_group,
        method: "Home Page",
        source: "DIRECT",
        whiz_guid: guid,
        video_current_time: videoTime,
        video_percent: "N/A",
        location: LOCATION,
        item_brand: BRAND,
        app_version: APP_VERSION,
      };

      VideoProgress(
        live.event,
        live.item_name,
        live.item_id,
        live.item_category,
        live.content_type,
        live.method,
        live.source,
        live.whiz_guid,
        live.video_current_time,
        live.video_percent,
        live.location,
        live.item_brand,
        live.app_version,
      );
    }, 300000);

    //analytics eof
    console.log("---------- LIVE PLAYING... --------");
  } else if (video_group.toLowerCase() === "sponsored") {
    const subtitleContainer = document.getElementById("subtitleContainer");
    subtitleContainer.style.display = "none";
    subtitleContainer.innerHTML = "";
    initPlayer(stream_url, asset_key, AD_TAG, cid);
    //analytics bof
    VideoPlayed(
      "VideoPlayed",
      STRAM_URL.substr(-100),
      video_title,
      category_name,
      video_group,
      "Home Page",
      "DIRECT",
      guid,
      LOCATION,
      BRAND,
      APP_VERSION,
    );
    INTERVAL_ID = setInterval(function () {
      let secs = videoProgressVod();
      const spon = {
        event: "VideoProgress",
        item_name: video_title,
        item_id: STRAM_URL.substr(-100),
        item_category: category_name,
        content_type: video_group,
        method: "Home Page",
        source: "DIRECT",
        whiz_guid: guid,
        video_current_time: secs.seconds,
        video_percent: secs.percent,
        location: LOCATION,
        item_brand: BRAND,
        app_version: APP_VERSION,
      };
      VideoProgress(
        spon.event,
        spon.item_name,
        spon.item_id,
        spon.item_category,
        spon.content_type,
        spon.method,
        spon.source,
        spon.whiz_guid,
        spon.video_current_time,
        spon.video_percent,
        spon.location,
        spon.item_brand,
        spon.app_version,
      );
    }, 300000);
    //analytics eof
    console.log("---------- SPONSORED PLAYING... --------");
  }

  // putting badge on video

  if (localStorage.getItem("played")) {
    let removeIt = localStorage.getItem("played");
    if (removeIt !== itid)
      document.getElementById(removeIt).style.display = "none";
  }
  const plyingNow = document.getElementById("note" + itid);
  plyingNow.classList.add("notify-badge");
  plyingNow.textContent = "Now Playing";
  plyingNow.style.display = "block";
  localStorage.setItem("played", "note" + itid);
  document.getElementById("controls").style.display = "block";

  // badge on video eof
}

function closeVideoDialog() {
  var videoOverlay = document.getElementById("videoPopup");
  var videoElement = document.getElementById("video"); ///experimental

  if (adsManager) {
    adsManager.destroy();
  }
  removeVideoCotrolFocuse(); // remove all focued controlls.
  document.getElementById("play").classList.add("focuse");
  const ctr = document.getElementById("ctr");
  ctr.style.display = "none";
  videoElement.remove();

  hls.detachMedia();
  hls.destroy();
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

  let firstItem = localStorage.getItem("focuseFirstItem");
  if (firstItem === "true") {
    const catId = localStorage.getItem("CAT_ID");
    // const item = document.getElementById(catId);
    // item.children[1].classList.add("focused");
    localStorage.setItem("focuseFirstItem", false);
  }
  // displying element properly specially last row after closing video
  const focuseEl = document.getElementsByClassName("item focused");
  const setfocus = focuseEl[0].attributes["id"].nodeValue;
  const focusedElement = document.getElementById(setfocus);
  focusedElement.scrollIntoView({
    block: "center",
  });
}

function registerPopupKeyHandler() {
  document.addEventListener("keydown", function (e) {
    // tizen.tvinputdevice.registerKey("MediaPlayPause");
    // tizen.tvinputdevice.registerKey("MediaPlay");
    // tizen.tvinputdevice.registerKey("MediaStop");
    // tizen.tvinputdevice.registerKey("MediaPause");
    // tizen.tvinputdevice.registerKey("MediaRewind");
    // tizen.tvinputdevice.registerKey("MediaFastForward");
    // tizen.tvinputdevice.registerKey("Exit");
    const videoPopUp = isVideoHidden(document.getElementById("video"));
    if (!videoPopUp) return; // Return to Video popup for actions.

    switch (e.keyCode) {
      case 10009: //RETURN button
        //closeVideoDialog();

        break;
      case 66: //RETURN button
        openVideoDialog("url");
        break;
      case 27:
        closeVideoDialog();
        break;
      case 13: //ok
        let video_url;
        let video_group;
        let daiAssetKey;

        let element = document.getElementsByClassName("item focused");

        //video_url = element[0].id;
        video_url = element[0].attributes["videoUrl"].nodeValue;
        itemid = element[0].attributes["id"].nodeValue;
        catId = element[0].attributes["catId"].nodeValue;
        daiAssetKey = element[0].attributes["daiassetkey"].nodeValue;
        video_group = element[0].attributes["video_group"].nodeValue;
        openVideoDialog(video_url, daiAssetKey);

        break;

      case 37: //left arrow
        let okf = document.getElementById("popup-ok");
        okf.classList.remove("popup-focused");
        let cancel = document.getElementById("popup-cancel");
        cancel.classList.add("popup-focused");
        cancel.focus();
        break;

      case 39: //right arrow
        let cancelf = document.getElementById("popup-cancel");
        cancelf.classList.remove("popup-focused");
        let ok = document.getElementById("popup-ok");
        ok.classList.add("popup-focused");
        ok.focus();

        break;
      default:
        console.log("Key code : " + e.keyCode);
        break;
    }
  });
}

// Function to flush the previously loaded video

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function subtitleOnOff() {
  //Not in use currently 26/7/24
  let CC = localStorage.getItem("cc");
  let cc = document.getElementById("cc");
  const video = document.getElementById("video");
  if (CC === "true") {
    enableCc("cc");
    // const subEl = document.getElementById("subtitleContainer");
    // subEl.style.display = "block";
    hls.subtitleTrack = 0;
    hls.subtitleDisplay = true;
    cc.textContent = "CC off";
    localStorage.setItem("cc", true);
  } else if (CC === "false") {
    hls.subtitleTrack = -1;
    hls.subtitleDisplay = false;
    cc.textContent = "CC on";
    localStorage.setItem("cc", false);
  }

  // else {
  //   hls.subtitleTrack = -1;
  //   hls.subtitleDisplay = false;
  //   cc.textContent = "CC on";
  //   localStorage.setItem("cc", false);
  // }
}

function intervalId() {
  return new Promise((resolve) => {
    // setTimeout(() => {
    //   resolve('resolved');
    // }, 2000);

    resolve(localStorage.removeItem("intervalId"));
  });
}

async function removeInterval() {
  const result = await intervalId();
  console.log(result);
  clearInterval(result);
  // Expected output: "resolved"
}
