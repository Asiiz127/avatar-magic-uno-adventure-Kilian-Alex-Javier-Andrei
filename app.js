/* === CONFIGURACIÓN GENERAL === */
const elements = ["fire", "ice", "earth", "thunder", "arcane"];
const values = [1,2,3,4,5,6,7,8,9,10];
const imgPath = "Proyect/img/cards/";
const styles = ["kilian/","alex/","javier/","andrei/"];

/* === VARIABLES DEL ESTADO DEL JUEGO === */
let deck = [];
let playerHand = [];
let bots = [];
let playerPoints = 0;
let selectedCard = null;
let numBots = 2;
let reverseLogic = false;
let discardPile = [];
let effectsDisabled = false;
let isGameActive = false;
let currentWinner = null;
let lastPlayedCards = [];
let pointsToWin = 8;
let stylesIndex = 0;
const maxBots = 5;

/* === CAMBIAR ESTILO DE CARTAS === */
const styleSelect = document.getElementById("cardStyleIndex");
styleSelect.onchange = () => {
  stylesIndex = parseInt(styleSelect.value);
};
/*PREGUNTAR COMO CAMBIAR LOS ESTILOS SIN AFECTAR A LA PARTIDA ACTUAL*/

/* === CREAR MAZO (con cartas especiales incluidas) === */
const createDeck = () => {
  deck = [];

  // Cartas elementales normales
  elements.forEach(element =>
    values.forEach(value => {
      deck.push({ 
        element: element, 
        value: value, 
        img: `${imgPath}${styles[stylesIndex]}${element}${value}.png`,
        type: "normal"
      });
    })
  );

  // Cartas especiales
  const specialCards = [
    { name: "dragon", img: `${imgPath}${styles[stylesIndex]}dragonCard.png`, type: "special" },
    { name: "yingyang", img: `${imgPath}${styles[stylesIndex]}yingYangCard.png`, type: "special" },
    { name: "darkhole", img: `${imgPath}${styles[stylesIndex]}darkHoleCard.png`, type: "special" }
  ];
  deck.push(...specialCards);

  deck.sort(() => Math.random() - 0.5);
};

/* === CREAR BOTS === */
const createBots = () => {
  bots = [];
  const cantidadBots = Math.min(numBots, maxBots);
  for (let i = 1; i <= cantidadBots; i++) {
    bots.push({ name: `Bot${i}`, hand: [], points: 0 });
  }
};

/* === REPARTIR CARTAS === */
const dealCards = () => {
  playerHand = deck.splice(0, 5);
  bots.forEach(bot => (bot.hand = deck.splice(0, 5)));
  renderHands();
  renderScoreBoard();
  renderDeckCount();
};

/* === MOSTRAR MANOS === */
const renderHands = () => {
  const playerDiv = document.getElementById("playerHand");
  playerDiv.innerHTML = "";
  playerHand.forEach((card, index) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    cardDiv.innerHTML = `<img src="${card.img}" alt="${card.element || card.name}">`;
    cardDiv.onclick = () => { if (isGameActive) selectCard(index, cardDiv); };
    playerDiv.appendChild(cardDiv);
  });

  const botsContainer = document.getElementById("botsContainer");
  botsContainer.innerHTML = "";
  bots.forEach(bot => {
    const botDiv = document.createElement("div");
    botDiv.className = "botDiv";
    botDiv.innerHTML = `<strong>${bot.name}</strong>`;
    const cardsDiv = document.createElement("div");
    cardsDiv.className = "cards";
    bot.hand.forEach(() => cardsDiv.innerHTML += `<div class="card"><img src="${imgPath + styles[stylesIndex] + "cardback.png"}"></div>`);
    botDiv.appendChild(cardsDiv);
    botsContainer.appendChild(botDiv);
  });
};

/* === SELECCIONAR CARTA === */
const selectCard = (index, element) => {
  document.querySelectorAll("#playerHand .card").forEach(c => c.classList.remove("selected"));
  element.classList.add("selected");
  selectedCard = playerHand[index];
  document.getElementById("playCard").disabled = false;
};

