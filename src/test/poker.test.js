const poker = require('../poker.js');
const assert = require('assert');

const Card = poker.Card;

const mockHand = (ranks, hasSameSuit=false) => {
    const suits = (hasSameSuit) ? [0,0,0,0,0] : [0,1,2,3,0];
    const hand = ranks.map( (rank, index) => Card(rank, suits[index]) );
    return hand;
};

describe('Pair Test', () => {
    it('should be true', () => {
        assert.equal(poker.isPair(mockHand([3, 3, 6, 8, 12])), true);
    });
    it('should be false', () => {
        assert.equal(poker.isPair(mockHand([3, 3, 4, 4, 12])), false);
    });
});

describe('Two Pair Test', () => {
    it('should be true', () => {
        assert.equal(poker.isTwoPair(mockHand([3, 3, 4, 4, 12])), true);
    });
    it('should be false', () => {
        assert.equal(poker.isTwoPair(mockHand([3, 3, 6, 8, 12])), false);
    });
});

describe('Three of Kind Test', () => {
    it('should be true', () => {
        assert.equal(poker.isThreeOfKind(mockHand([5, 5, 5, 3, 3])), true);
        assert.equal(poker.isThreeOfKind(mockHand([12, 12, 12, 2, 4])), true);
    });
    it('should be false', () => {
        assert.equal(poker.isThreeOfKind(mockHand([5, 5, 4, 3, 3])), false);
    });
});

describe('Straight Test', () => {
    it('should be true', () => {
        assert.equal(poker.isStraight(mockHand([2, 3, 4, 5, 6])), true);
        assert.equal(poker.isStraight(mockHand([1, 13, 2, 3, 4])), true);
        assert.equal(poker.isStraight(mockHand([9, 10, 11, 12, 13])), true);
    });
    it('should be false', () => {
        assert.equal(poker.isStraight(mockHand([10, 13, 0, 11, 12])), false);
        assert.equal(poker.isStraight(mockHand([4, 5, 7, 8, 9])), false);
    });
});

describe('Flush Test', () => {
    it('should be true', () => {
        assert.equal(poker.isFlush(mockHand([13, 4, 2, 5, 2], true)), true);
    });
    it('should be false', () => {
        assert.equal(poker.isFlush(mockHand([4, 6, 2, 1, 12])), false);
    });
});

describe('Full House Test',  () => {
    it('should be true', () => {
        assert.equal(poker.isFullHouse(mockHand([4, 4, 4, 8, 8])), true);
    });
    it('should be false', () => {
        assert.equal(poker.isFullHouse(mockHand([4, 9, 9, 9, 1])), false);
    });
});

describe('Four of Kind Test', () => {
    it('should be true', () => {
        assert.equal(poker.isFourOfKind(mockHand([6, 6, 6, 6, 13])), true);
    });
    it('should be false', () => {
        assert.equal(poker.isFourOfKind(mockHand([4, 4, 4, 12, 11])), false);
    });
});

describe('Straight Flush Test', () => {
    it('should be true', () => {
        assert.equal(poker.isStraightFlush(mockHand([3, 4, 5, 6, 7], true)), true);
    });
});

describe('High Hand Winning', () => {
    it('High Hand Basic Win', () => {
        assert.equal(poker.doesHandWin(mockHand([3,2,4,6,13]), mockHand([5, 1, 4, 10, 12])), 1);
    });
    it('High Hand Split Pot', () => {
        assert.equal(poker.doesHandWin(mockHand([13, 10, 9, 8, 5]), mockHand([13, 10, 9, 8, 5])), 0);
    });
});

describe('Pair Winning', () => {
    it('Beats High Hand', () => {
        assert.equal(poker.doesHandWin(mockHand([2, 2, 10, 8, 9]), mockHand([13, 10, 9, 7, 3])), 1);
    });
    it('Higher Pair Wins', () => {
        assert.equal(poker.doesHandWin(mockHand([12, 12, 8, 3, 4]), mockHand([10, 10, 7, 3, 4])), 1);
    });
    it('Kicker Plays', () => {
        assert.equal(poker.doesHandWin(mockHand([10, 10, 13, 11, 2]), mockHand([10, 10, 9, 11, 2])), 1);
    });
    it('Split Pot', () => {
        assert.equal(poker.doesHandWin(mockHand([12, 12, 10, 8, 4]), mockHand([12, 12, 10, 8, 4])), 0);
    });
});

