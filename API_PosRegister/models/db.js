const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect('mongodb://localhost:27017/PosMobileRegister', { useNewUrlParser: true }, (err) => {
    if (!err) { console.log('MongoDB connectée avec success.') }
    else { console.log('Erreur lors de la connexion a la BD Mongo : ' + err) }
});

require('./addPos.model');
require('./document.model');
require('./commercial.model');