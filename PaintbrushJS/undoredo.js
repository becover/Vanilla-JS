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
    changeToFlagStatus(canvasHistory, "poppingAfterIndex", false);
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
    changeToFlagStatus(canvasHistory, "poppingLastIndex", false);
  }
  bindDrawImage(canvasHistory.undoList, canvasHistory.redoList);
  changeToFlagStatus(canvasHistory, "poppingAfterIndex", true);
}

undoButton.addEventListener("click", handleUndoHistory);
redoButton.addEventListener("click", handleRedoHistory);