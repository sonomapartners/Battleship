(function (global) {
    'use strict';

    // ships = [2, 3, 3, 4, 5]
    function setupBoard(ships) {
        var board = [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ],
            placements = [],
            myShips = [],
            currentShip,
            placeVertical,
            xBoardLength, yBoardLength,
            valid,
            x, y,
            start, end,
            i, j;

        for (i = 0; i < ships.length; i++) {
            myShips.push(ships[i]);
        }

        // place the longest ship remaining randomly
        while (myShips.length > 0) {
            currentShip = 0;
            for (i = 0; i < myShips.length; i++) {
                currentShip = Math.max(currentShip, myShips[i]);
            }
            myShips.splice(myShips.indexOf(currentShip), 1);

            // decide whether to place ship vertically or horizontally
            placeVertical = Math.floor(Math.random() * 2);
            xBoardLength = 10;
            yBoardLength = 10;

            if (placeVertical) yBoardLength -= (currentShip - 1);
            else xBoardLength -= (currentShip - 1);

            // try placing the ship 5 times before giving up
            for (i = 0; i < 5; i++) {
                valid = true;

                x = Math.floor(Math.random() * xBoardLength);
                y = Math.floor(Math.random() * yBoardLength);

                start = {
                    x: x,
                    y: y
                };

                for (j = 0; j < currentShip; j++) {
                    if (placeVertical) {
                        if (board[x][y + j] === 1) valid = false;
                    } else {
                        if (board[x + j][y] === 1) valid = false;
                    }
                }

                if (valid) {
                    if (placeVertical) end = { x: x, y: y + j - 1 };
                    else end = { x: x + j - 1, y: y };

                    for (j = 0; j < currentShip; j++) {
                        if (placeVertical) board[x][y + j] = 1;
                        else board[x + j][y] = 1;
                    }

                    placements.push({
                        begin: start,
                        end: end
                    });
                    break;
                }
            }

            if (!valid) {
                throw new Error("Failed to place all pieces!");
            }
        }

        return placements;
    }

    function fire(myMoves, theirMoves) {
        var i, j,
            moveIndex,
            move;

        if (!myMoves || !myMoves.length) {
            this._openMoves = [];
            for (i = 0; i < 10; i++) {
                for (j = 0; j < 10; j++) {
                    this._openMoves.push({ x: i, y: j });
                }
            }
        }

        moveIndex = Math.floor(Math.random() * this._openMoves.length);
        move = this._openMoves[moveIndex];

        this._openMoves.splice(moveIndex, 1);

        return move;
    }

    global.Bots = global.Bots || {};
    global.Bots.Randombot = {
        setupBoard: setupBoard,
        fire: fire
    };

}(this));