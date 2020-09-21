import React, { Component } from 'react';
import {
    Image,
    StyleSheet,
    Dimensions,
    View,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    TouchableOpacity,
    SafeAreaView,
    ScrollView
} from 'react-native';
const axios = require('axios');
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage'



import { Button, Block, Text, Input } from '../components';
import * as theme from '../constants/theme';

const { height } = Dimensions.get('window');


class Register extends Component {

    constructor() {
        super();
        this.state = {
            fullName: '',
            last_name: '',
            email: '',
            phone: '',
            password: '',
            pays:'',
            confpassword:''


        }
    }

    register(text, field) {
        if (field == 'fullName') {
            this.setState({
                fullName: text,
            })
        } else if (field == 'last_name') {
            this.setState({
                last_name: text,
            })
        } else if (field == 'email') {
            this.setState({
                email: text,
            })
        } else if (field == 'phone') {
            this.setState({
                phone: text,
            })
        } else if (field == 'password') {
            this.setState({
                password: text,
            })
        }else if (field == 'confpassword') {
            this.setState({
                confpassword: text,
            })
        }else if (field == 'pays') {
            this.setState({
                pays: text,
            })
        }

    }

    dvsdlksubmit = async (navigation) => {
        try {

            let user = {}
            user.fullName = this.state.fullName,
                user.last_name = this.state.last_name,
                user.email = this.state.email,
                user.phone = this.state.phone,
                user.password = this.state.password
                user.pays = this.state.pays

            // const userExist= collection;

            await AsyncStorage.setItem('user', JSON.stringify(user));
            console.log(u)

        } catch (error) {
            // Error retrieving data
            console.log(error.message);
        }
    }


