var LOCATION = "KSTP 5 Minneapolis-St. Paul, MN";
var BRAND = "SamsungTV";
var APP_VERSION = "1.2.9";
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Function to get or create a client_id
function getClientId() {
  let client_id = localStorage.getItem("client_id");
  if (!client_id) {
    client_id = generateUUID();
    localStorage.setItem("client_id", client_id);
  }
  return client_id;
}

// Function to send GA event using Fetch API
const client_id = getClientId();
const measurementId = `G-BKGYXQBWTV`;
const apiSecret = `yixndTC4R1OsVYM4WTNUlQ`;
const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`;

function AppLaunchUser(eventAction, location, brand, app_version) {
  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      client_id: client_id,
      events: [
        {
          name: eventAction,
          params: {
            location: location,
            item_brand: brand,
            app_version: app_version,
          },
        },
      ],
    }),
  });
}

function SectionViewed(
  eventAction,
  category_name,
  method,
  location,
  brand,
  app_version,
) {
  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      client_id: client_id,
      events: [
        {
          name: eventAction,
          params: {
            item_category: category_name,
            method: method,
            location: location,
            item_brand: brand,
            app_version: app_version,
          },
        },
      ],
    }),
  });
}

function VideoPlayed(
  eventAction,
  item_id,
  item_name,
  item_category,
  content_type,
  method,
  source,
  whiz_guid,
  location,
  brand,
  app_version,
) {
  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      client_id: client_id,
      events: [
        {
          name: eventAction,
          params: {
            item_id: item_id,
            item_name: item_name,
            item_category: item_category,
            content_type: content_type,
            method: method,
            source: source,
            whiz_guid: whiz_guid,
            location: location,
            item_brand: brand,
            app_version: app_version,
          },
        },
      ],
    }),
  });
}

function Settings(eventAction, item_name, location, brand, app_version) {
  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      client_id: client_id,
      events: [
        {
          name: eventAction,
          params: {
            item_name: item_name,
            location: location,
            item_brand: brand,
            app_version: app_version,
          },
        },
      ],
    }),
  });
}

function VideoProgress(
  eventAction,
  item_name,
  item_id,
  item_category,
  content_type,
  method,
  source,
  whiz_guid,
  video_current_time,
  video_percent,
  location,
  brand,
  app_version,
) {
  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      client_id: client_id,
      events: [
        {
          name: eventAction,
          params: {
            item_name: item_name,
            item_id: item_id,
            item_category: item_category,
            content_type: content_type,
            method: method,
            source: source,
            whiz_guid: whiz_guid,
            video_current_time: video_current_time,
            video_percent: video_percent,
            location: location,
            item_brand: brand,
            app_version: app_version,
          },
        },
      ],
    }),
  });
}

function Brand() {
  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      client_id: client_id,
      user_properties: {
        Brand: {
          value: "SamsungTV",
        },
      },
    }),
  });
}

function Publication() {
  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      client_id: client_id,
      user_properties: {
        Publication: {
          value: LOCATION,
        },
      },
    }),
  });
}
