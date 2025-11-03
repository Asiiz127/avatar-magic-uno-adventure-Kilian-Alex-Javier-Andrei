//Sistema de ventajas por tipo de carta
//let card1 = { type: "fire", number: 3 };
//let card2 = { type: "ice", number: 5 };
//let card3 = { type: "earth", number: 2 };

//Puntuaciones por jugador
let player1Score = 0;
let player2Score = 0;
let player3Score = 0;

//Comparación de cartas entre dos jugadores (No optimizado)
/*if (card1.type === "fire" && (card2.type === "ice" || card2.type === "earth")){
    player1Score += 1;
    console.log("Card 1 wins!");
}

if (card1.type === "ice" && (card2.type === "thunderbolt" || card2.type === "arcane")){
    console.log("Card 1 wins!");
}

if (card1.type === "thunderbolt" && (card2.type === "arcane" || card2.type === "fire")){
    console.log("Card 1 wins!");
}

if (card1.type === "arcane" && (card2.type === "earth" || card2.type === "fire")){
    console.log("Card 1 wins!");
}

if (card1.type === "eartht" && (card2.type === "ice" || card2.type === "thunderbolt")){
    console.log("Card 1 wins!");
}
//En caso de empate, se compara el número de la carta
card1.number > card2.number ? console.log("Card 1 wins!") : console.log("Card 2 wins!");*/

//En caso de empate en número
if (card1.number === card2.number){
    player1Score += 1;
    player2Score += 1;
    console.log("It's a tie! Both players win.");
}

//Definir ventajas por tipo de carta
const advantages = {
    fire: ["earth", "ice"],
    arth: ["ice", "thunderbolt"],
    ice: ["thunderbolt", "arcane"],
    thunderbolt: ["arcane", "fire"],
    arcane: ["earth", "fire"]
};

//Ejemplo de comparación usando el objeto de ventajas en 2 y en 3 jugadores
if (advantages[card1.type].includes(card2.type)) {
    player1Score += 1;
    console.log("Card 1 wins by advantage!");
}

if (advantages[card1.type].includes(card2.type) && advantages[card1.type].includes(card3.type)) {
    player1Score += 1;
    console.log("Card 1 wins!");
}   






//Ejemplo de 3 jugadores
let player1 = { type: "fire", number: 3 };
let player2 = { type: "ice", number: 5 };
let player3 = { type: "earth", number: 2 };

if (card1.type === "thunderbolt" && (card2.type === "arcane" || card2.type === "fire") && card3.type === "arcane" ){
    console.log("Card 1 wins!");
}

let card1 = { type: "fire", number: 3 };
let card2 = { type: "ice", number: 5 };
let card3 = { type: "earth", number: 2 };

//Creación de las cartas y decks

const types = ["fire", "earth", "ice", "thunderbolt", "arcane"];
const numbers = [1, 2, 3, 4, 5];

let decks = []

types.forEach(type => {
    numbers.forEach(number => {
        decks.push({ type: type, number: number });
    });
});


