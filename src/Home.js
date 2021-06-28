import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeTab from './HomeTab';
import BookTab from './BookTab';
import NotificationTab from './NotifcationTab';
import MeTab from './MeTab';

import { Entypo } from '@expo/vector-icons'; 

const Tab = createBottomTabNavigator();

export default class Home extends Component {
        
    render(){
        return (
            <Tab.Navigator
                tabBarOptions={{
                    showLabel:false,
                    inactiveTintColor: '#E1F5FE',
                    activeTintColor: 'white',
                    
                    style: {
                        backgroundColor:'#039BE5',
                        // position: 'absolute',
                        // bottom: 20,
                        // marginHorizontal: 5,
                        // borderRadius: 25
                    },

                }}
                >

                <Tab.Screen 
                    name="Home" 
                    component={HomeTab} 
                    options={{
                        tabBarIcon: ({focused}) => (
                            <View style={{justifyContent:'center', alignContent:'center', top:10}}>
                                <Entypo name="home" size={24} style={{color:focused?'white':'#B3E5FC',textAlign:'center'}}  />
                                <Text style={{color:focused?'white':'#B3E5FC', fontSize:12, textAlign:'center'}}>Home</Text>
                            </View>
                        )
                    }}
                    />

                <Tab.Screen 
                    name="Book" 
                    component={BookTab} 
                    options={{
                        tabBarIcon: ({focused}) => (
                            <View style={{justifyContent:'center', alignContent:'center', top:10}}>
                                <Entypo name="book" size={24} style={{color:focused?'white':'#B3E5FC', textAlign:'center'}}  />
                                <Text style={{color:focused?'white':'#B3E5FC', fontSize:12, textAlign:'center'}}>Book</Text>
                            </View>
                        )
                    }}
                    />

                <Tab.Screen 
                    name="Notication" 
                    component={NotificationTab} 
                    options={{
                        tabBarIcon: ({focused}) => (
                            <View style={{justifyContent:'center', alignContent:'center', top:10}}>
                                <Entypo name="notification" size={24} style={{color:focused?'white':'#B3E5FC', textAlign:'center'}}  />
                                <Text style={{color:focused?'white':'#B3E5FC', fontSize:12, textAlign:'center'}}>Notications</Text>
                            </View>
                        )
                    }}
                    />

                <Tab.Screen 
                    name="Me" 
                    component={MeTab} 
                    options={{
                        tabBarIcon: ({focused}) => (
                            <View style={{justifyContent:'center', alignContent:'center', top:10}}>
                                <Entypo name="user" size={24} style={{color:focused?'white':'#B3E5FC', textAlign:'center'}}  />
                                <Text style={{color:focused?'white':'#B3E5FC', fontSize:12, textAlign:'center'}}>Me</Text>
                            </View>
                        )
                    }}/>
            </Tab.Navigator>
        )
    }

} 
