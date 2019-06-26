// const form = document.querySelector(".js-form");
// const result = form.querySelector("result");
// const inputData = form.querySelector("inputData");

// function getKeyValue(e) {
//   const button = document.querySelector(`button[data-key="${e.keyCode}"]`);
//   
// }

// function handleSubmit(event) {
  //   event.preventDefault();
//   getKeyValue();
// }

// function init() {
  //   window.addEventListener("keydown", handleSubmit);
  // }
  // init();

  // if(e.keyCode === 13) {
  //   input.value = eval(result.value);
  // } else {
  //   return false;
  // }

const form = document.querySelector('.js-form');
const input = document.getElementById('inputData');
const result = document.getElementById('result');


function divideKey(e) {
  console.log(e)
  const button = document.querySelector(`button[value="${e.key}"]`);
  console.log(button)
  const getClass = button.classList;
  

  (e.keyCode === 13) //enter키 누르면
  ? input.value = eval(result.value) //지금까지의 식을 계산하기
  : (getClass.contains('num')) //class가 num이면
  ? inputNumber(e) //숫자추가
  : (getClass.contains('operator')) // class가 operator면
  ? inputOperator(e) //연산자추가
  : (e.keyCode === 27) //esc키 누르면
  ? form.reset() //form 초기화
  : false;

    function inputNumber(e) {
      input.value = button['value'];
      result.value += button['value'];
    }

    function inputOperator(e) {
      //바로앞에 연산자가 존재하면 마지막에 누른 연산자로 변경 조건걸어주기
      result.value += button['value'];
    }
}

function handleSubmitKeydown(event) {
  event.preventDefault();
  divideKey(event);
}

function handleSubmitClick(event) {
  event.preventDefault();
}

window.addEventListener("keydown", handleSubmitKeydown,)
form.addEventListener("click", handleSubmitKeydown)