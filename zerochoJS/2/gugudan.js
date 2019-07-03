const body = document.body;
const create = el => document.createElement(el);
const appendEl = (el, name) => el.appendChild(name);
let firstNumber = Math.ceil(Math.random() * 9);
let lastNumber = Math.ceil(Math.random() * 9);

const question = create('div');
const form = create('form');
const input = create('input')
const button = create('button');
const result = create('p');

appendEl(body, question);
appendEl(body, form);
appendEl(body, result);
appendEl(form, input);
appendEl(form, button);
input.type='number';
button.textContent='입력';
input.focus();
question.textContent = `${firstNumber}곱하기 ${lastNumber}는?`

function playGame() {
  const resultant = firstNumber * lastNumber;
  const answer = +input.value
  if (answer === resultant) {
    result.textContent = '딩동댕';
    firstNumber = Math.ceil(Math.random() * 9)
    lastNumber = Math.ceil(Math.random() * 9);
    question.textContent = `${firstNumber}곱하기 ${lastNumber}는?`
    input.value='';
    input.focus();
  } else {
    result.textContent = '땡, 다시!';
    input.value='';
    input.focus();
  }
}
  
function handleSublmit(e) {
  e.preventDefault();
  playGame();
}

function init() {
  form.addEventListener('submit', handleSublmit);
}

init();