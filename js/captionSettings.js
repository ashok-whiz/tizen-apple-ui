registerPopupKeyHandler();
var OK_BUTTON;
var BACK_BUTTON = false;
var CAPTION_ITEM_ID = "fontfamily";
function removeFocuse(id) {
  const item = document.getElementById(id);
  for (let i = 1; i < item.children.length; i++) {
    if (item.children[i].className === "captitle menu-focused") {
      item.children[i].classList.remove("menu-focused");
      break;
    }
  }
}

function removeVideoCotrolFocuse() {
  const activeControlls = document.getElementById("ctrl");
  for (let i = 0; i < activeControlls.children.length; i++) {
    if (activeControlls.children[i].className === "focuse") {
      activeControlls.children[i].classList.remove("focuse");
    }
  }
}

function openCaptionSettingsPopup() {
  const ctr = popupVisibilitybyId("controls");
  if (!ctr) return; // prevent access of cc setting during pre-roll ads play.
  const isVideoPlaying = popupVisibilitybyId("videoPopup");
  const isLiveVideoPlaying = popupVisibilitybyId("video");
  if (!(isVideoPlaying || isLiveVideoPlaying)) return; // do not open cap setting dilaog until video plays
  getSetting();
  //removing focuse from active controlls so it didn't interfere .
  const activeControlls = document.getElementById("ctrl");
  for (let i = 0; i < activeControlls.children.length; i++) {
    if (activeControlls.children[i].className === "focuse") {
      activeControlls.children[i].classList.remove("focuse");
    }
  }
  const videoControl = document.getElementById("skin");
  const captionSettingsOverlay = document.getElementById(
    "captionSettingsPopup",
  );

  captionSettingsOverlay.children[1].classList.add("menu-focused");
  videoControl.style.display = "none";
  captionSettingsOverlay.style.display = "block";
}
function closeCaptionSettingsPopup() {
  const captionSettingsOverlay = document.getElementById(
    "captionSettingsPopup",
  );
  removeFocuse("captionSettingsPopup");
  captionSettingsOverlay.style.display = "none";
}

function openCaptionSettingsFontFamilyPopup() {
  const isVideoPlaying = popupVisibilitybyId("videoPopup");
  const isLiveVideoPlaying = popupVisibilitybyId("video");
  if (!(isVideoPlaying || isLiveVideoPlaying)) return; // do not open cap setting dilaog until video plays
  getSetting();
  removeVideoCotrolFocuse();
  closeCaptionSettingsPopup(); //close main setting popup
  const videoControl = document.getElementById("skin");
  const fontFamily = document.getElementById("captionSettingsPopup-fontFamily");
  fontFamily.children[1].classList.add("menu-focused");

  videoControl.style.display = "none";
  fontFamily.style.display = "block";
}

function closeCaptionSettingsFontFamilyPopup() {
  const fontFamily = document.getElementById("captionSettingsPopup-fontFamily");
  removeFocuse("captionSettingsPopup-fontFamily");
  fontFamily.style.display = "none";
  openCaptionSettingsPopup();
}
function openCaptionSettingsFontColor() {
  const isVideoPlaying = popupVisibilitybyId("videoPopup");
  const isLiveVideoPlaying = popupVisibilitybyId("video");
  if (!(isVideoPlaying || isLiveVideoPlaying)) return; // do not open cap setting dilaog until video plays
  getSetting();

  removeVideoCotrolFocuse();
  closeCaptionSettingsPopup(); //close main setting popup
  const videoControl = document.getElementById("skin");
  const fontFamily = document.getElementById("captionSettingsPopup-fontColor");
  fontFamily.children[1].classList.add("menu-focused");
  videoControl.style.display = "none";
  fontFamily.style.display = "block";
}
function closeCaptionSettingsFontColor() {
  const fontColor = document.getElementById("captionSettingsPopup-fontColor");
  removeFocuse("captionSettingsPopup-fontColor");
  fontColor.style.display = "none";
  openCaptionSettingsPopup();
}
/////////// language bof
function openCaptionSettingsLanguage() {
  const isVideoPlaying = popupVisibilitybyId("videoPopup");
  const isLiveVideoPlaying = popupVisibilitybyId("video");
  if (!(isVideoPlaying || isLiveVideoPlaying)) return; // do not open cap setting dilaog until video plays
  getSetting();

  removeVideoCotrolFocuse();
  closeCaptionSettingsPopup(); //close main setting popup
  const videoControl = document.getElementById("skin");
  // if (
  //   document.getElementById("captionSettingsPopup-language") &&
  //   document.getElementById("captionSettingsPopup-language").value
  // ) {
  const fontFamily = document.getElementById("captionSettingsPopup-language");
  fontFamily.children[1].classList.add("menu-focused");
  videoControl.style.display = "none";
  fontFamily.style.display = "block";
  // }
}
function closeCaptionSettingsLanguage() {
  const fontColor = document.getElementById("captionSettingsPopup-language");
  removeFocuse("captionSettingsPopup-language");
  fontColor.style.display = "none";
  openCaptionSettingsPopup();
}
//////////// language eof

