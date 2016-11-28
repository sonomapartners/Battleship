# Battleship
Welcome to the battle!

## Rules of the Game

1. The game is to be played on a 10 x 10 grid.
2. Each of the two players must place all ships given on to the grid.
3. No ships may overlap, but they may be adjacent.
4. Players take turns firing a single shot at their opponent.
5. Game play ends when all of the ships of any one player are sunk, each player has had 100 turns, or if an egregious error is produced by either player.

## Building your Bot

1. A stub file `MyBot.js` is setup for you in the root directory. You may change the name of the bot, but please ensure to change the name everywhere (the filename, function name, etc).
2. Modify the stub file to implement the two functions requested, `setupBoard` and `fire`. Feel free to use the sample bots in the `/scripts/bots/` directory as examples or starting points as well.
    - `setupBoard` should take in an array of ship sizes (array of integers). By default the ship sizes are [2, 3, 3, 4, 5], but it may change! `setupBoard` should return an array of placement objects, which are simply defined as a starting X and Y coordinate, and an ending X and Y coordinate. The object should be of the form `{ start: { x: [0-9], y: [0-9] }, end: { x: [0-9], y: [0-9] } }`;
    - `fire` will be passed an array of your previous shots as well as your opponents shots. Do what you want to with those values, and then return a coordinate of the form `{ x: [0-9], y: [0-9] }` which will be your selected target for the round.

**Notes:**
 - While you *can* store state across games by storing things in the global context, but this is not recommended.
 - Per-game state can be stored on your Bot instance using the `this` keyword.
 - If you'd like to check if it is your first move, you may check the length of your previous shots array that was passed to your `fire` implementation.
 - The `isSunk`, `isHit`, and `shipSize` variables on a move instance will be set upon completion of a player's move and will be accessible in your `fire` implementation.
 - Errors during a battle are logged to the developer console. If an error is encountered in your code, you lose that round.

 **Recommended Development Toolchain:**
 - We recommend using Visual Studio Code for development, but feel free to use any text editor or IDE that you wish.
 - We use git for our source control interanlly at Sonoma Partners, and if you want to keep a backup or history of your changes in case you want to go back to an earlier version, you may also use git. Feel free to checkout GitHub, BitBucket, or just initialize a local repository.
 - We use editorconfig and jshint on our front-end heavy projects. Feel free to checkout the `.editorconfig` and `.jshintrc` files at the root of this project for more information and our personal personal preferences. Note that abiding by these rules is not required.

## Testing your Bot

1. You simply need to double click/run the `index.html` file at the root of this project in a browser in order to test your implementation against the sample bots. Try running Dumbot against Randombot as both Player 1 and Player 2 to see some battles play out.
2. Click `Run 1 Battle` to see a visualized replay of a single battle between the two selected bots (games are run in memory in their entirety before being rendered).
3. Click `Run 1000 Battles` to see some brief stats on how your bot is performing in the long run. We highly recommend doing your final testing in this game mode.
4. We recommend using Chrome to develop and test your implementation, but any modern browser should work just as well (IE10+).
5. If at any point an error is thrown or an invalid result is encountered, a warning icon will appear in the bottom right hand corner of the page. This is simply an indicator that you should check the console for the details of the issue encountered, and for further debugging.

## Tips on debugging

1. If you place a `debugger` statement at the top of your `setupBoard` and/or `fire` implementations, you may find it to be easier to step through your code.
2. For more details on how to debug, see the appropriate documentation for your browser of choice. For example, here's [Chrome's documentation](https://developers.google.com/web/tools/chrome-devtools/).