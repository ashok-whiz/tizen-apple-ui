var CC_SETTINGS;

var VIDEO_PLAYED = false;
var AD_PLYING = false;
var timeout = [];
var BACKUP_STREAM = "";
var TEST_ASSET_KEY = "";
var AD_TAG;
var INIT_PLAYER = true; // to prevend return key to exit loading /video
var fatalError = "";

//var isLive;
// StreamManager which will be used to request ad-enabled streams.
var streamManager; // used to request ad-enabled streams.

let adsLoader;
let adDisplayContainer;
//let adsManager;
var adsManager;
var languageDiv = document.getElementById("captionSettingsPopup-language");

var hls = new Hls({
  debug: false,
  enableCEA708Captions: true,
  enableCEA608Captions: true,
  enableWebVTT: true,
  enableIMSC1: true,
  enableSid: true,
  // lowLatencyMode: false,
  // maxBufferLength: 30,
  // maxMaxBufferLength: 60,
  // liveDurationInfinity: true,
});
//hls.config.maxBufferLength = 30;
// Ad UI element
let adUiElement;

// Whether the stream is currently in an ad break.
let isAdBreak;

var CC = localStorage.getItem("cc");

if (CC === "true") {
  hls.subtitleTrack = 0;
  hls.subtitleDisplay = true;
} else {
  hls.subtitleTrack = -1;
  hls.subtitleDisplay = false;
}

var CCENABLED = true;
var videoElement;
var clickElement;
var CURRENT_TIME;

/**
 * Initializes the video player.
 */
function initPlayer(stream_url, asset_key, AD_TAG, cid) {
  if (asset_key === "null") {
    asset_key = "";
  }
  BACKUP_STREAM = stream_url;
  TEST_ASSET_KEY = asset_key;
  //pre-roll ads
  let sectionAd;
  sectionAd = SECTION_AD.filter((section) => {
    if (section.id === cid) {
      return section.adUrl;
    }
  });
  //if section targete ads available then use it else get it from config.
  if (sectionAd.length) {
    AD_TAG = sectionAd[0].adUrl;
  } else {
    AD_TAG = AD_TAG;
  }

  videoElement = document.getElementById("video");

  videoElement.controls = false;
  adUiElement = document.getElementById("adUi");
  videoElement.addEventListener("pause", onStreamPause);
  videoElement.addEventListener("play", onStreamPlay);
  streamManager = new google.ima.dai.api.StreamManager(
    videoElement,
    adUiElement,
  );
  streamManager.addEventListener(
    [
      google.ima.dai.api.StreamEvent.Type.LOADED,
      google.ima.dai.api.StreamEvent.Type.ERROR,
      google.ima.dai.api.StreamEvent.Type.FIRST_QUARTILE,
      google.ima.dai.api.StreamEvent.Type.MIDPOINT,
      google.ima.dai.api.StreamEvent.Type.THIRD_QUARTILE,
      google.ima.dai.api.StreamEvent.Type.COMPLETE,
      google.ima.dai.api.StreamEvent.Type.AD_PROGRESS,
      google.ima.dai.api.StreamEvent.Type.AD_BREAK_STARTED,
      google.ima.dai.api.StreamEvent.Type.AD_BREAK_ENDED,
    ],
    onStreamEvent,
    false,
  );

  // Client side ads setup.
  adDisplayContainer = new google.ima.AdDisplayContainer(
    document.getElementById("adContainer"),
    videoElement,
  );
  // Must be done as the result of a user action on mobile
  adDisplayContainer.initialize();
  adsLoader = new google.ima.AdsLoader(adDisplayContainer);
  adsLoader.addEventListener(
    google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
    onAdsManagerLoaded,
    false,
  );
  adsLoader.addEventListener(
    google.ima.AdErrorEvent.Type.AD_ERROR,
    onAdError,
    false,
  );

  // Add metadata listener. Only used in LIVE streams. Timed metadata
  // is handled differently by different video players, and the IMA SDK provides
  // two ways to pass in metadata, StreamManager.processMetadata() and
  // StreamManager.onTimedMetadata().
  //
  // Use StreamManager.onTimedMetadata() if your video player parses
  // the metadata itself.
  // Use StreamManager.processMetadata() if your video player provides raw
  // ID3 tags, as with hls.js.
  hls.on(Hls.Events.FRAG_PARSING_METADATA, function (event, data) {
    if (streamManager && data) {
      data.samples.forEach(function (sample) {
        streamManager.processMetadata("ID3", sample.data, sample.pts);
      });
    }
  });

  // hls.on(Hls.Events.LEVEL_LOADED, function (event, data) {
  //   const isLive = data.details.live;
  //       if (isLive) {
  //     console.log("The stream is live.");
  //   } else {
  //     console.log("The stream is VOD.");
  //   }
  // });

  //--playButton.addEventListener("click", initiatePlayback);
  if (AD_TAG !== "undefined") {
    initiatePlayback(AD_TAG);
  }
}

