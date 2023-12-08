let flippedCards = [];
let score = 0;
let startTime; // Garder le temsp de départ en mémoire
let stopwatchInterval; // Garder l'interval
let elapsedPausedTime = 0; // garder en mémoire le temps mis en pause

function startMemoryGame() {

    // cacher les boutons quand le jeu se lance
    let x = document.getElementById('startbutton');
        if (x.style.display === 'none') {
            x.style.display= 'flex';
        }else{
            x.style.display = 'none';
        } 

    // début le chrono de la partie
    elapsedPausedTime = 0; // Reset le temps de pause
    document.getElementById("stopwatch").innerHTML = "00:00:00"; // reset l'affichage du temps
    if (!stopwatchInterval) {
            startTime = new Date().getTime() - elapsedPausedTime; // Si pause il y a eu avec "Stop" alors soustrait le temps de pause avec la date qu'on veut pour éviter que ça augmente pour rien
            stopwatchInterval = setInterval(updateStopwatch, 1000); // toutes les secondes met à jour (1000 millisecondes)
    }    
    // début du jeu
    const grid_size = 6;
    const container = document.getElementById('memory-game-container');
    const cards = createShuffledDeck(grid_size);

    // Remettre à zéro le tableau des cartes retournées et le score
    flippedCards = [];
    score = 0;

    // Supprimer les cartes existantes du conteneur
    container.innerHTML = '';


        // Créer et afficher la grille du jeu
    for (let i = 0; i < grid_size; i++) {
        for (let j = 0; j < grid_size; j++) {
            const card = document.createElement('div');
            card.classList.add('card');

            // Utiliser le chemin d'accès correct vers l'image
            const cardValue = cards[i * grid_size + j];
            const back = document.createElement('div');
            back.classList.add('back');
            back.style.backgroundImage = `url('/static/images/card${cardValue}.jpg')`
            back.style.width='153px';
            back.style.height='281px';
            back.style.backgroundPosition='center';

            // Stocker la valeur de la carte en tant que data-value
            card.dataset.value = cardValue;

            // Ajouter une classe 'front' pour la face avant de la carte
            const front = document.createElement('div');
            front.classList.add('front');

            // Ajouter un gestionnaire d'événements pour la carte
            card.addEventListener('click', () => onCardClick(card));

            // Ajouter les éléments de carte à la carte
            card.appendChild(front);
            card.appendChild(back);

            // Ajouter la carte au conteneur
            container.appendChild(card);
        }
    }

}


// Fonction appelée lorsqu'une carte est cliquée
function onCardClick(card) {
    // Ne rien faire si la carte est déjà retournée ou si deux cartes sont déjà retournées
    if (card.classList.contains('flipped') || flippedCards.length === 2) {
        return;
    }

    // Retourner la carte
    flipCard(card);

    // Ajouter la carte retournée au tableau
    flippedCards.push(card);

    // Si deux cartes sont retournées, vérifier si elles forment une paire
    if (flippedCards.length === 2) {
        setTimeout(checkForMatch, 1000);
    }
}

    // Fonction pour retourner une carte
function flipCard(card) {
    card.classList.add('flipped');

    const front = card.querySelector('.front');
    const back = card.querySelector('.back');
    front.classList.add('flipped');
    back.classList.add('flipped');
}




// Fonction pour créer et mélanger le deck de cartes
function createShuffledDeck(size) {
    const deck = Array.from({ length: (size ** 2) / 2 }, (_, index) => index + 1).flat();
    const shuffledDeck = [...deck, ...deck].sort(() => Math.random() - 0.5);
    return shuffledDeck;
}

// Fonction pour vérifier si les deux cartes retournées forment une paire
function checkForMatch() {
    const [card1, card2] = flippedCards;
    const value1 = card1.dataset.value;
    const value2 = card2.dataset.value;

    if (value1 === value2) {
        // Les cartes forment une paire, augmenter le score
        score += 1;
        updateScore();
        // Retirer les cartes du tableau des cartes retournées
        flippedCards = [];
    } 
    else {
        // Les cartes ne forment pas une paire, les retourner
        unflipCards(card1, card2);
    }
}

// Fonction pour retourner deux cartes
function unflipCards(card1, card2) {
    setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        // Réinitialiser le tableau des cartes retournées
        flippedCards = [];
    }, 1000);
}

//fonction quand restart le jeu
function replay(){
    let x = document.getElementById('continue');
    let y = document.getElementById('overall_continue');
    let z = document.getElementById('overall_continue2');
    if (x.style.display === 'none') {
        x.style.display= 'flex';
        y.classList.add('overall_continue_act');
        z.classList.add('overall_continue_act');
    }else{
        x.style.display = 'none';
        y.classList.remove('overall_continue_act');
        z.classList.remove('overall_continue_act');
    }

    score = 0;
    document.getElementById('scorebox').textContent = `${score}/18`;

    startMemoryGame();
}

// Fonction pour mettre à jour le score et finir la partie si score max atteint
function updateScore() {
    document.getElementById('scorebox').textContent = `${score}/18`;

    if (score == 18){ 
        saveScoreToDatabase(score)
        let x = document.getElementById('continue');
        let y = document.getElementById('overall_continue');
        let z = document.getElementById('overall_continue2');
        if (x.style.display === 'none') {
            x.style.display= 'flex';
            y.classList.add('overall_continue_act');
            z.classList.add('overall_continue_act');
        }else{
            x.style.display = 'none';
            y.classList.remove('overall_continue_act');
            z.classList.remove('overall_continue_act');
        }
        
        
        clearInterval(stopwatchInterval); // stop l'intervalle
        elapsedPausedTime = new Date().getTime() - startTime; // calcul le temps de pause pour ne pas le compter
        stopwatchInterval = null; // reset l'intervalle de maj
          
    }
}


//bouton test pour ajouter des points
function AddPoint(){
    score=score + 18;
    updateScore();
}


  // update du chrono tout les 1000 millisecondes (1seconde)
function updateStopwatch() {
    let currentTime = new Date().getTime(); // avoir le temps en millisecondes
    let elapsedTime = currentTime - startTime; // Temps total en millisecondes écoulés
    let seconds = Math.floor(elapsedTime / 1000) % 60; // calcul en secondes
    let minutes = Math.floor(elapsedTime / 1000 / 60) % 60; // calcul en minutes
    let displayTime = pad(minutes) + ":" + pad(seconds); // format d'affichage du temps
    document.getElementById("stopwatch").innerHTML = displayTime; // mettre à jour l'affichage tout le temps.
}

function pad(number) {
    // Si le nombre d'heure ou de minutes ou de secondes est inférieur à 10 ça ajoute un 0 avant pour garder la forme 00:00:00
    return (number < 10 ? "0" : "") + number;
}

//bouton test pour ajouter des points
function AddPoint(){
    score=score + 18;
    updateScore();
}

function saveScoreToDatabase(score) {
    const formData = new FormData();
    formData.append('score', score);

    const csrfTokenInput = document.getElementsByName('csrfmiddlewaretoken')[0];
    const csrfToken = csrfTokenInput ? csrfTokenInput.value : '';

    fetch('/enregistrer_score/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,
        },
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
    })
    .catch(error => {
        console.error('Erreur lors de la requête AJAX:', error);
    });
}