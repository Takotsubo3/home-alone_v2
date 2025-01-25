'use strict';

const cards = document.querySelectorAll('.memory-card');
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchedPairs = 0;
const totalPairs = cards.length / 2;

function flipCard() {
  if (lockBoard || this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    // First card clicked
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  // Second card clicked
  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  isMatch ? handleMatch() : unflipCards();
}

function handleMatch() {
  // Disable click events for matched cards
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  matchedPairs++; // Increment matched pairs counter

  if (matchedPairs === totalPairs) {
    // All pairs matched
    handleGameWin();
  }

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 800);
}

function resetBoard() {
  [hasFlippedCard, lockBoard, firstCard, secondCard] = [
    false,
    false,
    null,
    null,
  ];
}

function handleGameWin() {
  // Display win message
  const winMessageElement = document.createElement('div');
  winMessageElement.textContent = 'Congratulations! You matched all the cards!';
  winMessageElement.classList.add('win-message');

  // Insert above the memory game section
  const memoryGame = document.querySelector('.memory-game');
  memoryGame.parentElement.insertBefore(winMessageElement, memoryGame);
}

// Attach click event listener to each card
cards.forEach((card) => card.addEventListener('click', flipCard));

function showPopup() {
  const popup = document.getElementById('popupContainer');
  if (popup) {
    popup.style.display = 'flex';
  }
}

function hidePopup() {
  const popup = document.getElementById('popupContainer');
  if (popup) {
    popup.style.display = 'none';
  }
}
