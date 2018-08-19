const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const sceneRoutes = require('./api/routes/scenes');
const twitterRoutes = require('./api/routes/twitter');

app.use(morgan('dev'));
app.use('/scenes', express.static('scenes')); //makes scenes folder static
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
  });

//Routes which should handle requests
app.use('/scenes', sceneRoutes);
app.use('/twitter', twitterRoutes);

app.get('/', (req, res, next) => {
    res.sendFile(__dirname+"/static/index.html");
});

//Error handling
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error); 
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;