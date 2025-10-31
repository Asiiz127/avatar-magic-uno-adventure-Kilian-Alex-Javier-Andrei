/*  CONFIGURACIÓN  */
const elements = ["fire", "ice", "earth", "thunder", "arcane"];
const values = [1,2,3,4,5,6,7,8,9,10];
const imgPath = "Proyect/img/cards/";
const cardBack = imgPath + "cardback.jpg";

/* VARIABLES NECESARIAS PARA EL ESTADO DEL JUEGO  */
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

/*  CREAR MAZO  */
const createDeck = () => {
  deck = [];
  elements.forEach(e =>
    values.forEach(v => {
      deck.push({ element: e, value: v, img: `${imgPath}${e}${v}.png` });
    })
  );
  deck.sort(() => Math.random() - 0.5);
};

/*  CREAR BOTS */
const createBots = () => {
  bots = [];
  for (let i = 1; i <= numBots; i++) {
    bots.push({ name: `Bot${i}`, hand: [], points: 0 });
  }
};

/* === REPARTIR CARTAS === */
const dealCards = () => {
  playerHand = deck.splice(0, 5);
  bots.forEach(b => (b.hand = deck.splice(0, 5)));
  renderHands();
  renderScoreBoard();
  renderDeckCount();
};

/* === MOSTRAR MANOS === */
const renderHands = () => {
  const div = document.getElementById("playerHand");
  div.innerHTML = "";
  playerHand.forEach((c, i) => {
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `<img src="${c.img}" alt="${c.element}">`;
    el.onclick = () => { if (isGameActive) selectCard(i, el); };
    div.appendChild(el);
  });

  const container = document.getElementById("botsContainer");
  container.innerHTML = "";
  bots.forEach(bot => {
    const botDiv = document.createElement("div");
    botDiv.className = "botDiv";
    botDiv.innerHTML = `<strong>${bot.name}</strong>`;
    const cardsDiv = document.createElement("div");
    cardsDiv.className = "cards";
    bot.hand.forEach(() => cardsDiv.innerHTML += `<div class="card"><img src="${cardBack}"></div>`);
    botDiv.appendChild(cardsDiv);
    container.appendChild(botDiv);
  });
};

/* === SELECCIONAR CARTA === */
const selectCard = (i, el) => {
  document.querySelectorAll("#playerHand .card").forEach(c => c.classList.remove("selected"));
  el.classList.add("selected");
  selectedCard = playerHand[i];
  document.getElementById("playCard").disabled = false;
};

