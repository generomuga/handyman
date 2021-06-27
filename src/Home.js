import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function HomeTab() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home!</Text>
      </View>
    );
  }
  
function BookTab() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Book!</Text>
        </View>
    );
}

function NotificationTab() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Notification!</Text>
        </View>
    );
}

function MeTab() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Me!</Text>
        </View>
    );
}

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
