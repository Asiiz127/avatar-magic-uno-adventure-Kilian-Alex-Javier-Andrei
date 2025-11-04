
import * as Deck from "./deck.js";
import * as Players from "./players.js";
import * as UI from "./ui.js";
import { playRound } from "./round.js";

export const gameState = {
  deck: [],
  discardPile: [],
  selectedCard: null,
  isGameActive: false,
  pointsToWin: 8,
  lastWinner: null
};

export const startGame = (numPlayers, pointsToWin) => {

  Deck.resetDeckAndDiscard?.(); 
  gameState.deck = Deck.createDeck();
  gameState.discardPile = [];
  gameState.selectedCard = null;
  gameState.isGameActive = true;
  gameState.pointsToWin = pointsToWin;

  Players.createPlayers(numPlayers);
  Players.resetScores();

 
  for (let i = 0; i < 5; i++) {
    
    const c = Deck.draw();
    if (c) Players.drawToPlayer(c);
    
    const bots = Players.getBots();
    bots.forEach((_, bi) => {
      const cb = Deck.draw();
      if (cb) Players.drawToBot(bi, cb);
    });
  }

  UI.renderHands();
  UI.renderScoreBoard();
  UI.renderDeckCount();

  document.getElementById("playedCards").innerHTML = "";
  document.getElementById("roundResult").innerHTML = "";
  document.getElementById("effectMessage").innerHTML = "";
  document.getElementById("playCard").disabled = true;

  
  window.gameState = gameState;
  window.gameState.deck = gameState.deck = Deck.getDeck();
  window.gameState.discardPile = Deck.getDiscard();
  window.gameState.isGameActive = true;
  window.gameState.pointsToWin = pointsToWin;
};

export const endGameIfNeeded = () => {
  const { player, bots } = { player: Players.getPlayer(), bots: Players.getBots() };
  const maxPoints = Math.max(player.points, ...bots.map(b => b.points));
  if (maxPoints >= gameState.pointsToWin) {
    const winners = [];
    if (player.points === maxPoints) winners.push("Jugador");
    bots.forEach(b => { if (b.points === maxPoints) winners.push(b.name); });
    document.getElementById("roundResult").innerHTML = `🏆 ${winners.join(" y ")} han ganado la partida!`;
    gameState.isGameActive = false;
    document.getElementById("playCard").disabled = true;
    return true;
  }
  return false;
};

export const doPlayRound = () => {
  playRound({ state: gameState });
  UI.renderScoreBoard();
  UI.renderDeckCount();
  UI.renderHands();
  endGameIfNeeded();
};
