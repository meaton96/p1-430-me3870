// docs api endpoint
const express = require('express');

const router = express.Router();
const path = require('path');
const fs = require('fs');

const docsPath = path.resolve(__dirname, '../data/docs.json');

router.get('/', (req, res) => {
    const jsonString = fs.readFileSync(docsPath);
    const docs = JSON.parse(jsonString);
    if (docs) {
        res.status(200).json(docs);
    } else {
        res.status(404).send({ message: 'missing docs file' });
    }
});

module.exports = router;
