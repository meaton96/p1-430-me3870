const express = require('express');
const db = require('../db.js');

const router = express.Router();
const validateFieldNames = (fieldNames) => {
    const invalidFields = fieldNames.filter(
        (fieldName) => !db.VALID_FIELD_NAMES.includes(fieldName.toLowerCase()),
    );
    return invalidFields;
};
// const getDefaultCard = () => ({
//     Team: 'Blue',
//     Duplication: 0,
//     Target: 'None',
//     SectorsAffected: 'Any',
//     TargetAmount: 0,
//     Title: '',
//     AssetInfo: {
//         imgRow: 0,
//         imgCol: 0,
//         bgRow: 0,
//         bgCol: 0,
//         imgLocation: '',
//     },
//     Cost: {
//         BlueCost: 0,
//         BlackCost: 0,
//         PurpleCost: 0,
//     },
//     FlavourText: '',
//     Description: '',
//     GUID: '',
//     Action: {
//         Method: 'None',
//         MeeplesChanged: 0,
//         MeepleIChange: 0,
//         PrerequisiteEffect: '',
//         Duration: 0,
//         CardsDrawn: 0,
//         CardsRemoved: 0,
//         DiceRoll: 0,
//         EffectCount: 0,
//         Effects: [],
//     },
//     DoomEffect: false,
// });

const convertCardToCSV = (card) => {
    const {
        Team,
        Duplication,
        Target,
        SectorsAffected,
        TargetAmount,
        Title,
        AssetInfo,
        Cost,
        FlavourText,
        Description,
        GUID,
        Action,
        DoomEffect,
    } = card;

    const convertEffects = (effects) => {
        if (!Array.isArray(effects)) {
            return 'None';
        }

        let effectString = '';

        const effectTypes = [];
        const effectTargets = [];
        let mag;

        effects.forEach((effect) => {
            const effectPieces = effect.split('-');
            if (effectPieces.length === 1) {
                effectTypes.push(effectPieces[0].charAt(0).toUpperCase()
                    + effectPieces[0].slice(1));
            } else {
                const [type, target, magnitude] = effectPieces;
                let typePiece = type;
                if (type === 'modpn') {
                    typePiece = type.slice(0, -1);
                    mag = `-${magnitude}`;
                } else if (type === 'modppt') {
                    mag = `-${magnitude}`;
                } else {
                    mag = magnitude;
                }
                effectTypes.push(typePiece);
                effectTargets.push(target);
            }
        });

        // Remove duplicates from effectTypes
        const uEffectTypes = [...new Set(effectTypes)];

        effectString += `${uEffectTypes.join('&')};`;
        if (effectTargets.length > 0) effectString += `${effectTargets.join('&')};${mag}`;
        else {
            return effectString.slice(0, -1); // remove trailing semicolon
        }
        return effectString;
    };

    // Create CSV line based on the image structure you provided
    let csvLine = `${Team},${Duplication},${Action.Method},${Target},${SectorsAffected},`;
    csvLine += `${TargetAmount},${Title},${AssetInfo.imgRow},${AssetInfo.imgCol},${AssetInfo.bgCol},${AssetInfo.bgRow},`;
    csvLine += `${Action.MeeplesChanged},${Action.MeepleIChange},`;
    csvLine += `${Cost.BlueCost},${Cost.BlackCost},${Cost.PurpleCost},0,`;
    csvLine += `${Action.CardsDrawn},${Action.CardsRemoved},${Action.EffectCount > 0 ? convertEffects(Action.Effects) : 'None'},`;
    csvLine += `${Action.EffectCount},${Action.PrerequisiteEffect},${Action.Duration},`;
    csvLine += `${DoomEffect ? 'TRUE' : 'FALSE'},${Action.DiceRoll},${FlavourText},`;
    csvLine += `${Description},images/${AssetInfo.imgLocation},${GUID}`;

    return csvLine;
};
const convertAllCardsToCSV = (cards) => {
    let csvHeaders = 'Team,Duplication,Method,Target,SectorsAffected,TargetAmount,';
    csvHeaders += 'Title,imgRow,imgCol,bgCol,bgRow,MeeplesChanged,MeepleIChange,';
    csvHeaders += 'BlueCost,BlackCost,PurpleCost,FacilityPoint,CardsDrawn,';
    csvHeaders += 'CardsRemoved,Effect,EffectCount,PrerequisiteEffect,Duration,';
    csvHeaders += 'DoomEffect,DiceRoll,FlavourText,Description,imgLocation,GUID\n';
    return csvHeaders + cards.map((card) => convertCardToCSV(card)).join('\n');
};

