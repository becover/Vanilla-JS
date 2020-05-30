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
const shapesButton = $qSelectorAll(wrap, ".paint__shapes li");
const undoButton = $qSelector(wrap, ".undo");
const redoButton = $qSelector(wrap, ".redo");
const alphaRange = $id("paint__color-alpha");
const canvasWrap = $qSelector(wrap, ".paint__boardWrap");
const canvas = $qSelector(wrap, ".paint__board");
const ctx = canvas.getContext("2d");
const layer = $qSelector(wrap, ".paint__layer");
const layerCtx = layer.getContext("2d");

const CLASS_PICK = "pick";
