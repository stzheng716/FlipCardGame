"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const numOfPairs = 12;
let SCORE = 0;
let MATCHES = 0;

const newDeck = [];
for (let i = 0; i < numOfPairs; i++) {
  newDeck.push(`img/card${i}.png`, `img/card${i}.png`)
}

const bestScore = localStorage.getItem("Best Score")
const score = document.createElement("h2");
const colors = shuffle(newDeck);
const startBtn = document.querySelector("#start");
const resetBtn = document.createElement("button");
resetBtn.innerText = "PLAY AGAIN"
const gameOverMsg = document.createElement("p");
const body = document.querySelector("body");
const gameBoard = document.getElementById("game");
const gameName = document.querySelector("h1");
const topScoreNum = document.querySelector("#topScore");
const topScoreEl = document.querySelector("#topScoreEl");

/* sets the best score on start screen **/
if (bestScore) {
  topScoreNum.innerHTML = bestScore;
}

startBtn.addEventListener("click", function () {
  startGame();
  gameName.remove();
  topScoreEl.remove();
  startBtn.remove();
})

resetBtn.addEventListener("click", function () {
  gameBoard.innerHTML = "";
  SCORE = 0;
  MATCHES = 0;
  startGame();
  gameOverMsg.remove();
  resetBtn.remove();
})



/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}


/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */

let FIRSTCARD, SECONDCARD;

function createCards(colors) {
  for (let color of colors) {
    const card = document.createElement("div");
    card.style.backgroundImage = `url("img/back.png")`;
    card.classList.add(color);
    gameBoard.append(card);
    card.addEventListener("click", function (evt) {
      if (FIRSTCARD === undefined && SECONDCARD === undefined && !card.className.includes('flipped')) {
        FIRSTCARD = handleCardClick(evt);
      } else if (SECONDCARD === undefined && FIRSTCARD !== card && !card.className.includes('flipped')) {
        SECONDCARD = handleCardClick(evt);
        if (FIRSTCARD.className !== SECONDCARD.className) {
          setTimeout(function() {
            unFlipCard(FIRSTCARD);
            unFlipCard(SECONDCARD);
            cardReset();
          }, FOUND_MATCH_WAIT_MSECS);
        } else {
          matches();
        }0
      }
    })
  }
}

/** Flip a card face-up. */

function flipCard(card) {
  score.innerText = ++SCORE;
  card.style.backgroundImage = `url("${card.className}")`;
  card.classList.toggle('flipped');
}

/** Flip a card face-down. */

function unFlipCard(card) {
  card.classList.toggle('flipped');
  card.style.backgroundImage = `url("img/back.png")`;
  // card.style.backgroundColor = 'white'
}

/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(evt) {
  flipCard(evt.target)
  return evt.target
}

/** reset the two cards to player selected */
function cardReset() {
  FIRSTCARD = undefined;
  SECONDCARD = undefined;
}

/** place cards to the gameboard and resets the game */
function startGame() {
  gameBoard.append(score)
  score.innerText = SCORE;
  shuffle(newDeck);
  createCards(colors);
}

/** determine if all cards are flipped and if its a new best score */
function matches() {
  MATCHES += 2
  if (MATCHES === newDeck.length) {
    if (SCORE < bestScore || bestScore === null) {
      localStorage.setItem("Best Score", SCORE)
      gameOverMsg.innerText = `NEW BEST SCORE ${SCORE}`
    } else {
      gameOverMsg.innerText = `Your score was ${SCORE}, the best score was ${bestScore}`
    }
    body.append(gameOverMsg)
    const resetDiv = document.createElement("div");
    resetDiv.append(resetBtn)
    body.append(resetDiv)
  }
  cardReset()
}


//TODO LIST
//deploy the add on aws S3