function openCaptionSettingsFontSize() {
  const isVideoPlaying = popupVisibilitybyId("videoPopup");
  const isLiveVideoPlaying = popupVisibilitybyId("video");
  if (!(isVideoPlaying || isLiveVideoPlaying)) return; // do not open cap setting dilaog until video plays
  getSetting();
  removeVideoCotrolFocuse();
  closeCaptionSettingsPopup(); //close main setting popup
  const videoControl = document.getElementById("skin");
  const fontSize = document.getElementById("captionSettingsPopup-fontSize");
  fontSize.children[1].classList.add("menu-focused");
  videoControl.style.display = "none";
  fontSize.style.display = "block";
}
function closeCaptionSettingsFontSize() {
  const fontColor = document.getElementById("captionSettingsPopup-fontSize");
  removeFocuse("captionSettingsPopup-fontSize");
  fontColor.style.display = "none";
  openCaptionSettingsPopup();
}

function openCaptionSettingsTextOpacity() {
  const isVideoPlaying = popupVisibilitybyId("videoPopup");
  const isLiveVideoPlaying = popupVisibilitybyId("video");
  if (!(isVideoPlaying || isLiveVideoPlaying)) return; // do not open cap setting dilaog until video plays
  getSetting();
  removeVideoCotrolFocuse();
  closeCaptionSettingsPopup(); //close main setting popup
  const videoControl = document.getElementById("skin");
  const textOpacity = document.getElementById(
    "captionSettingsPopup-textOpacity",
  );
  textOpacity.children[1].classList.add("menu-focused");
  videoControl.style.display = "none";
  textOpacity.style.display = "block";
}
function closeCaptionSettingsTextOpacity() {
  const textOpacity = document.getElementById(
    "captionSettingsPopup-textOpacity",
  );
  removeFocuse("captionSettingsPopup-textOpacity");
  textOpacity.style.display = "none";
  openCaptionSettingsPopup();
}

function openCaptionSettingsCharecterEdge() {
  const isVideoPlaying = popupVisibilitybyId("videoPopup");
  const isLiveVideoPlaying = popupVisibilitybyId("video");
  if (!(isVideoPlaying || isLiveVideoPlaying)) return; // do not open cap setting dilaog until video plays
  getSetting();
  removeVideoCotrolFocuse();
  closeCaptionSettingsPopup(); //close main setting popup
  const videoControl = document.getElementById("skin");
  const characterEdge = document.getElementById(
    "captionSettingsPopup-characterEdge",
  );
  characterEdge.children[1].classList.add("menu-focused");
  videoControl.style.display = "none";
  characterEdge.style.display = "block";
}
function closeCaptionSettingsCharecterEdge() {
  const characterEdge = document.getElementById(
    "captionSettingsPopup-characterEdge",
  );
  removeFocuse("captionSettingsPopup-characterEdge");
  characterEdge.style.display = "none";
  openCaptionSettingsPopup();
}

