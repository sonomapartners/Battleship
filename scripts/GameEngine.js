(function(global) {
    'use strict';

    var ResultType = {
        Tie: 0,
        Player1: 1,
        Player2: 2
    };

    function GameState(player1_moves, player2_moves, winner, delay) {
        this.player1_moves = player1_moves;
        this.player2_moves = player2_moves;
        this.winner = winner;
        this.currentPlayer = 1;
        this.player1_moveCount = 0;
        this.player2_moveCount = 0;
        this.delay = delay;
    }

    var _coordinateTemplate = _.template('<span class="tag tag-default coordinate" data-hook="x_<%= x %>_y_<%= y %>">&nbsp;</span>'),
        _player1state,
        _player2state,
        _games,
        _gameIndex;

    function _log(message) {
        if (typeof console !== undefined) {
            console.log(message);
        }
    }

    function _setWins() {
        var i = 0,
            p1Wins = 0,
            p2Wins = 0;
            
        for (; i <= _gameIndex; i++) {
            if (_games[i].winner === 1) {
                p1Wins++;
            }
            else if (_games[i].winner === 2) {
                p2Wins++;
            }
        }
        
        document.querySelector('[data-hook~="win-count-player-1"]').innerHTML = p1Wins;
        document.querySelector('[data-hook~="win-count-player-2"]').innerHTML = p2Wins;
    }

    function _issueMove(gameState) {
        var board,
            move = gameState.currentPlayer == 1 ? 
                gameState.player1_moves[gameState.player1_moveCount] : 
                gameState.player2_moves[gameState.player2_moveCount];

        if (gameState.currentPlayer === 1) {
            board = document.querySelector('[data-hook="board player-1"]');
        }
        else {
            board = document.querySelector('[data-hook="board player-2"]');
        }

        if (move != null && move.x != null && move.y != null) {
            board.querySelector('[data-hook="x_' + move.x + '_y_' + move.y + '"]').classList.add(move.isHit ? "tag-danger" : "tag-info");
        }

        setTimeout(function () {
            if (gameState.currentPlayer === 1) {
                gameState.currentPlayer = 2;
                gameState.player1_moveCount++;
            }
            else {
                gameState.currentPlayer = 1;
                gameState.player2_moveCount++;
            }
            
            _replayGame(gameState);
        }, gameState.delay);
    }

    function _replayGame(gameState) {
        var p1total = gameState.player1_moves.length,
            p2total = gameState.player2_moves.length;

        document.querySelector('[data-hook~="game-number"]').innerHTML = (_gameIndex + 1);

        if (gameState.player1_moveCount >= p1total && gameState.player2_moveCount >= p2total) {
            if (gameState.winner === 1) {
                document.querySelector('[data-hook~="win-count-player-1"]').classList.add('btn-success');
                document.querySelector('[data-hook~="win-count-player-2"]').classList.remove('btn-success');
            }
            else if (gameState.winner === 2) {
                document.querySelector('[data-hook~="win-count-player-1"]').classList.remove('btn-success');
                document.querySelector('[data-hook~="win-count-player-2"]').classList.add('btn-success');
            }
            else {
                document.querySelector('[data-hook~="win-count-player-1"]').classList.remove('btn-success');
                document.querySelector('[data-hook~="win-count-player-1"]').classList.remove('btn-success');
            }

            _setWins();
            return;
        }

        _issueMove(gameState);
    }

    function _displayResults(game) {
        var winner = game.winner,
            p1moves = game.player1_moves,
            p2moves = game.player2_moves,
            delay = 20; // Delay in ms

        if (game.player1LastError) {
            _log('Player 1: ' + game.player1LastError);
        }
        if (game.player2LastError) {
            _log('Player 2: ' + game.player1LastError);
        }

        _replayGame(new GameState(p1moves, p2moves, winner, delay));
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

    function _runAllBattles(player1Name, player2Name, numberOfGames) {
        var player1 = global.Bots[player1Name],
            player2 = global.Bots[player2Name],
            results = [],
            result;

        _player1state = {
            board: null,
            moves: []
        };

        _player2state = {
            board: null,
            moves: []
        };

        while (numberOfGames-- > 0) {
            result = {
                winner: _runGame(player1, player2),
                player1_moves: _player1state.moves,
                player2_moves: _player2state.moves
            };

            results.push(result);
        }

        return results;
    }

    function _startBattle() {
        var player1Name = document.querySelector('[data-hook~="player-1"]').value,
            player2Name = document.querySelector('[data-hook~="player-2"]').value,
            results = _runAllBattles(player1Name, player2Name, 1);

        _games = results;
        _gameIndex = 0;

        document.querySelector('[data-hook~="win-count-player-1"]').innerHTML = 0;
        document.querySelector('[data-hook~="win-count-player-2"]').innerHTML = 0;

        document.querySelector('[data-hook~="replay-previous"]').classList.add('disabled');
        document.querySelector('[data-hook~="replay-play"]').classList.remove('disabled');
        document.querySelector('[data-hook~="replay-next"]').classList.remove('disabled');

        _cleanBoards();
        _displayResults(_games[_gameIndex]);
    }

    function _loadBots() {
        var playerLists = document.querySelectorAll('[data-hook~="player-list"]'),
            bots = [];

        for (var botName in global.Bots) {
            bots.push(botName);
        }

        bots.sort();

        _.each(playerLists, function (select) {
            _.each(bots, function (botName) {
                var bot = global.Bots[botName],
                    option = document.createElement('option');

                option.value = botName;
                option.innerHTML = botName;

                select.appendChild(option);
            });
        });
    }

    function _cleanBoards() {
        var boards = document.querySelectorAll('[data-hook~="board"]'),
            row,
            x, y;

        _.each(boards, function (board) {
            board.innerHTML = '';

            for (x = 0; x < 10; x++) {
                row = document.createElement('div');

                for (y = 0; y < 10; y++) {
                    row.innerHTML += _coordinateTemplate({ x: x, y: y});
                }

                board.appendChild(row);
            }
        });
    }

    function _attachEvents() {
        var runBattle = document.querySelector('[data-hook="run-battle"]'),
            stepBack = document.querySelector('[data-hook="step-back"]'),
            stepForward = document.querySelector('[data-hook="step-forward"]'),
            play = document.querySelector('[data-hook="play"]');

        if (runBattle) {
            runBattle.addEventListener('click', _startBattle);
        }
    }

    function onLoad() {
        _loadBots();

        _cleanBoards();

        _attachEvents();
    }

    global.addEventListener('DOMContentLoaded', onLoad);

})(window);