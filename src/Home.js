import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeTab from './HomeTab';
import BookTab from './BookTab';
import NotificationTab from './NotifcationTab';
import MeTab from './MeTab';

const Tab = createBottomTabNavigator();

export default class Home extends Component {
        
    render(){
        return (
            <Tab.Navigator>
                <Tab.Screen name="Home" component={HomeTab} />
                <Tab.Screen name="Book" component={BookTab} />
                <Tab.Screen name="Notication" component={NotificationTab} />
                <Tab.Screen name="Me" component={MeTab} />
            </Tab.Navigator>
        )
    }

}
