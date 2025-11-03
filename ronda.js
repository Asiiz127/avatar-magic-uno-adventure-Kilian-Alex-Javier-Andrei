let playedCards = [];

let currentTurn = 0;

let player1Score = 0;
let player2Score = 0;
let player3Score = 0;
let player4Score = 0;
let player5Score = 0;       

const playButton = document.querySelector('#playCard');
const playedCardsDiv = document.querySelector('.played-cards');
const messageDiv = document.querySelector('.message');

let selectedCardIndex = null;

const selectCard = (index) => {
    selectedCardIndex = index;
    messageDiv.innerHTML = `Has seleccionado: ${player1Hand[index].type} ${player1Hand[index].number}`;
};

const advantages = {
    fire: ["earth", "ice"],
    earth: ["ice", "thunderbolt"],
    ice: ["thunderbolt", "arcane"],
    thunderbolt: ["arcane", "fire"],
    arcane: ["earth", "fire"]
};

const checkRoundWinner = () => {
    let encounterWinnerCount = [];

    playedCards.forEach(play => {
        encounterWinnerCount.push({
            player: play.player,
            card: play.card,
            count: 0
        });
    });

    // Comparar tipos de carta
    encounterWinnerCount.forEach((entry1, index1) => {
        encounterWinnerCount.forEach((entry2, index2) => {
            if (index1 !== index2) {
                if (advantages[entry1.card.type].includes(entry2.card.type)) {
                    entry1.count += 1;
                }
            }
        });
    });
    
    let winner = encounterWinnerCount[0];
    encounterWinnerCount.forEach(entry => {
        if (entry.count > winner.count) winner = entry;
    });
    
    encounterWinnerCount.forEach(entry => {
        if (entry.count === winner.count && entry.card.number > winner.card.number) {
            winner = entry;
        }
    });
    
    if (winner.player === 1) player1Score++;
    if (winner.player === 2) player2Score++;
    if (winner.player === 3) player3Score++;
    if (winner.player === 4) player4Score++;
    if (winner.player === 5) player5Score++;
    messageDiv.innerHTML = `Jugador ${winner.player} gana la ronda`;
    
    return winner;
};

const setWinningScore = (numPlayers) => {
    if (numPlayers === 3) return 7;
    if (numPlayers === 4) return 6;
    if (numPlayers === 5) return 5;
}
const checkGameOver = () => {
    const numPlayers = parseInt(document.querySelector('#numPlayers').value);
    if (mainDeck.length <= numPlayers){
        messageDiv.innerHTML = "Someone wins.";
    }
    if (player1Score  >= setWinningScore(numPlayers) || player2Score  >= setWinningScore(numPlayers) || player3Score  >= setWinningScore(numPlayers) || player4Score  >= setWinningScore(numPlayers) || player5Score  >= setWinningScore(numPlayers)){
        messageDiv.innerHTML = "Someone wins.";
    }
}
const updateScores = () => {
    const scoresDiv = document.querySelector('.scores');
    const numPlayers = parseInt(document.querySelector('#numPlayers').value);
    let html = '';
    if (numPlayers >= 3) {
        html += `Jugador 1: ${player1Score} <br>`;
        html += `Jugador 2: ${player2Score} <br>`;
        html += `Jugador 3: ${player3Score} <br>`;
    }
    if (numPlayers >= 4) {
        html += `Jugador 4: ${player4Score} <br>`;
    }
    if (numPlayers === 5) {
        html += `Jugador 5: ${player5Score} <br>`;
    }
    scoresDiv.innerHTML = html;
};

const drawAfterRound = (numPlayers) => {
    if (mainDeck.length === 0) return;

    if (mainDeck.length > 0) player1Hand.push(mainDeck.splice(Math.floor(Math.random() * mainDeck.length), 1)[0]);
    if (numPlayers >= 3 && mainDeck.length > 0) player2Hand.push(mainDeck.splice(Math.floor(Math.random() * mainDeck.length), 1)[0]);
    if (numPlayers >= 3 && mainDeck.length > 0) player3Hand.push(mainDeck.splice(Math.floor(Math.random() * mainDeck.length), 1)[0]);
    if (numPlayers >= 4 && mainDeck.length > 0) player4Hand.push(mainDeck.splice(Math.floor(Math.random() * mainDeck.length), 1)[0]);
    if (numPlayers >= 5 && mainDeck.length > 0) player5Hand.push(mainDeck.splice(Math.floor(Math.random() * mainDeck.length), 1)[0]);
}
const displayPlayerHand = () => {
    const divplayer1Cards = document.querySelector('#player1Cards');
    divplayer1Cards.innerHTML = '';

    player1Hand.forEach((card, index) => {
        const btn = document.createElement('button');
        btn.innerText = `${card.type} ${card.number}`;
        btn.style.backgroundColor = '#3498db';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.padding = '5px 10px';
        btn.style.margin = '2px';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';

        if (selectedCardIndex === index) {
            btn.style.border = '2px solid yellow';
        }

        btn.onclick = () => selectCard(index);
        divplayer1Cards.appendChild(btn);
    });

    const divplayer1 = document.querySelector('.player1');
    divplayer1.style.display = 'flex';
};

const playCard = () => {
    const numPlayers = parseInt(document.querySelector('#numPlayers').value);
    
    playedCards = [];
    
    if (selectedCardIndex !== null) {
        const playedCard = player1Hand.splice(selectedCardIndex, 1)[0];
        playedCards.push({ player: 1, card: playedCard });
        selectedCardIndex = null;
    } else {
        alert("Selecciona una carta antes de jugar.");
        return;
    }
    
    if (numPlayers >= 3 && player2Hand.length > 0) {
        const bot2Card = player2Hand.splice(Math.floor(Math.random() * player2Hand.length), 1)[0];
        playedCards.push({ player: 2, card: bot2Card });
    }
    if (numPlayers >= 3 && player3Hand.length > 0) {
        const bot3Card = player3Hand.splice(Math.floor(Math.random() * player3Hand.length), 1)[0];
        playedCards.push({ player: 3, card: bot3Card });
    }
    if (numPlayers >= 4 && player4Hand.length > 0) {
    const bot4Card = player4Hand.splice(Math.floor(Math.random() * player4Hand.length), 1)[0];
    playedCards.push({ player: 4, card: bot4Card });
    }
    if (numPlayers >= 5 && player5Hand.length > 0) {
    const bot5Card = player5Hand.splice(Math.floor(Math.random() * player5Hand.length), 1)[0];
    playedCards.push({ player: 5, card: bot5Card });
    }

    
    const winner = checkRoundWinner();
    
    let html = '';
    playedCards.forEach(play => {
        if (play.player === winner.player && play.card.type === winner.card.type && play.card.number === winner.card.number) {
            html += `<div style="background-color: yellow; font-weight: bold;">
                        Jugador ${play.player}: ${play.card.type} ${play.card.number} (Ganadora)
                    </div>`;
        } else {
            html += `<div>Jugador ${play.player}: ${play.card.type} ${play.card.number}</div>`;
        }
    });
    playedCardsDiv.innerHTML = html;
    
    updateScores();
    
    drawAfterRound(numPlayers);

    displayPlayerHand();
    if(numPlayers >= 3) {
    displayHand(player2Hand, divplayer2, 2);
    displayHand(player3Hand, divplayer3, 3);
    }
    if(numPlayers >= 4) displayHand(player4Hand, divplayer4, 4);
    if(numPlayers === 5) displayHand(player5Hand, divplayer5, 5);
    
    checkGameOver();
};