/**
 * Initiate stream playback.
 */
function initiatePlayback(AD_TAG) {
  requestPreroll(AD_TAG);
}

/**
 * Initiate pre-roll playback after ad click-through.
 */
function resumePrerollPlayback() {
  adsManager.resume();
  // playButton.removeEventListener("click", resumePrerollPlayback);
  // playButton.style.display = "none";
}

/**
 * Handles an ad error (client side ads).
 * @param {!google.ima.dai.api.AdErrorEvent} adErrorEvent
 */
function onAdError(adErrorEvent) {
  console.log(adErrorEvent.getError());

  if (adsManager) {
    adsManager.destroy();
  }

  /////////
  adDisplayContainer.destroy();
  document.getElementById("adContainer").style.display = "none";
  document.getElementById("controls").style.display = "block";
  loadUrl(BACKUP_STREAM);
}

/**
 * Handles the adsManagerLoaded event (client side ads).
 * @param {!google.ima.dai.api.AdsManagerLoadedEvent} adsManagerLoadedEvent
 */
function onAdsManagerLoaded(adsManagerLoadedEvent) {
  adsManager = adsManagerLoadedEvent.getAdsManager(videoElement);
  adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError);
  adsManager.addEventListener(
    google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
    function (e) {
      console.log("Content pause requested.");
      AD_PLYING = true;
      INIT_PLAYER = false;

      document.getElementById("controls").style.display = "none";
    },
  );
  adsManager.addEventListener(
    google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
    function (e) {
      console.log("Content resume requested.");
      AD_PLYING = false;

      requestLiveStream(TEST_ASSET_KEY, null);
    },
  );
  adsManager.addEventListener(google.ima.AdEvent.Type.PAUSED, function (e) {
    console.log("Preroll paused.");
    // playButton.addEventListener("click", resumePrerollPlayback);
    //playButton.style.display = "block";
  });
  adsManager.addEventListener(
    google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
    function (e) {
      console.log("All pre-roll ads completed.");
      adDisplayContainer.destroy();
      document.getElementById("adContainer").style.display = "none";
      document.getElementById("controls").style.display = "block";
    },
  );

  try {
    adsManager.init(640, 360, google.ima.ViewMode.NORMAL);
    adsManager.start();
  } catch (adError) {
    console.log(adError);
    adDisplayContainer.destroy();
    document.getElementById("adContainer").style.display = "none";
    document.getElementById("controls").style.display = "block";
    // An error may be thrown if there was a problem with the VAST response.
  }
}

/**
 * Requests a preroll ad using the client side SDK.
 * @param {string} adTagUrl
 */
function requestPreroll(adTagUrl) {
  const adsRequest = new google.ima.AdsRequest();
  adsRequest.adTagUrl = adTagUrl;
  adsRequest.linearAdSlotWidth = 1920; //640;
  adsRequest.linearAdSlotHeight = 1080; //400;
  adsLoader.requestAds(adsRequest);
}

/**
 * Requests a Live stream with ads.
 * @param {string} assetKey
 * @param {?string} apiKey
 */
function requestLiveStream(assetKey, apiKey) {
  const streamRequest = new google.ima.dai.api.LiveStreamRequest();
  streamRequest.assetKey = assetKey;
  streamRequest.apiKey = apiKey || "";
  streamManager.requestStream(streamRequest);
}

/**
 * Responds to a stream event.
 * @param {!google.ima.dai.api.StreamEvent} e
 */
