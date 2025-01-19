'use strict';

const cards = document.getElementsByClassName('memory-card');

let flipped = false;
let firstCard = null;
let secondCard = null;
let lock = false;
let matchedPairs = 0;
const totalPairs = cards.length / 2;

const flipCard = function () {
  if (lock || this === firstCard) {
    return;
  }

  this.classList.add('flip');

  if (!flipped) {
    // First card flipped
    flipped = true;
    firstCard = this;
  } else {
    // Second card flipped
    secondCard = this;
    lock = true;

    // Check for match
    if (firstCard.dataset.framework === secondCard.dataset.framework) {
      handleMatch();
    } else {
      unflipCards();
    }
  }
};

Array.from(cards).forEach((card) => card.addEventListener('click', flipCard));

function handleMatch() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetCards();

  matchedPairs++;
  if (matchedPairs === totalPairs) {
    showWinMessage();
  }
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetCards();
  }, 300);
}

function resetCards() {
  [flipped, lock, firstCard, secondCard] = [false, false, null, null];
}

(function shuffleCards() {
  Array.from(cards).forEach((card) => {
    card.style.order = Math.floor(Math.random() * cards.length);
  });
})();

function showPopup() {
  document.getElementById('popupContainer').style.display = 'flex';
}

function hidePopup() {
  document.getElementById('popupContainer').style.display = 'none';
}
