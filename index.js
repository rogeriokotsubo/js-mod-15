document.querySelector('#btn-fetch').addEventListener('click', searchExchange);

function searchExchange() {
  const coin = document.querySelector('#sel-coins').value;
  const select = document.querySelector('#sel-coins');

  const option = select.children[select.selectedIndex];
  const coinName = option.textContent;
  const dtIni = document.querySelector('#dt-ini').value;
  const dtFin = document.querySelector('#dt-fin').value;
  const msg = document.querySelector("#msg");
  const ctnTable = document.querySelector("#ctn-table");

  msg.innerHTML = `&nbsp;`

  try {
    checkValues(dtIni,dtFin,coin);
  } catch (e) {
    msg.textContent = e.message;
    return;
  }

  document.querySelector('body').style.cursor='wait';
  mountTable();
  document.querySelector('body').style.cursor='default';

  function mountTable(){
    const tbl = document.querySelector('#table');

    const url = 'https://economia.awesomeapi.com.br/json/daily/'

    tbl.innerHTML = ` <tr><th colspan="6">${coinName}</th></tr>
                      <tr> 
                          <th>Data</th> 
                          <th>Data/Hora (Cotação)</th> 
                          <th>Mínimo</th>
                          <th>Máximo</th>
                          <th>Compra</th>
                          <th>Venda</th>
                      </tr>`
    
 
    const dateIni = new Date(dtIni+' ');
    const dateFin = new Date(dtFin+' ');
    let d2 = '';
    let d3 = '';
    let countRow = 1;
    let d1 = new Date(dateFin);
    let days = 0;

    const now = new Date();
    let lastDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // let returnExchange = true;
    // while (lastDate>dateFin && returnExchange) {
    //   d2 = lastDate.toLocaleDateString().substring(6,10)+lastDate.toLocaleDateString().substring(3,5)+lastDate.toLocaleDateString().substring(0,2)
    //   d3 = lastDate.toLocaleDateString().substring(6,10)+'-'+lastDate.toLocaleDateString().substring(3,5)+'-'+lastDate.toLocaleDateString().substring(0,2)
    //   returnExchange = makeRequest(url+coin+'/?start_date='+d2+'&end_date='+d2,d3,true);  
    //   lastDate.setDate(lastDate.getDate() - 1);
    // };

    // última cotação
    makeRequest('https://economia.awesomeapi.com.br/json/last/'+coin,lastDate.toLocaleDateString());  
    d1 = new Date(dateFin);
    d1.setDate(d1.getDate()+1);
    days = ((dateFin - dateIni)/1000/60/60/24)+1;
    for (let d = 0; d < days; d++){
      d1.setDate(d1.getDate() - 1);
      d2 = d1.toLocaleDateString().substring(6,10)+d1.toLocaleDateString().substring(3,5)+d1.toLocaleDateString().substring(0,2)
      makeRequest(url+coin+'/?start_date='+d2+'&end_date='+d2,d1.toLocaleDateString());  
    }

    function makeRequest(url,date) {
      fetch(url, { method: 'GET' })
      .then(response => {
        if (response.status===200){
          return response.json();
        } else {
          let data = [];
          return data;
        }
      })
      .then(function(data) {
        countRow += 1
        const newRow = tbl.insertRow(countRow);
        const newCell0 = newRow.insertCell(0);
        const newCell1 = newRow.insertCell(1);
        const newCell2 = newRow.insertCell(2);
        const newCell3 = newRow.insertCell(3);
        const newCell4 = newRow.insertCell(4);
        const newCell5 = newRow.insertCell(5);

        if (Array.isArray(data)) {
          if (data.length === 0) {
            newCell0.innerHTML = `${date}`;
            newCell1.innerHTML = `na`;
            newCell2.innerHTML = `na`;
            newCell3.innerHTML = `na`;
            newCell4.innerHTML = `na`;
            newCell5.innerHTML = `na`;
          } else { 
            let timestamp = new Date(parseInt(data[0].timestamp)*1000);
           
            newCell0.innerHTML = `${date}`;
            newCell1.innerHTML = `${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}`;
            newCell2.innerHTML = `${parseFloat(data[0].low).toFixed(4)}`;
            newCell3.innerHTML = `${parseFloat(data[0].high).toFixed(4)}`;
            newCell4.innerHTML = `${parseFloat(data[0].bid).toFixed(4)}`;
            newCell5.innerHTML = `${parseFloat(data[0].ask).toFixed(4)}`;

          };  
        } else {
            Object.keys(data).forEach((key) => {
                let timestamp = new Date(parseInt(data[key].timestamp)*1000);
                newCell0.innerHTML = `${timestamp.toLocaleDateString()}`;
                newCell1.innerHTML = `${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}`;
                newCell2.innerHTML = `${parseFloat(data[key].low).toFixed(4)}`
                newCell3.innerHTML = `${parseFloat(data[key].high).toFixed(4)}`
                newCell4.innerHTML = `${parseFloat(data[key].bid).toFixed(4)}`
                newCell5.innerHTML = `${parseFloat(data[key].ask).toFixed(4)}`
            });
        };  
      })    
      .catch(err => {
        msg.textContent=err.message;
        countRow += 1
        const newRow = tbl.insertRow(countRow);
        const newCell0 = newRow.insertCell(0);
        const newCell1 = newRow.insertCell(1);
        const newCell2 = newRow.insertCell(2);
        const newCell3 = newRow.insertCell(3);
        const newCell4 = newRow.insertCell(4);
        const newCell5 = newRow.insertCell(5);
  
        newCell0.innerHTML = `${date}`;
        newCell1.innerHTML = `${err.message}`;
        newCell2.innerHTML = `err`;
        newCell3.innerHTML = `err`;
        newCell4.innerHTML = `err`;
        newCell5.innerHTML = `err`;
      });
    }
  }
  ctnTable.style.display="flex";
}

