function displayInternetError() {
  const networkError = document.getElementById("networkError");
  const net = document.getElementById("net");
  net.focus();
  console.log("got in network popup");
  networkError.style.display = "block";
}

function hideInternetError() {
  const networkError = document.getElementById("networkError");
  const net = document.getElementById("net");
  console.log("Hide network popup");
  net.blur();
  networkError.style.display = "none";
}

function mediaError() {
  const parent = document.getElementById("customDialog");
  const div = document.createElement("div");
  div.setAttribute("id", "mediaError");
  div.innerHTML = `<span class="mediaError"></span>`; //`<span class="mediaError">Media Error!</span>`;
  parent.appendChild(div);
  clearTimeout(MINI_TIMEOUT_ID);
  fatalError = false;
}
function removeMediaError() {
  //const errorDiv = document.getElementById("mediaError");
  const errorDiv = document.querySelectorAll("#mediaError");
  if (errorDiv !== null) {
    //errorDiv.remove();
    document.querySelectorAll("#mediaError").forEach((e) => e.remove());
  }
}

async function getFileSize(url) {
  const response = await fetch(url, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.blob();
  return data.size;
}