function openCaptionSettingsBgColor() {
  const isVideoPlaying = popupVisibilitybyId("videoPopup");
  const isLiveVideoPlaying = popupVisibilitybyId("video");
  if (!(isVideoPlaying || isLiveVideoPlaying)) return; // do not open cap setting dilaog until video plays
  getSetting();
  removeVideoCotrolFocuse();
  closeCaptionSettingsPopup(); //close main setting popup
  const videoControl = document.getElementById("skin");
  const bgColor = document.getElementById("captionSettingsPopup-bgcolor");
  bgColor.children[1].classList.add("menu-focused");
  videoControl.style.display = "none";
  bgColor.style.display = "block";
}
function closeCaptionSettingsBgColor() {
  const bgColor = document.getElementById("captionSettingsPopup-bgcolor");
  removeFocuse("captionSettingsPopup-bgcolor");
  bgColor.style.display = "none";
  openCaptionSettingsPopup();
}

function openCaptionSettingsBgOpacity() {
  const isVideoPlaying = popupVisibilitybyId("videoPopup");
  const isLiveVideoPlaying = popupVisibilitybyId("video");
  if (!(isVideoPlaying || isLiveVideoPlaying)) return; // do not open cap setting dilaog until video plays
  getSetting();
  removeVideoCotrolFocuse();
  closeCaptionSettingsPopup(); //close main setting popup
  const videoControl = document.getElementById("skin");
  const bgOpacity = document.getElementById("captionSettingsPopup-BgOpacity");
  bgOpacity.children[1].classList.add("menu-focused");
  videoControl.style.display = "none";
  bgOpacity.style.display = "block";
}
function closeCaptionSettingsBgOpacity() {
  const bgOpacity = document.getElementById("captionSettingsPopup-BgOpacity");
  removeFocuse("captionSettingsPopup-BgOpacity");
  bgOpacity.style.display = "none";
  openCaptionSettingsPopup();
}
function openCaptionSettingsWindowColor() {
  const isVideoPlaying = popupVisibilitybyId("videoPopup");
  const isLiveVideoPlaying = popupVisibilitybyId("video");
  if (!(isVideoPlaying || isLiveVideoPlaying)) return; // do not open cap setting dilaog until video plays
  getSetting();
  removeVideoCotrolFocuse();
  closeCaptionSettingsPopup(); //close main setting popup
  const videoControl = document.getElementById("skin");
  const windowColor = document.getElementById(
    "captionSettingsPopup-WindowColor",
  );
  windowColor.children[1].classList.add("menu-focused");
  videoControl.style.display = "none";
  windowColor.style.display = "block";
}
function closeCaptionSettingsWindowColor() {
  const windowColor = document.getElementById(
    "captionSettingsPopup-WindowColor",
  );
  removeFocuse("captionSettingsPopup-WindowColor");
  windowColor.style.display = "none";
  openCaptionSettingsPopup();
}

function openCaptionSettingsWindowOpacity() {
  const isVideoPlaying = popupVisibilitybyId("videoPopup");
  const isLiveVideoPlaying = popupVisibilitybyId("video");
  if (!(isVideoPlaying || isLiveVideoPlaying)) return; // do not open cap setting dilaog until video plays
  getSetting();
  removeVideoCotrolFocuse();
  closeCaptionSettingsPopup(); //close main setting popup
  const videoControl = document.getElementById("skin");
  const windowOpacity = document.getElementById(
    "captionSettingsPopup-WindowOpacity",
  );
  windowOpacity.children[1].classList.add("menu-focused");
  videoControl.style.display = "none";
  windowOpacity.style.display = "block";
}
function closeCaptionSettingsWindowOpacity() {
  const windowOpacity = document.getElementById(
    "captionSettingsPopup-WindowOpacity",
  );
  removeFocuse("captionSettingsPopup-WindowOpacity");
  windowOpacity.style.display = "none";
  openCaptionSettingsPopup();
}

