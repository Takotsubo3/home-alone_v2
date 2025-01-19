const path = require('path');
const fs = require('fs');
const nunjucks = require('nunjucks');

// Configure Nunjucks
nunjucks.configure(path.join(__dirname), {
  autoescape: true,
  noCache: true,
});

// Load hint messages
function loadMessages() {
  const filePath = path.join(__dirname, 'data', 'hints.json');
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }
  return {};
}

function shuffleArray(array) {
  // Fisher-Yates Shuffle method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

// Render Cardflip Page
function renderCardflip() {
  // Array of unique card data
  const uniqueCards = [
    { id: '1', image: 'cardflip/assets/teddy_1.png' },
    { id: '2', image: 'cardflip/assets/knife_1.png' },
    { id: '3', image: 'cardflip/assets/key_1.png' },
    { id: '4', image: 'cardflip/assets/notebook_1.png' },
    { id: '5', image: 'cardflip/assets/mirror.png' },
    { id: '6', image: 'cardflip/assets/knife_2.png' },
  ];

  const cards = shuffleArray([...uniqueCards, ...uniqueCards]);

  // Load hint messages
  const messages = loadMessages();
  const winMessage = messages.cardflip || '';

  // Render the HTML using Nunjucks
  const renderedHtml = nunjucks.render('cardflip.njk', {
    cards,
    backgroundImage: 'cardflip/assets/card_game_background.jpeg',
    winMessage,
  });

  return renderedHtml;
}

module.exports = { renderCardflip };