function onStreamEvent(e) {
  switch (e.type) {
    case google.ima.dai.api.StreamEvent.Type.LOADED:
      console.log("Stream loaded");
      loadUrl(e.getStreamData().url);
      break;
    case google.ima.dai.api.StreamEvent.Type.ERROR:
      console.log("Error loading stream, playing backup stream." + e);
      loadUrl(BACKUP_STREAM);
      break;
    case google.ima.dai.api.StreamEvent.Type.AD_BREAK_STARTED:
      console.log("Ad Break Started");
      isAdBreak = true;
      videoElement.controls = false;
      adUiElement.style.display = "block";
      break;
    case google.ima.dai.api.StreamEvent.Type.AD_BREAK_ENDED:
      console.log("Ad Break Ended");
      isAdBreak = false;
      videoElement.controls = true;
      adUiElement.style.display = "none";
      break;
    default:
      break;
  }
}

function loadUrl(url) {
  // console.log("Loading URL", url);
  hls.loadSource(url);

  hls.attachMedia(videoElement);

  var skin = document.getElementById("skin");
  skin.style.display = "none";

  //videoElement.addEventListener("loadedmetadata", disableCc);
  videoElement.addEventListener("loadedmetadata", () => {});
  var flag = 1;
  hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
    //videoLog(); //log video information.
    // Subtitle tracks are now available
    const Trak = hls.allSubtitleTracks;
    const tk = hls.subtitleTracks;
    var subtitleTracks = hls.allSubtitleTracks; //hls.subtitleTracks;
    //console.log("-------", subtitleTracks.length);

    if (flag > 0) {
      if (subtitleTracks && subtitleTracks.length > 0) {
        subtitleTracks.forEach(function (track) {
          var option = document.createElement("option");
          option.classList.add("captitle");
          option.setAttribute("id", `language:${track.name}:${track.id}`);
          option.textContent = `${track.name}`;
          languageDiv.appendChild(option);
        });
      } else {
        //console.log("No subtitle tracks found...");
        var option = document.createElement("option");
        option.classList.add("captitle");
        option.setAttribute("id", `language:English:0`);
        option.textContent = `English`;
        languageDiv.appendChild(option);
      }
    }
    flag = 0;

    VIDEO_PLAYED = true;
    INIT_PLAYER = false;
    showhls_loader();

    setsubtitle(); //custome cc setting from storeage.4

    videoElement.play();
    ////////////////////
    /*
    var playPromise = videoElement.play();

    if (playPromise !== undefined) {
      playPromise
        .then((_) => {
          // Automatic playback started!
          // Show playing UI.
          videoElement.play();
        })
        .catch((error) => {
          // Auto-play was prevented
          // Show paused UI.
          console.log("Video error-", error);
        });
    }
*/
    ////////////////////
  });

  hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, function (event, data) {
    //console.log(">>>", data);
  });

  hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, function (event, data) {
    // console.log("TRACK UPDATE ", data);
    if (localStorage.getItem("cc") === "true") {
      ccDisplay("cc");
    }
  });

  hls.on(Hls.Events.SUBTITLE_TRACK_LOADED, function (event, data) {
    var loadedTrackId = data.id;
    var loadedTrack = hls.subtitleTracks[loadedTrackId];
  });

  hls.on(Hls.Events.SUBTITLE_TRACK_SWITCH, function (event, data) {
    //console.log("SWITICHED ", data.id);
  });
  hls.on(Hls.Events.FRAG_LOADING, function (event, data) {
    // console.log("Frag Loading:", data.frag.url);
    // You can log the current frag URL or check for download progress here
  });
  hls.on(Hls.Events.FRAG_LOADED, function (event, data) {
    //console.log("Frag Loaded:", data.frag.url);
    // You can log the loaded frag URL or check for download speed here
  });
  hls.on(Hls.Events.SUBTITLE_FRAG_PROCESSED, function (event, data) {
    // console.log("FRAG PROCESSED ", data);
    // document.getElementById("log").textContent = JSON.stringify(data);
    //console.log("CC URL  ", data.frag._url);
    /* ADDING SUBTITLE (VTT) TRACK TO VIDEO ELEMNET */
  });

  hls.on(Hls.Events.SUBTITLE_TRACK_LOAD_ERROR, function (event, data) {
    // console.error("Subtitle track load error:", data);
    // Retry loading the subtitle track after a delay (e.g., 5 seconds)
    setTimeout(function () {
      hls.subtitleTrack = data.id; // Retry loading the same subtitle track
    }, 5000);
  });

  // Unified error handling function
  // hls.on(Hls.Events.ERROR, function (event, data) {
  //   console.log("ERRROR DETECTED ", data);
  //   handleError(data);
  // });
  var error = [];
  hls.on(Hls.Events.ERROR, function (event, data) {
    //console.log(" ERRROR  ", data);

    if (data.type === "otherError") {
      // hls.loadSource(hls.url);
      hls.startLoad();
    }
    const itid = document.getElementsByClassName("item focused")[0].id;
    const plyingNow = document.getElementById("note" + itid);

    if (data.type === "mediaError" && data.details === "bufferStalledError") {
      if (VIDEO_GROUP === "vod") {
        handleBufferStall();
      } else {
        handleLiveBufferStall();
        console.log("live buffer error");
      }
    }

    if (
      data.type === "networkError" &&
      data.details === "manifestParsingError"
    ) {
      console.log("manifest parse error");

      fatalError = true;
      plyingNow.classList.remove("notify-badge");
      plyingNow.classList.add("notify-badge-error");
      plyingNow.textContent = "Media error";
      error.push(itid);
      sessionStorage.setItem("errorItem", JSON.stringify(error));

      miniPlayer();
    }
    //manifestParsingError networkError
    if (data.details === Hls.ErrorDetails.AUDIO_TRACK_LOAD_ERROR) {
      // Handle audio track load errors
      hls.recoverMediaError();
      videoElement.play();
      console.log("AUDIO ERRROR DETECTED ", data);
    }

    if (data.fatal) {
      // if (data.type === "otherError") {
      //   hls.startLoad();
      // }

      // switch (data.type) {
      switch (data.details) {
        case hls.ErrorTypes.OTHER_ERROR:
          hls.startLoad();
          break;
        case Hls.ErrorTypes.MEDIA_ERROR:
          console.log("Media error.");
          fatalError = true;
          plyingNow.classList.remove("notify-badge");
          plyingNow.classList.add("notify-badge-error");
          plyingNow.textContent = "Media error";
          error.push(itid);
          sessionStorage.setItem("errorItem", JSON.stringify(error));
          miniPlayer();

          break;
        case Hls.ErrorTypes.NETWORK_ERROR:
        case Hls.ErrorDetails.FRAG_LOAD_ERROR:
          console.error("Fragment load error occurred.");

          // Attempt to retry loading after a delay
          setTimeout(() => {
            if (navigator.onLine) {
              console.log("Attempting to recover after fragment load error...");
              hls.startLoad(); // Restart loading
            }
          }, 5000); // Retry after 5 seconds (adjust as needed)

          break;
        case Hls.ErrorTypes.NETWORK_ERROR:
        case Hls.ErrorDetails.LEVEL_LOAD_ERROR:
          console.log("Level load error occurred.");

          // Attempt to retry loading after a delay
          setTimeout(() => {
            if (navigator.onLine) {
              console.log("Attempting to recover after level load error...");
              hls.startLoad(); // Restart loading
            }
          }, 5000); // Retry after 5 seconds (adjust as needed)

          hls.stopLoad();
          fatalError = true;
          plyingNow.classList.remove("notify-badge");
          plyingNow.classList.add("notify-badge-error");
          plyingNow.textContent = "Media error";
          error.push(itid);
          sessionStorage.setItem("errorItem", JSON.stringify(error));
          videoElement.pause();
          hide_loader();
          miniPlayer();

          hls.detachMedia();
          hls.destroy();

          break;
        case Hls.ErrorDetails.MANIFEST_LOAD_ERROR:
          if (VIDEO_GROUP === "live") {
            handleManifestLoadError(data, itid);
          } else {
            fatalError = true;
            plyingNow.classList.remove("notify-badge");
            plyingNow.classList.add("notify-badge-error");
            plyingNow.textContent = "Media error";
            error.push(itid);
            sessionStorage.setItem("errorItem", JSON.stringify(error));
            miniPlayer();
          }
          break;

        case "internalException":
          fatalError = true;
          plyingNow.classList.remove("notify-badge");
          plyingNow.classList.add("notify-badge-error");
          plyingNow.textContent = "Media error";
          error.push(itid);
          sessionStorage.setItem("errorItem", JSON.stringify(error));
          videoElement.pause();
          hide_loader();
          miniPlayer();
          hls.detachMedia();
          hls.destroy();
          break;

        default:
          console.log("Other error:", data.type, data.details);
          fatalError = true;
          plyingNow.classList.remove("notify-badge");
          plyingNow.classList.add("notify-badge-error");
          plyingNow.textContent = "Media error";
          error.push(itid);
          sessionStorage.setItem("errorItem", JSON.stringify(error));
          miniPlayer();
          break;
      }
    }
  });

  videoElement.addEventListener("ended", (event) => {
    if (popupVisibilitybyId(getCaptionPopupId())) {
      closeAllOpenCaptionSettings();
    }
    //##closeVideoDialog();
    // videoElement.classList.add('mini-replay');
    miniPlayer();
    if (localStorage.getItem("played")) {
      const replayVideo = document.getElementById(
        localStorage.getItem("played"),
      );
      replayVideo.textContent = "Play Again";
    }
  });

  videoElement.addEventListener("stalled", function () {
    console.log("video stalled.....");
    hls.startLoad(); // Resume loading on stall
  });
  videoElement.addEventListener("waiting", function () {
    //console.log("WAting.....");
    // videoElement.play();
    showhls_loader();
  });

  videoElement.addEventListener("playing", function () {
    hide_loader();
  });

  var subtitleContainer = document.getElementById("subtitleContainer");
  //#subtitleContainer.style.display = "block";
  hls.on(Hls.Events.FRAG_PARSING_USERDATA, function (event, data) {
    const CC = localStorage.getItem("cc");
    if (CC === "true") {
      subtitleContainer.style.display = "block";
      subtitle(subtitleContainer); // working
    }
    //subtitle(subtitleContainer); // working
  });

  window.addEventListener("offline", () => {
    videoElement.pause();
    hls.stopLoad();
    displayInternetError();
  });
  window.addEventListener("online", () => {
    subtitleContainer.innerHTML = ""; //clear subtitle
    hideInternetError();
    closeErrorNote();
    //check persistent error video
    if (checkPersisntentError()) return;

    console.log("Internet reconnected");
    if (hls) {
      hls.startLoad(); // Manually reload after reconnection
    }
    if (VIDEO_GROUP == "live") {
      handleLiveBufferStall();
    }

    // if internet diconnect/reconnect on video complete (home page), start palying change lable play again to Now playing.
    const mini = document.getElementById("video");

    if (MINI_TIMEOUT_ID) clearTimeout(MINI_TIMEOUT_ID);
    if (mini.getAttribute("mini-player") !== "false") {
      miniPlayer(() => {
        MINI_TIMEOUT_ID = setTimeout(() => {
          maximizePlayer();
        }, 15000);
      });
      //return;
    }
    if (localStorage.getItem("played")) {
      const replayVideo = document.getElementById(
        localStorage.getItem("played"),
      );
      replayVideo.textContent = "Now Playing";
    }
    // playing last plaed video after reconnect.
    videoElement.play();
  });
}

