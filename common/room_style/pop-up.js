// Création de la pop-up
const popup = document.createElement('div');
popup.classList.add('popup-fullscreen');
popup.innerHTML = `
    <div class="popup-content">
        <div class="popup-image">
            <img src="" alt="Indice">
        </div>
        <div class="text-box" data-name="Clair">
            Texte de l'indice
        </div>
    </div>
`;
document.body.appendChild(popup);

// Styles pour la pop-up
const style = document.createElement('style');
style.textContent = `
    .popup-fullscreen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.8);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        flex-direction: column;
    }
    .popup-content {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }
    .popup-image img {
        max-width: 300%;
        max-height: 300%;
        object-fit: contain;
        border-radius: 10px;
    }
    body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        overflow: hidden;
    }

    .text-box {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: inline-block;
        background: rgba(255, 255, 255, 0.3);
        color:rgb(0, 0, 0);
        border-radius: 20px;
        padding: 10px 20px;
        font-size: 20px;
        line-height: 1.5;
        max-width: 50%;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.7);
        word-wrap: break-word;
    }

    .text-box::before {
        content: attr(data-name);
        position: absolute;
        top: -15px;
        left: 10px;
        background: #f5ccd9;
        color: #6a2838;
        font-size: 15px;
        font-weight: bold;
        padding: 2px 8px;
        border-radius: 10px;
    }

`;
document.head.appendChild(style);

// Fonction d'ouverture de la pop-up avec contenu dynamique
function showPopup(event) {
    const text = event.currentTarget.getAttribute('data-text');
    const imgSecondaire = event.currentTarget.getAttribute('data-img-secondaire');
    const imgSrc = imgSecondaire || event.currentTarget.querySelector('img').src;
    popup.querySelector('.popup-image img').src = imgSrc;
    popup.querySelector('.text-box').textContent = text;
    popup.style.display = 'flex';
}

// Sélection de tous les indices interactifs
const hintContainers = document.querySelectorAll('[data-text]');
hintContainers.forEach(container => {
    container.addEventListener('click', showPopup);
});

// Fermeture de la pop-up au clic
popup.addEventListener('click', () => {
    popup.style.display = 'none';
});