function closeAllOpenCaptionSettings() {
  const fontColor = document.getElementById(getCaptionPopupId());
  removeFocuse(getCaptionPopupId());
  fontColor.style.display = "none";
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
    let capShow = popupVisibilitybyId(getCaptionPopupId());
    if (!capShow) return;

    switch (e.keyCode) {
      case 37: //LEFT arrow
        let leftKey = document.getElementById(CAPTION_ITEM_ID);
        let lcount = leftKey.children;
        let lcounter = 0;

        for (let i = 0; i < lcount.length; i++) {
          if (
            leftKey.children[i].className === "caption-content captionFocused"
          ) {
            lcounter = i;

            break;
          }
        }

        for (let i = 0; i < lcount.length; i++) {
          if (i === lcounter) {
            if (lcounter < 1) break;
            leftKey.children[i].classList.remove("captionFocused");
            lcounter--;
            leftKey.children[lcounter].classList.add("captionFocused");
            //leftKey.children[lcounter].focus();
            leftKey.children[lcounter].scrollIntoView(false);
            leftKey.children[lcounter].scrollIntoView({ block: "center" });
            leftKey.children[lcounter].scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "nearest",
            });

            break;
          }
        }

        break;

      case 38: //UP arrow
        // Caption settings up key event bof
        if (popupVisibilitybyId(getCaptionPopupId())) {
          upKey();
          return;
        }
        // Caption settings down key event eof
        break;
      case 39: //RIGHT arrow
        let arrowKey = document.getElementById(CAPTION_ITEM_ID);

        let count = arrowKey.children;
        let right_counter = 0;

        for (let i = 0; i < count.length; i++) {
          if (
            arrowKey.children[i].className === "caption-content captionFocused"
          ) {
            right_counter = i;

            break;
          }
        }

        for (let i = 0; i < count.length - 1; i++) {
          if (i === right_counter) {
            arrowKey.children[i].classList.remove("captionFocused");
            right_counter++;
            arrowKey.children[right_counter].classList.add("captionFocused");
            arrowKey.children[right_counter].scrollIntoView(false);
            arrowKey.children[right_counter].scrollIntoView({
              block: "center",
            });
            arrowKey.children[right_counter].scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "nearest",
            });

            break;
          }
        }

        break;

      case 40: //DOWN
        if (popupVisibilitybyId(getCaptionPopupId())) {
          downKey();
          return;
        }
        break;
      case 66:
        openDialog();
        break;
      case 67: //c button
        setsubtitle();
        closeDialog();

        break;
      case 13: // 32 spacebar
        if (!popupVisibilitybyId("videoPopup")) {
          if (CC_SETTINGS) return;
        }

        let activeMenu = document.getElementsByClassName("menu-focused");
        let activeItem = activeMenu[0].attributes["id"].nodeValue;

        if (popupVisibilitybyId("captionSettingsPopup")) {
          document.getElementById(activeItem).classList.remove("menu-focused");

          switch (activeItem) {
            case "fontfamily":
              openCaptionSettingsFontFamilyPopup();
              break;
            case "fontcolor":
              openCaptionSettingsFontColor();

              break;
            case "fontsize":
              openCaptionSettingsFontSize();
              break;
            case "textopacity":
              openCaptionSettingsTextOpacity();
              break;
            case "characteredge":
              openCaptionSettingsCharecterEdge();
              break;
            case "bgcolor":
              openCaptionSettingsBgColor();
              break;
            case "bgopacity":
              openCaptionSettingsBgOpacity();
              break;
            case "windowColor":
              openCaptionSettingsWindowColor();
              break;
            case "windowOpacity":
              openCaptionSettingsWindowOpacity();
              break;
            case "language":
              openCaptionSettingsLanguage();
              break;
          }
          //
          // openCaptionSettingsFontFamilyPopup(); //Opne fontfacmily popup

          return;
        }

        let element = document.getElementsByClassName("captitle menu-focused");
        let value = element[0].attributes["id"].nodeValue;
        let words = value.split(":");

        switch (words[0]) {
          case "fontfamily":
            let ff = words[1].split("|").join(" ");
            localStorage.setItem("font-family", ff);
            break;
          case "fontcolor":
            localStorage.setItem("color", words[1]);
            break;
          case "fontsize":
            localStorage.setItem("fontsize", words[1]);
            break;
          case "textopacity":
            localStorage.setItem("textopacity", words[1]);
            break;
          case "characteredge":
            let ce = words[1].split("|").join(" ");
            localStorage.setItem("characteredge", ce);
            break;
          case "bgcolor":
            // var subtitleContainer =
            //   document.getElementById("subtitleContainer");
            // subtitleContainer.style.backgroundColor = words[1];

            localStorage.setItem("bgcolor", words[1]);
            break;
          case "bgopacity":
            localStorage.setItem("bgopacity", words[1]);
            break;
          case "windowColor":
            localStorage.setItem("windowColor", words[1]);
            break;
          case "windowOpacity":
            localStorage.setItem("windowOpacity", words[1]);
            break;
          case "language":
            switchSubtitleLanguage(words[2], words[1]);
            ccDisplayFromLanguageSettings(parseInt(words[2]));
            break;
        }
        removeCachedSelection();
        // setTimeout(() => {
        //   getSetting();
        //   setsubtitle();
        // }, 1000);
        getSetting();
        setsubtitle();

        break;
      case 10009: //RETURN button
        if (popupVisibilitybyId("video")) {
          let capPop = popupVisibilitybyId("captionSettingsPopup");
          let videoPopup = popupVisibilitybyId("videoPopup");
          let liveVideo = popupVisibilitybyId("video");
          let capFontFamily = popupVisibilitybyId(
            "captionSettingsPopup-fontFamily",
          );
          const capFontColor = popupVisibilitybyId(
            "captionSettingsPopup-fontColor",
          );
          const capFontSize = popupVisibilitybyId(
            "captionSettingsPopup-fontSize",
          );
          const capTextOpacity = popupVisibilitybyId(
            "captionSettingsPopup-textOpacity",
          );
          const capCharacterEdge = popupVisibilitybyId(
            "captionSettingsPopup-characterEdge",
          );
          const capBgColor = popupVisibilitybyId(
            "captionSettingsPopup-bgcolor",
          );
          const capBgOpacity = popupVisibilitybyId(
            "captionSettingsPopup-BgOpacity",
          );
          const capWindowColor = popupVisibilitybyId(
            "captionSettingsPopup-WindowColor",
          );
          const capWindowOpacity = popupVisibilitybyId(
            "captionSettingsPopup-WindowOpacity",
          );
          const capLanguage = popupVisibilitybyId(
            "captionSettingsPopup-language",
          );

          if ((videoPopup || liveVideo) && capPop) {
            //closeDialog(); //closing caption settings.

            closeCaptionSettingsPopup();
          } else if (capFontFamily) {
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
          } else if (capLanguage) {
            closeCaptionSettingsLanguage();
          }
        }

        //setsubtitle(); Call on OK(13) button not on back , so effect show immediatly

        BACK_BUTTON = true;

        setTimeout(() => {
          BACK_BUTTON = false;

          document.getElementById("play").classList.add("focuse"); //adding fouse to play buttton.
        }, 2000);

        return;
    }
  });
}
//localStorage.setItem("caption", JSON.stringify(caption));
var ctr = {
  counter: 0,
};

