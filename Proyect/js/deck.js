
import { ELEMENTS, VALUES, IMG_PATH } from "./config.js";

let deck = [];
let discardPile = [];


const specialCards = [
  { name: "dragon", img: `${IMG_PATH}dragonCard.png`, type: "special" },
  { name: "yingyang", img: `${IMG_PATH}yingYangCard.png`, type: "special" },
  { name: "darkhole", img: `${IMG_PATH}darkHoleCard.png`, type: "special" }
];


export const createDeck = () => {
  deck = [];
  discardPile = [];

  ELEMENTS.forEach(element => {
    VALUES.forEach(value => {
      deck.push({
        element,
        value,
        img: `${IMG_PATH}${element}${value}.png`,
        type: "normal"
      });
    });
  });

  deck.push(...specialCards);
  shuffle(deck);
  return deck;
};

export const getDeck = () => deck;
export const getDiscard = () => discardPile;


export const draw = () => {
  if (deck.length === 0) {
    const replenished = replenishDeckFromDiscard();
    if (!replenished) return null;
  }
  return deck.pop();
};


export const drawMultiple = (n) => {
  const drawn = [];
  for (let i = 0; i < n; i++) {
    const c = draw();
    if (!c) break;
    drawn.push(c);
  }
  return drawn;
};


export const addToDiscard = (...cards) => {
  const validCards = cards.filter(Boolean);
  for (const card of validCards) {
    if (!deck.includes(card) && !discardPile.includes(card)) {
      discardPile.push(card);
    }
  }
};


export const deckCount = () => deck.length;
export const discardCount = () => discardPile.length;

export const resetDeckAndDiscard = () => {
  deck = [];
  discardPile = [];
};


export const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};


export const replenishDeckFromDiscard = () => {
  if (deck.length > 0 || discardPile.length === 0) return false;

  while (discardPile.length > 0) {
    const card = discardPile.pop();
    deck.push(card);
  }

  shuffle(deck);
  return true;
};
