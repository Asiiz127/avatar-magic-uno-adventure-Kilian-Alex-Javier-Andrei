// Proyect/js/round.js
import { applySpecials } from "./specials.js";
import { ELEMENTS } from "./config.js";
import { addToDiscard, replenishDeckFromDiscard, draw, deckCount } from "./deck.js";
import {
  getPlayer,
  getBots,
  removeCardFromPlayer,
  refillHandsToInitial,
  addPoint
} from "./players.js";
import {
  renderHands,
  renderPlayedCards,
  renderScoreBoard,
  renderDeckCount,
  showEffectMessage,
  setPlayButtonDisabled
} from "./ui.js";

let reverseLogic = false;
let effectsDisabled = false;
let currentWinner = null;

const baseBeats = {
  fire: ["ice"],
  ice: ["arcane"],
  arcane: ["earth"],
  earth: ["thunder"],
  thunder: ["fire"]
};

const invertBeats = () => {
  const inverted = {};
  for (const k in baseBeats) {
    inverted[k] = ELEMENTS.filter(el => !baseBeats[k].includes(el) && el !== k);
  }
  return inverted;
};

export const compareCards = (playerCard, botCards) => {
  const beats = reverseLogic ? invertBeats() : baseBeats;
  const cards = [{ name: "Jugador", card: playerCard }, ...botCards.map((c, i) => ({ name: `Bot${i + 1}`, card: c }))];

  return cards.reduce((best, current) => {
    if (beats[current.card.element]?.includes(best.card.element)) return current;
    if (beats[best.card.element]?.includes(current.card.element)) return best;
    return current.card.value > best.card.value ? current : best;
  });
};

export const playRound = ({ state }) => {
  const player = getPlayer();
  const bots = getBots();

  if (!state.selectedCard || !state.isGameActive) return;

  const botCards = bots.map(bot => {
    if (bot.hand.length === 0) return null;
    const idx = Math.floor(Math.random() * bot.hand.length);
    return bot.hand.splice(idx, 1)[0];
  });

  renderPlayedCards(state.selectedCard, botCards);

  const lastPlayedCards = [state.selectedCard, ...botCards];
  const specialCardsPlayed = lastPlayedCards.filter(c => c && c.type === "special");

  if (specialCardsPlayed.length === 1) {
    const specialCard = specialCardsPlayed[0];

    const { canceled, message } = applySpecials({
      specialCard,
      selectedCard: state.selectedCard,
      botCards,
      playerHand: player.hand,
      bots,
      discardPile: state.discardPile,
      playerPoints: { value: player.points },
      renderHands,
      renderScoreBoard,
      renderDeckCount,
      refillHands: () => refillHandsToInitial(draw)
    });

    // Descartar cartas una vez
    removeCardFromPlayer(state.selectedCard);
    addToDiscard(state.selectedCard, ...botCards);

    renderHands();
    renderScoreBoard();
    renderDeckCount();
    showEffectMessage(message);

    if (canceled) {
      setPlayButtonDisabled(true);
      state.selectedCard = null;
      return;
    }
  } else if (specialCardsPlayed.length > 1) {
    // Ronda anulada
    document.getElementById("roundResult").innerText = "Se jugaron múltiples cartas especiales, la ronda se anula.";
    removeCardFromPlayer(state.selectedCard);
    addToDiscard(state.selectedCard, ...botCards);
    refillHandsToInitial(draw);
    renderHands();
    setPlayButtonDisabled(true);
    state.selectedCard = null;
    return;
  }

  const winner = compareCards(state.selectedCard, botCards);
  currentWinner = winner.name;
  renderPlayedCards(state.selectedCard, botCards, currentWinner);
  document.getElementById("roundResult").innerText = `🏆 Gana ${currentWinner}!`;

  // Actualizar puntos
  if (currentWinner === "Jugador") player.points++;
  else {
    const b = bots.find(x => x.name === currentWinner);
    if (b) b.points++;
  }

  // Efectos elementales
  const element = winner.card.element;
  let effectMessage = "";
  let postRefillEffect = null;

  if (!effectsDisabled) {
    switch (element) {
      case "fire":
        bots.forEach(b => { if (b.hand.length > 0) b.hand.pop(); });
        effectMessage = "¡Cuidado que quema! Los oponentes pierden una carta.";
        break;
      case "earth":
        postRefillEffect = () => {
          replenishDeckFromDiscard();
          const drawTarget = currentWinner === "Jugador" ? player : bots.find(b => b.name === currentWinner);
          if (drawTarget && deckCount() > 0) drawTarget.hand.push(draw());
        };
        effectMessage = "La tierra te nutre. Robas una carta extra.";
        break;
      case "thunder":
        reverseLogic = !reverseLogic;
        effectMessage = "¡ZAP! Se invierte la jerarquía elemental.";
        break;
      case "ice":
        effectsDisabled = true;
        effectMessage = "Efectos desactivados la siguiente ronda.";
        break;
      case "arcane":
        const winnerBot = bots.find(b => b.name === currentWinner);
        if (currentWinner === "Jugador") player.points++;
        else if (winnerBot) winnerBot.points++;
        effectMessage = "La magia arcana te apoya. Ganas un punto adicional.";
        break;
    }
  } else {
    effectsDisabled = false;
    effectMessage = "Los efectos siguen congelados esta ronda.";
  }

  showEffectMessage(effectMessage);

  // Enviar cartas al descarte (solo una vez)
  removeCardFromPlayer(state.selectedCard);
  addToDiscard(state.selectedCard, ...botCards);

  refillHandsToInitial(draw);
  if (postRefillEffect) postRefillEffect();

  renderHands();
  renderScoreBoard();
  renderDeckCount();

  state.selectedCard = null;
  setPlayButtonDisabled(true);
  state.lastWinner = currentWinner;
};
