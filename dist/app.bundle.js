/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"app": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([0,"vendors"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {const express = __webpack_require__(/*! express */ "./node_modules/express/index.js");
const app = express();
const http = __webpack_require__(/*! http */ "./node_modules/stream-http/index.js").createServer(app);
const io = __webpack_require__(/*! socket.io */ "./node_modules/socket.io/lib/index.js")(http);
const url = __webpack_require__(/*! url */ "./node_modules/url/url.js");
const poker = __webpack_require__(/*! ./server.js */ "./server.js");

const hostname = '0.0.0.0';
const port = 3000;

app.use('/scripts/socket.io', express.static(__dirname + '/node_modules/socket.io-client/dist/'));
app.use('/scripts/phaser', express.static(__dirname + '/node_modules/phaser/dist/'));
app.use('/scripts', express.static(__dirname + '/scripts/'));
app.use('/assets', express.static(__dirname + '/assets/'));
app.use(express.urlencoded({extended: true}));

const gameTable = new poker.GameTable();

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', function(req, res) {
    const {gameType, roomName, action, ...rest} = req.body;
    if (action === 'create') {
        console.log('Creating Game.');
        const game = poker.createGame(gameType, rest);
        gameTable.addGameSession(roomName, game);
        const {hostName, stack} = rest;
        const player = poker.Player(hostName, stack, 0, undefined, 'SEATED');
        game.setHost(player);
    }
    res.redirect(url.format({
        pathname: '/game',
        query: {
            roomName: roomName,
        }
    }));
});

app.get('/game', function(req, res) {
    if (!req.query || !req.query.roomName) {
        res.redirect('/');
    }
    res.sendFile(__dirname + '/game.html');
});

const nsp = io.of('/game');
nsp.on('connection', function(socket) {
    socket.on('JOIN', function(msg) {
        const game = gameTable.getGame(msg.roomName);
        socket.join(msg.roomName);
        if (game.host.socketId) {
            console.log('Player has joined lobby.');
            game.addWatcher(socket.id);
        } else {
            console.log('Host has joined');
            game.bindHost(socket.id);
        }

        socket.emit('TABLESYNC', game.state);
        io.of('/game').emit('TABLESYNC', game.state);
        console.log('Broacast state');
    });

    socket.on('SIT', function(request) {
        console.log('Sit request!');
        const game = gameTable.getGame(request.roomName);
        console.log(`Sending request to host ${game.host.name} with socketId ${game.host.socketId}`);
        socket.to(game.host.socketId).emit('SIT_REQUEST', request);
    });

    socket.on('SIT_REQUEST', function(request) {
        console.log(`Received sit request with data ${request}`);
        const game = gameTable.getGame(request.roomName);
        game.addSitRequest(socket.id, request);
        io.of('/game').emit('TABLESYNC', game.state);
    });

    socket.on('SIT_ACCEPT', function(request) {
        const game = gameTable.getGame(request.roomName);
        const sitRequest = game.state.sitRequests.find(req => req.socketId === request.socketId);
        if (!sitRequest) {
            console.log(`Error. Recieved request from ${request.socketId}`);
            return;
        }
        game.seatPlayer(poker.Player(sitRequest.name, sitRequest.stack, sitRequest.seat, request.socketId, status='PLAYING'));
        game.state.sitRequests = game.state.sitRequests.filter(req => req.socketId !== request.socketId);
        console.log(game.state);
        io.of('/game').emit('TABLESYNC', game.state);
    });

    socket.on('DEAL_HAND', function(request) {
        console.log('Dealing new hand.');
        const game = gameTable.getGame(request.roomName);
        game.state.status = poker.State.NEWHAND;
        console.log(`DEAL_HAND Request from ${socket.id}`);
        console.log(io.of('/game'));
        game.shuffleDeck();
        for (const player of game.state.players) {
            const hand = game.takeNCards(2);
            console.log(`Delt hand ${hand} to player with id ${player.socketId}.`);
            io.of('/game').connected[player.socketId].emit('NEWHAND', {hand});
        }
        io.of('/game').emit('TABLESYNC', game.state);
    });
});

http.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

/* WEBPACK VAR INJECTION */}.call(this, "/"))

/***/ }),

/***/ "./node_modules/engine.io/lib sync recursive":
/*!*****************************************!*\
  !*** ./node_modules/engine.io/lib sync ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "./node_modules/engine.io/lib sync recursive";

/***/ }),

/***/ "./node_modules/express/lib sync recursive":
/*!***************************************!*\
  !*** ./node_modules/express/lib sync ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "./node_modules/express/lib sync recursive";

/***/ }),

/***/ "./node_modules/socket.io/lib sync recursive":
/*!*****************************************!*\
  !*** ./node_modules/socket.io/lib sync ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "./node_modules/socket.io/lib sync recursive";

/***/ }),

/***/ "./node_modules/webpack/hot sync ^\\.\\/log$":
/*!*************************************************!*\
  !*** (webpack)/hot sync nonrecursive ^\.\/log$ ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./log": "./node_modules/webpack/hot/log.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./node_modules/webpack/hot sync ^\\.\\/log$";

/***/ }),

/***/ "./poker.js":
/*!******************!*\
  !*** ./poker.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports) {

const Card = (r, s) => ({rank: r, suit: s});

const HandRankings = Object.freeze({
    HIGH: 0,
    PAIR: 1,
    TWO_PAIR: 2,
    THREE_OF_KIND: 3,
    STRAIGHT: 4,
    FLUSH: 5,
    FULL_HOUSE: 6,
    FOUR_OF_KIND: 7,
    STRAIGHT_FLUSH: 8
});

const Ranks = Object.freeze({
    TWO: 1,
    JACK: 10,
    QUEEN: 11,
    KING: 12,
    ACE: 13
});

const getHighCard = (hand) => Math.max(...hand.map(card => card.rank));
const getCards = (hand, n) => {
    hand.sort((a,b) => b.rank - a.rank);
    return hand.splice(0, n+1);
};

const count = (elem, arry) => {
    let count = 0;
    for (const item of arry) {
        if (item === elem) {
            count++;
        }
    }
    return count;
};

/* Returns the element that occurs n times in array. */
const occurs = (n, arry) => {
    let counts = new Map();
    for (const elem of arry) {
        const count = counts.get(elem);
        if (count) {
            counts.set(elem, count+1);
        }
        else {
            counts.set(elem, 1);
        }
    }
    for (const [key, value] of counts.entries()) {
        if (value === n) {
            return key;
        }
    }
    return undefined;
};

/* Removes all instances of element from the array. */
const remove = (elem, array) => array.filter(e => e != elem);

const handRanks = (hand) => hand.map(card => card.rank);
const handSuits = (hand) => hand.map(card => card.suit);

/* These tests must be applied to hand in decreasing order of strength i.e straight flushes 
 * before four of kind... etc. This is because each function checks for only minimum viability. 
 * For example, isThreeOfKind will return true if it is passed a Full House because it detects 
 * three of the same cards.
*/
const isPair = (hand) => count(2, handRanks(hand).map(card => count(card, handRanks(hand)))) === 2; 
const isTwoPair = (hand) => count(2, handRanks(hand).map(card => count(card, handRanks(hand)))) === 4;
const isThreeOfKind = (hand) => Math.max(...handRanks(hand).map(card => count(card, handRanks(hand)))) === 3;
const isStraight = (hand) => {
    const ranks = handRanks(hand);
    if (ranks.find(rank => rank === Ranks.ACE)) {
        // We need to determine if the ace is low or high.
        // If a king is in the hand then it has to be treated as a 13 to make a straight.
        const isKingInHand = ranks.includes(Ranks.KING);
        let aceValue = (isKingInHand) ? Ranks.ACE : 0;
        ranks[ranks.indexOf(Ranks.ACE)] = aceValue;
    }
    ranks.sort((a,b) => a - b); 
    for (let i = 0; i < 4; i++) {
        if (ranks[i] !== ranks[i+1] - 1) {
            return false;
        }
    }
    hand.sort((a, b) => a.rank - b.rank);
    return true;
};
const isFlush = (hand) => count(hand[0].suit, handSuits(hand)) === 5;
const isFullHouse = (hand) => isPair(hand) && isThreeOfKind(hand);
const isFourOfKind = (hand) => Math.max(...handRanks(hand).map(card => count(card, handRanks(hand)))) === 4;
const isStraightFlush = (hand) => isStraight(hand) && isFlush(hand);

