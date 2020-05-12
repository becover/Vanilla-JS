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

const undoList = [];
let redoList = [];
let poppingLastIndex = true;
let poppingAfterIndex = true;
let isPainting = false;
let isFilling = false;
let isPipetting = false;
let isPicking = false;
let isWriting = false;
let lastUseBrushShape = brushsShape[0];

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

const eventPropagationChecker = {
  getTargetTag: (target, tName) => {
    while (target && target.tagNage !== tName) {
      target = target.tagName !== "HTML" ? target.parentNode : false;
    }
    return target;
  },
};

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
  if (isWriting) {
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
  isPipetting = true;
  canvas.style.cursor = "crosshair";
}

function stopPipetting() {
  isPipetting = false;
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
  undoList.push(canvas.toDataURL());
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
  if (redoList.length <= 0) return false;
  if (poppingAfterIndex) {
    const tossToUndoList = redoList.pop();
    undoList.push(tossToUndoList);
    poppingAfterIndex = false;
  }
  bindDrawImage(redoList, undoList);
}

function handleUndoHistory() {
  if (undoList.length <= 0) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return false;
  }
  if (poppingLastIndex) {
    const tossToRedoList = undoList.pop();
    redoList.push(tossToRedoList);
    poppingLastIndex = false;
  }
  bindDrawImage(undoList, redoList);
  poppingAfterIndex = true;
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
  isFilling && ctx.fillRect(0, 0, canvas.width, canvas.height);
  isPipetting && pipetColor(ctx, e.offsetX, e.offsetY, e);
  isWriting && handleFillText(e.offsetX, e.offsetY);
}

function handleModeButton() {
  if (isFilling) {
    isFilling = false;
    modeButton.innerText = "Fill";
  } else {
    isFilling = true;
    modeButton.innerText = "Paint";
  }
}

function bindBrushSize() {
  if (isWriting) {
    onChangeTextSize();
  }
  ctx.lineWidth = brushSize.value;
  wrap.querySelector(".paint__toolB label").innerText = brushSize.value;
}

function stopPainting() {
  isPainting = false;
}

function onMouseMove(e) {
  const x = e.offsetX;
  const y = e.offsetY;
  if (!isPainting) {
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else {
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

function onMouseDown() {
  if (isWriting) return false;
  isPainting = true;
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
      if (isWriting) {
        isWriting = false;
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
  if (isWriting) {
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

function createEl(el, name, parent) {
  const parentEl = parent && document.querySelector(parent);
  const El = document.createElement(el);
  const MANUAL = `작성 후 엔터를 치세요`;
  if (el === "input") {
    El.type = "text";
    El.value = MANUAL;
  } else {
    El.innerText = MANUAL;
  }
  El.classList.add(name);
  parentEl.appendChild(El);
  return El;
}

function getTextareaInfo(textarea) {
  const text = textarea.innerText;
  const color = window.getComputedStyle(textarea).getPropertyValue("color");
  const size = window.getComputedStyle(textarea).getPropertyValue("font-size");
  let top = window
    .getComputedStyle(textarea)
    .getPropertyValue("top")
    .slice(0, -2);
  let left = window
    .getComputedStyle(textarea)
    .getPropertyValue("left")
    .slice(0, -2);
  const height = window
    .getComputedStyle(textarea)
    .getPropertyValue("height")
    .slice(0, -2);
  top = Number(top) + (Number(height) + 8) / 3;
  left = Number(left);
  return { text, color, size, top, left };
}

function removeTextarea(el) {
  return el.remove();
}

function drawText(text, color, size, top, left) {
  ctx.textBaseline = "middle";
  ctx.font = `${size} "Do Hyeon"`;
  ctx.fillStyle = color;
  ctx.fillText(text, left + 1, top);
  stackCanvasHistory();
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

function handleFillText(x, y) {
  if (document.querySelector(".inputBox") === null) {
    const textarea = createEl("span", "inputBox", ".paint__boardWrap");
    textarea.style.top = `${y}px`;
    textarea.style.left = `${x}px`;
    textarea.style.maxWidth = `${500 - x}px`;
    textarea.style.height = `${+brushSize.value}px`;
    textarea.style.color = currentColor.style.backgroundColor;
    textarea.style.fontSize = `${+brushSize.value}px`;
    textarea.contentEditable = isWriting;
    textarea.focus();
    textarea.addEventListener("keydown", function (e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        paintText2canvas(textarea);
        fillTextButton.classList.remove(CLASS_PICK);
        lastUseBrushShape.classList.add(CLASS_PICK);
      }
    });
  }
}

function paintText2canvas(textarea) {
  if (isWriting) {
    isWriting = false;
    const { text, color, size, top, left } = getTextareaInfo(textarea);
    removeTextarea(textarea);
    drawText(text, color, size, top, left);
  }
}

function handleFillTextButton(e) {
  isWriting = true;
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
