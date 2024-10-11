const express = require('express');
const path = require('path');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const app = express();
const cardApiRouter = require('./routes/api.js');
const assetRouter = require('./routes/assets.js');
const docsRouter = require('./routes/docs.js');
const effectsRouter = require('./routes/effects.js');

const indexPage = path.resolve(__dirname, '../client/frontend/index.html');
// const filePath404Page = path.resolve(__dirname, '../client/404.html');

app.use(express.static(path.resolve(__dirname, '../client')));
app.use(express.static(path.resolve(__dirname, '../client/frontend')));
app.use(express.static(path.resolve(__dirname, '../client/assets')));
app.use(express.static(path.resolve(__dirname, '../client/assets/cards/webp')));
app.use(express.json());

app.use('/api/cards', cardApiRouter);
app.use('/api/assets', assetRouter);
app.use('/api/effects', effectsRouter);
app.use('/api/docs', docsRouter);

app.get('*', (req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        res.status(404).send({ message: 'Invalid API endpoint' });
    } else {
        res.sendFile(indexPage); // send the react page
    }
});

app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});
