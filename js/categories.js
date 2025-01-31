var catid;
var CATEGORYID;
var AD_TAG = "";
var SECTION_AD = [];
var ITEM_ID;
var BASEURL = "https://dispatch.whizti.com/api/";
var IMAGE_RESIZE_URL = "https://resizer.whizti.com/api/resize/300?url=";

var PUBID = 743; //875; //743; //875; //743;
var CUSTOME_OVERLAY;
var SERVER_ERROR;
var WEATHER_URL;

async function getData(resource, options = {}) {
  const { timeout = 8000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  if (!response.ok) {
    throw new Error("HTTP status " + response.status);
  }
  return response;
}

async function category_id() {
  // const spinner = document.getElementById("spinner");
  // spinner.removeAttribute("hidden");
  try {
    const response = await getData(BASEURL + "publication/" + PUBID, {
      timeout: 30000,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    // Timeouts if the request takes
    // longer than 30 seconds
    SERVER_ERROR = true;
    console.log(error.name === "AbortError");
    console.log("ERROR : ", error);
    openErrorNotification("Error", "An error occured");
    //  spinner.setAttribute("hidden", "");
  }
}

async function videoList() {
  // Check if the content is already rendered and stored in memory

  let categoryid;
  categoryid = await category_id()
    .then((category) => category)
    .catch((err) => {
      console.log(err);
    });

  //Section ad bof
  categoryid.response.categories.forEach((category) => {
    if (
      category.preroll_url_fire !== "" &&
      category.preroll_url_fire !== undefined
    ) {
      SECTION_AD.push({ id: category.id, adUrl: category.preroll_url_fire });
    }
  });
  //section ad eof
  if (categoryid.response.config.custom_overlay_ott !== undefined) {
    CUSTOME_OVERLAY = JSON.parse(categoryid.response.config.custom_overlay_ott);
  }
  if (categoryid.response.config.weather_url !== undefined) {
    // WEATHER_URL = categoryid.response.config.weather_url;
    weather(
      categoryid.response.config.weather_url +
        "?zip_code=" +
        categoryid.response.config.zipcode,
    );
  }
  //console.log("Weather url ", WEATHER_URL);
  //CUSTOME_OVERLAY = JSON.parse(categoryid.response.config.custom_overlay_ott);
  AD_TAG = categoryid.response.config.preroll_url_fire;
  localStorage.setItem("CAT_ID", categoryid.response.categories[0].id);
  let firstCat = categoryid.response.categories[0].id;
  CATEGORYID = firstCat;

  const pageElement = document.getElementById("pagelist");
  pageElement.innerHTML = "";
  categoryid.response.categories.forEach((cats, index) => {
    let div = document.createElement("div");
    div.className = "flex_container";
    div.setAttribute("id", cats.id);
    div.innerHTML += `<div class="category-name">${cats.label}</div>`;

    categoryid.response.content[cats.name].forEach((content, i) => {
      if (firstCat === cats.id && i === 0) {
        const content_uri = content.uri;
        //ad macro url bof
        var contentUri;
        try {
          ADMACRO.__TIMESTAMP__ = Date.now();
          contentUri = content.uri.replace(
            "__APP_NAME__",
            `${encodeURI(ADMACRO.__APP_NAME__)}`,
          );
          contentUri = contentUri.replace(
            "__APP_BUNDLE__",
            `${encodeURI(ADMACRO.__APP_BUNDLE__)}`,
          );
          contentUri = contentUri.replace(
            "__USER_AGENT__",
            `${encodeURI(ADMACRO.__USER_AGENT__)}`,
          );
          contentUri = contentUri.replace(
            "__IP__",
            `${encodeURI(ADMACRO.__IP__)}`,
          );
          contentUri = contentUri.replace(
            "__TIMESTAMP__",
            `${encodeURI(ADMACRO.__TIMESTAMP__)}`,
          );
          contentUri = contentUri.replace(
            "__DEVICE_ID__",
            `${encodeURI(ADMACRO.__DEVICE_ID__)}`,
          );
        } catch (e) {
          console.log(e.message);
        }
        //ad macro url eof

        sessionStorage.setItem("video_title", content.title);
        //document.getElementById("head").src = content.icon_uri;
        const headContainer = document.getElementById("headContainer");
        //headContainer.style.backgroundImage = "url('" + content.icon_uri + "')";
        document.documentElement.style.setProperty(
          "--bg-image",
          `url('${content.icon_uri}')`,
        );

        miniVideo(
          contentUri,
          content.daiAssetKey,
          content.video_group,
          content.category_id,
          content.id,
        ); //paying first video

        //bof analytics for Live
        const analytics = {
          event: "VideoPlayed",
          item_id: content_uri.substr(-100),
          item_name: content.title,
          item_category: cats.label,
          content_type: content.video_group,
          method: "Home Page",
          source: "DIRECT",
          whiz_guid: content.assetid,
          location: LOCATION,
          item_brand: BRAND,
          app_version: APP_VERSION,
        };
        SectionViewed(
          "SectionViewed",
          analytics.item_category,
          "Content Click",
          analytics.location,
          analytics.item_brand,
          analytics.app_version,
        );

        VideoPlayed(
          analytics.event,
          analytics.item_id,
          analytics.item_name,
          analytics.item_category,
          analytics.content_type,
          analytics.method,
          analytics.source,
          analytics.whiz_guid,
          analytics.location,
          analytics.item_brand,
          analytics.app_version,
        );

        var videoCurrentTime = 0;
        INTERVAL_ID = setInterval(function () {
          let secconds = videoProgressLive(); //not in use 4 seconds differncen
          videoCurrentTime += 300;
          VideoProgress(
            "VideoProgress",
            analytics.item_name,
            analytics.item_id,
            analytics.item_category,
            analytics.content_type,
            analytics.method,
            analytics.source,
            analytics.whiz_guid,
            videoCurrentTime,
            "N/A",
            analytics.location,
            analytics.item_brand,
            analytics.app_version,
          );
        }, 300000);

        // eof analytics for Live
      }

      if (firstCat === cats.id && i === 0) {
        /*
                    miniVideo(
                      content.uri,
                      content.daiAssetKey,
                      content.video_group,
                      content.category_id,
                      content.id
                    ); //paying first video
                  */
        if (content.icon_uri) {
          div.innerHTML += `
            <div class="item " tabindex="-1" role="" id="${content.id}" video_title="${content.title}" cat_name="${cats.label}" caption="${content.caption}" guid="${content.assetid}" videoUrl="${content.uri}" catId="${content.category_id}" daiAssetKey="${content.daiAssetKey}" id="${content.uri}" video_group="${content.video_group}">
            <div class="" id="note${content.id}"></div>
              <img id="thumb${content.id}" class="thumbnail" src="${content.icon_uri}"   />
              
            <div class="title" > ${content.title}</div>
            </div>`;
        } else {
          div.innerHTML += `<div class="item"  tabindex="-1" role="" video_title="${content.title}" cat_name="${cats.label}" guid="${content.assetid}"> ${content.title}</div>`;
        }
      } else if (cats.parent_id === "0") {
        if (content.icon_uri) {
          div.innerHTML += `
            <div class="item" tabindex="-1" role="" id="${content.id}" video_title="${content.title}" cat_name="${cats.label}" guid="${content.assetid}" caption="${content.caption}" videoUrl="${content.uri}" catId="${content.category_id}" daiAssetKey="${content.daiAssetKey}" id="${content.uri}" video_group="${content.video_group}">
            <div class="" id="note${content.id}"></div>           
            <img id="thumb${content.id}" class="thumbnail" src="${content.icon_uri}"   />
                      
            <div class="title" > ${content.title}</div>
            </div>`;
        } else {
          div.innerHTML += `<div class="item" tabindex="-1" role="" video_title="${content.title}" cat_name="${cats.label}" guid="${content.assetid}"> ${content.title}</div>`;
        }
      } else {
        if (content.icon_uri) {
          if (CUSTOME_OVERLAY !== undefined) {
            div.innerHTML += `
            <div class="item" tabindex="-1" role="" id="${
              content.id
            }" caption="${content.caption}" video_title="${
              content.title
            }" cat_name="${cats.label}" guid="${content.assetid}" videoUrl="${
              content.uri
            }" catId="${content.category_id}" daiAssetKey="${
              content.daiAssetKey
            }" id="${content.uri}" video_group="${content.video_group}">
              ${
                CUSTOME_OVERLAY.landingPage.isTallboxInLandingPage == 1
                  ? `<div class="" id="note${content.id}"></div> <img id="thumb${content.id}" class="tallbox" src="${content.icon_uri}"   />`
                  : `<div class="" id="note${content.id}"></div> <img id="thumb${content.id}" class="thumbnail" src="${content.icon_uri}"   />`
              }
              ${
                CUSTOME_OVERLAY.landingPage.isTitle == 1
                  ? `<div class="title">${content.title}</div>`
                  : ``
              }</div>`;
          } else {
            div.innerHTML += `
            <div class="item" tabindex="-1" role="" id="${content.id}" video_title="${content.title}" cat_name="${cats.label}" guid="${content.assetid}" caption="${content.caption}" videoUrl="${content.uri}" catId="${content.category_id}" daiAssetKey="${content.daiAssetKey}" id="${content.uri}" video_group="${content.video_group}">
            <div class="" id="note${content.id}"></div> 
            <img id="thumb${content.id}" class="thumbnail" src="${content.icon_uri}"   />
            <div class="title">${content.title}</div>
            </div>`;
          }
        } else {
          div.innerHTML += `<div class="item" tabindex="-1" role="" video_title="${content.title}" cat_name="${cats.label}" guid="${content.assetid}"> ${content.title}</div>`;
        }
      }
      pageElement.appendChild(div);
    });
  });

  /** ## LOCAL CACHE NOT REQUIRED SINCE SPA IN USE SO DISABLED */
  //sessionStorage.setItem("cachedContent", pageElement.innerHTML);

  //  videoElement.addEventListener("playing", function () {
  //   const plyingNow = document.getElementById(PLAYING);
  //   plyingNow.classList.add('notify-badge');
  //   plyingNow.textContent='Now Playing';
  //  localStorage.setItem("played", PLAYING);
  // });
}

async function show_loader() {
  const spinner = document.getElementById("spinner"); //spinner
  spinner.removeAttribute("hidden");

  document.body.classList.add("bgimage");
}

async function hide_loader() {
  const spinner = document.getElementById("spinner"); //spinner
  spinner.setAttribute("hidden", "");

  document.body.classList.remove("bgimage");

  let header = document.getElementById("header");
  header.style.display = "block";
}
