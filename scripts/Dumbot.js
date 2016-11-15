(function(global) {
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
            placed = false,
            valid = false,
            x = 0, y = 0,
            i = 0, j = 0;

        for (i = 0; i < ships.length; i++) {
            x = 0; y = 0; placed = false; valid = false;

            do {
                if (x === 9 && y === 9) {
                    throw new Error("Failed to place all pieces!");
                }

                if (x === 9) {
                    x = 0;
                    y++;
                }

                if (x + ships[i] >= 9) {
                    x = 0;
                    y++;
                }

                for (j = 0; j < ships[i]; j++) {
                    valid = !board[y][x + j];

                    if (!valid) break;
                }

                if (valid) {
                    for (j = 0; j < ships[i]; j++) {
                        board[y][x + j] = 1;
                    }

                    placed = true;
                    break;
                }

                x++;
            } while (!placed);

            placements.push([
                [x, y],
                [x + ships[i] - 1, y]
            ]);
        }

        return placements;
    }

    function fire(myMoves, theirMoves) {
        if (!myMoves || !myMoves.length) {
            return [0, 0];
        }

        var myLastMove = myMoves[myMoves.length - 1],
            myNewMove = [0, 0];

        if (myLastMove[0] !== 9 && myLastMove[1] !== 9) {
            myNewMove[0] = myLastMove[0] + 1;
            myNewMove[1] = myLastMove[1];
        }
        else if (myLastMove[0] === 9 && myLastMove[1] !== 9) {
            myNewMove[0] = 0;
            myNewMove[1] = myLastMove[1] + 1;
        }
        else if (myLastMove[1] === 9 && myLastMove[0] !== 9) {
            myNewMove[0] = myLastMove[0] + 1;
            myNewMove[1] = myLastMove[1];
        }

        return myNewMove;
    }

    global.Dumbot = {
        setupBoard: setupBoard,
        fire: fire
    };
})(window);