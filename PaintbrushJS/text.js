function initDragStatus() {
  dragStatus.startAngle = 0;
  dragStatus.angle = 0;
  dragStatus.rotation = 0;
}

function paintText2canvas(e) {
  const style = e.target.attributes.style.value;
  const text = e.target.innerText;
  const xml = `
  <svg xmlns="http://www.w3.org/2000/svg" width="500" height="500">
    <foreignObject width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml">
        <style>
        ${fontFace}
        span {
          position: absolute;
          display: inline-block;
          font-family: "Do Hyeon", sans-serif;
          background-color: transparent;
          word-wrap: break-word;
          word-break: break-all;
          line-height: 1;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          ${style}
        }
        </style>
        <span font-family="Do Hyeon">${text}</span>
      </div>
    </foreignObject>
  </svg>`;
  const img = new Image();
  img.src = "data:image/svg+xml," + encodeURIComponent(xml);
  img.onload = function () {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    removeEl(e.target);
    stackCanvasHistory();
  };
}

function onChangeTextColor() {
  const textarea = $qSelector(wrap, ".inputBox");
  if (textarea !== null) {
    handleStyle(textarea);
  }
}

function onChangeTextSize() {
  const textarea = $qSelector(wrap, ".inputBox");
  if (textarea !== null && textStatus.mode === "fill") {
    textarea.style.fontSize = `${+brushSize.value}px`;
    textarea.style.height = `${+brushSize.value}px`;
  } else if (textarea !== null && textStatus.mode === "border") {
    textarea.style.textShadow = `
    1px 1px ${brushSize.value}px ${canvasStatus.color},
    -1px 1px ${brushSize.value}px ${canvasStatus.color},
    -1px -1px ${brushSize.value}px ${canvasStatus.color},
    1px -1px ${brushSize.value}px ${canvasStatus.color},
    -1px 0 ${brushSize.value}px ${canvasStatus.color},
    0 -1px ${brushSize.value}px ${canvasStatus.color},
    1px 0 ${brushSize.value}px ${canvasStatus.color},
    0 1px ${brushSize.value}px ${canvasStatus.color}`;
  }
}

function dragStart(e) {
  e.preventDefault();
  const { top, left, height, width } = this.getBoundingClientRect();

  dragStatus.offsetX = e.offsetX;
  dragStatus.offsetY = e.offsetY;

  dragStatus.center.x = left + width / 2;
  dragStatus.center.y = top + height / 2;
  if (
    Math.abs(dragStatus.center.x - e.clientX) <= 20 &&
    Math.abs(dragStatus.center.y - e.clientY) <= 20
  ) {
    this.style.cursor = "move";
    changeToFlagStatus(dragStatus, "move", true);
  } else {
    const x = e.clientX - dragStatus.center.x;
    const y = e.clientY - dragStatus.center.y;
    dragStatus.startAngle = (180 / Math.PI) * Math.atan2(y, x);
    changeToFlagStatus(dragStatus, "rotate", true);
  }
}

function dragging(e) {
  e.preventDefault();
  if (dragStatus.rotate) {
    const x = e.clientX - dragStatus.center.x;
    const y = e.clientY - dragStatus.center.y;
    const degree = Math.round((180 / Math.PI) * Math.atan2(y, x));
    dragStatus.rotation = degree - dragStatus.startAngle;
    this.style.transform = `rotate(${
      dragStatus.angle + dragStatus.rotation
    }deg)`;
  }
  if (dragStatus.move) {
    const y = e.clientY - dragStatus.offsetY;
    const x = e.clientX - dragStatus.offsetX;

    this.style.top = `${y - canvas.getBoundingClientRect().top}px`;
    this.style.left = `${x - canvas.getBoundingClientRect().left}px`;
  }
}

function dragStop() {
  if (dragStatus.rotate) {
    dragStatus.angle = Math.round(dragStatus.angle + dragStatus.rotation);
    return changeToFlagStatus(dragStatus, "rotate", false);
  }
  if (dragStatus.move) {
    this.style.cursor = "pointer";
    return changeToFlagStatus(dragStatus, "move", false);
  }
}

function addAttributes(el, x, y) {
  const MANUAL = `작성 후 엔터를 치세요`;
  if (el.classList.contains("inputBox")) {
    el.innerText = MANUAL;
    el.style.top = `${y}px`;
    el.style.left = `${x}px`;
    el.style.fontSize = `${+brushSize.value}px`;
    el.draggable = "true";
    el.id = "draggable";
  }
}

function handleStyle(el) {
  handleAlphaValue();
  if (textStatus.mode === "fill") {
    el.style.color = canvasStatus.color;
  }
  if (textStatus.mode === "border") {
    el.style.textShadow = `
    1px 1px ${brushSize.value}px ${canvasStatus.color},
    -1px 1px ${brushSize.value}px ${canvasStatus.color},
    -1px -1px ${brushSize.value}px ${canvasStatus.color},
    1px -1px ${brushSize.value}px ${canvasStatus.color},
    -1px 0 ${brushSize.value}px ${canvasStatus.color},
    0 -1px ${brushSize.value}px ${canvasStatus.color},
    1px 0 ${brushSize.value}px ${canvasStatus.color},
    0 1px ${brushSize.value}px ${canvasStatus.color}`;
  }
}

function handleFillText(x, y) {
  if ($qSelector(wrap, ".inputBox") === null) {
    const textarea = createEl("span", "inputBox", ".paint__boardWrap");
    addAttributes(textarea, x, y);
    handleStyle(textarea);

    textarea.addEventListener("keydown", function (e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        paintText2canvas(e);
        textButton.forEach((button) => button.classList.remove(CLASS_PICK));
        canvasStatus.lastUseBrushShape.classList.add(CLASS_PICK);
        initDragStatus();
        changeToFlagStatus(canvasStatus, "isWriting", false);
        changeToFlagStatus(canvasStatus, "mode", "brush");
      }
    });

    textarea.addEventListener("dblclick", function () {
      textarea.contentEditable = canvasStatus.isWriting;
      textarea.style.cursor = "text";
      textarea.focus();
    });
    textarea.addEventListener("blur", function () {
      textarea.contentEditable = false;
      textarea.style.cursor = "default";
    });
    textarea.addEventListener("mouseenter", function () {
      textarea.style.cursor = "pointer";
    });
    textarea.addEventListener("mousedown", dragStart, false);
    textarea.addEventListener("mousemove", dragging, false);
    textarea.addEventListener("mouseup", dragStop, false);
    textarea.addEventListener("mouseleave", dragStop, false);
  } else {
    const textarea = $qSelector(wrap, ".inputBox");
    handleStyle(textarea);
  }
}

function handleTextButton(e) {
  changeToFlagStatus(canvasStatus, "isWriting", true);
  changeToFlagStatus(textStatus, "mode", e.target.dataset.textmode);
  Array.from(textButton).forEach((button) =>
    button.classList.remove(CLASS_PICK)
  );
  e.target.classList.add(CLASS_PICK);
  canvasStatus.mode = "text";
  brushsShape.forEach((shape) => shape.classList.remove(CLASS_PICK));
}

Array.from(textButton).forEach((btn) =>
  btn.addEventListener("click", handleTextButton)
);
