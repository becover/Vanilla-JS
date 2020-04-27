const wrap = document.getElementById("wrap");
const palette = wrap.querySelector(".paint__palette");
const paletteColors = document.getElementsByClassName("paint__palette-color");
const brushsShape = wrap.querySelectorAll(".paint__brush li");
const currentColor = wrap.querySelector(".paint__palette-currentColor");
const brushSize = document.getElementById("paint__brush-size");
const modeButton = wrap.querySelector(".fill");
const saveButton = wrap.querySelector(".save");
const loadButton = wrap.querySelector(".load");
const undoButton = wrap.querySelector(".undo");
const redoButton = wrap.querySelector(".redo");

const undoList = [];
let redoList = [];
let poppingLastIndex = true;
let poppingAfterIndex = true;

const canvas = wrap.querySelector(".paint__board");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;
ctx.fillStyle = "#fff";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = "#333";
ctx.fillStyle = "#333";
ctx.lineWidth = 5;

let isPainting = false;
let isFilling = false;

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
  link.download = "download[piantJS]";
  link.click();
}

function handleRightClick(e) {
  e.preventDefault();
}

function handleCanvasClick() {
  isFilling && ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function handleModeButton() {
  if (isFilling === true) {
    isFilling = false;
    modeButton.innerText = "Fill";
  } else if (isFilling === false) {
    isFilling = true;
    modeButton.innerText = "Paint";
  }
}

function bindBrushSize() {
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
      brushsShape.forEach((shape) => shape.classList.remove("pick"));
      e.currentTarget.classList.add("pick");
      ctx.lineCap = e.currentTarget.childNodes[1].innerText;
    })
  );
}

function addClassPick(e) {
  const arrayColors = Array.from(paletteColors);
  arrayColors.forEach((color) => color.classList.remove("pick"));
  e.target.classList.add("pick");
  e.target.style.backgroundColor &&
    (currentColor.style.backgroundColor = e.target.style.backgroundColor);
  ctx.strokeStyle = e.target.style.backgroundColor;
  ctx.fillStyle = e.target.style.backgroundColor;
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
  wrap.querySelector(".paint__palette-color").classList.add("pick");
}

function init() {
  createPaletteColors();
  pickBindColor();
  pickBindBrush();
  renderCanvas();
  brushSize.addEventListener("input", bindBrushSize);
  brushSize.addEventListener("wheel", wheelEventBindBrushSize);
  modeButton.addEventListener("click", handleModeButton);
  saveButton.addEventListener("click", handleSaveButton);
  loadButton.addEventListener("change", handleLoadButton);
  undoButton.addEventListener("click", handleUndoHistory);
  redoButton.addEventListener("click", handleRedoHistory);
}

init();
