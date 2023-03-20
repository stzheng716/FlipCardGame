"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];

const colors = shuffle(COLORS);

const startBtn = document.querySelector("#start");
startBtn.addEventListener("click", function () {
  createCards(colors);
  //added this so that start couldn't be called multiple times
  this.remove()
})

const resetBtn = document.createElement("button");
resetBtn.innerText = "RESET"
resetBtn.addEventListener("click", function () {
  reset();
})

const body = document.querySelector("body");
const gameBoard = document.getElementById("game");

let SCORE = 0;
let MATCHES = 0;
const score = document.querySelector("h2");




/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

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
    card.classList.add(color)
    gameBoard.append(card)
    card.addEventListener("click", function (evt) {
      if (FIRSTCARD === undefined && SECONDCARD === undefined) {
        FIRSTCARD = handleCardClick(evt)
      } else if (SECONDCARD === undefined && FIRSTCARD !== card) {
        SECONDCARD = handleCardClick(evt)
        if (FIRSTCARD.className !== SECONDCARD.className) {
          setTimeout(() => {
            unFlipCard(FIRSTCARD);
            unFlipCard(SECONDCARD);
            cardReset();
          }, FOUND_MATCH_WAIT_MSECS)
        } else {
          matches()
        }
      }
    })
  }
}

/** Flip a card face-up. */

function flipCard(card) {
  score.innerText = ++SCORE;
  card.style.backgroundColor = card.className;
}

/** Flip a card face-down. */

function unFlipCard(card) {
  card.style.backgroundColor = 'white'
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

function matches() {
  MATCHES += 2
  if (MATCHES === COLORS.length) {
    console.log("you win!")
    body.append(resetBtn)
  }
  cardReset()
}

function reset() {
  body.append(startBtn)
  gameBoard.innerHTML = ""
  SCORE = 0;
  MATCHES = 0;
  score.innerText = SCORE;
  resetBtn.remove();
}