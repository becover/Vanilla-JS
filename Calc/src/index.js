const form = document.querySelector('.js-form');
const input = document.getElementById('inputData');
const result = document.getElementById('result');
const h3 = document.querySelectorAll('.history h3'); 
const record = document.querySelector('.history ul');
const CLASS_ON = 'on';


function toggleClass() {
  if(h3[0].classList.contains(CLASS_ON)) {
    h3[0].classList.remove(CLASS_ON);
    h3[1].classList.add(CLASS_ON);
  } else {
    h3[0].classList.add(CLASS_ON);
    h3[1].classList.remove(CLASS_ON);
  }
}  
  function toggleEvent() {
    h3.addEventListener('click', toggleClass)
  }
  
  function divideKey(e) {
  console.log(e)
  const button = document.querySelector(`button[value="${e.key}"]`);
  console.log(button)
  const getClass = (className) => button.classList.contains(className);
  

  if (e.keyCode === 13) {            // enter키 누르면
    input.value = eval(result.value) // 지금까지의 식을 계산하기
    //계산 기록으로 내보내기
    const li = document.createElement('li');
    const recordResult = document.createElement('p');
    const recordInput = document.createElement('p');
    recordResult.innerHTML = result.value;
    recordInput.innerHTML = input.value;
    li.appendChild(recordResult);
    li.appendChild(recordInput);
    record.prepend(li);
    result.value = '';
  }

  (getClass('num'))         // class가 num이면
  ? insertNumber(e)         // 숫자추가
  : (getClass('operator'))  // class가 operator면
  ? insertOperator(e)       // 연산자추가
  : (e.keyCode === 27)      // esc키 누르면
  ? form.reset()            // form 초기화
  : false;

    function insertNumber(e) {
      input.value = button['value'];
      result.value += button['value'];
    }

    function insertOperator(e) {
      //resultValue 마지막 index에 같은 연산자가 존재하면 마지막에 누른 연산자로 변경 조건걸어주고 다른 연산자일경우 마지막에 누른 연산자로 교체
      const arrResultValue = [...result.value];
      const leng = arrResultValue.length;
      const lastIndex = arrResultValue[leng-1];
    
      if (lastIndex === button['value']) return false;
      
      if (lastIndex !== button['value'] && +lastIndex !== +lastIndex) {
        arrResultValue.pop(lastIndex);
        arrResultValue.push(button['value']);
        result.value = arrResultValue.join('')
      } else {
        result.value += button['value']
      }
    }
  toggleEvent()
}

function handleSubmitKeydown(event) {
  event.preventDefault();
  divideKey(event);
}

function handleSubmitClick(event) {
  event.preventDefault();
  console.log(e)
}

window.addEventListener("keydown", handleSubmitKeydown)
form.addEventListener("click", handleSubmitClick)