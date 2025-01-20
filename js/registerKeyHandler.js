var POPUP;
var OK_BUTTON;
var CAPTION_ITEM_ID = "fontfamily";
var EXITAPP = true;
var VIDEOPLAYTIME;
var HIDEINTERNETERROR;
var LAST_FOCUSED;
//var el = document.getElementById("logg");

var CATEGORYID = 2633; //emporary

function registerKeyHandler() {
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
        // bof weather & miniplayer focus
        const miniv = document.getElementById("video");
        if (miniv.className === "focused") {
          const weather = document.getElementById("weather-icon");
          miniv.classList.remove("focused");
          miniv.classList.add("videoClass");
          weather.classList.add("focused");
          document.getElementById(
            "selected-item",
          ).innerHTML = `<span class="selected-item">Tap for weather details.</span>`;
        }

        // eof weather & miniplayer focuse
        if (popupVisibilitybyId("mediaError")) {
          removeMediaError();
        }
        if (MINI_TIMEOUT_ID) {
          clearTimeout(MINI_TIMEOUT_ID);
        }
        MINI_TIMEOUT_ID = setTimeout(() => {
          maximizePlayer();
        }, 15000);
        if (popupVisibilitybyId("weatherPage")) return;
        if (popupVisibilitybyId("spinner")) return;
        if (popupVisibilitybyId("notificationPopup")) return; //prevent action when exit popup open.
        if (popupVisibilitybyId("videoPopup")) {
          videoElement.addEventListener("timeupdate", updateProgress);
          videoLeftArrow(); // left controll navigation.
        }
        if (!checkMaxPlayer()) return; //prvevent movement of main page while playing max video.
        // if ( miniVideo()) return;
        //###if (popupVisibilitybyId("videoPopup")) return; // prevent action on homepage.

        if (POPUP) {
          let okf = document.getElementById("popup-ok");
          okf.classList.remove("popup-focused");
          let cancel = document.getElementById("popup-cancel");
          cancel.classList.add("popup-focused");
        } else {
          let leftKey = document.getElementById(CATEGORYID);
          let lcount = leftKey.children;
          let lcounter = 0;

          for (let i = 0; i < lcount.length; i++) {
            if (leftKey.children[i].className === "item focused") {
              lcounter = i;

              break;
            }
          }

          for (let i = 0; i < lcount.length; i++) {
            if (i === lcounter) {
              if (lcounter <= 1) break;
              leftKey.children[i].classList.remove("focused");
              lcounter--;
              leftKey.children[lcounter].classList.add("focused");

              let focuseEl = document.getElementsByClassName("item focused");
              let setfocus = focuseEl[0].attributes["id"].nodeValue;
              document.getElementById(setfocus).focus();

              leftKey.children[lcounter].scrollIntoView(false);
              leftKey.children[lcounter].scrollIntoView({ block: "start" });
              leftKey.children[lcounter].scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "nearest",
              });
              userNavigation();
              break;
            }
          }
        }
        break;

      case 38: //UP arrow
        if (popupVisibilitybyId("weatherPage")) return;
        if (popupVisibilitybyId("mediaError")) {
          removeMediaError();
        }
        if (MINI_TIMEOUT_ID) {
          clearTimeout(MINI_TIMEOUT_ID);
        }
        MINI_TIMEOUT_ID = setTimeout(() => {
          maximizePlayer();
        }, 15000);
        if (popupVisibilitybyId("spinner")) return;
        if (!checkMaxPlayer()) return; //prvevent movement of main page while playing max video.
        //if ( miniVideo()) return;

        //#### if (popupVisibilitybyId("videoPopup")) return; // prevent action on homepage.
        exitPopupUpKey(); // Exit popup nav.
        const upNav = document.getElementById("pagelist");

        const childCcount = upNav.children;
        let upcounter = ctr.counter;

        for (let i = 0; i < childCcount.length; i++) {
          for (let j = 0; j < upNav.children[i].children.length; j++) {
            if (upNav.children[i].children[j].className === "item focused") {
              upcounter = i;

              //weather icon focus
              if (upcounter === 0) {
                const weatherIcon = document
                  .getElementById("weather-icon")
                  .classList.add("focused");
                document.getElementById(
                  "selected-item",
                ).innerHTML = `<span class="selected-item">Tap for weather details.</span>`;
              }
              upNav.children[i].children[1].classList.remove("focused");
              //eof weather icon focus
              break;
            }
          }
        }

        for (let i = 0; i < childCcount.length; i++) {
          if (i === upcounter) {
            if (upcounter <= 0) break;
            upNav.children[i].children[1].classList.remove("focused");
            for (let k = 0; k < upNav.children[i].children.length; k++) {
              upNav.children[upcounter].children[k].classList.remove("focused");
            }

            upcounter--;
            ctr.counter = upcounter;
            upNav.children[upcounter].children[1].classList.add("focused");
            upNav.children[upcounter].children[1].scrollIntoView(false);
            upNav.children[upcounter].children[1].scrollIntoView({
              block: "start",
            });
            upNav.children[upcounter].children[1].scrollIntoView({
              behavior: "instant",
              block: "start",
            });

            CATEGORYID = upNav.children[upcounter].id;
            userNavigation();
            //analytics bof
            const analyticsData = {
              event: "SectionViewed",
              item_category: upNav.children[upcounter].children[0].textContent,
              method: "Content Click",
              location: LOCATION,
              item_brand: BRAND,
              app_version: APP_VERSION,
            };

            SectionViewed(
              analyticsData.event,
              analyticsData.item_category,
              analyticsData.method,
              analyticsData.location,
              analyticsData.item_brand,
              analyticsData.app_version,
            );
            //analytics eof
            break;
          }
        }
        break;

      case 39: //RIGHT arrow
        // bof weather & miniplayer focuse
        const weather = document.getElementById("weather-icon");
        if (weather.className === "focused") {
          weather.classList.remove("focused");
          const video = document.getElementById("video");
          video.classList.remove("videoClass");
          video.classList.add("focused");
          document.getElementById(
            "selected-item",
          ).innerHTML = `<span class="selected-item">Tap the mini playere for fullscreen view.</span>`;
        }
        const minip = document.getElementById("video");
        if (minip.className === "focused") {
          return;
        }
        // eof weaher & miniplayer focuse

        if (popupVisibilitybyId("weatherPage")) return;
        if (popupVisibilitybyId("mediaError")) {
          removeMediaError();
        }
        if (MINI_TIMEOUT_ID) {
          clearTimeout(MINI_TIMEOUT_ID);
        }
        MINI_TIMEOUT_ID = setTimeout(() => {
          maximizePlayer();
        }, 15000);

        // ////////////// remove focuse from video controlls
        if (popupVisibilitybyId("spinner")) return;
        if (popupVisibilitybyId("notificationPopup")) return; //prevent action when exit popup open.
        if (popupVisibilitybyId("videoPopup")) {
          videoElement.addEventListener("timeupdate", updateProgress);
          videoRightArrow();
        }
        if (!checkMaxPlayer()) return; //prvevent movement of main page while playing max video.
        /////////////// remove focuse from video controlls eof

        ///####### if (popupVisibilitybyId("videoPopup")) return; // prevent action on homepage.
        if (POPUP) {
          let cancelf = document.getElementById("popup-cancel");
          cancelf.classList.remove("popup-focused");
          let ok = document.getElementById("popup-ok");
          ok.classList.add("popup-focused");
        } else {
          let arrowKey = document.getElementById(CATEGORYID);

          let count = arrowKey.children;
          let right_counter = 0;

          for (let i = 0; i < count.length; i++) {
            if (arrowKey.children[i].className === "item focused") {
              right_counter = i;

              break;
            }
          }

          for (let i = 0; i < count.length - 1; i++) {
            if (i === right_counter) {
              arrowKey.children[i].classList.remove("focused");
              right_counter++;
              arrowKey.children[right_counter].classList.add("focused");
              var focuseEl = document.getElementsByClassName("item focused");
              var setfocus = focuseEl[0].attributes["id"].nodeValue;
              document.getElementById(setfocus).focus();

              arrowKey.children[right_counter].scrollIntoView(false);
              arrowKey.children[right_counter].scrollIntoView({
                block: "start",
              });
              arrowKey.children[right_counter].scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "nearest",
              });
              //console.log(arrowKey.children[right_counter]);
              userNavigation();
              break;
            }
          }
        }
        break;

      case 40: //DOWN arrow
        if (popupVisibilitybyId("weatherPage")) return;
        if (popupVisibilitybyId("mediaError")) {
          removeMediaError();
        }
        if (MINI_TIMEOUT_ID) {
          clearTimeout(MINI_TIMEOUT_ID);
        }
        MINI_TIMEOUT_ID = setTimeout(() => {
          maximizePlayer();
        }, 15000);
        if (popupVisibilitybyId("spinner")) return;
        //# if(!checkMaxPlayer()) return; //prvevent movement of main page while playing max video.

        if (popupVisibilitybyId("videoPopup")) {
          const vid = document.getElementById("video");
          const vidHeight = vid.getAttribute("height");
          if (vidHeight == 1080) {
            videoDownArrow();
          }
        }

        if (!checkMaxPlayer()) return; //prvevent movement of main page while playing max video.
        exitPopupDownKey(); // Exit application nav.

        let dnleftKey = document.getElementById("pagelist"); //("pagelist");
        let dnlcount = dnleftKey.children;
        if (
          document.getElementById("weather-icon").classList.contains("focused")
        ) {
          dnlcount++; // Increase counter by 1 if weather icon had focused.
        }

        let dnlcounter = ctr.counter;

        // weather icon or video selection bof
        weatherNminivideoFocuse(dnleftKey);
        // weahter icon or video selection eof

        for (let i = 0; i < dnlcount.length; i++) {
          for (let j = 0; j < dnleftKey.children[i].children.length; j++) {
            if (
              dnleftKey.children[i].children[j].className === "item focused"
            ) {
              dnlcounter = i;

              break;
            }
          }
        }

        for (let i = 0; i < dnlcount.length; i++) {
          if (i === dnlcounter) {
            if (dnlcounter === dnlcount.length - 1) break;
            for (let k = 0; k < dnleftKey.children[i].children.length; k++) {
              dnleftKey.children[dnlcounter].children[k].classList.remove(
                "focused",
              );
            }

            dnlcounter++;

            dnleftKey.children[dnlcounter].children[1].classList.add("focused");
            //dnleftKey.children[dnlcounter].children[1].focus();

            dnleftKey.children[dnlcounter].children[1].scrollIntoView(false);
            dnleftKey.children[dnlcounter].children[1].scrollIntoView({
              block: "start",
            });
            dnleftKey.children[dnlcounter].children[1].scrollIntoView({
              behavior: "instant",
              block: "start",
              //inline: "nearest",
            });

            CATEGORYID = dnleftKey.children[dnlcounter].id;
            ctr.counter = dnlcounter;
            userNavigation();
            // analytics bof

            // const item_category =
            // dnleftKey.children[dnlcounter].children[0].textContent;

            const analytics = {
              event: "SectionViewed",
              item_category:
                dnleftKey.children[dnlcounter].children[0].textContent,
              method: "Content Click",
              location: LOCATION,
              item_brand: BRAND,
              app_version: APP_VERSION,
            };

            SectionViewed(
              analytics.event,
              analytics.item_category,
              analytics.method,
              analytics.location,
              analytics.item_brand,
              analytics.app_version,
            );
            //analytics eof
            break;
          }
        }
        break;
      case 13: //OK button
        if (popupVisibilitybyId("weatherPage")) return;
        if (popupVisibilitybyId("spinner")) return;
        if (popupVisibilitybyId("mediaError")) return; //prevent fullscreen wehen error occured in video
        if (popupVisibilitybyId("error")) {
          closeErrorNotification();
          if (SERVER_ERROR) terminate();
          return;
        }

        if (popupVisibilitybyId("ctr")) {
          videoOkAction();

          return;
        }

        if (navigator.onLine) {
          if (POPUP) {
            //closeNotificationDialog();

            let popup = document.getElementsByClassName(
              "popup-button exitFocus",
            );

            if (!popup.length > 0) return;
            let popupId = popup[0].attributes["id"].nodeValue;

            if (popupId === "popup-ok") {
              if (OK_BUTTON) {
                closeNotificationDialog();
              } else {
                terminate();
              }
            } else if (popupId === "popup-cancel") {
              closeNotificationDialog();
            }
            POPUP = false;
            return;
          }

          // weather bof
          const weather = document.querySelector("#weather-icon");
          if (weather.classList.contains("focused")) {
            videoElement.pause();
            openWeather();

            return;
          }
          // weather eof
          // maximize miniplayer on tap bof
          const miniPlayer = document.querySelector("#video");
          if (miniPlayer.classList.contains("focused")) {
            miniPlayer.classList.remove("focused");
            maximizePlayer();
            return;
          }
          // maximize miniplayer eof

          // notification eof ////////////////////////////////////

          let video_url;
          let video_group;
          let daiAssetKey;
          let caption;
          let video_title;
          let category_name;
          let guid;
          let element = document.getElementsByClassName("item focused");
          // Hndling media error bof
          let selectedId = element[0].attributes["id"].nodeValue;
          const errorItem = JSON.parse(sessionStorage.getItem("errorItem"));
          if (errorItem !== null) {
            for (let i = 0; i < errorItem.length; i++) {
              if (errorItem[i] === selectedId) {
                const plyingNow = document.getElementById("note" + selectedId);
                // if (plyingNow.textContent === "Media error") {
                //   plyingNow.style.display = "block";
                // }

                plyingNow.classList.remove("notify-badge");
                plyingNow.style.display = "block";
                plyingNow.classList.add("notify-badge-error");
                plyingNow.textContent = "Media error";
                return;
              }
            }
          }
          // handling media error eof

          // manipulatin gvideo for new ui

          var videoExists = document.getElementById("video");
          if (videoExists) {
            const itid = videoExists.getAttribute("itemid");
            const it_id = element[0].attributes["id"].nodeValue;
            if (itid === it_id) {
              if (videoExists.ended) {
                videoExists.play();
              }
              if (localStorage.getItem("played")) {
                const replayVideo = document.getElementById(
                  localStorage.getItem("played"),
                );
                replayVideo.textContent = "Now Playing";
              }
              maximizePlayer();
              return;
            } else {
              //console.log('DIFFRENT VIDEO ', it_id);
            }
          }

          closeMiniVideoDialog();
          /// eof manipulation of new ui

          //video_url = element[0].id;
          video_url = element[0].attributes["videoUrl"].nodeValue;
          video_title = element[0].attributes["video_title"].nodeValue;
          category_name = element[0].attributes["cat_name"].nodeValue;
          guid = element[0].attributes["guid"].nodeValue;
          sessionStorage.setItem("video_title", video_title);
          itemid = element[0].attributes["id"].nodeValue;
          catId = element[0].attributes["catId"].nodeValue;
          daiAssetKey = element[0].attributes["daiassetkey"].nodeValue;
          video_group = element[0].attributes["video_group"].nodeValue;
          caption = element[0].attributes["caption"].nodeValue;
          let id = element[0].attributes["id"].nodeValue;

          // console.log("OK ----------->", itemid);
          // const errorItem = sessionStorage.getItem("errorItem");
          // console.log("itmeid ", itemid, "eroritem", errorItem);
          // if (errorItem === itemid) return; // prevent if there are error in itme.
          sessionStorage.setItem("itemId", itemid);

          const nodes = document.getElementsByTagName("option");
          for (let i = 0, len = nodes.length; i != len; ++i) {
            nodes[0].parentNode.removeChild(nodes[0]);
          }

          localStorage.setItem("cc_lang", "English:0");

          if (video_group === "vod") {
            // document.getElementById("head").src = document.getElementById(
            //   "thumb" + id,
            // ).src;
            // Setting thumbnail on left pan of header
            const icon_uri = document.getElementById("thumb" + id).src;
            document.documentElement.style.setProperty(
              "--bg-image",
              `url('${icon_uri}')`,
            );
            openVideoDialog(
              video_url,
              daiAssetKey,
              video_group,
              catId,
              itemid,
              video_title,
              category_name,
              guid,
            );
          } else if (video_group === "live") {
            // document.getElementById("head").src = document.getElementById(
            //   "thumb" + id,
            // ).src;
            // Setting thumbnail on left pan of header
            const icon_uri = document.getElementById("thumb" + id).src;
            document.documentElement.style.setProperty(
              "--bg-image",
              `url('${icon_uri}')`,
            );
            openVideoDialog(
              video_url,
              daiAssetKey,
              video_group,
              catId,
              itemid,
              video_title,
              category_name,
              guid,
            );
          } else if (video_group.toLowerCase() === "sponsored") {
            openVideoDialog(
              video_url,
              daiAssetKey,
              video_group,
              catId,
              itemid,
              video_title,
              category_name,
              guid,
            );
          }
        } else if (navigator.offline) {
          displayInternetError();
          HIDEINTERNETERROR = setTimeout(() => {
            hideInternetError();
          }, 190000);
        } else if (navigator.onLine) {
          if (HIDEINTERNETERROR) {
            clearTimeout(HIDEINTERNETERROR);
            hideInternetError();
            closeErrorNote();
          }
        }
        break;
      case 10009: //RETURN button
        //weather page
        if (popupVisibilitybyId("weatherPage")) {
          closeWeather();
          videoElement.play();
        }

        if (popupVisibilitybyId("spinner")) return;
        //for mini player bof

        if (BACK_BUTTON) return;
        const mini = document.getElementById("video");
        if (MINI_TIMEOUT_ID) clearTimeout(MINI_TIMEOUT_ID);
        if (mini.getAttribute("mini-player") === "false") {
          miniPlayer(() => {
            MINI_TIMEOUT_ID = setTimeout(() => {
              maximizePlayer();
            }, 15000);
          });
          // focuse weather icon when back by clicking on mini player.
          //document.getElementById("weather-icon").classList.add("focused");
          return;
        }

        // mini player eof
        if (INIT_PLAYER) return;
        //if (AD_PLYING) return; //To allow show exit popup after return from ads
        if (popupVisibilitybyId("spinner")) return; // prevent back action on loading
        if (popupVisibilitybyId("controls") === false) {
          //#closeVideoDialog();

          return;
        }

        if (POPUP) {
          closeNotificationDialog();
          // show focused screen on return
          let focuseItem = document.getElementsByClassName("item focused");
          let activeId = focuseItem[0].attributes["id"].nodeValue;
          let currentItem = document.getElementById(activeId);
          currentItem.scrollIntoView(true);
          currentItem.scrollIntoView({ block: "center" });
          currentItem.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });

          POPUP = false;
          return;
        }

        if (!VIDEO_PLAYED) {
          POPUP = true;
          openNotificationDialog(
            "Exit 10 News Now - WSLS 10",
            "Are you sure that you want to exit 10 News Now - WSLS 10?",
          );
        } else {
        }

        if (BACK_BUTTON) return;
        VIDEO_PLAYED = false;
        //## closeVideoDialog();

        // if (BACK_BUTTON) return;
        // closeVideoDialog();

        break;
      case 10182: //Exit button
        terminate();
        break;

      case 19: //Media Pause
        var ply = document.getElementById("play");
        var skn = document.getElementById("skin");
        skn.style.display = "block";
        videoElement.addEventListener("timeupdate", updateProgress);
        setTimeout(() => {
          skn.style.display = "none";
        }, 5000);

        videoElement.pause();
        ply.textContent = "Play";
        break;

      case 415: // Media Play trick play
        var ply = document.getElementById("play");

        var skn = document.getElementById("skin");
        skn.style.display = "block";
        videoElement.addEventListener("timeupdate", updateProgress);
        setTimeout(() => {
          skn.style.display = "none";
        }, 5000);
        //videoElement.addEventListener("timeupdate", updateProgress);
        if (videoElement.paused) {
          ply.textContent = "Pause";
          videoElement.play();
        }

        break;
      case 412: // Rewind trick play
        let rewind = clearVideoControlsTimer();
        windBackward();
        setVideoControlsTimer(rewind);
        break;
      case 413: //stop
        let stp = document.getElementById("play");
        let stop = clearVideoControlsTimer();
        stp.textContent = "Play";
        stopMedia();
        setVideoControlsTimer(stop);
        break;
      case 417: //fast forword (trick key)
        let forword = clearVideoControlsTimer();
        windForward();
        setVideoControlsTimer(forword);
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

