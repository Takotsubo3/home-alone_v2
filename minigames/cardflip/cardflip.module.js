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

// Render Cardflip Page
function renderCardflip() {
  const cards = [
    { i: 0, id: 'image1', image: 'cardflip/assets/teddy_1.png' },
    { i: 1, id: 'image1', image: 'cardflip/assets/teddy_2.png' },
    { i: 2, id: 'image2', image: 'cardflip/assets/knife_1.png' },
    { i: 3, id: 'image2', image: 'cardflip/assets/knife_2.png' },
    { i: 4, id: 'image3', image: 'cardflip/assets/key_1.png' },
    { i: 5, id: 'image3', image: 'cardflip/assets/key_2.png' },
    { i: 6, id: 'image4', image: 'cardflip/assets/notebook_1.png' },
    { i: 7, id: 'image4', image: 'cardflip/assets/notebook_2.png' },
    { i: 8, id: 'image5', image: 'cardflip/assets/mirror.png' },
  ];

  const shuffledCards = [...cards].sort(() => Math.random() - 0.5);

  const messages = loadMessages();
  const headerMessage = messages.cardflip;

  const renderedHtml = nunjucks.render('cardflip.njk', {
    cards: shuffledCards,
    backgroundImage: 'cardflip/assets/card_game_background.jpeg',
    headerMessage,
  });

  return renderedHtml;
}

module.exports = { renderCardflip };
