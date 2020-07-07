import React, { Component } from 'react'
import { Block, Card, Text, Icon, Label, Button } from '../components';
import { TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet,View  } from 'react-native';
import * as theme from '../constants/theme';
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

class Chat extends Component {

  constructor(props) {
    super(props);
 
    this.state = {
     
      data:[]
    };
  }


  getData= async(navigation)=> { 
    await AsyncStorage.getItem('Dis', (err, result) => {
   var  bin='['+result+']'

   var obj =JSON.parse(bin)
    console.log(obj.length)
    this.setState({  data:obj|| [] }); 
         
    
        });
   
     }

     componentDidMount(){
       this.getData()
     }



  render() {
   
    let data = this.state.data.map((val,key) =>{
      if(val !==null){
     
       return   <Card
       style={[styles.margin, { marginTop: 18,borderRadius: 20 }]}
      
     >
      <ScrollView>
       
       <Block style={styles.driver}>
         <TouchableOpacity activeOpacity={0.8}>
           <Block row center>
             <Block>
               <Image
                 style={styles.avatar}
                 source={require('../assets/images/Dist_Avatar.png')}
               />
             </Block>
             <Block flex={2}>
            <Text h3  >{val.nomCommercial}</Text>
               <Text paragraph color="gray" >
              Localisation: {val.pays} {val.ville} {val.adresse}
               </Text>
               <Text paragraph color="gray">
              type Distributeur: {val.typePos}
               </Text>
              <Button style={{with:0.5 ,height:5}} ><Text>Voir+</Text></Button>
             </Block>
           </Block>
         </TouchableOpacity>
       </Block>
        </ScrollView>
     </Card>
     
        
      }else{
        <View>
        <Text h4>aucun</Text>
        </View>
      }});

    return (
     
    
      <SafeAreaView style={styles.overview}>
      <ScrollView contentContainerStyle={{ paddingVertical: 25 }}>
        
            {data}
        
      </ScrollView>
    </SafeAreaView>
   
    )
  }
}

export default Chat;