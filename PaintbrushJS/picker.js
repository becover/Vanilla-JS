const colorPicker = $qSelector(wrap, ".color__board");
const pickerCtx = colorPicker.getContext("2d");

function initColorPicker() {
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
}

function handleColorPickerButton(e) {
  const clickEl = e.currentTarget && e.target.tagName === "LI";
  onToggleClassPick(e, clickEl);
  pipetColor(pickerCtx, e.offsetX, e.offsetY, e);
}
initColorPicker();

colorPickerButton.addEventListener("click", handleColorPickerButton);
