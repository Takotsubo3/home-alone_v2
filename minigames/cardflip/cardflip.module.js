const path = require('path');
const fs = require('fs');
const nunjucks = require('nunjucks');

// const theMessage = loadMessages();
// console.log(theMessage);


// Configure Nunjucks
nunjucks.configure(path.join(__dirname), {
  autoescape: true,
  noCache: true,
});

// Load hint message from json file
function loadMessages() {
  const filePath = path.join(__dirname, 'data', 'hints.json');
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }
  return {};
}

function shuffledCards(myArray) {
  // Fisher-Yates Shuffle method
  for (let i = myArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index generated
    [myArray[i], myArray[j]] = [myArray[j], myArray[i]]; // Swap elements (index)
  }
  return myArray;
}

// Render Cardflip Page to insert cards...
function renderCardflip() {

  // myArray of cards 
  const uniqueCards = [
    { id: '1', image: 'cardflip/assets/teddy_1.png' },
    { id: '2', image: 'cardflip/assets/knife_1.png' },
    { id: '3', image: 'cardflip/assets/key_1.png' },
    { id: '4', image: 'cardflip/assets/notebook_1.png' },
    { id: '5', image: 'cardflip/assets/mirror.png' },
    { id: '6', image: 'cardflip/assets/knife_2.png' },
  ];

  //Array of cards shuffled 2 times 
  const cards = shuffledCards([...uniqueCards, ...uniqueCards]);

  // Load hint messages
  const messages = loadMessages();
  const winMessage = messages.cardflip || '';

  // Render the HTML using Nunjucks
  const renderedHtml = nunjucks.render('cardflip.njk', {
    cards, //Array of cards
    backgroundImage: 'cardflip/assets/card_game_background.jpeg',
    // winMessage,
  });

  return renderedHtml;
}

module.exports = { renderCardflip };
