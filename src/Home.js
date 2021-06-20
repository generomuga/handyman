import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

import * as firebase from 'firebase';

export default class Home extends Component {

    constructor(props){
        super(props)
    }
    
    render(){
        return (
            <View >
                <Text>Hello</Text>
                <Button title="Sign out" onPress={ () =>
                        firebase.auth().signOut().then(()=>{

                        }).catch((error) =>{

                        })
                    }/>
            </View>

            
        )
    }

}
