function handleShapesMode(e) {
  if (e.currentTarget.classList.contains(CLASS_PICK)) {
    e.currentTarget.classList.remove(CLASS_PICK);
    canvasStatus.isDrawingShapes = false;
  } else {
    console.log(e.currentTarget.classList.value);
    shapesButton.forEach((list) => list.classList.remove(CLASS_PICK));
    e.currentTarget.classList.add(CLASS_PICK);
    canvasStatus.isDrawingShapes = true;
    canvasStatus.shapes.type = e.currentTarget.classList[0];
    onChangeCurrentColor(e);
  }
}

Array.from(shapesButton).forEach((btn) =>
  btn.addEventListener("click", handleShapesMode)
);