/* === COMPARAR CARTAS === */
const compareCards = (pCard, botCards) => {
  let beats = {
    fire: ["earth", "ice"],
    earth: ["ice", "thunder"],
    ice: ["thunder", "arcane"],
    thunder: ["arcane", "fire"],
    arcane: ["earth", "fire"]
  };

  if (reverseLogic) {
    const inverted = {};
    for (let k in beats) {
      inverted[k] = elements.filter(e => !beats[k].includes(e) && e !== k);
    }
    beats = inverted;
  }

  const cards = [{ name: "Jugador", card: pCard }];
  botCards.forEach((c, i) => cards.push({ name: `Bot${i + 1}`, card: c }));

  const winner = cards.reduce((best, cur) => {
    if (beats[cur.card.element]?.includes(best.card.element)) return cur;
    if (beats[best.card.element]?.includes(cur.card.element)) return best;
    return cur.card.value > best.card.value ? cur : best;
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

/* === RELLENAR MANOS === */
const refillHands = () => {
  while (playerHand.length < 5) {
    if (deck.length === 0) replenishDeckFromDiscard();
    if (deck.length === 0) break;
    playerHand.push(deck.pop());
  }
  bots.forEach(b => {
    while (b.hand.length < 5) {
      if (deck.length === 0) replenishDeckFromDiscard();
      if (deck.length === 0) break;
      b.hand.push(deck.pop());
    }
  });
};

/* === RONDA === */
const playRound = () => {
  if (!selectedCard || !isGameActive) return;

  const botCards = bots.map(b => b.hand.splice(Math.floor(Math.random() * b.hand.length), 1)[0]);
  lastPlayedCards = [selectedCard, ...botCards];

  const playedDiv = document.getElementById("playedCards");
  playedDiv.innerHTML = `<div><strong>Jugador</strong><br><img src="${selectedCard.img}" width="80"></div>`;
  botCards.forEach((c, i) => {
    playedDiv.innerHTML += `<div><strong>${bots[i].name}</strong><br><img src="${c.img}" width="80"></div>`;
  });

  const winner = compareCards(selectedCard, botCards);
  currentWinner = winner.name;

  const imgs = playedDiv.querySelectorAll("img");
  const winnerIndex = currentWinner === "Jugador" ? 0 : bots.findIndex(b => b.name === currentWinner) + 1;
  imgs[winnerIndex].style.transform = "scale(1.3)";

  document.getElementById("roundResult").innerHTML = `Gana ${currentWinner}!`;

  if (currentWinner === "Jugador") playerPoints++;
  else bots.find(b => b.name === currentWinner).points++;

  let element = winner.card.element;
  let effectMsg = "";
  if (!effectsDisabled) {
    switch (element) {
      case "fire":
        bots.forEach(b => { if (b.hand.length > 0) b.hand.pop(); });
        effectMsg = " Los oponentes pierden una carta.";
        break;
      case "earth":
        replenishDeckFromDiscard();
        if (deck.length > 0) {
          if (currentWinner === "Jugador") playerHand.push(deck.pop());
          else bots.find(b => b.name === currentWinner).hand.push(deck.pop());
        }
        effectMsg = " Robas una carta extra.";
        break;
      case "thunder":
        reverseLogic = !reverseLogic;
        effectMsg = " La jerarquía elemental se invierte.";
        break;
      case "ice":
        effectsDisabled = true;
        effectMsg = " Efectos desactivados la siguiente ronda.";
        break;
      case "arcane":
        if (currentWinner === "Jugador") playerPoints++;
        else bots.find(b => b.name === currentWinner).points++;
        effectMsg = " Ganas un punto adicional.";
        break;
    }
  } else {
    effectMsg = " Efectos desactivados por hielo.";
    effectsDisabled = false;
  }
  document.getElementById("effectMessage").innerHTML = effectMsg;

  playerHand.splice(playerHand.indexOf(selectedCard), 1);
  discardPile.push(selectedCard, ...botCards);

  refillHands();
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
  deckDiv.innerHTML = `<div class="deck"><img src="${cardBack}" alt="Mazo"><span>${deck.length} cartas</span></div>`;
};

/* === GANADOR FINAL === */
const checkWinner = () => {
  const max = Math.max(playerPoints, ...bots.map(b => b.points));
  if (max >= pointsToWin) {
    const winners = [];
    if (playerPoints === max) winners.push("Jugador");
    bots.forEach(b => { if (b.points === max) winners.push(b.name); });
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

  sorted.forEach(c => {
    const el = document.createElement("div");
    el.className = "card small";
    el.innerHTML = `<img src="${c.img}" width="70"><div style="color:white;text-align:center;font-size:12px">${c.element} ${c.value}</div>`;
    box.appendChild(el);
  });

  modal.appendChild(box);
  document.body.appendChild(modal);
};

/* === EVENTOS === */
document.getElementById("startGame").onclick = () => {
  // Oculta la portada primero
  const front = document.getElementById("frontImage");
  if (front) {
    front.style.transition = "opacity 1s";
    front.style.opacity = "0";
    setTimeout(() => front.remove(), 1000);
  }

  // Inicia la partida completa
  numBots = parseInt(document.getElementById("numPlayers").value) - 1;
  pointsToWin = parseInt(document.getElementById("pointsToWin").value);
  reverseLogic = false;
  effectsDisabled = false;
  isGameActive = true;
  createDeck();
  createBots();
  dealCards();
  playerPoints = 0;
  bots.forEach(b => (b.points = 0));
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
// === BOTÓN "JUGAR" PORTADA ===
const playButton = document.getElementById("playButton");
if (playButton) {
  playButton.addEventListener("click", () => {
    const container = document.getElementById("frontImageContainer");
    if (container) {
      container.style.transition = "opacity 1s ease";
      container.style.opacity = "0";
      setTimeout(() => container.remove(), 1000);
    }
  });
}