const body = document.body;
const table = document.createElement('table');
const arrTr = []; //줄들
const arrTd = []; //칸들
let turn = 'x';
const findEvent = function(e) {

  const thisTr = arrTr.indexOf(e.target.parentNode);//클릭한 줄
  const thisTd = arrTd[thisTr].indexOf(e.target);//클릭한 칸

  if(arrTd[thisTr][thisTd].textContent !== '') {//칸체크
    console.log('빈칸 아닙니다.') 
  } else {
    console.log('빈칸입니다.')
    arrTd[thisTr][thisTd].textContent = turn;
    //bingGo check -->
    let bingGo = false;
    //가로줄 check
    (arrTd[thisTr][0].textContent === turn &&
    arrTd[thisTr][1].textContent === turn &&
    arrTd[thisTr][2].textContent === turn)
    ? bingGo = true
    : false;
    //세로줄 check
    (arrTd[0][thisTd].textContent === turn &&
    arrTd[1][thisTd].textContent === turn &&
    arrTd[2][thisTd].textContent === turn)
    ? bingGo = true
    : false;
    //대각선 check
    (thisTr - thisTd === 0)
    ?(arrTd[0][0].textContent === turn &&
      arrTd[1][1].textContent === turn &&
      arrTd[2][2].textContent === turn)
      ? bingGo = true
      : false
    : false;
    (Math.abs(thisTr - thisTd) === 2)
    ?(arrTd[0][2].textContent === turn &&
      arrTd[1][1].textContent === turn &&
      arrTd[2][0].textContent === turn)
      ? bingGo = true
      : false
    : false;
    //<--bingGo check end
    (bingGo)
    ? (
      arrTd[thisTr][thisTd].textContent = turn,
      setTimeout(() => { 
        alert(turn + '님의 승리!');
        arrTd.forEach(tableRow => tableRow.forEach(tableData => tableData.textContent = ''))
      },0),
      turn = 'x'
      )
    : (turn ==='x')
      ? turn = 'o'
      : turn = 'x'
  }
};
for (let i = 0; i<3; i++) {
  const tableRow = document.createElement('tr');
  arrTr.push(tableRow);
  arrTd.push([]);
  for (let j = 0; j<3; j++) {
    const tableData = document.createElement('td');
    tableData.addEventListener('click',findEvent );
    arrTd[i].push(tableData);
    tableRow.appendChild(tableData);
  }
  table.appendChild(tableRow);
}
body.appendChild(table);