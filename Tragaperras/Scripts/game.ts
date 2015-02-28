﻿class Button {
    //PRIVATE INSTANCE VARIABLES
    private _image: createjs.Bitmap;
    private _x: number;
    private _y: number;

    constructor(path: string, x: number, y: number) {
        this._x = x;
        this._y = y;
        this._image = new createjs.Bitmap(path);
        this._image.x = this._x;
        this._image.y = this._y;

        this._image.addEventListener("mouseover", this._buttonOver);
        this._image.addEventListener("mouseout", this._buttonOut);
    }

    // PUBLIC PROPERTIES
    public setX(x: number):void {
        this._x = x;
    }

    public getX():number { 
        return this._x;
    }

    public setY(y: number):void {
        this._y = y;
    }

    public getY(): number {
        return this._y;
    }

    public getImage(): createjs.Bitmap {
        return this._image;
    }


    // PRIVATE EVENT HANDLERS
    private _buttonOut(event: createjs.MouseEvent):void {
     event.currentTarget.alpha = 1; // 100% Alpha 

    }

    private _buttonOver(event: createjs.MouseEvent):void {
    event.currentTarget.alpha = 0.7;

    }
}




// VARIABLES ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var canvas; // Reference to the HTML 5 Canvas element
var stage: createjs.Stage; // Reference to the Stage
var tiles: createjs.Bitmap[] = [];
var reelContainers: createjs.Container[] = [];

// GAME CONSTANTS
var NUM_REELS: number = 3;


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
var game: createjs.Container; // Main Game Container Object
var background: createjs.Bitmap;
var spinButton: Button;
var betMaxButton: Button;
var betOneButton: Button;
var resetButton: Button;
var powerButton: Button;
var betIncButton: Button;
var betDecButton: Button;


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

    var canvas : any = document.getElementById("canvas");

    var text1 = canvas.getContext("2d");
    text1.fillStyle = "red";
    text1.font = "48px digital-7";
    text1.fillText("Ca$h:" + playerMoney, 30, 90);
    text1.fillText("Bet :" + playerBet, 30, 130);
    text1.fillText(jackpot, 310, 130);

    var text2 = canvas.getContext("2d");
    text2.fillStyle = "black";
    text2.font = "18px Arial";
    text2.fillText("Change bet amount : ", 90, 442);

    var text3 = canvas.getContext("2d");
    text3.fillStyle = "blue";
    text3.font = "32px Segoe Script";
    text3.fillText("Jackpot", 290, 80);
    
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
    }
    else {
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
            case checkRange(outCome[spin], 1, 27):  // 41.5% probability
                betLine[spin] = "blank";
                blanks++;
                break;
            case checkRange(outCome[spin], 28, 37): // 15.4% probability
                betLine[spin] = "hearts";
                hearts++;
                break;
            case checkRange(outCome[spin], 38, 46): // 13.8% probability
                betLine[spin] = "banana";
                bananas++;
                break;
            case checkRange(outCome[spin], 47, 54): // 12.3% probability
                betLine[spin] = "dollars";
                dollars++;
                break;
            case checkRange(outCome[spin], 55, 59): //  7.7% probability
                betLine[spin] = "cherry";
                cherries++;
                break;
            case checkRange(outCome[spin], 60, 62): //  4.6% probability
                betLine[spin] = "bar";
                bars++;
                break;
            case checkRange(outCome[spin], 63, 64): //  3.1% probability
                betLine[spin] = "bell";
                bells++;
                break;
            case checkRange(outCome[spin], 65, 65): //  1.5% probability
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
        }
        else if (bananas == 3) {
            winnings = playerBet * 20;
        }
        else if (dollars == 3) {
            winnings = playerBet * 30;
        }
        else if (cherries == 3) {
            winnings = playerBet * 40;
        }
        else if (bars == 3) {
            winnings = playerBet * 50;
        }
        else if (bells == 3) {
            winnings = playerBet * 75;
        }
        else if (sevens == 3) {
            winnings = playerBet * 100;
        }
        else if (hearts == 2) {
            winnings = playerBet * 2;
        }
        else if (bananas == 2) {
            winnings = playerBet * 2;
        }
        else if (dollars == 2) {
            winnings = playerBet * 3;
        }
        else if (cherries == 2) {
            winnings = playerBet * 4;
        }
        else if (bars == 2) {
            winnings = playerBet * 5;
        }
        else if (bells == 2) {
            winnings = playerBet * 10;
        }
        else if (sevens == 2) {
            winnings = playerBet * 20;
        }
        else {
            winnings = playerBet * 1;
        }

        if (sevens == 1) {
            winnings = playerBet * 5;
        }
        winNumber++;
        showWinMessage();
    }
    else {
        lossNumber++;
        showLossMessage();
    }
    
}
/* Utility function to show a win message and increase player money */
function showWinMessage() {
    playerMoney += winnings;
    resetFruitTally();
    checkJackPot();
}

