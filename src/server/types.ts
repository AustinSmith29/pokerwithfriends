import { Player, GameState } from '../shared/interfaces';

type GameStatus = 
    'WAITING' |
    'DEAL'    |
    'PREFLOP' |
    'FLOP'    |
    'TURN'    |
    'RIVER'   |
    'SHOWDOWN';

export interface ServerGameState extends GameState {
    status: GameStatus;
    deck: string[];
    // Next two members help keep track of when to advance to next betting round.
    numTurnsCompleted: number;
    numPlayersAtRoundStart: number;
}
