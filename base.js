const types = ["fire", "earth", "ice", "thunderbolt", "arcane"];
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const decks = [];

types.forEach(type => {
    numbers.forEach(number => {
        decks.push({ type: type, number: number });
    });
});

const mainDeck = [...decks];

const drawingInitialHand = (decks) => {
    let hand = [];

    let draw1card = Math.floor(Math.random() * decks.length);
    hand.push(decks.splice(draw1card, 1)[0]);

    let draw2card = Math.floor(Math.random() * decks.length);
    hand.push(decks.splice(draw2card, 1)[0]);

    let draw3card = Math.floor(Math.random() * decks.length);
    hand.push(decks.splice(draw3card, 1)[0]);   

    return hand;
};

const numPlayers = document.querySelector('#numPlayers');
const divplayer1 = document.querySelector('.player1');
const divplayer2 = document.querySelector('.player2');
const divplayer3 = document.querySelector('.player3');
const divplayer4 = document.querySelector('.player4');
const divplayer5 = document.querySelector('.player5');

let player1Hand = [];
let player2Hand = [];
let player3Hand = [];
let player4Hand = [];
let player5Hand = [];

const displayHand = (hand, div, playerNumber) => {
    div.innerHTML = `Jugador ${playerNumber}:<br>`;

    hand.forEach(card => {
        const cardDiv = document.createElement('span');
        cardDiv.innerText = `${card.type} ${card.number} `;
        cardDiv.style.padding = '2px 5px';
        cardDiv.style.border = '1px solid #fff';
        cardDiv.style.margin = '2px';
        cardDiv.style.borderRadius = '3px';
        div.appendChild(cardDiv);
    });

    div.style.display = 'flex'; 
    div.style.flexDirection = 'column';
    div.style.alignItems = 'center';
    div.style.position = 'absolute';
};

const setInitialHands = () => {
    const numPlayers = parseInt(document.querySelector('#numPlayers').value);

    document.querySelector('#player1Cards').innerHTML = '';


    [divplayer2, divplayer3, divplayer4, divplayer5].forEach(div => {
    div.innerHTML = '';
    div.style.display = 'none';
    });

    // Jugador 1
    player1Hand = drawingInitialHand(mainDeck);
    displayPlayerHand();

    // Jugadores bots
    if (numPlayers >= 3) {
        player2Hand = drawingInitialHand(mainDeck);
        player3Hand = drawingInitialHand(mainDeck);
        displayHand(player2Hand, divplayer2, 2);
        displayHand(player3Hand, divplayer3, 3);
    }
    if (numPlayers >= 4) {
    player4Hand = drawingInitialHand(mainDeck);
    displayHand(player4Hand, divplayer4, 4);
    }
    if (numPlayers >= 5) {
    player5Hand = drawingInitialHand(mainDeck);
    displayHand(player5Hand, divplayer5, 5);
    };


}