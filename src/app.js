const express = require('express');
const path = require('path');
const port = process.env.PORT || process.env.NODE_PORT || 3000;

const app = express();
//const indexRouter = require('./routes/index.js');
const apiRouter = require('./routes/api.js');
const filePath404Page = path.resolve(__dirname, '../client/404.html');

app.use(express.static('client'));
app.use(express.static(path.join(__dirname, 'card-editor/dist')));
app.use(express.json());

app.use('/api', apiRouter);
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'card-editor/dist', 'index.html'));
});
app.all('*', (req, res) => {
    res.status(404).sendFile(filePath404Page);
});
//app.use('/', indexRouter);

app.listen(port, () => {
	console.log(`App running on http://localhost:${port}`);
});