// TYPE, STRENGTH, TIEBREAKER?
// HIGH, K 
// PAIR, 2, A
// TWOPAIR, 8J, A
// THREE OF KIND, 8, K
// STRAIGHT, 9 
// FLUSH, J
// FULLHOUSE, 10,K
// FOUR KIND, 3, A
// STRAIGHTFLUSH, A
const handStrength = (hand) => {
    if (isStraightFlush(hand)) {
        return { type: HandRankings.STRAIGHT_FLUSH, strength: getHighCard(hand) };
    }
    else if (isFourOfKind(hand)) {
        return { type: HandRankings.FOUR_OF_KIND, strength: occurs(4, handRanks(hand)), tiebreak: occurs(1, handRanks(hand)) };
    }
    else if (isFullHouse(hand)) {
        return { type: HandRankings.FULL_HOUSE, strength: occurs(3, handRanks(hand)), tiebreak: occurs(2, handRanks(hand)) };
    }
    else if (isFlush(hand)) {
        return { type: HandRankings.FLUSH, strength: getHighCard(hand) };
    }
    else if (isStraight(hand)) { 
        const isKingInHand = handRanks(hand).includes(Ranks.KING);
        const isAceInHand = handRanks(hand).includes(Ranks.ACE);
        const aceValue = (isKingInHand) ? Ranks.ACE : 0;
        const highCard = (getHighCard(hand) === Ranks.ACE) ? aceValue : getHighCard(hand);
        return { 
            type: HandRankings.STRAIGHT, 
            strength: highCard 
        };
    }
    else if (isThreeOfKind(hand)) {
        return { type: HandRankings.THREE_OF_KIND, strength: occurs(3, handRanks(hand)), tiebreak: getCards(remove(occurs(3, handRanks(hand)), handRanks(hand)), 2) };
    }
    else if (isTwoPair(hand)) {
        const pair1 = occurs(2, handRanks(hand));
        const pair2 = occurs(2, remove(pair1, handRanks(hand)));
        const bigPair = Math.max(pair1, pair2);
        const smallPair = Math.min(pair1, pair2);
        return { 
            type: HandRankings.TWO_PAIR, 
            strength: [bigPair, smallPair], 
            tiebreak: occurs(1, handRanks(hand)) 
        };
    }
    else if (isPair(hand)) {
        return { type: HandRankings.PAIR, strength: occurs(2, handRanks(hand)), tiebreak: getCards(remove(occurs(2, handRanks(hand)), handRanks(hand)), 3) };
    }
    else {
        return { type: HandRankings.HIGH, strength: getHighCard(hand), tiebreak: getCards(remove(getHighCard(hand), handRanks(hand)), 4) };
    }
};

const comparator = (a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) {
        a.sort((a,b) => b - a);
        b.sort((a,b) => b - a);
        for (let i = 0; i < b.length; i++) {
            if (a[i] > b[i]) {
                return 1;
            }
            else if (a[i] < b[i]) {
                return -1;
            }
        }
        return 0;
    }
    if (a > b) {
        return 1;
    }
    else if (a < b) {
        return -1;
    }
    else {
        return 0;
    }
};

exports.doesHandWin = (a, b) => {
    const aHandStrength = handStrength(a);
    const bHandStrength = handStrength(b);
    const type = comparator(aHandStrength.type, bHandStrength.type);
    const strength = comparator(aHandStrength.strength, bHandStrength.strength);
    const tiebreaker = comparator(aHandStrength.tiebreak, bHandStrength.tiebreak);

    if (type === 0) {
        if (strength === 0) {
            return tiebreaker;
        }
        return strength;
    }
    return type;
};

const createDeck = () => {
    const deck = [];
    for (let rank = Ranks.TWO; rank <= Ranks.ACE; rank++) {
        for (let suit = 0; suit < 4; suit++) {
            deck.push(Card(rank, suit));
        }
    }
    return deck;
};

exports.isPair = isPair;
exports.isTwoPair = isTwoPair;
exports.isThreeOfKind = isThreeOfKind;
exports.isStraight = isStraight;
exports.isFlush = isFlush;
exports.isFullHouse = isFullHouse;
exports.isFourOfKind = isFourOfKind;
exports.isStraightFlush = isStraightFlush;
exports.Card = Card;
exports.createDeck = createDeck;


/***/ }),

/***/ "./server.js":
/*!*******************!*\
  !*** ./server.js ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const poker = __webpack_require__(/*! ./poker.js */ "./poker.js");

const Player = (name, stack, seat, socketId, status='LOBBY') => {
    return {
        name: name,
        stack: stack,
        seat: seat,
        hand: [],
        status: status,
        socketId: socketId
    };
};

const State = Object.freeze({
    WAITING: 0,
    NEWHAND: 1,
    DEAL: 2,
    PREFLOP: 3,
    FLOP: 4,
    TURN: 5,
    RIVER: 6,
    SHOWDOWN: 7
});

class CashGame {
    constructor({smallBlind, bigBlind, startingStack, password}) {
        this.smallBlind = smallBlind;
        this.bigBlind = bigBlind;
        this.state = {
            players: [],
            lobby: [],
            sitRequests: [],
            deck: [],
            board: [],
            blinds: [],
            status: State.WAITING
       };
        this.host = undefined;
        this.password = password;
    }

    addWatcher(socketId) {
        this.state.lobby.push(socketId);
    }

    addSitRequest(socketId, sitRequest) {
        this.state.sitRequests.push({socketId, ...sitRequest});
    }

    setHost(player) {
        this.host = player;
    }

    bindHost(socketId) {
        this.host.socketId = socketId;
        this.state.players.push({...this.host});
    }

    seatPlayer(player) {
       this.state.players.push(player);
    }

    shuffleDeck() {
        console.log('Shuffling Deck');
        this.deck = poker.createDeck();
    }

    takeNCards(n) {
        const cards = [];
        for (let i = 0; i < n; i++) {
            const card = this.deck.pop();
            console.log(`Card ${card.rank} ${card.suit}`);
            cards.push(card);    
        }
        return cards;
    }
}

class TournamentGame {
    constructor({numPlayers, duration}) {
        this.numPlayers = numPlayers;
        this.duration = duration;
    }
}

class GameTable {
    constructor() {
        this.games = new Map();
    }

    addGameSession(roomName, game) {
        if (this.games.has(roomName)) {
            return null;
        }
        this.games.set(roomName, game);
    }

    removeGameSession(roomName) {
        this.games.delete(roomName);
    }

    getGame(roomName) {
        if (this.games.has(roomName)) {
            const game = this.games.get(roomName);
            return game;
        }
    }
}

function createGame(gameType, params) {
    switch(gameType) {
        case 'cash':
            return new CashGame(params);
        case 'tournament':
            return new TournamentGame(params);
        default:
            error('Unknown Game!');
    }
}

exports.createGame = createGame;
exports.GameTable = GameTable;
exports.Player = Player;
exports.State = State;


/***/ }),

/***/ 0:
/*!**************************************************************************!*\
  !*** multi (webpack)-dev-server/client?http://localhost:8081 ./index.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! /home/austin/dev/pokerwithfriends/node_modules/webpack-dev-server/client/index.js?http://localhost:8081 */"./node_modules/webpack-dev-server/client/index.js?http://localhost:8081");
module.exports = __webpack_require__(/*! ./index.js */"./index.js");


/***/ }),