/* === COMPARAR CARTAS === */
const compareCards = (playerCard, botCards) => {
  let beats = {
    fire: ["ice"],
    ice: ["arcane"],
    arcane: ["earth"],
    earth: ["thunder"],
    thunder: ["fire"]
  };

  if (reverseLogic) {
    const inverted = {};
    for (let key in beats) {
      inverted[key] = elements.filter(el => !beats[key].includes(el) && el !== key);
    }
    beats = inverted;
  }

  const cards = [{ name: "Jugador", card: playerCard }];
  botCards.forEach((card, i) => cards.push({ name: `Bot${i + 1}`, card }));

  const winner = cards.reduce((best, current) => {
    if (beats[current.card.element]?.includes(best.card.element)) return current;
    if (beats[best.card.element]?.includes(current.card.element)) return best;
    return current.card.value > best.card.value ? current : best;
  });

  return winner;
};

/* === RECICLAR DESCARTE COMO NUEVO MAZO === */
const replenishDeckFromDiscard = () => {
  if (deck.length > 0 || discardPile.length === 0) return;
  deck = discardPile.splice(0);
  deck.sort(() => Math.random() - 0.5);
  renderDeckCount();
};

/* === ROBAR CARTA === */
const drawCard = (hand) => {
  if (deck.length === 0) replenishDeckFromDiscard();
  if (deck.length > 0) {
    hand.push(deck.pop());
  }
};

