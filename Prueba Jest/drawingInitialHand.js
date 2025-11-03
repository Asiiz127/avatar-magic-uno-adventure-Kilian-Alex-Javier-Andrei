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

module.exports = drawingInitialHand;