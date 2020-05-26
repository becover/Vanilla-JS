const $id = (selector) => document.getElementById(selector);
const $class = (selector) => document.getElementsByClassName(selector);
const $qSelector = (parent = document, selector) =>
  parent.querySelector(selector);
const $qSelectorAll = (parent = document, selector) =>
  parent.querySelectorAll(selector);

const wrap = $id("wrap");
const palette = $qSelector(wrap, ".paint__palette");
const paletteColors = $class("paint__palette-color");
const currentColor = $qSelector(wrap, ".paint__palette-currentColor");
const colorPickerButton = $qSelector(wrap, ".colorPicker");
const brushsShape = $qSelectorAll(wrap, ".paint__brush li");
const brushSize = $id("paint__brush-size");
const textButton = $qSelectorAll(wrap, ".paint__text li");
const undoButton = $qSelector(wrap, ".undo");
const redoButton = $qSelector(wrap, ".redo");
const alphaRange = $id("paint__color-alpha");
const canvasWrap = $qSelector(wrap, ".paint__boardWrap");
const CLASS_PICK = "pick";
