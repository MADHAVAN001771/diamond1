const body = document.getElementById("inventoryBody");

// create 20 cents
for (let i = 1; i <= 20; i++) {
  body.innerHTML += `
  <tr>
    <td>${i} Cent</td>
    <td><input type="number" class="opP" oninput="calc()"></td>
    <td><input type="number" step="0.001" class="opW" oninput="calc()"></td>
    <td><input type="number" class="sP" oninput="calc()"></td>
    <td><input type="number" step="0.001" class="sW" oninput="calc()"></td>
    <td>
      <div class="remaining-box">
        <input type="number" class="rP" readonly>
        <input type="number" class="rW" readonly>
      </div>
    </td>
  </tr>`;
}

// load saved inventory
window.onload = () => {
  const saved = JSON.parse(localStorage.getItem("inventoryData")) || [];
  document.querySelectorAll("tbody tr").forEach((row, i) => {
    if (!saved[i]) return;
    row.querySelector(".opP").value = saved[i].opP;
    row.querySelector(".opW").value = saved[i].opW;
    row.querySelector(".sP").value  = saved[i].sP;
    row.querySelector(".sW").value  = saved[i].sW;
  });
  calc();
};

function calc() {
  let tOP=0, tOW=0, tSP=0, tSW=0, tRP=0, tRW=0;
  const today = new Date().toISOString().split("T")[0];

  let inventoryData = [];
  let history = JSON.parse(localStorage.getItem("soldHistory")) || {};
  history[today] = [];

  document.querySelectorAll("tbody tr").forEach((row,i)=>{
    let opP = +row.querySelector(".opP").value || 0;
    let opW = +row.querySelector(".opW").value || 0;
    let sP  = +row.querySelector(".sP").value || 0;
    let sW  = +row.querySelector(".sW").value || 0;

    // AUTO remaining calculation
    let rP = opP - sP;
    let rW = opW - sW;

    row.querySelector(".rP").value = rP;
    row.querySelector(".rW").value = rW.toFixed(3);

    tOP+=opP; tOW+=opW;
    tSP+=sP;  tSW+=sW;
    tRP+=rP;  tRW+=rW;

    inventoryData.push({opP,opW,sP,sW});

    // SAVE DAILY SOLD ONLY
    history[today].push({
      cent: i+1,
      pieces: sP,
      weight: sW
    });
  });

  localStorage.setItem("inventoryData", JSON.stringify(inventoryData));
  localStorage.setItem("soldHistory", JSON.stringify(history));

  document.getElementById("tOpenP").innerText = tOP;
  document.getElementById("tOpenW").innerText = tOW.toFixed(3);
  document.getElementById("tSoldP").innerText = tSP;
  document.getElementById("tSoldW").innerText = tSW.toFixed(3);
  document.getElementById("tRemain").innerText = `${tRP} , ${tRW.toFixed(3)}`;
}
