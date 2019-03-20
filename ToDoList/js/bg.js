const body = document.querySelector("body");

const IMG_NUMBER = 9;

function paintImage(imgNumber) {
  const image = new Image();
  image.src = `./common/img/${imgNumber + 1}.jpg`
  image.classList.add("bgImage");
  body.prepend(image);
}

function genRandom() {
  return Math.floor(Math.random() * IMG_NUMBER);
}

function init() {
  paintImage(genRandom());
}

init();
