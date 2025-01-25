document.getElementById('door-container').addEventListener('click', function(event) {
    event.preventDefault();  // Prevents the default behavior if any
    document.getElementById('exit-popup').classList.remove('hidden');  // Shows the pop-up
});

function proceedToExit() {
    window.location.href = '../minigames/wordgame/wordgame.html';  // Redirects to the new page
}

function closePopup() {
    document.getElementById('exit-popup').classList.add('hidden');  // Hides the pop-up
}