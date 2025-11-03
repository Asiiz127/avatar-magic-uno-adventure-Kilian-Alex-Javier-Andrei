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

module.exports = updateScores;