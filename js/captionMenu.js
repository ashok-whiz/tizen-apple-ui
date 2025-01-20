var ctr = {
  counter: 0,
};

function getCaptionPopupId() {
  let id = "";
  if (popupVisibilitybyId("captionSettingsPopup")) {
    id = "captionSettingsPopup";
  } else if (popupVisibilitybyId("captionSettingsPopup-fontFamily")) {
    id = "captionSettingsPopup-fontFamily";
  } else if (popupVisibilitybyId("captionSettingsPopup-fontColor")) {
    id = "captionSettingsPopup-fontColor";
  } else if (popupVisibilitybyId("captionSettingsPopup-fontSize")) {
    id = "captionSettingsPopup-fontSize";
  } else if (popupVisibilitybyId("captionSettingsPopup-textOpacity")) {
    id = "captionSettingsPopup-textOpacity";
  } else if (popupVisibilitybyId("captionSettingsPopup-characterEdge")) {
    id = "captionSettingsPopup-characterEdge";
  } else if (popupVisibilitybyId("captionSettingsPopup-bgcolor")) {
    id = "captionSettingsPopup-bgcolor";
  } else if (popupVisibilitybyId("captionSettingsPopup-BgOpacity")) {
    id = "captionSettingsPopup-BgOpacity";
  } else if (popupVisibilitybyId("captionSettingsPopup-WindowColor")) {
    id = "captionSettingsPopup-WindowColor";
  } else if (popupVisibilitybyId("captionSettingsPopup-WindowOpacity")) {
    id = "captionSettingsPopup-WindowOpacity";
  } else if (popupVisibilitybyId("captionSettingsPopup-language")) {
    id = "captionSettingsPopup-language";
  }

  // console.log(">> menu->  " + id);

  return id;
}

function downKey() {
  let leftKey = document.getElementById(getCaptionPopupId());
  let lcount = leftKey.children;
  let lcounter = 1;

  for (let i = 1; i < lcount.length; i++) {
    if (leftKey.children[i].className === "captitle menu-focused") {
      lcounter = i;
      break;
    }
  }

  for (let i = 1; i < lcount.length; i++) {
    if (i === lcounter) {
      if (lcounter === lcount.length - 1) break;
      leftKey.children[i].classList.remove("menu-focused");
      lcounter++;
      leftKey.children[lcounter].classList.add("menu-focused");
      categoryId = leftKey.children[lcounter].id;
      leftKey.children[lcounter].scrollIntoView(false);
      break;
    }
  }
}

function upKey() {
  const upNav = document.getElementById(getCaptionPopupId());
  const childCcount = upNav.children;
  let counter = 1;

  for (let i = 1; i < childCcount.length; i++) {
    if (upNav.children[i].className === "captitle menu-focused") {
      counter = i;

      break;
    }
  }

  for (let i = 1; i < childCcount.length; i++) {
    if (i === counter) {
      if (counter <= 1) break;
      upNav.children[i].classList.remove("menu-focused");
      counter--;

      upNav.children[counter].classList.add("menu-focused");

      break;
    }
  }
}
