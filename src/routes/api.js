const express = require('express');

const generateNewId = () => crypto.randomUUID();
const hoots = [{
  id: generateNewId(),
  content: "Let's Rock!",
  createdAt: new Date(),
}];
const router = express.Router();

const getHootById = (id) => hoots.find((hoot) => hoot.id === id);

const deleteHootById = (id) => {
  const index = hoots.findIndex((hoot) => hoot.id === id);
  if (index !== -1) {
    const hoot = hoots[index];
    hoots.splice(index, 1);
    return hoot;
  }
  return '';
};

router.put('/updateHoot/:id([0-9,a-z,A-Z,-]{36})', (req, res) => {
  const hoot = getHootById(req.params.id);
  // console.log(hoot);
  if (!hoot) {
    const error = `id: '${req.params.id}' not found`;
    res.status(404).send(error);
  } else {
    const { content } = req.body;
    if (!content) {
      res.status(400).send({ message: 'Content is required' });
      return;
    }
    hoot.content = content;
    hoot.updatedAt = new Date();
    res.json(hoot);
  }
});
router.delete('/deleteHoot/:id([0-9,a-z,A-Z,-]{36})', (req, res) => {
  const hoot = deleteHootById(req.params.id);
  if (!hoot) {
    const error = `id: '${req.params.id}' not found`;
    res.status(404).send({ message: error });
  } else {
    res.status(200).send(hoot);
  }
});
router.post('/addHoot', (req, res) => {
  const { content } = req.body;
  if (!content) {
    res.status(400).send({ message: 'Content is required' });
    return;
  }
  const hoot = {
    id: generateNewId(),
    content,
    createdAt: new Date(),
  };
  hoots.push(hoot);
  res.status(201).send(hoot);
});
router.get('/hoots/:id([0-9,a-z,A-Z,-]{36})', (req, res) => {
  const hoot = getHootById(req.params.id);
  if (!hoot) {
    const error = `id: '${req.params.id}' not found`;
    res.status(404).send({ message: error });
  } else {
    res.status(200).json(hoot);
  }
});
router.get('/hoots', (req, res) => {
  res.status(200).json(hoots);
});

router.get('/helloJSON', (req, res) => {
  res.status(200).send({ message: 'Hello there!' });
});
router.get('/timeJSON', (req, res) => {
  res.status(200).json({ time: new Date().toTimeString() });
});
module.exports = router;
