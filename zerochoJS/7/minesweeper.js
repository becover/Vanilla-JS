const tbody = document.querySelector('#table tbody');
const result = document.querySelector('.result')
let dataset = []; 
let flag = false; //중단플래그
let openTd = 0;
document.querySelector('#exec').addEventListener('click', function() {
  const horizontal = +document.querySelector('#horizontal').value;
  const vertical = +document.querySelector('#vertical').value;
  const mine = +document.querySelector('#mine').value;
  openTd = 0;
  flag = false;
  dataset = [];
  result.textContent = '';
  tbody.innerHTML = '';
  //지뢰 심을 인덱스 추출하기
  const extract = Array(horizontal * vertical).fill().map((x, index) => index);
  const shuffles = [];
  while(extract.length > horizontal * vertical - mine) {
    const shuffle = extract.splice(Math.floor(Math.random() * extract.length), 1)[0];
    shuffles.push(shuffle);
  }
  //table tr, td생성하기
  for(let i = 0; i < vertical; i++) {
    const arr = [];
    const tr = document.createElement('tr');
    dataset.push(arr);
    for(let j = 0; j < horizontal; j++) {
      arr.push(0)
      const td = document.createElement('td');
      //우클릭 이벤트
      td.addEventListener('contextmenu', function(e) {
        if(flag) {
          return;
        }
        e.preventDefault();
        const findTr = e.currentTarget.parentNode;
        const findTbody = e.currentTarget.parentNode.parentNode;
        const thisTd = Array.prototype.indexOf.call(findTr.children, e.currentTarget);
        const thisTr = Array.prototype.indexOf.call(findTbody.children, tr);
        if(e.currentTarget.textContent === '' || e.currentTarget.textContent === 'X'){
          e.currentTarget.textContent="!";
        } else if (e.currentTarget.textContent === '!') {
          e.currentTarget.textContent="?";
        } else if (e.currentTarget.textContent === '?') {
          if (dataset[thisTr][thisTd]===1) {
            e.currentTarget.textContent='';
          } else if (dataset[thisTr][thisTd]==='X') {
            e.currentTarget.textContent='X';
          }
        }
      })
      //클릭 이벤트
      td.addEventListener('click', function(e) {
        if (flag) {
          return;
        }
        const findTr = e.currentTarget.parentNode;
        const findTbody = e.currentTarget.parentNode.parentNode;
        const thisTd = Array.prototype.indexOf.call(findTr.children, e.currentTarget);
        const thisTr = Array.prototype.indexOf.call(findTbody.children, tr);
        if(dataset[thisTr][thisTd] === 1) {
          return;
        }
        e.currentTarget.classList.add('opened');
        if(dataset[thisTr][thisTd] === 'X') {
          e.currentTarget.textContent = '펑';
          result.textContent = '실패 ㅠㅠ';
          flag = true;
        } else {
          openTd += 1;
          let aroundNumber = [
            dataset[thisTr][thisTd-1], dataset[thisTr][thisTd+1] 
          ]
          if (dataset[thisTr-1]) {
            aroundNumber = aroundNumber.concat(dataset[thisTr-1][thisTd-1], dataset[thisTr-1][thisTd], dataset[thisTr-1][thisTd+1])
          }
          if (dataset[thisTr+1]) {
            aroundNumber = aroundNumber.concat(dataset[thisTr+1][thisTd-1], dataset[thisTr+1][thisTd], dataset[thisTr+1][thisTd+1])
          }
          const aroundNumberLength = aroundNumber.filter(v => v === 'X').length; //주변지뢰개수
          e.currentTarget.textContent = aroundNumberLength || '';
          dataset[thisTr][thisTd] = 1;          
          if (aroundNumberLength === 0) {
            //주변지뢰개수가 0개면 8칸 오픈
            let aroundNumbers = [];
            aroundNumbers = aroundNumbers.concat([
              tbody.children[thisTr].children[thisTd -1],
              tbody.children[thisTr].children[thisTd +1],
            ])
            if(tbody.children[thisTr-1]) {
              aroundNumbers = aroundNumbers.concat([
                tbody.children[thisTr -1].children[thisTd -1],
                tbody.children[thisTr -1].children[thisTd],
                tbody.children[thisTr -1].children[thisTd +1],
              ]);
            }
            if(tbody.children[thisTr+1]) {
              aroundNumbers = aroundNumbers.concat([
                tbody.children[thisTr +1].children[thisTd -1],
                tbody.children[thisTr +1].children[thisTd],
                tbody.children[thisTr +1].children[thisTd +1],
              ]);
            }
            aroundNumbers.filter((v)=>!!v).forEach(function(e) {
              const findTr = e.parentNode;
              const findTbody = e.parentNode.parentNode;
              const thisTd = Array.prototype.indexOf.call(findTr.children, e);
              const thisTr = Array.prototype.indexOf.call(findTbody.children, findTr);
              console.log(openTd)
              if(dataset[thisTr][thisTd] !== 1) {
                e.click();
              }
            });
          }
          if(openTd === horizontal * vertical - mine) {
            flag = true;
            result.textContent = '야호~! 승리^^'
          }
        }
      })
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  //지뢰 심기
  for(let k = 0; k < shuffles.length; k++) {
    let locationX = Math.floor(shuffles[k] / 10) ;
    let locationY = shuffles[k] % 10;
    tbody.children[locationX].children[locationY].textContent = 'X';
    dataset[locationX][locationY] = 'X';
  }
})