const getXMLCard = (card) => {
    let xml = '<card>\n';
    xml += `<Team>${card.Team}</Team>\n`;
    xml += `<Duplication>${card.Duplication}</Duplication>\n`;
    xml += `<Target>${card.Target}</Target>\n`;
    xml += `<SectorsAffected>${card.SectorsAffected}</SectorsAffected>\n`;
    xml += `<TargetAmount>${card.TargetAmount}</TargetAmount>\n`;
    xml += `<Title>${card.Title}</Title>\n`;

    xml += '<AssetInfo>\n';
    xml += `<imgRow>${card.AssetInfo.imgRow}</imgRow>\n`;
    xml += `<imgCol>${card.AssetInfo.imgCol}</imgCol>\n`;
    xml += `<bgRow>${card.AssetInfo.bgRow}</bgRow>\n`;
    xml += `<bgCol>${card.AssetInfo.bgCol}</bgCol>\n`;
    xml += `<imgLocation>${card.AssetInfo.imgLocation}</imgLocation>\n`;
    xml += '</AssetInfo>\n';

    xml += '<Cost>\n';
    xml += `<BlueCost>${card.Cost.BlueCost}</BlueCost>\n`;
    xml += `<BlackCost>${card.Cost.BlackCost}</BlackCost>\n`;
    xml += `<PurpleCost>${card.Cost.PurpleCost}</PurpleCost>\n`;
    xml += '</Cost>\n';

    xml += `<FlavourText>${card.FlavourText}</FlavourText>\n`;
    xml += `<Description>${card.Description}</Description>\n`;
    xml += `<GUID>${card.GUID}</GUID>\n`;

    xml += '<Action>\n';
    xml += `<Method>${card.Action.Method}</Method>\n`;
    xml += `<MeeplesChanged>${card.Action.MeeplesChanged}</MeeplesChanged>\n`;
    xml += `<MeepleIChange>${card.Action.MeepleIChange}</MeepleIChange>\n`;
    xml += `<PrerequisiteEffect>${card.Action.PrerequisiteEffect}</PrerequisiteEffect>\n`;
    xml += `<Duration>${card.Action.Duration}</Duration>\n`;
    xml += `<CardsDrawn>${card.Action.CardsDrawn}</CardsDrawn>\n`;
    xml += `<CardsRemoved>${card.Action.CardsRemoved}</CardsRemoved>\n`;
    xml += `<DiceRoll>${card.Action.DiceRoll}</DiceRoll>\n`;
    xml += `<EffectCount>${card.Action.EffectCount}</EffectCount>\n`;

    xml += '<Effects>\n';
    card.Action.Effects.forEach((effect) => {
        xml += `<EffectID>${effect.EffectID}</EffectID>\n`;
    });
    xml += '</Effects>\n';

    xml += `<DoomEffect>${card.DoomEffect}</DoomEffect>\n`;
    xml += '</Action>\n';

    xml += '</card>';

    return xml;
};
// GET/HEAD

// Helper function to validate field names

