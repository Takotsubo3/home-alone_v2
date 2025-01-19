"use strict";
const req_static = require("./req_static.js");
const req_puzzle = require("./req_puzzle.js");
//const handle_completion = require("./handle_completion.js");
const { handle_completion, getPuzzleState } = require("./handle_completion.js");


const fs = require("fs");
const http = require("http");
const url = require("url");
const nunjucks = require("nunjucks");

nunjucks.configure(__dirname, { autoescape: true });


// --- Main server function (router) ---
function traiter_requete(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (pathname === "/") {
        res.writeHead(302, { Location: "/puzzle" });
        res.end();
    } else if (pathname === "/puzzle") {
        req_puzzle(req, res);
    } else if (pathname === "/complete-puzzle" && req.method === "POST") {
        handle_completion(req, res);
    } else if (pathname === "/puzzle-state" && req.method === "GET") {
        getPuzzleState(req, res); // Return saved puzzle state
    } else {
        req_static(res, pathname);
    }
}

// Create and start the HTTP server
const server = http.createServer(traiter_requete);
const PORT = 4000; 
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
