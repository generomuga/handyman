import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/Login';
import Home from './src/Home';

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
                      title: 'Hugefort Handyman', 
                      headerLeft: ()=> null,
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
