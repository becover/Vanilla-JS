const number = Array(45).fill().map((x, index) => index+1);
const shuffles = [];
while(number.length > 0) {
  const shuffle = number.splice(Math.floor(Math.random() * number.length), 1)[0];
  shuffles.push(shuffle);
}
const bonus = shuffles[shuffles.length-1];
const lotto = shuffles.slice(0, 6).sort((a,b)=>a-b);
console.log(`당첨 숫자: ${lotto}, 보너스 숫자: ${bonus}`);
const ballStyle = {
  basic: {
    display:'inline-block',
    width:'50px',
    height:'25px',
    lineHeight:'1',
    padding:'12px 0',
    margin:'20px 10px',
    borderWidth:'20px',
    borderStyle:'solid',
    borderRadius:'50%',
    textAlign:'center',
    fontSize:'25px',
    fontWeight:'800',
    boxShadow:'0 1px 4px gray',
  },
  red: {
    borderColor:'#ef5350',
  },
  orange: {
    borderColor:'#ff9800',
  },
  yellow: {
    borderColor:'#ffd60c',
  },
  green: {
    borderColor:'#17cd71',
  },
  purple: {
    borderColor:'#b15cfe',
  },
  blue: {
    borderColor:'#03a9f4',
  },
};

const {basic, red, orange, yellow, green, purple, blue} = ballStyle;
const settingStyle = (el) => {
  for(property in basic) {
    el.style[property]=basic[property];
  };

  if (el.textContent <= 8) {
    for(property in red) {
      el.style[property]=red[property];
    };
  } else if (el.textContent <= 16) {
    for(property in orange) {
      el.style[property]=orange[property];
    };
  } else if (el.textContent <= 24) {
    for(property in yellow) {
      el.style[property]=yellow[property];
    };
  } else if (el.textContent <= 30) {
    for(property in green) {
      el.style[property]=green[property];
    };
  } else if (el.textContent <= 36) {
    for(property in purple) {
      el.style[property]=purple[property];
    };
  } else {
    for(property in blue) {
      el.style[property]=blue[property];
    };
  };
};

const result = document.getElementById('result');
for (let i=0; i< lotto.length; i++) {
  setTimeout(()=>{
    const lottoBall = document.createElement('div'); 
    lottoBall.textContent = lotto[i];
    settingStyle(lottoBall)
    
    result.appendChild(lottoBall)
  },1000 * (i+1));
}
setTimeout(() => {
  const bonusResult = document.getElementsByClassName('bonus')[0];
  const bonusBall = document.createElement('div');
  bonusBall.textContent = bonus;
  settingStyle(bonusBall)
  bonusResult.appendChild(bonusBall);
},7000)
