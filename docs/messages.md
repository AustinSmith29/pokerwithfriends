# Poker with Friends Networking Protocol

## Server Message Types

### COMMUNITYCARDS
> Server deals community cards.

**Data Constraint**
```
{
    "cards": {[string, string, ...]}
}
```

***

### HOLECARDS
> Server sends hole cards to specific player.

**Data Constraint**
```
{
    "cards": [string, string]
}

```

***

### NEWHAND
> Server starts new hand and moves the blinds.

**Data Constraint**
```
{
    "smallBlind": { position: number, amount: number },
    "bigBlind": { position: number, amount: number }
}
```

### TABLESYNC
> Server sends client information about the states of other players at the table.

**Data Constraint**
```
{
    "players": [{position: number, name: string, stack: number, status: string}]
}
```

***

### WINNER
> Returns the winner of the hand.

```
{
    winners: [{playerNameString: amount}, {winnerTwoNameString: amount2}],
}
```

***

## Client Message Types


### FOLD
> Folds the hand.

**Data Constraint**
```
none
```

***

### JOIN
> Puts a player in the poker room lobby.

**Data Constraints**
```
{
    "roomName": string
}
```

***

### LEAVE
> Disconnets a player from the poker room lobby.

**Data Constraints**
```
{
    "roomName": string,
    "player": string
}
```

***

### SIT
> Assigns a seat to a player.

**Data Constraints**
```
{
    "player": string,
    "seat": number
}
```

***

### STAND
> A player that stands will have his seat reserved but will not be dealt a hand.

**Data Constraints**
```
{
    "player": string,
}
```

***

### WAGER
> Wagers an amount. An amount of 0 is a check.

**Data Constraints**
```
{
    "amount": number
}
```

***
