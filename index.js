const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const { renderCardflip } = require('./minigames/cardflip/cardflip.module');

const staticDir = __dirname;

// Handle Requests
const traite_requete = function (req, res) {
  const requete = url.parse(req.url, true);
  const pathname = requete.pathname;

  console.log('URL reçue : ' + req.url);

  try {
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

    // Route for cardflip game
    if (pathname === '/minigames/cardflip') {
      const renderedHtml = renderCardflip();
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(renderedHtml);
      return;
    }

    if (pathname === '/') {
      res.writeHead(302, { Location: '/home/home.html' });
      res.end();
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Not Found</h1>');
  } catch (e) {
    console.error('Erreur : ', e.stack);
    console.error('Erreur : ', e.message);
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end('<h1>500 Server Error</h1>');
  }
};

// Start Server
(function () {
  'use strict';
  const port = 5000;
  const server = http.createServer(traite_requete);
  server.listen(port, () => {
    console.log(`Serveur en écoute sur : http://localhost:${port}`);
  });
})();
