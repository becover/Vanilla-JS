/**
 * canvas setting
 */
canvas.width = canvasStatus.width;
canvas.height = canvasStatus.height;
ctx.fillStyle = "#fff";
ctx.fillRect(0, 0, canvasStatus.width, canvasStatus.height);

layer.width = canvasStatus.width;
layer.height = canvasStatus.height;
layerCtx.fillStyle = "rgba(255,255,255,0)";
layerCtx.fillRect(0, 0, canvasStatus.width, canvasStatus.height);
layerCtx.fillStyle = canvasStatus.color;
layerCtx.lineWidth = canvasStatus.lineWidth;
layerCtx.lineCap = canvasStatus.lineCap;
layerCtx.lineJoin = canvasStatus.lineJoin;

function handleRightClick(e) {
  e.preventDefault();
}

function getMousePosition(canvas, e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

function onMouseMove(e) {
  const x = e.offsetX;
  const y = e.offsetY;
  if (!canvasStatus.isPainting) {
    layerCtx.beginPath();
    layerCtx.moveTo(x, y);
  } else if (canvasStatus.isDrawingShapes) {
    e.preventDefault();
    layerCtx.fillStyle = canvasStatus.color;
    layerCtx.strokeStyle = canvasStatus.color;
    canvasStatus.shapes.location.end = getMousePosition(layer, e);
    layerCtx.clearRect(0, 0, canvasStatus.width, canvasStatus.height);

    if (canvasStatus.shapes.type === "rectangle") {
      layerCtx.strokeRect(
        canvasStatus.shapes.location.start.x,
        canvasStatus.shapes.location.start.y,
        canvasStatus.shapes.location.end.x -
          canvasStatus.shapes.location.start.x,
        canvasStatus.shapes.location.end.y -
          canvasStatus.shapes.location.start.y
      );
    } else if (canvasStatus.shapes.type === "triangle") {
      const triangle = new Path2D();
      triangle.moveTo(
        canvasStatus.shapes.location.start.x +
          (canvasStatus.shapes.location.end.x -
            canvasStatus.shapes.location.start.x) /
            2,
        canvasStatus.shapes.location.start.y
      );

      triangle.lineTo(
        canvasStatus.shapes.location.start.x,
        canvasStatus.shapes.location.end.y
      );

      triangle.lineTo(
        canvasStatus.shapes.location.end.x,
        canvasStatus.shapes.location.end.y
      );

      triangle.closePath();
      layerCtx.stroke(triangle);
    } else if (canvasStatus.shapes.type === "circle") {
      const circle = new Path2D();

      circle.arc(
        canvasStatus.shapes.location.start.x +
          (canvasStatus.shapes.location.end.x -
            canvasStatus.shapes.location.start.x) /
            2,
        canvasStatus.shapes.location.start.y +
          (canvasStatus.shapes.location.end.y -
            canvasStatus.shapes.location.start.y) /
            2,
        (canvasStatus.shapes.location.end.x -
          canvasStatus.shapes.location.start.x) /
          2,
        -0.5 * Math.PI,
        2 * Math.PI
      );
      layerCtx.stroke(circle);
    }
  } else {
    layer.style.webkitFilter = "blur(0.4px)";
    layerCtx.fillStyle = canvasStatus.color;
    layerCtx.strokeStyle = canvasStatus.color;
    layerCtx.lineTo(x, y);
    layerCtx.stroke();
  }
}

function onMouseDown(e) {
  if (canvasStatus.isWriting) return false;
  if (canvasStatus.isDrawingShapes) {
    e.preventDefault();
    canvasStatus.shapes.location.start = getMousePosition(layer, e);
  }
  changeToFlagStatus(canvasStatus, "isPainting", true);
}

function onMouseUp(e) {
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
    changeToFlagStatus(canvasStatus, "isPainting", false);
    console.log("redoList.length", canvasHistory.redoList.length);
    canvasHistory.redoList.length > 0 &&
      canvasHistory.undoList.push(canvasHistory.redoList.pop());
    canvasHistory.redoList = [];
    stackCanvasHistory();
    console.log(
      "mouseup",
      canvasHistory.undoList,
      canvasHistory.undoList.length,
      canvasHistory.redoList,
      canvasHistory.redoList.length
    );
    layerCtx.clearRect(0, 0, canvasStatus.width, canvasStatus.height);
  };
}
function setCurrentColor2ctx() {
  handleAlphaValue();
  ctx.fillStyle = canvasStatus.color;
  layerCtx.fillStyle = canvasStatus.color;
  layerCtx.strokeStyle = canvasStatus.color;
}