describe('Two Pair Winning', () => {
    it('Beats Lower Hands', () => {
        assert.equal(poker.doesHandWin(mockHand([12, 12, 6, 6, 13]), mockHand([13, 9, 3, 4, 5])), 1);
        assert.equal(poker.doesHandWin(mockHand([12, 12, 6, 6, 13]), mockHand([13, 13, 4, 5, 6])), 1);
    });
    it('Beats Lower Two Pair', () => {
        assert.equal(poker.doesHandWin(mockHand([12, 12, 10, 10, 13]), mockHand([10, 10, 9, 9, 13])), 1);
        assert.equal(poker.doesHandWin(mockHand([12, 12, 10, 10, 13]), mockHand([12, 12, 9, 9, 13])), 1);
    });
    it('Kicker Plays', () => {
        assert.equal(poker.doesHandWin(mockHand([12, 12, 10, 10, 13]), mockHand([12, 12, 10, 10, 9])), 1);
    });
    it('Split Pot', () => {
        assert.equal(poker.doesHandWin(mockHand([12, 12, 10, 10, 13]), mockHand([12, 12, 10, 10, 13])), 0);
    });
});

describe('Three of Kind Winning', () => {
    it('Beats Lower Hands', () => {
        assert.equal(poker.doesHandWin(mockHand([12, 12, 12, 3, 4]), mockHand([13, 4, 5, 10, 3])), 1);
        assert.equal(poker.doesHandWin(mockHand([12, 12, 12, 3, 4]), mockHand([13, 13, 5, 10, 2])), 1);
        assert.equal(poker.doesHandWin(mockHand([12, 12, 12, 3, 4]), mockHand([13, 13, 10, 10, 3])), 1);
    });
    it('Beats Lower Three of Kinds', () => {
        assert.equal(poker.doesHandWin(mockHand([12, 12, 12, 3, 4]), mockHand([10, 10, 10, 3, 4])), 1);
    });
    it('Kicker Plays', () => {
        assert.equal(poker.doesHandWin(mockHand([12, 12, 12, 10, 9]), mockHand([12, 12, 12, 9, 8])), 1);
        assert.equal(poker.doesHandWin(mockHand([12, 12, 12, 10, 9]), mockHand([12, 12, 12, 10, 2])), 1);
    });
    it ('Split Pot', () => {
        assert.equal(poker.doesHandWin(mockHand([12, 12, 12, 10, 9]), mockHand([12, 12, 12, 10, 9])), 0);
    });
});

describe('Straight Winning', () => {
    it('Beats Lower Hands', () => {
        assert.equal(poker.doesHandWin(mockHand([3, 4, 5, 6, 7]), mockHand([13, 10, 9, 3, 4])), 1);
        assert.equal(poker.doesHandWin(mockHand([3, 4, 5, 6, 7]), mockHand([13, 13, 9, 3, 4])), 1);
        assert.equal(poker.doesHandWin(mockHand([3, 4, 5, 6, 7]), mockHand([13, 13, 9, 9, 4])), 1);
        assert.equal(poker.doesHandWin(mockHand([3, 4, 5, 6, 7]), mockHand([13, 13, 13, 9, 4])), 1);
    });
    it('Beats Lower Straights', () => {
        assert.equal(poker.doesHandWin(mockHand([5, 6, 7, 8, 9]), mockHand([3, 4, 5, 6, 7])), 1);
    });
    it('Ace is either low or high', () => {
        assert.equal(poker.doesHandWin(mockHand([13, 1, 2, 3, 4]), mockHand([1, 2, 10, 4, 5])), 1);
        assert.equal(poker.doesHandWin(mockHand([13, 1, 2, 3, 4]), mockHand([1, 2, 3, 4, 5])), -1);
        assert.equal(poker.doesHandWin(mockHand([9, 10, 11, 12, 13]), mockHand([8, 9, 10, 11, 12])), 1);
    });
    it('Split Pot', () => {
        assert.equal(poker.doesHandWin(mockHand([1, 2, 3, 4, 5]), mockHand([1, 2, 3, 4, 5])), 0);
    });
});

describe('Flush Winning', () => {
    it('Beats Lower Hands', () => {
        assert.equal(poker.doesHandWin(mockHand([13, 10, 9, 8, 3], true), mockHand([13, 10, 7, 3, 2])), 1);
        assert.equal(poker.doesHandWin(mockHand([13, 10, 9, 8, 3], true), mockHand([12, 12, 10, 7, 2])), 1);
        assert.equal(poker.doesHandWin(mockHand([13, 10, 9, 8, 3], true), mockHand([12, 12, 10, 10, 8])), 1);
        assert.equal(poker.doesHandWin(mockHand([13, 10, 9, 8, 3], true), mockHand([12, 12, 12, 8, 3])), 1);
        assert.equal(poker.doesHandWin(mockHand([13, 10, 9, 8, 3], true), mockHand([13, 12, 11, 10, 9])), 1);
    });
    it('Beats Lower Flushes', () => {
        assert.equal(poker.doesHandWin(mockHand([13, 10, 9, 8, 3], true), mockHand([12, 10, 9, 8, 3], true)), 1);
    });
    it('Split Pot', () => {
        assert.equal(poker.doesHandWin(mockHand([13, 10, 9, 8, 3], true), mockHand([13, 10, 9, 8, 3], true)), 0);
    });
});