function videoRightArrow() {
  let element = clearVideoControlsTimer();

  let ctrl = document.getElementById("ctrl");
  let count = ctrl.children;
  let counter = 0;
  for (let i = 0; i < count.length; i++) {
    if (ctrl.children[i].className === "focuse") {
      counter = i;
      break;
    }
  }

  for (let i = 0; i < count.length - 1; i++) {
    if (i === counter) {
      ctrl.children[i].classList.remove("focuse");
      counter++;
      ctrl.children[counter].classList.add("focuse");
      break;
    }
  }
  setVideoControlsTimer(element);
}

function videoLeftArrow() {
  // const videoPopUp = isVideoHidden(document.getElementById("video"));
  // if (videoPopUp) return; // Return to hom page if video is not visible for actions.
  let element = clearVideoControlsTimer();
  let leftctrl = document.getElementById("ctrl");
  let leftcount = leftctrl.children;
  let leftcounter = 0;
  for (let i = 0; i < leftcount.length; i++) {
    if (leftctrl.children[i].className === "focuse") {
      leftcounter = i;
      break;
    }
  }

  for (let i = 0; i < leftcount.length; i++) {
    if (i === leftcounter) {
      if (leftcounter < 1) break;
      leftctrl.children[i].classList.remove("focuse");
      leftcounter--;
      leftctrl.children[leftcounter].classList.add("focuse");
      break;
    }
  }
  setVideoControlsTimer(element);
}

