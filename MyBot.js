(function (exports) {
    'use strict';

    // ships = [2, 3, 3, 4, 5]
    function setupBoard(ships) {
        // TODO: implement

        // Example output below assumes ships = [2, 3, 3, 4, 5]
        return [
            { begin: { x: 0, y: 0}, end: { x: 0, y: 1} },
            { begin: { x: 0, y: 2}, end: { x: 0, y: 4} },
            { begin: { x: 0, y: 5}, end: { x: 0, y: 7} },
            { begin: { x: 1, y: 0}, end: { x: 1, y: 3} },
            { begin: { x: 2, y: 0}, end: { x: 2, y: 4} }
        ];
    }

    function fire(myMoves, theirMoves) {
        // TODO: implement

        // always fires at 0,0
        return { x: 0, y: 0};
    }

    /* 
        Feel free to change the name `MyBot` to anything you'd like
        but leave the rest of this code as is so the framework can 
        find your bot and run it :)
    */
    exports.Bots = exports.Bots || {};
    exports.Bots.MyBot = function MyBot() {
        this.setupBoard = setupBoard;
        this.fire = fire;
    };

}(typeof exports !== 'undefined' && exports !== null ? exports : this));