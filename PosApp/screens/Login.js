import React, { Component } from 'react';
import { Image, KeyboardAvoidingView, Dimensions,FormValidationMessage,TouchableOpacity, SafeAreaView, ScrollView,ActivityIndicator, StyleSheet,View} from 'react-native';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';


import { Button, Block, Text, Input} from '../components';

const { height } = Dimensions.get('window');


class Login extends Component{

  constructor(){
    
    super();

    this.state={
        email :'',
        phone :'',
        password :'' ,
        collection:'',
        loader:false
       
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

  userSync = async (navigation) => {

 
    AsyncStorage.getItem('PosUser', (err, result) => {

      result=JSON.parse(result)
      if(result !== null) {
        console.log(result)
        axios({
          method: 'post',
          url: 'http://192.168.43.218:3000/register',
          data: result
      })
      .then(function (response) {

          if (response.data.message == "user has been created successfully") {

              
              navigation.navigate("Login");
              AsyncStorage.setItem('PosUser', JSON.stringify(User));
          } else if (response.data.message == "user already exists") {

           //   Toast.show('l\'utilisateur existe déja');
              navigation.navigate("Overview");
          } else {
            
              navigation.navigate("Register");
          }

      })
      .catch(function (error) {
         
      });
          


      } else {
          Toast.show('Please enter your login details to log in');
     
      }


  });
       
            

        // AsyncStorage.removeItem('PosUser')

     
  

    // example console.log result:
    // ['@MyApp_user', '@MyApp_key']
    /* try{
        const value = await AsyncStorage.getItem('collection');
       if (collection !== null) {
            // We have data!!
            console.log(JSON.parse(collection));
        }
    }catch (error) {
        // Error retrieving data
    }*/
}

 submit= async(navigation)=> {

  

  let collection={}
  collection.email=this.state.email,
  collection.phone=this.state.phone,
  collection.password=this.state.password
  let load={}
    load.loader=this.state.loader
  
 if(collection.phone==""){
  Toast.show('the MAIL / TELEPHONE / IDENTIFIANT field is empty')
 }else if(collection.password=="" && collection.phone==""){
  Toast.show('the EMAIL / TELEPHONE / IDENTIFIER and PASSWORD fields are empty')
 }else if(collection.password==""){
  Toast.show(' the PASSWORD field is empty')
 }else{
  load.loader=true
  axios ({
    method: 'post',
    url:  'http://192.168.43.218:3000/login',
    data: collection
  })
  .then(function (response) {
    console.log(response)
    if(response.data.error =="no user"){
      console.log(response.data)
      Toast.show('The user does not exist');
      load.loader=false
      //console.log(response.data.error)
    }else if(response.data.message =="validate"){
      console.log(response.data)
      Toast.show('validate');
      load.loader=false
      AsyncStorage.setItem('PosUser', JSON.stringify(collection));
       navigation.navigate('Overview',{phone:collection.phone});
    }
  })

  .catch(function (error) {
    load.loader=true
      AsyncStorage.getItem('PosUser', (err, result) => {
      result=JSON.parse(result)
      
       
         if(result !== null){
           //console.log(result)
           console.log(collection)
              if(result.phone == collection.phone && result.password == collection.password){
               
                load.loader=false
            navigation.navigate("Overview");
            Toast.show('welcome');
          
          }else if (result.email == collection.phone && result.password == collection.password){
            load.loader=false
               
            navigation.navigate("Overview");
            Toast.show(' welcome');
          }else{
           Toast.show('Incorrect IDs');
           load.loader=false
          }
         }else{
           Toast.show('Please Register or Login to make your first connection');
           load.loader=false
          }
        });
  });
 }


 
 // AsyncStorage.removeItem('PosUser')
/*
  await AsyncStorage.getItem('PosUser', (err, result) => {
   result=JSON.parse(result)
   
      console.log(result)
      if(result !== null){
           if([(result.phone == User.phone && result.password == User.password) || (result.email == User.phone && result.password == User.password)]){
            console.log(User)
         navigation.navigate("Overview");
         Toast.show('Bienvenue');
       }else{
        Toast.show('Vous n\' etes pas enregistré Veuillez vous enregistrer');
        navigation.navigate("Register");
       }
      }else{
        Toast.show('Veuillez vous enregistrer');
      }
     });
    
   */
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


  renderloader(){
    if(this.state.loader==true){
      return  <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
    }
  }

  componentDidMount(){
   this.userSync();
  }


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
       {this.renderloader()}
        <Block center middle style={{paddingtop:30}}>
          <Block middle>
            <Image
              source={require('../assets/images/Base/Logo.png')}
              style={{  marginBottom: 25, height: 28, width: 102 }}
            />
          </Block>

         
          <Block flex={2.5} center>
            <Text h3 style={{ marginBottom: 6 }}>
            SIGN IN
            </Text>
            <Text paragraph color="black3">
              Please Sign in to get started.
            </Text>

            <Block center style={{ marginTop: 44 }}>

              <Input
                full
                text
                placeholder="Email or Phone number or Username"
                label="Email / phone number / Username"
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
                    FORGOT YOUR PASSWORD?
                  </Text>
                }
              />

              <Button
                full
                style={{ marginBottom: 12 }}

                onPress={()=>this.submit(navigation)}
              // onPress={() => navigation.navigate('Overview')}
              >
                <Text button>Sign in</Text>
                
              </Button>
              <Text paragraph color="gray">
              Don't have an account? <Text
                  height={18}
                  color="blue"

                onPress={() => navigation.navigate('Register')}> 
                Register
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


};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  }
});



export default Login;