/**
 * Shows the video controls so users can resume after stream is paused.
 */
function onStreamPause() {
  console.log("paused");
  if (isAdBreak) {
    videoElement.controls = true;
    adUiElement.style.display = "none";
  }
}

/**
 * Hides the video controls if resumed during an ad break.
 */
function onStreamPlay() {
  if (isAdBreak) {
    videoElement.controls = false;
    adUiElement.style.display = "block";
  }
}
/**
 * Logs text to console.
 * @param  {string} text
 */
function logText(text) {
  console.log(text);
}

// Listen for the 'addtrack' event

function registerKeyHandler() {
  document.addEventListener("keydown", function (e) {
    tizen.tvinputdevice.registerKey("MediaPlayPause");
    tizen.tvinputdevice.registerKey("MediaPlay");
    tizen.tvinputdevice.registerKey("MediaStop");
    tizen.tvinputdevice.registerKey("MediaPause");
    tizen.tvinputdevice.registerKey("MediaRewind");
    tizen.tvinputdevice.registerKey("MediaFastForward");
    tizen.tvinputdevice.registerKey("Exit");

    if (!popupVisibilitybyId("video")) return;
    if (popupVisibilitybyId(getCaptionPopupId())) return;

    switch (e.keyCode) {
      case 10009: //RETURN button closeDialog();
        break;

      case 10182: //exit button
        tizen.application.getCurrentApplication().exit();
        break;
      case 13:
        videoElement.addEventListener("timeupdate", updateProgress);
        let elem = clearVideoControlsTimer();
        var ply = document.getElementById("play");
        let element = document.getElementsByClassName("focuse");
        let ctrlEl = element[0].attributes["id"].nodeValue;
        if (!popupVisibilitybyId("ctr")) return;

        if (ctrlEl === "play") {
          if (videoElement.paused) {
            ply.textContent = "Pause";
            videoElement.play();
          } else {
            ply.textContent = "Play";
            videoElement.pause();
          }
        } else if (ctrlEl === "cc") {
          /**Commented for wodrb+ */
          /*
          if (VIDEO_GROUP === "live") {
            ccDisplay();
          }
          */
          //--ccDisplay();
        }

        setVideoControlsTimer(elem);
        break;

      case 40: //dwon arrow if (popupVisibilitybyId("videoPopup")) return;
        if (popupVisibilitybyId(getCaptionPopupId())) return; //if caption settings open do not show controlls
        var skn = document.getElementById("skin");
        skn.style.display = "block";

        videoElement.addEventListener("timeupdate", updateProgress);
        setTimeout(() => {
          skn.style.display = "none";
        }, 5000);
        break;

      case 19: //Media Pause
        var ply = document.getElementById("play");

        let pauseTimer = clearVideoControlsTimer();
        ply.textContent = "Play";
        videoElement.pause();
        setVideoControlsTimer(pauseTimer);
        break;
      case 413: //stop
        let stp = document.getElementById("play");
        let stop = clearVideoControlsTimer();
        stp.textContent = "Play";
        stopMedia();
        setVideoControlsTimer(stop);
        break;
      case 415: // Media Play
        var ply = document.getElementById("play");

        let playTimer = clearVideoControlsTimer();
        ply.textContent = "Pause";
        videoElement.play();
        setVideoControlsTimer(playTimer);

        break;
      default:
        console.log("Key code --: " + e.keyCode);
        break;
    }
  });
}

