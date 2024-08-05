var car = document.getElementById('carimg');

var drivingSurface = document.querySelector('.driving-surface');

const road = document.getElementById('road');

const startButton = document.getElementById('start');
const returnButton = document.getElementById('return');
const easyButton = document.getElementById('easy');
const mediumButton = document.getElementById('medium');
const hardButton = document.getElementById('hard');
const expertButton = document.getElementById('expert');
const rulesButton = document.getElementById('rules');
const rulesReturnButton = document.getElementById('rules-return');
const restartButton = document.getElementById('restart');

const startContainer = document.getElementById('start-container');
const rulesContainer = document.getElementById('rules-container');
const gameContainer = document.getElementById('game-container');
const stopContainer = document.getElementById('stop-container');
const pauseContainer = document.getElementById('pause-container');

const EASY = 3000;
const MEDIUM = 2200;
const HARD = 1700;
const EXPERT = 1000;

var stopParam = 0;
var score = 0;
let carRadius = 35;
var carPosition = window.innerWidth / 2 - 15;

var isPlaying = false;
var isMovingLeft = false;
var isMovingRight = false;
var isPaused = false;
var isStarted = false;

var opponentInterval;
var scoreInterval;
var collisionInterval;

let initialAnimationDuration = 6;

var level = EASY;

/**
 * Event listeners for the various buttons in the game.
 */
easyButton.addEventListener('click', () => {
    level = EASY;
    easyButton.style.backgroundColor = "lightcoral";
    mediumButton.style.backgroundColor = "grey";
    hardButton.style.backgroundColor = "grey";
    expertButton.style.backgroundColor = "grey";

});

mediumButton.addEventListener('click', () => {
    level = MEDIUM;
    easyButton.style.backgroundColor = "grey";
    mediumButton.style.backgroundColor = "lightcoral";
    hardButton.style.backgroundColor = "grey";
    expertButton.style.backgroundColor = "grey";
});

hardButton.addEventListener('click', () => {
    level = HARD;
    easyButton.style.backgroundColor = "grey";
    mediumButton.style.backgroundColor = "grey";
    hardButton.style.backgroundColor = "lightcoral";
    expertButton.style.backgroundColor = "grey";
});

expertButton.addEventListener('click', () => {
    level = EXPERT;
    easyButton.style.backgroundColor = "grey";
    mediumButton.style.backgroundColor = "grey";
    hardButton.style.backgroundColor = "grey";
    expertButton.style.backgroundColor = "lightcoral";
}); 

rulesButton.addEventListener('click', () => {
    startContainer.classList.add('hidden');
    rulesContainer.classList.remove('hidden');
});

rulesReturnButton.addEventListener('click', () => {
    rulesContainer.classList.add('hidden');
    startContainer.classList.remove('hidden');
});

returnButton.addEventListener('click', () => {
    location.reload();
});

restartButton.addEventListener('click', () => {
    location.reload();
});

document.addEventListener('keydown', function(event) {
    if (!isStarted) {
        isStarted = true;
        startContainer.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        updateCarPosition();
        startGame(level);
    }
    
});

/**
 * Starts the game starting various functions needed for updating the view.
 */
function startGame(frequency) {

    isPlaying = true;
    scoreInterval = setInterval(updateScore, 500);
    setInterval(checkPaused, 100);
    collisionInterval = setInterval(checkCollisions, 100);
    
    carInterval = setInterval(function() {createOpponents(0);}, frequency);    

    document.addEventListener('keydown', (e) => {
        if (!isPaused) {
            // Checking if left arrow has been hit
            if (e.key == 'ArrowLeft') {
                isMovingLeft = true;
                car.style.transform = 'rotate(-15deg)';
                moveLeft();
            }
            // Checking if left arrow has been hit
            if (e.key == 'ArrowRight') {
                isMovingRight = true;
                car.style.transform = 'rotate(15deg)';

                moveRight();
                
            } 
        }
        // Checking if space has been hit 
        if (e.code == 'Space') {
            pauseGame();
        }  
    }); 

    document.addEventListener('keyup', (e) => {
        if (!isPaused) {
            if (e.key == 'ArrowLeft') {
                isMovingLeft = false;
                car.style.transform = 'rotate(0deg)';
            }
            if (e.key == 'ArrowRight') {
                isMovingRight = false;
                car.style.transform = 'rotate(0deg)';
            }
        }
    });
}

/**
 * Will update the score view if the game is not paused
 */
function updateScore() {
    if (!isPaused) {
        document.getElementById('score').innerHTML = "Score = " + score++;
    }
}

/**
 * Logic to show the stop screen after 3 car hits
 */
function showStopScreen() {
    stopParam++;

    if (stopParam >= 3) {
 
        const opponents = document.querySelectorAll('.opponent');

        opponents.forEach(opponent => {
            opponent.style.display = 'none';
        });
        clearInterval(opponentInterval);   
        clearInterval(collisionInterval);  
        clearInterval(scoreInterval)  
        clearInterval(carInterval);     
        gameContainer.classList.add('hidden');
        stopContainer.classList.remove('hidden');
        document.getElementById('final-score').innerHTML = "Score = " + score;

    }
    flashScreen();
}

