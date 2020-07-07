import React, { Component } from 'react';
import {StyleSheet, View} from 'react-native';
import MapView,{ Marker}from 'react-native-maps';
//geolocation = require('@react-native-community/geolocation');
import Geolocation from '@react-native-community/geolocation';

export default class CarouselMap extends Component {
  constructor(props){
    super(props);
     this.state={
     
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
       error:null
     };
  }

  componentDidMount(){

   // Geolocation.getCurrentPosition(info => console.log(info));
    
    Geolocation.getCurrentPosition(
      (position) => {
          this.setState({ 
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
             });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );

  }
 

  render() {
    return (
      <View style={styles.container}>
        <MapView
        style={styles.map}
         region={{
           latitude:32.054,
           longitude:-45.548,
           longitudeDelta:0.01254,
           latitudeDelta:0.015
         }}>

          <Marker coordinate={this.state}/>
        </MapView>
      
      </View>
    );
  }
}

const styles=StyleSheet.create({
  container:{
    ...StyleSheet.absoluteFillObject
  },
  map:{
    ...StyleSheet.absoluteFillObject
  }

  
})

