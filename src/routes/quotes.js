const express = require('express');
const path = require('path');
const db = require('../db.js');

const router = express.Router();
const filePath404Page = path.resolve(__dirname, '../../client/404.html');

// just 3 quotes for now
const data = db.getAllQuotes();

const findQuoteById = (id, res) => {
  if (id) {
    const quote = db.getQuoteById(id);
    if (quote) {
      res.json(quote);
    } else {
      res.status(404).sendFile(filePath404Page);
    }
  } else {
    res.json(data);
  }
};

router.get('/', (req, res) => {
  const { id } = req.query;
  findQuoteById(id, res);
});
router.get('/random', (req, res) => {
  res.status(200).json(db.getRandomQuote());
});
router.get('/recent', (req, res) => {
  res.status(200).json(db.getRecentQuote());
});
router.get('/:id', (req, res) => {
  const { id } = req.params;
  findQuoteById(id, res);
});

module.exports = router;
