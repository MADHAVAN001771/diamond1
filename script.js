const labels = [
  ...Array.from({length:20},(_,i)=>`${i+1} Cent`),
  "22 Cent","25 Cent","28 Cent","30 Cent",
  "Screw 1","Screw 2","Item 3","Item 4","Item 5"
];

const inventoryBody=document.getElementById("inventoryBody");

// Create rows
labels.forEach(l=>{
  inventoryBody.innerHTML+=`
<tr>
<td>${l}</td>
<td>
<input class="opP" type="number">
<span class="low-stock">⬇</span>
</td>
<td><input class="opW" type="number" step="0.001"></td>
<td><input class="sP" type="number"></td>
<td><input class="sW" type="number" step="0.001"></td>
<td>
<input class="rP" readonly>
<input class="rW" readonly>
</td>
</tr>`;
});

const tOP=tOW=tSP=tSW=tR=null;
const tOPel=document.getElementById("tOP"),
      tOWel=document.getElementById("tOW"),
      tSPel=document.getElementById("tSP"),
      tSWel=document.getElementById("tSW"),
      tRel=document.getElementById("tR");

// Load inventory
window.onload=()=>{
  const inv=JSON.parse(localStorage.getItem("inventory"))||[];
  document.querySelectorAll("#inventoryBody tr").forEach((r,i)=>{
    if(inv[i]){
      r.querySelector(".opP").value=inv[i].opP;
      r.querySelector(".opW").value=inv[i].opW;
    }
  });
  calc();
};

function calc(){
  let a=0,b=0,c=0,d=0,e=0,f=0;

  document.querySelectorAll("#inventoryBody tr").forEach(r=>{
    const opP=+r.querySelector(".opP").value||0;
    const opW=+r.querySelector(".opW").value||0;
    const sP=+r.querySelector(".sP").value||0;
    const sW=+r.querySelector(".sW").value||0;

    const rP=opP-sP;
    const rW=opW-sW;

    r.querySelector(".rP").value=rP;
    r.querySelector(".rW").value=rW.toFixed(3);
    r.querySelector(".low-stock").style.display=opP<10?"inline":"none";

    a+=opP; b+=opW; c+=sP; d+=sW; e+=rP; f+=rW;
  });

  tOPel.textContent=a;
  tOWel.textContent=b.toFixed(3);
  tSPel.textContent=c;
  tSWel.textContent=d.toFixed(3);
  tRel.textContent=`${e} , ${f.toFixed(3)}`;
}

document.addEventListener("input",calc);

// Save & update stock
function saveData(){
  const today=new Date().toISOString().split("T")[0];
  let history=JSON.parse(localStorage.getItem("soldHistory"))||{};
  let inventory=[];

  history[today]=[];

  document.querySelectorAll("#inventoryBody tr").forEach(r=>{
    const opP=+r.querySelector(".opP").value||0;
    const opW=+r.querySelector(".opW").value||0;
    const sP=+r.querySelector(".sP").value||0;
    const sW=+r.querySelector(".sW").value||0;

    const newP=opP-sP;
    const newW=opW-sW;

    history[today].push({pieces:sP,weight:sW});

    r.querySelector(".opP").value=newP;
    r.querySelector(".opW").value=newW.toFixed(3);
    r.querySelector(".sP").value="";
    r.querySelector(".sW").value="";

    inventory.push({opP:newP,opW:newW});
  });

  localStorage.setItem("inventory",JSON.stringify(inventory));
  localStorage.setItem("soldHistory",JSON.stringify(history));

  calc();
  alert("Saved & stock updated automatically");
}
