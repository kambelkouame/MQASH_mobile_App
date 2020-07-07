const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Commercial = mongoose.model('Commercial');
var cookieParser = require('cookie-parser')





router.post('/register', (req, res) => {
    insertCommercial(req, res);
});


function insertCommercial(req, res) {
   if(req.body.fullName==''|| req.body.last_name=='' || req.body.email=='' || req.body.phone=='' || req.body.password=='' ){
         res.jsonp({message:' Veillez vous Assurer que tous les champs sont bien remplis'})
    }else{

    Commercial.findOne({email: req.body.email})
    
   .then(commercial=>{
       if(!commercial){
            var commercial = new Commercial();
            commercial.fullName = req.body.fullName;
            commercial.last_name = req.body.last_name;
            commercial.email = req.body.email;
            commercial.phone = req.body.phone;
            commercial.password = req.body.password;
            commercial.CreationDate = Date.now();
            commercial.lastConnect =  Date.now();
            commercial.save((err, doc) => {
                if (!err){
                  
                      res.jsonp({message:'l\'utilisateur a été crée avec succes'}) 
                  
               }else{

                    res.jsonp({message:'Erreur lors de la creation de l utilisateur ' });
                      }
    });
  }else{
    res.jsonp({message:'l\'utilisateur existe déja'}) 
}
})
 }
 }
 
router.post("/login", function(req, res){

    if(req.body.phone && req.body.password){
Commercial.findOne({phone: req.body.phone, password: req.body.password})
   .then(commercial => {
      if (commercial) {
        const infouser = {
        _id: commercial._id,
        fullName : req.body.fullName,
        last_name : req.body.last_name,
        email : req.body.email,
        phone : req.body.phone,
        password : req.body.password
       
        }

           res.cookie("info", infouser)
            
             
       res.jsonp({message: 'validate'})
  
      } else if (req.body.phone && req.body.password)  {

        Commercial.findOne({email: req.body.phone, password: req.body.password})
        .then(commercial => {
            if (commercial) {
                const infouser = {
                _id: commercial._id,
                fullName : req.body.fullName,
                last_name : req.body.last_name,
                email : req.body.email,
                phone : req.body.phone,
                password : req.body.password
            
                }

                res.cookie("info", infouser)
                    
            res.jsonp({message: 'validate'})
        
            } else {
                res.jsonp({ error: 'l utilisateur n existe pas' })
            }
            })
            .catch(err => {
            res.send('error: ' + err)
            })

       
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
}


    
        
});


router.get('/register/list', (req, res) => {
    Commercial.find((err, docs) => {
        if (!err) {
           
            res.jsonp({commercial: docs})
        }
        else {
            res.send('Erreur dans l affichage de la maison:' + err);
        }
    });
});


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Commercial.findById(req.params.id, (err, doc) => {
        if (!err) {
            
              
            res.jsonp({Commercial: doc})
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Commercial.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.send('Distributeur supprimer')
        }
        else { res.json('Erreur lors de la suppression de la maison :' + err); }
    });
});
router.get('/logout', function(req, res, next) {
  //supprimer la variable cookie user
  res.clearCookie("info")
  //retourne la vue connexion
  res.redirect("/login")
});

module.exports = router;