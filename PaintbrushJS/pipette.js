const pipetteButton = $qSelector(wrap, ".pipette");

function getRgbaByImageData(imageData) {
  const [r, g, b, rawAlpha] = imageData.data;
  const a = rawAlpha / 255;
  return { r, g, b, a };
}

function buildRgbaString({ r, g, b, a }) {
  return `rgba(${r},${g},${b},${a})`;
}

function setColor2Canvas({ r, g, b, a }) {
  const colorString = buildRgbaString({ r, g, b, a });
  canvasStatus.color = colorString;
  currentColor.style.backgroundColor = canvasStatus.color;
  if (canvasStatus.isWriting) {
    onChangeTextColor();
  }
}

function pipetColor(ctx, x, y, e, width = 1, height = 1) {
  stopPipetting();
  if (e.target && e.target.tagName === "CANVAS") {
    const imageData = ctx.getImageData(x, y, width, height);
    const rgbaColor = getRgbaByImageData(imageData);
    return setColor2Canvas(rgbaColor);
  }
}

function stopPipetting() {
  changeToFlagStatus(canvasStatus, "isPipetting", false);
  canvas.style.cursor = "default";
}

function handlePipetteButton() {
  changeToFlagStatus(canvasStatus, "isPipetting", true);
  canvas.style.cursor = "crosshair";
}

pipetteButton.addEventListener("click", handlePipetteButton);
