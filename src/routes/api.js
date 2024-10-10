const express = require('express');
const db = require('../db.js');

const router = express.Router();
// GET/HEAD
{
    // Helper function to validate field names
    const validateFieldNames = (fieldNames) => {
        const invalidFields = fieldNames.filter(
            (fieldName) => !db.VALID_FIELD_NAMES.includes(fieldName.toLowerCase()),
        );
        return invalidFields;
    };
    router.head('/fields', (req, res) => {
        if (db.VALID_FIELD_NAMES && db.VALID_FIELD_NAMES.length > 0) {
            res.set({
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(db.VALID_FIELD_NAMES).length,
                'X-Coder': 'ME',
            })
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
    
    router.get('/filters', (req, res) => {
        if (db.VALID_FILTER_NAMES && db.VALID_FILTER_NAMES.length > 0) {
            res.status(200).json(db.VALID_FILTER_NAMES);
        } else {
            res.status(404).send({ message: 'No field names found' });
        }
    });

    // full list of cards
    router.get('/all', (req, res) => {
        const cards = db.getAllCards();
        if (cards && cards.length > 0) {
            res.status(200).json(cards);
        } else {
            res.status(404).send({ message: 'No cards found' });
        }
    });

    // random card
    router.get('/random', (req, res) => {
        const card = db.getRandomCard();
        if (card) {
            res.status(200).json(card);
        } else {
            res.status(404).send({ message: 'No card found' });
        }
    });

    // last card in the list
    router.get('/recent', (req, res) => {
        const card = db.getRecentCard();
        if (card) {
            res.status(200).json(card);
        } else {
            res.status(404).send({ message: 'No card found' });
        }
    });
    // /api/cards/GUID accepts 36 characters long alphanumeric GUIDs to find 1 card
    router.get('/:guid([0-9a-zA-Z-]{36})', (req, res) => {
        const { guid } = req.params;
        const card = db.getCardById(guid);
        if (card) {
            res.status(200).json(card);
        } else {
            res.status(404).send({ message: `Card with GUID ${guid} not found` });
        }
    });

    // dynamic endpoint that accepts a field name and value to find cards
    router.get('/:fieldName/:value', (req, res) => {
        const { fieldName, value } = req.params;

        // validate field name
        const invalidFields = validateFieldNames([fieldName]);
        // if invalid field name, return 400
        if (invalidFields.length > 0) {
            res.status(400).send({
                message: `Invalid field name: ${invalidFields.join(', ')}`,
            });
            return;
        }
        // get cards by field name and value
        const cards = db.getCardsByField(fieldName, value);

        if (cards && cards.length > 0) {
            res.status(200).json(cards);
        } else {
            res.status(404).send({ message: `No cards found with ${fieldName} matching ${value}` });
        }
    });

    // dynamic endpoint that accepts query parameters to find cards
    router.get('/', (req, res) => {
        const filters = req.query;
        const filterKeys = Object.keys(filters).map((key) => key.toLowerCase()); // case-insensitive

        // if no query parameters, return 400
        if (filterKeys.length === 0) {
            res.status(400).send({ message: 'No query parameters provided' });
            return;
        }
        // validate field names
        const invalidFields = validateFieldNames(filterKeys);
        // if invalid field names, return 400
        if (invalidFields.length > 0) {
            res.status(400).send({
                message: `Invalid field name(s): ${invalidFields.join(', ')}`,
            });
            return;
        }
        // get cards by query parameters
        const cards = db.getCardsByFilters(filters);
        if (cards && cards.length > 0) {
            res.status(200).json(cards);
        } else {
            res.status(404).send({ message: 'No cards found matching the query parameters' });
        }
    });
}
// // POST
// {}
// // PUT
// {}

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
