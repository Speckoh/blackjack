const betButton = document.querySelector("betButton");
let inputBetAmt = document.getElementById("betInput");
const playerContainer = document.querySelector(".playerContainer");
const dealerContainer = document.querySelector(".dealerContainer");
const playerTotal = document.getElementById("playerTotal");
const dealerTotal = document.getElementById("dealerTotal");

const diamondImg = "http://www.speckoh.com/images/diamond.png";
const clubImg = "http://www.speckoh.com/images/club.png";
const heartImg = "http://www.speckoh.com/images/heart.png";
const spadeImg = "http://www.speckoh.com/images/spade.png";

const deck = {
    suits: ["Diamonds", "Clubs", "Hearts", "Spades"],
    ranks: ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
}
let sortedDeck = [];
let newDeck = [];

let playerHand = [];
let dealerHand = [];

let dealerHandTotal;
let playerHandTotal;

let balance = 1000;
let betAmount;

class Card {
    constructor(rank, suit, value, sprite, color, facedown) {
        this.rank = rank;
        this.suit = suit;
        this.value = value;
        this.sprite = sprite;
        this.color = color;
        this.facedown = false;
    }
}
document.getElementById("balance").innerHTML = "$" + balance;

Initialize();
function Initialize() {
    for (i = 0; i < deck.ranks.length; i++) {
        for (j = 0; j < deck.suits.length; j++) {
            sortedDeck.push(new Card(deck.ranks[i], deck.suits[j]));
        }
    }
    //Start State
    Shuffle(newDeck);
    AssignValue(newDeck);
    AssignSpriteColor(newDeck);
}

function Shuffle(deck) {
    if (deck.length === 0) {
        let randomCard = Math.floor(Math.random() * sortedDeck.length);
        deck.push(sortedDeck[randomCard]);
    }
    while (deck.length < sortedDeck.length) {
        let randomCard = Math.floor(Math.random() * sortedDeck.length);
        let cardIsInArray = false;
        for (let i = 0; i < deck.length; i++) {
            if (sortedDeck[randomCard] === deck[i]) {
                cardIsInArray = true;
            }
        }
        if (!cardIsInArray) {
            deck.push(sortedDeck[randomCard]);
        }
    }
}

function AssignValue(deck) {
    for (let i = 0; i < sortedDeck.length; i++) {
        if (parseInt(deck[i].rank) >= "2" &&
            parseInt(deck[i].rank) <= "10") {
            deck[i].value = parseInt(deck[i].rank);
        }
        else if (deck[i].rank === "J" || deck[i].rank === "Q" ||
            deck[i].rank === "K") {
            deck[i].value = 10;
        }
        else if (deck[i].rank === "A") {
            deck[i].value = 11;
        }
    }
}

function AssignSpriteColor(deck) {
    for (let i = 0; i < sortedDeck.length; i++) {
        if (deck[i].suit === "Diamonds") {
            deck[i].sprite = diamondImg;
            deck[i].color = "#a31919";
        }
        else if (deck[i].suit === "Clubs") {
            deck[i].sprite = clubImg;
            deck[i].color = "black";
        }
        else if (deck[i].suit === "Hearts") {
            deck[i].sprite = heartImg;
            deck[i].color = "#a31919";
        }
        else if (deck[i].suit === "Spades") {
            deck[i].sprite = spadeImg;
            deck[i].color = "black";
        }
    }
}

function DealCard(index, assignment, hand) {
    let card = document.createElement("section");
    card.setAttribute("id", "card");
    card.innerHTML = `<div id="rank" style="color:${newDeck[index].color};">
    ${newDeck[index].rank}</div>
    <img src=${newDeck[index].sprite}>
    <div class="cardSprite"><img src=${newDeck[index].sprite}></div>`;
    assignment.appendChild(card);
    hand.push(newDeck[index]);
    newDeck.shift();
}

function DealFaceDown(assignment) {
    let card = document.createElement("section");
    card.setAttribute("id", "facedown");
    assignment.appendChild(card);
}

function FlipFaceDownCard() {
    let facedown = document.getElementById("facedown");
    let flipCard = document.createElement("section");
    dealerContainer.removeChild(facedown);
    dealerHand[1].facedown = false;
    flipCard.setAttribute("id", "card");
    flipCard.innerHTML = `<div id="rank" style="color:${dealerHand[1].color};">
    ${dealerHand[1].rank}</div>
    <img src=${dealerHand[1].sprite}>
    <div class="cardSprite"><img src=${dealerHand[1].sprite}></div>`;
    dealerContainer.appendChild(flipCard);
}

