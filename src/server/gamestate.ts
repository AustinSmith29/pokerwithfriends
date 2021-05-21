import { PokerEvaluator } from 'poker-evaluator';
import { ServerGameState, ServerPlayer } from './types';
import { SitRequest, Player } from '../shared/interfaces';

/*
 * Updates to GameState returns a new instance of the class that holds the updated state.
 * All instances of GameState are therefore "snapshots" of the state at a particular moment.
 * If an intended update violates any preconditions (i.e trying to seat a player in
 * a taken seat), then the state will remained unchanged.
*/
export class GameState {
    readonly state: ServerGameState;

    constructor(sbAmount: number, bbAmount: number) {
        this.state = {
            status: 'WAITING',
            players: [],
            sitRequests: [],
            numTurnsCompleted: 0,
            numPlayersAtRoundStart: 0,
            deck: createDeck(),
            board: [],
            bets: [],
            pots: [{amount: 0, who: []}],
            dealer: undefined,
            smallBlind: { amount: sbAmount, who: undefined },
            bigBlind: { amount: bbAmount, who: undefined },
            whoseTurn: undefined,
        };
    }

    // This method violates the readonly property of state
    // in order to actually copy over the state to the new
    // instance. I could just throw a bunch of parameters to
    // the constructor of Gamestate and copy those into the new
    // state... buuut this is easier. Shhhh don't tell anyone.
    NewState(state: ServerGameState): GameState {
        const sb = this.state.smallBlind.amount;
        const bb = this.state.bigBlind.amount;
        const newState = new GameState(sb, bb);
        // @ts-ignore
        newState.state = state;
        return newState;
    }

    addSitRequest(request: SitRequest) {
        return this.NewState({
            ...this.state,
            sitRequests: this.state.sitRequests.concat([request])
        });
    }

    acceptSitRequest(request: SitRequest): GameState {
        const matchingRequest = this.state.sitRequests.find(req => req.socketId === request.socketId);
        if (matchingRequest) {
            const player: ServerPlayer = {
                name: request.name,
                stack: request.stack,
                seat: request.seat,
                socketId: request.socketId,
                hand: [],
                status: 'PLAYING'
            };
            const sitRequests = this.state.sitRequests.filter(req => req === matchingRequest); 
            return this.NewState({ ...this.state, sitRequests }).seatPlayer(player);
        }
        return this;
    }

    seatPlayer(player: ServerPlayer): GameState {
        if (!getPlayerAtSeat(player.seat, this.state.players)) {
            return this.NewState({ ...this.state, players: this.state.players.concat([player]) });
        }
        return this;
    }

    startNewHand(): GameState {
        const freshState = this.resetPlayerStatuses().resetPot();
        const moveAndCollectBlinds = freshState.moveBlinds().collectBlinds();
        const underTheGun = getPlayerAfter(moveAndCollectBlinds.state.bigBlind.who,
                                           moveAndCollectBlinds.state.players);
        return this.NewState({
            ...moveAndCollectBlinds.state,
            board: [],
            deck: [], //TODO: Switch over to that poker solver shit
            status: 'PREFLOP',
            whoseTurn: underTheGun,
            numTurnsCompleted: 0,
            numPlayersAtRoundStart: getNumberActivePlayers(this.state.players)
        });
    }

    resetPlayerStatuses(): GameState {
        return this.NewState({
            ...this.state,
            players: this.state.players.map(p => (p.status === 'FOLD') ? {...p, status: 'PLAYING'} : p)
        });
    }

    resetPot(): GameState {
        return this.NewState({
            ...this.state,
            pots: [{amount: 0, who: getActivePlayers(this.state.players)}]
        });
    }

    moveBlinds(): GameState {
        if (this.state.players.length < 2) return this;

        const newDealer = getPlayerAfter(this.state.dealer, this.state.players);
        const newSb = getPlayerAfter(newDealer, this.state.players);
        const newBb = getPlayerAfter(newSb, this.state.players);
        return this.NewState({
            ...this.state,
            dealer: newDealer,
            smallBlind: { ...this.state.smallBlind, who: newSb },
            bigBlind: { ...this.state.bigBlind, who: newBb }
        });
    }