/* === RONDA === */
const playRound = () => {
  if (!selectedCard || !isGameActive) return;

  const botCards = bots.map(bot => bot.hand.splice(Math.floor(Math.random() * bot.hand.length), 1)[0]);
  lastPlayedCards = [selectedCard, ...botCards];

  const playedDiv = document.getElementById("playedCards");
  playedDiv.innerHTML = `<div><strong>Jugador</strong><br><img src="${selectedCard.img}" width="80"></div>`;
  botCards.forEach((card, i) => {
    playedDiv.innerHTML += `<div><strong>${bots[i].name}</strong><br><img src="${card.img}" width="80"></div>`;
  });

  /* === DETECCIÓN DE CARTAS ESPECIALES === */
  const specialCardsPlayed = lastPlayedCards.filter(card => card.type === "special");
  if (specialCardsPlayed.length > 1) {
    document.getElementById("roundResult").innerHTML = "✨ Se jugaron múltiples cartas especiales, la ronda se anula.";
    discardPile.push(selectedCard, ...botCards);
    drawCard(playerHand);
    bots.forEach(bot => drawCard(bot.hand));
    renderHands();
    document.getElementById("playCard").disabled = true;
    selectedCard = null;
    return;
  } 
  else if (specialCardsPlayed.length === 1) {
    const specialCard = specialCardsPlayed[0];
    let message = "";

    if (specialCard.name === "dragon") {
      message = " La criatura más poderosa aparece. Nadie gana esta ronda, nadie puntúa.";
    } 
    else if (specialCard.name === "yingyang") {
      message = " El equilibrio lo es todo. Se reajustan los puntos.";
      const allPlayers = [{ name: "Jugador", points: playerPoints }, ...bots];
      const maxPoints = Math.max(...allPlayers.map(p => p.points));
      const minPoints = Math.min(...allPlayers.map(p => p.points));
      const highestPlayers = allPlayers.filter(p => p.points === maxPoints);
      const lowestPlayers = allPlayers.filter(p => p.points === minPoints);
      highestPlayers.forEach(p => {
        if (p.name === "Jugador") playerPoints--;
        else bots.find(b => b.name === p.name).points--;
      });
      lowestPlayers.forEach(p => {
        if (p.name === "Jugador") playerPoints++;
        else bots.find(b => b.name === p.name).points++;
      });
    } 
    else if (specialCard.name === "darkhole") {
      message = "Caos total. Ganas automáticamente la ronda.";
      const winnerName = (specialCard === selectedCard)
        ? "Jugador"
        : bots.find(b => botCards.includes(specialCard)).name;
      if (winnerName === "Jugador") playerPoints++;
      else bots.find(b => b.name === winnerName).points++;
      document.getElementById("roundResult").innerHTML = `¡Wow! ${winnerName} gana con Agujero Negro!`;
    }

    // 🔹 Ahora las cartas especiales también se descartan
    discardPile.push(selectedCard, ...botCards);
    const indexInHand = playerHand.indexOf(selectedCard);
    if (indexInHand !== -1) playerHand.splice(indexInHand, 1);

    drawCard(playerHand);
    bots.forEach(bot => drawCard(bot.hand));
    renderHands();
    renderScoreBoard();
    renderDeckCount();

    document.getElementById("effectMessage").innerHTML = message;
    selectedCard = null;
    document.getElementById("playCard").disabled = true;
    return;
  }

  /* === COMPARACIÓN NORMAL === */
  const winner = compareCards(selectedCard, botCards);
  currentWinner = winner.name;

  const imgs = playedDiv.querySelectorAll("img");
  const winnerIndex = currentWinner === "Jugador" ? 0 : bots.findIndex(b => b.name === currentWinner) + 1;
  imgs[winnerIndex].style.transform = "scale(1.3)";

  document.getElementById("roundResult").innerHTML = `Gana ${currentWinner}!`;

  if (currentWinner === "Jugador") playerPoints++;
  else bots.find(b => b.name === currentWinner).points++;

  const element = winner.card.element;
  let effectMessage = "";
  let postRefillEffect = null;

  if (!effectsDisabled) {
    if (element === "fire") {
      if (currentWinner === "Jugador") {
        bots.forEach(b => {
          if (b.hand.length > 0) b.hand.pop();
        });
      }
      else {
        if (playerHand.length > 0) playerHand.pop();
        bots.forEach(b => {
          if (b.name !== currentWinner && b.hand.length > 0) b.hand.pop();
        });
      }
      effectMessage = "¡Cuidado que quema! Todos menos el ganador pierden una carta.";
    }
    else if (element === "earth") {
      postRefillEffect = () => {
        replenishDeckFromDiscard();
        if (deck.length > 0) {
          if (currentWinner === "Jugador") playerHand.push(deck.pop());
          else bots.find(b => b.name === currentWinner).hand.push(deck.pop());
        }
      
      };
      effectMessage = "La tierra te nutre. Robas una carta extra.";
    } 
    else if (element === "thunder") {
      reverseLogic = !reverseLogic;
      effectMessage = "¡ZAP!. Se invierte la jerarquía elemental.";
    } 
    else if (element === "ice") {
      effectsDisabled = true;
      effectMessage = " Efectos desactivados la siguiente ronda.";
    } 
    else if (element === "arcane") {
      if (currentWinner === "Jugador") playerPoints++;
      else bots.find(b => b.name === currentWinner).points++;
      effectMessage = "La magia arcana te apoya. Ganas un punto adicional.";
    }
  } else {
    effectMessage = " Efectos desactivados por hielo.";
    effectsDisabled = false;
  }

  document.getElementById("effectMessage").innerHTML = effectMessage;

  playerHand.splice(playerHand.indexOf(selectedCard), 1);
  discardPile.push(selectedCard, ...botCards);

  drawCard(playerHand);
  bots.forEach(bot => drawCard(bot.hand));

  if (postRefillEffect) postRefillEffect();

  renderHands();
  renderScoreBoard();
  renderDeckCount();

  selectedCard = null;
  document.getElementById("playCard").disabled = true;

  checkWinner();
};

/* === TABLERO Y PUNTUACIÓN === */
const renderScoreBoard = () => {
  const sb = document.getElementById("scoreBoard");
  sb.innerHTML = `Jugador: ${playerPoints} | ${bots.map(b => `${b.name}: ${b.points}`).join(" | ")} | Objetivo: ${pointsToWin}`;
};

const renderDeckCount = () => {
  const deckDiv = document.getElementById("deckInfo");
  deckDiv.innerHTML = `<div class="deck"><img src="${imgPath + styles[stylesIndex] + "cardback.png"}" alt="Mazo"><span>${deck.length} cartas</span></div>`;
};

/* === COMPROBAR GANADOR FINAL === */
const checkWinner = () => {
  const maxPoints = Math.max(playerPoints, ...bots.map(b => b.points));
  if (maxPoints >= pointsToWin) {
    const winners = [];
    if (playerPoints === maxPoints) winners.push("Jugador");
    bots.forEach(b => { if (b.points === maxPoints) winners.push(b.name); });
    document.getElementById("roundResult").innerHTML = `🏆 ${winners.join(" y ")} han ganado la partida!`;
    isGameActive = false;
    document.getElementById("playCard").disabled = true;
  }
};

