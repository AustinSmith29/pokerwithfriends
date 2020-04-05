const Card = (r, s) => ({rank: r, suit: s});

const HandRankings = Object.freeze({
    HIGH: 0,
    PAIR: 1,
    TWO_PAIR: 2,
    THREE_OF_KIND: 3,
    STRAIGHT: 4,
    FLUSH: 5,
    FULL_HOUSE: 6,
    FOUR_OF_KIND: 7,
    STRAIGHT_FLUSH: 8
});

const Ranks = Object.freeze({
    TWO: 1,
    JACK: 10,
    QUEEN: 11,
    KING: 12,
    ACE: 13
});

const getHighCard = (hand) => Math.max(...hand.map(card => card.rank));
const getNextHighestCards = (hand, n) => {
    hand.sort((a,b) => b.rank - a.rank);
    return hand.splice(1, n+1);
};

const count = (elem, arry) => {
    let count = 0;
    for (const item of arry) {
        if (item === elem) {
            count++;
        }
    }
    return count;
};

/* Returns the element that occurs n times in array. */
const occurs = (n, arry) => {
    let counts = new Map();
    for (const elem of arry) {
        const count = counts.get(elem);
        if (count) {
            counts.set(elem, count+1);
        }
        else {
            counts.set(elem, 1);
        }
    }
    for (const [key, value] of counts.entries()) {
        if (value === n) {
            return key;
        }
    }
    return undefined;
};

/* Removes all instances of element from the array. */
const remove = (elem, array) => array.filter(e => e != elem);

const handRanks = (hand) => hand.map(card => card.rank);
const handSuits = (hand) => hand.map(card => card.suit);

/* These tests must be applied to hand in decreasing order of strength i.e straight flushes 
 * before four of kind... etc. This is because each function checks for only minimum viability. 
 * For example, isThreeOfKind will return true if it is passed a Full House because it detects 
 * three of the same cards.
*/
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
        handRanks[handRanks.indexOf(Ranks.ACE)] = aceValue;
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

// TYPE, STRENGTH, TIEBREAKER?
// HIGH, K 
// PAIR, 2, A
// TWOPAIR, 8J, A
// THREE OF KIND, 8, K
// STRAIGHT, 9 
// FLUSH, J
// FULLHOUSE, 10,K
// FOUR KIND, 3, A
// STRAIGHTFLUSH, A
const handStrength = (hand) => {
    if (isStraightFlush(hand)) {
        return { type: HandRankings.STRAIGHT_FLUSH, strength: getHighCard(hand) };
    }
    else if (isFourOfKind(hand)) {
        return { type: HandRankings.FOUR_OF_KIND, strength: occurs(4, handRanks(hand)), tiebreak: occurs(1, handRanks(hand)) };
    }
    else if (isFullHouse(hand)) {
        return { type: HandRankings.FULL_HOUSE, strength: occurs(3, handRanks(hand)), tiebreak: occurs(2, handRanks(hand)) };
    }
    else if (isFlush(hand)) {
        return { type: HandRankings.FLUSH, strength: getHighCard(hand) };
    }
    else if (isStraight(hand)) { 
        return { type: HandRankings.STRAIGHT, strength: getHighCard(hand) };
    }
    else if (isThreeOfKind(hand)) {
        return { type: HandRankings.THREE_OF_KIND, strength: occurs(3, handRanks(hand)), tiebreak: getNextHighestCards(occurs(3, handRanks(hand)), 2) };
    }
    else if (isTwoPair(hand)) {
        const pair1 = occurs(2, handRanks(hand));
        const pair2 = occurs(2, remove(pair1, handRanks(hand)));
        const bigPair = Math.max(pair1, pair2);
        const smallPair = Math.min(pair1, pair2);
        return { 
            type: HandRankings.TWO_PAIR, 
            strength: [bigPair, smallPair], 
            tiebreak: occurs(1, handRanks(hand)) 
        };

    }
    else if (isPair(hand)) {
        return { type: HandRankings.PAIR, strength: occurs(2, handRanks(hand)), tiebreak: getNextHighestCards(remove(occurs(2, handRanks(hand)), handRanks(hand)), 3) };
    }
    else {
        return { type: HandRankings.HIGH, strength: getHighCard(hand), tiebreak: getNextHighestCards(remove(getHighCard(hand), handRanks(hand)), 4) };
    }
};

exports.doesHandWin = (a, b) => {
    const A_WINS = 1;
    const B_WINS = 2;
    const SPLIT = 0;
    const aStrength = handStrength(a);
    const bStrength = handStrength(b);
    if (aStrength.type > bStrength.type) {
        return A_WINS;
    }
    else if (aStrength.type === bStrength.type) {
        if (aStrength.strength > bStrength.strength) {
            return A_WINS;
        }
        else if (aStrength.strength === bStrength.strength) {
            if (aStrength.tiebreak && bStrength.tiebreak) {
                if (aStrength.tiebreak > bStrength.tiebreak) {
                    return A_WINS;
                }
                else if (aStrength.tiebreak === bStrength.tiebreak) {
                    return SPLIT;
                }
                else {
                    return B_WINS;
                }
            }
            else {
                return SPLIT;
            }
        }
        else {
            return B_WINS;
        }
    }
    else {
        return B_WINS;
    }
};

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
