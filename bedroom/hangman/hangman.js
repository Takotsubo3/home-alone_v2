document.addEventListener('DOMContentLoaded', () => {
  const words = ["ordinateur"];
  let selectedWord = words[0];
  let displayWord = Array(selectedWord.length).fill("_");
  let wrongGuesses = [];
  let maxWrongGuesses = 10; 
  let wrongGuessCount = 0;

  const wordDisplay = document.getElementById("word-display");
  const guessInput = document.getElementById("guess-input");
  const message = document.getElementById("message");
  const wrongLetters = document.getElementById("wrong-letters");
  const hangmanParts = document.querySelectorAll(".part");


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
            disableInput();
        }
    }
    if (!displayWord.includes("_")) {
        message.textContent = "You found the secret word!";
        disableInput();
    }
}
});
function disableInput() {
guessInput.disabled = true;
}
});