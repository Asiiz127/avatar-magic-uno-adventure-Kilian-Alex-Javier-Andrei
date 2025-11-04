
import { startGame, doPlayRound } from "./game.js";
import { renderHands } from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {

  const startBtn = document.getElementById("startGame");
  const playBtn = document.getElementById("playCard");
  const rulesBtn = document.getElementById("rulesButton");
  const toggleDiscardBtn = document.getElementById("toggleDiscard");
  const playButton = document.getElementById("playButton");
  const frontImageContainer = document.getElementById("frontImageContainer");


  if (playButton && frontImageContainer) {
    playButton.addEventListener("click", () => {
      frontImageContainer.style.transition = "opacity 1s ease";
      frontImageContainer.style.opacity = "0";
      setTimeout(() => frontImageContainer.remove(), 1000);
      
      try {
        const backgroundMusic = new Audio("Proyect/media/tabernMusic.mp3");
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.2;
        backgroundMusic.play().catch(() => {});
      } catch(e){}
    });
  }


  startBtn.addEventListener("click", () => {
    const totalPlayers = parseInt(document.getElementById("numPlayers").value);
    const points = parseInt(document.getElementById("pointsToWin").value);
    startGame(totalPlayers, points);
  });


  playBtn.addEventListener("click", () => {
    doPlayRound();
  });


  rulesBtn.addEventListener("click", () => {
  
    if (document.getElementById("rulesModal")) return;
    const modal = document.createElement("div");
    modal.id = "rulesModal";
    modal.classList.add("active");
    const box = document.createElement("div");
    box.className = "rules-box";
    box.innerHTML = `
      <h2>Normas del juego</h2>
<img src="Proyect/img/elementOrder.png" alt="Jerarquía elemental">
<img src="Proyect/img/specialCardSystem.png" alt="Jerarquía elemental">
<h3>Cómo se juega</h3>
<p>
  Cada jugador comienza con 5 cartas. En cada ronda, todos eligen una carta y la juegan simultáneamente.<br>
  La carta ganadora se determina según la <strong>jerarquía elemental</strong> mostrada arriba; si hay empate, gana el valor más alto.<br>
  Algunos elementos y cartas especiales tienen efectos adicionales. El primer jugador en alcanzar los puntos establecidos a lo largo de las rondas, gana.
</p>

<h3>Efectos elementales</h3>
<ul>
  <li><span style="color: orange; font-weight: bold;">FUEGO</span>: Los oponentes pierden una carta al azar de la mano.</li>
  <li><span style="color: cyan; font-weight: bold;">HIELO</span>: Anula los efectos elementales en la siguiente ronda.</li>
  <li><span style="color: saddlebrown; font-weight: bold;">TIERRA</span>: Roba una carta extra para la siguiente ronda.</li>
  <li><span style="color: yellow; font-weight: bold;">TRUENO</span>: Invierte la jerarquía elemental en la siguiente ronda.</li>
  <li><span style="color: violet; font-weight: bold;">ARCANO</span>: Gana 1 punto adicional si ganas la ronda.</li>
</ul>

<h3>Cartas especiales</h3>
<ul>
  <li><span style="color: limegreen; font-weight: bold;">DRAGÓN</span>: Todos los jugadores pierden 1 punto.</li>
  <li><span style="color: white; font-weight: bold;">YING YANG</span>: "Equilibrio" El jugador/es con más puntos pierden 1 punto y se lo dan al/los jugador/es con menos puntos.</li>
  <li><span style="color: red; font-weight: bold;">AGUJERO NEGRO</span>: Caos total. Gana automáticamente la ronda.</li>
</ul>


<button id="closeRules">Cerrar</button>

  `;
    modal.appendChild(box);
    document.body.appendChild(modal);
    document.getElementById("closeRules").onclick = () => modal.remove();
  });

 
  toggleDiscardBtn.addEventListener("click", () => {
    const existing = document.getElementById("discardModal");
    if (existing) { existing.remove(); return; }

    const modal = document.createElement("div");
    modal.id = "discardModal";
    Object.assign(modal.style, { position: "fixed", left:0, top:0, width:"100%", height:"100%", background:"rgba(0,0,0,0.6)", display:"flex", justifyContent:"center", alignItems:"center", zIndex:9999 });
    const box = document.createElement("div");
    Object.assign(box.style, { width:"80%", maxWidth:"900px", maxHeight:"80%", background:"#111", padding:"18px", borderRadius:"12px", overflowY:"auto", display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"8px" });
    const header = document.createElement("div");
    Object.assign(header.style, { width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px" });
    const title = document.createElement("div");
    title.innerText = `Pila de descarte — ${window.gameState && window.gameState.discardPile ? window.gameState.discardPile.length : 0} cartas`;
    Object.assign(title.style, { color:"white", fontWeight:"700", fontSize:"18px" });
    const closeBtn = document.createElement("button");
    closeBtn.innerText = "Cerrar";
    Object.assign(closeBtn.style, { padding:"8px 12px", borderRadius:"8px", border:"none", cursor:"pointer" });
    closeBtn.onclick = () => modal.remove();
    header.appendChild(title); header.appendChild(closeBtn); box.appendChild(header);

    const sorted = (window.gameState?.discardPile ?? []).slice().sort((a,b) => {
      const elOrder = ["fire","ice","earth","thunder","arcane"];
      const elA = elOrder.indexOf(a.element ?? "");
      const elB = elOrder.indexOf(b.element ?? "");
      return elA === elB ? (a.value ?? 0) - (b.value ?? 0) : elA - elB;
    });

    sorted.forEach(card => {
      const el = document.createElement("div");
      el.className = "card small";
      el.innerHTML = `<img src="${card.img}" width="70"><div style="color:white;text-align:center;font-size:12px">${card.element || card.name}</div>`;
      box.appendChild(el);
    });

    modal.appendChild(box);
    document.body.appendChild(modal);
  });

});
