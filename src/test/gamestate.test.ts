import { GameState, getPlayerAtSeat, getActivePlayerAfter } from '../server/gamestate';
import { Player } from '../shared/interfaces';
import { strict as assert } from 'assert';

const players: Player[] = [
    { name: 'Austin', stack: 1000, seat: 0, hand: [], socketId: '', status: 'PLAYING' },
    { name: 'Xander', stack: 1000, seat: 1, hand: [], socketId: '', status: 'PLAYING' },
    { name: 'LobbyGuy', stack: 0, seat: -1, hand: [], socketId: '', status: 'LOBBY' },
    { name: 'StandingGuy', stack: 500, seat: 2, hand: [], socketId: '', status: 'STANDING'},
];

const SB_AMOUNT = 5;
const BB_AMOUNT = 10;
const mockGame = new GameState(SB_AMOUNT, BB_AMOUNT).seatPlayer(players[0]).seatPlayer(players[1]);

describe('Move Blinds', () => {
    // Remember that moveBlinds takes a parameter that lets us set who the dealer is.
    const newState = mockGame.moveBlinds(players[0]); 
    it('Blinds should be assigned to correct players.', () => {
        assert.equal(newState.state.smallBlind.who, players[1]);
        assert.equal(newState.state.bigBlind.who, players[0]);
    });

    it('Maintains state independence.', () => {
        assert.notEqual(newState.state.smallBlind.who, mockGame.state.smallBlind.who);
        assert.notEqual(newState.state.bigBlind.who, mockGame.state.bigBlind.who);
    });
});

describe('Collect Chips From Player', () => {
    it('Assert test preconditions.', () => {
        assert.equal(getPlayerAtSeat(0, mockGame.state.players).stack, 1000);
    });

    it('Cannot collect negative chip amounts.', () => { const newState = mockGame.collectChipsFromPlayer(players[0], -1000);
        assert.equal(getPlayerAtSeat(0, newState.state.players).stack, getPlayerAtSeat(0, mockGame.state.players).stack);
        assert.equal(newState.state.pots[0].amount, mockGame.state.pots[0].amount);
    });

    it('Amount gets removed from stack.', () => {
        const newState = mockGame.collectChipsFromPlayer(players[0], 600);
        assert.equal(getPlayerAtSeat(0, newState.state.players).stack, 400);
    });

    it('Amount gets added to pot.', () => {
        const newState = mockGame.collectChipsFromPlayer(players[0], 500);
        assert.equal(newState.state.pots[0].amount, 500);
    });

    it('Side pots get created.', () => {
        assert.fail();
    });

    it('Maintains state independence.', () => {
        const newState = mockGame.collectChipsFromPlayer(players[0], 500);
        assert.equal(getPlayerAtSeat(0, mockGame.state.players).stack, 1000);
        assert.equal(getPlayerAtSeat(0, newState.state.players).stack, 500);
        assert.notEqual(newState.state.pots[0].amount, mockGame.state.pots[0].amount);
    });
});

describe('New Hand', () => {
    const newGame = mockGame.startNewHand(players[0]);
    it('Should have dealer set.', () => {
        assert.notEqual(newGame.state.dealer, undefined);
    });

    it('Should have blinds set.', () => {
        assert.notEqual(newGame.state.smallBlind.who, undefined);
        assert.equal(newGame.state.smallBlind.amount, 5);
        assert.notEqual(newGame.state.bigBlind.who, undefined);
        assert.equal(newGame.state.bigBlind.amount, 10);
    });

    it('Should have empty board', () => {
        assert.equal(newGame.state.board.length, 0);
    });

    it('Should have blinds in pot', () => {
        const mainPot = newGame.state.pots[0];
        assert.equal(mainPot.amount, SB_AMOUNT + BB_AMOUNT);
    });

    it('Should not have side pots', () => {
        assert.equal(newGame.state.pots.length, 1);
    });

    it('Should be somebody turn.', () => {
        assert.notEqual(newGame.state.whoseTurn, undefined);
    });

    it('First to act should be player after big blind.', () => {
        assert.equal(newGame.state.whoseTurn.seat, getActivePlayerAfter(newGame.state.bigBlind.who, newGame.state.players).seat);
    });

    it('Cards should be dealt to players.', () => {
        for (const player of newGame.state.players) {
            if (player.status === 'PLAYING') {
                assert.notEqual(player.hand.length, 0);
            }
        }
        assert.notEqual(newGame.state.deck.length, 52);
    });

    it('Blinds should be considered a bet.', () => {
        assert.equal(newGame.state.bets.length, 2);
        assert.equal(newGame.state.bets[0].amount, SB_AMOUNT);
        assert.equal(newGame.state.bets[1].amount, BB_AMOUNT);
    });
});

describe('Preflop Betting Round', () => {
    const preflop = mockGame.startNewHand(players[0]);

    it('Actions should maintain state independence.', () => {
        const callState = preflop.doCall(players[1]);
        assert.notEqual(callState.state.whoseTurn, preflop.state.whoseTurn);
    });
    /*
    it('Should not be able to check when facing bet', () => {
        const checkState = preflop.doCheck(players[1]);
        assert.equal(checkState.state.whoseTurn, preflop.state.whoseTurn);
    });

    it('Should not be able to act out of turn', () => {
        const wrongPlayer = players[0];
        assert.equal(preflop.doCheck(wrongPlayer).state.whoseTurn, preflop.state.whoseTurn);
        assert.equal(preflop.doFold(wrongPlayer).state.whoseTurn, preflop.state.whoseTurn); 
        assert.equal(preflop.doCall(wrongPlayer).state.whoseTurn, preflop.state.whoseTurn);
        assert.equal(preflop.doBet(wrongPlayer, 100).state.whoseTurn, preflop.state.whoseTurn);
    });

    it('Calling causes turn to switch', () => {
        const lastBet = preflop.state.bets[preflop.state.bets.length-1];
        const callState = preflop.doCall(players[1]);
        assert.notEqual(callState.state.whoseTurn.seat, preflop.state.whoseTurn.seat);
    });

    it('Calling bets adds to pot', () => {
        const lastBet = preflop.state.bets[preflop.state.bets.length-1];
        const callState = preflop.doCall(players[1]);
        assert.equal(callState.state.pots[0].amount, preflop.state.pots[0].amount + lastBet.amount);
    });

    it('Calling bets removes from player stack', () => {
        const lastBet = preflop.state.bets[preflop.state.bets.length-1];
        const callState = preflop.doCall(players[1]);
        assert.equal(getPlayerAtSeat(1, callState.state.players).stack, getPlayerAtSeat(1, preflop.state.players).stack - lastBet.amount);
    });

    it('Cannot raise for less than the min-raise amount', () => {
        assert.fail();
    });
     */
});

