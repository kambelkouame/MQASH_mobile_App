const mongoose = require('mongoose');

var addPosSchema = new mongoose.Schema({

    id_dis:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Pos' }],
    fullName: {
        type: String,
        required: 'Full name can\'t be empty'
    },
    email: {
        type: String
      
    },
    password: {
        type: String
       
    },
    username: {
        type: String
        
    },
    typePos: {
        type: String
        
    },
    agentTerrain: {
        type: String
        
    },
    quota:{
        type: Number,
        default: 0
    },
    saltSecret: String,
    informations_comp: {
        type: Object
    },
    document:{
        type:Object,
        require:true
    },
    firstConnect: {
        type: Boolean,
        default: true
    },
    lastConnection: {
        type: Date,
        default:null
    },
    lastDeconnexion: {
        type: Date,
        default:null
    },
    dateSave: {
        type: Date,
        required: true,
        default: Date.now()
    }
    
});


mongoose.model('Pos', addPosSchema);