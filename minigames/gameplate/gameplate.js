const plateau= document.getElementById("plateau");
const message =document.getElementById("message");

let joueur = { x: 0, y: 0 };
let ennemi = { x: 4, y: 4 }; 

function genererPlateau() {
  plateau.innerHTML= "";
  for (let y= 0; y < 5; y++) {
    for (let x =0;x <5; x++) {
      const caseDiv = document.createElement("div");
      caseDiv.classList.add("case");
      caseDiv.dataset.x= x;
      caseDiv.dataset.y= y;

      if (x=== joueur.x && y === joueur.y) {
        const joueurDiv = document.createElement("div");
        joueurDiv.classList.add("joueur");
        caseDiv.appendChild(joueurDiv);
      }

      if (x=== ennemi.x && y=== ennemi.y) {
        const ennemiDiv = document.createElement("div");
        ennemiDiv.classList.add("ennemi");
        caseDiv.appendChild(ennemiDiv);
      }

      plateau.appendChild(caseDiv);
    }
  }
}

function deplacerJoueur(dx, dy) {
  const newX = joueur.x + dx,
    newY = joueur.y + dy;
  if (newX >= 0&& newX < 5 &&newY >= 0 && newY < 5) {
    joueur.x= newX;
    joueur.y = newY;
    deplacerEnnemi();
    verifierCollision();
    genererPlateau();
  }
}

function deplacerEnnemi() {
  const directions = [
    { dx: -1,dy: 0 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: -1 },
    { dx: 0,dy: 1 },
  ];
  const mouvementsValides = directions.filter(
    (dir) =>
      ennemi.x + dir.dx >= 0 &&
      ennemi.x + dir.dx< 5 &&
      ennemi.y +dir.dy >= 0 &&
      ennemi.y + dir.dy < 5
  );
  const mouvement =
    mouvementsValides[Math.floor(Math.random()* mouvementsValides.length)];
  ennemi.x += mouvement.dx;
  ennemi.y +=mouvement.dy;
}

function verifierCollision() {
  if (joueur.x === ennemi.x && joueur.y=== ennemi.y) {
    message.textContent =
      "Perdu!";
    resetPositions();
  } else if (joueur.x === 4 && joueur.y === 4) {
    message.textContent =
      "Gagné!";
    
  }
}

function resetPositions() {
  joueur = { x: 0, y: 0 };
  ennemi = { x: 4, y: 4 };
  genererPlateau();
}

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      deplacerJoueur(0, -1);
      break;
    case "ArrowDown":
      deplacerJoueur(0, 1);
      break;
    case "ArrowLeft":
      deplacerJoueur(-1, 0);
      break;
    case "ArrowRight":
      deplacerJoueur(1, 0);
      break;
  }
});

genererPlateau();
