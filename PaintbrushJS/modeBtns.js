const modeButton = $qSelector(wrap, ".fill");
const saveButton = $qSelector(wrap, ".save");
const loadButton = $qSelector(wrap, ".load");

function handleModeButton() {
  if (canvasStatus.isFilling) {
    changeToFlagStatus(canvasStatus, "isFilling", false);
    modeButton.innerText = "Fill";
  } else {
    changeToFlagStatus(canvasStatus, "isFilling", true);
    modeButton.innerText = "Paint";
  }
}

function handleSaveButton() {
  const image = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = image;
  link.download = "download[paintJS]";
  link.click();
}

function handleLoadButton() {
  const img = new Image();
  const file = document.getElementsByClassName("load")[0].files[0];
  const url = window.URL || window.webkitURL;
  const src = url.createObjectURL(file);

  img.src = src;
  img.onload = function () {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    url.revokeObjectURL(src);
  };
}

modeButton.addEventListener("click", handleModeButton);
saveButton.addEventListener("click", handleSaveButton);
loadButton.addEventListener("change", handleLoadButton);
