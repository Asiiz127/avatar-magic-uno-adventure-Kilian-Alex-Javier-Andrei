// Definición de tipos y números
const CARD_TYPES = ['fire', 'earth', 'air', 'water', 'plant'];
const CARD_NUMBERS = [1, 2, 3, 4, 5];
const deck = [];


function Card(type, number) {
  this.type = type;
  this.number = number;
};

function generateDeck() {
  CARD_TYPES.forEach(type => {
    CARD_NUMBERS.forEach(number => {
      deck.push(new Card(type, number));
    });
  });
  return deck;
};

document.getElementById('playBtn').onclick = function() {
  const deck = generateDeck();
  console.log(deck);
};