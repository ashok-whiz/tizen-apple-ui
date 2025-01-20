var items = document.querySelectorAll(".weatheritem");
var currentIndex = 0;
// items[currentIndex].children[0].classList.add("focused");

items[currentIndex].scrollIntoView(true);
items[currentIndex].scrollIntoView({
  block: "nearest",
});

function weatherKeys() {
  document.addEventListener("keydown", function (e) {
    tizen.tvinputdevice.registerKey("MediaPlayPause");
    tizen.tvinputdevice.registerKey("MediaPlay");
    tizen.tvinputdevice.registerKey("MediaStop");
    tizen.tvinputdevice.registerKey("MediaPause");
    tizen.tvinputdevice.registerKey("MediaRewind");
    tizen.tvinputdevice.registerKey("MediaFastForward");
    tizen.tvinputdevice.registerKey("Exit");

    switch (e.keyCode) {
      case 37: // Left key
        let leftKey = document.getElementById("hourly-container");
        let lcount = leftKey.children;
        let lcounter = 0;
        console.log("Total length->", lcount.length);
        for (let i = 0; i < lcount.length; i++) {
          if (leftKey.children[i].className === "hourly-item focused") {
            lcounter = i;

            break;
          }
        }

        for (let i = 0; i < lcount.length; i++) {
          if (i === lcounter) {
            if (lcounter <= 0) break;
            leftKey.children[i].classList.remove("focused");
            lcounter--;
            leftKey.children[lcounter].classList.add("focused");

            let focuseEl = document.getElementsByClassName(
              "hourly-item focused",
            );
            // let setfocus = focuseEl[0].attributes["id"].nodeValue;
            // document.getElementById(setfocus).focus();

            leftKey.children[lcounter].scrollIntoView(false);
            leftKey.children[lcounter].scrollIntoView({ block: "start" });
            leftKey.children[lcounter].scrollIntoView({
              behavior: "smooth",
              block: "start",
              inline: "nearest",
            });

            break;
          }
        }
        break;

      case 38: // up arrow
        if (currentIndex > 0) {
          currentIndex--;
          updateHighlight(currentIndex);
        }
        break;

      case 39: //Right arrow
        if (!popupVisibilitybyId("weatherPage")) return;
        if (MINI_TIMEOUT_ID) {
          clearTimeout(MINI_TIMEOUT_ID);
        }

        const container = document.querySelector("#hourly-container");

        let count = container.children;
        let right_counter = 0;

        for (let i = 0; i < count.length; i++) {
          if (container.children[i].className === "hourly-item focused") {
            right_counter = i;

            break;
          }
        }

        for (let i = 0; i < count.length - 1; i++) {
          if (i === right_counter) {
            container.children[i].classList.remove("focused");
            right_counter++;
            container.children[right_counter].classList.add("focused");
            var focuseEl = document.getElementsByClassName(
              "hourly-item focused",
            );

            container.children[right_counter].scrollIntoView(false);
            container.children[right_counter].scrollIntoView({
              block: "start",
            });
            container.children[right_counter].scrollIntoView({
              behavior: "smooth",
              block: "start",
              inline: "nearest",
            });

            break;
          }
        }
        break;
      case 40: //DOWN arrow
        console.log("currI ndex", currentIndex, "item lenght ", items.length);
        if (currentIndex < items.length - 1) {
          currentIndex++;
          updateHighlight(currentIndex);
        }

        console.log("from weather page");
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

function updateHighlight(index) {
  items.forEach((item, idx) => {
    // item.classList.remove("focused");

    if (idx === 1) {
      const hitem = document.querySelector("#hourly-container");
      for (let i = 0; i < hitem.children.length; i++) {
        hitem.children[i].classList.remove("focused");
      }
    }
    if (item.childElementCount > 0) {
      item.children[0].classList.remove("focused");
    } else {
      item.classList.remove("focused");
    }
  });

  if (index !== 0) items[index].children[0].classList.add("focused");

  items[index].children[0].scrollIntoView(true);
  items[index].children[0].scrollIntoView({
    block: "nearest",
  });
  // items[index].scrollIntoView({
  //   behavior: "instant",
  //   block: "start",
  //   //inline: "nearest",
  // });
}
