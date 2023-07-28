const cardsContainer = document.getElementById("cards");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;

let scoreBoard = document.getElementById("score");

fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    shuffleCards();
    generateCards();
    console.log(cards);
  });

function shuffleCards() {
  let currentIndex = cards.length;
  let randomIndex;
  let tempvalue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    tempvalue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = tempvalue;
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
    <div class="front">
      <img class="front-image" src=${card.image}>
    </div>
    <div class="back"></div>`;
    cardElement.addEventListener("click", flipCard);
    cardsContainer.appendChild(cardElement);
  }
}
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;
  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }
  secondCard = this;
  lockBoard = true;

  checkForMath();
}

function checkForMath() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;
  if (isMatch) disableCards();
  else unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  firstCard.removeEventListener("touchstart", flipCard);
  secondCard.removeEventListener("touchstart", flipCard);
  score++;
  console.log("the score", score);
  if (score === 9) startConfetti();
  scoreBoard.textContent = score;
  unlockBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    unlockBoard();
  }, 1000);
}

function unlockBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function restart() {
  shuffleCards();
  unlockBoard();
  score = 0;
  scoreBoard.textContent = score;
  cardsContainer.innerHTML = "";
  generateCards();
  stopConfetti();
}
