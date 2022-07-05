document.querySelector('#btn-fetch').addEventListener('click', searchExchange);

function searchExchange() {
  const coin = document.querySelector('#sel-coins').value;
  const select = document.querySelector('#sel-coins');

  const option = select.children[select.selectedIndex];
  const coinName = 'Real/'+option.textContent;
  const dtIni = document.querySelector('#dt-ini').value;
  const dtFin = document.querySelector('#dt-fin').value;
  const msg = document.querySelector("#msg");
  const ctnTable = document.querySelector("#ctn-table");

  mountTable();

  function mountTable(){
    const tbl = document.querySelector('#table');

    const url = 'https://economia.awesomeapi.com.br/json/daily/'

    tbl.innerHTML = ` <tr><th colspan="5">${coinName}</th></tr>
                      <tr> 
                          <th>Data/Hora</th> 
                          <th>Mínimo</th>
                          <th>Máximo</th>
                          <th>Compra</th>
                          <th>Venda</th>
                      </tr>`
    
    const dateIni = new Date(dtIni+' ');
    const dateFin = new Date(dtFin+' ');
    let d1 = dateFin;
    d1.setDate(d1.getDate()+1);
    let d2 = '';
    let d3 = '';
    let countRow = 1;

    const days = ((dateFin - dateIni)/1000/60/60/24);
    for (let d = 0; d < days; d++){
      d1.setDate(d1.getDate() - 1);
      d2 = d1.toLocaleDateString().substring(6,10)+d1.toLocaleDateString().substring(3,5)+d1.toLocaleDateString().substring(0,2)
      d3 = d1.toLocaleDateString().substring(6,10)+'-'+d1.toLocaleDateString().substring(3,5)+'-'+d1.toLocaleDateString().substring(0,2)
      makeRequest(url+coin+'/?start_date='+d2+'&end_date='+d2,d3);  
    }

    function makeRequest(url,date) {
      fetch(url, { method: 'GET' })
      .then(response => response.json())
      .then(function(data) {
        countRow += 1
        const newRow = tbl.insertRow(countRow);
        const newCell1 = newRow.insertCell(0);
        const newCell2 = newRow.insertCell(1);
        const newCell3 = newRow.insertCell(2);
        const newCell4 = newRow.insertCell(3);
        const newCell5 = newRow.insertCell(4);
  
        if (data.length === 0) {
          newCell1.innerHTML = `${date} 00:00:00`;
          newCell2.innerHTML = `na`;
          newCell3.innerHTML = `na`;
          newCell4.innerHTML = `na`;
          newCell5.innerHTML = `na`;
        } else { 
          newCell1.innerHTML = `${data[0].create_date}`;
          newCell2.innerHTML = `${parseFloat(data[0].low).toFixed(4)}`;
          newCell3.innerHTML = `${parseFloat(data[0].high).toFixed(4)}`;
          newCell4.innerHTML = `${parseFloat(data[0].bid).toFixed(4)}`;
          newCell5.innerHTML = `${parseFloat(data[0].ask).toFixed(4)}`;
        };  
        })    
      .catch(err => msg.textContent=err.message)
    }
  }
   ctnTable.style.display="flex";
}


function loadSelect(){

  const txt = getExchanges();
  console.log(txt);  
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(txt, "text/xml");
  
  console.log(xmlDoc);

  function getExchanges(){ 
    const url = 'https://economia.awesomeapi.com.br/xml/available';

    let listCoin = fetch(url, { method: 'GET' })
    .then(response => response.text())

    return listCoin;      
  }  
}


//loadSelect();
