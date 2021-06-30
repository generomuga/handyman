import React, { Component } from 'react';
import { View, Text, TextInput, SafeAreaView, Button } from 'react-native';

import * as firebase from 'firebase';

import database from './functions/database';

database.init();

export default class MeTab extends Component {
        
    getUserDetails() {
        
        const dbRef = firebase.database().ref();
        const user = firebase.auth().currentUser;

        const userId = user['uid'];
        console.log(userId);

        dbRef.child("users").child(userId).get().then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              this.setState({displayName:data['displayName']});
            } else {
              console.log("No data available");
            }
          }).catch((error) => {
            console.error(error);
          });
    }

    componentDidMount() {
        this.getUserDetails()
    }    

    constructor(props){
        super(props)

        this.state = {
            displayName: ''
        }

    }

    render(){
        return (
            <View>

                <Text>Nganga</Text>

                <TextInput 
                    // style={style.textInput} 
                    placeholder='email' 
                    autoCapitalize='none' 
                    value={this.state.displayName}
                    onChangeText={displayName => this.setState({displayName})}
                    />

            </View>
        )
    }

}