function videoDownArrow() {
  let element = clearVideoControlsTimer();
  if (popupVisibilitybyId(getCaptionPopupId())) return; //if caption settings open do not show controlls

  var skn = document.getElementById("skin");

  let atvieEl = document.getElementsByClassName("focuse");

  let el = atvieEl[0].attributes["id"].nodeValue;
  document.getElementById(el).classList.remove("focuse");
  document.getElementById("play").classList.add("focuse");
  skn.style.display = "block";

  skn.classList.add("video-skin");
  skn.children[0].style.display = "block";
  document.getElementById("ctr").style.display = "block";
  document.getElementById("cc").style.display = "block";

  videoElement.addEventListener("timeupdate", updateProgress);

  /*
  setTimeout(() => {
    skn.style.display = "none";
  }, 5000);

  */

  setVideoControlsTimer(element);
}

function videoOkAction() {
  let elem = clearVideoControlsTimer();
  var ply = document.getElementById("play");
  let cc = document.getElementById("cc");
  let element = document.getElementsByClassName("focuse");
  let ctrlEl;
  if (element.length) {
    ctrlEl = element[0].attributes["id"].nodeValue;
  }
  // mediaError(); //media error popup

  videoElement.addEventListener("timeupdate", updateProgress);

  if (ctrlEl === "backword") {
    let element = clearVideoControlsTimer();
    windBackward();
    setVideoControlsTimer(element);
  } else if (ctrlEl === "forword") {
    let element = clearVideoControlsTimer();
    windForward();
    setVideoControlsTimer(element);
  } else if (ctrlEl === "play") {
    if (videoElement.paused) {
      ply.textContent = "Pause";
      videoElement.play();
    } else {
      ply.textContent = "Play";
      videoElement.pause();
    }
  } else if (ctrlEl === "cc") {
    try {
      ccDisplay(ctrlEl);
    } catch (error) {
      console.log(error);
    }
  } else if (ctrlEl === "cc-settings") {
    openCaptionSettingsPopup();
  }
  setVideoControlsTimer(elem);
}

