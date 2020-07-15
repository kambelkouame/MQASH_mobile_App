import React, { Component }  from 'react';
import { Image, StyleSheet,Dimensions, TouchableWithoutFeedback,KeyboardAvoidingView,TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Button, Block, Text, Card, Input ,View, Label} from '../components';
import * as theme from '../constants/theme';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage'


const styles = StyleSheet.create({
  PosRegister: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.white,
  },
  margin: {
    marginHorizontal: 25,

  },
  driver: {
    marginBottom: 11,
  },
  avatar: {
    width: 48,
    height: 48,
   
  }
});

const { height } = Dimensions.get('window');

class PosRegister extends Component {
constructor(){

    super();

    this.state={
      typePos: 'POS',
      nomCommercial :'',
      fullName:'',
      agentTerrain:'',
      telephone:'',
      email:'',
      pays :'',
      ville :'',
      adresse :'',
      rccm :'' ,
      id:'' 
    }
  }

  register(text, field){
  if(field =='nomCommercial'){
      this.setState({
        nomCommercial:text,
      })
    }else if(field =='telephone'){
      this.setState({
        telephone:text,
      })
    }
    else if(field =='fullName'){
      this.setState({
        fullName:text,
      })
    } else if(field =='adresse'){
      this.setState({
        adresse:text,
      })
    }
  }

  submit= async(navigation)=> {

    AsyncStorage.getItem('PosUser', (err, res) => {
      res=JSON.parse(res)

      collection={}
      collection.fullName=this.state.fullName,
      collection.email="any@any.com",
      collection.pays="any",
      collection.ville="any",
      collection.telephone=this.state.telephone,
      collection.adresse=this.state.adresse,
      collection.nomCommercial=this.state.nomCommercial,
      collection.rccm="any",
       collection.agentTerrain=res.phone,
       collection.typePos="POS",
       collection.id_dis=this.state.id,
       collection.identifiant='MQash-Dis'+Date.now()

    axios({
      method: 'post',
      url:  'https://assurtous.ci:50970/dis',
      data: collection
    })
    .then(function (response) {
          console.log(response)
          if(response.data.message=="succes"){

           Toast.show('Vous avez bien enregistré le POS !!');
             
           }else if(response.data.message=="Existe déjà"){
            console.log(response.data.message); 
         
            Toast.show('lutilisateur existe déja');
            }else{
                Toast.show('Verifier tous les champs ');
            }
       
    })  
    .catch(function (error) {
      console.log(error);
    });
    this.setState({
       typePos: 'init',
       nomCommercial :'',
        fullName:'',
        telephone:'',
        email:'',
        pays :'',
        ville :'',
        adresse :'',
        rccm :''   
    })
  

/*
    AsyncStorage.getItem('PosUser', (err, res) => {
      res=JSON.parse(res)
    let collection={}
    collection.fullName=this.state.fullName,
    collection.email="any@any.com",
    collection.pays="any",
    collection.ville="any",
    collection.telephone=this.state.telephone,
    collection.adresse=this.state.adresse,
    collection.nomCommercial=this.state.nomCommercial,
    collection.rccm="any",
     collection.agentTerrain=res.phone,
     collection.typePos="POS",
     collection.id=this.state.id,
     collection.identifiant='MQash-Dis'+Date.now()

    AsyncStorage.getItem('Dis', (err, result) => {
    if (result !== null) {
      console.log(collection)
      console.log(result)
      if(result.nomCommercial==collection.nomCommercial){
        Toast.show('Vous êtes déja enregistré');
      }else{
       
      AsyncStorage.setItem('Dis', result +',' + JSON.stringify(collection));
      Toast.show('le POS à été enregistré avec succes');
    
      }
     
   }else {
         
     AsyncStorage.setItem('Dis', JSON.stringify(collection));
     Toast.show('le POS à été enregistré avec succes');
    
      
   }
   this.setState({
     
    fullName:'',
    telephone:'',
    email:'',
    pays :'',
    ville :'',
    adresse :'',
    rccm:''   
})

  })
*/
  });
    


  }

  render() {

   const { navigation } = this.props;
   this.state.id = navigation.getParam('_id');  
  console.log( this.state.id)
    

     return (
     

 <SafeAreaView style={styles.PosRegister}>
            <ScrollView contentContainerStyle={{ paddingVertical: 25 }}>


             <KeyboardAvoidingView
              enabled
              behavior="padding"
              style={{ flex: 1}}
              keyboardVerticalOffset={height * 0.2}
            >

         

           <Card
            style={[styles.margin, { marginTop: 18, borderRadius: 20 }]}
          backgroundColor="#04B20D">
         
            <Block row space="between" style={{ marginTop: 25 }}>
              <Block>
            
              <Text center h3 regular  color="white">ENREGISTRER LES POS</Text>
              </Block>
            </Block>
          </Card>


       
        <Block center middle>

          <Block center  style={{paddingTop:45 , width: 202 }}>
          
            <Block   style={{ marginTop: 14 }}>
            <Block>

              <Input
              full
              text
              label="Nom commercial "
              value={this.state.nomCommercial}
               placeholder="Nom commercial"
               onChangeText={(text)=>this.register(text,'nomCommercial')}
              style={{ marginBottom: 10,height: 40  }}
            />
             <Input
              full
              Text
              label="Nom et prénom du gérant"
              value={this.state.fullName}
               placeholder="Nom et prénom du gérant"
               onChangeText={(text)=>this.register(text,'fullName')}
              style={{ marginBottom: 10,height: 40}}
            />

            <Input
              full
              number
               value={this.state.telephone}
              label="Numero telephone"
              onChangeText={(text)=>this.register(text,'telephone')}
               placeholder="Numéro télephone"
              style={{ marginBottom: 10,height: 40 }}
            />
            </Block>
          
           

              <Input
                full
                text
                label="Localisation"
                placeholder="Saisissez la localisation "
                 value={this.state.adresse}
                 onChangeText={(text)=>this.register(text,'adresse')}
                style={{ marginBottom: 10 ,height: 40}}
              />

                   <Button
                        full
                        style={{ marginBottom: 12 }}
                        color="#6281C0" 
                        
                      >
                        <Text button>Choisir la géolocalisation</Text>
                          </Button>

             

              
              <Button
                full
                style={{ marginBottom: 12 }}
                color="#6281C0" 
                onPress={()=>this.submit(navigation)}
              >
                <Text button>Valider</Text>
              </Button>
 
              
             
            </Block>
          </Block>
        </Block>
      </KeyboardAvoidingView>

       </ScrollView>
      </SafeAreaView>
    )
  }
}

export default PosRegister;