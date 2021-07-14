import React, { Component } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './src/Login';
import Signup from './src/Signup';
import Home from './src/Home';
import ForgotPassword from './src/ForgotPassword';
import Admin from './src/Admin';

import { AntDesign } from '@expo/vector-icons';

import authentication from './src/functions/authentication';

import * as firebase from 'firebase';
import * as Facebook from 'expo-facebook';

export default class App extends Component {

  constructor(props){
    super(props)
  }

  render() {

    return (
        <NavigationContainer>

            <Stack.Navigator initialRouteName='Login' screenOptions={{gestureEnabled:false}}>

                <Stack.Screen 
                    name='Login' 
                    component={Login} 
                    options= {{headerShown: false}} />

                <Stack.Screen 
                    name='Home' 
                    component={Home} 
                    options= {{
                          headerShown: true, 
                          title: 'Handyman Plus', 
                          headerLeft: ()=> null,
                          headerRight: ()=> (
                              <View>
                                  <AntDesign 
                                    name="logout" 
                                    size={26}
                                    color="#FAFAFA" 
                                    style={{marginRight:15}} 
                                    onPress={()=>{
                                      firebase.auth().signOut().then(()=>{}).catch((error) =>{}); 
                                    }} />
                              </View>
                          ),
                          headerStyle: {
                            backgroundColor: '#039BE5'
                          },
                          headerTintColor: '#FAFAFA',
                          headerTitleStyle: {
                            alignSelf: 'center'
                          }
                    }} />

                <Stack.Screen 
                    name='Signup' 
                    component={Signup} 
                    options= {{
                          headerShown: true, 
                          title: 'Sign up', 
                          headerStyle: {
                            backgroundColor: '#039BE5'
                          },
                          headerTintColor: '#FAFAFA',
                          headerTitleStyle: {
                            alignSelf: 'center'
                          }
                    }} />

                <Stack.Screen 
                  name='ForgotPassword' 
                  component={ForgotPassword} 
                  options= {{
                        headerShown: true, 
                        title: 'Forgot Password', 
                        headerStyle: {
                          backgroundColor: '#039BE5'
                        },
                        headerTintColor: '#FAFAFA',
                        headerTitleStyle: {
                          alignSelf: 'center'
                        }
                  }} />

                <Stack.Screen 
                  name='Admin' 
                  component={Admin} 
                  options= {{
                        headerShown: true, 
                        title: 'Admin', 
                        headerStyle: {
                          backgroundColor: '#039BE5'
                        },
                        headerTintColor: '#FAFAFA',
                        headerTitleStyle: {
                          alignSelf: 'center'
                        }
                  }} />

            </Stack.Navigator>

        </NavigationContainer>     
    );

  }

}

const Stack = createStackNavigator();