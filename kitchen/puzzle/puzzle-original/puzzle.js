"use strict";

const PUZZLE_SIZE = 2;

let img;
let pieces;
let mouse;
let currentPiece;
let currentDropPiece;
// dimensions of the puzzle which will be calculated based on the number of pieces (PUZZLE_SIZE) and their dimensions
let puzzleWidth;
let puzzleHeight;
//dimensions of each puzzle piece
let pieceWidth;
let pieceHeight;
//Refer to the HTML canvas element where the puzzle pieces will be drawn
let puzzleCanvas; 
let puzzleStage;

//INITIALIZATION

//calculate the dimension of each puzzle piece
function onImage() {
    pieceWidth = Math.floor(img.width / PUZZLE_SIZE);
    pieceHeight = Math.floor(img.height / PUZZLE_SIZE);
    puzzleWidth = pieceWidth * PUZZLE_SIZE;
    puzzleHeight = pieceHeight * PUZZLE_SIZE;

    setCanvas();
    initPuzzle();
}

function setCanvas() {
    puzzleCanvas = document.getElementById('canvas');
    puzzleStage = puzzleCanvas.getContext('2d');
    //make the canvas dimensions matching the size of the puzzle calculated in onImage
    puzzleCanvas.width = puzzleWidth;
    puzzleCanvas.height = puzzleHeight;
}

//PUZZLE INITIALIZATION
//VERSION WORKS 
function initPuzzle() {
    pieces = [];
    mouse = { x: 0, y: 0 };
    currentPiece = null;
    currentDropPiece = null;

    // Draw the full puzzle image on the canvas
    puzzleStage.drawImage(img,
        0, 0, puzzleWidth, puzzleHeight, // top-left corner of the image (start point for cropping)
        0, 0, puzzleWidth, puzzleHeight); // Destination point for cropping

    // Split the image into puzzle pieces
    buildPieces();
    shufflePuzzle();
}

function buildPieces() {
    let piece;
    let xPos = 0;
    let yPos = 0;
    for (let i = 0; i < PUZZLE_SIZE * PUZZLE_SIZE; i++) {
        piece = { sx: xPos, sy: yPos };
        pieces.push(piece);
        xPos += pieceWidth;
        if (xPos >= puzzleWidth) {
            xPos = 0;
            yPos += pieceHeight;
        }
    }
}
//Exemple result of buildPieces :
//PUZZLE_SIZE = 2;
// puzzleWidth = 200; 
// puzzleHeight = 200; 
// pieceWidth = 100; 
// pieceHeight = 100; 
// Result in `pieces`:
// [
//   { sx: 0, sy: 0 },
//   { sx: 100, sy: 0 },
//   { sx: 0, sy: 100 },
//   { sx: 100, sy: 100 }
// ]

//Clear the entire canvas
function clearCanvas() {
    puzzleStage.clearRect(0, 0, puzzleWidth, puzzleHeight);
}

//SHUFFLE the array of pieces (shuffle the position of puzzle pieces)
function shufflePuzzle() {
    pieces = shuffleArray(pieces);
    drawPuzzle();
    document.onmousedown = onPuzzleClick;

     // Reset Winning message display 
    localStorage.removeItem("messageDisplayed");
}

//Loop through each shuffled piece and draw them in its current position
function drawPuzzle() {
    clearCanvas();
    let piece;
    let xPos = 0;
    let yPos = 0;
    for (let i = 0; i < pieces.length; i++) {
        piece = pieces[i];
        piece.xPos = xPos;
        piece.yPos = yPos;

        puzzleStage.drawImage(img,
            piece.sx, piece.sy,
            pieceWidth, pieceHeight,
            xPos, yPos,
            pieceWidth, pieceHeight);
        puzzleStage.strokeRect(xPos, yPos, pieceWidth, pieceHeight);
        xPos += pieceWidth;
        if (xPos >= puzzleWidth) {
            xPos = 0;
            yPos += pieceHeight;
        }
    }
}

//INTERACTIONS

function onPuzzleClick(e) {
    updateMousePosition(e);
    currentPiece = checkPieceClicked();

    if (currentPiece) {
        puzzleStage.clearRect(currentPiece.xPos, currentPiece.yPos, pieceWidth, pieceHeight);
        puzzleStage.save();
        puzzleStage.globalAlpha = 0.9;
        puzzleStage.drawImage(
            img,
            currentPiece.sx,
            currentPiece.sy,
            pieceWidth,
            pieceHeight,
            mouse.x - pieceWidth / 2,
            mouse.y - pieceHeight / 2,
            pieceWidth,
            pieceHeight
        );
        puzzleStage.restore();
        document.onmousemove = updatePuzzle;
        document.onmouseup = pieceDropped;
    }
}

//Updates mouse.x and mouse.y based on the event's coordinates relative to the canvas
function updateMousePosition(e) {
    const rect = puzzleCanvas.getBoundingClientRect(); // Get canvas position relative 
    //clientX - clientY get mouse's position relative to the viewport
    mouse.x = e.clientX - rect.left; 
    mouse.y = e.clientY - rect.top; 
}

//Loops through each piece in array to check if the mouse coordinates fall inside a piece's area 
//then RETURN the piece being clicked on
function checkPieceClicked() {
    let piece;
    for (let i = 0; i < pieces.length; i++) {
        piece = pieces[i];
        if (
            (mouse.x >= piece.xPos) &&
            (mouse.x <= piece.xPos + pieceWidth) &&
            (mouse.y >= piece.yPos) &&
            (mouse.y <= piece.yPos + pieceHeight)
        ) {
            return piece;
        }
    }
    return null;
}

