(function(global) {
    'use strict';

    var _coordinateTemplate = _.template('<span class="tag tag-default coordinate" data-hook="x_<%= x %>_y_<%= y %>">&nbsp;</span>');

    function _loadBots() {
        var playerLists = document.querySelectorAll('[data-hook~="player-list"]');
        
        _.each(playerLists, function (select) {
            for (var botName in global.Bots) {
                var bot = global.Bots[botName],
                    option = document.createElement('option');

                option.value = botName;
                option.innerHTML = botName;

                select.appendChild(option);
            }
        });
    }

    function _cleanBoards() {
        var boards = document.querySelectorAll('[data-hook~="board"]'),
            row,
            x, y;

        _.each(boards, function (board) {
            for (x = 0; x <= 10; x++) {
                row = document.createElement('div');

                for (y = 0; y <= 10; y++) {
                    row.innerHTML += _coordinateTemplate({ x: x, y: y});
                }

                board.appendChild(row);
            }
        });
    }

    function onLoad() {
        _loadBots();

        _cleanBoards();
    }

    global.addEventListener('DOMContentLoaded', onLoad);

})(window);