function popUpClose() {
  let capPop = popupVisibilitybyId("captionSettingsPopup");
  let videoPopup = popupVisibilitybyId("videoPopup");
  let liveVideo = popupVisibilitybyId("video");
  let capFontFamily = popupVisibilitybyId("captionSettingsPopup-fontFamily");
  const capFontColor = popupVisibilitybyId("captionSettingsPopup-fontColor");
  const capFontSize = popupVisibilitybyId("captionSettingsPopup-fontSize");
  const capTextOpacity = popupVisibilitybyId(
    "captionSettingsPopup-textOpacity",
  );
  const capCharacterEdge = popupVisibilitybyId(
    "captionSettingsPopup-characterEdge",
  );
  const capBgColor = popupVisibilitybyId("captionSettingsPopup-bgcolor");
  const capBgOpacity = popupVisibilitybyId("captionSettingsPopup-BgOpacity");
  const capWindowColor = popupVisibilitybyId(
    "captionSettingsPopup-WindowColor",
  );
  const capWindowOpacity = popupVisibilitybyId(
    "captionSettingsPopup-WindowOpacity",
  );

  if (capFontFamily) {
    closeCaptionSettingsFontFamilyPopup();
  } else if (capFontColor) {
    closeCaptionSettingsFontColor();
  } else if (capFontSize) {
    closeCaptionSettingsFontSize();
  } else if (capTextOpacity) {
    closeCaptionSettingsTextOpacity();
  } else if (capCharacterEdge) {
    closeCaptionSettingsCharecterEdge();
  } else if (capBgColor) {
    closeCaptionSettingsBgColor();
  } else if (capBgOpacity) {
    closeCaptionSettingsBgOpacity();
  } else if (capWindowColor) {
    closeCaptionSettingsWindowColor();
  } else if (capWindowOpacity) {
    closeCaptionSettingsWindowOpacity();
  } else if (videoPopup && capPop === undefined) {
    closeVideoDialog();
  }
  // else {
  //   closeVideoDialog();
  // }
}

