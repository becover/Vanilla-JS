const body = document.body;
const suggest = document.createElement('div');
const form = document.createElement('form');
const input = document.createElement('input');
const button = document.createElement('button');
const result = document.createElement('p');

body.appendChild(suggest);
body.appendChild(form);
body.appendChild(result);
form.appendChild(input);
form.appendChild(button);
button.textContent='입력';

const suggestedWords = prompt('제시어를 적어주세요');
suggest.textContent = suggestedWords;
input.focus();

const goLastLetterGame = () => {
  const lastLetter = suggest.textContent[suggest.textContent.length-1];
  if(lastLetter === input.value[0]) {
    result.textContent='딩동댕';
    suggest.textContent=input.value;
    input.value='';
    input.focus();
  } else {
    result.textContent='땡';
    input.value='';
    input.focus();
  }
}

const handleSublmit = (e) => {
  e.preventDefault();
  goLastLetterGame();
}

form.addEventListener('submit', handleSublmit);
