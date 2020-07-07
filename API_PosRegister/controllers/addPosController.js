const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Pos = mongoose.model('Pos');
const Doc = mongoose.model('Doc');
var generatePassword = require('password-generator');
const multer = require('multer')
const bodyParser = require('body-parser')
var Promise = require('promise');
const request = require('request');
var formidable = require('express-formidable')
var fs = require('fs');
var Dis;
var pos;
var posInd;





async function sendSms(message, phoneNumber) {
    return new Promise(function (resolve, reject) {
        var test = false;
        try {
       requestString = "http://smspro.mtn.ci/bms/Soap/Messenger.asmx/HTTP_SendSms?customerID=4266&userName=AMEDAYENOU&userPassword=Password001&originator=ASSUR'TOUS&messageType=Latin&defDate=20190401143600&blink=false&flash=false&Private=false&recipientPhone=225" + phoneNumber + "&smsText=" + message

            request(requestString, { json: true }, (err, res_, body) => {
                if (err) throw err
                var parseString = require('xml2js').parseString;
                parseString(body, function (err, result) {
                    result.SendResult.Result
                    console.log(result.SendResult.Result[0]);
                    if (result.SendResult.Result[0] == "OK") {
                        test = true;
                        resolve(test);
                    }
                });
                resolve(test);
            });
        } catch (error) {
            reject(error);
        }
    });
}


const Storage = multer.diskStorage({
    destination(req, file, callback) {
      callback(null, 'public')
    },
    filename(req, file, callback) {
      callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`)
    },
  })
  
  const upload = multer({ storage: Storage })
  

  router.post('/upload', (req, res) => {
	fs.rename(req.files.avatar.path, req.files.avatar.path + '.jpg',
	err => {
		res.send('');
	});
	
})


router.get('/', (req, res) => {
    var message ='Bonjour Cher Partenaire MQash,Vous disposez desormais d un compte sur notre plateforme. Connectez-vous sur : avec les informations suivantes Identifiant Mot de passe provisoire Vous devez changer votre mot de passe lors de votre premiere connexion';
     sendSms(message,77373487)
        

});


router.post('/', (req, res) => {

        insertPos(req, res);  
});


function  insertPos(req, res) {


if(req.body.fullName==' '||req.body.adresse==' ' || req.body.ville==' ' ||req.body.nomCommercial==' ' || req.body.telephone==' ' || req.body.pays==' ' || req.body.rccm==' ' || 
 req.body.typePos==' ' )
{
 res.jsonp({message:' Veillez vous Assurer que tous les champs sont bien remplis'})
  
 }else{
     var username = generatePassword(12, false, /\d/, 'MQash_User');

    Pos.findOne({username: username})
     .then(pos=>{
        if(!pos){

            var pos = new Pos();
            pos.fullName = req.body.fullName;
            pos.email = req.body.email;
            pos.password = generatePassword(12, false, /\d/, 'DIS-');
            pos.username = username;
            pos.typePos =req.body.typePos;
            pos.agentTerrain =req.body.agentTerrain;
            pos.informations_comp={
               "pays":req.body.pays,
                "ville": req.body.ville,
                "adresse": req.body.adresse,
               "nomCommercial":req.body.nomCommercial,
                "telephone": req.body.telephone,
                "rccm":req.body.rccm,
            }
            pos.id_dis =  req.body.id_dis;
            pos.document =  req.body.document;
            pos.save (async (err, doc) => {
                if (!err){
                    console.log(pos)
                res.jsonp({message:'succes',id:pos._id}) 
               
                   var message ="Bonjour Cher Partenaire MQash,\n\n Vous disposez desormais d un compte sur notre plateforme. Connectez-vous sur :\n\n https://postransfertargent.azurewebsites.net avec les informations suivantes: Identifiant :"+ pos.username +", Mot de passe provisoire:"+ pos.password+". Vous devez changer votre mot de passe lors de votre premiere connexion.";
                 await sendSms(message,req.body.telephone)
                 

                }
                else {
                    
          res.jsonp({message:"erreur"+ err})
                   
                }
            });
        }else{

             res.jsonp({message:'Existe'}) 
        }
       
     })
          
}
}


function updatePos(req, res) {
    Pos.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.jsonp({pos: req.body})
         }
       
            else{
                res.send('Erreur lors  de la modification : ' + err);
            }
        
    });
}


router.post('/updateStatut', (req, res) => {
  
    Pos.findOneAndUpdate({ fullName: req.body.fullName}, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.jsonp({user: req.body})
         }
       
            else{
                res.send('Erreur lors  de la modification : ' + err);
            }
        
    });
    });
  

router.get('/list', (req, res) => {
    Pos.find((err, docs) => {
        if (!err) {
                
            res.json({Distributor: docs})
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

router.get('/agent/:agentTerrain', (req, res) => {
    
    Pos.find({agentTerrain: req.params.agentTerrain})
        .then(pos=>{
            if(pos){
               nbdis=pos.length
              /* Pos.find({typePos:'PosInd'})
                    .then(on=>{
                       if(on){
                        PosInd=on.length
                        Pos.find({typePos:'Dis'})
                        .then(is=>{
                            if(is){
                                Dis=is.length
                                Pos.find({typePos:'Pos'})
                                 .then(enr=>{
                                    if(enr){
                                        Pos = enr.length
                                        res.jsonp({enregistrement:pos,nbDis:nbdis,Pos:Pos,Dis:'Dis',PosInd:'PosInd'}) 
                                    }else{
                                        res.jsonp({enregistrement:pos,nbDis:nbdis,Pos:'0',Dis:'Dis',PosInd:'PosInd'}) 
                                    }
                                })
                                
                            }else{
                                res.jsonp({enregistrement:pos,nbDis:nbdis,Pos:'0',Dis:'0',PosInd:'PosInd'})
                            }

                        })

                       } else{
                        Pos.find({typePos:'Dis'})
                            .then(is=>{
                                if(is) {
                                  Dis=is.length  
                                  Pos.find({typePos:'Pos'})
                                  .then(en=>{
                                      if(en){
                                          Pos=en.length
                                          res.jsonp({enregistrement:pos,nbDis:nbdis,Pos:Pos,Dis:'Dis',PosInd:'0'})   
                                      }else{
                                        res.jsonp({enregistrement:pos,nbDis:nbdis,Pos:'0',Dis:'0',PosInd:'0'})  
                                      }

                                  })
                                }else{
                                    Pos.find({typePos:'Pos'})
                                    .then(en=>{
                                        if(en){
                                            Pos=en.length
                                            res.jsonp({enregistrement:pos,nbDis:nbdis,Pos:Pos,Dis:'0',PosInd:'0'})    
                                        }
                                    })  
                                }
                            })
                       }
                    })*/
                res.jsonp({enregistrement:pos,nbDis:nbdis}) 
            }else{
                res.jsonp({message:'aucun enregistrement',})   
            }
            })                
         
});





router.get('/:id', (req, res) => {
    Pos.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.jsonp({pos: doc})
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Pos.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.jsonp({message:'Distributor delete'})
        }
        else { 
            res.json({message:'Erreur lors de la suppression de la maison :' + err});
             }
    });
});

module.exports = router;