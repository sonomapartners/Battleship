(function(global) {
    // find the bots
    var bots = Object.keys(global).filter(function(key) {
        var ref = global[key];
        return ref &&
               ref.setupBoard && _.isFunction(ref.setupBoard) &&
               ref.fire && _.isFunction(ref.fire);
    }).sort();

    [document.getElementById('player1'), document.getElementById('player2')].forEach(function(select) {
        bots.forEach(function(bot) {
            var opt = document.createElement('option');
            opt.value = bot;
            opt.innerHTML = bot;
            select.appendChild(opt);
        });
    });

    global.gameContext = {
        bots: bots
    };
})(window);