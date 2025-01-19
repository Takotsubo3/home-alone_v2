const fs = require("fs");
const path = require("path");
const nunjucks = require("nunjucks");

nunjucks.configure(__dirname, { autoescape: true });

const USER_DATA_FILE = path.join(__dirname, "userData.json");

// Helper function to load saved state
function loadGameState() {
    if (fs.existsSync(USER_DATA_FILE)) {
        return JSON.parse(fs.readFileSync(USER_DATA_FILE, "utf8"));
    }
    return { completed: false, pieces: [] };
}

// Handler for saving the game completion state
function handle_completion(req, res) {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
        try {
            const { pieces } = JSON.parse(body);
            const userData = { completed: true, pieces }; // Save state

            fs.writeFileSync(USER_DATA_FILE, JSON.stringify(userData, null, 2));

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Puzzle completed successfully!" }));
        } catch (e) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Failed to save game state." }));
        }
    });
}

// Serve saved game state when requested
function getPuzzleState(req, res) {
    const userData = loadGameState();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(userData));
}

module.exports = { handle_completion, getPuzzleState };