function showLoader() {
  const loader = document.getElementById("loader");
  loader.removeAttribute("hidden");
}

function hideLoader() {
  const loader = document.getElementById("loader");
  loader.setAttribute("hidden", "");
}

function exitPopupDownKey() {
  if (popupVisibilitybyId("notificationPopup")) {
    let cancel = document.getElementById("popup-cancel");
    if (cancel.className === "popup-button exitFocus") {
      cancel.classList.remove("exitFocus");
    }
    const Ok = document.getElementById("popup-ok");

    Ok.classList.add("exitFocus");
  }
  return;
}
function exitPopupUpKey() {
  if (popupVisibilitybyId("notificationPopup")) {
    let ok = document.getElementById("popup-ok");
    if (ok.className === "popup-button exitFocus") {
      ok.classList.remove("exitFocus");
    }
    const cancel = document.getElementById("popup-cancel");
    cancel.classList.add("exitFocus");
  }
  return;
}

function disableCc() {
  const textTracks = videoElement.textTracks;
  for (let i = 0; i < textTracks.length; i++) {
    const textTrack = textTracks[i];

    textTrack.mode = "hidden";
  }
}
var isTrack = "";
function enableCc() {
  if (VIDEO_GROUP === "vod") {
    return new Promise((resolve, reject) => {
      var availableSubtitles = hls.subtitleTracks; //hls.allSubtitleTracks; //hls.subtitleTracks;
      var subtitleContainer = document.getElementById("subtitleContainer");

      for (var i = 0; i < availableSubtitles.length; i++) {
        const textTrack = availableSubtitles[i];

        getFileSize(textTrack.url).then((result) => {
          if (parseInt(result) > 150) {
            isTrack = true;
            resolve(isTrack);
          } else {
            isTrack = null;

            reject(isTrack);
          }
        });

        textTrack.mode = "showing"; // or 'hidden'
      }

      subtitle(subtitleContainer);
    });
  }
}

