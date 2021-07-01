import React, { Component } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    SafeAreaView, 
    Button,
    TouchableOpacity
} from 'react-native';

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

    updateUserDetails() {
        const dbRef = firebase.database().ref();
        const user = firebase.auth().currentUser;
        const userId = user['uid'];

        var updates = {};
        updates['displayName'] = this.state.displayName;

        dbRef.child("users").child(userId).update(updates);

    }

    _onPressButton() {
     
        const {isDisplayNameEditable, buttonLabel } = this.state;

        if (isDisplayNameEditable === 'true') {
            this.setState({isDisplayNameEditable:'false'});
            this.setState({buttonLabel:'Login'});
            this.updateUserDetails();
            
        }
        else {
            this.setState({isDisplayNameEditable:'true'});
            this.setState({buttonLabel:'Save'})
            
        }

    }

    componentDidMount() {
        this.getUserDetails()
    }    

    constructor(props){
        super(props)

        this.state = {
            displayName: '',
            isDisplayNameEditable: 'false',
            buttonLabel: 'Login'
        }

    }

    render(){
        return (
            <SafeAreaView>

                <TextInput 
                    // style={style.textInput} 
                    placeholder='email' 
                    autoCapitalize='none' 
                    value={this.state.displayName}
                    editable={this.state.isDisplayNameEditable}
                    onChangeText={displayName => this.setState({displayName})}
                    />

                <TouchableOpacity 
                    // style={style.touchButton}
                    onPress={()=>this._onPressButton()}
                    >
                    <Text>{this.state.buttonLabel}</Text>
                </TouchableOpacity>

            </SafeAreaView>
        )
    }

}