/***/ 10:
/*!************************!*\
  !*** crypto (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 11:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 12:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 13:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 2:
/*!***************************!*\
  !*** ./streams (ignored) ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 3:
/*!*******************************!*\
  !*** ./extend-node (ignored) ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 4:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 5:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 6:
/*!**********************!*\
  !*** http (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 7:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 8:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 9:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VuZ2luZS5pby9saWIgc3luYyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZXhwcmVzcy9saWIgc3luYyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc29ja2V0LmlvL2xpYiBzeW5jIiwid2VicGFjazovLy8od2VicGFjaykvaG90IHN5bmMgbm9ucmVjdXJzaXZlIF5cXC5cXC9sb2ckIiwid2VicGFjazovLy8uL3Bva2VyLmpzIiwid2VicGFjazovLy8uL3NlcnZlci5qcyIsIndlYnBhY2s6Ly8vY3J5cHRvIChpZ25vcmVkKSIsIndlYnBhY2s6Ly8vdXRpbCAoaWdub3JlZCk/MTA5ZSIsIndlYnBhY2s6Ly8vdXRpbCAoaWdub3JlZCk/NWZlNSIsIndlYnBhY2s6Ly8vYnVmZmVyIChpZ25vcmVkKT9iMTg4Iiwid2VicGFjazovLy8uL3N0cmVhbXMgKGlnbm9yZWQpIiwid2VicGFjazovLy8uL2V4dGVuZC1ub2RlIChpZ25vcmVkKSIsIndlYnBhY2s6Ly8vdXRpbCAoaWdub3JlZCkiLCJ3ZWJwYWNrOi8vL3V0aWwgKGlnbm9yZWQpPzZhYzAiLCJ3ZWJwYWNrOi8vL2h0dHAgKGlnbm9yZWQpIiwid2VicGFjazovLy91dGlsIChpZ25vcmVkKT84NTgyIiwid2VicGFjazovLy91dGlsIChpZ25vcmVkKT8wZjViIiwid2VicGFjazovLy9idWZmZXIgKGlnbm9yZWQpIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLFFBQVEsb0JBQW9CO1FBQzVCO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFD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QTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzSEEsZTs7Ozs7Ozs7Ozs7QUNBQSxlOzs7Ozs7Ozs7OztBQ0FBLGU7Ozs7Ozs7Ozs7O0FDQUEsZTs7Ozs7Ozs7Ozs7QUNBQSxlOzs7Ozs7Ozs7OztBQ0FBLGU7Ozs7Ozs7Ozs7O0FDQUEsZTs7Ozs7Ozs7Ozs7QUNBQSxlOzs7Ozs7Ozs7OztBQ0FBLGU7Ozs7Ozs7Ozs7O0FDQUEsZTs7Ozs7Ozs7Ozs7QUNBQSxlOzs7Ozs7Ozs7OztBQ0FBLGUiLCJmaWxlIjoiYXBwLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xuIFx0ZnVuY3Rpb24gd2VicGFja0pzb25wQ2FsbGJhY2soZGF0YSkge1xuIFx0XHR2YXIgY2h1bmtJZHMgPSBkYXRhWzBdO1xuIFx0XHR2YXIgbW9yZU1vZHVsZXMgPSBkYXRhWzFdO1xuIFx0XHR2YXIgZXhlY3V0ZU1vZHVsZXMgPSBkYXRhWzJdO1xuXG4gXHRcdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuIFx0XHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcbiBcdFx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMCwgcmVzb2x2ZXMgPSBbXTtcbiBcdFx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG4gXHRcdFx0XHRyZXNvbHZlcy5wdXNoKGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSk7XG4gXHRcdFx0fVxuIFx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG4gXHRcdH1cbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdH1cbiBcdFx0fVxuIFx0XHRpZihwYXJlbnRKc29ucEZ1bmN0aW9uKSBwYXJlbnRKc29ucEZ1bmN0aW9uKGRhdGEpO1xuXG4gXHRcdHdoaWxlKHJlc29sdmVzLmxlbmd0aCkge1xuIFx0XHRcdHJlc29sdmVzLnNoaWZ0KCkoKTtcbiBcdFx0fVxuXG4gXHRcdC8vIGFkZCBlbnRyeSBtb2R1bGVzIGZyb20gbG9hZGVkIGNodW5rIHRvIGRlZmVycmVkIGxpc3RcbiBcdFx0ZGVmZXJyZWRNb2R1bGVzLnB1c2guYXBwbHkoZGVmZXJyZWRNb2R1bGVzLCBleGVjdXRlTW9kdWxlcyB8fCBbXSk7XG5cbiBcdFx0Ly8gcnVuIGRlZmVycmVkIG1vZHVsZXMgd2hlbiBhbGwgY2h1bmtzIHJlYWR5XG4gXHRcdHJldHVybiBjaGVja0RlZmVycmVkTW9kdWxlcygpO1xuIFx0fTtcbiBcdGZ1bmN0aW9uIGNoZWNrRGVmZXJyZWRNb2R1bGVzKCkge1xuIFx0XHR2YXIgcmVzdWx0O1xuIFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0dmFyIGRlZmVycmVkTW9kdWxlID0gZGVmZXJyZWRNb2R1bGVzW2ldO1xuIFx0XHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuIFx0XHRcdGZvcih2YXIgaiA9IDE7IGogPCBkZWZlcnJlZE1vZHVsZS5sZW5ndGg7IGorKykge1xuIFx0XHRcdFx0dmFyIGRlcElkID0gZGVmZXJyZWRNb2R1bGVbal07XG4gXHRcdFx0XHRpZihpbnN0YWxsZWRDaHVua3NbZGVwSWRdICE9PSAwKSBmdWxmaWxsZWQgPSBmYWxzZTtcbiBcdFx0XHR9XG4gXHRcdFx0aWYoZnVsZmlsbGVkKSB7XG4gXHRcdFx0XHRkZWZlcnJlZE1vZHVsZXMuc3BsaWNlKGktLSwgMSk7XG4gXHRcdFx0XHRyZXN1bHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IGRlZmVycmVkTW9kdWxlWzBdKTtcbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHRyZXR1cm4gcmVzdWx0O1xuIFx0fVxuXG4gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuIFx0Ly8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4gXHQvLyBQcm9taXNlID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxuIFx0dmFyIGluc3RhbGxlZENodW5rcyA9IHtcbiBcdFx0XCJhcHBcIjogMFxuIFx0fTtcblxuIFx0dmFyIGRlZmVycmVkTW9kdWxlcyA9IFtdO1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHR2YXIganNvbnBBcnJheSA9IHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXSA9IHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXSB8fCBbXTtcbiBcdHZhciBvbGRKc29ucEZ1bmN0aW9uID0ganNvbnBBcnJheS5wdXNoLmJpbmQoanNvbnBBcnJheSk7XG4gXHRqc29ucEFycmF5LnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjaztcbiBcdGpzb25wQXJyYXkgPSBqc29ucEFycmF5LnNsaWNlKCk7XG4gXHRmb3IodmFyIGkgPSAwOyBpIDwganNvbnBBcnJheS5sZW5ndGg7IGkrKykgd2VicGFja0pzb25wQ2FsbGJhY2soanNvbnBBcnJheVtpXSk7XG4gXHR2YXIgcGFyZW50SnNvbnBGdW5jdGlvbiA9IG9sZEpzb25wRnVuY3Rpb247XG5cblxuIFx0Ly8gYWRkIGVudHJ5IG1vZHVsZSB0byBkZWZlcnJlZCBsaXN0XG4gXHRkZWZlcnJlZE1vZHVsZXMucHVzaChbMCxcInZlbmRvcnNcIl0pO1xuIFx0Ly8gcnVuIGRlZmVycmVkIG1vZHVsZXMgd2hlbiByZWFkeVxuIFx0cmV0dXJuIGNoZWNrRGVmZXJyZWRNb2R1bGVzKCk7XG4iLCJjb25zdCBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xuY29uc3QgYXBwID0gZXhwcmVzcygpO1xuY29uc3QgaHR0cCA9IHJlcXVpcmUoJ2h0dHAnKS5jcmVhdGVTZXJ2ZXIoYXBwKTtcbmNvbnN0IGlvID0gcmVxdWlyZSgnc29ja2V0LmlvJykoaHR0cCk7XG5jb25zdCB1cmwgPSByZXF1aXJlKCd1cmwnKTtcbmNvbnN0IHBva2VyID0gcmVxdWlyZSgnLi9zZXJ2ZXIuanMnKTtcblxuY29uc3QgaG9zdG5hbWUgPSAnMC4wLjAuMCc7XG5jb25zdCBwb3J0ID0gMzAwMDtcblxuYXBwLnVzZSgnL3NjcmlwdHMvc29ja2V0LmlvJywgZXhwcmVzcy5zdGF0aWMoX19kaXJuYW1lICsgJy9ub2RlX21vZHVsZXMvc29ja2V0LmlvLWNsaWVudC9kaXN0LycpKTtcbmFwcC51c2UoJy9zY3JpcHRzL3BoYXNlcicsIGV4cHJlc3Muc3RhdGljKF9fZGlybmFtZSArICcvbm9kZV9tb2R1bGVzL3BoYXNlci9kaXN0LycpKTtcbmFwcC51c2UoJy9zY3JpcHRzJywgZXhwcmVzcy5zdGF0aWMoX19kaXJuYW1lICsgJy9zY3JpcHRzLycpKTtcbmFwcC51c2UoJy9hc3NldHMnLCBleHByZXNzLnN0YXRpYyhfX2Rpcm5hbWUgKyAnL2Fzc2V0cy8nKSk7XG5hcHAudXNlKGV4cHJlc3MudXJsZW5jb2RlZCh7ZXh0ZW5kZWQ6IHRydWV9KSk7XG5cbmNvbnN0IGdhbWVUYWJsZSA9IG5ldyBwb2tlci5HYW1lVGFibGUoKTtcblxuYXBwLmdldCgnLycsIGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgcmVzLnNlbmRGaWxlKF9fZGlybmFtZSArICcvaW5kZXguaHRtbCcpO1xufSk7XG5cbmFwcC5wb3N0KCcvJywgZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICBjb25zdCB7Z2FtZVR5cGUsIHJvb21OYW1lLCBhY3Rpb24sIC4uLnJlc3R9ID0gcmVxLmJvZHk7XG4gICAgaWYgKGFjdGlvbiA9PT0gJ2NyZWF0ZScpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0NyZWF0aW5nIEdhbWUuJyk7XG4gICAgICAgIGNvbnN0IGdhbWUgPSBwb2tlci5jcmVhdGVHYW1lKGdhbWVUeXBlLCByZXN0KTtcbiAgICAgICAgZ2FtZVRhYmxlLmFkZEdhbWVTZXNzaW9uKHJvb21OYW1lLCBnYW1lKTtcbiAgICAgICAgY29uc3Qge2hvc3ROYW1lLCBzdGFja30gPSByZXN0O1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSBwb2tlci5QbGF5ZXIoaG9zdE5hbWUsIHN0YWNrLCAwLCB1bmRlZmluZWQsICdTRUFURUQnKTtcbiAgICAgICAgZ2FtZS5zZXRIb3N0KHBsYXllcik7XG4gICAgfVxuICAgIHJlcy5yZWRpcmVjdCh1cmwuZm9ybWF0KHtcbiAgICAgICAgcGF0aG5hbWU6ICcvZ2FtZScsXG4gICAgICAgIHF1ZXJ5OiB7XG4gICAgICAgICAgICByb29tTmFtZTogcm9vbU5hbWUsXG4gICAgICAgIH1cbiAgICB9KSk7XG59KTtcblxuYXBwLmdldCgnL2dhbWUnLCBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgIGlmICghcmVxLnF1ZXJ5IHx8ICFyZXEucXVlcnkucm9vbU5hbWUpIHtcbiAgICAgICAgcmVzLnJlZGlyZWN0KCcvJyk7XG4gICAgfVxuICAgIHJlcy5zZW5kRmlsZShfX2Rpcm5hbWUgKyAnL2dhbWUuaHRtbCcpO1xufSk7XG5cbmNvbnN0IG5zcCA9IGlvLm9mKCcvZ2FtZScpO1xubnNwLm9uKCdjb25uZWN0aW9uJywgZnVuY3Rpb24oc29ja2V0KSB7XG4gICAgc29ja2V0Lm9uKCdKT0lOJywgZnVuY3Rpb24obXNnKSB7XG4gICAgICAgIGNvbnN0IGdhbWUgPSBnYW1lVGFibGUuZ2V0R2FtZShtc2cucm9vbU5hbWUpO1xuICAgICAgICBzb2NrZXQuam9pbihtc2cucm9vbU5hbWUpO1xuICAgICAgICBpZiAoZ2FtZS5ob3N0LnNvY2tldElkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUGxheWVyIGhhcyBqb2luZWQgbG9iYnkuJyk7XG4gICAgICAgICAgICBnYW1lLmFkZFdhdGNoZXIoc29ja2V0LmlkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdIb3N0IGhhcyBqb2luZWQnKTtcbiAgICAgICAgICAgIGdhbWUuYmluZEhvc3Qoc29ja2V0LmlkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNvY2tldC5lbWl0KCdUQUJMRVNZTkMnLCBnYW1lLnN0YXRlKTtcbiAgICAgICAgaW8ub2YoJy9nYW1lJykuZW1pdCgnVEFCTEVTWU5DJywgZ2FtZS5zdGF0ZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdCcm9hY2FzdCBzdGF0ZScpO1xuICAgIH0pO1xuXG4gICAgc29ja2V0Lm9uKCdTSVQnLCBmdW5jdGlvbihyZXF1ZXN0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdTaXQgcmVxdWVzdCEnKTtcbiAgICAgICAgY29uc3QgZ2FtZSA9IGdhbWVUYWJsZS5nZXRHYW1lKHJlcXVlc3Qucm9vbU5hbWUpO1xuICAgICAgICBjb25zb2xlLmxvZyhgU2VuZGluZyByZXF1ZXN0IHRvIGhvc3QgJHtnYW1lLmhvc3QubmFtZX0gd2l0aCBzb2NrZXRJZCAke2dhbWUuaG9zdC5zb2NrZXRJZH1gKTtcbiAgICAgICAgc29ja2V0LnRvKGdhbWUuaG9zdC5zb2NrZXRJZCkuZW1pdCgnU0lUX1JFUVVFU1QnLCByZXF1ZXN0KTtcbiAgICB9KTtcblxuICAgIHNvY2tldC5vbignU0lUX1JFUVVFU1QnLCBmdW5jdGlvbihyZXF1ZXN0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBSZWNlaXZlZCBzaXQgcmVxdWVzdCB3aXRoIGRhdGEgJHtyZXF1ZXN0fWApO1xuICAgICAgICBjb25zdCBnYW1lID0gZ2FtZVRhYmxlLmdldEdhbWUocmVxdWVzdC5yb29tTmFtZSk7XG4gICAgICAgIGdhbWUuYWRkU2l0UmVxdWVzdChzb2NrZXQuaWQsIHJlcXVlc3QpO1xuICAgICAgICBpby5vZignL2dhbWUnKS5lbWl0KCdUQUJMRVNZTkMnLCBnYW1lLnN0YXRlKTtcbiAgICB9KTtcblxuICAgIHNvY2tldC5vbignU0lUX0FDQ0VQVCcsIGZ1bmN0aW9uKHJlcXVlc3QpIHtcbiAgICAgICAgY29uc3QgZ2FtZSA9IGdhbWVUYWJsZS5nZXRHYW1lKHJlcXVlc3Qucm9vbU5hbWUpO1xuICAgICAgICBjb25zdCBzaXRSZXF1ZXN0ID0gZ2FtZS5zdGF0ZS5zaXRSZXF1ZXN0cy5maW5kKHJlcSA9PiByZXEuc29ja2V0SWQgPT09IHJlcXVlc3Quc29ja2V0SWQpO1xuICAgICAgICBpZiAoIXNpdFJlcXVlc3QpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBFcnJvci4gUmVjaWV2ZWQgcmVxdWVzdCBmcm9tICR7cmVxdWVzdC5zb2NrZXRJZH1gKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBnYW1lLnNlYXRQbGF5ZXIocG9rZXIuUGxheWVyKHNpdFJlcXVlc3QubmFtZSwgc2l0UmVxdWVzdC5zdGFjaywgc2l0UmVxdWVzdC5zZWF0LCByZXF1ZXN0LnNvY2tldElkLCBzdGF0dXM9J1BMQVlJTkcnKSk7XG4gICAgICAgIGdhbWUuc3RhdGUuc2l0UmVxdWVzdHMgPSBnYW1lLnN0YXRlLnNpdFJlcXVlc3RzLmZpbHRlcihyZXEgPT4gcmVxLnNvY2tldElkICE9PSByZXF1ZXN0LnNvY2tldElkKTtcbiAgICAgICAgY29uc29sZS5sb2coZ2FtZS5zdGF0ZSk7XG4gICAgICAgIGlvLm9mKCcvZ2FtZScpLmVtaXQoJ1RBQkxFU1lOQycsIGdhbWUuc3RhdGUpO1xuICAgIH0pO1xuXG4gICAgc29ja2V0Lm9uKCdERUFMX0hBTkQnLCBmdW5jdGlvbihyZXF1ZXN0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdEZWFsaW5nIG5ldyBoYW5kLicpO1xuICAgICAgICBjb25zdCBnYW1lID0gZ2FtZVRhYmxlLmdldEdhbWUocmVxdWVzdC5yb29tTmFtZSk7XG4gICAgICAgIGdhbWUuc3RhdGUuc3RhdHVzID0gcG9rZXIuU3RhdGUuTkVXSEFORDtcbiAgICAgICAgY29uc29sZS5sb2coYERFQUxfSEFORCBSZXF1ZXN0IGZyb20gJHtzb2NrZXQuaWR9YCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGlvLm9mKCcvZ2FtZScpKTtcbiAgICAgICAgZ2FtZS5zaHVmZmxlRGVjaygpO1xuICAgICAgICBmb3IgKGNvbnN0IHBsYXllciBvZiBnYW1lLnN0YXRlLnBsYXllcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGhhbmQgPSBnYW1lLnRha2VOQ2FyZHMoMik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgRGVsdCBoYW5kICR7aGFuZH0gdG8gcGxheWVyIHdpdGggaWQgJHtwbGF5ZXIuc29ja2V0SWR9LmApO1xuICAgICAgICAgICAgaW8ub2YoJy9nYW1lJykuY29ubmVjdGVkW3BsYXllci5zb2NrZXRJZF0uZW1pdCgnTkVXSEFORCcsIHtoYW5kfSk7XG4gICAgICAgIH1cbiAgICAgICAgaW8ub2YoJy9nYW1lJykuZW1pdCgnVEFCTEVTWU5DJywgZ2FtZS5zdGF0ZSk7XG4gICAgfSk7XG59KTtcblxuaHR0cC5saXN0ZW4ocG9ydCwgaG9zdG5hbWUsICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhgU2VydmVyIHJ1bm5pbmcgYXQgaHR0cDovLyR7aG9zdG5hbWV9OiR7cG9ydH0vYCk7XG59KTtcbiIsImZ1bmN0aW9uIHdlYnBhY2tFbXB0eUNvbnRleHQocmVxKSB7XG5cdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIHJlcSArIFwiJ1wiKTtcblx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHR0aHJvdyBlO1xufVxud2VicGFja0VtcHR5Q29udGV4dC5rZXlzID0gZnVuY3Rpb24oKSB7IHJldHVybiBbXTsgfTtcbndlYnBhY2tFbXB0eUNvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tFbXB0eUNvbnRleHQ7XG5tb2R1bGUuZXhwb3J0cyA9IHdlYnBhY2tFbXB0eUNvbnRleHQ7XG53ZWJwYWNrRW1wdHlDb250ZXh0LmlkID0gXCIuL25vZGVfbW9kdWxlcy9lbmdpbmUuaW8vbGliIHN5bmMgcmVjdXJzaXZlXCI7IiwiZnVuY3Rpb24gd2VicGFja0VtcHR5Q29udGV4dChyZXEpIHtcblx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInXCIpO1xuXHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdHRocm93IGU7XG59XG53ZWJwYWNrRW1wdHlDb250ZXh0LmtleXMgPSBmdW5jdGlvbigpIHsgcmV0dXJuIFtdOyB9O1xud2VicGFja0VtcHR5Q29udGV4dC5yZXNvbHZlID0gd2VicGFja0VtcHR5Q29udGV4dDtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0VtcHR5Q29udGV4dDtcbndlYnBhY2tFbXB0eUNvbnRleHQuaWQgPSBcIi4vbm9kZV9tb2R1bGVzL2V4cHJlc3MvbGliIHN5bmMgcmVjdXJzaXZlXCI7IiwiZnVuY3Rpb24gd2VicGFja0VtcHR5Q29udGV4dChyZXEpIHtcblx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInXCIpO1xuXHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdHRocm93IGU7XG59XG53ZWJwYWNrRW1wdHlDb250ZXh0LmtleXMgPSBmdW5jdGlvbigpIHsgcmV0dXJuIFtdOyB9O1xud2VicGFja0VtcHR5Q29udGV4dC5yZXNvbHZlID0gd2VicGFja0VtcHR5Q29udGV4dDtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0VtcHR5Q29udGV4dDtcbndlYnBhY2tFbXB0eUNvbnRleHQuaWQgPSBcIi4vbm9kZV9tb2R1bGVzL3NvY2tldC5pby9saWIgc3luYyByZWN1cnNpdmVcIjsiLCJ2YXIgbWFwID0ge1xuXHRcIi4vbG9nXCI6IFwiLi9ub2RlX21vZHVsZXMvd2VicGFjay9ob3QvbG9nLmpzXCJcbn07XG5cblxuZnVuY3Rpb24gd2VicGFja0NvbnRleHQocmVxKSB7XG5cdHZhciBpZCA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpO1xuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhpZCk7XG59XG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKSB7XG5cdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8obWFwLCByZXEpKSB7XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdHJldHVybiBtYXBbcmVxXTtcbn1cbndlYnBhY2tDb250ZXh0LmtleXMgPSBmdW5jdGlvbiB3ZWJwYWNrQ29udGV4dEtleXMoKSB7XG5cdHJldHVybiBPYmplY3Qua2V5cyhtYXApO1xufTtcbndlYnBhY2tDb250ZXh0LnJlc29sdmUgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmU7XG5tb2R1bGUuZXhwb3J0cyA9IHdlYnBhY2tDb250ZXh0O1xud2VicGFja0NvbnRleHQuaWQgPSBcIi4vbm9kZV9tb2R1bGVzL3dlYnBhY2svaG90IHN5bmMgXlxcXFwuXFxcXC9sb2ckXCI7IiwiY29uc3QgQ2FyZCA9IChyLCBzKSA9PiAoe3Jhbms6IHIsIHN1aXQ6IHN9KTtcblxuY29uc3QgSGFuZFJhbmtpbmdzID0gT2JqZWN0LmZyZWV6ZSh7XG4gICAgSElHSDogMCxcbiAgICBQQUlSOiAxLFxuICAgIFRXT19QQUlSOiAyLFxuICAgIFRIUkVFX09GX0tJTkQ6IDMsXG4gICAgU1RSQUlHSFQ6IDQsXG4gICAgRkxVU0g6IDUsXG4gICAgRlVMTF9IT1VTRTogNixcbiAgICBGT1VSX09GX0tJTkQ6IDcsXG4gICAgU1RSQUlHSFRfRkxVU0g6IDhcbn0pO1xuXG5jb25zdCBSYW5rcyA9IE9iamVjdC5mcmVlemUoe1xuICAgIFRXTzogMSxcbiAgICBKQUNLOiAxMCxcbiAgICBRVUVFTjogMTEsXG4gICAgS0lORzogMTIsXG4gICAgQUNFOiAxM1xufSk7XG5cbmNvbnN0IGdldEhpZ2hDYXJkID0gKGhhbmQpID0+IE1hdGgubWF4KC4uLmhhbmQubWFwKGNhcmQgPT4gY2FyZC5yYW5rKSk7XG5jb25zdCBnZXRDYXJkcyA9IChoYW5kLCBuKSA9PiB7XG4gICAgaGFuZC5zb3J0KChhLGIpID0+IGIucmFuayAtIGEucmFuayk7XG4gICAgcmV0dXJuIGhhbmQuc3BsaWNlKDAsIG4rMSk7XG59O1xuXG5jb25zdCBjb3VudCA9IChlbGVtLCBhcnJ5KSA9PiB7XG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgYXJyeSkge1xuICAgICAgICBpZiAoaXRlbSA9PT0gZWxlbSkge1xuICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY291bnQ7XG59O1xuXG4vKiBSZXR1cm5zIHRoZSBlbGVtZW50IHRoYXQgb2NjdXJzIG4gdGltZXMgaW4gYXJyYXkuICovXG5jb25zdCBvY2N1cnMgPSAobiwgYXJyeSkgPT4ge1xuICAgIGxldCBjb3VudHMgPSBuZXcgTWFwKCk7XG4gICAgZm9yIChjb25zdCBlbGVtIG9mIGFycnkpIHtcbiAgICAgICAgY29uc3QgY291bnQgPSBjb3VudHMuZ2V0KGVsZW0pO1xuICAgICAgICBpZiAoY291bnQpIHtcbiAgICAgICAgICAgIGNvdW50cy5zZXQoZWxlbSwgY291bnQrMSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb3VudHMuc2V0KGVsZW0sIDEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIGNvdW50cy5lbnRyaWVzKCkpIHtcbiAgICAgICAgaWYgKHZhbHVlID09PSBuKSB7XG4gICAgICAgICAgICByZXR1cm4ga2V5O1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG4vKiBSZW1vdmVzIGFsbCBpbnN0YW5jZXMgb2YgZWxlbWVudCBmcm9tIHRoZSBhcnJheS4gKi9cbmNvbnN0IHJlbW92ZSA9IChlbGVtLCBhcnJheSkgPT4gYXJyYXkuZmlsdGVyKGUgPT4gZSAhPSBlbGVtKTtcblxuY29uc3QgaGFuZFJhbmtzID0gKGhhbmQpID0+IGhhbmQubWFwKGNhcmQgPT4gY2FyZC5yYW5rKTtcbmNvbnN0IGhhbmRTdWl0cyA9IChoYW5kKSA9PiBoYW5kLm1hcChjYXJkID0+IGNhcmQuc3VpdCk7XG5cbi8qIFRoZXNlIHRlc3RzIG11c3QgYmUgYXBwbGllZCB0byBoYW5kIGluIGRlY3JlYXNpbmcgb3JkZXIgb2Ygc3RyZW5ndGggaS5lIHN0cmFpZ2h0IGZsdXNoZXMgXG4gKiBiZWZvcmUgZm91ciBvZiBraW5kLi4uIGV0Yy4gVGhpcyBpcyBiZWNhdXNlIGVhY2ggZnVuY3Rpb24gY2hlY2tzIGZvciBvbmx5IG1pbmltdW0gdmlhYmlsaXR5LiBcbiAqIEZvciBleGFtcGxlLCBpc1RocmVlT2ZLaW5kIHdpbGwgcmV0dXJuIHRydWUgaWYgaXQgaXMgcGFzc2VkIGEgRnVsbCBIb3VzZSBiZWNhdXNlIGl0IGRldGVjdHMgXG4gKiB0aHJlZSBvZiB0aGUgc2FtZSBjYXJkcy5cbiovXG5jb25zdCBpc1BhaXIgPSAoaGFuZCkgPT4gY291bnQoMiwgaGFuZFJhbmtzKGhhbmQpLm1hcChjYXJkID0+IGNvdW50KGNhcmQsIGhhbmRSYW5rcyhoYW5kKSkpKSA9PT0gMjsgXG5jb25zdCBpc1R3b1BhaXIgPSAoaGFuZCkgPT4gY291bnQoMiwgaGFuZFJhbmtzKGhhbmQpLm1hcChjYXJkID0+IGNvdW50KGNhcmQsIGhhbmRSYW5rcyhoYW5kKSkpKSA9PT0gNDtcbmNvbnN0IGlzVGhyZWVPZktpbmQgPSAoaGFuZCkgPT4gTWF0aC5tYXgoLi4uaGFuZFJhbmtzKGhhbmQpLm1hcChjYXJkID0+IGNvdW50KGNhcmQsIGhhbmRSYW5rcyhoYW5kKSkpKSA9PT0gMztcbmNvbnN0IGlzU3RyYWlnaHQgPSAoaGFuZCkgPT4ge1xuICAgIGNvbnN0IHJhbmtzID0gaGFuZFJhbmtzKGhhbmQpO1xuICAgIGlmIChyYW5rcy5maW5kKHJhbmsgPT4gcmFuayA9PT0gUmFua3MuQUNFKSkge1xuICAgICAgICAvLyBXZSBuZWVkIHRvIGRldGVybWluZSBpZiB0aGUgYWNlIGlzIGxvdyBvciBoaWdoLlxuICAgICAgICAvLyBJZiBhIGtpbmcgaXMgaW4gdGhlIGhhbmQgdGhlbiBpdCBoYXMgdG8gYmUgdHJlYXRlZCBhcyBhIDEzIHRvIG1ha2UgYSBzdHJhaWdodC5cbiAgICAgICAgY29uc3QgaXNLaW5nSW5IYW5kID0gcmFua3MuaW5jbHVkZXMoUmFua3MuS0lORyk7XG4gICAgICAgIGxldCBhY2VWYWx1ZSA9IChpc0tpbmdJbkhhbmQpID8gUmFua3MuQUNFIDogMDtcbiAgICAgICAgcmFua3NbcmFua3MuaW5kZXhPZihSYW5rcy5BQ0UpXSA9IGFjZVZhbHVlO1xuICAgIH1cbiAgICByYW5rcy5zb3J0KChhLGIpID0+IGEgLSBiKTsgXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgaWYgKHJhbmtzW2ldICE9PSByYW5rc1tpKzFdIC0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGhhbmQuc29ydCgoYSwgYikgPT4gYS5yYW5rIC0gYi5yYW5rKTtcbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5jb25zdCBpc0ZsdXNoID0gKGhhbmQpID0+IGNvdW50KGhhbmRbMF0uc3VpdCwgaGFuZFN1aXRzKGhhbmQpKSA9PT0gNTtcbmNvbnN0IGlzRnVsbEhvdXNlID0gKGhhbmQpID0+IGlzUGFpcihoYW5kKSAmJiBpc1RocmVlT2ZLaW5kKGhhbmQpO1xuY29uc3QgaXNGb3VyT2ZLaW5kID0gKGhhbmQpID0+IE1hdGgubWF4KC4uLmhhbmRSYW5rcyhoYW5kKS5tYXAoY2FyZCA9PiBjb3VudChjYXJkLCBoYW5kUmFua3MoaGFuZCkpKSkgPT09IDQ7XG5jb25zdCBpc1N0cmFpZ2h0Rmx1c2ggPSAoaGFuZCkgPT4gaXNTdHJhaWdodChoYW5kKSAmJiBpc0ZsdXNoKGhhbmQpO1xuXG4vLyBUWVBFLCBTVFJFTkdUSCwgVElFQlJFQUtFUj9cbi8vIEhJR0gsIEsgXG4vLyBQQUlSLCAyLCBBXG4vLyBUV09QQUlSLCA4SiwgQVxuLy8gVEhSRUUgT0YgS0lORCwgOCwgS1xuLy8gU1RSQUlHSFQsIDkgXG4vLyBGTFVTSCwgSlxuLy8gRlVMTEhPVVNFLCAxMCxLXG4vLyBGT1VSIEtJTkQsIDMsIEFcbi8vIFNUUkFJR0hURkxVU0gsIEFcbmNvbnN0IGhhbmRTdHJlbmd0aCA9IChoYW5kKSA9PiB7XG4gICAgaWYgKGlzU3RyYWlnaHRGbHVzaChoYW5kKSkge1xuICAgICAgICByZXR1cm4geyB0eXBlOiBIYW5kUmFua2luZ3MuU1RSQUlHSFRfRkxVU0gsIHN0cmVuZ3RoOiBnZXRIaWdoQ2FyZChoYW5kKSB9O1xuICAgIH1cbiAgICBlbHNlIGlmIChpc0ZvdXJPZktpbmQoaGFuZCkpIHtcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogSGFuZFJhbmtpbmdzLkZPVVJfT0ZfS0lORCwgc3RyZW5ndGg6IG9jY3Vycyg0LCBoYW5kUmFua3MoaGFuZCkpLCB0aWVicmVhazogb2NjdXJzKDEsIGhhbmRSYW5rcyhoYW5kKSkgfTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNGdWxsSG91c2UoaGFuZCkpIHtcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogSGFuZFJhbmtpbmdzLkZVTExfSE9VU0UsIHN0cmVuZ3RoOiBvY2N1cnMoMywgaGFuZFJhbmtzKGhhbmQpKSwgdGllYnJlYWs6IG9jY3VycygyLCBoYW5kUmFua3MoaGFuZCkpIH07XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzRmx1c2goaGFuZCkpIHtcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogSGFuZFJhbmtpbmdzLkZMVVNILCBzdHJlbmd0aDogZ2V0SGlnaENhcmQoaGFuZCkgfTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNTdHJhaWdodChoYW5kKSkgeyBcbiAgICAgICAgY29uc3QgaXNLaW5nSW5IYW5kID0gaGFuZFJhbmtzKGhhbmQpLmluY2x1ZGVzKFJhbmtzLktJTkcpO1xuICAgICAgICBjb25zdCBpc0FjZUluSGFuZCA9IGhhbmRSYW5rcyhoYW5kKS5pbmNsdWRlcyhSYW5rcy5BQ0UpO1xuICAgICAgICBjb25zdCBhY2VWYWx1ZSA9IChpc0tpbmdJbkhhbmQpID8gUmFua3MuQUNFIDogMDtcbiAgICAgICAgY29uc3QgaGlnaENhcmQgPSAoZ2V0SGlnaENhcmQoaGFuZCkgPT09IFJhbmtzLkFDRSkgPyBhY2VWYWx1ZSA6IGdldEhpZ2hDYXJkKGhhbmQpO1xuICAgICAgICByZXR1cm4geyBcbiAgICAgICAgICAgIHR5cGU6IEhhbmRSYW5raW5ncy5TVFJBSUdIVCwgXG4gICAgICAgICAgICBzdHJlbmd0aDogaGlnaENhcmQgXG4gICAgICAgIH07XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzVGhyZWVPZktpbmQoaGFuZCkpIHtcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogSGFuZFJhbmtpbmdzLlRIUkVFX09GX0tJTkQsIHN0cmVuZ3RoOiBvY2N1cnMoMywgaGFuZFJhbmtzKGhhbmQpKSwgdGllYnJlYWs6IGdldENhcmRzKHJlbW92ZShvY2N1cnMoMywgaGFuZFJhbmtzKGhhbmQpKSwgaGFuZFJhbmtzKGhhbmQpKSwgMikgfTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNUd29QYWlyKGhhbmQpKSB7XG4gICAgICAgIGNvbnN0IHBhaXIxID0gb2NjdXJzKDIsIGhhbmRSYW5rcyhoYW5kKSk7XG4gICAgICAgIGNvbnN0IHBhaXIyID0gb2NjdXJzKDIsIHJlbW92ZShwYWlyMSwgaGFuZFJhbmtzKGhhbmQpKSk7XG4gICAgICAgIGNvbnN0IGJpZ1BhaXIgPSBNYXRoLm1heChwYWlyMSwgcGFpcjIpO1xuICAgICAgICBjb25zdCBzbWFsbFBhaXIgPSBNYXRoLm1pbihwYWlyMSwgcGFpcjIpO1xuICAgICAgICByZXR1cm4geyBcbiAgICAgICAgICAgIHR5cGU6IEhhbmRSYW5raW5ncy5UV09fUEFJUiwgXG4gICAgICAgICAgICBzdHJlbmd0aDogW2JpZ1BhaXIsIHNtYWxsUGFpcl0sIFxuICAgICAgICAgICAgdGllYnJlYWs6IG9jY3VycygxLCBoYW5kUmFua3MoaGFuZCkpIFxuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlIGlmIChpc1BhaXIoaGFuZCkpIHtcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogSGFuZFJhbmtpbmdzLlBBSVIsIHN0cmVuZ3RoOiBvY2N1cnMoMiwgaGFuZFJhbmtzKGhhbmQpKSwgdGllYnJlYWs6IGdldENhcmRzKHJlbW92ZShvY2N1cnMoMiwgaGFuZFJhbmtzKGhhbmQpKSwgaGFuZFJhbmtzKGhhbmQpKSwgMykgfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB7IHR5cGU6IEhhbmRSYW5raW5ncy5ISUdILCBzdHJlbmd0aDogZ2V0SGlnaENhcmQoaGFuZCksIHRpZWJyZWFrOiBnZXRDYXJkcyhyZW1vdmUoZ2V0SGlnaENhcmQoaGFuZCksIGhhbmRSYW5rcyhoYW5kKSksIDQpIH07XG4gICAgfVxufTtcblxuY29uc3QgY29tcGFyYXRvciA9IChhLCBiKSA9PiB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYSkgJiYgQXJyYXkuaXNBcnJheShiKSkge1xuICAgICAgICBhLnNvcnQoKGEsYikgPT4gYiAtIGEpO1xuICAgICAgICBiLnNvcnQoKGEsYikgPT4gYiAtIGEpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChhW2ldID4gYltpXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoYVtpXSA8IGJbaV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIGlmIChhID4gYikge1xuICAgICAgICByZXR1cm4gMTtcbiAgICB9XG4gICAgZWxzZSBpZiAoYSA8IGIpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxufTtcblxuZXhwb3J0cy5kb2VzSGFuZFdpbiA9IChhLCBiKSA9PiB7XG4gICAgY29uc3QgYUhhbmRTdHJlbmd0aCA9IGhhbmRTdHJlbmd0aChhKTtcbiAgICBjb25zdCBiSGFuZFN0cmVuZ3RoID0gaGFuZFN0cmVuZ3RoKGIpO1xuICAgIGNvbnN0IHR5cGUgPSBjb21wYXJhdG9yKGFIYW5kU3RyZW5ndGgudHlwZSwgYkhhbmRTdHJlbmd0aC50eXBlKTtcbiAgICBjb25zdCBzdHJlbmd0aCA9IGNvbXBhcmF0b3IoYUhhbmRTdHJlbmd0aC5zdHJlbmd0aCwgYkhhbmRTdHJlbmd0aC5zdHJlbmd0aCk7XG4gICAgY29uc3QgdGllYnJlYWtlciA9IGNvbXBhcmF0b3IoYUhhbmRTdHJlbmd0aC50aWVicmVhaywgYkhhbmRTdHJlbmd0aC50aWVicmVhayk7XG5cbiAgICBpZiAodHlwZSA9PT0gMCkge1xuICAgICAgICBpZiAoc3RyZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aWVicmVha2VyO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdHJlbmd0aDtcbiAgICB9XG4gICAgcmV0dXJuIHR5cGU7XG59O1xuXG5jb25zdCBjcmVhdGVEZWNrID0gKCkgPT4ge1xuICAgIGNvbnN0IGRlY2sgPSBbXTtcbiAgICBmb3IgKGxldCByYW5rID0gUmFua3MuVFdPOyByYW5rIDw9IFJhbmtzLkFDRTsgcmFuaysrKSB7XG4gICAgICAgIGZvciAobGV0IHN1aXQgPSAwOyBzdWl0IDwgNDsgc3VpdCsrKSB7XG4gICAgICAgICAgICBkZWNrLnB1c2goQ2FyZChyYW5rLCBzdWl0KSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRlY2s7XG59O1xuXG5leHBvcnRzLmlzUGFpciA9IGlzUGFpcjtcbmV4cG9ydHMuaXNUd29QYWlyID0gaXNUd29QYWlyO1xuZXhwb3J0cy5pc1RocmVlT2ZLaW5kID0gaXNUaHJlZU9mS2luZDtcbmV4cG9ydHMuaXNTdHJhaWdodCA9IGlzU3RyYWlnaHQ7XG5leHBvcnRzLmlzRmx1c2ggPSBpc0ZsdXNoO1xuZXhwb3J0cy5pc0Z1bGxIb3VzZSA9IGlzRnVsbEhvdXNlO1xuZXhwb3J0cy5pc0ZvdXJPZktpbmQgPSBpc0ZvdXJPZktpbmQ7XG5leHBvcnRzLmlzU3RyYWlnaHRGbHVzaCA9IGlzU3RyYWlnaHRGbHVzaDtcbmV4cG9ydHMuQ2FyZCA9IENhcmQ7XG5leHBvcnRzLmNyZWF0ZURlY2sgPSBjcmVhdGVEZWNrO1xuIiwiY29uc3QgcG9rZXIgPSByZXF1aXJlKCcuL3Bva2VyLmpzJyk7XG5cbmNvbnN0IFBsYXllciA9IChuYW1lLCBzdGFjaywgc2VhdCwgc29ja2V0SWQsIHN0YXR1cz0nTE9CQlknKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgc3RhY2s6IHN0YWNrLFxuICAgICAgICBzZWF0OiBzZWF0LFxuICAgICAgICBoYW5kOiBbXSxcbiAgICAgICAgc3RhdHVzOiBzdGF0dXMsXG4gICAgICAgIHNvY2tldElkOiBzb2NrZXRJZFxuICAgIH07XG59O1xuXG5jb25zdCBTdGF0ZSA9IE9iamVjdC5mcmVlemUoe1xuICAgIFdBSVRJTkc6IDAsXG4gICAgTkVXSEFORDogMSxcbiAgICBERUFMOiAyLFxuICAgIFBSRUZMT1A6IDMsXG4gICAgRkxPUDogNCxcbiAgICBUVVJOOiA1LFxuICAgIFJJVkVSOiA2LFxuICAgIFNIT1dET1dOOiA3XG59KTtcblxuY2xhc3MgQ2FzaEdhbWUge1xuICAgIGNvbnN0cnVjdG9yKHtzbWFsbEJsaW5kLCBiaWdCbGluZCwgc3RhcnRpbmdTdGFjaywgcGFzc3dvcmR9KSB7XG4gICAgICAgIHRoaXMuc21hbGxCbGluZCA9IHNtYWxsQmxpbmQ7XG4gICAgICAgIHRoaXMuYmlnQmxpbmQgPSBiaWdCbGluZDtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIHBsYXllcnM6IFtdLFxuICAgICAgICAgICAgbG9iYnk6IFtdLFxuICAgICAgICAgICAgc2l0UmVxdWVzdHM6IFtdLFxuICAgICAgICAgICAgZGVjazogW10sXG4gICAgICAgICAgICBib2FyZDogW10sXG4gICAgICAgICAgICBibGluZHM6IFtdLFxuICAgICAgICAgICAgc3RhdHVzOiBTdGF0ZS5XQUlUSU5HXG4gICAgICAgfTtcbiAgICAgICAgdGhpcy5ob3N0ID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLnBhc3N3b3JkID0gcGFzc3dvcmQ7XG4gICAgfVxuXG4gICAgYWRkV2F0Y2hlcihzb2NrZXRJZCkge1xuICAgICAgICB0aGlzLnN0YXRlLmxvYmJ5LnB1c2goc29ja2V0SWQpO1xuICAgIH1cblxuICAgIGFkZFNpdFJlcXVlc3Qoc29ja2V0SWQsIHNpdFJlcXVlc3QpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5zaXRSZXF1ZXN0cy5wdXNoKHtzb2NrZXRJZCwgLi4uc2l0UmVxdWVzdH0pO1xuICAgIH1cblxuICAgIHNldEhvc3QocGxheWVyKSB7XG4gICAgICAgIHRoaXMuaG9zdCA9IHBsYXllcjtcbiAgICB9XG5cbiAgICBiaW5kSG9zdChzb2NrZXRJZCkge1xuICAgICAgICB0aGlzLmhvc3Quc29ja2V0SWQgPSBzb2NrZXRJZDtcbiAgICAgICAgdGhpcy5zdGF0ZS5wbGF5ZXJzLnB1c2goey4uLnRoaXMuaG9zdH0pO1xuICAgIH1cblxuICAgIHNlYXRQbGF5ZXIocGxheWVyKSB7XG4gICAgICAgdGhpcy5zdGF0ZS5wbGF5ZXJzLnB1c2gocGxheWVyKTtcbiAgICB9XG5cbiAgICBzaHVmZmxlRGVjaygpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1NodWZmbGluZyBEZWNrJyk7XG4gICAgICAgIHRoaXMuZGVjayA9IHBva2VyLmNyZWF0ZURlY2soKTtcbiAgICB9XG5cbiAgICB0YWtlTkNhcmRzKG4pIHtcbiAgICAgICAgY29uc3QgY2FyZHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGNhcmQgPSB0aGlzLmRlY2sucG9wKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgQ2FyZCAke2NhcmQucmFua30gJHtjYXJkLnN1aXR9YCk7XG4gICAgICAgICAgICBjYXJkcy5wdXNoKGNhcmQpOyAgICBcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2FyZHM7XG4gICAgfVxufVxuXG5jbGFzcyBUb3VybmFtZW50R2FtZSB7XG4gICAgY29uc3RydWN0b3Ioe251bVBsYXllcnMsIGR1cmF0aW9ufSkge1xuICAgICAgICB0aGlzLm51bVBsYXllcnMgPSBudW1QbGF5ZXJzO1xuICAgICAgICB0aGlzLmR1cmF0aW9uID0gZHVyYXRpb247XG4gICAgfVxufVxuXG5jbGFzcyBHYW1lVGFibGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmdhbWVzID0gbmV3IE1hcCgpO1xuICAgIH1cblxuICAgIGFkZEdhbWVTZXNzaW9uKHJvb21OYW1lLCBnYW1lKSB7XG4gICAgICAgIGlmICh0aGlzLmdhbWVzLmhhcyhyb29tTmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2FtZXMuc2V0KHJvb21OYW1lLCBnYW1lKTtcbiAgICB9XG5cbiAgICByZW1vdmVHYW1lU2Vzc2lvbihyb29tTmFtZSkge1xuICAgICAgICB0aGlzLmdhbWVzLmRlbGV0ZShyb29tTmFtZSk7XG4gICAgfVxuXG4gICAgZ2V0R2FtZShyb29tTmFtZSkge1xuICAgICAgICBpZiAodGhpcy5nYW1lcy5oYXMocm9vbU5hbWUpKSB7XG4gICAgICAgICAgICBjb25zdCBnYW1lID0gdGhpcy5nYW1lcy5nZXQocm9vbU5hbWUpO1xuICAgICAgICAgICAgcmV0dXJuIGdhbWU7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUdhbWUoZ2FtZVR5cGUsIHBhcmFtcykge1xuICAgIHN3aXRjaChnYW1lVHlwZSkge1xuICAgICAgICBjYXNlICdjYXNoJzpcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ2FzaEdhbWUocGFyYW1zKTtcbiAgICAgICAgY2FzZSAndG91cm5hbWVudCc6XG4gICAgICAgICAgICByZXR1cm4gbmV3IFRvdXJuYW1lbnRHYW1lKHBhcmFtcyk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBlcnJvcignVW5rbm93biBHYW1lIScpO1xuICAgIH1cbn1cblxuZXhwb3J0cy5jcmVhdGVHYW1lID0gY3JlYXRlR2FtZTtcbmV4cG9ydHMuR2FtZVRhYmxlID0gR2FtZVRhYmxlO1xuZXhwb3J0cy5QbGF5ZXIgPSBQbGF5ZXI7XG5leHBvcnRzLlN0YXRlID0gU3RhdGU7XG4iLCIvKiAoaWdub3JlZCkgKi8iLCIvKiAoaWdub3JlZCkgKi8iLCIvKiAoaWdub3JlZCkgKi8iLCIvKiAoaWdub3JlZCkgKi8iLCIvKiAoaWdub3JlZCkgKi8iLCIvKiAoaWdub3JlZCkgKi8iLCIvKiAoaWdub3JlZCkgKi8iLCIvKiAoaWdub3JlZCkgKi8iLCIvKiAoaWdub3JlZCkgKi8iLCIvKiAoaWdub3JlZCkgKi8iLCIvKiAoaWdub3JlZCkgKi8iLCIvKiAoaWdub3JlZCkgKi8iXSwic291cmNlUm9vdCI6IiJ9