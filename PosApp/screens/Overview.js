import React, { Component } from 'react';
import { TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import { Block, Card, Text, Icon, Label } from '../components';
import * as theme from '../constants/theme';
const axios = require('axios');
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage'

 



 
const styles = StyleSheet.create({
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

   await  AsyncStorage.getItem('PosUser', (err, res) => {

       AsyncStorage.getItem('PosUser', (err, result) => {
         result=JSON.stringify(result)
          result=JSON.parse(result)
          console.log(result)

            if (result !== null) {
                console.log(result)
                result = '[' + result + ']'
                var obj = JSON.parse(result)
                obj.forEach(element => {
                 
                    axios({
                            method: 'post',
                            url: 'https://assurtous.ci:50970/register',
                            data: element
                        })
                        .then(function(response) {
                             console.log(response)
                            if (response.data.message == "succes") {

                                Toast.show('votre synchronisation a reussi!!');

                            } else {

                                console.log(response.data.message);

                            }

                        })
                        .catch(function(error) {
                            console.log(error);
                        });
                });

            } else {



            }
        });


        /*  AsyncStorage.getItem('StoreDocument', (err, result) => {
     if (result !== null) {
       console.log(result)
       result='['+result+']'
       var obj=JSON.parse(result)
       obj.forEach(element => {
           
           axios({
             method: 'post',
             url:  'http://192.168.43.218:3000/dis/api/upload',
             data: element
           })
           .then(function (response) {
                 console.log(response)
                 if(response.data.message=="succes"){
       
                 Toast.show('votre synchronisation a reussi!!');
                      
                  }else{

                   console.log(response.data.message); 
                
                  cd 
                   }
              
           })  
           .catch(function (error) {
             console.log(error);
           });
         });
      
    }else {



   }
  });*/


    /*    AsyncStorage.getItem('Dis', (err, result) => {
            if (result !== null) {
                result = '[' + result + ']'
                var obj = JSON.parse(result)
                obj.forEach(element => {

                    console.log(element)
                    axios({
                            method: 'post',
                            url: 'http://192.168.43.218:3000/dis',
                            data: element
                        })
                        .then(function(response) {
                            console.log(response)
                            if (response.data.message == "succes") {

                                Toast.show('votre synchronisation a reussi!!');

                            } else {

                                console.log(response.data.message);
                            }

                        })
                        .catch(function(error) {
                            console.log(error);
                        });
                });

            } else {



            }
        });*/

    });



}
 
  
  getData= async()=> { 
   
    AsyncStorage.getItem('PosUser', (err, result) => {

    result=JSON.parse(result)
    axios.get('https://assurtous.ci:50970/dis/list', {
     
    })
    .then( (response)=> {
     
         var res= response.data
      var el=res.Distributor
      if(el.length > 0 && typeof(el)!== undefined && el !==[null]){
      el.forEach(element => {
        
        if(element.agentTerrain==result.phone){
         

            if(element.typePos=='POS'){
              console.log(element) 
            
          
            this.setState({nbPOS:this.state.nbPOS+1});
            }else if(element.typePos=='PosInd'||element.typePos=='Dis'){
       
       this.setState({ nbDIS:this.state.nbDIS+1 });
            }
          
        }
      });
    }
    })
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

     componentDidMount(){
       this.getData()
       this.synchronisation()
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

  render() {
    const { navigation } = this.props;
  

    return (
      <SafeAreaView style={styles.overview}>
        <ScrollView contentContainerStyle={{ paddingVertical: 25 }}>
          

           <Card
            title="MES STATISTIQUES"
            style={[styles.margin, { marginTop: 18,borderRadius: 20 }]}
          >
         
            <Block row space="between" style={{ marginTop: 25 }}>
              <Block>
    <Text h2 light>{this.state.nbPOS}</Text>
                <Block row center>
                  <Label blue />
                  <Text paragraph color="gray">Nombre de POS</Text>
                </Block>
              </Block>
              <Block>
        <Text h2 light>{this.state.nbDIS}</Text>
                <Block row center>
                  <Label blue />
                  <Text paragraph color="gray">Nombre de Masters Distributeurs</Text>
                </Block>
              </Block>
              
            </Block>
          </Card>
          


          <Block row style={[styles.margin, { marginTop: 18 }]}>
          
            <Card middle style={styles.margin, { marginTop: 18,borderRadius: 20 }} backgroundColor="#097C3E" >
              <Icon vehicle />
              <Text h3 bold   color="white" style={{ marginTop: 17 }} onPress={() => navigation.navigate('DistRegister',{phone:this.state.phone})} >+ NOUVEAU</Text>
              <Text paragraph color="white" onPress={() => navigation.navigate('DistRegister',{phone:this.state.phone})} >(cliquez pour enregistrer de nouveaux Points de Vente ou Masters Distributeurs)</Text>
            </Card>
          </Block>

          <Card
            title="MES ENROLEMENTS"
            style={[styles.margin, { marginTop: 18,borderRadius: 20 }]}
           
          >
           <ScrollView>
            
            <Block style={styles.driver}>
              <TouchableOpacity activeOpacity={0.8}>
                <Block row center>
                  <Block flex={2}>
    <Text h3  onPress={() => navigation.navigate('Chat',{phone:this.state.phone,PosEnregister:this.state.PosEnregister})}>Voir la liste des points de vente enregistrés</Text>
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
  }
}

export default Overview;