////////////////////////// cc setting for VOD videos bof//////////////////////////////////////////////
function setsubtitle() {
  if (!localStorage.getItem("font-family"))
    localStorage.setItem("font-family", "normal");
  let color = localStorage.getItem("color");
  let fontsize = localStorage.getItem("fontsize");
  let textopacity = localStorage.getItem("textopacity");
  let characteredge = localStorage.getItem("characteredge");
  let bgcolor = localStorage.getItem("bgcolor");
  let bgopacity = localStorage.getItem("bgopacity");
  let windowOpacity = localStorage.getItem("windowOpacity");
  let windowColor = localStorage.getItem("windowColor");
  let fontfamily = localStorage.getItem("font-family");

  if (color && textopacity) {
    color = `${color},${textopacity}`;
  }
  if (bgcolor && bgopacity) {
    bgcolor = `${bgcolor},${bgopacity}`;
  }
  if (fontsize) {
    fontsize = parseInt(fontsize) * 16;
  }

  if (fontfamily === "small-caps") {
    var cssTemplateString = `video::cue {
      color: rgb(${color});
      font-size: ${fontsize}px; 
      background-color: rgb(${bgcolor});
      font-family: "Amatic SC", sans-serif;
      font-weight: 400;
      font-style: normal;
      text-shadow: ${characteredge};
      font-variant: small-caps;    
    }`;
  } else {
    cssTemplateString = `video::cue {
      color: rgb(${color});
      font-size: ${fontsize}px; 
      background-color: rgb(${bgcolor});
      font-family: ${fontfamily};
      text-shadow: ${characteredge};
      font-variant: normal;  
    
    }`;
  }

  localStorage.setItem("ccSettings", cssTemplateString);
  const styleTag = document.createElement("style");
  //styleTag.innerHTML = cssTemplateString;
  styleTag.innerHTML = localStorage.getItem("ccSettings");

  document.head.insertAdjacentElement("beforeend", styleTag);
}

