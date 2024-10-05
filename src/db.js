const fs = require('fs');
const path = require('path');

const cardsPath = path.resolve(__dirname, 'data/card-data.json');
const jsonString = fs.readFileSync(cardsPath);
const data = JSON.parse(jsonString);
const { cards } = data; // object destructuring

// PUBLIC METHODS
const getAllCards = () => cards;
const getCardById = (guid) => cards.find((card) => card.GUID === guid);
const getRecentCard = () => cards.slice(-1)[0];
const getRandomCard = () => cards[Math.floor(Math.random() * quotes.length)];

module.exports = {
  getAllCards, getCardById, getRecentCard, getRandomCard,
};