    collectBlinds(): GameState {
        const sb = this.state.smallBlind;
        const bb = this.state.bigBlind;
        if (!sb.who || !bb.who) return this;
        // Because blinds.who are type Player, and collectChipsFromPlayer expects type ServerPlayer (to allow
        // access to his hand), we have to get a ServerPlayer via getPlayerAtSeat.
        return this.collectChipsFromPlayer(getPlayerAtSeat(sb.who.seat, this.state.players), sb.amount)
            .collectChipsFromPlayer(getPlayerAtSeat(bb.who.seat, this.state.players),  bb.amount);
    }

    collectChipsFromPlayer(player: ServerPlayer, amount: number): GameState {
        if (amount <= 0) return this;
        const chips = (amount > player.stack) ? amount : player.stack;
        const pot = this.state.pots[this.state.pots.length-1];
        pot.amount += chips;
        const pots = [...this.state.pots].splice(-1, 0, pot);
        return this.NewState({ 
            ...this.state,
            pots,
            players: updatePlayerInList(player, (who) => who.stack -= chips, this.state.players)
        });
    }

    dealFlop(): GameState {
        if (this.state.status !== 'PREFLOP') return this;
        const deck = [...this.state.deck];
        const flop = [deck.pop(), deck.pop(), deck.pop()];
        return this.NewState({
            ...this.state,
            status: 'FLOP',
            board: flop,
            bets: [],
            deck,
            numTurnsCompleted: 0,
            numPlayersAtRoundStart: getNumberActivePlayers(this.state.players)
        });
    }

    dealTurn(): GameState {
        if (this.state.status !== 'FLOP') return this;
        const deck = [...this.state.deck];
        const turn = [deck.pop()];
        return this.NewState({
            ...this.state,
            status: 'TURN',
            bets: [],
            board: this.state.board.concat(turn),
            deck,
            numTurnsCompleted: 0,
            numPlayersAtRoundStart: getNumberActivePlayers(this.state.players)
        });
    }

    dealRiver(): GameState {
        if (this.state.status !== 'TURN') return this;
        const deck = [...this.state.deck];
        const river = [deck.pop()];
        return this.NewState({
            ...this.state,
            status: 'RIVER',
            board: this.state.board.concat(river),
            bets: [],
            deck,
            numTurnsCompleted: 0,
            numPlayersAtRoundStart: getNumberActivePlayers(this.state.players)
        });
    }

    showdown() {
        if (this.state.status !== 'RIVER') return this;
        let winningPlayer: ServerPlayer = undefined;
    }

    doCheck(player: ServerPlayer): GameState {
        //TODO: Check if checking is valid action to player
        if (this.state.whoseTurn !== player) return this;

        return this.NewState({
            ...this.state,
            numTurnsCompleted: this.state.numTurnsCompleted + 1,
            whoseTurn: getActivePlayerAfter(this.state.whoseTurn, this.state.players)
        })
        .advanceRoundIfOver();
    }

    doFold(player: ServerPlayer): GameState {
        if (this.state.whoseTurn !== player) return this;

        return this.NewState({
            ...this.state,
            pots: this.state.pots.map(pot => ({ ...pot, who: pot.who.filter(p => p !== player) }) ),
            players: updatePlayerInList(player, (p) => {p.hand = []; p.status = 'FOLD'; }, this.state.players),
            numTurnsCompleted: this.state.numTurnsCompleted + 1,
            whoseTurn: getActivePlayerAfter(this.state.whoseTurn, this.state.players)
        })
        .advanceRoundIfOver();
    }

