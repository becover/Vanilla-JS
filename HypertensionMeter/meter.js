const select = selector => document.querySelector(selector);
const selectAll = selector => document.querySelectorAll(selector);
const addClass = (el, name) => el.classList.add(name);
const removeClass = (el, name) => el.classList.remove(name);

const elements = {}
const CLASS_ADD_ON = "on";
const guageData = [
  {
    name:"정상",
    max:120,
    min:80,
    el:null
  },
  {
    name:"고혈압 주의",
    max:139,
    min:89,
    el:null
  },
  {
    name:"고혈압",
    max:999,
    min:999,
    el:null
  }
];

function init() {
  initElements();
  initEvents();
};

function initElements() {
  elements["result"] = select("#result");
  elements["refresh"] = select("#refresh");
  elements["maxNum"] = select("#maximum");
  elements["miniNum"] = select("#minimum");
  elements["signalLight"] = select(".signalLight");
  elements["signalAll"] = elements["signalLight"].querySelectorAll("li");
  setGuageDataElements();
};

function setGuageDataElements() {
  guageData[0].el = elements["signalAll"][0]; //정상
  guageData[1].el = elements["signalAll"][1]; //고혈압 주의
  guageData[2].el = elements["signalAll"][2]; //고혈압
};

function initEvents() {
  elements["result"].addEventListener("click", guage);
  elements["refresh"].addEventListener("click", reguage);
  elements["maxNum"].addEventListener("keyup", onkeyUp);
  elements["miniNum"].addEventListener("keyup", onkeyUp);
};

function onkeyUp(e) {
  const elCurrentInput = e.currentTarget;
  const inputValue = elCurrentInput.value;
  //인풋 입력값 3자리 이상->3자리로 고정
  if (inputValue.length > 3) { 
    elCurrentInput.value = inputValue.slice(0,3);
  };

  if (e.keyCode === 13) {
    guage();
  };
};

function resetInputValue() {
  elements["maxNum"].value="";
  elements["miniNum"].value="";
};

function reguage() {
  resetInputValue();
  resetGuageClass();
};

function resetGuageClass() {
  for(let i = 0, len = elements["signalAll"].length; i < len; i++){
    removeClass(elements["signalAll"][i], CLASS_ADD_ON);
  };
};

function guage() {
  const maxValue = parseInt(elements["maxNum"].value);
  const minValue = parseInt(elements["miniNum"].value);
  if (!maxValue || !minValue) {
    alert("혈압수치를 입력해 주세요");
    return;
  }; 
  
  //1~119, 1~79: 정상, 120~138, 80~88 : 주의 139이상 89이상 위험
  for (let i=0, len = guageData.length; i < len; i++) {
    const guage = guageData[i];
    if (maxValue < guage.max && minValue < guage.min) {
      resetGuageClass();
      addClass(guage.el, CLASS_ADD_ON);
      return;
    };
  };
};

init();