//Track dragging state and redraw all puzzle pieces
function updatePuzzle(e) {
    currentDropPiece = null;
    updateMousePosition(e);
    clearCanvas();

    let piece;
    for (let i = 0; i < pieces.length; i++) {
        piece = pieces[i];
        if (piece === currentPiece) continue;

        puzzleStage.drawImage(
            img,
            piece.sx, piece.sy,
            pieceWidth, pieceHeight,
            piece.xPos, piece.yPos,
            pieceWidth, pieceHeight
        );
        puzzleStage.strokeRect(piece.xPos, piece.yPos, pieceWidth, pieceHeight);

        if (
            mouse.x >= piece.xPos &&
            mouse.x <= piece.xPos + pieceWidth &&
            mouse.y >= piece.yPos &&
            mouse.y <= piece.yPos + pieceHeight
        ) {
            currentDropPiece = piece;
            puzzleStage.save();
            puzzleStage.globalAlpha = 0.4;
            puzzleStage.fillRect(piece.xPos, piece.yPos, pieceWidth, pieceHeight);
            puzzleStage.restore();
        }
    }

    puzzleStage.save();
    puzzleStage.globalAlpha = 0.6;
    puzzleStage.drawImage(
        img,
        currentPiece.sx, currentPiece.sy,
        pieceWidth, pieceHeight,
        (mouse.x - pieceWidth / 2), (mouse.y - pieceHeight / 2),
        pieceWidth, pieceHeight
    );
    puzzleStage.restore();
    puzzleStage.strokeRect(
        mouse.x - pieceWidth / 2,
        mouse.y - pieceHeight / 2,
        pieceWidth,
        pieceHeight
    );
}

function pieceDropped() {
    //Stops tracking the mouse after the piece is dropped.
    document.onmousemove = null;
    document.onmouseup = null;

    //If the dragged piece (currentPiece) is dropped over another piece (currentDropPiece)
    //Swap their positions on the puzzle grid
    if (currentDropPiece) {
        let tmp = {
            xPos: currentPiece.xPos,
            yPos: currentPiece.yPos,
        };
        currentPiece.xPos = currentDropPiece.xPos;
        currentPiece.yPos = currentDropPiece.yPos;
        currentDropPiece.xPos = tmp.xPos;
        currentDropPiece.yPos = tmp.yPos;
    }
    resetPuzzleAndCheckWin();
}


//COMPLETION

function resetPuzzleAndCheckWin() {
    clearCanvas();

    let gameWin = true;
    let piece;

    for (let i = 0; i < pieces.length; i++) {
        piece = pieces[i];
        puzzleStage.drawImage(
            img,
            piece.sx, piece.sy,
            pieceWidth, pieceHeight,
            piece.xPos, piece.yPos,
            pieceWidth, pieceHeight
        );

        //Compares the current position (xPos, yPos) of the piece to its correct position (sx, sy) to verify if the puzzle is done
        if (piece.xPos !== piece.sx || piece.yPos !== piece.sy) {
            gameWin = false;
        } else {
            puzzleStage.strokeRect(piece.xPos, piece.yPos, pieceWidth, pieceHeight);
        }
    }

    if (gameWin) {
        clearPuzzleLines();
        displayCompletionMessage();
    }
}

//remove border lines to show full image
function clearPuzzleLines() {
    clearCanvas();
    for (let i = 0; i < pieces.length; i++) {
        const piece = pieces[i];
        puzzleStage.drawImage(
            img,
            piece.sx, piece.sy,
            pieceWidth, pieceHeight,
            piece.xPos, piece.yPos,
            pieceWidth, pieceHeight
        );
    }
}

function displayCompletionMessage() {
    if (localStorage.getItem("messageDisplayed")) {
        return;
    }

    fetch("/complete-puzzle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pieces }),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);

            // Mark the message as shown 
            localStorage.setItem("messageDisplayed", "true");

            // Reload the page so the server can update the display with the completed puzzle
            window.location.reload();
        })
        .catch(error => console.error("Error:", error));
}

//Redraw the puzzle in completed from and disable user interaction
function loadCompletedPuzzle(savedPieces) {
    //ensure the function uses the positions of the pieces as stored (completed positions)
    pieces = savedPieces;

    pieceWidth = Math.floor(img.width / PUZZLE_SIZE);
    pieceHeight = Math.floor(img.height / PUZZLE_SIZE);
    puzzleWidth = pieceWidth * PUZZLE_SIZE;
    puzzleHeight = pieceHeight * PUZZLE_SIZE;

    setCanvas();
    clearPuzzleLines();
    for (let i = 0; i < pieces.length; i++) {
        const piece = pieces[i];
        puzzleStage.drawImage(
            img,
            piece.sx, piece.sy,
            pieceWidth, pieceHeight,
            piece.xPos, piece.yPos,
            pieceWidth, pieceHeight
        );
    }

    document.onmousedown = null;
    document.onmousemove = null;
    document.onmouseup = null;
}

function init() {
    fetch("/puzzle-state") // Request saved puzzle state from the server
        .then(response => response.json())
        .then(data => {
            img = new Image();
            img.addEventListener("load", () => {
                if (data.completed) {
                    loadCompletedPuzzle(data.pieces);
                    displayCompletionMessage(); 
                } else {
                    // Initialize a new puzzle
                    onImage();
                    localStorage.removeItem("messageDisplayed"); 
                }
            });
            img.src = "../../resources/gallery/Puzzle_siblings.jpg";
        })
        .catch(error => {
            console.error("Error loading puzzle state:", error);

            // Fall back to initializing a new puzzle if an error occurs
            img = new Image();
            img.addEventListener("load", onImage, false);
            img.src = "../../resources/gallery/Puzzle_siblings.jpg";
        });
}

//SHUFFLE FUNCTION
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
