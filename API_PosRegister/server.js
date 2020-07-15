require('./models/db');

const express = require('express');
const path = require('path');

const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');


var app = express();
var cors = require('cors')
app.use(bodyparser.urlencoded({
    extended: true
}));

app.use(bodyparser.json());
app.use(cors());

const addDisController = require('./controllers/addPosController');
const usersController = require('./controllers/commercialController');


app.use('/dis', addDisController);
app.use('/', usersController);


app.listen(3000, () => {
    console.log('server est bien lancé sur le Port: 3000');
});

