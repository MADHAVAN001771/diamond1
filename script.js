const body = document.getElementById("inventoryBody");

// ROW LABELS
const labels = [
  ...Array.from({ length: 20 }, (_, i) => `${i + 1} Cent`),
  "22 Cent",
  "25 Cent",
  "28 Cent",
  "30 Cent",
  ...Array.from({ length: 5 }, (_, i) => `Item ${i + 1}`)
];

const ROWS = labels.length;

// CREATE TABLE ROWS
labels.forEach(label => {
  body.innerHTML += `
  <tr>
    <td>${label}</td>
    <td><input type="number" class="opP" oninput="calc()"></td>
    <td><input type="number" step="0.001" class="opW" oninput="calc()"></td>
    <td><input type="number" class="sP" oninput="calc()"></td>
    <td><input type="number" step="0.001" class="sW" oninput="calc()"></td>
    <td>
      <input class="rP" readonly>
      <input class="rW" readonly>
    </td>
  </tr>`;
});

// LOAD OPEN STOCK
window.onload = () => {
  const inv = JSON.parse(localStorage.getItem("inventory")) || [];
  document.querySelectorAll("tbody tr").forEach((row, i) => {
    if (!inv[i]) return;
    row.querySelector(".opP").value = inv[i].opP;
    row.querySelector(".opW").value = inv[i].opW;
  });
  calc();
};

function calc() {
  let totalOP = 0, totalOW = 0,
      totalSP = 0, totalSW = 0,
      totalRP = 0, totalRW = 0;

  const today = new Date().toISOString().split("T")[0];
  let history = JSON.parse(localStorage.getItem("soldHistory")) || {};

  if (!history[today]) {
    history[today] = Array(ROWS).fill().map(() => ({ pieces: 0, weight: 0 }));
  }

  let inventory = [];

  document.querySelectorAll("tbody tr").forEach((row, i) => {
    let opP = +row.querySelector(".opP").value || 0;
    let opW = +row.querySelector(".opW").value || 0;
    let sP  = +row.querySelector(".sP").value || 0;
    let sW  = +row.querySelector(".sW").value || 0;

    let rP = opP - sP;
    let rW = opW - sW;

    row.querySelector(".rP").value = rP;
    row.querySelector(".rW").value = rW.toFixed(3);

    totalOP += opP;
    totalOW += opW;
    totalSP += sP;
    totalSW += sW;
    totalRP += rP;
    totalRW += rW;

    inventory.push({ opP, opW });
    history[today][i] = { pieces: sP, weight: sW };
  });

  localStorage.setItem("inventory", JSON.stringify(inventory));
  localStorage.setItem("soldHistory", JSON.stringify(history));

  document.getElementById("tOP").innerText = totalOP;
  document.getElementById("tOW").innerText = totalOW.toFixed(3);
  document.getElementById("tSP").innerText = totalSP;
  document.getElementById("tSW").innerText = totalSW.toFixed(3);
  document.getElementById("tR").innerText =
    `${totalRP} , ${totalRW.toFixed(3)}`;
}
