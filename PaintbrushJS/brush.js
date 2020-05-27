canvasStatus["lastUseBrushShape"] = brushsShape[0];

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
  canvasStatus.lineWidth = brushSize.value;
  layerCtx.lineWidth = canvasStatus.lineWidth;
  $qSelectorAll(wrap, ".paint__toolB label")[0].innerText =
    canvasStatus.lineWidth;
}

function handelLayer() {
  $qSelectorAll(wrap, ".paint__toolB label")[1].innerText = alphaRange.value;
  layer.style.opacity = +alphaRange.value / 100;
  setCurrentColor2ctx();
  if (canvasStatus.mode === "text") onChangeTextColor();
}

function pickBindBrush() {
  brushsShape.forEach((shape) =>
    shape.addEventListener("click", function (e) {
      brushsShape.forEach((shape) => shape.classList.remove(CLASS_PICK));
      canvasStatus.lastUseBrushShape = e.currentTarget;
      canvasStatus.mode = "brush";
      if (canvasStatus.isWriting) {
        canvasStatus.isWriting = false;
        textButton.forEach((button) => button.classList.remove(CLASS_PICK));
      }
      e.currentTarget.classList.add(CLASS_PICK);
      canvasStatus.lineCap = e.currentTarget.childNodes[1].innerText;
      layerCtx && (layerCtx.lineCap = canvasStatus.lineCap);
      ctx.lineCap = canvasStatus.lineCap;
    })
  );
}

pickBindBrush();

brushSize.addEventListener("input", bindBrushSize);
brushSize.addEventListener("wheel", wheelEventBindBrushSize);
alphaRange.addEventListener("input", handelLayer);