    submit = async (navigation) => {

        //let PosUser=[this.state.fullName,this.state.fullName,this.state.email,this.state.phone,this.state.password]
        let User = {}
            User.fullName = this.state.fullName,
            User.last_name = this.state.last_name,
            User.email = this.state.email,
            User.phone = this.state.phone,
            User.password = this.state.password,
            User.pays = this.state.pays

        if (this.state.fullName == "" || this.state.last_name == "" || this.state.phone == "" || this.state.password == "") {
            Toast.show('Please check if the fields are filled in correctly');
        }else if(this.state.confpassword !== this.state.password){
            Toast.show('the passwords entered are not identical');
        }else {


            let collection = {}
            collection.fullName = this.state.fullName,
                collection.last_name = this.state.last_name,
                collection.email = this.state.email,
                collection.phone = this.state.phone,
                collection.password = this.state.password,
                collection.pays = this.state.pays
                axios({
                    method: 'post',
                    url: 'http://192.168.43.218:3000/register',
                    data: collection
                })
                .then(function (response) {
    
                    if (response.data.message == "l\'utilisateur a été crée avec succes") {
    
                        Toast.show('Vous avez bien été enregistré!!,Veuillez vous connecter pour debut');
                        navigation.navigate("Login");
                        AsyncStorage.setItem('PosUser', JSON.stringify(User));
                    } else if (response.data.message == "l\'utilisateur existe déja") {
    
                        Toast.show('l\'utilisateur existe déja');
                        navigation.navigate("Register");
                    } else {
                        // console.log(response);
                        Toast.show('une Erreur est survenue Veuillez réeassayer');
                        navigation.navigate("Register");
                    }
    
                    // console.log(response);
                    //  console.log();
                })
                .catch(function (error) {
                     AsyncStorage.getItem('PosUser', (err, result) => {

                        result=JSON.parse(result)
                        if (result !== null) {
        
                            console.log(result)
                            if (result.phone == User.phone) {
                                Toast.show('Vous êtes déja enregistré');
                            } else {
                               
                                AsyncStorage.setItem('PosUser', JSON.stringify(User));
                                navigation.navigate("Login");
                                Toast.show('Veuillez saisir vos identifiants pour vous connecter');
                           
                            }
        
        
                        } else {
                            console.log(result)
                            AsyncStorage.setItem('PosUser', JSON.stringify(User));
                            navigation.navigate("Login");
                            Toast.show('Veuillez saisir vos identifiants pour vous connecter');
                       
                        }
        
        
                    });
                });

            // AsyncStorage.removeItem('PosUser')

         
        }

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

    vxsubmit = async (navigation) => {

        let collection = {}
        collection.fullName = this.state.fullName,
            collection.last_name = this.state.last_name,
            collection.email = this.state.email,
            collection.phone = this.state.phone,
            collection.password = this.state.password,
            collection.pays = this.state.pays
        axios({
            method: 'post',
            url: 'http://192.168.43.218:3000/register',
            data: collection
        })

            .then(function (response) {

                if (response.data.message == "l\'utilisateur a été crée avec succes") {

                    Toast.show('Vous avez bien été enregistré!!,Veuillez vous connecter pour debut');
                    navigation.navigate("Login");

                } else if (response.data.message == "l\'utilisateur existe déja") {

                    Toast.show('l\'utilisateur existe déja');
                    navigation.navigate("Register");
                } else {
                    // console.log(response);
                    Toast.show('une Erreur est survenue Veuillez réeassayer');
                    navigation.navigate("Register");
                }

                // console.log(response);
                //  console.log();
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    // this.props.navigation.navigate("Login");




    render() {

        const { navigation } = this.props;
        return (

            <SafeAreaView>
                <ScrollView contentContainerStyle={
                    { paddingVertical: 110 }
                }>

                    <KeyboardAvoidingView enabled behavior="padding"
                        style={
                            { flex: 1 }
                        }
                        keyboardVerticalOffset={height * 0.2} >

                        <Block center middle >
                            <Block middle >
                                <Image source={require('../assets/images/Base/Logo.png')}
                                    style={
                                        { marginBottom: 25, height: 45, width: 102 }
                                    }
                                /> 
                                </Block >
                            <Block flex={2.5} center>
                                < Text h3 style={
                                    { marginBottom: 6, marginHorizontal:40 }} >
                                    Sales Representative </Text>
                                    < Text h3 style={
                                    { marginBottom: 6, marginHorizontal:40 }} >
                                    registration  </Text>
                                <Text paragraph color="black3"> Please register to get started.
                                         </Text>
                                <Block style={{ marginTop: 14 }}>

                                    <View style={{ flexDirection: "row", marginBottom: 5 }}>

                                        <Input full
                                            
                                            label=" Last name"
                                            onChangeText={
                                                (text) => this.register(text, 'fullName')}
                                            placeholder=" Last name"
                                            style={{ marginBottom: 10, height: 40, width: 170 }
                                            } />
                                        < Input
                                            full
                                            label="First name"
                                            onChangeText={
                                                (text) => this.register(text, 'last_name')
                                            }
                                            placeholder="First name"
                                            style={
                                                { marginBottom: 10, height: 40, width: 180 }
                                            } />
                                    </View >

                                    <Input full email label="
                                            E-mail address"
                                        onChangeText={
                                            (text) => this.register(text, 'email')
                                        }
                                        placeholder="Ex: email@mail.com"
                                        style={
                                            { marginBottom: 10 }
                                        }
                                    />
                                    <Input full number label="Phone number"
                                        onChangeText={
                                            (text) => this.register(text, 'phone')
                                        }
                                        placeholder="Enter your phone number"
                                        style={
                                            { marginBottom: 10 }
                                        }
                                            />
                                            <Input full 
                                             label="Country"
                                            placeholder="Enter the name of the country"
                                            onChangeText={
                                                (text) => this.register(text, 'pays')
                                            }
                                            style={
                                                { marginBottom: 10 }
                                            }
                                            />

                                    <Input full password label="password"
                                        placeholder="XX XX XX XX XX"
                                        onChangeText={
                                            (text) => this.register(text, 'password')
                                        }
                                        style={
                                            { marginBottom: 10 }
                                        }
                                    />
                                    <Input full password label="Confirm the password"
                                        placeholder="XX XX XX XX XX"
                                        onChangeText={
                                            (text) => this.register(text, 'confpassword')
                                        }
                                        style={
                                            { marginBottom: 10 }
                                        }
                                    />
                                    
                                    <Button full style={
                                        { marginBottom: 12 }
                                    }
                                        onPress={
                                            () => this.submit(navigation)
                                        } >
                                        <Text button>Register</Text>
                                    </Button>
                                    <Text paragraph color="gray" >
                                       
                                        Do you already have an account ? <Text height={18}
                                            color="blue"
                                            onPress={
                                                () => navigation.navigate('Login')
                                            } >
                                            
                                        Sign in</Text>
                                    </Text>
                                </Block>
                            </Block>
                        </Block>

                    </KeyboardAvoidingView>
                </ScrollView>
            </SafeAreaView >
        )


    }

}

export default Register;

const styles = StyleSheet.create({

    card: {
        padding: 20,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 5,
        backgroundColor: theme.colors.white,
    },
    active: {
        borderColor: theme.colors.blue,
        shadowOffset: { width: 0, height: 0 },
        shadowColor: theme.colors.lightblue,
        shadowRadius: 3,
        shadowOpacity: 1,
    },
    icon: {
        flex: 0,
        height: 48,
        width: 48,
        borderRadius: 48,
        marginBottom: 15,
        backgroundColor: theme.colors.lightblue
    },
    check: {
        position: 'absolute',
        right: -9,
        top: -9,
    }
})