function checkValues(d1,d2,coin){;
  if (coin===""){
    throw new Error('Selecione uma cotação!');
  }
  if (d1===""){
    throw new Error('Informe uma data de início do período!');
  }
  if (d2===""){
    throw new Error('Informe uma data de fim do período!');
  }
  const dateIni = new Date(d1+' ');
  const dateFin = new Date(d2+' ');
  if (dateIni>dateFin){
    throw new Error('Período inválido!');
  }
  const today = new Date();
  if (dateFin>today){
    throw new Error('Data data de fim do período inválida!');
  };
} 

function loadSelect(){
  getExchanges();
  
  function getExchanges(){ 
    const url = 'https://economia.awesomeapi.com.br/json/available';

    let listCoin = fetch(url, { method: 'GET' })
    .then(response => {
      if (response.status===200) {
        return response.json();
      } else {
        let select = document.querySelector('#sel-coins');
        select.innerHTML=`  
          <option value="" disabled selected>Selecione...</option>
          <option value="USD-BRL" >Dólar Americano</option>
          <option value="EUR-BRL" >Euro</option>
          <option value="RUB-BRL" >Rublo Russo</option>
          <option value="JPY-BRL">Iene</option>
        `
        let data = [];
        return data;
      }
    }) 
    .then(function(data) {
        let select = document.querySelector('#sel-coins');
        select.innerHTML=`  
        <option value="" disabled selected>Selecione...</option>
        `
        for (let prop in data){
          select.innerHTML+=`<option value="${prop}" >${data[prop]}</option> 
          `  
        }       
      })
    .catch(err => {
      msg.textContent=err.message;
      let select = document.querySelector('#sel-coins');
      select.innerHTML=`  
      <option value="" disabled selected>Selecione...</option>
      <option value="USD-BRL" >Dólar Americano</option>
      <option value="EUR-BRL" >Euro</option>
      <option value="RUB-BRL" >Rublo Russo</option>
      <option value="JPY-BRL">Iene</option>
    `
    });
  }
}


window.addEventListener("load",() => {
  document.querySelector('body').style.cursor='wait';
  loadSelect();
  document.querySelector('body').style.cursor='default';
  let now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  document.querySelector('#dt-ini').value=today.toLocaleDateString().substring(6,10)+'-'+today.toLocaleDateString().substring(3,5)+'-01';
  document.querySelector('#dt-fin').value=today.toLocaleDateString().substring(6,10)+'-'+today.toLocaleDateString().substring(3,5)+'-'+today.toLocaleDateString().substring(0,2)
});