async function ccDisplay(ele) {
  if (ele === undefined) return;
  let cc = document.getElementById("cc");
  const subEl = document.getElementById("subtitleContainer");
  const cc_lang = localStorage.getItem("cc_lang");
  const langTrackId = cc_lang.split(":");
  const storedCc = localStorage.getItem("cc");

  if (subEl.style.display === "none") {
    subEl.style.display = "block";
    cc.textContent = "CC off";
    if (VIDEO_GROUP === "vod") {
      enableCc()
        .then((result) => {
          if (langTrackId[1] != "") {
            hls.subtitleTrack = parseInt(langTrackId[1]);
            hls.subtitleDisplay = true;
          } else {
            hls.subtitleTrack = 0;
            hls.subtitleDisplay = true;
          }
        })
        .catch((err) => {
          console.log("ERROR--", err);
        });
    } else {
      if (langTrackId[1] != "") {
        hls.subtitleTrack = parseInt(langTrackId[1]);
        hls.subtitleDisplay = true;
      } else {
        hls.subtitleTrack = 0;
        hls.subtitleDisplay = true;
      }
    }

    localStorage.setItem("cc", true);
  } else {
    if (isTrack !== null) {
      subEl.style.display = "none";
      cc.textContent = "CC on";
      hls.subtitleTrack = -1;
      hls.subtitleDisplay = false;
      localStorage.setItem("cc", false);
      disableCc();
    } else {
      subEl.style.display = "none";
      cc.textContent = "CC on";
      localStorage.setItem("cc", false);
    }
  }
}

function ccDisplayFromLanguageSettings(trackId = 0) {
  if (VIDEO_GROUP === "live") {
    let cc = document.getElementById("cc");
    const subEl = document.getElementById("subtitleContainer");
    subEl.style.display = "block";
    cc.textContent = "CC off";
    hls.subtitleTrack = trackId;
    hls.subtitleDisplay = true;
  } else {
    enableCc()
      .then((result) => {
        let cc = document.getElementById("cc");
        const subEl = document.getElementById("subtitleContainer");
        subEl.style.display = "block";
        cc.textContent = "CC off";
        hls.subtitleTrack = trackId;
        hls.subtitleDisplay = true;
      })
      .catch((error) => {
        console.log(error);
      });

    localStorage.setItem("cc", true);
  }
}
