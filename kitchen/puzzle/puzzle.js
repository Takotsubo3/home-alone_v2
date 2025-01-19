"use strict";

const PUZZLE_SIZE = 4;

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


//set up image loading and call function onImage once the image is fully loaded
function init(){
    img = new Image();
    img.addEventListener('load', onImage, false);
    img.src = "../../resources/gallery/Puzzle_siblings.jpg";
}


function onImage(){
    pieceWidth = Math.floor(img.width / PUZZLE_SIZE);
    pieceHeight = Math.floor(img.height / PUZZLE_SIZE);
    puzzleWidth = pieceWidth * PUZZLE_SIZE;
    puzzleHeight = pieceHeight * PUZZLE_SIZE;
    setCanvas();
    initPuzzle();
}


function setCanvas(){
    puzzleCanvas = document.getElementById('canvas');
    puzzleStage = puzzleCanvas.getContext('2d');
    //make the canvas dimensions matching the size of the puzzle calculated in onImage
    puzzleCanvas.width = puzzleWidth;
    puzzleCanvas.height = puzzleHeight;
}

//initialize puzzle's gameplay
function initPuzzle() {
    pieces = [];
    mouse = {x: 0, y: 0};
    currentPiece = null;
    currentDropPiece = null;

    // Draw the full puzzle image on the canvas
    puzzleStage.drawImage(img,
        0, 0, puzzleWidth, puzzleHeight, // Source coordinates and size
        0, 0, puzzleWidth, puzzleHeight  // Destination coordinates and size
    );

    // Split the image into puzzle pieces
    buildPieces();
}

const buildPieces = function(){
    let piece;
    let xPos = 0;
    let yPos = 0;
    for (let i = 0; i < PUZZLE_SIZE * PUZZLE_SIZE; i++) {
        piece = {};
        piece.sx = xPos;
        piece.sy = yPos;
        pieces.push(piece); 
        xPos += pieceWidth;
        if(xPos >= puzzleWidth){
            xPos = 0;
            yPos += pieceHeight;
        }       
    }
    document.onmousedown = shufflePuzzle;
}

const shufflePuzzle = function (){
    pieces = shuffleArray(pieces);
    puzzleStage.clearRect(0, 0, puzzleWidth, puzzleHeight);

    let piece;
    let xPos = 0;
    let yPos = 0;
    for (let i = 0; i < pieces.length; i++) {
        piece = pieces[i];
        piece.xPos = xPos;
        piece.yPos = yPos;
        puzzleStage.drawImage(img, piece.sx, piece.sy, pieceWidth, pieceHeight, xPos, yPos, pieceWidth, pieceHeight);
        puzzleStage.strokeRect(xPos, yPos, pieceWidth, pieceHeight);
        xPos += pieceWidth;
        if (xPos >= puzzleWidth){
            xPos = 0;
            yPos += pieceHeight;
        }       
    }
    document.onmousedown = onPuzzleClick;
}

const onPuzzleClick = function(e){
    if(e.layerX || e.layerX == 0){
        mouse.x = e.layerX - puzzleCanvas.offsetLeft;
        mouse.y = e.layerY - puzzleCanvas.offsetTop;
    }
    else if(e.offsetX || e.offsetX == 0){
        mouse.x = e.offsetX - puzzleCanvas.offsetLeft;
        mouse.y = e.offsetY - puzzleCanvasas.offsetTop;
    }

    currentPiece = checkPieceClicked();

    if(currentPiece != null){
        puzzleStage.clearRect(currentPiece.xPos, currentPiece.yPos, pieceWidth, pieceHeight);
        puzzleStage.save();
        puzzleStage.globalAlpha = .9;
        puzzleStage.drawImage(img, currentPiece.sx, currentPiece.sy, pieceWidth, pieceHeight, mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth, pieceHeight);
        puzzleStage.restore();
        document.onmousemove = updatePuzzle;
        document.onmouseup = pieceDropped;
    }
}

const checkPieceClicked = function () {
    let piece;
    for (let i = 0; i < pieces.length; i++) {
        for( let j = 0;j < pieces.length;j++){
            piece = pieces[i];
            if(mouse.x < piece.xPos || mouse.x > (piece.xPos + pieceWidth) || mouse.y < piece.yPos || mouse.y > (piece.yPos + pieceHeight))
                {
                //PIECE NOT HIT
                }
            else{
                return piece;
            }
        }        
    }
    return null;
}

const updatePuzzle = function(e){
    currentDropPiece = null;

    if(e.layerX || e.layerX == 0){
        mouse.x = e.layerX - puzzleCanvas.offsetLeft ;
        mouse.y = e.layerY - puzzleCanvas.offsetTop;
    }

    puzzleStage.clearRect(0, 0, puzzleWidth, puzzleHeight);

    let piece;
    for (let i = 0; i < pieces.length; i++) {
        piece = pieces[i];

        if(piece == currentPiece){
            continue
        }

        puzzleStage.drawImage(img, piece.sx, piece.sy, pieceWidth, pieceHeight, piece.xPos, piece.yPos, pieceWidth, pieceHeight);
        puzzleStage.strokeRect(piece.xPos, piece.yPos, pieceWidth, pieceHeight);
        if(currentDropPiece == null){
            if(mouse.x < piece.xPos || mouse.x > (piece.xPos + pieceWidth) || 
            mouse.y < piece.yPos || mouse.y > (piece.yPos + pieceHeight))
            {
                //NOT OVER
            }
            else {
                currentDropPiece = piece;
                puzzleStage.save();
                puzzleStage.globalAlpha = .4;
                //puzzleStage.fillStyle 
                puzzleStage.fillRect(currentDropPiece.xPos, currentDropPiece.yPos, pieceWidth, pieceHeight);
                puzzleStage.restore();
            }
        
    }
}
puzzleStage.save();
puzzleStage.globalAlpha = .6;
puzzleStage.drawImage(img, currentPiece.sx, currentPiece.sy, pieceWidth, pieceHeight, mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth, pieceHeight);
puzzleStage.restore();
puzzleStage.strokeRect(mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth,pieceHeight);
}

function pieceDropped(e){
    document.onmousemove = null;
    document.onmouseup = null;
    if(currentDropPiece != null){
        let tmp = {
            xPos : currentPiece.xPos,
            yPos : currentPiece.yPos
        };
        currentPiece.xPos = currentDropPiece.xPos;
        currentPiece.yPos = currentDropPiece.yPos;
        currentDropPiece.xPos = tmp.xPos;
        currentDropPiece.yPos = tmp.yPos;
    }
    resetPuzzleAndCheckWin();
}      

function resetPuzzleAndCheckWin(){
    puzzleStage.clearRect(0, 0, puzzleWidth, puzzleHeight);
    let gameWin = true;
    let piece;
    for(let i = 0;i < pieces.length;i++){
        piece = pieces[i];
        puzzleStage.drawImage(img, piece.sx, piece.sy, pieceWidth, pieceHeight, piece.xPos, piece.yPos, pieceWidth, pieceHeight);
        puzzleStage.strokeRect(piece.xPos, piece.yPos, pieceWidth,pieceHeight);
        if(piece.xPos != piece.sx || piece.yPos != piece.sy){
            gameWin = false;
        }
    }

    if(gameWin){
        setTimeout(gameOver,500);
    }
}


function gameOver(){
    document.onmousedown = null;
    document.onmousemove = null;
    document.onmouseup = null;
    initPuzzle();
}

function shuffleArray(o){
    for(let j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}
