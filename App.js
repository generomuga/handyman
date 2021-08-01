import React from 'react';
import { View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './src/Login';
import Signup from './src/Signup';
import Home from './src/Home';
import ForgotPassword from './src/ForgotPassword';
import Admin from './src/Admin';
import Walkthrough from './src/Walkthrough';

import PhoneSignIn from './src/PhoneSignIn';

import { AntDesign } from '@expo/vector-icons';

import * as firebase from 'firebase';

export default function App () {

  const Stack = createStackNavigator();

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

              <Stack.Screen 
                name='PhoneSignIn' 
                component={PhoneSignIn} 
                options= {{
                      headerShown: true, 
                      title: 'Phone Sign In', 
                      headerStyle: {
                        backgroundColor: '#039BE5'
                      },
                      headerTintColor: '#FAFAFA',
                      headerTitleStyle: {
                        alignSelf: 'center'
                      }
                }} />

              <Stack.Screen 
                name='Walkthrough' 
                component={Walkthrough} 
                options= {{
                      headerShown: false, 
                      title: 'Walkthrough', 
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
