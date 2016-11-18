(function (global) {
    'use strict';

    var ResultType = {
        Tie: 0,
        Player1: 1,
        Player2: 2
    };

    global.GameEngine = global.GameEngine || (function () {

        var _player1state,
            _player2state;

        function _log(message) {
            if (typeof console !== undefined) {
                console.log(message);
            }
        }

        function _validatePlacements(player, playerState) {
            var places = playerState.board,
                place, 
                size, 
                dir, 
                xChange = 0,
                yChange = 0,
                placeCounter = 0,
                j = 0,
                x, y,
                board = [
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
                ];
                
            if (!places || !places.length) {
                throw new Error('Placements are undefined or empty.');
            }
            else if (places.length !== 5) {
                throw new Error('Incorrect number of placements encountered. Should\'ve seen 5, instead saw: ' + places.length);
            }
            
            placeCounter = places.length;
            while (placeCounter-- > 0) {
                place = places[placeCounter];
                
                if (!place || !place.begin || !place.end) {
                    throw new Error('Placement #' + placeCounter + ' is undefined or one of it\'s points are.');
                }
                
                if (place.begin.x < 0 || place.begin.x > 9 ||
                    place.begin.y < 0 || place.begin.y > 9 ||
                    place.end.x < 0 || place.end.x > 9 ||
                    place.end.y < 0 || place.end.y > 9) {
                    throw new Error('Placement #' + placeCounter + ' is off the grid. P: ' + place.toString());
                }
                
                if (place.begin.x !== place.end.x &&
                    place.begin.y === place.end.y) {
                    dir = 'x';
                    size = Math.abs(place.end.x - place.begin.x) + 1;
                }
                else if (place.begin.x === place.end.x &&
                    place.begin.y !== place.end.y) {
                    dir = 'y';
                    size = Math.abs(place.end.y - place.begin.y) + 1;
                }
                else {
                    throw new Error('Placement #' + placeCounter + ' appears diagonal. P: ' + place.toString());
                }
                
                if (size < 0 || size > 5) {
                    throw new Error('Placement #' + placeCounter + ' is outside the valid ship length. Size: ' + size);
                }
                
                xChange = dir === 'x' ? 1 : 0;
                yChange = dir === 'y' ? 1 : 0;
                while (size-- > 0) {
                    x = place.begin.x + (size * xChange);
                    y = place.begin.y + (size * yChange);
                    if (!board[y][x]) {
                        board[y][x] = 1;
                    }
                    else {
                        throw new Error('Placement #' + placeCounter + ' appears to overlap another placement. P: ' + place.toString() + ' ' + JSON.stringify(places));
                    }
                }
            }
        }

        function _getPlacementLenth(placement) {
            var p0, p1;

            p0 = Math.abs(placement.begin.x - placement.end.x);
            p0 *= p0;
            p1 = Math.abs(placement.end.y - placement.begin.y);
            p1 *= p1;

            return Math.sqrt(p0 + p1) + 1;
        }

        function _fire(player, playerState, opponentState) {
            var move,
                placement,
                isCoordMatch = false,
                counter = playerState.board.length,
                script;

            move = player.fire(playerState.moves, opponentState.moves);
            playerState.moves.push(move);

            while (counter-- > 0) {
                placement = opponentState.board[counter];

                if (!placement.hits) {
                    placement.hits = 0;
                    placement.sunk = false;
                }

                move.isHit = false;
                move.isSunk = false;

                isCoordMatch = (placement.begin.x <= move.x && 
                    placement.end.x >= move.x &&
                    placement.begin.y <= move.y &&
                    placement.end.y >= move.y) ||
                    (placement.begin.x >= move.x && 
                    placement.end.x <= move.x &&
                    placement.begin.y >= move.y &&
                    placement.end.y <= move.y);

                if (!placement.sunk && isCoordMatch) {
                    placement.hits++;
                    move.isHit = true;

                    if (placement.hits === _getPlacementLenth(placement)) {
                        placement.sunk = true;
                        move.isSunk = true;
                        move.shipSize = placement.hits;
                    }

                    return placement.sunk;
                }
                else if (placement.sunk && isCoordMatch) {
                    return false;
                }
            }

            return false;
        }

        function _setupGame(player, playerState) {
            playerState.board = player.setupBoard([2, 3, 3, 4, 5]);
        }

        function _runGame(player1, player2) {
            var player1_sunkCount = 0,
                player2_sunkCount = 0,
                roundCount = 100,
                result,
                isDone = false,
                p1Error, p2Error;

            try {
                _setupGame(player1, _player1state);
                _validatePlacements(player1, _player1state);
            }
            catch (er) {
                _log(er.message);
                p1Error = er.message + ' ' + er.stack;
            }
            try {
                _setupGame(player2, _player2state);
                _validatePlacements(player2, _player2state);
            }
            catch (er) {
                _log(er.message);
                p2Error = er.message + ' ' + er.stack;
            }

            if (p1Error && p2Error) {
                return ResultType.Tie;
            }
            else if (p1Error || p2Error) {
                return p1Error ? ResultType.Player2 : ResultType.Player1;
            }

            do {
                try {
                    result = _fire(player1, _player1state, _player2state);
                }
                catch (er) {
                    _log(er.message);
                    p1Error = er.message + ' ' + er.stack;
                    return ResultType.Player2;
                }
                
                if (result) {
                    if (++player1_sunkCount === 5) {
                        isDone = true;
                    }
                }
                result = null; // reset result for player 2
                
                try {
                    // if player 1 hasn't already finished
                    if (!isDone) {
                        result = _fire(player2, _player2state, _player1state);
                    }
                }
                catch (er) {
                    _log(er.message);
                    p2Error = er.message + ' ' + er.stack;
                    return ResultType.Player1;
                }
                
                if (result) {
                    if (++player2_sunkCount === 5) {
                        isDone = true;
                    }
                }
                
            } while(--roundCount > 0 && !isDone);

            if (player1_sunkCount > player2_sunkCount) {
                return ResultType.Player1;
            }
            else if (player1_sunkCount < player2_sunkCount) {
                return ResultType.Player2;
            }
            else {
                return ResultType.Tie;
            }
        }

        function run(player1, player2, numberOfGames) {
            var results = [],
                result;

            while (numberOfGames-- > 0) {
                _player1state = {
                    board: null,
                    moves: []
                };

                _player2state = {
                    board: null,
                    moves: []
                };

                result = {
                    winner: _runGame(player1, player2),
                    player1_moves: _player1state.moves,
                    player2_moves: _player2state.moves
                };

                results.push(result);
            }

            return results;
        }

        return {
            run: run
        };

    }());

}(this));