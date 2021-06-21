import { GameState } from '../server/gamestate';
import { Player } from '../shared/interfaces';
import { strict as assert } from 'assert';

const players: Player[] = [
    { name: 'Austin', stack: 1000, seat: 0, hand: [], socketId: '', status: 'PLAYING' },
    { name: 'Xander', stack: 1000, seat: 1, hand: [], socketId: '', status: 'PLAYING' },
    { name: 'LobbyGuy', stack: 0, seat: -1, hand: [], socketId: '', status: 'LOBBY' },
    { name: 'StandingGuy', stack: 500, seat: 2, hand: [], socketId: '', status: 'STANDING'},
];

const mockGame = new GameState(5, 10).seatPlayer(players[0]).seatPlayer(players[1]);

describe('Game Start', () => {
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

    it('Should be somebody turn.', () => {
        assert.notEqual(newGame.state.whoseTurn, undefined);
    });
});

describe('New Hand', () => {
    it('Should have empty board', () => {
        const state = new GameState(5, 10).startNewHand();
        assert.equal(state.state.board, []);
    });
});
