document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('dragstart', function (event) {
        event.dataTransfer.setData('text/plain', this.textContent);
        this.style.opacity = '0.5'; // Diminue l'opacité pour indiquer que l'élément est en cours de déplacement
    });

    tag.addEventListener('dragend', function () {
        this.style.opacity = '1'; // Restaure l'opacité
    });
});

document.querySelectorAll('.placeholder').forEach(placeholder => {
    placeholder.addEventListener('dragover', function (event) {
        event.preventDefault(); // Nécessaire pour permettre le drop
        this.style.borderColor = '#ffff1f'; // Change la bordure en survol
    });

    placeholder.addEventListener('dragleave', function () {
        this.style.borderColor = '#6cb0e4'; // Restaure la bordure
    });

    placeholder.addEventListener('drop', function (event) {
        event.preventDefault();
        const data = event.dataTransfer.getData('text/plain');
        if (!this.textContent) { // Vérifie si le placeholder est vide
            this.textContent = data;
            this.setAttribute('data-answer', data);
            placeholder.classList.add('filled'); // Retire les underscores

            // Supprime le tag glissé
            const draggedTag = Array.from(document.querySelectorAll('.tag')).find(tag => tag.textContent === data);
            if (draggedTag) {
                draggedTag.remove();
            }
        }
    });
});

// Validation de la réponse
document.getElementById('validate').addEventListener('click', function () {
    let correct = true;
    document.querySelectorAll('.placeholder').forEach(placeholder => {
        if (placeholder.dataset.correct !== placeholder.dataset.answer) {
            correct = false;
        }
    });
    const result = document.getElementById('result');
    if (correct) {
        result.textContent = "Bravo ! 🎉 Passez à la phrase suivante.";
        result.style.color = "green";
    } else {
        result.textContent = "Erreur ! Réessayez. 😅";
        result.style.color = "red";
    }
});