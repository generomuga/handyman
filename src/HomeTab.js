import React, { useState, useEffect } from 'react';

import { 
  View, 
  Text, 
  FlatList, 
  Image
} from 'react-native';

import * as firebase from 'firebase';

const dbRef = firebase.database().ref();

export default function HomeTab({navigation}) {
  
  useEffect(()=>{
    const unsubscribe = navigation.addListener('focus', () => {
        getServices();
      });

    return unsubscribe;
  }, [navigation])

  const [
    services,
    setServices
  ] = useState([])

  const [
    hugefortServices,
    // setHugefortServices
  ] = useState([
    {
      id: 'bd7acbea-c1b1-46c2-22aed5-3ad53abb28ba',
      title: 'Architectural Modelling',
      photoURL: 'https://firebasestorage.googleapis.com/v0/b/handyman-plus.appspot.com/o/tenant%2Ft1.webp?alt=media&token=d4d228ec-20bf-4f70-a95a-fc7b21ff5252'
    },
    {
      id: '3ac68afc-c605-48d3-a422f8-fbd91aa97f63',
      title: 'Pre-construction Management',
      photoURL: 'https://firebasestorage.googleapis.com/v0/b/handyman-plus.appspot.com/o/tenant%2Ft2.webp?alt=media&token=9175f6b1-24f6-4967-9394-24ea0f711b2e'
    },
    {
      id: '58694a0f-3da1-471f-bd9622-145571e29d72',
      title: 'Construction Management',
      photoURL: 'https://firebasestorage.googleapis.com/v0/b/handyman-plus.appspot.com/o/tenant%2Ft3.webp?alt=media&token=a74e693d-ae7d-455d-ba2f-c634fa5590f0'
    },
    {
      id: 'bd7acbea-c1b1-46c2-22aed5-3ad53abb2228ba',
      title: 'Handyman Plus Service',
      photoURL: 'https://firebasestorage.googleapis.com/v0/b/handyman-plus.appspot.com/o/tenant%2Ft4.webp?alt=media&token=71245811-01ce-449e-a5bb-b61c04bed430'
    }
  ]);

  const [
    handymanServices,
    // sethandymanServices
  ] = useState([
    {
      id: 'bd7acbea-c1b1-46c2-22aed5-3ad53abb28ba',
      title: 'Electrical Repair',
      photoURL: 'https://firebasestorage.googleapis.com/v0/b/handyman-plus.appspot.com/o/tenant%2Ft5.jpeg?alt=media&token=6dfcf12d-ce45-437d-a13d-7b766fb734ff'
    },
    {
      id: '3ac68afc-c605-48d3-a422f8-fbd91aa97f63',
      title: 'Plumbing',
      photoURL: 'https://firebasestorage.googleapis.com/v0/b/handyman-plus.appspot.com/o/tenant%2Ft6.jpeg?alt=media&token=c3726dd3-2fbf-4b94-8962-7fbdd46fce52'
    },
    {
      id: '58694a0f-3da1-471f-bd9622-145571e29d72',
      title: 'Aluminum and Glassworks',
      photoURL: 'https://firebasestorage.googleapis.com/v0/b/handyman-plus.appspot.com/o/tenant%2Ft7.webp?alt=media&token=f1a83bdc-10ee-4f90-849a-a4a7fa27b8b0'
    },
    {
      id: 'bd7acbea-c1b1-46c2-22aed5-3ad53abb2228ba',
      title: 'Carpentry',
      photoURL: 'https://firebasestorage.googleapis.com/v0/b/handyman-plus.appspot.com/o/tenant%2Ft8.jpeg?alt=media&token=a39de99e-154f-4cf7-affe-5666280b1c1a'
    },
    
    {
      id: 'bd7acbea-c1b1-46c2-22aed5-3ad53abb28ba1',
      title: 'Electrical Repair',
      photoURL: 'https://firebasestorage.googleapis.com/v0/b/handyman-plus.appspot.com/o/tenant%2Ft5.jpeg?alt=media&token=6dfcf12d-ce45-437d-a13d-7b766fb734ff'
    },
    {
      id: '3ac68afc-c605-48d3-a422f8-fbd91aa97f632',
      title: 'Plumbing',
      photoURL: 'https://firebasestorage.googleapis.com/v0/b/handyman-plus.appspot.com/o/tenant%2Ft6.jpeg?alt=media&token=c3726dd3-2fbf-4b94-8962-7fbdd46fce52'
    },
    {
      id: '58694a0f-3da1-471f-bd9622-145571e29d732',
      title: 'Aluminum and Glassworks',
      photoURL: 'https://firebasestorage.googleapis.com/v0/b/handyman-plus.appspot.com/o/tenant%2Ft7.webp?alt=media&token=f1a83bdc-10ee-4f90-849a-a4a7fa27b8b0'
    },
    {
      id: 'bd7acbea-c1b1-46c2-22aed5-3ad53abb2228b4a',
      title: 'Carpentry',
      photoURL: 'https://firebasestorage.googleapis.com/v0/b/handyman-plus.appspot.com/o/tenant%2Ft8.jpeg?alt=media&token=a39de99e-154f-4cf7-affe-5666280b1c1a'
    }
  ]);

  const getServices = () => {
    console.log('Hehe')

    let items = []
    let serviceName = ''

    dbRef.child('tenant/services').once("value")
      .then((snapshot) =>{
        if (snapshot.exists()) {
          snapshot.forEach(function(childsnap) {
            childsnap.forEach(function(snap){
              serviceName = snap.val()['name']
              items.push({
                name: serviceName
              })
            })
          })
        }
        
        console.log(items)
        setServices(items)
      })
    
  }

  const renderItemComponent = (data) => 
    <View
      style={{
        margin:10,
        flex: 1,
        flexDirection: 'column'
      }} >

      <Image 
        style={{
            width:200,
            height:200,
            // resizeMode:'contain', 
            alignSelf:'center',
            // alignItems:'',
            borderRadius:5,
        }}
        source={{uri:data.item.photoURL}}
      />

      <Text
        style={{
          marginTop:10,
          textAlign:'center'
        }}
      >
        {data.item.title}
      </Text>

    </View>

  return (
      <View 
        style={{
          color:'#FFFFFF'
        }} >

          {/* <Text
            style={{
              fontSize:21,
              color:'#424242',
              marginLeft:10,
              marginTop:10
            }} >
            Hugefort Services
          </Text>

          <FlatList
            data={hugefortServices}
            renderItem={item => renderItemComponent(item)}
            keyExtractor={item => item.id.toString()}
            horizontal={true} /> */}

          <Text
            style={{
              fontSize:21,
              color:'#424242',
              marginLeft:10,
              marginTop:10
            }} >
            Handyman Plus Services
          </Text>

          <FlatList
            style={{marginBottom:40}}
            data={handymanServices}
            renderItem={item => renderItemComponent(item)}
            keyExtractor={item => item.id.toString()}
            horizontal={false}
            numColumns={2}
          />
          
      </View>
  )

}