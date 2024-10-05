const fs = require('fs');
const path = require('path');

const cardsPath = path.resolve(__dirname, 'data/card-data.json');
const jsonString = fs.readFileSync(cardsPath);
const cards = JSON.parse(jsonString);



// PUBLIC METHODS
const getAllCards = () => cards.map((card) => ({ ...card }));
const getCardById = (guid) => {
	const card = cards.find((card) => card.GUID === guid);
	return card ? { ...card } : null;
};

const getRecentCard = () => {
	const card = cards.slice(-1)[0];
	return card ? { ...card } : null;
};

const getRandomCard = () => {
	const card = cards[Math.floor(Math.random() * cards.length)];
	return card ? { ...card } : null;
};

module.exports = {
	getAllCards, getCardById, getRecentCard, getRandomCard,
};
