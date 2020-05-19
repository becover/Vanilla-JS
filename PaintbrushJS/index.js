const wrap = document.getElementById("wrap");
const palette = wrap.querySelector(".paint__palette");
const paletteColors = document.getElementsByClassName("paint__palette-color");
const brushsShape = wrap.querySelectorAll(".paint__brush li");
const currentColor = wrap.querySelector(".paint__palette-currentColor");
const brushSize = document.getElementById("paint__brush-size");
const pipetteButton = wrap.querySelector(".pipette");
const colorPickerButton = wrap.querySelector(".colorPicker");
const modeButton = wrap.querySelector(".fill");
const saveButton = wrap.querySelector(".save");
const loadButton = wrap.querySelector(".load");
const undoButton = wrap.querySelector(".undo");
const redoButton = wrap.querySelector(".redo");
const fillTextButton = wrap.querySelector(".fillText");
const CLASS_PICK = "pick";

const canvasHistory = {
  undoList: [],
  redoList: [],
  poppingLastIndex: true,
  poppingAfterIndex: true,
};

const canvasStatus = {
  isPainting: false,
  isFilling: false,
  isPipetting: false,
  isPicking: false,
  isWriting: false,
  lastUseBrushShape: brushsShape[0],
};
const dragStatus = {
  startAngle: 70,
  angle: 0,
  center: {
    x: 0,
    y: 0,
  },
  offsetX: 0,
  offsetY: 0,
  rotation: 0,
  rotate: false,
  move: false,
};
function initDragStatus() {
  dragStatus.startAngle = 0;
  dragStatus.angle = 0;
  dragStatus.rotation = 0;
}

const canvas = wrap.querySelector(".paint__board");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;
ctx.fillStyle = "#fff";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = "#333";
ctx.fillStyle = "#333";
ctx.lineWidth = 5;

const colorPicker = wrap.querySelector(".color__board");
const pickerCtx = colorPicker.getContext("2d");
colorPicker.width = 200;
colorPicker.height = 200;
let gradient = pickerCtx.createLinearGradient(0, 0, colorPicker.width, 0);
gradient.addColorStop(0, "rgb(255, 0, 0)");
gradient.addColorStop(0.15, "rgb(255, 0, 255)");
gradient.addColorStop(0.33, "rgb(0, 0, 255)");
gradient.addColorStop(0.5, "rgb(0, 255, 255)");
gradient.addColorStop(0.68, "rgb(0, 255, 0)");
gradient.addColorStop(0.82, "rgb(255, 255, 0)");
gradient.addColorStop(1, "rgb(255, 0, 0)");
pickerCtx.fillStyle = gradient;
pickerCtx.fillRect(0, 0, colorPicker.width, colorPicker.height);
gradient = pickerCtx.createLinearGradient(0, 0, 0, colorPicker.height);
gradient.addColorStop(0, "rgba(255,255,255,1)");
gradient.addColorStop(0.5, "rgba(255,255,255,0)");
gradient.addColorStop(0.5, "rgba(0,0,0,0)");
gradient.addColorStop(1, "rgba(0,0,0,1)");

pickerCtx.fillStyle = gradient;
pickerCtx.fillRect(0, 0, colorPicker.width, colorPicker.height);
colorPicker.style.cursor = "crosshair";

const colors = [
  "#333",
  "#fff",
  "#ff1f09",
  "#ff7e0f",
  "#ffdf00",
  "#22ce16",
  "#0bc5e2",
  "#1621a7",
  "#7a21dc",
  "#ff15ac",
];

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
  currentColor.style.backgroundColor = colorString;
  ctx.fillStyle = colorString;
  ctx.strokeStyle = colorString;
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

function handlePipetteButton() {
  canvasStatus.isPipetting = true;
  canvas.style.cursor = "crosshair";
}

function stopPipetting() {
  canvasStatus.isPipetting = false;
  canvas.style.cursor = "default";
}

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

function stackCanvasHistory() {
  canvasHistory.undoList.push(canvas.toDataURL());
}

