# Protocols
> Message types and definitions can be found [here](./messages.md).
> State definitions for server/clients can be found [here](./states.md).

## JOINING A GAME
Client sends a `JOIN` message. Server replies with a `TABLESYNC` message.
Client is put in the `LOBBY` state.

## SITTING DOWN
Client sends a `SIT` message. Client is placed in `SIT_PENDING` state.
Server sends host player a `SIT_REQUEST` message. Host can resolve request by sending
either a `SIT_ACCEPT` or `SIT_REJECT` message to the server. If accepted, the server
adds the player to the table and forwards the `SIT_ACCEPT` message to the requesting client.
The server also broadcasts a `TABLESYNC` message.
Upon recieving the `SIT_ACCEPT` message, the client is placed in the `SEATED` state.

## BEGINNING PLAY
The server initially starts in the `WAITING` state.
Once a table has at least 2 players seated, the host player is able to send a `START_GAME`
message. This puts the server in the `NEWHAND` state and the game starts.
