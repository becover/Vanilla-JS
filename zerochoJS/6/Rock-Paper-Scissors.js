const result = document.querySelector('.result');
const count = document.querySelector('.count');
let left = '0'
const computer = {
  paper:['0','3'],
  sciccors:['-106px','1'],
  rock:['-212px','2']
}
const counter = {
  win : 0,
  draw : 0,
  lose : 0
}
let {win, draw, lose} = counter;
count.textContent=`${win}승 ${draw}무 ${lose}패`;
let replay='';
const play = () => {
  replay = setInterval(() => {
    (left === computer.paper[0])
    ? left = computer.sciccors[0]
    : (left === computer.sciccors[0])
      ? left = computer.rock[0]
      : left = computer.paper[0]
    document.querySelector('.computer').style.background=`url(./scissor_rock_paper.jpg) ${left} 0 no-repeat`;
  },100);
};
play();
const results = (string, vari) => {
  result.innerHTML=string;
  switch (vari) {
    case 'win':
      win++;
      break;
    case 'draw':
      draw++;
      break;
    case 'lose':
      lose++;
      break;
  }
  count.textContent=`${win}승 ${draw}무 ${lose}패`;
  setTimeout(() => result.innerHTML='' ,1000)  
}
document.querySelectorAll('.btn').forEach( btn => {
  btn.addEventListener('click', function() {
    clearInterval(replay);
    setTimeout(() => play() ,2000)
    const userNum = this.dataset.num;
    const parse = Object.entries(computer).find(v=>v[1][0]===left);
    ([-2, 1].includes(userNum - parse[1][1]))
    ? results('이겼습니다!', 'win')
    : (userNum - parse[1][1] === 0) 
      ? results('무승부!', 'draw')
      : results('졌어용 ㅠㅠ..!', 'lose') // ([-1, 2].includes(userNum - parse[1][1])) 
  })
});

//        가위     바위     보
// 가위   1-1=0  1-2=-1  1-3=-2'
// 바위   2-1=1' 2-2=0   2-3=-1
// 보     3-1=2  3-2=1'  3-3=0
//
// 승 -2,1 / 무 0 /패 -1,2