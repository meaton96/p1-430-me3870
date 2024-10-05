const express = require('express');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const app = express();
const quotesRouter = require('./routes/quotes.js');
const indexRouter = require('./routes/index.js');
const apiRouter = require('./routes/api.js');

app.use(express.static('client'));
app.use(express.json());

app.use('/quotes', quotesRouter);
app.use('/api', apiRouter);
app.use('/', indexRouter);

app.listen(port, () => {
  // console.log(`App running on http://localhost:${port}`);
});