/// vod cc setting eof ///

// cc setting user feedback bof ///
function getSetting() {
  if (localStorage.getItem("color")) {
    let color = localStorage.getItem("color");
    let colorEl = document.getElementById("fontcolor:" + color);
    colorEl.style.backgroundColor = "lime";
    colorEl.style.color = "black";
    //colorEl.
  }

  if (localStorage.getItem("cc_lang")) {
    let cc_lang = localStorage.getItem("cc_lang");
    if (
      document.getElementById("language:" + cc_lang) &&
      document.getElementById("language:" + cc_lang).value
    ) {
      let laguaage = document.getElementById("language:" + cc_lang);
      laguaage.style.backgroundColor = "lime";
      laguaage.style.color = "black";
    }
    //colorEl.
  }

  if (localStorage.getItem("bgcolor")) {
    let bgcolor = localStorage.getItem("bgcolor");
    let bgcolorEl = document.getElementById("bgcolor:" + bgcolor);
    bgcolorEl.style.backgroundColor = "lime";
    bgcolorEl.style.color = "black";
  }

  if (localStorage.getItem("bgopacity")) {
    let bgopacity = localStorage.getItem("bgopacity");
    let bgopacityEl = document.getElementById("bgopacity:" + bgopacity);
    bgopacityEl.style.backgroundColor = "lime";
    bgopacityEl.style.color = "black";
  }

  if (localStorage.getItem("font-family")) {
    try {
      let fontFamily = localStorage.getItem("font-family");
      let fontFamilyEl = document.getElementById(
        "fontfamily:" + fontFamily.replace(/ /g, "|"),
      );

      fontFamilyEl.style.backgroundColor = "lime ";
      fontFamilyEl.style.color = "black";
    } catch (error) {
      //    log = document.getElementById("log");
      // log.innerHTML += `<div class="log"> Error : ${error} </div>`;
    }
  }

  if (localStorage.getItem("fontsize")) {
    let fontsize = localStorage.getItem("fontsize");
    let fontsizeEl = document.getElementById("fontsize:" + fontsize);
    fontsizeEl.style.backgroundColor = "lime";
    fontsizeEl.style.color = "black";
  }

  if (localStorage.getItem("textopacity")) {
    let textopacity = localStorage.getItem("textopacity");
    let textopacityEl = document.getElementById("textopacity:" + textopacity);
    textopacityEl.style.backgroundColor = "lime";
    textopacityEl.style.color = "black";
  }

  if (localStorage.getItem("characteredge")) {
    let characterEdge = localStorage.getItem("characteredge");
    let characteredgeEl = document.getElementById(
      "characteredge:" + characterEdge.replace(/ /g, "|"),
    );
    characteredgeEl.style.backgroundColor = "lime";
    characteredgeEl.style.color = "black";
  }

  if (localStorage.getItem("windowColor")) {
    let windowColor = localStorage.getItem("windowColor");
    let windowColorEl = document.getElementById("windowColor:" + windowColor);
    windowColorEl.style.backgroundColor = "lime";
    windowColorEl.style.color = "black";
  }

  if (localStorage.getItem("windowOpacity")) {
    let windowO_pacity = localStorage.getItem("windowOpacity");
    let windowOpacityEl = document.getElementById(
      "windowOpacity:" + windowO_pacity,
    );
    windowOpacityEl.style.backgroundColor = "lime";
    windowOpacityEl.style.color = "black";
  }
}

