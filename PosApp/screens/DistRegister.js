import React, { Component } from 'react';
import { Image,Picker, StyleSheet, View ,Dimensions, TouchableWithoutFeedback,KeyboardAvoidingView,TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

import { Button, Block, Text, Card, Input , Label} from '../components';
import * as theme from '../constants/theme';
import Signature, {readSignature, clearSignature} from 'react-native-signature-canvas';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage'


const styles = StyleSheet.create({
  DistRegister: {
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
   
  },
   container: {  
         flex: 1,  
         alignItems: 'center',  
         justifyContent: 'center',  
     },  
    textStyle:{  
        margin: 24,  
        fontSize: 25,  
        fontWeight: 'bold',  
        textAlign: 'center',  
    },  
    pickerStyle:{  
        height: 150,  
        width: "80%",  
        color: '#344953',  
        justifyContent: 'center',  
    }  

});

const { height } = Dimensions.get('window');

class DistRegister extends Component {

  

  constructor(){

    super();

    this.state={
      typePos: 'init',
     nomCommercial :'',
      fullName:'',
      agentTerrain:'',
      telephone:'',
      email:'',
      pays :'',
     ville :'',
      adresse :'',
      rccm :''   
    }
  }

  register(text, field){
    if(field=='ville'){
      this.setState({
        ville:text,
      })
    }else if(field =='pays'){
      this.setState({
        pays:text,
      })
    }else if(field =='adresse'){
      this.setState({
        adresse:text,
      })
    }else if(field =='nomCommercial'){
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
    } else if(field =='typePos'){
      this.setState({
        typePos:text,
      })
    }else if(field =='rccm'){
      this.setState({
        rccm:text,
      })
    }else if(field =='email'){
      this.setState({
        email:text,
      })
    }
  }

  submit= async(navigation)=> {
    AsyncStorage.getItem('PosUser', (err, res) => {

      res=JSON.parse(res)
     
    let collection={}
    collection.fullName=this.state.fullName,
    collection.email=this.state.email,
    collection.pays=this.state.pays,
    collection.ville=this.state.ville,
    collection.telephone=this.state.telephone,
    collection.adresse=this.state.adresse,
    collection.nomCommercial=this.state.nomCommercial,
    collection.rccm=this.state.rccm,
    collection.agentTerrain=res.phone,
    collection.typePos=this.state.typePos,
   collection.identifiant='MQash-Dis'+Date.now()
   console.log(collection)
     axios({
      method: 'post',
      url:  'http://192.168.43.218:3000/dis',
      data: collection
    })
    .then(function (response) {
          console.log(response)
          if(response.data.message=="succes"){

           Toast.show('Vous avez bien enregistré le Distributeur!!');
                   navigation.navigate('Camera',{identifiant:response.data.id,id:collection.nomCommercial,typePos:collection.typePos});
                  
        
           }else if(response.data.message=="Existe déjà"){
            console.log(response.data.message); 
         
            Toast.show('lutilisateur existe déja');
            }else{
                Toast.show('Verifier tous les champs ');
            }
       
    })  
    .catch(function (error) {
      
      AsyncStorage.getItem('Dis', (err, result) => {
        if (result !== null) {
         
          console.log(result)
          if(result.nomCommercial==collection.nomCommercial){
            Toast.show('le point de vente est déja enregistré');
          }else{
           
          // AsyncStorage.setItem('PosUser', JSON.stringify(User));
          AsyncStorage.setItem('Dis', result +',' + JSON.stringify(collection));   
          navigation.navigate("Camera",{typePos:collection.typePos,id:collection.nomCommercial});
            
          }
         
       }else {
             
         AsyncStorage.setItem('Dis', JSON.stringify(collection));
         Toast.show('Vous avez bien enregistré le Distributeur!!'); 
         navigation.navigate('Camera',{id:collection.nomCommercial,typePos:collection.typePos});
      
          }
     });

    
      
   
    });
    this.setState({
      
       nomCommercial :'',
        fullName:'',
        telephone:'',
        email:'',
        pays :'',
        ville :'',
        adresse :'',
        rccm :''   
    })

  })
}
    
/*
    AsyncStorage.getItem('PosUser', (err, res) => {
   res=JSON.parse(res)
     console.log(res.phone)
    let collection={}
    collection.fullName=this.state.fullName,
    collection.email=this.state.email,
    collection.pays=this.state.pays,
    collection.ville=this.state.ville,
    collection.telephone=this.state.telephone,
    collection.adresse=this.state.adresse,
    collection.nomCommercial=this.state.nomCommercial,
    collection.rccm=this.state.rccm,
     collection.agentTerrain=res.phone,
     collection.typePos=this.state.typePos,
     collection.identifiant='MQash-Dis'+Date.now()

   


     if( this.state.fullName=="" ||  this.state.pays==""|| this.state.ville=="" || this.state.adresse==""||  this.state.nomCommercial=="" ||  this.state.typePos==""){
      Toast.show('Veuillez vérifier si les champs sont bien remplis');
    }else{
         
     // AsyncStorage.removeItem('PosUser')

         AsyncStorage.getItem('Dis', (err, result) => {
   if (result !== null) {
    
     console.log(result)
     if(result.nomCommercial==collection.nomCommercial){
       Toast.show('le point de vente est déja enregistré');
     }else{
      
     // AsyncStorage.setItem('PosUser', JSON.stringify(User));
     AsyncStorage.setItem('Dis', result +',' + JSON.stringify(collection));   
     navigation.navigate("Camera",{typePos:this.state.typePos,id:this.state.nomCommercial});
       
     }
    
  }else {
        
    AsyncStorage.setItem('Dis', JSON.stringify(collection));
    Toast.show('Distributeur à été enregistré avec succes');
   
      navigation.navigate("Camera",{typePos:this.state.typePos,id:this.state.nomCommercial});
  }
});

    }


    this.setState({
     
       fullName:'',
       telephone:'',
       email:'',
       pays :'',
       ville :'',
       adresse :'',
       rccm :''   
   })
  



  });

  }

*/
/*  submit(navigation){
    let collection={}
    collection.fullName=this.state.fullName,
    collection.email=this.state.email,
    collection.pays=this.state.pays,
    collection.ville=this.state.ville
    collection.adresse=this.state.adresse,
    collection.nomCommercial=this.state.nomCommercial,
    collection.rccm=this.state.rccm,
     collection.agentTerrain=this.state.agentTerrain,
     collection.typePos=this.state.typePos
   
     axios({
      method: 'post',
      url:  'http://192.168.8.100:3000/dis',
      data: collection
    })
    .then(function (response) {
          console.log(response)
          if(response.data.message=="succes"){

          Toast.show('Vous avez bien enregistré le Distributeur!!');
                if(collection.typePos=="Dis"){
                 
                  navigation.navigate('Camera',{id:response.data.id,agentTerrain:collection.agentTerrain,typePos:collection.typePos}); 

                 }else{
                   navigation.navigate('Camera',{id:response.data.id,phone:collection.agentTerrain,typePos:collection.typePos});
                  }
        
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
    
  }
*/
  render() {

   const { navigation } = this.props;
     return (
     

 <SafeAreaView style={styles.DistRegister}>
            <ScrollView contentContainerStyle={{ paddingVertical: 25 }}>


             <KeyboardAvoidingView
              enabled
              behavior="padding"
              style={{ flex: 1 }}
              keyboardVerticalOffset={height * 0.2}
            >




           <Card
            style={[styles.margin, { marginTop: 18, borderRadius: 20 }]}
          backgroundColor="#6281C0" >
         
            <Block row space="between" style={{ marginTop: 25 }}>
              <Block>
            
     <Text center h3 regular  color="white">Master Distributor  </Text>
              </Block>
            </Block>
          </Card>


       
        <Block center middle>
            <Block   style={{ marginTop: 14 }}>
            <Block>
            
             <View style={styles.container}>  
                <Picker style={styles.pickerStyle}  
                value={this.state.typePos}
                        selectedValue={this.state.language}  
                        onValueChange={(itemValue, itemIndex) =>  
                            this.setState({language: itemValue, typePos: itemValue})}>  
                    <Picker.Item label="Select the Type of POS" value="init" />  
                    <Picker.Item label="Independent POS" value="PosInd" />  
                    <Picker.Item label="Master Distributor" value="Dis" />  
                </Picker>  
              
            </View> 


             <Input
              full
              label="Trade name "
              value={this.state.nomCommercial}
               placeholder="Trade name"
               onChangeText={(text)=>this.register(text,'nomCommercial')}
              style={{ marginBottom: 10,height: 40  }}
            />
            

            <Input
              full
              text
              label="Name and first name of the manager"
              value={this.state.fullName}
               placeholder="Name and first name of the manager"
               onChangeText={(text)=>this.register(text,'fullName')}
              style={{ marginBottom: 10,height: 40}}
            />
             
           <Input
              full
              number
               value={this.state.telephone}
              label="Phone number"
              onChangeText={(text)=>this.register(text,'telephone')}
               placeholder="Phone number"
              style={{ marginBottom: 10,height: 40 }}
            />
              <Input
              full
              text
              label="E-mail"
              value={this.state.email}
              onChangeText={(text)=>this.register(text,'email')}
               placeholder="Ex: email@email.email "
              style={{ marginBottom: 10,height: 40 }}
            />

              <Input
              full
              label="Country"
              value={this.state.pays}
              onChangeText={(text)=>this.register(text,'pays')}
               placeholder="Country"
              style={{ marginBottom: 10,height: 40 }}
            />
          

             


             <Input
                full
                text
                label="City"
                 value={this.state.ville}
                 placeholder="City"
                 onChangeText={(text)=>this.register(text,'ville')}
                style={{ marginBottom: 10 ,height: 40}}
              />

              <Input
                full
                text
                label="Address"
                 placeholder="EX:Municipality, District-Street n °"
                 value={this.state.adresse}
                 onChangeText={(text)=>this.register(text,'adresse')}
                style={{ marginBottom: 10 ,height: 40}}
              />

              <Input
                full
                text
                label="Commercial registered name"
                 placeholder="Commercial registered name"
                value={this.state.rccm}
                 onChangeText={(text)=>this.register(text,'rccm')}
                style={{ marginBottom: 10 ,height: 40}}
              />



              <Button
                full
                style={{ marginBottom: 12 }}
                color="#6281C0" 
                onPress={()=>this.submit(navigation)}
              >
                <Text button>Submit</Text>
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

 

export default DistRegister;