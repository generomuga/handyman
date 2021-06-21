import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/Login';
import Home from './src/Home';
import { AntDesign } from '@expo/vector-icons';

import * as firebase from 'firebase';

export default class App extends Component {

  render() {

    return (
        <NavigationContainer>
          
            <Stack.Navigator initialRouteName='Login'>
                <Stack.Screen name='Login' component={Login} options= {{headerShown: false}} />
                <Stack.Screen 
                  name='Home' 
                  component={Home} 
                  options= {
                    {
                      headerShown: true, 
                      title: 'Hugefort Handyman +', 
                      headerLeft: ()=> null,
                      headerRight: ()=> (
                          <View>
                              {/* <Text onPress={()=>firebase.auth().signOut().then(()=>{}).catch((error) =>{})}>Sign out</Text> */}
                              <AntDesign 
                                name="logout" 
                                size={24} color="#FAFAFA" 
                                style={style.iconStyle} 
                                onPress={()=>firebase.auth().signOut().then(()=>{}).catch((error) =>{})}
                                />
                          </View>
                      ),
                      headerStyle: {
                        backgroundColor: '#039BE5'
                      },
                      headerTintColor: '#FAFAFA'
                    }
                  } 
            />

            </Stack.Navigator>

        </NavigationContainer>
    );

  }

}

const Stack = createStackNavigator();

const style = StyleSheet.create({

  iconStyle: {
    marginRight: 15
  }

})