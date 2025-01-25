'use strict';

let passingData;

const cards = document.querySelectorAll('.memory-card');
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchedPairs = 0;
const totalPairs = cards.length / 2;

let hintButton = document.getElementById('hint-button');
// hintButton.style.visibility = 'hidden';

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

// function handleGameWin() {

// }

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

// function show() {
//   fetch('http://localhost:5000/minigames/cardflip/data/hints.json')
//     // .then (result => result.json())
//     // .then(console.log);
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       // passingData = data.cardFlip;
//       document.getElementById('theData').innerHTML += data.cardflip;
//       // console.log({passingData})
//     })
//     .catch(function (err) {
//       console.log(err);
//     });
//   let hintttt = document
//     .getElementById('theData')
//     .setAttribute('style', 'visibility:visible');

//   fetch('http://localhost:5000/inventory/inventory.json', {
//     method: 'POST',
//     body: JSON.stringify(data),
//     headers: {
//       'Content-type': 'application/json',
//     },
//   })
//     .then((response) => response.json())
//     .then((data) => console.log(data));
// }

function getHintMethod(button) {
  console.log('Button clicked');
  
  // Get the hintType value from the button's data-hint-type attribute
  const hintType = button.getAttribute('data-hint-type');
  console.log(hintType);

  // Construct the URL dynamically
  // const url = `/saveHint.js?hintType=${encodeURIComponent(hintType)}`; 
  const url ="http://localhost:5000/saveHint.js";
  console.log(url);
  window.location.href=url;
  window.location.reload(url);
};