/* === MODAL DE DESCARTE === */
const toggleDiscardPanel = () => {
  const existing = document.getElementById("discardModal");
  if (existing) {
    existing.remove();
    return;
  }

  const modal = document.createElement("div");
  modal.id = "discardModal";
  Object.assign(modal.style, {
    position: "fixed",
    left: 0, top: 0,
    width: "100%", height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
  });

  const box = document.createElement("div");
  Object.assign(box.style, {
    width: "80%", maxWidth: "900px", maxHeight: "80%",
    background: "#111", padding: "18px",
    borderRadius: "12px", overflowY: "auto",
    display: "flex", flexWrap: "wrap",
    justifyContent: "center", gap: "8px"
  });

  const header = document.createElement("div");
  Object.assign(header.style, {
    width: "100%", display: "flex",
    justifyContent: "space-between",
    alignItems: "center", marginBottom: "10px"
  });

  const title = document.createElement("div");
  title.innerText = `Pila de descarte — ${discardPile.length} cartas`;
  Object.assign(title.style, { color: "white", fontWeight: "700", fontSize: "18px" });

  const closeBtn = document.createElement("button");
  closeBtn.innerText = "Cerrar";
  Object.assign(closeBtn.style, {
    padding: "8px 12px", borderRadius: "8px",
    border: "none", cursor: "pointer"
  });
  closeBtn.onclick = () => modal.remove();

  header.appendChild(title);
  header.appendChild(closeBtn);
  box.appendChild(header);

  const sorted = [...discardPile].sort((a,b) => {
    const elA = elements.indexOf(a.element);
    const elB = elements.indexOf(b.element);
    return elA === elB ? a.value - b.value : elA - elB;
  });

  sorted.forEach(card => {
    const el = document.createElement("div");
    el.className = "card small";
    el.innerHTML = `<img src="${card.img}" width="70"><div style="color:white;text-align:center;font-size:12px">${card.element || card.name}</div>`;
    box.appendChild(el);
  });

  modal.appendChild(box);
  document.body.appendChild(modal);
};

/* === EVENTOS PRINCIPALES === */
document.getElementById("startGame").onclick = () => {
  const front = document.getElementById("frontImage");
  if (front) {
    front.style.transition = "opacity 1s";
    front.style.opacity = "0";
    setTimeout(() => front.remove(), 1000);
  }

  numBots = parseInt(document.getElementById("numPlayers").value) - 1;
  pointsToWin = parseInt(document.getElementById("pointsToWin").value);
  reverseLogic = false;
  effectsDisabled = false;
  isGameActive = true;
  createDeck();
  createBots();
  dealCards();
  playerPoints = 0;
  bots.forEach(bot => (bot.points = 0));
  discardPile = [];
  selectedCard = null;
  currentWinner = null;
  lastPlayedCards = [];
  document.getElementById("playedCards").innerHTML = "";
  document.getElementById("roundResult").innerHTML = "";
  document.getElementById("effectMessage").innerHTML = "";
  document.getElementById("playCard").disabled = true;
};

document.getElementById("playCard").onclick = playRound;
document.getElementById("toggleDiscard").onclick = toggleDiscardPanel;

const playButton = document.getElementById("playButton");
if (playButton) {
  playButton.addEventListener("click", () => {
    // --- Desvanecer y eliminar la portada ---
    const container = document.getElementById("frontImageContainer");
    if (container) {
      container.style.transition = "opacity 1s ease";
      container.style.opacity = "0";
      setTimeout(() => container.remove(), 1000);
    }

    // --- Iniciar música de fondo ---
    const backgroundMusic = new Audio("Proyect/media/tabernMusic.mp3");
    backgroundMusic.loop = true;      // Repite la música
    backgroundMusic.volume = 0.4;     // Volumen moderado
    backgroundMusic.play().catch(err => {
      console.warn("El audio no se pudo reproducir automáticamente:", err);
    });
  });
}

