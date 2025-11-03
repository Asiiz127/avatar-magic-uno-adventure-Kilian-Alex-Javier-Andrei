    /**
     * @jest-environment jsdom
     */
    const updateScores = require('./updateScores');

    describe('updateScores', () => {

    
    beforeEach(() => {
        document.body.innerHTML = `
        <input id="numPlayers" value="3" />
        <div class="scores"></div>
        `;
        global.player1Score = 10;
        global.player2Score = 20;
        global.player3Score = 30;
        global.player4Score = 40;
        global.player5Score = 50;
    });

    test('muestra los puntajes de 3 jugadores cuando numPlayers = 3', () => {
        document.querySelector('#numPlayers').value = '3';
        updateScores();

        const scoresDiv = document.querySelector('.scores').innerHTML;

        expect(scoresDiv).toContain('Jugador 1: 10');
        expect(scoresDiv).toContain('Jugador 2: 20');
        expect(scoresDiv).toContain('Jugador 3: 30');
        expect(scoresDiv).not.toContain('Jugador 4');
    });

    test('incluye jugador 4 cuando numPlayers = 4', () => {
        document.querySelector('#numPlayers').value = '4';
        updateScores();

        const scoresDiv = document.querySelector('.scores').innerHTML;

        expect(scoresDiv).toContain('Jugador 4: 40');
    });

    test('incluye hasta jugador 5 cuando numPlayers = 5', () => {
        document.querySelector('#numPlayers').value = '5';
        updateScores();

        const scoresDiv = document.querySelector('.scores').innerHTML;

        expect(scoresDiv).toContain('Jugador 5: 50');
    });

    test('actualiza correctamente el contenido del div .scores', () => {
        updateScores();
        const scoresDiv = document.querySelector('.scores');
        expect(scoresDiv.innerHTML).toMatch(/Jugador 1: 10/);
    });

    });
