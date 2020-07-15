import React, { Fragment, Component } from 'react';
const axios = require('axios');
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
import { Button, Block, Text, Card, Input, Label } from '../components';

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
export default class Camera extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filepath: {
        data: '',
        uri: ''
      },
      fileData: '',
      fileUri: '',
      Doc: 'init',
      id_dis: '',
      contrat: '',
      status: '',
      agentTerrain: '',
      cnir: '',
      cniv: '',
      DFE: '',
      rccm: '',
      quitance: '',
      typePos: '',
      base64:'',
      source:{},
      id:""

    }
  }


  register(text, field) {
    if (field == 'fileData') {
      this.setState({
        fileData: text,
      })
    } else if (field == 'fileUri') {
      this.setState({
        fileUri: text,
      })
    } else if (field == 'Doc') {
      this.setState({
        Doc: text,
      })
    }

  }


   cloudinaryUpload = (photo) => {
    
    let formdata = new FormData();
    formdata.append("id", this.state.id_dis)
    formdata.append("myFile", {uri: photo.uri, name: this.state.id_dis+'.jpeg', type: 'multipart/form-data'})
    console.log(formdata)
axios.post('https://assurtous.ci:50970/dis/uploadData', formdata, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data;boundary=${formdata._boundary}'
    }
})
.then(function (response) {
  console.log(response)  
})  
.catch(function (error) {
console.log(error);
});
  /*  axios({
      method: 'post',
      url:  'http://192.168.43.218:3000/dis/uploadData',
      
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        },
      data: data
    })
    .then(function (response) {
          console.log(response)  
    })  
    .catch(function (error) {
      console.log(error);
    });
    */
  }


  Suivant(navigation) {
    if (this.state.typePos == "Dis") {
      console.log(this.state.typePos)
      navigation.navigate('PosRegister', { id: this.state.id_dis,_id:this.state.id })
    } else {
      console.typePos
      navigation.navigate('Overview')
    }
    this.setState({
      fileData: '',
      Doc: 'init',
      fileUri: ''
    })

  }


  submit(navigation) {

    AsyncStorage.getItem('PosUser', (err, res) => {
      // res=JSON.parse(res)
      console.log(res)
      let collection = {}
      collection.fileData = this.state.fileData,
        collection.fileUri = this.state.fileUri,
        collection.Doc = this.state.Doc
   
      this.setState({
        fileData: '',
        Doc: 'init',
        fileUri: ''
      })

    });

  }
  chooseImage = () => {


    let options = {
      title: 'Select Image',
     noData: true,
     maxWidth: 500,
     maxHeight: 500,
      customButtons: [
        { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      ],
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
        const uri = response.uri;
        const type = response.type;
        const name = response.fileName;
        const data = {
          uri,
          type,
          name,
        }
        this.cloudinaryUpload(data)
        
        this.setState({
          filePath: response,
          fileData: response.data,
          fileUri: response.uri,
          
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

    this.state.typePos = navigation.getParam('typePos');
    this.state.id_dis = navigation.getParam('id');
    this.state.id = navigation.getParam('identifiant');
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View style={styles.body}>
            <Text style={{ textAlign: 'center', fontSize: 20, paddingBottom: 10 }} ></Text>
            <View style={styles.ImageSections}>
              <View>
                {this.renderFileData()}
                <Text style={{ textAlign: 'center' }}>Fichier à importer</Text>
              </View>
              <View>
                {this.renderFileUri()}
                <Text style={{ textAlign: 'center' }}>Fichier à
                scanner</Text>
              </View>
            </View>

            <View style={styles.btnParentSection}>
              <TouchableOpacity onPress={this.chooseImage} style={styles.btnSection}  >
                <Text style={styles.btnText}>Effecuer un Scan</Text>
              </TouchableOpacity>



            </View>

            <View style={{ textAlign: 'center' }}>
              <Picker

                value={this.state.Doc}
                selectedValue={this.state.language}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ language: itemValue, Doc: itemValue })}
              >
                <Picker.Item label="Sélectionner le nom du document" value="init" />
                <Picker.Item label="Contrat signé" value="contrat" />
                <Picker.Item label="Statut de la société" value="status" />
                <Picker.Item label="CNI recto" value="cnir" />
                <Picker.Item label="CNI Verso" value="cniv" />
                <Picker.Item label="DFE ou patente" value="DFE" />
                <Picker.Item label="N° RCCM" value="rccm" />
                <Picker.Item label="Quittance loyer / Facture d'électricité / Facture d'eau" value="quitance" />
              </Picker>

              <Button
                full
                style={{ marginBottom: 12, marginHorizontal: 20 }}
                onPress={() => this.Suivant(navigation)}
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
    marginTop: 10
  },
  btnSection: {
    width: 225,
    height: 50,
    backgroundColor: '#DCDCDC',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginBottom: 10
  },
  btnText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 14,
    fontWeight: 'bold'
  }
}); 
/*
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import Camera from 'react-native-camera';
import { Icon } from 'native-base';
import { dirPicutures } from './dirStorage';
const moment = require('moment');

let { height, width } = Dimensions.get('window');
let orientation = height > width ? 'Portrait' : 'Landscape';

//move the attachment to app folder
const moveAttachment = async (filePath, newFilepath) => {
  return new Promise((resolve, reject) => {
    RNFS.mkdir(dirPicutures)
      .then(() => {
        RNFS.moveFile(filePath, newFilepath)
          .then(() => {
            console.log('FILE MOVED', filePath, newFilepath);
            resolve(true);
          })
          .catch(error => {
            console.log('moveFile error', error);
            reject(error);
          });
      })
      .catch(err => {
        console.log('mkdir error', err);
        reject(err);
      });
  });
};

class Camera3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation
    };
  }

  componentWillMount() {
    Dimensions.addEventListener('change', this.handleOrientationChange);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.handleOrientationChange);
  }

  handleOrientationChange = dimensions => {
    ({ height, width } = dimensions.window);
    orientation = height > width ? 'Portrait' : 'Landscape';
    this.setState({ orientation });
  };

  // ************************** Captur and Save Image *************************
  saveImage = async filePath => {
    try {
      // set new image name and filepath
      const newImageName = `${moment().format('DDMMYY_HHmmSSS')}.jpg`;
      const newFilepath = `${dirPicutures}/${newImageName}`;
      // move and save image to new filepath
      const imageMoved = await moveAttachment(filePath, newFilepath);
      console.log('image moved', imageMoved);
    } catch (error) {
      console.log(error);
    }
  };

  takePicture() {
    this.camera
      .capture()
      .then(data => {
        //data is an object with the file path
        //save the file to app  folder
        this.saveImage(data.path);
      })
      .catch(err => {
        console.error('capture picture error', err);
      });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" translucent />

        <Camera
          captureTarget={Camera.constants.CaptureTarget.disk}
          ref={cam => {
            this.camera = cam;
          }}
          style={styles.container}
          aspect={Camera.constants.Aspect.fill}
          orientation="auto"
        >
          <View
            style={
              this.state.orientation === 'Portrait' ? (
                styles.buttonContainerPortrait
              ) : (
                styles.buttonContainerLandscape
              )
            }
          >
            <TouchableOpacity
              onPress={() => this.takePicture()}
              style={
                this.state.orientation === 'Portrait' ? (
                  styles.buttonPortrait
                ) : (
                  styles.buttonLandscape
                )
              }
            >
              <Icon name="camera" style={{ fontSize: 40, color: 'white' }} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={
                this.state.orientation === 'Portrait' ? (
                  styles.buttonPortrait
                ) : (
                  styles.buttonLandscape
                )
              }
            >
              <Icon
                name="close-circle"
                style={{ fontSize: 40, color: 'white' }}
              />
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonContainerPortrait: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)'
  },
  buttonContainerLandscape: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    right: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  buttonPortrait: {
    backgroundColor: 'transparent',
    padding: 5,
    marginHorizontal: 20
  },
  buttonLandscape: {
    backgroundColor: 'transparent',
    padding: 5,
    marginVertical: 20
  }
});

export default Camera3;
*/