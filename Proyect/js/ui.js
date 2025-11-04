
import { getPlayer, getBots } from "./players.js";
import { deckCount } from "./deck.js";

const cardBack = "Proyect/img/cards/cardback.jpg";


export const renderHands = () => {
  const player = getPlayer();
  const bots = getBots();

  const playerDiv = document.getElementById("playerHand");
  if (!playerDiv) return;

  playerDiv.innerHTML = "";
  player.hand.forEach((card, i) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    cardDiv.innerHTML = `<img src="${card.img}" alt="${card.element || card.name}">`;
    cardDiv.onclick = () => {
      document.querySelectorAll("#playerHand .card").forEach(c => c.classList.remove("selected"));
      cardDiv.classList.add("selected");
      window.gameState.selectedCard = card;
      setPlayButtonDisabled(false);
    };
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
    bot.hand.forEach(() => {
      cardsDiv.innerHTML += `<div class="card"><img src="${cardBack}"></div>`;
    });
    botDiv.appendChild(cardsDiv);
    botsContainer.appendChild(botDiv);
  });
};


export const renderPlayedCards = (playerCard, botCards, winnerName = null) => {
  const playedDiv = document.getElementById("playedCards");
  if (!playedDiv) return;

  playedDiv.innerHTML = `<div><strong>Jugador</strong><br><img src="${playerCard.img}" width="80"></div>`;
  botCards.forEach((card, i) => {
    playedDiv.innerHTML += `<div><strong>Bot${i + 1}</strong><br><img src="${card.img}" width="80"></div>`;
  });

  if (winnerName) {
    const imgs = playedDiv.querySelectorAll("img");
    const winnerIndex = winnerName === "Jugador" ? 0 : botCards.findIndex(b => b.name === winnerName) + 1;
    if (imgs[winnerIndex]) imgs[winnerIndex].style.transform = "scale(1.3)";
  }
};


export const renderScoreBoard = () => {
  const player = getPlayer();
  const bots = getBots();
  const sb = document.getElementById("scoreBoard");
  if (!sb) return;
  sb.innerHTML = `Jugador: ${player.points} | ${bots.map(b => `${b.name}: ${b.points}`).join(" | ")} | Objetivo: ${window.gameState?.pointsToWin ?? 8}`;
};


export const renderDeckCount = () => {
  const deckDiv = document.getElementById("deckInfo");
  if (!deckDiv) return;
  deckDiv.innerHTML = `<div class="deck"><img src="${cardBack}" alt="Mazo"><span>${deckCount()} cartas</span></div>`;
};


export const showEffectMessage = (msg) => {
  const el = document.getElementById("effectMessage");
  if (el) el.innerText = msg;
};


export const setPlayButtonDisabled = (disabled) => {
  const btn = document.getElementById("playCard");
  if (btn) btn.disabled = disabled;
};
