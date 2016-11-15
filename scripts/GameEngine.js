(function(global) {

    function onLoad() {
        document.querySelectorAll('[data-hook~="player-list"]').forEach(function (select) {
            for (var botName in global.Bots) {
                var bot = global.Bots[botName],
                    option = document.createElement('option');

                option.value = botName;
                option.innerHTML = botName;

                select.appendChild(option);
            }
        });
    }

    global.addEventListener('DOMContentLoaded', onLoad);

})(window);