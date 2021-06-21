type PlayerStatus = 'LOBBY' | 'PLAYING' | 'FOLD' | 'STANDING';
export interface Player {
    socketId: string;
    name: string;
    stack: number;
    seat: number;
    hand: string[];
    status: PlayerStatus;
}

export interface SitRequest {
    name: string;
    seat: number;
    stack: number;
    socketId: string;
}

type ActionType = 'CHECK' | 'CALL' | 'FOLD' | 'BET' | 'RAISE';
export interface PlayerAction {
    type: ActionType;
    amount?: number;
}

export interface GameState {
    players: Player[];
    board: string[];
    sitRequests: SitRequest[];
    dealer: Player | undefined;
    pots: {amount: number, who: Player[]}[]; // Index 0 pot is always main pot
    bets: {player: Player, amount: number}[]; // tracks bets for single betting round
    smallBlind: { amount: number, who: Player | undefined };
    bigBlind: { amount: number, who: Player | undefined };
    whoseTurn: Player | undefined;
}
