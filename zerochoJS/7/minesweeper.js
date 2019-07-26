document.querySelector('#exec').addEventListener('click', function() {
  const tbody = document.querySelector('#table tbody');
  const horizontal = +document.querySelector('#horizontal').value;
  const vertical = +document.querySelector('#vertical').value;
  const mine = +document.querySelector('#mine').value;
  const dataset = []; 
  console.log(horizontal,vertical,mine);
  tbody.innerHTML = '';
  //지뢰 심을 인덱스 추출하기
  const extract = Array(horizontal * vertical).fill().map((x, index) => index);
  const shuffles = [];
  while(extract.length > horizontal * vertical - mine) {
    const shuffle = extract.splice(Math.floor(Math.random() * extract.length), 1)[0];
    shuffles.push(shuffle);
  }
  console.log(shuffles)
  //table tr, td생성하기
  for(let i = 0; i < vertical; i++) {
    const arr = [];
    const tr = document.createElement('tr');
    dataset.push(arr);
    for(let j = 0; j < horizontal; j++) {
      arr.push(1)
      const td = document.createElement('td');
      //우클릭 이벤트
      td.addEventListener('contextmenu', function(e) {
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
        const findTr = e.currentTarget.parentNode;
        const findTbody = e.currentTarget.parentNode.parentNode;
        const thisTd = Array.prototype.indexOf.call(findTr.children, e.currentTarget);
        const thisTr = Array.prototype.indexOf.call(findTbody.children, tr);
        if(dataset[thisTr][thisTd] === 'X') {
          e.currentTarget.textContent = '펑';
        } else {
          let aroundNumber = [
            dataset[thisTr][thisTd-1], dataset[thisTr][thisTd+1] 
          ]
          if (dataset[thisTr-1]) {
            aroundNumber = aroundNumber.concat(dataset[thisTr-1][thisTd-1], dataset[thisTr-1][thisTd], dataset[thisTr-1][thisTd+1])
          }
          if (dataset[thisTr+1]) {
            aroundNumber = aroundNumber.concat(dataset[thisTr+1][thisTd-1], dataset[thisTr+1][thisTd], dataset[thisTr+1][thisTd+1])
          }
          e.currentTarget.textContent = aroundNumber.filter(v => v === 'X').length;
        }
      })
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  console.log(dataset)
  //지뢰 심기
  for(let k = 0; k < shuffles.length; k++) {
    let locationX = Math.floor(shuffles[k] / 10) ;
    let locationY = shuffles[k] % 10;
    console.log(locationX, locationY)
    tbody.children[locationX].children[locationY].textContent = 'X';
    dataset[locationX][locationY] = 'X';
  }
})