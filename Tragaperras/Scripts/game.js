var Button = (function () {
    function Button(path, x, y) {
        this._x = x;
        this._y = y;
        this._image = new createjs.Bitmap(path);
        this._image.x = this._x;
        this._image.y = this._y;

        this._image.addEventListener("mouseover", this._buttonOver);
        this._image.addEventListener("mouseout", this._buttonOut);
    }
    // PUBLIC PROPERTIES
    Button.prototype.setX = function (x) {
        this._x = x;
    };

    Button.prototype.getX = function () {
        return this._x;
    };

    Button.prototype.setY = function (y) {
        this._y = y;
    };

    Button.prototype.getY = function () {
        return this._y;
    };

    Button.prototype.getImage = function () {
        return this._image;
    };

    // PRIVATE EVENT HANDLERS
    Button.prototype._buttonOut = function (event) {
        event.currentTarget.alpha = 1; // 100% Alpha
    };

    Button.prototype._buttonOver = function (event) {
        event.currentTarget.alpha = 0.7;
    };
    return Button;
})();

// VARIABLES ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var canvas;
var stage;
var tiles = [];
var reelContainers = [];

// GAME CONSTANTS
var NUM_REELS = 3;

// GAME VARIABLES
var playerMoney = 1000;
var winnings = 0;
var jackpot = 5000;
var turn = 0;
var playerBet = 100;
var winNumber = 0;
var lossNumber = 0;
var spinResult;
var fruits = "";
var winRatio = 0;

/* Tally Variables */
var hearts = 0;
var bananas = 0;
var dollars = 0;
var cherries = 0;
var bars = 0;
var bells = 0;
var sevens = 0;
var blanks = 0;

// GAME OBJECTS
var game;
var background;
var spinButton;
var betMaxButton;
var betOneButton;
var resetButton;
var powerButton;

// FUNCTIONS ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function init() {
    canvas = document.getElementById("canvas");
    stage = new createjs.Stage(canvas); // Parent Object
    stage.enableMouseOver(20); // Turn on Mouse Over events

    createjs.Ticker.setFPS(60); // Set the frame rate to 60 fps
    createjs.Ticker.addEventListener("tick", gameLoop);

    main();
}

/* Utility function to display all the values/labels */
function labels() {
    var canvas = document.getElementById("canvas");
    var text1 = canvas.getContext("2d");
    text1.fillStyle = "red";
    text1.font = "48px digital-7";
    text1.fillText("Ca$h : " + playerMoney, 30, 90);
    text1.fillText("Bet  : " + playerBet, 30, 130);
}

// GAMELOOP
function gameLoop() {
    stage.update();
    labels();
}

/* Utility function to reset all fruit tallies */
function resetFruitTally() {
    hearts = 0;
    bananas = 0;
    dollars = 0;
    cherries = 0;
    bars = 0;
    bells = 0;
    sevens = 0;
    blanks = 0;
}

/* Utility function to reset the player stats */
function resetAll() {
    playerMoney = 1000;
    winnings = 0;
    jackpot = 5000;
    turn = 0;
    playerBet = 10;
    winNumber = 0;
    lossNumber = 0;
    winRatio = 0;
}

/* Utility function to check if a value falls within a range of bounds */
function checkRange(value, lowerBounds, upperBounds) {
    if (value >= lowerBounds && value <= upperBounds) {
        return value;
    } else {
        return !value;
    }
}

/* When this function is called it determines the betLine results.
e.g. Bar - Orange - Banana */
function Reels() {
    var betLine = [" ", " ", " "];
    var outCome = [0, 0, 0];

    for (var spin = 0; spin < 3; spin++) {
        outCome[spin] = Math.floor((Math.random() * 65) + 1);
        switch (outCome[spin]) {
            case checkRange(outCome[spin], 1, 27):
                betLine[spin] = "blank";
                blanks++;
                break;
            case checkRange(outCome[spin], 28, 37):
                betLine[spin] = "hearts";
                hearts++;
                break;
            case checkRange(outCome[spin], 38, 46):
                betLine[spin] = "banana";
                bananas++;
                break;
            case checkRange(outCome[spin], 47, 54):
                betLine[spin] = "dollars";
                dollars++;
                break;
            case checkRange(outCome[spin], 55, 59):
                betLine[spin] = "cherry";
                cherries++;
                break;
            case checkRange(outCome[spin], 60, 62):
                betLine[spin] = "bar";
                bars++;
                break;
            case checkRange(outCome[spin], 63, 64):
                betLine[spin] = "bell";
                bells++;
                break;
            case checkRange(outCome[spin], 65, 65):
                betLine[spin] = "seven";
                sevens++;
                break;
        }
    }
    return betLine;
}

