import React, { Component } from 'react';
import { View, Text, Button, FlatList, Image } from 'react-native';



export default class HomeTab extends Component {
  
  constructor(props){
    super(props)

    this.state = {
      whats_new: [
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
      ],
      services: [
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
        }
      ]
    }
  }
  renderItemComponent = (data) => 
  <View
    style={{
      margin:10
    }}
  >

    <Image 
      style={{
          width:150,
          height:150,
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

  render(){
      return (
          <View 
            style={{
              color:'#FFFFFF'
            }}
          >

              <Text
                style={{
                  fontSize:21,
                  color:'#424242',
                  marginLeft:10,
                  marginTop:10
                }}
                
              >
                Hugefort Services
              </Text>

              <FlatList
                data={this.state.whats_new}
                renderItem={item => this.renderItemComponent(item)}
                keyExtractor={item => item.id.toString()}
                horizontal={true}
              />

              <Text
                style={{
                  fontSize:21,
                  color:'#424242',
                  marginLeft:10,
                  marginTop:10
                }}
                
              >
                Handyman Plus Services
              </Text>

              <FlatList
                data={this.state.services}
                renderItem={item => this.renderItemComponent(item)}
                keyExtractor={item => item.id.toString()}
                horizontal={true}
              />

          </View>
      )
  }

}