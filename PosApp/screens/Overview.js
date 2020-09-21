import React, { Component } from 'react';
import { TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet,ActivityIndicator,View } from 'react-native';

import {Button,Block, Card, Text, Icon, Label } from '../components';
import * as theme from '../constants/theme';
const axios = require('axios');
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage'

 
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  },
  overview: {
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


class Overview extends Component {
   constructor(props) {
    super(props);
 
    this.state = {
      loader:0,
      nomCom:'Chargement ...',
      pays:'Chargement ...',
      ville:'Chargement ...',
      adresse:'Chargement ...',
      nbdis:0,
      phone:'',
      data:[],
      PosEnregister:{},
      nbDIS:0,
      nbPOS:0
    };
  }

  synchronisation = async(navigation) => {
    this.setState({ loader:1});
    var cptloader=0
   AsyncStorage.getItem('PosUser', (err, res) => {

    
       AsyncStorage.getItem('PosUser', (err, result) => {
        
       
         result=JSON.stringify(result)
          result=JSON.parse(result)
            if (result !== null) {
               
                result = '[' + result + ']'
                var obj = JSON.parse(result)
                obj.forEach(element => {
                 
                    axios({
                            method: 'post',
                            url: 'http://192.168.43.218:3000/register',
                            data: element
                        })
                        .then(function(response) {
                           
                            if (response.data.message == "succes") {

                                Toast.show('votre sauvegarde a reussi!!');
                               cptloader=0
                            }
                        })
                        .catch(function(error) {
                          Toast.show('Vous n\'etes pas connecté a internet!!,Veuillez Vous connecter Pour sauvegarder Vos enregistrements');
                          cptloader=0
                        });
                });

                 this.setState({ loader:cptloader});


            } else {

              this.setState({ loader:0});

            }
        });

        AsyncStorage.getItem('Dis', (err, result) => {
           //AsyncStorage.removeItem('Dis')
           this.setState({ loader:1});
           var cptloader1 =0
              if (result !== null) { 
                  result = '[' + result + ']'
                  var obj = JSON.parse(result)
                  obj.forEach(element => {
                       
                      axios({
                              method: 'post',
                              url: 'http://192.168.43.218:3000/dis',
                              data: element
                          })
                          .then(function(response) {
                              
                              if (response.data.message == "succes") {
    
                                  Toast.show('votre sauvegarde a reussi!!');
                                   cptloader1 =0
                              } else {
                                  
                                  Toast.show('votre sauvegarde a echouée!!');
                                  var cptloader1 =0
                              }
    
                          })
                          .catch(function(error) {
                            Toast.show('Vous n\'etes pas connecté a internet!!,Veuillez Vous connecter Pour sauvegarder Vos enregistrements');
                            var cptloader1 =0
                          });
                  });
                  this.setState({ loader:cptloader1});
                  AsyncStorage.removeItem('Dis')
              } else {
    
                this.setState({ loader:0});
                Toast.show('Aucune donnée à sauvegarder');
              }
          });


        AsyncStorage.getItem('StoreDocument', (err, result) => {
          this.setState({ loader:1});
          var cptloader2=0
       // AsyncStorage.removeItem('StoreDocument')
     if (result !== null) {
      console.log(result)
       result='['+result+']'
      
       var obj=JSON.parse(result)
       obj.forEach(element => {
         
        let formdata = new FormData();
        formdata.append("myFile", {uri: element.uri, name: element.name, type: 'multipart/form-data'})
           axios({
             method: 'post',
             url:  'http://192.168.43.218:3000/dis/uploadData',
             data: formdata
           })
           .then(function (response) {
                
                 if(response.data.message=="succes"){
       
                 Toast.show('La sauvegarde des documents a reussie!!');
                 cptloader2=0
                  }else{
                     
                     
                   Toast.show('Echec de la sauvegarde!!');
                   cptloader2=0
                   }
              
           })  
           .catch(function (error) {
          //   console.log(error);
               
          Toast.show('Echec de la Sauvegarde Verifiez votre connexion!!');
          cptloader2=0
           });
         });
         this.setState({ loader:cptloader2});
         AsyncStorage.removeItem('StoreDocument')
    }else {
      Toast.show('Aucun Document à sauvegarder');
      this.setState({ loader:0});
   }
   
  });
  
    });

    console.log('ceci'+this.state.loader)

}
 
getData= async()=> { 
  AsyncStorage.getItem('PosUser', (err, result) => {

  result=JSON.parse(result)
 
  axios.get('http://192.168.43.218:3000/dis/list', {
   
  })
  .then( (response)=> {

    if(response.data){
       var res= response.data
    var el=res.Distributor
     var cpt1=0 
     var cpt2=0 
    if(el.length > 0 && typeof(el)!== undefined && el !==[null]){
    el.forEach(element => {
      
      if(element.agentTerrain==result.phone){
       

          if(element.typePos=='PosInd'||element.typePos=='Dis'){
           cpt1 += 1
           
          
          }else if(element.typePos=='POS'){
            cpt2 += 1
           
           
          }
        
      }
    });
    console.log(cpt1,cpt2)
       this.setState({nbPOS:cpt2}); 
       this.setState({ nbDIS:cpt1});   
  }
}else{
  Toast.show('vous n\'etes pas connecté a Internet!! Veuillez vous connecter à internet pour Syncroniser vos enregistrements');

        
}
  })
  .catch(function(error) {
    Toast.show('Vous n\'etes pas connecté a internet!!,Veuillez Vous connecter Pour Syncroniser Vos enregistrements');
 
        
  });
 
})

/*  await AsyncStorage.getItem('Dis', (err, result) => {
 var  bin='['+result+']'
// AsyncStorage.removeItem('Dis');

 var obj =JSON.parse(bin)
  console.log(obj)
  this.setState({  data:obj|| [] }); 

  if(obj.length > 0 && typeof(obj)!== undefined && obj !==[null]){
    console.log(obj)
   obj.forEach(element => {
     if(element !==null){

    if(element.typePos=='PosInd'||element.typePos=='Dis'){
     
      this.setState({ nbDIS:this.state.nbDIS+1 });
      console.log(this.state.nbDIS)
    }else if(element.typePos=='Pos'){
      this.setState({nbPOS:this.state.nbPOS+1});
      console.log(this.state.nbPOS)
     
    }

  }
   });
  }
      });
 */
   }
  
  syncData= async()=> { 
    this.getData();
    
    this.synchronisation()
  
     }

     componentDidMount(){
       this.getData();
       
     
     }
     
  static navigationOptions = {
    headerLeftContainerStyle: {
      paddingLeft: 24
    },
    headerRightContainerStyle: {
      paddingRight: 24
    },
    headerLeft: (
      <TouchableOpacity><Icon menu /></TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity><Icon options /><Text></Text></TouchableOpacity>
    ),
    headerTitle: (
      <Block row middle><Text h4>Dashboard</Text></Block>
    )
  }

  renderloader(){
    if(this.state.loader==1){
      return  <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
    }
  }

  render() {
    const { navigation } = this.props;
    console.log('test' + this.state.loader)
if(this.state.loader==0){
  console.log('zero' + this.state.loader)

  return (
      <SafeAreaView style={styles.overview}>
        <ScrollView contentContainerStyle={{ paddingVertical: 25 }}>
          
        <Button
                full
                style={{ width: 225,
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 3,
                  marginBottom: 10,
                   marginHorizontal: 95 }}
                color="#6281C0" 
                onPress={()=>this.syncData()}
              >
              
                <Text button>Refresh </Text>
              </Button>

           <Card
            title="MY STATISTICS"
            style={[styles.margin, { marginTop: 18,borderRadius: 20 }]}
          >
          
         
            <Block row space="between" style={{ marginTop: 25 }}>
              <Block>
    <Text h2 light>{this.state.nbPOS}</Text>
                <Block row center>
                  <Label blue />
                  <Text paragraph color="gray">Number of POS</Text>
                </Block>
              </Block>
              <Block>
        <Text h2 light>{this.state.nbDIS}</Text>
                <Block row center>
                  <Label blue />
                  <Text paragraph color="gray">Number of Masters Distributors</Text>
                </Block>
              </Block>
              
            </Block>
          </Card>
          


          <Block row style={[styles.margin, { marginTop: 18 }]}>
          
            <Card middle style={styles.margin, { marginTop: 18,borderRadius: 20 }} backgroundColor="#097C3E" >
              <Icon vehicle />
              <Text h3 bold   color="white" style={{ marginTop: 17 }} onPress={() => navigation.navigate('DistRegister',{phone:this.state.phone})} >+NEW</Text>
              <Text paragraph color="white" onPress={() => navigation.navigate('DistRegister',{phone:this.state.phone})} >(click to register new Points of Sales or Master Distributors)</Text>
            </Card>
          </Block>

          <Card
            title="MY ROLLINGS"
            style={[styles.margin, { marginTop: 18,borderRadius: 20 }]}
           
          >
           <ScrollView>
            
            <Block style={styles.driver}>
              <TouchableOpacity activeOpacity={0.8}>
                <Block row center>
                  <Block flex={2}>
    <Text h3  onPress={() => navigation.navigate('Chat',{phone:this.state.phone,PosEnregister:this.state.PosEnregister})}>See your registered points of sales</Text>
                    <Text paragraph color="gray">
                   
                    </Text>
                  </Block>
                </Block>
              </TouchableOpacity>
            </Block>
             </ScrollView>
          </Card>
        </ScrollView>
      </SafeAreaView>
    )
  }else if(this.state.loader==1){
   
    return (
      <SafeAreaView style={styles.overview}>
        
          {this.renderloader()}
         
              
           
             
        </SafeAreaView>
    )
  }
  
  }
}

export default Overview;
