const types = ["fire", "earth", "ice", "thunderbolt", "arcane"];
const numbers = [1, 2, 3, 4, 5];

let decks = []

types.forEach(type => {
    numbers.forEach(number => {
        decks.push({ type: type, number: number });
    });
});