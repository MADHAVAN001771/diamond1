const body = document.getElementById("inventoryBody");
const ROWS = 25;

// CREATE ROWS
for (let i = 1; i <= ROWS; i++) {
  let label = i <= 20 ? `${i} Cent` : `Item ${i - 20}`;

  body.innerHTML += `
  <tr>
    <td>${label}</td>
    <td><input type="number" class="opP" oninput="calc()"></td>
    <td><input type="number" step="0.001" class="opW" oninput="calc()"></td>
    <td><input type="number" class="sP" oninput="calc()"></td>
    <td><input type="number" step="0.001" class="sW" oninput="calc()"></td>
    <td>
      <input class="rP" readonly style="width:60px">
      <input class="rW" readonly style="width:60px">
    </td>
  </tr>`;
}

// LOAD INVENTORY
window.onload = () => {
  const data = JSON.parse(localStorage.getItem("inventory")) || [];
  document.querySelectorAll("tbody tr").forEach((r,i)=>{
    if(!data[i]) return;
    r.querySelector(".opP").value = data[i].opP;
    r.querySelector(".opW").value = data[i].opW;
  });
  calc();
};

function calc(){
  let tOP=0,tOW=0,tSP=0,tSW=0,tRP=0,tRW=0;

  const today = new Date().toISOString().split("T")[0];
  let history = JSON.parse(localStorage.getItem("soldHistory")) || {};

  // INIT TODAY ONLY ONCE
  if(!history[today]){
    history[today] = Array(ROWS).fill().map(()=>({pieces:0,weight:0}));
  }

  let inventory=[];

  document.querySelectorAll("tbody tr").forEach((row,i)=>{
    let opP=+row.querySelector(".opP").value||0;
    let opW=+row.querySelector(".opW").value||0;
    let sP =+row.querySelector(".sP").value||0;
    let sW =+row.querySelector(".sW").value||0;

    let rP=opP-sP;
    let rW=opW-sW;

    row.querySelector(".rP").value=rP;
    row.querySelector(".rW").value=rW.toFixed(3);

    tOP+=opP; tOW+=opW;
    tSP+=sP;  tSW+=sW;
    tRP+=rP;  tRW+=rW;

    inventory.push({opP,opW});

    // SAVE ONLY TODAY SOLD
    history[today][i]={pieces:sP,weight:sW};
  });

  localStorage.setItem("inventory",JSON.stringify(inventory));
  localStorage.setItem("soldHistory",JSON.stringify(history));

  tOP.innerText=tOP;
  tOW.innerText=tOW.toFixed(3);
  tSP.innerText=tSP;
  tSW.innerText=tSW.toFixed(3);
  tR.innerText=`${tRP} , ${tRW.toFixed(3)}`;
}
