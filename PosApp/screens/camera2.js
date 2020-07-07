import React, { Fragment, Component } from 'react';
import ImagePicker from 'react-native-image-picker';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  Image,
  Dimensions,
  Picker,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import { Button, Block, Text, Card, Input , Label} from '../components';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
export default class Camera2 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filepath: {
        data: '',
        uri: ''
       
      },
      fileData: '',
      fileUri: '',
      Doc:'init',
      id_dis:'',
      contrat:'',
      status:'',
      agentTerrain:'',
      cnir:'',
      cniv:'',
      DFE:'',
      rccm:'',
      quitance:'',
      typePos:''

    }
  }


  register(text, field){
    if(field=='fileData'){
      this.setState({
        fileData:text,
      })
    }else if(field =='fileUri'){
      this.setState({
        fileUri:text,
      })
    }else if(field =='Doc'){
      this.setState({
        Doc:text,
      })
    }
  
  }




  Suivant(navigation){
      
        
       
        navigation.navigate('PosRegister',{id:this.state.id_dis})
   
    this.setState({
      fileData: '',
      Doc :'init',
      fileUri :''    
    })
    
  }


  submit(navigation){
    let collection={}
    collection.fileData=this.state.fileData,
    collection.fileUri=this.state.fileUri,
    collection.Doc=this.state.Doc
      console.log(this.state.fileData)
      console.log(this.state.fileUri)

    this.setState({
      fileData: '',
      Doc :'init',
      fileUri :''    
    })
    
  }

  chooseImage = () => {
    let options = {
      title: 'Selection de l\'option scan',
     
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = { uri: response.uri };

        console.log('response', JSON.stringify(response));
        this.setState({
          filePath: response,
          fileData: response.data,
          fileUri: response.uri
        });
      }
    });
  }

  launchCamera = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = { uri: response.uri };
        console.log('response', JSON.stringify(response));
        this.setState({
          filePath: response,
          fileData: response.data,
          fileUri: response.uri
        });
      }
    });

  }

  launchImageLibrary = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = { uri: response.uri };
        console.log('response', JSON.stringify(response));
        this.setState({
          filePath: response,
          fileData: response.data,
          fileUri: response.uri,
          agentTerrain:''
        });
      }
    });

  }

  renderFileData() {
    if (this.state.fileData) {
      return <Image source={{ uri: 'data:image/jpeg;base64,' + this.state.fileData }}
        style={styles.images}
      />
    } else {
      return <Image source={require('../assets/dummy.png')}
        style={styles.images}
      />
    }
  }

  renderFileUri() {
    if (this.state.fileUri) {
      return <Image
        source={{ uri: this.state.fileUri }}
        style={styles.images}
      />
    } else {
      return <Image
        source={require('../assets/galeryImages.jpg')}
        style={styles.images}
      />
    }
  }
  render() {

   const { navigation } = this.props;

   const phone = navigation.getParam('agentTerrain', 'contact'); 
   this.state.typePos = navigation.getParam('typePos'); 
   this.state.id_dis = navigation.getParam('id'); 
    this.state.agentTerrain=phone
    
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View style={styles.body}>
            <Text style={{textAlign:'center',fontSize:20,paddingBottom:10}} >Veillez selectionner le Scan de Fichier</Text>
            <View style={styles.ImageSections}>
              <View>
                {this.renderFileData()}
                <Text  style={{textAlign:'center'}}>Fichier à Impoter</Text>
              </View>
              <View>
                {this.renderFileUri()}
                <Text style={{textAlign:'center'}}>Fichier à 
                Scanner</Text>
              </View>
            </View>

            <View style={styles.btnParentSection}>
              <TouchableOpacity onPress={this.chooseImage} style={styles.btnSection}  >
                <Text style={styles.btnText}>Effecuer un Scan</Text>
              </TouchableOpacity>


             
            </View>

            <View   style={{textAlign:'center'}}>  
                <Picker 
                  
                value={this.state.Doc}
                        selectedValue={this.state.language}  
                        onValueChange={(itemValue, itemIndex) =>  
                            this.setState({language: itemValue, Doc: itemValue})}  
                    >  
                    <Picker.Item label="Selectionner le nom du Document" value="init" />  
                    <Picker.Item label="Contrat signé" value="contrat" />  
                    <Picker.Item label="Status de la société" value="status" /> 
                    <Picker.Item label="CNI recto" value="cnir" />   
                    <Picker.Item label="CNI Verso" value="cniv" />   
                    <Picker.Item label="DFE ou patente" value="DFE" />  
                    <Picker.Item label="RCCM" value="rccm" /> 
                    <Picker.Item label="quitance loyer / CIE  / SODECI" value="quitance" />     
                </Picker> 

                <Button
                full
                style={{ marginBottom: 12 ,marginHorizontal:20}}

                //onPress={()=>this.submit(navigation)}
                onPress={()=>this.submit(navigation)}
              >
                <Text button>Valider</Text>
              </Button>


              <Button
                full
                style={{ marginBottom: 12 ,marginHorizontal:20}}
                onPress={()=>this.Suivant(navigation)}
              >
                <Text button>Suivant</Text>
              </Button>
              
            </View> 
           
            
          </View>

         
         
        </SafeAreaView>
      </Fragment>
    );
  }
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },

  body: {
    backgroundColor: Colors.white,
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
    height: Dimensions.get('screen').height - 20,
    width: Dimensions.get('screen').width
  },
  ImageSections: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'center'
  },
  images: {
    width: 150,
    height: 150,
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 3
  },
  btnParentSection: {
    alignItems: 'center',
    marginTop:10
  },
  btnSection: {
    width: 225,
    height: 50,
    backgroundColor: '#DCDCDC',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginBottom:10
  },
  btnText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 14,
    fontWeight:'bold'
  }
});