export interface Card {
    rank: number;
    suit: number;
};

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
    TWO: 0,
    JACK: 9,
    QUEEN: 10,
    KING: 11,
    ACE: 12
});

const getHighCard = (hand: Card[]) => Math.max(...hand.map(card => card.rank));
const getCards = (hand: Card[], n: number) => {
    hand.sort((a,b) => b.rank - a.rank);
    return hand.splice(0, n+1);
};

const count = (elem: any, arry: any[]) => {
    let count = 0;
    for (const item of arry) {
        if (item === elem) {
            count++;
        }
    }
    return count;
};

/* Returns the element that occurs n times in array. */
const occurs = (n: number, arry: any[]) => {
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
const remove = (elem: any, array: any[]) => array.filter(e => e != elem);

const handRanks = (hand: Card[]) => hand.map(card => card.rank);
const handSuits = (hand: Card[]) => hand.map(card => card.suit);

/* These tests must be applied to hand in decreasing order of strength i.e straight flushes 
 * before four of kind... etc. This is because each function checks for only minimum viability. 
 * For example, isThreeOfKind will return true if it is passed a Full House because it detects 
 * three of the same cards.
*/
export const isPair = (hand: Card[]) => count(2, handRanks(hand).map(card => count(card, handRanks(hand)))) === 2; 
export const isTwoPair = (hand: Card[]) => count(2, handRanks(hand).map(card => count(card, handRanks(hand)))) === 4;
export const isThreeOfKind = (hand: Card[]) => Math.max(...handRanks(hand).map(card => count(card, handRanks(hand)))) === 3;
export const isStraight = (hand: Card[]) => {
    const ranks = handRanks(hand);
    if (ranks.find(rank => rank === Ranks.ACE)) {
        // We need to determine if the ace is low or high.
        // If a king is in the hand then it has to be treated as a 13 to make a straight.
        const isKingInHand = ranks.includes(Ranks.KING);
        let aceValue = (isKingInHand) ? Ranks.ACE : -1;
        ranks[ranks.indexOf(Ranks.ACE)] = aceValue;
    }
    ranks.sort((a,b) => a - b); 
    for (let i = 0; i < 4; i++) {
        if (ranks[i] !== ranks[i+1] - 1) {
            return false;
        }
    }
    hand.sort((a, b) => a.rank - b.rank);
    return true;
};
export const isFlush = (hand: Card[]) => count(hand[0].suit, handSuits(hand)) === 5;
export const isFullHouse = (hand: Card[]) => isPair(hand) && isThreeOfKind(hand);
export const isFourOfKind = (hand: Card[]) => Math.max(...handRanks(hand).map(card => count(card, handRanks(hand)))) === 4;
export const isStraightFlush = (hand: Card[]) => isStraight(hand) && isFlush(hand);

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
export const handStrength = (hand: Card[]) => {
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
        const isKingInHand = handRanks(hand).includes(Ranks.KING);
        const isAceInHand = handRanks(hand).includes(Ranks.ACE);
        const aceValue = (isKingInHand) ? Ranks.ACE : 0;
        const highCard = (getHighCard(hand) === Ranks.ACE) ? aceValue : getHighCard(hand);
        return { 
            type: HandRankings.STRAIGHT, 
            strength: highCard 
        };
    }
    else if (isThreeOfKind(hand)) {
        return { type: HandRankings.THREE_OF_KIND, strength: occurs(3, handRanks(hand)), tiebreak: getCards(remove(occurs(3, handRanks(hand)), handRanks(hand)), 2) };
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
        return { type: HandRankings.PAIR, strength: occurs(2, handRanks(hand)), tiebreak: getCards(remove(occurs(2, handRanks(hand)), handRanks(hand)), 3) };
    }
    else {
        return { type: HandRankings.HIGH, strength: getHighCard(hand), tiebreak: getCards(remove(getHighCard(hand), handRanks(hand)), 4) };
    }
};

const comparator = (a: any, b: any) => {
    if (Array.isArray(a) && Array.isArray(b)) {
        a.sort((a,b) => b - a);
        b.sort((a,b) => b - a);
        for (let i = 0; i < b.length; i++) {
            if (a[i] > b[i]) {
                return 1;
            }
            else if (a[i] < b[i]) {
                return -1;
            }
        }
        return 0;
    }
    if (a > b) {
        return 1;
    }
    else if (a < b) {
        return -1;
    }
    else {
        return 0;
    }
};

export const doesHandWin = (a: Card[], b: Card[]) => {
    const aHandStrength = handStrength(a);
    const bHandStrength = handStrength(b);
    const type = comparator(aHandStrength.type, bHandStrength.type);
    const strength = comparator(aHandStrength.strength, bHandStrength.strength);
    const tiebreaker = comparator(aHandStrength.tiebreak, bHandStrength.tiebreak);

    if (type === 0) {
        if (strength === 0) {
            return tiebreaker;
        }
        return strength;
    }
    return type;
};

export const createDeck = () => {
    const deck = [];
    for (let rank = Ranks.TWO; rank <= Ranks.ACE; rank++) {
        for (let suit = 0; suit < 4; suit++) {
            deck.push({rank, suit});
        }
    }
    return deck;
};
