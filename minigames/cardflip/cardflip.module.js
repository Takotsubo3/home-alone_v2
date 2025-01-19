const path = require('path');
const nunjucks = require('nunjucks');
const fs = require('fs');

// Configure Nunjucks to look for templates in the current directory
nunjucks.configure(__dirname, {
  autoescape: true,
  noCache: true,
});

// Utility to load messages
function loadMessages() {
  const filePath = path.join(__dirname, 'data', 'hints.json');
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }
  return {};
}

// Render function for Cardflip game
function renderCardflip() {
  const cards = [
    { i: 0, id: 'image1', image: '/teddy_1.png' },
    { i: 1, id: 'image1', image: '/teddy_2.png' },
    { i: 2, id: 'image2', image: '/knife_1.png' },
    { i: 3, id: 'image2', image: '/knife_2.png' },
    { i: 4, id: 'image3', image: '/key_1.png' },
    { i: 5, id: 'image3', image: '/key_2.png' },
    { i: 6, id: 'image4', image: '/notebook_1.png' },
    { i: 7, id: 'image4', image: '/notebook_2.png' },
    { i: 8, id: 'image5', image: '/mirror.png' },
  ];

  const shuffledCards = [...cards].sort(() => Math.random() - 0.5);

  const messages = loadMessages();
  const allCardsMatched = true; // Adjust this condition based on the game logic
  const winMessage = allCardsMatched ? messages.cardflip : '';

  // Render the Nunjucks template
  const renderedHtml = nunjucks.render('cardflip.njk', {
    cards: shuffledCards,
    backgroundImage: '../../resources/gallery/Card_Game_Background.jpeg',
    winMessage,
  });

  return renderedHtml;
}

module.exports = {
  renderCardflip
};