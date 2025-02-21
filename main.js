window.onload = async (event) => {
  getPublicIP();
  document.getElementById("idx").focus();
  //console.log("page is fully loaded");
  registerKeyHandler();
  weatherKeys();

  await show_loader();
  await videoList();
  await hide_loader();
  const lan = ["English"];
  localStorage.setItem("lang", JSON.stringify(lan));
  localStorage.setItem("cc_lang", "English:0");

  AppLaunchUser("AppLaunchUser", LOCATION, BRAND, APP_VERSION);
  Settings("Settings", "NA", LOCATION, BRAND, APP_VERSION);
  // Brand();
  // Publication();
};

function terminate() {
  // if (window.confirm("Do you really want to leave?")) {
  //   localStorage.removeItem("videoPlayed");
  //   localStorage.removeItem("CAT_ID");
  //   tizen.application.getCurrentApplication().exit();
  // }
  localStorage.removeItem("videoPlayed");
  localStorage.removeItem("CAT_ID");
  localStorage.removeItem("ccSettings");

  tizen.application.getCurrentApplication().exit();
}
function isVideoHidden(el) {
  return el.offsetParent === null;
}

function popupVisibilitybyId(element) {
  // console.log("visibility called");
  const popup = document.getElementById(element);
  if (popup === null) return;
  if (window.getComputedStyle(popup).display == "none") {
    // console.log("This element is hidden.");
    return false;
  } else {
    //  console.log("This element is not hidden.");
    return true;
  }
}

function popupVisibilitybyClass(className) {
  let atvieEl = document.getElementsByClassName(className);
  let element = atvieEl[0].attributes["id"].nodeValue;
  const popup = document.getElementById(element);
  if (window.getComputedStyle(popup).display == "none") {
    // console.log("This element is hidden.");
    return false;
  } else {
    //console.log("This element is not hidden.");
    return popup;
  }
}

//////// ad macro config ///

var userAgent = navigator.userAgent;
var device_id = "";
var rdp; //ccpa
try {
  device_id = webapis.adinfo.getTIFA();
} catch (e) {
  console.log("Error getting TIFA: ", e.message);
}
try {
  rdp = webapis.adinfo.isLATEnabled();
} catch (e) {
  console.log("Error getting LATE", e.message, "----", e.name);
}
// getting device id
var deviceId;
try {
  deviceId = tizen.systeminfo.getCapability("http://tizen.org/system/tizenid");
} catch (error) {
  console.error("Error getting Device ID:", error.message);
}

var ADMACRO = {
  __PLATFORM__: "samsungtv",
  __APP_BUNDLE__: "",
  __APP_NAME__: encodeURIComponent("WDRB+"),
  __APP_STORE_URL__: "",
  __APP_IAB_BUNDLE__: "",
  __DEVICE_ID__: encodeURIComponent(deviceId),
  __APP_ID_TYPE__: device_id,
  __US_PRIVACY__: rdp ? "1YYN" : "1YNN",
  __TIMESTAMP__: Date.now().toString(),
  __IP__: "",
  __USER_AGENT__: encodeURIComponent(navigator.userAgent), // URL encode UA
};

async function getPublicIP() {
  try {
    let response = await fetch("https://api64.ipify.org?format=json");
    let data = await response.json();
    ADMACRO.__IP__ = data.ip;
  } catch (error) {
    ip = webapis.network.getIp();
    ADMACRO.__IP__ = ip;
  }
}

////////////////////////////
/*
async function postJSON(data) {
  try {
    const response = await fetch("http://65.0.132.225/create", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}
*/

// if (typeof tizen !== "undefined" && tizen.systeminfo) {
//   console.log("tizen.systeminfo API is available");
// } else {
//   console.error("tizen.systeminfo API is NOT available");
// }