router.head('/fields', (req, res) => {
    if (db.VALID_FIELD_NAMES && db.VALID_FIELD_NAMES.length > 0) {
        res.set({
            'Content-Type': 'application/json',
            'Content-Length': JSON.stringify(db.VALID_FIELD_NAMES).length,
            'X-Coder': 'ME',
        });
        res.end();
    } else {
        res.status(404).end();
    }
});
router.get('/fields', (req, res) => {
    if (db.VALID_FIELD_NAMES && db.VALID_FIELD_NAMES.length > 0) {
        res.status(200).json(db.VALID_FIELD_NAMES);
    } else {
        res.status(404).send({ message: 'No field names found' });
    }
});
router.head('/filters', (req, res) => {
    if (db.VALID_FILTER_NAMES && db.VALID_FILTER_NAMES.length > 0) {
        res.set({
            'Content-Type': 'application/json',
            'Content-Length': JSON.stringify(db.VALID_FILTER_NAMES).length,
            'X-Coder': 'ME',
        });
        res.end();
    } else {
        res.status(404).end();
    }
});
router.get('/filters', (req, res) => {
    if (db.VALID_FILTER_NAMES && db.VALID_FILTER_NAMES.length > 0) {
        res.status(200).json(db.VALID_FILTER_NAMES);
    } else {
        res.status(404).send({ message: 'No field names found' });
    }
});
const convertCardsToXML = (cards) => `<cards>\n${cards.map((card) => getXMLCard(card)).join('')}\n</cards>`;
const handleAllCards = (req) => {
    const cards = db.getAllCards();
    let formattedCards = cards;
    let contentType = 'application/json';
    if (req.get('Accept') === 'application/xml') {
        contentType = 'application/xml';
        formattedCards = convertCardsToXML(cards);
    } else if (req.get('Accept') === 'text/csv') {
        contentType = 'text/csv';
        formattedCards = convertAllCardsToCSV(cards);
    }
    return { formattedCards, contentType };
};
router.head('/all', (req, res) => {
    const { formattedCards, contentType } = handleAllCards(req);
    if (formattedCards && formattedCards.length > 0) {
        res.set({
            'Content-Type': contentType,
            'Content-Length': JSON.stringify(formattedCards).length,
            'X-Coder': 'ME',
        });
        res.end();
    } else {
        res.status(404).end();
    }
});
// full list of cards
router.get('/all', (req, res) => {
    const { formattedCards } = handleAllCards(req);
    // res.setHeaders('Content-Type', contentType);
    if (formattedCards && formattedCards.length > 0) {
        res.status(200).send(formattedCards);
    } else {
        res.status(404).send({ message: 'No cards found' });
    }
});
const handleSingleCard = (req, card) => {
    let contentType = 'application/json';
    let newCard = card;
    if (req.get('Accept') === 'application/xml') {
        contentType = 'application/xml';
        newCard = getXMLCard(card);
    } else if (req.get('Accept') === 'text/csv') {
        contentType = 'text/csv';
        newCard = convertCardToCSV(card);
    }
    return { card: newCard, contentType };
};
router.head('/random', (req, res) => {
    const { card, contentType } = handleSingleCard(req, db.getRandomCard());
    if (card) {
        res.set({
            'Content-Type': contentType,
            'Content-Length': JSON.stringify(card).length,
            'X-Coder': 'ME',
        });
        res.end();
    } else {
        res.status(404).end();
    }
});
// random card
router.get('/random', (req, res) => {
    const { card } = handleSingleCard(req, db.getRandomCard());
    if (card) {
        res.status(200).send(card);
    } else {
        res.status(404).send({ message: 'No card found' });
    }
});
router.head('/recent', (req, res) => {
    const { card, contentType } = handleSingleCard(req, db.getRecentCard());
    if (card) {
        res.set({
            'Content-Type': contentType,
            'Content-Length': JSON.stringify(card).length,
            'X-Coder': 'ME',
        });
        res.end();
    } else {
        res.status(404).end();
    }
});
// last card in the list
router.get('/recent', (req, res) => {
    const { card } = handleSingleCard(req, db.getRecentCard());
    if (card) {
        res.status(200).send(card);
    } else {
        res.status(404).send({ message: 'No card found' });
    }
});
router.head('/:guid([0-9a-zA-Z-]{36})', (req, res) => {
    const { guid } = req.params;
    const { card, contentType } = handleSingleCard(req, db.getCardById(guid));

    if (card) {
        res.set({
            'Content-Type': contentType,
            'Content-Length': JSON.stringify(card).length,
            'X-Coder': 'ME',
        });
        res.end();
    } else {
        res.status(404).end();
    }
});
// /api/cards/GUID accepts 36 characters long alphanumeric GUIDs to find 1 card
router.get('/:guid([0-9a-zA-Z-]{36})', (req, res) => {
    const { guid } = req.params;
    const { card } = handleSingleCard(req, db.getCardById(guid));
    if (card) {
        res.status(200).send(card);
    } else {
        res.status(404).send({ message: `Card with GUID ${guid} not found` });
    }
});
const handleFilterEndpoint = (res, fieldName, value) => {
    // validate field name
    const invalidFields = validateFieldNames([fieldName]);
    // if invalid field name, return 400
    if (invalidFields.length > 0) {
        res.status(400).send({
            message: `Invalid field name: ${invalidFields.join(', ')}`,
        });
        return null;
    }
    // get cards by field name and value
    return db.getCardsByField(fieldName, value);
};
router.head('/:fieldName/:value', (req, res) => {
    const { fieldName, value } = req.params;
    let cards = handleFilterEndpoint(res, fieldName, value);
    let contentType = 'application/json';
    if (req.get('Accept') === 'application/xml') {
        contentType = 'application/xml';
        cards = convertCardsToXML(cards);
    }
    if (cards && cards.length > 0) {
        res.set({
            'Content-Type': contentType,
            'Content-Length': JSON.stringify(cards).length,
            'X-Coder': 'ME',
        });
        res.end();
    } else {
        res.status(404).end();
    }
});
// dynamic endpoint that accepts a field name and value to find cards
router.get('/:fieldName/:value', (req, res) => {
    const { fieldName, value } = req.params;
    const cards = handleFilterEndpoint(res, fieldName, value);
    let formattedCards = cards;
    if (req.get('Accept') === 'application/xml') {
        formattedCards = convertCardsToXML(cards);
    }
    if (formattedCards && formattedCards.length > 0) {
        res.status(200).send(formattedCards);
    } else {
        res.status(404).send({ message: `No cards found with ${fieldName} matching ${value}` });
    }
});

