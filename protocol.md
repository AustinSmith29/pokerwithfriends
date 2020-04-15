# Poker with Friends Networking Protocol
---

## Client Message Types


### WAGER
> Wagers an amount. An amount of 0 is a check.

**Data Constraints**
```
{
    "amount": number
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
