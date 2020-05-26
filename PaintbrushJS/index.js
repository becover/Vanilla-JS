/**
 * canvas
 */
const canvas = $qSelector(wrap, ".paint__board");
const ctx = canvas.getContext("2d");
canvas.width = canvasStatus.width;
canvas.height = canvasStatus.height;
ctx.fillStyle = "#fff";
ctx.fillRect(0, 0, canvasStatus.width, canvasStatus.height);
ctx.strokeStyle = canvasStatus.color;
ctx.fillStyle = canvasStatus.color;
ctx.lineWidth = canvasStatus.lineWidth;

function handleRightClick(e) {
  e.preventDefault();
}

function onMouseMove(e) {
  const x = e.offsetX;
  const y = e.offsetY;
  if (!canvasStatus.isPainting) {
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else {
    ctx.fillStyle = canvasStatus.color;
    ctx.strokeStyle = canvasStatus.color;
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

function onMouseDown() {
  if (canvasStatus.isWriting) return false;
  changeToFlagStatus(canvasStatus, "isPainting", true);
}

function onMouseUp() {
  stackCanvasHistory();
  changeToFlagStatus(canvasStatus, "isPainting", false);
  canvasHistory.poppingLastIndex = true;
  canvasHistory.redoList = [];
}

function onChangeCurrentColor(e) {
  const selectColor = e.target.style.backgroundColor;
  console.log(selectColor);
  selectColor && (currentColor.style.backgroundColor = selectColor);
  canvasStatus.color = selectColor;
  ctx.fillStyle = canvasStatus.color;
  if (canvasStatus.isWriting) {
    onChangeTextColor();
  }
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

function handleCanvasClick(e) {
  canvasStatus.isFilling && ctx.fillRect(0, 0, canvas.width, canvas.height);
  canvasStatus.isPipetting && pipetColor(ctx, e.offsetX, e.offsetY, e);
  canvasStatus.isWriting && handleFillText(e.offsetX, e.offsetY);
}

function renderCanvas() {
  if (canvas) {
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", function () {
      changeToFlagStatus(canvasStatus, "isPainting", false);
    });
    canvas.addEventListener("click", handleCanvasClick);
    canvas.addEventListener("contextmenu", handleRightClick);
  }
}

/**
 * common function
 */

function changeToFlagStatus(obj, key, status) {
  return (obj[key] = status);
}

function stackCanvasHistory() {
  canvasHistory.undoList.push(canvas.toDataURL());
}

function addClassPick(e) {
  const arrayColors = Array.from(paletteColors);
  arrayColors.forEach((color) => color.classList.remove(CLASS_PICK));
  e.target.classList.add(CLASS_PICK);
  onChangeCurrentColor(e);
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
  const parentEl = parent || document.querySelector(parent);
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