function updateProgress() {
  // get minutes
  let mins = Math.floor(videoElement.currentTime / 60);
  if (mins < 10) {
    mins = "0" + String(mins);
  }
  //get seconds
  let secs = Math.floor(videoElement.currentTime % 60);
  if (secs < 10) {
    secs = "0" + String(secs);
  }

  let currTime = secondsToHHMMSS(videoElement.currentTime);

  if (videoElement.duration > 0) {
    var percent = (videoElement.currentTime / videoElement.duration) * 100;
    document.getElementById("progress-amount").style.width = percent + "%";
    //#document.getElementById("current-time").innerHTML = `${mins}:${secs}`;
    document.getElementById("current-time").innerHTML = `${currTime}`;
  }

  let totalTime = secondsToHHMMSS(videoElement.duration);
  document.getElementById("total-time").innerHTML = `${totalTime}`;
}
//#registerKeyHandler();

function windForward() {
  if (videoElement.currentTime >= videoElement.duration - 15) {
    videoElement.stop();
  } else {
    videoElement.currentTime += 15;
  }
}

function windBackward() {
  if (videoElement.currentTime <= 15) {
    videoElement.stop();
  } else {
    videoElement.currentTime -= 15;
  }
}

function subtitle(subtitleContainer) {
  const miniPlayer = document.getElementById("video");
  const tracks = videoElement.textTracks; //[1];
  for (const track of tracks) {
    if (
      (track.kind === "captions" || track.kind === "subtitles") &&
      track.language != ""
    ) {
      track.oncuechange = () => {
        subtitleContainer.innerHTML = "";
        const activeCues = track.activeCues;

        if (activeCues.length > 0) {
          let sub = "";

          for (let i = 0; i < activeCues.length; i++) {
            const currentCue = activeCues[i];

            if (currentCue.text !== undefined) {
              sub += currentCue.text + "\n";
            }

            if (sub) {
              //-console.log("Text " + sub);
              if (miniPlayer.getAttribute("mini-player") == "false") {
                subtitleContainer.innerHTML = `<span id="ccContainer" class="subtitleContainer">${sub}</span>`;
              } else {
                subtitleContainer.innerHTML = `<span id="ccContainer" class="subtitleContainer-mini">${sub}</span>`;
              }
              //###subtitleContainer.innerHTML = `<span id="ccContainer" class="subtitleContainer">${cue.text}</span>`;
              colseCaptionSettings();
            } else {
              subtitleContainer.innerHTML = "";
            }
          }

          // You can perform additional actions here
        }
      };
    }
    //break;
  }
}

