(function(global) {
    'use strict';

    function GameState(player1_moves, player2_moves, winner, delay) {
        this.player1_moves = player1_moves;
        this.player2_moves = player2_moves;
        this.winner = winner;
        this.currentPlayer = 1;
        this.player1_moveCount = 0;
        this.player2_moveCount = 0;
        this.delay = delay;
    }

    var _coordinateTemplate,
        _games,
        _gameIndex;

    function _log(message) {
        if (typeof console !== undefined) {
            console.log(message);
        }
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

            board.querySelector('[data-hook="x_' + move.x + '_y_' + move.y + '"]').innerHTML = move.isHit ?
                '<img src="imgs/hit.png" />' : '<img src="imgs/water.png" />'; 
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

        if (gameState.player1_moveCount >= p1total && gameState.player2_moveCount >= p2total) {
            if (gameState.winner === 1) {
                document.querySelector('[data-hook~="win-player-1"]').innerHTML = 'Winner';
            }
            else if (gameState.winner === 2) {
                document.querySelector('[data-hook~="win-player-2"]').innerHTML = 'Winner';
            }
            return;
        }

        _issueMove(gameState);
    }

    function _displayResults(game) {
        var winner = game.winner,
            p1moves = game.player1_moves,
            p2moves = game.player2_moves,
            delay = 20; // Delay in ms

        document.querySelector('[data-hook~="results-view-visual"]').classList.remove('hide');

        if (game.player1LastError) {
            _log('Player 1: ' + game.player1LastError);
        }
        if (game.player2LastError) {
            _log('Player 2: ' + game.player1LastError);
        }

        _replayGame(new GameState(p1moves, p2moves, winner, delay));
    }

    function _displayBulkResults(games, duration) {
        var $player1Wins = document.querySelector('[data-hook~="win-percentage-player-1"]'),
            $player2Wins = document.querySelector('[data-hook~="win-percentage-player-2"]'),
            $ties = document.querySelector('[data-hook~="tie-percentage"]'),
            $duration = document.querySelector('[data-hook~="count-seconds"]'),
            player1WinCount = 0,
            player2WinCount = 0,
            tieCount = 0,
            totalCount = 0;

        document.querySelector('[data-hook~="results-view-stats"]').classList.remove('hide');

        _.each(games, function (game) {
            if (game.winner === 1) {
                player1WinCount++;
            }
            else if (game.winner === 2) {
                player2WinCount++;
            }
            else {
                tieCount++;
            }
            totalCount++;

            if (game.player1LastError) {
                _log('Player 1: ' + game.player1LastError);
            }
            if (game.player2LastError) {
                _log('Player 2: ' + game.player1LastError);
            }
        });

        $player1Wins.innerHTML = [(player1WinCount / totalCount * 100).toFixed(2), '%'].join('');
        $player1Wins.classList.remove('tag-success', 'tag-danger');
        $player2Wins.innerHTML = [(player2WinCount / totalCount * 100).toFixed(2), '%'].join('');
        $player2Wins.classList.remove('tag-success', 'tag-danger');
        $ties.innerHTML = [(tieCount / totalCount * 100).toFixed(2), '%'].join('');
        $duration.innerHTML = [(duration / 1000).toFixed(2), 's'].join('');
        
        if (player1WinCount > player2WinCount) {
            $player1Wins.classList.add('tag-success');
            $player2Wins.classList.add('tag-danger');
        }
        else if (player1WinCount < player2WinCount) {
            $player2Wins.classList.add('tag-success');
            $player1Wins.classList.add('tag-danger');
        }
    }

    function _reset() {
        _games = null;
        _gameIndex = 0;

        document.querySelector('[data-hook~="results-view-visual"]').classList.add('hide');
        document.querySelector('[data-hook~="results-view-stats"]').classList.add('hide');

        document.querySelector('[data-hook~="win-player-1"]').innerHTML = '';
        document.querySelector('[data-hook~="win-player-2"]').innerHTML = '';

        document.querySelector('[data-hook~="win-percentage-player-1"]').innerHTML = '0.00%';
        document.querySelector('[data-hook~="win-percentage-player-2"]').innerHTML = '0.00%';
        document.querySelector('[data-hook~="tie-percentage"]').innerHTML = '0.00%';
        document.querySelector('[data-hook~="count-seconds"]').innerHTML = '0.00s';

        _cleanBoards();
    }

    function _startBattle() {
        var player1Name = document.querySelector('[data-hook~="player-1"]').value,
            player2Name = document.querySelector('[data-hook~="player-2"]').value;

        _reset();

        _games = GameEngine.run(global.Bots[player1Name], global.Bots[player2Name], 1);

        _displayResults(_games[_gameIndex]);
    }

    function _startBulkBattles() {
        var player1Name = document.querySelector('[data-hook~="player-1"]').value,
            player2Name = document.querySelector('[data-hook~="player-2"]').value,
            start, end;

        _reset();

        start = Date.now();
        _games = GameEngine.run(global.Bots[player1Name], global.Bots[player2Name], 1000);
        end = Date.now();

        _displayBulkResults(_games, (end - start));
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

    function _loadTemplates() {
        _coordinateTemplate = _.template(
            document.querySelector('[data-hook~="template-coordinate"]').innerHTML
        );
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
            runBulkBattles = document.querySelector('[data-hook="run-bulk-battles"]'),
            stepBack = document.querySelector('[data-hook="step-back"]'),
            stepForward = document.querySelector('[data-hook="step-forward"]'),
            play = document.querySelector('[data-hook="play"]');

        if (runBattle) {
            runBattle.addEventListener('click', _startBattle);
        }
        if (runBulkBattles) {
            runBulkBattles.addEventListener('click', _startBulkBattles);
        }
    }

    function onLoad() {
        _loadBots();

        _loadTemplates();

        _cleanBoards();

        _attachEvents();
    }

    global.addEventListener('DOMContentLoaded', onLoad);

})(window);