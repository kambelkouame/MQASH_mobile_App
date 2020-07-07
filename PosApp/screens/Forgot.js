import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Image, KeyboardAvoidingView, Dimensions,FormValidationMessage,TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import { Button, Block, Text, Input } from '../components';

const styles = StyleSheet.create({
  forgot: {
    flex: 1
  }
});

const { height } = Dimensions.get('window');

class Forgot extends Component {
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
              Mot de passe oublié?
            </Text>
            <Text paragraph color="black3">
             Veillez choisir une option de récuperation 
            </Text>

            <Block center style={{ marginTop: 44 }}>
               <Button
                full
                style={{ marginBottom: 12 }}
               onPress={() => navigation.navigate('Email')}
              >
                <Text button>Email</Text>
              </Button>
               <Button
                full
                style={{ marginBottom: 12 }}

                
               onPress={() => navigation.navigate('Sms')}
              >
                <Text button>SMS</Text>
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

export default Forgot;
