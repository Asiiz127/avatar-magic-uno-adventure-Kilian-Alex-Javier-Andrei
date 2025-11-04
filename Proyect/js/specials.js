export function applySpecials({
  specialCard,
  selectedCard,
  botCards,
  playerHand,
  bots,
  discardPile,
  playerPoints,
  renderHands,
  renderScoreBoard,
  renderDeckCount,
  refillHands
}) {
  let message = "";
  let canceled = false;

  const botSpecials = botCards.filter(c => c.type === "special");
  const allSpecials = [specialCard, ...botSpecials].filter(Boolean);

  // Si salen 2 o más cartas especiales iguales, se anulan
  if (allSpecials.length > 1 && allSpecials.every(c => c.name === specialCard.name)) {
    message = `Las cartas especiales "${specialCard.name}" se anulan entre sí.`;
    canceled = true;
  }

  if (!canceled) {
    switch (specialCard.name) {
      case "dragon":
        message = "El Dragón ruge con furia. Todos los jugadores pierden 1 punto.";
        // Restar 1 punto a todos los jugadores
        playerPoints.value = Math.max(0, playerPoints.value - 1);
        bots.forEach(b => b.points = Math.max(0, b.points - 1));
        canceled = true;
        break;

      case "yingyang":
        message = "Ying Yang: el equilibrio lo es todo. Se reajustan los puntos.";
        const allPlayers = [{ name: "Jugador", points: playerPoints.value }, ...bots];
        const max = Math.max(...allPlayers.map(p => p.points));
        const min = Math.min(...allPlayers.map(p => p.points));
        allPlayers.forEach(p => {
          if (p.points === max && p.points > 0) p.points--;
          if (p.points === min) p.points++;
        });
        playerPoints.value = allPlayers[0].points;
        canceled = true;
        break;

      case "darkhole":
        message = "Agujero Negro: ¡Ganas automáticamente la ronda!";
        playerPoints.value++;
        canceled = true;
        break;
    }
  }

  // Eliminar la carta especial de la mano del jugador
  const idx = playerHand.indexOf(selectedCard);
  if (idx !== -1) playerHand.splice(idx, 1);

  // Mandar todas las cartas jugadas al descarte
  discardPile.push(selectedCard, ...botCards);

  // Reponer manos y actualizar UI
  refillHands();
  renderHands();
  renderScoreBoard();
  renderDeckCount();

  // Mostrar mensaje de efecto
  document.getElementById("effectMessage").innerText = message;
  document.getElementById("playCard").disabled = true;

  return { canceled, message };
}
