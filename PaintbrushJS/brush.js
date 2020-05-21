canvasStatus.lastUseBrushShape = brushsShape[0];

function wheelEventBindBrushSize(e) {
  e.preventDefault();
  const delta = Math.sign(event.deltaY);
  if (delta + 1) {
    brushSize.value = +brushSize.value - 0.1;
    bindBrushSize();
  } else {
    brushSize.value = +brushSize.value + 0.1;
    bindBrushSize();
  }
}

function bindBrushSize() {
  if (canvasStatus.isWriting) {
    onChangeTextSize();
  }
  ctx.lineWidth = brushSize.value;
  $qSelectorAll(wrap, ".paint__toolB label")[0].innerText = brushSize.value;
}

function handleAlphaValue() {
  $qSelectorAll(wrap, ".paint__toolB label")[1].innerText = alphaRange.value;

  const rgbString = window
    .getComputedStyle(currentColor)
    .getPropertyValue("background-color")
    .split("(")[1]
    .split(")")[0]
    .split(",");
  const [r, g, b] = rgbString;
  const a = this.value / 100;
  const rgbaString = buildRgbaString({ r, g, b, a });
  console.log(rgbaString);
  canvasStatus.color = rgbaString;
}

function pickBindBrush() {
  brushsShape.forEach((shape) =>
    shape.addEventListener("click", function (e) {
      brushsShape.forEach((shape) => shape.classList.remove(CLASS_PICK));
      lastUseBrushShape = e.currentTarget;
      if (canvasStatus.isWriting) {
        canvasStatus.isWriting = false;
        textButton.forEach((button) => button.classList.remove(CLASS_PICK));
      }
      e.currentTarget.classList.add(CLASS_PICK);
      ctx.lineCap = e.currentTarget.childNodes[1].innerText;
    })
  );
}

pickBindBrush();

brushSize.addEventListener("input", bindBrushSize);
brushSize.addEventListener("wheel", wheelEventBindBrushSize);
alphaRange.addEventListener("input", handleAlphaValue);
