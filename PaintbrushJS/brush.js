let layer = null;
let layerCtx = null;
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
  ctx.lineWidth = canvasStatus.lineWidth;
  $qSelectorAll(wrap, ".paint__toolB label")[0].innerText =
    canvasStatus.lineWidth;
}

// function handleAlphaValue() {
//   $qSelectorAll(wrap, ".paint__toolB label")[1].innerText = alphaRange.value;

//   const rgbString = window
//     .getComputedStyle(currentColor)
//     .getPropertyValue("background-color")
//     .split("(")[1]
//     .split(")")[0]
//     .split(",");
//   const [r, g, b] = rgbString;
//   const a = this.value / 100;
//   const rgbaString = buildRgbaString({ r, g, b, a });
//   console.log(rgbaString);
//   canvasStatus.color = rgbaString;
// }

function onMouseDown2Layer(e) {
  console.log("mousemove!");

  const x = e.offsetX;
  const y = e.offsetY;
  if (!canvasStatus.isPainting) {
    layerCtx.beginPath();
    layerCtx.moveTo(x, y);
  } else {
    // layerCtx.strokeStyle = canvasStatus.color;
    // layerCtx.fillStyle = canvasStatus.color;
    layerCtx.lineTo(x, y);
    layerCtx.stroke();
  }
}

function onMouseUp2Layer(e) {
  console.log("mouseup!");

  const layerImg = new Image();
  const src = layer.toDataURL("image/png");
  layerImg.src = src;

  const canvasImg = new Image();
  const style = e.target.attributes.style.value;
  const xml = `
    <svg xmlns="http://www.w3.org/2000/svg" width="500" height="500">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">
          <style>
          img {
            position: absolute;
            top:0;
            left:0;
            ${style}
          }
          </style>
          <img src="${src}"/>
        </div>
      </foreignObject>
    </svg>`;
  canvasImg.src = "data:image/svg+xml," + encodeURIComponent(xml);
  canvasImg.onload = function () {
    ctx.drawImage(canvasImg, 0, 0, canvas.width, canvas.height);
    stackCanvasHistory();
    changeToFlagStatus(canvasStatus, "isPainting", false);
    canvasHistory.poppingLastIndex = true;
    canvasHistory.redoList = [];
    layerCtx.clearRect(0, 0, canvasStatus.width, canvasStatus.height);
  };
}

function handleLayerEvent() {
  console.log("handleLayerEvent!");

  layer = $qSelector(wrap, ".alphaLayer");
  layerCtx = layer.getContext("2d");
  layerCtx.fillStyle = canvasStatus.color;
  layerCtx.lineWidth = canvasStatus.lineWidth;
  layerCtx.lineCap = canvasStatus.lineCap;
  console.log(layerCtx.lineCap, canvasStatus.lineCap);
  layer.style.opacity = +alphaRange.value / 100;
  layer.addEventListener("mousemove", onMouseDown2Layer);
  layer.addEventListener("mousedown", onMouseDown);
  layer.addEventListener("mouseup", onMouseUp2Layer);
  layer.addEventListener("mouseleave", function () {
    changeToFlagStatus(canvasStatus, "isPainting", false);
  });
  layer.addEventListener("click", function (e) {
    console.log("click!");

    canvasStatus.isFilling &&
      layerCtx.fillRect(0, 0, layer.width, layer.height);
    canvasStatus.isPipetting && pipetColor(layerCtx, e.offsetX, e.offsetY, e);
    canvasStatus.isWriting && handleFillText(e.offsetX, e.offsetY);
  });
  layer.addEventListener("contextmenu", handleRightClick);
}

function handelLayer() {
  $qSelectorAll(wrap, ".paint__toolB label")[1].innerText = alphaRange.value;
  if (
    (canvasStatus.mode = "brush") &&
    alphaRange.value < 100 &&
    $qSelector(wrap, ".alphaLayer") === null
  ) {
    console.log("handle ### New ### Layer!");
    const layer = createEl("canvas", "alphaLayer", canvasWrap);
    const layerCtx = layer.getContext("2d");
    layer.width = canvasStatus.width;
    layer.height = canvasStatus.height;
    layerCtx.strokeStyle = canvasStatus.color;
    layerCtx.fillStyle = "rgba(255,255,255,0)";
    layerCtx.fillRect(0, 0, canvasStatus.width, canvasStatus.height);
    handleLayerEvent();
  } else if (
    (canvasStatus.mode = "brush") &&
    alphaRange.value < 100 &&
    $qSelector(wrap, ".alphaLayer") !== null
  ) {
    console.log("handle $$$ Old $$$ Layer!");

    handleLayerEvent();
  } else {
    console.log("handle --- Clear --- Layer!");

    $qSelector(wrap, ".alphaLayer") !== null &&
      removeEl($qSelector(wrap, ".alphaLayer"));
  }
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
