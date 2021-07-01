// import * as PokerEvaluator from 'poker-evaluator-ts';
import { ServerGameState } from './types';
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

    acceptSitRequest(request: SitRequest): GameState {
        const matchingRequest = this.state.sitRequests.find(req => req.socketId === request.socketId);
        if (matchingRequest) {
            const player: Player = {
                name: request.name,
                stack: request.stack,
                seat: request.seat,
                socketId: request.socketId,
                hand: [],
                status: 'PLAYING'
            };
            const sitRequests = this.state.sitRequests.filter(req => req !== matchingRequest); 
            return this.NewState({ ...this.state, sitRequests }).seatPlayer(player);
        }
        return this;
    }

    addSitRequest(request: SitRequest) {
        return this.NewState({
            ...this.state,
            sitRequests: this.state.sitRequests.concat([request])
        });
    }

    addPlayer(player: Player) {
        return this.NewState({
            ...this.state,
            players: this.state.players.concat([player])
        });
    }

    seatPlayer(player: Player): GameState {
        if (!getPlayerAtSeat(player.seat, this.state.players)) {
            return this.NewState({ ...this.state, players: this.state.players.concat([player]) });
        }
        return this;
    }

    // In addition to normal poker game logic, this method will also be called by server 
    // to initially set who the dealer, sb, and bb are at the start of the game (when
    // dealer, sb, and bb are all undefined).
    //
    // dealerOverride is an optional parameter that explicity sets who the dealer is.
    startNewHand(dealerOverride?: Player): GameState {
        const freshState = this.resetPlayerStatuses().resetPot();
        const moveAndCollectBlinds = freshState.moveBlinds(dealerOverride).collectBlinds();
        const underTheGun = getActivePlayerAfter(moveAndCollectBlinds.state.bigBlind.who,
                                                 moveAndCollectBlinds.state.players);
        const deck = createDeck();
        return this.NewState({
            ...moveAndCollectBlinds.state,
            board: [],
            deck, 
            bets: [{player: this.state.smallBlind.who, amount: this.state.smallBlind.amount} ,{ player: this.state.bigBlind.who, amount: this.state.bigBlind.amount }],
            status: 'PREFLOP',
            whoseTurn: underTheGun,
            numTurnsCompleted: 0,
            numPlayersAtRoundStart: getNumberActivePlayers(this.state.players),
            players: this.state.players.map(player => ({...player, hand: [deck.pop(), deck.pop()]}))
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

    // dealerOverride is an optional parameter that explicity sets who the dealer is.
    moveBlinds(dealerOverride?: Player): GameState {
        if (this.state.players.length < 2) return this;

        const newDealer = (dealerOverride) ? dealerOverride : getActivePlayerAfter(this.state.dealer, this.state.players);
        const newSb = getActivePlayerAfter(newDealer, this.state.players);
        const newBb = getActivePlayerAfter(newSb, this.state.players);
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
        return this.collectChipsFromPlayer(sb.who, sb.amount)
            .collectChipsFromPlayer(bb.who, bb.amount);
    }

    collectChipsFromPlayer(player: Player, amount: number): GameState {
        if (amount <= 0) return this;
        const chips = (amount > player.stack) ? player.stack : amount;
        const pot = JSON.parse(JSON.stringify(this.state.pots[this.state.pots.length-1]));
        pot.amount += chips;
        const pots = JSON.parse(JSON.stringify(this.state.pots));
        pots.splice(this.state.pots.length-1, 1, pot);
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
        let winningPlayer: Player = undefined;
    }

    doCheck(player: Player): GameState {
        if (this.state.whoseTurn !== player) return this;

        console.log('here');
        return this.NewState({
            ...this.state,
            numTurnsCompleted: this.state.numTurnsCompleted + 1,
            whoseTurn: getActivePlayerAfter(this.state.whoseTurn, this.state.players)
        })
        .advanceRoundIfOver();
    }

    doFold(player: Player): GameState {
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
    doBet(player: Player, amount: number): GameState {
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

    doCall(player: Player): GameState {
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
            .advanceRoundIfOver();
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
        console.log(`${this.state.numTurnsCompleted} ${this.state.numPlayersAtRoundStart}`);
        if (this.state.numTurnsCompleted !== this.state.numPlayersAtRoundStart) return this;
        switch (this.state.status) {
            case 'PREFLOP':
                console.log('Deal flop');
                console.log('Deal flop');
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
function updatePlayerInList(player: Player, fn: (player: Player) => void, players: Player[]): Player[] {
    // Hack to deep copy players in one line... was having nasty reference errors.
    // Is it efficient... no. But the players array should never really exceed 10-12 (unless there is
    // a loooooooooot of spectators for a specific game.
    const copy = JSON.parse(JSON.stringify(players));
    const who = copy.find((p: Player) => player.seat === p.seat);
    fn(who);
    return copy;
}

export function getPlayerAtSeat(seat: number, players: Player[]): Player {
    return players.find(player => player.seat === seat);
}

export function getPlayerAfter(player: Player, players: Player[]): Player {
    const playerSorter = (a: Player, b: Player) => {
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


export function getActivePlayerAfter(after: Player, players: Player[]): Player {
    let nextPlayer = getPlayerAfter(after, players);
    while (nextPlayer.status !== 'PLAYING') {
        nextPlayer = getActivePlayerAfter(nextPlayer, players);
    }
    return nextPlayer;
}

function getActivePlayers(players: Player[]): Player[] {
    return players.filter(p => p.status === 'PLAYING');
}

function getNumberActivePlayers(players: Player[]): number {
    return getActivePlayers(players).length;
}

function createDeck(): string[] {
    const ranks = 'A23456789TJQK';
    const suits = 'hcds';
    const cards = [];
    for (let r = 0; r < ranks.length; r++) {
        for (let s = 0; s < suits.length; s++) {
            cards.push(ranks[r] + suits[s]);
        }
    }
    cards.sort(() => Math.random() - 0.5); // shuffle cards
    return cards;
}