const handleFilter = (req, res) => {
    const filters = req.query;
    const filterKeys = Object.keys(filters).map((key) => key.toLowerCase()); // case-insensitive

    if (filterKeys.length === 0) {
        res.status(400).send({ message: 'No query parameters provided' });
        return null;
    }

    // Get nested key values by splitting on '.' and handle multiple values
    const normalizedFilters = {};
    Object.keys(filters).forEach((key) => {
        const keyParts = key.split('.');
        const values = filters[key].split(','); // create an OR condition

        // assign the values to the key if neccessary
        if (keyParts.length > 1) {
            normalizedFilters[keyParts[0]] = {
                ...normalizedFilters[keyParts[0]],
                [keyParts[1]]: values,
            };
        } else {
            normalizedFilters[key] = values;
        }
    });

    if (req.get('Accept') === 'application/xml') {
        return convertCardsToXML(db.getCardsByFilters(normalizedFilters));
    }
    // get cards by query parameters
    return db.getCardsByFilters(normalizedFilters);
};
router.head('/', (req, res) => {
    const cards = handleFilter(req, res);
    let contentType = 'application/json';
    if (req.get('Accept') === 'application/xml') {
        contentType = 'application/xml';
    }
    if (cards && cards.length > 0) {
        res.set({
            'Content-Type': contentType,
            'Content-Length': JSON.stringify(cards).length,
            'X-Coder': 'ME',
        });
        res.end();
    } else {
        res.status(404).end();
    }
});
// dynamic endpoint that accepts query parameters to find cards
router.get('/', (req, res) => {
    const cards = handleFilter(req, res);
    if (cards && cards.length > 0) {
        res.status(200).send(cards);
    } else {
        res.status(404).send({ message: 'No cards found matching the query parameters' });
    }
});

// // POST
router.post('/', (req, res) => {
    const cardData = req.body;

    // validate field names
    const invalidFields = validateFieldNames(Object.keys(cardData));
    // if invalid field name, return 400
    if (invalidFields.length > 0) {
        res.status(400).send({
            message: `Invalid field name: ${invalidFields.join(', ')}`,
        });
        return;
    }

    const card = db.addCard(cardData);
    if (card) {
        res.status(201).json(card);
    } else {
        res.status(500).send({ message: 'Failed to add card' });
    }
});
// {}
// // PUT
/// api/cards/GUID accepts 36 characters long alphanumeric GUIDs to update card
router.put('/:guid([0-9a-zA-Z-]{36})', (req, res) => {
    const { guid } = req.params;
    const card = db.getCardById(guid);
    if (card) {
        const cardData = req.body;

        // validate field names
        const invalidFields = validateFieldNames(Object.keys(cardData));
        // if invalid field name, return 400
        if (invalidFields.length > 0) {
            res.status(400).send({
                message: `Invalid field name: ${invalidFields.join(', ')}`,
            });
            return;
        }

        const tempCard = db.updateCard(guid, cardData);

        if (tempCard != null) {
            res.status(200).send(tempCard);
        } else {
            res.status(500).send({ message: 'Failed to update card' });
        }
    } else {
        res.status(404).send({ message: `Card with GUID ${guid} not found` });
    }
});

// // DELETE
router.delete('/:guid([0-9a-zA-Z-]{36})', (req, res) => {
    const { guid } = req.params;
    const card = db.getCardById(guid);
    if (card) {
        if (db.deleteCard(guid)) {
            res.status(200).send({ message: `Card with GUID ${guid} deleted` });
        } else {
            res.status(500).send({ message: 'Failed to delete card' });
        }
    } else {
        res.status(404).send({ message: `Card with GUID ${guid} not found` });
    }
});

module.exports = router;
