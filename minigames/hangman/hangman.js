document.addEventListener('DOMContentLoaded', () => {
    const words = ["ordinateur", "maison", "peluche", "souvenir", "famille", "monstre", "cuisine", "chambre", "salon"];
    let selectedWord = words[Math.floor(Math.random() * words.length)];
    let displayWord = Array(selectedWord.length).fill("_");
    let wrongGuesses = [];
    let maxWrongGuesses = 10;
    let wrongGuessCount = 0;
  
    const wordDisplay = document.getElementById("word-display");
    const guessInput = document.getElementById("guess-input");
    const message = document.getElementById("message");
    const wrongLetters = document.getElementById("wrong-letters");
    const hangmanParts = document.querySelectorAll(".part");
    const newWordButton = document.getElementById("new-word-button");
  
    wordDisplay.textContent = displayWord.join(" ");
  
    // Submit guess button
    guessInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            const guess = guessInput.value.toLowerCase();
            guessInput.value = "";

            if (guess.length !== 1 || !guess.match(/[a-z]/)) {
                message.textContent = "Please enter a valid letter.";
                return;
            }

            if (selectedWord.includes(guess)) {
                for (let i = 0; i < selectedWord.length; i++) {
                    if (selectedWord[i] === guess) {
                        displayWord[i] = guess;
                    }
                }
                wordDisplay.textContent = displayWord.join(" ");
                message.textContent = "";
            } else {
                if (!wrongGuesses.includes(guess)) {
                    wrongGuesses.push(guess);
                    wrongGuessCount++;
                    hangmanParts[wrongGuessCount - 1].style.display = "block";
                    wrongLetters.textContent = `Wrong letters: ${wrongGuesses.join(', ')}`;
                }
                if (wrongGuessCount >= maxWrongGuesses) {
                    message.textContent = "Game Over! Try again";
                    disableInput(true); // Show New Word button only if the game is lost
                }
            }

            if (!displayWord.includes("_")) {
                message.textContent = "You found the secret word!";
                disableInput(false); // No need for New Word button if the game is won
            }
        }
    });
  
    function disableInput(isLost) {
        guessInput.disabled = true;
        if (isLost) {
            newWordButton.style.display = 'block';  // Show the New Word button if game is lost
        }
    }
  
    function generateNewWord() {
        // Choose a new word
        selectedWord = words[Math.floor(Math.random() * words.length)];

        // Reset displayWord array to match the new selected word length
        displayWord = Array(selectedWord.length).fill("_");
        wordDisplay.textContent = displayWord.join(" ");
        
        // Reset game state
        wrongGuesses = [];
        wrongGuessCount = 0;
        message.textContent = "";
        wrongLetters.textContent = "";
        hangmanParts.forEach(part => part.style.display = "none");

        // Reset input and hide the button
        guessInput.disabled = false;
        newWordButton.style.display = 'none';  // Hide the New Word button after new word is generated
    }

    // Add event listener to the button
    newWordButton.addEventListener("click", generateNewWord);
});