/* Utility function to show a loss message and reduce player money */
function showLossMessage() {
    playerMoney -= playerBet;
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


// Spin button clicked and the values for the reels are fetched
function spinButtonClicked(event: createjs.MouseEvent) {

    if (playerMoney == 0) {
        if (confirm("You ran out of Money! \nDo you want to play again?")) {
            resetAll();
            labels();
        }
    }
    else if (playerBet > playerMoney) {
        alert("You don't have enough Money to place that bet.");
    }
    else if (playerBet < 0) {
        alert("All bets must be a positive $ amount.");
    }
    else if (playerBet <= playerMoney) {
        spinResult = Reels();
        fruits = spinResult[0] + " - " + spinResult[1] + " - " + spinResult[2];
        
        determineWinnings();
        turn++;

        // Iterate over the number of reels
        for (var index = 0; index < NUM_REELS; index++) {
            reelContainers[index].removeAllChildren();
            tiles[index] = new createjs.Bitmap("images/reels/" + spinResult[index] + ".png");
            reelContainers[index].addChild(tiles[index]);
        }

    }
    else {
        alert("Please enter a valid bet amount");
    }

}

//when the user wants to restart the game over
function resetButtonClicked(event: createjs.MouseEvent) {

    resetFruitTally();
    resetAll();
    main();
}

//when the user wants to exit the game
function powerButtonClicked(event: createjs.MouseEvent) {

    window.close();
}

//enables user to increase th bet money
function betIncButtonClicked(event: createjs.MouseEvent) {

    if (playerBet >= playerMoney)
        alert("You are not allowed to bet more than this.");
    else {
        playerBet = playerBet + 10;
        gameLoop();
    }
}

//enables user to decrease th bet money
function betDecButtonClicked(event: createjs.MouseEvent) {

    if (playerBet <= 10)
        alert("You are not allowed to bet bellow this.");
    else {
        playerBet = playerBet - 10;
        gameLoop();
    }
}

//this will enable user to bet the lowest amount at one spin
function betOneButtonClicked(event: createjs.MouseEvent) {

    playerBet = 10;
    spinResult = Reels();
    fruits = spinResult[0] + " - " + spinResult[1] + " - " + spinResult[2];

    determineWinnings();
    turn++;

    // Iterate over the number of reels
    for (var index = 0; index < NUM_REELS; index++) {
        reelContainers[index].removeAllChildren();
        tiles[index] = new createjs.Bitmap("images/reels/" + spinResult[index] + ".png");
        reelContainers[index].addChild(tiles[index]);
    }
}

//this will enable user to bet the highest amount which is total money of user in this case on single spin
function betMaxButtonClicked(event: createjs.MouseEvent) {

    playerBet = playerMoney;
    spinResult = Reels();
    fruits = spinResult[0] + " - " + spinResult[1] + " - " + spinResult[2];

    determineWinnings();
    turn++;

    // Iterate over the number of reels
    for (var index = 0; index < NUM_REELS; index++) {
        reelContainers[index].removeAllChildren();
        tiles[index] = new createjs.Bitmap("images/reels/" + spinResult[index] + ".png");
        reelContainers[index].addChild(tiles[index]);
    }
}



//To generate the user interface of the game
function createUI() {

    background = new createjs.Bitmap("images/slot_machine_face.png");
    game.addChild(background); // Add the background to the game container

    //var can_pos = document.getElementById('canvas');


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
    betMaxButton.getImage().addEventListener("click", betMaxButtonClicked);


    // Bet One Button
    betOneButton = new Button("images/bet_one.png", 195, 470);
    game.addChild(betOneButton.getImage());
    betOneButton.getImage().addEventListener("click", betOneButtonClicked);


    // Reset Button
    resetButton = new Button("images/reset.png", 100, 470);
    game.addChild(resetButton.getImage());
    resetButton.getImage().addEventListener("click", resetButtonClicked);

    // Power Button
    powerButton = new Button("images/power.png", 5, 470);
    game.addChild(powerButton.getImage());
    powerButton.getImage().addEventListener("click", powerButtonClicked);

    // Bet increase Button
    betIncButton = new Button("images/arrow_up.png", 270, 420);
    game.addChild(betIncButton.getImage());
    betIncButton.getImage().addEventListener("click", betIncButtonClicked);

    // Bet decrease Button
    betDecButton = new Button("images/arrow_down.png", 320, 420);
    game.addChild(betDecButton.getImage());
    betDecButton.getImage().addEventListener("click", betDecButtonClicked);

}


function main() {
    game = new createjs.Container(); // Instantiates the Game Container

    createUI();
 
    stage.addChild(game); // Adds the Game Container to the Stage
    

}





