const fs = require('fs');
const path = require('path');

const quotesPath = path.resolve(__dirname, 'data/quotes-data.json');
const jsonString = fs.readFileSync(quotesPath);
const data = JSON.parse(jsonString);
const { quotes } = data; // object destructuring

// PUBLIC METHODS
const getAllQuotes = () => quotes;
const getQuoteById = (id) => quotes.find((quote) => quote.id === id);
const getRecentQuote = () => quotes.slice(-1)[0];
const getRandomQuote = () => quotes[Math.floor(Math.random() * quotes.length)];

module.exports = {
  getAllQuotes, getQuoteById, getRecentQuote, getRandomQuote,
};
