import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeTab from './HomeTab';
// import BookTab from './BookTab';
// import NotificationTab from './NotifcationTab';
import MeTab from './MeTab';

import { Entypo } from '@expo/vector-icons'; 

const Tab = createBottomTabNavigator();

export default function Home () {
        
    return (
        <Tab.Navigator
            tabBarOptions={{
                showLabel:false,
                inactiveTintColor: '#E1F5FE',
                activeTintColor: 'white',
                style: {
                    backgroundColor:'#039BE5'
                },

            }} >

            <Tab.Screen 
                name="Home" 
                component={HomeTab} 
                options={{
                    tabBarIcon: ({focused}) => (
                        <View style={{justifyContent:'center', alignContent:'center', top:2}}>
                            <Entypo name="home" size={24} style={{color:focused?'white':'#B3E5FC',textAlign:'center'}}  />
                            <Text style={{color:focused?'white':'#B3E5FC', fontSize:12, textAlign:'center'}}>Home</Text>
                        </View>
                    )
                }} />

            {/* <Tab.Screen 
                name="Book" 
                component={BookTab} 
                options={{
                    tabBarIcon: ({focused}) => (
                        <View style={{justifyContent:'center', alignContent:'center', top:2}}>
                            <Entypo name="book" size={24} style={{color:focused?'white':'#B3E5FC', textAlign:'center'}}  />
                            <Text style={{color:focused?'white':'#B3E5FC', fontSize:12, textAlign:'center'}}>Book</Text>
                        </View>
                    )
                }} /> */}

            {/* <Tab.Screen 
                name="Notication" 
                component={NotificationTab} 
                options={{
                    tabBarIcon: ({focused}) => (
                        <View style={{justifyContent:'center', alignContent:'center', top:2}}>
                            <Entypo name="notification" size={24} style={{color:focused?'white':'#B3E5FC', textAlign:'center'}}  />
                            <Text style={{color:focused?'white':'#B3E5FC', fontSize:12, textAlign:'center'}}>Notications</Text>
                        </View>
                    )
                }} /> */}

            <Tab.Screen 
                name="Me" 
                component={MeTab} 
                options={{
                    tabBarIcon: ({focused}) => (
                        <View style={{justifyContent:'center', alignContent:'center', top:2}}>
                            <Entypo name="user" size={24} style={{color:focused?'white':'#B3E5FC', textAlign:'center'}}  />
                            <Text style={{color:focused?'white':'#B3E5FC', fontSize:12, textAlign:'center'}}>Me</Text>
                        </View>
                    ) }}/>
                    
        </Tab.Navigator>
    )

} 
