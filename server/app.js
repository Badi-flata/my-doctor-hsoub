const express = require('express');
require('dotenv').config();
const logger = require('morgan');
const DB = require('../models/DataBase/data');
const Relations = require('../models/relations');

const port = process.env.PORT || 8080;
const cors = require('cors');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(logger('dev'));

app.use('/api', indexRouter);
app.use('/users', usersRouter);

app.use((req, res, next) => {
    const err = new Error('Route Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        message: err.message || 'Internal Server Error'
    });
});

DB.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((err) => {
    console.error('Database sync error:', err.message);
});

module.exports = app;
