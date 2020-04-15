# Poker with Friends Networking Protocol
---

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
