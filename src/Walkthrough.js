import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';

import AppIntroSlider from 'react-native-app-intro-slider';

import { MaterialIcons } from '@expo/vector-icons'; 

export default function Walkthrough (props) {
        
    const [
        slides,
        setSlides
    ] = useState([
        {
            key: '1',
            title: 'Title 1',
            text: 'Description.Say something cool',
            image: require('../assets/user.png'),
            backgroundColor: '#59b2ab',
          },
          {
            key: '2',
            title: 'Title 2',
            text: 'Other cool stuff',
            image: require('../assets/user.png'),
            backgroundColor: '#febe29',
          },
    ]);

    const [
        onDone,
        setOnDone
    ] = useState(false);

    _renderItem = ({ item }) => {
        return (
          <View
            style={{
                backgroundColor: item.backgroundColor, 
                flex: 1,
                justifyContent: 'center'
                }}>

            <View>
                <Text
                    style={{
                        textAlign:'center'
                    }}>{item.title}</Text>
                <Text
                    style={{
                        textAlign:'center'
                    }}>{item.text}</Text>
                <Image 
                    style={{
                        width:400,
                        height:400,
                        alignSelf:'center'
                    }}
                    source={item.image}/>
            </View>

          </View>
        );
      }

    _renderNextButton = () => {
        return (
            <View >
                {/* <Text>Hehe</Text> */}
                <MaterialIcons name="navigate-next" size={28} color="white" />
            </View>
        );
    };

    _renderDoneButton = () => {
        return (
            <View >
                <MaterialIcons
                    name="done" 
                    size={28} 
                    color="white" 
                    onPress={()=>{
                        props.navigation.navigate('Login')
                    }}
                    />
            </View>
        );
    };

    return (
        
            <AppIntroSlider 
                renderItem={_renderItem} 
                data={slides} 
                renderDoneButton={_renderDoneButton} 
                renderNextButton={_renderNextButton} />
    )

} 