/**
 * The screen will flash red when a car is hit
 */
function flashScreen() {
    const screenOverlay = document.createElement('div');
    screenOverlay.className = 'screen-overlay';

    document.body.append(screenOverlay);
    
    setTimeout(function () {
        screenOverlay.remove();
    }, 250);
}

/**
 * To update the cars position globally
 */
function updateCarPosition() {
    car.style.left = carPosition;
}

/**
 * Logic to move the car left
 */
function moveLeft() {
    if (carPosition > drivingSurface.offsetLeft && isMovingLeft) {
        carPosition -= 5;
        updateCarPosition();
        requestAnimationFrame(moveLeft);
    } 
}

/**
 * Logic to move the car right
 */
function moveRight() {
    if (carPosition < drivingSurface.offsetLeft + drivingSurface.offsetWidth - carRadius && isMovingRight) {
        carPosition += 5;
        updateCarPosition();
        requestAnimationFrame(moveRight);
    } 
}

/**
 * Changing the global pause variable
 */
function pauseGame() {
    isPaused = !isPaused; 
}

/**
 * Logic to stop and start all animation on the screen hwen the game is paused or unpaused
 */
function checkPaused() {
    if (isPlaying && isPaused) {
        road.style.animationPlayState = 'paused';
        const opponents = document.querySelectorAll('.opponent');
        opponents.forEach(opponent => {
            opponent.style.animationPlayState = 'paused';
        });
        pauseContainer.classList.remove('hidden');

    } else {
        road.style.animationPlayState = '';
        const opponents = document.querySelectorAll('.opponent');
        opponents.forEach(opponent => {
            opponent.style.animationPlayState = '';
        });
        pauseContainer.classList.add('hidden');
    }
}

/**
 * Logic to check collisions between car and opponents
 */
function checkCollisions() {
    var opponentBoxes = document.querySelectorAll('.opponent');
    
    // Makes a bounding box for the car
    var carRectangle = car.getBoundingClientRect();

    carRectangle.width = 30;
    carRectangle.height = 60;
    
    opponentBoxes.forEach(function (opponent) {
        // Makes a bounding box for each opponent
        var opponentRectangle = opponent.getBoundingClientRect();
        

        opponentRectangle.width = 30;
        opponentRectangle.height = 60;

        // Checking f0r collisions on all sides of the object
        if (
            carRectangle.x < opponentRectangle.x + opponentRectangle.width &&
            carRectangle.x + carRectangle.width > opponentRectangle.x &&
            carRectangle.y < opponentRectangle.y + opponentRectangle.height &&
            carRectangle.y + carRectangle.height > opponentRectangle.y
        ) {
            isPlaying = false;
            showStopScreen();
        }     
    });
}

/**
 * Returns a random top length
 */
function getRandomTop() {
    return Math.random() * window.innerHeight - window.innerHeight;
}

/**
 * Creates the cars based on their frequency and locations
 */
function createOpponents(frequency) {

    if (!isPaused) {
        let opponentArray = generateRandomNumberArray(frequency);

        opponentArray.forEach((val, index) => {
            let randomCarNum = Math.floor(Math.random() * 4);

            
            const opponent = document.createElement('div');
            opponent.className = 'opponent';
            
            // Randomly pick a car to create
            switch (randomCarNum) {
                case 0:
                    opponent.style.backgroundImage = 'url(content/opponentTruck.png)';
                    break;
                case 1:
                    opponent.style.backgroundImage = 'url(content/opponentCar.png)';
                    break;
                case 2:
                    opponent.style.backgroundImage = 'url(https://openclipart.org/image/800px/218066)';
                    break;
                case 3:
                    opponent.style.backgroundImage = 'url(https://openclipart.org/image/800px/218071)';
                    break;
                default:
                    opponent.style.backgroundImage = 'url(content/opponentCar.png)';
            }
            opponent.style.left = `${val}`;
            opponent.style.top = `${getRandomTop()}px`;
            initialAnimationDuration -= 0.05;
            if (initialAnimationDuration < 0) {
                initialAnimationDuration = 0;
            }
            opponent.style.animationDuration = `${initialAnimationDuration}s`;
            document.body.appendChild(opponent);
            removeOpponents(opponent);
        }); 
    }
     
}

/**
 * Once the cars have left the screen, they are to be removed 
 */
function removeOpponents(opponent) {
    opponent.addEventListener('animationiteration', function handleIteration() {
        opponent.removeEventListener('animationiteration', handleIteration);
        opponent.remove();
    });

}

/**
 * Returns an array of frequency length that has random left lengths of the cars 
 */
function generateRandomNumberArray(frequency) {
    const randArray = [];
    var i = drivingSurface.offsetLeft;
    var j = 0;

    while (i < (drivingSurface.offsetLeft + drivingSurface.offsetWidth) - carRadius) {
        randArray[j] = i;
        i += 40;
        j++;
    }
    
    for (let k = frequency - 1; k > 0; k--) {
        const r = Math.floor(Math.random() * (k + 1));
        const temp = randArray[i];
        randArray[k] = randArray[r];
        randArray[r] = temp;
    }
    
    return randArray;
}