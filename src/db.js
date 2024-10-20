const fs = require('fs');
const path = require('path');
const util = require('./utils.js');

const cardsPath = path.resolve(__dirname, 'data/card-data.json');
const effectPath = path.resolve(__dirname, 'data/effects.json');
const effectJson = fs.readFileSync(effectPath);
const jsonString = fs.readFileSync(cardsPath);
const cards = JSON.parse(jsonString);
const effects = JSON.parse(effectJson);
const DEFAULT_CARD = {
    Team: 'Blue',
    Duplication: 0,
    Target: 'None',
    SectorsAffected: 'Any',
    TargetAmount: 0,
    Title: '',
    AssetInfo: {
        imgRow: 0,
        imgCol: 0,
        bgRow: 0,
        bgCol: 0,
        imgLocation: '',
    },
    Cost: {
        BlueCost: 0,
        BlackCost: 0,
        PurpleCost: 0,
    },
    FlavourText: '',
    Description: '',
    GUID: crypto.randomUUID(),
    Action: {
        Method: 'AddEffect',
        MeeplesChanged: 0,
        MeepleIChange: 0,
        PrerequisiteEffect: '',
        Duration: 0,
        CardsDrawn: 0,
        CardsRemoved: 0,
        DiceRoll: 0,
        EffectCount: 0,
        Effects: [],
    },
    DoomEffect: false,
};

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
const addCard = (cardData) => {
    // console.log(card);
    const newGUID = cardData.GUID || crypto.randomUUID();
    let card = cardData;
    if (Object.keys(cardData).length === 0) {
        return null;
    }
    if (Object.keys(cardData).length !== VALID_FIELD_NAMES.length) {
        // console.log(cardData);
        card = { ...DEFAULT_CARD, ...cardData };
        // console.log(card);
    }
    const newCard = util.getCardDeepCopy(card);
    newCard.GUID = newGUID;
    cards.push(newCard);

    // console.log(cards);
    // fs.writeFileSync(cardsPath, JSON.stringify(cards, null, 2));
    return getCardById(newGUID);
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
    DEFAULT_CARD,
    VALID_FIELD_NAMES,
    VALID_FILTER_NAMES,
};
