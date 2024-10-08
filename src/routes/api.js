const express = require('express');
const db = require('../db.js');

const router = express.Router();
// GET
{
// Helper function to validate field names
    const validateFieldNames = (fieldNames) => {
        const invalidFields = fieldNames.filter(
            (fieldName) => !db.VALID_FIELD_NAMES.includes(fieldName.toLowerCase()),
        );
        return invalidFields;
    };

    router.get('/fields', (req, res) => {
        res.status(200).json({ 'valid class properties': db.VALID_FIELD_NAMES });
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
    // (slightly redundant with next endpoint)
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
// {}

module.exports = router;