function showhls_loader() {
  const spinner = document.getElementById("spinner");
  spinner.removeAttribute("hidden");
}

function hide_loader() {
  const spinner = document.getElementById("spinner");
  spinner.setAttribute("hidden", "");
}

function clearVideoControlsTimer() {
  if (popupVisibilitybyId(getCaptionPopupId())) return; //if caption settings open do not show controlls
  var videoControl = document.getElementById("skin");
  videoControl.style.display = "block";
  if (timeout.length > 0) {
    for (let i = 0; i < timeout.length; i++) {
      clearTimeout(timeout[i]);
    }
  }
  return videoControl;
}

function setVideoControlsTimer(element) {
  if (typeof element == "undefined") return;
  let timeoutId;
  timeoutId = setTimeout(() => {
    element.style.display = "none";
  }, 5000);
  timeout.push(timeoutId);
}

function stopMedia() {
  videoElement.pause();
  videoElement.currentTime = 0;
}

function colseCaptionSettings() {
  let color = localStorage.getItem("color");
  let fontFamily = localStorage.getItem("font-family");
  let fontsize = localStorage.getItem("fontsize");
  let textopacity = localStorage.getItem("textopacity");
  let bgcolor = localStorage.getItem("bgcolor");
  let bgopacity = localStorage.getItem("bgopacity");
  let characteredge = localStorage.getItem("characteredge");
  let windowColor = localStorage.getItem("windowColor");
  let windowOpacity = localStorage.getItem("windowOpacity");

  let cc = document.getElementById("ccContainer");
  //cc.style.color = color;

  if (fontFamily === "small-caps") {
    cc.style.cssText += "font-variant: small-caps;";
  }
  if (fontFamily) cc.style.cssText += "font-family: " + fontFamily;
  if (color) cc.style.cssText += "color:" + `rgb(${color})`;
  if (textopacity)
    cc.style.cssText += "color:" + `rgba(${color},${textopacity})`;
  //cc.style.fontFamily = fontFamily ? fontFamily : "Helvetica";
  if (characteredge) cc.style.cssText += "text-shadow:" + characteredge;
  if (fontsize) cc.style.cssText += "font-size:" + fontsize; //"10em"; //fontsize ? `${fontsize}em` : "3em";
  //cc.style.opacity = textopacity ? textopacity : "0.5";
  if (bgcolor) cc.style.cssText += "background-color:" + `rgb(${bgcolor})`;
  //cc.style.backgroundColor = bgcolor ? `rgb(${bgcolor})` : "";
  if (bgopacity) {
    cc.style.cssText += "background-color:" + `rgba(${bgcolor},${bgopacity})`;
  }

  let wind = document.getElementById("subtitleContainer");
  wind.style.backgroundColor = windowColor ? windowColor : "";
  wind.style.opacity = windowOpacity ? windowOpacity : "0.889";
}

