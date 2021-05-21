import { Player, GameState, Card } from '../shared/interfaces';

export interface ServerPlayer extends Player {
    socketId: string;
    hand: Card[];
}

type GameStatus = 
    'WAITING' |
    'DEAL'    |
    'PREFLOP' |
    'FLOP'    |
    'TURN'    |
    'RIVER'   |
    'SHOWDOWN';

export interface ServerGameState extends Omit<GameState, 'players'> {
    status: GameStatus;
    players: ServerPlayer[];
    // Next two members help keep track of when to advance to next betting round.
    numTurnsCompleted: number;
    numPlayersAtRoundStart: number;
}
