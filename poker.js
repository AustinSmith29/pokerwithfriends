const Card = (r, s) => ({rank: r, suit: s});

const HandRankings = Object.freeze({
    HIGH: 1,
    PAIR: 2,
    TWO_PAIR: 3,
    THREE_OF_KIND: 4,
    STRAIGHT: 5,
    FLUSH: 6,
    FULL_HOUSE: 7,
    FOUR_OF_KIND: 8,
    STRAIGHT_FLUSH: 9
});

const Ranks = Object.freeze({
    TWO: 1,
    JACK: 10,
    QUEEN: 11,
    KING: 12,
    ACE: 13
});

const getHighCard = (hand) => Math.max(hand.map(card => card.rank));

const count = (elem, arry) => {
    let count = 0;
    for (const item of arry) {
        if (item === elem) {
            count++;
        }
    }
    return count;
};

const handRanks = (hand) => hand.map(card => card.rank);
const handSuits = (hand) => hand.map(card => card.suit);

const isPair = (hand) => count(2, handRanks(hand).map(card => count(card, handRanks(hand)))) === 2; 
const isTwoPair = (hand) => count(2, handRanks(hand).map(card => count(card, handRanks(hand)))) === 4;
const isThreeOfKind = (hand) => Math.max(...handRanks(hand).map(card => count(card, handRanks(hand)))) === 3;
const isStraight = (hand) => {
    const handRanks = hand.map(card => card.rank);
    if (handRanks.find(rank => rank === Ranks.ACE)) {
        // We need to determine if the ace is low or high.
        // If a king is in the hand then it has to be treated as a 13 to make a straight.
        const isKingInHand = handRanks.includes(Ranks.KING);
        let aceValue = (isKingInHand) ? Ranks.ACE : 0;
        handRanks[handRancks.indexOf(Ranks.ACE)] = aceValue;
    }
    handRanks.sort((a,b) => a - b); 
    for (let i = 0; i < 4; i++) {
        if (handRanks[i] !== handRanks[i+1] - 1) {
            return false;
        }
    }
    return true;
};
const isFlush = (hand) => count(hand[0].suit, handSuits(hand)) === 5;
const isFullHouse = (hand) => isPair(hand) && isThreeOfKind(hand);
const isFourOfKind = (hand) => Math.max(...handRanks(hand).map(card => count(card, handRanks(hand)))) === 4;
const isStraightFlush = (hand) => isStraight(hand) && isFlush(hand);

const classifyHand = (hand) => undefined;

const handStrength = (hand) => [classifyHand(hand), getHighCard(hand)];

const createDeck = () => {
    const deck = [];
    for (let rank = Ranks.TWO; rank <= Ranks.ACE; rank++) {
        for (let suit = 0; suit < 4; suit++) {
            deck.push(Card(rank, suit));
        }
    }
    return deck;
};

exports.isPair = isPair;
exports.isTwoPair = isTwoPair;
exports.isThreeOfKind = isThreeOfKind;
exports.isStraight = isStraight;
exports.isFlush = isFlush;
exports.isFullHouse = isFullHouse;
exports.isFourOfKind = isFourOfKind;
exports.isStraightFlush = isStraightFlush;
exports.Card = Card;
