import React, { Component } from 'react';
import { Image, KeyboardAvoidingView, Dimensions,FormValidationMessage,TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Toast from 'react-native-simple-toast';
import axios from 'axios';



import { Button, Block, Text, Input} from '../components';

const { height } = Dimensions.get('window');



class ConfirmMail extends Component {
  

   
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
              recuperer votre compte
            </Text>
            <Text paragraph color="black3">
             Veillez  !
            </Text>saisir le code envoyé par sms

            <Block center style={{ marginTop: 44 }}>

             
              <Input
                full
                text
                label="Code"
                onChangeText={(text)=>this.connexion(text,'password')}
                style={{ marginBottom: 25 }}
                 ref={ inmdp => this.inputmdp = inmdp }
                placeholder="Saisez le code"
              
              />

              <Button
                full
                style={{ marginBottom: 12 }}

                onPress={()=>this.submit(navigation)}
              // onPress={() => navigation.navigate('Overview')}
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

export default ConfirmMail;