function secondsToHHMMSS(totalSeconds) {
  if (isNaN(totalSeconds)) return "00";
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds - hours * 3600) / 60);
  var S_econds = totalSeconds - hours * 3600 - minutes * 60;
  var seconds = Math.floor(S_econds);

  // Padding the values to ensure they are two digits
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  if (hours > 0) {
    return hours + ":" + minutes + ":" + seconds;
  } else {
    return minutes + ":" + seconds;
  }
}

function videoProgressVod() {
  const secs = Math.floor(videoElement.currentTime);
  let percent;
  if (videoElement.duration > 0) {
    percent = Math.floor(
      (videoElement.currentTime / videoElement.duration) * 100,
    );
  }
  const vodObj = {
    seconds: secs,
    percent: percent,
  };
  return vodObj;
}

function videoProgressLive() {
  //get seconds
  return Math.floor(videoElement.currentTime);
}

//////////////////////////////////////Buffer handler

function handleBufferStall() {
  // Reload HLS or seek to the current time to force a buffer refill
  console.log("vod bufferstallerrro");
  //--hls.loadSource(hls.url);
  hls.startLoad();
  hls.media.currentTime = hls.media.currentTime;
}

function handleLiveBufferStall() {
  console.warn("Handling buffer stall...");

  if (hls) {
    if (hls.media && hls.media.readyState < 2) {
      console.warn("Attempting to recover media error...");
      hls.recoverMediaError();
    }

    const liveEdge = hls.liveSyncPosition;
    if (liveEdge !== null && !isNaN(liveEdge)) {
      hls.media.currentTime = liveEdge;
      console.log("Seeking to live edge:", liveEdge);
    } else {
      console.warn("Live sync position unavailable. Restarting playback...");
      hls.startLoad();
    }
  }
}

