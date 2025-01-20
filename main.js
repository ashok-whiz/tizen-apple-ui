window.onload = async (event) => {
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

var ip = null;
try {
  ip = webapis.network.getIp();
} catch (e) {
  console.log(
    "getIp exception [" +
      e.code +
      "] name: " +
      e.name +
      " message: " +
      e.message,
  );
}

var userAgent = navigator.userAgent;

var device_id;
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

const ADMACRO = {
  __APP_BUNDLE__: "LTv5tIjXdW",
  __APP_NAME__: "10 News Now - WSLS 10".trim(),
  __DEVICE_ID__: device_id,
  __TIMESTAMP__: "",
  __IP__: ip,
  __USER_AGENT__: userAgent,
  __RDP__: rdp,
};

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
// try {
//    var bluetooth = tizen.systeminfo.getCapability("http://tizen.org/system/tizenid");
//   console.log(" Device id = " + bluetooth);

// } catch (error) {
//   console.log("Error name: " + error.name + ", message: " + error.message);
// }