/* This function calculates the player's winnings, if any */
function determineWinnings() {
    if (blanks == 0) {
        if (hearts == 3) {
            winnings = playerBet * 10;
        } else if (bananas == 3) {
            winnings = playerBet * 20;
        } else if (dollars == 3) {
            winnings = playerBet * 30;
        } else if (cherries == 3) {
            winnings = playerBet * 40;
        } else if (bars == 3) {
            winnings = playerBet * 50;
        } else if (bells == 3) {
            winnings = playerBet * 75;
        } else if (sevens == 3) {
            winnings = playerBet * 100;
        } else if (hearts == 2) {
            winnings = playerBet * 2;
        } else if (bananas == 2) {
            winnings = playerBet * 2;
        } else if (dollars == 2) {
            winnings = playerBet * 3;
        } else if (cherries == 2) {
            winnings = playerBet * 4;
        } else if (bars == 2) {
            winnings = playerBet * 5;
        } else if (bells == 2) {
            winnings = playerBet * 10;
        } else if (sevens == 2) {
            winnings = playerBet * 20;
        } else {
            winnings = playerBet * 1;
        }

        if (sevens == 1) {
            winnings = playerBet * 5;
        }
        winNumber++;
        showWinMessage();
    } else {
        lossNumber++;
        showLossMessage();
    }
}

/* Utility function to show a win message and increase player money */
function showWinMessage() {
    playerMoney += winnings;

    //$("div#winOrLose>p").text("You Won: $" + winnings);
    resetFruitTally();
    checkJackPot();
}

/* Utility function to show a loss message and reduce player money */
function showLossMessage() {
    playerMoney -= playerBet;

    //$("div#winOrLose>p").text("You Lost!");
    resetFruitTally();
}

/* Check to see if the player won the jackpot */
function checkJackPot() {
    /* compare two random values */
    var jackPotTry = Math.floor(Math.random() * 51 + 1);
    var jackPotWin = Math.floor(Math.random() * 51 + 1);
    if (jackPotTry == jackPotWin) {
        alert("You Won the $" + jackpot + " Jackpot!!");
        playerMoney += jackpot;
        jackpot = 1000;
    }
}

// MAIN MEAT of my code goes here
function spinButtonClicked(event) {
    if (playerMoney == 0) {
        if (confirm("You ran out of Money! \nDo you want to play again?")) {
            resetAll();
            labels();
        }
    } else if (playerBet > playerMoney) {
        alert("You don't have enough Money to place that bet.");
    } else if (playerBet < 0) {
        alert("All bets must be a positive $ amount.");
    } else if (playerBet <= playerMoney) {
        spinResult = Reels();
        fruits = spinResult[0] + " - " + spinResult[1] + " - " + spinResult[2];

        determineWinnings();
        turn++;

        for (var index = 0; index < NUM_REELS; index++) {
            reelContainers[index].removeAllChildren();
            tiles[index] = new createjs.Bitmap("images/reels/" + spinResult[index] + ".png");
            reelContainers[index].addChild(tiles[index]);
        }
    } else {
        alert("Please enter a valid bet amount");
    }
}

function resetButtonClicked(event) {
    resetFruitTally();
    resetAll();
    main();
}

function powerButtonClicked(event) {
    window.close();
}

function createUI() {
    background = new createjs.Bitmap("images/slot_machine_face.png");
    game.addChild(background); // Add the background to the game container

    for (var index = 0; index < NUM_REELS; index++) {
        reelContainers[index] = new createjs.Container();
        game.addChild(reelContainers[index]);
    }
    reelContainers[0].x = 90;
    reelContainers[0].y = 247;
    reelContainers[1].x = 190;
    reelContainers[1].y = 247;
    reelContainers[2].x = 290;
    reelContainers[2].y = 247;

    // Spin Button
    spinButton = new Button("images/spin_button.png", 385, 470);
    game.addChild(spinButton.getImage());

    // Spin Button Event Listeners
    spinButton.getImage().addEventListener("click", spinButtonClicked);

    // Bet Max Button
    betMaxButton = new Button("images/bet_max.png", 290, 470);
    game.addChild(betMaxButton.getImage());
    betMaxButton.getImage().addEventListener("click", spinButtonClicked);

    // Bet One Button
    betOneButton = new Button("images/bet_one.png", 195, 470);
    game.addChild(betOneButton.getImage());
    betOneButton.getImage().addEventListener("click", spinButtonClicked);

    // Reset Button
    resetButton = new Button("images/reset.png", 100, 470);
    game.addChild(resetButton.getImage());
    resetButton.getImage().addEventListener("click", resetButtonClicked);

    // Power Button
    powerButton = new Button("images/power.png", 5, 470);
    game.addChild(powerButton.getImage());
    powerButton.getImage().addEventListener("click", powerButtonClicked);
}

function main() {
    game = new createjs.Container(); // Instantiates the Game Container

    createUI();

    stage.addChild(game); // Adds the Game Container to the Stage
}
//# sourceMappingURL=game.js.map
