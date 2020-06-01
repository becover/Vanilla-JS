function move2history(to, from) {
  const lastImg = to.pop();
  from.push(lastImg);
}

function drawingImage2canvas(list) {
  const img = new Image();
  const src = list[list.length - 1];
  img.src = src;
  img.onload = function () {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
}

function handleRedoHistory() {
  const { undoList, redoList } = canvasHistory;

  if (redoList.length <= 0) return false;

  move2history(redoList, undoList);
  drawingImage2canvas(undoList);
}

function handleUndoHistory() {
  const { undoList, redoList } = canvasHistory;

  if (undoList.length <= 0) {
    ctx.clearRect(0, 0, canvasStatus.width, canvasStatus.height);
    return false;
  } else if (undoList.length === 1) {
    move2history(undoList, redoList);
    ctx.clearRect(0, 0, canvasStatus.width, canvasStatus.height);
    return false;
  }
  move2history(undoList, redoList);
  drawingImage2canvas(undoList);
}

undoButton.addEventListener("click", handleUndoHistory);
redoButton.addEventListener("click", handleRedoHistory);