function AddHandValue(hand) {
    let totalHandValue = 0;
    for (let i = 0; i < hand.length; i++) {
        if (hand[i].facedown === false) {
            totalHandValue += hand[i].value;
        }
    }
    return totalHandValue;
}
function CheckPlayerForAces() {
    //Checks for Double Aces
    if (playerHandTotal === 22 && playerHand.length === 2) {
        playerHand[0].value = 1;
        CalculatePlayerHand();
    }
    else if (playerHandTotal > 21) {
        for (let i = 0; i < playerHand.length; i++) {
            if (playerHand[i].rank === "A" && playerHand[i].value === 11) {
                playerHand[i].value = 1;
                playerHandTotal = 0;
                for (let j = 0; j < playerHand.length; j++) {
                    playerHandTotal += playerHand[j].value;
                }
                playerTotal.innerHTML = `<div class="txtTotal">${playerHandTotal}</div>`;
            }
        }
        if (playerHandTotal > 21) {
            setTimeout(function () {
                DealerWins();
                return;
            }, 1000);
        }
    }
}
//Performs actions when Double Aces Occur for Dealer
function CheckDealerForAces() {
    if (dealerHandTotal > 21) {
        for (let i = 0; i < dealerHand.length; i++) {
            if (dealerHand[i].rank === "A" && dealerHand[i].value === 11) {
                dealerHand[i].value = 1;
                dealerHandTotal = 0;
                for (let j = 0; j < dealerHand.length; j++) {
                    dealerHandTotal += dealerHand[j].value;
                }
                dealerTotal.innerHTML = `<div class="txtTotal">${dealerHandTotal}</div>`;
                return;
            }
        }
    }
}
//When Player Wins a Hand; Blackjack gives 1.5x back more Money else only 1x
function PlayerWins() {
    if (playerHandTotal === 21 && playerHand.length === 2) {
        balance += betAmount * 2.5;
    }
    else {
        balance += betAmount * 2;
    }
    betAmount = 0;
    inputBetAmt.value = "";
    document.getElementById("betAmount").innerHTML =
        `<input id="betInput" placeholder="Enter Your Bet">`;
    document.getElementById("balance").innerHTML = "$" + balance;
    document.getElementById("betDiv").innerHTML =
        `<button id="betButton">BET</button>`;
    document.getElementById("toolTip").innerText = "Player Wins Round!"
    Initialize();
}
//When Dealer Wins a Hand you lose your bet
function DealerWins() {
    betAmount = 0;
    inputBetAmt.value = "";
    document.getElementById("betAmount").innerHTML =
        `<input id="betInput" placeholder="Enter Your Bet">`;
    document.getElementById("betDiv").innerHTML =
        `<button id="betButton">BET</button>`;
    document.getElementById("toolTip").innerText = "Dealer Wins Round!"
    Initialize();
}
//Calculate DealerHand
function CalculateDealerHand() {
    dealerHandTotal = AddHandValue(dealerHand);
    dealerTotal.innerHTML = `<div class="txtTotal">${dealerHandTotal}</div>`;
}
//Calculate PlayerHand
function CalculatePlayerHand() {
    playerHandTotal = AddHandValue(playerHand);
    playerTotal.innerHTML = `<div class="txtTotal">${playerHandTotal}<d/iv>`;
}
//Reset Board method
function ResetBoard(container) {
    while (container.lastElementChild) {
        container.removeChild(container.lastElementChild);
    }
    playerHand = [];
    dealerHand = [];
    newDeck = [];
    playerHandTotal = 0;
    dealerHandTotal = 0;
    Shuffle(newDeck);
    AssignValue(newDeck);
    AssignSpriteColor(newDeck);
}

document.addEventListener('click', event => {
    //When Bet Button is clicked
    if (event.target.matches("#betButton")) {
        let inputBetAmt = document.getElementById("betInput");
        //When a value is Entered
        if (inputBetAmt.value !== "") {
            //If value inputted is not a Number
            if (isNaN(inputBetAmt.value)) {
                inputBetAmt.value = ""
                document.getElementById("toolTip").innerText = "Enter an Appropriate Value!"
                return false;
            }
            //If value inputted is less than your balance
            if (inputBetAmt.value > balance) {
                inputBetAmt.value = ""
                document.getElementById("toolTip").innerText = "Insufficient Amount Entered!"
            }
            //Otherwise Deal Cards
            else {
                ResetBoard(playerContainer);
                ResetBoard(dealerContainer);
                document.getElementById("toolTip").innerHTML = "&nbsp;";
                betAmount = inputBetAmt.value;
                document.getElementById("betAmount").innerHTML =
                    `<section id="empty">$${betAmount}</section>`;
                balance -= betAmount;
                document.getElementById("balance").innerHTML = "$" + balance;
                document.getElementById("betDiv").innerHTML =
                    `<button id="stayButton">STAY</button>
                 <button id="hitButton">HIT</button>`;
                DealCard(0, playerContainer, playerHand);
                DealCard(0, dealerContainer, dealerHand);
                DealCard(0, playerContainer, playerHand);

                dealerHand.push(newDeck[0]);

                newDeck.shift();

                DealFaceDown(dealerContainer);
                dealerHand[1].facedown = true;

                CalculatePlayerHand();
                CalculateDealerHand();
                //Check for Initial Double Ace Draws
                CheckPlayerForAces();
            }
        }
        //When value is Blank
        else{
            document.getElementById("toolTip").innerText = "Please Enter a Bet Amount"
        }
    }
    //When Player Hits
    if (event.target.matches("#hitButton") && playerHand.length < 5
        && playerHandTotal < 21) {
        DealCard(0, playerContainer, playerHand);
        playerHandTotal += playerHand[playerHand.length - 1].value;
        CheckPlayerForAces();
        playerTotal.innerHTML = `<div class="txtTotal">${playerHandTotal}</div>`;
    }
    //When Player Stays
    if (event.target.matches("#stayButton")) {
        document.getElementById("betDiv").innerHTML =
            `<section id="emptyButton">&nbsp;</section>`;
        FlipFaceDownCard();
        CalculateDealerHand();
        while (dealerHandTotal <= 16 && dealerHand.length < 5) {
            DealCard(0, dealerContainer, dealerHand);
            CalculateDealerHand();
            CheckDealerForAces();
        }
        if (dealerHandTotal >= 17) {
            //Dealer Busts
            if (dealerHandTotal > 21) {
                setTimeout(function () {
                    PlayerWins();
                    return;
                }, 1000);
            }
            //Player Loses
            else if (dealerHandTotal >= playerHandTotal) {
                setTimeout(function () {
                    DealerWins();
                    return;
                }, 1000);
            }
            //Dealer Did Not Bust But Hand is Lower than Player
            else {
                setTimeout(function () {
                    PlayerWins();
                    return;
                }, 1000);
            }
        }
    }
})