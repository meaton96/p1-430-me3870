const express = require('express');

const router = express.Router();
const path = require('path');

const filePath404Page = path.resolve(__dirname, '../../client/404.html');
const simpleHomePage = path.resolve(__dirname, '../../client/index.html');

router.get('/', (req, res) => {
  if (simpleHomePage) {
    res.status(200).sendFile(simpleHomePage);
  } else {
    res.status(404).sendFile(filePath404Page);
  }
});
// router.get('/bye', (req, res) => {
//   res.send('Goodbye!');
// });
router.all('*', (req, res) => {
  res.status(404).sendFile(filePath404Page);
});

module.exports = router;
