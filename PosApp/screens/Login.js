import React, { Component } from 'react';
import { Image, KeyboardAvoidingView, Dimensions,FormValidationMessage,TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage'


import { Button, Block, Text, Input} from '../components';

const { height } = Dimensions.get('window');


class Login extends Component{

  constructor(){
    
    super();

    this.state={
        email :'',
        phone :'',
        password :'' ,
        collection:''
       
    }
   
  }

  connexion(text, field){
    if(field=='phone'){
      this.setState({
        phone:text,
      })
    }else if(field =='password'){
      this.setState({
        password:text,
      })
    }

  }

 submit= async(navigation)=> {
  let User={}
  User.email=this.state.email,
  User.phone=this.state.phone,
  User.password=this.state.password
 // AsyncStorage.removeItem('PosUser')

  await AsyncStorage.getItem('PosUser', (err, result) => {
   result=JSON.parse(result)
   
      console.log(result)
      if(result !== null){

      
           if([(result.phone == User.phone && result.password == User.password) || (result.email == User.phone && result.password == User.password)]){
            console.log(User)
         navigation.navigate("Overview");
         Toast.show('Bienvenue');
       }else{
        Toast.show('Vous n\' etes pas enregistré veillez vous enregistrer');
        navigation.navigate("Register");
       }
      }else{
        Toast.show('Veillez vous enregistrer');
      }
     });
    
   
    }
/*   submit= async(navigation)=> {
    let collection={}
    collection.email=this.state.email,
    collection.phone=this.state.phone,
    collection.password=this.state.password
    axios ({
      method: 'post',
      url:  'http://192.168.43.218:3000/login',
      data: collection
    })
    .then(function (response) {

      if(response.data.error =="l\'utilisateur n\'existe pas"){
        Toast.show('l\'utilisateur n\'existe pas');
        console.log(response.data.error)
      }else if(response.data.message =="validate"){
        
        Toast.show('validate');
         navigation.navigate('Overview',{phone:collection.phone});
      }
    })

    .catch(function (error) {
      console.log(error);
    });

   
  

  } */


  render() {
    const { navigation } = this.props;

    return (

<SafeAreaView>
       <ScrollView contentContainerStyle={{ paddingVertical: 205 }}>
      <KeyboardAvoidingView
        enabled
        behavior="padding"
        style={{ flex: 1 }}
        keyboardVerticalOffset={height * 0.2}
      >
        <Block center middle style={{paddingtop:30}}>
          <Block middle>
            <Image
              source={require('../assets/images/Base/Logo.png')}
              style={{  marginBottom: 25, height: 28, width: 102 }}
            />
          </Block>

         
          <Block flex={2.5} center>
            <Text h3 style={{ marginBottom: 6 }}>
              Connexion
            </Text>
            <Text paragraph color="black3">
             Veillez vous connecter pour debuter!
            </Text>

            <Block center style={{ marginTop: 44 }}>

              <Input
                full
                text
                placeholder="Email ou numero de telephone"
                label="Email/numero telephone/Identifiant"
                onChangeText={(text)=>this.connexion(text,'phone')}
                style={{ marginBottom: 25 }}
              />

              <Input
                full
                password
                label="Password"
                onChangeText={(text)=>this.connexion(text,'password')}
                style={{ marginBottom: 25 }}
                 ref={ inmdp => this.inputmdp = inmdp }
                placeholder="XX XX XX XX XX"
                rightLabel={
                  <Text
                    paragraph
                    color="gray"
                    onPress={() => navigation.navigate('Forgot')}
                  >
                    Mot de passe oublié?
                  </Text>
                }
              />

              <Button
                full
                style={{ marginBottom: 12 }}

                onPress={()=>this.submit(navigation)}
              // onPress={() => navigation.navigate('Overview')}
              >
                <Text button>connexion</Text>
              </Button>
              <Text paragraph color="gray">
                Vous ne disposer pas de compte? <Text
                  height={18}
                  color="blue"

                onPress={() => navigation.navigate('Register')}>
                     enregistrement
                </Text>
              </Text>
            </Block>
          

          </Block>

        </Block>
      </KeyboardAvoidingView>
       </ScrollView>
      </SafeAreaView>
    )
  }
}

export default Login;