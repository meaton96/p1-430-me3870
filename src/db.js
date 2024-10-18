const fs = require('fs');
const path = require('path');
const util = require('./utils.js');

const cardsPath = path.resolve(__dirname, 'data/card-data.json');
const effectPath = path.resolve(__dirname, 'data/effects.json');
const effectJson = fs.readFileSync(effectPath);
const jsonString = fs.readFileSync(cardsPath);
const cards = JSON.parse(jsonString);
const effects = JSON.parse(effectJson);

// List of valid field names for validation
const VALID_FIELD_NAMES = Object.keys(cards[0] || {}).map((key) => key.toLowerCase());
const VALID_FILTER_NAMES = [
    'team',
    'method',
    'target',
    'bluecost',
    'blackcost',
    'purplecost',
    'effectcount',
    'prerequisiteeffect',
];

// PUBLIC METHODS
// GET
const getAllCards = () => cards.map((card) => util.getCardDeepCopy(card));
const getAllEffects = () => effects.map((effect) => ({ ...effect }));

// Get a card by GUID
const getCardById = (guid) => {
    const card = cards.find((_card) => _card.GUID === guid);
    return card ? util.getCardDeepCopy(card) : null;
};
const getEffectById = (id) => {
    const effect = effects.find((_effect) => _effect.EffectID === id);
    return effect ? { ...effect } : null;
};
// Get the last card in the list
const getRecentCard = () => {
    const card = cards.slice(-1)[0];
    return card ? util.getCardDeepCopy(card) : null;
};

// Get a random card
const getRandomCard = () => {
    const card = cards[Math.floor(Math.random() * cards.length)];
    return card ? util.getCardDeepCopy(card) : null;
};
// const getPartialNameMatches = (name) => getAllCards()
//     .filter((card) => card.Title.toLowerCase()
//         .includes(name.toLowerCase()));

// Get cards by a specific field
const getCardsByField = (fieldName, value) => cards
    .filter((card) => {
        const fieldValue = card[fieldName];
        if (fieldValue !== undefined && fieldValue !== null) {
            return fieldValue.toString().toLowerCase() === value.toString().toLowerCase();
        }
        return false;
    })
    .map((card) => util.getCardDeepCopy(card));

// Get cards by multiple filters, a list of field names and values
const getCardsByFilters = (filters) => cards
    .filter((card) => Object.keys(filters).every((key) => {
        const filterValue = filters[key];
        // Handle partial matches for the card title
        // console.log(filterValue, typeof filterValue);
        if (key === 'Title') {
            const cardTitle = card.Title?.toString().toLowerCase();
            const filterTitle = filterValue[0].toString().toLowerCase();
            // console.log(cardTitle, filterTitle);
            return cardTitle && cardTitle.includes(filterTitle);
        }

        // Handle nested object properties and multiple values
        if (typeof filterValue === 'object' && filterValue !== null && !Array.isArray(filterValue)) {
            return Object.keys(filterValue).every((nestedKey) => {
                const nestedValues = filterValue[nestedKey]; // this is why we love javascript
                const nestedFieldValue = card[key]?.[nestedKey];

                if (nestedFieldValue !== undefined && nestedFieldValue !== null) {
                    // Check if nestedFieldValue matches any of the values in nestedValues
                    return Array.isArray(nestedValues)
                        ? nestedValues.some((nestedValue) => nestedFieldValue.toString()
                            .toLowerCase() === nestedValue.toString().toLowerCase())
                        : nestedFieldValue.toString().toLowerCase() === nestedValues
                            .toString().toLowerCase();
                }
                return false;
            });
        }

        const fieldValue = card[key];
        if (fieldValue !== undefined && fieldValue !== null) {
            // Handle multiple values for non-nested filters
            return Array.isArray(filterValue)
                ? filterValue.some((val) => fieldValue.toString().toLowerCase()
                    === val.toString().toLowerCase())
                : fieldValue.toString().toLowerCase()
                === filterValue.toString().toLowerCase();
        }
        return false;
    }))
    .map((card) => util.getCardDeepCopy(card));

// DELETE
const deleteCard = (guid) => {
    const index = cards.findIndex((_card) => _card.GUID === guid);
    if (index !== -1) {
        cards.splice(index, 1);
        // fs.writeFileSync(cardsPath, JSON.stringify(cards, null, 2));
        return true;
    }
    return false;
};
const updateCard = (guid, cardData) => {
    const index = cards.findIndex((_card) => _card.GUID === guid);
    const oCard = cards[index];
    //
    if (index !== -1) {
        const updatedCard = util.deepMerge(cards[index], cardData);
        cards[index] = updatedCard;

        if (oCard === updatedCard) {
            return null;
        }
        // fs.writeFileSync(cardsPath, JSON.stringify(cards, null, 2));
        return updatedCard;
    }
    return null;
};
const addCard = (card) => {
    // console.log(card);
    const guid = crypto.randomUUID();

    const newCard = util.getCardDeepCopy(card);
    newCard.GUID = guid;
    cards.push(newCard);

    // console.log(cards);
    // fs.writeFileSync(cardsPath, JSON.stringify(cards, null, 2));
    return getCardById(guid);
};

module.exports = {
    getAllCards,
    getCardById,
    getRecentCard,
    getRandomCard,
    getCardsByField,
    getCardsByFilters,
    deleteCard,
    getAllEffects,
    getEffectById,
    updateCard,
    addCard,
    // getPartialNameMatches,
    VALID_FIELD_NAMES,
    VALID_FILTER_NAMES,
};
