"use strict";

const fs = require("fs");
const nunjucks = require("nunjucks");

nunjucks.configure(__dirname, { autoescape: true });

const USER_DATA_FILE = "./userData.json";

function req_puzzle(req, res) {
    let userData;

    // Read or initialize the user's game status
    try {
        userData = JSON.parse(fs.readFileSync(USER_DATA_FILE, "utf-8"));
    } catch (e) {
        // If the JSON file doesn't exist, create it with default values
        userData = { completed: false };
        fs.writeFileSync(USER_DATA_FILE, JSON.stringify(userData, null, 2));
    }

    // Render the puzzle page, passing the game completion status
    const html = nunjucks.render("puzzle.html", {
        completed: userData.completed,
    });

    // Respond with the rendered HTML
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(html);
    res.end();
}

module.exports = req_puzzle;
