(function (global) {
    'use strict';

    // ships = [2, 3, 3, 4, 5]
    function setupBoard(ships) {
        // TODO: implement
    }

    function fire(myMoves, theirMoves) {
        // TODO: implement
    }

    /* 
        Feel free to change the name `MyBot` to anything you'd like
        but leave the rest of this code as is so the framework can 
        find your bot and run it :)
    */
    global.Bots = global.Bots || {};
    global.Bots.MyBot = function MyBot() {
        this.setupBoard = setupBoard;
        this.fire = fire;
    };

}(this));