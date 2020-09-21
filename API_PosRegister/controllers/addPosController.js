const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Pos = mongoose.model('Pos');
const Doc = mongoose.model('Doc');
var generatePassword = require('password-generator');
const multer = require('multer')
const bodyparser = require('body-parser')
const path = require('path');
var Promise = require('promise');
const request = require('request');
var fs = require('fs');
const excelToJson = require('convert-excel-to-json');
const { runInContext } = require('vm');
var Dis;
var pos;
var posInd;
global.__basedir = __dirname;

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'public')
    },
    filename: (req, file, callBack) => {
        callBack(null, Date.now() + '_' + `${file.originalname}`)

    }

}
)

const upload = multer({ storage: storage })




async function sendSms(message, phoneNumber) {
    return new Promise(function (resolve, reject) {
        var test = false;
        try {
            requestString = "http://smspro.mtn.ci/bms/Soap/Messenger.asmx/HTTP_SendSms?customerID=4266&userName=AMEDAYENOU&userPassword=Password001&originator=ASSUR'TOUS&messageType=Latin&defDate=20190401143600&blink=false&flash=false&Private=false&recipientPhone=228" + phoneNumber + "&smsText=" + message

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

/*
const Storage = multer.diskStorage({
    destination(req, file, callback) {
      callback(null, 'public')
    },
    filename(req, file, callback) {
      callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`)
    },
  })
  
  const upload = multer({ storage: Storage })
  
*/
/*
router.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
      res.send(file)
    
  })*/

router.post('/uploadData', upload.single('myFile'), (req, res, next) => {

    const files = req.files;
    const info = req.body;
    console.log(files);
    console.log(info)
})


router.post('/uploadfile', upload.single("uploadfile"), async(req, res) => {
    console.log(req.file.filename)
   await importExcelData2MongoDB('public/pos/' + req.file.filename, res);
    res.json({
        'msg': 'File uploaded/import successfully!', 'file': req.file
    });
});

async function importExcelData2MongoDB(filePath, res) {
    const excelData = excelToJson({
        sourceFile: filePath,
        sheets: [{
            name: 'POS',
            header: {
                rows: 1
            },
            columnToKey: {
                A: '_id',
                B: 'fullName',
                C: 'email',
                D: 'typePos',
                E: 'pays',
                F: 'ville',
                G: 'adresse',
                H: 'nomCommercial',
                I: 'telephone',
                J: 'rccm'

            }
        }]
    });

    //console.log(excelData);	
    //excelData=JSON.parse(excelData)
    fs.unlinkSync(filePath);
    await insertExeclData(excelData.POS, res)
}


async function insertExeclData(data, res) {
    try {
        var ID_DIST
        data = JSON.stringify(data)
        data = JSON.parse(data)

        data.forEach(async (body) => {

            if (body.typePos == "Master Distributeur") {
                if (body.fullName == ' ') {
                    res.jsonp({ message: 'le champs \'nom du gérant\' est vide ' })
                } else if (body.adresse == ' ') {

                    res.jsonp({ message: 'le champs \'adresse\' est vide ' })
                } else if (body.ville == ' ') {
                    res.jsonp({ message: 'le champs \'ville\' est vide ' })
                } else if (body.nomCommercial == ' ') {
                    res.jsonp({ message: 'le champs \'nom commercial\' est vide ' })
                } else if (body.telephone == ' ') {
                    res.jsonp({ message: 'le champs \'le téléphone\' est vide ' })
                } else if (body.pays == ' ') {
                    res.jsonp({ message: 'le champs \'pays\' est vide ' })
                } else if (body.rccm == ' ') {
                    res.jsonp({ message: 'le champs \'rrcm \' est vide ' })
                } else if (body.typePos == ' ') {
                    res.jsonp({ message: 'le champs \'type POS\' est vide ' })
                } else {
                    
                    const user = await Pos.findOne({ fullName: body.fullName })
                    if (!user) {
                        var pos = new Pos({
                            fullName: body.fullName,
                            email: body.email,
                            password: generatePassword(12, false, /\d/, 'DIS-'),
                            username:  await UsernameGenerate(),
                            typePos: body.typePos,
                            agentTerrain: body.agentTerrain,
                            informations_comp: {
                                "pays": body.pays,
                                "ville": body.ville,
                                "adresse": body.adresse,
                                "nomCommercial": body.nomCommercial,
                                "telephone": body.telephone,
                                "rccm": body.rccm,
                            },
                            id_dis: body.id_dis,
                            document: body.document,
                        })

                        const PosSave = await pos.save()
                     
                        if (PosSave) {
                            data.forEach(async (pointVente) => {
                               
                                //console.log(username)
                                if (pointVente.typePos == "Sous Agent") {
                                   username =await UsernameGenerate()
                                   var userVerified = await Pos.findOne({ username: username })
                                    if(!userVerified){
                                        console.log(username)
                                        const Posuser = await Pos.findOne({ fullName: pointVente.fullName })
                                    if (!Posuser) {
                                        var pos = new Pos({
                                            fullName: pointVente.fullName,
                                            email: pointVente.email,
                                            password: generatePassword(12, false, /\d/, 'DIS-'),
                                            username: await UsernameGenerate(),
                                            typePos: pointVente.typePos,
                                            agentTerrain: pointVente.agentTerrain,
                                            informations_comp: {
                                                "pays": pointVente.pays,
                                                "ville": pointVente.ville,
                                                "adresse": pointVente.adresse,
                                                "nomCommercial": pointVente.nomCommercial,
                                                "telephone": pointVente.telephone,
                                                "rccm": pointVente.rccm,
                                            },
                                            id_dis: PosSave._id,
                                            document: pointVente.document,
                                        })

                                        const PosSell = await pos.save()
                                        console.log(PosSell)
                                    }else{
                                        res.jsonp({message:"Point de vente exite deja"})
                                    }
                                    }else{

                                        userVerified = await Pos.findOne({ username: username })
                                        while (userVerified) {
                                            username =await UsernameGenerate()
                                            info = await Pos.findOne({ username: username })
                                        }

                                        const Posuser = await Pos.findOne({ fullName: pointVente.fullName })
                                        if (!Posuser) {
                                            var pos = new Pos({
                                                fullName: pointVente.fullName,
                                                email: pointVente.email,
                                                password: generatePassword(12, false, /\d/, 'DIS-'),
                                                username: await UsernameGenerate(),
                                                typePos: pointVente.typePos,
                                                agentTerrain: pointVente.agentTerrain,
                                                informations_comp: {
                                                    "pays": pointVente.pays,
                                                    "ville": pointVente.ville,
                                                    "adresse": pointVente.adresse,
                                                    "nomCommercial": pointVente.nomCommercial,
                                                    "telephone": pointVente.telephone,
                                                    "rccm": pointVente.rccm,
                                                },
                                                id_dis: PosSave._id,
                                                document: pointVente.document,
                                            })
    
                                            const PosSell = await pos.save()
                                            console.log(PosSell)
                                        }else{
                                            res.jsonp({message:"Point de vente exite deja"})
                                        }

                                    }
                                
                                   
                                    
                                }

                                });
                        } else {
                            res.jsonp({ message: 'save failled' })
                        }
                    }else{
                       // res.jsonp({message:"Point de vente exite deja"})  
                    }

                }
            }

        });


    } catch (error) {
        console(error)
    }

}

function insertPosExecl(data, res) {
    var ID_DIST
    data = JSON.stringify(data)
    data = JSON.parse(data)
    //console.log('bosy est :'+data)

    data.forEach(body => {
        //console.log(body)
        if (body.typePos == "Master Distributeur") {
            if (body.fullName == ' ') {
                res.jsonp({ message: 'le champs \'nom du gérant\' est vide ' })
            } else if (body.adresse == ' ') {

                res.jsonp({ message: 'le champs \'adresse\' est vide ' })
            } else if (body.ville == ' ') {
                res.jsonp({ message: 'le champs \'ville\' est vide ' })
            } else if (body.nomCommercial == ' ') {
                res.jsonp({ message: 'le champs \'nom commercial\' est vide ' })
            } else if (body.telephone == ' ') {
                res.jsonp({ message: 'le champs \'le téléphone\' est vide ' })
            } else if (body.pays == ' ') {
                res.jsonp({ message: 'le champs \'pays\' est vide ' })
            } else if (body.rccm == ' ') {
                res.jsonp({ message: 'le champs \'rrcm \' est vide ' })
            } else if (body.typePos == ' ') {
                res.jsonp({ message: 'le champs \'type POS\' est vide ' })
            } else {


                Pos.find((err, docs) => {
                    if (!err) {
                        var number = docs.length
                        number = number + 1
                        var username = 'MQPOS-' + '00' + number

                        Pos.findOne({ usename: username })
                            .then(user => {
                                if (!user) {
                                    Pos.findOne({ fullName: body.fullName })
                                        .then(pos => {
                                            if (!pos) {
                                                var pos = new Pos();
                                                pos.fullName = body.fullName;
                                                pos.email = body.email;
                                                pos.password = generatePassword(12, false, /\d/, 'DIS-');
                                                pos.username = username;
                                                pos.typePos = body.typePos;
                                                pos.agentTerrain = body.agentTerrain;
                                                pos.informations_comp = {
                                                    "pays": body.pays,
                                                    "ville": body.ville,
                                                    "adresse": body.adresse,
                                                    "nomCommercial": body.nomCommercial,
                                                    "telephone": body.telephone,
                                                    "rccm": body.rccm,
                                                }
                                                pos.id_dis = body.id_dis;
                                                pos.document = body.document;
                                                pos.save(async (err, doc) => {
                                                    if (!err) {


                                                        // var message ='Bonjour Cher Partenaire MQash,\n\nVous disposez desormais d un compte sur notre plateforme. Connectez-vous sur : \n\n https://postransfertargent.azurewebsites.net avec les informations suivantes Identifiant:'+pos.username+' Mot de passe provisoire :'+ pos.password+'.Vous devez changer votre mot de passe lors de votre premiere connexion';
                                                        //sendSms(message,pos.informations_comp.telephone)


                                                        data.forEach(pointVente => {

                                                            var number = docs.length
                                                            number = number + 1
                                                            username = 'MQPOS-' + '00' + number
                                                            if (pointVente.typePos == "Point de vente") {

                                                                Pos.findOne({ usename: username })
                                                                    .then(user => {
                                                                        users = user
                                                                        if (!users) {

                                                                            console.log('niveau 1' + username)
                                                                            Pos.findOne({ fullName: pointVente.fullName })
                                                                                .then(pos => {
                                                                                    if (!pos) {
                                                                                        var pos = new Pos();
                                                                                        pos.fullName = pointVente.fullName;
                                                                                        pos.email = pointVente.email;
                                                                                        pos.password = generatePassword(12, false, /\d/, 'DIS-');
                                                                                        pos.username = username;
                                                                                        pos.typePos = pointVente.typePos;
                                                                                        pos.agentTerrain = pointVente.agentTerrain;
                                                                                        pos.informations_comp = {
                                                                                            "pays": pointVente.pays,
                                                                                            "ville": pointVente.ville,
                                                                                            "adresse": pointVente.adresse,
                                                                                            "nomCommercial": pointVente.nomCommercial,
                                                                                            "telephone": pointVente.telephone,
                                                                                            "rccm": pointVente.rccm,
                                                                                        }
                                                                                        pos.id_dis = pointVente.id_dis;
                                                                                        pos.document = pointVente.document;
                                                                                        pos.save(async (err, doc) => {
                                                                                            if (!err) {
                                                                                                // var message ='Bonjour Cher Partenaire MQash,\n\nVous disposez desormais d un compte sur notre plateforme. Connectez-vous sur : \n\n https://postransfertargent.azurewebsites.net avec les informations suivantes Identifiant:'+pos.usrname+' Mot de passe provisoire :'+ pos.password+'.Vous devez changer votre mot de passe lors de votre premiere connexion';
                                                                                                // sendSms(message,pos.informations_comp.telephone)

                                                                                                console.log('niveau 1 ' + username)
                                                                                                Pos.findOne({ fullName: pointVente.fullName })
                                                                                                    .then(pos => {
                                                                                                        if (!pos) {
                                                                                                            var pos = new Pos();
                                                                                                            pos.fullName = pointVente.fullName;
                                                                                                            pos.email = pointVente.email;
                                                                                                            pos.password = generatePassword(12, false, /\d/, 'DIS-');
                                                                                                            pos.username = username;
                                                                                                            pos.typePos = pointVente.typePos;
                                                                                                            pos.agentTerrain = pointVente.agentTerrain;
                                                                                                            pos.informations_comp = {
                                                                                                                "pays": pointVente.pays,
                                                                                                                "ville": pointVente.ville,
                                                                                                                "adresse": pointVente.adresse,
                                                                                                                "nomCommercial": pointVente.nomCommercial,
                                                                                                                "telephone": pointVente.telephone,
                                                                                                                "rccm": pointVente.rccm,
                                                                                                            }
                                                                                                            pos.id_dis = pointVente.id_dis;
                                                                                                            pos.document = pointVente.document;
                                                                                                            pos.save(async (err, doc) => {
                                                                                                                if (!err) {
                                                                                                                    // var message ='Bonjour Cher Partenaire MQash,\n\nVous disposez desormais d un compte sur notre plateforme. Connectez-vous sur : \n\n https://postransfertargent.azurewebsites.net avec les informations suivantes Identifiant:'+pos.usrname+' Mot de passe provisoire :'+ pos.password+'.Vous devez changer votre mot de passe lors de votre premiere connexion';
                                                                                                                    // sendSms(message,pos.informations_comp.telephone)


                                                                                                                }
                                                                                                                else {

                                                                                                                    res.jsonp({ message: "erreur" + err })

                                                                                                                }
                                                                                                            });
                                                                                                        } else {

                                                                                                            res.jsonp({ message: 'Existe' })
                                                                                                        }



                                                                                                    })
                                                                                            }
                                                                                            else {

                                                                                                res.jsonp({ message: "erreur" + err })

                                                                                            }
                                                                                        });
                                                                                    } else {

                                                                                        res.jsonp({ message: 'Existe' })
                                                                                    }



                                                                                })
                                                                        } else {
                                                                            number = number + 1
                                                                            username = 'MQPOS-' + '00' + number
                                                                            console.log('niveau 2' + username)
                                                                            Pos.findOne({ usename: username })
                                                                                .then(user => {
                                                                                    if (!user) {
                                                                                        Pos.findOne({ fullName: pointVente.fullName })
                                                                                            .then(pos => {
                                                                                                if (!pos) {
                                                                                                    var pos = new Pos();
                                                                                                    pos.fullName = pointVente.fullName;
                                                                                                    pos.email = pointVente.email;
                                                                                                    pos.password = generatePassword(12, false, /\d/, 'DIS-');
                                                                                                    pos.username = username;
                                                                                                    pos.typePos = pointVente.typePos;
                                                                                                    pos.agentTerrain = pointVente.agentTerrain;
                                                                                                    pos.informations_comp = {
                                                                                                        "pays": pointVente.pays,
                                                                                                        "ville": pointVente.ville,
                                                                                                        "adresse": pointVente.adresse,
                                                                                                        "nomCommercial": pointVente.nomCommercial,
                                                                                                        "telephone": pointVente.telephone,
                                                                                                        "rccm": pointVente.rccm,
                                                                                                    }
                                                                                                    pos.id_dis = pointVente.id_dis;
                                                                                                    pos.document = pointVente.document;
                                                                                                    pos.save(async (err, doc) => {
                                                                                                        if (!err) {
                                                                                                            // var message ='Bonjour Cher Partenaire MQash,\n\nVous disposez desormais d un compte sur notre plateforme. Connectez-vous sur : \n\n https://postransfertargent.azurewebsites.net avec les informations suivantes Identifiant:'+pos.usrname+' Mot de passe provisoire :'+ pos.password+'.Vous devez changer votre mot de passe lors de votre premiere connexion';
                                                                                                            // sendSms(message,pos.informations_comp.telephone)


                                                                                                        }
                                                                                                        else {

                                                                                                            res.jsonp({ message: "erreur" + err })

                                                                                                        }
                                                                                                    });
                                                                                                } else {

                                                                                                    res.jsonp({ message: 'Existe' })
                                                                                                }



                                                                                            })
                                                                                    }
                                                                                })


                                                                        }
                                                                    })




                                                            }

                                                        });

                                                    }
                                                    else {

                                                        res.jsonp({ message: "erreur" + err })

                                                    }
                                                });
                                            } else {
                                                res.jsonp({ message: 'Existe' })
                                            }

                                        })
                                } else {

                                    number = number + 1
                                    username = 'MQPOS-' + '00' + number
                                    Pos.findOne({ usename: username })
                                        .then(user => {
                                            var users = user
                                            while (users) {
                                                number = number + 1
                                                username = 'MQPOS-' + '00' + number
                                                Pos.findOne({ usename: username })
                                                    .then(user => {
                                                        users = user
                                                    })
                                            }

                                            Pos.findOne({ fullName: req.body.fullName })
                                                .then(pos => {
                                                    if (!pos) {

                                                        var pos = new Pos();
                                                        pos.fullName = body.fullName;
                                                        pos.email = body.email;
                                                        pos.password = generatePassword(12, false, /\d/, 'DIS-');
                                                        pos.username = username;
                                                        pos.typePos = body.typePos;
                                                        pos.agentTerrain = body.agentTerrain;
                                                        pos.informations_comp = {
                                                            "pays": body.pays,
                                                            "ville": body.ville,
                                                            "adresse": body.adresse,
                                                            "nomCommercial": body.nomCommercial,
                                                            "telephone": body.telephone,
                                                            "rccm": body.rccm,
                                                        }
                                                        pos.id_dis = body.id_dis;
                                                        pos.document = body.document;
                                                        pos.save(async (err, doc) => {
                                                            if (!err) {
                                                                console.log(pos.id_dis)
                                                                res.jsonp({ message: 'succes', id: pos._id })


                                                                // var message ='Bonjour Cher Partenaire MQash,\n\nVous disposez desormais d un compte sur notre plateforme. Connectez-vous sur : \n\n https://postransfertargent.azurewebsites.net avec les informations suivantes Identifiant:'+pos.usrname+' Mot de passe provisoire :'+ pos.password+'.Vous devez changer votre mot de passe lors de votre premiere connexion';
                                                                // sendSms(message,pos.informations_comp.telephone)


                                                            }
                                                            else {

                                                                res.jsonp({ message: "erreur" + err })

                                                            }
                                                        });
                                                    } else {

                                                        res.jsonp({ message: 'Existe' })
                                                    }



                                                })

                                        })
                                }
                            })
                    }
                    else {
                        res.send('Erreur :' + err);
                    }
                });

            }


        } else {
            //  res.jsonp({message:'Veuillez Saisir les informations du master distributeur'})
            console.log('hiii 22')

        }

    })
}



async function UsernameGenerate() {
    try {
        var number = 1
        var username = 'MQPOS-' + '00' + number
        var info = await Pos.findOne({ username: username })
        while (info) {
            number = number + 1
            var username = 'MQPOS-' + '00' + number
            info = await Pos.findOne({ username: username })
        }


    }
    catch (error) {
        console.log(error)
    }

    return username

}



router.get('/test', async (req, res) => {

    console.log(await UsernameGenerate())
});


/*    
    router.post('/uploadData',upload.single('fileData'), (req, res,next) => {
        const files = req.files;
        const info = req.body.info;
        console.log(files);
        console.log(info)
        //below code will read the data from the upload folder. Multer     will automatically upload the file in that folder with an  autogenerated name
        fs.readFile(req.file.path,(err, contents)=> {
         if (err) {
         console.log('Error: ', err);
        }else{
         console.log('File contents ',contents);
        }
       });
      });
   */
/* console.log(req.body.image.length)
 fs.writeFile('./public/azer.jpeg', req.body.image, 'base64', (err) => {
     if (err) throw err
 })
 res.status(200)
*/

/*
router.get('/', (req, res) => {
   // var message ='Bonjour Cher Partenaire MQash,\n\nVous disposez desormais d un compte sur notre plateforme. Connectez-vous sur : \n\n https://postransfertargent.azurewebsites.net avec les informations suivantes Identifiant: Mot de passe provisoire Vous devez changer votre mot de passe lors de votre premiere connexion';
    var message='test christian'
   sendSms(message,98685257)
  
 
        

});
*/

router.post('/', (req, res) => {

    insertPos(req, res);
});




function  insertPos(req, res) {


    if(req.body.fullName==' ')
    {
     res.jsonp({message:' Veillez vous Assurer que tous les champs sont bien remplis'})
      
     }else{
    
        Pos.find((err, docs) => {
            if (!err) {
            var number=docs.length
            number=number+1
            var username='MQPOS-'+'00'+number
                
            Pos.findOne({usename: username})
            .then(user=>{
                if(!user){
                    Pos.findOne({fullName: req.body.fullName})
                    .then(pos=>{
                       if(!pos){
                     
                           var pos = new Pos();
                           pos.fullName = req.body.fullName;
                           pos.email = req.body.email;
                           pos.password = generatePassword(12, false, /\d/, 'DIS-');
                           pos.username =username ;
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
                              console.log(pos.username)
                                //  var message ='Bonjour Cher Partenaire MQash,\n\nVous disposez desormais d un compte sur notre plateforme. Connectez-vous sur : \n\n https://postransfertargent.azurewebsites.net avec les informations suivantes Identifiant:'+pos.usrname+' Mot de passe provisoire :'+ pos.password+'.Vous devez changer votre mot de passe lors de votre premiere connexion';
                                //  sendSms(message,77373487)
                                
               
                               }
                               else {
                                   
                         res.jsonp({message:"erreur"+ err})
                                  
                               }
                           });
                       }else{
                            res.jsonp({message:'Existe'}) 
                       }   
                      
                    })
                }else{
                  
                    number=number+1
                     username='MQPOS-'+'00'+number
                     Pos.findOne({usename: username})
                     .then(user=>{
                         var users=user
                         while(users){
                            number=number+1
                            username='MQPOS-'+'00'+number
                            Pos.findOne({usename: username})
                            .then(user=>{
                                 users=user
                            }) 
                         }
                        
                         Pos.findOne({fullName: req.body.fullName})
                         .then(pos=>{
                            if(!pos){
                                 
                                var pos = new Pos();
                                pos.fullName = req.body.fullName;
                                pos.email = req.body.email;
                                pos.password = generatePassword(12, false, /\d/, 'DIS-');
                                pos.username =username ;
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
                                        console.log(pos.id_dis)
                                    res.jsonp({message:'succes',id:pos._id}) 
                                   
                                    
                                      // var message ='Bonjour Cher Partenaire MQash,\n\nVous disposez desormais d un compte sur notre plateforme. Connectez-vous sur : \n\n https://postransfertargent.azurewebsites.net avec les informations suivantes Identifiant:'+pos.usrname+' Mot de passe provisoire :'+ pos.password+'.Vous devez changer votre mot de passe lors de votre premiere connexion';
                                      // sendSms(message,pos.informations_comp.telephone)
                                     
                    
                                    }
                                    else {
                                        
                              res.jsonp({message:"erreur"+ err})
                                       
                                    }
                                });
                            }else{
                    
                                 res.jsonp({message:'Existe'}) 
                            }
                    
                            
                           
                         })
    
                     })
                }
            })
        }
        else {
            res.send('Erreur dans l affichage de la maison:' + err);
        }
    });
              
    }
    }


function updatePos(req, res) {
    Pos.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.jsonp({ pos: req.body })
        }

        else {
            res.send('Erreur lors  de la modification : ' + err);
        }

    });
}


router.post('/updateStatut', (req, res) => {

    Pos.findOneAndUpdate({ fullName: req.body.fullName }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.jsonp({ user: req.body })
        }

        else {
            res.send('Erreur lors  de la modification : ' + err);
        }

    });
});


router.get('/list', (req, res) => {
    Pos.find((err, docs) => {
        if (!err) {

            res.json({ Distributor: docs })
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

    Pos.find({ agentTerrain: req.params.agentTerrain })
        .then(pos => {
            if (pos) {
                nbdis = pos.length
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
                res.jsonp({ enregistrement: pos, nbDis: nbdis })
            } else {
                res.jsonp({ message: 'aucun enregistrement', })
            }
        })

});





router.get('/:id', (req, res) => {
    Pos.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.jsonp({ pos: doc })
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Pos.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.jsonp({ message: 'Distributor delete' })
        }
        else {
            res.json({ message: 'Erreur lors de la suppression de la maison :' + err });
        }
    });
});

module.exports = router;