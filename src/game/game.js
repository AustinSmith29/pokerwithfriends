"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.game = void 0;
var client_js_1 = require("./client.js");
var TextButton_js_1 = require("./ui/TextButton.js");
var seat_js_1 = require("./ui/seat.js");
var PlayerManagementModal_js_1 = require("./ui/PlayerManagementModal.js");
var Phaser = require("phaser");
var sceneConfig = {
    active: true,
    visible: true,
    key: 'Poker Game'
};
var PokerGame = (function (_super) {
    __extends(PokerGame, _super);
    function PokerGame() {
        return _super.call(this, sceneConfig) || this;
    }
    PokerGame.prototype.onTableSync = function () {
    };
    PokerGame.prototype.init = function () {
        this.origin = [this.game.config.width / 2, this.game.config.height / 2];
        this.coordinateBase = new Coordinates(this.origin, 3);
        this.seats = [];
    };
    PokerGame.prototype.preload = function () {
        this.load.image('table', 'assets/pokertable.png');
        this.load.image('testButton', 'assets/testButton.png');
        this.load.image('testButtonHover', 'assets/testButtonHover.png');
        this.load.image('testButtonClick', 'assets/testButtonClick.png');
    };
    PokerGame.prototype.create = function () {
        var _this = this;
        var roomName = new URLSearchParams(location.search).get('roomName');
        this.client = new client_js_1.Client(roomName, this.onTableSync);
        this.add.image(this.origin[0], this.origin[1], 'table');
        var _loop_1 = function (i) {
            var _a = this_1.coordinateBase.seatCoordinates(i), x = _a[0], y = _a[1];
            this_1.seats.push(new seat_js_1.Seat(this_1.scene, x, y, seat_js_1.SeatStatus.OPEN, function () { return _this.client.sit(i); }));
        };
        var this_1 = this;
        for (var i = 0; i < 9; i++) {
            _loop_1(i);
        }
        this.playerManagementButton = new TextButton_js_1.TextButton(this.scene.scene, 20, 20, 'Players', function () { new PlayerManagementModal_js_1.PlayerManagementModal(_this.scene.scene, _this.client); });
        this.startPlayingButton = new TextButton_js_1.TextButton(this.scene.scene, 20, 80, 'Start Game', function () { _this.client.startGame(); });
    };
    PokerGame.prototype.update = function () {
    };
    return PokerGame;
}(Phaser.Scene));
var Coordinates = (function () {
    function Coordinates(tableCenter, scaleRatio) {
        var _this = this;
        this.localToWorld = function (x, y) { return [x + _this.originX, y + _this.originY]; };
        this.seatCoordinates = function (seat) {
            switch (seat) {
                case 0:
                    return _this.localToWorld(30, 160);
                case 1:
                    return _this.localToWorld(280, 110);
                case 2:
                    return _this.localToWorld(350, -50);
                case 3:
                    return _this.localToWorld(280, -210);
                case 4:
                    return _this.localToWorld(30, -260);
                case 5:
                    return _this.localToWorld(-230, -260);
                case 6:
                    return _this.localToWorld(-485, -210);
                case 7:
                    return _this.localToWorld(-550, -50);
                case 8:
                    return _this.localToWorld(-485, 110);
                case 9:
                    return _this.localToWorld(-230, 160);
                default:
                    throw "Unknown Seat Number";
            }
        };
        this.communityCardCoordinates = function () {
        };
        var x = tableCenter[0], y = tableCenter[1];
        this.originX = x;
        this.originY = y;
        this.scaleRatio = scaleRatio;
    }
    return Coordinates;
}());
var config = {
    type: Phaser.AUTO,
    scale: {
        parent: 'game',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight
    },
    scene: PokerGame
};
exports.game = new Phaser.Game(config);
//# sourceMappingURL=game.js.map