const poker = require('../poker.js');
const assert = require('assert');

const Card = poker.Card;

describe('Pair Test', () => {
    it('should be true', () => {
        assert.equal(poker.isPair([Card(3, 0), Card(3, 1), Card(6, 1), Card(8, 2), Card(12, 0)]), true);
    });
    it('should be false', () => {
        assert.equal(poker.isPair([Card(3, 1), Card(3, 0), Card(4,0), Card(4, 1), Card(12, 0)]), false);
    });
});

describe('Two Pair Test', () => {
    it('should be true', () => {
        assert.equal(poker.isTwoPair([Card(3, 1), Card(3, 0), Card(4,0), Card(4, 1), Card(12, 0)]), false);
    });
});
