const express = require('express');

const router = express.Router();
const path = require('path');

const filePath404Page = path.resolve(__dirname, '../../client/404.html');

router.get('/', (req, res) => {
  res.send('Hello world!');
});
router.get('/bye', (req, res) => {
  res.send('Goodbye!');
});
router.all('*', (req, res) => {
  res.status(404).sendFile(filePath404Page);
});

module.exports = router;