function onChangeCurrentColor(e) {
  const selectColor = e.target.style.backgroundColor;
  selectColor && (currentColor.style.backgroundColor = selectColor);
  canvasStatus.color = selectColor;
  handleAlphaValue();
  ctx.fillStyle = canvasStatus.color;
  layerCtx.fillStyle = canvasStatus.color;
  layerCtx.strokeStyle = canvasStatus.color;
  if (canvasStatus.isWriting) {
    onChangeTextColor();
  }
}

function pickBindColor() {
  const arrayColors = Array.from(paletteColors);
  addClassPick(arrayColors);
}

function addClassPick(arrayList) {
  arrayList.forEach((list) => {
    list.addEventListener("click", function (e) {
      arrayList.forEach((list) => list.classList.remove(CLASS_PICK));
      e.target.classList.add(CLASS_PICK);
      onChangeCurrentColor(e);
    });
  });
}

function createPaletteColors() {
  colors.forEach((color) => {
    const li = document.createElement("li");
    li.style.backgroundColor = color;
    li.className = "paint__palette-color";
    palette.appendChild(li);
  });
  wrap.querySelector(".paint__palette-color").classList.add(CLASS_PICK);
}

function handleCanvasClick(e) {
  canvasStatus.isFilling &&
    (setCurrentColor2ctx(),
    ctx.fillRect(0, 0, canvasStatus.width, canvasStatus.height));
  canvasStatus.isPipetting && pipetColor(ctx, e.offsetX, e.offsetY, e);
  canvasStatus.isWriting && handleFillText(e.offsetX, e.offsetY);
}

function renderCanvas() {
  if (canvas) {
    canvas.addEventListener("contextmenu", handleRightClick);
  }

  if (layer) {
    layer.addEventListener("mousemove", onMouseMove);
    layer.addEventListener("mousedown", onMouseDown);
    layer.addEventListener("mouseup", onMouseUp);
    layer.addEventListener("mouseleave", function () {
      changeToFlagStatus(canvasStatus, "isPainting", false);
    });
    layer.addEventListener("click", handleCanvasClick);
    layer.addEventListener("contextmenu", handleRightClick);
  }
}

/**
 * common function
 */

function handleAlphaValue() {
  // $qSelectorAll(wrap, ".paint__toolB label")[1].innerText = alphaRange.value;

  const rgbString = window
    .getComputedStyle(currentColor)
    .getPropertyValue("background-color")
    .split("(")[1]
    .split(")")[0]
    .split(",");
  const [r, g, b] = rgbString;
  const a = alphaRange.value / 100;
  const rgbaString = buildRgbaString({ r, g, b, a });
  canvasStatus.color = rgbaString;
}

function changeToFlagStatus(obj, key, status) {
  return (obj[key] = status);
}
let a = 0;
function stackCanvasHistory() {
  canvasHistory.undoList.push(canvas.toDataURL());
  // a++;
  // canvasHistory.undoList.push(a);
}

function addClassPick(arrayList) {
  arrayList.forEach((list) => {
    list.addEventListener("click", function (e) {
      arrayList.forEach((list) => list.classList.remove(CLASS_PICK));
      e.currentTarget.classList.add(CLASS_PICK);
      onChangeCurrentColor(e);
    });
  });
}

function onToggleClassPick(e, clickEl) {
  if (clickEl) {
    if (e.currentTarget.classList.contains(CLASS_PICK)) {
      e.currentTarget.classList.remove(CLASS_PICK);
    } else {
      e.currentTarget.classList.add(CLASS_PICK);
    }
  }
}

function createEl(el, name, parent) {
  const parentEl = parent.nodeName || document.querySelector(parent);
  const El = document.createElement(el);
  El.classList.add(name);
  parentEl.appendChild(El);
  return El;
}

function removeEl(...els) {
  els.forEach((el) => {
    el.remove();
  });
}

function init() {
  createPaletteColors();
  pickBindColor();
  renderCanvas();
}

init();
