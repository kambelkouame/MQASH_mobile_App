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
 
  
  getData= async(navigation)=> { 
   
    await AsyncStorage.getItem('Dis', (err, result) => {
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
   
     }

     componentDidMount(){
       this.getData()
       console.log(this.state.nbDIS)
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
            title="VOS STATISTIQUES"
            style={[styles.margin, { marginTop: 18,borderRadius: 20 }]}
          >
         
            <Block row space="between" style={{ marginTop: 25 }}>
              <Block>
    <Text h2 light>{this.state.nbPOS}</Text>
                <Block row center>
                  <Label blue />
                  <Text paragraph color="gray">Nombre de Pos</Text>
                </Block>
              </Block>
              <Block>
        <Text h2 light>{this.state.nbDIS}</Text>
                <Block row center>
                  <Label blue />
                  <Text paragraph color="gray">Nombre de Master Distributeur</Text>
                </Block>
              </Block>
              
            </Block>
          </Card>


          <Block row style={[styles.margin, { marginTop: 18 }]}>
          
            <Card middle style={styles.margin, { marginTop: 18,borderRadius: 20 }} backgroundColor="#097C3E" >
              <Icon vehicle />
              <Text h3 bold   color="white" style={{ marginTop: 17 }} onPress={() => navigation.navigate('DistRegister',{phone:this.state.phone})} >+ NEW</Text>
              <Text paragraph color="white" onPress={() => navigation.navigate('DistRegister',{phone:this.state.phone})} > Distributeur (Cliquez pour enregistrer de nouveau points de vente)</Text>
            </Card>
          </Block>

          <Card
            title="Mes Enregistrements"
            style={[styles.margin, { marginTop: 18,borderRadius: 20 }]}
           
          >
           <ScrollView>
            
            <Block style={styles.driver}>
              <TouchableOpacity activeOpacity={0.8}>
                <Block row center>
                  <Block flex={2}>
    <Text h3  onPress={() => navigation.navigate('Chat',{phone:this.state.phone,PosEnregister:this.state.PosEnregister})}>Voir la Liste des Points de vente enregistrés </Text>
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