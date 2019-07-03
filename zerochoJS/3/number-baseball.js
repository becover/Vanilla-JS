const body = document.body;
const wrap = document.createElement('div')
const ul = document.createElement('ul');
const strike = document.createElement('li');
const ball = document.createElement('li');
const out = document.createElement('li');
const form = document.createElement('form');
const input = document.createElement('input');
const button = document.createElement('button');
const count = document.createElement('p');
const userAnswer = document.createElement('ul');
ul.classList.add('resultList');
strike.classList.add("strike");
strike.textContent='스트라이크';
ball.classList.add("ball");
ball.textContent='볼';
out.classList.add("out");
out.textContent='아웃';
button.textContent='입력';
body.appendChild(wrap)
wrap.appendChild(ul);
wrap.appendChild(form);
wrap.appendChild(count);
wrap.appendChild(userAnswer);
ul.appendChild(strike);
ul.appendChild(ball);
ul.appendChild(out);
form.appendChild(input);
form.appendChild(button);
input.maxLength='4';
input.minLength='4';

function init() {
  input.focus();
  settingNumber();
  form.addEventListener('submit', handleSubmit);
}
function handleSubmit(e) {
  e.preventDefault();
  compareNumber();
}

const correctNumber = [];
function settingNumber() {
  let randomNumber = Math.ceil(Math.random() * 9);
  for(let i=0; i<4;i++) {
    function replay() {
      (correctNumber.includes(randomNumber = Math.ceil(Math.random() * 9)))
      ? correctNumber.includes(randomNumber = Math.ceil(Math.random() * 9))
      ? replay()
      : correctNumber.push(randomNumber)
      : correctNumber.push(randomNumber)
    }
    (correctNumber.length===0)
    ? correctNumber.push(randomNumber)
    : replay()
  }
  return correctNumber;
}

let countNumber = 10;
function compareNumber() {
  const getUserNumber = [...input.value];
  const arr = getUserNumber.map(v=>parseInt(v));
  const li = document.createElement('li');
  li.textContent=arr;
  userAnswer.appendChild(li);
  let countStrike = 0;
  let countBall = 0;
  let countOut = 4;
  if (countNumber === 0) {
    alert(`10번의 기회를 모두 사용했습니다. 답은 ${correctNumber}입니다. 게임을 다시 시작합니다.`)
    window.location.reload();
  }
  if(correctNumber.join('') === arr.join('')){
    countStrike = 4
    countOut = 4 - (countStrike + countBall)
    strike.textContent=`스트라이크 ${countStrike}개`;
    ball.textContent=`볼 ${countBall}개`;
    out.textContent=`아웃 ${countOut}개`;
    input.value='';
    alert(`정답입니다!`);
    window.location.reload();
  } else {
    for(let i=0; i<4 ;i++) {
      if(correctNumber[i] === arr[i]) {
        countStrike++
      } else if(correctNumber.indexOf(arr[i]) > -1 ) {
        countBall++
      }
    }
    countNumber--;
    countOut = 4 - (countStrike + countBall);
    strike.textContent=`스트라이크 ${countStrike}개`;
    ball.textContent=`볼 ${countBall}개`;
    out.textContent=`아웃 ${countOut}개`;
    count.textContent=`남은 횟수는 ${countNumber}번 입니다.`;
    input.value='';
    input.focus();
    return countNumber;
  }
}

init();