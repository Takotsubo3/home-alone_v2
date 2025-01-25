document.getElementById('door-container').addEventListener('click', function(event) {
    event.preventDefault();  // Empêche la redirection immédiate
    document.getElementById('exit-popup').classList.remove('hidden');  // Affiche le pop-up
});

function proceedToExit() {
    window.location.href = '../door/wordgame/wordgame.html';  // Redirige vers la porte de sortie
}

function closePopup() {
    document.getElementById('exit-popup').classList.add('hidden');  // Cache le pop-up
}