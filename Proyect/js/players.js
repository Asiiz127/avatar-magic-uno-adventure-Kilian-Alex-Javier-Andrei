
import { drawMultiple, draw } from "./deck.js";


let player = null;
let bots = [];
const INITIAL_HAND_SIZE = 5;


export const createPlayers = (numTotalPlayers = 3) => {
  const numBots = Math.max(0, (numTotalPlayers || 3) - 1);
  player = { name: "Jugador", hand: [], points: 0 };
  bots = Array.from({ length: numBots }, (_, i) => ({ name: `Bot${i+1}`, hand: [], points: 0 }));
};


export const dealInitialHands = () => {
  if (!player) return;
  player.hand = drawMultiple(INITIAL_HAND_SIZE);
  bots.forEach(bot => {
    bot.hand = drawMultiple(INITIAL_HAND_SIZE);
  });
};


export const drawToPlayer = (card) => {
  if (!player) return;
  if (!card) return;
  player.hand.push(card);
};

export const drawToBot = (botIndex, card) => {
  const bot = typeof botIndex === "number" ? bots[botIndex] : null;
  if (!bot || !card) return;
  bot.hand.push(card);
};


export const getPlayer = () => player;
export const getBots = () => bots;


export const addPoint = (entity) => {
  if (!entity) return;
  entity.points = (entity.points || 0) + 1;
};


export const resetScores = () => {
  if (!player) return;
  player.points = 0;
  bots.forEach(b => (b.points = 0));
};

export const resetPlayers = () => {
  player = null;
  bots = [];
};


export const removeCardFromPlayer = (card) => {
  if (!player || !card) return;
  const idx = player.hand.findIndex(c => sameCard(c, card));
  if (idx !== -1) player.hand.splice(idx, 1);
};

export const removeCardFromBot = (botOrIndex, card) => {
  let bot = null;
  if (typeof botOrIndex === "number") bot = bots[botOrIndex];
  else bot = botOrIndex;
  if (!bot || !card) return;
  const idx = bot.hand.findIndex(c => sameCard(c, card));
  if (idx !== -1) bot.hand.splice(idx, 1);
};


export const refillHandsToInitial = () => {
  if (!player) return;
  while (player.hand.length < INITIAL_HAND_SIZE) {
    const c = draw();
    if (!c) break;
    player.hand.push(c);
  }
  bots.forEach(bot => {
    while (bot.hand.length < INITIAL_HAND_SIZE) {
      const c = draw();
      if (!c) break;
      bot.hand.push(c);
    }
  });
};


export const debugPlayers = () => {
  console.log("PLAYER", player);
  console.log("BOTS", bots);
};

function sameCard(a, b) {
  if (!a || !b) return false;
  if (a.img && b.img && a.img === b.img) return true;
  if (a.name && b.name && a.name === b.name) return true;
  if (a.element && b.element && a.value === b.value && a.element === b.element) return true;
  return false;
}