function handleManifestLoadError(errorData, errorid) {
  const retryCount = errorData.response ? errorData.response.code : 0;
  if (retryCount < 3) {
    console.log("Retrying to load manifest...");
    hls.loadSource(hls.url);
    hls.startLoad();
    // Seek to live edge
    attemptSyncToLiveEdge();
  } else {
    // console.error("Manifest load failed after multiple retries.");
    // Consider providing user feedback or reloading the player
    // console.log(
    //   "Unable to load the video. Please check your connection or try again later.",
    // );
    fatalError = true;
    plyingNow.classList.remove("notify-badge");
    plyingNow.classList.add("notify-badge-error");
    plyingNow.textContent = "Media error";
    // error.push(errorid);
    sessionStorage.setItem("errorItem", JSON.stringify(errorid));

    miniPlayer();
  }
}

function attemptSyncToLiveEdge() {
  const syncInterval = setInterval(() => {
    const liveEdge = hls.liveSyncPosition;
    if (liveEdge) {
      //  console.log("Live edge found, syncing playback...");
      document.getElementById("log").textContent =
        "Live edge found, syncing playback...";
      hls.media.currentTime = liveEdge;
      clearInterval(syncInterval);
    } else {
      // console.log("Live edge not yet available, waiting...");
      document.getElementById("log").textContent =
        "Live edge not yet available, waiting...";
    }
  }, 1000); // Check every second until the live edge is available
}
///////////////////////////////////////

// Function to handle LevelEmpty error
function handleLevelEmptyError(data) {
  // Get the problematic level index
  const levelIndex = data.level;
  // console.warn(`Level ${levelIndex} is empty. Switching to another level...`);

  // Try to switch to another level
  if (hls.levels.length > 1) {
    const nextLevel = (levelIndex + 1) % hls.levels.length;
    hls.nextLevel = nextLevel;
    console.warn(`Switched to level ${nextLevel}`);
  } else {
    //console.error("No other levels available. Reloading current level...");
    hls.loadLevel = levelIndex;
    hls.startLoad();
  }
}

// Check wheather video is good to play or not after internet reconnection
function checkPersisntentError() {
  let element = document.getElementsByClassName("item focused");
  let selectedId = element[0].attributes["id"].nodeValue;
  const errorItem = JSON.parse(sessionStorage.getItem("errorItem"));
  if (errorItem !== null) {
    for (let i = 0; i < errorItem.length; i++) {
      if (errorItem[i] === selectedId) {
        const plyingNow = document.getElementById("note" + selectedId);
        plyingNow.classList.remove("notify-badge");
        plyingNow.style.display = "block";
        plyingNow.classList.add("notify-badge-error");
        plyingNow.textContent = "Media error";
        return true;
      } else {
        return false;
      }
    }
  }
}
