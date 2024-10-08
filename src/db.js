const fs = require('fs');
const path = require('path');

const cardsPath = path.resolve(__dirname, 'data/card-data.json');
const jsonString = fs.readFileSync(cardsPath);
const cards = JSON.parse(jsonString);

// List of valid field names for validation
const VALID_FIELD_NAMES = Object.keys(cards[0] || {}).map((key) => key.toLowerCase());

// PUBLIC METHODS
const getAllCards = () => cards.map((card) => ({ ...card }));

// Get a card by GUID
const getCardById = (guid) => {
    const card = cards.find((_card) => _card.GUID === guid);
    return card ? { ...card } : null;
};
// Get the last card in the list
const getRecentCard = () => {
    const card = cards.slice(-1)[0];
    return card ? { ...card } : null;
};

// Get a random card
const getRandomCard = () => {
    const card = cards[Math.floor(Math.random() * cards.length)];
    return card ? { ...card } : null;
};
// Get cards by a specific field
const getCardsByField = (fieldName, value) => cards
    .filter((card) => {
        const fieldValue = card[fieldName];
        if (fieldValue !== undefined && fieldValue !== null) {
            return fieldValue.toString().toLowerCase() === value.toString().toLowerCase();
        }
        return false;
    })
    .map((card) => ({ ...card }));

// Get cards by multiple filters, a list of field names
const getCardsByFilters = (filters) => cards
    .filter((card) => Object.keys(filters).every((key) => {
        const filterValue = filters[key];
        const fieldValue = card[key];
        if (fieldValue !== undefined && fieldValue !== null) {
            return fieldValue.toString().toLowerCase() === filterValue.toString().toLowerCase();
        }
        return false;
    }))
    .map((card) => ({ ...card }));

module.exports = {
    getAllCards,
    getCardById,
    getRecentCard,
    getRandomCard,
    getCardsByField,
    getCardsByFilters,
    VALID_FIELD_NAMES,
};
