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
  wrap.querySelector(".paint__toolB label").innerText = brushSize.value;
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
