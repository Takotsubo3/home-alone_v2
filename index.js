const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');
// const { BodyMixin } = require('undici-types');

let mon_serveur;
let port;

// Configure Nunjucks to use the `views` folder
nunjucks.configure(path.join(__dirname, 'views'), {
  autoescape: true,
  noCache: true, // Disable caching...
});

function loadMessages() {
  const filePath = path.join(__dirname, 'data', 'hints.json');
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }
  return {};
}

const staticDir = __dirname;

// FONCTION DE CALLBACK APPELLEE POUR CHAQUE REQUETE
const traite_requete = function (req, res) {
  'use strict';
  const requete = url.parse(req.url, true);
  const pathname = requete.pathname;

  console.log('URL reçue : ' + req.url);

  try {
    // Serve static files
    const filePath = path.join(staticDir, pathname);
    const extname = path.extname(filePath);

    const contentTypeMap = {
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.html': 'text/html',
    };

    const contentType = contentTypeMap[extname] || 'text/html';

    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    // Dynamic Routes with Nunjucks
    if (pathname.includes('cardflip')) {
      const cards = [
        { i: 0, id: 'image1',  image: '/teddy_1.png' },
        {i: 1, id: 'image1', image: '/teddy_2.png' },
        {i: 2, id: 'image2', image: '/knife_1.png' },
        { i: 3,id: 'image2', image: '/knife_2.png' },
        {i: 4, id: 'image3', image: '/key_1.png' },
        { i: 5,id: 'image3', image: '/key_2.png' },
        { i: 6,id: 'image4', image: '/notebook_1.png' },
        {i: 7, id: 'image4', image: '/notebook_2.png' },
        { i: 8,id: 'image5', image: '/mirror.png' },
      ];

      let allCardsMatched = true;
      // Load win message from JSON file
      const messages = loadMessages();
      const winMessage = allCardsMatched ? messages.cardflip : '';

      const shuffledCards = [...cards].sort(
        () => Math.random() - 0.5
      );

      const renderedHtml = nunjucks.render('cardflip.njk', {
        cards: shuffledCards,
        backgroundImage: '../../resources/gallery/Card_Game_Background.jpeg',
        winMessage,
      });

      const filePath = path.join(staticDir, 'kitchen/cardflip/cardflip.html');

      // Save the rendered HTML to a file
      fs.writeFile(filePath, renderedHtml, (err) => {
        if (err) {
          console.error('Error writing file:', err);
          res.writeHead(500, { 'Content-Type': 'text/html' });
          res.end('<h1>500 Internal Server Error</h1>');
          return;
        }
        console.log(`Rendered HTML saved to ${filePath}`);
      });

      // Serve the rendered HTML to the browser
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(renderedHtml);
      return;
    }

    // Redirect root path "/" to "/home/home.html"
    if (pathname === '/') {
      res.writeHead(302, { Location: '/home/home.html' });
      res.end();
      return;
    }

    // Handle 404 for non-existing files or routes
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Not Found</h1>');
  } catch (e) {
    console.error('Erreur : ', e.stack);
    console.error('Erreur : ', e.message);
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end('<h1>500 Server Error</h1>');
  }
};

// CREATION ET LANCEMENT DU SERVEUR
(function () {
  'use strict';
  mon_serveur = http.createServer(traite_requete);
  port = 5000;

  // Log the localhost URL
  mon_serveur.listen(port, () => {
    console.log(`Serveur en écoute sur : http://localhost:${port}`);
  });
})();
