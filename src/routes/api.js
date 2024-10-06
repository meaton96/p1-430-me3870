const express = require('express');
const db = require('../db.js');

// const generateNewId = () => crypto.randomUUID();
const router = express.Router();

router.get('/card/:guid([0-9,a-z,A-Z,-]{36})', (req, res) => {
    const { guid } = req.params;
    const card = db.getCardById(guid);
    if (!card) {
        res.status(404).send({ message: `Card with GUID ${guid} not found` });
    } else {
        res.status(200).json(card);
    }
});
router.get('/all-cards', (req, res) => {
    const cards = db.getAllCards();
    if (cards && cards.length > 0) {
        res.status(200).json(cards);
    } else {
        res.status(404).send({ message: 'No cards found' });
    }
});
router.get('/random-card', (req, res) => {
    const card = db.getRandomCard();
    if (card) {
        res.status(200).json(card);
    } else {
        res.status(404).send({ message: 'No card found' });
    }
});
router.get('/recent-card', (req, res) => {
    const card = db.getRecentCard();
    if (card) {
        res.status(200).json(card);
    } else {
        res.status(404).send({ message: 'No card found' });
    }
});

module.exports = router;