function bindDrawImage(beforeList, afterList) {
  const LastHistoryIndex = beforeList.pop();
  const img = new Image();
  const src = LastHistoryIndex;
  img.src = src;
  img.onload = function () {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
  afterList.push(LastHistoryIndex);
}

function handleRedoHistory() {
  if (canvasHistory.redoList.length <= 0) return false;
  if (canvasHistory.poppingAfterIndex) {
    const tossToUndoList = canvasHistory.redoList.pop();
    canvasHistory.undoList.push(tossToUndoList);
    canvasHistory.poppingAfterIndex = false;
  }
  bindDrawImage(canvasHistory.redoList, canvasHistory.undoList);
}

function handleUndoHistory() {
  if (canvasHistory.undoList.length <= 0) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return false;
  }
  if (canvasHistory.poppingLastIndex) {
    const tossToRedoList = canvasHistory.undoList.pop();
    canvasHistory.redoList.push(tossToRedoList);
    canvasHistory.poppingLastIndex = false;
  }
  bindDrawImage(canvasHistory.undoList, canvasHistory.redoList);
  canvasHistory.poppingAfterIndex = true;
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

function handleSaveButton() {
  const image = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = image;
  link.download = "download[paintJS]";
  link.click();
}

function handleRightClick(e) {
  e.preventDefault();
}

function handleCanvasClick(e) {
  canvasStatus.isFilling && ctx.fillRect(0, 0, canvas.width, canvas.height);
  canvasStatus.isPipetting && pipetColor(ctx, e.offsetX, e.offsetY, e);
  canvasStatus.isWriting && handleFillText(e.offsetX, e.offsetY);
}

function handleModeButton() {
  if (canvasStatus.isFilling) {
    canvasStatus.isFilling = false;
    modeButton.innerText = "Fill";
  } else {
    canvasStatus.isFilling = true;
    modeButton.innerText = "Paint";
  }
}

function bindBrushSize() {
  if (canvasStatus.isWriting) {
    onChangeTextSize();
  }
  ctx.lineWidth = brushSize.value;
  wrap.querySelector(".paint__toolB label").innerText = brushSize.value;
}

function stopPainting() {
  canvasStatus.isPainting = false;
}

function onMouseMove(e) {
  const x = e.offsetX;
  const y = e.offsetY;
  if (!canvasStatus.isPainting) {
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else {
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

function onMouseDown() {
  if (canvasStatus.isWriting) return false;
  canvasStatus.isPainting = true;
}

function onMouseUp() {
  stackCanvasHistory();
  stopPainting();
  poppingLastIndex = true;
  redoList = [];
}

function renderCanvas() {
  if (canvas) {
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", stopPainting);
    canvas.addEventListener("click", handleCanvasClick);
    canvas.addEventListener("contextmenu", handleRightClick);
  }
}

function pickBindBrush() {
  brushsShape.forEach((shape) =>
    shape.addEventListener("click", function (e) {
      brushsShape.forEach((shape) => shape.classList.remove(CLASS_PICK));
      lastUseBrushShape = e.currentTarget;
      if (canvasStatus.isWriting) {
        canvasStatus.isWriting = false;
        fillTextButton.classList.remove(CLASS_PICK);
      }
      e.currentTarget.classList.add(CLASS_PICK);
      ctx.lineCap = e.currentTarget.childNodes[1].innerText;
    })
  );
}

function onChangeCurrentColor(e) {
  const selectColor = e.target.style.backgroundColor;
  selectColor && (currentColor.style.backgroundColor = selectColor);
  ctx.strokeStyle = selectColor;
  ctx.fillStyle = selectColor;
  if (canvasStatus.isWriting) {
    onChangeTextColor();
  }
}

function addClassPick(e) {
  const arrayColors = Array.from(paletteColors);
  arrayColors.forEach((color) => color.classList.remove(CLASS_PICK));
  e.target.classList.add(CLASS_PICK);
  onChangeCurrentColor(e);
}

function pickBindColor() {
  const arrayColors = Array.from(paletteColors);
  arrayColors.forEach((color) => {
    color.addEventListener("click", addClassPick);
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

function onToggleClassPick(e, clickEl) {
  if (clickEl) {
    if (e.currentTarget.classList.contains(CLASS_PICK)) {
      e.currentTarget.classList.remove(CLASS_PICK);
    } else {
      e.currentTarget.classList.add(CLASS_PICK);
    }
  }
}

function handleColorPickerButton(e) {
  const clickEl = e.currentTarget && e.target.tagName === "LI";
  onToggleClassPick(e, clickEl);
  pipetColor(pickerCtx, e.offsetX, e.offsetY, e);
}

function addAttributes(el, x, y) {
  const MANUAL = `작성 후 엔터를 치세요`;
  if (el.classList.contains("inputBox")) {
    el.innerText = MANUAL;
    el.style.top = `${y}px`;
    el.style.left = `${x}px`;
    el.style.color = currentColor.style.backgroundColor;
    el.style.fontSize = `${+brushSize.value}px`;
    el.draggable = "true";
    el.id = "draggable";
  }
}

function getComputedStyleValue(el, style) {
  const els = document.querySelector(el);
  const result = window.getComputedStyle(els).getPropertyValue(style);
  return result;
}

function createEl(el, name, parent) {
  const parentEl = parent && document.querySelector(parent);
  const El = document.createElement(el);
  El.classList.add(name);
  parentEl.appendChild(El);
  return El;
}

function removeElement(...els) {
  console.log(els);
  els.forEach((el) => {
    el.remove();
  });
}

function onChangeTextColor() {
  const textarea = document.querySelector(".inputBox");
  if (textarea !== null) {
    textarea.style.color = currentColor.style.backgroundColor;
  }
}

function onChangeTextSize() {
  const textarea = document.querySelector(".inputBox");
  if (textarea !== null) {
    textarea.style.fontSize = `${+brushSize.value}px`;
    textarea.style.height = `${+brushSize.value}px`;
  }
}

function dragStart(e) {
  e.preventDefault();
  const { top, left, height, width } = this.getBoundingClientRect();

  dragStatus.offsetX = e.offsetX;
  dragStatus.offsetY = e.offsetY;

  dragStatus.center.x = left + width / 2;
  dragStatus.center.y = top + height / 2;
  if (
    Math.abs(dragStatus.center.x - e.clientX) <= 20 &&
    Math.abs(dragStatus.center.y - e.clientY) <= 20
  ) {
    this.style.cursor = "move";
    dragStatus.move = true;
  } else {
    const x = e.clientX - dragStatus.center.x;
    const y = e.clientY - dragStatus.center.y;
    dragStatus.startAngle = (180 / Math.PI) * Math.atan2(y, x);
    dragStatus.rotate = true;
  }
}

function dragging(e) {
  e.preventDefault();
  if (dragStatus.rotate) {
    const x = e.clientX - dragStatus.center.x;
    const y = e.clientY - dragStatus.center.y;
    const degree = Math.round((180 / Math.PI) * Math.atan2(y, x));
    dragStatus.rotation = degree - dragStatus.startAngle;
    this.style.transform = `rotate(${
      dragStatus.angle + dragStatus.rotation
    }deg)`;
  }
  if (dragStatus.move) {
    const y = e.clientY - dragStatus.offsetY;
    const x = e.clientX - dragStatus.offsetX;

    this.style.top = `${y - canvas.getBoundingClientRect().top}px`;
    this.style.left = `${x - canvas.getBoundingClientRect().left}px`;
  }
}

function dragStop() {
  if (dragStatus.rotate) {
    dragStatus.angle = Math.round(dragStatus.angle + dragStatus.rotation);
    return (dragStatus.rotate = false);
  }
  if (dragStatus.move) {
    this.style.cursor = "pointer";
    return (dragStatus.move = false);
  }
}

function handleFillText(x, y) {
  if (document.querySelector(".inputBox") === null) {
    const textarea = createEl("span", "inputBox", ".paint__boardWrap");
    addAttributes(textarea, x, y);
    textarea.addEventListener("keydown", function (e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        paintText2canvas(e);
        fillTextButton.classList.remove(CLASS_PICK);
        canvasStatus.lastUseBrushShape.classList.add(CLASS_PICK);
        initDragStatus();
        canvasStatus.isWriting = false;
      }
    });

    textarea.addEventListener("dblclick", function () {
      textarea.contentEditable = canvasStatus.isWriting;
      textarea.style.cursor = "text";
      textarea.focus();
    });
    textarea.addEventListener("blur", function () {
      textarea.contentEditable = false;
      textarea.style.cursor = "default";
    });
    textarea.addEventListener("mouseenter", function () {
      textarea.style.cursor = "pointer";
    });
    textarea.addEventListener("mousedown", dragStart, false);
    textarea.addEventListener("mousemove", dragging, false);
    textarea.addEventListener("mouseup", dragStop, false);
    textarea.addEventListener("mouseleave", dragStop, false);
  }
}

function paintText2canvas(e) {
  const style = e.target.attributes.style.value;
  const text = e.target.innerText;
  const xml = `
  <svg xmlns="http://www.w3.org/2000/svg" width="500" height="500">
    <foreignObject width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml">
        <style>
        ${fontFace}
        span {
          position: absolute;
          display: inline-block;
          font-family: "Do Hyeon", sans-serif;
          background-color: transparent;
          word-wrap: break-word;
          word-break: break-all;
          line-height: 1;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          ${style}
        }
        </style>
        <span font-family="Do Hyeon">${text}</span>
      </div>
    </foreignObject>
  </svg>`;
  const img = new Image();
  img.src = "data:image/svg+xml," + encodeURIComponent(xml);
  img.onload = function () {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
  removeElement(e.target);
  stackCanvasHistory();
}

function handleFillTextButton(e) {
  canvasStatus.isWriting = true;
  e.target.classList.add(CLASS_PICK);
  brushsShape.forEach((shape) => shape.classList.remove(CLASS_PICK));
}
function init() {
  createPaletteColors();
  pickBindColor();
  pickBindBrush();
  renderCanvas();
  brushSize.addEventListener("input", bindBrushSize);
  brushSize.addEventListener("wheel", wheelEventBindBrushSize);
  pipetteButton.addEventListener("click", handlePipetteButton);
  colorPickerButton.addEventListener("click", handleColorPickerButton);
  modeButton.addEventListener("click", handleModeButton);
  saveButton.addEventListener("click", handleSaveButton);
  loadButton.addEventListener("change", handleLoadButton);
  undoButton.addEventListener("click", handleUndoHistory);
  redoButton.addEventListener("click", handleRedoHistory);
  fillTextButton.addEventListener("click", handleFillTextButton);
}

init();
