const fs = require('fs');
const path = require('path');

const cardsPath = path.resolve(__dirname, 'data/card-data.json');
const jsonString = fs.readFileSync(cardsPath);
const cards = JSON.parse(jsonString);

// List of valid field names for validation
const VALID_FIELD_NAMES = Object.keys(cards[0] || {}).map((key) => key.toLowerCase());

// PUBLIC METHODS
const getAllCards = () => cards.map((card) => ({ ...card }));

const getCardById = (guid) => {
    const card = cards.find((_card) => _card.GUID === guid);
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

const getCardsByField = (fieldName, value) => cards
    .filter((card) => {
        const fieldValue = card[fieldName];
        if (fieldValue !== undefined && fieldValue !== null) {
            return fieldValue.toString().toLowerCase() === value.toString().toLowerCase();
        }
        return false;
    })
    .map((card) => ({ ...card }));

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
