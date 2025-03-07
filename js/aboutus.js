function openAboutus() {
  const about = document.querySelector("#aboutUs");
  about.style.display = "block";
  about.innerHTML = `<div class="aboutus-head"><div><img src="./images/aboutus_header.png"/></div><div class="version">Version ${appInfo.version}</div></div>`;
  about.innerHTML += `<div class="appname">${appInfo.name} </div>`;
  about.innerHTML += `
  <div class="content">
  <p>WDRB Media operates three different network anchored TV stations in the Louisville market
  (WDRB FOX / WBKI CW / My 58 MyNet)</p>
  </div>

  `;
  about.innerHTML += `<div class="footer">https://www.wdrb.com</div>`;
}

function closeAboutus() {
  const about = document.querySelector("#aboutUs");
  about.style.display = "none";
  videoElement.play();
  document.getElementById("aboutus").classList.add("focused");
  if (MINI_TIMEOUT_ID) clearTimeout(MINI_TIMEOUT_ID);

  miniPlayer(() => {
    MINI_TIMEOUT_ID = setTimeout(() => {
      maximizePlayer();
    }, 15000);
  });
}

function aboutPageKeys() {
  document.addEventListener("keydown", function (e) {
    tizen.tvinputdevice.registerKey("MediaPlayPause");
    tizen.tvinputdevice.registerKey("MediaPlay");
    tizen.tvinputdevice.registerKey("MediaStop");
    tizen.tvinputdevice.registerKey("MediaPause");
    tizen.tvinputdevice.registerKey("MediaRewind");
    tizen.tvinputdevice.registerKey("MediaFastForward");
    tizen.tvinputdevice.registerKey("Exit");

    if (!popupVisibilitybyId("aboutUs")) return;

    switch (e.keyCode) {
      case 10009: //back button
        if (popupVisibilitybyId("aboutUs")) {
          closeAboutus();
        }
        break;

      default:
        console.log("Key code : " + e.keyCode);
        break;
    }
  });
}
