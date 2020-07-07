require('./models/db');

const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
var formidable = require('express-formidable')
var fs = require('fs');
const addDisController = require('./controllers/addPosController');
const usersController = require('./controllers/commercialController');
var app = express();
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());

app.use('/dis', addDisController);
app.use('/', usersController);
app.use(formidable({
	uploadDir: 'public'
}));

app.listen(3000, () => {
    console.log('server est bien lancé sur le Port: 3000');
});

