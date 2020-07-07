const mongoose = require('mongoose');

var DocumentSchema = new mongoose.Schema({
    id_id: {
        type: String,
      
    },
    rccm: {
        type: String
    },
    status: {
        type: String
    },
    cnr: {
        type: String
    },
    cnv: {
        type: String
    },
    rccm: {
        type: String
    },
    DFE: {
        type: String
    },
    contrat: {
        type: String
    },
    quitance: {
        type: String
    },
    CreationDate: {
        type: Date,
        defaut: Date.now()
    },
    lastConnect: {
        type: Date
    }

    
});

mongoose.model('Doc', DocumentSchema);