    // Also handles raises since they are very similar
    doBet(player: ServerPlayer, amount: number): GameState {
        if (this.state.whoseTurn !== player) return this;
        if (amount < this.state.smallBlind.amount) return this;    

        const bets = this.state.bets;
        if (bets.length && amount < bets[bets.length - 1].amount * 2) return this; // Raises must be 2x last bet
        return this.NewState({
            ...this.state,
            bets: this.state.bets.concat([{player, amount}]),
            numTurnsCompleted: this.state.numTurnsCompleted + 1,
            whoseTurn: getActivePlayerAfter(this.state.whoseTurn, this.state.players),
        })
        // TODO: Add incrementPlayer method (to avoid numTurnsCompleted and whoseTurn duplication
        .collectChipsFromPlayer(player, amount)
        .advanceRoundIfOver();
    }

    doCall(player: ServerPlayer): GameState {
        if (this.state.whoseTurn !== player) return this;

        const bets = this.state.bets;
        if (!bets.length) return this;
        const lastBet = bets[bets.length-1];
        if (player.stack < lastBet.amount) {
            const newSidePot = {amount: lastBet.amount - player.stack, who: this.state.players.filter(p => p !== player)};
            return this.NewState({
                ...this.state,
                pots: this.state.pots.concat([newSidePot]),
                numTurnsCompleted: this.state.numTurnsCompleted + 1,
                whoseTurn: getActivePlayerAfter(this.state.whoseTurn, this.state.players),
            })
            .collectChipsFromPlayer(player, player.stack);
        }
        else {
            return this.NewState({
                ...this.state,
                numTurnsCompleted: this.state.numTurnsCompleted + 1,
                whoseTurn: getActivePlayerAfter(this.state.whoseTurn, this.state.players),
            })
            .collectChipsFromPlayer(player, lastBet.amount);
        }
    }

    advanceRoundIfOver() {
        if (this.state.numTurnsCompleted !== this.state.numPlayersAtRoundStart) return this;
        switch (this.state.status) {
            case 'PREFLOP':
                return this.dealFlop();
            case 'FLOP':
                return this.dealTurn();
            case 'TURN':
                return this.dealRiver();
            case 'RIVER':
                return this.showdown();
        }
    }
}

// Updates the player in players by running function and returns new list of players with updated state.
function updatePlayerInList(player: ServerPlayer, fn: (player: ServerPlayer) => void, players: ServerPlayer[]): ServerPlayer[] {
    // TODO: I strongly suspect there may be weird reference issues with this... figure out how/if I need to solve it
    const copy = [...players];
    const who = copy.find(p => player === p);
    fn(who);
    return copy;
}

function getPlayerAtSeat(seat: number, players: ServerPlayer[]): ServerPlayer {
    return players.find(player => player.seat === seat);
}

function getPlayerAfter(player: Player, players: ServerPlayer[]): ServerPlayer {
    const playerSorter = (a: ServerPlayer, b: ServerPlayer) => {
        if (a.seat < b.seat) {
            return -1;
        }
        if (a.seat > b.seat) {
            return 1;
        }
        return 0;
    };
    // The player after the subject should be in the next taken seat.
    const playersInSeatOrder = players.sort(playerSorter);
    const subjectIndex = playersInSeatOrder.findIndex(p => p === player);
    const nextPlayer = playersInSeatOrder[(subjectIndex + 1) % playersInSeatOrder.length];
    return nextPlayer;
}


function getActivePlayerAfter(after: Player, players: ServerPlayer[]): ServerPlayer {
    let nextPlayer = getPlayerAfter(after, players);
    while (nextPlayer.status !== 'PLAYING') {
        nextPlayer = getActivePlayerAfter(nextPlayer, players);
    }
    return nextPlayer;
}

function getActivePlayers(players: ServerPlayer[]): ServerPlayer[] {
    return players.filter(p => p.status === 'PLAYING');
}

function getNumberActivePlayers(players: ServerPlayer[]): number {
    return getActivePlayers(players).length;
}

function createDeck() {
    throw new Error('Not implemented');
}
