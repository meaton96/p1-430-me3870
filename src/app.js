const express = require('express');
const path = require('path');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const app = express();
const cardApiRouter = require('./routes/api.js');

const indexPage = path.resolve(__dirname, '../client/frontend/index.html');
const filePath404Page = path.resolve(__dirname, '../client/404.html');

app.use(express.static('client'));
app.use(express.static('client/frontend'));
app.use(express.json());

app.use('/api/cards', cardApiRouter);
app.get('/', (req, res) => {
    res.sendFile(indexPage);
});
app.all('*', (req, res) => {
    res.status(404).sendFile(filePath404Page);
});
// app.use('/', indexRouter);

app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});
