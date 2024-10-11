const express = require('express');
const db = require('../db.js');

const router = express.Router();


// GET/HEAD
router.get('/all', (req, res) => {
    const effects = db.getAllEffects();
    if (effects && effects.length > 0) {
        res.status(200).json(effects);
    } else {
        res.status(404).send({ message: 'No effects found' });
    }
});

router.get('/:id', (req, res) => {
    const effect = db.getEffectById(req.params.id);
    if (effect) {
        res.status(200).json(effect);
    } else {
        res.status(404).send({ message: 'Effect not found' });
    }
});


module.exports = router;