/* === MODAL DE NORMAS DEL JUEGO === */
document.getElementById("rulesButton").onclick = () => {
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
  <li><span style="color: orange; font-weight: bold;">FUEGO</span>: Los oponentes pierden una carta al azar.</li>
  <li><span style="color: cyan; font-weight: bold;">HIELO</span>: Desactiva los efectos en la siguiente ronda.</li>
  <li><span style="color: saddlebrown; font-weight: bold;">TIERRA</span>: Roba una carta extra después del refill.</li>
  <li><span style="color: yellow; font-weight: bold;">TRUENO</span>: Invierte la jerarquía elemental.</li>
  <li><span style="color: violet; font-weight: bold;">ARCANO</span>: Gana 1 punto adicional.</li>
</ul>

<h3>Cartas especiales</h3>
<ul>
  <li><span style="color: limegreen; font-weight: bold;">DRAGÓN</span>: Cancela la ronda y nadie puntúa.</li>
  <li><span style="color: white; font-weight: bold;">YING YANG</span>: "Equilibrio" — El ganador pierde 1 punto y se lo da al/los más débil/es.</li>
  <li><span style="color: red; font-weight: bold;">AGUJERO NEGRO</span>: Caos total. Gana automáticamente la ronda.</li>
</ul>


<button id="closeRules">Cerrar</button>

  `;

  modal.appendChild(box);
  document.body.appendChild(modal);

  document.getElementById("closeRules").onclick = () => modal.remove();
};


const aboutUsModal = document.createElement("div");
aboutUsModal.id = "aboutUsModal";
aboutUsModal.className = "aboutUsModal";

aboutUsModal.innerHTML = `
  <div class="about-us-box">
    <h2>About Us</h2>
    <div class="about-us-creators">
      <div class="creator-block">
        <img src="Proyect/img/creator1.png" alt="Creador 1" class="creator-img">
        <div class="creator-info">
          <span class="creator-name">Asiiz</span>
          <span class="creator-desc">Famoso en todas las tabernas y guaridas de trolls por sus historias... capaces de dormir hasta a un dragón borracho o hacer huir a un goblin charlatán.</span>
        </div>
      </div>
      <div class="creator-block">
        <img src="Proyect/img/creator2.png" alt="Creador 2" class="creator-img">
        <div class="creator-info">
          <span class="creator-name">Kilian</span>
          <span class="creator-desc">Capaz de perderse hasta en los pasillos de una mazmorra recta, pero siempre encuentra la mesa donde reparten la comida.</span>
        </div>
      </div>
      <div class="creator-block">
        <img src="Proyect/img/creator3.png" alt="Creador 3" class="creator-img">
        <div class="creator-info">
          <span class="creator-name">Javier</span>
          <span class="creator-desc">Galardonada como el único mago que ha logrado encantar... una escoba para barrer más lento (y con mejor estilo).</span>
        </div>
      </div>
      <div class="creator-block">
        <img src="Proyect/img/creator4.png" alt="Creador 4" class="creator-img">
        <div class="creator-info">
          <span class="creator-name">Andrei</span>
          <span class="creator-desc">Tiene el extraño don de ganar siempre al parchís... aunque insista en que está tirando los dados para invocar tormentas mágicas.</span>
        </div>
      </div>
    </div>
    <button id="closeAboutUs">Cerrar</button>
  </div>
`;
document.body.appendChild(aboutUsModal);
aboutUsModal.style.opacity = "0";
aboutUsModal.style.pointerEvents = "none";


const aboutUsButton = document.getElementById('aboutUsButton');


aboutUsButton.onclick = function() {
  aboutUsModal.classList.add('active');
  aboutUsModal.style.opacity = "1";
  aboutUsModal.style.pointerEvents = "auto";
};


aboutUsModal.onclick = function(e) {
  if (e.target === aboutUsModal) {
    aboutUsModal.classList.remove('active');
    aboutUsModal.style.opacity = "0";
    aboutUsModal.style.pointerEvents = "none";
  }
};


aboutUsModal.querySelector("#closeAboutUs").onclick = function() {
  aboutUsModal.classList.remove('active');
  aboutUsModal.style.opacity = "0";
  aboutUsModal.style.pointerEvents = "none";
};
