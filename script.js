let tileDisplay = document.querySelector(".tile-cont");
let keyboard = document.querySelector(".key-cont");
let messageDisplay = document.querySelector(".message-cont");

let word = wordle[Math.floor(Math.random() * wordle.length)];

const keys = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S",
"D", "F", "G", "H", "J", "K", "L", "ENTER", "Z", "X", "C", "V", "B", "N", "M", "<<"];

const guessRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
];

let currRow = 0;
let currTile = 0;
let isGameOver = false;

guessRows.forEach((guessRow, guessRowIndex) => {
    let rowElement = document.createElement("div");
    rowElement.setAttribute("id", 'guessRow-' + guessRowIndex);
    guessRow.forEach((guess, guessIndex) => {
        let tileElement = document.createElement("div");
        tileElement.setAttribute("id", 'guessRow-' + guessRowIndex + '-tile-' + guessIndex);
        tileElement.classList.add('tile');
        rowElement.append(tileElement);
    });
    tileDisplay.append(rowElement);
}) 

keys.forEach(key => {
    let buttonEle = document.createElement("button");
    buttonEle.textContent = key;
    buttonEle.setAttribute("id", key);
    buttonEle.addEventListener("click", () => handleClick(key));
    keyboard.append(buttonEle);
})

let handleClick = (key) => {
    console.log("clicked", key);
    if (key === '<<') {
        deleteLetter();
        console.log("delete letter");
        return;
    }
    else if (key === "ENTER") {
        checkRow();
        console.log("Check row");
    }
    else {
        addLetter(key);
    }
}

let addLetter = (letter) => {
    if (currTile < 5 && currRow < 6) {
        let tile = document.getElementById('guessRow-' + currRow + '-tile-' + currTile);
        tile.textContent = letter;
        guessRows[currRow][currTile] = letter;
        tile.setAttribute('data', letter);
        currTile++;
    }
}

let deleteLetter = () => {
    if (currTile > 0) {
        currTile--;
        let tile = document.getElementById('guessRow-' + currRow + '-tile-' + currTile);
        tile.textContent = '';
        guessRows[currRow][currTile] = '';
        tile.setAttribute('data', '');
    }
}

function checkRow() {
    const guess = guessRows[currRow].join('');
    if (currTile > 4) {
        console.log(guess);
        flipTile();
        if (word == guess) {
            showMessage("Magnificent!");
            isGameOver = true;
            return;
        }
        else {
            if (currRow >= 5) {
                isGameOver = false;
                showMessage("Game over");
                return;
            }
            if (currRow < 5) {
                currRow++;
                currTile = 0;
            }
        }
    }
}

function showMessage(message) {
    let messageEle = document.createElement("p");
    messageEle.textContent = message;
    messageDisplay.append(messageEle);
    setTimeout(() => messageDisplay.removeChild(messageEle), 4000);
    if(message == "Game over") {
        let messageEnd = document.createElement("p");
        messageEnd.textContent = "The correct word was " + word;
        setTimeout(() => messageDisplay.append(messageEnd), 4400);
        return;
    }
}

function addColorToKey(keyLetter, color) {
    let key = document.getElementById(keyLetter);
    key.classList.add(color);
}

let flipTile = () => {
    const rowTiles = document.querySelector('#guessRow-' + currRow).childNodes;
    let checkWordle = word;
    let guess = [];

    rowTiles.forEach(tile => {
        guess.push({letter: tile.getAttribute("data"), color: "grey-overlay"});
    })

    guess.forEach((guess, index) => {
        if (guess.letter == word[index]) {
            guess.color = "green-overlay";
            checkWordle = checkWordle.replace(guess.letter, "");
        }
    })

    guess.forEach(guess => {
        if (checkWordle.includes(guess.letter)) {
            guess.color = "yellow-overlay";
            checkWordle = checkWordle.replace(guess.letter, "");
        }
    })

    rowTiles.forEach((tile, index) => {
        setTimeout(() => {
           tile.classList.add("flip");
           tile.classList.add(guess[index].color);
           addColorToKey(guess[index].letter, guess[index].color);
        }, 500*index);
    })
}