function removeCachedSelection() {
  let bgColor = document.getElementById("captionSettingsPopup-bgcolor");
  let colorEle = document.getElementById("captionSettingsPopup-fontColor");
  let languageEle = document.getElementById("captionSettingsPopup-language");
  let windowOpacity = document.getElementById(
    "captionSettingsPopup-WindowOpacity",
  );
  let windowColor = document.getElementById("captionSettingsPopup-WindowColor");
  let fontfamily = document.getElementById("captionSettingsPopup-fontFamily");
  let fontsize = document.getElementById("captionSettingsPopup-fontSize");
  let textopacity = document.getElementById("captionSettingsPopup-textOpacity");
  let characteredge = document.getElementById(
    "captionSettingsPopup-characterEdge",
  );
  let bgopacity = document.getElementById("captionSettingsPopup-BgOpacity");

  for (let i = 0; i < colorEle.children.length; i++) {
    if (colorEle.children[i].hasAttribute("style")) {
      colorEle.children[i].removeAttribute("style");
    }
  }
  for (let i = 0; i < languageEle.children.length; i++) {
    if (languageEle.children[i].hasAttribute("style")) {
      languageEle.children[i].removeAttribute("style");
    }
  }

  for (let i = 0; i < bgColor.children.length; i++) {
    if (bgColor.children[i].hasAttribute("style")) {
      bgColor.children[i].removeAttribute("style");
    }
  }

  for (let i = 0; i < windowOpacity.children.length; i++) {
    if (windowOpacity.children[i].hasAttribute("style")) {
      windowOpacity.children[i].removeAttribute("style");
    }
  }

  for (let i = 0; i < windowColor.children.length; i++) {
    if (windowColor.children[i].hasAttribute("style")) {
      windowColor.children[i].removeAttribute("style");
    }
  }

  for (let i = 0; i < fontfamily.children.length; i++) {
    if (fontfamily.children[i].hasAttribute("style")) {
      fontfamily.children[i].removeAttribute("style");
    }

    // fontfamily.children[i].removeAttribute("style");
  }

  for (let i = 0; i < fontsize.children.length; i++) {
    if (fontsize.children[i].hasAttribute("style")) {
      fontsize.children[i].removeAttribute("style");
    }
  }

  for (let i = 0; i < textopacity.children.length; i++) {
    if (textopacity.children[i].hasAttribute("style")) {
      textopacity.children[i].removeAttribute("style");
    }
  }

  for (let i = 0; i < characteredge.children.length; i++) {
    if (characteredge.children[i].hasAttribute("style")) {
      characteredge.children[i].removeAttribute("style");
    }
  }

  for (let i = 0; i < bgopacity.children.length; i++) {
    if (bgopacity.children[i].hasAttribute("style")) {
      bgopacity.children[i].removeAttribute("style");
    }
  }
}
// cc setting user feedback eof ///

// Function to manually switch subtitle track by language
function switchSubtitleLanguage(id, label) {
  if (VIDEO_GROUP === "live") {
    if (hls) {
      hls.subtitleTrack = parseInt(id);
    }
    localStorage.setItem("cc_lang", `${label}:${id}`);
  } else {
    enableCc()
      .then((result) => {
        if (hls) {
          hls.subtitleTrack = parseInt(id);
        }
        localStorage.setItem("cc_lang", `${label}:${id}`);
      })
      .catch((error) => {
        console.log("Error from captinSettings", error);
      });
    // .finally(() => {
    //   if (hls) {
    //     hls.subtitleTrack = parseInt(id);
    //   }
    //   localStorage.setItem("cc_lang", `${label}:${id}`);
    // });
  }
}
