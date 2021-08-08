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
            title: 'Add service/s',
            text: 'You can book one or multiple services',
            image: require('../assets/user.png'),
            backgroundColor: '#81D4FA',
            icon: 'cleaning-services'
          },
          {
            key: '2',
            title: 'Book your chosen service/s',
            text: 'Finalize booking now',
            image: require('../assets/user.png'),
            backgroundColor: '#4FC3F7',
            icon: 'book'
          },
          {
            key: '3',
            title: 'See transactions status',
            text: 'You can check the status of your booking',
            image: require('../assets/user.png'),
            backgroundColor: '#29B6F6',
            icon: 'check-circle-outline'
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

                <Image 
                    style={{
                        width:400,
                        height:400,
                        alignSelf:'center'
                    }}
                    source={item.image}/>

                <View
                    style={{
                        flexDirection:'row',
                        marginTop: 20,
                        alignSelf: 'center'
                        }}>

                    <MaterialIcons 
                        name={item.icon} 
                        size={24} 
                        color="#FFFFFF" />

                    <Text
                        style={{
                            textAlign:'center',
                            color: '#FFFFFF',
                            fontSize: 20,
                            marginLeft: 5,
                            fontWeight: 'bold',
                        }}>{item.title} 
                    </Text>

                </View>

                <Text
                    style={{
                        marginTop: 10,
                        textAlign:'center',
                        fontSize: 15,
                        fontWeight: '200'
                    }}>{item.text}
                </Text>

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
