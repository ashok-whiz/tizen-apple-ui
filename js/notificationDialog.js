//registerPopupKeyHandler();
var OK_BUTTON;
function openNotificationDialog(popUpheader, popUpmsg, cancelButton = 1) {
  if (!cancelButton) {
    let button = document.getElementById("popup-cancel");
    button.remove();
    let okButton = document.getElementById("popup-ok");

    okButton.classList.add("popup-focused");

    OK_BUTTON = true;
  } else {
    let cancelButton = document.getElementById("popup-cancel");
    let okButton = document.getElementById("popup-ok");
    if (okButton.className === "popup-button exitFocus") {
      okButton.classList.remove("exitFocus");
    }

    cancelButton.classList.add("exitFocus");
  }

  const customDialogOverlay = document.getElementById("notificationPopup");

  let header = document.getElementById("pop-header");
  let msg = document.getElementById("pop-message");

  header.textContent = popUpheader;
  msg.textContent = popUpmsg;
  customDialogOverlay.style.display = "block";

  document.getElementById("alert").focus(); //tts
}

function closeNotificationDialog() {
  const customDialogOverlay = document.getElementById("notificationPopup");

  let header = document.getElementById("pop-header");
  let msg = document.getElementById("pop-message");
  header.textContent = "";
  msg.textContent = "";
  customDialogOverlay.style.display = "none";
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

    var notificationPopup = document.getElementById("notificationPopup");
    switch (e.keyCode) {
      case 13: //ok
        console.log("Ok button pressed notification");

        let popup = document.getElementsByClassName(
          "popup-button popup-focused",
        );
        console.log("Ok button length " + popup.length);
        if (!popup.length > 0) return;
        let popupId = popup[0].attributes["id"].nodeValue;
        console.log("Popup ID: " + popupId);
        if (popupId === "popup-ok") {
          console.log("Ok button");
          if (OK_BUTTON) {
            closeNotificationDialog();
          } else {
            terminate();
          }
        } else if (popupId === "popup-cancel") {
          closeNotificationDialog();
          console.log("Cancel button");
          return;
        }
        //}
        break;

      case 37: //left arrow
        let okf = document.getElementById("popup-ok");
        okf.classList.remove("popup-focused");
        let cancel = document.getElementById("popup-cancel");
        cancel.classList.add("popup-focused");
        break;

      case 39: //right arrow
        console.log("xxxxx");
        let cancelf = document.getElementById("popup-cancel");
        cancelf.classList.remove("popup-focused");
        let ok = document.getElementById("popup-ok");
        ok.classList.add("popup-focused");
        console.log("right arrow");
        break;
      default:
        console.log("Key code : " + e.keyCode);
        break;
    }
  });
}

function checkPopupVisibility() {
  console.log("visibility called");
  const notificationPopup = document.getElementById("notificationPopup");
  if (window.getComputedStyle(notificationPopup).display == "none") {
    console.log("This element is hidden.");
    return false;
  } else {
    console.log("This element is not hidden.");
    return true;
  }
}

function openErrorNotification(popUpheader, popUpmsg) {
  let okButton = document.getElementById("error-ok");
  okButton.classList.add("exitFocus");
  const error = document.getElementById("error");
  let header = document.getElementById("error-header");
  let msg = document.getElementById("error-message");

  header.textContent = popUpheader;
  msg.textContent = popUpmsg;
  error.style.display = "block";
}

function closeErrorNotification() {
  if (document.body.className === "bgimage") {
    document.body.classList.remove("bgimage");
  }
  const videoElement = document.getElementById("video");
  const error = document.getElementById("error");
  let okButton = document.getElementById("error-ok");
  okButton.classList.remove("exitFocus");

  let header = document.getElementById("error-header");
  let msg = document.getElementById("error-message");
  header.textContent = "";
  msg.textContent = "";
  error.style.display = "none";
  VIDEO_PLAYED = false;
  //ADS_PLAYED = false;
  if (videoElement) {
    //if video popup is visible
    closeVideoDialog();
  }
}

function closeErrorNote() {
  if (document.body.className === "bgimage") {
    document.body.classList.remove("bgimage");
  }
  const error = document.getElementById("error");
  let okButton = document.getElementById("error-ok");
  okButton.classList.remove("exitFocus");

  let header = document.getElementById("error-header");
  let msg = document.getElementById("error-message");
  header.textContent = "";
  msg.textContent = "";
  error.style.display = "none";
  // VIDEO_PLAYED = false;
  // closeVideoDialog();
}
