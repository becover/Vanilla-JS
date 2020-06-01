const canvasHistory = {
  undoList: [],
  redoList: [],
};

const canvasStatus = {
  width: 500,
  height: 500,
  color: "#333",
  lineWidth: 25,
  lineCap: "butt",
  lineJoin: "bevel",
  isPainting: false,
  isFilling: false,
  isPipetting: false,
  isPicking: false,
  isWriting: false,
  isDrawingShapes: false,
  mode: "brush",
  shapes: {
    type: null,
    location: {
      start: {},
      end: {},
    },
  },
};
const dragStatus = {
  startAngle: 0,
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

let textStatus = {
  mode: "fillText",
};
