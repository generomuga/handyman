import React, { useState } from 'react';
import { View, Text } from 'react-native';

import AppIntroSlider from 'react-native-app-intro-slider';

export default function Walkthrough (props) {
        
    const [
        slides,
        setSlides
    ] = useState([
        {
            key: '1',
            title: 'Title 1',
            text: 'Description.\nSay something cool',
            // image: require('./assets/1.jpg'),
            backgroundColor: '#59b2ab',
          },
          {
            key: '2',
            title: 'Title 2',
            text: 'Other cool stuff',
            // image: require('./assets/2.jpg'),
            backgroundColor: '#febe29',
          },
    ]);

    const [
        onDone,
        setOnDone
    ] = useState(false);

    _renderItem = ({ item }) => {
        return (
          <View>
            <Text>{item.title}</Text>
            {/* <Image source={item.image} /> */}
            <Text>{item.text}</Text>
          </View>
        );
      }

    _renderNextButton = () => {
        return (
            <View >
                <Text>Hehe</Text>
            </View>
        );
    };

    _renderDoneButton = () => {
        return (
            <View >
                <Text
                    onPress={()=>{
                        props.navigation.navigate('Login')
                    }}>Awit</Text>
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
