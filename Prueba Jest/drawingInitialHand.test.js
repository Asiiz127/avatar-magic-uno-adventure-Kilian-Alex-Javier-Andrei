const drawingInitialHand = require('./drawingInitialHand');

describe('drawingInitialHand', () => {

    test('devuelve un array de 3 cartas', () => {
        const decks = ['A', 'B', 'C', 'D', 'E'];
        const hand = drawingInitialHand([...decks]);

        expect(Array.isArray(hand)).toBe(true);
        expect(hand.length).toBe(3);
    });

    test('las cartas provienen del mazo original', () => {
        const decks = ['A', 'B', 'C', 'D', 'E'];
        const hand = drawingInitialHand([...decks]);
        
        hand.forEach(card => {
        expect(decks.includes(card)).toBe(true);
        });
    });

    test('no devuelve cartas repetidas', () => {
        const decks = ['A', 'B', 'C', 'D', 'E'];
        const hand = drawingInitialHand([...decks]);
        
        const uniqueCards = new Set(hand);
        expect(uniqueCards.size).toBe(hand.length);
    });

    test('reduce el tamaño del mazo original en 3', () => {
        const decks = ['A', 'B', 'C', 'D', 'E'];
        const originalLength = decks.length;
        drawingInitialHand(decks);
        expect(decks.length).toBe(originalLength - 3);
    });

    });