describe('Fullhouse Winning', () => {
    it('Beats Lower Hands', () => {
        const winningHand = mockHand([12, 12, 12, 8, 8]);
        const pair = mockHand([12, 12, 8, 2, 3]);
        const twopair = mockHand([12, 12, 8, 8, 3]);
        const threekind = mockHand([8, 8, 8, 3, 1]);
        const straight = mockHand([13, 12, 11, 10, 9]);
        const flush = mockHand([10, 9, 13, 5, 3], true);
        assert.equal(poker.doesHandWin(winningHand, pair), 1);
        assert.equal(poker.doesHandWin(winningHand, twopair), 1);
        assert.equal(poker.doesHandWin(winningHand, threekind), 1);
        assert.equal(poker.doesHandWin(winningHand, straight), 1);
        assert.equal(poker.doesHandWin(winningHand, flush), 1);
    });
    it('Beats Lower FullHouses', () => {
        assert.equal(poker.doesHandWin(mockHand([13, 13, 13, 10, 10]), mockHand([12, 12, 12, 10, 10])), 1);
        assert.equal(poker.doesHandWin(mockHand([13, 13, 13, 12, 12]), mockHand([13, 13, 13, 10, 10])), 1);
    });
    it('Split Pot', () => {
        assert.equal(poker.doesHandWin(mockHand([13, 13, 13, 12, 12]), mockHand([13, 13, 13, 12, 12])), 0);
    });
});

describe('Four of Kind Winning', () => {
    it('Beats Lower Hands', () => {
        const winningHand = mockHand([12, 12, 12, 12, 8]);
        const pair = mockHand([12, 12, 8, 2, 3]);
        const twopair = mockHand([12, 12, 8, 8, 3]);
        const threekind = mockHand([8, 8, 8, 3, 1]);
        const straight = mockHand([13, 12, 11, 10, 9]);
        const flush = mockHand([10, 9, 13, 5, 3], true);
        const fullhouse = mockHand([12, 12, 12, 8, 8]);
        assert.equal(poker.doesHandWin(winningHand, pair), 1);
        assert.equal(poker.doesHandWin(winningHand, twopair), 1);
        assert.equal(poker.doesHandWin(winningHand, threekind), 1);
        assert.equal(poker.doesHandWin(winningHand, straight), 1);
        assert.equal(poker.doesHandWin(winningHand, flush), 1);
        assert.equal(poker.doesHandWin(winningHand, fullhouse), 1);
    });
    it('Beats Lower Four-of-Kinds', () => {
        assert.equal(poker.doesHandWin(mockHand([13, 13, 13, 13, 10]), mockHand([12, 12, 12, 12, 10])), 1);
        assert.equal(poker.doesHandWin(mockHand([13, 13, 13, 13, 12]), mockHand([13, 13, 13, 13, 10])), 1);
    });
    it('Split Pot', () => {
        assert.equal(poker.doesHandWin(mockHand([13, 13, 13, 13, 12]), mockHand([13, 13, 13, 13, 12])), 0);
    });
});

describe('Straight Flushes Winning', () => {
    it('Beats Lower Hands', () => {
        const winningHand = mockHand([13, 12, 11, 10, 9], true);
        const pair = mockHand([12, 12, 8, 2, 3]);
        const twopair = mockHand([12, 12, 8, 8, 3]);
        const threekind = mockHand([8, 8, 8, 3, 1]);
        const straight = mockHand([13, 12, 11, 10, 9]);
        const flush = mockHand([10, 9, 13, 5, 3], true);
        const fullhouse = mockHand([12, 12, 12, 8, 8]);
        const fourkind = mockHand([12, 12, 12, 12, 13]);
        assert.equal(poker.doesHandWin(winningHand, pair), 1);
        assert.equal(poker.doesHandWin(winningHand, twopair), 1);
        assert.equal(poker.doesHandWin(winningHand, threekind), 1);
        assert.equal(poker.doesHandWin(winningHand, straight), 1);
        assert.equal(poker.doesHandWin(winningHand, flush), 1);
        assert.equal(poker.doesHandWin(winningHand, fullhouse), 1);
        assert.equal(poker.doesHandWin(winningHand, fourkind), 1);
    });
    it('Beats lower straight flushes', () => {
        assert.equal(poker.doesHandWin(mockHand([13, 12, 11, 10, 9], true), mockHand([12, 11, 10, 9, 8], true)), 1);
    });
    it('Split Pot', () => {
        assert.equal(poker.doesHandWin(mockHand([13, 12, 11, 10, 9]), mockHand([13, 12, 11, 10, 9])), 0);
    });
});
